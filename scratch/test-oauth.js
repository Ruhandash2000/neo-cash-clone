import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://c--247c2749-bd13-43ca-84ed-2cffa30b2fdf-prod.lovable.cloud";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_dQtpRrk6h5pKRZaStUYD_g_B7U2YY7B";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testLovableWithNewKey() {
  console.log("Testing Lovable Proxy with new key:", SUPABASE_URL);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://ruhandash2000.github.io/neo-cash-clone/',
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

testLovableWithNewKey();
