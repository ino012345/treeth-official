"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

const FRAME_COUNT = 111;

const HEADLINE_WORDS = ["Ignite", "the", "Digital", "Core."];
const EASE_EXPO_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Canvas draw helper ────────────────────────────────────────────────────────
function drawFrameToCanvas(
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
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const currentFrameRef = useRef(0);
  const heroTextRef = useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // ── 1. Preload all frame images ─────────────────────────────────────────────
  // Loads first 20 frames immediately (covers initial viewport render), then
  // batches remaining frames in 20-frame chunks with setTimeout(0) to yield
  // between chunks and avoid starving the main thread during initial paint.
  // The page reveals once READY_COUNT frames have settled — enough to cover the
  // initial view and early scroll — while the rest keep loading in background.
  // drawFrameToCanvas guards against not-yet-loaded frames (keeps last frame).
  useEffect(() => {
    let count = 0;
    const imgs: HTMLImageElement[] = new Array(FRAME_COUNT);
    const CHUNK = 20;
    const READY_COUNT = 24;

    const loadFrame = (i: number) => {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(4, "0")}.webp`;
      const onSettle = () => {
        count++;
        setLoadProgress(Math.min(1, count / READY_COUNT));
        if (count === READY_COUNT) setLoaded(true);
      };
      img.onload = onSettle;
      img.onerror = onSettle;
      imgs[i - 1] = img;
    };

    // First chunk: load immediately
    for (let i = 1; i <= CHUNK; i++) loadFrame(i);

    // Remaining chunks: yield between each to avoid blocking paint
    let next = CHUNK + 1;
    const loadNextChunk = () => {
      const end = Math.min(next + CHUNK - 1, FRAME_COUNT);
      for (let i = next; i <= end; i++) loadFrame(i);
      next = end + 1;
      if (next <= FRAME_COUNT) setTimeout(loadNextChunk, 0);
    };
    if (next <= FRAME_COUNT) setTimeout(loadNextChunk, 0);

    framesRef.current = imgs;
  }, []);

  // ── 2. DPR-aware canvas sizing + redraw on resize ───────────────────────────
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

      const ctx = ctxRef.current;
      if (ctx && framesRef.current.length > 0) {
        drawFrameToCanvas(canvas, ctx, framesRef.current, currentFrameRef.current);
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── 3. Scroll-driven frame animation ────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!section || !canvas || !ctx) return;

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        if (scrollable <= 0) {
          tickingRef.current = false;
          return;
        }

        const progress = Math.min(1, Math.max(0, -rect.top / scrollable));

        // Canvas frame
        const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
        currentFrameRef.current = frameIndex;
        drawFrameToCanvas(canvas, ctx, framesRef.current, frameIndex);

        // Hero text: fade out over the first 10% of scroll
        if (heroTextRef.current) {
          heroTextRef.current.style.opacity = String(
            Math.max(0, 1 - progress / 0.1)
          );
        }

        tickingRef.current = false;
      });
    };

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
      {/* ── Loading overlay ─────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 transition-opacity duration-700 ${
          loaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-hidden={loaded}
      >
        <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-6">
          TREETH
        </p>
        <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full gradient-accent rounded-full transition-all duration-150"
            style={{ width: `${Math.round(loadProgress * 100)}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-zinc-400 font-mono tabular-nums">
          {Math.round(loadProgress * 100)}%
        </p>
      </div>

      {/* ── Main section ────────────────────────────────────────────────────── */}
      <section
        ref={sectionRef}
        style={{ height: "400vh" }}
        className="scroll-animation relative"
      >
        <div
          className="sticky top-0 h-screen overflow-hidden"
          style={{ willChange: "transform", transform: "translateZ(0)" }}
        >
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            style={{
              display: "block",
              willChange: "contents",
              transform: "translateZ(0)",
            }}
          />

          {/* Strong bottom-up gradient ensures text is always legible */}
          <div className="absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none" />

          {/* ── Hero text — bottom-left, fades on scroll ──────────────────── */}
          <div
            ref={heroTextRef}
            className="absolute inset-0 flex flex-col justify-end px-8 md:px-14 lg:px-20 pb-24 md:pb-28 pointer-events-none select-none"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[10px] font-medium tracking-widest uppercase text-white/60 mb-4"
            >
              TREETH — Web制作
            </motion.p>

            {/* Split-text headline: word-by-word entrance once frames are loaded */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tighter text-white max-w-[18ch]">
              {HEADLINE_WORDS.map((word, i) => (
                <span key={word} className="inline-block overflow-hidden pb-1 align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ y: 60, opacity: 0 }}
                    animate={loaded ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: EASE_EXPO_OUT }}
                  >
                    {word}
                    {i < HEADLINE_WORDS.length - 1 && " "}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={loaded ? { opacity: 1, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE_EXPO_OUT }}
              className="mt-4 text-base md:text-lg text-white/80 max-w-[45ch]"
            >
              ビジネスの核となる、圧倒的なデジタル体験を。妥協なき美しさと最新のテクノロジーが交差する場所で、あなたのブランドを次の次元へ引き上げます。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE_EXPO_OUT }}
              className="mt-8 pointer-events-auto"
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-medium bg-white/15 text-white hover:bg-white/25 border border-white/30 backdrop-blur-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                無料相談を予約する
                <ArrowRight size={16} weight="bold" />
              </a>
            </motion.div>
          </div>

          {/* ── Scroll hint ───────────────────────────────────────────────── */}
          <div className="absolute bottom-8 right-8 md:right-14 flex flex-col items-center gap-3 pointer-events-none select-none">
            <span className="text-[10px] tracking-widest uppercase text-white/50">
              Scroll
            </span>
            {/* Vertical line extending downward on loop */}
            <div className="h-12 w-px overflow-hidden">
              <motion.div
                className="h-full w-full bg-gradient-to-b from-white/70 to-white/10 origin-top"
                animate={{ scaleY: [0, 1, 1, 0] }}
                transition={{
                  duration: 2,
                  times: [0, 0.45, 0.7, 1],
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
