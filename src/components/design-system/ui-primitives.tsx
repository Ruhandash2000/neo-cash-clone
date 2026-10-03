import React from "react";

/** NeoButton — Primary, Secondary, Outline, Danger buttons */
interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "success" | "ghost";
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
      borderRadius: "12px",
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
          background: "linear-gradient(135deg, var(--theme-color-900) 0%, #B84700 100%)",
          color: "#FFFFFF",
          boxShadow: "0 2px 10px rgba(211, 84, 0, 0.25)",
        };
      case "secondary":
        return {
          ...base,
          background: "var(--theme-color-50)",
          color: "#241A14",
          border: "1px solid rgba(196, 154, 108, 0.4)",
        };
      case "outline":
        return {
          ...base,
          background: "transparent",
          color: "var(--theme-color-900)",
          border: "1px solid rgba(211, 84, 0, 0.45)",
        };
      case "danger":
        return {
          ...base,
          background: "rgba(225, 29, 72, 0.12)",
          color: "#BE123C",
          border: "1px solid rgba(225, 29, 72, 0.3)",
        };
      case "success":
        return {
          ...base,
          background: "rgba(4, 120, 87, 0.12)",
          color: "#047857",
          border: "1px solid rgba(4, 120, 87, 0.3)",
        };
      case "ghost":
        return {
          ...base,
          background: "transparent",
          color: "#66564A",
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
        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#7A685A", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {icon && (
          <span style={{ position: "absolute", left: "12px", color: "#8A7667", pointerEvents: "none", display: "flex" }}>
            {icon}
          </span>
        )}
        <input
          style={{
            width: "100%",
            padding: icon ? "10px 14px 10px 40px" : "10px 14px",
            background: "#FFFFFF",
            border: error ? "1px solid #BE123C" : "1px solid rgba(196, 154, 108, 0.35)",
            borderRadius: "12px",
            color: "#1C140E",
            outline: "none",
            fontSize: "0.9rem",
            transition: "border-color 0.2s ease",
            boxShadow: "0 1px 3px rgba(196, 154, 108, 0.08)",
            ...style,
          }}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: "0.76rem", color: "#BE123C" }}>{error}</span>}
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
        background: "rgba(33, 23, 16, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "var(--theme-color-50)",
          border: "1px solid rgba(196, 154, 108, 0.4)",
          borderRadius: "20px",
          maxWidth,
          width: "100%",
          padding: "28px",
          boxShadow: "0 20px 40px rgba(33, 23, 16, 0.25)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", borderBottom: "1px solid rgba(196, 154, 108, 0.25)", paddingBottom: "16px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#1C140E", fontWeight: 700 }}>{title}</h3>
            {subtitle && <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#7A685A" }}>{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#8A7667", fontSize: "1.2rem", cursor: "pointer", padding: "4px" }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: footer ? "20px" : 0 }}>{children}</div>

        {footer && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid rgba(196, 154, 108, 0.25)", paddingTop: "16px" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};


