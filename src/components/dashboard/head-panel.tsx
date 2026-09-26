/**
 * Head / Authority Panel Component — Executive Institutional Command Center
 * 
 * Feel: Executive, spacious, decision-focused (Reads → Reviews → Decides)
 * Features:
 * 1. Executive Financial Overview & Institutional Health Metrics
 * 2. Approval Center (Final executive sign-off on forwarded partial payment requests)
 * 3. Impact Center & Head Trophy 🏆 (Institution-wide donation ranking & social impact metrics)
 * 4. Executive Reports & Audit Logs
 * 5. Strict Permission Enforcement (Head cannot alter raw fee records or bulk edit students)
 */

import { useState } from "react";
import { useNeoStore, PartialApplication } from "@/lib/neo-cash-store";
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
  const [declineReason, setDeclineReason] = useState("");

  const pendingHeadApps = store.partialApplications.filter((a) => a.status === "forwarded_head");

  const handleExecutiveApprove = (appId: string) => {
    actions.headApprovePartial(appId);
    setExecApp(null);
    alert(`Executive Approval granted for Application ${appId}! Partial payment of ৳${execApp?.requestedAmount.toLocaleString()} is now unlocked for the student.`);
  };

  const handleExecutiveDecline = (appId: string) => {
    if (!declineReason.trim()) return alert("Enter executive decline reason.");
    actions.rejectPartial(appId, declineReason, "Head");
    setExecApp(null);
    setDeclineReason("");
    alert(`Application ${appId} declined.`);
  };

  return (
    <div>
      {/* 1. EXECUTIVE COMMAND CENTER OVERVIEW */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Executive Header Banner */}
          <div style={{ background: "linear-gradient(135deg, rgba(79, 70, 229, 0.3) 0%, rgba(30, 58, 138, 0.5) 100%)", border: "1px solid var(--ms-accent)", borderRadius: "18px", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="ms-role-badge" style={{ background: "rgba(167, 136, 250, 0.2)", color: "var(--ms-accent)" }}>
                  Executive Sign-Off Authority
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)" }}>Dhaka City College</span>
              </div>
              <h2 style={{ fontSize: "1.5rem", margin: "6px 0 2px", color: "#FFF" }}>
                Executive Command Center • Director Office
              </h2>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--ms-lavender)" }}>
                Prof. Dr. M. A. Karim • Director & Financial Oversight Authority
              </p>
            </div>

            <button type="button" className="ms-btn-primary" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }} onClick={() => setActiveTab("trophy")}>
              <Trophy size={18} /> Impact Center 🏆
            </button>
          </div>

          {/* Executive Key Performance Metrics */}
          <div className="ms-grid-3">
            <div className="ms-card" style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #0D182A 100%)" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--ms-text-muted)", textTransform: "uppercase" }}>Pending Executive Approvals</span>
              <h3 style={{ fontSize: "2.2rem", color: pendingHeadApps.length > 0 ? "#FBBF24" : "#34D399", margin: "8px 0 4px" }}>
                {pendingHeadApps.length}
              </h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--ms-text-muted)" }}>
                {pendingHeadApps.length > 0 ? "Requires Executive Action" : "All Applications Decisioned"}
              </p>
            </div>

            <div className="ms-card">
              <span style={{ fontSize: "0.78rem", color: "var(--ms-text-muted)", textTransform: "uppercase" }}>Total Institutional Solvency</span>
              <h3 style={{ fontSize: "2.2rem", color: "#34D399", margin: "8px 0 4px" }}>৳4.82M</h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#34D399" }}>+12.4% vs Previous Term</p>
            </div>

            <div className="ms-card">
              <span style={{ fontSize: "0.78rem", color: "var(--ms-text-muted)", textTransform: "uppercase" }}>Institution Social Impact</span>
              <h3 style={{ fontSize: "2.2rem", color: "var(--ms-accent)", margin: "8px 0 4px" }}>৳84,500</h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--ms-lavender)" }}>Rank #2 Institutionally in BD</p>
            </div>
          </div>

          {/* Pending Approval Center & Executive Audit Split View */}
          <div className="ms-grid-2">
            {/* Approval Center Box */}
            <div className="ms-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#FFF" }}>Executive Approval Center</h3>
                <span className="ms-badge ms-badge--pending_partial">{pendingHeadApps.length} Action Needed</span>
              </div>

              {pendingHeadApps.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px", background: "rgba(30, 58, 138, 0.15)", borderRadius: "14px" }}>
                  <CheckCircle2 size={42} style={{ color: "#34D399", margin: "0 auto 10px" }} />
                  <p style={{ margin: 0, color: "var(--ms-text-muted)", fontSize: "0.9rem" }}>No pending partial payment requests awaiting executive sign-off.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {pendingHeadApps.map((app) => (
                    <div key={app.id} style={{ padding: "16px", background: "rgba(30, 58, 138, 0.25)", borderRadius: "14px", border: "1px solid var(--ms-border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#FFF" }}>{app.studentName} ({app.studentId})</h4>
                          <span style={{ fontSize: "0.78rem", color: "var(--ms-text-muted)" }}>Fee: {app.feeTitle}</span>
                        </div>
                        <span className="ms-badge ms-badge--pending_partial">Forwarded by Admin</span>
                      </div>

                      <div style={{ margin: "10px 0", padding: "8px 12px", background: "rgba(167, 136, 250, 0.1)", borderRadius: "8px", fontSize: "0.82rem", color: "var(--ms-lavender)" }}>
                        <span>Req: <strong>৳{app.requestedAmount.toLocaleString()}</strong> / Orig: ৳{app.originalAmount.toLocaleString()}</span> • AI Match: <strong style={{ color: "#34D399" }}>{app.aiMatchScore}% Similarity</strong>
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button type="button" className="ms-btn-primary" style={{ padding: "6px 14px", fontSize: "0.82rem" }} onClick={() => setExecApp(app)}>
                          Executive Review & Decide →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Executive Audit Activity */}
            <div className="ms-card">
              <h3 style={{ margin: "0 0 16px", fontSize: "1.1rem", color: "#FFF" }}>Recent Operational Audit Trail</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {store.auditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} style={{ padding: "10px 12px", background: "rgba(30, 58, 138, 0.2)", borderRadius: "10px", border: "1px solid var(--ms-border)", fontSize: "0.82rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ms-lavender)" }}>
                      <strong>{log.actor} ({log.role})</strong>
                      <span style={{ color: "var(--ms-text-dim)", fontSize: "0.75rem" }}>{log.timestamp}</span>
                    </div>
                    <p style={{ margin: "2px 0 0", color: "#FFF" }}>{log.action}: {log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. APPROVAL CENTER TAB */}
      {activeTab === "approvals" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", margin: 0, color: "#FFF" }}>Executive Approval Center</h2>
            <p style={{ margin: "4px 0 0", color: "var(--ms-text-muted)", fontSize: "0.88rem" }}>
              Final institutional sign-off for financial hardship and partial payment requests.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {store.partialApplications.map((app) => (
              <div key={app.id} className="ms-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#FFF" }}>{app.studentName} ({app.studentId})</h3>
                    <span className={`ms-badge ms-badge--${app.status.startsWith("approved") ? "paid" : app.status.startsWith("rejected") ? "overdue" : "pending_partial"}`}>
                      {app.status.replace("_", " ")}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 6px", fontSize: "0.85rem", color: "var(--ms-text-muted)" }}>
                    Fee: {app.feeTitle} • Reason: "{app.reason}"
                  </p>
                  <div style={{ fontSize: "0.78rem", color: "var(--ms-accent)" }}>
                    AI Signature Validation Match: <strong>{app.aiMatchScore}% (High Similarity)</strong>
                  </div>
                </div>

                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                  <div>
                    <span style={{ fontSize: "0.85rem", color: "var(--ms-text-dim)", textDecoration: "line-through", marginRight: "6px" }}>৳{app.originalAmount.toLocaleString()}</span>
                    <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "#34D399" }}>৳{app.requestedAmount.toLocaleString()}</span>
                  </div>

                  {app.status === "forwarded_head" ? (
                    <button type="button" className="ms-btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem" }} onClick={() => setExecApp(app)}>
                      Decide Application
                    </button>
                  ) : (
                    <span style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)" }}>Decision Rendered</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. HEAD TROPHY & IMPACT CENTER TAB 🏆 */}
      {activeTab === "trophy" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Trophy Banner */}
          <div style={{ background: "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)", borderRadius: "18px", padding: "24px", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "64px", height: "64px", background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "grid", placeItems: "center", fontSize: "2.2rem" }}>
                🏆
              </div>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: "1.5rem" }}>Dhaka City College Impact Center</h2>
                <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.9 }}>
                  Institutional Philanthropy & Student Welfare Leaderboard
                </p>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.8rem", textTransform: "uppercase", opacity: 0.8 }}>National Ranking</span>
              <h3 style={{ margin: "2px 0 0", fontSize: "2rem" }}>#2 Overall</h3>
            </div>
          </div>

          {/* Department Rankings Grid */}
          <div className="ms-grid-2">
            <div className="ms-card">
              <h3 style={{ margin: "0 0 16px", fontSize: "1.1rem", color: "#FFF" }}>Top Donating Departments</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { rank: "1st", dept: "Computer Science & Engineering", amount: 42000, points: 420, icon: "🥇" },
                  { rank: "2nd", dept: "Business Administration (BBA)", amount: 26500, points: 265, icon: "🥈" },
                  { rank: "3rd", dept: "Electrical & Electronic Eng", amount: 16000, points: 160, icon: "🥉" },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(30, 58, 138, 0.25)", borderRadius: "12px", border: "1px solid var(--ms-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                      <div>
                        <h4 style={{ margin: 0, color: "#FFF", fontSize: "0.92rem" }}>{item.dept}</h4>
                        <span style={{ fontSize: "0.78rem", color: "var(--ms-text-muted)" }}>{item.points} Total Points</span>
                      </div>
                    </div>
                    <span style={{ fontWeight: "800", color: "var(--ms-accent)", fontSize: "1rem" }}>৳{item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ms-card">
              <h3 style={{ margin: "0 0 16px", fontSize: "1.1rem", color: "#FFF" }}>Welfare Fund Utilization</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ padding: "12px", background: "rgba(16, 185, 129, 0.12)", borderRadius: "10px", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34D399" }}>
                  <strong>Emergency Medical Support:</strong> ৳35,000 disbursed to 7 students.
                </div>
                <div style={{ padding: "12px", background: "rgba(79, 70, 229, 0.12)", borderRadius: "10px", border: "1px solid var(--ms-border)", color: "var(--ms-lavender)" }}>
                  <strong>Partial Fee Subsidy:</strong> ৳49,500 offset for hardship cases.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXECUTIVE DECISION MODAL */}
      {execApp && (
        <div className="ms-modal-overlay">
          <div className="ms-modal" style={{ maxWidth: "600px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <ShieldCheck size={28} style={{ color: "var(--ms-accent)" }} />
              <div>
                <h3 style={{ margin: 0, color: "#FFF" }}>Executive Sign-Off & Approval</h3>
                <span style={{ fontSize: "0.78rem", color: "var(--ms-text-muted)" }}>Application {execApp.id}</span>
              </div>
            </div>

            <div style={{ background: "rgba(30, 58, 138, 0.25)", padding: "16px", borderRadius: "14px", border: "1px solid var(--ms-border)", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.88rem", marginBottom: "16px" }}>
              <p style={{ margin: 0, color: "var(--ms-text-muted)" }}>
                Student: <strong style={{ color: "#FFF" }}>{execApp.studentName} ({execApp.studentId})</strong>
              </p>
              <p style={{ margin: 0, color: "var(--ms-text-muted)" }}>
                Fee Item: <strong style={{ color: "#FFF" }}>{execApp.feeTitle}</strong>
              </p>
              <p style={{ margin: 0, color: "var(--ms-text-muted)" }}>
                Requested Partial Payment: <strong style={{ color: "#34D399", fontSize: "1.1rem" }}>৳{execApp.requestedAmount.toLocaleString()}</strong> (Original: ৳{execApp.originalAmount.toLocaleString()})
              </p>
              <p style={{ margin: 0, color: "var(--ms-text-muted)" }}>
                Stated Hardship Reason: <span style={{ color: "var(--ms-light)" }}>"{execApp.reason}"</span>
              </p>
              <div style={{ background: "rgba(16, 185, 129, 0.15)", padding: "8px 12px", borderRadius: "8px", color: "#34D399", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                <span>AI Signature Match Score: <strong>96% Similarity</strong></span>
                <span>Guardian NID & Signature Verified</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button type="button" className="ms-btn-primary" style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" }} onClick={() => handleExecutiveApprove(execApp.id)}>
                <CheckCircle2 size={18} /> Executive Approve & Unlock Partial Payment
              </button>

              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <input
                  type="text"
                  placeholder="Reason if declining..."
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  style={{ flex: 1, padding: "8px 12px", background: "rgba(30, 58, 138, 0.3)", border: "1px solid var(--ms-border)", borderRadius: "10px", color: "#FFF", outline: "none", fontSize: "0.82rem" }}
                />
                <button type="button" className="ms-btn-secondary" style={{ color: "#F87171" }} onClick={() => handleExecutiveDecline(execApp.id)}>
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
