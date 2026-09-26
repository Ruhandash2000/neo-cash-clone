/**
 * Head / Authority Panel Component — Executive Institutional Command Center
 * 
 * Visual System & Hierarchy Guidelines:
 * - Primary Text: #241A14 (Dark Warm Charcoal)
 * - Secondary Text: #66564A (Lighter Warm Charcoal)
 * - Muted Text: #8C7A6A (Timestamps & Metadata)
 * - Canvas Background: #FFF7E6 (Warm Ivory)
 * - Level 1 Surface: #FFFFFF (Clean White)
 * - Level 2 Subtle Surface: #FDF9F3 (Warm Beige)
 * - Primary Action: #D35400 (Burnt Orange)
 */

import { useState } from "react";
import { useNeoStore, PartialApplication } from "@/lib/neo-cash-store";
import { StatusBadge } from "@/components/design-system/status-badge";
import { formatTaka } from "@/components/design-system/tokens";
import {
  Trophy, Award, ShieldCheck, CheckCircle2, XCircle, AlertCircle, FileText,
  TrendingUp, Users, DollarSign, Building2, Check, X, Sparkles
} from "lucide-react";

export function HeadPanel({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const [store, actions] = useNeoStore();

  // Selected application for Executive Sign-Off Modal
  const [execApp, setExecApp] = useState<PartialApplication | null>(null);
  const [approvedAmountInput, setApprovedAmountInput] = useState<number>(10000);
  const [newDeadlineInput, setNewDeadlineInput] = useState<string>("2026-11-15");
  const [headNotesInput, setHeadNotesInput] = useState<string>("");
  const [declineReason, setDeclineReason] = useState("");

  const pendingHeadApps = store.partialApplications.filter((a) => a.status === "forwarded_head");

  const handleExecutiveApprove = (appId: string) => {
    if (!execApp) return;
    const finalAmount = approvedAmountInput || execApp.requestedAmount;
    actions.headApprovePartial(appId, finalAmount, newDeadlineInput, headNotesInput);
    setExecApp(null);
    alert(`Executive Approval granted for Application ${appId}! Approved Installment 1: ${formatTaka(finalAmount)}. New deadline for Installment 2: ${newDeadlineInput}.`);
  };

  const handleExecutiveRequestChanges = (appId: string) => {
    if (!declineReason.trim()) return alert("Enter feedback notes for change request.");
    actions.requestChangesPartial(appId, declineReason, "Head");
    setExecApp(null);
    setDeclineReason("");
    alert(`Change request sent to student for Application ${appId}.`);
  };

  const handleExecutiveDecline = (appId: string) => {
    if (!declineReason.trim()) return alert("Enter executive decline reason.");
    actions.rejectPartial(appId, declineReason, "Head");
    setExecApp(null);
    setDeclineReason("");
    alert(`Application ${appId} declined.`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* 1. EXECUTIVE COMMAND CENTER OVERVIEW */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          
          {/* LEVEL 1: OPEN HERO (NO CLUTTERED GRADIENTS) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.72rem", background: "rgba(211, 84, 0, 0.1)", color: "#D35400", padding: "3px 8px", borderRadius: "6px", fontWeight: 700, textTransform: "uppercase" }}>
                  Executive Sign-Off Authority
                </span>
                <span style={{ fontSize: "0.82rem", color: "#66564A" }}>Dhaka City College</span>
              </div>
              <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.02em" }}>
                Executive Command Center
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "0.92rem", color: "#66564A" }}>
                Prof. Dr. M. A. Karim • Director & Financial Oversight Authority
              </p>
            </div>

            <button
              type="button"
              className="ms-btn-primary"
              onClick={() => setActiveTab("trophy")}
              style={{ background: "#D35400", color: "#FFFFFF", padding: "10px 18px", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Trophy size={18} /> Impact Center 🏆
            </button>
          </div>

          {/* LEVEL 2: EXECUTIVE METRICS CARDS */}
          <div className="ms-grid-3">
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(196, 154, 108, 0.3)",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 4px 14px rgba(36, 26, 20, 0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                PENDING EXECUTIVE APPROVALS
              </span>

              <div style={{ margin: "14px 0 8px" }}>
                <span style={{ fontSize: "2.25rem", fontWeight: 800, color: pendingHeadApps.length > 0 ? "#D35400" : "#241A14" }}>
                  {pendingHeadApps.length}
                </span>
              </div>

              <div style={{ fontSize: "0.8rem", color: "#8C7A6A" }}>
                {pendingHeadApps.length > 0 ? "Requires Executive Action" : "All Applications Decisioned"}
              </div>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                border: "2px solid #D35400",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 6px 20px rgba(211, 84, 0, 0.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  INSTITUTIONAL SOLVENCY
                </span>
                <span style={{ fontSize: "0.72rem", background: "rgba(16, 185, 129, 0.1)", color: "#047857", padding: "3px 8px", borderRadius: "6px", fontWeight: 700 }}>
                  HEALTHY
                </span>
              </div>

              <div style={{ margin: "14px 0 8px" }}>
                <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.03em", fontFeatureSettings: "'tnum'" }}>
                  {formatTaka(4820000, false)}
                </span>
              </div>

              <div style={{ fontSize: "0.8rem", color: "#047857", fontWeight: 600 }}>
                +12.4% vs Previous Term
              </div>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(196, 154, 108, 0.3)",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 4px 14px rgba(36, 26, 20, 0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                WELFARE FUND IMPACT
              </span>

              <div style={{ margin: "14px 0 8px" }}>
                <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "#D35400", letterSpacing: "-0.03em" }}>
                  {formatTaka(84500, false)}
                </span>
              </div>

              <div style={{ fontSize: "0.8rem", color: "#8C7A6A" }}>
                Rank #2 Institutionally in Bangladesh
              </div>
            </div>
          </div>

          {/* LEVEL 3: APPROVAL CENTER & AUDIT SPLIT VIEW */}
          <div className="ms-grid-2">
            
            {/* EXECUTIVE APPROVAL CENTER */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#241A14" }}>
                  Executive Approval Queue
                </h2>
                <StatusBadge status={pendingHeadApps.length > 0 ? "action_required" : "verified"} customLabel={`${pendingHeadApps.length} Action Needed`} />
              </div>

              {pendingHeadApps.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px" }}>
                  <CheckCircle2 size={42} style={{ color: "#047857", margin: "0 auto 10px" }} />
                  <p style={{ margin: 0, color: "#66564A", fontSize: "0.9rem" }}>No pending partial payment requests awaiting executive sign-off.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {pendingHeadApps.map((app) => (
                    <div key={app.id} style={{ padding: "16px", background: "#FFFFFF", borderRadius: "12px", border: "1px solid rgba(196, 154, 108, 0.3)", boxShadow: "0 2px 8px rgba(36, 26, 20, 0.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#241A14" }}>{app.studentName} ({app.studentId})</h4>
                          <span style={{ fontSize: "0.78rem", color: "#66564A" }}>Fee: {app.feeTitle}</span>
                        </div>
                        <StatusBadge status="under_review" customLabel="Forwarded by Admin" />
                      </div>

                      <div style={{ margin: "10px 0", padding: "8px 12px", background: "#FDF9F3", borderRadius: "8px", fontSize: "0.82rem", color: "#66564A" }}>
                        <span>Req: <strong style={{ color: "#047857" }}>{formatTaka(app.requestedAmount, false)}</strong> / Orig: {formatTaka(app.originalAmount, false)}</span> • AI Signature: <strong style={{ color: "#047857" }}>{app.aiMatchScore}% Match</strong>
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button type="button" className="ms-btn-primary" style={{ background: "#D35400", color: "#FFFFFF", padding: "6px 14px", fontSize: "0.82rem", borderRadius: "8px" }} onClick={() => setExecApp(app)}>
                          Executive Review & Decide →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* EXECUTIVE AUDIT ACTIVITY */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#241A14" }}>
                Recent Operational Audit Trail
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {store.auditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} style={{ padding: "12px", background: "#FFFFFF", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.25)", fontSize: "0.85rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#D35400" }}>
                      <strong>{log.actor} ({log.role})</strong>
                      <span style={{ color: "#8C7A6A", fontSize: "0.75rem" }}>{log.timestamp}</span>
                    </div>
                    <p style={{ margin: "2px 0 0", color: "#241A14" }}>{log.action}: {log.details}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. APPROVAL CENTER TAB */}
      {activeTab === "approvals" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#241A14" }}>
              Executive Approval Center
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
              Final institutional sign-off for financial hardship and partial payment requests.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {store.partialApplications.map((app) => (
              <div key={app.id} style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#241A14" }}>{app.studentName} ({app.studentId})</h3>
                    <StatusBadge status={app.status.startsWith("approved") ? "approved" : app.status.startsWith("rejected") ? "rejected" : "under_review"} />
                  </div>
                  <p style={{ margin: "0 0 6px", fontSize: "0.85rem", color: "#66564A" }}>
                    Fee: {app.feeTitle} • Reason: "{app.reason}"
                  </p>
                  <div style={{ fontSize: "0.78rem", color: "#047857" }}>
                    AI Signature Validation Match: <strong>{app.aiMatchScore}% (High Similarity)</strong>
                  </div>
                </div>

                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                  <div>
                    <span style={{ fontSize: "0.85rem", color: "#8C7A6A", textDecoration: "line-through", marginRight: "6px" }}>{formatTaka(app.originalAmount, false)}</span>
                    <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#047857" }}>{formatTaka(app.requestedAmount, false)}</span>
                  </div>

                  {app.status === "forwarded_head" ? (
                    <button type="button" className="ms-btn-primary" style={{ background: "#D35400", color: "#FFFFFF", padding: "8px 16px", fontSize: "0.85rem", borderRadius: "10px", fontWeight: 700 }} onClick={() => setExecApp(app)}>
                      Decide Application
                    </button>
                  ) : (
                    <span style={{ fontSize: "0.8rem", color: "#8C7A6A" }}>Decision Rendered</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. HEAD TROPHY & INSTITUTION IMPACT CENTER (PHASE 9) 🏆 */}
      {activeTab === "trophy" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* HEADER WITH SMALL TROPHY ICON */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "18px", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "52px", height: "52px", background: "rgba(211, 84, 0, 0.12)", border: "1px solid #D35400", borderRadius: "14px", display: "grid", placeItems: "center", color: "#D35400" }}>
                <Trophy size={28} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#241A14" }}>
                    Institution Impact & Student Welfare
                  </h1>
                  <span style={{ fontSize: "0.74rem", background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "3px 10px", borderRadius: "999px", fontWeight: 700, color: "#D35400" }}>
                    Dhaka City College
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                  Executive oversight of student welfare fund contributions, rankings, and peer tuition assistance grants.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.74rem", textTransform: "uppercase", color: "#8C7A6A", fontWeight: 700 }}>National Ranking</span>
                <h2 style={{ margin: "2px 0 0", fontSize: "1.6rem", fontWeight: 800, color: "#D35400" }}>#18 Nationwide</h2>
              </div>
            </div>
          </div>

          {/* METRIC SUMMARY CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            <div style={{ background: "#FFFFFF", border: "2px solid #D35400", borderRadius: "14px", padding: "20px" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#D35400", textTransform: "uppercase" }}>Total Demo Contribution Raised</span>
              <h2 style={{ margin: "4px 0 0", fontSize: "2rem", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                {formatTaka(84500, false)}
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 600, marginTop: "2px", display: "block" }}>
                100% Allocated for Peer Tuition Grants
              </span>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Total Institution Impact Points</span>
              <h2 style={{ margin: "4px 0 0", fontSize: "2rem", fontWeight: 800, color: "#241A14" }}>
                845 Impact Pts
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#66564A", marginTop: "2px", display: "block" }}>
                Formula: ৳100 = 1 Point
              </span>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Active Student Donors</span>
              <h2 style={{ margin: "4px 0 0", fontSize: "2rem", fontWeight: 800, color: "#047857" }}>
                142 Students
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#66564A", marginTop: "2px", display: "block" }}>
                Participating across all departments
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            
            {/* TOP CONTRIBUTORS LEADERBOARD */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#241A14" }}>
                  Top Student Contributors
                </h3>
                <span style={{ fontSize: "0.76rem", color: "#8C7A6A", fontWeight: 600 }}>
                  Institution Top Rankings
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { rank: 1, name: "Tanvir Rahman", dept: "CSE 3rd Sem", amount: 2500, points: 25, badge: "🥇" },
                  { rank: 2, name: "Anika Tabassum", dept: "BBA 2nd Sem", amount: 1200, points: 12, badge: "🥈" },
                  { rank: 3, name: store.studentProfile.name, dept: "CSE 1st Year", amount: store.donations.totalDonated, points: store.donations.points, badge: "🥉" },
                  { rank: 4, name: "Sajid Khan", dept: "EEE 1st Sem", amount: 400, points: 4, badge: "4" },
                  { rank: 5, name: "Aria Rahman", dept: "CSE 3rd Sem", amount: 200, points: 2, badge: "5" },
                ].map((st) => (
                  <div
                    key={st.rank}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 14px",
                      background: st.rank <= 3 ? "#FFF7E6" : "#FDF9F3",
                      borderRadius: "10px",
                      border: st.rank <= 3 ? "1px solid rgba(211, 84, 0, 0.3)" : "1px solid rgba(196, 154, 108, 0.2)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "1.1rem" }}>{st.badge}</span>
                      <div>
                        <h5 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#241A14" }}>{st.name}</h5>
                        <span style={{ fontSize: "0.78rem", color: "#66564A" }}>{st.dept} • {formatTaka(st.amount, false)}</span>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: "#D35400", fontSize: "0.92rem" }}>{st.points} Pts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DEPARTMENT BREAKDOWN & DISBURSEMENT ALLOCATION */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: "1.1rem", fontWeight: 700, color: "#241A14" }}>
                  Departmental Contribution Breakdown
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { dept: "Computer Science & Engineering", amount: 42000, points: 420, icon: "💻" },
                    { dept: "Business Administration (BBA)", amount: 26500, points: 265, icon: "📊" },
                    { dept: "Electrical & Electronic Eng", amount: 16000, points: 160, icon: "⚡" },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#FDF9F3", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.2)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                        <div>
                          <h4 style={{ margin: 0, color: "#241A14", fontSize: "0.88rem", fontWeight: 700 }}>{item.dept}</h4>
                          <span style={{ fontSize: "0.76rem", color: "#66564A" }}>{item.points} Total Points</span>
                        </div>
                      </div>
                      <strong style={{ color: "#D35400", fontSize: "0.95rem" }}>{formatTaka(item.amount, false)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: "1.1rem", fontWeight: 700, color: "#241A14" }}>
                  Demo Fund Disbursement & Impact Allocation
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ padding: "12px 14px", background: "#FDF9F3", borderRadius: "10px", borderLeft: "4px solid #047857", color: "#241A14", fontSize: "0.85rem" }}>
                    <strong style={{ color: "#047857" }}>Emergency Medical Relief:</strong> ৳35,000 disbursed to 7 students.
                  </div>
                  <div style={{ padding: "12px 14px", background: "#FDF9F3", borderRadius: "10px", borderLeft: "4px solid #D35400", color: "#241A14", fontSize: "0.85rem" }}>
                    <strong style={{ color: "#D35400" }}>Tuition Hardship Subsidies:</strong> ৳49,500 offset for partial payment applicants.
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* EXECUTIVE DECISION MODAL */}
      {execApp && (
        <div className="ms-modal-overlay">
          <div className="ms-modal" style={{ maxWidth: "620px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ShieldCheck size={28} style={{ color: "#D35400" }} />
                <div>
                  <h3 style={{ margin: 0, color: "#241A14", fontSize: "1.2rem", fontWeight: 700 }}>Executive Sign-Off & Approval</h3>
                  <span style={{ fontSize: "0.78rem", color: "#66564A" }}>Application ID: {execApp.id}</span>
                </div>
              </div>
              <button type="button" onClick={() => setExecApp(null)} style={{ background: "none", border: "none", color: "#66564A", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: "#FDF9F3", padding: "16px", borderRadius: "12px", border: "1px solid rgba(196, 154, 108, 0.3)", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.88rem", marginBottom: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <p style={{ margin: 0, color: "#66564A" }}>
                  Student: <strong style={{ color: "#241A14" }}>{execApp.studentName} ({execApp.studentId})</strong>
                </p>
                <p style={{ margin: 0, color: "#66564A" }}>
                  Fee Item: <strong style={{ color: "#241A14" }}>{execApp.feeTitle}</strong>
                </p>
              </div>

              <p style={{ margin: 0, color: "#66564A" }}>
                Requested Partial Payment: <strong style={{ color: "#047857", fontSize: "1.1rem" }}>{formatTaka(execApp.requestedAmount, false)}</strong> (Original Assigned Fee: {formatTaka(execApp.originalAmount, false)})
              </p>

              <p style={{ margin: 0, color: "#66564A" }}>
                Stated Hardship Reason: <span style={{ color: "#241A14" }}>"{execApp.reason}"</span>
              </p>

              {execApp.adminNotes && (
                <div style={{ background: "#FFFFFF", padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(196, 154, 108, 0.25)", fontSize: "0.8rem", color: "#66564A" }}>
                  Admin Recommendation: <strong style={{ color: "#241A14" }}>"{execApp.adminNotes}"</strong>
                </div>
              )}

              <div style={{ background: "rgba(16, 185, 129, 0.12)", padding: "8px 12px", borderRadius: "8px", color: "#047857", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                <span>AI Signature Match Score: <strong>{execApp.aiMatchScore}% Similarity</strong></span>
                <span>Guardian NID & Signature Verified</span>
              </div>
            </div>

            {/* EXECUTIVE ADJUSTMENT CONTROLS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>
              <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#241A14" }}>Executive Plan Assignment</h4>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>
                    Approved Installment 1 Amount (৳)
                  </label>
                  <input
                    type="number"
                    value={approvedAmountInput || execApp.requestedAmount}
                    onChange={(e) => setApprovedAmountInput(Number(e.target.value))}
                    style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", fontWeight: 800 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>
                    New Deadline for Installment 2
                  </label>
                  <input
                    type="date"
                    value={newDeadlineInput}
                    onChange={(e) => setNewDeadlineInput(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", fontWeight: 600 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button type="button" className="ms-btn-primary" style={{ background: "#047857", color: "#FFFFFF", padding: "12px", borderRadius: "10px", fontWeight: 700, fontSize: "0.92rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }} onClick={() => handleExecutiveApprove(execApp.id)}>
                <CheckCircle2 size={18} /> Executive Approve & Unlock Partial Payment
              </button>

              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <input
                  type="text"
                  placeholder="Feedback notes (for change request or decline)..."
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  style={{ flex: 1, padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontSize: "0.82rem" }}
                />
                <button type="button" onClick={() => handleExecutiveRequestChanges(execApp.id)} style={{ color: "#D35400", background: "#FDF9F3", border: "1px solid rgba(211, 84, 0, 0.3)", padding: "8px 12px", borderRadius: "10px", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}>
                  Request Changes
                </button>
                <button type="button" className="ms-btn-secondary" style={{ color: "#BE123C", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "8px 14px", borderRadius: "10px", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }} onClick={() => handleExecutiveDecline(execApp.id)}>
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
