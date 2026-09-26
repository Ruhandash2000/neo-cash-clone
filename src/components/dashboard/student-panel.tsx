/**
 * Student Panel Component — Refined Institutional Financial Portal
 * 
 * Strict Visual Hierarchy & Autumn Vibes Palette System:
 * - App Canvas Background: #FFF7E6 (Warm Ivory)
 * - Level 1 Surface: #FFFFFF (Clean White)
 * - Level 2 Subtle Surface: #FDF9F3 (Warm Beige)
 * - Primary Text: #241A14 (Dark Warm Charcoal - Headings, Numbers, Titles)
 * - Secondary Text: #66564A (Descriptions, Labels, Supporting Metadata)
 * - Muted Text: #8C7A6A (Timestamps, Helper Notes)
 * - Primary Action / Brand: #D35400 (Burnt Orange)
 * - Secondary Accent: #FF8C42 (Warm Orange)
 * - Special Attention / Highlight: #F7B733 (Golden Yellow)
 * - Dark Featured Section: #241A14 (AI Financial Assistant)
 */

import { useState } from "react";
import { useNeoStore, Fee, Transaction } from "@/lib/neo-cash-store";
import { StatusBadge } from "@/components/design-system/status-badge";
import { formatTaka, StatusType } from "@/components/design-system/tokens";
import {
  Wallet, CreditCard, DollarSign, ArrowUpRight, ArrowDownLeft, ShieldCheck,
  FileText, Sparkles, AlertCircle, HeartHandshake, Award, TrendingUp, Download,
  CheckCircle2, Clock, Send, MessageSquare, PlusCircle, Eye, X
} from "lucide-react";

function mapFeeStatus(status: string): StatusType {
  if (status === "pending_partial") return "pending";
  if (status === "partial_approved") return "approved";
  if (
    status === "paid" ||
    status === "due" ||
    status === "overdue" ||
    status === "pending" ||
    status === "approved" ||
    status === "rejected" ||
    status === "under_review" ||
    status === "action_required" ||
    status === "verified" ||
    status === "failed"
  ) {
    return status as StatusType;
  }
  return "due";
}

export function StudentPanel({
  activeTab,
  setActiveTab,
  onOpenReceipt,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReceipt: (txn: Transaction) => void;
}) {
  const [store, actions] = useNeoStore();

  // Full Payment Modal State
  const [selectedPayFee, setSelectedPayFee] = useState<Fee | null>(null);
  const [payMethod, setPayMethod] = useState("bKash Mobile Banking");
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [paySuccessTxn, setPaySuccessTxn] = useState<Transaction | null>(null);

  // Partial Payment Application Modal State
  const [selectedPartialFee, setSelectedPartialFee] = useState<Fee | null>(null);
  const [partialRequestedAmount, setPartialRequestedAmount] = useState<number>(3000);
  const [partialReason, setPartialReason] = useState("");
  const [guardianName, setGuardianName] = useState("Robert Paul");
  const [guardianPhone, setGuardianPhone] = useState("+880 1711-998877");
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiScanResult, setAiScanResult] = useState<{ score: number; status: string } | null>(null);

  // Donation Form State
  const [donationAmount, setDonationAmount] = useState<number>(200);
  const [donationMethod, setDonationMethod] = useState("bKash Mobile Banking");
  const [donationFeedback, setDonationFeedback] = useState<string | null>(null);

  // Top Up Wallet Modal State
  const [topUpAmount, setTopUpAmount] = useState<number>(1000);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  // AI Chat Assistant State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string; time: string }>>([
    { sender: "ai", text: "Hello Ruhan! I am your Neo AI Student Financial Assistant. You can ask me about fee deadlines, receipt validation, or applying for partial payments.", time: "10:00 AM" },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayFee) return;
    setIsProcessingPay(true);
    setTimeout(() => {
      const res = actions.payFee(selectedPayFee.id, payMethod, selectedPayFee.approvedPartialAmount || selectedPayFee.amount);
      setIsProcessingPay(false);
      if (res.ok && res.transaction) {
        setPaySuccessTxn(res.transaction);
      } else {
        alert(res.error || "Payment failed.");
        setSelectedPayFee(null);
      }
    }, 1200);
  };

  const startAiSignatureScan = () => {
    setIsAiScanning(true);
    setAiScanResult(null);
    setTimeout(() => {
      setIsAiScanning(false);
      setAiScanResult({ score: 96, status: "High Similarity Match" });
    }, 1500);
  };

  const handlePartialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartialFee) return;
    if (!partialReason.trim()) return alert("Enter your reason for partial payment.");

    const res = actions.applyPartialPayment({
      feeId: selectedPartialFee.id,
      requestedAmount: Number(partialRequestedAmount),
      reason: partialReason.trim(),
      guardianName,
      guardianPhone,
      guardianIdDocUrl: "Guardian-NID-Doc.pdf",
      signatureDocUrl: "Guardian-Signature.png",
    });

    if (res.ok) {
      alert("Application submitted! Admin and Head have been notified for approval.");
      setSelectedPartialFee(null);
      setPartialReason("");
      setAiScanResult(null);
    }
  };

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(donationAmount);
    const res = actions.makeDonation(amount, donationMethod);
    if (res.ok) {
      setDonationFeedback(`Thank you! Donated ${formatTaka(amount)}. Earned ${res.points} Donation Points! 🎉`);
      setTimeout(() => setDonationFeedback(null), 4000);
    } else {
      alert(res.error);
    }
  };

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = actions.topUpWallet(Number(topUpAmount), "bKash Mobile Banking");
    if (res.ok) {
      setShowTopUpModal(false);
      alert(`Top-up successful! Added ${formatTaka(topUpAmount)} to your Neo Wallet.`);
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg, time }]);
    setChatInput("");

    setTimeout(() => {
      let reply = "I can help with that! ";
      const lower = userMsg.toLowerCase();
      if (lower.includes("fee") || lower.includes("due")) {
        reply += `You have active fees pending. Your upcoming deadline is Semester Tuition Fee (${formatTaka(6000)}) due Oct 15, 2026.`;
      } else if (lower.includes("partial") || lower.includes("hardship")) {
        reply += `Partial Payment requires guardian ID & signature. Submit your application under Fees & Dues for AI verification.`;
      } else if (lower.includes("receipt")) {
        reply += `Your latest transaction receipt #${store.transactions[0]?.receiptNumber || "REC-9821"} is available in Transactions.`;
      } else {
        reply += `If you need custom institutional assistance, you can click "Talk to Admin" to escalate your query directly.`;
      }
      setChatMessages((prev) => [...prev, { sender: "ai", text: reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          
          {/* LEVEL 1: OPEN WELCOME HERO (NO CARD CONTAINER) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.02em" }}>
                  Good afternoon, {store.studentProfile.name.split(" ")[0]}
                </h1>
                <StatusBadge status="verified" customLabel="Verified Student" />
              </div>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#66564A" }}>
                Here is your institutional financial overview for today.
              </p>
              <div style={{ marginTop: "6px", fontSize: "0.82rem", color: "#8C7A6A", display: "flex", gap: "12px", alignItems: "center" }}>
                <span>{store.studentProfile.institution}</span>
                <span>•</span>
                <span>{store.studentProfile.classSection}</span>
                <span>•</span>
                <span>ID: {store.studentProfile.studentId}</span>
              </div>
            </div>

            <button
              type="button"
              className="ms-btn-primary"
              onClick={() => setShowTopUpModal(true)}
              style={{ background: "#D35400", color: "#FFFFFF", padding: "10px 18px", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 700 }}
            >
              <PlusCircle size={16} /> Top Up Wallet
            </button>
          </div>

          {/* LEVEL 2: PRIMARY FINANCIAL SUMMARY (SURFACE HIERARCHY) */}
          <div className="ms-grid-3">
            {/* HERO METRIC CARD — AVAILABLE BALANCE */}
            <div
              style={{
                background: "#FFFFFF",
                border: "2px solid #D35400",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 6px 20px rgba(211, 84, 0, 0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  AVAILABLE BALANCE
                </span>
                <span style={{ fontSize: "0.72rem", background: "rgba(211, 84, 0, 0.1)", color: "#D35400", padding: "3px 8px", borderRadius: "999px", fontWeight: 700 }}>
                  PRIMARY
                </span>
              </div>

              <div style={{ margin: "14px 0 8px" }}>
                <span style={{ fontSize: "2.35rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.03em", fontFeatureSettings: "'tnum'" }}>
                  {formatTaka(store.balances.availableBalance, false)}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#047857", fontWeight: 600 }}>
                <CheckCircle2 size={14} />
                <span>Includes {formatTaka(store.balances.walletBalance, false)} in Neo Digital Wallet</span>
              </div>
            </div>

            {/* SECONDARY METRIC CARD — TOTAL DUES PENDING */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(196, 154, 108, 0.3)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 14px rgba(36, 26, 20, 0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  TOTAL DUES PENDING
                </span>
                <StatusBadge status="due" customLabel="Action Needed" />
              </div>

              <div style={{ margin: "14px 0 8px" }}>
                <span style={{ fontSize: "1.85rem", fontWeight: "800", color: "#BE123C", letterSpacing: "-0.02em", fontFeatureSettings: "'tnum'" }}>
                  {formatTaka(store.balances.totalDue, false)}
                </span>
              </div>

              <div style={{ fontSize: "0.8rem", color: "#8C7A6A" }}>
                Next due date: <strong style={{ color: "#241A14" }}>Oct 15, 2026</strong>
              </div>
            </div>

            {/* SECONDARY METRIC CARD — DONATION POINTS */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(196, 154, 108, 0.3)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 14px rgba(36, 26, 20, 0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  DONATION IMPACT
                </span>
                <span style={{ fontSize: "0.75rem", background: "rgba(247, 183, 51, 0.2)", color: "#B45309", padding: "3px 8px", borderRadius: "999px", fontWeight: 700 }}>
                  RANK #3
                </span>
              </div>

              <div style={{ margin: "14px 0 8px" }}>
                <span style={{ fontSize: "1.85rem", fontWeight: 800, color: "#D35400", letterSpacing: "-0.02em" }}>
                  {store.donations.points} Pts
                </span>
              </div>

              <div style={{ fontSize: "0.8rem", color: "#8C7A6A" }}>
                Total Contributed: <strong style={{ color: "#241A14" }}>{formatTaka(store.donations.totalDonated, false)}</strong>
              </div>
            </div>
          </div>

          {/* LEVEL 3: FEES & RECENT ACTIVITY SPLIT SECTION */}
          <div className="ms-grid-2">
            
            {/* UPCOMING FEES & DUES SECTION */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#241A14" }}>
                  Upcoming Fees & Dues
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab("fees")}
                  style={{ background: "none", border: "none", color: "#D35400", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
                >
                  View All Fees →
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {store.fees.slice(0, 3).map((fee) => (
                  <div
                    key={fee.id}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(196, 154, 108, 0.25)",
                      borderRadius: "12px",
                      padding: "14px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#241A14" }}>
                        {fee.title}
                      </h4>
                      <span style={{ fontSize: "0.78rem", color: "#66564A", marginTop: "2px", display: "block" }}>
                        Due Date: {fee.dueDate}
                      </span>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: "0 0 4px", fontSize: "1rem", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                        {formatTaka(fee.approvedPartialAmount || fee.amount, false)}
                      </p>
                      <StatusBadge status={mapFeeStatus(fee.status)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT TRANSACTIONS SECTION */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#241A14" }}>
                  Recent Activity
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab("transactions")}
                  style={{ background: "none", border: "none", color: "#D35400", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
                >
                  History →
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {store.transactions.slice(0, 3).map((txn) => (
                  <div
                    key={txn.id}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(196, 154, 108, 0.25)",
                      borderRadius: "12px",
                      padding: "14px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "10px",
                          background: txn.type === "donation" ? "rgba(247, 183, 51, 0.15)" : "rgba(211, 84, 0, 0.1)",
                          display: "grid",
                          placeItems: "center",
                          color: "#D35400",
                        }}
                      >
                        {txn.type === "donation" ? <HeartHandshake size={18} /> : <FileText size={18} />}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 700, color: "#241A14" }}>
                          {txn.title}
                        </h4>
                        <span style={{ fontSize: "0.78rem", color: "#66564A" }}>
                          {txn.date} • {txn.method}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: 0, fontSize: "0.98rem", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                        {formatTaka(txn.amount, false)}
                      </p>
                      <button
                        type="button"
                        onClick={() => onOpenReceipt(txn)}
                        style={{ background: "none", border: "none", color: "#D35400", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", padding: 0, marginTop: "2px" }}
                      >
                        Receipt 🧾
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. FEES & DUES TAB */}
      {activeTab === "fees" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#241A14" }}>
                Assigned Fees & Dues
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                Pay institutional fees directly or submit a partial payment application for administrative approval.
              </p>
            </div>

            <div style={{ background: "rgba(225, 29, 72, 0.1)", border: "1px solid rgba(225, 29, 72, 0.25)", padding: "8px 16px", borderRadius: "10px", color: "#BE123C", fontWeight: 700, fontSize: "0.9rem" }}>
              Total Dues Pending: {formatTaka(store.balances.totalDue, false)}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {store.fees.map((fee) => (
              <div
                key={fee.id}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(196, 154, 108, 0.3)",
                  borderRadius: "14px",
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px",
                  boxShadow: "0 3px 10px rgba(36, 26, 20, 0.02)",
                }}
              >
                <div style={{ flex: "1 1 320px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#241A14" }}>
                      {fee.title}
                    </h3>
                    <StatusBadge status={mapFeeStatus(fee.status)} />
                  </div>

                  <p style={{ margin: "0 0 10px", fontSize: "0.88rem", color: "#66564A" }}>
                    {fee.description}
                  </p>

                  <div style={{ display: "flex", gap: "16px", fontSize: "0.8rem", color: "#8C7A6A" }}>
                    <span>Category: <strong style={{ color: "#241A14" }}>{fee.category}</strong></span>
                    <span>Deadline: <strong style={{ color: fee.status === "overdue" ? "#BE123C" : "#241A14" }}>{fee.dueDate}</strong></span>
                  </div>
                </div>

                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                  <div>
                    {fee.approvedPartialAmount ? (
                      <div>
                        <span style={{ textDecoration: "line-through", color: "#8C7A6A", fontSize: "0.85rem", marginRight: "8px" }}>
                          {formatTaka(fee.originalAmount, false)}
                        </span>
                        <span style={{ fontSize: "1.35rem", fontWeight: 800, color: "#047857" }}>
                          {formatTaka(fee.approvedPartialAmount, false)}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: "1.35rem", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                        {formatTaka(fee.amount, false)}
                      </span>
                    )}
                  </div>

                  {fee.status === "paid" ? (
                    <div style={{ color: "#047857", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", fontSize: "0.9rem" }}>
                      <CheckCircle2 size={16} /> Paid in Full
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {fee.status !== "pending_partial" && (
                        <button
                          type="button"
                          className="ms-btn-secondary"
                          onClick={() => setSelectedPartialFee(fee)}
                          style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "8px 14px", borderRadius: "10px", fontSize: "0.82rem", fontWeight: 600 }}
                        >
                          Apply Partial Payment
                        </button>
                      )}
                      <button
                        type="button"
                        className="ms-btn-primary"
                        onClick={() => setSelectedPayFee(fee)}
                        style={{ background: "#D35400", color: "#FFFFFF", padding: "8px 16px", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 700 }}
                      >
                        Pay {fee.approvedPartialAmount ? "Approved Amount" : "Full Amount"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* PARTIAL PAYMENT APPLICATIONS TRACK RECORD */}
          {store.partialApplications.length > 0 && (
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: "1.1rem", fontWeight: 700, color: "#241A14" }}>
                Submitted Partial Payment Applications
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {store.partialApplications.map((app) => (
                  <div key={app.id} style={{ padding: "14px", background: "#FDF9F3", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.2)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontWeight: 700, color: "#241A14", fontSize: "0.92rem" }}>
                          {app.id} — {app.feeTitle}
                        </span>
                        <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#66564A" }}>
                          Requested: {formatTaka(app.requestedAmount, false)} (Original: {formatTaka(app.originalAmount, false)}) • Submitted {app.submittedAt}
                        </p>
                      </div>
                      <StatusBadge
                        status={app.status.startsWith("approved") ? "approved" : app.status.startsWith("rejected") ? "rejected" : "under_review"}
                      />
                    </div>
                    <div style={{ marginTop: "8px", fontSize: "0.78rem", color: "#66564A", display: "flex", gap: "14px" }}>
                      <span>Reason: "{app.reason}"</span>
                      <span>AI Signature Score: <strong style={{ color: "#047857" }}>96% High Match</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 3. DONATION & SOCIAL IMPACT TAB */}
      {activeTab === "donation" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#241A14" }}>
              Student Welfare & Social Impact
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
              Support underprivileged peer tuition. Rule: <strong>৳100 Donated = 1 Donation Point</strong>.
            </p>
          </div>

          {/* RANK SUMMARY CARDS */}
          <div className="ms-grid-3">
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase" }}>Class Rank</span>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#241A14", margin: "4px 0 2px" }}>#{store.donations.rankClass}</h2>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#D35400", fontWeight: 600 }}>CSE 1st Year (Section A)</p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase" }}>Department Rank</span>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#241A14", margin: "4px 0 2px" }}>#{store.donations.rankDept}</h2>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#66564A" }}>Computer Science & Eng.</p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase" }}>National Leaderboard</span>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#241A14", margin: "4px 0 2px" }}>#{store.donations.rankNational}</h2>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#047857", fontWeight: 600 }}>Bangladesh Institutions</p>
            </div>
          </div>

          <div className="ms-grid-2">
            {/* DONATION FORM */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "24px" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: "1.1rem", fontWeight: 700, color: "#241A14" }}>
                Make a Welfare Contribution
              </h3>

              {donationFeedback && (
                <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "10px 14px", borderRadius: "10px", color: "#047857", fontSize: "0.85rem", marginBottom: "14px", fontWeight: 600 }}>
                  {donationFeedback}
                </div>
              )}

              <form onSubmit={handleDonationSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "6px" }}>
                    Donation Amount (৳)
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 14px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontSize: "1.1rem", fontWeight: 700 }}
                  />
                  <span style={{ fontSize: "0.78rem", color: "#66564A", marginTop: "4px", display: "block" }}>
                    Will earn: <strong style={{ color: "#D35400" }}>{Math.floor(donationAmount / 100)} Impact Points</strong>
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "6px" }}>
                    Payment Method
                  </label>
                  <select
                    value={donationMethod}
                    onChange={(e) => setDonationMethod(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontSize: "0.9rem" }}
                  >
                    <option value="bKash Mobile Banking">bKash Mobile Banking</option>
                    <option value="City Bank Visa Debit">City Bank Visa Debit</option>
                    <option value="Neo Wallet Balance">Neo Digital Wallet ({formatTaka(store.balances.walletBalance, false)})</option>
                  </select>
                </div>

                <button type="submit" className="ms-btn-primary" style={{ background: "#D35400", color: "#FFFFFF", padding: "12px", borderRadius: "10px", fontSize: "0.92rem", fontWeight: 700, marginTop: "6px" }}>
                  <HeartHandshake size={18} /> Confirm Donation of {formatTaka(donationAmount, false)}
                </button>
              </form>
            </div>

            {/* LEADERBOARD */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "24px" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: "1.1rem", fontWeight: 700, color: "#241A14" }}>
                Department Top Donors
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { rank: 1, name: "Tanvir Rahman", points: 25, amount: 2500, avatar: "🥇" },
                  { rank: 2, name: "Anika Tabassum", points: 12, amount: 1200, avatar: "🥈" },
                  { rank: 3, name: store.studentProfile.name + " (You)", points: store.donations.points, amount: store.donations.totalDonated, avatar: "🥉" },
                  { rank: 4, name: "Sajid Khan", points: 4, amount: 400, avatar: "4" },
                ].map((user) => (
                  <div
                    key={user.rank}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 14px",
                      background: user.rank === 3 ? "#FDF9F3" : "#FFFFFF",
                      borderRadius: "10px",
                      border: user.rank === 3 ? "1px solid #D35400" : "1px solid rgba(196, 154, 108, 0.2)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "1.1rem" }}>{user.avatar}</span>
                      <div>
                        <h5 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#241A14" }}>{user.name}</h5>
                        <span style={{ fontSize: "0.78rem", color: "#66564A" }}>{formatTaka(user.amount, false)} Donated</span>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: "#D35400", fontSize: "0.92rem" }}>{user.points} Pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 4. TRANSACTIONS & RECEIPTS TAB */}
      {activeTab === "transactions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#241A14" }}>
              Transaction History & Digital Receipts
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
              Verified logs of institutional payments with instant PDF receipt download.
            </p>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                  <th style={{ padding: "14px 18px", fontWeight: 700 }}>Transaction ID</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700 }}>Description</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700 }}>Date & Time</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700 }}>Method</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700 }}>Amount</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {store.transactions.map((txn) => (
                  <tr key={txn.id} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.2)" }}>
                    <td style={{ padding: "14px 18px", fontWeight: 700, color: "#D35400" }}>{txn.id}</td>
                    <td style={{ padding: "14px 18px", fontWeight: 600, color: "#241A14" }}>{txn.title}</td>
                    <td style={{ padding: "14px 18px", color: "#66564A" }}>{txn.date}</td>
                    <td style={{ padding: "14px 18px", color: "#66564A" }}>{txn.method}</td>
                    <td style={{ padding: "14px 18px", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>{formatTaka(txn.amount, false)}</td>
                    <td style={{ padding: "14px 18px" }}>
                      <button
                        type="button"
                        onClick={() => onOpenReceipt(txn)}
                        style={{ background: "#FDF9F3", color: "#D35400", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "5px 12px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <FileText size={14} /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. DARK FEATURED SECTION — AI FINANCIAL ASSISTANT TAB */}
      {activeTab === "ai" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#241A14", display: "flex", alignItems: "center", gap: "10px" }}>
              <Sparkles style={{ color: "#D35400" }} /> Neo AI Student Financial Assistant
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
              Inquire about your fee deadlines, partial payment status, receipts, or institutional guidelines.
            </p>
          </div>

          {/* SOPHISTICATED DARK FEATURED SURFACE (#241A14) */}
          <div
            style={{
              background: "#241A14",
              border: "1px solid rgba(196, 154, 108, 0.4)",
              borderRadius: "18px",
              padding: "24px",
              boxShadow: "0 12px 30px rgba(36, 26, 20, 0.25)",
              display: "flex",
              flexDirection: "column",
              height: "540px",
            }}
          >
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px", paddingRight: "8px" }}>
              {chatMessages.map((msg, index) => (
                <div key={index} style={{ alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: "14px",
                      background: msg.sender === "user" ? "#D35400" : "#3D2B1F",
                      color: msg.sender === "user" ? "#FFFFFF" : "#FFF7E6",
                      fontSize: "0.92rem",
                      lineHeight: "1.55",
                      border: msg.sender === "ai" ? "1px solid rgba(196, 154, 108, 0.3)" : "none",
                    }}
                  >
                    {msg.text}
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "#8C7A6A", marginTop: "4px", display: "block", textAlign: msg.sender === "user" ? "right" : "left" }}>
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChatMessage} style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
              <input
                type="text"
                placeholder="Ask Neo AI about your fees, partial payments, receipts..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: "#3D2B1F",
                  border: "1px solid rgba(196, 154, 108, 0.4)",
                  borderRadius: "10px",
                  color: "#FFF7E6",
                  outline: "none",
                  fontSize: "0.92rem",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#D35400",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0 20px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Send size={16} /> Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FULL PAYMENT MODAL */}
      {selectedPayFee && (
        <div className="ms-modal-overlay">
          <div className="ms-modal">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, color: "#241A14", fontSize: "1.2rem", fontWeight: 700 }}>Confirm Fee Payment</h3>
              <button type="button" onClick={() => setSelectedPayFee(null)} style={{ background: "none", border: "none", color: "#66564A", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: "0 0 16px", color: "#66564A", fontSize: "0.88rem" }}>
              Paying for: <strong style={{ color: "#241A14" }}>{selectedPayFee.title}</strong>
            </p>

            <form onSubmit={handlePaySubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "#FDF9F3", padding: "16px", borderRadius: "12px", border: "1px solid rgba(196, 154, 108, 0.3)" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase" }}>Total Payable Amount</span>
                <h2 style={{ margin: "4px 0 0", color: "#241A14", fontSize: "1.8rem", fontWeight: 800 }}>
                  {formatTaka(selectedPayFee.approvedPartialAmount || selectedPayFee.amount, false)}
                </h2>
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "6px" }}>
                  Select Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  style={{ width: "100%", padding: "12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontSize: "0.9rem" }}
                >
                  <option value="bKash Mobile Banking">bKash Mobile Banking</option>
                  <option value="Dutch-Bangla Rocket">Dutch-Bangla Rocket</option>
                  <option value="City Bank Visa Debit">City Bank Visa Debit</option>
                  <option value="Mastercard Credit">Mastercard Credit</option>
                  <option value="Neo Digital Wallet">Neo Digital Wallet ({formatTaka(store.balances.walletBalance, false)})</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button type="button" className="ms-btn-secondary" onClick={() => setSelectedPayFee(null)} style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "10px 18px", borderRadius: "10px", fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" className="ms-btn-primary" disabled={isProcessingPay} style={{ background: "#D35400", color: "#FFFFFF", padding: "10px 20px", borderRadius: "10px", fontWeight: 700 }}>
                  {isProcessingPay ? "Processing..." : "Confirm & Pay " + formatTaka(selectedPayFee.approvedPartialAmount || selectedPayFee.amount, false)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PARTIAL PAYMENT APPLICATION MODAL */}
      {selectedPartialFee && (
        <div className="ms-modal-overlay">
          <div className="ms-modal" style={{ maxWidth: "620px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, color: "#241A14", fontSize: "1.2rem", fontWeight: 700 }}>Apply for Partial Payment</h3>
              <button type="button" onClick={() => setSelectedPartialFee(null)} style={{ background: "none", border: "none", color: "#66564A", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: "0 0 16px", color: "#66564A", fontSize: "0.88rem" }}>
              Target Fee: <strong style={{ color: "#241A14" }}>{selectedPartialFee.title}</strong> (Original: {formatTaka(selectedPartialFee.amount, false)})
            </p>

            <form onSubmit={handlePartialSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "4px" }}>
                  Requested Partial Amount (৳)
                </label>
                <input
                  type="number"
                  max={selectedPartialFee.amount - 100}
                  value={partialRequestedAmount}
                  onChange={(e) => setPartialRequestedAmount(Number(e.target.value))}
                  style={{ width: "100%", padding: "10px 14px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "4px" }}>
                  Reason for Request
                </label>
                <textarea
                  rows={2}
                  value={partialReason}
                  onChange={(e) => setPartialReason(e.target.value)}
                  placeholder="Describe your temporary financial situation..."
                  style={{ width: "100%", padding: "10px 14px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontSize: "0.9rem" }}
                />
              </div>

              {/* AI SIGNATURE ENGINE */}
              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#D35400", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Sparkles size={16} /> AI Signature Verification Engine
                  </span>
                  <button type="button" onClick={startAiSignatureScan} disabled={isAiScanning} style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "4px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>
                    {isAiScanning ? "Scanning..." : "Run AI Signature Match"}
                  </button>
                </div>

                {isAiScanning ? (
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#D35400" }}>Analyzing signature vector match...</p>
                ) : aiScanResult ? (
                  <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "10px", borderRadius: "8px", color: "#047857", fontSize: "0.82rem", display: "flex", justifyContent: "space-between" }}>
                    <span>Status: <strong>{aiScanResult.status}</strong></span>
                    <span>Score: <strong>{aiScanResult.score}% Similarity</strong></span>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#66564A" }}>
                    Click "Run AI Signature Match" to simulate automated guardian signature validation.
                  </p>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" className="ms-btn-secondary" onClick={() => setSelectedPartialFee(null)} style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "10px 18px", borderRadius: "10px", fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" className="ms-btn-primary" style={{ background: "#D35400", color: "#FFFFFF", padding: "10px 20px", borderRadius: "10px", fontWeight: 700 }}>
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT SUCCESS MODAL */}
      {paySuccessTxn && (
        <div className="ms-modal-overlay">
          <div className="ms-modal" style={{ textAlign: "center" }}>
            <CheckCircle2 size={54} style={{ color: "#047857", margin: "0 auto 12px" }} />
            <h3 style={{ margin: "0 0 6px", color: "#241A14", fontSize: "1.4rem", fontWeight: 800 }}>Payment Successful!</h3>
            <p style={{ margin: "0 0 16px", color: "#66564A", fontSize: "0.88rem" }}>
              Paid {formatTaka(paySuccessTxn.amount, false)} for {paySuccessTxn.title}.
            </p>

            <div style={{ background: "#FDF9F3", padding: "14px", borderRadius: "12px", border: "1px solid rgba(196, 154, 108, 0.3)", textAlign: "left", marginBottom: "20px", fontSize: "0.85rem" }}>
              <p style={{ margin: "0 0 4px", color: "#66564A" }}>Receipt #: <strong style={{ color: "#241A14" }}>{paySuccessTxn.receiptNumber}</strong></p>
              <p style={{ margin: "0 0 4px", color: "#66564A" }}>Reference: <strong style={{ color: "#241A14" }}>{paySuccessTxn.referenceId}</strong></p>
              <p style={{ margin: 0, color: "#66564A" }}>Method: <strong style={{ color: "#241A14" }}>{paySuccessTxn.method}</strong></p>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button type="button" className="ms-btn-secondary" onClick={() => { onOpenReceipt(paySuccessTxn); setPaySuccessTxn(null); }} style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "10px 18px", borderRadius: "10px", fontWeight: 700 }}>
                View Digital Receipt 🧾
              </button>
              <button type="button" className="ms-btn-primary" onClick={() => setPaySuccessTxn(null)} style={{ background: "#D35400", color: "#FFFFFF", padding: "10px 20px", borderRadius: "10px", fontWeight: 700 }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP UP WALLET MODAL */}
      {showTopUpModal && (
        <div className="ms-modal-overlay">
          <div className="ms-modal">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, color: "#241A14", fontSize: "1.2rem", fontWeight: 700 }}>Top Up Neo Digital Wallet</h3>
              <button type="button" onClick={() => setShowTopUpModal(false)} style={{ background: "none", border: "none", color: "#66564A", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleTopUpSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "4px" }}>
                  Amount (৳)
                </label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  style={{ width: "100%", padding: "10px 14px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontWeight: 800, fontSize: "1.1rem" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" className="ms-btn-secondary" onClick={() => setShowTopUpModal(false)} style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "10px 18px", borderRadius: "10px", fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" className="ms-btn-primary" style={{ background: "#D35400", color: "#FFFFFF", padding: "10px 20px", borderRadius: "10px", fontWeight: 700 }}>
                  Confirm Top-Up of {formatTaka(topUpAmount, false)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
