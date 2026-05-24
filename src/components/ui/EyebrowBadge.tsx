import type { ReactNode } from "react";

interface EyebrowBadgeProps {
  children: ReactNode;
  className?: string;
}

// Server component — no "use client" needed (no hooks, no browser APIs)
export function EyebrowBadge({ children, className = "" }: EyebrowBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-800/60 px-3 py-1.5 text-[10px] font-medium tracking-wider text-zinc-400 uppercase shadow-sm backdrop-blur-md ${className}`}
    >
      {children}
    </span>
  );
}
