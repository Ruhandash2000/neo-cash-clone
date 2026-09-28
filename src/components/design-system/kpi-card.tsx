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
          background: "linear-gradient(135deg, #D35400 0%, #B84700 100%)",
          border: "1px solid #D35400",
          titleColor: "#FFF7E6",
          valueColor: "#FFFFFF",
          subtitleColor: "#EAD9C6",
          iconBg: "rgba(255, 247, 230, 0.2)",
          iconColor: "#FFF7E6",
        };
      case "accent":
        return {
          background: "#FDF9F3",
          border: "1px solid rgba(247, 183, 51, 0.4)",
          titleColor: "#7A685A",
          valueColor: "#D35400",
          subtitleColor: "#8A7667",
          iconBg: "rgba(247, 183, 51, 0.2)",
          iconColor: "#B45309",
        };
      default:
        return {
          background: "#FFFFFF",
          border: "1px solid rgba(196, 154, 108, 0.3)",
          titleColor: "#7A685A",
          valueColor: "#1C140E",
          subtitleColor: "#8A7667",
          iconBg: "rgba(196, 154, 108, 0.15)",
          iconColor: "#D35400",
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
        borderRadius: "18px",
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "14px",
        boxShadow: "0 2px 10px rgba(196, 154, 108, 0.08)",
        transition: "all 0.18s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: vStyle.titleColor, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {title}
        </span>
        {icon && (
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "12px",
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
        <h3 style={{ margin: 0, fontSize: "1.875rem", fontWeight: 800, color: vStyle.valueColor, letterSpacing: "-0.02em", fontFamily: "Inter, sans-serif", fontFeatureSettings: "'tnum'" }}>
          {formatTaka(value)}
        </h3>
      </div>

      {(subtitle || change) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid rgba(196, 154, 108, 0.15)" }}>
          {subtitle && (
            <span style={{ fontSize: "0.78rem", color: vStyle.subtitleColor, fontWeight: 500 }}>
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
                  variant === "primary"
                    ? "rgba(255, 247, 230, 0.2)"
                    : trend === "up"
                    ? "rgba(16, 185, 129, 0.12)"
                    : trend === "down"
                    ? "rgba(225, 29, 72, 0.12)"
                    : "rgba(196, 154, 108, 0.15)",
                color:
                  variant === "primary"
                    ? "#FFF7E6"
                    : trend === "up"
                    ? "#047857"
                    : trend === "down"
                    ? "#BE123C"
                    : "#7A685A",
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
