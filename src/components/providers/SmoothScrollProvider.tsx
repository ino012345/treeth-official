"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

interface Props {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: Props) {
  useEffect(() => {
    // Smooth scrolling is itself motion the user did not ask for. When reduced
    // motion is requested, skip Lenis entirely and let the browser scroll
    // natively (WCAG 2.2 SC 2.3.3). Anchor links still work — they just jump.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Lenis rewrites scroll styles on init, which repaints the page and
    // re-registers a late LCP candidate. Defer it until the browser is idle so
    // first paint — and the LCP measurement — happens without it. Smooth scroll
    // is irrelevant before the user has scrolled anyway.
    let lenis: Lenis | null = null;
    let rafId = 0;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.2,
        lerp: 0.1,
        syncTouch: false,
        smoothWheel: true,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    };

    const hasIdle = typeof window.requestIdleCallback === "function";
    const idleId = hasIdle
      ? window.requestIdleCallback(start, { timeout: 2000 })
      : window.setTimeout(start, 200);

    // Anchor navigation works whether or not Lenis has booted yet: before it
    // does, the browser's own jump behaviour applies.
    const handleAnchorClick = (e: MouseEvent) => {
      if (!lenis) return;
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { duration: 1.2 });
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(idleId as number);
      else window.clearTimeout(idleId as number);
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
