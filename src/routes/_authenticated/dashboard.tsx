import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const Route = createFileRoute("/_authenticated/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Neo Cash AI — Role-Based Financial Ecosystem Dashboard" },
      { name: "description", content: "Professional Student, Admin, and Executive Head financial operations platform." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /** Handle user session sign out */
  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/", replace: true });
  };

  return <DashboardShell onSignOut={handleSignOut} />;
}
