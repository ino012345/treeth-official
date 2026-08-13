import type { Metadata } from "next";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";

export const metadata: Metadata = {
  title: "プライバシーポリシー | TREETH",
  description: "TREETHにおける個人情報の取り扱いについて説明します。",
};

const SECTIONS = [
  {
    heading: "1. 基本方針",
    body: "TREETH（以下「当方」）は、本ウェブサイト（以下「本サイト」）をご利用いただくお客様の個人情報を大切に取り扱います。本ポリシーは、本サイトで取得する情報の範囲と利用目的、管理方法について定めるものです。",
  },
  {
    heading: "2. 取得する情報",
    body: "本サイトでは、お問い合わせフォームをご利用いただいた際に、お名前・メールアドレス・お問い合わせ内容をご入力いただきます。これらはお客様が任意に送信された情報のみを取得し、フォーム以外の方法で本サイトが個人情報を収集することはありません。",
  },
  {
    heading: "3. 利用目的",
    body: "取得した情報は、お問い合わせへの回答、お見積もりのご案内、ご依頼いただいたプロジェクトに関するご連絡のためにのみ利用します。事前の同意なく、これら以外の目的で利用することはありません。",
  },
  {
    heading: "4. 第三者提供・外部委託",
    body: "取得した情報を第三者に販売・貸与することはありません。ただし、お問い合わせ内容を当方宛に送信するためのメール配信サービスとして Resend, Inc. を、本サイトのホスティング基盤として Vercel Inc. を利用しており、これらのサービス提供に必要な範囲でデータが処理されます。各社は独自のプライバシーポリシーに基づき、業務委託の範囲内でのみ情報を取り扱います。",
  },
  {
    heading: "5. Cookie・アクセス解析について",
    body: "本サイトは、現時点で Cookie やアクセス解析ツール（Google アナリティクス等）を使用しておりません。将来的に導入する場合は、本ポリシーを改定のうえ、本ページにてお知らせします。",
  },
  {
    heading: "6. データの保管について",
    body: "お問い合わせフォームから送信された内容は、当方宛のメールとして通知される形で処理され、本サイトのデータベースに保存されることはありません。対応完了後、不要となった情報は適切に廃棄します。",
  },
  {
    heading: "7. 安全管理措置",
    body: "本サイトは通信の暗号化（HTTPS）に対応しており、情報の送受信における第三者による盗聴・改ざんを防止する措置を講じています。",
  },
  {
    heading: "8. 開示・訂正・削除等のご請求",
    body: "ご自身の情報の開示・訂正・削除等をご希望の場合は、お問い合わせフォームよりご連絡ください。本人確認のうえ、法令に従い速やかに対応いたします。",
  },
  {
    heading: "9. ポリシーの改定",
    body: "本ポリシーの内容は、必要に応じて予告なく変更する場合があります。変更後の内容は本ページに掲載した時点で効力を生じるものとします。",
  },
  {
    heading: "10. お問い合わせ窓口",
    body: "本ポリシーに関するお問い合わせは、本サイトのお問い合わせフォームよりお願いいたします。",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-6 pt-32 pb-24 md:px-8 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-3xl">
        <EyebrowBadge>PRIVACY POLICY</EyebrowBadge>
        <h1 className="mt-4 mb-2 text-3xl md:text-5xl font-semibold tracking-tighter text-zinc-50">
          プライバシーポリシー
        </h1>
        <p className="mb-12 text-sm text-zinc-500">最終更新日：2026年7月25日</p>

        <div className="flex flex-col gap-10">
          {SECTIONS.map(({ heading, body }) => (
            <section key={heading}>
              <h2 className="mb-3 text-lg font-semibold text-zinc-50">{heading}</h2>
              <p className="text-sm md:text-base leading-relaxed text-zinc-300">{body}</p>
            </section>
          ))}
        </div>

        <div className="mt-16">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← トップへ戻る
          </a>
        </div>
      </div>
    </main>
  );
}
