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
        <div style={{ fontWeight: 700, color: "var(--theme-color-900)" }}>
          {item.id}
        </div>
      ),
    },
    {
      key: "title",
      header: "Description & Category",
      render: (item) => (
        <div>
          <div style={{ fontWeight: 600, color: "#1C140E" }}>{item.title}</div>
          <div style={{ fontSize: "0.76rem", color: "#7A685A" }}>{item.category} • {item.date}</div>
        </div>
      ),
    },
    {
      key: "reference",
      header: "Reference",
      render: (item) => <span style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#8A7667" }}>{item.reference}</span>,
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
        <span style={{ fontWeight: 700, color: item.status === "paid" ? "#047857" : "#1C140E", fontSize: "0.95rem" }}>
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
          background: "linear-gradient(135deg, var(--theme-color-50) 0%, #F5EBDF 100%)",
          border: "1px solid rgba(196, 154, 108, 0.4)",
          borderRadius: "14px",
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 10px rgba(196, 154, 108, 0.08)",
        }}
      >
        <div>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--theme-color-900)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Phase 1 • Autumn Vibes Institutional Design System
          </span>
          <h2 style={{ fontSize: "1.6rem", margin: "6px 0 4px", color: "#1C140E", fontWeight: 800 }}>
            Neo Cash AI Warm Financial Operating System
          </h2>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "#7A685A" }}>
            Official Autumn Vibes tokens, typography scale, 10 institutional status badges, KPI cards, high-density financial tables, and layout primitives.
          </p>
        </div>

        <NeoButton variant="primary" icon={<Sparkles size={16} />} onClick={() => setModalOpen(true)}>
          Test Modal Dialog
        </NeoButton>
      </div>

      {/* 1. COLOR SYSTEM */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <Palette size={20} style={{ color: "var(--theme-color-900)" }} />
          <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#1C140E", fontWeight: 700 }}>
            1. Official "Autumn Vibes" Color System
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px" }}>
          {[
            { label: "Primary Burnt Orange", hex: "var(--theme-color-900)", bg: "var(--theme-color-900)", textDark: false },
            { label: "Warm Orange", hex: "var(--theme-color-500)", bg: "var(--theme-color-500)", textDark: false },
            { label: "Golden Yellow", hex: "#F7B733", bg: "#F7B733", textDark: true },
            { label: "Warm Taupe", hex: "#C49A6C", bg: "#C49A6C", textDark: false },
            { label: "Soft Beige", hex: "#EAD9C6", bg: "#EAD9C6", textDark: true },
            { label: "Warm Ivory", hex: "var(--theme-color-50)", bg: "var(--theme-color-50)", border: "1px solid rgba(196,154,108,0.4)", textDark: true },
          ].map((c) => (
            <div
              key={c.hex}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(196, 154, 108, 0.3)",
                borderRadius: "10px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                boxShadow: "0 2px 6px rgba(196, 154, 108, 0.06)",
              }}
            >
              <div
                style={{
                  height: "48px",
                  borderRadius: "6px",
                  background: c.bg,
                  border: c.border || "none",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  color: c.textDark ? "#1C140E" : "var(--theme-color-50)",
                }}
              >
                {c.hex}
              </div>
              <span style={{ fontSize: "0.8rem", color: "#4A3B30", fontWeight: 600 }}>{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. TYPOGRAPHY SYSTEM */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <Type size={20} style={{ color: "var(--theme-color-900)" }} />
          <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#1C140E", fontWeight: 700 }}>
            2. Typography & Financial Currency Scale
          </h3>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 2px 6px rgba(196, 154, 108, 0.06)" }}>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#7A685A", textTransform: "uppercase" }}>Financial Numbers (Tabular Bold)</span>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#1C140E", fontFamily: "Inter, sans-serif" }}>
              ৳24,580.00 <span style={{ fontSize: "1rem", color: "#047857", fontWeight: 600 }}>Available Balance</span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#7A685A", textTransform: "uppercase" }}>Page Title (28–34px Bold)</span>
            <div style={{ fontSize: "1.875rem", fontWeight: 700, color: "#1C140E" }}>Institutional Financial Operations Center</div>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#7A685A", textTransform: "uppercase" }}>Section Header (17–21px Semibold)</span>
            <div style={{ fontSize: "1.1875rem", fontWeight: 600, color: "var(--theme-color-900)" }}>Pending Fee Adjustments & Waiver Applications</div>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#7A685A", textTransform: "uppercase" }}>Body & Metadata (14px / 12px)</span>
            <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#4A3B30" }}>
              All financial transactions are cryptographically verified and backed by Neo Cash AI Security.
            </p>
          </div>
        </div>
      </section>

      {/* 3. BUTTONS & FORM CONTROLS */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <Layers size={20} style={{ color: "var(--theme-color-900)" }} />
          <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#1C140E", fontWeight: 700 }}>
            3. Button System & Form Controls
          </h3>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "0 2px 6px rgba(196, 154, 108, 0.06)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
            <NeoButton variant="primary" icon={<CreditCard size={16} />}>Primary Burnt Orange</NeoButton>
            <NeoButton variant="secondary">Secondary Soft Taupe</NeoButton>
            <NeoButton variant="outline" icon={<ShieldCheck size={16} />}>Outline Accent</NeoButton>
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
          <CheckCircle2 size={20} style={{ color: "var(--theme-color-900)" }} />
          <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#1C140E", fontWeight: 700 }}>
            4. 10 Standardized Institutional Status Badges
          </h3>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", background: "#FFFFFF", padding: "18px", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.3)", boxShadow: "0 2px 6px rgba(196, 154, 108, 0.06)" }}>
          {(["paid", "due", "overdue", "pending", "approved", "rejected", "under_review", "action_required", "verified", "failed"] as StatusType[]).map((st) => (
            <StatusBadge key={st} status={st} />
          ))}
        </div>
      </section>

      {/* 5. FINANCIAL KPI CARDS GRID */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <LayoutGrid size={20} style={{ color: "var(--theme-color-900)" }} />
          <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#1C140E", fontWeight: 700 }}>
            5. Financial Summary KPI Cards (4-Column Layout)
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
            <Clock size={20} style={{ color: "var(--theme-color-900)" }} />
            <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#1C140E", fontWeight: 700 }}>
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
                  borderRadius: "6px",
                  background: selectedStatus === st ? "var(--theme-color-900)" : "var(--theme-color-50)",
                  color: selectedStatus === st ? "#FFFFFF" : "#7A685A",
                  border: "1px solid rgba(196, 154, 108, 0.35)",
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
        subtitle="Autumn Vibes Palette Component Test Modal"
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
        <div style={{ padding: "12px 0", color: "#4A3B30", fontSize: "0.9rem" }}>
          <p style={{ margin: "0 0 12px" }}>
            This modal dialog demonstrates backdrop blur, controlled 14px border radius, 1px subtle taupe borders, clean Burnt Orange action buttons, and keyboard escape handling.
          </p>
          <div style={{ background: "var(--theme-color-50)", padding: "14px", borderRadius: "8px", border: "1px solid rgba(196, 154, 108, 0.35)" }}>
            <span style={{ color: "#047857", fontWeight: 700 }}>✓ Design System Status: Verified & Production Ready</span>
          </div>
        </div>
      </NeoModal>
    </div>
  );
}


