/**
 * Neo Cash AI — Fee Payment Modal (Phase 3)
 *
 * Lets a student pay a specific fee via SSLCommerz sandbox.
 * Supports full payment and partial payment (if admin-approved).
 * Shows fee details, due date, and penalty info before redirecting to gateway.
 */

import { useState } from "react";
import {
  Receipt, X, ChevronRight, ShieldCheck, Loader2,
  AlertCircle, CalendarDays, CheckCircle2, Clock,
} from "lucide-react";
import { initiatePayment } from "@/lib/sslcommerz.functions";
import { useNeoStore } from "@/lib/neo-cash-store";

interface Fee {
  id: string;
  title: string;
  amount: number;
  due_date?: string;
  partial_allowed?: boolean;
  approved_partial_amt?: number;
  status: string;
  category?: string;
}

interface Props {
  fee: Fee;
  institutionId: string;
  walletBalance: number;
  onClose: () => void;
}

export function FeePaymentModal({ fee, institutionId, walletBalance, onClose }: Props) {
  const [, actions] = useNeoStore();
  const isPartialAllowed = fee.partial_allowed && !!fee.approved_partial_amt;
  const [payMode, setPayMode] = useState<"full" | "partial">(
    isPartialAllowed ? "partial" : "full"
  );
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState("");

  const payAmount = payMode === "partial" && isPartialAllowed
    ? fee.approved_partial_amt!
    : fee.amount;

  const isOverdue = fee.due_date ? new Date(fee.due_date) < new Date() : false;
  const daysLeft  = fee.due_date
    ? Math.ceil((new Date(fee.due_date).getTime() - Date.now()) / 86_400_000)
    : null;

  const amountFmt = (n: number) => `৳${n.toLocaleString("en-BD")}`;

  const handlePayWithWallet = () => {
    setBusy(true);
    setError("");
    const res = actions.payFee(fee.id, "Neo Cash Wallet", payAmount);
    setBusy(false);
    if (res.ok) {
      onClose();
    } else {
      setError(res.error || "Wallet payment failed.");
    }
  };

  const handlePay = async () => {
    setBusy(true);
    setError("");
    try {
      const result = await initiatePayment({
        data: {
          purpose:       "fee_payment",
          amount:        payAmount,
          institutionId,
          feeId:         fee.id,
          feeTitle:      fee.title,
        },
      });
      window.location.href = result.gatewayUrl;
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Gateway connection failed. Please try again.");
    }
  };

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
        background: "#FFFFFF", borderRadius: "20px", width: "100%", maxWidth: "460px",
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
              <Receipt size={20} style={{ color: "#D35400" }} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#241A14" }}>
                Pay Fee
              </h2>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#8C7A6A", maxWidth: "220px" }}>
                {fee.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none", border: "none", color: "#8C7A6A", cursor: "pointer",
              minWidth: "44px", minHeight: "44px", display: "grid", placeItems: "center",
              borderRadius: "8px",
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          {/* Fee details card */}
          <div style={{
            background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.35)",
            borderRadius: "14px", padding: "18px", marginBottom: "20px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.82rem", color: "#66564A", fontWeight: 600 }}>{fee.category ?? "Fee"}</span>
              <span style={{
                padding: "3px 10px", borderRadius: "999px", fontWeight: 700, fontSize: "0.72rem",
                background: fee.status === "overdue" ? "rgba(185, 28, 28, 0.1)" : "rgba(234, 179, 8, 0.15)",
                color: fee.status === "overdue" ? "#B91C1C" : "#92400E",
                border: `1px solid ${fee.status === "overdue" ? "rgba(185, 28, 28, 0.25)" : "rgba(234, 179, 8, 0.3)"}`,
              }}>
                {fee.status.toUpperCase()}
              </span>
            </div>

            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#241A14", marginBottom: "12px" }}>
              {amountFmt(fee.amount)}
            </div>

            {fee.due_date && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem" }}>
                <CalendarDays size={14} style={{ color: isOverdue ? "#B91C1C" : "#8C7A6A" }} />
                <span style={{ color: isOverdue ? "#B91C1C" : "#66564A" }}>
                  Due: {new Date(fee.due_date).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                  {daysLeft !== null && !isOverdue && daysLeft <= 7 && (
                    <strong style={{ color: "#D97706", marginLeft: "8px" }}>
                      {daysLeft === 0 ? "Due today!" : `${daysLeft}d left`}
                    </strong>
                  )}
                  {isOverdue && <strong style={{ marginLeft: "8px", color: "#B91C1C" }}>OVERDUE</strong>}
                </span>
              </div>
            )}
          </div>

          {/* Partial payment toggle */}
          {isPartialAllowed && (
            <>
              <p style={{ margin: "0 0 12px", fontSize: "0.82rem", fontWeight: 700, color: "#241A14" }}>
                Payment option
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                <button
                  type="button"
                  onClick={() => setPayMode("partial")}
                  style={{
                    padding: "14px 10px", borderRadius: "12px", cursor: "pointer",
                    border: payMode === "partial" ? "2px solid #D35400" : "1.5px solid rgba(196, 154, 108, 0.4)",
                    background: payMode === "partial" ? "rgba(211, 84, 0, 0.06)" : "#FFF7E6",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <Clock size={14} style={{ color: "#D35400" }} />
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#D35400" }}>Partial</span>
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                    {amountFmt(fee.approved_partial_amt!)}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#66564A" }}>Admin-approved</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPayMode("full")}
                  style={{
                    padding: "14px 10px", borderRadius: "12px", cursor: "pointer",
                    border: payMode === "full" ? "2px solid #D35400" : "1.5px solid rgba(196, 154, 108, 0.4)",
                    background: payMode === "full" ? "rgba(211, 84, 0, 0.06)" : "#FFF7E6",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <CheckCircle2 size={14} style={{ color: "#047857" }} />
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#047857" }}>Full payment</span>
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                    {amountFmt(fee.amount)}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#66564A" }}>Clear entire balance</div>
                </button>
              </div>
            </>
          )}

          {/* Payment summary */}
          <div style={{
            background: "rgba(211, 84, 0, 0.05)", border: "1px solid rgba(211, 84, 0, 0.2)",
            borderRadius: "12px", padding: "14px 18px", marginBottom: "18px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "0.83rem", color: "#66564A" }}>You pay now</span>
              <span style={{ fontWeight: 700, color: "#241A14" }}>{amountFmt(payAmount)}</span>
            </div>
            {payMode === "partial" && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.83rem", color: "#66564A" }}>Remaining balance</span>
                <span style={{ fontWeight: 700, color: "#D97706" }}>{amountFmt(fee.amount - payAmount)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "0.83rem", color: "#66564A" }}>Gateway fee</span>
              <span style={{ fontWeight: 700, color: "#047857" }}>Free</span>
            </div>
            {walletBalance >= payAmount && (
              <div style={{
                display: "flex", justifyContent: "space-between",
                paddingTop: "8px", borderTop: "1px dashed rgba(196, 154, 108, 0.4)",
              }}>
                <span style={{ fontSize: "0.83rem", color: "#66564A" }}>Wallet balance after</span>
                <span style={{ fontWeight: 700, color: "#D35400" }}>{amountFmt(walletBalance - payAmount)}</span>
              </div>
            )}
          </div>

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

          {/* Security note */}
          <div style={{
            display: "flex", gap: "8px", alignItems: "flex-start",
            marginBottom: "20px", fontSize: "0.78rem", color: "#8C7A6A", lineHeight: 1.5,
          }}>
            <ShieldCheck size={14} style={{ color: "#047857", flexShrink: 0, marginTop: "1px" }} />
            <span>
              Secured by <strong style={{ color: "#241A14" }}>SSLCommerz</strong> — Bangladesh's leading
              payment gateway. Pay with bKash, Nagad, Rocket, Visa, Mastercard, or DBBL Nexus.
            </span>
          </div>

          {/* Wallet Balance Payment Option (Instant) */}
          {walletBalance >= payAmount && (
            <button
              type="button"
              disabled={busy}
              onClick={handlePayWithWallet}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px",
                padding: "13px",
                background: "#047857",
                color: "#FFF", border: "none", borderRadius: "12px",
                fontSize: "0.95rem", fontWeight: 800,
                cursor: busy ? "not-allowed" : "pointer",
                marginBottom: "12px",
                boxShadow: "0 4px 12px rgba(4, 120, 87, 0.25)",
              }}
            >
              <CheckCircle2 size={18} />
              Pay {amountFmt(payAmount)} from Wallet Balance
            </button>
          )}

          {/* SSLCommerz CTA */}
          <button
            type="button"
            disabled={busy}
            onClick={() => void handlePay()}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              justifyContent: "center", gap: "8px",
              padding: "13px",
              background: busy ? "rgba(211, 84, 0, 0.5)" : "#D35400",
              color: "#FFF", border: "none", borderRadius: "12px",
              fontSize: "0.95rem", fontWeight: 800,
              cursor: busy ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {busy ? (
              <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Connecting…</>
            ) : (
              <>Pay {amountFmt(payAmount)} via SSLCommerz Gateway <ChevronRight size={16} /></>
            )}
          </button>

          <p style={{ textAlign: "center", margin: "10px 0 0", fontSize: "0.75rem", color: "#8C7A6A" }}>
            You will be redirected to SSLCommerz secure checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
