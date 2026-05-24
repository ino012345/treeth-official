"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";

// ─── Typewriter hook ──────────────────────────────────────────────────────────

const TYPEWRITER_PHRASES: readonly string[] = [
  '"Premium Design."',
  '"Pixel Perfect."',
  '"User Centric."',
  '"Always Crafted."',
];

function useTypewriter(phrases: readonly string[]) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      // Typing: 55ms per character
      timer = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length + 1)),
        55
      );
    } else if (!deleting && displayed.length === current.length) {
      // Pause at end: 1800ms before deleting
      timer = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      // Deleting: 30ms per character (faster than typing)
      timer = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length - 1)),
        30
      );
    } else {
      // Advance to next phrase
      setPhraseIdx((prev) => (prev + 1) % phrases.length);
      setDeleting(false);
    }

    return () => clearTimeout(timer);
  }, [displayed, deleting, phraseIdx, phrases]);

  return displayed;
}

// ─── Visual sub-components ────────────────────────────────────────────────────

function TypewriterVisual() {
  const text = useTypewriter(TYPEWRITER_PHRASES);
  return (
    <div className="flex items-center min-h-[96px]">
      <p className="font-mono text-xl font-semibold text-zinc-50 leading-snug">
        {text}
        <motion.span
          className="text-indigo-500 ml-0.5"
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse" as const,
          }}
        >
          |
        </motion.span>
      </p>
    </div>
  );
}

// ──

const ORB_R = 50;     // orbit radius in px
const ORB_SIZE = 116; // container side length in px
const ORB_BADGES = [
  { label: "Next.js", angle: -90 }, // 12 o'clock
  { label: "React",   angle:  30 }, // 4 o'clock
  { label: "Framer",  angle: 150 }, // 8 o'clock
];

function OrbVisual() {
  return (
    <div className="flex items-center justify-center min-h-[96px]">
      <div style={{ position: "relative", width: ORB_SIZE, height: ORB_SIZE }}>
        {/* Static orbit ring — not inside the rotating container */}
        <div
          className="absolute rounded-full border border-dashed border-zinc-700"
          style={{
            width: ORB_R * 2,
            height: ORB_R * 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Center hub */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 2 }}
        >
          <div className="w-11 h-11 rounded-full gradient-accent flex items-center justify-center shadow-md">
            <span className="text-white text-[9px] font-bold tracking-tight">
              TREETH
            </span>
          </div>
        </div>

        {/* Rotating container: spins the badge positions */}
        <motion.div
          style={{ position: "absolute", inset: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          {ORB_BADGES.map((badge) => {
            const rad = (badge.angle * Math.PI) / 180;
            const x = ORB_SIZE / 2 + ORB_R * Math.cos(rad);
            const y = ORB_SIZE / 2 + ORB_R * Math.sin(rad);
            return (
              <div
                key={badge.label}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Counter-rotate so the label always faces the reader */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  style={{
                    background: "#27272a",
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#a1a1aa",
                    padding: "3px 8px",
                    borderRadius: 8,
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {badge.label}
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

// ──

const WF_CX = 80;
const WF_CY = 80;
const WORKFLOW_NODES = [
  { x: 80,  y: 18  }, // top
  { x: 142, y: 80  }, // right
  { x: 80,  y: 142 }, // bottom
  { x: 18,  y: 80  }, // left
];
const WF_CYCLE = 1.2; // seconds per dot journey

function WorkflowVisual() {
  return (
    <div className="flex items-center justify-center min-h-[96px]">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {/* Dashed lines: center → each node */}
        {WORKFLOW_NODES.map((node, i) => (
          <line
            key={i}
            x1={WF_CX} y1={WF_CY}
            x2={node.x} y2={node.y}
            stroke="#3f3f46"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        ))}

        {/* Node circles */}
        {WORKFLOW_NODES.map((node, i) => (
          <circle
            key={i}
            cx={node.x} cy={node.y} r={5}
            fill="#18181b" stroke="#52525b" strokeWidth="1.5"
          />
        ))}

        {/* Pulsing ring at center */}
        <motion.circle
          cx={WF_CX} cy={WF_CY} r={10}
          fill="none" stroke="#6366f1" strokeWidth="1.5"
          animate={{ r: [10, 28], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Center dot */}
        <circle cx={WF_CX} cy={WF_CY} r={7} fill="#09090b" />

        {/* Traveling dots: offset-path along each line */}
        {WORKFLOW_NODES.map((node, i) => (
          <motion.circle
            key={i}
            r={3}
            fill="#6366f1"
            style={
              {
                offsetPath: `path("M ${WF_CX} ${WF_CY} L ${node.x} ${node.y}")`,
              } as React.CSSProperties
            }
            animate={{ offsetDistance: ["0%", "100%"] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              // Gap between runs = total cycle time minus this dot's travel time
              repeatDelay: WF_CYCLE * WORKFLOW_NODES.length - 0.6,
              delay: i * WF_CYCLE,
              ease: "easeIn" as const,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// ──

const BAR_DATA = [
  { heights: [40, 90, 35, 75, 50], delay: 0    },
  { heights: [75, 45, 95, 50, 80], delay: 0.35 },
  { heights: [55, 100, 60, 90, 40], delay: 0.7  },
  { heights: [85, 50, 70, 40, 95], delay: 1.05 },
  { heights: [30, 80, 50, 85, 60], delay: 1.4  },
];

function BarChartVisual() {
  return (
    <div className="flex items-end justify-center gap-2 min-h-[96px] pb-1">
      {BAR_DATA.map((bar, i) => (
        <motion.div
          key={i}
          className="w-7 rounded-t-xl"
          style={{
            background: "linear-gradient(to top, #6366f1, #8b5cf6)",
            height: bar.heights[0],
          }}
          animate={{ height: bar.heights }}
          transition={{
            height: {
              duration: 12,
              repeat: Infinity,
              repeatType: "loop" as const,
              ease: "easeInOut",
              delay: bar.delay,
            },
          }}
        />
      ))}
    </div>
  );
}

// ─── Card metadata ────────────────────────────────────────────────────────────

const BENTO_CARDS = [
  {
    Visual: TypewriterVisual,
    en: "Design Philosophy",
    ja: "デザイン哲学",
    description:
      "妥協のないピクセルパーフェクトなデザインを提供します。見た目の美しさと機能性を両立し、ブランドの第一印象を最大化します。",
  },
  {
    Visual: OrbVisual,
    en: "Modern Tech Stack",
    ja: "最新の技術スタック",
    description:
      "Next.js・Framer Motionを用いた高速でモダンなWeb技術を採用。将来の拡張にも対応できる堅牢な基盤を構築します。",
  },
  {
    Visual: WorkflowVisual,
    en: "Seamless Workflow",
    ja: "シームレスな進行",
    description:
      "企画からデザイン・実装まで、透明性の高いプロジェクト進行。進捗はリアルタイムで共有し、手戻りを最小化します。",
  },
  {
    Visual: BarChartVisual,
    en: "High Performance",
    ja: "圧倒的なパフォーマンス",
    description:
      "SEO最適化と徹底したパフォーマンス・チューニングでビジネスの成果を最大化。Core Web Vitalsへの対応で検索上位を狙います。",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function BentoFeatures() {
  return (
    <section className="px-6 py-24 md:px-8 md:py-32 bg-[var(--background)]">
      <div className="mx-auto max-w-[1400px]">
        <AnimatedSection>

          {/* ── Section header ── */}
          <AnimatedItem className="mb-12 md:mb-16 flex flex-col gap-4">
            <EyebrowBadge>WHY CHOOSE US</EyebrowBadge>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-zinc-50 max-w-[22ch] leading-[1.1]">
              TREETHが選ばれる
              <br />
              4つの理由
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-[48ch]">
              単に「きれいなサイト」を作るのではなく、成果につながるWebサイトを届けることにこだわっています。
            </p>
          </AnimatedItem>

          {/* ── Row 1: narrow (2fr) | wide (3fr) ── */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-5 mb-5">
            {BENTO_CARDS.slice(0, 2).map(({ Visual, en, ja, description }) => (
              <AnimatedItem key={en}>
                <div className="card-surface p-7 h-full flex flex-col gap-5">
                  <Visual />
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-medium tracking-widest uppercase text-zinc-400">
                      {en}
                    </p>
                    <h3 className="text-lg font-semibold tracking-tight text-zinc-50">
                      {ja}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </AnimatedItem>
            ))}
          </div>

          {/* ── Row 2: wide (3fr) | narrow (2fr) ── */}
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-5">
            {BENTO_CARDS.slice(2, 4).map(({ Visual, en, ja, description }) => (
              <AnimatedItem key={en}>
                <div className="card-surface p-7 h-full flex flex-col gap-5">
                  <Visual />
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-medium tracking-widest uppercase text-zinc-400">
                      {en}
                    </p>
                    <h3 className="text-lg font-semibold tracking-tight text-zinc-50">
                      {ja}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </AnimatedItem>
            ))}
          </div>

        </AnimatedSection>
      </div>
    </section>
  );
}
