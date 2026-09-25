import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { brokeredPreviewStorage } from './previewAuthStorage';

/**
 * Checks whether the provided Supabase key uses the new opaque API key format.
 */
function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

/**
 * Custom fetch implementation to correctly attach headers for Supabase API requests.
 */
function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    // Opaque API keys are handled as apikey headers rather than bearer JWTs
    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

/**
 * Initializes and configures the Supabase client instance with graceful SSR fallbacks.
 */
function createSupabaseClient() {
  const SUPABASE_URL =
    import.meta.env['VITE_SUPABASE_URL'] ||
    (typeof process !== 'undefined' ? process.env['SUPABASE_URL'] : undefined) ||
    'https://placeholder.supabase.co';

  const SUPABASE_PUBLISHABLE_KEY =
    import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] ||
    (typeof process !== 'undefined' ? process.env['SUPABASE_PUBLISHABLE_KEY'] : undefined) ||
    'placeholder-publishable-key';

  const isServer = typeof window === 'undefined';

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
    },
    auth: {
      storage: brokeredPreviewStorage(),
      persistSession: !isServer,
      autoRefreshToken: !isServer,
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

/**
 * Supabase Client Singleton Proxy
 * Usage: `import { supabase } from "@/integrations/supabase/client";`
 */
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
