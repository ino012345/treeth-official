import type { ReactNode } from "react";

interface EyebrowBadgeProps {
  children: ReactNode;
  className?: string;
}

export function EyebrowBadge({ children, className = "" }: EyebrowBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md px-3.5 py-1.5 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
      <span className="text-zinc-300 tracking-[0.2em] uppercase text-[10px] font-medium">
        {children}
      </span>
    </span>
  );
}
