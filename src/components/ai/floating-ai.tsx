/**
 * FloatingAI — Global AI Financial Assistant
 *
 * Design:
 *   • Burnt orange (var(--theme-color-900)) color scheme — matching the app brand
 *   • Positioned BOTTOM-RIGHT (desktop & mobile)
 *   • Chat-bubble shape: border-radius top-left + bottom corners = round, bottom-right = sharp
 *   • Carries ALL AI features from the dashboard:
 *       - Live store data (balance, fees, transactions)
 *       - Smart contextual responses with action buttons
 *       - Quick suggestion chips
 *       - Partial payment, fee payment, wallet top-up, escalation triggers
 *       - Typing indicator + smooth scroll
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Minimize2, ChevronDown } from "lucide-react";
import { useNeoStore, Fee } from "@/lib/neo-cash-store";
import { formatTaka } from "@/components/design-system/tokens";
import purpleLogo from "@/assets/neo-purple-logo.png";
import chatBoxIcon from "@/assets/chatboxicon.png";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ActionBtn {
  label: string;
  actionType: "apply_partial" | "pay_fee" | "view_receipts" | "topup_wallet" | "escalate_admin" | "view_fees";
  feeId?: string;
}
interface Msg {
  id: string;
  role: "user" | "ai";
  text: string;
  actions?: ActionBtn[];
  isEscalationNotice?: boolean;
  ts: number;
}

// ─── External action bus ──────────────────────────────────────────────────────
// Components that want to trigger dashboard actions subscribe to this
type ExternalAction = {
  type: "apply_partial" | "pay_fee" | "topup_wallet" | "escalate_admin" | "view_fees" | "view_receipts";
  feeId?: string;
};
type ActionListener = (action: ExternalAction) => void;
const _listeners = new Set<ActionListener>();
export const AIBus = {
  emit: (a: ExternalAction) => _listeners.forEach((l) => l(a)),
  subscribe: (l: ActionListener) => { _listeners.add(l); return () => _listeners.delete(l); },
};

// ─── Smart AI Brain ───────────────────────────────────────────────────────────
function buildReply(
  query: string,
  store: ReturnType<typeof useNeoStore>[0]
): { text: string; actions: ActionBtn[] } {
  const q = query.toLowerCase();
  const unpaid = store.fees?.filter((f: Fee) => f.status !== "paid") ?? [];
  const primaryFee = unpaid[0] ?? store.fees?.[0];
  const latestTxn = store.transactions?.[0];
  const walletBal = store.balances?.walletBalance ?? 0;
  const totalDue  = store.balances?.totalDue ?? 0;
  const name = store.studentProfile?.name?.split(" ")[0] ?? "there";

  if (q.match(/hi|hello|hey|salaam|asa/)) {
    return {
      text: `👋 Hello ${name}! I'm your Neo AI financial assistant. I can help with fees, partial payments, wallet balance, receipts, and escalations. What do you need today?`,
      actions: [
        { label: "📋 Check my fees", actionType: "view_fees" },
        { label: "💰 My wallet balance", actionType: "topup_wallet" },
      ],
    };
  }

  if (q.match(/partial|can'?t pay|cannot pay|hardship|installment|split|কিস্তি/)) {
    return {
      text: `📝 **Partial Payment** lets you split your fees into installments. Here's how it works:\n\n1. Select an unpaid fee\n2. Enter the amount you can pay now\n3. Write a financial plan\n4. Our AI scores it — **90%+ = auto-approved instantly!**\n\nYou currently have **${unpaid.length}** unpaid fee(s) totaling **${formatTaka(totalDue, false)}**.`,
      actions: [
        { label: "📋 Apply Partial Payment", actionType: "apply_partial", ...(primaryFee?.id !== undefined ? { feeId: primaryFee?.id } : {}) },
        { label: "👤 Talk to Admin", actionType: "escalate_admin" },
      ],
    };
  }

  if (q.match(/due|deadline|when.*pay|pay.*when|overdue|late|penalty/)) {
    if (primaryFee) {
      return {
        text: `⏰ Your next due: **${primaryFee.title}** — **${formatTaka(primaryFee.amount, false)}** due on **${primaryFee.dueDate}**.\n\nYou have **${unpaid.length}** pending fee(s) totalling **${formatTaka(totalDue, false)}**. Late fees attract a 2% penalty per week after the deadline.`,
        actions: [
          { label: "💳 Pay Now", actionType: "pay_fee", feeId: primaryFee.id },
          { label: "📋 Apply Partial", actionType: "apply_partial", feeId: primaryFee.id },
        ],
      };
    }
    return { text: "✅ Great news! All your fees are paid. No upcoming deadlines.", actions: [] };
  }

  if (q.match(/fee|dues|tuition|semester|course fee/)) {
    const feeList = unpaid.slice(0, 3).map((f: Fee) => `• ${f.title}: ${formatTaka(f.amount, false)} (due ${f.dueDate})`).join("\n");
    return {
      text: unpaid.length > 0
        ? `📋 You have **${unpaid.length}** unpaid fee(s):\n\n${feeList}\n\nTotal outstanding: **${formatTaka(totalDue, false)}**`
        : "✅ All fees paid! No outstanding dues.",
      actions: unpaid.length > 0 ? [
        { label: "💳 Pay Fee", actionType: "pay_fee", ...(primaryFee?.id !== undefined ? { feeId: primaryFee?.id } : {}) },
        { label: "📋 Apply Partial", actionType: "apply_partial", ...(primaryFee?.id !== undefined ? { feeId: primaryFee?.id } : {}) },
      ] : [],
    };
  }

  if (q.match(/wallet|balance|money|fund|bkash|nagad|rocket|topup|top.?up|add.*fund/)) {
    return {
      text: `💰 Your **Neo Wallet balance** is **${formatTaka(walletBal, false)}**.\n\nYou can top up via bKash, Nagad, Rocket, or Debit/Credit card. Wallet funds can be used to pay fees instantly without going through the SSLCommerz gateway.`,
      actions: [
        { label: "➕ Top Up Wallet", actionType: "topup_wallet" },
        { label: "💳 Pay Fee with Wallet", actionType: "pay_fee", ...(primaryFee?.id !== undefined ? { feeId: primaryFee?.id } : {}) },
      ],
    };
  }

  if (q.match(/receipt|paid.*proof|transaction|download|pdf|history/)) {
    return {
      text: `🧾 Your latest transaction: **${latestTxn?.title ?? "Tuition Fee"}** — Receipt **#${latestTxn?.receiptNumber ?? "REC-982104"}**.\n\nAll receipts are cryptographically signed and stored in the institutional ledger. You can download PDF receipts from the Transactions section.`,
      actions: [
        { label: "🧾 View Receipts", actionType: "view_receipts" },
      ],
    };
  }

  if (q.match(/document|nid|signature|guardian|id.*card|upload|verify|proof/)) {
    return {
      text: `📄 For a **Partial Payment** application, you'll need:\n\n1. Guardian National ID (NID/Passport photo)\n2. Guardian digital signature (AI vector-matched)\n3. Financial hardship statement\n\nOur AI verifies these instantly using signature similarity scoring.`,
      actions: [
        { label: "📋 Open Application Form", actionType: "apply_partial" },
      ],
    };
  }

  if (q.match(/admin|escalat|support|help|complaint|human|contact|talk|problem/)) {
    return {
      text: `🆘 I can escalate your request directly to the **Financial Admin**. They'll review your student profile and respond in your notification inbox.\n\nAlternatively, I can help you:\n• Apply for partial payment\n• Check fee deadlines\n• Download receipts`,
      actions: [
        { label: "👤 Contact Admin", actionType: "escalate_admin" },
        { label: "📋 Apply Partial Payment", actionType: "apply_partial" },
      ],
    };
  }

  if (q.match(/notice|policy|rule|penalty|regulation|guideline/)) {
    return {
      text: `📢 **Institutional Policy Notice:**\n\n• Late fee penalty: **2% per week** after due date\n• Partial payment requests must be submitted **before** the due date to freeze penalties\n• All partial applications require guardian ID and signature verification\n• Auto-approval threshold: **90%** AI plan score`,
      actions: [
        { label: "📋 Apply Before Deadline", actionType: "apply_partial" },
      ],
    };
  }

  if (q.match(/scholarship|burs|discount|waiver|exemption/)) {
    return {
      text: `🎓 **Scholarship & Fee Waiver** information:\n\nFor institutional scholarships, bursaries, or fee waivers, you'll need to contact the Financial Admin directly. Our partial payment system can help bridge the gap while your application is being processed.`,
      actions: [
        { label: "👤 Contact Admin", actionType: "escalate_admin" },
      ],
    };
  }

  // Default contextual fallback
  return {
    text: `🤖 I can help you with:\n\n• **Fees & deadlines** — check what's due\n• **Partial payments** — split fees into installments\n• **Wallet** — check balance or top up\n• **Receipts** — download payment proofs\n• **Admin escalation** — get human support\n\nYou currently owe **${formatTaka(totalDue, false)}** and have **${formatTaka(walletBal, false)}** in your wallet. What would you like to do?`,
    actions: [
      { label: "📋 View Fees", actionType: "view_fees" },
      { label: "➕ Top Up Wallet", actionType: "topup_wallet" },
      { label: "👤 Contact Admin", actionType: "escalate_admin" },
    ],
  };
}

// ─── Quick chip suggestions ───────────────────────────────────────────────────
const QUICK_CHIPS = [
  "Check my fees",
  "Can't pay full tuition",
  "My wallet balance",
  "Download receipt",
  "Talk to admin",
  "Fee deadline",
];

// ─── Component ────────────────────────────────────────────────────────────────
export function FloatingAI() {
  const [store] = useNeoStore();
  const [isOpen, setIsOpen]         = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput]           = useState("");
  const [typing, setTyping]         = useState(false);
  const [pulse, setPulse]           = useState(true);
  const [unread, setUnread]         = useState(0);
  const [messages, setMessages]     = useState<Msg[]>([]);
  const endRef    = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Init greeting once store is loaded
  useEffect(() => {
    const name = store.studentProfile?.name?.split(" ")[0] ?? "there";
    setMessages([{
      id: "init",
      role: "ai",
      text: `👋 Hi ${name}! I'm Neo AI — your financial assistant. I can help with fees, partial payments, wallet balance, receipts, and admin escalations.`,
      actions: [
        { label: "📋 View my fees", actionType: "view_fees" },
        { label: "💰 My wallet", actionType: "topup_wallet" },
      ],
      ts: Date.now(),
    }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.studentProfile?.name]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);
  useEffect(() => { if (isOpen) { setPulse(false); setUnread(0); inputRef.current?.focus(); } }, [isOpen]);

  const send = useCallback((q?: string) => {
    const text = (q ?? input).trim();
    if (!text) return;
    setInput("");

    setMessages(prev => [...prev, { id: `u-${Date.now()}`, role: "user", text, ts: Date.now() }]);
    setTyping(true);

    setTimeout(() => {
      const reply = buildReply(text, store);
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: "ai", ts: Date.now(), ...reply }]);
      setTyping(false);
      if (!isOpen) setUnread(u => u + 1);
    }, 600 + Math.random() * 500);
  }, [input, store, isOpen]);

  const handleAction = (action: ActionBtn) => {
    const act: ExternalAction = { type: action.actionType };
    if (action.feeId !== undefined) act.feeId = action.feeId;
    AIBus.emit(act);
    const labels: Record<string, string> = {
      apply_partial:  "Opening Partial Payment form…",
      pay_fee:        "Opening payment screen…",
      topup_wallet:   "Opening Wallet Top-Up…",
      escalate_admin: "Opening Admin Escalation…",
      view_receipts:  "Navigating to Transactions…",
      view_fees:      "Navigating to Fees & Dues…",
    };
    setMessages(prev => [...prev, {
      id: `sys-${Date.now()}`, role: "ai", ts: Date.now(),
      text: `✅ ${labels[action.actionType] ?? "Done!"}`,
      actions: [],
    }]);
  };

  // Theme color constants
  const O = "var(--theme-color-900)";
  const OLight = "var(--theme-transparent)";
  const OBorder = "var(--theme-glow)";

  return (
    <>
      {/* ── FLOATING BUTTON ─────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open Neo AI Assistant"
        title="Ask Neo AI"
        style={{
          position: "fixed",
          bottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
          right: "16px",
          left: "auto",
          zIndex: 999,
          width: "56px",
          height: "56px",
          background: "transparent",
          border: "none",
          cursor: isOpen ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "none",
          
          // Smooth bidirectional transform out of the way when open
          opacity: isOpen ? 0 : 1,
          transformOrigin: "bottom right",
          transform: isOpen ? "scale(0) translateY(20px)" : "scale(1) translateY(0)",
          pointerEvents: isOpen ? "none" : "auto",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          
          animation: pulse && !isOpen ? "neo-ai-orb-pulse 2.4s ease infinite" : "none",
        }}
        onMouseEnter={(e) => {
          if (isOpen) return;
          e.currentTarget.style.transform = "scale(1.08) translateY(0)";
        }}
        onMouseLeave={(e) => {
          if (isOpen) return;
          e.currentTarget.style.transform = "scale(1) translateY(0)";
        }}
      >
        <img src={chatBoxIcon} alt="AI" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
        {/* Unread badge */}
        {!isOpen && unread > 0 && (
          <div style={{
            position: "absolute", top: "-4px", right: "-4px",
            background: "#EF4444", color: "#FFF",
            fontSize: "0.6rem", fontWeight: 800,
            minWidth: "17px", height: "17px", borderRadius: "999px",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 3px", border: "2px solid #FFF",
          }}>{unread > 9 ? "9+" : unread}</div>
        )}
      </button>

      {/* ── CHAT PANEL ──────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: "calc(72px + 8px + env(safe-area-inset-bottom, 0px))",
          right: "16px", // Align right with the button
          left: "auto",
          zIndex: 1001,
          width: "clamp(320px, 95vw, 420px)",
          borderRadius: "16px 16px 4px 16px",   // chat-bubble: sharp bottom-right
          boxShadow: "0 16px 64px rgba(0,0,0,0.45), 0 0 0 1px var(--theme-transparent)",
          border: `1px solid ${OBorder}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "var(--theme-color-50)",
          
          // Animate in from the bottom right corner (where the button was)
          maxHeight: isMinimized ? "56px" : "min(580px, 80vh)",
          transformOrigin: "bottom right",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1) translateY(0)" : "scale(0.85) translateY(30px)",
          pointerEvents: isOpen ? "auto" : "none",
          visibility: isOpen ? "visible" : "hidden",
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1), max-height 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
          {/* HEADER */}
          <div style={{
            background: `linear-gradient(135deg, var(--theme-color-500) 0%, var(--theme-color-900) 100%)`,
            padding: "11px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
            cursor: isMinimized ? "pointer" : "default",
          }} onClick={() => isMinimized && setIsMinimized(false)}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "10px",
              background: "rgba(255,255,255,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <img src={purpleLogo} alt="" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#FFF", fontWeight: 800, fontSize: "0.88rem", lineHeight: 1.2 }}>Neo AI Assistant</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.68rem", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FFF", display: "inline-block", opacity: 0.9 }} />
                Online · Always available
              </div>
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#FFF", cursor: "pointer", padding: "5px", borderRadius: "6px", display: "flex" }}>
              <Minimize2 size={13} />
            </button>
            <button type="button" onClick={() => setIsOpen(false)}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#FFF", cursor: "pointer", padding: "5px", borderRadius: "6px", display: "flex" }}>
              <X size={13} />
            </button>
          </div>

          {!isMinimized && (
            <>
              {/* MESSAGES */}
              <div className="neo-ai-scroll" style={{
                flex: 1, overflowY: "auto", padding: "12px 10px",
                display: "flex", flexDirection: "column", gap: "10px",
                background: "var(--theme-color-50)",
              }}>
                {messages.map((msg) => (
                  <div key={msg.id} style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                    gap: "4px",
                  }}>
                    {/* Bubble */}
                    <div style={{
                      maxWidth: "85%",
                      background: msg.role === "user"
                        ? `linear-gradient(135deg, var(--theme-color-500), var(--theme-color-900))`
                        : "var(--theme-color-50)",
                      color: msg.role === "user" ? "#FFF" : "var(--ms-text)",
                      border: msg.role === "user"
                        ? `1px solid var(--theme-glow)`
                        : `1px solid var(--theme-transparent)`,
                      padding: "9px 13px",
                      borderRadius: msg.role === "user"
                        ? "14px 14px 4px 14px"
                        : "14px 14px 14px 4px",
                      fontSize: "0.82rem",
                      lineHeight: 1.55,
                      whiteSpace: "pre-wrap",
                    }}>
                      {msg.isEscalationNotice && (
                        <div style={{ fontSize: "0.7rem", color: "rgba(255,165,0,0.9)", fontWeight: 700, marginBottom: "3px" }}>
                          📨 ESCALATION NOTICE
                        </div>
                      )}
                      {msg.text}
                    </div>

                    {/* Action buttons */}
                    {(msg.actions?.length ?? 0) > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", maxWidth: "90%" }}>
                        {msg.actions!.map((action, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleAction(action)}
                            style={{
                              background: OLight,
                              border: `1px solid ${OBorder}`,
                              borderRadius: "8px",
                              padding: "5px 10px",
                              fontSize: "0.74rem",
                              color: "var(--theme-color-900)",
                              cursor: "pointer",
                              fontWeight: 700,
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--theme-glow)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = OLight)}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing dots */}
                {typing && (
                  <div style={{ display: "flex", gap: "5px", padding: "4px 8px", alignItems: "center" }}>
                    {[0.1, 0.2, 0.3].map((d) => (
                      <div key={d} style={{
                        width: "7px", height: "7px", borderRadius: "50%",
                        background: O, opacity: 0.6,
                        animation: `neo-ai-bounce 1.2s ${d}s infinite`,
                      }} />
                    ))}
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* QUICK CHIPS */}
              <div className="neo-ai-chips-scroll" style={{
                display: "flex", gap: "6px", padding: "10px 12px 12px",
                overflowX: "auto", flexShrink: 0,
                background: "var(--theme-color-50)",
                borderTop: "1px solid var(--theme-transparent)",
              }}>
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip} type="button"
                    onClick={() => send(chip)}
                    style={{
                      flexShrink: 0,
                      background: OLight,
                      border: `1px solid ${OBorder}`,
                      borderRadius: "999px",
                      padding: "3px 9px",
                      fontSize: "0.71rem",
                      color: "var(--theme-color-900)",
                      cursor: "pointer",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--theme-glow)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = OLight)}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* INPUT */}
              <div style={{
                display: "flex", gap: "8px", padding: "12px",
                background: "var(--theme-color-50)",
                borderTop: `1px solid var(--theme-transparent)`,
                flexShrink: 0,
              }}>
                <input
                  ref={inputRef}
                  type="text"
                  className="neo-ai-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask about fees, payments, receipts…"
                  style={{
                    flex: 1,
                    border: `1px solid ${OBorder}`,
                    borderRadius: "12px",
                    padding: "10px 14px",
                    fontSize: "0.86rem",
                    outline: "none",
                    background: "var(--theme-transparent)",
                    color: "var(--ms-text)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => send()}
                  disabled={!input.trim()}
                  style={{
                    background: input.trim() ? `linear-gradient(135deg, var(--theme-color-500), var(--theme-color-900))` : "var(--theme-transparent)",
                    border: `1px solid ${input.trim() ? OBorder : "rgba(255,255,255,0.08)"}`,
                    borderRadius: "12px",
                    width: "38px", height: "38px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: input.trim() ? "pointer" : "default",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <Send size={15} color={input.trim() ? "#FFF" : "#6B7280"} />
                </button>
              </div>
            </>
          )}
        </div>

      <style>{`
        @keyframes neo-ai-orb-pulse {
          0%, 100% { box-shadow: 0 4px 16px var(--theme-transparent), 0 0 0 1px var(--theme-transparent); }
          50%       { box-shadow: 0 4px 28px var(--theme-glow), 0 0 0 5px var(--theme-transparent); transform: scale(1.06); }
        }
        @keyframes neo-ai-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50%       { transform: translateY(-4px); opacity: 1; }
        }
        .neo-ai-scroll::-webkit-scrollbar { width: 3px; }
        .neo-ai-scroll::-webkit-scrollbar-track { background: transparent; }
        .neo-ai-scroll::-webkit-scrollbar-thumb { background: var(--theme-glow); border-radius: 3px; }
        
        .neo-ai-chips-scroll { 
          scrollbar-width: thin; 
          scrollbar-color: var(--theme-glow) transparent; 
        }
        .neo-ai-chips-scroll::-webkit-scrollbar { height: 4px; }
        .neo-ai-chips-scroll::-webkit-scrollbar-track { background: transparent; }
        .neo-ai-chips-scroll::-webkit-scrollbar-thumb { background: var(--theme-glow); border-radius: 4px; }
        
        .neo-ai-input:focus {
          outline: none !important;
          box-shadow: 0 0 0 2px var(--theme-glow) !important;
          border-color: var(--theme-color-900) !important;
        }

        @media (min-width: 768px) {
          /* On desktop, lift above the "fixed footer" area */
          .floating-ai-btn { bottom: 24px !important; }
        }
      `}</style>
    </>
  );
}

