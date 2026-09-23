import Image from "next/image";
import { ArrowRight, Star } from "@phosphor-icons/react/dist/ssr";
import { SITE } from "@/lib/site";

// ─── Hero ─────────────────────────────────────────────────────────────────────
// Server component on purpose: this section ships no JavaScript at all.
//
// It replaced a 400vh scroll-driven canvas sequence that cost desktop visitors
// four full screens of scrolling before the first line of service copy — the
// exact pattern NN/g's scrolljacking research flags as worst-case (goal-oriented
// users + text + altered scroll rate). See docs/uiux-audit.md §A.
//
// Entrance motion is CSS, not Framer Motion: a JS entrance holds elements at
// opacity 0 until hydration, which made the paragraph below the LCP element
// with ~1.1s of render delay. CSS animations start at first paint instead.
// Stagger is kept short (≤200ms) so nothing delays LCP meaningfully.
// prefers-reduced-motion is handled globally in globals.css.

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden">
      {/* ── Background: one static frame, slow ambient drift only ─────────── */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="hero-ambient absolute inset-0">
          <Image
            src="/hero.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* Legibility scrims — keep every piece of copy above AA contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/70" />
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-6 pt-28 pb-16 md:px-8 md:pt-32 md:pb-20">
        <div className="max-w-[46rem]">
          {/* Brand line — kept for identity, demoted from information carrier */}
          <p className="hero-rise mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-indigo-300">
            TREETH — Ignite the Digital Core.
          </p>

          {/* h1 states WHO + WHAT in Japanese. Short lines that cannot wrap
              mid-word — Japanese has no spaces, so a long line breaks inside a
              word (ホームペ / ージ) at narrow widths.

              The headline and lede intentionally carry NO entrance animation:
              they are the LCP candidates, and any opacity-0 start disqualifies
              them until the animation runs, pushing LCP past 3s on mobile.
              They paint immediately; the surrounding elements provide the
              sense of arrival. */}
          <h1 className="text-[2.4rem] font-semibold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
            店舗・企業の
            <br />
            ホームページ制作
          </h1>

          <p className="mt-6 max-w-[36rem] text-base leading-relaxed text-zinc-200 md:text-lg">
            成果につながるコーポレートサイト・LPを、企画からデザイン・実装・公開まで
            一貫して制作します。Web制作が初めての方でも、ご相談いただけます。
          </p>

          {/* ── CTAs: primary action first, portfolio as the low-commitment path ── */}
          <div
            className="hero-rise mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "140ms" }}
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-zinc-950 transition-colors duration-200 hover:bg-zinc-200"
            >
              無料で相談する
              <ArrowRight size={16} weight="bold" />
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/15"
            >
              制作実績を見る
            </a>
          </div>

          {/* Microcopy: removes the most common hesitation before contacting.
              Deliberately promises nothing about response time or price. */}
          <p className="hero-rise mt-4 text-sm text-zinc-300" style={{ animationDelay: "170ms" }}>
            まだ内容が固まっていなくても大丈夫です。
          </p>

          {/* ── Trust row — every figure is verified, see src/lib/site.ts ───── */}
          <dl
            className="hero-rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/15 pt-6"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs text-zinc-300">これまでの制作・納品実績</dt>
              <dd className="text-2xl font-semibold tracking-tight text-white tabular-nums">
                {SITE.deliveredProjects}
                <span className="ml-1 text-base font-normal text-zinc-200">件</span>
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs text-zinc-300">{SITE.ratingSourceLabel}</dt>
              <dd className="flex items-center gap-1.5 text-2xl font-semibold tracking-tight text-white tabular-nums">
                <Star size={18} weight="fill" className="text-amber-400" />
                {SITE.rating}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs text-zinc-300">対応範囲</dt>
              <dd className="text-sm font-medium text-white">企画・デザイン・実装・公開</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
