import type { Metadata } from "next";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | TREETH",
  description: "特定商取引法に基づく表記の準備状況について。",
};

export default function TokushohoPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-6 pt-32 pb-24 md:px-8 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-3xl">
        <EyebrowBadge>LEGAL NOTICE</EyebrowBadge>
        <h1 className="mt-4 mb-2 text-3xl md:text-5xl font-semibold tracking-tighter text-zinc-50">
          特定商取引法に基づく表記
        </h1>
        <p className="mb-12 text-sm text-zinc-500">最終更新日：2026年7月25日</p>

        <div className="card-surface p-7 md:p-8">
          <p className="text-sm md:text-base leading-relaxed text-zinc-300">
            本ページは現在準備中です。事業者名・所在地・お支払い方法等の詳細は、
            準備が整い次第、本ページに掲載いたします。
            <br />
            <br />
            お急ぎでご確認が必要な場合は、お問い合わせフォームよりご連絡いただければ、
            個別にご案内いたします。
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <a
            href="/#contact"
            className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            お問い合わせフォームへ →
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← トップへ戻る
          </a>
        </div>
      </div>
    </main>
  );
}
