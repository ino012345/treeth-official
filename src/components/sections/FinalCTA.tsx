"use client";

import { motion } from "framer-motion";
import { AnimatedSection, AnimatedItem, EASE_EXPO_OUT } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { CpuArchitecture } from "@/components/ui/CpuArchitecture";
import { ContactForm } from "@/components/ui/ContactForm";

const HEADLINE_LINES = ["Ready to Build Your", "Digital Core?"];

// ─── Character-level split heading ────────────────────────────────────────────

function SplitHeading() {
  return (
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ staggerChildren: 0.025 }}
      className="text-3xl md:text-5xl font-semibold tracking-tighter text-white leading-[1.1]"
      aria-label={HEADLINE_LINES.join(" ")}
    >
      {HEADLINE_LINES.map((line, lineIdx) => (
        <span key={line} className="block" aria-hidden="true">
          {Array.from(line).map((char, i) => (
            <motion.span
              key={`${lineIdx}-${i}`}
              className="inline-block whitespace-pre"
              variants={{
                hidden: { y: 40, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.5, ease: EASE_EXPO_OUT },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h2>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
// id="contact" anchors every href="#contact" link on the page.

export function FinalCTA() {
  return (
    <section
      id="contact"
      className="relative px-6 py-24 md:px-8 md:py-32 bg-zinc-950 overflow-hidden"
    >
      {/* ── CPU visual: centered background layer for depth ─────────────── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 scale-125 md:scale-150"
        aria-hidden="true"
      >
        <CpuArchitecture />
      </div>
      {/* Vignette so foreground copy stays legible over the visual */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,9,11,0.85)_70%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px]">
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* ── Left: heading ─────────────────────────────────────────── */}
            <AnimatedItem className="flex-1 flex flex-col items-center lg:items-start gap-8 text-center lg:text-left">
              <div className="flex flex-col gap-4">
                <EyebrowBadge>CONTACT</EyebrowBadge>
                <SplitHeading />
                <p className="text-base text-white/80 leading-relaxed max-w-[42ch]">
                  圧倒的なパフォーマンスと洗練されたデザインで、あなたのビジネスを次のステージへ。
                  プロジェクトのご相談・無料お見積もりはこちらからどうぞ。
                </p>
              </div>
            </AnimatedItem>

            {/* ── Right: contact form ──────────────────────────────────── */}
            <AnimatedItem className="w-full lg:max-w-md">
              <div className="bg-gradient-to-br from-zinc-900/60 to-indigo-950/30 backdrop-blur-xl border border-indigo-900/40 rounded-[20px] p-8">
                <p className="text-[10px] font-medium tracking-widest uppercase text-zinc-500 mb-1">
                  Get in Touch
                </p>
                <h3 className="text-base font-semibold text-white mb-6">
                  お問い合わせ
                </h3>
                <ContactForm />
              </div>
            </AnimatedItem>

          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
