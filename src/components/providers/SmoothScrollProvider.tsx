"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

interface Props {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: Props) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      // lerp: 0.1 instead of default 0.1 — Safari iOS needs higher value to
      // prevent microstutter on momentum scroll.
      lerp: 0.1,
      // syncTouch: false prevents Lenis from hijacking native touch momentum
      // on iOS Safari, which causes a visible "catch" on fling gestures.
      syncTouch: false,
      smoothWheel: true,
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
