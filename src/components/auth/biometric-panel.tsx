import { useEffect, useState } from "react";

import { FingerprintScan } from "./fingerprint-scan";
import { biometricsAvailable } from "@/lib/biometrics";

export function BiometricPanel({
  title,
  instruction,
  actionLabel,
  onScan,
  onCancel,
  cancelLabel = "Cancel",
  secondary,
  status,
  busy,
}: {
  title: string;
  instruction: string;
  actionLabel: string;
  onScan: () => void;
  onCancel: () => void;
  cancelLabel?: string;
  secondary?: { label: string; onClick: () => void };
  status?: { tone: "error" | "success" | "info"; message: string } | null;
  busy?: boolean;
}) {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    void biometricsAvailable().then((value) => active && setSupported(value));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bio-panel">
      <button type="button" className="bio-cancel" onClick={onCancel}>
        {cancelLabel} <span aria-hidden="true">✕</span>
      </button>

      <h2 className="auth-heading">{title}</h2>
      <p className="auth-subtitle">{instruction}</p>

      <div className="bio-body">
        <button
          type="button"
          className="bio-scan"
          onClick={onScan}
          disabled={busy}
          aria-label={actionLabel}
        >
          <FingerprintScan />
        </button>
        <p className="bio-hint">
          <span aria-hidden="true">👆</span> {busy ? "Waiting for your device…" : actionLabel}
        </p>
      </div>

      {status ? (
        <p className={`auth-status auth-status--${status.tone}`} role="status" aria-live="polite">
          {status.message}
        </p>
      ) : null}

      <p className="bio-note">
        Neo never receives or stores your fingerprint. Your device verifies you with a fingerprint,
        face scan or PIN and signs a one-time challenge that our server checks.
        {supported === false
          ? " This device or browser does not offer a built-in authenticator — use your email and password instead."
          : ""}
      </p>

      {secondary ? (
        <button type="button" className="auth-link-button" onClick={secondary.onClick}>
          {secondary.label}
        </button>
      ) : null}
    </div>
  );
}
