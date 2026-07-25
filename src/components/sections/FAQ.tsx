"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { CaretDown } from "@phosphor-icons/react";

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "ITの知識が全くないのですが、すべて丸投げでも大丈夫ですか？",
    a: "はい、もちろんです！専門知識は一切不要です。簡単なヒアリングシートへのご回答と、掲載したい文章・画像をご用意いただくだけで、面倒なサーバー設定やネット上への公開作業もすべてこちらで代行いたします。安心してすべてお任せください。",
  },
  {
    q: "納品後、毎月の「維持費」などは本当にかからないのでしょうか？",
    a: "はい、最新の高性能なクラウドサーバー（Vercel等）を使用するため、毎月のサーバー代やシステムの保守費用は「永久に0円」です。（※ご自身の会社名が入ったオリジナルURL「〇〇.com」等の取得をご希望される場合のみ、ドメイン取得・更新費用として年間1,500円〜4,000円程度が別途発生いたします。）",
  },
  {
    q: "今のサイトはWordPressで作られているのですが、TREETHにリニューアルを依頼すると何が変わりますか？",
    a: "ご要望や運用スタイルに応じて、最適な技術をご提案いたします。表示スピードやセキュリティ、リッチなアニメーションを特に重視される場合は、Next.jsやAstroなど最新のフロントエンド技術による軽量な実装がおすすめで、爆速サイトを実現できます。もちろんWordPressでの制作にも対応しておりますので、既存サイトの雰囲気を活かしたリニューアルなどもお気軽にご相談ください。",
  },
  {
    q: "納品後に自分でお知らせやブログの更新をすることはできますか？",
    a: "はい、可能です。直感的に操作できる専用の管理システム（microCMS）をご用意いたしますので、スマホやPCからブログ感覚で簡単に記事を作成・公開していただけます。なお、トップページ等の「基本デザイン部分」の改修は専門のコード編集が必要となるため、ご依頼いただければ迅速かつ安価に対応いたします。",
  },
  {
    q: "スマートフォン対応（レスポンシブ）やお問い合わせフォームは別料金ですか？",
    a: "いいえ、どちらも基本料金内に含まれております。現在のWeb閲覧の8割以上を占めるスマートフォンでの見やすさを最優先（スマホファースト）で美しく設計し、スパム対策を施した使いやすいお問い合わせフォームも標準で実装して納品いたします。",
  },
];

const SPRING = { type: "spring" as const, stiffness: 200, damping: 25 };

// ─── Component ────────────────────────────────────────────────────────────────

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="px-6 py-24 md:px-8 md:py-32 bg-[var(--background)]">
      <div className="mx-auto max-w-[1400px]">
        <AnimatedSection>

          {/* ── Section header ──────────────────────────────────────────── */}
          <AnimatedItem className="mb-12 md:mb-16 flex flex-col items-center gap-4 text-center">
            <EyebrowBadge>FAQ</EyebrowBadge>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-zinc-50 max-w-[22ch] leading-[1.1]">
              よくあるご質問
            </h2>
            <p className="text-zinc-300 text-lg leading-relaxed max-w-[48ch]">
              ご依頼前に気になる点を、まとめてお答えします。
            </p>
          </AnimatedItem>

          {/* ── Accordion list ───────────────────────────────────────────── */}
          <AnimatedItem>
            <div className="max-w-3xl mx-auto divide-y divide-zinc-800 border-y border-zinc-800">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={index}>
                    {/* Question row */}
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className={[
                        "w-full flex items-center justify-between gap-6 px-5 py-5 text-left",
                        "rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70",
                        isOpen ? "bg-zinc-800/50" : "hover:bg-zinc-800/30",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "text-base font-semibold leading-snug transition-colors duration-200",
                          isOpen ? "text-zinc-50" : "text-zinc-300",
                        ].join(" ")}
                      >
                        {item.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={SPRING}
                        className="flex-shrink-0 text-zinc-300"
                      >
                        <CaretDown size={18} weight="bold" />
                      </motion.span>
                    </button>

                    {/* Answer panel */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={SPRING}
                          style={{ overflow: "hidden" }}
                        >
                          <p className="px-5 pb-6 pt-1 text-sm text-zinc-300 leading-relaxed">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </AnimatedItem>

        </AnimatedSection>
      </div>
    </section>
  );
}
