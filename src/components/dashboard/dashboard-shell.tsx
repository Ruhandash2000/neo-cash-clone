/**
 * Dashboard Shell — Responsive Layout
 *
 * MOBILE  (< 768px) : Top header + bottom tab bar [Facebook mobile style]
 * DESKTOP (≥ 768px) : Left sidebar + top mini-bar [Discord/Linear style]
 *
 * Common:
 *  • Floating AI orb (always on)
 *  • Profile slide-up sheet
 *  • Demo bar strip
 */

import { useEffect, useState } from "react";
import {
  useNeoStore, Transaction,
  DEMO_STUDENTS_LIST, DEMO_ADMINS_LIST, DEMO_HEAD_PROFILE,
} from "@/lib/neo-cash-store";
import { DEMO_ACCOUNTS }    from "@/lib/demo-auth";
import { OnboardingFlow }   from "./onboarding-flow";
import { StudentPanel }     from "./student-panel";
import { AdminPanel }       from "./admin-panel";
import { HeadPanel }        from "./head-panel";
import { ReceiptModal }     from "./receipt-modal";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { ThemePaletteSelector } from "./theme-palette-selector";
import { FloatingAI }       from "@/components/ai/floating-ai";
import { AvatarUpload }     from "@/components/ui/avatar-upload";
import { useTheme }         from "@/lib/theme-provider";
import purpleLogo           from "@/assets/neo-purple-logo.png";
import {
  LayoutDashboard, CreditCard, FileText, HeartHandshake,
  Wallet, ShieldCheck, Users, Trophy, RotateCcw, LogOut,
  MessageSquare, Activity, Moon, Sun, ChevronRight,
  Settings, UserCircle, Bell,
} from "lucide-react";

/* ─────────── nav ───────────────────────────────────────────────── */
type NavItem = { id: string; label: string; icon: React.ReactNode; badge?: number };

function studentNav(): NavItem[] {
  return [
    { id: "overview",     label: "Home",         icon: <LayoutDashboard size={20} /> },
    { id: "fees",         label: "Fees & Dues",  icon: <CreditCard size={20} /> },
    { id: "wallet",       label: "Wallet",       icon: <Wallet size={20} /> },
    { id: "transactions", label: "History",      icon: <FileText size={20} /> },
    { id: "donation",     label: "Donate",       icon: <HeartHandshake size={20} /> },
  ];
}

function adminNav(store: any): NavItem[] {
  const openEsc = store.escalations?.filter((e: any) => e.status === "open").length ?? 0;
  const openApps = store.partialApplications?.filter((a: any) => a.status === "pending_review").length ?? 0;
  return [
    { id: "overview",     label: "Operations",   icon: <LayoutDashboard size={20} /> },
    { id: "students",     label: "Students",     icon: <Users size={20} /> },
    { id: "applications", label: "Pay Queue",    icon: <ShieldCheck size={20} />, badge: openApps },
    { id: "analytics",    label: "Analytics",    icon: <Activity size={20} /> },
    { id: "escalations",  label: "Support",      icon: <MessageSquare size={20} />, badge: openEsc },
    { id: "bulk",         label: "Bulk Fees",    icon: <CreditCard size={20} /> },
    { id: "audit",        label: "Audit Trail",  icon: <FileText size={20} /> },
    { id: "reminders",    label: "Reminders",    icon: <Bell size={20} /> },
  ];
}

function headNav(store: any): NavItem[] {
  const pending = store.partialApplications?.filter((a: any) => a.status === "forwarded_head").length ?? 0;
  return [
    { id: "overview",  label: "Command",    icon: <LayoutDashboard size={20} /> },
    { id: "approvals", label: "Approvals",  icon: <ShieldCheck size={20} />, badge: pending },
    { id: "students",  label: "Directory",  icon: <Users size={20} /> },
    { id: "financial", label: "Financials", icon: <Activity size={20} /> },
    { id: "audit",     label: "Audit",      icon: <FileText size={20} /> },
    { id: "trophy",    label: "Impact",     icon: <Trophy size={20} /> },
  ];
}

/* ─────────── role badge colors ─────────────────────────────────── */
const ROLE_COLORS: { [key: string]: string } = {
  student: "rgba(211,84,0,0.15)", // Burnt Orange
  admin:   "rgba(180,83,9,0.15)", // Dark Bronze
  head:    "rgba(247,183,51,0.15)", // Gold
};
const ROLE_TEXT: { [key: string]: string } = {
  student: "var(--theme-color-900)", // Burnt Orange
  admin:   "#B45309", // Dark Bronze
  head:    "#D97706", // Dark Gold
};

/* ─────────── component ──────────────────────────────────────────── */
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
  const [activeTab, setActiveTab]     = useState("overview");
  const [receiptTxn, setReceiptTxn]   = useState<Transaction | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [avatarSrc, setAvatarSrc]     = useState<string>("");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    try {
      const av = localStorage.getItem("neo_cash_avatar");
      if (av) setAvatarSrc(av);
    } catch {}
  }, []);

  useEffect(() => { setActiveTab("overview"); }, [store.role]);


  const handleRestartOnboarding = () => {
    actions.setIsOnboarded(false);
    actions.setOnboardingStep(1);
  };

  const navItems = store.role === "student" ? studentNav()
    : store.role === "admin" ? adminNav(store) : headNav(store);

  const unreadCount = store.notifications?.filter((n) => !n.read).length ?? 0;
  const displayName = store.role === "student" ? store.studentProfile.name
    : store.role === "admin" ? "Refat Rahman" : "Prof. Dr. M. A. Karim";
  const roleLabel = store.role === "student" ? "Student"
    : store.role === "admin" ? "Financial Admin" : "Director & Executive";
  const currentNavLabel = navItems.find((n) => n.id === activeTab)?.label ?? "Dashboard";

  /* ── SIDEBAR NAV ITEM (desktop) ────────────────────────────────── */
  const SideNavItem = ({ item }: { item: NavItem }) => {
    const isActive = activeTab === item.id;
    return (
      <button
        type="button"
        onClick={() => setActiveTab(item.id)}
        title={!sidebarExpanded ? item.label : undefined}
        aria-current={isActive ? "page" : undefined}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: sidebarExpanded ? "10px" : "0",
          justifyContent: sidebarExpanded ? "flex-start" : "center",
          padding: sidebarExpanded ? "10px 14px" : "10px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          position: "relative",
          background: isActive
            ? `${ROLE_COLORS[store.role]}`
            : "transparent",
          color: isActive ? ROLE_TEXT[store.role] : "#6B7280",
          fontWeight: isActive ? 700 : 500,
          fontSize: "0.88rem",
          transition: "all 0.15s",
          textAlign: "left",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.background = "rgba(0,0,0,0.04)";
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.background = "transparent";
        }}
      >
        {/* Left accent bar */}
        {isActive && (
          <div style={{
            position: "absolute", left: 0, top: "20%", bottom: "20%",
            width: "3px",
            background: `linear-gradient(180deg, ${ROLE_TEXT[store.role]}, ${ROLE_TEXT[store.role]}88)`,
            borderRadius: "0 3px 3px 0",
          }} />
        )}

        <div style={{ flexShrink: 0, position: "relative" }}>
          {item.icon}
          {/* Badge on icon when collapsed */}
          {!sidebarExpanded && (item.badge ?? 0) > 0 && (
            <div style={{
              position: "absolute", top: "-4px", right: "-4px",
              background: "var(--theme-color-900)", color: "#FFF",
              fontSize: "0.55rem", fontWeight: 800,
              width: "14px", height: "14px",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1.5px solid #FFF",
            }}>
              {item.badge! > 9 ? "9+" : item.badge}
            </div>
          )}
        </div>

        {sidebarExpanded && (
          <>
            <span style={{ flex: 1 }}>{item.label}</span>
            {(item.badge ?? 0) > 0 && (
              <span style={{
                background: "var(--theme-color-900)", color: "#FFF",
                fontSize: "0.65rem", fontWeight: 800,
                padding: "1px 6px", borderRadius: "999px",
              }}>
                {item.badge! > 9 ? "9+" : item.badge}
              </span>
            )}
          </>
        )}
      </button>
    );
  };

  return (
    <div className="dash-midnight" style={{ display: "flex", flexDirection: "column", height: "100dvh", overflow: "hidden" }}>

      {/* ── DEMO BAR ───────────────────────────────────────────────── */}
      {showDemoController && (
        <div style={{
          background: "linear-gradient(90deg, #1a0a00, #2E1503)",
          borderBottom: "1px solid rgba(196,154,108,0.2)",
          padding: "5px 12px",
          display: "flex", alignItems: "center", gap: "8px",
          flexWrap: "wrap", flexShrink: 0, fontSize: "0.72rem",
        }}>
          <span style={{ background: "rgba(245,158,11,0.15)", color: "#FBBF24", border: "1px solid rgba(245,158,11,0.3)", padding: "1px 7px", borderRadius: "999px", fontWeight: 800, textTransform: "uppercase" }}>
            DEMO
          </span>
          <span style={{ color: "#8C7A6A" }}>
            Active: <strong style={{ color: "#EAD9C6" }}>{store.currentSessionUser?.fullName ?? "—"}</strong>
          </span>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginLeft: "auto" }}>
            {DEMO_ACCOUNTS.map((acc) => (
              <button key={acc.id} type="button"
                onClick={() => void onDemoAccountSwitch(acc.id)}
                style={{
                  padding: "1px 8px", borderRadius: "999px", fontSize: "0.7rem",
                  fontWeight: 700, cursor: "pointer",
                  background: store.currentSessionUser?.id === acc.id ? "rgba(211,84,0,0.2)" : "rgba(255,255,255,0.06)",
                  color: store.currentSessionUser?.id === acc.id ? "var(--theme-color-500)" : "#8C7A6A",
                  border: store.currentSessionUser?.id === acc.id ? "1px solid rgba(211,84,0,0.4)" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {acc.fullName.split(" ")[0]}
              </button>
            ))}
            <button type="button" onClick={handleRestartOnboarding}
              style={{ padding: "1px 8px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", background: "rgba(245,158,11,0.1)", color: "#FBBF24", border: "1px solid rgba(245,158,11,0.2)" }}>
              <RotateCcw size={9} style={{ display: "inline", marginRight: 2 }} />Onboarding
            </button>
          </div>
        </div>
      )}

      {/* ── ONBOARDING ──────────────────────────────────────────────── */}
      {store.currentSessionUser?.role === "student" && !store.isOnboarded && (
        <OnboardingFlow onComplete={onStudentOnboardingComplete} />
      )}

      {/* ── BODY (sidebar + main) ───────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* ════════════════════════════════════════════════════════════
            DESKTOP SIDEBAR (hidden on mobile via CSS)
            ════════════════════════════════════════════════════════════ */}
        <aside className="desktop-sidebar" style={{
          width: sidebarExpanded ? "224px" : "62px",
          flexShrink: 0,
          background: "#FFFFFF",
          borderRight: "1px solid rgba(0,0,0,0.07)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.22s ease",
          overflow: "hidden",
          boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
        }}>

          {/* Brand / Logo */}
          <div style={{
            padding: sidebarExpanded ? "18px 16px 12px" : "18px 0 12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: sidebarExpanded ? "flex-start" : "center",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            flexShrink: 0,
          }}>
            <img src={purpleLogo} alt="Neo Cash" style={{ width: "32px", height: "32px", objectFit: "contain", flexShrink: 0 }} />
            {sidebarExpanded && (
              <div>
                <div style={{ fontWeight: 800, fontSize: "1rem", color: "#1C140E", lineHeight: 1.1 }}>Neo Cash</div>
                <div style={{
                  display: "inline-block", fontSize: "0.65rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  color: ROLE_TEXT[store.role],
                  background: ROLE_COLORS[store.role],
                  padding: "1px 6px", borderRadius: "4px", marginTop: "2px",
                }}>
                  {store.role} panel
                </div>
              </div>
            )}
          </div>

          {/* Nav items */}
          <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "8px 6px" }}>
            {navItems.map((item) => <SideNavItem key={item.id} item={item} />)}
          </nav>

          {/* User section */}
          <div style={{
            borderTop: "1px solid rgba(0,0,0,0.06)",
            padding: sidebarExpanded ? "10px 10px" : "10px 6px",
            flexShrink: 0,
          }}>
            {/* Profile row */}
            <button
              type="button"
              onClick={() => setShowProfile(true)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: sidebarExpanded ? "10px" : "0",
                justifyContent: sidebarExpanded ? "flex-start" : "center",
                background: "transparent",
                border: "none",
                borderRadius: "10px",
                padding: "8px",
                cursor: "pointer",
                marginBottom: "4px",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <AvatarUpload
                src={avatarSrc || store.studentProfile.avatar}
                name={displayName}
                size={32}
                editable={false}
              />
              {sidebarExpanded && (
                <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#1C140E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {displayName.split(" ")[0]}
                  </div>
                  <div style={{ fontSize: "0.69rem", color: "#9CA3AF" }}>{roleLabel}</div>
                </div>
              )}
            </button>

            {/* Action buttons row */}
            <div style={{ display: "flex", gap: "4px", justifyContent: sidebarExpanded ? "flex-start" : "center" }}>
              {/* Collapse toggle */}
              <button
                type="button"
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "6px", borderRadius: "8px", color: "#9CA3AF",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = "#374151"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#9CA3AF"; }}
              >
                {/* Arrow icon that flips */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: sidebarExpanded ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.22s" }}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {sidebarExpanded && (
                <>
                  <button type="button" onClick={toggleTheme} title={isDarkMode ? "Light mode" : "Dark mode"}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: "8px", color: "#9CA3AF", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = "#374151"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#9CA3AF"; }}>
                    {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
                  </button>
                  <button type="button" onClick={onSignOut} title="Sign out"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: "8px", color: "#9CA3AF", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#EF4444"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#9CA3AF"; }}>
                    <LogOut size={15} />
                  </button>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* ════════════════════════════════════════════════════════════
            MAIN CONTENT AREA
            ════════════════════════════════════════════════════════════ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          {/* TOP MINI-BAR */}
          <header style={{
            background: "#FFFFFF",
            borderBottom: "1px solid rgba(0,0,0,0.07)",
            padding: "0 16px",
            height: "52px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}>
            {/* Mobile logo (hidden on desktop) */}
            <img src={purpleLogo} alt="Neo Cash" className="mobile-only-logo" style={{ height: "28px", width: "28px", objectFit: "contain", flexShrink: 0 }} />

            {/* Page title */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1C140E" }}>{currentNavLabel}</span>
              <span style={{ color: "#D1D5DB", fontSize: "0.8rem" }}>/</span>
              <span style={{ fontSize: "0.72rem", color: "#9CA3AF", fontWeight: 500 }}>
                {store.selectedInstitution?.name ?? "Neo Cash"}
              </span>
            </div>

            {/* Right: actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {/* Theme (mobile only — desktop has it in sidebar) */}
              <button type="button" onClick={toggleTheme} className="mobile-only-btn"
                style={{ background: "rgba(0,0,0,0.04)", border: "none", borderRadius: "50%", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                {isDarkMode ? <Sun size={16} color="var(--theme-color-900)" /> : <Moon size={16} color="#6B7280" />}
              </button>

              <ThemePaletteSelector />
              <NotificationBell userId={store.currentSessionUser?.id ?? ""} />

              {/* Avatar */}
              <button type="button" onClick={() => setShowProfile(true)}
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                <AvatarUpload
                  src={avatarSrc || store.studentProfile.avatar}
                  name={displayName}
                  size={34}
                  editable={false}
                />
              </button>
            </div>
          </header>

          {/* PANEL CONTENT */}
          <main style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <div className="hide-scrollbar" style={{ height: "100%", overflowY: "auto", padding: "24px 28px", paddingBottom: "calc(64px * var(--show-bottom-nav, 0))" }} id="main-scroll">
              {store.role === "student" && (
                <StudentPanel activeTab={activeTab} setActiveTab={setActiveTab} onOpenReceipt={(txn) => setReceiptTxn(txn)} />
              )}
              {store.role === "admin" && (
                <AdminPanel activeTab={activeTab} setActiveTab={setActiveTab} />
              )}
              {store.role === "head" && (
                <HeadPanel activeTab={activeTab} setActiveTab={setActiveTab} />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          MOBILE BOTTOM TAB BAR (hidden on desktop via CSS)
          ════════════════════════════════════════════════════════════ */}
      <nav className="mobile-bottom-nav" style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        height: "calc(56px + env(safe-area-inset-bottom, 0px))",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        background: "#FFFFFF",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        zIndex: 200,
        boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
      }}>
        {navItems.slice(0, 5).map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              style={{
                flex: 1,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: "3px",
                border: "none",
                background: "none",
                cursor: "pointer",
                position: "relative",
                color: isActive ? "var(--theme-color-500)" : "#9CA3AF",
                transition: "color 0.15s",
                paddingBottom: "2px",
              }}
            >
              {isActive && (
                <div style={{
                  position: "absolute", top: 0, left: "20%", right: "20%",
                  height: "3px",
                  background: "linear-gradient(90deg, var(--theme-color-500), var(--theme-color-900))",
                  borderRadius: "0 0 3px 3px",
                }} />
              )}
              {(item.badge ?? 0) > 0 && (
                <div style={{
                  position: "absolute", top: "6px", right: "calc(50% - 18px)",
                  background: "var(--theme-color-900)", color: "#FFF",
                  fontSize: "0.6rem", fontWeight: 800,
                  minWidth: "16px", height: "16px",
                  borderRadius: "999px", padding: "0 3px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "2px solid #FFF",
                }}>
                  {item.badge! > 9 ? "9+" : item.badge}
                </div>
              )}
              <div style={{ transform: isActive ? "scale(1.12)" : "scale(1)", transition: "transform 0.15s" }}>
                {item.icon}
              </div>
              <span style={{ fontSize: "0.63rem", fontWeight: isActive ? 700 : 500 }}>
                {item.label.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── PROFILE SHEET ───────────────────────────────────────────── */}
      {showProfile && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end" }}
          onClick={(e) => e.target === e.currentTarget && setShowProfile(false)}
        >
          <div style={{
            width: "100%", maxWidth: "480px", margin: "0 auto",
            background: "#FFFFFF",
            borderRadius: "24px 24px 0 0",
            padding: "0 0 calc(24px + env(safe-area-inset-bottom, 0px))",
            animation: "slideUp 0.25s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px" }}>
              <div style={{ width: "36px", height: "4px", background: "rgba(156, 163, 175, 0.4)", borderRadius: "2px" }} />
            </div>

            {/* Profile header */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "0 20px 16px", borderBottom: "1px solid rgba(156, 163, 175, 0.2)" }}>
              <AvatarUpload
                src={avatarSrc || store.studentProfile.avatar}
                name={displayName}
                size={68}
                editable
                onChanged={(url) => setAvatarSrc(url)}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#1C140E" }}>{displayName}</div>
                <div style={{ fontSize: "0.78rem", color: "#8C7A6A", marginTop: "1px" }}>{roleLabel}</div>
                {store.role === "student" && (
                  <div style={{ fontSize: "0.72rem", color: ROLE_TEXT["student"], marginTop: "3px", fontWeight: 600 }}>
                    {store.studentProfile.studentId} · {store.studentProfile.department}
                  </div>
                )}
              </div>
            </div>

            {/* Wallet card for students */}
            {store.role === "student" && (
              <div style={{
                margin: "12px 16px",
                background: "linear-gradient(135deg, var(--theme-color-500) 0%, var(--theme-color-900) 100%)",
                borderRadius: "14px", padding: "14px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" }}>Neo Wallet</div>
                  <div style={{ color: "#FFF", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", marginTop: "2px" }}>
                    ৳{(store.balances?.walletBalance ?? 0).toLocaleString("en-BD")}
                  </div>
                </div>
                <Wallet size={28} color="rgba(255,255,255,0.45)" />
              </div>
            )}

            {/* Menu items */}
            <div style={{ padding: "4px 8px" }}>
              {[
                { icon: <UserCircle size={19} color="var(--theme-color-900)" />, label: "Profile", sub: "Edit your info", bg: "var(--theme-transparent)", action: () => { setActiveTab("overview"); setShowProfile(false); } },
                { icon: <Bell size={19} color="var(--theme-color-900)" />, label: "Notifications", sub: `${unreadCount} unread`, bg: "var(--theme-transparent)", action: () => setShowProfile(false) },
                { icon: isDarkMode ? <Sun size={19} color="#9CA3AF" /> : <Moon size={19} color="#6B7280" />, label: isDarkMode ? "Light Mode" : "Dark Mode", sub: "Toggle appearance", bg: "rgba(107, 114, 128, 0.1)", action: () => { toggleTheme(); setShowProfile(false); } },
                { icon: <Settings size={19} color="#9CA3AF" />, label: "Settings", sub: "Preferences & security", bg: "rgba(107, 114, 128, 0.1)", action: () => setShowProfile(false) },
              ].map((item) => (
                <button key={item.label} type="button" onClick={item.action}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "11px 10px", background: "none", border: "none", cursor: "pointer", borderRadius: "12px", textAlign: "left", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(124, 124, 124, 0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem", color: isDarkMode ? "#FFFFFF" : "#1C140E" }}>{item.label}</div>
                    <div style={{ fontSize: "0.74rem", color: "#9CA3AF", marginTop: "1px" }}>{item.sub}</div>
                  </div>
                  <ChevronRight size={15} color="#9CA3AF" />
                </button>
              ))}

              {/* Sign out */}
              <button type="button" onClick={() => { setShowProfile(false); onSignOut(); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "11px 10px", background: "none", border: "none", cursor: "pointer", borderRadius: "12px", textAlign: "left", marginTop: "4px", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(239, 68, 68, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <LogOut size={19} color="#EF4444" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#EF4444" }}>Sign Out</div>
                  <div style={{ fontSize: "0.74rem", color: "#9CA3AF", marginTop: "1px" }}>End your session</div>
                </div>
                <ChevronRight size={15} color="#EF4444" />
              </button>
            </div>
          </div>
        </div>
      )}

      {receiptTxn && (
        <ReceiptModal transaction={receiptTxn} onClose={() => setReceiptTxn(null)} />
      )}


      {/* ════════════════════════════════════════════════════════════════
          MOBILE BOTTOM NAV BAR (hidden on ≥768px)
          Android 18-inspired: pill indicator, haptic icons, role-colored
          ════════════════════════════════════════════════════════════════ */}
      <nav className="mobile-bottom-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        height: "64px",
        background: "#FFFFFF",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "stretch",
        zIndex: 200,
        boxShadow: "0 -2px 16px rgba(0,0,0,0.06)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {navItems.slice(0, 4).map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px 4px 4px",
                position: "relative",
                transition: "all 0.15s",
              }}
            >
              {/* Active pill indicator */}
              {isActive && (
                <div style={{
                  position: "absolute",
                  top: "6px",
                  width: "32px",
                  height: "28px",
                  background: ROLE_COLORS[store.role],
                  borderRadius: "14px",
                  zIndex: 0,
                  transition: "all 0.2s ease",
                }} />
              )}
              <div style={{
                position: "relative", zIndex: 1,
                color: isActive ? ROLE_TEXT[store.role] : "#9CA3AF",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "color 0.15s",
                transform: isActive ? "scale(1.1)" : "scale(1)",
              }}>
                {item.icon}
                {/* Badge */}
                {(item.badge ?? 0) > 0 && (
                  <div style={{
                    position: "absolute", top: "-4px", right: "-5px",
                    background: "#EF4444", color: "#FFF",
                    fontSize: "0.5rem", fontWeight: 800,
                    width: "14px", height: "14px",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1.5px solid #FFF",
                  }}>{item.badge}</div>
                )}
              </div>
              <span style={{
                fontSize: "0.62rem",
                fontWeight: isActive ? 700 : 400,
                color: isActive ? ROLE_TEXT[store.role] : "#9CA3AF",
                transition: "color 0.15s",
                lineHeight: 1,
              }}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Profile tab — always last */}
        <button
          type="button"
          onClick={() => setShowProfile(true)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "3px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 4px 4px",
          }}
        >
          {/* Profile avatar circle */}
          <div style={{
            width: "24px", height: "24px", borderRadius: "50%",
            background: ROLE_COLORS[store.role],
            border: `1.5px solid ${ROLE_TEXT[store.role]}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            {avatarSrc ? (
              <img src={avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "0.65rem", fontWeight: 800, color: ROLE_TEXT[store.role] }}>
                {(displayName ?? "U")[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <span style={{ fontSize: "0.62rem", fontWeight: 400, color: "#9CA3AF", lineHeight: 1 }}>Me</span>
        </button>
      </nav>

      <FloatingAI />

      <style>{`
        /* ── RESPONSIVE: hide/show sidebar vs bottom nav ── */
        @media (min-width: 768px) {
          .mobile-bottom-nav { display: none !important; }
          .mobile-only-logo  { display: none !important; }
          .mobile-only-btn   { display: none !important; }
          #main-scroll       { --show-bottom-nav: 0; padding-bottom: 90px !important; padding-left: 28px !important; padding-right: 28px !important; }
        }
        @media (max-width: 767px) {
          .desktop-sidebar   { display: none !important; }
          #main-scroll       { --show-bottom-nav: 1; padding-bottom: 120px !important; padding-left: 14px !important; padding-right: 14px !important; }
        }

        /* ── Animations ── */
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50%       { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .floating-ai-orb.pulse {
          animation: orbPulse 2s ease infinite;
        }
        @keyframes orbPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(211,84,0,0.5); transform: scale(1); }
          50%       { box-shadow: 0 4px 32px rgba(211,84,0,0.8); transform: scale(1.07); }
        }
        /* Hidden scrollbar as requested */
        #main-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        #main-scroll::-webkit-scrollbar { 
          display: none; 
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

