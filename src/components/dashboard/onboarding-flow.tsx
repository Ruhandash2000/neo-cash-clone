/**
 * Student Onboarding Flow Component
 * 
 * Step 1: Institution Search (Dhaka City College, University of Dhaka, etc.)
 * Step 2: Realistic SSO Institution Verification sequence
 * Step 3: Verified Profile Confirmation ("Verified by Dhaka City College")
 * Step 4: Wallet Setup (bKash, Rocket, Visa, Mastercard)
 * Step 5: Finish & Enter Student Dashboard
 */

import { useState } from "react";
import { useNeoStore } from "@/lib/neo-cash-store";
import { Search, CheckCircle2, ShieldCheck, CreditCard, ArrowRight, Building2, Sparkles, AlertCircle } from "lucide-react";

const INSTITUTION_DATABASE = [
  { name: "Dhaka City College", type: "Collegiate University", location: "Dhanmondi, Dhaka", logo: "🏛️", verified: true },
  { name: "University of Dhaka", type: "Public Research University", location: "Nilkhet, Dhaka", logo: "🎓", verified: true },
  { name: "Dhaka College", type: "Government College", location: "New Market, Dhaka", logo: "🏫", verified: true },
  { name: "Eden Mohila College", type: "Government Women's College", location: "Azimpur, Dhaka", logo: "👩‍🎓", verified: true },
  { name: "Government Titumir College", type: "Government College", location: "Mohakhali, Dhaka", logo: "📚", verified: true },
  { name: "BUET (Bangladesh Univ of Eng & Tech)", type: "Engineering University", location: "Palashi, Dhaka", logo: "⚙️", verified: true },
  { name: "North South University", type: "Private University", location: "Bashundhara, Dhaka", logo: "🌐", verified: true },
];

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [store, actions] = useNeoStore();
  const [step, setStep] = useState(1); // 1: Search, 2: SSO Verify, 3: Profile, 4: Wallet
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInst, setSelectedInst] = useState(INSTITUTION_DATABASE[0]);

  // SSO Verification loading simulation
  const [verifying, setVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifiedDone, setVerifiedDone] = useState(false);

  // Selected payment method for wallet setup
  const [selectedMethod, setSelectedMethod] = useState("bkash");

  const filteredInstitutions = INSTITUTION_DATABASE.filter(
    (inst) =>
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startSSO = (inst: typeof INSTITUTION_DATABASE[0]) => {
    setSelectedInst(inst);
    actions.setSelectedInstitution(inst);
    setStep(2);
    setVerifying(true);
    setVerifiedDone(false);

    // Realistic SSO step sequence
    setVerifyMessage("Connecting to " + inst.name + " Identity Server…");
    setTimeout(() => {
      setVerifyMessage("Authenticating student credentials via SSO…");
      setTimeout(() => {
        setVerifyMessage("Verifying active enrollment & department records…");
        setTimeout(() => {
          setVerifyMessage("Identity Verified! Syncing student profile…");
          setVerifying(false);
          setVerifiedDone(true);
        }, 1200);
      }, 1200);
    }, 1000);
  };

  const handleFinishOnboarding = () => {
    actions.setIsOnboarded(true);
    onComplete();
  };

  return (
    <div className="ms-modal-overlay">
      <div className="ms-modal" style={{ maxWidth: "680px" }}>
        {/* Step Progress Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", borderBottom: "1px solid var(--ms-border)", paddingBottom: "16px" }}>
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ms-accent)", fontWeight: "700" }}>
              Student Onboarding • Step {step} of 4
            </span>
            <h2 style={{ fontSize: "1.3rem", margin: "4px 0 0", color: "#FFF" }}>
              {step === 1 && "Find Your Institution"}
              {step === 2 && "Institutional Identity Verification"}
              {step === 3 && "Verified Student Profile"}
              {step === 4 && "Set Up Neo Wallet"}
            </h2>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: "28px",
                  height: "6px",
                  borderRadius: "999px",
                  background: i <= step ? "var(--ms-primary)" : "rgba(255,255,255,0.1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: INSTITUTION SEARCH */}
        {step === 1 && (
          <div>
            <p style={{ color: "var(--ms-text-muted)", fontSize: "0.9rem", marginBottom: "16px" }}>
              Search and select your school, college, or university to connect your academic account.
            </p>

            <div style={{ position: "relative", marginBottom: "20px" }}>
              <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--ms-text-muted)" }} />
              <input
                type="text"
                placeholder="Search by institution name, city, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  background: "rgba(30, 58, 138, 0.3)",
                  border: "1px solid var(--ms-border)",
                  borderRadius: "12px",
                  color: "#FFF",
                  outline: "none",
                  fontSize: "0.95rem",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "320px", overflowY: "auto" }}>
              {filteredInstitutions.map((inst, index) => (
                <div
                  key={index}
                  onClick={() => startSSO(inst)}
                  className="ms-card-hover"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    background: "rgba(30, 58, 138, 0.2)",
                    border: "1px solid var(--ms-border)",
                    borderRadius: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ fontSize: "1.8rem" }}>{inst.logo}</span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <h4 style={{ margin: 0, color: "#FFF", fontSize: "1rem" }}>{inst.name}</h4>
                        {inst.verified && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "0.72rem", background: "rgba(16, 185, 129, 0.15)", color: "#34D399", padding: "2px 8px", borderRadius: "999px" }}>
                            <CheckCircle2 size={12} /> Verified
                          </span>
                        )}
                      </div>
                      <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: "var(--ms-text-muted)" }}>
                        {inst.type} • {inst.location}
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={18} style={{ color: "var(--ms-accent)" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: SSO VERIFICATION */}
        {step === 2 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>{selectedInst?.logo || "🏛️"}</div>
            <h3 style={{ fontSize: "1.25rem", color: "#FFF", margin: "0 0 8px" }}>{selectedInst?.name || "Institution"}</h3>
            <p style={{ color: "var(--ms-text-muted)", fontSize: "0.9rem", marginBottom: "24px" }}>
              Secure Single Sign-On (SSO) & Student Record Sync
            </p>
            {verifying ? (
              <div style={{ background: "rgba(30, 58, 138, 0.3)", padding: "24px", borderRadius: "16px", border: "1px solid var(--ms-border)" }}>
                <div style={{ width: "48px", height: "48px", border: "4px solid rgba(167, 136, 250, 0.2)", borderTopColor: "var(--ms-accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                <p style={{ color: "var(--ms-lavender)", fontWeight: "600", margin: 0 }}>{verifyMessage}</p>
              </div>
            ) : verifiedDone ? (
              <div style={{ background: "rgba(16, 185, 129, 0.12)", padding: "24px", borderRadius: "16px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                <ShieldCheck size={44} style={{ color: "#34D399", margin: "0 auto 12px" }} />
                <h4 style={{ margin: "0 0 6px", color: "#34D399", fontSize: "1.1rem" }}>Authentication Successful</h4>
                <p style={{ margin: "0 0 20px", fontSize: "0.85rem", color: "var(--ms-text-muted)" }}>
                  Verified active status for Student ID: DCC-2024-8842
                </p>
                <button type="button" className="ms-btn-primary" onClick={() => setStep(3)}>
                  View Verified Profile <ArrowRight size={16} />
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* STEP 3: VERIFIED PROFILE CONFIRMATION */}
        {step === 3 && (
          <div>
            <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "12px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <ShieldCheck size={20} style={{ color: "#34D399" }} />
              <div>
                <span style={{ color: "#34D399", fontWeight: "700", fontSize: "0.9rem" }}>
                  Verified by {store.selectedInstitution.name}
                </span>
                <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "var(--ms-text-muted)" }}>
                  Institutional records locked & protected by Neo Cash AI Security.
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "24px" }}>
              <div style={{ background: "rgba(30, 58, 138, 0.25)", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--ms-border)" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--ms-text-muted)", textTransform: "uppercase" }}>Full Name</span>
                <p style={{ margin: "4px 0 0", fontWeight: "700", color: "#FFF" }}>{store.studentProfile.name}</p>
              </div>
              <div style={{ background: "rgba(30, 58, 138, 0.25)", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--ms-border)" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--ms-text-muted)", textTransform: "uppercase" }}>Student ID</span>
                <p style={{ margin: "4px 0 0", fontWeight: "700", color: "#FFF" }}>{store.studentProfile.studentId}</p>
              </div>
              <div style={{ background: "rgba(30, 58, 138, 0.25)", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--ms-border)" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--ms-text-muted)", textTransform: "uppercase" }}>Department</span>
                <p style={{ margin: "4px 0 0", fontWeight: "700", color: "#FFF" }}>{store.studentProfile.department}</p>
              </div>
              <div style={{ background: "rgba(30, 58, 138, 0.25)", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--ms-border)" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--ms-text-muted)", textTransform: "uppercase" }}>Class & Section</span>
                <p style={{ margin: "4px 0 0", fontWeight: "700", color: "#FFF" }}>{store.studentProfile.classSection}</p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button type="button" className="ms-btn-primary" onClick={() => setStep(4)}>
                Proceed to Wallet Setup <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: WALLET SETUP */}
        {step === 4 && (
          <div>
            <p style={{ color: "var(--ms-text-muted)", fontSize: "0.9rem", marginBottom: "18px" }}>
              Select your primary digital wallet or mobile banking account for fast, paperless fee transactions.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
              {store.paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  onClick={() => setSelectedMethod(pm.id)}
                  style={{
                    padding: "16px",
                    background: selectedMethod === pm.id ? "rgba(79, 70, 229, 0.3)" : "rgba(30, 58, 138, 0.2)",
                    border: `1px solid ${selectedMethod === pm.id ? "var(--ms-accent)" : "var(--ms-border)"}`,
                    borderRadius: "14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <CreditCard size={24} style={{ color: selectedMethod === pm.id ? "var(--ms-accent)" : "var(--ms-text-muted)" }} />
                  <div>
                    <h5 style={{ margin: 0, color: "#FFF", fontSize: "0.95rem" }}>{pm.name}</h5>
                    <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "var(--ms-text-muted)" }}>{pm.account}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(167, 136, 250, 0.1)", border: "1px solid rgba(167, 136, 250, 0.25)", padding: "14px 18px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <Sparkles size={22} style={{ color: "var(--ms-accent)", flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--ms-lavender)" }}>
                Your Neo Cash Wallet has been provisioned automatically with ৳4,250.00 initial digital credit.
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" className="ms-btn-primary" onClick={handleFinishOnboarding}>
                Enter Student Dashboard <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
