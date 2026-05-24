import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { Lightbulb, Code, CheckCircle } from "@phosphor-icons/react/dist/ssr";

// ─── Process data ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    Icon: Lightbulb,
    number: "01",
    en: "Strategy & Planning",
    ja: "戦略設計・企画",
    description:
      "ヒアリングを通じてビジネス課題を深掘りし、ターゲット・競合・KPIを整理。サイトマップ・ワイヤーフレームで全体像を固めてから制作に入るため、手戻りを最小限に抑えます。",
  },
  {
    Icon: Code,
    number: "02",
    en: "Design & Development",
    ja: "デザイン・実装",
    description:
      "ブランドイメージを体現するビジュアルデザインと、Next.jsによる高速実装を並行進行。進捗は随時共有し、フィードバックをリアルタイムで反映します。",
  },
  {
    Icon: CheckCircle,
    number: "03",
    en: "Testing & Launch",
    ja: "テスト・公開",
    description:
      "クロスブラウザ・レスポンシブ・Core Web Vitalsを徹底チェック。品質確認後に本番公開し、公開後のアフターサポートまで一貫してサポートします。",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ProcessMethodology() {
  return (
    <section className="px-6 py-24 md:px-8 md:py-32 bg-[var(--background)]">
      <div className="mx-auto max-w-[1400px]">
        <AnimatedSection>

          {/* ── Section header ──────────────────────────────────────────── */}
          <AnimatedItem className="mb-12 md:mb-16 flex flex-col gap-4">
            <EyebrowBadge>OUR PROCESS</EyebrowBadge>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-zinc-50 max-w-[22ch] leading-[1.1]">
              安心して任せられる、
              <br />
              3つのステップ
            </h2>
            <p className="text-zinc-300 text-lg leading-relaxed max-w-[48ch]">
              ヒアリングから公開・運用まで、すべてのフェーズを透明性高く進めます。
            </p>
          </AnimatedItem>

          {/* ── Step cards grid ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map(({ Icon, number, en, ja, description }) => (
              <AnimatedItem key={en}>
                <div className="card-surface p-7 h-full flex flex-col gap-6 relative overflow-hidden">

                  {/* Watermark number */}
                  <span
                    className="absolute -top-3 -right-2 text-[120px] font-bold leading-none text-zinc-800 select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    {number}
                  </span>

                  {/* Icon container */}
                  <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center flex-shrink-0 relative z-10">
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
