import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-D02inl6r.js
/**
* Custom authentication storage handler for browser environments.
* Returns standard localStorage when running in standard Web environments.
*/
function brokeredPreviewStorage() {
	if (typeof window === "undefined") return void 0;
	return window.localStorage;
}
/**
* Checks whether the provided Supabase key uses the new opaque API key format.
*/
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
/**
* Custom fetch implementation to correctly attach headers for Supabase API requests.
*/
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
/**
* Initializes and configures the client-side Supabase instance.
*/
function createSupabaseClient() {
	const SUPABASE_URL = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_PROJECT_ID": "pgvjfbgrlbiyucjfpeyf",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_D9E8YXrtHS4l-b4PGsmSyA_UKYbwPdO",
		"VITE_SUPABASE_URL": "https://c--247c2749-bd13-43ca-84ed-2cffa30b2fdf-prod.lovable.cloud"
	}["VITE_SUPABASE_URL"] || process.env["SUPABASE_URL"];
	const SUPABASE_PUBLISHABLE_KEY = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_PROJECT_ID": "pgvjfbgrlbiyucjfpeyf",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_D9E8YXrtHS4l-b4PGsmSyA_UKYbwPdO",
		"VITE_SUPABASE_URL": "https://c--247c2749-bd13-43ca-84ed-2cffa30b2fdf-prod.lovable.cloud"
	}["VITE_SUPABASE_PUBLISHABLE_KEY"] || process.env["SUPABASE_PUBLISHABLE_KEY"];
	if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
		const message = `Missing required Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []].join(", ")}. Please configure them in your environment variables.`;
		console.error(`[Supabase Client] ${message}`);
		throw new Error(message);
	}
	return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		global: { fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY) },
		auth: {
			storage: brokeredPreviewStorage(),
			persistSession: true,
			autoRefreshToken: true
		}
	});
}
var _supabase;
/**
* Supabase Client Singleton Proxy
* Usage: `import { supabase } from "@/integrations/supabase/client";`
*/
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
//#endregion
export { supabase as t };
