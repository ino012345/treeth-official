"use client";

import { useEffect, useRef, useState } from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { Button } from "@/components/ui/Button";

const FRAME_COUNT = 111;

// ─── Project data (replace with real content later) ───────────────────────────

const PROJECTS = [
  {
    id: "proj-1",
    show: 0.04,
    hide: 0.17,
    number: "01",
    title: "株式会社○○ コーポレートサイト",
    genre: "Corporate Website",
    tags: ["コーポレート", "ブランディング"],
    year: "2024",
  },
  {
    id: "proj-2",
    show: 0.20,
    hide: 0.33,
    number: "02",
    title: "○○サービス ランディングページ",
    genre: "Landing Page",
    tags: ["LP", "CVR最適化"],
    year: "2024",
  },
  {
    id: "proj-3",
    show: 0.36,
    hide: 0.49,
    number: "03",
    title: "○○店舗 予約・集客サイト",
    genre: "Corporate Website",
    tags: ["店舗サイト", "予約機能"],
    year: "2024",
  },
  {
    id: "proj-4",
    show: 0.52,
    hide: 0.64,
    number: "04",
    title: "○○ブランド ECサイト＋LP",
    genre: "Landing Page",
    tags: ["EC", "商品訴求"],
    year: "2024",
  },
  {
    id: "proj-5",
    show: 0.67,
    hide: 0.78,
    number: "05",
    title: "○○クリニック Webリニューアル",
    genre: "Corporate Website",
    tags: ["医療", "UI/UX刷新"],
    year: "2024",
  },
] as const;

// ─── Canvas draw helper ───────────────────────────────────────────────────────
// Identical cover-fit algorithm as Hero. Uses physical canvas pixels so DPR
// scaling is handled automatically without ctx.scale().

function drawTunnelFrame(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  frames: HTMLImageElement[],
  index: number
) {
  const img = frames[index];
  if (!img?.complete || !img.naturalWidth) return;

  const cw = canvas.width;
  const ch = canvas.height;

  ctx.clearRect(0, 0, cw, ch);

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const cvRatio = cw / ch;

  let drawW: number, drawH: number;
  if (cvRatio > imgRatio) {
    drawW = cw;
    drawH = cw / imgRatio;
  } else {
    drawH = ch;
    drawW = ch * imgRatio;
  }

  // Mobile: 1.3× zoom for better visual weight on narrow viewports
  if (window.innerWidth <= 768) {
    drawW *= 1.3;
    drawH *= 1.3;
  }

  ctx.drawImage(img, (cw - drawW) / 2, (ch - drawH) / 2, drawW, drawH);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProjectsShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // ctxRef lets the resize handler redraw without depending on the scroll effect's closure
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  // RAF throttle guard
  const tickingRef = useRef(false);
  // Tracks current frame so resize can redraw the right one
  const currentFrameRef = useRef(0);
  // Intro overlay opacity — updated via direct DOM ref with threshold guard
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const introOpacityRef = useRef(1);
  // Stable string of sorted visible card IDs for change-detection
  const prevVisibleIdsRef = useRef("");

  // Loaded + progress: updated at discrete moments (onload counts), useState is appropriate
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  // Card visibility: discrete state, only changes at scroll thresholds
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  // CTA: single boolean flip at 82%
  const [ctaVisible, setCtaVisible] = useState(false);

  // ── 1. Preload all tunnel frames ───────────────────────────────────────────
  useEffect(() => {
    let count = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/tunnel-frames/frame_${String(i).padStart(4, "0")}.jpg`;

      const onSettle = () => {
        count++;
        setLoadProgress(count / FRAME_COUNT);
        if (count === FRAME_COUNT) setLoaded(true);
      };

      img.onload = onSettle;
      img.onerror = onSettle; // don't hang if a frame is missing
      imgs.push(img);
    }

    framesRef.current = imgs;
  }, []);

  // ── 2. DPR-aware canvas sizing + redraw on resize ──────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctxRef.current = canvas.getContext("2d");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      // Redraw the current frame at new dimensions
      const ctx = ctxRef.current;
      if (ctx && framesRef.current.length > 0) {
        drawTunnelFrame(canvas, ctx, framesRef.current, currentFrameRef.current);
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── 3. Scroll-driven tunnel animation (after all frames are loaded) ─────────
  useEffect(() => {
    if (!loaded) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!section || !canvas || !ctx) return;

    const handleScroll = () => {
      // Already processing — skip to prevent stacking RAF callbacks
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        if (scrollable <= 0) {
          tickingRef.current = false;
          return;
        }

        // progress: 0 → 1 across the full section scroll distance
        const progress = Math.min(1, Math.max(0, -rect.top / scrollable));

        // ── Canvas frame (direct DOM — never React state) ──
        const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
        currentFrameRef.current = frameIndex;
        drawTunnelFrame(canvas, ctx, framesRef.current, frameIndex);

        // ── Intro overlay fade-out (direct DOM, threshold guard) ──
        // Fades 1→0 in the first 6% of scroll.
        // The >0.01 threshold prevents DOM writes for imperceptible changes.
        if (introOverlayRef.current) {
          const newOpacity = Math.max(0, 1 - progress / 0.06);
          if (Math.abs(newOpacity - introOpacityRef.current) > 0.01) {
            introOpacityRef.current = newOpacity;
            introOverlayRef.current.style.opacity = String(newOpacity);
          }
        }

        // ── Project card visibility (React state, only when set changes) ──
        const newVisible = new Set<string>();
        for (const proj of PROJECTS) {
          if (progress >= proj.show && progress < proj.hide) {
            newVisible.add(proj.id);
          }
        }
        const newIds = [...newVisible].sort().join(",");
        if (newIds !== prevVisibleIdsRef.current) {
          prevVisibleIdsRef.current = newIds;
          setVisibleCards(new Set(newVisible));
        }

        // ── CTA overlay (React state, only flips when the boolean changes) ──
        const shouldShowCta = progress >= 0.82;
        setCtaVisible((prev) => (prev === shouldShowCta ? prev : shouldShowCta));

        tickingRef.current = false;
      });
    };

    // Synchronous initial draw at the current scroll position
    // (handles page-reload mid-scroll / browser scroll restoration)
    const initRect = section.getBoundingClientRect();
    const initScrollable = section.offsetHeight - window.innerHeight;
    if (initScrollable > 0) {
      const initProgress = Math.min(1, Math.max(0, -initRect.top / initScrollable));
      currentFrameRef.current = Math.min(
        FRAME_COUNT - 1,
        Math.floor(initProgress * FRAME_COUNT)
      );
    }
    drawTunnelFrame(canvas, ctx, framesRef.current, currentFrameRef.current);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loaded]);

  const activeIdx = PROJECTS.findIndex(p => visibleCards.has(p.id));
  // Keep the last known index so the counter doesn't flash back to "01"
  // during the gap between projects (when activeIdx === -1).
  const lastActiveIdxRef = useRef<number>(0);
  if (activeIdx >= 0) lastActiveIdxRef.current = activeIdx;

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{ height: "500vh" }}
      className="scroll-animation relative"
    >
      {/* Sticky viewport: dark background is visible before canvas draws */}
      <div
        className="sticky top-0 h-screen overflow-hidden bg-zinc-950"
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      >
        {/* ── Tunnel frame canvas ──────────────────────────────────────── */}
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            willChange: "contents",
            transform: "translateZ(0)",
          }}
        />

        {/* ── Persistent dim overlay — tones down tunnel video ─────────── */}
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />

        {/* ── Section-scoped loading overlay ───────────────────────────── */}
        {/* Positioned within the sticky container — no full-page cover needed
            since this section is below the fold during Hero preload. */}
        <div
          className={`absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center transition-opacity duration-700 ${
            loaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          aria-hidden={loaded}
        >
          <p className="text-[10px] tracking-widest uppercase text-zinc-600 mb-6">
            Loading
          </p>
          <div className="w-36 h-px bg-zinc-800 overflow-hidden">
            <div
              className="h-full gradient-accent transition-all duration-150"
              style={{ width: `${Math.round(loadProgress * 100)}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-zinc-600 font-mono tabular-nums">
            {Math.round(loadProgress * 100)}%
          </p>
        </div>

        {/* ── Intro text overlay ───────────────────────────────────────── */}
        {/* Opacity managed via introOverlayRef direct DOM write (not useState).
            Fades from 1 → 0 in the first 6% of scroll progress. */}
        <div
          ref={introOverlayRef}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 pointer-events-none select-none"
        >
          <EyebrowBadge>OUR PROJECTS</EyebrowBadge>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-white text-center max-w-[22ch] drop-shadow-lg">
            制作実績
          </h2>
          <p className="text-base md:text-lg text-white/60 text-center max-w-[45ch]">
            これまでに手がけた制作物の一部をご紹介します
          </p>
        </div>

        {/* ── Project cards ────────────────────────────────────────────── */}
        {/* CSS transitions (not Framer Motion) — lighter for elements toggled
            many times per second. All cards share the same position; only one
            is visible at a time. Gap between hide/show gives a clean tunnel beat. */}
        {PROJECTS.map((proj) => {
          const visible = visibleCards.has(proj.id);
          return (
            <div
              key={proj.id}
              className={[
                "absolute inset-0 flex items-center justify-center px-6 md:px-10",
                "pointer-events-none transition-all duration-500",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0",
              ].join(" ")}
            >
              {/* Card wrapper — full-width, centered, large */}
              <div className="w-full max-w-[90vw] md:max-w-4xl pointer-events-auto">
              {/* Dark glassmorphism card */}
              <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[24px] p-6 md:p-8">
                {/* Project image placeholder */}
                <div className="rounded-xl overflow-hidden aspect-video bg-gradient-to-br from-indigo-950/60 via-zinc-900/40 to-violet-950/60 border border-white/5 mb-6 flex items-center justify-center">
                  <span className="text-white/10 text-xs font-mono tracking-widest uppercase">
                    {proj.genre}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-mono font-semibold tracking-widest text-indigo-400 uppercase">
                      Project {proj.number}
                    </p>
                    <h3 className="text-lg md:text-xl font-semibold text-white leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-sm text-white/40 mt-0.5">{proj.genre}</p>
                  </div>
                  <span className="text-sm text-white/30 font-mono flex-shrink-0 mt-0.5">
                    {proj.year}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              </div>
            </div>
          );
        })}

        {/* ── Project counter: PC（右側縦型） ──────────────────────────── */}
        <div
          className={[
            "absolute right-12 top-1/2 -translate-y-1/2",
            "hidden md:flex flex-col items-center gap-0 pointer-events-none select-none",
            "transition-opacity duration-500",
            activeIdx >= 0 && !ctaVisible ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <span className="text-5xl font-bold font-mono tracking-tighter text-white tabular-nums leading-none">
            {String(lastActiveIdxRef.current + 1).padStart(2, "0")}
          </span>
          <div className="w-px h-10 bg-white/15 my-3" />
          <span className="text-base font-mono text-white/25">
            {String(PROJECTS.length).padStart(2, "0")}
          </span>
        </div>

        {/* ── Project counter: スマホ（下部横型） ──────────────────────── */}
        <div
          className={[
            "absolute bottom-8 left-1/2 -translate-x-1/2",
            "flex md:hidden items-baseline gap-1.5 pointer-events-none select-none",
            "transition-opacity duration-500",
            activeIdx >= 0 && !ctaVisible ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <span className="text-xl font-bold font-mono tracking-tighter text-white tabular-nums leading-none">
            {String(lastActiveIdxRef.current + 1).padStart(2, "0")}
          </span>
          <span className="text-sm font-mono text-white/30">/</span>
          <span className="text-sm font-mono text-white/30 tabular-nums">
            {String(PROJECTS.length).padStart(2, "0")}
          </span>
        </div>

        {/* ── CTA overlay (appears at 82% scroll) ──────────────────────── */}
        {/* Uses React state (single boolean flip) with CSS transition.
            pointer-events toggled with opacity so it's only clickable when shown. */}
        <div
          className={[
            "absolute inset-0 flex flex-col items-center justify-center px-6",
            "transition-opacity duration-700",
            ctaVisible
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[20px] p-10 flex flex-col items-center gap-6 text-center w-full max-w-md">
            <p className="text-[10px] tracking-widest uppercase text-indigo-400">
              Next Step
            </p>
            <h3 className="text-2xl font-semibold tracking-tight text-white leading-snug">
              あなたのサイトも
              <br />
              TREETHにお任せください
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              まずは無料でご相談ください。
              <br />
              ご要望をお聞きし、最適なプランをご提案します。
            </p>
            <Button href="#contact" variant="primary" showArrow>
              お問い合わせはこちら
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
