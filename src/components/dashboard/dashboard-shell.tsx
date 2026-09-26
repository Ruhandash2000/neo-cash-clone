/**
 * Dashboard Shell Component — Midnight Sky Architecture
 * 
 * Houses:
 * 1. Demo Role Switcher Bar (Student | Admin | Head | Restart Onboarding)
 * 2. Role-Specific Navigation Sidebar & Mobile Drawer
 * 3. Notifications Drawer
 * 4. Header Bar with User Profile, Notifications count, and Role indicator
 */

import { useState } from "react";
import { useNeoStore, Role, Transaction } from "@/lib/neo-cash-store";
import { OnboardingFlow } from "./onboarding-flow";
import { StudentPanel } from "./student-panel";
import { AdminPanel } from "./admin-panel";
import { HeadPanel } from "./head-panel";
import { ReceiptModal } from "./receipt-modal";
import purpleLogo from "@/assets/neo-purple-logo.png";
import {
  LayoutDashboard, CreditCard, FileText, HeartHandshake, Sparkles, User, Bell,
  ShieldCheck, Users, FileSpreadsheet, Upload, Trophy, CheckCircle2, RotateCcw,
  LogOut, Layers, AlertCircle, X
} from "lucide-react";

export function DashboardShell({ onSignOut }: { onSignOut: () => void }) {
  const [store, actions] = useNeoStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [receiptTxn, setReceiptTxn] = useState<Transaction | null>(null);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  const unreadCount = store.notifications.filter((n) => !n.read).length;

  const handleRoleChange = (newRole: Role) => {
    actions.setRole(newRole);
    setActiveTab("overview");
  };

  const handleRestartOnboarding = () => {
    actions.setIsOnboarded(false);
    actions.setOnboardingStep(1);
  };

  return (
    <div className="dash-midnight">
      {/* 1. DEMO ROLE SWITCHER TOP BANNER */}
      <div className="demo-role-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontWeight: 800, color: "var(--ms-accent)", letterSpacing: "0.05em" }}>
            NEO CASH AI • DEMO ROLE SWITCHER
          </span>
          <span style={{ color: "var(--ms-text-muted)" }}>|</span>
          <span style={{ color: "var(--ms-text-muted)", fontSize: "0.78rem" }}>
            Switch roles to test Student, Admin, or Executive Head views:
          </span>
        </div>

        <div className="demo-role-pills">
          <button
            type="button"
            className={`demo-role-btn ${store.role === "student" ? "is-active" : ""}`}
            onClick={() => handleRoleChange("student")}
          >
            🎓 Student Panel
          </button>
          <button
            type="button"
            className={`demo-role-btn ${store.role === "admin" ? "is-active" : ""}`}
            onClick={() => handleRoleChange("admin")}
          >
            ⚙️ Admin Panel
          </button>
          <button
            type="button"
            className={`demo-role-btn ${store.role === "head" ? "is-active" : ""}`}
            onClick={() => handleRoleChange("head")}
          >
            🏆 Head / Authority
          </button>
          <button
            type="button"
            className="demo-role-btn"
            style={{ background: "rgba(245, 158, 11, 0.2)", color: "#FBBF24" }}
            onClick={handleRestartOnboarding}
          >
            <RotateCcw size={12} /> Test Onboarding
          </button>
        </div>
      </div>

      {/* 2. ONBOARDING OVERLAY IF NOT ONBOARDED */}
      {!store.isOnboarded && (
        <OnboardingFlow onComplete={() => actions.setIsOnboarded(true)} />
      )}

      {/* 3. MAIN DASHBOARD SHELL */}
      <div className="ms-shell">
        {/* SIDEBAR NAVIGATION */}
        <aside className="ms-sidebar">
          <div className="ms-brand">
            <img src={purpleLogo} alt="Neo Cash" className="ms-brand-logo" />
            <span className="ms-role-badge">{store.role} View</span>
          </div>

          <ul className="ms-nav-list">
            {/* STUDENT NAV */}
            {store.role === "student" && (
              <>
                <li className="ms-nav-item">
                  <button className={activeTab === "overview" ? "is-active" : ""} onClick={() => setActiveTab("overview")}>
                    <LayoutDashboard size={18} /> Overview
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "fees" ? "is-active" : ""} onClick={() => setActiveTab("fees")}>
                    <CreditCard size={18} /> Fees & Dues
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "donation" ? "is-active" : ""} onClick={() => setActiveTab("donation")}>
                    <HeartHandshake size={18} /> Social Impact & Points
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "transactions" ? "is-active" : ""} onClick={() => setActiveTab("transactions")}>
                    <FileText size={18} /> Transactions & Receipts
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "ai" ? "is-active" : ""} onClick={() => setActiveTab("ai")}>
                    <Sparkles size={18} style={{ color: "var(--ms-accent)" }} /> AI Assistant
                  </button>
                </li>
              </>
            )}

            {/* ADMIN NAV */}
            {store.role === "admin" && (
              <>
                <li className="ms-nav-item">
                  <button className={activeTab === "overview" ? "is-active" : ""} onClick={() => setActiveTab("overview")}>
                    <LayoutDashboard size={18} /> Operations Center
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "students" ? "is-active" : ""} onClick={() => setActiveTab("students")}>
                    <Users size={18} /> Student Directory
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "bulk" ? "is-active" : ""} onClick={() => setActiveTab("bulk")}>
                    <FileSpreadsheet size={18} /> Bulk Fee Assignment
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "import" ? "is-active" : ""} onClick={() => setActiveTab("import")}>
                    <Upload size={18} /> Excel Import
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "applications" ? "is-active" : ""} onClick={() => setActiveTab("applications")}>
                    <ShieldCheck size={18} /> Partial Payment Queue
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "audit" ? "is-active" : ""} onClick={() => setActiveTab("audit")}>
                    <FileText size={18} /> Audit Trail
                  </button>
                </li>
              </>
            )}

            {/* HEAD / AUTHORITY NAV */}
            {store.role === "head" && (
              <>
                <li className="ms-nav-item">
                  <button className={activeTab === "overview" ? "is-active" : ""} onClick={() => setActiveTab("overview")}>
                    <LayoutDashboard size={18} /> Executive Command
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "approvals" ? "is-active" : ""} onClick={() => setActiveTab("approvals")}>
                    <CheckCircle2 size={18} /> Executive Approvals
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "trophy" ? "is-active" : ""} onClick={() => setActiveTab("trophy")}>
                    <Trophy size={18} style={{ color: "#FBBF24" }} /> Impact Center 🏆
                  </button>
                </li>
              </>
            )}

            {/* COMMON LOGOUT ITEM IN SIDEBAR NAV */}
            <li className="ms-nav-item" style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--ms-border)" }}>
              <button type="button" onClick={onSignOut} style={{ color: "#EF4444" }}>
                <LogOut size={18} /> Logout
              </button>
            </li>
          </ul>

          <div className="ms-user-area">
            <div>
              <p style={{ margin: 0, fontWeight: "700", fontSize: "0.88rem", color: "#FFF" }}>
                {store.role === "student" ? store.studentProfile.name : store.role === "admin" ? "Refat Rahman" : "Prof. Dr. M. A. Karim"}
              </p>
              <span style={{ fontSize: "0.75rem", color: "var(--ms-text-muted)" }}>
                {store.role === "student" ? "Student" : store.role === "admin" ? "Financial Admin" : "Director & Executive"}
              </span>
            </div>
            <button
              type="button"
              onClick={onSignOut}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 10px",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                borderRadius: "8px",
                color: "#FCA5A5",
                fontSize: "0.78rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
              title="Sign Out"
            >
              <LogOut size={14} /> Exit
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="ms-main">
          {/* HEADER BAR */}
          <header className="ms-header">
            <div>
              <h1 style={{ fontSize: "1.2rem", margin: 0, color: "#FFF" }}>
                {store.selectedInstitution.name}
              </h1>
              <span style={{ fontSize: "0.78rem", color: "var(--ms-text-muted)" }}>
                Intelligent Financial Ecosystem • {store.role.toUpperCase()} PANEL
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {/* Notification Bell */}
              <button
                type="button"
                onClick={() => setShowNotifDrawer(true)}
                style={{ position: "relative", background: "rgba(30, 58, 138, 0.4)", border: "1px solid var(--ms-border)", padding: "8px", borderRadius: "10px", color: "var(--ms-light)", cursor: "pointer" }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{ position: "absolute", top: "-4px", right: "-4px", width: "16px", height: "16px", borderRadius: "50%", background: "var(--ms-error)", color: "#FFF", fontSize: "0.68rem", fontWeight: "800", display: "grid", placeItems: "center" }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={store.studentProfile.avatar} alt="Profile" style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--ms-surface-blue)" }} />
              </div>

              {/* Header Logout Button */}
              <button
                type="button"
                onClick={onSignOut}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  borderRadius: "10px",
                  color: "#FCA5A5",
                  fontSize: "0.82rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          </header>

          {/* DYNAMIC PANEL CONTENT */}
          <div className="ms-content">
            {store.role === "student" && (
              <StudentPanel
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenReceipt={(txn) => setReceiptTxn(txn)}
              />
            )}
            {store.role === "admin" && (
              <AdminPanel
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}
            {store.role === "head" && (
              <HeadPanel
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}
          </div>
        </main>
      </div>

      {/* NOTIFICATIONS DRAWER MODAL */}
      {showNotifDrawer && (
        <div className="ms-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowNotifDrawer(false)}>
          <div className="ms-modal" style={{ maxWidth: "440px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, color: "#FFF", fontSize: "1.1rem" }}>System Notifications</h3>
              <button type="button" onClick={() => setShowNotifDrawer(false)} style={{ background: "none", border: "none", color: "var(--ms-text-muted)", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "400px", overflowY: "auto" }}>
              {store.notifications.map((n) => (
                <div key={n.id} style={{ padding: "12px", background: "rgba(30, 58, 138, 0.25)", borderRadius: "12px", border: "1px solid var(--ms-border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h5 style={{ margin: 0, color: "#FFF", fontSize: "0.88rem" }}>{n.title}</h5>
                    <span style={{ fontSize: "0.72rem", color: "var(--ms-text-dim)" }}>{n.date}</span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "var(--ms-text-muted)" }}>{n.message}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "16px", textAlign: "right" }}>
              <button type="button" className="ms-btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={() => actions.markAllNotificationsRead()}>
                Mark All as Read
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {receiptTxn && (
        <ReceiptModal transaction={receiptTxn} onClose={() => setReceiptTxn(null)} />
      )}
    </div>
  );
}
