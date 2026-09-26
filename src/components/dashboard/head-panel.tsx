/**
 * Head / Authority Panel Component — Executive Institutional Command Center (PHASE 19)
 * 
 * Executive Information Architecture Guidelines:
 * - High-Level Authority: Final institutional approval authority (NOT an admin).
 * - Calm, Executive Palette: #FFF7E6 (Warm Ivory), #FFFFFF (Surface), #241A14 (Text), #D35400 (Accent), #047857 (Success).
 * - Primary Focus: Immediate understanding of pending decisions, past decisions, financial health, and audit logs.
 * - Strict Governance: READ-ONLY access to student directory, audit logs, and fee structures. Operational editing disabled.
 */

import { useState } from "react";
import { useNeoStore, PartialApplication, StudentRecord, AuditLog } from "@/lib/neo-cash-store";
import { StatusBadge } from "@/components/design-system/status-badge";
import { formatTaka } from "@/components/design-system/tokens";
import {
  Trophy, ShieldCheck, CheckCircle2, XCircle, AlertCircle, FileText,
  TrendingUp, Users, DollarSign, Building2, X, Sparkles, Filter,
  Search, Eye, AlertTriangle, Clock, Layers, Lock, ArrowUpRight, RefreshCw, Send
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

  // Approval Center Filter Tab
  const [approvalSubTab, setApprovalSubTab] = useState<"all" | "pending" | "approved" | "rejected" | "changes">("pending");

  // Read-Only Student Directory State
  const [headStudentSearch, setHeadStudentSearch] = useState("");
  const [headDeptFilter, setHeadDeptFilter] = useState("all");
  const [selectedStudentHead, setSelectedStudentHead] = useState<StudentRecord | null>(null);

  // Read-Only Audit Search State
  const [headAuditSearch, setHeadAuditSearch] = useState("");
  const [headAuditRoleFilter, setHeadAuditRoleFilter] = useState("all");

  // Read-Only Audit Event Dossier Modal
  const [selectedAuditLogHead, setSelectedAuditLogHead] = useState<AuditLog | null>(null);

  const pendingHeadApps = store.partialApplications.filter((a) => a.status === "forwarded_head");
  const approvedHeadApps = store.partialApplications.filter((a) => a.status === "approved_head" || a.status === "approved");
  const rejectedHeadApps = store.partialApplications.filter((a) => a.status.includes("rejected"));

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
          
          {/* LEVEL 1: HERO & INSTITUTIONAL AUTHORIZATION BANNER */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "18px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.74rem", background: "rgba(211, 84, 0, 0.12)", color: "#D35400", border: "1px solid rgba(211, 84, 0, 0.3)", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>
                  ⚖️ Executive Approval Authority & Final Sign-Off
                </span>
                <span style={{ fontSize: "0.82rem", color: "#66564A", fontWeight: 600 }}>Dhaka City College</span>
              </div>
              <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.02em" }}>
                Executive Command Center
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                Prof. Dr. M. A. Karim • Director & Final Financial Oversight Authority
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="ms-btn-primary"
                onClick={() => setActiveTab("approvals")}
                style={{ background: "#D35400", color: "#FFFFFF", padding: "10px 18px", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 12px rgba(211, 84, 0, 0.25)" }}
              >
                <ShieldCheck size={18} /> Review Approvals ({pendingHeadApps.length})
              </button>
            </div>
          </div>

          {/* LEVEL 2: EXECUTIVE DECISION & FINANCIAL METRICS CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "16px" }}>
            
            {/* CARD 1: PENDING DECISIONS */}
            <div style={{ background: "#FFFFFF", border: pendingHeadApps.length > 0 ? "2px solid #D35400" : "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Awaiting My Decision
                </span>
                <Clock size={18} color="#D35400" />
              </div>
              <div style={{ margin: "14px 0 8px" }}>
                <span style={{ fontSize: "2.2rem", fontWeight: 800, color: pendingHeadApps.length > 0 ? "#D35400" : "#241A14" }}>
                  {pendingHeadApps.length}
                </span>
                <span style={{ fontSize: "0.85rem", color: "#66564A", marginLeft: "6px" }}>Applications</span>
              </div>
              <span style={{ fontSize: "0.78rem", color: pendingHeadApps.length > 0 ? "#D35400" : "#047857", fontWeight: 700 }}>
                {pendingHeadApps.length > 0 ? "● Action Required Immediately" : "✓ All Applications Cleared"}
              </span>
            </div>

            {/* CARD 2: APPROVED DECISIONS */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Executive Approved
                </span>
                <CheckCircle2 size={18} color="#047857" />
              </div>
              <div style={{ margin: "14px 0 8px" }}>
                <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "#047857" }}>
                  {approvedHeadApps.length}
                </span>
                <span style={{ fontSize: "0.85rem", color: "#66564A", marginLeft: "6px" }}>Authorized</span>
              </div>
              <span style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 700 }}>
                Installments & Waivers Granted
              </span>
            </div>

            {/* CARD 3: REJECTED DECISIONS */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Declined / Rejected
                </span>
                <XCircle size={18} color="#BE123C" />
              </div>
              <div style={{ margin: "14px 0 8px" }}>
                <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "#241A14" }}>
                  {rejectedHeadApps.length}
                </span>
                <span style={{ fontSize: "0.85rem", color: "#66564A", marginLeft: "6px" }}>Closed</span>
              </div>
              <span style={{ fontSize: "0.78rem", color: "#8C7A6A", fontWeight: 600 }}>
                Non-compliant Requests
              </span>
            </div>

            {/* CARD 4: FINANCIAL SOLVENCY */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Fee Collections To Date
                </span>
                <DollarSign size={18} color="#047857" />
              </div>
              <div style={{ margin: "14px 0 8px" }}>
                <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                  {formatTaka(4820000, false)}
                </span>
              </div>
              <span style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 700 }}>
                +12.4% vs Previous Term
              </span>
            </div>

          </div>

          {/* IMPORTANT ALERTS & NOTICE BANNER */}
          <div style={{ background: "#FFF7E6", border: "1.5px solid #D35400", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
            <AlertTriangle size={24} color="#D35400" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <strong style={{ fontSize: "0.95rem", color: "#D35400", fontWeight: 800 }}>
                INSTITUTION EXECUTIVE NOTICE: {pendingHeadApps.length} PARTIAL PAYMENT DOSSIERS AWAITING SIGN-OFF
              </strong>
              <p style={{ margin: 0, fontSize: "0.86rem", color: "#241A14", lineHeight: 1.4 }}>
                Administrative staff have verified student profiles, guardian NIDs, and AI signature match scores (96.4% average similarity). Final executive sign-off is required to approve split installment schedules or grant tuition hardship waivers.
              </p>
            </div>
          </div>

          {/* TWO COLUMN GRID: APPROVAL QUEUE & RECENT AUDIT HISTORY */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            
            {/* PENDING APPROVAL QUEUE CARD */}
            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                    Awaiting Executive Approval
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: "#66564A" }}>
                    {pendingHeadApps.length} dossier(s) forwarded by Admin
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("approvals")}
                  style={{ background: "none", border: "none", color: "#D35400", fontSize: "0.82rem", fontWeight: 800, cursor: "pointer" }}
                >
                  View All →
                </button>
              </div>

              {pendingHeadApps.length === 0 ? (
                <div style={{ textAlign: "center", padding: "36px 20px", background: "#FDF9F3", borderRadius: "12px", border: "1px dashed rgba(196, 154, 108, 0.3)" }}>
                  <CheckCircle2 size={36} color="#047857" style={{ margin: "0 auto 8px" }} />
                  <strong style={{ color: "#241A14", display: "block" }}>All Applications Cleared</strong>
                  <span style={{ fontSize: "0.82rem", color: "#66564A" }}>There are no pending applications awaiting your decision.</span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {pendingHeadApps.slice(0, 3).map((app) => (
                    <div key={app.id} style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <strong style={{ color: "#241A14", fontSize: "0.92rem", display: "block" }}>{app.studentName}</strong>
                          <span style={{ fontSize: "0.78rem", color: "#8C7A6A", fontFamily: "monospace" }}>ID: {app.studentId} • {app.feeTitle}</span>
                        </div>
                        <span style={{ fontSize: "0.74rem", background: "rgba(211, 84, 0, 0.12)", color: "#D35400", padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>
                          AI Match: {app.aiMatchScore}%
                        </span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(196, 154, 108, 0.2)", paddingTop: "8px", marginTop: "2px" }}>
                        <span style={{ fontSize: "0.84rem", color: "#66564A" }}>
                          Requested: <strong style={{ color: "#047857" }}>{formatTaka(app.requestedAmount, false)}</strong> / {formatTaka(app.originalAmount, false)}
                        </span>

                        <button
                          type="button"
                          onClick={() => setExecApp(app)}
                          style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "6px 14px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 800, cursor: "pointer" }}
                        >
                          Review & Decide →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RECENT DECISIONS & AUDIT FEED CARD */}
            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                    Recent Executive & Admin Audit Feed
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: "#66564A" }}>
                    Latest institutional actions logged to immutable trail
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("audit")}
                  style={{ background: "none", border: "none", color: "#D35400", fontSize: "0.82rem", fontWeight: 800, cursor: "pointer" }}
                >
                  Full Trail →
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {store.auditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.25)", borderRadius: "10px", padding: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "#D35400" }}>{log.actor} ({log.role})</span>
                      <span style={{ fontSize: "0.74rem", color: "#8C7A6A", fontFeatureSettings: "'tnum'" }}>{log.timestamp}</span>
                    </div>
                    <strong style={{ fontSize: "0.86rem", color: "#241A14" }}>{log.action}</strong>
                    <span style={{ fontSize: "0.8rem", color: "#66564A" }}>{log.details}</span>
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
          
          {/* APPROVAL CENTER HEADER */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "18px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.74rem", background: "rgba(211, 84, 0, 0.12)", color: "#D35400", border: "1px solid rgba(211, 84, 0, 0.3)", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>
                  🛡️ Institutional Authority Sign-Off Center
                </span>
                <span style={{ fontSize: "0.82rem", color: "#66564A", fontWeight: 600 }}>Dhaka City College</span>
              </div>
              <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.02em" }}>
                Executive Approval Center
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                Final executive decisioning for student partial payment applications, installment schedules, and tuition hardship grants.
              </p>
            </div>
          </div>

          {/* SUB-TAB FILTER BUTTONS */}
          <div style={{ display: "flex", gap: "8px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "6px", flexWrap: "wrap" }}>
            {[
              { id: "pending", label: `Awaiting Head Approval (${pendingHeadApps.length})` },
              { id: "all", label: `All Dossiers (${store.partialApplications.length})` },
              { id: "approved", label: `Approved (${approvedHeadApps.length})` },
              { id: "rejected", label: `Declined (${rejectedHeadApps.length})` },
              { id: "changes", label: `Changes Requested (${store.partialApplications.filter(a => a.status === "changes_requested").length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setApprovalSubTab(tab.id as any)}
                style={{
                  padding: "8px 16px",
                  background: approvalSubTab === tab.id ? "#FFFFFF" : "transparent",
                  border: approvalSubTab === tab.id ? "1px solid rgba(196, 154, 108, 0.4)" : "none",
                  borderRadius: "8px",
                  color: approvalSubTab === tab.id ? "#D35400" : "#66564A",
                  fontWeight: approvalSubTab === tab.id ? 800 : 600,
                  fontSize: "0.84rem",
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* DOSSIER CARDS LIST */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {store.partialApplications
              .filter((app) => {
                if (approvalSubTab === "pending") return app.status === "forwarded_head";
                if (approvalSubTab === "approved") return app.status === "approved_head" || app.status === "approved";
                if (approvalSubTab === "rejected") return app.status.includes("rejected");
                if (approvalSubTab === "changes") return app.status === "changes_requested";
                return true;
              })
              .map((app) => (
                <div key={app.id} style={{ background: "#FFFFFF", border: app.status === "forwarded_head" ? "2px solid #D35400" : "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "600px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#241A14" }}>
                        {app.studentName}
                      </h3>
                      <span style={{ fontSize: "0.8rem", color: "#D35400", fontFamily: "monospace", fontWeight: 700, background: "rgba(211, 84, 0, 0.1)", padding: "2px 8px", borderRadius: "6px" }}>
                        {app.studentId}
                      </span>
                      <StatusBadge
                        status={app.status === "approved_head" || app.status === "approved" ? "approved" : app.status.includes("rejected") ? "rejected" : "pending"}
                        customLabel={app.status === "forwarded_head" ? "Awaiting Head Approval" : app.status.replace("_", " ").toUpperCase()}
                      />
                    </div>

                    <p style={{ margin: 0, fontSize: "0.88rem", color: "#66564A", lineHeight: 1.4 }}>
                      Fee Record: <strong style={{ color: "#241A14" }}>{app.feeTitle}</strong> • Reason: "{app.reason}"
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.78rem", marginTop: "2px" }}>
                      <span style={{ color: "#047857", fontWeight: 700 }}>
                        AI Signature Match: {app.aiMatchScore}% (High Similarity)
                      </span>
                      <span style={{ color: "#8C7A6A" }}>|</span>
                      <span style={{ color: "#66564A" }}>
                        Submitted: {app.submittedAt || "Recent"}
                      </span>
                    </div>

                    {app.adminNotes && (
                      <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "8px", padding: "8px 12px", fontSize: "0.8rem", color: "#66564A", marginTop: "4px" }}>
                        <strong>Admin Review Note:</strong> "{app.adminNotes}"
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                    <div>
                      <span style={{ fontSize: "0.85rem", color: "#8C7A6A", textDecoration: "line-through", marginRight: "8px" }}>
                        {formatTaka(app.originalAmount, false)}
                      </span>
                      <strong style={{ fontSize: "1.4rem", fontWeight: 800, color: "#047857", fontFeatureSettings: "'tnum'" }}>
                        {formatTaka(app.requestedAmount, false)}
                      </strong>
                    </div>

                    {app.status === "forwarded_head" ? (
                      <button
                        type="button"
                        onClick={() => setExecApp(app)}
                        style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "10px 20px", borderRadius: "10px", fontSize: "0.86rem", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(211, 84, 0, 0.25)", display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <ShieldCheck size={16} /> Executive Sign-Off →
                      </button>
                    ) : (
                      <span style={{ fontSize: "0.82rem", color: "#8C7A6A", fontWeight: 700, background: "#FDF9F3", padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(196, 154, 108, 0.3)" }}>
                        ✓ Final Decision Rendered
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>

        </div>
      )}

      {/* 3. STUDENT DIRECTORY TAB (READ ONLY GOVERNANCE) */}
      {activeTab === "students" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* HEADER BANNER */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "18px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.74rem", background: "rgba(4, 120, 87, 0.12)", color: "#047857", border: "1px solid rgba(4, 120, 87, 0.3)", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>
                  🔒 Read-Only Institutional Directory View
                </span>
                <span style={{ fontSize: "0.82rem", color: "#66564A", fontWeight: 600 }}>Dhaka City College</span>
              </div>
              <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.02em" }}>
                Institutional Student Directory
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                Executive view of student academic placements, enrolment statuses, and fee records.
              </p>
            </div>
          </div>

          {/* READ-ONLY GOVERNANCE RESTRICTION BANNER */}
          <div style={{ background: "#FFF7E6", border: "1.5px solid #D35400", borderRadius: "14px", padding: "14px 18px", fontSize: "0.85rem", color: "#241A14", display: "flex", alignItems: "center", gap: "12px" }}>
            <Lock size={20} color="#D35400" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: "#D35400", display: "block" }}>READ-ONLY EXECUTIVE SCOPE ENFORCED:</strong>
              As Head of Institution, operational editing, student deletions, fee reassignment, and section transfers are restricted to Administrative Staff.
            </div>
          </div>

          {/* SEARCH & DEPT FILTER BAR */}
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "240px", position: "relative" }}>
              <Search size={16} color="#8C7A6A" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search student by name, student ID, or roll..."
                value={headStudentSearch}
                onChange={(e) => setHeadStudentSearch(e.target.value)}
                style={{ width: "100%", padding: "9px 12px 9px 36px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.35)", borderRadius: "8px", fontSize: "0.85rem", color: "#241A14" }}
              />
            </div>

            <select
              value={headDeptFilter}
              onChange={(e) => setHeadDeptFilter(e.target.value)}
              style={{ padding: "9px 14px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.35)", borderRadius: "8px", fontSize: "0.85rem", color: "#241A14", fontWeight: 700 }}
            >
              <option value="all">All Departments</option>
              <option value="CSE">Computer Science & Eng (CSE)</option>
              <option value="BBA">Business Administration (BBA)</option>
              <option value="EEE">Electrical & Electronic (EEE)</option>
            </select>
          </div>

          {/* READ ONLY STUDENTS TABLE */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Student Dossier</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Department</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Class & Section</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Fee Obligation</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Status</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700, textAlign: "right" }}>Executive View</th>
                  </tr>
                </thead>
                <tbody>
                  {store.students
                    .filter((s) => {
                      const matchesSearch = !headStudentSearch || s.name.toLowerCase().includes(headStudentSearch.toLowerCase()) || s.studentId.toLowerCase().includes(headStudentSearch.toLowerCase());
                      const matchesDept = headDeptFilter === "all" || s.department.toUpperCase().includes(headDeptFilter);
                      return matchesSearch && matchesDept;
                    })
                    .map((student) => (
                      <tr key={student.id} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.2)" }}>
                        <td style={{ padding: "14px 16px" }}>
                          <strong style={{ color: "#241A14", display: "block" }}>{student.name}</strong>
                          <span style={{ fontSize: "0.78rem", color: "#D35400", fontFamily: "monospace" }}>ID: {student.studentId}</span>
                        </td>
                        <td style={{ padding: "14px 16px", color: "#66564A" }}>
                          {student.department}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#66564A" }}>
                          {student.classYear} ({student.section})
                        </td>
                        <td style={{ padding: "14px 16px", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                          {formatTaka(student.amountDue, false)}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <StatusBadge status={student.feeStatus === "Paid" ? "approved" : student.feeStatus === "Overdue" ? "due" : "pending"} customLabel={student.feeStatus} />
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => setSelectedStudentHead(student)}
                            style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", color: "#D35400", padding: "6px 12px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                          >
                            <Eye size={14} /> View Record
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 4. FINANCIAL OVERVIEW TAB */}
      {activeTab === "financial" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* HEADER BANNER */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "18px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.74rem", background: "rgba(211, 84, 0, 0.12)", color: "#D35400", border: "1px solid rgba(211, 84, 0, 0.3)", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>
                  📈 Institutional Financial Solvency Dashboard
                </span>
                <span style={{ fontSize: "0.82rem", color: "#66564A", fontWeight: 600 }}>Dhaka City College</span>
              </div>
              <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.02em" }}>
                Executive Financial Intelligence
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                High-level breakdown of total fee collections, pending outstanding obligations, overdue risk balances, and payment channel trends.
              </p>
            </div>
          </div>

          {/* 4 METRICS CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            
            <div style={{ background: "#FFFFFF", border: "2px solid #047857", borderRadius: "16px", padding: "20px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#047857", textTransform: "uppercase" }}>Total Collected Fees</span>
              <h2 style={{ margin: "6px 0 2px", fontSize: "1.9rem", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                {formatTaka(4820000, false)}
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 700 }}>● 82.4% Target Realized</span>
            </div>

            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#66564A", textTransform: "uppercase" }}>Outstanding Pending Fees</span>
              <h2 style={{ margin: "6px 0 2px", fontSize: "1.9rem", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                {formatTaka(1250000, false)}
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#66564A", fontWeight: 600 }}>Pending Deadline Window</span>
            </div>

            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(190, 18, 60, 0.3)", borderRadius: "16px", padding: "20px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#BE123C", textTransform: "uppercase" }}>Overdue Balances</span>
              <h2 style={{ margin: "6px 0 2px", fontSize: "1.9rem", fontWeight: 800, color: "#BE123C", fontFeatureSettings: "'tnum'" }}>
                {formatTaka(410000, false)}
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#BE123C", fontWeight: 700 }}>28 Student Accounts Overdue</span>
            </div>

            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#D35400", textTransform: "uppercase" }}>Welfare Hardship Subsidies</span>
              <h2 style={{ margin: "6px 0 2px", fontSize: "1.9rem", fontWeight: 800, color: "#D35400", fontFeatureSettings: "'tnum'" }}>
                {formatTaka(84500, false)}
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 700 }}>100% Peer Assisted</span>
            </div>

          </div>

          {/* PAYMENT CHANNEL & TRENDS BREAKDOWN */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            
            {/* PAYMENT METHOD CHANNELS */}
            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                Payment Method Channel Breakdown
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { channel: "bKash Mobile Banking", percent: 64, amount: 3084800, color: "#D35400" },
                  { channel: "City Bank Visa / Mastercard", percent: 22, amount: 1060400, color: "#047857" },
                  { channel: "Nagad Mobile Wallet", percent: 10, amount: 482000, color: "#D97706" },
                  { channel: "Dutch-Bangla Rocket", percent: 4, amount: 192800, color: "#8C7A6A" },
                ].map((item, idx) => (
                  <div key={idx} style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.25)", borderRadius: "10px", padding: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "0.88rem", color: "#241A14" }}>{item.channel}</strong>
                      <span style={{ fontSize: "0.85rem", fontWeight: 800, color: item.color }}>{item.percent}% ({formatTaka(item.amount, false)})</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "rgba(196, 154, 108, 0.2)", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ width: `${item.percent}%`, height: "100%", background: item.color, borderRadius: "999px" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MONTHLY COLLECTION TRENDS */}
            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                Term Collection Growth & Solvency Trends
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { month: "September 2026 (Current Term)", collected: "৳4,820,000", growth: "+12.4%", status: "On Track" },
                  { month: "August 2026", collected: "৳4,280,000", growth: "+8.1%", status: "Completed" },
                  { month: "July 2026", collected: "৳3,960,000", growth: "+5.2%", status: "Completed" },
                  { month: "June 2026", collected: "৳3,750,000", growth: "+3.8%", status: "Completed" },
                ].map((row, idx) => (
                  <div key={idx} style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.25)", borderRadius: "10px", padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ fontSize: "0.88rem", color: "#241A14", display: "block" }}>{row.month}</strong>
                      <span style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 700 }}>Growth: {row.growth}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong style={{ fontSize: "0.95rem", color: "#241A14", display: "block" }}>{row.collected}</strong>
                      <span style={{ fontSize: "0.76rem", color: "#8C7A6A" }}>{row.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 5. ADMIN ACTIVITY & AUDIT HISTORY TAB */}
      {activeTab === "audit" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* HEADER BANNER */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "18px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.74rem", background: "rgba(211, 84, 0, 0.12)", color: "#D35400", border: "1px solid rgba(211, 84, 0, 0.3)", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>
                  📜 Institutional Operations Audit Trail
                </span>
                <span style={{ fontSize: "0.82rem", color: "#66564A", fontWeight: 600 }}>Dhaka City College</span>
              </div>
              <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.02em" }}>
                Admin Activity & Institutional Audit Log
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                Read-only chronological audit log tracking all fee assignments, deadline changes, application reviews, head approvals, section transfers, and student imports.
              </p>
            </div>
          </div>

          {/* AUDIT SEARCH & ROLE FILTER BAR */}
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "240px", position: "relative" }}>
              <Search size={16} color="#8C7A6A" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search audit trail by actor, action, or details..."
                value={headAuditSearch}
                onChange={(e) => setHeadAuditSearch(e.target.value)}
                style={{ width: "100%", padding: "9px 12px 9px 36px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.35)", borderRadius: "8px", fontSize: "0.85rem", color: "#241A14" }}
              />
            </div>

            <select
              value={headAuditRoleFilter}
              onChange={(e) => setHeadAuditRoleFilter(e.target.value)}
              style={{ padding: "9px 14px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.35)", borderRadius: "8px", fontSize: "0.85rem", color: "#241A14", fontWeight: 700 }}
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Head">Head</option>
              <option value="Student">Student</option>
            </select>
          </div>

          {/* AUDIT TRAIL TABLE */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Actor</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Role</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Action Performed</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Logged Details</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Logged Time</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700, textAlign: "right" }}>Dossier</th>
                  </tr>
                </thead>
                <tbody>
                  {store.auditLogs
                    .filter((log) => {
                      const matchesSearch = !headAuditSearch || log.actor.toLowerCase().includes(headAuditSearch.toLowerCase()) || log.action.toLowerCase().includes(headAuditSearch.toLowerCase()) || log.details.toLowerCase().includes(headAuditSearch.toLowerCase());
                      const matchesRole = headAuditRoleFilter === "all" || log.role === headAuditRoleFilter;
                      return matchesSearch && matchesRole;
                    })
                    .map((log) => (
                      <tr key={log.id} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.2)" }}>
                        <td style={{ padding: "14px 16px", fontWeight: 700, color: "#241A14" }}>
                          {log.actor}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: "0.76rem", background: "rgba(211, 84, 0, 0.1)", color: "#D35400", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                            {log.role}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px", fontWeight: 700, color: "#241A14" }}>
                          {log.action}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#66564A" }}>
                          {log.details}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#8C7A6A", fontSize: "0.82rem", fontFeatureSettings: "'tnum'" }}>
                          {log.timestamp}
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => setSelectedAuditLogHead(log)}
                            style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", color: "#D35400", padding: "6px 12px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                          >
                            <Eye size={14} /> View Event
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 6. HEAD TROPHY & INSTITUTION IMPACT CENTER (PHASE 9) 🏆 */}
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

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>
                  Executive Notes / Directives (Included in Student Decision Notice)
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter executive authorization comments or directives..."
                  value={headNotesInput}
                  onChange={(e) => setHeadNotesInput(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", fontSize: "0.85rem" }}
                />
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

      {/* READ-ONLY STUDENT PROFILE DOSSIER MODAL */}
      {selectedStudentHead && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(36, 26, 20, 0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", border: "2px solid #D35400", borderRadius: "20px", width: "100%", maxWidth: "680px", padding: "24px", boxShadow: "0 24px 48px rgba(36, 26, 20, 0.3)", display: "flex", flexDirection: "column", gap: "18px" }}>
            
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#D35400", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem" }}>
                  {selectedStudentHead.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#241A14" }}>
                    {selectedStudentHead.name}
                  </h3>
                  <span style={{ fontSize: "0.82rem", color: "#D35400", fontFamily: "monospace", fontWeight: 700 }}>
                    ID: {selectedStudentHead.studentId} • {selectedStudentHead.department}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudentHead(null)}
                style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* RESTRICTION NOTICE */}
            <div style={{ background: "#FFF7E6", border: "1px solid #D35400", borderRadius: "10px", padding: "10px 14px", fontSize: "0.78rem", color: "#241A14", display: "flex", alignItems: "center", gap: "8px" }}>
              <Lock size={16} color="#D35400" />
              <span><strong>EXECUTIVE READ-ONLY MODE:</strong> You are viewing this record as Head of Institution. Student details cannot be edited from this interface.</span>
            </div>

            {/* STUDENT DETAILS GRID */}
            <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.85rem" }}>
              <div><strong>Roll Number:</strong> {selectedStudentHead.roll || "2401"}</div>
              <div><strong>Class / Year:</strong> {selectedStudentHead.classYear} ({selectedStudentHead.section})</div>
              <div><strong>Email:</strong> {selectedStudentHead.email}</div>
              <div><strong>Phone:</strong> {selectedStudentHead.phone || "+880 1712-345678"}</div>
              <div><strong>Enrolment Status:</strong> <strong style={{ color: "#047857" }}>{selectedStudentHead.verified ? "Active Verified" : "Active"}</strong></div>
              <div><strong>Fee Balance:</strong> <strong style={{ color: "#241A14" }}>{formatTaka(selectedStudentHead.amountDue, false)}</strong></div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setSelectedStudentHead(null)}
                style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 800, cursor: "pointer" }}
              >
                Close Record
              </button>
            </div>

          </div>
        </div>
      )}

      {/* READ-ONLY AUDIT LOG DOSSIER MODAL */}
      {selectedAuditLogHead && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(36, 26, 20, 0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", border: "2px solid #D35400", borderRadius: "20px", width: "100%", maxWidth: "640px", padding: "24px", boxShadow: "0 24px 48px rgba(36, 26, 20, 0.3)", display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: "0.74rem", background: "rgba(211, 84, 0, 0.12)", color: "#D35400", border: "1px solid rgba(211, 84, 0, 0.3)", padding: "2px 8px", borderRadius: "6px", fontWeight: 800 }}>
                  AUDIT EVENT DOSSIER #{selectedAuditLogHead.id.toUpperCase()}
                </span>
                <h3 style={{ margin: "4px 0 0", fontSize: "1.2rem", fontWeight: 800, color: "#241A14" }}>
                  {selectedAuditLogHead.action}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAuditLogHead(null)}
                style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem" }}>
              <div><strong>Performing Actor:</strong> {selectedAuditLogHead.actor} ({selectedAuditLogHead.role})</div>
              <div><strong>Logged Time:</strong> {selectedAuditLogHead.timestamp}</div>
              <div><strong>Details:</strong> {selectedAuditLogHead.details}</div>
              {selectedAuditLogHead.hash && (
                <div style={{ color: "#047857", fontWeight: 700, fontSize: "0.78rem", marginTop: "4px" }}>
                  Cryptographic Hash: {selectedAuditLogHead.hash}
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setSelectedAuditLogHead(null)}
                style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 800, cursor: "pointer" }}
              >
                Close Audit Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
