import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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
  const [showDemoController, setShowDemoController] = useState(false);

  useEffect(() => {
    // Demo controls are opt-in. Personal users never receive this flag during
    // login, so they cannot see or use role-switching controls.
    setShowDemoController(window.localStorage.getItem("neo_demo_session") === "true");
  }, []);

  /** Handle user session sign out */
  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    window.localStorage.removeItem("neo_demo_session");
    await navigate({ to: "/", replace: true });
  };

  return <DashboardShell onSignOut={handleSignOut} showDemoController={showDemoController} />;
}
