import React, { useState, useRef, useEffect } from "react";
import { Paintbrush, Check } from "lucide-react";
import { useTheme, ColorTheme } from "@/lib/theme-provider";

const PALETTES: { id: ColorTheme; label: string; colors: string[] }[] = [
  { id: "sunset", label: "Sunset Vibes", colors: ["#EF4444", "#FB923C", "#FBBF24"] },
  { id: "ocean", label: "Ocean Breeze", colors: ["#0D47A1", "#3B82F6", "#22D3EE"] },
  { id: "nature", label: "Nature Tones", colors: ["#1B5E3A", "#4CAF50", "#A7C957"] },
  { id: "royal", label: "Royal Purple", colors: ["#4C1D95", "#7C3AED", "#A78BFA"] },
];

export function ThemePaletteSelector() {
  const { colorTheme, setColorTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Change Color Theme"
        style={{
          background: "rgba(0,0,0,0.04)",
          border: "none",
          borderRadius: "50%",
          width: "34px",
          height: "34px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
      >
        <Paintbrush size={16} color="var(--theme-color-900)" />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "220px",
            background: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            borderRadius: "14px",
            padding: "8px",
            zIndex: 1000,
            animation: "slideDown 0.15s ease-out forwards",
          }}
        >
          <div style={{ padding: "6px 8px 10px", fontSize: "0.75rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Color Theme
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {PALETTES.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setColorTheme(p.id);
                  setIsOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  borderRadius: "10px",
                  border: "none",
                  background: colorTheme === p.id ? "rgba(0,0,0,0.03)" : "transparent",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (colorTheme !== p.id) e.currentTarget.style.background = "rgba(0,0,0,0.02)";
                }}
                onMouseLeave={(e) => {
                  if (colorTheme !== p.id) e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "2px", borderRadius: "4px", overflow: "hidden" }}>
                    {p.colors.map((c, i) => (
                      <div key={i} style={{ width: "8px", height: "16px", background: c }} />
                    ))}
                  </div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#241A14" }}>{p.label}</span>
                </div>
                {colorTheme === p.id && <Check size={14} color="var(--theme-color-900)" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
