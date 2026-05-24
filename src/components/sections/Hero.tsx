"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

const FRAME_COUNT = 111;

const ANNOTATIONS = [
  {
    id: "card-1",
    show: 0.12,
    hide: 0.30,
    position: "bottom-[38%] left-[4%] md:left-[7%]",
    label: "スピード納品",
    description: "最短2週間でサイトを公開",
  },
  {
    id: "card-2",
    show: 0.35,
    hide: 0.55,
    position: "top-[26%] right-[4%] md:right-[7%]",
    label: "SEO最適化",
    description: "検索上位を狙う構造設計",
  },
  {
    id: "card-3",
    show: 0.60,
    hide: 0.80,
    position: "bottom-[32%] right-[4%] md:right-[7%]",
    label: "明瞭な料金",
    description: "追加費用なし・一括見積もり",
  },
] as const;

// ─── Canvas draw helper (pure function, no React deps) ────────────────────────
// Uses physical canvas pixels (canvas.width / canvas.height) so DPR scaling
// is automatically correct — no ctx.scale() required.
function drawFrameToCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  frames: HTMLImageElement[],
  index: number
) {
  const img = frames[index];
  if (!img?.complete || !img.naturalWidth) return;

  const cw = canvas.width;   // physical pixels (already DPR-scaled)
  const ch = canvas.height;

  ctx.clearRect(0, 0, cw, ch);

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const cvRatio = cw / ch;

  // CSS object-fit: cover equivalent
  let drawW: number, drawH: number;
  if (cvRatio > imgRatio) {
    drawW = cw;
    drawH = cw / imgRatio;
  } else {
    drawH = ch;
    drawW = ch * imgRatio;
  }

  // Mobile: 1.3× zoom so the subject reads well on small screens
  if (window.innerWidth <= 768) {
    drawW *= 1.3;
    drawH *= 1.3;
  }

  ctx.drawImage(img, (cw - drawW) / 2, (ch - drawH) / 2, drawW, drawH);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Store ctx in a ref so the resize handler can redraw without depending on
  // the scroll effect's closure.
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  // RAF throttle guard — only one callback queued per animation frame
  const tickingRef = useRef(false);
  // Track current frame index so resize can redraw the right frame
  const currentFrameRef = useRef(0);
  const heroTextRef = useRef<HTMLDivElement>(null);
  // Stable string of sorted visible card IDs — compare before calling setState
  const prevVisibleIdsRef = useRef("");

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  // Card visibility is a discrete state (few possible values) — useState is fine
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  // ── 1. Preload all frame images ─────────────────────────────────────────────
  useEffect(() => {
    let count = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(4, "0")}.jpg`;

      const onSettle = () => {
        count++;
        setLoadProgress(count / FRAME_COUNT);
        if (count === FRAME_COUNT) setLoaded(true);
      };

      img.onload = onSettle;
      // Count errored frames too so loading never hangs
      img.onerror = onSettle;
      imgs.push(img);
    }

    framesRef.current = imgs;
  }, []);

  // ── 2. DPR-aware canvas sizing + redraw on window resize ───────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctxRef.current = canvas.getContext("2d");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;     // internal resolution
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";   // CSS display size
      canvas.style.height = window.innerHeight + "px";

      // Redraw the current frame at new dimensions immediately
      const ctx = ctxRef.current;
      if (ctx && framesRef.current.length > 0) {
        drawFrameToCanvas(canvas, ctx, framesRef.current, currentFrameRef.current);
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── 3. Scroll-driven frame animation (starts only after all frames load) ────
  useEffect(() => {
    if (!loaded) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!section || !canvas || !ctx) return;

    const handleScroll = () => {
      // Skip if a RAF callback is already queued — prevents stacking
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        if (scrollable <= 0) {
          tickingRef.current = false;
          return;
        }

        // progress: 0 (top of section) → 1 (bottom of section)
        const progress = Math.min(1, Math.max(0, -rect.top / scrollable));

        // ── Canvas frame draw (direct DOM, no React state) ──
        const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
        currentFrameRef.current = frameIndex;
        drawFrameToCanvas(canvas, ctx, framesRef.current, frameIndex);

        // ── Hero text fade-out (direct DOM via ref, no useState) ──
        // Fades from opacity 1 → 0 over the first 8% of scroll
        if (heroTextRef.current) {
          heroTextRef.current.style.opacity = String(
            Math.max(0, 1 - progress / 0.08)
          );
        }

        // ── Annotation card visibility (React state) ──
        // Only call setState when the visible set actually changes to avoid
        // re-rendering on every scroll tick.
        const newVisible = new Set<string>();
        for (const card of ANNOTATIONS) {
          if (progress >= card.show && progress < card.hide) {
            newVisible.add(card.id);
          }
        }
        const newIds = [...newVisible].sort().join(",");
        if (newIds !== prevVisibleIdsRef.current) {
          prevVisibleIdsRef.current = newIds;
          setVisibleCards(new Set(newVisible));
        }

        tickingRef.current = false;
      });
    };

    // Synchronously draw the frame that matches the current scroll position
    // (handles page reload mid-scroll or browser scroll restoration)
    const initRect = section.getBoundingClientRect();
    const initScrollable = section.offsetHeight - window.innerHeight;
    if (initScrollable > 0) {
      const initProgress = Math.min(1, Math.max(0, -initRect.top / initScrollable));
      currentFrameRef.current = Math.min(FRAME_COUNT - 1, Math.floor(initProgress * FRAME_COUNT));
    }
    drawFrameToCanvas(canvas, ctx, framesRef.current, currentFrameRef.current);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loaded]);

  return (
    <>
      {/* ── Loading overlay ──────────────────────────────────────────────────
          Always rendered; transitions to opacity-0 + pointer-events-none
          when loaded so the fade-out is smooth. */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f5f5f5] transition-opacity duration-700 ${
          loaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-hidden={loaded}
      >
        <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-6">
          treeth
        </p>
        {/* Progress bar — gradient-accent defined in globals.css */}
        <div className="w-48 h-1 bg-zinc-200 rounded-full overflow-hidden">
          <div
            className="h-full gradient-accent rounded-full transition-all duration-150"
            style={{ width: `${Math.round(loadProgress * 100)}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-zinc-400 font-mono tabular-nums">
          {Math.round(loadProgress * 100)}%
        </p>
      </div>

      {/* ── Main section ─────────────────────────────────────────────────────
          height: 400vh creates scroll distance.
          Overridden by .scroll-animation media queries in globals.css:
            ≤ 1024px → 350vh  |  ≤ 768px → 300vh */}
      <section
        ref={sectionRef}
        style={{ height: "400vh" }}
        className="scroll-animation relative"
      >
        {/* Sticky viewport: pins to screen while the parent section scrolls */}
        <div
          className="sticky top-0 h-screen overflow-hidden"
          style={{ willChange: "transform", transform: "translateZ(0)" }}
        >
          {/* Frame-sequence canvas — sized and drawn via refs, never React state */}
          <canvas
            ref={canvasRef}
            style={{
              display: "block",
              willChange: "contents",
              transform: "translateZ(0)",
            }}
          />

          {/* ── Hero text overlay ──────────────────────────────────────────
              Opacity is updated directly via heroTextRef on each scroll tick.
              Pointer events disabled so overlay never blocks canvas interaction. */}
          <div
            ref={heroTextRef}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 pointer-events-none select-none"
          >
            <p className="text-[10px] font-medium tracking-widest uppercase text-white/60 mb-6">
              treeth — Web制作
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tighter text-white text-center max-w-[18ch] drop-shadow-lg">
              あなたのビジネスを、
              <br />
              Webで動かす。
            </h1>
            <p className="mt-6 text-base md:text-lg text-white/75 text-center max-w-[45ch] drop-shadow">
              店舗・企業向けコーポレートサイト・LP制作
            </p>

            {/* CTA button — pointer-events-auto overrides parent's none */}
            <div className="mt-8 pointer-events-auto">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-medium bg-white/15 text-white hover:bg-white/25 border border-white/30 backdrop-blur-sm transition-colors duration-200"
              >
                無料相談を予約する
                <ArrowRight size={16} weight="bold" />
              </a>
            </div>

            {/* Scroll hint — looping Framer Motion animation (not scroll-driven,
                so Framer Motion is appropriate here) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
              <span className="text-[10px] tracking-widest uppercase text-white/50">
                Scroll
              </span>
              <motion.div
                className="h-6 w-4 rounded-full border-2 border-white/40 flex items-start justify-center pt-1"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
              </motion.div>
            </div>
          </div>

          {/* ── Annotation cards ───────────────────────────────────────────
              CSS transitions instead of Framer Motion — lighter for elements
              toggled many times per second during scroll. */}
          {ANNOTATIONS.map((card) => {
            const visible = visibleCards.has(card.id);
            return (
              <div
                key={card.id}
                className={[
                  "absolute pointer-events-none",
                  card.position,
                  "transition-all duration-500",
                  visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
                ].join(" ")}
              >
                <div className="card-surface p-4 max-w-[172px] md:max-w-[216px]">
                  <p className="text-xs font-semibold text-zinc-800">{card.label}</p>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
