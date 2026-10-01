/**
 * Neo Cash AI — Phase 2: Student Onboarding & Institution Verification Flow
 * 
 * Complete institutional identity verification & fintech onboarding:
 * Step 1: Institution Search (Dhaka University, Dhaka City College, Sylhet institutions, etc.)
 * Step 2: Institution Verification (Demo SSO / Authentication Gateway)
 * Step 3: Verified Data Returned (Locked institutional fields with "Verified by [Institution]")
 * Step 4: Verified Profile Setup & Completion (Photo, Phone, Emergency contact, 80% progress)
 * Step 5: Automatic Wallet Creation (Available balance ৳0, Status: Active)
 * Step 6: Payment Methods Configuration (bKash, Rocket, Nagad, Visa, Mastercard - Available/Connected/Not connected)
 * Step 7: Success State ("Your Neo Cash account is ready" -> Go to Dashboard)
 * Step 8: Persistent state storage in useNeoStore & localStorage.
 */

import { useState } from "react";
import { useNeoStore } from "@/lib/neo-cash-store";
import { IdentityVerificationPanel } from "./identity-verification-panel";
import {
  Search, ShieldCheck, CheckCircle2, Lock, ArrowRight, Building2,
  Wallet, CreditCard, Sparkles, UserCheck, Phone, Camera, User,
  Check, RefreshCw, AlertCircle, Award, Smartphone
} from "lucide-react";

export interface DemoInstitution {
  id: string;
  name: string;
  type: string;
  location: string;
  logo: string;
  verified: boolean;
  code: string;
}

export const INSTITUTION_DATABASE: DemoInstitution[] = [
  { id: "inst-1", name: "Dhaka City College", type: "Collegiate College / University", location: "Dhanmondi, Dhaka", logo: "🏛️", verified: true, code: "DCC" },
  { id: "inst-2", name: "University of Dhaka", type: "Public Research University", location: "Nilkhet, Dhaka", logo: "🎓", verified: true, code: "DU" },
  { id: "inst-3", name: "Dhaka College", type: "Government College", location: "New Market, Dhaka", logo: "🏫", verified: true, code: "DC" },
  { id: "inst-4", name: "Eden Mohila College", type: "Government Women's College", location: "Azimpur, Dhaka", logo: "👩‍🎓", verified: true, code: "EMC" },
  { id: "inst-5", name: "Government Titumir College", type: "DU-Affiliated Government College", location: "Mohakhali, Dhaka", logo: "📚", verified: true, code: "GTC" },
  { id: "inst-6", name: "Sylhet Agricultural University", type: "Public Agricultural University", location: "Sylhet, Bangladesh", logo: "🌾", verified: true, code: "SAU" },
  { id: "inst-7", name: "Shahjalal University of Sci & Tech", type: "Public Science & Tech University", location: "Kumargaon, Sylhet", logo: "⚙️", verified: true, code: "SUST" },
  { id: "inst-8", name: "Notre Dame College", type: "Higher Secondary & Honors College", location: "Motijheel, Dhaka", logo: "✝️", verified: true, code: "NDC" },
  { id: "inst-9", name: "BUET (Bangladesh Univ of Eng & Tech)", type: "Engineering University", location: "Palashi, Dhaka", logo: "🔬", verified: true, code: "BUET" },
  { id: "inst-10", name: "North South University", type: "Private Research University", location: "Bashundhara, Dhaka", logo: "🌐", verified: true, code: "NSU" },
];

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [store, actions] = useNeoStore();
  
  // Step tracker: 1: Search, 2: Verification, 3: Verified Data, 4: Profile Setup, 5: Wallet, 6: Payment Methods, 7: Ready
  const [step, setStep] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInst, setSelectedInst] = useState<DemoInstitution>(INSTITUTION_DATABASE[0]!);

  // Step 2 — verified profile data returned from IdentityVerificationPanel
  const [verifiedProfile, setVerifiedProfile] = useState<{
    institutionId: string;
    institutionName: string;
    method: string;
    studentId?: string;
  } | null>(null);
  const [studentIdInput, setStudentIdInput] = useState(store.studentProfile.studentId);
  const [instEmailInput, setInstEmailInput] = useState(store.studentProfile.email);

  // Step 4 Profile Setup states
  const [avatarSeed, setAvatarSeed] = useState(store.studentProfile.name.split(" ")[0] || "Student");
  const [phoneInput, setPhoneInput] = useState(store.studentProfile.phone);
  const [emergencyInput, setEmergencyInput] = useState("Robert Dash (+880 1711-998877)");
  const [bloodGroup, setBloodGroup] = useState("B+ (Positive)");

  // Step 6 Payment Methods Connection states
  const [paymentMethods, setPaymentMethods] = useState([
    { id: "bkash", name: "bKash Mobile Banking", type: "bkash", status: "Connected", account: "+880 1712-345678", icon: "📱" },
    { id: "rocket", name: "Dutch-Bangla Rocket", type: "rocket", status: "Available", account: "Not connected", icon: "🚀" },
    { id: "nagad", name: "Nagad Financial Service", type: "nagad", status: "Available", account: "Not connected", icon: "⚡" },
    { id: "visa", name: "Visa Debit Card", type: "visa", status: "Not connected", account: "Not connected", icon: "💳" },
    { id: "mastercard", name: "Mastercard Credit", type: "mastercard", status: "Not connected", account: "Not connected", icon: "💳" },
  ]);

  const filteredInstitutions = INSTITUTION_DATABASE.filter(
    (inst) =>
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /** Handle institution selection — go to verification step */
  const handleStartSSO = (inst: DemoInstitution) => {
    setSelectedInst(inst);
    setStudentIdInput(`${inst.code}-CSE-24-1024`);
    setStep(2);
    setVerifiedProfile(null);
  };

  /** Called by IdentityVerificationPanel when verification succeeds */
  const handleVerified = (profile: {
    institutionId: string;
    institutionName: string;
    method: string;
    studentId?: string;
  }) => {
    setVerifiedProfile(profile);
    if (profile.studentId) setStudentIdInput(profile.studentId);
    setStep(3);
  };

  /** Save profile edits and proceed to Wallet creation */
  const handleProfileComplete = () => {
    const instName = verifiedProfile?.institutionName ?? selectedInst.name;
    const instId   = verifiedProfile?.institutionId   ?? selectedInst.id;

    actions.setSelectedInstitution({
      name:     instName,
      type:     selectedInst.type,
      location: selectedInst.location,
      logo:     selectedInst.logo,
      verified: true,
    });

    actions.updateStudentProfile({
      name:         store.currentSessionUser?.fullName || store.studentProfile.name,
      studentId:    verifiedProfile?.studentId ?? studentIdInput,
      institution:  instName,
      department:   "Computer Science & Engineering",
      classSection: "1st Year, 2nd Semester",
      session:      "2024–2025",
      email:        instEmailInput,
      phone:        phoneInput,
      avatar:       `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
      isVerified:   true,
    });

    setStep(5);
  };

  /** Toggle payment method connection state for realistic fintech UX */
  const togglePaymentMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => {
        if (pm.id === id) {
          const isConn = pm.status === "Connected";
          return {
            ...pm,
            status: isConn ? "Available" : "Connected",
            account: isConn ? "Not connected" : phoneInput || "+880 1712-345678",
          };
        }
        return pm;
      })
    );
  };

  /** Finish onboarding and navigate to Student Dashboard */
  const handleFinishOnboarding = () => {
    onComplete();
  };

  return (
    <div className="onboarding-overlay" style={{
      position: "fixed",
      inset: 0,
      background: "rgba(33, 23, 16, 0.85)",
      backdropFilter: "blur(8px)",
      zIndex: 100,
      display: "grid",
      placeItems: "center",
      padding: "20px",
      overflowY: "auto",
    }}>
      <div className="onboarding-card" style={{
        background: "#FFFFFF",
        border: "1px solid rgba(196, 154, 108, 0.4)",
        borderRadius: "20px",
        maxWidth: "720px",
        width: "100%",
        padding: "32px 36px",
        boxShadow: "0 28px 75px rgba(36, 26, 20, 0.25)",
        color: "#241A14",
        position: "relative",
      }}>
        {/* HEADER & STEPPER PROGRESS */}
        <div style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.25)", paddingBottom: "20px", marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#D35400", fontWeight: 800 }}>
              NEO CASH AI • INSTITUTIONAL IDENTITY VERIFICATION
            </span>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#66564A", background: "#FFF7E6", padding: "4px 12px", borderRadius: "999px", border: "1px solid rgba(196, 154, 108, 0.3)" }}>
              Step {step} of 7
            </span>
          </div>

          <h2 style={{ fontSize: "1.5rem", margin: "0 0 6px", fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, color: "#241A14" }}>
            {step === 1 && "Find Your Institution"}
            {step === 2 && "Institutional Identity Gateway"}
            {step === 3 && "Verified Institutional Identity"}
            {step === 4 && "Verified Student Profile Setup"}
            {step === 5 && "Automatic Wallet Creation"}
            {step === 6 && "Link Payment Methods"}
            {step === 7 && "Account Ready!"}
          </h2>

          <p style={{ margin: 0, fontSize: "0.88rem", color: "#66564A" }}>
            {step === 1 && "Search and select your academic school, college, or university."}
            {step === 2 && "Authenticate your student credentials via official identity server."}
            {step === 3 && "Verified academic records returned from institutional database."}
            {step === 4 && "Complete your personal profile details. Verified records remain locked."}
            {step === 5 && "Provisioning your secure Neo Cash student digital wallet."}
            {step === 6 && "Connect mobile banking or cards for fast fee payments."}
            {step === 7 && "Your institutional fintech account is fully verified and active."}
          </p>

          {/* Stepper Dots */}
          <div style={{ display: "flex", gap: "8px", marginTop: "18px" }}>
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: "6px",
                  borderRadius: "999px",
                  background: s <= step ? "#D35400" : "#EAD9C6",
                  transition: "background 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: INSTITUTION SEARCH */}
        {step === 1 && (
          <div>
            <div style={{ position: "relative", marginBottom: "22px" }}>
              <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#8C7A6A" }} />
              <input
                type="text"
                placeholder="Search school, college or university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "13px 16px 13px 46px",
                  background: "#FFF7E6",
                  border: "1px solid rgba(196, 154, 108, 0.4)",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  color: "#241A14",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "360px", overflowY: "auto", paddingRight: "4px" }}>
              {filteredInstitutions.map((inst) => (
                <div
                  key={inst.id}
                  onClick={() => handleStartSSO(inst)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    background: "#FFFFFF",
                    border: "1px solid rgba(196, 154, 108, 0.3)",
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 8px rgba(36, 26, 20, 0.04)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#D35400";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(211, 84, 0, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(196, 154, 108, 0.3)";
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(36, 26, 20, 0.04)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontSize: "2rem", width: "48px", height: "48px", display: "grid", placeItems: "center", background: "#FFF7E6", borderRadius: "12px", border: "1px solid rgba(196, 154, 108, 0.2)" }}>
                      {inst.logo}
                    </span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#241A14" }}>{inst.name}</h4>
                        <span style={{ fontSize: "0.72rem", background: "rgba(4, 120, 87, 0.1)", color: "#047857", padding: "3px 10px", borderRadius: "999px", fontWeight: 700, border: "1px solid rgba(4, 120, 87, 0.2)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <CheckCircle2 size={12} /> Institution verification available
                        </span>
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "0.83rem", color: "#66564A" }}>
                        {inst.location} • <span style={{ fontWeight: 600 }}>{inst.type}</span>
                      </p>
                    </div>
                  </div>
                  <button type="button" style={{ border: "none", background: "#FFF7E6", color: "#D35400", padding: "8px 14px", borderRadius: "999px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    Select <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: INSTITUTIONAL IDENTITY VERIFICATION (Phase 2 — real verification) */}
        {step === 2 && (
          <IdentityVerificationPanel
            institution={selectedInst}
            userEmail={store.currentSessionUser?.email ?? store.studentProfile.email}
            onVerified={handleVerified}
            onBack={() => setStep(1)}
          />
        )}

        {/* STEP 3: VERIFIED DATA RETURNED */}
        {step === 3 && (
          <div>
            {/* Status Header */}
            <div style={{ background: "rgba(4, 120, 87, 0.1)", border: "1px solid rgba(4, 120, 87, 0.3)", borderRadius: "16px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <ShieldCheck size={26} style={{ color: "#047857" }} />
                <div>
                  <span style={{ color: "#047857", fontWeight: 800, fontSize: "0.95rem" }}>
                    Verified by {selectedInst.name}
                  </span>
                  <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#66564A" }}>
                    Verified payload authenticated via institutional database. Fields are locked.
                  </p>
                </div>
              </div>
              <span style={{ fontSize: "0.75rem", background: "#047857", color: "#FFF", padding: "4px 10px", borderRadius: "999px", fontWeight: 700 }}>
                STATUS: ACTIVE
              </span>
            </div>

            {/* Grid of Locked Verified Fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "28px" }}>
              {[
                { label: "Institution", value: selectedInst.name },
                { label: "Verification Status", value: `Verified by ${selectedInst.name}` },
                { label: "Role", value: "Student" },
                { label: "Student ID", value: studentIdInput },
                { label: "Full Name", value: "Ruhan Dash Dibya" },
                { label: "Department", value: "Computer Science & Engineering" },
                { label: "Program", value: "B.Sc. in CSE" },
                { label: "Year & Semester", value: "1st Year (2nd Semester)" },
                { label: "Academic Session", value: "2024–2025" },
                { label: "Institutional Email", value: instEmailInput },
              ].map((item, idx) => (
                <div key={idx} style={{ background: "#FFF7E6", padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(196, 154, 108, 0.3)", position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#8C7A6A", fontWeight: 700 }}>
                      {item.label}
                    </span>
                    <Lock size={12} style={{ color: "#8C7A6A" }} />
                  </div>
                  <p style={{ margin: "4px 0 0", fontWeight: 700, fontSize: "0.92rem", color: "#241A14" }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button type="button" className="auth-inline-link" onClick={() => setStep(2)}>
                ← Back to Verification
              </button>
              <button type="button" className="auth-primary" onClick={() => setStep(4)} style={{ width: "auto" }}>
                Proceed to Profile Setup <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: VERIFIED PROFILE SETUP & PROFILE COMPLETION */}
        {step === 4 && (
          <div>
            {/* Completion Progress Bar */}
            <div style={{ background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "18px 22px", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#241A14" }}>
                  Profile Completion
                </span>
                <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#D35400" }}>
                  80% Complete
                </span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#EAD9C6", borderRadius: "999px", overflow: "hidden", marginBottom: "10px" }}>
                <div style={{ width: "80%", height: "100%", background: "#D35400", borderRadius: "999px" }} />
              </div>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#66564A", fontWeight: 600 }}>
                Remaining: <span style={{ color: "#D35400" }}>Add profile photo • Confirm phone number</span>
              </p>
            </div>

            {/* Editable Profile Inputs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <div style={{ gridColumn: "span 2", display: "flex", alignItems: "center", gap: "16px", background: "#FFF7E6", padding: "14px 18px", borderRadius: "14px", border: "1px solid rgba(196, 154, 108, 0.3)" }}>
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                  alt="Profile Avatar"
                  style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#FFFFFF", border: "2px solid #D35400" }}
                />
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "0.95rem", fontWeight: 700, color: "#241A14" }}>Choose Profile Avatar</h4>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {["Ruhan", "Shelly", "Tanzim", "Nusrat"].map((seed) => (
                      <button
                        key={seed}
                        type="button"
                        onClick={() => setAvatarSeed(seed)}
                        style={{
                          border: avatarSeed === seed ? "2px solid #D35400" : "1px solid rgba(196, 154, 108, 0.4)",
                          background: avatarSeed === seed ? "#FFFFFF" : "#FFF7E6",
                          padding: "4px 10px",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          color: "#241A14",
                        }}
                      >
                        {seed}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#241A14", marginBottom: "6px" }}>
                  Mobile Phone Number (*)
                </label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid rgba(196, 154, 108, 0.4)",
                    borderRadius: "10px",
                    fontSize: "0.9rem",
                    color: "#241A14",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#241A14", marginBottom: "6px" }}>
                  Emergency Contact Name & Phone
                </label>
                <input
                  type="text"
                  value={emergencyInput}
                  onChange={(e) => setEmergencyInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid rgba(196, 154, 108, 0.4)",
                    borderRadius: "10px",
                    fontSize: "0.9rem",
                    color: "#241A14",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#241A14", marginBottom: "6px" }}>
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid rgba(196, 154, 108, 0.4)",
                    borderRadius: "10px",
                    fontSize: "0.9rem",
                    color: "#241A14",
                    background: "#FFFFFF",
                  }}
                >
                  <option>B+ (Positive)</option>
                  <option>A+ (Positive)</option>
                  <option>O+ (Positive)</option>
                  <option>AB+ (Positive)</option>
                  <option>O- (Negative)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#8C7A6A", marginBottom: "6px" }}>
                  Institutional Status (Locked)
                </label>
                <div style={{ background: "#FFF7E6", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.3)", fontSize: "0.88rem", fontWeight: 700, color: "#047857", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>Verified by {selectedInst.code}</span>
                  <Lock size={14} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button type="button" className="auth-inline-link" onClick={() => setStep(3)}>
                ← Back to Verified Data
              </button>
              <button type="button" className="auth-primary" onClick={handleProfileComplete} style={{ width: "auto" }}>
                Complete Profile & Create Wallet <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: AUTOMATIC WALLET CREATION */}
        {step === 5 && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ width: "64px", height: "64px", background: "rgba(4, 120, 87, 0.1)", borderRadius: "50%", display: "grid", placeItems: "center", margin: "0 auto 16px", border: "2px solid #047857" }}>
              <Wallet size={32} style={{ color: "#047857" }} />
            </div>

            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#241A14", margin: "0 0 6px" }}>
              Wallet Created Successfully!
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#66564A", margin: "0 0 24px" }}>
              Your official Neo Cash digital wallet is active and provisioned for Instant Fee Payments.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "28px", textAlign: "left" }}>
              <div style={{ background: "#FFF7E6", padding: "16px", borderRadius: "14px", border: "1px solid rgba(196, 154, 108, 0.3)" }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#8C7A6A", fontWeight: 700 }}>Available Balance</span>
                <p style={{ margin: "4px 0 0", fontSize: "1.4rem", fontWeight: 800, color: "#241A14" }}>৳0</p>
              </div>

              <div style={{ background: "#FFF7E6", padding: "16px", borderRadius: "14px", border: "1px solid rgba(196, 154, 108, 0.3)" }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#8C7A6A", fontWeight: 700 }}>Wallet Status</span>
                <p style={{ margin: "4px 0 0", fontSize: "1.1rem", fontWeight: 800, color: "#047857", display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 size={16} /> Active
                </p>
              </div>

              <div style={{ background: "#FFF7E6", padding: "14px 16px", borderRadius: "14px", border: "1px solid rgba(196, 154, 108, 0.3)" }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#8C7A6A", fontWeight: 700 }}>Wallet ID</span>
                <p style={{ margin: "4px 0 0", fontSize: "0.92rem", fontWeight: 700, color: "#241A14" }}>NEO-W-2026-8842</p>
              </div>

              <div style={{ background: "#FFF7E6", padding: "14px 16px", borderRadius: "14px", border: "1px solid rgba(196, 154, 108, 0.3)" }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#8C7A6A", fontWeight: 700 }}>Daily Transaction Limit</span>
                <p style={{ margin: "4px 0 0", fontSize: "0.92rem", fontWeight: 700, color: "#241A14" }}>৳50,000 / day</p>
              </div>
            </div>

            <button type="button" className="auth-primary" onClick={() => setStep(6)} style={{ width: "auto", padding: "12px 28px" }}>
              Configure Payment Methods <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 6: PAYMENT METHODS CONFIGURATION */}
        {step === 6 && (
          <div>
            <p style={{ fontSize: "0.88rem", color: "#66564A", marginBottom: "20px" }}>
              Link mobile banking accounts or debit cards for 1-click tuition fee settlement.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    background: pm.status === "Connected" ? "rgba(4, 120, 87, 0.06)" : "#FFFFFF",
                    border: `1px solid ${pm.status === "Connected" ? "rgba(4, 120, 87, 0.3)" : "rgba(196, 154, 108, 0.3)"}`,
                    borderRadius: "14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ fontSize: "1.8rem" }}>{pm.icon}</span>
                    <div>
                      <h5 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 700, color: "#241A14" }}>{pm.name}</h5>
                      <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#66564A" }}>{pm.account}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: "999px",
                        background:
                          pm.status === "Connected"
                            ? "rgba(4, 120, 87, 0.15)"
                            : pm.status === "Available"
                            ? "rgba(211, 84, 0, 0.12)"
                            : "rgba(140, 122, 106, 0.12)",
                        color:
                          pm.status === "Connected"
                            ? "#047857"
                            : pm.status === "Available"
                            ? "#D35400"
                            : "#8C7A6A",
                      }}
                    >
                      {pm.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => togglePaymentMethod(pm.id)}
                      style={{
                        border: "1px solid rgba(196, 154, 108, 0.4)",
                        background: "#FFF7E6",
                        color: "#241A14",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {pm.status === "Connected" ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button type="button" className="auth-inline-link" onClick={() => setStep(5)}>
                ← Back to Wallet Status
              </button>
              <button type="button" className="auth-primary" onClick={() => setStep(7)} style={{ width: "auto" }}>
                Finalize Setup <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: SUCCESS STATE */}
        {step === 7 && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ width: "72px", height: "72px", background: "rgba(211, 84, 0, 0.1)", borderRadius: "50%", display: "grid", placeItems: "center", margin: "0 auto 16px", border: "2px solid #D35400" }}>
              <Sparkles size={36} style={{ color: "#D35400" }} />
            </div>

            <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#241A14", margin: "0 0 8px", fontFamily: "var(--font-display)", fontStyle: "italic" }}>
              Your Neo Cash account is ready.
            </h3>
            <p style={{ fontSize: "0.92rem", color: "#66564A", margin: "0 0 24px", maxWidth: "480px", marginInline: "auto" }}>
              Institutional identity verification complete. Your digital wallet and payment methods are active.
            </p>

            {/* Summary Confirmation Card */}
            <div style={{ background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "18px", padding: "20px 24px", textAlign: "left", marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", borderBottom: "1px dashed rgba(196, 154, 108, 0.4)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#047857" }}>
                  ✓ VERIFIED STUDENT IDENTITY
                </span>
                <span style={{ fontSize: "0.78rem", color: "#8C7A6A" }}>{selectedInst.name}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.88rem" }}>
                <div>
                  <span style={{ color: "#8C7A6A", fontSize: "0.75rem", display: "block" }}>Student Name</span>
                  <strong style={{ color: "#241A14" }}>Ruhan Dash Dibya</strong>
                </div>
                <div>
                  <span style={{ color: "#8C7A6A", fontSize: "0.75rem", display: "block" }}>Student ID</span>
                  <strong style={{ color: "#241A14" }}>{studentIdInput}</strong>
                </div>
                <div>
                  <span style={{ color: "#8C7A6A", fontSize: "0.75rem", display: "block" }}>Department</span>
                  <strong style={{ color: "#241A14" }}>Computer Science & Eng</strong>
                </div>
                <div>
                  <span style={{ color: "#8C7A6A", fontSize: "0.75rem", display: "block" }}>Wallet Status</span>
                  <strong style={{ color: "#047857" }}>Active (৳0 Balance)</strong>
                </div>
              </div>
            </div>

            <button type="button" className="auth-primary" onClick={handleFinishOnboarding} style={{ width: "auto", padding: "14px 36px", fontSize: "1.05rem" }}>
              Go to Dashboard <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
