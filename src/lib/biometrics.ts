/**
 * WebAuthn Biometric Authentication Module
 * Manages device passkey registration (enrollment) and biometric sign-in (TouchID / FaceID / PIN).
 */

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

/** Return type for WebAuthn biometric operations */
export type BiometricResult = { ok: true } | { ok: false; error: string; cancelled?: boolean };

/**
 * Checks whether WebAuthn biometric authentication is supported by the current browser and device hardware.
 */
export async function biometricsAvailable(): Promise<boolean> {
  if (typeof window === "undefined" || !browserSupportsWebAuthn()) return false;
  try {
    return await platformAuthenticatorIsAvailable();
  } catch {
    return false;
  }
}

/** Formats WebAuthn exception errors into user-friendly status responses */
function describe(error: unknown): BiometricResult {
  const err = error as { name?: string; message?: string };
  if (err?.name === "NotAllowedError" || err?.name === "AbortError") {
    return { ok: false, cancelled: true, error: "Verification was cancelled on your device." };
  }
  return { ok: false, error: err?.message ?? "Your device could not complete the request." };
}

/**
 * Registers the user's device authenticator (passkey / fingerprint) for biometric login.
 */
export async function enrollBiometric(): Promise<BiometricResult> {
  if (!browserSupportsWebAuthn()) {
    return { ok: false, error: "This browser does not support device authentication." };
  }
  try {
    const { optionsJSON } = await getRegistrationOptions();
    if (!optionsJSON) {
      return { ok: false, error: "Biometric sign-in is temporarily unavailable. Please use your email and password." };
    }
    const options = JSON.parse(optionsJSON) as Parameters<typeof startRegistration>[0]["optionsJSON"];
    const attestation = await startRegistration({ optionsJSON: options });
    const result = await verifyRegistration({
      data: { response: attestation, challenge: options.challenge },
    });
    return result.verified ? { ok: true } : { ok: false, error: result.error ?? "Enrollment failed." };
  } catch (error) {
    return describe(error);
  }
}

/**
 * Authenticates the user using a registered biometric device (Fingerprint / FaceID / Hardware PIN).
 */
export async function signInWithBiometric(): Promise<BiometricResult> {
  if (!browserSupportsWebAuthn()) {
    return { ok: false, error: "This browser does not support device authentication." };
  }
  try {
    const { optionsJSON } = await getAuthenticationOptions();
    if (!optionsJSON) {
      return { ok: false, error: "Biometric sign-in is temporarily unavailable. Please use your email and password." };
    }
    const options = JSON.parse(optionsJSON) as Parameters<typeof startAuthentication>[0]["optionsJSON"];
    const assertion = await startAuthentication({ optionsJSON: options });
    const result = await verifyAuthentication({
      data: { response: assertion, challenge: options.challenge },
    });
    if (!result.verified) return { ok: false, error: result.error ?? "Verification failed." };

    // Establish Supabase auth session using returned tokens
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
