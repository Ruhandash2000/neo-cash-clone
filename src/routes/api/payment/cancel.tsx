import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

function PaymentCancelPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      void navigate({ to: "/dashboard", search: { payment: "cancelled" }, replace: true });
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0d0d1a 0%, #1a1000 100%)",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      <div style={{
        width: "64px", height: "64px", borderRadius: "50%",
        background: "rgba(245,158,11,0.15)", border: "3px solid #F59E0B",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "20px",
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div style={{ color: "#FFF", fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>Payment Cancelled</div>
      <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem" }}>Returning to dashboard…</div>
    </div>
  );
}

export const Route = createFileRoute("/api/payment/cancel")({
  ssr: false,
  component: PaymentCancelPage,
});
