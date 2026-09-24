import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { enrollBiometric } from "@/lib/biometrics";
import { BiometricPanel } from "@/components/auth/biometric-panel";
import authArt from "@/assets/auth-side-illustration.jpg";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your Neo Cashless account" },
      {
        name: "description",
        content:
          "Register with your e-mail to use Neo Cashless — AI-powered, paperless institutional finance.",
      },
      { property: "og:title", content: "Create your Neo Cashless account" },
      {
        property: "og:description",
        content: "Register in seconds and secure your account with device biometrics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignUpPage,
});

type Errors = Partial<Record<"username" | "email" | "password" | "repeat" | "terms" | "form", string>>;

function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    repeat: "",
    contactMe: false,
    terms: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<"form" | "biometric" | "done">("form");
  const [bioStatus, setBioStatus] = useState<
    { tone: "error" | "success" | "info"; message: string } | null
  >(null);

  const update = (key: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const next: Errors = {};
    if (!form.username.trim()) next.username = "Username is required.";
    else if (form.username.trim().length < 3) next.username = "Use at least 3 characters.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 8) next.password = "Use at least 8 characters.";
    else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password))
      next.password = "Include at least one letter and one number.";
    if (form.repeat !== form.password) next.repeat = "Passwords do not match.";
    if (!form.terms) next.terms = "You must accept the Terms and Conditions.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { username: form.username.trim(), marketing_opt_in: form.contactMe },
      },
    });
    setBusy(false);

    if (error) {
      setErrors({ form: error.message });
      return;
    }
    if (data.user && data.user.identities?.length === 0) {
      setErrors({ email: "An account already exists for this email address." });
      return;
    }
    if (!data.session) {
      setStage("done");
      setBioStatus({
        tone: "info",
        message: "Account created. Confirm your email address, then sign in to finish setup.",
      });
      return;
    }
    setStage("biometric");
  };

  const handleEnroll = async () => {
    setBioStatus({ tone: "info", message: "Waiting for your device…" });
    setBusy(true);
    const result = await enrollBiometric();
    setBusy(false);
    if (!result.ok) {
      setBioStatus({ tone: "error", message: result.error });
      return;
    }
    setBioStatus({ tone: "success", message: "Fingerprint login enabled for this device." });
    setTimeout(() => void navigate({ to: "/dashboard" }), 900);
  };

  return (
    <main className="auth-page">
      <div className="auth-modal auth-modal--page">
        <aside className="auth-art">
          <img src={authArt} alt="" loading="lazy" width={1024} height={1024} />
          <p>Eliminate delays. Eliminate errors. Eliminate cash.</p>
        </aside>

        <div className="auth-form-side">
          {stage === "biometric" ? (
            <BiometricPanel
              title="Set Up Biometric Login"
              instruction="Use your device's biometric authentication for convenient sign-in."
              actionLabel="Enable Fingerprint Login"
              cancelLabel="Skip for Now"
              onScan={handleEnroll}
              onCancel={() => void navigate({ to: "/dashboard" })}
              status={bioStatus}
              busy={busy}
              secondary={{ label: "Skip for Now", onClick: () => void navigate({ to: "/dashboard" }) }}
            />
          ) : stage === "done" ? (
            <div className="auth-form">
              <h1 className="auth-heading">Almost there</h1>
              <p className="auth-status auth-status--info">{bioStatus?.message}</p>
              <button className="auth-primary" type="button" onClick={() => void navigate({ to: "/" })}>
                Back to Neo
              </button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <h1 className="auth-heading auth-heading--sm">Register with your e-mail</h1>

              <Field
                id="username"
                label="USERNAME (*)"
                placeholder="Username"
                value={form.username}
                onChange={(v) => update("username", v)}
                error={errors.username}
                autoComplete="username"
              />
              <Field
                id="email"
                label="EMAIL (*)"
                type="email"
                placeholder="E-mail"
                value={form.email}
                onChange={(v) => update("email", v)}
                error={errors.email}
                autoComplete="email"
              />

              <div className="auth-grid">
                <Field
                  id="password"
                  label="PASSWORD (*)"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(v) => update("password", v)}
                  error={errors.password}
                  autoComplete="new-password"
                />
                <Field
                  id="repeat"
                  label="REPEAT PASSWORD (*)"
                  type="password"
                  placeholder="Repeat Password"
                  value={form.repeat}
                  onChange={(v) => update("repeat", v)}
                  error={errors.repeat}
                  autoComplete="new-password"
                />
              </div>

              <p className="auth-consent">
                Neo may keep me informed with personalized emails about products and services. See our
                Privacy Policy for more details.
              </p>

              <label className="auth-check">
                <input
                  type="checkbox"
                  checked={form.contactMe}
                  onChange={(e) => update("contactMe", e.target.checked)}
                />
                Please contact me via e-mail
              </label>
              <label className="auth-check">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={(e) => update("terms", e.target.checked)}
                  aria-invalid={Boolean(errors.terms)}
                />
                I have read and accept the Terms and Conditions
              </label>
              {errors.terms ? <p className="auth-error">{errors.terms}</p> : null}
              {errors.form ? (
                <p className="auth-status auth-status--error" role="alert">
                  {errors.form}
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
                  onClick={() => void navigate({ to: "/", search: { login: true } })}
                >
                  Back to login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  error?: string | undefined;
  autoComplete?: string;
}) {
  return (
    <div className="auth-field">
      <label className="auth-label auth-label--caps" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="auth-input auth-input--line"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...(autoComplete ? { autoComplete } : {})}
      />
      {error ? (
        <p className="auth-error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
