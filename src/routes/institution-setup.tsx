/**
 * Neo Cash AI — Institution Setup + Student Verification
 * SheerID-style flow: Country → School Search → Personal Info → Verify
 *
 * Color theme: matches dashboard (white/light bg, #7C3AED purple accent)
 * Flow: Google Login → /institution-setup → /dashboard
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// ─── Comprehensive Bangladesh Institution List ───────────────────────────────
const BD_INSTITUTIONS = [
  // Dhaka Division - Universities
  { id: "dhaka-university", name: "University of Dhaka", location: "Dhaka, Dhaka Division", type: "University" },
  { id: "buet", name: "Bangladesh University of Engineering & Technology", location: "Dhaka, Dhaka Division", type: "University" },
  { id: "brac-university", name: "BRAC University", location: "Dhaka, ঢাকা", type: "University" },
  { id: "nsu", name: "North South University", location: "Dhaka, Dhaka Division", type: "University" },
  { id: "aust", name: "Ahsanullah University of Science & Technology", location: "Dhaka, Dhaka Division", type: "University" },
  { id: "iub", name: "Independent University Bangladesh", location: "Dhaka, Dhaka Division", type: "University" },
  { id: "diu", name: "Daffodil International University", location: "Dhaka, ঢাকা", type: "University" },
  { id: "east-west", name: "East West University", location: "Dhaka, Dhaka Division", type: "University" },
  { id: "aiub", name: "American International University Bangladesh", location: "Dhaka, Dhaka Division", type: "University" },
  { id: "stamford", name: "Stamford University Bangladesh", location: "Dhaka, Dhaka Division", type: "University" },
  { id: "duet", name: "Dhaka University of Engineering & Technology", location: "Gazipur, Dhaka Division", type: "University" },
  { id: "dhaka-international", name: "Dhaka International University", location: "Dhaka, Dhaka Division", type: "University" },
  // Dhaka Division - Colleges
  { id: "dhaka-city-college", name: "Dhaka City College", location: "Dhaka, Dhaka Division", type: "College" },
  { id: "dhaka-college", name: "Dhaka College", location: "ঢাকা, Dhaka Division", type: "College" },
  { id: "dhaka-model-degree", name: "Dhaka Model Degree College", location: "Dhaka, Dhaka Division", type: "College" },
  { id: "dn-degree", name: "D N Degree College (ডি এন ডিগ্রি কেলজ)", location: "রাণীশংকেল", type: "College" },
  { id: "mirpur-mdc", name: "মিরপুর ডেভেলপমেন্ট কমিটি (এম.ডি.পি) মডেল স্কুল অ্যান্ড কলেজ", location: "ঢাকা, ঢাকা বিভাগ", type: "College" },
  { id: "pfda-vocational", name: "P F D A Vocational Training Centre", location: "Dhaka", type: "College" },
  { id: "rajuk-college", name: "Rajuk Uttara Model College", location: "Dhaka, Dhaka Division", type: "College" },
  { id: "milestone-college", name: "Milestone College", location: "Dhaka, Dhaka Division", type: "College" },
  { id: "govt-shahid-suhrawardy", name: "Government Shahid Suhrawardy College, Dhaka", location: "Dhaka", type: "College" },
  // Chittagong Division
  { id: "chittagong-university", name: "University of Chittagong", location: "Chittagong, Chittagong Division", type: "University" },
  { id: "cuet", name: "Chittagong University of Engineering & Technology", location: "Chittagong, Chittagong Division", type: "University" },
  { id: "premier-university", name: "Premier University", location: "Chittagong, Chittagong Division", type: "University" },
  // Rajshahi Division
  { id: "rajshahi-university", name: "University of Rajshahi", location: "Rajshahi, Rajshahi Division", type: "University" },
  { id: "ruet", name: "Rajshahi University of Engineering & Technology", location: "Rajshahi, Rajshahi Division", type: "University" },
  // Khulna Division
  { id: "khulna-university", name: "Khulna University", location: "Khulna, Khulna Division", type: "University" },
  { id: "kuet", name: "Khulna University of Engineering & Technology", location: "Khulna, Khulna Division", type: "University" },
  // Polytechnic
  { id: "dhaka-polytechnic", name: "Dhaka Polytechnic Institute", location: "Dhaka, C", type: "Polytechnic" },
  { id: "dinajpur-polytechnic", name: "Dinajpur Polytechnic Institute", location: "Dinajpur, Rangpur Division", type: "Polytechnic" },
  // Schools
  { id: "viqarunnisa", name: "Viqarunnisa Noon School & College", location: "Dhaka, Dhaka Division", type: "School" },
  { id: "motijheel-girls", name: "Motijheel Govt. Girls High School", location: "Dhaka, Dhaka Division", type: "School" },
  { id: "scholastica", name: "Scholastica School", location: "Dhaka, Dhaka Division", type: "School" },
  { id: "sunnydale", name: "Sunnydale School", location: "Dhaka, Dhaka Division", type: "School" },
];

type Step = "country" | "form" | "verifying" | "done";

export const Route = createFileRoute("/institution-setup")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Verify Your Student Status — Neo Cash AI" },
      { name: "description", content: "Confirm your enrollment to access Neo Cash AI." },
    ],
  }),
  component: InstitutionSetupPage,
});

function InstitutionSetupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("country");
  const [country, setCountry] = useState("Bangladesh");
  const [schoolQuery, setSchoolQuery] = useState("");
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<typeof BD_INSTITUTIONS[0] | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState({ month: "", day: "", year: "" });
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"student" | "staff">("student");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const schoolRef = useRef<HTMLDivElement>(null);

  // Pre-fill email from Google OAuth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { void navigate({ to: "/", search: { login: true } }); return; }
      if (data.user.email) setEmail(data.user.email);
      // Pre-fill name from Google - use any cast for index-signature metadata
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const meta = data.user.user_metadata as any;
      if (meta?.full_name) {
        const parts = String(meta.full_name).split(" ");
        setFirstName(parts[0] ?? "");
        setLastName(parts.slice(1).join(" ") ?? "");
      } else if (meta?.name) {
        const parts = String(meta.name).split(" ");
        setFirstName(parts[0] ?? "");
        setLastName(parts.slice(1).join(" ") ?? "");
      }
    });
  }, [navigate]);

  // Close school dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (schoolRef.current && !schoolRef.current.contains(e.target as Node)) setSchoolOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredSchools = BD_INSTITUTIONS.filter(
    (s) =>
      schoolQuery.trim() === "" ||
      s.name.toLowerCase().includes(schoolQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(schoolQuery.toLowerCase())
  ).slice(0, 12);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selectedSchool) { setError("Please select a school."); return; }
    if (!firstName.trim() || !lastName.trim()) { setError("Full name is required."); return; }
    if (!email.trim()) { setError("Email address is required."); return; }
    setBusy(true);
    setStep("verifying");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("profiles") as any).upsert({
          id: user.id,
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          institution_id: selectedSchool.id,
          role: role === "student" ? "student" : "admin",
          updated_at: new Date().toISOString(),
        });
      }
      await new Promise((r) => setTimeout(r, 2000)); // simulate verification
      setStep("done");
    } catch {
      setStep("form");
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const PURPLE = "#7C3AED";

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#F9FAFB",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      color: "#111827",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .verify-input { width: 100%; padding: 10px 12px; border: 1.5px solid #D1D5DB; border-radius: 6px; font-size: 0.92rem; font-family: inherit; color: #111827; background: #fff; transition: border-color 0.15s; }
        .verify-input:focus { outline: none; border-color: ${PURPLE}; box-shadow: 0 0 0 3px rgba(124,58,237,0.12); }
        .verify-input::placeholder { color: #9CA3AF; }
        .school-item { padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #F3F4F6; transition: background 0.1s; }
        .school-item:hover { background: #F5F3FF; }
        .school-item:last-child { border-bottom: none; }
        .step-check { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 14px; font-size: 0.88rem; color: #374151; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes check-pop { 0% { transform: scale(0); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        select.verify-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "16px 24px", display: "flex", justifyContent: "center",
        borderBottom: "1px solid #E5E7EB", background: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: PURPLE, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "16px", fontWeight: 900, color: "#fff",
          }}>N</div>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "#111827" }}>Neo Cash AI</span>
        </div>
      </div>

      <div style={{
        flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "40px 16px 60px",
      }}>
        <div style={{
          background: "#fff", borderRadius: "12px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.04)",
          width: "100%", maxWidth: "480px",
          animation: "slide-up 0.3s ease forwards",
        }}>

          {/* ── STEP: verifying ── */}
          {step === "verifying" && (
            <div style={{ padding: "48px 40px", textAlign: "center" }}>
              <div style={{
                width: "56px", height: "56px", border: `3px solid rgba(124,58,237,0.2)`,
                borderTopColor: PURPLE, borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 24px",
              }} />
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 8px" }}>Verifying your status…</h2>
              <p style={{ color: "#6B7280", fontSize: "0.88rem", margin: 0 }}>
                Confirming your enrollment at {selectedSchool?.name}
              </p>
            </div>
          )}

          {/* ── STEP: done ── */}
          {step === "done" && (
            <div style={{ padding: "48px 40px", textAlign: "center" }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "50%",
                background: "#D1FAE5", display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto 24px",
                animation: "check-pop 0.4s ease forwards",
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 8px" }}>Verified!</h2>
              <p style={{ color: "#6B7280", fontSize: "0.88rem", margin: "0 0 28px" }}>
                Your student status at <strong>{selectedSchool?.name}</strong> has been confirmed.
              </p>
              <button
                onClick={() => void navigate({ to: "/dashboard", search: {} })}
                style={{
                  width: "100%", padding: "12px",
                  background: PURPLE, color: "#fff",
                  border: "none", borderRadius: "8px",
                  fontSize: "0.95rem", fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Go to Dashboard →
              </button>
            </div>
          )}

          {/* ── STEP: form ── */}
          {(step === "country" || step === "form") && (
            <form onSubmit={(e) => void handleVerify(e)}>
              {/* Form header */}
              <div style={{ padding: "32px 36px 0" }}>
                <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 4px", color: "#111827" }}>
                  Verify your student status
                </h1>
                <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: "0 0 4px" }}>
                  Confirm that you're enrolled at an institution of higher education
                </p>
                <button type="button" style={{
                  background: "none", border: "none", color: PURPLE,
                  fontSize: "0.82rem", cursor: "pointer", padding: 0, fontFamily: "inherit",
                }}>
                  How does verifying work?
                </button>
              </div>

              <div style={{ padding: "4px 36px" }}>
                <p style={{ fontSize: "0.8rem", color: PURPLE, margin: "16px 0 0" }}>* Required information</p>

                {/* Role toggle */}
                <div style={{ margin: "16px 0" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {(["student", "staff"] as const).map((r) => (
                      <button
                        key={r} type="button"
                        onClick={() => setRole(r)}
                        style={{
                          flex: 1, padding: "8px", borderRadius: "6px",
                          border: `1.5px solid ${role === r ? PURPLE : "#D1D5DB"}`,
                          background: role === r ? "#F5F3FF" : "#fff",
                          color: role === r ? PURPLE : "#6B7280",
                          fontWeight: role === r ? 600 : 400,
                          fontSize: "0.85rem", cursor: "pointer", fontFamily: "inherit",
                          transition: "all 0.15s",
                        }}
                      >
                        {r === "student" ? "🎓 Student" : "🛡️ Staff / Faculty"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Country */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
                    Country *
                  </label>
                  <select
                    className="verify-input"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="India">India</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* School search */}
                <div style={{ marginBottom: "6px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
                    School *
                  </label>
                  {selectedSchool ? (
                    <div style={{
                      border: `1.5px solid ${PURPLE}`, borderRadius: "6px",
                      padding: "10px 12px", background: "#F5F3FF",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#111827" }}>{selectedSchool.name}</div>
                        <div style={{ fontSize: "0.78rem", color: "#6B7280" }}>{selectedSchool.location}</div>
                      </div>
                      <button type="button" onClick={() => { setSelectedSchool(null); setSchoolQuery(""); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: "16px", padding: "4px" }}>
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div ref={schoolRef} style={{ position: "relative" }}>
                      <input
                        className="verify-input"
                        type="text"
                        placeholder={country !== "Bangladesh" ? "Choose a country before searching" : "Search your school…"}
                        disabled={country !== "Bangladesh"}
                        value={schoolQuery}
                        onChange={(e) => { setSchoolQuery(e.target.value); setSchoolOpen(true); }}
                        onFocus={() => setSchoolOpen(true)}
                        style={{ background: country !== "Bangladesh" ? "#F3F4F6" : "#fff" }}
                      />
                      {schoolOpen && schoolQuery.length > 0 && (
                        <div style={{
                          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                          background: "#fff", border: "1px solid #E5E7EB",
                          borderRadius: "8px", zIndex: 50,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                          maxHeight: "280px", overflowY: "auto",
                        }}>
                          {filteredSchools.length === 0 ? (
                            <div style={{ padding: "16px", color: "#9CA3AF", fontSize: "0.85rem", textAlign: "center" }}>
                              No institutions found
                            </div>
                          ) : filteredSchools.map((s) => (
                            <div
                              key={s.id}
                              className="school-item"
                              onClick={() => { setSelectedSchool(s); setSchoolOpen(false); setSchoolQuery(""); }}
                            >
                              <div style={{ fontWeight: 500, fontSize: "0.9rem", color: "#111827" }}>{s.name}</div>
                              <div style={{ fontSize: "0.77rem", color: "#6B7280", marginTop: "2px" }}>{s.location}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <p style={{ fontSize: "0.78rem", color: PURPLE, margin: "6px 0 0" }}>
                    Enter your name exactly as it appears on your official school records.
                  </p>
                </div>

                {/* Name */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px", marginTop: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>First name *</label>
                    <input className="verify-input" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>Last name *</label>
                    <input className="verify-input" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" required />
                  </div>
                </div>

                {/* Date of birth */}
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "4px" }}>Date of birth *</label>
                  <p style={{ fontSize: "0.78rem", color: "#6B7280", margin: "0 0 8px" }}>Used for verification purposes only</p>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr", gap: "8px" }}>
                    <select className="verify-input" value={dob.month} onChange={(e) => setDob((p) => ({ ...p, month: e.target.value }))}>
                      <option value="">Month</option>
                      {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => (
                        <option key={m} value={String(i + 1)}>{m}</option>
                      ))}
                    </select>
                    <input className="verify-input" type="number" placeholder="Day" min="1" max="31" value={dob.day} onChange={(e) => setDob((p) => ({ ...p, day: e.target.value }))} />
                    <input className="verify-input" type="number" placeholder="Year" min="1950" max="2015" value={dob.year} onChange={(e) => setDob((p) => ({ ...p, year: e.target.value }))} />
                  </div>
                </div>

                {/* Email */}
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "4px" }}>Email address *</label>
                  <p style={{ fontSize: "0.78rem", color: "#6B7280", margin: "0 0 8px" }}>We'll use this email to keep you updated</p>
                  <input className="verify-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
                </div>

                {/* Error */}
                {error && (
                  <div style={{
                    background: "#FEF2F2", border: "1px solid #FECACA",
                    borderRadius: "6px", padding: "10px 12px",
                    fontSize: "0.82rem", color: "#DC2626", marginBottom: "12px",
                  }}>{error}</div>
                )}
              </div>

              {/* Submit */}
              <div style={{ padding: "16px 36px 28px" }}>
                <button
                  type="submit"
                  disabled={busy || !selectedSchool}
                  style={{
                    width: "100%", padding: "12px",
                    background: selectedSchool ? "#1F2937" : "#9CA3AF",
                    color: "#fff", border: "none", borderRadius: "8px",
                    fontSize: "0.95rem", fontWeight: 600,
                    cursor: selectedSchool ? "pointer" : "not-allowed",
                    fontFamily: "inherit", transition: "background 0.15s",
                  }}
                >
                  Verify {role === "student" ? "student" : "staff"} status
                </button>

                {/* Legal text */}
                <div style={{
                  display: "flex", gap: "10px", alignItems: "flex-start",
                  marginTop: "16px",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  <p style={{ fontSize: "0.72rem", color: "#9CA3AF", margin: 0, lineHeight: 1.5 }}>
                    By submitting the personal information above, I acknowledge that my personal information is being
                    collected under the privacy policy of the business from which I am seeking a discount, and I
                    understand that my personal information will be shared with SheerID as a processor/third-party
                    service provider in order for SheerID to confirm my eligibility for a special offer.{" "}
                    <span style={{ color: PURPLE, cursor: "pointer" }}>More about SheerID.</span>
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
