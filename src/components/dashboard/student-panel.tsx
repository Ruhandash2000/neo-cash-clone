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
  CheckCircle2, Clock, Send, MessageSquare, PlusCircle, Eye, X, Search, Filter,
  Calendar, Info, AlertTriangle, ChevronRight, LifeBuoy, UserCheck, CornerDownRight
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

  // Fees & Dues Filtering & Detail Modal State
  const [feeFilter, setFeeFilter] = useState<"all" | "due" | "paid" | "overdue" | "pending_partial" | "partial_approved">("all");
  const [feeCategoryFilter, setFeeCategoryFilter] = useState<string>("all");
  const [feeSearchQuery, setFeeSearchQuery] = useState<string>("");
  const [selectedDetailFee, setSelectedDetailFee] = useState<Fee | null>(null);

  // Transactions Filtering, Search & Detail Modal State
  const [txnFilter, setTxnFilter] = useState<"all" | "paid" | "pending" | "failed" | "refunded" | "donation" | "wallet">("all");
  const [txnSearchQuery, setTxnSearchQuery] = useState<string>("");
  const [selectedDetailTxn, setSelectedDetailTxn] = useState<Transaction | null>(null);

  // Escalation Support Modal State
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateSubject, setEscalateSubject] = useState("Tuition Hardship & Installment Request");
  const [escalateMessage, setEscalateMessage] = useState("");
  const [showMobileChatModal, setShowMobileChatModal] = useState(false);

  // AI Chat Assistant State (Phase 8 Financial Process Copilot)
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: "user" | "ai" | "admin";
    senderName?: string;
    text: string;
    time: string;
    actions?: Array<{
      label: string;
      actionType: "apply_partial" | "pay_fee" | "view_receipts" | "topup_wallet" | "escalate_admin";
      feeId?: string;
    }>;
    isEscalationNotice?: boolean;
    ticketId?: string;
  }>>([
    {
      id: "msg-welcome",
      sender: "ai",
      senderName: "Neo AI Financial Assistant",
      text: "Hello Ruhan! I am your specialized Neo Cash Financial Process Assistant. How can I assist you with your tuition fees, payment deadlines, partial payments, or digital receipts today?",
      time: "10:00 AM",
      actions: [
        { label: "When is my tuition due? 🗓️", actionType: "pay_fee" },
        { label: "I can't pay my full tuition 📋", actionType: "apply_partial" },
        { label: "What documents do I need? 📄", actionType: "apply_partial" },
        { label: "Talk to Admin 👤", actionType: "escalate_admin" },
      ]
    },
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

  const generateAiResponse = (userQuery: string) => {
    const q = userQuery.toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    
    // Live dynamic data from store
    const unpaidFees = store.fees.filter(f => f.status !== "paid");
    const primaryFee = unpaidFees[0] || store.fees[0];
    const latestTxn = store.transactions[0];
    const activeApp = store.partialApplications.find(a => a.studentId === store.studentProfile.studentId);
    
    let replyText = "";
    let actions: Array<{ label: string; actionType: "apply_partial" | "pay_fee" | "view_receipts" | "topup_wallet" | "escalate_admin"; feeId?: string }> = [];

    if (q.includes("can't pay") || q.includes("cant pay") || q.includes("cannot pay") || q.includes("full tuition") || q.includes("hardship") || q.includes("partial")) {
      replyText = "You may apply for Partial Payment. Our institutional financial assistance policy allows eligible students to split tuition fees into manageable installments following guardian ID and signature verification.";
      actions = [
        { label: "Apply for Partial Payment 📋", actionType: "apply_partial", feeId: primaryFee ? primaryFee.id : "fee-1" },
        { label: "View Required Documents 📄", actionType: "apply_partial" },
        { label: "Talk to Admin 👤", actionType: "escalate_admin" },
      ];
    } else if (q.includes("when") || q.includes("due") || q.includes("deadline") || q.includes("tuition due")) {
      if (primaryFee) {
        replyText = `Your ${primaryFee.title} of ${formatTaka(primaryFee.amount, false)} is due on ${primaryFee.dueDate}. You currently have ${unpaidFees.length} unpaid fee(s) totaling ${formatTaka(unpaidFees.reduce((s, f) => s + f.amount, 0), false)}.`;
      } else {
        replyText = "All your current institutional semester fees have been paid in full! No outstanding due dates logged.";
      }
      actions = [
        { label: "Pay Fee Now 💳", actionType: "pay_fee", feeId: primaryFee ? primaryFee.id : "fee-1" },
        { label: "Apply for Partial Payment 📋", actionType: "apply_partial", feeId: primaryFee ? primaryFee.id : "fee-1" },
      ];
    } else if (q.includes("document") || q.includes("require") || q.includes("need") || q.includes("nid") || q.includes("signature")) {
      replyText = "For a Partial Payment application, you need:\n1. Digital application statement explaining reason\n2. Guardian National ID (NID/Passport photo)\n3. Guardian & student digital signature for AI vector match validation.";
      actions = [
        { label: "Open Partial Application Form 📋", actionType: "apply_partial" },
      ];
    } else if (q.includes("receipt") || q.includes("paid") || q.includes("proof") || q.includes("transaction")) {
      replyText = `Your digital receipt #${latestTxn?.receiptNumber || "REC-982104"} for ${latestTxn?.title || "Tuition Fee"} is cryptographically signed and stored in the institutional ledger.`;
      actions = [
        { label: "View Digital Receipts 🧾", actionType: "view_receipts" },
      ];
    } else if (q.includes("wallet") || q.includes("balance") || q.includes("top up") || q.includes("topup") || q.includes("add money")) {
      replyText = `Your active Neo Wallet balance is ${formatTaka(store.balances.walletBalance, false)}. You can top up using bKash, Rocket, or Debit/Credit cards.`;
      actions = [
        { label: "Top Up Wallet ➕", actionType: "topup_wallet" },
      ];
    } else if (q.includes("notice") || q.includes("policy") || q.includes("rule")) {
      replyText = "Notice from Financial Controller: Late fee penalties take effect 5 days after deadline. Hardship partial applications must be submitted prior to the due date for automatic hold on late fees.";
      actions = [
        { label: "Apply for Partial Payment 📋", actionType: "apply_partial" },
      ];
    } else if (q.includes("admin") || q.includes("talk") || q.includes("human") || q.includes("escalat") || q.includes("help")) {
      replyText = "I can escalate your request directly to Dhaka City College Financial Controllers. An admin will review your student dossier and reply to your thread.";
      actions = [
        { label: "Submit Support Escalation 👤", actionType: "escalate_admin" },
      ];
    } else {
      replyText = `I understand you are inquiring about institutional processes. You currently have ${formatTaka(store.balances.totalDue, false)} total outstanding fees and ${formatTaka(store.balances.walletBalance, false)} in your wallet. How can I help you proceed?`;
      actions = [
        { label: "Apply for Partial Payment 📋", actionType: "apply_partial" },
        { label: "Talk to Admin 👤", actionType: "escalate_admin" },
      ];
    }

    setChatMessages((prev) => [
      ...prev,
      {
        id: "msg-" + Date.now(),
        sender: "ai",
        senderName: "Neo AI Financial Assistant",
        text: replyText,
        time,
        actions,
      },
    ]);
  };

  const handleSendChatMessage = (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const query = customMsg || chatInput.trim();
    if (!query) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages((prev) => [
      ...prev,
      { id: "user-" + Date.now(), sender: "user", text: query, time },
    ]);
    if (!customMsg) setChatInput("");

    setTimeout(() => {
      generateAiResponse(query);
    }, 600);
  };

  const handleChatActionClick = (action: any) => {
    if (action.actionType === "apply_partial") {
      const targetFee = store.fees.find(f => f.id === action.feeId) || store.fees[0];
      if (targetFee) setSelectedPartialFee(targetFee);
    } else if (action.actionType === "pay_fee") {
      const targetFee = store.fees.find(f => f.id === action.feeId) || store.fees[0];
      if (targetFee) setSelectedPayFee(targetFee);
    } else if (action.actionType === "view_receipts") {
      setActiveTab("transactions");
    } else if (action.actionType === "topup_wallet") {
      setShowTopUpModal(true);
    } else if (action.actionType === "escalate_admin") {
      setShowEscalateModal(true);
    }
  };

  const handleEscalationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalateMessage.trim()) return alert("Please describe your query for Admin.");

    const ticket = actions.createEscalation(escalateSubject, escalateMessage.trim());
    setShowEscalateModal(false);
    setEscalateMessage("");

    // Post escalation notice in AI chat
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages((prev) => [
      ...prev,
      {
        id: "esc-notif-" + Date.now(),
        sender: "ai",
        senderName: "Neo AI Assistant (Escalated)",
        text: `Escalation Ticket #${ticket.id} has been opened and transmitted to Dhaka City College Financial Controllers! Subject: "${escalateSubject}". Admin replies will appear directly in this thread and in your Notifications.`,
        time,
        isEscalationNotice: true,
        ticketId: ticket.id,
      },
    ]);
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {/* HERO METRIC CARD — AVAILABLE BALANCE (VISUALLY DOMINANT) */}
            <div
              style={{
                background: "#FFFFFF",
                border: "2px solid #D35400",
                borderRadius: "16px",
                padding: "20px 24px",
                boxShadow: "0 8px 24px rgba(211, 84, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gridColumn: "span 2",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#D35400", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  AVAILABLE BALANCE (PRIMARY)
                </span>
                <span style={{ fontSize: "0.72rem", background: "rgba(211, 84, 0, 0.12)", color: "#D35400", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>
                  ACTIVE WALLET
                </span>
              </div>

              <div style={{ margin: "10px 0 6px" }}>
                <span style={{ fontSize: "2.4rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.03em", fontFeatureSettings: "'tnum'" }}>
                  {formatTaka(store.balances.availableBalance, false)}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "#047857", fontWeight: 700 }}>
                <CheckCircle2 size={15} />
                <span>Includes {formatTaka(store.balances.walletBalance, false)} in Neo Digital Wallet</span>
              </div>
            </div>

            {/* SECONDARY METRIC CARD — TOTAL DUE */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(196, 154, 108, 0.3)",
                borderRadius: "16px",
                padding: "18px 20px",
                boxShadow: "0 3px 10px rgba(36, 26, 20, 0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase" }}>
                  TOTAL DUE
                </span>
                <StatusBadge status="due" customLabel="Due Soon" />
              </div>

              <div style={{ margin: "8px 0 4px" }}>
                <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#BE123C", fontFeatureSettings: "'tnum'" }}>
                  {formatTaka(store.balances.totalDue, false)}
                </span>
              </div>

              <div style={{ fontSize: "0.78rem", color: "#8C7A6A" }}>
                Next Deadline: <strong style={{ color: "#241A14" }}>Oct 15, 2026</strong>
              </div>
            </div>

            {/* SECONDARY METRIC CARD — PAID THIS MONTH */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(196, 154, 108, 0.3)",
                borderRadius: "16px",
                padding: "18px 20px",
                boxShadow: "0 3px 10px rgba(36, 26, 20, 0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase" }}>
                  PAID THIS MONTH
                </span>
                <span style={{ fontSize: "0.72rem", background: "rgba(4, 120, 87, 0.12)", color: "#047857", padding: "2px 8px", borderRadius: "999px", fontWeight: 700 }}>
                  SETTLED
                </span>
              </div>

              <div style={{ margin: "8px 0 4px" }}>
                <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#047857", fontFeatureSettings: "'tnum'" }}>
                  {formatTaka(store.balances.paidThisMonth || 12000, false)}
                </span>
              </div>

              <div style={{ fontSize: "0.78rem", color: "#8C7A6A" }}>
                Verified by Digital Receipts
              </div>
            </div>

            {/* SECONDARY METRIC CARD — PENDING APPL/DUES */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(196, 154, 108, 0.3)",
                borderRadius: "16px",
                padding: "18px 20px",
                boxShadow: "0 3px 10px rgba(36, 26, 20, 0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase" }}>
                  PENDING
                </span>
                <StatusBadge status="pending" customLabel="In Review" />
              </div>

              <div style={{ margin: "8px 0 4px" }}>
                <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#D35400", fontFeatureSettings: "'tnum'" }}>
                  {formatTaka(store.balances.pendingAmount || 2000, false)}
                </span>
              </div>

              <div style={{ fontSize: "0.78rem", color: "#8C7A6A" }}>
                Partial Application in Review
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS BAR */}
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#241A14", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Quick Actions
            </span>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setActiveTab("fees")}
                style={{
                  background: "#FFF7E6",
                  border: "1px solid rgba(196, 154, 108, 0.4)",
                  color: "#241A14",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <CreditCard size={15} style={{ color: "#D35400" }} /> Pay Fees
              </button>

              <button
                type="button"
                onClick={() => setShowTopUpModal(true)}
                style={{
                  background: "#FFF7E6",
                  border: "1px solid rgba(196, 154, 108, 0.4)",
                  color: "#241A14",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Wallet size={15} style={{ color: "#D35400" }} /> Wallet
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("transactions")}
                style={{
                  background: "#FFF7E6",
                  border: "1px solid rgba(196, 154, 108, 0.4)",
                  color: "#241A14",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FileText size={15} style={{ color: "#D35400" }} /> Transactions
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ai")}
                style={{
                  background: "#211710",
                  color: "#FF8C42",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Sparkles size={15} /> AI Assistant
              </button>
            </div>
          </div>

          {/* AI ASSISTANT FINANCIAL PROCESS PREVIEW & INSTITUTIONAL NOTICES */}
          <div className="ms-grid-2">
            {/* AI ASSISTANT PREVIEW CARD */}
            <div style={{ background: "#241A14", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "16px", padding: "20px", color: "#FFF7E6", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#FF8C42", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Sparkles size={16} /> NEO AI FINANCIAL ASSISTANT
                  </span>
                  <span style={{ fontSize: "0.72rem", background: "rgba(255, 140, 66, 0.2)", color: "#FF8C42", padding: "2px 8px", borderRadius: "999px" }}>
                    PROCESS AI
                  </span>
                </div>

                <div style={{ background: "#3D2B1F", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.2)", marginBottom: "10px", fontSize: "0.88rem" }}>
                  <p style={{ margin: 0, color: "#FF8C42", fontWeight: 700, fontSize: "0.78rem", marginBottom: "2px" }}>Student Question:</p>
                  <p style={{ margin: 0, fontStyle: "italic", color: "#FFF7E6" }}>"I can't pay my full tuition this month."</p>
                </div>

                <div style={{ background: "rgba(211, 84, 0, 0.15)", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(211, 84, 0, 0.3)", fontSize: "0.88rem", marginBottom: "16px" }}>
                  <p style={{ margin: 0, color: "#F7B733", fontWeight: 700, fontSize: "0.78rem", marginBottom: "2px" }}>Neo AI Guidance:</p>
                  <p style={{ margin: 0, color: "#FFF7E6" }}>"You may apply for Partial Payment. I can guide you through the required guardian documents & AI signature verification."</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("ai")}
                style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "10px 18px", borderRadius: "10px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
              >
                <Sparkles size={16} /> Ask Neo AI
              </button>
            </div>

            {/* INSTITUTIONAL NOTICES FEED */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#241A14" }}>
                    Institutional Notices & Alerts
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "#8C7A6A" }}>{store.notifications.length} Active</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {store.notifications.slice(0, 3).map((notif) => (
                    <div key={notif.id} style={{ padding: "10px 12px", background: "#FFF7E6", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.25)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                        <strong style={{ fontSize: "0.85rem", color: "#241A14" }}>{notif.title}</strong>
                        <span style={{ fontSize: "0.72rem", color: "#8C7A6A" }}>{notif.date}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#66564A" }}>{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "14px", fontSize: "0.78rem", color: "#8C7A6A", textAlign: "right" }}>
                Official Notices verified by {store.studentProfile.institution}
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
      {activeTab === "fees" && (() => {
        // Dynamic metrics calculations
        const totalOutstanding = store.fees
          .filter((f) => f.status !== "paid")
          .reduce((acc, f) => acc + (f.approvedPartialAmount || f.amount), 0);

        const paidThisTerm = store.fees
          .filter((f) => f.status === "paid")
          .reduce((acc, f) => acc + f.originalAmount, 0);

        const upcomingFeesList = store.fees.filter(
          (f) => f.status === "due" || f.status === "partial_approved"
        );
        const upcomingCount = upcomingFeesList.length;
        const upcomingAmount = upcomingFeesList.reduce(
          (acc, f) => acc + (f.approvedPartialAmount || f.amount),
          0
        );

        const overdueFeesList = store.fees.filter((f) => f.status === "overdue");
        const overdueCount = overdueFeesList.length;
        const overdueAmount = overdueFeesList.reduce((acc, f) => acc + f.amount, 0);

        const filterCounts = {
          all: store.fees.length,
          due: store.fees.filter((f) => f.status === "due").length,
          paid: store.fees.filter((f) => f.status === "paid").length,
          overdue: store.fees.filter((f) => f.status === "overdue").length,
          pending_partial: store.fees.filter((f) => f.status === "pending_partial").length,
          partial_approved: store.fees.filter((f) => f.status === "partial_approved").length,
        };

        const filteredFeesList = store.fees.filter((fee) => {
          if (feeFilter !== "all" && fee.status !== feeFilter) return false;
          if (feeCategoryFilter !== "all" && fee.category !== feeCategoryFilter) return false;
          if (feeSearchQuery.trim()) {
            const q = feeSearchQuery.toLowerCase();
            const matchTitle = fee.title.toLowerCase().includes(q);
            const matchCategory = fee.category.toLowerCase().includes(q);
            const matchDesc = fee.description.toLowerCase().includes(q);
            if (!matchTitle && !matchCategory && !matchDesc) return false;
          }
          return true;
        });

        const paidFeesHistory = store.fees.filter((f) => f.status === "paid");

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            
            {/* PAGE TITLE & SUBTITLE */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: "1.65rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.01em" }}>
                  Institutional Fees & Dues
                </h1>
                <p style={{ margin: "4px 0 0", fontSize: "0.92rem", color: "#66564A" }}>
                  Track what you owe, payment deadlines, past receipts, and approved partial payment installment plans.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "8px 14px", borderRadius: "10px", fontSize: "0.82rem", color: "#66564A" }}>
                <ShieldCheck size={16} style={{ color: "#D35400" }} />
                <span>Fee Amounts Assigned by <strong>{store.studentProfile.institution}</strong></span>
              </div>
            </div>

            {/* SUMMARY CARDS (4 METRICS) */}
            <div className="ms-grid-4">
              {/* Card 1: Total Outstanding */}
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", gap: "8px", boxShadow: "0 2px 8px rgba(36, 26, 20, 0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Total Outstanding
                  </span>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(225, 29, 72, 0.1)", display: "grid", placeItems: "center", color: "#BE123C" }}>
                    <AlertTriangle size={17} />
                  </div>
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: totalOutstanding > 0 ? "#BE123C" : "#047857", fontFeatureSettings: "'tnum'" }}>
                  {formatTaka(totalOutstanding, false)}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#8C7A6A" }}>
                  Remaining dues payable across all assigned items
                </div>
              </div>

              {/* Card 2: Paid This Term */}
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", gap: "8px", boxShadow: "0 2px 8px rgba(36, 26, 20, 0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Paid This Term
                  </span>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.12)", display: "grid", placeItems: "center", color: "#047857" }}>
                    <CheckCircle2 size={17} />
                  </div>
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#047857", fontFeatureSettings: "'tnum'" }}>
                  {formatTaka(paidThisTerm, false)}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#8C7A6A" }}>
                  Total cleared institutional payments
                </div>
              </div>

              {/* Card 3: Upcoming Fees */}
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", gap: "8px", boxShadow: "0 2px 8px rgba(36, 26, 20, 0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Upcoming Fees
                  </span>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(37, 99, 235, 0.1)", display: "grid", placeItems: "center", color: "#2563EB" }}>
                    <Calendar size={17} />
                  </div>
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                  {upcomingCount} <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#66564A" }}>({formatTaka(upcomingAmount, false)})</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "#8C7A6A" }}>
                  Due in upcoming days
                </div>
              </div>

              {/* Card 4: Overdue Fees */}
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", gap: "8px", boxShadow: "0 2px 8px rgba(36, 26, 20, 0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Overdue Dues
                  </span>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(225, 29, 72, 0.15)", display: "grid", placeItems: "center", color: "#BE123C" }}>
                    <AlertCircle size={17} />
                  </div>
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: overdueCount > 0 ? "#BE123C" : "#047857", fontFeatureSettings: "'tnum'" }}>
                  {overdueCount} <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#66564A" }}>({formatTaka(overdueAmount, false)})</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: overdueCount > 0 ? "#BE123C" : "#8C7A6A", fontWeight: overdueCount > 0 ? 700 : 400 }}>
                  {overdueCount > 0 ? "Requires immediate resolution" : "No overdue items"}
                </div>
              </div>
            </div>

            {/* FILTER & CONTROL TOOLBAR */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                
                {/* Filter Pills */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                  {[
                    { id: "all", label: "All", count: filterCounts.all },
                    { id: "due", label: "Due", count: filterCounts.due },
                    { id: "paid", label: "Paid", count: filterCounts.paid },
                    { id: "overdue", label: "Overdue", count: filterCounts.overdue },
                    { id: "pending_partial", label: "Under Review", count: filterCounts.pending_partial },
                    { id: "partial_approved", label: "Partial Approved", count: filterCounts.partial_approved },
                  ].map((tab) => {
                    const isActive = feeFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFeeFilter(tab.id as any)}
                        style={{
                          background: isActive ? "#D35400" : "#FDF9F3",
                          color: isActive ? "#FFFFFF" : "#241A14",
                          border: isActive ? "1px solid #D35400" : "1px solid rgba(196, 154, 108, 0.3)",
                          padding: "6px 14px",
                          borderRadius: "999px",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {tab.label}
                        <span
                          style={{
                            background: isActive ? "rgba(255, 255, 255, 0.25)" : "rgba(36, 26, 20, 0.08)",
                            padding: "2px 6px",
                            borderRadius: "999px",
                            fontSize: "0.74rem",
                          }}
                        >
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search & Category Dropdown */}
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ position: "relative", minWidth: "180px" }}>
                    <select
                      value={feeCategoryFilter}
                      onChange={(e) => setFeeCategoryFilter(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        background: "#FDF9F3",
                        border: "1px solid rgba(196, 154, 108, 0.35)",
                        borderRadius: "10px",
                        color: "#241A14",
                        fontSize: "0.84rem",
                        fontWeight: 600,
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      <option value="all">All Categories</option>
                      <option value="Tuition">Tuition</option>
                      <option value="Lab & Tech">Lab & Tech</option>
                      <option value="Library">Library</option>
                      <option value="Exam">Exam</option>
                      <option value="Hostel">Hostel</option>
                      <option value="Transport">Transport</option>
                    </select>
                  </div>

                  <div style={{ position: "relative", minWidth: "220px" }}>
                    <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#8C7A6A" }} />
                    <input
                      type="text"
                      placeholder="Search fee title..."
                      value={feeSearchQuery}
                      onChange={(e) => setFeeSearchQuery(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px 8px 34px",
                        background: "#FDF9F3",
                        border: "1px solid rgba(196, 154, 108, 0.35)",
                        borderRadius: "10px",
                        color: "#241A14",
                        fontSize: "0.84rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* FEE CARDS LISTING */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filteredFeesList.length === 0 ? (
                <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "40px", textAlign: "center", color: "#66564A" }}>
                  <FileText size={38} style={{ color: "#8C7A6A", marginBottom: "10px" }} />
                  <h4 style={{ margin: "0 0 4px", color: "#241A14", fontSize: "1.1rem" }}>No matching fee items found</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem" }}>Try clearing search filters or selecting another fee tab.</p>
                </div>
              ) : (
                filteredFeesList.map((fee) => {
                  const isPaid = fee.status === "paid";
                  const isPartialApproved = fee.status === "partial_approved";
                  const isPendingPartial = fee.status === "pending_partial";
                  const isOverdue = fee.status === "overdue";

                  return (
                    <div
                      key={fee.id}
                      style={{
                        background: "#FFFFFF",
                        border: isPartialApproved
                          ? "1.5.px solid #047857"
                          : isOverdue
                          ? "1.5px solid rgba(225, 29, 72, 0.4)"
                          : "1px solid rgba(196, 154, 108, 0.3)",
                        borderRadius: "14px",
                        padding: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "18px",
                        boxShadow: "0 3px 10px rgba(36, 26, 20, 0.02)",
                        position: "relative",
                      }}
                    >
                      {/* Left Side Info */}
                      <div style={{ flex: "1 1 340px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#241A14" }}>
                            {fee.title}
                          </h3>
                          <StatusBadge status={mapFeeStatus(fee.status)} />
                          <span
                            style={{
                              background: "#FDF9F3",
                              border: "1px solid rgba(196, 154, 108, 0.25)",
                              color: "#66564A",
                              padding: "2px 8px",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            {fee.category}
                          </span>
                        </div>

                        <p style={{ margin: "0 0 10px", fontSize: "0.88rem", color: "#66564A" }}>
                          {fee.description}
                        </p>

                        <div style={{ display: "flex", gap: "18px", fontSize: "0.82rem", color: "#8C7A6A", flexWrap: "wrap" }}>
                          <span>Issued: <strong style={{ color: "#241A14" }}>{fee.issuedDate || "2026-08-15"}</strong></span>
                          <span>Deadline: <strong style={{ color: isOverdue ? "#BE123C" : "#241A14" }}>{fee.dueDate}</strong></span>
                        </div>

                        {/* Approved Partial Banner */}
                        {isPartialApproved && (
                          <div
                            style={{
                              marginTop: "12px",
                              background: "rgba(16, 185, 129, 0.1)",
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                              borderRadius: "10px",
                              padding: "8px 12px",
                              fontSize: "0.82rem",
                              color: "#047857",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <CheckCircle2 size={16} />
                            <span>
                              <strong>Partial Payment Approved:</strong> Pay approved installment of <strong>{formatTaka(fee.approvedPartialAmount || 0, false)}</strong> (Remaining: {formatTaka((fee.originalAmount || 0) - (fee.approvedPartialAmount || 0), false)})
                            </span>
                          </div>
                        )}

                        {/* Under Review Banner */}
                        {isPendingPartial && (
                          <div
                            style={{
                              marginTop: "12px",
                              background: "rgba(247, 183, 51, 0.12)",
                              border: "1px solid rgba(247, 183, 51, 0.4)",
                              borderRadius: "10px",
                              padding: "8px 12px",
                              fontSize: "0.82rem",
                              color: "#9A6600",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <Clock size={16} />
                            <span>
                              <strong>Under Admin Review:</strong> Your application for partial payment is currently being processed.
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right Side Amounts & Actions */}
                      <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
                        <div>
                          {isPartialApproved ? (
                            <div>
                              <span style={{ textDecoration: "line-through", color: "#8C7A6A", fontSize: "0.85rem", marginRight: "8px" }}>
                                {formatTaka(fee.originalAmount, false)}
                              </span>
                              <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#047857", fontFeatureSettings: "'tnum'" }}>
                                {formatTaka(fee.approvedPartialAmount || fee.amount, false)}
                              </span>
                            </div>
                          ) : isPaid ? (
                            <div>
                              <span style={{ fontSize: "1.35rem", fontWeight: 800, color: "#047857", fontFeatureSettings: "'tnum'" }}>
                                {formatTaka(fee.originalAmount, false)}
                              </span>
                              <div style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 700 }}>Paid on {fee.paidDate || "Sep 12, 2026"}</div>
                            </div>
                          ) : (
                            <span style={{ fontSize: "1.4rem", fontWeight: 800, color: isOverdue ? "#BE123C" : "#241A14", fontFeatureSettings: "'tnum'" }}>
                              {formatTaka(fee.amount, false)}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                          
                          {/* View Details Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedDetailFee(fee)}
                            style={{
                              background: "#FDF9F3",
                              color: "#241A14",
                              border: "1px solid rgba(196, 154, 108, 0.4)",
                              padding: "8px 14px",
                              borderRadius: "10px",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <Info size={14} /> Detail Info
                          </button>

                          {isPaid ? (
                            <button
                              type="button"
                              onClick={() => {
                                const matchingTxn = store.transactions.find((t) => t.feeId === fee.id || t.title === fee.title) || {
                                  id: "TXN-" + Math.floor(10000 + Math.random() * 90000),
                                  title: fee.title,
                                  date: fee.paidDate || "2026-09-12 02:15 PM",
                                  amount: fee.originalAmount,
                                  type: "fee" as const,
                                  status: "Success" as const,
                                  method: "bKash Mobile Banking",
                                  referenceId: "BK-904821",
                                  receiptNumber: "REC-982104",
                                };
                                onOpenReceipt(matchingTxn);
                              }}
                              style={{
                                background: "rgba(16, 185, 129, 0.12)",
                                color: "#047857",
                                border: "1px solid rgba(16, 185, 129, 0.3)",
                                padding: "8px 14px",
                                borderRadius: "10px",
                                fontSize: "0.82rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              View Receipt 🧾
                            </button>
                          ) : (
                            <>
                              {!isPendingPartial && !isPartialApproved && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedPartialFee(fee)}
                                  style={{
                                    background: "#FDF9F3",
                                    color: "#D35400",
                                    border: "1px solid rgba(211, 84, 0, 0.4)",
                                    padding: "8px 14px",
                                    borderRadius: "10px",
                                    fontSize: "0.82rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                >
                                  Apply Partial Payment
                                </button>
                              )}

                              <button
                                type="button"
                                className="ms-btn-primary"
                                onClick={() => setSelectedPayFee(fee)}
                                style={{
                                  background: "#D35400",
                                  color: "#FFFFFF",
                                  padding: "8px 16px",
                                  borderRadius: "10px",
                                  fontSize: "0.85rem",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                Pay {isPartialApproved ? "Approved Amount" : "Full Amount"}
                              </button>
                            </>
                          )}

                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* SUBMITTED PARTIAL PAYMENT APPLICATIONS TRACK RECORD */}
            {store.partialApplications.length > 0 && (
              <div className="mobile-paid-fees" style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: "1.1rem", fontWeight: 700, color: "#241A14" }}>
                  Submitted Partial Payment Applications Log
                </h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {store.partialApplications.map((app) => (
                    <div key={app.id} style={{ padding: "14px", background: "#FDF9F3", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.2)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                        <div>
                          <span style={{ fontWeight: 700, color: "#241A14", fontSize: "0.92rem" }}>
                            Application {app.id} — {app.feeTitle}
                          </span>
                          <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#66564A" }}>
                            Requested: {formatTaka(app.requestedAmount, false)} (Original: {formatTaka(app.originalAmount, false)}) • Submitted {app.submittedAt}
                          </p>
                        </div>
                        <StatusBadge
                          status={app.status.startsWith("approved") ? "approved" : app.status.startsWith("rejected") ? "rejected" : "under_review"}
                        />
                      </div>
                      <div style={{ marginTop: "8px", fontSize: "0.78rem", color: "#66564A", display: "flex", gap: "14px", flexWrap: "wrap" }}>
                        <span>Reason: "{app.reason}"</span>
                        <span>Guardian: <strong>{app.guardianName} ({app.guardianPhone})</strong></span>
                        <span>AI Signature Match: <strong style={{ color: "#047857" }}>{app.aiMatchScore}% Similarity</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PAST PAID FEES SECTION */}
            {paidFeesHistory.length > 0 && (
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: "1.1rem", fontWeight: 700, color: "#241A14" }}>
                  Past Paid Fees Archive
                </h3>
                
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
                    <thead>
                      <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                        <th style={{ padding: "10px 14px", fontWeight: 700 }}>Fee Title</th>
                        <th style={{ padding: "10px 14px", fontWeight: 700 }}>Category</th>
                        <th style={{ padding: "10px 14px", fontWeight: 700 }}>Payment Date</th>
                        <th style={{ padding: "10px 14px", fontWeight: 700 }}>Amount Paid</th>
                        <th style={{ padding: "10px 14px", fontWeight: 700 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paidFeesHistory.map((pf) => (
                        <tr key={pf.id} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.2)" }}>
                          <td style={{ padding: "12px 14px", fontWeight: 700, color: "#241A14" }}>{pf.title}</td>
                          <td style={{ padding: "12px 14px", color: "#66564A" }}>{pf.category}</td>
                          <td style={{ padding: "12px 14px", color: "#66564A" }}>{pf.paidDate || "2026-09-12"}</td>
                          <td style={{ padding: "12px 14px", fontWeight: 800, color: "#047857" }}>{formatTaka(pf.originalAmount, false)}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <button
                              type="button"
                              onClick={() => {
                                const matchingTxn = store.transactions.find((t) => t.feeId === pf.id || t.title === pf.title) || {
                                  id: "TXN-" + Math.floor(10000 + Math.random() * 90000),
                                  title: pf.title,
                                  date: pf.paidDate || "2026-09-12 02:15 PM",
                                  amount: pf.originalAmount,
                                  type: "fee" as const,
                                  status: "Success" as const,
                                  method: "bKash Mobile Banking",
                                  referenceId: "BK-904821",
                                  receiptNumber: "REC-982104",
                                };
                                onOpenReceipt(matchingTxn);
                              }}
                              style={{ background: "none", border: "none", color: "#D35400", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", padding: 0 }}
                            >
                              Download Receipt 🧾
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        );
      })()}

      {/* 2.5. MY WALLET & PAYMENT METHODS TAB */}
      {activeTab === "wallet" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#241A14" }}>
                My Neo Digital Wallet & Payment Hub
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                Manage your digital balances, connected mobile banking accounts, payment security, and instant fee settlements.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="ms-btn-primary"
                onClick={() => setShowTopUpModal(true)}
                style={{ background: "#D35400", color: "#FFFFFF", padding: "10px 18px", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 700 }}
              >
                <PlusCircle size={16} /> Add Money (Top Up)
              </button>
            </div>
          </div>

          {/* BANKING-STYLE BALANCE & WALLET STATUS HERO GRID */}
          <div className="ms-grid-2">
            
            {/* HERO BALANCE CARD */}
            <div style={{ background: "#FFFFFF", border: "2px solid #D35400", borderRadius: "18px", padding: "24px", boxShadow: "0 8px 24px rgba(211, 84, 0, 0.08)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#D35400", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    TOTAL AVAILABLE BALANCE
                  </span>
                  <span style={{ fontSize: "0.72rem", background: "rgba(4, 120, 87, 0.12)", color: "#047857", padding: "3px 10px", borderRadius: "999px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <ShieldCheck size={13} /> Active & Secured
                  </span>
                </div>

                <div style={{ margin: "10px 0 16px" }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.03em", fontFeatureSettings: "'tnum'" }}>
                    {formatTaka(store.balances.availableBalance, false)}
                  </span>
                </div>

                <div style={{ background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.85rem" }}>
                  <div>
                    <span style={{ color: "#8C7A6A", fontSize: "0.74rem", display: "block" }}>Neo Digital Wallet</span>
                    <strong style={{ color: "#241A14", fontSize: "1rem" }}>{formatTaka(store.balances.walletBalance, false)}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#8C7A6A", fontSize: "0.74rem", display: "block" }}>Linked Banking Funds</span>
                    <strong style={{ color: "#241A14", fontSize: "1rem" }}>{formatTaka(Math.max(0, store.balances.availableBalance - store.balances.walletBalance), false)}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => setShowTopUpModal(true)}
                  style={{ flex: 1, background: "#D35400", color: "#FFFFFF", border: "none", padding: "11px", borderRadius: "10px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <PlusCircle size={16} /> Add Money
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("fees")}
                  style={{ flex: 1, background: "#FFF7E6", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "11px", borderRadius: "10px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <CreditCard size={16} style={{ color: "#D35400" }} /> Pay Assigned Fees
                </button>
              </div>
            </div>

            {/* WALLET IDENTITY & DAILY LIMIT CARD */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "18px", padding: "24px", boxShadow: "0 4px 14px rgba(36, 26, 20, 0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px dashed rgba(196, 154, 108, 0.3)", paddingBottom: "10px" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#241A14", textTransform: "uppercase" }}>
                    INSTITUTIONAL WALLET SPECIFICATION
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#8C7A6A", fontWeight: 600 }}>{store.studentProfile.institution}</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px", fontSize: "0.88rem" }}>
                  <div>
                    <span style={{ color: "#8C7A6A", fontSize: "0.75rem", display: "block" }}>Wallet Account ID</span>
                    <strong style={{ color: "#D35400", fontWeight: 800 }}>NEO-W-2026-8842</strong>
                  </div>
                  <div>
                    <span style={{ color: "#8C7A6A", fontSize: "0.75rem", display: "block" }}>Account Holder</span>
                    <strong style={{ color: "#241A14" }}>{store.studentProfile.name}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#8C7A6A", fontSize: "0.75rem", display: "block" }}>Student ID</span>
                    <strong style={{ color: "#241A14" }}>{store.studentProfile.studentId}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#8C7A6A", fontSize: "0.75rem", display: "block" }}>Account Status</span>
                    <strong style={{ color: "#047857" }}>Active & Verified</strong>
                  </div>
                </div>

                {/* Daily Spending Limit Bar */}
                <div style={{ background: "#FFF7E6", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(196, 154, 108, 0.3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontWeight: 700, marginBottom: "6px", color: "#66564A" }}>
                    <span>Daily Transaction Limit</span>
                    <span>৳12,000 / ৳50,000 used today</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", background: "#EAD9C6", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ width: "24%", height: "100%", background: "#D35400", borderRadius: "999px" }} />
                  </div>
                </div>
              </div>

              {/* Subtle Security & Privacy Card */}
              <div style={{ marginTop: "16px", background: "#FDF9F3", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.78rem", color: "#66564A" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={14} style={{ color: "#047857" }} /> Biometric WebAuthn Active
                </span>
                <span>Last login: Today 04:12 PM</span>
              </div>
            </div>

          </div>

          {/* CONNECTED PAYMENT METHODS & MOBILE BANKING */}
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "18px", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#241A14" }}>
                  Connected Payment Methods & Mobile Banking
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "#66564A" }}>
                  Supported gateways for fee payments and instant wallet top-ups.
                </p>
              </div>

              <span style={{ fontSize: "0.78rem", color: "#8C7A6A", background: "#FFF7E6", padding: "4px 12px", borderRadius: "999px", border: "1px solid rgba(196, 154, 108, 0.3)", fontWeight: 600 }}>
                {store.paymentMethods.length} Methods Configured
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
              {store.paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  style={{
                    background: "#FDF9F3",
                    border: "1px solid rgba(196, 154, 108, 0.3)",
                    borderRadius: "14px",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.3)", display: "grid", placeItems: "center", fontSize: "1.2rem" }}>
                      {pm.type === "bkash" ? "📱" : pm.type === "rocket" ? "🚀" : pm.type === "visa" ? "💳" : "💳"}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#241A14" }}>
                        {pm.name}
                      </h4>
                      <span style={{ fontSize: "0.78rem", color: "#66564A" }}>{pm.account}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "0.72rem", background: "rgba(4, 120, 87, 0.12)", color: "#047857", padding: "2px 8px", borderRadius: "999px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                      Connected
                    </span>
                    <button
                      type="button"
                      onClick={() => alert(`Manage payment method for ${pm.name}`)}
                      style={{ background: "none", border: "none", color: "#D35400", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", padding: 0 }}
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WALLET RECENT ACTIVITY TABLE */}
            <div className="mobile-wallet-activity" style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "18px", overflow: "hidden" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(196, 154, 108, 0.25)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#241A14" }}>
                Recent Wallet Activity
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab("transactions")}
                style={{ background: "none", border: "none", color: "#D35400", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
              >
                Full History →
              </button>
            </div>

            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", minWidth: "650px", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                    <th style={{ padding: "14px 18px", fontWeight: 700, whiteSpace: "nowrap" }}>Transaction ID</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, whiteSpace: "nowrap" }}>Description</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, whiteSpace: "nowrap" }}>Date & Time</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, whiteSpace: "nowrap" }}>Payment Source</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, whiteSpace: "nowrap" }}>Amount</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, whiteSpace: "nowrap" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {store.transactions.map((txn) => (
                    <tr key={txn.id} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.2)" }}>
                      <td style={{ padding: "14px 18px", fontWeight: 700, color: "#D35400", whiteSpace: "nowrap" }}>{txn.id}</td>
                      <td style={{ padding: "14px 18px", fontWeight: 600, color: "#241A14", whiteSpace: "nowrap" }}>{txn.title}</td>
                      <td style={{ padding: "14px 18px", color: "#66564A", whiteSpace: "nowrap" }}>{txn.date}</td>
                      <td style={{ padding: "14px 18px", color: "#66564A", whiteSpace: "nowrap" }}>{txn.method}</td>
                      <td style={{ padding: "14px 18px", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'", whiteSpace: "nowrap" }}>{formatTaka(txn.amount, false)}</td>
                      <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
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

        </div>
      )}

      {/* 3. DONATION & SOCIAL IMPACT TAB (PHASE 9) */}
      {activeTab === "donation" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* HEADER */}
          <div className="mobile-impact-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#241A14" }}>
                  Student Welfare & Social Impact Fund
                </h1>
                <span style={{ fontSize: "0.74rem", background: "rgba(16, 185, 129, 0.12)", color: "#047857", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>
                  ● Peer-to-Peer Tuition Assistance
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#66564A" }}>
                Demonstration welfare fund supporting underprivileged peer tuition. Formula: <strong>৳100 Donated = 1 Impact Point</strong>.
              </p>
            </div>

            <div className="mobile-impact-points" style={{ background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "10px 18px", borderRadius: "14px", textAlign: "right" }}>
              <span style={{ fontSize: "0.74rem", color: "#8C7A6A", fontWeight: 700, textTransform: "uppercase" }}>My Impact Points</span>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#D35400", margin: "2px 0 0" }}>
                {store.donations.points} Pts
              </div>
            </div>
          </div>

          {/* 5-TIER MULTI-LEVEL RANKING DOSSIER */}
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "20px" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#241A14", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Award size={16} style={{ color: "#D35400" }} /> Institutional Impact Standing (5 Tiers)
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.25)", borderRadius: "12px", padding: "14px" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Class Rank</span>
                <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#241A14", margin: "4px 0 2px" }}>#{store.donations.rankClass}</h3>
                <span style={{ fontSize: "0.76rem", color: "#D35400", fontWeight: 700 }}>CSE 1st Year</span>
              </div>

              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.25)", borderRadius: "12px", padding: "14px" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Section Rank</span>
                <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#241A14", margin: "4px 0 2px" }}>#2</h3>
                <span style={{ fontSize: "0.76rem", color: "#66564A", fontWeight: 700 }}>Section A Cohort</span>
              </div>

              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.25)", borderRadius: "12px", padding: "14px" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Department Rank</span>
                <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#241A14", margin: "4px 0 2px" }}>#{store.donations.rankDept}</h3>
                <span style={{ fontSize: "0.76rem", color: "#66564A", fontWeight: 700 }}>CSE Dept Overall</span>
              </div>

              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.25)", borderRadius: "12px", padding: "14px" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Institution Rank</span>
                <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#241A14", margin: "4px 0 2px" }}>#{store.donations.rankInstitution}</h3>
                <span style={{ fontSize: "0.76rem", color: "#66564A", fontWeight: 700 }}>Dhaka City College</span>
              </div>

              <div style={{ background: "#FDF9F3", border: "1.5px solid rgba(211, 84, 0, 0.3)", borderRadius: "12px", padding: "14px" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#D35400", textTransform: "uppercase" }}>Nationwide Rank</span>
                <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#241A14", margin: "4px 0 2px" }}>#{store.donations.rankNational}</h3>
                <span style={{ fontSize: "0.76rem", color: "#047857", fontWeight: 700 }}>Bangladesh Overall</span>
              </div>
            </div>
          </div>

          <div className="mobile-contribution-flow" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            
            {/* DONATION FORM & PRESET AMOUNTS */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "24px" }}>
              <h3 style={{ margin: "0 0 4px", fontSize: "1.1rem", fontWeight: 700, color: "#241A14" }}>
                Make a Welfare Contribution
              </h3>
              <p style={{ margin: "0 0 16px", fontSize: "0.84rem", color: "#66564A" }}>
                Select a preset contribution amount or enter a custom amount.
              </p>

              {donationFeedback && (
                <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "10px 14px", borderRadius: "10px", color: "#047857", fontSize: "0.85rem", marginBottom: "14px", fontWeight: 600 }}>
                  {donationFeedback}
                </div>
              )}

              <form onSubmit={handleDonationSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                {/* PRESET AMOUNT CHIPS */}
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "8px" }}>
                    Select Preset Amount:
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[100, 200, 500, 1000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setDonationAmount(preset)}
                        style={{
                          background: donationAmount === preset ? "#D35400" : "#FDF9F3",
                          color: donationAmount === preset ? "#FFFFFF" : "#241A14",
                          border: donationAmount === preset ? "1px solid #D35400" : "1px solid rgba(196, 154, 108, 0.35)",
                          padding: "8px 16px",
                          borderRadius: "10px",
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        ৳{preset}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setDonationAmount(1500)}
                      style={{
                        background: donationAmount > 1000 ? "#D35400" : "#FDF9F3",
                        color: donationAmount > 1000 ? "#FFFFFF" : "#241A14",
                        border: donationAmount > 1000 ? "1px solid #D35400" : "1px solid rgba(196, 154, 108, 0.35)",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Custom Amount
                    </button>
                  </div>
                </div>

                {/* AMOUNT INPUT FIELD */}
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "6px" }}>
                    Contribution Amount (৳)
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 14px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontSize: "1.1rem", fontWeight: 800 }}
                  />
                  <div style={{ fontSize: "0.78rem", color: "#66564A", marginTop: "4px", display: "flex", justifyContent: "space-between" }}>
                    <span>Calculated Award: <strong style={{ color: "#D35400" }}>{Math.floor(donationAmount / 100)} Impact Points</strong></span>
                    <span>Ratio: ৳100 = 1 Point</span>
                  </div>
                </div>

                {/* PAYMENT METHOD SELECTOR (SUPPORTING BKASH) */}
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "6px" }}>
                    Payment Method
                  </label>
                  <select
                    value={donationMethod}
                    onChange={(e) => setDonationMethod(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontSize: "0.9rem", fontWeight: 600 }}
                  >
                    <option value="bKash Mobile Banking">bKash Mobile Banking (Primary Gateway)</option>
                    <option value="Dutch-Bangla Rocket">Dutch-Bangla Rocket</option>
                    <option value="City Bank Visa Debit">City Bank Visa Debit</option>
                    <option value="Neo Wallet Balance">Neo Digital Wallet Balance ({formatTaka(store.balances.walletBalance, false)})</option>
                  </select>
                </div>

                <button type="submit" className="ms-btn-primary" style={{ background: "#D35400", color: "#FFFFFF", padding: "12px", borderRadius: "10px", fontSize: "0.92rem", fontWeight: 700, marginTop: "4px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <HeartHandshake size={18} /> Confirm Contribution of {formatTaka(donationAmount, false)}
                </button>
              </form>
            </div>

            {/* TOP CONTRIBUTORS LEADERBOARD */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#241A14" }}>
                  Department Top Contributors
                </h3>
                <span style={{ fontSize: "0.75rem", background: "#FFF7E6", color: "#D35400", padding: "3px 10px", borderRadius: "999px", fontWeight: 700, border: "1px solid rgba(211, 84, 0, 0.3)" }}>
                  Dhaka City College CSE
                </span>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { rank: 1, name: "Tanvir Rahman", points: 25, amount: 2500, avatar: "🥇" },
                  { rank: 2, name: "Anika Tabassum", points: 12, amount: 1200, avatar: "🥈" },
                  { rank: 3, name: store.studentProfile.name + " (You)", points: store.donations.points, amount: store.donations.totalDonated, avatar: "🥉" },
                  { rank: 4, name: "Sajid Khan", points: 4, amount: 400, avatar: "4" },
                  { rank: 5, name: "Aria Rahman", points: 2, amount: 200, avatar: "5" },
                ].map((user) => (
                  <div
                    key={user.rank}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 14px",
                      background: user.rank === 3 ? "#FFF7E6" : "#FDF9F3",
                      borderRadius: "10px",
                      border: user.rank === 3 ? "1.5px solid #D35400" : "1px solid rgba(196, 154, 108, 0.2)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "1.1rem" }}>{user.avatar}</span>
                      <div>
                        <h5 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#241A14" }}>{user.name}</h5>
                        <span style={{ fontSize: "0.78rem", color: "#66564A" }}>{formatTaka(user.amount, false)} Total Donated</span>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: "#D35400", fontSize: "0.92rem" }}>{user.points} Impact Pts</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 4. TRANSACTIONS & RECEIPTS TAB */}
      {activeTab === "transactions" && (() => {
        // Filter Transactions
        const filteredTxns = store.transactions.filter((t) => {
          if (txnFilter === "paid") {
            if (t.status !== "Success" || (t.type !== "fee" && t.type !== undefined)) return false;
          } else if (txnFilter === "pending") {
            if (t.status !== "Pending") return false;
          } else if (txnFilter === "failed") {
            if (t.status !== "Failed") return false;
          } else if (txnFilter === "refunded") {
            if (t.status !== "Refunded" && t.type !== "refund") return false;
          } else if (txnFilter === "donation") {
            if (t.type !== "donation") return false;
          } else if (txnFilter === "wallet") {
            if (t.type !== "wallet") return false;
          }

          if (txnSearchQuery.trim()) {
            const q = txnSearchQuery.toLowerCase().trim();
            const matchId = t.id.toLowerCase().includes(q);
            const matchTitle = t.title.toLowerCase().includes(q);
            const matchDate = t.date.toLowerCase().includes(q);
            const matchAmount = t.amount.toString().includes(q) || formatTaka(t.amount, false).toLowerCase().includes(q);
            const matchMethod = t.method.toLowerCase().includes(q);
            const matchReceipt = (t.receiptNumber || "").toLowerCase().includes(q);

            if (!matchId && !matchTitle && !matchDate && !matchAmount && !matchMethod && !matchReceipt) {
              return false;
            }
          }
          return true;
        });

        const totalTxns = store.transactions.length;
        const totalSettled = store.transactions.filter(t => t.status === "Success").reduce((sum, t) => sum + t.amount, 0);
        const totalRefunded = store.transactions.filter(t => t.status === "Refunded" || t.type === "refund").reduce((sum, t) => sum + t.amount, 0);
        const totalPending = store.transactions.filter(t => t.status === "Pending").length;

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* PAGE HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#241A14" }}>
                  Institutional Transaction History & Digital Receipts
                </h1>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                  Real-time ledger of student fee payments, wallet top-ups, refunds, and welfare contributions with cryptographically signed official receipts.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ fontSize: "0.78rem", background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "6px 14px", borderRadius: "999px", fontWeight: 700, color: "#241A14", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={14} style={{ color: "#047857" }} /> Verified Audit Ledger
                </span>
              </div>
            </div>

            {/* METRIC SUMMARY CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "18px" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Total Logged Transactions</span>
                <h3 style={{ margin: "4px 0 0", fontSize: "1.6rem", fontWeight: 800, color: "#241A14" }}>{totalTxns} Record{totalTxns !== 1 ? "s" : ""}</h3>
              </div>

              <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "18px" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Total Paid & Settled</span>
                <h3 style={{ margin: "4px 0 0", fontSize: "1.6rem", fontWeight: 800, color: "#047857", fontFeatureSettings: "'tnum'" }}>{formatTaka(totalSettled, false)}</h3>
              </div>

              <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "18px" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Total Refunded Amount</span>
                <h3 style={{ margin: "4px 0 0", fontSize: "1.6rem", fontWeight: 800, color: "#D35400", fontFeatureSettings: "'tnum'" }}>{formatTaka(totalRefunded, false)}</h3>
              </div>

              <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "18px" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Pending Transactions</span>
                <h3 style={{ margin: "4px 0 0", fontSize: "1.6rem", fontWeight: 800, color: "#9A6600" }}>{totalPending} Item{totalPending !== 1 ? "s" : ""}</h3>
              </div>
            </div>

            {/* FILTER PILLS & MULTI-FIELD SEARCH BAR */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                
                {/* FILTER PILLS */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  {[
                    { id: "all", label: "All Transactions", count: store.transactions.length },
                    { id: "paid", label: "Paid Fees", count: store.transactions.filter(t => t.status === "Success" && (t.type === "fee" || !t.type)).length },
                    { id: "pending", label: "Pending", count: store.transactions.filter(t => t.status === "Pending").length },
                    { id: "failed", label: "Failed", count: store.transactions.filter(t => t.status === "Failed").length },
                    { id: "refunded", label: "Refunded", count: store.transactions.filter(t => t.status === "Refunded" || t.type === "refund").length },
                    { id: "donation", label: "Donation", count: store.transactions.filter(t => t.type === "donation").length },
                    { id: "wallet", label: "Wallet Top-up", count: store.transactions.filter(t => t.type === "wallet").length },
                  ].map((filterTab) => {
                    const isActive = txnFilter === filterTab.id;
                    return (
                      <button
                        key={filterTab.id}
                        type="button"
                        onClick={() => setTxnFilter(filterTab.id as any)}
                        style={{
                          background: isActive ? "#D35400" : "#FDF9F3",
                          color: isActive ? "#FFFFFF" : "#241A14",
                          border: isActive ? "1px solid #D35400" : "1px solid rgba(196, 154, 108, 0.3)",
                          padding: "6px 14px",
                          borderRadius: "999px",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {filterTab.label}
                        <span
                          style={{
                            background: isActive ? "rgba(255, 255, 255, 0.25)" : "rgba(36, 26, 20, 0.08)",
                            padding: "2px 6px",
                            borderRadius: "999px",
                            fontSize: "0.74rem",
                          }}
                        >
                          {filterTab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* MULTI-FIELD SEARCH BAR */}
                <div style={{ position: "relative", minWidth: "260px", flex: "1 1 260px", maxWidth: "380px" }}>
                  <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#8C7A6A" }} />
                  <input
                    type="text"
                    placeholder="Search by ID, fee name, date, or amount..."
                    value={txnSearchQuery}
                    onChange={(e) => setTxnSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px 8px 34px",
                      background: "#FDF9F3",
                      border: "1px solid rgba(196, 154, 108, 0.35)",
                      borderRadius: "10px",
                      color: "#241A14",
                      fontSize: "0.84rem",
                      outline: "none",
                    }}
                  />
                  {txnSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setTxnSearchQuery("")}
                      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8C7A6A", cursor: "pointer" }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* TRANSACTIONS TABLE LISTING */}
            <div className="mobile-transactions-table" style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", overflow: "hidden" }}>
              {filteredTxns.length === 0 ? (
                <div style={{ padding: "48px 20px", textAlign: "center", color: "#66564A" }}>
                  <FileText size={42} style={{ color: "#8C7A6A", marginBottom: "12px" }} />
                  <h4 style={{ margin: "0 0 6px", color: "#241A14", fontSize: "1.1rem" }}>No matching transactions found</h4>
                  <p style={{ margin: 0, fontSize: "0.86rem" }}>Try clearing search criteria or selecting a different filter tab.</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                  <table style={{ width: "100%", minWidth: "750px", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                    <thead>
                      <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                        <th style={{ padding: "14px 18px", fontWeight: 700 }}>Transaction ID</th>
                        <th style={{ padding: "14px 18px", fontWeight: 700 }}>Date & Time</th>
                        <th style={{ padding: "14px 18px", fontWeight: 700 }}>Description / Fee Name</th>
                        <th style={{ padding: "14px 18px", fontWeight: 700 }}>Type</th>
                        <th style={{ padding: "14px 18px", fontWeight: 700 }}>Payment Method</th>
                        <th style={{ padding: "14px 18px", fontWeight: 700 }}>Amount</th>
                        <th style={{ padding: "14px 18px", fontWeight: 700 }}>Status</th>
                        <th style={{ padding: "14px 18px", fontWeight: 700, textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTxns.map((txn) => {
                        const isSuccess = txn.status === "Success";
                        const isPending = txn.status === "Pending";
                        const isFailed = txn.status === "Failed";
                        const isRefunded = txn.status === "Refunded";

                        return (
                          <tr key={txn.id} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.2)" }}>
                            {/* Transaction ID */}
                            <td style={{ padding: "14px 18px", fontWeight: 800, color: "#D35400" }}>
                              {txn.id}
                            </td>

                            {/* Date & Time */}
                            <td style={{ padding: "14px 18px", color: "#66564A", whiteSpace: "nowrap" }}>
                              {txn.date}
                            </td>

                            {/* Description / Fee Name */}
                            <td style={{ padding: "14px 18px", fontWeight: 600, color: "#241A14" }}>
                              {txn.title}
                              {txn.receiptNumber && (
                                <div style={{ fontSize: "0.75rem", color: "#8C7A6A", fontWeight: 500, marginTop: "2px" }}>
                                  Receipt #: {txn.receiptNumber}
                                </div>
                              )}
                            </td>

                            {/* Type Pill */}
                            <td style={{ padding: "14px 18px" }}>
                              <span
                                style={{
                                  background: "#FFF7E6",
                                  border: "1px solid rgba(196, 154, 108, 0.3)",
                                  color: "#241A14",
                                  padding: "3px 10px",
                                  borderRadius: "6px",
                                  fontSize: "0.76rem",
                                  fontWeight: 700,
                                  textTransform: "capitalize",
                                }}
                              >
                                {txn.type === "fee" ? "Fee Payment" : txn.type === "wallet" ? "Wallet Top-up" : txn.type === "refund" ? "Refund" : "Donation"}
                              </span>
                            </td>

                            {/* Payment Method */}
                            <td style={{ padding: "14px 18px", color: "#66564A" }}>
                              {txn.method}
                            </td>

                            {/* Amount */}
                            <td style={{ padding: "14px 18px", fontWeight: 800, color: isRefunded ? "#047857" : "#241A14", fontFeatureSettings: "'tnum'" }}>
                              {formatTaka(txn.amount, false)}
                            </td>

                            {/* Status Badge */}
                            <td style={{ padding: "14px 18px" }}>
                              <StatusBadge
                                status={isSuccess ? "paid" : isPending ? "pending" : isFailed ? "failed" : "approved"}
                                customLabel={isRefunded ? "Refunded" : txn.status}
                              />
                            </td>

                            {/* Actions */}
                            <td style={{ padding: "14px 18px", textAlign: "right" }}>
                              <div style={{ display: "inline-flex", gap: "8px", alignItems: "center", justifyContent: "flex-end" }}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedDetailTxn(txn)}
                                  style={{
                                    background: "#FDF9F3",
                                    color: "#241A14",
                                    border: "1px solid rgba(196, 154, 108, 0.4)",
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <Info size={14} /> Detail
                                </button>

                                <button
                                  type="button"
                                  onClick={() => onOpenReceipt(txn)}
                                  style={{
                                    background: "rgba(16, 185, 129, 0.1)",
                                    color: "#047857",
                                    border: "1px solid rgba(16, 185, 129, 0.3)",
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    fontSize: "0.8rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  Receipt 🧾
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        );
      })()}

      {/* 5. DARK FEATURED SECTION — AI FINANCIAL ASSISTANT TAB (PHASE 8) */}
      {activeTab === "ai" && (() => {
        const unpaidFees = store.fees.filter(f => f.status !== "paid");
        const totalUnpaid = unpaidFees.reduce((sum, f) => sum + f.amount, 0);
        const upcomingFee = unpaidFees[0] || store.fees[0];
        const activeApp = store.partialApplications.find(a => a.studentId === store.studentProfile.studentId);
        const activeEscalations = store.escalations?.filter(e => e.studentId === store.studentProfile.studentId) || [];

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* PAGE HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#241A14", display: "flex", alignItems: "center", gap: "10px" }}>
                    <Sparkles style={{ color: "#D35400" }} /> Neo AI Student Financial Assistant
                  </h1>
                  <span style={{ fontSize: "0.74rem", background: "rgba(16, 185, 129, 0.12)", color: "#047857", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>
                    ● Active Financial Process Copilot
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                  Specialized financial process guide for fees, deadlines, partial payment hardship applications, receipts, and human admin escalations.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="ms-btn-primary"
                  onClick={() => setShowEscalateModal(true)}
                  style={{ background: "#D35400", color: "#FFFFFF", padding: "10px 18px", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <MessageSquare size={16} /> Talk to Admin (Escalate)
                </button>
              </div>
            </div>

            {/* MAIN TWO-COLUMN DASHBOARD GRID (CONTEXT SIDEBAR + CHAT SURFACE) */}
            <div className="ms-assistant-grid">
              
              {/* LEFT COLUMN: CONTEXTUAL FEE INFORMATION SIDEBAR */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                {/* CARD 1: LIVE FINANCIAL CONTEXT */}
                <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 14px rgba(36, 26, 20, 0.03)" }}>
                  <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#D35400", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Info size={14} /> LIVE FINANCIAL DOSSIER
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <span style={{ fontSize: "0.78rem", color: "#8C7A6A", display: "block" }}>Total Outstanding Dues</span>
                      <strong style={{ fontSize: "1.4rem", color: "#241A14", fontWeight: 800, fontFeatureSettings: "'tnum'" }}>
                        {formatTaka(totalUnpaid, false)}
                      </strong>
                    </div>

                    <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "10px", padding: "12px" }}>
                      <span style={{ fontSize: "0.74rem", color: "#8C7A6A", display: "block" }}>Nearest Fee Deadline</span>
                      <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#241A14", marginTop: "2px" }}>
                        {upcomingFee ? upcomingFee.title : "No Pending Fees"}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: upcomingFee?.status === "overdue" ? "#BE123C" : "#D35400", fontWeight: 700, marginTop: "2px" }}>
                        {upcomingFee ? `Due: ${upcomingFee.dueDate} (${formatTaka(upcomingFee.amount, false)})` : "Clear"}
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                      <span style={{ color: "#66564A" }}>Available Wallet:</span>
                      <strong style={{ color: "#047857", fontWeight: 800 }}>{formatTaka(store.balances.walletBalance, false)}</strong>
                    </div>

                    <div style={{ borderTop: "1px solid rgba(196, 154, 108, 0.25)", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem" }}>
                      <span style={{ color: "#66564A" }}>Partial Hardship App:</span>
                      {activeApp ? (
                        <StatusBadge status={activeApp.status.includes("approved") ? "approved" : activeApp.status.includes("rejected") ? "rejected" : "pending"} customLabel={activeApp.status} />
                      ) : (
                        <span style={{ color: "#8C7A6A", fontWeight: 600 }}>Not Applied</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* CARD 2: QUICK ACTION SHORTCUTS */}
                <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "18px" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#241A14", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "10px" }}>
                    Copilot Action Shortcuts
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        const target = unpaidFees[0] || store.fees[0];
                        if (target) setSelectedPartialFee(target);
                      }}
                      style={{ background: "#FDF9F3", color: "#D35400", border: "1px solid rgba(211, 84, 0, 0.3)", padding: "10px 14px", borderRadius: "10px", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      <FileText size={16} /> Apply for Partial Payment 📋
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const target = unpaidFees[0] || store.fees[0];
                        if (target) setSelectedPayFee(target);
                      }}
                      style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "10px 14px", borderRadius: "10px", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      <CreditCard size={16} /> Pay Fee Immediately 💳
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowTopUpModal(true)}
                      style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "10px 14px", borderRadius: "10px", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      <PlusCircle size={16} /> Top Up Digital Wallet ➕
                    </button>
                  </div>
                </div>

                {/* CARD 3: INSTITUTION POLICY NOTICE */}
                <div style={{ background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "14px", padding: "14px 16px", fontSize: "0.8rem", color: "#66564A", lineHeight: 1.5 }}>
                  <strong style={{ color: "#241A14", display: "block", marginBottom: "4px" }}>
                    📌 Official Institution Notice
                  </strong>
                  Tuition deadlines are set by Dhaka City College Controllers. Students with documented financial hardship can request installment splits with guardian NID verification.
                </div>

                {/* CARD 4: ACTIVE HUMAN ESCALATIONS SUMMARY */}
                {activeEscalations.length > 0 && (
                  <div style={{ background: "#FFFFFF", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "14px", padding: "14px", fontSize: "0.82rem" }}>
                    <div style={{ fontWeight: 800, color: "#047857", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <CheckCircle2 size={15} /> Active Admin Support Tickets ({activeEscalations.length})
                    </div>
                    {activeEscalations.map(esc => (
                      <div key={esc.id} style={{ background: "#FDF9F3", padding: "8px 10px", borderRadius: "8px", marginTop: "6px", border: "1px solid rgba(196, 154, 108, 0.2)" }}>
                        <div style={{ fontWeight: 700, color: "#241A14", fontSize: "0.8rem" }}>#{esc.id}: {esc.subject}</div>
                        <div style={{ fontSize: "0.75rem", color: "#66564A", marginTop: "2px", display: "flex", justifyContent: "space-between" }}>
                          <span>Status: <strong>{esc.status}</strong></span>
                          <span>Replies: {esc.messages.length}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN: SOPHISTICATED DARK FEATURED CHAT SURFACE (#241A14) */}
              <div
                id="neo-ai-chat-box"
                className="ms-assistant-chat-box"
                style={{
                  background: "#241A14",
                  border: "1px solid rgba(196, 154, 108, 0.4)",
                  borderRadius: "18px",
                  padding: "20px 24px",
                  boxShadow: "0 12px 30px rgba(36, 26, 20, 0.25)",
                  display: "flex",
                  flexDirection: "column",
                  height: "620px",
                }}
              >
                {/* CHAT CONTAINER HEADER */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(196, 154, 108, 0.25)", paddingBottom: "14px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(211, 84, 0, 0.2)", border: "1px solid #D35400", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF8C42" }}>
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, color: "#FFF7E6", fontSize: "1.05rem", fontWeight: 800 }}>
                        Neo Financial Process Assistant
                      </h3>
                      <span style={{ fontSize: "0.75rem", color: "#8C7A6A" }}>
                        Connected to Dhaka City College Student Financial Ledger
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowEscalateModal(true)}
                    style={{ background: "rgba(211, 84, 0, 0.2)", color: "#FF8C42", border: "1px solid rgba(211, 84, 0, 0.4)", padding: "6px 12px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <MessageSquare size={14} /> Escalate to Admin
                  </button>
                </div>

                {/* MESSAGES SCROLL AREA */}
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px", paddingRight: "8px" }}>
                  {chatMessages.map((msg) => {
                    const isUser = msg.sender === "user";
                    const isAdmin = msg.sender === "admin";
                    const isNotice = msg.isEscalationNotice;

                    return (
                      <div key={msg.id} style={{ alignSelf: isUser ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                        {/* Sender Label */}
                        {!isUser && (
                          <span style={{ fontSize: "0.72rem", color: isAdmin ? "#10B981" : "#FF8C42", fontWeight: 700, marginBottom: "3px", display: "block" }}>
                            {msg.senderName || (isAdmin ? "Admin (Refat Rahman)" : "Neo AI Assistant")}
                          </span>
                        )}

                        {/* Bubble */}
                        <div
                          style={{
                            padding: "14px 18px",
                            borderRadius: isUser ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                            background: isUser ? "#D35400" : isNotice ? "rgba(211, 84, 0, 0.15)" : isAdmin ? "#064E3B" : "#3D2B1F",
                            color: isUser ? "#FFFFFF" : "#FFF7E6",
                            fontSize: "0.92rem",
                            lineHeight: "1.55",
                            border: isNotice ? "1.5px solid #D35400" : isAdmin ? "1.5px solid #10B981" : "1px solid rgba(196, 154, 108, 0.3)",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>

                          {/* Action Buttons inside AI response */}
                          {msg.actions && msg.actions.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(196, 154, 108, 0.2)" }}>
                              {msg.actions.map((act, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => handleChatActionClick(act)}
                                  style={{
                                    background: "#D35400",
                                    color: "#FFFFFF",
                                    border: "none",
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    fontSize: "0.8rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                                  }}
                                >
                                  {act.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <span style={{ fontSize: "0.7rem", color: "#8C7A6A", marginTop: "4px", display: "block", textAlign: isUser ? "right" : "left" }}>
                          {msg.time}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* SUGGESTED QUESTIONS / PROMPT CHIPS */}
                <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid rgba(196, 154, 108, 0.2)" }}>
                  <span style={{ fontSize: "0.72rem", color: "#8C7A6A", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "8px" }}>
                    Suggested Questions (Click to Ask):
                  </span>
                  <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
                    {[
                      "I can't pay my full tuition.",
                      "When is my tuition due?",
                      "What documents do I need?",
                      "Where can I find my receipt?",
                      "How do I top up my wallet?",
                      "Talk to Admin",
                    ].map((promptChip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendChatMessage(undefined, promptChip)}
                        style={{
                          background: "#3D2B1F",
                          color: "#FFF7E6",
                          border: "1px solid rgba(196, 154, 108, 0.35)",
                          padding: "5px 12px",
                          borderRadius: "999px",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {promptChip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CHAT INPUT FORM */}
                <form onSubmit={handleSendChatMessage} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <input
                    type="text"
                    placeholder="Ask Neo AI about fees, deadlines, partial payments, receipts..."
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

            {/* FLOATING MOBILE AI CHAT LAUNCHER BUTTON */}
            <button
              type="button"
              onClick={() => setShowMobileChatModal(true)}
              style={{
                position: "fixed",
                bottom: "24px",
                left: "20px",
                zIndex: 99,
                background: "#D35400",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "999px",
                padding: "12px 18px",
                fontWeight: 800,
                fontSize: "0.85rem",
                boxShadow: "0 6px 20px rgba(211, 84, 0, 0.45)",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
              className="ms-mobile-chat-fab"
            >
              <Sparkles size={18} /> Open AI Chat 💬
            </button>

            {/* MOBILE POP-UP AI CHAT MODAL OVERLAY */}
            {showMobileChatModal && (
              <div className="ms-modal-overlay" style={{ zIndex: 9999 }}>
                <div
                  className="ms-modal"
                  style={{
                    maxWidth: "600px",
                    width: "100%",
                    background: "#241A14",
                    border: "1px solid rgba(196, 154, 108, 0.4)",
                    borderRadius: "20px 20px 0 0",
                    padding: "18px 16px",
                    color: "#FFF7E6",
                    display: "flex",
                    flexDirection: "column",
                    height: "88vh",
                    maxHeight: "720px",
                  }}
                >
                  {/* POPUP MODAL HEADER */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(196, 154, 108, 0.25)", paddingBottom: "12px", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(211, 84, 0, 0.2)", border: "1px solid #D35400", display: "grid", placeItems: "center", color: "#FF8C42" }}>
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, color: "#FFF7E6", fontSize: "0.98rem", fontWeight: 800 }}>
                          Neo Financial Process Assistant
                        </h3>
                        <span style={{ fontSize: "0.72rem", color: "#8C7A6A" }}>Dhaka City College Student Copilot</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowMobileChatModal(false)}
                      style={{ background: "rgba(255, 255, 255, 0.1)", border: "none", color: "#FFF7E6", borderRadius: "50%", width: "32px", height: "32px", display: "grid", placeItems: "center", cursor: "pointer" }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* MESSAGES SCROLL AREA */}
                  <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "4px" }}>
                    {chatMessages.map((msg) => {
                      const isUser = msg.sender === "user";
                      const isAdmin = msg.sender === "admin";
                      const isNotice = msg.isEscalationNotice;

                      return (
                        <div key={msg.id} style={{ alignSelf: isUser ? "flex-end" : "flex-start", maxWidth: "88%" }}>
                          {!isUser && (
                            <span style={{ fontSize: "0.7rem", color: isAdmin ? "#10B981" : "#FF8C42", fontWeight: 700, marginBottom: "2px", display: "block" }}>
                              {msg.senderName || (isAdmin ? "Admin (Refat Rahman)" : "Neo AI Assistant")}
                            </span>
                          )}
                          <div
                            style={{
                              padding: "12px 15px",
                              borderRadius: isUser ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                              background: isUser ? "#D35400" : isNotice ? "rgba(211, 84, 0, 0.15)" : isAdmin ? "#064E3B" : "#3D2B1F",
                              color: isUser ? "#FFFFFF" : "#FFF7E6",
                              fontSize: "0.88rem",
                              lineHeight: "1.5",
                              border: isNotice ? "1.5px solid #D35400" : isAdmin ? "1.5px solid #10B981" : "1px solid rgba(196, 154, 108, 0.3)",
                            }}
                          >
                            <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
                            {msg.actions && msg.actions.length > 0 && (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px", paddingTop: "8px", borderTop: "1px solid rgba(196, 154, 108, 0.2)" }}>
                                {msg.actions.map((act, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                      setShowMobileChatModal(false);
                                      handleChatActionClick(act);
                                    }}
                                    style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "5px 10px", borderRadius: "6px", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer" }}
                                  >
                                    {act.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <span style={{ fontSize: "0.68rem", color: "#8C7A6A", marginTop: "3px", display: "block", textAlign: isUser ? "right" : "left" }}>
                            {msg.time}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* SUGGESTED PROMPT CHIPS */}
                  <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(196, 154, 108, 0.2)" }}>
                    <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
                      {[
                        "I can't pay my full tuition.",
                        "When is my tuition due?",
                        "Where can I find my receipt?",
                        "Talk to Admin",
                      ].map((promptChip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendChatMessage(undefined, promptChip)}
                          style={{ background: "#3D2B1F", color: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.35)", padding: "4px 10px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer" }}
                        >
                          {promptChip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FORM INPUT */}
                  <form onSubmit={handleSendChatMessage} style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <input
                      type="text"
                      placeholder="Ask Neo AI about fees, deadlines..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      style={{ flex: 1, padding: "10px 14px", background: "#3D2B1F", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#FFF7E6", outline: "none", fontSize: "0.88rem" }}
                    />
                    <button type="submit" style={{ background: "#D35400", color: "#FFFFFF", border: "none", borderRadius: "8px", padding: "0 16px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
                      <Send size={15} />
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        );
      })()}

      {/* SUPPORT ESCALATION MODAL (TALK TO ADMIN) */}
      {showEscalateModal && (
        <div className="ms-modal-overlay">
          <div className="ms-modal" style={{ maxWidth: "560px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid rgba(196, 154, 108, 0.3)", paddingBottom: "12px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#241A14", fontSize: "1.25rem", fontWeight: 800 }}>
                  Talk to Admin — Human Support Escalation
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#66564A" }}>
                  Transmits query directly to Dhaka City College Financial Controllers.
                </span>
              </div>
              <button type="button" onClick={() => setShowEscalateModal(false)} style={{ background: "none", border: "none", color: "#66564A", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEscalationSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "6px" }}>
                  Escalation Topic / Subject
                </label>
                <select
                  value={escalateSubject}
                  onChange={(e) => setEscalateSubject(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontSize: "0.9rem" }}
                >
                  <option value="Tuition Hardship & Installment Request">Tuition Hardship & Installment Request</option>
                  <option value="Fee Due Date Extension Request">Fee Due Date Extension Request</option>
                  <option value="Payment Gateway Discrepancy">Payment Gateway Discrepancy</option>
                  <option value="Digital Receipt Verification Inquiry">Digital Receipt Verification Inquiry</option>
                  <option value="Other Financial Process Guidance">Other Financial Process Guidance</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "6px" }}>
                  Describe your query or situation for Admin
                </label>
                <textarea
                  rows={4}
                  value={escalateMessage}
                  onChange={(e) => setEscalateMessage(e.target.value)}
                  placeholder="Explain why you need admin assistance, fee amounts, or custom requests..."
                  style={{ width: "100%", padding: "12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontSize: "0.9rem", lineHeight: 1.5 }}
                />
              </div>

              <div style={{ background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "10px 14px", borderRadius: "10px", fontSize: "0.78rem", color: "#66564A" }}>
                🔒 <strong>Escalation Policy:</strong> Admin replies will be logged directly into your AI Assistant chat thread and sent to your Notifications tray.
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" className="ms-btn-secondary" onClick={() => setShowEscalateModal(false)} style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "10px 18px", borderRadius: "10px", fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" className="ms-btn-primary" style={{ background: "#D35400", color: "#FFFFFF", padding: "10px 20px", borderRadius: "10px", fontWeight: 700 }}>
                  Submit Ticket to Admin 🚀
                </button>
              </div>
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

      {/* FEE DETAIL MODAL */}
      {selectedDetailFee && (
        <div className="ms-modal-overlay">
          <div className="ms-modal" style={{ maxWidth: "580px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", borderBottom: "1px solid rgba(196, 154, 108, 0.3)", paddingBottom: "14px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <h3 style={{ margin: 0, color: "#241A14", fontSize: "1.25rem", fontWeight: 800 }}>
                    {selectedDetailFee.title}
                  </h3>
                  <StatusBadge status={mapFeeStatus(selectedDetailFee.status)} />
                </div>
                <span style={{ fontSize: "0.82rem", color: "#66564A" }}>
                  Category: <strong>{selectedDetailFee.category}</strong> • ID: <code>{selectedDetailFee.id}</code>
                </span>
              </div>
              <button type="button" onClick={() => setSelectedDetailFee(null)} style={{ background: "none", border: "none", color: "#66564A", cursor: "pointer", padding: "4px" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#66564A", lineHeight: 1.5 }}>
                {selectedDetailFee.description}
              </p>

              {/* Financial Breakdown Card */}
              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "16px" }}>
                <h4 style={{ margin: "0 0 10px", fontSize: "0.92rem", fontWeight: 700, color: "#241A14" }}>
                  Financial Specification
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.88rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#66564A" }}>Assigned Original Fee (Admin):</span>
                    <strong style={{ color: "#241A14" }}>{formatTaka(selectedDetailFee.originalAmount, false)}</strong>
                  </div>
                  {selectedDetailFee.approvedPartialAmount && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#047857" }}>
                      <span>Approved Installment 1 Amount:</span>
                      <strong>{formatTaka(selectedDetailFee.approvedPartialAmount, false)}</strong>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(196, 154, 108, 0.3)", paddingTop: "8px", fontWeight: 800 }}>
                    <span style={{ color: "#241A14" }}>Current Payable Balance:</span>
                    <span style={{ color: selectedDetailFee.status === "paid" ? "#047857" : "#D35400", fontSize: "1.1rem" }}>
                      {formatTaka(selectedDetailFee.status === "paid" ? 0 : selectedDetailFee.approvedPartialAmount || selectedDetailFee.amount, false)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Dates */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.85rem" }}>
                <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.25)", padding: "12px", borderRadius: "10px" }}>
                  <span style={{ color: "#8C7A6A", fontSize: "0.78rem", display: "block" }}>Issued Date</span>
                  <strong style={{ color: "#241A14" }}>{selectedDetailFee.issuedDate || "2026-08-15"}</strong>
                </div>
                <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.25)", padding: "12px", borderRadius: "10px" }}>
                  <span style={{ color: "#8C7A6A", fontSize: "0.78rem", display: "block" }}>Deadline / Due Date</span>
                  <strong style={{ color: selectedDetailFee.status === "overdue" ? "#BE123C" : "#241A14" }}>{selectedDetailFee.dueDate}</strong>
                </div>
              </div>

              {/* Administrative Policy Note */}
              <div style={{ background: "rgba(211, 84, 0, 0.08)", border: "1px solid rgba(211, 84, 0, 0.25)", padding: "12px", borderRadius: "10px", fontSize: "0.82rem", color: "#66564A", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <Info size={18} style={{ color: "#D35400", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>Administrative Policy:</strong> Fee amounts and payment deadlines are set by institution financial controllers. Students pay the exact assigned amounts or approved partial installments.
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  className="ms-btn-secondary"
                  onClick={() => setSelectedDetailFee(null)}
                  style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "10px 18px", borderRadius: "10px", fontWeight: 600 }}
                >
                  Close
                </button>

                {selectedDetailFee.status === "paid" ? (
                  <button
                    type="button"
                    className="ms-btn-primary"
                    onClick={() => {
                      const matchingTxn = store.transactions.find((t) => t.feeId === selectedDetailFee.id || t.title === selectedDetailFee.title) || {
                        id: "TXN-" + Math.floor(10000 + Math.random() * 90000),
                        title: selectedDetailFee.title,
                        date: selectedDetailFee.paidDate || "2026-09-12 02:15 PM",
                        amount: selectedDetailFee.originalAmount,
                        type: "fee" as const,
                        status: "Success" as const,
                        method: "bKash Mobile Banking",
                        referenceId: "BK-904821",
                        receiptNumber: "REC-982104",
                      };
                      onOpenReceipt(matchingTxn);
                      setSelectedDetailFee(null);
                    }}
                    style={{ background: "#047857", color: "#FFFFFF", padding: "10px 20px", borderRadius: "10px", fontWeight: 700 }}
                  >
                    View Receipt 🧾
                  </button>
                ) : (
                  <button
                    type="button"
                    className="ms-btn-primary"
                    onClick={() => {
                      const target = selectedDetailFee;
                      setSelectedDetailFee(null);
                      setSelectedPayFee(target);
                    }}
                    style={{ background: "#D35400", color: "#FFFFFF", padding: "10px 20px", borderRadius: "10px", fontWeight: 700 }}
                  >
                    Proceed to Pay {formatTaka(selectedDetailFee.approvedPartialAmount || selectedDetailFee.amount, false)}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* TRANSACTION DETAIL DOSSIER MODAL */}
      {selectedDetailTxn && (
        <div className="ms-modal-overlay">
          <div className="ms-modal" style={{ maxWidth: "600px" }}>
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", borderBottom: "1px solid rgba(196, 154, 108, 0.3)", paddingBottom: "12px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <h3 style={{ margin: 0, color: "#241A14", fontSize: "1.2rem", fontWeight: 800 }}>
                    Transaction #{selectedDetailTxn.id}
                  </h3>
                  <StatusBadge
                    status={selectedDetailTxn.status === "Success" ? "paid" : selectedDetailTxn.status === "Pending" ? "pending" : selectedDetailTxn.status === "Failed" ? "failed" : "approved"}
                    customLabel={selectedDetailTxn.status}
                  />
                </div>
                <p style={{ margin: 0, color: "#66564A", fontSize: "0.82rem" }}>
                  Logged: {selectedDetailTxn.date} • Reference ID: <code>{selectedDetailTxn.referenceId}</code>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDetailTxn(null)}
                style={{ background: "none", border: "none", color: "#66564A", cursor: "pointer", padding: "4px" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* Highlight Amount Banner */}
              <div
                style={{
                  background: "#FFF7E6",
                  border: "1.5px solid rgba(211, 84, 0, 0.3)",
                  borderRadius: "14px",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#D35400", textTransform: "uppercase" }}>
                    TRANSACTION AMOUNT
                  </span>
                  <h2 style={{ margin: "2px 0 0", color: "#241A14", fontSize: "1.8rem", fontWeight: 800, fontFeatureSettings: "'tnum'" }}>
                    {formatTaka(selectedDetailTxn.amount, false)}
                  </h2>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.74rem", color: "#8C7A6A", display: "block" }}>Receipt Designation</span>
                  <strong style={{ color: "#241A14", fontSize: "0.95rem" }}>{selectedDetailTxn.receiptNumber || "REC-982104"}</strong>
                </div>
              </div>

              {/* Student Identity Dossier */}
              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#241A14", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Student & Institution Dossier
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.85rem" }}>
                  <div>
                    <span style={{ color: "#8C7A6A", fontSize: "0.75rem", display: "block" }}>Student Name</span>
                    <strong style={{ color: "#241A14" }}>{store.studentProfile.name}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#8C7A6A", fontSize: "0.75rem", display: "block" }}>Student ID</span>
                    <strong style={{ color: "#241A14" }}>{store.studentProfile.studentId}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#8C7A6A", fontSize: "0.75rem", display: "block" }}>Institution</span>
                    <strong style={{ color: "#241A14" }}>{store.studentProfile.institution}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#8C7A6A", fontSize: "0.75rem", display: "block" }}>Department / Section</span>
                    <strong style={{ color: "#241A14" }}>{store.studentProfile.classSection}</strong>
                  </div>
                </div>
              </div>

              {/* Payment Details Dossier */}
              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#241A14", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Payment Method & Gateway Specification
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.85rem" }}>
                  <div>
                    <span style={{ color: "#8C7A6A", fontSize: "0.75rem", display: "block" }}>Payment Source</span>
                    <strong style={{ color: "#241A14" }}>{selectedDetailTxn.method}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#8C7A6A", fontSize: "0.75rem", display: "block" }}>Gateway Ref ID</span>
                    <strong style={{ color: "#D35400", fontWeight: 700 }}>{selectedDetailTxn.referenceId}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#8C7A6A", fontSize: "0.75rem", display: "block" }}>Fee / Description</span>
                    <strong style={{ color: "#241A14" }}>{selectedDetailTxn.title}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#8C7A6A", fontSize: "0.75rem", display: "block" }}>Fee Type</span>
                    <strong style={{ color: "#241A14", textTransform: "capitalize" }}>{selectedDetailTxn.type}</strong>
                  </div>
                </div>
              </div>

              {/* Security Seal Note */}
              <div style={{ fontSize: "0.78rem", color: "#66564A", background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "10px 14px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldCheck size={16} style={{ color: "#047857" }} />
                <span>
                  This transaction is cryptographically timestamped and verified by <strong>Neo Cash AI Institutional Ledger</strong>.
                </span>
              </div>

              {/* Actions Footer */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedDetailTxn(null)}
                  style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "10px 18px", borderRadius: "10px", fontWeight: 600 }}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="ms-btn-primary"
                  onClick={() => {
                    const txn = selectedDetailTxn;
                    setSelectedDetailTxn(null);
                    onOpenReceipt(txn);
                  }}
                  style={{ background: "#047857", color: "#FFFFFF", padding: "10px 20px", borderRadius: "10px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <FileText size={16} /> View Official Receipt 🧾
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
