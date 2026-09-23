import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import {
  ChatCircleDots,
  ClipboardText,
  PenNib,
  ArrowsClockwise,
  RocketLaunch,
  Lifebuoy,
} from "@phosphor-icons/react/dist/ssr";

// ─── Process data ─────────────────────────────────────────────────────────────
// Rewritten from internal production phases (Strategy / Design & Development /
// Testing & Launch) into what the client actually experiences after making
// contact. First-time buyers ask "what happens if I send this form?" — this
// section is here to answer that, not to describe our workflow.
// See docs/uiux-audit.md §F.

const STEPS = [
  {
    Icon: ChatCircleDots,
    number: "01",
    title: "ご相談",
    description:
      "お問い合わせフォームからご連絡ください。内容が固まっていなくても構いません。「こんなサイトを作りたい」という段階からご相談いただけます。",
  },
  {
    Icon: ClipboardText,
    number: "02",
    title: "ヒアリング・ご提案",
    description:
      "目的やご要望、掲載したい内容を伺ったうえで、サイトの構成とお見積もりをご提示します。ご不明な点はこの段階で解消していただけます。",
  },
  {
    Icon: PenNib,
    number: "03",
    title: "デザイン・制作",
    description:
      "ご了承いただいた構成をもとに、デザインと実装を進めます。進捗は随時共有しますので、途中の状態もご確認いただけます。",
  },
  {
    Icon: ArrowsClockwise,
    number: "04",
    title: "ご確認・修正",
    description:
      "実際の画面をご覧いただきながら、文言やデザインを調整します。気になる点は遠慮なくお伝えください。",
  },
  {
    Icon: RocketLaunch,
    number: "05",
    title: "公開",
    description:
      "サーバーの設定や公開作業はこちらで代行します。専門的な操作をお客様に行っていただく必要はありません。",
  },
  {
    Icon: Lifebuoy,
    number: "06",
    title: "公開後のサポート",
    description:
      "公開後の修正や更新にも対応します。運用でお困りの際はご連絡ください。",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ProcessMethodology() {
  return (
    <section className="bg-[var(--background)] px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <AnimatedSection>
          <AnimatedItem className="mb-12 flex flex-col gap-4 md:mb-16">
            <EyebrowBadge>HOW IT WORKS</EyebrowBadge>
            <h2 className="max-w-[24ch] text-3xl font-semibold leading-[1.1] tracking-tighter text-zinc-50 md:text-5xl">
              ご相談から公開までの流れ
            </h2>
            <p className="max-w-[48ch] text-lg leading-relaxed text-zinc-300">
              お問い合わせをいただいた後、どのように進むのかをご説明します。
              初めてWebサイトを作る方にも分かるよう、専門的な作業はこちらで対応します。
            </p>
          </AnimatedItem>

          {/* Ordered list — the sequence is the message, so it is marked up as
              one. <li> stays a direct child of <ol>; the animation wrapper goes
              inside it, otherwise the list structure is invalid. */}
          <ol className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map(({ Icon, number, title, description }) => (
              <li key={number} className="h-full list-none">
                <AnimatedItem className="card-surface flex h-full flex-col gap-4 p-7">
                  <div className="flex items-center gap-3">
                    <div className="gradient-accent flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
                      <Icon size={22} weight="duotone" color="white" />
                    </div>
                    <span className="font-mono text-sm font-semibold tracking-widest text-zinc-400">
                      {number}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold tracking-tight text-zinc-50">
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-300">{description}</p>
                  </div>
                </AnimatedItem>
              </li>
            ))}
          </ol>
        </AnimatedSection>
      </div>
    </section>
  );
}
