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
    const purpose = params.get("value_c") ?? "fee_payment";

    // Small delay so the page renders visually before navigation
    const timer = setTimeout(() => {
      void navigate({
        to: "/dashboard",
        search: { payment: "success", tran_id: tranId || undefined, purpose: purpose || undefined },
        replace: true,
      });
    }, 300);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0d0d1a 0%, #1a0a00 100%)",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      <div style={{
        width: "64px", height: "64px", borderRadius: "50%",
        background: "rgba(5, 209, 148, 0.15)",
        border: "3px solid #05D194",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "20px",
        animation: "pulse-success 1s ease infinite",
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#05D194" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div style={{ color: "#FFFFFF", fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>
        Payment Successful!
      </div>
      <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem" }}>
        Returning to dashboard…
      </div>
      <style>{`
        @keyframes pulse-success {
          0%, 100% { box-shadow: 0 0 0 0 rgba(5,209,148,0.35); }
          50%       { box-shadow: 0 0 0 12px rgba(5,209,148,0); }
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
