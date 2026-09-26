import React from "react";

/** NeoButton — Primary, Secondary, Outline, Danger buttons */
interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  style,
  disabled,
  className = "",
  ...props
}) => {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      fontWeight: 600,
      borderRadius: "10px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      transition: "all 0.18s ease",
      outline: "none",
      border: "none",
      fontSize: size === "sm" ? "0.8rem" : size === "lg" ? "1rem" : "0.88rem",
      padding:
        size === "sm"
          ? "6px 12px"
          : size === "lg"
          ? "12px 24px"
          : "9px 18px",
    };

    switch (variant) {
      case "primary":
        return {
          ...base,
          background: "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
          color: "#FFFFFF",
          boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
        };
      case "secondary":
        return {
          ...base,
          background: "rgba(30, 58, 138, 0.4)",
          color: "#F3E8FF",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        };
      case "outline":
        return {
          ...base,
          background: "transparent",
          color: "#A78BFA",
          border: "1px solid rgba(167, 139, 250, 0.4)",
        };
      case "danger":
        return {
          ...base,
          background: "rgba(239, 68, 68, 0.15)",
          color: "#FCA5A5",
          border: "1px solid rgba(239, 68, 68, 0.35)",
        };
      case "ghost":
        return {
          ...base,
          background: "transparent",
          color: "#94A3B8",
        };
      default:
        return base;
    }
  };

  return (
    <button style={{ ...getStyles(), ...style }} disabled={disabled} className={className} {...props}>
      {icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
      {children}
    </button>
  );
};

/** NeoInput — Styled Text Input */
interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const NeoInput: React.FC<NeoInputProps> = ({ label, icon, error, style, ...props }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
      {label && (
        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {icon && (
          <span style={{ position: "absolute", left: "12px", color: "#64748B", pointerEvents: "none", display: "flex" }}>
            {icon}
          </span>
        )}
        <input
          style={{
            width: "100%",
            padding: icon ? "10px 14px 10px 40px" : "10px 14px",
            background: "rgba(13, 24, 42, 0.6)",
            border: error ? "1px solid #EF4444" : "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "10px",
            color: "#FFFFFF",
            outline: "none",
            fontSize: "0.9rem",
            transition: "border-color 0.2s ease",
            ...style,
          }}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: "0.76rem", color: "#F87171" }}>{error}</span>}
    </div>
  );
};

/** NeoModal — Production-Grade Modal Dialog */
interface NeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const NeoModal: React.FC<NeoModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "560px",
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(13, 24, 42, 0.85)",
        backdropFilter: "blur(6px)",
        zIndex: 1000,
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#0D182A",
          border: "1px solid rgba(167, 139, 250, 0.3)",
          borderRadius: "16px",
          maxWidth,
          width: "100%",
          padding: "28px",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.6)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "16px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#FFFFFF", fontWeight: 700 }}>{title}</h3>
            {subtitle && <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#94A3B8" }}>{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#64748B", fontSize: "1.2rem", cursor: "pointer", padding: "4px" }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: footer ? "20px" : 0 }}>{children}</div>

        {footer && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "16px" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
