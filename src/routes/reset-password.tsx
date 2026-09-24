import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Choose a new Neo Cashless password" },
      { name: "description", content: "Set a new password for your Neo Cashless account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [status, setStatus] = useState<{ tone: "error" | "success"; message: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      setStatus({ tone: "error", message: "Use at least 8 characters." });
      return;
    }
    if (password !== repeat) {
      setStatus({ tone: "error", message: "Passwords do not match." });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setStatus({ tone: "error", message: error.message });
      return;
    }
    setStatus({ tone: "success", message: "Password updated. Taking you to your dashboard…" });
    setTimeout(() => void navigate({ to: "/dashboard" }), 900);
  };

  return (
    <main className="auth-page">
      <ThemeToggle className="standalone-theme-toggle" />
      <div className="auth-modal auth-modal--single">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1 className="auth-heading">Choose a new password</h1>
          <p className="auth-subtitle">This link is single-use and time limited.</p>

          <label className="auth-label" htmlFor="new-password">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          <label className="auth-label" htmlFor="repeat-password">
            Repeat password
          </label>
          <input
            id="repeat-password"
            type="password"
            className="auth-input"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            autoComplete="new-password"
          />

          {status ? (
            <p className={`auth-status auth-status--${status.tone}`} role="status" aria-live="polite">
              {status.message}
            </p>
          ) : null}

          <button className="auth-primary" type="submit" disabled={busy}>
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </main>
  );
}
