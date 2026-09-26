import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nxxlezllkpqsmqnrrlyg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Tk4UcoPGSmr_nu9BsQBjGw_Jk5mBWb9";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testOAuthNxx() {
  console.log("Testing nxxlezllkpqsmqnrrlyg URL:", SUPABASE_URL);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://neo-cash-clone.sp2khb.workers.dev/',
      skipBrowserRedirect: true,
    },
  });

  if (error || !data?.url) {
    console.log("OAuth Error:", error);
    return;
  }

  console.log("Returned OAuth URL:", data.url);
  const res = await fetch(data.url, { method: 'GET', redirect: 'manual' });
  console.log("Fetch Status:", res.status);
  console.log("Redirect Location Header:", res.headers.get('location'));
  const text = await res.text().catch(() => '');
  console.log("Body snippet:", text.slice(0, 300));
}

testOAuthNxx();
