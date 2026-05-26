import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { Star, ArrowRight } from "@phosphor-icons/react/dist/ssr";

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
      "完成イメージがまだぼんやりしていた段階でのご依頼でしたが、丁寧なヒアリングを通じてこちらの意図を的確に引き出していただき、最終的には期待をはるかに超えるクオリティのサイトが完成しました。デザインの洗練度はもちろん、コミュニケーションの迅速さや修正対応の丁寧さにも本当に助かりました。安心してお任せできる方で、ぜひ周囲にも勧めたいと思っています。",
    name: "クライアント様（コーポレートサイト）",
    role: "事業オーナー",
  },
  {
    quote:
      "最初から最後まで誠実かつ丁寧にご対応いただき、安心してお任せすることができました。技術力・デザイン力の高さはもちろん、ビジュアル素材の選定まで親身に提案していただき、イメージにぴったり（むしろそれ以上の！）仕上がりに本当に感動しました。treethさんにお願いして、本当に良かったと思っています。また機会があれば、ぜひご一緒させていただきたいです。",
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

          {/* ── Coconala profile link ────────────────────────────────────── */}
          <AnimatedItem className="mt-8 flex justify-center">
            <a
              href="https://coconala.com/users/2538632"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 backdrop-blur-md px-5 py-2.5 text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all duration-200 group"
            >
              Coconalaでの評価・実績を見る
              <ArrowRight size={14} weight="bold" className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </AnimatedItem>

        </AnimatedSection>
      </div>
    </section>
  );
}
