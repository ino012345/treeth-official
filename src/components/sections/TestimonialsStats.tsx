import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { Star } from "@phosphor-icons/react/dist/ssr";

// ─── Stats data (Coconala実績ベース) ──────────────────────────────────────────

const STATS = [
  {
    value: "45件",
    en: "Completed Projects",
    ja: "Coconala累計制作実績",
  },
  {
    value: "5.0",
    en: "Coconala Rating",
    ja: "Coconala総合評価（満点）",
  },
  {
    value: "5年",
    en: "Web Design Experience",
    ja: "Web制作・デザイン経験年数",
  },
];

// ─── Testimonials data ────────────────────────────────────────────────────────
// ⚠️ 以下はプレースホルダーです。Coconalaの実際の口コミ文に差し替えてください。

const TESTIMONIALS = [
  {
    quote:
      "WordPressなしでこれほどの表示速度が出るとは思いませんでした。打ち合わせから公開まで丁寧にサポートしていただき、イメージ通りのコーポレートサイトが完成しました。運用コストも大幅に削減できて大満足です。",
    name: "クライアント様（コーポレートサイト）",
    role: "飲食店オーナー",
  },
  {
    quote:
      "LP公開後すぐに問い合わせが増え、効果をリアルに感じています。デザインのクオリティが高く、スマホでも見やすい仕上がりで大変喜んでいます。修正対応も迅速で、信頼してお任せできました。",
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
              Coconalaでの累計45件の制作実績、総合評価5.0。
              クライアントのビジネスに、確かな成果をお届けしてきました。
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
