/**
 * Neo Cash AI — Phase 1 Design System Tokens & Formatter Helpers
 * 
 * Midnight Sky Palette:
 * - Background Deep: #0D182A
 * - Primary Surface Blue: #1E3A8A
 * - Primary Action / Active: #4F46E5
 * - Accent Purple: #A78BFA
 * - Highlight Purple: #D8B4FE
 * - Subtle Light Surface: #F3E8FF
 */

export const NEO_TOKENS = {
  colors: {
    bgDeep: "#0D182A",
    surfaceBlue: "#1E3A8A",
    primary: "#4F46E5",
    accentPurple: "#A78BFA",
    highlight: "#D8B4FE",
    subtleLight: "#F3E8FF",
    border: "rgba(255, 255, 255, 0.08)",
    borderHover: "rgba(167, 139, 250, 0.35)",
    textBright: "#FFFFFF",
    textMuted: "#94A3B8",
    textDim: "#64748B",
  },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    display: "font-weight: 800; font-size: 2rem; letter-spacing: -0.02em;",
    pageTitle: "font-weight: 700; font-size: 1.5rem; letter-spacing: -0.01em;",
    sectionTitle: "font-weight: 600; font-size: 1.125rem;",
    body: "font-weight: 400; font-size: 0.9375rem;",
    metadata: "font-weight: 500; font-size: 0.8125rem;",
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
  paid: { label: "Paid", bg: "rgba(16, 185, 129, 0.14)", color: "#34D399", border: "rgba(16, 185, 129, 0.35)" },
  due: { label: "Due", bg: "rgba(59, 130, 246, 0.14)", color: "#60A5FA", border: "rgba(59, 130, 246, 0.35)" },
  overdue: { label: "Overdue", bg: "rgba(239, 68, 68, 0.14)", color: "#F87171", border: "rgba(239, 68, 68, 0.35)" },
  pending: { label: "Pending", bg: "rgba(245, 158, 11, 0.14)", color: "#FBBF24", border: "rgba(245, 158, 11, 0.35)" },
  approved: { label: "Approved", bg: "rgba(5, 150, 105, 0.18)", color: "#10B981", border: "rgba(5, 150, 105, 0.4)" },
  rejected: { label: "Rejected", bg: "rgba(225, 29, 72, 0.15)", color: "#FB7185", border: "rgba(225, 29, 72, 0.35)" },
  under_review: { label: "Under Review", bg: "rgba(139, 92, 246, 0.15)", color: "#C084FC", border: "rgba(139, 92, 246, 0.35)" },
  action_required: { label: "Action Required", bg: "rgba(249, 115, 22, 0.15)", color: "#FB923C", border: "rgba(249, 115, 22, 0.35)" },
  verified: { label: "Verified", bg: "rgba(6, 182, 212, 0.15)", color: "#22D3EE", border: "rgba(6, 182, 212, 0.35)" },
  failed: { label: "Failed", bg: "rgba(220, 38, 38, 0.15)", color: "#EF4444", border: "rgba(220, 38, 38, 0.35)" },
};

/** Format integer or decimal amounts into Taka currency string */
export function formatTaka(amount: number, includeDecimals = true): string {
  const formatted = amount.toLocaleString("en-BD", {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });
  return `৳${formatted}`;
}
