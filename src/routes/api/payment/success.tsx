/**
 * SSLCommerz Payment Success Callback — /api/payment/success
 *
 * SSLCommerz POSTs (and then GETs) to this URL after a successful payment.
 * We show a brief loading screen and then navigate to the dashboard via TanStack Router.
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tranId  = params.get("tran_id") ?? "";
    const purpose = params.get("value_c") || params.get("purpose") || (tranId.startsWith("WLT") ? "wallet_topup" : "fee_payment");
    const amount  = params.get("amount") || params.get("currency_amount") || "";
    const feeId   = params.get("value_d") || params.get("fee_id") || "";

    const searchParams = new URLSearchParams();
    searchParams.set("payment", "success");
    if (tranId)  searchParams.set("tran_id", tranId);
    if (purpose) searchParams.set("purpose", purpose);
    if (amount)  searchParams.set("amount", amount);
    if (feeId)   searchParams.set("fee_id", feeId);

    const returnUrl = `/dashboard?${searchParams.toString()}`;

    const searchObj: {
      payment: string;
      tran_id?: string;
      purpose?: string;
      amount?: string;
      fee_id?: string;
    } = { payment: "success" };
    if (tranId)  searchObj.tran_id = tranId;
    if (purpose) searchObj.purpose = purpose;
    if (amount)  searchObj.amount = amount;
    if (feeId)   searchObj.fee_id = feeId;

    const timer = setTimeout(() => {
      try {
        void navigate({
          to: "/dashboard",
          search: searchObj,
          replace: true,
        });
      } catch {
        window.location.href = returnUrl;
      }
    }, 400);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualReturn = () => {
    const params = new URLSearchParams(window.location.search);
    const tranId  = params.get("tran_id") ?? "";
    const purpose = params.get("value_c") || params.get("purpose") || (tranId.startsWith("WLT") ? "wallet_topup" : "fee_payment");
    const amount  = params.get("amount") || params.get("currency_amount") || "";
    const feeId   = params.get("value_d") || params.get("fee_id") || "";

    const searchParams = new URLSearchParams();
    searchParams.set("payment", "success");
    if (tranId)  searchParams.set("tran_id", tranId);
    if (purpose) searchParams.set("purpose", purpose);
    if (amount)  searchParams.set("amount", amount);
    if (feeId)   searchParams.set("fee_id", feeId);

    window.location.href = `/dashboard?${searchParams.toString()}`;
  };

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0d0d1a 0%, #1a0a00 100%)",
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "24px",
      textAlign: "center",
    }}>
      <div style={{
        width: "68px", height: "68px", borderRadius: "50%",
        background: "rgba(5, 209, 148, 0.15)",
        border: "3px solid #05D194",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "20px",
        animation: "pulse-success 1s ease infinite",
      }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#05D194" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div style={{ color: "#FFFFFF", fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px" }}>
        Payment Successful!
      </div>
      <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", marginBottom: "20px" }}>
        Returning you to the dashboard…
      </div>

      <button
        onClick={handleManualReturn}
        style={{
          background: "#05D194",
          color: "#000",
          border: "none",
          borderRadius: "8px",
          padding: "10px 20px",
          fontWeight: 600,
          fontSize: "0.9rem",
          cursor: "pointer",
        }}
      >
        Go to Dashboard Now
      </button>

      <style>{`
        @keyframes pulse-success {
          0%, 100% { box-shadow: 0 0 0 0 rgba(5,209,148,0.35); }
          50%       { box-shadow: 0 0 0 14px rgba(5,209,148,0); }
        }
      `}</style>
    </div>
  );
}

export const Route = createFileRoute("/api/payment/success")({
  ssr: false,
  component: PaymentSuccessPage,
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
  }),
});
