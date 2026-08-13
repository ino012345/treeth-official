import type { Metadata } from "next";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | TREETH",
  description: "特定商取引法に基づく表記です。",
};

const ROWS = [
  { label: "事業者名", value: "TREETH" },
  {
    label: "所在地・電話番号",
    value:
      "個人事業のため、所在地・電話番号はサイト上には掲載しておりません。お問い合わせフォームよりご請求いただいた場合、遅滞なく開示いたします。",
  },
  {
    label: "連絡先",
    value: "お問い合わせフォームよりご連絡ください。",
  },
  {
    label: "販売価格",
    value:
      "個別お見積もり制です。ご要望・サイト規模に応じてお見積もりのうえご案内いたします。表示価格以外の追加料金は原則発生しませんが、独自ドメインの取得をご希望の場合はドメイン取得・更新費用が別途発生します。",
  },
  {
    label: "お支払い方法",
    value: "銀行振込のみ（振込手数料はお客様のご負担となります）",
  },
  {
    label: "お支払い時期",
    value:
      "ご契約時に着手金として料金の50%、成果物のご確認後・公開前に残金50%をお支払いいただきます。",
  },
  {
    label: "役務の提供時期",
    value:
      "ご契約後、目安として4〜8週間で納品いたします（サイトの規模・仕様により変動するため、正式なスケジュールは個別お見積もり時にご案内します）。",
  },
  {
    label: "キャンセル・返金について",
    value:
      "ご契約成立後、制作に着手した時点以降のお客様都合によるキャンセルはお受けできません。お支払い済みの料金の返金にも応じられませんので、あらかじめご了承ください。",
  },
  {
    label: "動作環境",
    value: "納品物は主要なモダンブラウザ（Chrome・Safari・Edge等の最新版）での閲覧を前提としています。",
  },
];

export default function TokushohoPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-6 pt-32 pb-24 md:px-8 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-3xl">
        <EyebrowBadge>LEGAL NOTICE</EyebrowBadge>
        <h1 className="mt-4 mb-2 text-3xl md:text-5xl font-semibold tracking-tighter text-zinc-50">
          特定商取引法に基づく表記
        </h1>
        <p className="mb-12 text-sm text-zinc-500">最終更新日：2026年7月25日</p>

        <div className="card-surface divide-y divide-zinc-800 overflow-hidden">
          {ROWS.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-1 gap-2 p-6 md:grid-cols-[10rem_1fr] md:gap-6 md:p-7">
              <p className="text-sm font-semibold text-zinc-50">{label}</p>
              <p className="text-sm md:text-base leading-relaxed text-zinc-300">{value}</p>
            </div>
          ))}
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
