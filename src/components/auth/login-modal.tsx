import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { signInWithBiometric } from "@/lib/biometrics";
import { BiometricPanel } from "./biometric-panel";
import skeletonArt from "@/assets/skeleton-illustration.png";

/** View modes for the authentication modal dialog */
type View = "login" | "biometric" | "forgot";

/** Status notification message object for user feedback */
type Status = { tone: "error" | "success" | "info"; message: string } | null;

/**
 * Authentication Modal Component
 * Supports Email/Password authentication, Google OAuth 2.0, WebAuthn Biometrics, and Password Reset flow.
 */
export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [resetEmail, setResetEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  // Handle modal open/close lifecycle, scroll locking, and keyboard shortcuts
  useEffect(() => {
    if (!open) return;
    setView("login");
    setStatus(null);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    dialogRef.current?.querySelector<HTMLElement>("input, button")?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  /** Complete login process and redirect user to application dashboard */
  const finishLogin = async () => {
    onClose();
    await navigate({ to: "/dashboard" });
  };

  /** Authenticate user using Email and Password via Supabase */
  const handlePasswordLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    if (!email.trim() || !password) {
      setStatus({ tone: "error", message: "Enter your email and password." });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      setStatus({ tone: "error", message: error.message });
      return;
    }
    if (!remember) sessionStorage.setItem("neo-session-only", "1");
    await finishLogin();
  };

  /** Trigger Google OAuth 2.0 single sign-on redirect via Supabase */
  const handleGoogle = async () => {
    setStatus(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    setBusy(false);
    if (error) {
      setStatus({ tone: "error", message: error.message ?? "Google sign-in failed." });
      return;
    }
  };

  const handleBiometric = async () => {
    setStatus({ tone: "info", message: "Waiting for your device to verify you…" });
    setBusy(true);
    const result = await signInWithBiometric();
    setBusy(false);
    if (!result.ok) {
      setStatus({ tone: "error", message: result.error });
      return;
    }
    setStatus({ tone: "success", message: "Verified. Opening your dashboard…" });
    await finishLogin();
  };

  const handleForgot = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    if (!resetEmail.trim()) {
      setStatus({ tone: "error", message: "Enter your email address." });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    setStatus(
      error
        ? { tone: "error", message: "We could not process that request. Please try again shortly." }
        : {
            tone: "success",
            message:
              "If that address belongs to a Neo account, a password reset link is on its way. The link expires shortly.",
          },
    );
  };

  return (
    <div className="auth-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Login to your Account"
        ref={dialogRef}
      >
        <button type="button" className="auth-close" onClick={onClose} aria-label="Close login">
          ✕
        </button>

        <aside className="auth-art">
          <img src={skeletonArt} alt="Skeleton working on laptop" loading="lazy" width={1024} height={1024} />
        </aside>

        <div className="auth-form-side">
          {view === "biometric" ? (
            <BiometricPanel
              title="Verify your identity using your device"
              instruction="Your device will ask for a fingerprint, face scan or PIN."
              actionLabel="Click the round icon to scan your fingerprint"
              onScan={handleBiometric}
              onCancel={() => {
                setStatus(null);
                setView("login");
              }}
              status={status}
              busy={busy}
              secondary={{ label: "Use email and password instead", onClick: () => setView("login") }}
            />
          ) : view === "forgot" ? (
            <form className="auth-form" onSubmit={handleForgot}>
              <h2 className="auth-heading">Reset your password</h2>
              <p className="auth-subtitle">
                We will email a secure, time-limited reset link to your registered address.
              </p>
              <label className="auth-label" htmlFor="reset-email">
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                className="auth-input"
                placeholder="mail@abc.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                autoComplete="email"
              />
              {status ? (
                <p className={`auth-status auth-status--${status.tone}`} role="status" aria-live="polite">
                  {status.message}
                </p>
              ) : null}
              <button className="auth-primary" type="submit" disabled={busy}>
                {busy ? "Sending…" : "Send reset link"}
              </button>
              <button type="button" className="auth-link-button" onClick={() => setView("login")}>
                Back to login
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handlePasswordLogin}>
              <h2 className="auth-heading">Login to your Account</h2>
              <p className="auth-subtitle">See what is going on with your business</p>

              <button type="button" className="auth-google" onClick={handleGoogle} disabled={busy}>
                <GoogleMark /> Continue with Google
              </button>

              <div className="auth-divider">
                <span>or Sign in with Email</span>
              </div>

              <label className="auth-label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className="auth-input"
                placeholder="mail@abc.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />

              <label className="auth-label" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className="auth-input"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <div className="auth-row">
                <label className="auth-check">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember Me
                </label>
                <button type="button" className="auth-inline-link" onClick={() => setView("forgot")}>
                  Forgot Password?
                </button>
              </div>

              {status ? (
                <p className={`auth-status auth-status--${status.tone}`} role="status" aria-live="polite">
                  {status.message}
                </p>
              ) : null}

              <button
                type="button"
                className="auth-primary"
                onClick={() => {
                  setStatus(null);
                  setView("biometric");
                }}
                disabled={busy}
              >
                Biometric Login
              </button>
              <button className="auth-primary" type="submit" disabled={busy}>
                {busy ? "Signing in…" : "Login"}
              </button>

              <p className="auth-footer">
                Not Registered Yet?{" "}
                <button
                  type="button"
                  className="auth-inline-link"
                  onClick={() => {
                    onClose();
                    void navigate({ to: "/signup" });
                  }}
                >
                  Create an account
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.4c-.5 2.9-2.2 5.4-4.7 7l7.6 5.9c4.4-4.1 6.8-10.1 6.8-17.2Z" />
      <path fill="#FBBC05" d="M10.4 28.7a14.5 14.5 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6l7.8-6.1Z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.4 0-11.7-3.7-13.6-9.1l-7.8 6.1C6.5 42.6 14.6 48 24 48Z" />
    </svg>
  );
}
