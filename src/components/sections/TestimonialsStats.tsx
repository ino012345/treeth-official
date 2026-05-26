import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { Star } from "@phosphor-icons/react/dist/ssr";

// ─── Stats data ───────────────────────────────────────────────────────────────

const STATS = [
  {
    value: "5.0 / 5.0",
    en: "Client Satisfaction",
    ja: "全案件で最高評価を獲得",
  },
  {
    value: "100%",
    en: "On-Time Delivery",
    ja: "納期厳守・迅速な対応を徹底",
  },
  {
    value: "多数",
    en: "Completed Projects",
    ja: "豊富なWeb制作プロジェクト実績",
  },
];

// ─── Testimonials data ────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote:
      "内容や完成イメージに関して、ぼんやりしている時点での依頼でしたが、丁寧に意見を吸い上げていただきとても素晴らしいHPを作成していただくことができました。・クオリティ→大変満足。洗練されており、イメージ以上のものを作成していただきました。・コミュニケーション→迅速かつ丁寧に対応いただきました。・修正対応→丁寧かつ適切に対応いただきました。・スピード感→大変迅速にお作りいただきました。他にも色々とご要望に対応いただき、大変感謝しております。ぜひ知人にも勧めたいWebデザイナーさんです。",
    name: "クライアント様（コーポレートサイト）",
    role: "事業オーナー",
  },
  {
    quote:
      "最初から最後まで、親切丁寧に対応していただき、安心してお任せできました。技術面はもちろん、デザイン面でも高いスキルをお持ちで、とても素敵なHPを作っていただくことができました。画像の選定もお手伝いいただいたのですが、イメージにピッタリの（むしろ、想像以上の！）画像をご提案いただき、大変助かりました。treethさんに依頼させていただくことができ、本当に良かったです。また是非、お世話になりたいと思います。",
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
              数多くのプロジェクトで最高評価を獲得。
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
