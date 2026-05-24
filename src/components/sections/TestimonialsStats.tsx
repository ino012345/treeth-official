import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { Star } from "@phosphor-icons/react/dist/ssr";

// ─── Stats data ───────────────────────────────────────────────────────────────

const STATS = [
  {
    value: "250%",
    en: "Conversion Rate Increase",
    ja: "LPリニューアル後の最大CVR向上率",
  },
  {
    value: "50+",
    en: "Projects Delivered",
    ja: "立ち上げから手がけたプロジェクト数",
  },
  {
    value: "99%",
    en: "Client Satisfaction",
    ja: "クライアント満足度",
  },
];

// ─── Testimonials data ────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote:
      "新しいランディングページを公開してわずか1ヶ月で、コンバージョン率が250%向上しました。スクロールに連動する3Dアニメーションが非常に滑らかで、他社との圧倒的な差別化に繋がっています。",
    name: "クライアントA",
    role: "Tech Startup CEO",
  },
  {
    quote:
      "私たちのブランドアイデンティティを完璧に体現したコーポレートサイトになりました。ピクセルパーフェクトな美しいデザインはもちろん、Next.jsによる高速な表示スピードにも驚いています。",
    name: "クライアントB",
    role: "Marketing Director",
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
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-zinc-950 max-w-[22ch] leading-[1.1]">
              数字と声が証明する、
              <br />
              treethの実績
            </h2>
            <p className="text-zinc-500 text-lg leading-relaxed max-w-[48ch]">
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
                    <p className="text-[10px] font-medium tracking-widest uppercase text-zinc-400">
                      {en}
                    </p>
                    <p className="text-sm text-zinc-500 leading-relaxed">{ja}</p>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-indigo-100 to-violet-100 mt-auto pt-3" />
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
                  <p className="text-sm text-zinc-600 leading-relaxed flex-1">
                    &ldquo;{quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                    <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">
                        {name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-zinc-800">{name}</p>
                      <p className="text-[11px] text-zinc-400">{role}</p>
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
