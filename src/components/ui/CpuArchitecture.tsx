import type { CSSProperties } from "react";

// ─── Circuit layout constants ─────────────────────────────────────────────────
// Chip rect: x=185 y=110 w=110 h=80 → right edge x=295, bottom edge y=190, center (240,150)

const CIRCUIT_PATHS = [
  { d: "M 185 128 H 95 V 48 H 28",   fill: "#6366f1", cls: "cpu-dot-1" },
  { d: "M 185 162 H 95 V 252 H 28",  fill: "#8b5cf6", cls: "cpu-dot-2" },
  { d: "M 295 128 H 385 V 48 H 452", fill: "#6366f1", cls: "cpu-dot-3" },
  { d: "M 295 162 H 385 V 252 H 452",fill: "#8b5cf6", cls: "cpu-dot-4" },
  { d: "M 220 110 V 38 H 138",        fill: "#6366f1", cls: "cpu-dot-5" },
  { d: "M 260 110 V 38 H 342",        fill: "#8b5cf6", cls: "cpu-dot-6" },
  { d: "M 220 190 V 262 H 138",       fill: "#6366f1", cls: "cpu-dot-7" },
  { d: "M 260 190 V 262 H 342",       fill: "#8b5cf6", cls: "cpu-dot-8" },
] as const;

const ENDPOINTS: [number, number][] = [
  [28, 48], [28, 252], [452, 48], [452, 252],
  [138, 38], [342, 38], [138, 262], [342, 262],
];

// Chip-edge pin y-positions (left/right) and x-positions (top/bottom)
const SIDE_PINS  = [126, 140, 154, 168] as const;
const TOP_BOT_PINS = [205, 225, 255, 275] as const;

// ─── Component ────────────────────────────────────────────────────────────────
// Server component — animations driven by CSS @keyframes (globals.css) and SVG SMIL.

export function CpuArchitecture() {
  return (
    <svg
      viewBox="0 0 480 300"
      className="w-full max-w-xl"
      aria-hidden="true"
    >
      <defs>
        {/* Shimmer gradient — scans left→right over the central text */}
        <linearGradient
          id="cpu-shimmer"
          x1="160" y1="0" x2="320" y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.8" />
          <stop offset="40%"  stopColor="#8b5cf6" stopOpacity="0.9" />
          <stop offset="50%"  stopColor="white"   stopOpacity="1"   />
          <stop offset="60%"  stopColor="#6366f1" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            from="-160 0" to="160 0"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </linearGradient>

        {/* Glow filter for traveling dots */}
        <filter id="cpu-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Circuit paths (static lines) ─────────────────────────────────── */}
      {CIRCUIT_PATHS.map(({ d }) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="#3f3f46"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}

      {/* ── Endpoint nodes ──────────────────────────────────────────────── */}
      {ENDPOINTS.map(([cx, cy]) => (
        <circle
          key={`ep-${cx}-${cy}`}
          cx={cx} cy={cy} r={4.5}
          fill="#09090b"
          stroke="#6366f1"
          strokeWidth="1.5"
        />
      ))}

      {/* ── Central chip ─────────────────────────────────────────────────── */}
      {/* Outer ambient glow ring */}
      <rect
        x="180" y="105" width="120" height="90" rx="12"
        fill="none" stroke="#6366f1" strokeWidth="0.5" strokeOpacity="0.25"
      />
      {/* Chip body */}
      <rect
        x="185" y="110" width="110" height="80" rx="8"
        fill="#09090b" stroke="#6366f1" strokeWidth="1.5"
      />
      {/* Inner die */}
      <rect
        x="198" y="122" width="84" height="56" rx="4"
        fill="#18181b" stroke="#27272a" strokeWidth="1"
      />

      {/* Pulsing ring (SVG SMIL — no Framer Motion needed) */}
      <circle cx="240" cy="150" fill="none" stroke="#6366f1" strokeWidth="1" r="18">
        <animate
          attributeName="r"
          values="18;44;18"
          dur="2.6s"
          repeatCount="indefinite"
          calcMode="ease-out"
        />
        <animate
          attributeName="stroke-opacity"
          values="0.55;0;0.55"
          dur="2.6s"
          repeatCount="indefinite"
        />
      </circle>

      {/* ── Chip pin marks ───────────────────────────────────────────────── */}
      {/* Left edge pins */}
      {SIDE_PINS.map((y) => (
        <line key={`pl-${y}`} x1="185" y1={y} x2="175" y2={y}
          stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
      ))}
      {/* Right edge pins */}
      {SIDE_PINS.map((y) => (
        <line key={`pr-${y}`} x1="295" y1={y} x2="305" y2={y}
          stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
      ))}
      {/* Top edge pins */}
      {TOP_BOT_PINS.map((x) => (
        <line key={`pt-${x}`} x1={x} y1="110" x2={x} y2="100"
          stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
      ))}
      {/* Bottom edge pins */}
      {TOP_BOT_PINS.map((x) => (
        <line key={`pb-${x}`} x1={x} y1="190" x2={x} y2="200"
          stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
      ))}

      {/* ── Central label with shimmer ────────────────────────────────────── */}
      <text
        x="240" y="146"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="15"
        fontWeight="700"
        fontFamily="monospace"
        letterSpacing="3"
        fill="url(#cpu-shimmer)"
      >
        TREETH
      </text>
      <text
        x="240" y="163"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="7.5"
        fontWeight="500"
        fontFamily="monospace"
        letterSpacing="2.5"
        fill="#52525b"
      >
        WEB PRODUCTION
      </text>

      {/* ── Traveling dots (offset-path driven by CSS in globals.css) ──────── */}
      {CIRCUIT_PATHS.map(({ d, fill, cls }) => (
        <circle
          key={cls}
          r={3}
          fill={fill}
          filter="url(#cpu-glow)"
          className={`cpu-dot ${cls}`}
          style={{ offsetPath: `path("${d}")` } as CSSProperties}
        />
      ))}
    </svg>
  );
}
