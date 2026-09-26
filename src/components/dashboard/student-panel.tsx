/**
 * Student Panel Component — Premium Personal Fintech + Student Financial Assistant
 * 
 * Features:
 * 1. Financial Overview (Available balance, wallet balance, total due, monthly spending)
 * 2. Fees & Dues (Pay Full Amount with animated receipt & Partial Payment application flow)
 * 3. AI Signature Verification simulation (96% similarity match score)
 * 4. Social Impact & Donation Center (Rule: ৳100 = 1 Point, live rank cards & leaderboards)
 * 5. Transactions & Printable Receipts
 * 6. AI Student Assistant Chatbot
 */

import { useState } from "react";
import { useNeoStore, Fee, Transaction } from "@/lib/neo-cash-store";
import {
  Wallet, CreditCard, DollarSign, ArrowUpRight, ArrowDownLeft, ShieldCheck,
  FileText, Sparkles, AlertCircle, HeartHandshake, Award, TrendingUp, Download,
  CheckCircle2, Clock, Send, MessageSquare, PlusCircle, Eye
} from "lucide-react";

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
  const [guardianNidUploaded, setGuardianNidUploaded] = useState(true);
  const [signatureUploaded, setSignatureUploaded] = useState(true);
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
    { sender: "ai", text: "Hello Shelly! I am your Neo AI Student Assistant. You can ask me about your fee deadlines, transaction receipts, or partial payment applications.", time: "10:00 AM" },
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
      setDonationFeedback(`Thank you! Donated ৳${amount}. Earned ${res.points} Donation Points! 🎉`);
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
      alert(`Top-up successful! Added ৳${topUpAmount} to your Neo Wallet.`);
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
        reply += `You have 3 active fees. Your next upcoming deadline is Semester Tuition Fee (৳6,000) due Oct 15, 2026.`;
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
    <div>
      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Top Banner Verification Status */}
          <div style={{ background: "linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(79, 70, 229, 0.2) 100%)", border: "1px solid var(--ms-border)", borderRadius: "18px", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img src={store.studentProfile.avatar} alt="Avatar" style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(167, 136, 250, 0.2)" }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h2 style={{ margin: 0, fontSize: "1.3rem", color: "#FFF" }}>Welcome back, {store.studentProfile.name}</h2>
                  <span className="ms-badge ms-badge--paid">
                    <ShieldCheck size={14} /> Verified Student
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--ms-text-muted)" }}>
                  {store.studentProfile.institution} • {store.studentProfile.classSection} ({store.studentProfile.studentId})
                </p>
              </div>
            </div>
            <button type="button" className="ms-btn-secondary" onClick={() => setShowTopUpModal(true)}>
              <PlusCircle size={16} /> Top Up Wallet
            </button>
          </div>

          {/* Balance Metrics Grid */}
          <div className="ms-grid-3">
            <div className="ms-card" style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #0D182A 100%)" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Available Balance</span>
              <h3 style={{ fontSize: "1.8rem", color: "#FFF", margin: "8px 0 4px" }}>৳{store.balances.availableBalance.toLocaleString()}</h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#34D399" }}>+ ৳4,250 Neo Digital Wallet</p>
            </div>
            <div className="ms-card">
              <span style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Dues Pending</span>
              <h3 style={{ fontSize: "1.8rem", color: "#F87171", margin: "8px 0 4px" }}>৳{store.balances.totalDue.toLocaleString()}</h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--ms-text-muted)" }}>Next Due: Oct 15, 2026</p>
            </div>
            <div className="ms-card">
              <span style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Donation Points</span>
              <h3 style={{ fontSize: "1.8rem", color: "var(--ms-accent)", margin: "8px 0 4px" }}>{store.donations.points} Pts</h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--ms-lavender)" }}>Rank #3 in CSE Dept (৳{store.donations.totalDonated} Donated)</p>
            </div>
          </div>

          {/* Fees & Recent Activity Split View */}
          <div className="ms-grid-2">
            {/* Fees Overview Card */}
            <div className="ms-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#FFF" }}>Upcoming Fees & Dues</h3>
                <button type="button" style={{ background: "none", border: "none", color: "var(--ms-accent)", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }} onClick={() => setActiveTab("fees")}>
                  View All Fees →
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {store.fees.slice(0, 3).map((fee) => (
                  <div key={fee.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "rgba(30, 58, 138, 0.2)", borderRadius: "12px", border: "1px solid var(--ms-border)" }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "0.92rem", color: "#FFF" }}>{fee.title}</h4>
                      <span style={{ fontSize: "0.78rem", color: "var(--ms-text-muted)" }}>Due: {fee.dueDate}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: "0 0 4px", fontWeight: "700", color: "#FFF", fontSize: "0.95rem" }}>
                        ৳{(fee.approvedPartialAmount || fee.amount).toLocaleString()}
                      </p>
                      <span className={`ms-badge ms-badge--${fee.status}`}>{fee.status.replace("_", " ")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions Card */}
            <div className="ms-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#FFF" }}>Recent Transactions</h3>
                <button type="button" style={{ background: "none", border: "none", color: "var(--ms-accent)", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }} onClick={() => setActiveTab("transactions")}>
                  History →
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {store.transactions.slice(0, 3).map((txn) => (
                  <div key={txn.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "rgba(30, 58, 138, 0.2)", borderRadius: "12px", border: "1px solid var(--ms-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: txn.type === "donation" ? "rgba(167, 136, 250, 0.2)" : "rgba(16, 185, 129, 0.2)", display: "grid", placeItems: "center" }}>
                        {txn.type === "donation" ? <HeartHandshake size={18} style={{ color: "var(--ms-accent)" }} /> : <FileText size={18} style={{ color: "#34D399" }} />}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: "0.88rem", color: "#FFF" }}>{txn.title}</h4>
                        <span style={{ fontSize: "0.75rem", color: "var(--ms-text-muted)" }}>{txn.date} • {txn.method}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: 0, fontWeight: "700", color: "#FFF", fontSize: "0.95rem" }}>৳{txn.amount.toLocaleString()}</p>
                      <button type="button" onClick={() => onOpenReceipt(txn)} style={{ background: "none", border: "none", color: "var(--ms-accent)", fontSize: "0.75rem", cursor: "pointer", padding: 0 }}>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem", margin: 0, color: "#FFF" }}>Assigned Fees & Dues</h2>
              <p style={{ margin: "4px 0 0", color: "var(--ms-text-muted)", fontSize: "0.88rem" }}>
                Pay full fees instantly or submit a partial payment request for administrative sign-off.
              </p>
            </div>
            <span style={{ fontSize: "0.9rem", background: "rgba(239, 68, 68, 0.15)", color: "#F87171", padding: "6px 14px", borderRadius: "999px", border: "1px solid rgba(239, 68, 68, 0.3)", fontWeight: 700 }}>
              Total Dues: ৳{store.balances.totalDue.toLocaleString()}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {store.fees.map((fee) => (
              <div key={fee.id} className="ms-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <div style={{ flex: "1 1 300px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#FFF" }}>{fee.title}</h3>
                    <span className={`ms-badge ms-badge--${fee.status}`}>{fee.status.replace("_", " ")}</span>
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: "0.85rem", color: "var(--ms-text-muted)" }}>{fee.description}</p>
                  <div style={{ display: "flex", gap: "16px", fontSize: "0.8rem", color: "var(--ms-text-dim)" }}>
                    <span>Category: <strong style={{ color: "var(--ms-lavender)" }}>{fee.category}</strong></span>
                    <span>Deadline: <strong style={{ color: fee.status === "overdue" ? "#F87171" : "#FFF" }}>{fee.dueDate}</strong></span>
                  </div>
                </div>

                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                  <div>
                    {fee.approvedPartialAmount ? (
                      <div>
                        <span style={{ textDecoration: "line-through", color: "var(--ms-text-dim)", fontSize: "0.85rem", marginRight: "6px" }}>৳{fee.originalAmount.toLocaleString()}</span>
                        <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "#34D399" }}>৳{fee.approvedPartialAmount.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "#FFF" }}>৳{fee.amount.toLocaleString()}</span>
                    )}
                  </div>

                  {fee.status === "paid" ? (
                    <span style={{ color: "#34D399", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                      <CheckCircle2 size={16} /> Paid
                    </span>
                  ) : (
                    <div style={{ display: "flex", gap: "8px" }}>
                      {fee.status !== "pending_partial" && (
                        <button type="button" className="ms-btn-secondary" style={{ padding: "8px 14px", fontSize: "0.82rem" }} onClick={() => setSelectedPartialFee(fee)}>
                          Apply Partial Payment
                        </button>
                      )}
                      <button type="button" className="ms-btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem" }} onClick={() => setSelectedPayFee(fee)}>
                        Pay {fee.approvedPartialAmount ? "Approved ৳" + fee.approvedPartialAmount : "Full Amount"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Partial Payment Applications Track Record */}
          {store.partialApplications.length > 0 && (
            <div className="ms-card" style={{ marginTop: "16px" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: "1.1rem", color: "#FFF" }}>Your Partial Payment Applications</h3>
              {store.partialApplications.map((app) => (
                <div key={app.id} style={{ padding: "14px", background: "rgba(30, 58, 138, 0.2)", borderRadius: "12px", border: "1px solid var(--ms-border)", marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontWeight: "700", color: "#FFF" }}>{app.id} — {app.feeTitle}</span>
                      <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "var(--ms-text-muted)" }}>
                        Requested: ৳{app.requestedAmount.toLocaleString()} (Original: ৳{app.originalAmount.toLocaleString()}) • Submitted {app.submittedAt}
                      </p>
                    </div>
                    <span className={`ms-badge ms-badge--${app.status.startsWith("approved") ? "paid" : app.status.startsWith("rejected") ? "overdue" : "pending_partial"}`}>
                      {app.status.replace("_", " ")}
                    </span>
                  </div>
                  <div style={{ marginTop: "8px", fontSize: "0.78rem", background: "rgba(167, 136, 250, 0.1)", padding: "6px 10px", borderRadius: "8px", color: "var(--ms-lavender)", display: "flex", gap: "10px" }}>
                    <span>Reason: "{app.reason}"</span>
                    <span>AI Signature Similarity: <strong>96% High Match</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. DONATION & SOCIAL IMPACT TAB */}
      {activeTab === "donation" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", margin: 0, color: "#FFF" }}>Student Welfare & Social Impact</h2>
            <p style={{ margin: "4px 0 0", color: "var(--ms-text-muted)", fontSize: "0.88rem" }}>
              Support underprivileged students. Rule: <strong>৳100 Donated = 1 Donation Point</strong>.
            </p>
          </div>

          {/* Ranks Cards */}
          <div className="ms-grid-3">
            <div className="ms-card" style={{ background: "linear-gradient(135deg, rgba(79,70,229,0.3) 0%, rgba(30,58,138,0.3) 100%)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--ms-text-muted)", textTransform: "uppercase" }}>Class Rank</span>
              <h3 style={{ fontSize: "2rem", color: "#FFF", margin: "6px 0 2px" }}>#{store.donations.rankClass}</h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--ms-accent)" }}>CSE 3rd Semester (Sec A)</p>
            </div>
            <div className="ms-card">
              <span style={{ fontSize: "0.75rem", color: "var(--ms-text-muted)", textTransform: "uppercase" }}>Department Rank</span>
              <h3 style={{ fontSize: "2rem", color: "#FFF", margin: "6px 0 2px" }}>#{store.donations.rankDept}</h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--ms-lavender)" }}>Computer Science & Eng</p>
            </div>
            <div className="ms-card">
              <span style={{ fontSize: "0.75rem", color: "var(--ms-text-muted)", textTransform: "uppercase" }}>National Rank</span>
              <h3 style={{ fontSize: "2rem", color: "#FFF", margin: "6px 0 2px" }}>#{store.donations.rankNational}</h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#34D399" }}>Bangladesh Student Leaderboard</p>
            </div>
          </div>

          {/* Donation Form & Points Progress */}
          <div className="ms-grid-2">
            <div className="ms-card">
              <h3 style={{ margin: "0 0 14px", fontSize: "1.1rem", color: "#FFF" }}>Make a Welfare Contribution</h3>
              {donationFeedback && (
                <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "10px 14px", borderRadius: "10px", color: "#34D399", fontSize: "0.85rem", marginBottom: "14px" }}>
                  {donationFeedback}
                </div>
              )}
              <form onSubmit={handleDonationSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", display: "block", marginBottom: "6px" }}>Donation Amount (৳)</label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 14px", background: "rgba(30, 58, 138, 0.3)", border: "1px solid var(--ms-border)", borderRadius: "10px", color: "#FFF", outline: "none", fontSize: "1.1rem", fontWeight: "700" }}
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--ms-lavender)", marginTop: "4px", display: "block" }}>
                    Will earn: <strong>{Math.floor(donationAmount / 100)} Points</strong>
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", display: "block", marginBottom: "6px" }}>Payment Method</label>
                  <select
                    value={donationMethod}
                    onChange={(e) => setDonationMethod(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", background: "#132238", border: "1px solid var(--ms-border)", borderRadius: "10px", color: "#FFF", outline: "none" }}
                  >
                    <option value="bKash Mobile Banking">bKash Mobile Banking</option>
                    <option value="City Bank Visa Debit">City Bank Visa Debit</option>
                    <option value="Neo Wallet Balance">Neo Digital Wallet (৳{store.balances.walletBalance})</option>
                  </select>
                </div>

                <button type="submit" className="ms-btn-primary">
                  <HeartHandshake size={18} /> Confirm Donation of ৳{donationAmount}
                </button>
              </form>
            </div>

            {/* Department Leaderboard Table */}
            <div className="ms-card">
              <h3 style={{ margin: "0 0 14px", fontSize: "1.1rem", color: "#FFF" }}>Department Top Donors</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { rank: 1, name: "Tanvir Rahman", points: 25, amount: 2500, avatar: "🥇" },
                  { rank: 2, name: "Anika Tabassum", points: 12, amount: 1200, avatar: "🥈" },
                  { rank: 3, name: store.studentProfile.name + " (You)", points: store.donations.points, amount: store.donations.totalDonated, avatar: "🥉" },
                  { rank: 4, name: "Sajid Khan", points: 4, amount: 400, avatar: "4" },
                ].map((user) => (
                  <div key={user.rank} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: user.rank === 3 ? "rgba(79, 70, 229, 0.25)" : "rgba(30, 58, 138, 0.2)", borderRadius: "10px", border: user.rank === 3 ? "1px solid var(--ms-accent)" : "1px solid var(--ms-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "1.2rem", fontWeight: "700" }}>{user.avatar}</span>
                      <div>
                        <h5 style={{ margin: 0, fontSize: "0.88rem", color: "#FFF" }}>{user.name}</h5>
                        <span style={{ fontSize: "0.75rem", color: "var(--ms-text-muted)" }}>৳{user.amount} Donated</span>
                      </div>
                    </div>
                    <span style={{ fontWeight: "700", color: "var(--ms-accent)", fontSize: "0.9rem" }}>{user.points} Pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TRANSACTIONS & RECEIPTS TAB */}
      {activeTab === "transactions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", margin: 0, color: "#FFF" }}>Transaction History & Digital Receipts</h2>
            <p style={{ margin: "4px 0 0", color: "var(--ms-text-muted)", fontSize: "0.88rem" }}>
              View verified payment logs and download official institutional receipts.
            </p>
          </div>

          <div className="ms-card" style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "rgba(30, 58, 138, 0.3)", textAlign: "left", color: "var(--ms-text-muted)" }}>
                  <th style={{ padding: "14px 18px" }}>Transaction ID</th>
                  <th style={{ padding: "14px 18px" }}>Description</th>
                  <th style={{ padding: "14px 18px" }}>Date & Time</th>
                  <th style={{ padding: "14px 18px" }}>Method</th>
                  <th style={{ padding: "14px 18px" }}>Amount</th>
                  <th style={{ padding: "14px 18px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {store.transactions.map((txn) => (
                  <tr key={txn.id} style={{ borderBottom: "1px solid rgba(30, 58, 138, 0.3)" }}>
                    <td style={{ padding: "14px 18px", fontWeight: "700", color: "var(--ms-accent)" }}>{txn.id}</td>
                    <td style={{ padding: "14px 18px", color: "#FFF" }}>{txn.title}</td>
                    <td style={{ padding: "14px 18px", color: "var(--ms-text-muted)" }}>{txn.date}</td>
                    <td style={{ padding: "14px 18px", color: "var(--ms-lavender)" }}>{txn.method}</td>
                    <td style={{ padding: "14px 18px", fontWeight: "700", color: "#FFF" }}>৳{txn.amount.toLocaleString()}</td>
                    <td style={{ padding: "14px 18px" }}>
                      <button type="button" className="ms-btn-secondary" style={{ padding: "4px 10px", fontSize: "0.78rem" }} onClick={() => onOpenReceipt(txn)}>
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

      {/* 5. AI ASSISTANT TAB */}
      {activeTab === "ai" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", height: "calc(100vh - 180px)" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", margin: 0, color: "#FFF", display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles style={{ color: "var(--ms-accent)" }} /> Neo AI Student Financial Assistant
            </h2>
            <p style={{ margin: "4px 0 0", color: "var(--ms-text-muted)", fontSize: "0.88rem" }}>
              Ask questions about deadlines, partial payments, receipts, or institutional fees.
            </p>
          </div>

          <div className="ms-card" style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px" }}>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px", paddingRight: "8px" }}>
              {chatMessages.map((msg, index) => (
                <div key={index} style={{ alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: "16px",
                      background: msg.sender === "user" ? "var(--ms-primary)" : "rgba(30, 58, 138, 0.4)",
                      color: "#FFF",
                      fontSize: "0.9rem",
                      lineHeight: "1.5",
                      border: msg.sender === "ai" ? "1px solid var(--ms-border)" : "none",
                    }}
                  >
                    {msg.text}
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "var(--ms-text-dim)", marginTop: "4px", display: "block", textAlign: msg.sender === "user" ? "right" : "left" }}>
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChatMessage} style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <input
                type="text"
                placeholder="Ask Neo AI about your fees, partial payments, receipts..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{ flex: 1, padding: "12px 16px", background: "rgba(30, 58, 138, 0.3)", border: "1px solid var(--ms-border)", borderRadius: "12px", color: "#FFF", outline: "none" }}
              />
              <button type="submit" className="ms-btn-primary">
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
            <h3 style={{ margin: "0 0 8px", color: "#FFF" }}>Confirm Fee Payment</h3>
            <p style={{ margin: "0 0 16px", color: "var(--ms-text-muted)", fontSize: "0.85rem" }}>
              {selectedPayFee.title}
            </p>

            <form onSubmit={handlePaySubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "rgba(30, 58, 138, 0.25)", padding: "16px", borderRadius: "12px", border: "1px solid var(--ms-border)" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--ms-text-muted)" }}>Total Amount Payable</span>
                <h2 style={{ margin: "4px 0 0", color: "#FFF", fontSize: "1.8rem" }}>
                  ৳{(selectedPayFee.approvedPartialAmount || selectedPayFee.amount).toLocaleString()}
                </h2>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", display: "block", marginBottom: "6px" }}>Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  style={{ width: "100%", padding: "12px", background: "#132238", border: "1px solid var(--ms-border)", borderRadius: "10px", color: "#FFF", outline: "none" }}
                >
                  <option value="bKash Mobile Banking">bKash Mobile Banking</option>
                  <option value="Dutch-Bangla Rocket">Dutch-Bangla Rocket</option>
                  <option value="City Bank Visa Debit">City Bank Visa Debit</option>
                  <option value="Mastercard Credit">Mastercard Credit</option>
                  <option value="Neo Digital Wallet">Neo Digital Wallet (৳{store.balances.walletBalance})</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button type="button" className="ms-btn-secondary" onClick={() => setSelectedPayFee(null)}>Cancel</button>
                <button type="submit" className="ms-btn-primary" disabled={isProcessingPay}>
                  {isProcessingPay ? "Processing Payment..." : "Confirm & Pay ৳" + (selectedPayFee.approvedPartialAmount || selectedPayFee.amount)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PARTIAL PAYMENT APPLICATION MODAL WITH AI SIGNATURE MATCH */}
      {selectedPartialFee && (
        <div className="ms-modal-overlay">
          <div className="ms-modal" style={{ maxWidth: "620px" }}>
            <h3 style={{ margin: "0 0 6px", color: "#FFF" }}>Apply for Partial Payment</h3>
            <p style={{ margin: "0 0 16px", color: "var(--ms-text-muted)", fontSize: "0.85rem" }}>
              {selectedPartialFee.title} (Original Fee: ৳{selectedPartialFee.amount.toLocaleString()})
            </p>

            <form onSubmit={handlePartialSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", display: "block", marginBottom: "4px" }}>Requested Partial Amount (৳)</label>
                <input
                  type="number"
                  max={selectedPartialFee.amount - 100}
                  value={partialRequestedAmount}
                  onChange={(e) => setPartialRequestedAmount(Number(e.target.value))}
                  style={{ width: "100%", padding: "10px 14px", background: "rgba(30, 58, 138, 0.3)", border: "1px solid var(--ms-border)", borderRadius: "10px", color: "#FFF", outline: "none", fontWeight: "700" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", display: "block", marginBottom: "4px" }}>Reason for Partial Request</label>
                <textarea
                  rows={2}
                  value={partialReason}
                  onChange={(e) => setPartialReason(e.target.value)}
                  placeholder="Explain your temporary hardship or financial reason..."
                  style={{ width: "100%", padding: "10px 14px", background: "rgba(30, 58, 138, 0.3)", border: "1px solid var(--ms-border)", borderRadius: "10px", color: "#FFF", outline: "none", fontSize: "0.9rem" }}
                />
              </div>

              {/* AI Signature Matcher Tool */}
              <div style={{ background: "rgba(167, 136, 250, 0.08)", border: "1px solid rgba(167, 136, 250, 0.3)", borderRadius: "14px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--ms-lavender)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Sparkles size={16} /> AI Signature Verification Engine
                  </span>
                  <button type="button" className="ms-btn-secondary" style={{ padding: "4px 10px", fontSize: "0.75rem" }} onClick={startAiSignatureScan} disabled={isAiScanning}>
                    {isAiScanning ? "Scanning..." : "Run AI Signature Match"}
                  </button>
                </div>

                {isAiScanning ? (
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--ms-accent)" }}>Comparing Guardian NID Signature vs Application Signature...</p>
                ) : aiScanResult ? (
                  <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "10px", borderRadius: "8px", color: "#34D399", fontSize: "0.82rem", display: "flex", justifyContent: "space-between" }}>
                    <span>Result: <strong>{aiScanResult.status}</strong></span>
                    <span>Score: <strong>{aiScanResult.score}% Similarity</strong></span>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--ms-text-muted)" }}>
                    Click "Run AI Signature Match" to test automated signature authenticity validation.
                  </p>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" className="ms-btn-secondary" onClick={() => setSelectedPartialFee(null)}>Cancel</button>
                <button type="submit" className="ms-btn-primary">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT SUCCESS MODAL */}
      {paySuccessTxn && (
        <div className="ms-modal-overlay">
          <div className="ms-modal" style={{ textAlign: "center" }}>
            <CheckCircle2 size={54} style={{ color: "#34D399", margin: "0 auto 12px" }} />
            <h3 style={{ margin: "0 0 6px", color: "#FFF", fontSize: "1.4rem" }}>Payment Successful!</h3>
            <p style={{ margin: "0 0 16px", color: "var(--ms-text-muted)", fontSize: "0.88rem" }}>
              Paid ৳{paySuccessTxn.amount.toLocaleString()} for {paySuccessTxn.title}.
            </p>

            <div style={{ background: "rgba(30, 58, 138, 0.3)", padding: "14px", borderRadius: "12px", border: "1px solid var(--ms-border)", textAlign: "left", marginBottom: "20px", fontSize: "0.82rem" }}>
              <p style={{ margin: "0 0 4px", color: "var(--ms-text-muted)" }}>Receipt #: <strong style={{ color: "#FFF" }}>{paySuccessTxn.receiptNumber}</strong></p>
              <p style={{ margin: "0 0 4px", color: "var(--ms-text-muted)" }}>Reference: <strong style={{ color: "#FFF" }}>{paySuccessTxn.referenceId}</strong></p>
              <p style={{ margin: 0, color: "var(--ms-text-muted)" }}>Method: <strong style={{ color: "#FFF" }}>{paySuccessTxn.method}</strong></p>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button type="button" className="ms-btn-secondary" onClick={() => { onOpenReceipt(paySuccessTxn); setPaySuccessTxn(null); }}>
                View Digital Receipt 🧾
              </button>
              <button type="button" className="ms-btn-primary" onClick={() => setPaySuccessTxn(null)}>
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
            <h3 style={{ margin: "0 0 12px", color: "#FFF" }}>Top Up Neo Digital Wallet</h3>
            <form onSubmit={handleTopUpSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", display: "block", marginBottom: "4px" }}>Amount (৳)</label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  style={{ width: "100%", padding: "10px 14px", background: "rgba(30, 58, 138, 0.3)", border: "1px solid var(--ms-border)", borderRadius: "10px", color: "#FFF", outline: "none", fontWeight: "700", fontSize: "1.1rem" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" className="ms-btn-secondary" onClick={() => setShowTopUpModal(false)}>Cancel</button>
                <button type="submit" className="ms-btn-primary">Confirm Top-Up of ৳{topUpAmount}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
