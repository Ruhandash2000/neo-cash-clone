/**
 * Fingerprint Scanner Icon & Animated Laser Bar Component
 * Displays outer framing brackets, fingerprint ridges, and an up-and-down laser scanning bar.
 */

export function FingerprintScan({
  size = 104,
  scanning = true,
  busy = false,
}: {
  size?: number;
  scanning?: boolean;
  busy?: boolean;
}) {
  return (
    <div className={`bio-scan-wrapper ${busy ? "is-busy" : ""}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className="bio-scan-svg"
      >
        {/* Outer Framing Corner Brackets */}
        <path d="M12 30V18a6 6 0 0 1 6-6h12" strokeWidth="4.5" className="bio-bracket" />
        <path d="M90 12h12a6 6 0 0 1 6 6v12" strokeWidth="4.5" className="bio-bracket" />
        <path d="M108 90v12a6 6 0 0 1-6 6H90" strokeWidth="4.5" className="bio-bracket" />
        <path d="M30 108H18a6 6 0 0 1-6-6V90" strokeWidth="4.5" className="bio-bracket" />

        {/* Circular Background Ring */}
        <circle cx="60" cy="60" r="42" fill="none" stroke="oklch(0.9 0.02 300)" strokeWidth="1.5" />

        {/* Fingerprint Ridge Curves */}
        <g strokeWidth="3.5" opacity="0.9">
          <path d="M38 76c-1.5-5-2-10.5-2-16a24 24 0 0 1 48 0c0 5.5-.5 11-2 16" />
          <path d="M46 84c-2-6-3-12-3-18a17 17 0 0 1 34 0c0 8-1 16-4 24" />
          <path d="M54 88c-1.5-6-2-13-2-20a8 8 0 0 1 16 0c0 12-1 22-4 32" />
          <path d="M60 60v10" />
        </g>

        {/* Animated Laser Scanning Bar (Moves Up & Down) */}
        {scanning ? (
          <g className="scan-laser-group">
            {/* Soft Ambient Light Gradient Bar */}
            <rect
              x="24"
              y="-6"
              width="72"
              height="12"
              rx="4"
              fill="url(#laserGlow)"
              className="scan-laser-glow"
            />
            {/* Sharp Laser Beam Line */}
            <line
              x1="22"
              y1="0"
              x2="98"
              y2="0"
              stroke="oklch(0.55 0.24 300)"
              strokeWidth="3.8"
              strokeLinecap="round"
              className="scan-laser-line"
            />
          </g>
        ) : null}

        <defs>
          <linearGradient id="laserGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.65 0.22 300)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="oklch(0.65 0.22 300)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
