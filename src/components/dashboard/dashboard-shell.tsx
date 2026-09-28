/**
 * Dashboard Shell Component — Midnight Sky Architecture
 * 
 * Houses:
 * 1. Demo Role Switcher Bar (Student | Admin | Head | Restart Onboarding)
 * 2. Role-Specific Navigation Sidebar & Mobile Drawer
 * 3. Notifications Drawer
 * 4. Header Bar with User Profile, Notifications count, and Role indicator
 */

import { useEffect, useState } from "react";
import { useNeoStore, Role, Transaction, DEMO_STUDENTS_LIST, DEMO_ADMINS_LIST, DEMO_HEAD_PROFILE } from "@/lib/neo-cash-store";
import { DEMO_ACCOUNTS } from "@/lib/demo-auth";
import { OnboardingFlow } from "./onboarding-flow";
import { StudentPanel } from "./student-panel";
import { AdminPanel } from "./admin-panel";
import { HeadPanel } from "./head-panel";
import { ReceiptModal } from "./receipt-modal";
import { DesignShowcase } from "@/components/design-system/design-showcase";
import purpleLogo from "@/assets/neo-purple-logo.png";
import {
  LayoutDashboard, CreditCard, FileText, HeartHandshake, Sparkles, User, Bell,
  ShieldCheck, Users, FileSpreadsheet, Upload, Trophy, CheckCircle2, RotateCcw,
  LogOut, Layers, AlertCircle, X, Wallet, MessageSquare, Activity, Menu, Moon, Sun
} from "lucide-react";

export function DashboardShell({
  onSignOut,
  onStudentOnboardingComplete,
  onDemoAccountSwitch,
  showDemoController = false,
}: {
  onSignOut: () => void;
  onStudentOnboardingComplete: () => void | Promise<void>;
  onDemoAccountSwitch: (accountId: string) => Promise<void>;
  showDemoController?: boolean;
}) {
  const [store, actions] = useNeoStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [receiptTxn, setReceiptTxn] = useState<Transaction | null>(null);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifTab, setNotifTab] = useState<"unread" | "all" | "payment" | "fee" | "application" | "institution" | "emails">("all");
  const [testEventType, setTestEventType] = useState<any>("login");

  const unreadCount = store.notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("neo_cash_theme");
    const shouldUseDark = savedTheme === "dark";
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const nextThemeIsDark = !isDarkMode;
    setIsDarkMode(nextThemeIsDark);
    document.documentElement.classList.toggle("dark", nextThemeIsDark);
    window.localStorage.setItem("neo_cash_theme", nextThemeIsDark ? "dark" : "light");
  };

  // Legacy controller markup remains below for reference only; it is never
  // rendered because it mutates browser state instead of changing Auth users.
  const handleRoleChange = (_newRole: Role) => {};

  const handleRestartOnboarding = () => {
    actions.setIsOnboarded(false);
    actions.setOnboardingStep(1);
  };

  return (
    <div className="dash-midnight">
      {/* Demo controls are limited to an explicitly started demo session. */}
      {showDemoController && false && <div className="demo-role-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.72rem", background: "rgba(245, 158, 11, 0.15)", color: "#FBBF24", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            DEMO CONTROLLER
          </span>
          <span style={{ color: "var(--ms-text-muted)", fontSize: "0.78rem" }}>
            Select active presentation account:
          </span>
        </div>

        <div className="demo-role-pills" style={{ alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            className={`demo-role-btn ${store.role === "student" ? "is-active" : ""}`}
            onClick={() => handleRoleChange("student")}
          >
            🎓 Student ({DEMO_STUDENTS_LIST.length})
          </button>
          
          <button
            type="button"
            className={`demo-role-btn ${store.role === "admin" ? "is-active" : ""}`}
            onClick={() => handleRoleChange("admin")}
          >
            ⚙️ Admin ({DEMO_ADMINS_LIST.length})
          </button>
          
          <button
            type="button"
            className={`demo-role-btn ${store.role === "head" ? "is-active" : ""}`}
            onClick={() => handleRoleChange("head")}
          >
            🏆 Head (1)
          </button>

          {store.role === "student" && (
            <select
              value={store.studentProfile.studentId}
              onChange={(e) => actions.switchDemoStudent(e.target.value)}
              style={{
                background: "#2E2017",
                color: "#FF8C42",
                border: "1px solid rgba(196, 154, 108, 0.4)",
                borderRadius: "6px",
                padding: "3px 8px",
                fontSize: "0.78rem",
                fontWeight: 700,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {DEMO_STUDENTS_LIST.map((std) => (
                <option key={std.id} value={std.studentId}>
                  👤 {std.name} ({std.studentId}) • {std.department}
                </option>
              ))}
            </select>
          )}

          {store.role === "admin" && (
            <select
              style={{
                background: "#2E2017",
                color: "#FF8C42",
                border: "1px solid rgba(196, 154, 108, 0.4)",
                borderRadius: "6px",
                padding: "3px 8px",
                fontSize: "0.78rem",
                fontWeight: 700,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {DEMO_ADMINS_LIST.map((adm) => (
                <option key={adm.id} value={adm.id}>
                  👨‍💼 {adm.name} ({adm.roleTitle})
                </option>
              ))}
            </select>
          )}

          {store.role === "head" && (
            <span style={{ fontSize: "0.76rem", color: "#FBBF24", fontWeight: 700, background: "rgba(211, 84, 0, 0.15)", padding: "3px 8px", borderRadius: "6px", border: "1px solid rgba(211, 84, 0, 0.3)" }}>
              👑 {DEMO_HEAD_PROFILE.name} (Director)
            </span>
          )}

          <button
            type="button"
            className="demo-role-btn"
            style={{ background: "rgba(245, 158, 11, 0.15)", color: "#FBBF24", marginLeft: "4px" }}
            onClick={handleRestartOnboarding}
          >
            <RotateCcw size={12} /> Test Onboarding Flow
          </button>
        </div>
      </div>}

      {showDemoController && (
        <div className="demo-role-bar">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.72rem", background: "rgba(245, 158, 11, 0.15)", color: "#FBBF24", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "2px 8px", borderRadius: "999px", fontWeight: 800, textTransform: "uppercase" }}>DEMO MODE</span>
            <span style={{ color: "var(--ms-text-muted)", fontSize: "0.78rem" }}>
              Current User: <strong style={{ color: "#EAD9C6" }}>{store.currentSessionUser?.fullName ?? "Demo Controller"}</strong> · <span style={{ textTransform: "capitalize" }}>{store.role}</span>
            </span>
          </div>
          <div className="demo-role-pills" style={{ alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ color: "#8C7A6A", fontSize: "0.74rem", fontWeight: 700 }}>Switch User:</span>
            {(["student", "admin", "head"] as const).map((role) => (
              <div key={role} style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                {DEMO_ACCOUNTS.filter((account) => account.role === role).map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    className={`demo-role-btn ${store.currentSessionUser?.id === account.id ? "is-active" : ""}`}
                    onClick={() => void onDemoAccountSwitch(account.id)}
                  >
                    {account.fullName} ({role})
                  </button>
                ))}
              </div>
            ))}
            <button type="button" className="demo-role-btn" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#FBBF24" }} onClick={handleRestartOnboarding}>
              <RotateCcw size={12} /> Test Onboarding
            </button>
          </div>
        </div>
      )}

      {/* 2. ONBOARDING OVERLAY IF NOT ONBOARDED */}
      {store.currentSessionUser?.role === "student" && !store.isOnboarded && (
        <OnboardingFlow onComplete={onStudentOnboardingComplete} />
      )}

      {/* 3. MAIN DASHBOARD SHELL */}
      <div className="ms-shell">
        {/* SIDEBAR NAVIGATION */}
        <button
          type="button"
          className="ms-mobile-nav-backdrop"
          aria-label="Close navigation"
          onClick={() => setShowMobileNav(false)}
        />
        <aside
          className={`ms-sidebar ${showMobileNav ? "is-open" : ""}`}
          aria-label="Dashboard navigation"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest(".ms-nav-item button")) {
              setShowMobileNav(false);
            }
          }}
        >
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
                  <button className={activeTab === "wallet" ? "is-active" : ""} onClick={() => setActiveTab("wallet")}>
                    <Wallet size={18} /> My Wallet & Payment Methods
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
                <li className="ms-nav-item">
                  <button className={activeTab === "escalations" ? "is-active" : ""} onClick={() => setActiveTab("escalations")}>
                    <MessageSquare size={18} /> Support Queue
                    {(store.escalations?.filter((e) => e.status === "open").length || 0) > 0 && (
                      <span style={{ background: "#D35400", color: "#FFFFFF", padding: "2px 6px", borderRadius: "999px", fontSize: "0.72rem", marginLeft: "6px", fontWeight: 700 }}>
                        {store.escalations?.filter((e) => e.status === "open").length}
                      </span>
                    )}
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "reminders" ? "is-active" : ""} onClick={() => setActiveTab("reminders")}>
                    <Bell size={18} /> Reminder Engine
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "academic" ? "is-active" : ""} onClick={() => setActiveTab("academic")}>
                    <Layers size={18} /> Academic Structure
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "analytics" ? "is-active" : ""} onClick={() => setActiveTab("analytics")}>
                    <Activity size={18} /> Financial Intelligence
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
                    <ShieldCheck size={18} /> Approval Center
                    {(store.partialApplications?.filter((a) => a.status === "forwarded_head").length || 0) > 0 && (
                      <span style={{ background: "#D35400", color: "#FFFFFF", padding: "2px 6px", borderRadius: "999px", fontSize: "0.72rem", marginLeft: "6px", fontWeight: 700 }}>
                        {store.partialApplications?.filter((a) => a.status === "forwarded_head").length}
                      </span>
                    )}
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "students" ? "is-active" : ""} onClick={() => setActiveTab("students")}>
                    <Users size={18} /> Student Directory
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "financial" ? "is-active" : ""} onClick={() => setActiveTab("financial")}>
                    <Activity size={18} /> Financial Solvency
                  </button>
                </li>
                <li className="ms-nav-item">
                  <button className={activeTab === "audit" ? "is-active" : ""} onClick={() => setActiveTab("audit")}>
                    <FileText size={18} /> Admin Activity & Audit
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
            <li className="ms-nav-item" style={{ marginTop: "8px" }}>
              <button type="button" onClick={onSignOut} style={{ color: "#BE123C" }}>
                <LogOut size={18} /> Logout
              </button>
            </li>
          </ul>

          <div className="ms-user-area">
            <div>
              <p style={{ margin: 0, fontWeight: "700", fontSize: "0.88rem", color: "#1C140E" }}>
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
                background: "rgba(225, 29, 72, 0.08)",
                border: "1px solid rgba(225, 29, 72, 0.25)",
                borderRadius: "12px",
                color: "#BE123C",
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
              <h1 style={{ fontSize: "1.2rem", margin: 0, color: "#1C140E", fontWeight: "700" }}>
                {store.selectedInstitution.name}
              </h1>
              <span style={{ fontSize: "0.78rem", color: "var(--ms-text-muted)" }}>
                Intelligent Financial Ecosystem • {store.role.toUpperCase()} PANEL
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <button
                type="button"
                className="ms-mobile-menu-button"
                aria-label="Open navigation"
                aria-expanded={showMobileNav}
                onClick={() => setShowMobileNav(true)}
              >
                <Menu size={20} />
              </button>
              <button
                type="button"
                className="ms-theme-toggle"
                aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
                aria-pressed={isDarkMode}
                onClick={toggleTheme}
                title={isDarkMode ? "Use light mode" : "Use dark mode"}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              {/* Notification Bell */}
              <button
                type="button"
                aria-label="Open notifications"
                aria-expanded={showNotifDrawer}
                onClick={() => setShowNotifDrawer(true)}
                style={{ position: "relative", background: "#FDF9F3", border: "1px solid var(--ms-border)", padding: "8px", borderRadius: "12px", color: "#D35400", cursor: "pointer" }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{ position: "absolute", top: "-4px", right: "-4px", width: "16px", height: "16px", borderRadius: "50%", background: "#BE123C", color: "#FFF", fontSize: "0.68rem", fontWeight: "800", display: "grid", placeItems: "center" }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={store.studentProfile.avatar} alt="Profile" style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--ms-surface-blue)" }} />
              </div>
            </div>
          </header>

          {/* DYNAMIC PANEL CONTENT */}
          <div className="ms-content">
            {activeTab === "design" ? (
              <DesignShowcase />
            ) : (
              <>
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
              </>
            )}
          </div>
        </main>
      </div>

      {/* NOTIFICATIONS DRAWER MODAL (PHASE 10) */}
      {showNotifDrawer && (() => {
        const notifList = store.notifications || [];
        const unreadList = notifList.filter((n) => !n.read);
        const paymentsList = notifList.filter((n) => n.category === "payment");
        const feesList = notifList.filter((n) => n.category === "fee");
        const appsList = notifList.filter((n) => n.category === "application");
        const instList = notifList.filter((n) => n.category === "institution" || n.category === "system");

        const filteredNotifs = notifList.filter((n) => {
          if (notifTab === "unread") return !n.read;
          if (notifTab === "payment") return n.category === "payment";
          if (notifTab === "fee") return n.category === "fee";
          if (notifTab === "application") return n.category === "application";
          if (notifTab === "institution") return n.category === "institution" || n.category === "system" || n.category === "email";
          return true; // all
        });

        return (
          <div className="ms-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowNotifDrawer(false)}>
            <div className="ms-modal" style={{ maxWidth: "560px", background: "#FFFFFF", color: "#241A14" }}>
              
              {/* MODAL HEADER */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid rgba(196, 154, 108, 0.3)", paddingBottom: "12px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h3 style={{ margin: 0, color: "#241A14", fontSize: "1.25rem", fontWeight: 800 }}>
                      Institutional Notification Center
                    </h3>
                    <span style={{ fontSize: "0.72rem", background: "rgba(211, 84, 0, 0.1)", color: "#D35400", padding: "2px 8px", borderRadius: "999px", fontWeight: 700 }}>
                      {unreadList.length} Unread
                    </span>
                  </div>
                  <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#66564A" }}>
                    Real-time alert engine for fee payments, deadlines, applications, and security login events.
                  </p>
                </div>

                <button type="button" onClick={() => setShowNotifDrawer(false)} style={{ background: "none", border: "none", color: "#66564A", cursor: "pointer", padding: "4px" }}>
                  <X size={20} />
                </button>
              </div>

              {/* SIMULATED SECURITY EMAIL ALERT BANNER */}
              <div style={{ background: "#FFF7E6", border: "1px solid rgba(211, 84, 0, 0.35)", padding: "10px 14px", borderRadius: "10px", marginBottom: "14px", fontSize: "0.8rem", color: "#241A14", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.1rem" }}>📧</span>
                <div>
                  <strong>Simulated Email Alert:</strong> New Neo Cash AI login detected from Chrome (Windows) at 04:12 PM. <span style={{ color: "#66564A", fontSize: "0.75rem" }}>(Represented in-system for demo MVP)</span>
                </div>
              </div>

              {/* FILTER TAB PILLS */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
                {[
                  { id: "all", label: "All", count: notifList.length },
                  { id: "unread", label: "Unread", count: unreadList.length },
                  { id: "payment", label: "Payments", count: paymentsList.length },
                  { id: "fee", label: "Fees", count: feesList.length },
                  { id: "application", label: "Applications", count: appsList.length },
                  { id: "institution", label: "Institution", count: instList.length },
                  { id: "emails", label: "📧 Email Logs (" + (store.demoEmailLogs?.length || 0) + ")", count: store.demoEmailLogs?.length || 0 },
                ].map((tab) => {
                  const isActive = notifTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setNotifTab(tab.id as any)}
                      style={{
                        background: isActive ? "#D35400" : "#FDF9F3",
                        color: isActive ? "#FFFFFF" : "#241A14",
                        border: isActive ? "1px solid #D35400" : "1px solid rgba(196, 154, 108, 0.3)",
                        padding: "5px 12px",
                        borderRadius: "999px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {tab.label}
                      <span style={{ background: isActive ? "rgba(255,255,255,0.25)" : "rgba(36,26,20,0.08)", padding: "1px 6px", borderRadius: "999px", fontSize: "0.72rem" }}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* EMAIL SERVICE ABSTRACTION & EVENT SIMULATOR (PHASE 23) */}
              {notifTab === "emails" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "380px", overflowY: "auto", paddingRight: "4px" }}>
                  
                  {/* SERVICE ABSTRACTION BANNER */}
                  <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.35)", borderRadius: "10px", padding: "10px 14px", fontSize: "0.8rem", color: "#241A14" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                      <strong>Email Service Abstraction Status:</strong>
                      <span style={{ fontSize: "0.72rem", background: "rgba(211, 84, 0, 0.12)", color: "#D35400", padding: "2px 8px", borderRadius: "999px", fontWeight: 700 }}>
                        Demo Mode (Provider Not Connected)
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.76rem", color: "#66564A" }}>
                      When Supabase/SMTP is unconfigured, all 12 institutional notification events are logged locally without false delivery claims.
                    </p>
                  </div>

                  {/* EVENT DISPATCH SIMULATOR */}
                  <div style={{ background: "#FFF7E6", border: "1.5px solid rgba(211, 84, 0, 0.3)", borderRadius: "12px", padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#D35400", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      ⚡ Test Notification Event Simulator (12 Events)
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <select
                        value={testEventType}
                        onChange={(e) => setTestEventType(e.target.value)}
                        style={{ flex: 1, padding: "6px 10px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 700, color: "#241A14", outline: "none" }}
                      >
                        <option value="login">🔐 login (Security Login Alert)</option>
                        <option value="fee_assigned">📋 fee assigned (New Fee Obligation)</option>
                        <option value="fee_reminder">⏰ fee reminder (Weekly Scheduled Notice)</option>
                        <option value="payment_success">✅ payment success (Receipt & Clearance)</option>
                        <option value="payment_failure">❌ payment failure (Transaction Declined)</option>
                        <option value="deadline_approaching">⚠️ deadline approaching (Near-Due Warning)</option>
                        <option value="deadline_missed">🚨 deadline missed (Overdue Notice)</option>
                        <option value="partial_payment_submitted">📝 partial payment submitted (Student App)</option>
                        <option value="admin_reviewed">👨‍💼 admin reviewed (Forwarded to Head)</option>
                        <option value="head_approved">🏆 head approved (Installment Unlocked)</option>
                        <option value="head_rejected">🚫 head rejected (Decline Notice)</option>
                        <option value="donation_completed">❤️ donation completed (Welfare Contribution)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          const eventTitles: Record<string, string> = {
                            login: "Security Alert: Login Detected",
                            fee_assigned: "New Fee Assigned: Semester Tuition",
                            fee_reminder: "Weekly Reminder: Upcoming Dues",
                            payment_success: "Payment Success Confirmation",
                            payment_failure: "Payment Attempt Failed",
                            deadline_approaching: "Deadline Approaching Alert",
                            deadline_missed: "Missed Payment Deadline Notice",
                            partial_payment_submitted: "Partial Payment Application Received",
                            admin_reviewed: "Admin Review Completed",
                            head_approved: "Head Approval Granted",
                            head_rejected: "Partial Payment Application Rejected",
                            donation_completed: "Welfare Donation Contribution Completed",
                          };
                          const title = eventTitles[testEventType] || "Notification Event";
                          actions.dispatchNotificationEvent({
                            eventType: testEventType,
                            title,
                            message: `Test execution of [${testEventType}] event. Logged to local email audit logs.`,
                            emailAlert: true,
                          });
                        }}
                        style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "6px 14px", borderRadius: "12px", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}
                      >
                        Dispatch Event
                      </button>
                    </div>
                  </div>

                  {/* DEMO EMAIL LOG LIST */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {(!store.demoEmailLogs || store.demoEmailLogs.length === 0) ? (
                      <div style={{ padding: "20px", textAlign: "center", color: "#8C7A6A", fontSize: "0.82rem" }}>
                        No email logs generated yet.
                      </div>
                    ) : (
                      store.demoEmailLogs.map((log) => (
                        <div key={log.id} style={{ padding: "10px 12px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.25)", borderRadius: "10px", fontSize: "0.8rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#D35400", textTransform: "uppercase", background: "rgba(211, 84, 0, 0.1)", padding: "2px 6px", borderRadius: "999px" }}>
                              {log.eventType}
                            </span>
                            <span style={{ fontSize: "0.72rem", color: "#8C7A6A" }}>{log.timestamp}</span>
                          </div>
                          <div style={{ fontWeight: 700, color: "#241A14" }}>To: {log.recipientName} ({log.to})</div>
                          <div style={{ fontSize: "0.78rem", color: "#66564A", margin: "2px 0" }}>Subject: {log.subject}</div>
                          <div style={{ fontSize: "0.72rem", color: "#8C7A6A", fontStyle: "italic" }}>Status: {log.providerStatus}</div>
                        </div>
                      ))
                    )}
                  </div>

                </div>
              ) : (
                /* NOTIFICATION ITEM LIST */
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "360px", overflowY: "auto", paddingRight: "4px" }}>
                  {filteredNotifs.length === 0 ? (
                    <div style={{ padding: "32px 16px", textAlign: "center", color: "#66564A", fontSize: "0.86rem" }}>
                      No notifications in this category.
                    </div>
                  ) : (
                  filteredNotifs.map((n) => {
                    const isEmail = n.emailAlert || n.category === "email";
                    return (
                      <div
                        key={n.id}
                        style={{
                          padding: "12px 14px",
                          background: !n.read ? "#FFF7E6" : "#FDF9F3",
                          borderRadius: "16px",
                          border: !n.read ? "1.5px solid rgba(211, 84, 0, 0.35)" : "1px solid rgba(196, 154, 108, 0.25)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span
                              style={{
                                background: n.type === "success" ? "rgba(16, 185, 129, 0.12)" : n.type === "warning" ? "rgba(211, 84, 0, 0.12)" : n.type === "error" ? "rgba(190, 18, 60, 0.12)" : "rgba(37, 99, 235, 0.12)",
                                color: n.type === "success" ? "#047857" : n.type === "warning" ? "#D35400" : n.type === "error" ? "#BE123C" : "#1D4ED8",
                                padding: "2px 8px",
                                borderRadius: "999px",
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                textTransform: "uppercase",
                              }}
                            >
                              {n.category || n.type}
                            </span>
                            {!n.read && <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#D35400" }} />}
                          </div>
                          <span style={{ fontSize: "0.72rem", color: "#8C7A6A" }}>{n.date}</span>
                        </div>

                        <h5 style={{ margin: "4px 0 2px", color: "#241A14", fontSize: "0.9rem", fontWeight: 700 }}>
                          {isEmail ? "📧 " : ""}{n.title}
                        </h5>
                        <p style={{ margin: 0, fontSize: "0.82rem", color: "#66564A", lineHeight: 1.4 }}>
                          {n.message}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
              )}

              {/* FOOTER ACTIONS */}
              <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(196, 154, 108, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", color: "#8C7A6A" }}>
                  Showing {filteredNotifs.length} items
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="button" className="ms-btn-secondary" style={{ padding: "6px 14px", fontSize: "0.8rem", background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", fontWeight: 600 }} onClick={() => actions.markAllNotificationsRead()}>
                    Mark All as Read
                  </button>
                  <button type="button" className="ms-btn-primary" style={{ padding: "6px 14px", fontSize: "0.8rem", background: "#D35400", color: "#FFFFFF", borderRadius: "12px", fontWeight: 700 }} onClick={() => setShowNotifDrawer(false)}>
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* RECEIPT MODAL */}
      {receiptTxn && (
        <ReceiptModal transaction={receiptTxn} onClose={() => setReceiptTxn(null)} />
      )}
    </div>
  );
}
