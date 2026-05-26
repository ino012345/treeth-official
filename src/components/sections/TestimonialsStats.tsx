import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { Star } from "@phosphor-icons/react/dist/ssr";

// ─── Stats data ───────────────────────────────────────────────────────────────

const STATS = [
  {
    value: "5.0 / 5.0",
    en: "Client Satisfaction",
    ja: "単なるWeb制作に留まらず、圧倒的な視覚体験と技術力でクライアントの期待を常に超える成果を追求します。",
  },
  {
    value: "Strategic",
    en: "Business-First Design",
    ja: "表面的なデザインだけでなく、ブランドの本質的な魅力を最大化し、ターゲットに深く刺さる戦略的な設計を徹底します。",
  },
  {
    value: "Seamless",
    en: "End-to-End Experience",
    ja: "透明性の高いコミュニケーションとプロの進行管理で、企画から公開まで一切のストレスなく完遂します。",
  },
];

// ─── Testimonials data ────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote:
      "明確なビジョンが定まっていない段階からの依頼でしたが、丁寧なヒアリングを通じて要件を精緻に言語化し、当初のイメージを大きく超えるクオリティで仕上げていただきました。デザインの洗練度はもちろん、レスポンスの迅速さや修正対応の的確さなど、プロジェクト全体を通じて一貫した高水準のプロフェッショナリズムを体感しました。信頼を持ってお任せできるWebクリエイターとして、ぜひ周囲にも推薦したいと思います。",
    name: "クライアント様（コーポレートサイト）",
    role: "事業オーナー",
  },
  {
    quote:
      "プロジェクトの開始から公開まで、一貫して丁寧なコミュニケーションと高い専門性でプロセスを牽引していただきました。技術力・デザイン力の両面における提案の精度はもちろん、ビジュアル素材の選定まで深くコミットしてくださり、ブランドの世界観を体現した仕上がりを実現。期待を大きく超えるアウトプットを生み出していただいた、心強いパートナーです。",
    name: "クライアント様（LP制作）",
    role: "個人事業主",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function TestimonialsStats() {
  return (
    <section className="px-6 py-24 md:px-8 md:py-32 bg-[var(--background)]">
      <div className="mx-auto max-w-[1400px]">
        <AnimatedSection>

          {/* ── Section header ──────────────────────────────────────────── */}
          <AnimatedItem className="mb-12 md:mb-16 flex flex-col gap-4">
            <EyebrowBadge>CLIENT VOICES</EyebrowBadge>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-zinc-50 max-w-[22ch] leading-[1.1]">
              数字と声が証明する、
              <br />
              TREETHの実績
            </h2>
            <p className="text-zinc-300 text-lg leading-relaxed max-w-[48ch]">
              圧倒的なクオリティと戦略的な設計で、クライアントのビジネスに確かな変革をもたらしてきました。
            </p>
          </AnimatedItem>

          {/* ── Stats row ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {STATS.map(({ value, en, ja }) => (
              <AnimatedItem key={en}>
                <div className="card-surface p-7 flex flex-col gap-3">
                  <p
                    className="text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent"
                  >
                    {value}
                  </p>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-medium tracking-widest uppercase text-zinc-500">
                      {en}
                    </p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{ja}</p>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-indigo-500/30 to-violet-500/30 mt-auto pt-3" />
                </div>
              </AnimatedItem>
            ))}
          </div>

          {/* ── Testimonials row ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TESTIMONIALS.map(({ quote, name, role }) => (
              <AnimatedItem key={name}>
                <div className="card-surface p-7 h-full flex flex-col gap-5">

                  {/* 5-star rating */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} weight="fill" className="text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-zinc-300 leading-relaxed flex-1">
                    &ldquo;{quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                    <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">
                        {name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-zinc-100">{name}</p>
                      <p className="text-[11px] text-zinc-500">{role}</p>
                    </div>
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
