import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * WebAuthn (passkey / fingerprint) server endpoints.
 *
 * The server never sees or stores a fingerprint image or biometric template.
 * It only stores the public key + credential id produced by the device's
 * authenticator, and verifies signatures with @simplewebauthn/server.
 */

const RP_NAME = "Neo Cashless";

function getRelyingParty() {
  const request = getRequest();
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const host = forwardedHost ?? request.headers.get("host") ?? url.host;
  const protocol = forwardedProto ?? url.protocol.replace(":", "");
  const rpID = host.split(":")[0]!;
  return { rpID, origin: `${protocol}://${host}` };
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function toBase64Url(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64url");
}

function fromBase64Url(value: string) {
  return new Uint8Array(Buffer.from(value, "base64url"));
}

async function storeChallenge(input: {
  challenge: string;
  purpose: "registration" | "authentication";
  userId?: string | null;
}) {
  const db = await admin();
  await db.from("webauthn_challenges").insert({
    challenge: input.challenge,
    purpose: input.purpose,
    user_id: input.userId ?? null,
  });
}

async function consumeChallenge(challenge: string, purpose: string) {
  const db = await admin();
  const { data } = await db
    .from("webauthn_challenges")
    .select("id, expires_at, consumed, user_id")
    .eq("challenge", challenge)
    .eq("purpose", purpose)
    .maybeSingle();

  if (!data || data.consumed || new Date(data.expires_at).getTime() < Date.now()) return null;
  await db.from("webauthn_challenges").update({ consumed: true }).eq("id", data.id);
  return data;
}

/* ------------------------------ registration ----------------------------- */

export const getRegistrationOptions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { generateRegistrationOptions } = await import("@simplewebauthn/server");
    const { rpID } = getRelyingParty();
    const db = await admin();

    const { data: existing } = await db
      .from("webauthn_credentials")
      .select("credential_id, transports")
      .eq("user_id", context.userId);

    const email = (context.claims as { email?: string })?.email ?? "neo user";

    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID,
      userID: fromBase64Url(Buffer.from(context.userId).toString("base64url")),
      userName: email,
      userDisplayName: email,
      attestationType: "none",
      excludeCredentials: (existing ?? []).map((credential) => ({
        id: credential.credential_id,
        transports: credential.transports as never,
      })),
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
    });

    await storeChallenge({
      challenge: options.challenge,
      purpose: "registration",
      userId: context.userId,
    });

    return JSON.parse(JSON.stringify(options)) as Record<string, unknown>;
  });

export const verifyRegistration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { response: unknown; challenge: string }) => data)
  .handler(async ({ data, context }) => {
    const { verifyRegistrationResponse } = await import("@simplewebauthn/server");
    const { rpID, origin } = getRelyingParty();

    const stored = await consumeChallenge(data.challenge, "registration");
    if (!stored || stored.user_id !== context.userId) {
      return { verified: false, error: "This enrollment request expired. Please try again." };
    }

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: data.response as never,
        expectedChallenge: data.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        requireUserVerification: false,
      });
    } catch (error) {
      return { verified: false, error: (error as Error).message };
    }

    if (!verification.verified || !verification.registrationInfo) {
      return { verified: false, error: "The device response could not be verified." };
    }

    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;
    const db = await admin();
    const { error } = await db.from("webauthn_credentials").insert({
      user_id: context.userId,
      credential_id: credential.id,
      public_key: toBase64Url(credential.publicKey),
      counter: credential.counter,
      transports: credential.transports ?? [],
      device_type: credentialDeviceType,
      backed_up: credentialBackedUp,
    });
    if (error) return { verified: false, error: "This device is already registered." };

    return { verified: true };
  });

/* ---------------------------- authentication ----------------------------- */

export const getAuthenticationOptions = createServerFn({ method: "POST" }).handler(async () => {
  const { generateAuthenticationOptions } = await import("@simplewebauthn/server");
  const { rpID } = getRelyingParty();

  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "preferred",
  });

  await storeChallenge({ challenge: options.challenge, purpose: "authentication" });
  return JSON.parse(JSON.stringify(options)) as Record<string, unknown>;
});

export const verifyAuthentication = createServerFn({ method: "POST" })
  .inputValidator((data: { response: unknown; challenge: string }) => data)
  .handler(async ({ data }) => {
    const { verifyAuthenticationResponse } = await import("@simplewebauthn/server");
    const { rpID, origin } = getRelyingParty();

    const stored = await consumeChallenge(data.challenge, "authentication");
    if (!stored) {
      return { verified: false as const, error: "This sign-in request expired. Please try again." };
    }

    const assertion = data.response as { id: string };
    const db = await admin();
    const { data: credential } = await db
      .from("webauthn_credentials")
      .select("*")
      .eq("credential_id", assertion.id)
      .maybeSingle();

    if (!credential) {
      return { verified: false as const, error: "This device is not registered with Neo." };
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: data.response as never,
        expectedChallenge: data.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        requireUserVerification: false,
        credential: {
          id: credential.credential_id,
          publicKey: fromBase64Url(credential.public_key),
          counter: Number(credential.counter),
          transports: (credential.transports ?? []) as never,
        },
      });
    } catch (error) {
      return { verified: false as const, error: (error as Error).message };
    }

    if (!verification.verified) {
      return { verified: false as const, error: "Device verification failed." };
    }

    const newCounter = verification.authenticationInfo.newCounter;
    // Authenticators that report a counter must be strictly increasing; a
    // counter that stays at 0 means the authenticator does not implement it.
    if (Number(credential.counter) > 0 && newCounter <= Number(credential.counter)) {
      return { verified: false as const, error: "Possible cloned authenticator detected." };
    }

    await db
      .from("webauthn_credentials")
      .update({ counter: newCounter, last_used_at: new Date().toISOString() })
      .eq("id", credential.id);

    // Mint a real Supabase session for the verified account.
    const { data: userData } = await db.auth.admin.getUserById(credential.user_id);
    const email = userData.user?.email;
    if (!email) return { verified: false as const, error: "Account is missing an email address." };

    const { data: link, error: linkError } = await db.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkError || !link.properties?.hashed_token) {
      return { verified: false as const, error: "Could not start a session. Please try again." };
    }

    const { createClient } = await import("@supabase/supabase-js");
    const publicClient = createClient(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"]!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data: session, error: otpError } = await publicClient.auth.verifyOtp({
      type: "email",
      token_hash: link.properties.hashed_token,
    });
    if (otpError || !session.session) {
      return { verified: false as const, error: "Could not start a session. Please try again." };
    }

    return {
      verified: true as const,
      accessToken: session.session.access_token,
      refreshToken: session.session.refresh_token,
    };
  });

export const listMyCredentials = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("webauthn_credentials")
      .select("id, created_at, last_used_at, device_type")
      .eq("user_id", context.userId);
    return data ?? [];
  });
