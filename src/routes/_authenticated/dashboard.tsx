import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useNeoStore } from "@/lib/neo-cash-store";
import { DEMO_ACCOUNTS, DEMO_ACCOUNT_PASSWORDS } from "@/lib/demo-auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    payment:  (search["payment"]  as string | undefined) ?? undefined,
    tran_id:  (search["tran_id"]  as string | undefined) ?? undefined,
    purpose:  (search["purpose"]  as string | undefined) ?? undefined,
  }),
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
  const search = useSearch({ from: "/_authenticated/dashboard" });

  // ── Payment result: show toast + update local balance ───────────────────
  useEffect(() => {
    if (!search.payment) return;

    const handlePaymentReturn = async () => {
      if (search.payment === "success") {
        // Try to fetch the actual amount from the SSLCommerz session in DB
        let paidAmount = 0;
        let sessionPurpose = search.purpose ?? "fee_payment";
        let feeId: string | null = null;

        if (search.tran_id) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: session } = await (supabase as any)
              .from("sslcommerz_sessions")
              .select("amount, purpose, fee_id, status")
              .eq("tran_id", search.tran_id)
              .maybeSingle();

            if (session) {
              paidAmount     = Number(session.amount) || 0;
              sessionPurpose = session.purpose ?? sessionPurpose;
              feeId          = session.fee_id ?? null;
            }
          } catch { /* network/table error — fall through */ }
        }

        // Update the local store based on what was paid
        if (sessionPurpose === "wallet_topup" && paidAmount > 0) {
          actions.topUpWallet(paidAmount, "SSLCommerz");
        } else if (sessionPurpose === "fee_payment" && feeId) {
          // Mark the fee paid in the local store if the action exists
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (actions as any).markFeePaid?.(feeId, paidAmount);
          // Also reflect the payment in wallet (balance deducted by gateway)
        }

        const amountStr = paidAmount > 0 ? ` · ৳${paidAmount.toLocaleString("en-BD")}` : "";
        const msg = sessionPurpose === "wallet_topup"
          ? `Wallet topped up successfully!${amountStr} 🎉`
          : `Fee payment confirmed!${amountStr} ✅`;
        toast.success(msg, {
          description: search.tran_id ? `Ref: ${search.tran_id}` : undefined,
          duration: 6000,
        });

      } else if (search.payment === "failed") {
        toast.error("Payment failed", {
          description: "The payment was not completed. Please try again.",
          duration: 6000,
        });
      } else if (search.payment === "cancelled") {
        toast.info("Payment cancelled", {
          description: "You cancelled the payment. No charge was made.",
          duration: 5000,
        });
      }

      // Clean URL
      void navigate({
        to: "/dashboard",
        search: { payment: undefined, tran_id: undefined, purpose: undefined },
        replace: true,
      });
    };

    void handlePaymentReturn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadAuthenticatedProfile = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: profileRaw } = await supabase
          .from("profiles")
          .select("id, username, full_name, role, institution_id, is_demo_user, onboarding_completed")
          .eq("id", authData.user.id)
          .single();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const profile = profileRaw as any;
        if (profile && ["student", "admin", "head", "demo_controller"].includes(profile.role)) {
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

          // Session verification state is ephemeral and managed in-memory.
          // We intentionally do NOT auto-set isSessionVerified here so that
          // every new page load / login requires re-verification for students.
          // The value is already `false` by default (INITIAL_STATE) and is
          // never persisted to localStorage.

          setShowDemoController(profile.role === "demo_controller");
          return;
        }
      }

      if (store.currentSessionUser) {
        setShowDemoController(store.currentSessionUser.role === "demo_controller");
      }
    };
    void loadAuthenticatedProfile();
  }, [actions, store.currentSessionUser]);

  const handleStudentOnboardingComplete = async () => {
    const user = store.currentSessionUser;
    if (!user || user.role !== "student") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.rpc as any)("complete_student_onboarding", {
      selected_institution_id: store.selectedInstitution.name,
    });
    if (error) return;

    actions.setIsOnboarded(true);
    // Completing onboarding includes identity verification, so also mark
    // the current session as verified to avoid showing the gate immediately
    // after onboarding finishes.
    actions.setSessionVerified(true);
  };

  /** Mark the current login session as identity-verified */
  const handleSessionVerified = () => {
    actions.setSessionVerified(true);
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
    await navigate({ to: "/dashboard", search: { payment: undefined, tran_id: undefined, purpose: undefined }, replace: true });
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

