/**
 * FloatingAI — Always-on AI financial assistant bubble
 * Visible across ALL panels. Tap the orb to open.
 */
import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Bot, ChevronDown, Minimize2 } from "lucide-react";
import { useNeoStore } from "@/lib/neo-cash-store";
import purpleLogo from "@/assets/neo-purple-logo.png";

interface Message {
  role: "user" | "ai";
  text: string;
  ts: number;
}

const AI_RESPONSES: { [key: string]: string } = {
  balance:     "💰 Your Neo Wallet balance shows your current available funds. Top up via bKash, Rocket, or Nagad in the Wallet tab.",
  fee:         "📋 All pending fees are listed under the Fees tab. You can pay in full or apply for partial payment if admin-approved.",
  partial:     "📝 To apply for partial payment, go to Fees → select a fee → tap 'Apply Partial'. Provide a reason and supporting documents.",
  late:        "⚠️ Overdue fees accumulate a 2% penalty per week. Contact your admin if you need an extension.",
  receipt:     "🧾 Tap any transaction in the Transactions tab → 'Download PDF Receipt' to get an official receipt.",
  wallet:      "💳 Neo Wallet lets you store BDT and pay fees instantly. Go to Wallet tab to add payment methods.",
  topup:       "📲 Top up your wallet from the Wallet tab → 'Top Up Wallet' button. Supports bKash, Nagad, Rocket, card.",
  document:    "📄 Upload your ID and signature documents in the AI Verification tab. Our AI will verify them instantly.",
  signature:   "✍️ Your digital signature is verified using AI similarity scoring. Upload in the AI tab.",
  contact:     "📞 Contact your institution admin from the Overview tab → 'Escalate to Admin' button.",
  help:        "🤖 I can help with: balance queries, fee payment, partial payment applications, receipt downloads, document uploads, and wallet top-ups. What do you need?",
  hi:          "👋 Hello! I'm your Neo Cash AI assistant. How can I help you today?",
  hello:       "👋 Hi there! I'm here to help with all your financial queries. Ask me anything!",
  default:     "🤖 I can help with fees, wallet balance, payments, receipts, and documents. Could you rephrase your question?",
};

function getAIReply(q: string): string {
  const low = q.toLowerCase();
  for (const [key, val] of Object.entries(AI_RESPONSES)) {
    if (low.includes(key)) return val;
  }
  if (low.includes("pay")) return AI_RESPONSES["fee"] ?? "";
  if (low.includes("money") || low.includes("fund")) return AI_RESPONSES["balance"] ?? "";
  if (low.includes("upload") || low.includes("nid")) return AI_RESPONSES["document"] ?? "";
  return AI_RESPONSES["default"] ?? "";
}

export function FloatingAI() {
  const [store] = useNeoStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: `👋 Hi ${store.studentProfile.name?.split(" ")[0] ?? "there"}! I'm your Neo Cash AI. Ask me about fees, payments, wallet, or documents.`, ts: Date.now() },
  ]);
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Pulse animation stops after first open
  useEffect(() => {
    if (isOpen) setPulse(false);
  }, [isOpen]);

  const sendMessage = () => {
    const q = input.trim();
    if (!q) return;
    const userMsg: Message = { role: "user", text: q, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const aiMsg: Message = { role: "ai", text: getAIReply(q), ts: Date.now() };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 700 + Math.random() * 600);
  };

  return (
    <>
      {/* FLOATING ORB BUTTON */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={pulse ? "floating-ai-orb pulse" : "floating-ai-orb"}
          aria-label="Open AI Assistant"
          title="Ask Neo AI"
          style={{
            position: "fixed",
            bottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
            right: "16px",
            zIndex: 1000,
            width: "54px",
            height: "54px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7C3AED, #D35400)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(124, 58, 237, 0.5)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
        >
          <Sparkles size={22} color="#FFF" />
        </button>
      )}

      {/* CHAT PANEL */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "calc(72px + 8px + env(safe-area-inset-bottom, 0px))",
            right: "12px",
            zIndex: 1001,
            width: "clamp(300px, 90vw, 380px)",
            background: "#FFFFFF",
            borderRadius: "20px",
            boxShadow: "0 12px 48px rgba(0,0,0,0.18), 0 0 0 1px rgba(124,58,237,0.12)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            maxHeight: isMinimized ? "56px" : "min(520px, 70vh)",
            transition: "max-height 0.3s ease",
          }}
        >
          {/* HEADER */}
          <div style={{
            background: "linear-gradient(135deg, #7C3AED 0%, #D35400 100%)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img src={purpleLogo} alt="" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#FFF", fontWeight: 700, fontSize: "0.88rem", lineHeight: 1.2 }}>Neo AI Assistant</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.72rem" }}>Always here to help ✨</div>
            </div>
            <button type="button" onClick={() => setIsMinimized(!isMinimized)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", cursor: "pointer", padding: "4px" }}>
              {isMinimized ? <Bot size={16} /> : <Minimize2 size={16} />}
            </button>
            <button type="button" onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", cursor: "pointer", padding: "4px" }}>
              <X size={16} />
            </button>
          </div>

          {!isMinimized && (
            <>
              {/* MESSAGES */}
              <div style={{
                flex: 1, overflowY: "auto", padding: "12px",
                display: "flex", flexDirection: "column", gap: "8px",
                background: "#F9F7FF",
              }}>
                {messages.map((msg) => (
                  <div key={msg.ts} style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}>
                    <div style={{
                      maxWidth: "82%",
                      background: msg.role === "user"
                        ? "linear-gradient(135deg, #7C3AED, #9D4EDD)"
                        : "#FFFFFF",
                      color: msg.role === "user" ? "#FFF" : "#241A14",
                      padding: "9px 13px",
                      borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      fontSize: "0.84rem",
                      lineHeight: 1.5,
                      boxShadow: msg.role === "ai" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
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
                        width: "7px", height: "7px", borderRadius: "50%",
                        background: "#7C3AED", opacity: 0.5,
                        animation: `bounce 1.2s ${d}s infinite`,
                      }} />
                    ))}
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* QUICK SUGGESTIONS */}
              <div style={{
                display: "flex", gap: "6px", padding: "8px 12px 0",
                overflowX: "auto", background: "#FFF", flexShrink: 0,
              }}>
                {["Check my balance", "How to pay fee?", "Get receipt"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setInput(s); }}
                    style={{
                      flexShrink: 0,
                      background: "rgba(124,58,237,0.08)",
                      border: "1px solid rgba(124,58,237,0.2)",
                      borderRadius: "999px",
                      padding: "4px 10px",
                      fontSize: "0.75rem",
                      color: "#7C3AED",
                      cursor: "pointer",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >{s}</button>
                ))}
              </div>

              {/* INPUT */}
              <div style={{
                display: "flex", gap: "8px", padding: "10px 12px",
                background: "#FFF", borderTop: "1px solid rgba(124,58,237,0.1)",
                flexShrink: 0,
              }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask anything about your fees…"
                  style={{
                    flex: 1, border: "1px solid rgba(124,58,237,0.25)",
                    borderRadius: "12px", padding: "9px 12px",
                    fontSize: "0.84rem", outline: "none",
                    background: "#F9F7FF", color: "#241A14",
                  }}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  style={{
                    background: input.trim() ? "linear-gradient(135deg, #7C3AED, #D35400)" : "#E5E5E5",
                    border: "none", borderRadius: "12px",
                    width: "40px", height: "40px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: input.trim() ? "pointer" : "default",
                    transition: "background 0.2s",
                  }}
                >
                  <Send size={16} color={input.trim() ? "#FFF" : "#999"} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
