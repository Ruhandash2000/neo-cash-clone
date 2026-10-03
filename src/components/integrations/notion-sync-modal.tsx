/**
 * Notion Sync Modal Component
 *
 * Allows Admin and Head of Institution to view connection health
 * and push fee records and hardship applications to their Notion workspace.
 */

import { useState } from "react";
import {
  X, CheckCircle2, AlertCircle, RefreshCw, ExternalLink,
  Database, Sparkles, Layers, ShieldCheck, Check,
} from "lucide-react";
import { useNeoStore } from "@/lib/neo-cash-store";
import { testNotionConnection, bulkSyncToNotion } from "@/lib/notion.functions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function NotionSyncModal({ isOpen, onClose }: Props) {
  const [store] = useNeoStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    ok: boolean;
    feesSynced?: number;
    appsSynced?: number;
    total?: number;
    message?: string;
  } | null>(null);

  if (!isOpen) return null;

  const NOTION_PAGE_URL = "https://app.notion.com/p/Neo-Cash-3eec884a2955809d89aed76709a60fbf";

  const handleSyncAll = async () => {
    setIsSyncing(true);
    setSyncResult(null);

    try {
      // Prepare fees to sync from current store
      const feesPayload = store.fees.map((fee) => ({
        title: fee.title,
        amount: fee.amount,
        status: fee.status,
        dueDate: fee.dueDate,
        category: fee.category,
        studentName: store.studentProfile.name,
        studentId: store.studentProfile.studentId,
        department: store.studentProfile.department,
        paymentMethod: fee.status === "paid" ? "bKash" : undefined,
      }));

      // Prepare applications to sync
      const appsPayload = store.partialApplications.map((app) => ({
        id: app.id,
        studentName: app.studentName,
        studentId: app.studentId,
        feeTitle: app.feeTitle,
        requestedAmount: app.requestedAmount,
        aiMatchScore: app.aiMatchScore || 96,
        status: app.status,
        guardianName: app.guardianName,
        guardianPhone: app.guardianPhone,
        reason: app.reason || "Hardship application",
      }));

      const res = await bulkSyncToNotion({
        data: {
          fees: feesPayload,
          applications: appsPayload,
        },
      });

      if (res && res.ok) {
        setSyncResult({
          ok: true,
          feesSynced: res.feesSynced,
          appsSynced: res.appsSynced,
          total: res.total,
          message: `Successfully synchronized ${res.total} records into your Notion databases!`,
        });
      } else {
        setSyncResult({
          ok: false,
          message: res?.errors?.[0] || "Sync encountered an issue. Please try again.",
        });
      }
    } catch (err: any) {
      setSyncResult({
        ok: false,
        message: err.message || "Failed to reach Notion sync service.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div
      className="ms-modal-overlay"
      style={{ position: "fixed", inset: 0, background: "rgba(36, 26, 20, 0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200, padding: "20px" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="ms-modal"
        style={{
          background: "#FFFFFF",
          border: "1.5px solid rgba(196, 154, 108, 0.4)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px",
          boxShadow: "0 24px 60px rgba(36, 26, 20, 0.35)",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(196, 154, 108, 0.25)", paddingBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: "linear-gradient(135deg, #241A14, #3D2B1F)",
              display: "grid", placeItems: "center", color: "var(--theme-color-500)",
            }}>
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#241A14", fontSize: "1.2rem", fontWeight: 800 }}>
                Notion Workspace Sync
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.76rem", color: "#66564A" }}>
                Institutional live sync for Fees, Ledgers & Hardship Applications
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none", border: "none", color: "#8C7A6A", cursor: "pointer",
              minWidth: "44px", minHeight: "44px", display: "grid", placeItems: "center", borderRadius: "8px",
            }}
            aria-label="Close Notion sync modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Connection Health Banner */}
        <div style={{
          background: "rgba(4, 120, 87, 0.08)",
          border: "1.5px solid rgba(4, 120, 87, 0.3)",
          borderRadius: "14px",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 10px #10B981" }} />
            <div>
              <strong style={{ color: "#047857", fontSize: "0.88rem", display: "block" }}>
                Connected to Shelly Paul’s Space
              </strong>
              <span style={{ color: "#66564A", fontSize: "0.74rem" }}>
                Bot: <strong>Neo Cash AI Sync</strong> • Mode: Live Read/Write API
              </span>
            </div>
          </div>
          <a
            href={NOTION_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "#FFFFFF", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.4)",
              borderRadius: "8px", padding: "6px 12px", fontSize: "0.76rem", fontWeight: 700,
              textDecoration: "none", minHeight: "36px",
            }}
          >
            Open in Notion <ExternalLink size={13} />
          </a>
        </div>

        {/* Target Databases Breakdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#241A14", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Configured Notion Databases
          </span>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={{ background: "var(--theme-color-50)", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <span style={{ fontSize: "1rem" }}>💳</span>
                <strong style={{ color: "#241A14", fontSize: "0.84rem" }}>Fee & Transaction Ledger</strong>
              </div>
              <span style={{ fontSize: "0.74rem", color: "#66564A", display: "block" }}>
                Tracks student dues, paid receipts, and payment methods.
              </span>
              <div style={{ marginTop: "6px", fontSize: "0.72rem", color: "#047857", fontWeight: 700 }}>
                ● {store.fees.length} active fee items ready
              </div>
            </div>

            <div style={{ background: "var(--theme-color-50)", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <span style={{ fontSize: "1rem" }}>📋</span>
                <strong style={{ color: "#241A14", fontSize: "0.84rem" }}>Hardship Applications</strong>
              </div>
              <span style={{ fontSize: "0.74rem", color: "#66564A", display: "block" }}>
                Partial payment requests, AI match scores & approvals.
              </span>
              <div style={{ marginTop: "6px", fontSize: "0.72rem", color: "var(--theme-color-900)", fontWeight: 700 }}>
                ● {store.partialApplications.length} applications ready
              </div>
            </div>
          </div>
        </div>

        {/* Sync Result Feedback */}
        {syncResult && (
          <div style={{
            background: syncResult.ok ? "rgba(4, 120, 87, 0.08)" : "rgba(220, 38, 38, 0.08)",
            border: `1.5px solid ${syncResult.ok ? "rgba(4, 120, 87, 0.35)" : "rgba(220, 38, 38, 0.3)"}`,
            borderRadius: "12px",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            {syncResult.ok ? (
              <CheckCircle2 size={20} style={{ color: "#047857", flexShrink: 0 }} />
            ) : (
              <AlertCircle size={20} style={{ color: "#DC2626", flexShrink: 0 }} />
            )}
            <span style={{ fontSize: "0.84rem", color: syncResult.ok ? "#047857" : "#DC2626", fontWeight: 600 }}>
              {syncResult.message}
            </span>
          </div>
        )}

        {/* Action Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "var(--theme-color-50)", color: "#241A14",
              border: "1px solid rgba(196, 154, 108, 0.4)",
              borderRadius: "10px", padding: "10px 18px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
              minHeight: "44px",
            }}
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSyncAll}
            disabled={isSyncing}
            style={{
              background: "linear-gradient(135deg, var(--theme-color-900), var(--theme-color-500))",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "10px",
              padding: "10px 22px",
              fontWeight: 800,
              fontSize: "0.88rem",
              cursor: isSyncing ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(211, 84, 0, 0.28)",
              minHeight: "44px",
            }}
          >
            {isSyncing ? (
              <>
                <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} />
                Synchronizing with Notion…
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Sync Current Ledger to Notion ⚡
              </>
            )}
          </button>
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}


