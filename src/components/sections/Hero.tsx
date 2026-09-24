import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

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

          {/* Written as a concatenated string, not as wrapped JSX text: JSX
              collapses a source newline into a space, which puts a stray gap in
              the middle of a Japanese sentence (…公開まで 一貫して…). */}
          <p className="jp-text mt-6 max-w-[36rem] text-base leading-relaxed text-zinc-200 md:text-lg">
            {"成果につながるコーポレートサイト・LPを、企画からデザイン・実装・公開まで" +
              "一貫して制作します。Web制作が初めての方でも、ご相談いただけます。"}
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

          {/* The marketplace metrics that used to sit here (ココナラ販売実績 /
              評価 / Web制作実績) were removed: they read as freelance-marketplace
              seller stats rather than studio credentials, and the same figures
              are already one click away on the linked Coconala profile. The
              "制作実績を見る" CTA above is the stronger proof path — real work
              beats a number. Figures remain in src/lib/site.ts for the
              structured data and any future use. */}
        </div>
      </div>
    </section>
  );
}
