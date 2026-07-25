import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { Marquee } from "@/components/ui/Marquee";
import { Desktop, RocketLaunch, PenNib } from "@phosphor-icons/react/dist/ssr";

// ─── Service data ─────────────────────────────────────────────────────────────

const SERVICES = [
  {
    Icon: Desktop,
    number: "01",
    en: "Corporate Website",
    ja: "コーポレートサイト制作",
    accent: "var(--accent-primary)",
    description:
      "モダンなフロントエンド技術による独自実装で、高速・低コスト・高セキュリティを同時に実現。数多くのプロジェクト実績をもとに、集客から問い合わせ獲得まで一貫してサポートします。",
  },
  {
    Icon: RocketLaunch,
    number: "02",
    en: "Landing Page",
    ja: "LP制作",
    accent: "var(--accent-secondary)",
    description:
      "維持費ゼロのモバイル対応LPを、ビジュアルと心理的導線設計で構築。問い合わせ・購買・予約など、各ビジネスゴールに最短で到達するページを提供します。",
  },
  {
    Icon: PenNib,
    number: "03",
    en: "UI/UX Design",
    ja: "UI/UXデザイン",
    accent: "var(--accent-tertiary)",
    description:
      "豊富なWeb制作経験と情報処理安全確保支援士・応用情報技術者の知識を掛け合わせ、美しさとセキュリティを両立したインターフェース設計を行います。",
  },
];

const MARQUEE_ITEMS = [
  "コーポレートサイト制作",
  "LP制作",
  "UI/UXデザイン",
  "レスポンシブ対応",
  "SEO最適化",
  "高速パフォーマンス",
];

// ─── Component ────────────────────────────────────────────────────────────────
// Server component — no "use client" needed.
// AnimatedSection/AnimatedItem/Marquee are client components rendered from here.
// Phosphor Icons use /dist/ssr path for SSR-safe rendering.

export function CoreServices() {
  return (
    <section id="services" className="py-24 md:py-32 bg-[var(--background)]">

      {/* ── Service-name marquee (full-bleed) ─────────────────────────────── */}
      <Marquee duration={28} className="mb-16 md:mb-20 border-y border-zinc-900 py-5">
        {MARQUEE_ITEMS.map((item) => (
          <span key={item} className="flex items-center">
            <span className="text-2xl md:text-4xl font-semibold tracking-tighter text-zinc-700 px-6">
              {item}
            </span>
            <span className="text-2xl md:text-4xl text-zinc-800 select-none" aria-hidden="true">
              ·
            </span>
          </span>
        ))}
      </Marquee>

      <div className="mx-auto max-w-[1400px] px-6 md:px-8">
        <AnimatedSection>

          {/* ── Section header ──────────────────────────────────────────── */}
          <AnimatedItem className="mb-12 md:mb-16 flex flex-col gap-4">
            <EyebrowBadge>OUR SERVICES</EyebrowBadge>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-zinc-50 max-w-[22ch] leading-[1.1]">
              事業の成長を支える
              <br />
              3つのサービス
            </h2>
            <p className="text-zinc-300 text-lg leading-relaxed max-w-[48ch]">
              企画・設計からデザイン・実装・公開後の運用まで、
              Webサイトに関わるすべてを一貫してサポートします。
            </p>
          </AnimatedItem>

          {/* ── Service cards grid ──────────────────────────────────────── */}
          {/* staggerChildren: 0.1 in AnimatedSection propagates to these items:
              header → 0s, card-1 → 0.1s, card-2 → 0.2s, card-3 → 0.3s */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SERVICES.map(({ Icon, number, en, ja, accent, description }) => (
              <AnimatedItem key={en}>
                <div className="card-surface card-interactive p-7 h-full flex flex-col gap-6 group relative overflow-hidden">

                  {/* Gradient border reveal on hover */}
                  <div
                    className="absolute inset-0 rounded-[20px] border border-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary)) border-box",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                    aria-hidden="true"
                  />

                  {/* Oversized watermark number — bottom right */}
                  <span
                    className="absolute -bottom-10 -right-3 text-[8rem] font-bold leading-none tracking-tighter text-zinc-800 opacity-30 select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    {number}
                  </span>

                  {/* Icon container — per-service accent */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10"
                    style={{ background: accent }}
                  >
                    <Icon size={24} weight="duotone" color="white" />
                  </div>

                  {/* Text content */}
                  <div className="flex flex-col gap-2 flex-1 relative z-10">
                    <p className="text-[10px] font-medium tracking-widest uppercase text-zinc-500">
                      {en}
                    </p>
                    <h3 className="text-lg font-semibold tracking-tight text-zinc-50">
                      {ja}
                    </h3>
                    <p className="text-sm text-zinc-300 leading-relaxed mt-1">
                      {description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="h-px w-full bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-cyan-500/30 relative z-10" />
                </div>
              </AnimatedItem>
            ))}
          </div>

        </AnimatedSection>
      </div>
    </section>
  );
}
