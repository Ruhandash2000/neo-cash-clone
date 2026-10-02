/**
 * FloatingAI — Always-on AI financial assistant
 * Positioned bottom-LEFT (avoids overlap with mobile tab bar)
 * Chat-bubble shape with dark teal accent matching background
 */
import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Minimize2, MessageSquare } from "lucide-react";
import { useNeoStore } from "@/lib/neo-cash-store";
import purpleLogo from "@/assets/neo-purple-logo.png";

interface Message {
  role: "user" | "ai";
  text: string;
  ts: number;
}

const AI_RESPONSES: { [key: string]: string } = {
  balance:   "💰 Your Neo Wallet balance shows your current available funds. Top up via bKash, Rocket, or Nagad in the Wallet tab.",
  fee:       "📋 All pending fees are listed under the Fees tab. You can pay in full or apply for partial payment if admin-approved.",
  partial:   "📝 To apply for partial payment, go to Fees → select a fee → tap 'Apply Partial'. Provide a reason and supporting documents. If your financial plan matches 90%+ of the fee, it can be auto-approved.",
  late:      "⚠️ Overdue fees accumulate a 2% penalty per week. Contact your admin if you need an extension.",
  receipt:   "🧾 Tap any transaction in the Transactions tab → 'Download PDF Receipt' to get an official receipt.",
  wallet:    "💳 Neo Wallet lets you store BDT and pay fees instantly. Go to Wallet tab to add payment methods.",
  topup:     "📲 Top up your wallet from the Wallet tab → 'Top Up Wallet' button. Supports bKash, Nagad, Rocket, card.",
  document:  "📄 Upload your ID and signature documents in the AI Verification tab. Our AI will verify them instantly.",
  signature: "✍️ Your digital signature is verified using AI similarity scoring. Upload in the AI tab.",
  contact:   "📞 Contact your institution admin from the Overview tab → 'Escalate to Admin' button.",
  verify:    "🎓 Student verification: go to the Verification tab and search for your university or college in Bangladesh to link your student ID.",
  help:      "🤖 I can help with: balance queries, fee payment, partial payment applications, receipt downloads, document uploads, and wallet top-ups. What do you need?",
  hi:        "👋 Hello! I'm your Neo Cash AI assistant. How can I help you today?",
  hello:     "👋 Hi there! I'm here to help with all your financial queries. Ask me anything!",
  default:   "🤖 I can help with fees, wallet balance, payments, receipts, and documents. Could you rephrase your question?",
};

function getAIReply(q: string): string {
  const low = q.toLowerCase();
  for (const [key, val] of Object.entries(AI_RESPONSES)) {
    if (low.includes(key)) return val;
  }
  if (low.includes("pay"))      return AI_RESPONSES["fee"]      ?? "";
  if (low.includes("money") || low.includes("fund")) return AI_RESPONSES["balance"] ?? "";
  if (low.includes("upload") || low.includes("nid")) return AI_RESPONSES["document"] ?? "";
  if (low.includes("student") || low.includes("university") || low.includes("college")) return AI_RESPONSES["verify"] ?? "";
  return AI_RESPONSES["default"] ?? "";
}

export function FloatingAI() {
  const [store] = useNeoStore();
  const [isOpen, setIsOpen]           = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput]             = useState("");
  const [messages, setMessages]       = useState<Message[]>([
    { role: "ai", text: `👋 Hi ${store.studentProfile.name?.split(" ")[0] ?? "there"}! I'm Neo AI. Ask about fees, payments, or your wallet.`, ts: Date.now() },
  ]);
  const [typing, setTyping]   = useState(false);
  const [pulse, setPulse]     = useState(true);
  const endRef                = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setPulse(false);
  }, [isOpen]);

  const sendMessage = () => {
    const q = input.trim();
    if (!q) return;
    setMessages((prev) => [...prev, { role: "user", text: q, ts: Date.now() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", text: getAIReply(q), ts: Date.now() }]);
      setTyping(false);
    }, 700 + Math.random() * 600);
  };

  // Position: bottom-left on mobile (above bottom nav), bottom-left on desktop
  const orbBottom = "calc(72px + env(safe-area-inset-bottom, 0px))";
  const chatBottom = "calc(72px + 8px + env(safe-area-inset-bottom, 0px))";

  return (
    <>
      {/* FLOATING BUTTON — chat-bubble shape */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={pulse ? "floating-ai-orb neo-ai-pulse" : "floating-ai-orb"}
          aria-label="Open AI Assistant"
          title="Ask Neo AI"
          style={{
            position: "fixed",
            bottom: orbBottom,
            left: "16px",            // ← LEFT side
            right: "auto",
            zIndex: 999,
            width: "52px",
            height: "48px",
            // Chat bubble shape via border-radius
            borderRadius: "16px 16px 16px 4px",
            background: "linear-gradient(135deg, #0a2a3a 0%, #0d3d52 100%)",
            border: "1.5px solid rgba(5, 209, 148, 0.35)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(5, 209, 148, 0.22), 0 0 0 1px rgba(5,209,148,0.08)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.boxShadow = "0 6px 28px rgba(5,209,148,0.38), 0 0 0 1px rgba(5,209,148,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(5,209,148,0.22), 0 0 0 1px rgba(5,209,148,0.08)";
          }}
        >
          <MessageSquare size={20} color="#05D194" />
        </button>
      )}

      {/* CHAT PANEL */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: chatBottom,
            left: "12px",           // ← LEFT side
            right: "auto",
            zIndex: 1001,
            width: "clamp(300px, 90vw, 360px)",
            background: "#0d1b2a",
            borderRadius: "16px 16px 16px 4px",  // chat-bubble shape
            boxShadow: "0 12px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(5,209,148,0.15)",
            border: "1px solid rgba(5,209,148,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            maxHeight: isMinimized ? "56px" : "min(500px, 70vh)",
            transition: "max-height 0.3s ease",
          }}
        >
          {/* HEADER */}
          <div style={{
            background: "linear-gradient(135deg, #0a2a3a 0%, #0d3d52 100%)",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
            borderBottom: "1px solid rgba(5,209,148,0.12)",
          }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "10px",
              background: "rgba(5,209,148,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <img src={purpleLogo} alt="" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#E0F7F3", fontWeight: 700, fontSize: "0.85rem", lineHeight: 1.2 }}>Neo AI Assistant</div>
              <div style={{ color: "#05D194", fontSize: "0.68rem", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#05D194", display: "inline-block" }} />
                Online · Always here
              </div>
            </div>
            <button type="button" onClick={() => setIsMinimized(!isMinimized)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "4px", borderRadius: "6px" }}>
              <Minimize2 size={14} />
            </button>
            <button type="button" onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "4px", borderRadius: "6px" }}>
              <X size={14} />
            </button>
          </div>

          {!isMinimized && (
            <>
              {/* MESSAGES */}
              <div style={{
                flex: 1, overflowY: "auto", padding: "12px",
                display: "flex", flexDirection: "column", gap: "8px",
                background: "#0d1b2a",
              }}>
                {messages.map((msg) => (
                  <div key={msg.ts} style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}>
                    <div style={{
                      maxWidth: "82%",
                      background: msg.role === "user"
                        ? "linear-gradient(135deg, #0a2a3a, #0d4a60)"
                        : "rgba(255,255,255,0.06)",
                      color: msg.role === "user" ? "#E0F7F3" : "#CBD5E1",
                      border: msg.role === "user"
                        ? "1px solid rgba(5,209,148,0.2)"
                        : "1px solid rgba(255,255,255,0.06)",
                      padding: "9px 13px",
                      borderRadius: msg.role === "user"
                        ? "14px 14px 4px 14px"
                        : "14px 14px 14px 4px",
                      fontSize: "0.82rem",
                      lineHeight: 1.5,
                      fontWeight: 400,
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div style={{ display: "flex", gap: "5px", padding: "4px 8px" }}>
                    {[0.1, 0.2, 0.3].map((d) => (
                      <div key={d} style={{
                        width: "6px", height: "6px", borderRadius: "50%",
                        background: "#05D194", opacity: 0.5,
                        animation: `ai-bounce 1.2s ${d}s infinite`,
                      }} />
                    ))}
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* QUICK SUGGESTIONS */}
              <div style={{
                display: "flex", gap: "5px", padding: "8px 10px 0",
                overflowX: "auto", background: "rgba(0,0,0,0.2)", flexShrink: 0,
              }}>
                {["Check my balance", "Pay a fee", "Partial payment", "Verify student ID"].map((s) => (
                  <button
                    key={s} type="button"
                    onClick={() => setInput(s)}
                    style={{
                      flexShrink: 0,
                      background: "rgba(5,209,148,0.08)",
                      border: "1px solid rgba(5,209,148,0.2)",
                      borderRadius: "999px",
                      padding: "3px 9px",
                      fontSize: "0.71rem",
                      color: "#05D194",
                      cursor: "pointer",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(5,209,148,0.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(5,209,148,0.08)")}
                  >{s}</button>
                ))}
              </div>

              {/* INPUT */}
              <div style={{
                display: "flex", gap: "6px", padding: "8px 10px",
                background: "rgba(0,0,0,0.3)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                flexShrink: 0,
              }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask about fees, payments…"
                  style={{
                    flex: 1,
                    border: "1px solid rgba(5,209,148,0.2)",
                    borderRadius: "12px",
                    padding: "8px 11px",
                    fontSize: "0.82rem",
                    outline: "none",
                    background: "rgba(5,209,148,0.05)",
                    color: "#E0F7F3",
                  }}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  style={{
                    background: input.trim() ? "rgba(5,209,148,0.2)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${input.trim() ? "rgba(5,209,148,0.4)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "12px",
                    width: "38px", height: "38px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: input.trim() ? "pointer" : "default",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <Send size={15} color={input.trim() ? "#05D194" : "#4B5563"} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        /* AI orb pulse — teal glow */
        @keyframes neo-ai-pulse-anim {
          0%, 100% { box-shadow: 0 4px 16px rgba(5,209,148,0.22), 0 0 0 1px rgba(5,209,148,0.08); }
          50%       { box-shadow: 0 4px 28px rgba(5,209,148,0.45), 0 0 0 4px rgba(5,209,148,0.12); transform: scale(1.06); }
        }
        .floating-ai-orb.neo-ai-pulse {
          animation: neo-ai-pulse-anim 2.4s ease infinite;
        }
        @keyframes ai-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50%       { transform: translateY(-4px); opacity: 1; }
        }
        /* Thin scrollbar for AI chat */
        .ai-chat-messages::-webkit-scrollbar { width: 3px; }
        .ai-chat-messages::-webkit-scrollbar-track { background: transparent; }
        .ai-chat-messages::-webkit-scrollbar-thumb { background: rgba(5,209,148,0.2); border-radius: 3px; }

        /* On desktop, AI orb above sidebar — no overlap */
        @media (min-width: 768px) {
          .floating-ai-orb {
            bottom: 24px !important;
          }
        }
      `}</style>
    </>
  );
}
