/** Fingerprint scan mark recreated as an SVG, matching the reference screenshot. */
export function FingerprintScan({ size = 150 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 34V16a8 8 0 0 1 8-8h18" />
      <path d="M86 8h18a8 8 0 0 1 8 8v18" />
      <path d="M112 86v18a8 8 0 0 1-8 8H86" />
      <path d="M34 112H16a8 8 0 0 1-8-8V86" />
      <g strokeWidth="4">
        <path d="M38 76c-1.5-5-2-10.5-2-16a24 24 0 0 1 48 0c0 5.5-.5 11-2 16" />
        <path d="M46 84c-2-6-3-12-3-18a17 17 0 0 1 34 0c0 8-1 16-4 24" />
        <path d="M54 88c-1.5-6-2-13-2-20a8 8 0 0 1 16 0c0 12-1 22-4 32" />
        <path d="M60 60v10" />
      </g>
      <path d="M26 60h68" strokeWidth="6" />
    </svg>
  );
}
