import { t as supabase } from "./client-D02inl6r.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BFFE07zL.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-YwyYNcbU.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DDbSEn2v.mjs";
import { i as browserSupportsWebAuthn, n as startAuthentication, r as startRegistration, t as platformAuthenticatorIsAvailable } from "../_libs/simplewebauthn__browser.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/biometrics-M3pCeLJi.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* WebAuthn (passkey / fingerprint) server endpoints.
*
* The server never sees or stores a fingerprint image or biometric template.
* It only stores the public key + credential id produced by the device's
* authenticator, and verifies signatures with @simplewebauthn/server.
*/
var getRegistrationOptions = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("ad008b5beb0e3146d1f027ac462de652efffb5b8ed2bc6970c04e82d3a26b959"));
var verifyRegistration = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSsrRpc("04d43b1cd407453775af6ced02c300b2399eff568b164d312d347b511aae64fe"));
var getAuthenticationOptions = createServerFn({ method: "POST" }).handler(createSsrRpc("cb5a48406579ee5876029687a8351eb9dd9f53848373200eb2d4a5fbbec5ee8c"));
var verifyAuthentication = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("4471db3c21b6427956eb3ef20c9ec71159361a17721d611c0f20cb823d84a724"));
var listMyCredentials = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("463c9c27919d708dba2c38828632ebd1a8339a7a196d4be0c09c901910d10664"));
/**
* WebAuthn Biometric Authentication Module
* Manages device passkey registration (enrollment) and biometric sign-in (TouchID / FaceID / PIN).
*/
/**
* Checks whether WebAuthn biometric authentication is supported by the current browser and device hardware.
*/
async function biometricsAvailable() {
	if (typeof window === "undefined" || !browserSupportsWebAuthn()) return false;
	try {
		return await platformAuthenticatorIsAvailable();
	} catch {
		return false;
	}
}
/** Formats WebAuthn exception errors into user-friendly status responses */
function describe(error) {
	const err = error;
	if (err?.name === "NotAllowedError" || err?.name === "AbortError") return {
		ok: false,
		cancelled: true,
		error: "Verification was cancelled on your device."
	};
	return {
		ok: false,
		error: err?.message ?? "Your device could not complete the request."
	};
}
/**
* Registers the user's device authenticator (passkey / fingerprint) for biometric login.
*/
async function enrollBiometric() {
	if (!browserSupportsWebAuthn()) return {
		ok: false,
		error: "This browser does not support device authentication."
	};
	try {
		const { optionsJSON } = await getRegistrationOptions();
		if (!optionsJSON) return {
			ok: false,
			error: "Biometric sign-in is temporarily unavailable. Please use your email and password."
		};
		const options = JSON.parse(optionsJSON);
		const result = await verifyRegistration({ data: {
			response: await startRegistration({ optionsJSON: options }),
			challenge: options.challenge
		} });
		return result.verified ? { ok: true } : {
			ok: false,
			error: result.error ?? "Enrollment failed."
		};
	} catch (error) {
		return describe(error);
	}
}
/**
* Authenticates the user using a registered biometric device (Fingerprint / FaceID / Hardware PIN).
*/
async function signInWithBiometric() {
	if (!browserSupportsWebAuthn()) return {
		ok: false,
		error: "This browser does not support device authentication."
	};
	try {
		const { optionsJSON } = await getAuthenticationOptions();
		if (!optionsJSON) return {
			ok: false,
			error: "Biometric sign-in is temporarily unavailable. Please use your email and password."
		};
		const options = JSON.parse(optionsJSON);
		const result = await verifyAuthentication({ data: {
			response: await startAuthentication({ optionsJSON: options }),
			challenge: options.challenge
		} });
		if (!result.verified) return {
			ok: false,
			error: result.error ?? "Verification failed."
		};
		const { error } = await supabase.auth.setSession({
			access_token: result.accessToken,
			refresh_token: result.refreshToken
		});
		if (error) return {
			ok: false,
			error: error.message
		};
		return { ok: true };
	} catch (error) {
		return describe(error);
	}
}
//#endregion
export { signInWithBiometric as i, enrollBiometric as n, listMyCredentials as r, biometricsAvailable as t };
