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
      }
    } catch {
      user = null;
    }

    return { user: user || { id: "demo-user", email: "demo@neocash.ai" } };
  },
  component: () => <Outlet />,
});
