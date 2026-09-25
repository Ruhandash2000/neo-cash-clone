import { c as createServerFn, i as TSS_SERVER_FUNCTION, u as getRequest } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DDbSEn2v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/webauthn.functions-CQNkfkZo.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
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
var RP_NAME = "Neo Cashless";
var BIOMETRIC_UNAVAILABLE = "Biometric sign-in is temporarily unavailable. Please use your email and password.";
function getRelyingParty() {
	const request = getRequest();
	const url = new URL(request.url);
	const forwardedHost = request.headers.get("x-forwarded-host");
	const forwardedProto = request.headers.get("x-forwarded-proto");
	const host = forwardedHost ?? request.headers.get("host") ?? url.host;
	const protocol = forwardedProto ?? url.protocol.replace(":", "");
	return {
		rpID: host.split(":")[0],
		origin: `${protocol}://${host}`
	};
}
async function admin() {
	const { supabaseAdmin } = await import("./client.server-w_bs2RLM.mjs");
	return supabaseAdmin;
}
function toBase64Url(bytes) {
	return Buffer.from(bytes).toString("base64url");
}
function fromBase64Url(value) {
	return new Uint8Array(Buffer.from(value, "base64url"));
}
async function storeChallenge(input) {
	await (await admin()).from("webauthn_challenges").insert({
		challenge: input.challenge,
		purpose: input.purpose,
		user_id: input.userId ?? null
	});
}
async function consumeChallenge(challenge, purpose) {
	const db = await admin();
	const { data } = await db.from("webauthn_challenges").select("id, expires_at, consumed, user_id").eq("challenge", challenge).eq("purpose", purpose).maybeSingle();
	if (!data || data.consumed || new Date(data.expires_at).getTime() < Date.now()) return null;
	await db.from("webauthn_challenges").update({ consumed: true }).eq("id", data.id);
	return data;
}
var getRegistrationOptions_createServerFn_handler = createServerRpc({
	id: "ad008b5beb0e3146d1f027ac462de652efffb5b8ed2bc6970c04e82d3a26b959",
	name: "getRegistrationOptions",
	filename: "src/lib/webauthn.functions.ts"
}, (opts) => getRegistrationOptions.__executeServer(opts));
var getRegistrationOptions = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getRegistrationOptions_createServerFn_handler, async ({ context }) => {
	try {
		const { generateRegistrationOptions } = await import("../_libs/@simplewebauthn/server+[...].mjs").then((n) => n.t);
		const { rpID } = getRelyingParty();
		const { data: existing } = await (await admin()).from("webauthn_credentials").select("credential_id, transports").eq("user_id", context.userId);
		const email = context.claims?.email ?? "neo user";
		const options = await generateRegistrationOptions({
			rpName: RP_NAME,
			rpID,
			userID: fromBase64Url(Buffer.from(context.userId).toString("base64url")),
			userName: email,
			userDisplayName: email,
			attestationType: "none",
			excludeCredentials: (existing ?? []).map((credential) => ({
				id: credential.credential_id,
				transports: credential.transports
			})),
			authenticatorSelection: {
				residentKey: "preferred",
				userVerification: "preferred"
			}
		});
		await storeChallenge({
			challenge: options.challenge,
			purpose: "registration",
			userId: context.userId
		});
		return {
			optionsJSON: JSON.stringify(options),
			error: null
		};
	} catch (error) {
		console.error("Unable to create biometric registration options", error);
		return {
			optionsJSON: null,
			error: BIOMETRIC_UNAVAILABLE
		};
	}
});
var verifyRegistration_createServerFn_handler = createServerRpc({
	id: "04d43b1cd407453775af6ced02c300b2399eff568b164d312d347b511aae64fe",
	name: "verifyRegistration",
	filename: "src/lib/webauthn.functions.ts"
}, (opts) => verifyRegistration.__executeServer(opts));
var verifyRegistration = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(verifyRegistration_createServerFn_handler, async ({ data, context }) => {
	const { verifyRegistrationResponse } = await import("../_libs/@simplewebauthn/server+[...].mjs").then((n) => n.t);
	const { rpID, origin } = getRelyingParty();
	const stored = await consumeChallenge(data.challenge, "registration");
	if (!stored || stored.user_id !== context.userId) return {
		verified: false,
		error: "This enrollment request expired. Please try again."
	};
	let verification;
	try {
		verification = await verifyRegistrationResponse({
			response: data.response,
			expectedChallenge: data.challenge,
			expectedOrigin: origin,
			expectedRPID: rpID,
			requireUserVerification: false
		});
	} catch (error) {
		return {
			verified: false,
			error: error.message
		};
	}
	if (!verification.verified || !verification.registrationInfo) return {
		verified: false,
		error: "The device response could not be verified."
	};
	const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;
	const { error } = await (await admin()).from("webauthn_credentials").insert({
		user_id: context.userId,
		credential_id: credential.id,
		public_key: toBase64Url(credential.publicKey),
		counter: credential.counter,
		transports: credential.transports ?? [],
		device_type: credentialDeviceType,
		backed_up: credentialBackedUp
	});
	if (error) return {
		verified: false,
		error: "This device is already registered."
	};
	return { verified: true };
});
var getAuthenticationOptions_createServerFn_handler = createServerRpc({
	id: "cb5a48406579ee5876029687a8351eb9dd9f53848373200eb2d4a5fbbec5ee8c",
	name: "getAuthenticationOptions",
	filename: "src/lib/webauthn.functions.ts"
}, (opts) => getAuthenticationOptions.__executeServer(opts));
var getAuthenticationOptions = createServerFn({ method: "POST" }).handler(getAuthenticationOptions_createServerFn_handler, async () => {
	try {
		const { generateAuthenticationOptions } = await import("../_libs/@simplewebauthn/server+[...].mjs").then((n) => n.t);
		const { rpID } = getRelyingParty();
		const options = await generateAuthenticationOptions({
			rpID,
			userVerification: "preferred"
		});
		await storeChallenge({
			challenge: options.challenge,
			purpose: "authentication"
		});
		return {
			optionsJSON: JSON.stringify(options),
			error: null
		};
	} catch (error) {
		console.error("Unable to create biometric authentication options", error);
		return {
			optionsJSON: null,
			error: BIOMETRIC_UNAVAILABLE
		};
	}
});
var verifyAuthentication_createServerFn_handler = createServerRpc({
	id: "4471db3c21b6427956eb3ef20c9ec71159361a17721d611c0f20cb823d84a724",
	name: "verifyAuthentication",
	filename: "src/lib/webauthn.functions.ts"
}, (opts) => verifyAuthentication.__executeServer(opts));
var verifyAuthentication = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(verifyAuthentication_createServerFn_handler, async ({ data }) => {
	const { verifyAuthenticationResponse } = await import("../_libs/@simplewebauthn/server+[...].mjs").then((n) => n.t);
	const { rpID, origin } = getRelyingParty();
	if (!await consumeChallenge(data.challenge, "authentication")) return {
		verified: false,
		error: "This sign-in request expired. Please try again."
	};
	const assertion = data.response;
	const db = await admin();
	const { data: credential } = await db.from("webauthn_credentials").select("*").eq("credential_id", assertion.id).maybeSingle();
	if (!credential) return {
		verified: false,
		error: "This device is not registered with Neo."
	};
	let verification;
	try {
		verification = await verifyAuthenticationResponse({
			response: data.response,
			expectedChallenge: data.challenge,
			expectedOrigin: origin,
			expectedRPID: rpID,
			requireUserVerification: false,
			credential: {
				id: credential.credential_id,
				publicKey: fromBase64Url(credential.public_key),
				counter: Number(credential.counter),
				transports: credential.transports ?? []
			}
		});
	} catch (error) {
		return {
			verified: false,
			error: error.message
		};
	}
	if (!verification.verified) return {
		verified: false,
		error: "Device verification failed."
	};
	const newCounter = verification.authenticationInfo.newCounter;
	if (Number(credential.counter) > 0 && newCounter <= Number(credential.counter)) return {
		verified: false,
		error: "Possible cloned authenticator detected."
	};
	await db.from("webauthn_credentials").update({
		counter: newCounter,
		last_used_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", credential.id);
	const { data: userData } = await db.auth.admin.getUserById(credential.user_id);
	const email = userData.user?.email;
	if (!email) return {
		verified: false,
		error: "Account is missing an email address."
	};
	const { data: link, error: linkError } = await db.auth.admin.generateLink({
		type: "magiclink",
		email
	});
	if (linkError || !link.properties?.hashed_token) return {
		verified: false,
		error: "Could not start a session. Please try again."
	};
	const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
	const { data: session, error: otpError } = await createClient(process.env["SUPABASE_URL"], process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"], { auth: {
		persistSession: false,
		autoRefreshToken: false
	} }).auth.verifyOtp({
		type: "email",
		token_hash: link.properties.hashed_token
	});
	if (otpError || !session.session) return {
		verified: false,
		error: "Could not start a session. Please try again."
	};
	return {
		verified: true,
		accessToken: session.session.access_token,
		refreshToken: session.session.refresh_token
	};
});
var listMyCredentials_createServerFn_handler = createServerRpc({
	id: "463c9c27919d708dba2c38828632ebd1a8339a7a196d4be0c09c901910d10664",
	name: "listMyCredentials",
	filename: "src/lib/webauthn.functions.ts"
}, (opts) => listMyCredentials.__executeServer(opts));
var listMyCredentials = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listMyCredentials_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.from("webauthn_credentials").select("id, created_at, last_used_at, device_type").eq("user_id", context.userId);
	return data ?? [];
});
//#endregion
export { getAuthenticationOptions_createServerFn_handler, getRegistrationOptions_createServerFn_handler, listMyCredentials_createServerFn_handler, verifyAuthentication_createServerFn_handler, verifyRegistration_createServerFn_handler };
