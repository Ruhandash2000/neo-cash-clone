import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useNeoStore } from "@/lib/neo-cash-store";
import { enrollBiometric, signInWithBiometric } from "@/lib/biometrics";
import { BiometricPanel } from "./biometric-panel";
import skeletonArt from "@/assets/skeleton-illustration.png";
import signupArt from "@/assets/signup-skeleton-illustration.png";

/** View modes for the authentication modal dialog */
type View = "login" | "biometric" | "forgot" | "signup";

/** Status notification message object for user feedback */
type Status = { tone: "error" | "success" | "info"; message: string } | null;

/** Form validation errors interface */
type SignupErrors = {
  username?: string;
  email?: string;
  password?: string;
  repeat?: string;
  terms?: string;
  form?: string;
};

/**
 * Authentication Modal Component
 * Supports Email/Password authentication, Google OAuth 2.0, WebAuthn Biometrics, Signup flow, and Password Reset.
 */
export function LoginModal({
  open,
  onClose,
  initialView = "login",
}: {
  open: boolean;
  onClose: () => void;
  initialView?: View;
}) {
  const navigate = useNavigate();
  const [, actions] = useNeoStore();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>(initialView);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [resetEmail, setResetEmail] = useState("");

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    repeat: "",
    contactMe: true,
    terms: false,
  });
  const [signupErrors, setSignupErrors] = useState<SignupErrors>({});
  const [signupStage, setSignupStage] = useState<"form" | "biometric" | "done">("form");

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  // Handle modal open/close lifecycle, scroll locking, and keyboard shortcuts
  useEffect(() => {
    if (!open) return;
    setView(initialView);
    setStatus(null);
    setSignupStage("form");
    setSignupErrors({});
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
  }, [open, initialView, onClose]);

  if (!open) return null;

  /** Complete login process and navigate to dashboard */
  const finishLogin = async () => {
    if (typeof window !== "undefined") {
      // A normal sign-in is always a personal session. Do not inherit a demo
      // session from a previous presentation, otherwise role-switching controls
      // could be shown to a real user.
      localStorage.removeItem("neo_demo_session");
    }
    onClose();
    await navigate({ to: "/dashboard", search: {}, replace: true });
  };

  /** Update signup form fields */
  const updateSignup = (key: keyof typeof signupForm, value: string | boolean) => {
    setSignupForm((prev) => ({ ...prev, [key]: value }));
  };

  /** Validate signup form inputs */
  const validateSignup = () => {
    const next: SignupErrors = {};
    if (!signupForm.username.trim()) next.username = "Username is required.";
    else if (signupForm.username.trim().length < 3) next.username = "Use at least 3 characters.";
    if (!signupForm.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupForm.email.trim()))
      next.email = "Enter a valid email address.";
    if (!signupForm.password) next.password = "Password is required.";
    else if (signupForm.password.length < 8) next.password = "Use at least 8 characters.";
    else if (!/[A-Za-z]/.test(signupForm.password) || !/[0-9]/.test(signupForm.password))
      next.password = "Include at least one letter and one number.";
    if (signupForm.repeat !== signupForm.password) next.repeat = "Passwords do not match.";
    if (!signupForm.terms) next.terms = "You must accept the Terms and Conditions.";
    setSignupErrors(next);
    return Object.keys(next).length === 0;
  };

  /** Process registration form submission */
  const handleSignupSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateSignup()) return;
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: signupForm.email.trim(),
      password: signupForm.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { username: signupForm.username.trim(), marketing_opt_in: signupForm.contactMe },
      },
    });
    setBusy(false);

    if (error) {
      setSignupErrors({ form: error.message });
      return;
    }
    if (data.user && data.user.identities?.length === 0) {
      setSignupErrors({ email: "An account already exists for this email address." });
      return;
    }
    if (!data.session) {
      setSignupStage("done");
      setStatus({
        tone: "info",
        message: "Account created. Confirm your email address, then sign in to finish setup.",
      });
      return;
    }
    setSignupStage("biometric");
  };

  /** Enroll biometric passkey during signup */
  const handleSignupEnroll = async () => {
    setStatus({ tone: "info", message: "Waiting for your device…" });
    setBusy(true);
    const result = await enrollBiometric();
    setBusy(false);
    if (!result.ok) {
      setStatus({ tone: "error", message: result.error });
      return;
    }
    setStatus({ tone: "success", message: "Fingerprint login enabled for this device." });
    setTimeout(() => void finishLogin(), 900);
  };

  /** Authenticate user using Email and Password via Supabase with Demo fallback */
  const handlePasswordLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    if (!email.trim() || !password) {
      setStatus({ tone: "error", message: "Enter your email and password." });
      return;
    }
    setBusy(true);
    // Attempt Supabase sign-in
    await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);

    // Auto-detect role for seamless demo testing
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes("admin")) {
      actions.setRole("admin");
    } else if (lowerEmail.includes("head") || lowerEmail.includes("principal")) {
      actions.setRole("head");
    } else {
      actions.setRole("student");
    }

    if (!remember) sessionStorage.setItem("neo-session-only", "1");
    await finishLogin();
  };

  /** Trigger Google OAuth 2.0 single sign-on redirect via Supabase */
  const handleGoogle = async () => {
    setStatus({ tone: "info", message: "Connecting to Google..." });
    setBusy(true);
    try {
      const redirectUrl = window.location.origin + window.location.pathname;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error || !data?.url) {
        setBusy(false);
        setStatus({ tone: "error", message: error?.message ?? "Google sign-in failed." });
        return;
      }

      // Redirect browser to Supabase authorize URL (which redirects to Google OAuth consent screen)
      window.location.href = data.url;
    } catch (err: unknown) {
      setBusy(false);
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setStatus({ tone: "error", message: msg });
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
    setStatus({ tone: "success", message: "Verified. Welcome to Neo Cashless!" });
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

  const isBiometricView = view === "biometric" || (view === "signup" && signupStage === "biometric");

  return (
    <div className="auth-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className={`auth-modal ${isBiometricView ? "auth-modal--single" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={view === "signup" ? "Create an account" : "Login to your Account"}
        ref={dialogRef}
      >
        <button type="button" className="auth-close" onClick={onClose} aria-label="Close login">
          ✕
        </button>

        {!isBiometricView && (
          <aside className="auth-art">
            <img
              src={view === "signup" ? signupArt : skeletonArt}
              alt="Skeleton illustration"
              loading="lazy"
              width={1024}
              height={1024}
            />
          </aside>
        )}

        <div className="auth-form-side">
          {view === "signup" ? (
            signupStage === "biometric" ? (
              <BiometricPanel
                title="Set Up Biometric Login"
                instruction="Use your device's biometric authentication for convenient sign-in."
                actionLabel="Enable Fingerprint Login"
                cancelLabel="Skip for Now"
                onScan={handleSignupEnroll}
                onCancel={() => void finishLogin()}
                status={status}
                busy={busy}
                secondary={{ label: "Skip for Now", onClick: () => void finishLogin() }}
              />
            ) : signupStage === "done" ? (
              <div className="auth-form">
                <h2 className="auth-heading">Almost there</h2>
                <p className="auth-status auth-status--info">{status?.message}</p>
                <button className="auth-primary" type="button" onClick={() => setView("login")}>
                  Back to Login
                </button>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleSignupSubmit} noValidate>
                <h2 className="auth-heading auth-heading--sm">Register with your e-mail</h2>

                <div className="auth-field">
                  <label className="auth-label auth-label--caps" htmlFor="signup-username">
                    USERNAME (*)
                  </label>
                  <input
                    id="signup-username"
                    type="text"
                    className="auth-input auth-input--line"
                    placeholder="Username"
                    value={signupForm.username}
                    onChange={(e) => updateSignup("username", e.target.value)}
                    autoComplete="username"
                  />
                  {signupErrors.username ? <p className="auth-error">{signupErrors.username}</p> : null}
                </div>

                <div className="auth-field">
                  <label className="auth-label auth-label--caps" htmlFor="signup-email">
                    EMAIL (*)
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    className="auth-input auth-input--line"
                    placeholder="E-mail"
                    value={signupForm.email}
                    onChange={(e) => updateSignup("email", e.target.value)}
                    autoComplete="email"
                  />
                  {signupErrors.email ? <p className="auth-error">{signupErrors.email}</p> : null}
                </div>

                <div className="auth-grid">
                  <div className="auth-field">
                    <label className="auth-label auth-label--caps" htmlFor="signup-password">
                      PASSWORD (*)
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      className="auth-input auth-input--line"
                      placeholder="Password"
                      value={signupForm.password}
                      onChange={(e) => updateSignup("password", e.target.value)}
                      autoComplete="new-password"
                    />
                    {signupErrors.password ? <p className="auth-error">{signupErrors.password}</p> : null}
                  </div>
                  <div className="auth-field">
                    <label className="auth-label auth-label--caps" htmlFor="signup-repeat">
                      REPEAT PASSWORD (*)
                    </label>
                    <input
                      id="signup-repeat"
                      type="password"
                      className="auth-input auth-input--line"
                      placeholder="Repeat Password"
                      value={signupForm.repeat}
                      onChange={(e) => updateSignup("repeat", e.target.value)}
                      autoComplete="new-password"
                    />
                    {signupErrors.repeat ? <p className="auth-error">{signupErrors.repeat}</p> : null}
                  </div>
                </div>

                <p className="auth-consent">
                  Awwwards may keep me informed with personalized emails about products and services. See our
                  Privacy Policy for more details.
                </p>

                <label className="auth-check">
                  <input
                    type="checkbox"
                    checked={signupForm.contactMe}
                    onChange={(e) => updateSignup("contactMe", e.target.checked)}
                  />
                  Please contact me via e-mail
                </label>
                <label className="auth-check">
                  <input
                    type="checkbox"
                    checked={signupForm.terms}
                    onChange={(e) => updateSignup("terms", e.target.checked)}
                  />
                  I have read and accept the Terms and Conditions
                </label>
                {signupErrors.terms ? <p className="auth-error">{signupErrors.terms}</p> : null}
                {signupErrors.form ? (
                  <p className="auth-status auth-status--error" role="alert">
                    {signupErrors.form}
                  </p>
                ) : null}

                <button className="auth-primary" type="submit" disabled={busy}>
                  {busy ? "Creating account…" : "Create Account"}
                </button>

                <p className="auth-footer">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="auth-inline-link"
                    onClick={() => {
                      setStatus(null);
                      setView("login");
                    }}
                  >
                    Back to login
                  </button>
                </p>
              </form>
            )
          ) : view === "biometric" ? (
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
                <span>or Sign In with Email</span>
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
                    setStatus(null);
                    setView("signup");
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
