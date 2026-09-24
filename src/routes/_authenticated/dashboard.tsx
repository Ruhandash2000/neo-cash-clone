import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { enrollBiometric } from "@/lib/biometrics";
import { listMyCredentials } from "@/lib/webauthn.functions";
import purpleLogo from "@/assets/neo-purple-logo.png.asset.json";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Neo Cashless dashboard" },
      { name: "description", content: "Manage your Neo Cashless account and sign-in devices." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);

  const credentials = useQuery({
    queryKey: ["webauthn-credentials"],
    queryFn: () => listMyCredentials(),
  });

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/", replace: true });
  };

  const handleEnroll = async () => {
    setMessage("Waiting for your device…");
    const result = await enrollBiometric();
    setMessage(result.ok ? "Fingerprint login enabled for this device." : result.error);
    if (result.ok) void credentials.refetch();
  };

  return (
    <main className="dash">
      <header className="dash-header">
        <img src={purpleLogo.url} alt="Neo" className="dash-logo" />
        <div className="dash-actions">
          <ThemeToggle />
          <button type="button" className="dash-signout" onClick={handleSignOut}>
            Logout
          </button>
        </div>
      </header>

      <section className="dash-body">
        <h1>Welcome back{user?.email ? `, ${user.email}` : ""}</h1>
        <p className="dash-lead">
          No paperwork. No queues. No cash. Your Neo workspace is ready — account balances, approvals
          and transaction reporting land here as they are rolled out.
        </p>

        <div className="dash-cards">
          <article className="dash-card">
            <h2>Account</h2>
            <p>{user?.email}</p>
            <p className="dash-muted">Signed in securely through Neo Cashless.</p>
          </article>
          <article className="dash-card">
            <h2>Biometric sign-in</h2>
            <p>
              {credentials.isLoading
                ? "Checking…"
                : credentials.data && credentials.data.length > 0
                  ? `${credentials.data.length} device${credentials.data.length > 1 ? "s" : ""} registered.`
                  : "No device registered yet."}
            </p>
            <button type="button" className="auth-primary dash-enroll" onClick={handleEnroll}>
              Enable Fingerprint Login
            </button>
            {message ? (
              <p className="dash-muted" role="status" aria-live="polite">
                {message}
              </p>
            ) : null}
          </article>
        </div>
      </section>
    </main>
  );
}
