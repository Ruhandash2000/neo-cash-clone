import React from "react";
import { STATUS_CONFIG, StatusType } from "./tokens";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  HelpCircle,
  FileCheck,
  AlertCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: StatusType;
  customLabel?: string;
  className?: string;
}

const STATUS_ICONS: Record<StatusType, React.ReactNode> = {
  paid: <CheckCircle2 size={13} />,
  due: <Clock size={13} />,
  overdue: <AlertTriangle size={13} />,
  pending: <Clock size={13} />,
  approved: <FileCheck size={13} />,
  rejected: <XCircle size={13} />,
  under_review: <HelpCircle size={13} />,
  action_required: <AlertCircle size={13} />,
  verified: <ShieldCheck size={13} />,
  failed: <XCircle size={13} />,
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, customLabel, className = "" }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.due;
  const icon = STATUS_ICONS[status] || <Clock size={13} />;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "0.78rem",
        fontWeight: 600,
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        whiteSpace: "nowrap",
        letterSpacing: "0.01em",
      }}
    >
      {icon}
      <span>{customLabel || config.label}</span>
    </span>
  );
};
