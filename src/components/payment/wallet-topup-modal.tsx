/**
 * Neo Cash AI — Wallet Top-Up Modal (Phase 3)
 *
 * Lets a student add funds to their Neo Cash wallet via SSLCommerz sandbox.
 * Presets: ৳200, ৳500, ৳1000, ৳2000 + custom amount.
 * On submit: calls initiatePayment → redirects to SSLCommerz gateway.
 */

import { useState } from "react";
import {
  Wallet, X, ChevronRight, ShieldCheck, Loader2,
  AlertCircle, Info, CreditCard, Smartphone,
} from "lucide-react";
import { initiatePayment } from "@/lib/sslcommerz.functions";

// ─── Quick amount presets ─────────────────────────────────────────────────────
const PRESETS = [200, 500, 1000, 2000, 5000];

interface Props {
  institutionId: string;
  currentBalance: number;
  onClose: () => void;
}

export function WalletTopUpModal({ institutionId, currentBalance, onClose }: Props) {
  const [selected, setSelected] = useState<number | null>(500);
  const [custom, setCustom]     = useState("");
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState("");

  const amount = custom ? parseFloat(custom) : (selected ?? 0);
  const isValid = amount >= 10 && amount <= 50000 && !isNaN(amount);

  const handleTopUp = async () => {
    if (!isValid) {
      setError("Enter a valid amount between ৳10 and ৳50,000.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await initiatePayment({
        data: {
          purpose:       "wallet_topup",
          amount,
          institutionId,
        },
      });
      // Redirect browser to SSLCommerz payment page
      window.location.href = result.gatewayUrl;
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Failed to connect to payment gateway. Try again.");
    }
  };

  const amountFmt = (n: number) => `৳${n.toLocaleString("en-BD")}`;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(33, 23, 16, 0.75)", backdropFilter: "blur(6px)",
        display: "grid", placeItems: "center", padding: "20px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#FFFFFF", borderRadius: "20px", width: "100%", maxWidth: "440px",
        boxShadow: "0 24px 70px rgba(36, 26, 20, 0.28)",
        border: "1px solid rgba(196, 154, 108, 0.35)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 24px 20px",
          borderBottom: "1px solid rgba(196, 154, 108, 0.2)",
          position: "sticky", top: 0, background: "#FFFFFF", zIndex: 1,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "42px", height: "42px", borderRadius: "12px",
              background: "rgba(211, 84, 0, 0.1)", display: "grid", placeItems: "center",
            }}>
              <Wallet size={20} style={{ color: "#D35400" }} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                Add Money
              </h2>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#8C7A6A" }}>
                Current balance: <strong style={{ color: "#D35400" }}>{amountFmt(currentBalance)}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none", border: "none", color: "#8C7A6A",
              cursor: "pointer", minWidth: "44px", minHeight: "44px", display: "grid", placeItems: "center",
              borderRadius: "8px",
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          {/* Amount presets */}
          <p style={{ margin: "0 0 12px", fontSize: "0.82rem", fontWeight: 700, color: "#241A14" }}>
            Select amount
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => { setSelected(p); setCustom(""); setError(""); }}
                style={{
                  padding: "12px 8px",
                  borderRadius: "12px",
                  border: selected === p && !custom
                    ? "2px solid #D35400"
                    : "1.5px solid rgba(196, 154, 108, 0.4)",
                  background: selected === p && !custom ? "rgba(211, 84, 0, 0.06)" : "#FFF7E6",
                  color: selected === p && !custom ? "#D35400" : "#241A14",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {amountFmt(p)}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#241A14", marginBottom: "6px" }}>
              Or enter custom amount (BDT)
            </label>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                fontSize: "1rem", fontWeight: 700, color: "#8C7A6A",
              }}>
                ৳
              </span>
              <input
                type="number"
                min={10}
                max={50000}
                value={custom}
                onChange={(e) => { setCustom(e.target.value); setSelected(null); setError(""); }}
                placeholder="e.g. 1500"
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "12px 14px 12px 34px",
                  border: `1.5px solid ${custom && !isNaN(parseFloat(custom)) && parseFloat(custom) > 0 ? "#D35400" : "rgba(196, 154, 108, 0.4)"}`,
                  borderRadius: "12px", fontSize: "1rem", color: "#241A14",
                  background: "#FFF7E6", outline: "none",
                }}
              />
            </div>
          </div>

          {/* Summary box */}
          {isValid && (
            <div style={{
              background: "rgba(211, 84, 0, 0.05)", border: "1px solid rgba(211, 84, 0, 0.2)",
              borderRadius: "12px", padding: "14px 18px", marginBottom: "18px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.83rem", color: "#66564A" }}>Top-up amount</span>
                <span style={{ fontWeight: 700, color: "#241A14" }}>{amountFmt(amount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.83rem", color: "#66564A" }}>Processing fee</span>
                <span style={{ fontWeight: 700, color: "#047857" }}>Free</span>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between",
                paddingTop: "8px", borderTop: "1px dashed rgba(196, 154, 108, 0.4)",
              }}>
                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#241A14" }}>New balance</span>
                <span style={{ fontWeight: 800, color: "#D35400", fontSize: "1rem" }}>
                  {amountFmt(currentBalance + amount)}
                </span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              display: "flex", gap: "10px", alignItems: "flex-start",
              background: "rgba(185, 28, 28, 0.06)", border: "1px solid rgba(185, 28, 28, 0.25)",
              borderRadius: "10px", padding: "12px 14px", marginBottom: "16px",
            }}>
              <AlertCircle size={16} style={{ color: "#B91C1C", flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#B91C1C" }}>{error}</p>
            </div>
          )}

          {/* Payment methods badge row */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px", flexWrap: "wrap" }}>
            <Info size={13} style={{ color: "#8C7A6A" }} />
            <span style={{ fontSize: "0.75rem", color: "#8C7A6A" }}>Pay via:</span>
            {["bKash", "Nagad", "Rocket", "Visa", "Mastercard", "DBBL Nexus"].map((m) => (
              <span key={m} style={{
                padding: "3px 10px", background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.35)",
                borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700, color: "#66564A",
              }}>
                {m}
              </span>
            ))}
          </div>

          {/* Security note */}
          <div style={{
            display: "flex", gap: "8px", alignItems: "flex-start",
            marginBottom: "20px", fontSize: "0.78rem", color: "#8C7A6A", lineHeight: 1.5,
          }}>
            <ShieldCheck size={14} style={{ color: "#047857", flexShrink: 0, marginTop: "1px" }} />
            <span>
              Powered by <strong style={{ color: "#241A14" }}>SSLCommerz Sandbox</strong>.
              Payments are secured with 256-bit SSL encryption. No card details stored by Neo Cash.
            </span>
          </div>

          {/* CTA */}
          <button
            type="button"
            disabled={!isValid || busy}
            onClick={() => void handleTopUp()}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "13px",
              background: !isValid || busy ? "rgba(211, 84, 0, 0.4)" : "#D35400",
              color: "#FFF", border: "none", borderRadius: "12px",
              fontSize: "0.95rem", fontWeight: 800, cursor: !isValid || busy ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {busy ? (
              <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Connecting to gateway…</>
            ) : (
              <>{isValid ? `Pay ${amountFmt(amount)}` : "Select an amount"} <ChevronRight size={16} /></>
            )}
          </button>

          <p style={{ textAlign: "center", margin: "12px 0 0", fontSize: "0.75rem", color: "#8C7A6A" }}>
            You will be redirected to the SSLCommerz secure payment page.
          </p>
        </div>
      </div>
    </div>
  );
}
