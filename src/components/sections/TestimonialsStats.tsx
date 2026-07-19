import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { Marquee } from "@/components/ui/Marquee";
import { Star, ArrowRight } from "@phosphor-icons/react/dist/ssr";

// ─── Stats data (rendered as a reverse marquee band) ──────────────────────────

const STATS = [
  { value: "5.0 / 5.0", en: "Client Satisfaction", starred: true },
  { value: "Strategic", en: "Business-First Design", starred: false },
  { value: "Seamless", en: "End-to-End Experience", starred: false },
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
    <section className="py-24 md:py-32 bg-[var(--background)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8">
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
        </AnimatedSection>
      </div>

      {/* ── Stats band: reverse-direction marquee (full-bleed) ──────────── */}
      <Marquee reverse duration={26} className="mb-16 md:mb-20 border-y border-zinc-900 py-6">
        {STATS.map(({ value, en, starred }) => (
          <span key={en} className="flex items-center">
            {starred && (
              <Star size={22} weight="fill" className="text-amber-400 ml-6 mr-3 shrink-0" />
            )}
            <span
              className={`text-2xl md:text-3xl font-bold tracking-tighter text-gradient-accent ${starred ? "" : "pl-6"}`}
            >
              {value}
            </span>
            <span className="text-xs md:text-sm font-medium tracking-widest uppercase text-zinc-500 pl-4">
              {en}
            </span>
            <span className="text-2xl text-zinc-800 pl-6 select-none" aria-hidden="true">
              ·
            </span>
          </span>
        ))}
      </Marquee>

      <div className="mx-auto max-w-[1400px] px-6 md:px-8">
        <AnimatedSection>

          {/* ── Testimonials row ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TESTIMONIALS.map(({ quote, name, role }) => (
              <AnimatedItem key={name}>
                <div className="card-surface p-7 h-full flex flex-col gap-5 relative overflow-hidden">

                  {/* Oversized decorative quote mark */}
                  <span
                    className="absolute top-1 left-4 text-[80px] leading-none font-serif text-indigo-500/20 select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>

                  {/* 5-star rating */}
                  <div className="flex items-center gap-1 relative z-10 pt-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} weight="fill" className="text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-zinc-300 leading-relaxed flex-1 relative z-10">
                    &ldquo;{quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-800 relative z-10">
                    <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg font-black">
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
