/**
 * Phase 5: Admin Analytics Dashboard
 *
 * Real-time analytics panel for admins/heads showing:
 * - Transaction volume trend (last 14 days)
 * - Fee collection progress
 * - Wallet statistics
 * - Signature verification stats
 * - Recent audit log
 *
 * Uses Recharts for charts and Supabase real-time for live updates.
 */

import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, Wallet, GraduationCap,
  ShieldCheck, Activity, Users, AlertTriangle,
  CheckCircle2, XCircle, Clock, RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DailyTx {
  day: string;
  total_amount: number;
  credit_amount: number;
  debit_amount: number;
  completed_count: number;
  failed_count: number;
}

interface FeeSummary {
  institution_name: string;
  institution_code: string;
  total_fees_due: number;
  total_fees_paid: number;
  collection_rate_pct: number;
}

interface WalletStats {
  total_wallets: number;
  total_balance: number;
  avg_balance: number;
  active_wallets: number;
  total_ever_deposited: number;
  total_ever_spent: number;
}

interface SigStats {
  total_verifications: number;
  verified_count: number;
  rejected_count: number;
  manual_review_count: number;
  avg_similarity_score: number;
  admin_approved_count: number;
}

interface AuditEntry {
  id: string;
  actor_email: string;
  action: string;
  entity_type: string | null;
  amount_bdt: number | null;
  created_at: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const tk = (n: number | null | undefined) =>
  `৳${(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const PALETTE = ["#D35400", "#FF8C42", "#FF6B2B", "#C0392B", "#E67E22", "#F39C12"];
const GREEN   = "#047857";
const RED     = "#DC2626";
const AMBER   = "#D97706";

function StatCard({
  icon: Icon, label, value, sub, trend, color = "#D35400",
}: {
  icon: React.ElementType; label: string; value: string; sub?: string;
  trend?: "up" | "down"; color?: string;
}) {
  return (
    <div style={{
      background: "#FFFFFF",
      border: "1px solid rgba(196, 154, 108, 0.3)",
      borderRadius: "16px", padding: "20px",
      display: "flex", alignItems: "flex-start", gap: "14px",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "12px",
        background: `${color}18`, display: "flex",
        alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: "0.75rem", color: "#8C7A6A", fontWeight: 600, textTransform: "uppercase" }}>
          {label}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "1.5rem", fontWeight: 900, color: "#241A14", lineHeight: 1 }}>
          {value}
        </p>
        {sub && (
          <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: trend === "up" ? GREEN : trend === "down" ? RED : "#8C7A6A" }}>
            {trend === "up" && <TrendingUp size={11} style={{ marginRight: 3, verticalAlign: "middle" }} />}
            {trend === "down" && <TrendingDown size={11} style={{ marginRight: 3, verticalAlign: "middle" }} />}
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AdminAnalyticsDashboard() {
  const [dailyTx, setDailyTx] = useState<DailyTx[]>([]);
  const [feeSummary, setFeeSummary] = useState<FeeSummary[]>([]);
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null);
  const [sigStats, setSigStats] = useState<SigStats | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchAll = async () => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const [txRes, feeRes, walRes, sigRes, auditRes] = await Promise.all([
      db.from("analytics_daily_transactions").select("*").limit(14),
      db.from("analytics_fee_summary").select("*").limit(10),
      db.from("analytics_wallet_stats").select("*").single(),
      db.from("analytics_signature_stats").select("*").single(),
      db.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(15),
    ]);

    if (txRes.data)    setDailyTx([...(txRes.data as DailyTx[])].reverse());
    if (feeRes.data)   setFeeSummary(feeRes.data as FeeSummary[]);
    if (walRes.data)   setWalletStats(walRes.data as WalletStats);
    if (sigRes.data)   setSigStats(sigRes.data as SigStats);
    if (auditRes.data) setAuditLog(auditRes.data as AuditEntry[]);

    setLastRefresh(new Date());
    setLoading(false);
  };

  useEffect(() => { void fetchAll(); }, []);

  // Live audit log subscription
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel = (supabase as any)
      .channel("audit-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "audit_logs" },
        (payload: { new: AuditEntry }) => {
          setAuditLog(prev => [payload.new, ...prev.slice(0, 14)]);
        })
      .subscribe();
    return () => { void (supabase as any).removeChannel(channel); };
  }, []);

  // Pie chart data for signature verdicts
  const sigPie = sigStats ? [
    { name: "Verified",       value: sigStats.verified_count,      color: GREEN },
    { name: "Rejected",       value: sigStats.rejected_count,      color: RED   },
    { name: "Manual Review",  value: sigStats.manual_review_count, color: AMBER },
  ] : [];

  // Action label mapping
  const actionLabel = (a: string) => ({
    "wallet.topup":       "💰 Wallet Top-up",
    "fee.payment":        "📋 Fee Payment",
    "partial.apply":      "📄 Partial Application",
    "auth.login":         "🔐 Login",
    "auth.logout":        "🚪 Logout",
    "admin.roster.import": "📁 Roster Import",
    "identity.verify":    "🎓 Identity Verified",
  }[a] ?? `⚡ ${a}`);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#8C7A6A" }}>
        <Activity size={32} style={{ margin: "0 auto 12px", display: "block", color: "#D35400" }} />
        <p>Loading analytics…</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "0" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "20px",
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 900, color: "#241A14" }}>
            Analytics Dashboard
          </h2>
          <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "#8C7A6A" }}>
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void fetchAll()}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 14px", borderRadius: "10px",
            background: "transparent", border: "1px solid rgba(196, 154, 108, 0.4)",
            color: "#D35400", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
          }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stat Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "20px" }}>
        <StatCard icon={Wallet}       label="Total Wallet Balance"   value={tk(walletStats?.total_balance)}       sub={`${walletStats?.active_wallets ?? 0} active wallets`} trend="up" />
        <StatCard icon={TrendingUp}   label="Ever Deposited"         value={tk(walletStats?.total_ever_deposited)} color={GREEN} />
        <StatCard icon={Users}        label="Total Wallets"          value={String(walletStats?.total_wallets ?? 0)} sub={`Avg ${tk(walletStats?.avg_balance)}`} />
        <StatCard icon={ShieldCheck}  label="AI Verifications"       value={String(sigStats?.total_verifications ?? 0)} sub={`${sigStats?.avg_similarity_score ?? 0}% avg match`} color="#7C3AED" />
      </div>

      {/* Charts Row 1: Transaction Area + Fee Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>

        {/* Daily Transaction Trend */}
        <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "20px" }}>
          <p style={{ margin: "0 0 16px", fontSize: "0.85rem", fontWeight: 800, color: "#241A14" }}>
            📈 Daily Transaction Volume (Last 14 Days)
          </p>
          {dailyTx.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dailyTx}>
                <defs>
                  <linearGradient id="creditGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#D35400" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D35400" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(196,154,108,0.2)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#8C7A6A" }} tickFormatter={(v: string) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: "#8C7A6A" }} tickFormatter={(v: number) => `৳${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#241A14", border: "none", borderRadius: "10px", color: "#fff" }}
                  formatter={(v: number) => [`৳${v.toLocaleString()}`, ""]}
                />
                <Area type="monotone" dataKey="credit_amount" stroke="#D35400" fill="url(#creditGrad)" name="Credits" strokeWidth={2} />
                <Area type="monotone" dataKey="debit_amount"  stroke="#8C7A6A" fill="none" name="Debits"  strokeWidth={1.5} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#8C7A6A", fontSize: "0.82rem" }}>
              No transaction data yet
            </div>
          )}
        </div>

        {/* Fee Collection by Institution */}
        <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "20px" }}>
          <p style={{ margin: "0 0 16px", fontSize: "0.85rem", fontWeight: 800, color: "#241A14" }}>
            🎓 Fee Collection Rate by Institution
          </p>
          {feeSummary.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={feeSummary} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(196,154,108,0.2)" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#8C7A6A" }} tickFormatter={(v: number) => `${v}%`} domain={[0, 100]} />
                <YAxis type="category" dataKey="institution_code" tick={{ fontSize: 10, fill: "#8C7A6A" }} width={50} />
                <Tooltip
                  contentStyle={{ background: "#241A14", border: "none", borderRadius: "10px", color: "#fff" }}
                  formatter={(v: number) => [`${v}%`, "Collection Rate"]}
                />
                <Bar dataKey="collection_rate_pct" radius={[0, 6, 6, 0]}>
                  {feeSummary.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#8C7A6A", fontSize: "0.82rem" }}>
              No fee data yet
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2: Signature Pie + Audit Log */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "16px" }}>

        {/* Signature Pie */}
        <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "20px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "0.85rem", fontWeight: 800, color: "#241A14" }}>
            🔍 Signature Verification
          </p>
          {sigStats && sigStats.total_verifications > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={sigPie} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {sigPie.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#241A14", border: "none", borderRadius: "10px", color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {sigPie.map((s) => (
                  <div key={s.name} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#66564A" }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, display: "inline-block" }} />
                      {s.name}
                    </span>
                    <span style={{ fontWeight: 700, color: "#241A14" }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ padding: "30px 0", textAlign: "center", color: "#8C7A6A", fontSize: "0.82rem" }}>
              No verifications yet
            </div>
          )}
        </div>

        {/* Live Audit Log */}
        <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 800, color: "#241A14" }}>⚡ Live Audit Log</p>
            <span style={{
              padding: "2px 8px", background: "rgba(4, 120, 87, 0.1)", color: GREEN,
              borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700,
            }}>LIVE</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "260px", overflowY: "auto" }}>
            {auditLog.length > 0 ? auditLog.map((entry) => (
              <div key={entry.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 12px",
                background: "#FDF9F3", borderRadius: "10px",
                fontSize: "0.78rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                  <span>{actionLabel(entry.action)}</span>
                  {entry.amount_bdt && (
                    <span style={{ color: GREEN, fontWeight: 700 }}>+{tk(entry.amount_bdt)}</span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, color: "#8C7A6A" }}>
                  <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {entry.actor_email?.split("@")[0]}
                  </span>
                  <Clock size={11} />
                  <span>{new Date(entry.created_at).toLocaleTimeString()}</span>
                </div>
              </div>
            )) : (
              <p style={{ color: "#8C7A6A", fontSize: "0.82rem", textAlign: "center", margin: "20px 0" }}>
                No audit events yet. Actions will appear here in real-time.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Security alerts row */}
      <div style={{
        marginTop: "16px", padding: "14px 18px",
        background: "linear-gradient(135deg, rgba(211,84,0,0.06), rgba(255,140,66,0.04))",
        border: "1px solid rgba(211,84,0,0.2)", borderRadius: "14px",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <AlertTriangle size={18} style={{ color: "#D35400", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: "#241A14" }}>
            Rate Limiting Active
          </p>
          <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#8C7A6A" }}>
            Max 10 payment requests/minute per user · All actions are audit-logged · Signatures stored securely
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", fontWeight: 700, color: GREEN }}>
            <CheckCircle2 size={12} /> Rate Limits
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", fontWeight: 700, color: GREEN }}>
            <CheckCircle2 size={12} /> Audit Logs
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", fontWeight: 700, color: GREEN }}>
            <CheckCircle2 size={12} /> RLS Policies
          </span>
        </div>
      </div>
    </div>
  );
}
