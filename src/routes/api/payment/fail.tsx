import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

function PaymentFailPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      void navigate({ to: "/dashboard", search: { payment: "failed" }, replace: true });
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0d0d1a 0%, #1a0000 100%)",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      <div style={{
        width: "64px", height: "64px", borderRadius: "50%",
        background: "rgba(239,68,68,0.15)", border: "3px solid #EF4444",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "20px",
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
      <div style={{ color: "#FFF", fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>Payment Failed</div>
      <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem" }}>Returning to dashboard…</div>
    </div>
  );
}

export const Route = createFileRoute("/api/payment/fail")({
  ssr: false,
  component: PaymentFailPage,
});
