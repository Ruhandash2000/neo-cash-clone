import dns from 'dns/promises';

async function checkDomains() {
  const domains = [
    "pgvjfbgrlbiyucjfpeyf.supabase.co",
    "nrtwnvsejfilgkcpzum.supabase.co",
    "c--247c2749-bd13-43ca-84ed-2cffa30b2fdf-prod.lovable.cloud"
  ];

  for (const d of domains) {
    try {
      const addrs = await dns.lookup(d);
      console.log(`DOMAIN OK: ${d} -> ${addrs.address}`);
    } catch (e) {
      console.log(`DOMAIN FAILED: ${d} -> ${e.message}`);
    }
  }
}

checkDomains();
