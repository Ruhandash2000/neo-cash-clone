import React from "react";
import { formatTaka } from "./tokens";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number;
  subtitle?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  variant?: "default" | "primary" | "accent";
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  change,
  trend = "neutral",
  icon,
  variant = "default",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          background: "linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(30, 58, 138, 0.4) 100%)",
          border: "1px solid rgba(79, 70, 229, 0.45)",
          iconBg: "rgba(79, 70, 229, 0.3)",
          iconColor: "#A78BFA",
        };
      case "accent":
        return {
          background: "linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(30, 58, 138, 0.3) 100%)",
          border: "1px solid rgba(167, 139, 250, 0.35)",
          iconBg: "rgba(167, 139, 250, 0.25)",
          iconColor: "#D8B4FE",
        };
      default:
        return {
          background: "rgba(30, 58, 138, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          iconBg: "rgba(30, 58, 138, 0.4)",
          iconColor: "#94A3B8",
        };
    }
  };

  const vStyle = getVariantStyles();

  return (
    <div
      className="ms-card-hover"
      style={{
        background: vStyle.background,
        border: vStyle.border,
        borderRadius: "14px",
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "14px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {title}
        </span>
        {icon && (
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: vStyle.iconBg,
              color: vStyle.iconColor,
              display: "grid",
              placeItems: "center",
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div>
        <h3 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em", fontFamily: "Inter, sans-serif" }}>
          {formatTaka(value)}
        </h3>
      </div>

      {(subtitle || change) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
          {subtitle && (
            <span style={{ fontSize: "0.78rem", color: "#64748B" }}>
              {subtitle}
            </span>
          )}
          {change && (
            <span
              style={{
                fontSize: "0.76rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "2px 8px",
                borderRadius: "999px",
                background:
                  trend === "up"
                    ? "rgba(16, 185, 129, 0.12)"
                    : trend === "down"
                    ? "rgba(239, 68, 68, 0.12)"
                    : "rgba(255, 255, 255, 0.08)",
                color:
                  trend === "up"
                    ? "#34D399"
                    : trend === "down"
                    ? "#F87171"
                    : "#94A3B8",
              }}
            >
              {trend === "up" && <TrendingUp size={12} />}
              {trend === "down" && <TrendingDown size={12} />}
              {trend === "neutral" && <Minus size={12} />}
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
