import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://c--247c2749-bd13-43ca-84ed-2cffa30b2fdf-prod.lovable.cloud";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_D9E8YXrtHS4l-b4PGsmSyA_UKYbwPdO";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testCors() {
  const redirectUrl = "https://neo-cash-clone.sp2khb.workers.dev/";
  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectUrl, skipBrowserRedirect: true },
  });

  if (data?.url) {
    const res = await fetch(data.url, { method: 'GET', redirect: 'manual' });
    console.log("CORS header:", res.headers.get('access-control-allow-origin'));
    console.log("Status:", res.status);
  }
}

testCors();
