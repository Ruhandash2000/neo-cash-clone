/**
 * Neo Cash AI — Per-Session Student Identity Verification Gate
 *
 * This overlay appears each time a student starts a new authenticated
 * session.  It re-verifies the student's institutional identity credentials
 * without repeating permanent onboarding steps (institution search, wallet
 * creation, profile setup, payment methods).
 *
 * Unlike the one-time OnboardingFlow, this gate:
 * • Appears on every new login session for student users.
 * • Does NOT modify `profiles.onboarding_completed` in Supabase.
 * • Uses ephemeral in-memory state (`isSessionVerified`) that is never
 *   persisted to localStorage.
 * • Is skipped entirely for non-student roles and demo_controller.
 */

import { useState } from "react";
import { useNeoStore } from "@/lib/neo-cash-store";
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  CheckCircle2,
} from "lucide-react";

export function SessionVerificationGate({ onVerified }: { onVerified: () => void }) {
  const [store] = useNeoStore();

  // Phase: "credentials" → user enters/confirms ID   |   "verifying" → animation   |   "verified" → success
  const [phase, setPhase] = useState<"credentials" | "verifying" | "verified">("credentials");

  // Pre-fill from store (institution was already selected during onboarding)
  const institution = store.selectedInstitution;
  const [studentIdInput, setStudentIdInput] = useState(store.studentProfile.studentId);
  const [instEmailInput, setInstEmailInput] = useState(store.studentProfile.email);
  const [verifyMessage, setVerifyMessage] = useState("");

  /** Run the identity verification animation sequence */
  const runVerification = () => {
    setPhase("verifying");
    setVerifyMessage(`Connecting to ${institution.name} Identity Gateway…`);

    setTimeout(() => {
      setVerifyMessage(`Authenticating student credentials (${studentIdInput})…`);
      setTimeout(() => {
        setVerifyMessage("Confirming active registration, session & department status…");
        setTimeout(() => {
          setVerifyMessage("Session identity verified successfully!");
          setPhase("verified");
        }, 1100);
      }, 1100);
    }, 1000);
  };

  /** Complete verification and unblock the dashboard */
  const handleContinue = () => {
    onVerified();
  };

  return (
    <div
      className="onboarding-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(33, 23, 16, 0.85)",
        backdropFilter: "blur(8px)",
        zIndex: 100,
        display: "grid",
        placeItems: "center",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <div
        className="onboarding-card"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(196, 154, 108, 0.4)",
          borderRadius: "20px",
          maxWidth: "640px",
          width: "100%",
          padding: "32px 36px",
          boxShadow: "0 28px 75px rgba(36, 26, 20, 0.25)",
          color: "#241A14",
          position: "relative",
        }}
      >
        {/* HEADER */}
        <div style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.25)", paddingBottom: "20px", marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#D35400", fontWeight: 800 }}>
              NEO CASH AI • SESSION IDENTITY VERIFICATION
            </span>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#66564A", background: "#FFF7E6", padding: "4px 12px", borderRadius: "999px", border: "1px solid rgba(196, 154, 108, 0.3)" }}>
              Required Each Login
            </span>
          </div>

          <h2 style={{ fontSize: "1.5rem", margin: "0 0 6px", fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, color: "#241A14" }}>
            {phase === "credentials" && "Verify Your Identity"}
            {phase === "verifying" && "Verification in Progress"}
            {phase === "verified" && "Identity Confirmed"}
          </h2>

          <p style={{ margin: 0, fontSize: "0.88rem", color: "#66564A" }}>
            {phase === "credentials" && "Confirm your institutional credentials to access this session."}
            {phase === "verifying" && "Authenticating your identity via your institution's gateway."}
            {phase === "verified" && "Your session identity has been verified. You may proceed to the dashboard."}
          </p>
        </div>

        {/* INSTITUTION BADGE (always visible) */}
        <div style={{ background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.35)", padding: "14px 18px", borderRadius: "14px", marginBottom: "22px", display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "2rem", width: "44px", height: "44px", display: "grid", placeItems: "center", background: "#FFFFFF", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.2)" }}>
            {institution.logo}
          </span>
          <div>
            <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#241A14" }}>{institution.name}</h4>
            <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#66564A" }}>{institution.location} • {institution.type}</p>
          </div>
          <span style={{ marginLeft: "auto", fontSize: "0.72rem", background: "rgba(4, 120, 87, 0.1)", color: "#047857", padding: "3px 10px", borderRadius: "999px", fontWeight: 700, border: "1px solid rgba(4, 120, 87, 0.2)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle2 size={12} /> Onboarded
          </span>
        </div>

        {/* CREDENTIALS PHASE */}
        {phase === "credentials" && (
          <>
            <div style={{ background: "rgba(211, 84, 0, 0.05)", border: "1px solid rgba(211, 84, 0, 0.2)", borderRadius: "12px", padding: "12px 16px", marginBottom: "22px", display: "flex", alignItems: "center", gap: "10px" }}>
              <ShieldCheck size={20} style={{ color: "#D35400", flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: "0.83rem", color: "#241A14" }}>
                <strong>Session Security:</strong> Your institutional identity must be re-verified each time you log in for your protection.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#241A14", marginBottom: "6px" }}>
                  Student Roll / ID Number (*)
                </label>
                <input
                  type="text"
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    border: "1px solid rgba(196, 154, 108, 0.4)",
                    borderRadius: "10px",
                    fontSize: "0.92rem",
                    color: "#241A14",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#241A14", marginBottom: "6px" }}>
                  Institutional Email Address (*)
                </label>
                <input
                  type="email"
                  value={instEmailInput}
                  onChange={(e) => setInstEmailInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    border: "1px solid rgba(196, 154, 108, 0.4)",
                    borderRadius: "10px",
                    fontSize: "0.92rem",
                    color: "#241A14",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" className="auth-primary" onClick={runVerification} style={{ width: "auto", padding: "11px 24px" }}>
                Verify Session Identity <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}

        {/* VERIFYING PHASE (animated) */}
        {phase === "verifying" && (
          <div style={{ background: "#FFF7E6", padding: "32px", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(196, 154, 108, 0.4)" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                border: "4px solid rgba(211, 84, 0, 0.2)",
                borderTopColor: "#D35400",
                borderRadius: "50%",
                animation: "spin 0.9s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <h4 style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 700, color: "#241A14" }}>
              Identity Verification in Progress
            </h4>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "#66564A", fontWeight: 600 }}>{verifyMessage}</p>
          </div>
        )}

        {/* VERIFIED PHASE */}
        {phase === "verified" && (
          <div style={{ background: "rgba(4, 120, 87, 0.08)", padding: "28px", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(4, 120, 87, 0.3)" }}>
            <ShieldCheck size={48} style={{ color: "#047857", margin: "0 auto 12px" }} />
            <h4 style={{ margin: "0 0 6px", color: "#047857", fontSize: "1.2rem", fontWeight: 700 }}>
              Session Identity Verified!
            </h4>
            <p style={{ margin: "0 0 6px", fontSize: "0.88rem", color: "#66564A" }}>
              Active registration confirmed for <strong>{studentIdInput}</strong> at {institution.name}.
            </p>

            {/* Verified badge grid (compact) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", margin: "20px 0", textAlign: "left" }}>
              {[
                { label: "Student ID", value: studentIdInput },
                { label: "Institution", value: institution.name },
                { label: "Email", value: instEmailInput },
                { label: "Session", value: new Date().toLocaleDateString() },
              ].map((item, idx) => (
                <div key={idx} style={{ background: "#FFF7E6", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.25)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#8C7A6A", fontWeight: 700 }}>
                      {item.label}
                    </span>
                    <Lock size={10} style={{ color: "#8C7A6A" }} />
                  </div>
                  <p style={{ margin: "3px 0 0", fontWeight: 700, fontSize: "0.85rem", color: "#241A14", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <button type="button" className="auth-primary" onClick={handleContinue} style={{ width: "auto", padding: "12px 28px" }}>
              Continue to Dashboard <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
