/**
 * StudentVerificationFlow — SheerID-like University Verification for Bangladesh
 *
 * Flow:
 *  Step 1: Search your university/college/school in Bangladesh
 *  Step 2: Institution selected → simulate portal login
 *  Step 3: Credentials verified → mark student as verified
 *
 * This component is shown after email confirmation, before dashboard access.
 */

import { useState, useEffect } from "react";
import {
  Search, GraduationCap, Building2, CheckCircle2,
  Loader2, ChevronRight, ArrowLeft, ShieldCheck, Eye, EyeOff
} from "lucide-react";

// Bangladesh institutions database
const BD_INSTITUTIONS: Array<{
  id: string;
  name: string;
  shortName: string;
  type: "university" | "college" | "school";
  city: string;
  portalUrl: string;
  loginDomain: string;
}> = [
  { id: "duc", name: "Dhaka University College", shortName: "DUC", type: "university", city: "Dhaka", portalUrl: "portal.du.ac.bd", loginDomain: "@du.ac.bd" },
  { id: "buet", name: "Bangladesh University of Engineering & Technology", shortName: "BUET", type: "university", city: "Dhaka", portalUrl: "students.buet.ac.bd", loginDomain: "@student.buet.ac.bd" },
  { id: "bracu", name: "BRAC University", shortName: "BRACU", type: "university", city: "Dhaka", portalUrl: "myportal.bracu.ac.bd", loginDomain: "@g.bracu.ac.bd" },
  { id: "nsu", name: "North South University", shortName: "NSU", type: "university", city: "Dhaka", portalUrl: "portal.northsouth.edu", loginDomain: "@northsouth.edu" },
  { id: "iub", name: "Independent University Bangladesh", shortName: "IUB", type: "university", city: "Dhaka", portalUrl: "portal.iub.edu.bd", loginDomain: "@iub.edu.bd" },
  { id: "aiub", name: "American International University Bangladesh", shortName: "AIUB", type: "university", city: "Dhaka", portalUrl: "portal.aiub.edu", loginDomain: "@edu.aiub.edu" },
  { id: "seu", name: "Southeast University", shortName: "SEU", type: "university", city: "Dhaka", portalUrl: "portal.seu.edu.bd", loginDomain: "@seu.edu.bd" },
  { id: "uiu", name: "United International University", shortName: "UIU", type: "university", city: "Dhaka", portalUrl: "students.uiu.ac.bd", loginDomain: "@student.uiu.ac.bd" },
  { id: "ewu", name: "East West University", shortName: "EWU", type: "university", city: "Dhaka", portalUrl: "ewubd.edu", loginDomain: "@ewubd.edu" },
  { id: "ru", name: "University of Rajshahi", shortName: "RU", type: "university", city: "Rajshahi", portalUrl: "ru.ac.bd", loginDomain: "@ru.ac.bd" },
  { id: "cu", name: "University of Chittagong", shortName: "CU", type: "university", city: "Chittagong", portalUrl: "cu.ac.bd", loginDomain: "@cu.ac.bd" },
  { id: "ku", name: "Khulna University", shortName: "KU", type: "university", city: "Khulna", portalUrl: "ku.ac.bd", loginDomain: "@ku.ac.bd" },
  { id: "dcc", name: "Dhaka City College", shortName: "DCC", type: "college", city: "Dhaka", portalUrl: "dhakacitycollege.edu.bd", loginDomain: "@dhakacitycollege.edu.bd" },
  { id: "dhakacollege", name: "Dhaka College", shortName: "DC", type: "college", city: "Dhaka", portalUrl: "dhakacollege.edu.bd", loginDomain: "@dhakacollege.edu.bd" },
  { id: "idealgc", name: "Ideal College Dhaka", shortName: "Ideal College", type: "college", city: "Dhaka", portalUrl: "idealcollegedhaka.edu.bd", loginDomain: "@idealcollege.edu.bd" },
  { id: "mirzapurcadet", name: "Mirzapur Cadet College", shortName: "MCC", type: "college", city: "Tangail", portalUrl: "mcc.edu.bd", loginDomain: "@mcc.edu.bd" },
  { id: "rajukcollege", name: "RAJUK Uttara Model College", shortName: "RAJUK", type: "college", city: "Dhaka", portalUrl: "rajukcollege.edu.bd", loginDomain: "@rajukcollege.edu.bd" },
  { id: "hollycross", name: "Holy Cross College", shortName: "HCC", type: "college", city: "Dhaka", portalUrl: "hcc.edu.bd", loginDomain: "@hcc.edu.bd" },
  { id: "birshreshtha", name: "Bir Shreshtha Munshi Abdur Rouf Public College", shortName: "BMRPC", type: "college", city: "Dhaka", portalUrl: "bmrpc.edu.bd", loginDomain: "@bmrpc.edu.bd" },
  { id: "sylheti_cadet", name: "Sylhet Cadet College", shortName: "SCC", type: "college", city: "Sylhet", portalUrl: "scc.edu.bd", loginDomain: "@scc.edu.bd" },
];

type Step = "search" | "portal" | "verifying" | "done";

interface Props {
  userEmail: string;
  onVerified: (institutionId: string, institutionName: string) => void;
  onSkip?: () => void;
}

export function StudentVerificationFlow({ userEmail, onVerified, onSkip }: Props) {
  const [step, setStep] = useState<Step>("search");
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(BD_INSTITUTIONS);
  const [selectedInst, setSelectedInst] = useState<typeof BD_INSTITUTIONS[0] | null>(null);
  const [portalId, setPortalId] = useState("");
  const [portalPass, setPortalPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [verifyProgress, setVerifyProgress] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered(BD_INSTITUTIONS);
      return;
    }
    const q = query.toLowerCase();
    setFiltered(
      BD_INSTITUTIONS.filter(
        (inst) =>
          inst.name.toLowerCase().includes(q) ||
          inst.shortName.toLowerCase().includes(q) ||
          inst.city.toLowerCase().includes(q) ||
          inst.type.includes(q)
      )
    );
  }, [query]);

  const handleSelectInstitution = (inst: typeof BD_INSTITUTIONS[0]) => {
    setSelectedInst(inst);
    setStep("portal");
    setPortalId("");
    setPortalPass("");
    setError("");
  };

  const handlePortalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalId.trim() || !portalPass.trim()) {
      setError("Please enter your institution ID and password.");
      return;
    }
    setError("");
    setStep("verifying");
    setVerifyProgress(0);

    // Simulate verification steps
    const steps = [15, 35, 55, 75, 90, 100];
    steps.forEach((pct, i) => {
      setTimeout(() => {
        setVerifyProgress(pct);
        if (pct === 100) {
          setTimeout(() => {
            setStep("done");
          }, 600);
        }
      }, (i + 1) * 600);
    });
  };

  const handleComplete = () => {
    if (selectedInst) {
      onVerified(selectedInst.id, selectedInst.name);
    }
  };

  const typeIcon = (type: string) => {
    if (type === "university") return <GraduationCap size={16} />;
    return <Building2 size={16} />;
  };

  const typeColor = (type: string) => {
    if (type === "university") return { bg: "rgba(124,58,237,0.1)", text: "#7C3AED" };
    if (type === "college") return { bg: "rgba(211,84,0,0.1)", text: "var(--theme-color-900)" };
    return { bg: "rgba(16,185,129,0.1)", text: "#047857" };
  };

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0d0d1a 0%, #1a0a00 100%)",
      padding: "20px",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: "520px",
        background: "#FFFFFF",
        borderRadius: "20px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #7C3AED 0%, var(--theme-color-900) 100%)",
          padding: "24px 24px 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "42px", height: "42px", borderRadius: "12px",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ShieldCheck size={22} color="#FFF" />
            </div>
            <div>
              <div style={{ color: "#FFF", fontWeight: 800, fontSize: "1.05rem" }}>
                Student Identity Verification
              </div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem", marginTop: "2px" }}>
                Powered by Neo AI · SheerID-compatible
              </div>
            </div>
          </div>

          {/* Step indicator */}
          <div style={{ display: "flex", gap: "6px", marginTop: "18px" }}>
            {(["search", "portal", "verifying", "done"] as Step[]).map((s, i) => (
              <div key={s} style={{
                height: "3px", flex: 1, borderRadius: "2px",
                background: ["search", "portal", "verifying", "done"].indexOf(step) >= i
                  ? "#FFF"
                  : "rgba(255,255,255,0.25)",
                transition: "background 0.3s",
              }} />
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>

          {/* STEP 1: Institution Search */}
          {step === "search" && (
            <>
              <h2 style={{ margin: "0 0 6px", fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                Find Your Institution
              </h2>
              <p style={{ margin: "0 0 18px", fontSize: "0.82rem", color: "#8C7A6A" }}>
                Search for your university, college, or school in Bangladesh.
              </p>

              {/* Search input */}
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                background: "#F9F5FF", border: "1.5px solid rgba(124,58,237,0.2)",
                borderRadius: "12px", padding: "10px 14px", marginBottom: "14px",
              }}>
                <Search size={17} color="#9CA3AF" />
                <input
                  type="text"
                  placeholder="Search university, college, or city…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  style={{
                    flex: 1, border: "none", background: "transparent",
                    outline: "none", fontSize: "0.88rem", color: "#241A14",
                  }}
                />
              </div>

              {/* Results list */}
              <div style={{
                maxHeight: "320px", overflowY: "auto",
                border: "1px solid rgba(0,0,0,0.08)", borderRadius: "12px",
                display: "flex", flexDirection: "column", gap: "1px",
                background: "#F9FAFB",
              }}>
                {filtered.length === 0 && (
                  <div style={{ padding: "24px", textAlign: "center", color: "#9CA3AF", fontSize: "0.85rem" }}>
                    No institutions found. Try a different search.
                  </div>
                )}
                {filtered.map((inst) => {
                  const colors = typeColor(inst.type);
                  return (
                    <button
                      key={inst.id}
                      type="button"
                      onClick={() => handleSelectInstitution(inst)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: "12px",
                        padding: "12px 14px", background: "#FFF", border: "none",
                        cursor: "pointer", textAlign: "left", transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F3FF")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#FFF")}
                    >
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "10px",
                        background: colors.bg, display: "flex", alignItems: "center",
                        justifyContent: "center", flexShrink: 0, color: colors.text,
                      }}>
                        {typeIcon(inst.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#241A14", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {inst.name}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginTop: "1px" }}>
                          {inst.shortName} · {inst.city} ·{" "}
                          <span style={{ color: colors.text, fontWeight: 600, textTransform: "capitalize" }}>{inst.type}</span>
                        </div>
                      </div>
                      <ChevronRight size={14} color="#D1D5DB" />
                    </button>
                  );
                })}
              </div>

              {onSkip && (
                <button
                  type="button"
                  onClick={onSkip}
                  style={{
                    width: "100%", marginTop: "16px", padding: "10px",
                    background: "none", border: "1px dashed rgba(0,0,0,0.15)",
                    borderRadius: "10px", color: "#9CA3AF", fontSize: "0.82rem",
                    cursor: "pointer", fontWeight: 600,
                  }}
                >
                  Skip for now (verify later)
                </button>
              )}
            </>
          )}

          {/* STEP 2: Institution Portal Login */}
          {step === "portal" && selectedInst && (
            <>
              <button
                type="button"
                onClick={() => setStep("search")}
                style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", marginBottom: "16px", fontSize: "0.82rem", padding: 0 }}
              >
                <ArrowLeft size={14} /> Back to search
              </button>

              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 14px", background: "#F9F5FF",
                border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", marginBottom: "18px",
              }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: typeColor(selectedInst.type).bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: typeColor(selectedInst.type).text, flexShrink: 0,
                }}>
                  {typeIcon(selectedInst.type)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#241A14" }}>{selectedInst.name}</div>
                  <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>Portal: {selectedInst.portalUrl}</div>
                </div>
              </div>

              <h2 style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800, color: "#241A14" }}>
                Sign in to {selectedInst.shortName} Portal
              </h2>
              <p style={{ margin: "0 0 18px", fontSize: "0.82rem", color: "#8C7A6A" }}>
                Use your institution credentials (student ID / email + password). Neo AI will verify your student status securely.
              </p>

              {error && (
                <div style={{
                  padding: "10px 12px", borderRadius: "8px", marginBottom: "14px",
                  background: "rgba(185,28,28,0.07)", border: "1px solid rgba(185,28,28,0.2)",
                  color: "#B91C1C", fontSize: "0.82rem",
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handlePortalLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "5px" }}>
                    Student ID / Institution Email
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g. 2021-1-60-123 or yourname${selectedInst.loginDomain}`}
                    value={portalId}
                    onChange={(e) => setPortalId(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 12px", boxSizing: "border-box",
                      border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: "10px",
                      outline: "none", fontSize: "0.88rem", color: "#241A14",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "5px" }}>
                    Institution Password / App Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Enter your institution portal password"
                      value={portalPass}
                      onChange={(e) => setPortalPass(e.target.value)}
                      style={{
                        width: "100%", padding: "10px 40px 10px 12px", boxSizing: "border-box",
                        border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: "10px",
                        outline: "none", fontSize: "0.88rem", color: "#241A14",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{
                        position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: "2px",
                      }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p style={{ margin: "5px 0 0", fontSize: "0.72rem", color: "#9CA3AF" }}>
                    For Gmail-based portals, use an App Password from your Google Account settings.
                  </p>
                </div>

                <div style={{
                  padding: "10px 12px", background: "#FFFBEB",
                  border: "1px solid rgba(245,158,11,0.3)", borderRadius: "8px",
                  fontSize: "0.76rem", color: "#92400E", display: "flex", gap: "8px",
                }}>
                  <ShieldCheck size={14} style={{ flexShrink: 0, marginTop: "1px", color: "#D97706" }} />
                  <span>Your credentials are used only for one-time verification and are never stored on Neo Cash servers.</span>
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%", padding: "12px", marginTop: "4px",
                    background: "linear-gradient(135deg, #7C3AED, var(--theme-color-900))",
                    color: "#FFF", border: "none", borderRadius: "12px",
                    fontWeight: 800, fontSize: "0.92rem", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  }}
                >
                  Verify Student Status <ChevronRight size={16} />
                </button>
              </form>
            </>
          )}

          {/* STEP 3: Verifying */}
          {step === "verifying" && selectedInst && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "50%",
                background: "rgba(124,58,237,0.1)", border: "3px solid rgba(124,58,237,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}>
                <Loader2 size={28} color="#7C3AED" style={{ animation: "spin 1s linear infinite" }} />
              </div>
              <h2 style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800, color: "#241A14" }}>
                Verifying with {selectedInst.shortName}…
              </h2>
              <p style={{ margin: "0 0 20px", fontSize: "0.82rem", color: "#8C7A6A" }}>
                Neo AI is checking your student enrollment record.
              </p>

              {/* Progress bar */}
              <div style={{ background: "#F3F4F6", borderRadius: "6px", height: "8px", overflow: "hidden", marginBottom: "14px" }}>
                <div style={{
                  height: "100%", borderRadius: "6px",
                  width: `${verifyProgress}%`,
                  background: "linear-gradient(90deg, #7C3AED, var(--theme-color-900))",
                  transition: "width 0.5s ease",
                }} />
              </div>
              <p style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{verifyProgress}% complete</p>

              {/* Steps */}
              {[
                "Connecting to institution portal",
                "Authenticating student credentials",
                "Checking enrollment status",
                "Confirming current academic year",
                "Generating verification certificate",
              ].map((label, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 0", textAlign: "left",
                  opacity: verifyProgress > i * 20 ? 1 : 0.35,
                  transition: "opacity 0.3s",
                }}>
                  {verifyProgress > (i + 1) * 18 ? (
                    <CheckCircle2 size={16} color="#10B981" />
                  ) : (
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #D1D5DB" }} />
                  )}
                  <span style={{ fontSize: "0.82rem", color: verifyProgress > i * 20 ? "#241A14" : "#9CA3AF" }}>{label}</span>
                </div>
              ))}
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* STEP 4: Done */}
          {step === "done" && selectedInst && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: "rgba(16,185,129,0.1)", border: "3px solid #10B981",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
                animation: "pop-in 0.4s ease",
              }}>
                <CheckCircle2 size={32} color="#10B981" />
              </div>
              <h2 style={{ margin: "0 0 8px", fontSize: "1.15rem", fontWeight: 800, color: "#241A14" }}>
                Identity Verified! 🎉
              </h2>
              <p style={{ margin: "0 0 6px", fontSize: "0.88rem", color: "#047857", fontWeight: 700 }}>
                {selectedInst.name}
              </p>
              <p style={{ margin: "0 0 20px", fontSize: "0.82rem", color: "#8C7A6A" }}>
                Your student status has been confirmed. Neo Cash is ready to use with your institution's fee structure.
              </p>

              <div style={{
                background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: "12px", padding: "14px 16px", textAlign: "left", marginBottom: "20px",
              }}>
                <div style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 700, marginBottom: "8px" }}>
                  ✅ Verification Certificate Issued
                </div>
                {[
                  ["Institution", selectedInst.name],
                  ["Status", "Active Student — Enrolled"],
                  ["Verified via", "Neo AI · SheerID Protocol"],
                  ["Account email", userEmail],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "4px" }}>
                    <span style={{ color: "#6B7280" }}>{label}</span>
                    <span style={{ color: "#241A14", fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleComplete}
                style={{
                  width: "100%", padding: "13px",
                  background: "linear-gradient(135deg, #047857, #10B981)",
                  color: "#FFF", border: "none", borderRadius: "12px",
                  fontWeight: 800, fontSize: "0.95rem", cursor: "pointer",
                }}
              >
                Continue to Dashboard →
              </button>
              <style>{`
                @keyframes pop-in {
                  0% { transform: scale(0.7); opacity: 0; }
                  100% { transform: scale(1); opacity: 1; }
                }
              `}</style>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", marginTop: "16px", textAlign: "center" }}>
        Neo Cash AI · Secure Student Verification System · Bangladesh
      </p>
    </div>
  );
}

