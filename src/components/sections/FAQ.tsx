"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { CaretDown } from "@phosphor-icons/react";

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "サイトの制作期間はどのくらいですか？",
    a: "プロジェクトの規模や要件によりますが、通常LP（ランディングページ）で1〜2ヶ月、コーポレートサイトで2.5〜3ヶ月程度を頂戴しております。丁寧なヒアリングと戦略設計を行うため、余裕を持ったスケジュールをご提案しています。",
  },
  {
    q: "スクロール連動の3Dアニメーションは、スマートフォンでも重くなりませんか？",
    a: "問題ありません。当方の実装は、リアルタイムの3Dレンダリングではなく「事前に書き出した画像シーケンス」を使用します。さらに、GPUアクセラレーションや高度なスロットリング処理を組み合わせることで、スマートフォンでも極めて滑らかに動作します。",
  },
  {
    q: "公開後の運用や保守・更新もお願いできますか？",
    a: "はい、可能です。サイト公開後の定期的なアップデート、セキュリティ保守、コンテンツ追加など、お客様のビジネスの成長フェーズに合わせた運用サポートプランをご用意しております。",
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
            <p className="text-zinc-400 text-lg leading-relaxed max-w-[48ch]">
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
                        "rounded-xl transition-colors duration-200",
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
                        className="flex-shrink-0 text-zinc-400"
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
                          <p className="px-5 pb-6 pt-1 text-sm text-zinc-400 leading-relaxed">
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
