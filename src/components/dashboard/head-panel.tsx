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
  Search, Eye, AlertTriangle, Clock, Layers, Lock, ArrowUpRight, RefreshCw, Send, Database
} from "lucide-react";
import { NotionSyncModal } from "@/components/integrations/notion-sync-modal";

export function HeadPanel({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const [store, actions] = useNeoStore();
  const [showNotionModal, setShowNotionModal] = useState(false);

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
  const approvedHeadApps = store.partialApplications.filter((a) => a.status === "approved_head");
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

  const [isHeadOverridden, setIsHeadOverridden] = useState(false);

  const handleExecutiveReturnToAdmin = (appId: string) => {
    if (!declineReason.trim()) return alert("Enter reason or instructions for returning application to Admin review.");
    actions.returnToAdminPartial(appId, declineReason);
    setExecApp(null);
    setDeclineReason("");
    alert(`Application ${appId} returned to Admin review.`);
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

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setShowNotionModal(true)}
                style={{ background: "#241A14", color: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.4)", padding: "10px 16px", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", boxShadow: "0 2px 8px rgba(36, 26, 20, 0.2)" }}
              >
                <Database size={18} style={{ color: "#FF8C42" }} /> Notion Sync ⚡
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("trophy")}
                style={{ background: "#FFF7E6", color: "#D35400", border: "1.5px solid rgba(211, 84, 0, 0.4)", padding: "10px 16px", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", boxShadow: "0 2px 8px rgba(211, 84, 0, 0.12)" }}
              >
                <Trophy size={18} color="#FBBF24" /> Institution Impact 🏆
              </button>
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
          <div className="mobile-executive-stream" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            
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
                if (approvalSubTab === "approved") return app.status === "approved_head";
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
                        status={app.status === "approved_head" ? "approved" : app.status.includes("rejected") ? "rejected" : "pending"}
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
          <div className="student-directory-controls" style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
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
          <div className="mobile-directory-table mobile-head-directory student-directory-results" style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px" }}>
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
                          {formatTaka(student.totalDues, false)}
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

      {/* 4. FINANCIAL OVERVIEW & EXECUTIVE REPORTS TAB (PHASE 21) */}
      {activeTab === "financial" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* HEADER BANNER */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "18px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.74rem", background: "rgba(211, 84, 0, 0.12)", color: "#D35400", border: "1px solid rgba(211, 84, 0, 0.3)", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>
                  📈 Phase 21 • Executive Institutional Reporting
                </span>
                <span style={{ fontSize: "0.82rem", color: "#66564A", fontWeight: 600 }}>Dhaka City College</span>
              </div>
              <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.02em" }}>
                Executive Financial Reports & Analytics
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                High-level institutional solvency overview, collection rate tracking, outstanding dues, overdue risks, partial payment decisions, and payment trends.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("trophy")}
              style={{ background: "#FFF7E6", border: "1.5px solid #D35400", color: "#D35400", padding: "10px 18px", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Trophy size={18} color="#FBBF24" /> View Institution Impact 🏆
            </button>
          </div>

          {/* 6 EXECUTIVE REPORTING METRICS GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            
            {/* 1. FINANCIAL SUMMARY (TOTAL BILLED) */}
            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.04em" }}>Total Billed Dues</span>
              <h2 style={{ margin: "6px 0 2px", fontSize: "1.9rem", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                {formatTaka(5850000, false)}
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#66564A", fontWeight: 600 }}>Term Obligations</span>
            </div>

            {/* 2. COLLECTION RATE */}
            <div style={{ background: "#FFFFFF", border: "2px solid #047857", borderRadius: "16px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#047857", textTransform: "uppercase", letterSpacing: "0.04em" }}>Collection Rate</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#FFFFFF", background: "#047857", padding: "2px 8px", borderRadius: "999px" }}>82.4%</span>
              </div>
              <h2 style={{ margin: "6px 0 2px", fontSize: "1.9rem", fontWeight: 800, color: "#047857", fontFeatureSettings: "'tnum'" }}>
                {formatTaka(4820000, false)}
              </h2>
              <div style={{ width: "100%", height: "6px", background: "rgba(4, 120, 87, 0.15)", borderRadius: "999px", overflow: "hidden", marginTop: "4px" }}>
                <div style={{ width: "82.4%", height: "100%", background: "#047857", borderRadius: "999px" }} />
              </div>
            </div>

            {/* 3. OUTSTANDING DUES */}
            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#D35400", textTransform: "uppercase", letterSpacing: "0.04em" }}>Outstanding Dues</span>
              <h2 style={{ margin: "6px 0 2px", fontSize: "1.9rem", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                {formatTaka(1250000, false)}
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#66564A", fontWeight: 600 }}>Active Pending Window</span>
            </div>

            {/* 4. OVERDUE DUES */}
            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(190, 18, 60, 0.3)", borderRadius: "16px", padding: "20px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#BE123C", textTransform: "uppercase", letterSpacing: "0.04em" }}>Overdue Dues</span>
              <h2 style={{ margin: "6px 0 2px", fontSize: "1.9rem", fontWeight: 800, color: "#BE123C", fontFeatureSettings: "'tnum'" }}>
                {formatTaka(410000, false)}
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#BE123C", fontWeight: 700 }}>28 Overdue Accounts</span>
            </div>

            {/* 5. PARTIAL PAYMENT DECISIONS */}
            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#D35400", textTransform: "uppercase", letterSpacing: "0.04em" }}>Partial Payment Decisions</span>
              <h2 style={{ margin: "6px 0 2px", fontSize: "1.9rem", fontWeight: 800, color: "#241A14" }}>
                {approvedHeadApps.length + rejectedHeadApps.length + pendingHeadApps.length} Requests
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 700 }}>
                {approvedHeadApps.length} Approved ({formatTaka(184000, false)})
              </span>
            </div>

          </div>

          {/* PARTIAL PAYMENT DECISIONS REPORTING CARD */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                  Partial-Payment Decisions & Hardship Summary
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#66564A" }}>
                  Executive sign-off metrics for student installment applications
                </span>
              </div>
              <span style={{ fontSize: "0.78rem", background: "rgba(4, 120, 87, 0.12)", color: "#047857", padding: "4px 10px", borderRadius: "8px", fontWeight: 800 }}>
                80% Approval Rate
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "10px", padding: "14px" }}>
                <span style={{ fontSize: "0.74rem", color: "#66564A", fontWeight: 700 }}>Total Applications</span>
                <strong style={{ display: "block", fontSize: "1.4rem", color: "#241A14", marginTop: "2px" }}>
                  {store.partialApplications.length}
                </strong>
              </div>

              <div style={{ background: "rgba(4, 120, 87, 0.08)", border: "1px solid rgba(4, 120, 87, 0.25)", borderRadius: "10px", padding: "14px" }}>
                <span style={{ fontSize: "0.74rem", color: "#047857", fontWeight: 700 }}>Approved by Head</span>
                <strong style={{ display: "block", fontSize: "1.4rem", color: "#047857", marginTop: "2px" }}>
                  {approvedHeadApps.length}
                </strong>
                <span style={{ fontSize: "0.72rem", color: "#047857" }}>{formatTaka(184000, false)} Unlocked</span>
              </div>

              <div style={{ background: "#FFF7E6", border: "1px solid rgba(211, 84, 0, 0.3)", borderRadius: "10px", padding: "14px" }}>
                <span style={{ fontSize: "0.74rem", color: "#D35400", fontWeight: 700 }}>Awaiting Head Decision</span>
                <strong style={{ display: "block", fontSize: "1.4rem", color: "#D35400", marginTop: "2px" }}>
                  {pendingHeadApps.length}
                </strong>
                <span style={{ fontSize: "0.72rem", color: "#D35400" }}>Action Required</span>
              </div>

              <div style={{ background: "rgba(190, 18, 60, 0.08)", border: "1px solid rgba(190, 18, 60, 0.25)", borderRadius: "10px", padding: "14px" }}>
                <span style={{ fontSize: "0.74rem", color: "#BE123C", fontWeight: 700 }}>Declined / Rejected</span>
                <strong style={{ display: "block", fontSize: "1.4rem", color: "#BE123C", marginTop: "2px" }}>
                  {rejectedHeadApps.length}
                </strong>
                <span style={{ fontSize: "0.72rem", color: "#BE123C" }}>Non-compliant</span>
              </div>
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
                Payment Trends & Term Collection Growth
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

      {/* 6. HEAD TROPHY & INSTITUTION IMPACT CENTER (PHASE 21) 🏆 */}
      {activeTab === "trophy" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* DEMONSTRATION FEATURE NOTICE BANNER */}
          <div style={{ background: "#FFF7E6", border: "1.5px solid #D35400", borderRadius: "14px", padding: "14px 18px", fontSize: "0.85rem", color: "#241A14", display: "flex", alignItems: "center", gap: "12px" }}>
            <Sparkles size={20} color="#D35400" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: "#D35400", display: "block" }}>DEMONSTRATION FEATURE NOTICE:</strong>
              This Institution Impact module is a social welfare demonstration feature designed to showcase student peer support, impact rankings, and donation points (৳100 = 1 Point). It is not a full general-ledger accounting system.
            </div>
          </div>

          {/* HEADER WITH SMALL TROPHY ICON */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "18px", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "52px", height: "52px", background: "rgba(211, 84, 0, 0.12)", border: "1.5px solid #D35400", borderRadius: "14px", display: "grid", placeItems: "center", color: "#D35400", boxShadow: "0 4px 12px rgba(211, 84, 0, 0.2)" }}>
                <Trophy size={28} color="#FBBF24" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h1 style={{ margin: 0, fontSize: "1.7rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.01em" }}>
                    Institution Impact & Welfare Fund 🏆
                  </h1>
                  <span style={{ fontSize: "0.74rem", background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "3px 10px", borderRadius: "999px", fontWeight: 700, color: "#D35400" }}>
                    Dhaka City College
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                  Executive oversight of total demo donations, top contributors, department rankings, and institutional positioning.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.74rem", textTransform: "uppercase", color: "#8C7A6A", fontWeight: 700 }}>Nationwide Position</span>
                <h2 style={{ margin: "2px 0 0", fontSize: "1.6rem", fontWeight: 800, color: "#D35400" }}>#18 Nationwide</h2>
              </div>
            </div>
          </div>

          {/* 5 EXECUTIVE IMPACT METRIC CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            
            {/* 1. TOTAL DEMO DONATIONS */}
            <div style={{ background: "#FFFFFF", border: "2px solid #D35400", borderRadius: "14px", padding: "20px" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#D35400", textTransform: "uppercase" }}>Total Demo Donations</span>
              <h2 style={{ margin: "4px 0 0", fontSize: "1.9rem", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                {formatTaka(84500, false)}
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 600, marginTop: "2px", display: "block" }}>
                100% Peer Student Welfare
              </span>
            </div>

            {/* 2. TOTAL IMPACT POINTS */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Total Impact Points</span>
              <h2 style={{ margin: "4px 0 0", fontSize: "1.9rem", fontWeight: 800, color: "#241A14" }}>
                845 Impact Pts
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#66564A", marginTop: "2px", display: "block" }}>
                Formula: ৳100 = 1 Point
              </span>
            </div>

            {/* 3. DEPARTMENT RANKING */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Top Department</span>
              <h2 style={{ margin: "4px 0 0", fontSize: "1.9rem", fontWeight: 800, color: "#D35400" }}>
                #1 CSE Dept
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 700, marginTop: "2px", display: "block" }}>
                {formatTaka(42000, false)} Donated
              </span>
            </div>

            {/* 4. INSTITUTION RANKING */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Institution Ranking</span>
              <h2 style={{ margin: "4px 0 0", fontSize: "1.9rem", fontWeight: 800, color: "#047857" }}>
                #3 Regional
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#66564A", marginTop: "2px", display: "block" }}>
                Dhaka Division Higher Ed
              </span>
            </div>

            {/* 5. NATIONWIDE POSITION */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Nationwide Position</span>
              <h2 style={{ margin: "4px 0 0", fontSize: "1.9rem", fontWeight: 800, color: "#241A14" }}>
                #18 National
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#66564A", marginTop: "2px", display: "block" }}>
                Out of 142 Institutions
              </span>
            </div>

          </div>

          {/* TWO COLUMN GRID: TOP CONTRIBUTORS (WHO DONATED & HOW MUCH) + RANKINGS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            
            {/* TOP CONTRIBUTORS LEADERBOARD (SHOW WHO DONATED & HOW MUCH) */}
            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                    Top Contributors & Donor Roster
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: "#66564A" }}>
                    Showing who donated and how much (Demo Fund Tracker)
                  </span>
                </div>
                <span style={{ fontSize: "0.74rem", background: "rgba(211, 84, 0, 0.1)", color: "#D35400", padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>
                  142 Donors
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { rank: 1, name: "Mustafizur Rahman", dept: "Alumni Association", amount: 5000, points: 50, badge: "🥇" },
                  { rank: 2, name: "Farhana Ahmed", dept: "CSE 4th Year", amount: 3000, points: 30, badge: "🥈" },
                  { rank: 3, name: "Tanvir Rahman", dept: "CSE 3rd Sem", amount: 2500, points: 25, badge: "🥉" },
                  { rank: 4, name: "Rahat Chowdhury", dept: "Economics 2nd Year", amount: 1500, points: 15, badge: "4" },
                  { rank: 5, name: "Anika Tabassum", dept: "BBA 2nd Sem", amount: 1200, points: 12, badge: "5" },
                  { rank: 6, name: store.studentProfile.name, dept: "CSE 1st Year (Demo User)", amount: store.donations.totalDonated || 1000, points: store.donations.points || 10, badge: "6" },
                  { rank: 7, name: "Sajid Khan", dept: "EEE 1st Sem", amount: 400, points: 4, badge: "7" },
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
                        <span style={{ fontSize: "0.78rem", color: "#66564A" }}>{st.dept}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <strong style={{ fontWeight: 800, color: "#047857", fontSize: "0.95rem", display: "block" }}>
                        {formatTaka(st.amount, false)}
                      </strong>
                      <span style={{ fontSize: "0.76rem", color: "#D35400", fontWeight: 700 }}>
                        {st.points} Pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DEPARTMENT RANKING & NATIONWIDE POSITION MATRIX */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* DEPARTMENT RANKINGS */}
              <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                  Department Ranking Breakdown
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { rank: "#1", dept: "Computer Science & Engineering", amount: 42000, points: 420, donors: 56, icon: "💻" },
                    { rank: "#2", dept: "Business Administration (BBA)", amount: 26500, points: 265, donors: 38, icon: "📊" },
                    { rank: "#3", dept: "Electrical & Electronic Eng", amount: 16000, points: 160, donors: 24, icon: "⚡" },
                    { rank: "#4", dept: "Economics & Humanities", amount: 8500, points: 85, donors: 14, icon: "📚" },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#FDF9F3", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.2)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontWeight: 800, color: "#D35400", fontSize: "0.9rem" }}>{item.rank}</span>
                        <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                        <div>
                          <h4 style={{ margin: 0, color: "#241A14", fontSize: "0.88rem", fontWeight: 700 }}>{item.dept}</h4>
                          <span style={{ fontSize: "0.76rem", color: "#66564A" }}>{item.donors} Active Donors • {item.points} Pts</span>
                        </div>
                      </div>
                      <strong style={{ color: "#D35400", fontSize: "0.95rem" }}>{formatTaka(item.amount, false)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* INSTITUTION RANKING & NATIONWIDE POSITION */}
              <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                  Institution Ranking & Nationwide Position
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ padding: "14px", background: "#FFF7E6", borderRadius: "12px", border: "1px solid rgba(211, 84, 0, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ color: "#D35400", fontSize: "0.92rem", display: "block" }}>Regional Institution Ranking</strong>
                      <span style={{ fontSize: "0.8rem", color: "#66564A" }}>Ranked #3 in Dhaka Division Higher Education Category</span>
                    </div>
                    <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#D35400" }}>#3 Regional</span>
                  </div>

                  <div style={{ padding: "14px", background: "rgba(4, 120, 87, 0.08)", borderRadius: "12px", border: "1px solid rgba(4, 120, 87, 0.25)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ color: "#047857", fontSize: "0.92rem", display: "block" }}>Nationwide Position</strong>
                      <span style={{ fontSize: "0.8rem", color: "#66564A" }}>Ranked #18 out of 142 Colleges & Universities in Bangladesh</span>
                    </div>
                    <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#047857" }}>#18 National</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* EXECUTIVE READ-ONLY STUDENT DIRECTORY (PHASE 24 INTEGRATION) */}
      {activeTab === "students" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* HEADER BAR */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.72rem", background: "rgba(211, 84, 0, 0.12)", color: "#D35400", border: "1px solid rgba(211, 84, 0, 0.3)", padding: "2px 8px", borderRadius: "6px", fontWeight: 800 }}>
                  EXECUTIVE VIEW • READ-ONLY AUDIT
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "#241A14" }}>
                Institutional Student Directory
              </h2>
              <p style={{ margin: "2px 0 0", fontSize: "0.88rem", color: "#66564A" }}>
                Executive view of enrolled student profiles, academic status, and total fee balances.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "6px 14px", borderRadius: "8px", fontWeight: 700, color: "#66564A" }}>
                Total Enrolled Students: <strong style={{ color: "#D35400" }}>{store.students.length}</strong>
              </span>
            </div>
          </div>
          {/* SEARCH & DEPT FILTER BAR */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8C7A6A" }} />
              <input
                type="text"
                placeholder="Search by student name, ID, or email..."
                value={headStudentSearch}
                onChange={(e) => setHeadStudentSearch(e.target.value)}
                style={{ width: "100%", padding: "9px 14px 9px 40px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontSize: "0.88rem" }}
              />
            </div>
            <select
              value={headDeptFilter}
              onChange={(e) => setHeadDeptFilter(e.target.value)}
              style={{ padding: "9px 14px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", fontWeight: 700, fontSize: "0.84rem", outline: "none" }}
            >
              <option value="all">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="BBA">BBA</option>
              <option value="Civil">Civil</option>
            </select>
          </div>
          {/* READ-ONLY STUDENT TABLE */}
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Student Dossier</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Student ID</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Department</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Class & Year</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Fee Status</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {store.students
                    .filter((s) => {
                      const matchQuery = !headStudentSearch || s.name.toLowerCase().includes(headStudentSearch.toLowerCase()) || s.studentId.toLowerCase().includes(headStudentSearch.toLowerCase());
                      const matchDept = headDeptFilter === "all" || s.department === headDeptFilter;
                      return matchQuery && matchDept;
                    })
                    .map((student) => (
                      <tr key={student.id} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.2)" }}>
                        <td style={{ padding: "12px 16px" }}>
                          <strong style={{ color: "#241A14", display: "block" }}>{student.name}</strong>
                          <span style={{ fontSize: "0.76rem", color: "#8C7A6A" }}>{student.email}</span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#D35400", background: "rgba(211, 84, 0, 0.08)", padding: "2px 6px", borderRadius: "4px" }}>
                            {student.studentId}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#241A14", fontWeight: 600 }}>{student.department}</td>
                        <td style={{ padding: "12px 16px", color: "#66564A" }}>{student.classYear} ({student.section})</td>
                        <td style={{ padding: "12px 16px" }}>
                          <StatusBadge
                            status={student.feeStatus === "Paid" ? "approved" : student.feeStatus === "Overdue" ? "rejected" : "pending"}
                            customLabel={student.feeStatus}
                          />
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => setSelectedStudentHead(student)}
                            style={{ background: "#FFF7E6", border: "1px solid rgba(211, 84, 0, 0.3)", color: "#D35400", padding: "5px 12px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
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

      {/* EXECUTIVE DECISION MODAL — PHASE 20 FINAL APPROVAL CENTER */}
      {execApp && (
        <div
          className="ms-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setExecApp(null); }}
        >
          <div className="ms-modal" style={{ maxWidth: "760px", width: "94%", maxHeight: "90vh", overflowY: "auto" }}>
            
            {/* MODAL HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid rgba(196, 154, 108, 0.3)", paddingBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(211, 84, 0, 0.12)", border: "1px solid rgba(211, 84, 0, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#D35400" }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.74rem", background: "#FFF7E6", color: "#D35400", border: "1px solid rgba(211, 84, 0, 0.3)", padding: "2px 8px", borderRadius: "6px", fontWeight: 800 }}>
                      PHASE 20 • FINAL EXECUTIVE SIGN-OFF
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "#8C7A6A", fontFamily: "monospace" }}>
                      DOSSIER #{execApp.id}
                    </span>
                  </div>
                  <h3 style={{ margin: "2px 0 0", color: "#241A14", fontSize: "1.25rem", fontWeight: 800 }}>
                    Executive Hardship & Partial Payment Authorization
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExecApp(null)}
                style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "8px", minWidth: "44px", minHeight: "44px", display: "grid", placeItems: "center", color: "#66564A", cursor: "pointer" }}
                aria-label="Close dossier"
              >
                <X size={20} />
              </button>
            </div>

            {/* 10-POINT EXECUTIVE DOSSIER GRID */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>

              {/* ROW 1: STUDENT & INSTITUTION */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                
                {/* 1. STUDENT */}
                <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "14px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#8C7A6A", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "4px" }}>
                    1. Student Identity Dossier
                  </span>
                  <strong style={{ fontSize: "1rem", color: "#241A14", display: "block" }}>
                    {execApp.studentName}
                  </strong>
                  <span style={{ fontSize: "0.82rem", color: "#D35400", fontFamily: "monospace", fontWeight: 700, display: "block" }}>
                    ID: {execApp.studentId}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "#66564A", display: "block", marginTop: "2px" }}>
                    Department: CSE • CGPA: 3.92 (High Standing)
                  </span>
                </div>

                {/* 2. INSTITUTION */}
                <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "14px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#8C7A6A", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "4px" }}>
                    2. Institutional Jurisdiction
                  </span>
                  <strong style={{ fontSize: "1rem", color: "#241A14", display: "block" }}>
                    {store.selectedInstitution.name || "Dhaka City College"}
                  </strong>
                  <span style={{ fontSize: "0.82rem", color: "#047857", fontWeight: 700, display: "block" }}>
                    ✓ Verified Academic Authority
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "#66564A", display: "block", marginTop: "2px" }}>
                    Executive Director: Prof. Dr. M. A. Karim
                  </span>
                </div>

              </div>

              {/* ROW 2: FEE, TOTAL AMOUNT, REQUESTED AMOUNT */}
              <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "14px", padding: "16px", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "14px", alignItems: "center" }}>
                
                {/* 3. FEE */}
                <div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#8C7A6A", textTransform: "uppercase", display: "block", marginBottom: "2px" }}>
                    3. Target Fee Item
                  </span>
                  <strong style={{ fontSize: "0.95rem", color: "#241A14" }}>
                    {execApp.feeTitle}
                  </strong>
                  <span style={{ fontSize: "0.78rem", color: "#66564A", display: "block" }}>
                    Category: Academic Dues
                  </span>
                </div>

                {/* 4. TOTAL AMOUNT */}
                <div style={{ background: "#FDF9F3", padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.25)" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#8C7A6A", textTransform: "uppercase", display: "block" }}>
                    4. Total Fee Amount
                  </span>
                  <strong style={{ fontSize: "1.15rem", color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                    {formatTaka(execApp.originalAmount, false)}
                  </strong>
                </div>

                {/* 5. REQUESTED AMOUNT */}
                <div style={{ background: "rgba(4, 120, 87, 0.08)", padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(4, 120, 87, 0.25)" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#047857", textTransform: "uppercase", display: "block" }}>
                    5. Requested Split (Inst. 1)
                  </span>
                  <strong style={{ fontSize: "1.15rem", color: "#047857", fontFeatureSettings: "'tnum'" }}>
                    {formatTaka(execApp.requestedAmount, false)}
                  </strong>
                </div>

              </div>

              {/* ROW 3: REASON & HARDSHIP STATEMENT */}
              <div style={{ background: "#FFF7E6", border: "1px solid rgba(211, 84, 0, 0.3)", borderRadius: "12px", padding: "14px" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#D35400", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "4px" }}>
                  6. Stated Hardship Reason & Declaration
                </span>
                <p style={{ margin: "0 0 6px", fontSize: "0.88rem", color: "#241A14", fontWeight: 600, lineHeight: 1.4 }}>
                  "{execApp.reason}"
                </p>
                {execApp.statement && (
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#66564A", fontStyle: "italic" }}>
                    Statement: "{execApp.statement}"
                  </p>
                )}
                <div style={{ marginTop: "8px", fontSize: "0.78rem", color: "#66564A", display: "flex", gap: "16px" }}>
                  <span>Guardian: <strong style={{ color: "#241A14" }}>{execApp.guardianName}</strong></span>
                  <span>Contact: <strong style={{ color: "#241A14" }}>{execApp.guardianPhone}</strong></span>
                </div>
              </div>

              {/* ROW 4: DOCUMENTS, FORENSIC AI VERIFICATION, PAYMENT HISTORY */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "12px" }}>
                
                {/* 7. DOCUMENTS */}
                <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "12px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#8C7A6A", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                    7. Uploaded Documents
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.78rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#047857", fontWeight: 600 }}>
                      <FileText size={13} /> Guardian NID: {execApp.guardianIdDocUrl || "NID-Verified.pdf"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#047857", fontWeight: 600 }}>
                      <FileText size={13} /> Guardian Sig: {execApp.guardianSignatureDocUrl || "Sig-Guardian.png"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#047857", fontWeight: 600 }}>
                      <FileText size={13} /> Student Sig: {execApp.studentSignatureDocUrl || "Sig-Student.png"}
                    </div>
                  </div>
                </div>

                {/* 8. FORENSIC AI VERIFICATION & VECTORS */}
                <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#8C7A6A", textTransform: "uppercase" }}>
                      8. Forensic Signature Analysis
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsHeadOverridden(!isHeadOverridden)}
                      style={{
                        fontSize: "0.68rem", fontWeight: 700,
                        background: isHeadOverridden ? "#047857" : "rgba(211,84,0,0.12)",
                        color: isHeadOverridden ? "#FFF" : "#D35400",
                        border: "none", padding: "2px 6px", borderRadius: "4px", cursor: "pointer",
                      }}
                    >
                      {isHeadOverridden ? "Manual Override ACTIVE" : "Executive Override"}
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <Sparkles size={16} color="#047857" />
                    <strong style={{ fontSize: "1.05rem", color: "#047857" }}>
                      {isHeadOverridden ? "100% (Overridden)" : `${execApp.aiMatchScore}% Match`}
                    </strong>
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "#66564A", marginBottom: "4px", lineHeight: 1.3 }}>
                    Curvature Vector: <strong>97.2%</strong> · Stroke Dynamics: <strong>95.8%</strong>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "#047857", background: "rgba(4, 120, 87, 0.12)", padding: "2px 6px", borderRadius: "4px", fontWeight: 700, display: "inline-block" }}>
                    Gemini Vision 1.5: High Geometric Congruence
                  </span>
                </div>

                {/* 9. PAYMENT HISTORY */}
                <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "12px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#8C7A6A", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                    9. Payment Track Record
                  </span>
                  <strong style={{ fontSize: "0.9rem", color: "#047857", display: "block" }}>
                    100% On-Time Record
                  </strong>
                  <span style={{ fontSize: "0.78rem", color: "#66564A", display: "block", marginTop: "2px" }}>
                    3 Past Fees Cleared • 0 Overdue Defaults
                  </span>
                </div>

              </div>

              {/* 10. ADMIN REVIEW */}
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "14px" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#8C7A6A", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "4px" }}>
                  10. Operational Admin Review & Recommendation
                </span>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#241A14", lineHeight: 1.4 }}>
                  Admin (Refat Rahman): <strong style={{ color: "#66564A" }}>"{execApp.adminNotes || "Verified student profile, NID document & AI signature match score against institutional records. Recommended for executive split installment authorization."}"</strong>
                </p>
              </div>

            </div>

            {/* EXECUTIVE AUTHORIZATION & DECISION CONTROLS */}
            <div style={{ background: "#FFF7E6", border: "1.5px solid #D35400", borderRadius: "14px", padding: "18px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Lock size={16} color="#D35400" />
                <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#D35400" }}>
                  Executive Decisioning (Head Authority Sign-Off)
                </h4>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>
                    Approved Installment 1 Amount (৳)
                  </label>
                  <input
                    type="number"
                    value={approvedAmountInput || execApp.requestedAmount}
                    onChange={(e) => setApprovedAmountInput(Number(e.target.value))}
                    style={{ width: "100%", padding: "8px 12px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", fontWeight: 800 }}
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
                    style={{ width: "100%", padding: "8px 12px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", fontWeight: 600 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>
                  Executive Directive / Comments (Recorded in Immutable Audit Log & Sent to Student)
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter executive authorization comments or directives..."
                  value={headNotesInput}
                  onChange={(e) => setHeadNotesInput(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", fontSize: "0.85rem" }}
                />
              </div>

              {/* THREE EXECUTIVE DECISION BUTTONS: APPROVE, REQUEST CHANGES, REJECT */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                
                {/* 1. APPROVE */}
                <button
                  type="button"
                  className="ms-btn-primary"
                  style={{ background: "#047857", color: "#FFFFFF", padding: "12px", borderRadius: "10px", fontWeight: 800, fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 12px rgba(4, 120, 87, 0.25)" }}
                  onClick={() => handleExecutiveApprove(execApp.id)}
                >
                  <CheckCircle2 size={20} /> Approve Decision & Unlock Partial Payment
                </button>

                {/* REASON / FEEDBACK INPUT FOR REJECT OR CHANGES */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="Enter feedback notes or decline reason..."
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    style={{ flex: 1, padding: "9px 12px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", outline: "none", fontSize: "0.84rem" }}
                  />

                  {/* 2. REQUEST CHANGES */}
                  <button
                    type="button"
                    onClick={() => handleExecutiveRequestChanges(execApp.id)}
                    style={{ color: "#D35400", background: "#FFFFFF", border: "1.5px solid #D35400", padding: "9px 14px", borderRadius: "8px", fontWeight: 800, fontSize: "0.82rem", cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    Request Changes
                  </button>

                  {/* 3. RETURN / ESCALATE TO ADMIN REVIEW */}
                  <button
                    type="button"
                    onClick={() => handleExecutiveReturnToAdmin(execApp.id)}
                    style={{ color: "#4B5563", background: "#F3F4F6", border: "1.5px solid #D1D5DB", padding: "9px 14px", borderRadius: "8px", fontWeight: 800, fontSize: "0.82rem", cursor: "pointer", whiteSpace: "nowrap" }}
                    title="Return application back to Admin review"
                  >
                    Return to Admin
                  </button>

                  {/* 4. REJECT */}
                  <button
                    type="button"
                    onClick={() => handleExecutiveDecline(execApp.id)}
                    style={{ color: "#FFFFFF", background: "#BE123C", border: "none", padding: "9px 14px", borderRadius: "8px", fontWeight: 800, fontSize: "0.82rem", cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    Reject Request
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* READ-ONLY STUDENT PROFILE DOSSIER MODAL */}
      {selectedStudentHead && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(36, 26, 20, 0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedStudentHead(null); }}
        >
          <div className="ms-modal" style={{ background: "#FFFFFF", border: "2px solid #D35400", borderRadius: "20px", width: "100%", maxWidth: "680px", maxHeight: "90vh", overflowY: "auto", padding: "24px", boxShadow: "0 24px 48px rgba(36, 26, 20, 0.3)", display: "flex", flexDirection: "column", gap: "18px" }}>
            
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
              <div><strong>Fee Balance:</strong> <strong style={{ color: "#241A14" }}>{formatTaka(selectedStudentHead.totalDues, false)}</strong></div>
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
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(36, 26, 20, 0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedAuditLogHead(null); }}
        >
          <div className="ms-modal" style={{ background: "#FFFFFF", border: "2px solid #D35400", borderRadius: "20px", width: "100%", maxWidth: "640px", maxHeight: "90vh", overflowY: "auto", padding: "24px", boxShadow: "0 24px 48px rgba(36, 26, 20, 0.3)", display: "flex", flexDirection: "column", gap: "16px" }}>
            
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

      {/* NOTION SYNC MODAL */}
      <NotionSyncModal isOpen={showNotionModal} onClose={() => setShowNotionModal(false)} />

    </div>
  );
}
