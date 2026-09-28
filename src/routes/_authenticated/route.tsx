import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    let user = null;
    try {
      if (typeof window !== "undefined") {
        const { data } = await supabase.auth.getUser();
        user = data?.user || null;

        // Fallback: Check local store for active session user (demo or authenticated session)
        if (!user) {
          const rawStore = localStorage.getItem("neo_cash_state_v1") || localStorage.getItem("neo_cash_store");
          if (rawStore) {
            try {
              const parsed = JSON.parse(rawStore);
              if (parsed?.currentSessionUser || parsed?.role) {
                user = parsed.currentSessionUser || { id: "demo-user", email: "demo@neocash.ai" };
              }
            } catch {
              // Ignore parse error
            }
          }
        }
      }
    } catch {
      user = null;
    }

    if (!user) {
      throw redirect({ to: "/", search: { login: true } });
    }

    return { user };
  },
  component: () => <Outlet />,
});
