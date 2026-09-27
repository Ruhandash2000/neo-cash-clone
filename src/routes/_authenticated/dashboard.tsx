import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useNeoStore } from "@/lib/neo-cash-store";
import { DEMO_ACCOUNTS, DEMO_ACCOUNT_PASSWORDS } from "@/lib/demo-auth";

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
  const [store, actions] = useNeoStore();
  const [showDemoController, setShowDemoController] = useState(false);

  useEffect(() => {
    const loadAuthenticatedProfile = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, username, full_name, role, institution_id, is_demo_user, onboarding_completed")
        .eq("id", authData.user.id)
        .single();
      if (!profile || !["student", "admin", "head", "demo_controller"].includes(profile.role)) return;
      actions.activateSessionUser({
        id: profile.id,
        userId: profile.username,
        email: authData.user.email ?? "",
        fullName: profile.full_name || profile.username,
        role: profile.role as "student" | "admin" | "head" | "demo_controller",
        institutionId: profile.institution_id || "",
        institutionName: profile.institution_id || "Dhaka City College",
        isDemoUser: profile.is_demo_user,
      });
      actions.setIsOnboarded(profile.role !== "student" || profile.onboarding_completed);
      setShowDemoController(profile.role === "demo_controller");
    };
    void loadAuthenticatedProfile();
  }, [actions]);

  const handleStudentOnboardingComplete = async () => {
    const user = store.currentSessionUser;
    if (!user || user.role !== "student") return;

    const { error } = await supabase.rpc("complete_student_onboarding", {
      selected_institution_id: store.selectedInstitution.name,
    });
    if (error) return;

    actions.setIsOnboarded(true);
  };

  const handleDemoAccountSwitch = async (accountId: string) => {
    const account = DEMO_ACCOUNTS.find((candidate) => candidate.id === accountId);
    const password = DEMO_ACCOUNT_PASSWORDS[accountId];
    if (!account || !password || account.role === "demo_controller") return;

    await queryClient.cancelQueries();
    queryClient.clear();
    actions.clearSessionUser();
    await supabase.auth.signOut();
    const { error } = await supabase.auth.signInWithPassword({ email: account.email, password });
    if (error) throw new Error(`Unable to start ${account.fullName}'s demo session. Provision this demo user in Supabase Auth first.`);
    await navigate({ to: "/dashboard", replace: true });
  };

  /** Handle user session sign out */
  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    actions.clearSessionUser();
    await navigate({ to: "/", replace: true });
  };

  return (
    <DashboardShell
      onSignOut={handleSignOut}
      onStudentOnboardingComplete={handleStudentOnboardingComplete}
      onDemoAccountSwitch={handleDemoAccountSwitch}
      showDemoController={showDemoController}
    />
  );
}
