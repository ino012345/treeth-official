import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { Desktop, RocketLaunch, PenNib } from "@phosphor-icons/react/dist/ssr";

// ─── Service data ─────────────────────────────────────────────────────────────

const SERVICES = [
  {
    Icon: Desktop,
    en: "Corporate Website",
    ja: "コーポレートサイト制作",
    description:
      "WordPressを使わない独自実装で、高速・低コスト・高セキュリティを同時に実現。数多くのプロジェクト実績をもとに、集客から問い合わせ獲得まで一貫してサポートします。",
  },
  {
    Icon: RocketLaunch,
    en: "Landing Page",
    ja: "LP制作",
    description:
      "維持費ゼロのモバイル対応LPを、ビジュアルと心理的導線設計で構築。問い合わせ・購買・予約など、各ビジネスゴールに最短で到達するページを提供します。",
  },
  {
    Icon: PenNib,
    en: "UI/UX Design",
    ja: "UI/UXデザイン",
    description:
      "豊富なWeb制作経験と情報処理安全確保支援士・応用情報技術者の知識を掛け合わせ、美しさとセキュリティを両立したインターフェース設計を行います。",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
// Server component — no "use client" needed.
// AnimatedSection/AnimatedItem are client components but can be rendered from here.
// Phosphor Icons use /dist/ssr path for SSR-safe rendering.

export function CoreServices() {
  return (
    <section id="services" className="px-6 py-24 md:px-8 md:py-32 bg-[var(--background)]">
      <div className="mx-auto max-w-[1400px]">
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
            {SERVICES.map(({ Icon, en, ja, description }) => (
              <AnimatedItem key={en}>
                <div className="card-surface p-7 h-full flex flex-col gap-6 group">

                  {/* Icon container with gradient accent background */}
                  <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center flex-shrink-0">
                    <Icon size={24} weight="duotone" color="white" />
                  </div>

                  {/* Text content */}
                  <div className="flex flex-col gap-2 flex-1">
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
                  <div className="h-px w-full bg-gradient-to-r from-indigo-500/30 to-violet-500/30" />
                </div>
              </AnimatedItem>
            ))}
          </div>

        </AnimatedSection>
      </div>
    </section>
  );
}
