import { useState, useEffect } from "react";
import {
  FileSpreadsheet, CheckCircle2, XCircle, Loader2, X,
  ExternalLink, ArrowRight, ShieldCheck, Database, Key, HelpCircle
} from "lucide-react";
import { testNotionConnection, syncTransactionsToNotion } from "@/lib/notion.functions";
import { useNeoStore } from "@/lib/neo-cash-store";

interface NotionSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotionSyncModal({ isOpen, onClose }: NotionSyncModalProps) {
  const [store] = useNeoStore();

  const [apiKey, setApiKey] = useState("");
  const [databaseId, setDatabaseId] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; title?: string | undefined; error?: string | undefined } | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ ok: boolean; count: number; error?: string | undefined } | null>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);

  // Load saved credentials from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("neo_notion_api_key") || "";
      const savedDbId = localStorage.getItem("neo_notion_db_id") || "";
      const savedAuto = localStorage.getItem("neo_notion_auto_sync") === "true";
      setApiKey(savedKey);
      setDatabaseId(savedDbId);
      setAutoSyncEnabled(savedAuto);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCredentials = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("neo_notion_api_key", apiKey.trim());
      localStorage.setItem("neo_notion_db_id", databaseId.trim());
      localStorage.setItem("neo_notion_auto_sync", String(autoSyncEnabled));
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    handleSaveCredentials();

    try {
      const res = await testNotionConnection({
        data: {
          apiKey: apiKey.trim(),
          databaseId: databaseId.trim(),
        },
      });

      setIsTesting(false);
      if (res.ok) {
        setTestResult({ ok: true, title: res.databaseTitle });
      } else {
        setTestResult({ ok: false, error: res.error });
      }
    } catch (e) {
      setIsTesting(false);
      setTestResult({ ok: false, error: e instanceof Error ? e.message : "Connection failed." });
    }
  };

  const handleSyncTransactions = async () => {
    if (!apiKey || !databaseId) {
      alert("Please provide both Notion API Key and Database ID first.");
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);
    handleSaveCredentials();

    try {
      const itemsToSync = store.transactions.map((txn) => ({
        id: txn.id,
        title: txn.title || "Tuition / Fee Payment",
        amount: txn.amount,
        type: txn.type || "fee",
        status: txn.status || "Success",
        method: txn.method || "Digital Wallet",
        date: txn.date || new Date().toLocaleString(),
        referenceId: txn.referenceId,
        receiptNumber: txn.receiptNumber,
        studentName: store.studentProfile.name,
        studentId: store.studentProfile.studentId,
      }));

      const res = await syncTransactionsToNotion({
        data: {
          apiKey: apiKey.trim(),
          databaseId: databaseId.trim(),
          items: itemsToSync,
        },
      });

      setIsSyncing(false);
      if (res.ok) {
        setSyncResult({ ok: true, count: res.syncedCount });
      } else {
        setSyncResult({ ok: false, count: 0, error: res.error || "Failed to sync transactions." });
      }
    } catch (e) {
      setIsSyncing(false);
      setSyncResult({ ok: false, count: 0, error: e instanceof Error ? e.message : "Sync error." });
    }
  };

  return (
    <div
      className="ms-modal-overlay"
      style={{
        position: "fixed", inset: 0, zIndex: 1200,
        background: "rgba(36, 26, 20, 0.7)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="ms-modal"
        style={{
          background: "#FFFFFF", borderRadius: "20px",
          width: "100%", maxWidth: "620px", maxHeight: "90vh",
          overflowY: "auto", padding: "24px",
          boxShadow: "0 24px 60px rgba(36, 26, 20, 0.35)",
          border: "1.5px solid rgba(196, 154, 108, 0.4)",
          display: "flex", flexDirection: "column", gap: "18px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(196, 154, 108, 0.25)", paddingBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: "linear-gradient(135deg, #241A14, #3D2B1F)",
              display: "grid", placeItems: "center", color: "#FFFFFF",
              fontWeight: 800, fontSize: "1.2rem",
            }}>
              N
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#241A14", fontSize: "1.18rem", fontWeight: 800 }}>
                Notion Database Sync & Integration
              </h3>
              <p style={{ margin: "2px 0 0", color: "#8C7A6A", fontSize: "0.78rem" }}>
                Export transactions, fee ledger, and audit logs into your Notion Workspace
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none", border: "none", color: "#8C7A6A",
              cursor: "pointer", minWidth: "44px", minHeight: "44px",
              display: "grid", placeItems: "center", borderRadius: "8px",
            }}
            aria-label="Close Notion modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Setup Instructions Callout */}
        <div style={{
          background: "linear-gradient(135deg, #FDF9F3, #FFF7ED)",
          border: "1px solid rgba(196, 154, 108, 0.35)",
          borderRadius: "14px", padding: "14px",
          display: "flex", flexDirection: "column", gap: "8px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#D35400", fontWeight: 700, fontSize: "0.85rem" }}>
            <HelpCircle size={16} /> 4-Step Quick Setup Guide
          </div>
          <ol style={{ margin: 0, paddingLeft: "18px", fontSize: "0.78rem", color: "#66564A", lineHeight: 1.6 }}>
            <li>
              Go to <a href="https://www.notion.so/my-integrations" target="_blank" rel="noreferrer" style={{ color: "#D35400", fontWeight: 700, textDecoration: "underline" }}>notion.so/my-integrations</a> and create a <strong>New integration</strong> named "Neo Cash AI".
            </li>
            <li>Copy the <strong>Internal Integration Secret</strong> and paste it below.</li>
            <li>In Notion, open your target Database page, click <strong>"..." (Top Right) → "Add connections"</strong>, and select "Neo Cash AI".</li>
            <li>Copy the 32-character <strong>Database ID</strong> from the page URL and paste it below.</li>
          </ol>
        </div>

        {/* Credentials Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 700, color: "#241A14", marginBottom: "6px" }}>
              <Key size={14} style={{ color: "#D35400" }} /> Notion Internal Integration Secret
            </label>
            <input
              type="password"
              placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{
                width: "100%", padding: "10px 14px",
                background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)",
                borderRadius: "10px", color: "#241A14", fontSize: "0.88rem", outline: "none",
                fontFamily: "monospace", boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 700, color: "#241A14", marginBottom: "6px" }}>
              <Database size={14} style={{ color: "#D35400" }} /> Notion Database ID (or full link)
            </label>
            <input
              type="text"
              placeholder="e.g. 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d"
              value={databaseId}
              onChange={(e) => setDatabaseId(e.target.value)}
              style={{
                width: "100%", padding: "10px 14px",
                background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)",
                borderRadius: "10px", color: "#241A14", fontSize: "0.88rem", outline: "none",
                fontFamily: "monospace", boxSizing: "border-box",
              }}
            />
          </div>

          {/* Auto-Sync Toggle */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#FDF9F3", padding: "10px 14px", borderRadius: "10px",
            border: "1px solid rgba(196, 154, 108, 0.3)",
          }}>
            <div>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block" }}>
                Auto-Sync When Payments Cleared
              </span>
              <span style={{ fontSize: "0.72rem", color: "#8C7A6A" }}>
                Automatically write confirmed payments directly to Notion
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoSyncEnabled}
              onChange={(e) => setAutoSyncEnabled(e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "#D35400", cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Test Result Callout */}
        {testResult && (
          <div style={{
            padding: "10px 14px", borderRadius: "10px",
            background: testResult.ok ? "rgba(4, 120, 87, 0.08)" : "rgba(220, 38, 38, 0.08)",
            border: `1px solid ${testResult.ok ? "rgba(4, 120, 87, 0.3)" : "rgba(220, 38, 38, 0.3)"}`,
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            {testResult.ok ? (
              <>
                <CheckCircle2 size={16} style={{ color: "#047857", flexShrink: 0 }} />
                <span style={{ fontSize: "0.82rem", color: "#047857", fontWeight: 700 }}>
                  Connected to Notion! Database: "{testResult.title}"
                </span>
              </>
            ) : (
              <>
                <XCircle size={16} style={{ color: "#DC2626", flexShrink: 0 }} />
                <span style={{ fontSize: "0.8rem", color: "#DC2626", fontWeight: 600 }}>
                  {testResult.error}
                </span>
              </>
            )}
          </div>
        )}

        {/* Sync Result Callout */}
        {syncResult && (
          <div style={{
            padding: "10px 14px", borderRadius: "10px",
            background: syncResult.ok ? "rgba(4, 120, 87, 0.08)" : "rgba(220, 38, 38, 0.08)",
            border: `1px solid ${syncResult.ok ? "rgba(4, 120, 87, 0.3)" : "rgba(220, 38, 38, 0.3)"}`,
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            {syncResult.ok ? (
              <>
                <CheckCircle2 size={16} style={{ color: "#047857", flexShrink: 0 }} />
                <span style={{ fontSize: "0.82rem", color: "#047857", fontWeight: 700 }}>
                  Successfully exported {syncResult.count} transactions to your Notion Database!
                </span>
              </>
            ) : (
              <>
                <XCircle size={16} style={{ color: "#DC2626", flexShrink: 0 }} />
                <span style={{ fontSize: "0.8rem", color: "#DC2626", fontWeight: 600 }}>
                  {syncResult.error}
                </span>
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end", paddingTop: "6px" }}>
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting || !apiKey || !databaseId}
            style={{
              padding: "10px 16px", borderRadius: "10px",
              background: "#FDF9F3", color: "#241A14",
              border: "1px solid rgba(196, 154, 108, 0.4)",
              fontWeight: 700, fontSize: "0.84rem", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            {isTesting ? (
              <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Testing…</>
            ) : (
              <><ShieldCheck size={14} style={{ color: "#D35400" }} /> Test Connection</>
            )}
          </button>

          <button
            type="button"
            onClick={handleSyncTransactions}
            disabled={isSyncing || !apiKey || !databaseId}
            style={{
              padding: "10px 20px", borderRadius: "10px",
              background: "linear-gradient(135deg, #241A14, #3D2B1F)",
              color: "#FFFFFF", border: "none",
              fontWeight: 700, fontSize: "0.86rem", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px",
              boxShadow: "0 4px 12px rgba(36, 26, 20, 0.25)",
            }}
          >
            {isSyncing ? (
              <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Syncing to Notion…</>
            ) : (
              <><FileSpreadsheet size={15} style={{ color: "#FF8C42" }} /> Export Ledger to Notion</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
