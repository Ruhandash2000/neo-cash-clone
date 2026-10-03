/**
 * Neo Cash AI — Design System Tokens & Formatting Utilities
 * 
 * Official "AUTUMN VIBES" Institutional Palette:
 * - Primary Burnt Orange: var(--theme-color-900) (Major actions, primary brand, active navigation)
 * - Warm Orange: var(--theme-color-500) (Hover, secondary accents, highlights)
 * - Golden Yellow: #F7B733 (Positive highlights, attention, selected data)
 * - Warm Taupe: #C49A6C (Muted UI elements, subtle borders, secondary emphasis)
 * - Soft Beige: #EAD9C6 (Subtle secondary surfaces, separators, soft cards)
 * - Warm Ivory: var(--theme-color-50) (Primary application background, warm ivory surfaces)
 */

export const NEO_TOKENS = {
  colors: {
    // Autumn Vibes Core Palette
    burntOrange: "var(--theme-color-900)",
    warmOrange: "var(--theme-color-500)",
    goldenYellow: "#F7B733",
    warmTaupe: "#C49A6C",
    softBeige: "#EAD9C6",
    warmIvory: "var(--theme-color-50)",

    // Semantic Application Map
    bgApp: "var(--theme-color-50)",
    surfacePrimary: "#FFFFFF",
    surfaceSecondary: "var(--theme-color-50)",
    surfaceMuted: "#F5EBDF",
    surfaceDark: "#211710",
    
    // Borders & Dividers
    borderSubtle: "rgba(196, 154, 108, 0.25)",
    borderStrong: "rgba(196, 154, 108, 0.45)",
    borderFocus: "var(--theme-color-900)",

    // Text & Typography Contrast System
    textDark: "#1C140E",
    textSubtle: "#4A3B30",
    textMuted: "#7A685A",
    textLight: "var(--theme-color-50)",

    // Functional State Colors
    primaryAction: "var(--theme-color-900)",
    primaryActionHover: "#B84700",
    secondaryAction: "var(--theme-color-500)",
    accentHighlight: "#F7B733",
  },
  radius: {
    sm: "6px",
    button: "12px",
    input: "12px",
    card: "18px",
    modal: "20px",
    badge: "9999px",
  },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    pageTitle: "font-weight: 700; font-size: 1.875rem; letter-spacing: -0.02em; color: #1C140E;",
    sectionTitle: "font-weight: 600; font-size: 1.1875rem; color: #1C140E;",
    cardTitle: "font-weight: 600; font-size: 0.9375rem; color: #1C140E;",
    body: "font-weight: 400; font-size: 0.9375rem; color: #4A3B30;",
    metadata: "font-weight: 500; font-size: 0.8125rem; color: #7A685A;",
    caption: "font-weight: 500; font-size: 0.75rem; color: #8C7A6A;",
    financialNumber: "font-weight: 800; font-size: 1.875rem; letter-spacing: -0.02em; color: #1C140E; font-feature-settings: 'tnum';",
  },
};

export type StatusType =
  | "paid"
  | "due"
  | "overdue"
  | "pending"
  | "approved"
  | "rejected"
  | "under_review"
  | "action_required"
  | "verified"
  | "failed";

export const STATUS_CONFIG: Record<
  StatusType,
  { label: string; bg: string; color: string; border: string }
> = {
  paid: { label: "Paid", bg: "rgba(16, 185, 129, 0.12)", color: "#047857", border: "rgba(16, 185, 129, 0.3)" },
  due: { label: "Due", bg: "var(--theme-transparent)", color: "var(--theme-color-900)", border: "rgba(211, 84, 0, 0.3)" },
  overdue: { label: "Overdue", bg: "rgba(225, 29, 72, 0.12)", color: "#BE123C", border: "rgba(225, 29, 72, 0.3)" },
  pending: { label: "Pending", bg: "rgba(247, 183, 51, 0.18)", color: "#B45309", border: "rgba(247, 183, 51, 0.4)" },
  approved: { label: "Approved", bg: "rgba(5, 150, 105, 0.14)", color: "#047857", border: "rgba(5, 150, 105, 0.3)" },
  rejected: { label: "Rejected", bg: "rgba(225, 29, 72, 0.14)", color: "#C2410C", border: "rgba(225, 29, 72, 0.3)" },
  under_review: { label: "Under Review", bg: "rgba(196, 154, 108, 0.2)", color: "#7C5C39", border: "rgba(196, 154, 108, 0.4)" },
  action_required: { label: "Action Required", bg: "rgba(211, 84, 0, 0.14)", color: "#C2410C", border: "rgba(211, 84, 0, 0.35)" },
  verified: { label: "Verified", bg: "rgba(13, 148, 136, 0.14)", color: "#0F766E", border: "rgba(13, 148, 136, 0.3)" },
  failed: { label: "Failed", bg: "rgba(220, 38, 38, 0.14)", color: "#B91C1C", border: "rgba(220, 38, 38, 0.3)" },
};

/** Format numeric values into Taka currency string */
export function formatTaka(amount: number, includeDecimals = true): string {
  const formatted = amount.toLocaleString("en-BD", {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });
  return `৳${formatted}`;
}


