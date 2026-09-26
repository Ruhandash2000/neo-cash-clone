import { useState } from "react";
import { NEO_TOKENS, StatusType } from "./tokens";
import { KpiCard } from "./kpi-card";
import { StatusBadge } from "./status-badge";
import { FinancialTable, Column } from "./financial-table";
import { NeoButton, NeoInput, NeoModal } from "./ui-primitives";
import {
  Wallet,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Search,
  Sparkles,
  Layers,
  Palette,
  Type,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";

interface SampleTransaction {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  status: StatusType;
  reference: string;
}

const SAMPLE_TRANSACTIONS: SampleTransaction[] = [
  { id: "TXN-8842", title: "Semester Tuition Fee — Q1", category: "Academic Fee", date: "2026-09-25", amount: 12500, status: "paid", reference: "REF-99201" },
  { id: "TXN-8843", title: "Library Membership & Tech Pass", category: "Facility Fee", date: "2026-09-24", amount: 1200, status: "due", reference: "REF-99202" },
  { id: "TXN-8844", title: "Laboratory Access Fee", category: "Lab & Practical", date: "2026-09-20", amount: 3500, status: "overdue", reference: "REF-99203" },
  { id: "TXN-8845", title: "Financial Aid Assistance Request", category: "Waiver Application", date: "2026-09-18", amount: 4500, status: "under_review", reference: "REF-99204" },
  { id: "TXN-8846", title: "Flood Relief Campus Fund", category: "Donation", date: "2026-09-15", amount: 1000, status: "verified", reference: "REF-99205" },
];

export function DesignShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTxns = SAMPLE_TRANSACTIONS.filter((t) => {
    const matchesStatus = selectedStatus === "all" || t.status === selectedStatus;
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns: Column<SampleTransaction>[] = [
    {
      key: "id",
      header: "Transaction ID",
      render: (item) => (
        <div style={{ fontWeight: 700, color: NEO_TOKENS.colors.accentPurple }}>
          {item.id}
        </div>
      ),
    },
    {
      key: "title",
      header: "Description & Category",
      render: (item) => (
        <div>
          <div style={{ fontWeight: 600, color: "#FFF" }}>{item.title}</div>
          <div style={{ fontSize: "0.76rem", color: "#64748B" }}>{item.category} • {item.date}</div>
        </div>
      ),
    },
    {
      key: "reference",
      header: "Reference",
      render: (item) => <span style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#94A3B8" }}>{item.reference}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (item) => (
        <span style={{ fontWeight: 700, color: item.status === "paid" ? "#34D399" : "#FFF", fontSize: "0.95rem" }}>
          ৳{item.amount.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      {/* HEADER BANNER */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(79, 70, 229, 0.25) 100%)",
          border: "1px solid rgba(167, 139, 250, 0.3)",
          borderRadius: "16px",
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: NEO_TOKENS.colors.accentPurple, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Phase 1 • Design Foundation Showcase
          </span>
          <h2 style={{ fontSize: "1.6rem", margin: "6px 0 4px", color: "#FFF", fontWeight: 800 }}>
            Neo Cash AI Institutional Design System
          </h2>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "#94A3B8" }}>
            Enterprise midnight sky tokens, typography, status indicators, KPI cards, high-density financial tables, and layout primitives.
          </p>
        </div>

        <NeoButton variant="outline" icon={<Sparkles size={16} />} onClick={() => setModalOpen(true)}>
          Test Modal Dialog
        </NeoButton>
      </div>

      {/* 1. COLOR SYSTEM */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <Palette size={20} style={{ color: NEO_TOKENS.colors.accentPurple }} />
          <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#FFF", fontWeight: 700 }}>
            1. Color Tokens (Midnight Sky Palette)
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px" }}>
          {[
            { label: "Deep Background", hex: "#0D182A", bg: "#0D182A", border: "1px solid rgba(255,255,255,0.2)" },
            { label: "Surface Blue", hex: "#1E3A8A", bg: "#1E3A8A" },
            { label: "Primary Action", hex: "#4F46E5", bg: "#4F46E5" },
            { label: "Accent Purple", hex: "#A78BFA", bg: "#A78BFA" },
            { label: "Highlight Soft", hex: "#D8B4FE", bg: "#D8B4FE" },
            { label: "Subtle Light", hex: "#F3E8FF", bg: "#F3E8FF", textDark: true },
          ].map((c) => (
            <div
              key={c.hex}
              style={{
                background: "rgba(30, 58, 138, 0.25)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  height: "48px",
                  borderRadius: "8px",
                  background: c.bg,
                  border: c.border || "none",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: c.textDark ? "#0D182A" : "#FFF",
                }}
              >
                {c.hex}
              </div>
              <span style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600 }}>{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. TYPOGRAPHY SYSTEM */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <Type size={20} style={{ color: NEO_TOKENS.colors.accentPurple }} />
          <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#FFF", fontWeight: 700 }}>
            2. Typography & Financial Currency Hierarchy
          </h3>
        </div>

        <div style={{ background: "rgba(30, 58, 138, 0.25)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase" }}>Financial Numbers (Tabular Bold)</span>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#FFF", fontFamily: "Inter, sans-serif" }}>
              ৳24,580.00 <span style={{ fontSize: "1rem", color: "#34D399", fontWeight: 600 }}>Available Balance</span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase" }}>Page Title (24px Bold)</span>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFF" }}>Institutional Financial Operations Center</div>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase" }}>Section Header (18px Medium)</span>
            <div style={{ fontSize: "1.125rem", fontWeight: 600, color: "#A78BFA" }}>Pending Fee Adjustments & Approval Applications</div>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase" }}>Body & Metadata (14px / 12px)</span>
            <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#94A3B8" }}>
              All financial records are cryptographically verified and backed by Neo Cash AI Security.
            </p>
          </div>
        </div>
      </section>

      {/* 3. BUTTONS & FORM CONTROLS */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <Layers size={20} style={{ color: NEO_TOKENS.colors.accentPurple }} />
          <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#FFF", fontWeight: 700 }}>
            3. Button Variants & Form Controls
          </h3>
        </div>

        <div style={{ background: "rgba(30, 58, 138, 0.25)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
            <NeoButton variant="primary" icon={<CreditCard size={16} />}>Primary Action</NeoButton>
            <NeoButton variant="secondary">Secondary Button</NeoButton>
            <NeoButton variant="outline" icon={<ShieldCheck size={16} />}>Outline Badge</NeoButton>
            <NeoButton variant="danger">Danger Action</NeoButton>
            <NeoButton variant="ghost">Ghost Button</NeoButton>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <NeoInput
              label="Global Financial Search"
              placeholder="Search by student ID, fee title, or transaction..."
              icon={<Search size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <NeoInput
              label="Institutional Account Reference"
              placeholder="e.g. DCC-2024-8842"
              defaultValue="DCC-2024-8842"
            />
          </div>
        </div>
      </section>

      {/* 4. STATUS SYSTEM */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <CheckCircle2 size={20} style={{ color: NEO_TOKENS.colors.accentPurple }} />
          <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#FFF", fontWeight: 700 }}>
            4. Institutional Status Language System (10 States)
          </h3>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", background: "rgba(30, 58, 138, 0.25)", padding: "18px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          {(["paid", "due", "overdue", "pending", "approved", "rejected", "under_review", "action_required", "verified", "failed"] as StatusType[]).map((st) => (
            <StatusBadge key={st} status={st} />
          ))}
        </div>
      </section>

      {/* 5. FINANCIAL KPI CARDS GRID */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <LayoutGrid size={20} style={{ color: NEO_TOKENS.colors.accentPurple }} />
          <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#FFF", fontWeight: 700 }}>
            5. Reusable KPI Cards (4-Column Layout)
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          <KpiCard
            title="Available Balance"
            value={24580}
            subtitle="Wallet & Digital Credit"
            change="+14.2%"
            trend="up"
            icon={<Wallet size={20} />}
            variant="primary"
          />
          <KpiCard
            title="Total Dues"
            value={8500}
            subtitle="2 Pending Fees"
            change="-5.0%"
            trend="down"
            icon={<CreditCard size={20} />}
          />
          <KpiCard
            title="Paid This Month"
            value={12000}
            subtitle="3 Transactions"
            change="+8.5%"
            trend="up"
            icon={<TrendingUp size={20} />}
            variant="accent"
          />
          <KpiCard
            title="Pending Approvals"
            value={4500}
            subtitle="1 Waiver Under Review"
            change="Action Req"
            trend="neutral"
            icon={<AlertCircle size={20} />}
          />
        </div>
      </section>

      {/* 6. HIGH-DENSITY DATA TABLE */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Clock size={20} style={{ color: NEO_TOKENS.colors.accentPurple }} />
            <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#FFF", fontWeight: 700 }}>
              6. High-Density Financial Data Table
            </h3>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {["all", "paid", "due", "overdue", "under_review"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                style={{
                  padding: "5px 12px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  borderRadius: "8px",
                  background: selectedStatus === st ? "#4F46E5" : "rgba(30, 58, 138, 0.3)",
                  color: "#FFF",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <FinancialTable columns={columns} data={filteredTxns} />
      </section>

      {/* MODAL DIALOG PREVIEW */}
      <NeoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Institutional Design System Verification"
        subtitle="Phase 1 Design Foundation Component Test Modal"
        footer={
          <>
            <NeoButton variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </NeoButton>
            <NeoButton variant="primary" onClick={() => setModalOpen(false)}>
              Confirm & Close
            </NeoButton>
          </>
        }
      >
        <div style={{ padding: "12px 0", color: "#94A3B8", fontSize: "0.9rem" }}>
          <p style={{ margin: "0 0 12px" }}>
            This modal dialog demonstrates backdrop blur, controlled border radius (16px), 1px subtle borders, clean action buttons, and keyboard escape handling.
          </p>
          <div style={{ background: "rgba(30, 58, 138, 0.3)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <span style={{ color: "#34D399", fontWeight: 700 }}>✓ Design System Status: Verified & Production Ready</span>
          </div>
        </div>
      </NeoModal>
    </div>
  );
}
