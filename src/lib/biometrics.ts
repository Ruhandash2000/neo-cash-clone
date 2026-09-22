import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable,
} from "@simplewebauthn/browser";

import { supabase } from "@/integrations/supabase/client";
import {
  getAuthenticationOptions,
  getRegistrationOptions,
  verifyAuthentication,
  verifyRegistration,
} from "./webauthn.functions";

export type BiometricResult = { ok: true } | { ok: false; error: string; cancelled?: boolean };

export async function biometricsAvailable() {
  if (typeof window === "undefined" || !browserSupportsWebAuthn()) return false;
  try {
    return await platformAuthenticatorIsAvailable();
  } catch {
    return false;
  }
}

function describe(error: unknown): BiometricResult {
  const err = error as { name?: string; message?: string };
  if (err?.name === "NotAllowedError" || err?.name === "AbortError") {
    return { ok: false, cancelled: true, error: "Verification was cancelled on your device." };
  }
  return { ok: false, error: err?.message ?? "Your device could not complete the request." };
}

/** Enroll the signed-in account's device authenticator (passkey / fingerprint). */
export async function enrollBiometric(): Promise<BiometricResult> {
  if (!browserSupportsWebAuthn()) {
    return { ok: false, error: "This browser does not support device authentication." };
  }
  try {
    const options = (await getRegistrationOptions()) as unknown as Parameters<
      typeof startRegistration
    >[0]["optionsJSON"];
    const attestation = await startRegistration({ optionsJSON: options });
    const result = await verifyRegistration({
      data: { response: attestation, challenge: options.challenge },
    });
    return result.verified ? { ok: true } : { ok: false, error: result.error ?? "Enrollment failed." };
  } catch (error) {
    return describe(error);
  }
}

/** Sign in with a registered device authenticator; the server verifies the assertion. */
export async function signInWithBiometric(): Promise<BiometricResult> {
  if (!browserSupportsWebAuthn()) {
    return { ok: false, error: "This browser does not support device authentication." };
  }
  try {
    const options = (await getAuthenticationOptions()) as unknown as Parameters<
      typeof startAuthentication
    >[0]["optionsJSON"];
    const assertion = await startAuthentication({ optionsJSON: options });
    const result = await verifyAuthentication({
      data: { response: assertion, challenge: options.challenge },
    });
    if (!result.verified) return { ok: false, error: result.error ?? "Verification failed." };

    const { error } = await supabase.auth.setSession({
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (error) {
    return describe(error);
  }
}
