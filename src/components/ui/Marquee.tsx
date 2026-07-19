"use client";

import { motion } from "framer-motion";

interface MarqueeProps {
  children: React.ReactNode;
  /** Scroll right-to-left by default; true reverses direction */
  reverse?: boolean;
  /** Seconds for one full loop */
  duration?: number;
  className?: string;
}

// Infinite horizontal marquee. Renders children twice and translates the
// track by 50% so the loop is seamless.
export function Marquee({ children, reverse = false, duration = 30, className = "" }: MarqueeProps) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="flex w-max"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
