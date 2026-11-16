import {
  Bullets,
  InlineLink,
  LegalFooterLinks,
  LegalPage,
  LegalPart,
  LegalSection,
  MailLink,
} from "@/components/legal/Legal";
import { ThreadsAppPolicy } from "@/components/legal/ThreadsAppPolicy";
import type { ThreadsAppFacts } from "@/lib/threads-app";

/**
 * Part A is the policy for the web production business as published on
 * 2026-09-23. Its wording is kept; only the numbering (A-n), the
 * cross-reference in A-2 and "この部は" in A-1 changed, and A-9 / C-2 gained
 * the e-mail address. A-10 (countries of the overseas services, PPC Q&A 10-25)
 * was added. tests/privacy-pages.test.mjs checks the clauses survive.
 *
 * Japanese copy is kept on one line per paragraph: JSX joins wrapped text
 * lines with a space, which would put stray spaces between sentences.
 */
export const WEB_SECTIONS = [
  {
    heading: "A-1. 基本方針",
    body: "TREETH（以下「当方」）は、本ウェブサイト（以下「本サイト」）をご利用いただくお客様の個人情報を大切に取り扱います。この部は、本サイトで取得する情報の範囲と利用目的、管理方法について定めるものです。",
  },
  {
    heading: "A-2. 取得する情報",
    body: "お客様に直接ご入力いただく情報は、お問い合わせフォームのお名前・メールアドレス・お問い合わせ内容のみです。当方がこれら以外の個人情報をお客様にご入力いただくことはありません。なお、本サイトの表示にあたっては、ホスティング事業者およびアクセス解析において、IPアドレス・ブラウザの種類・参照元URLといった技術的な通信情報が自動的に処理されます。詳細はA-5・A-6をご覧ください。",
  },
  {
    heading: "A-3. 利用目的",
    body: "取得した情報は、お問い合わせへの回答、お見積もりのご案内、ご依頼いただいたプロジェクトに関するご連絡のためにのみ利用します。事前の同意なく、これら以外の目的で利用することはありません。",
  },
  {
    heading: "A-4. 第三者提供・外部委託",
    body: "取得した情報を第三者に販売・貸与することはありません。ただし、お問い合わせ内容を当方宛に送信するためのメール配信サービスとして Resend, Inc. を、本サイトのホスティング基盤として Vercel Inc. を利用しており、これらのサービス提供に必要な範囲でデータが処理されます。各社は独自のプライバシーポリシーに基づき、業務委託の範囲内でのみ情報を取り扱います。",
  },
  {
    heading: "A-5. アクセス解析（Vercel Web Analytics）について",
    body: "本サイトでは、どのページがどの程度閲覧されているかを把握し、サイトの改善に役立てる目的で、Vercel Inc. が提供する Vercel Web Analytics を利用しています。同サービスは Cookie を使用せず、訪問者を個人として識別したり、他サイトをまたいで行動を追跡したりすることはありません。取得されるのは、閲覧されたページのURL・参照元（リンク元）・おおまかな地域・ブラウザや端末の種別といった情報で、これらは匿名化された集計データとして扱われます。当方が閲覧データからお客様個人を特定することはできません。取り扱いの詳細は Vercel 社の公表するドキュメントおよびプライバシーポリシーをご確認ください。",
  },
  {
    heading: "A-6. ホスティングに伴う通信情報の処理",
    body: "本サイトは Vercel Inc. のホスティング基盤上で提供されています。ウェブサイトの提供に必要な範囲で、IPアドレスやリクエスト日時などの通信ログが同社側で処理されます。これはウェブサイトを表示するうえで技術的に発生するもので、当方がこれらのログを閲覧・保管して個人の特定に用いることはありません。",
  },
  {
    heading: "A-7. データの保管について",
    body: "お問い合わせフォームから送信された内容は、当方宛のメールとして通知される形で処理され、本サイトのデータベースに保存されることはありません。対応完了後、不要となった情報は適切に廃棄します。",
  },
  {
    heading: "A-8. 安全管理措置",
    body: "本サイトは通信の暗号化（HTTPS）に対応しており、情報の送受信における第三者による盗聴・改ざんを防止する措置を講じています。",
  },
];

export function PrivacyPolicy({ app, updatedOn }: { app: ThreadsAppFacts; updatedOn: string }) {
  const contact = app.deletionContact;

  return (
    <LegalPage eyebrow="PRIVACY POLICY" title="プライバシーポリシー" updatedOn={updatedOn}>
      <div className="card-surface flex flex-col gap-4 p-6 md:p-7 text-sm md:text-base leading-relaxed text-zinc-300">
        <p>{`本ポリシーは、${app.operatorPublicName}（以下「当方」）が運営する次の2つにおける情報の取り扱いを定めます。`}</p>
        <Bullets
          items={[
            <>
              <InlineLink href="#web">A. Web制作事業「TREETH」と本ウェブサイト</InlineLink>
              （お問い合わせフォーム・アクセス解析など）
            </>,
            <>
              <InlineLink href="#threads-app">B. Threadsの商品トレンド調査・投稿支援ツール</InlineLink>
              （Threads の公開投稿の検索と、当方のThreadsアカウントの運用に使う内部ツール）
            </>,
          ]}
        />
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-[9rem_1fr]">
          <dt className="font-semibold text-zinc-50">運営者</dt>
          <dd>{`${app.operatorPublicName}。A と B は同じ運営者が運用し、取得した情報の取り扱いに責任を負います。`}</dd>
          <dt className="font-semibold text-zinc-50">お問い合わせ窓口</dt>
          <dd>
            <InlineLink href="/#contact">お問い合わせフォーム</InlineLink>
            、または
            <MailLink address={contact} />
          </dd>
          <dt className="font-semibold text-zinc-50">データ削除のご依頼</dt>
          <dd>
            <InlineLink href="/data-deletion">データ削除のご案内</InlineLink>
            をご覧ください
          </dd>
        </dl>
      </div>

      <div className="mt-16">
        <LegalPart id="web" title="A. Web制作事業「TREETH」と本ウェブサイト">
          {WEB_SECTIONS.map(({ heading, body }) => (
            <LegalSection key={heading} heading={heading}>
              <p>{body}</p>
            </LegalSection>
          ))}
          <LegalSection heading="A-9. 開示・訂正・削除等のご請求">
            <p>
              ご自身の情報の開示・訂正・削除等をご希望の場合は、お問い合わせフォーム、または
              <MailLink address={contact} />
              よりご連絡ください。本人確認のうえ、法令に従い速やかに対応いたします。Threadsのツールに関する削除のご依頼は、B-9 と
              <InlineLink href="/data-deletion">データ削除のご案内</InlineLink>
              をご覧ください。
            </p>
          </LegalSection>
          <LegalSection heading="A-10. 外国にある事業者による取り扱い">
            <p>お問い合わせの送信と受信では、次のとおり外国にある事業者のサービスを利用しています。</p>
            <Bullets
              items={[
                "Vercel Inc.（所在国：米国）：本サイトのホスティングと、お問い合わせの送信処理。処理を行うサーバーの所在国は米国です（表示の配信のため、世界各地の拠点を経由することがあります）。",
                "Resend, Inc.（所在国：米国）：お問い合わせ内容を当方宛のメールとして送信します。送信を行うサーバーの所在国は米国です。",
                "受信したメールの保管：米国の事業者が提供するメールサービスを利用しています。保管先のサーバーの所在国は、事業者が国を特定して公表していないため特定できません（米国を含む複数の国が考えられます）。",
              ]}
            />
            <p>
              当方は、各事業者が公表している安全管理措置（通信および保存時の暗号化など）を確認したうえで利用しています。米国の個人情報の保護に関する制度については、個人情報保護委員会が公表している
              <InlineLink href="https://www.ppc.go.jp/personalinfo/legal/kaiseihogohou/#gaikoku">外国における個人情報の保護に関する制度等の調査</InlineLink>
              をご覧ください。
            </p>
          </LegalSection>
        </LegalPart>

        <div className="mt-16">
          <ThreadsAppPolicy app={app} />
        </div>

        <div className="mt-16">
          <LegalPart id="common" title="C. 共通事項">
            <LegalSection heading="C-1. ポリシーの改定">
              <p>
                本ポリシーの内容は、必要に応じて予告なく変更する場合があります。変更後の内容は本ページに掲載した時点で効力を生じるものとします。改定した場合は本ページの最終更新日を更新し、Threadsのツールの保存期間など重要な変更は本ページでお知らせします。
              </p>
            </LegalSection>
            <LegalSection heading="C-2. お問い合わせ窓口">
              <p>
                本ポリシーに関するお問い合わせ（苦情のお申し出を含みます）は、本サイトのお問い合わせフォーム、または
                <MailLink address={contact} />
                までお願いいたします。
              </p>
            </LegalSection>
            {app.operatorIdentityMethod === "on_request" && (
              <LegalSection heading="C-3. 事業者の氏名・住所">
                <p>
                  {`当方（${app.operatorPublicName}）は個人で運営しています。運営者の氏名および住所は、ご請求があった場合に遅滞なくお知らせします。上記の窓口までご連絡ください。`}
                </p>
              </LegalSection>
            )}
          </LegalPart>
        </div>

        <section id="english" lang="en" aria-labelledby="english-title" className="mt-16 scroll-mt-28">
          <h2
            id="english-title"
            className="mb-4 border-b border-zinc-800 pb-3 text-xl md:text-2xl font-semibold tracking-tight text-zinc-50"
          >
            English summary
          </h2>
          <div className="flex flex-col gap-3 text-sm md:text-base leading-relaxed text-zinc-300">
            <p>
              This policy is published by TREETH, which runs (A) a web production business and this website, and
              (B) an internal Threads tool for product-trend research and post planning, used only by TREETH to
              manage its own Threads account. The Japanese text above is authoritative.
            </p>
            <Bullets
              items={[
                <>
                  <strong className="text-zinc-50">Website:</strong> the contact form collects your name, e-mail
                  address and message, which are delivered to us by e-mail (Resend) and used only to reply. Hosting
                  (Vercel) and cookieless analytics (Vercel Web Analytics) process technical request data. Vercel
                  and Resend are US companies and process enquiries on servers in the United States; received mail
                  is stored with a mail service run by a US company that does not publish the countries of its
                  servers.
                </>,
                <>
                  <strong className="text-zinc-50">Threads tool — what and why:</strong> through the official
                  Threads API keyword search, the tool collects public posts (post ID, username, text, timestamp,
                  permalink and link URLs) to find products being discussed, extract Amazon product IDs (ASINs),
                  choose products and plan our own original posts. We never republish others&apos; posts,
                  impersonate anyone, profile individuals, reuse others&apos; affiliate links or contact authors.
                </>,
                <>
                  <strong className="text-zinc-50">Storage and retention:</strong> data is stored in a database on
                  a computer managed by the operator and in its backups — never on this website. Our retention limit
                  for collected post data is {app.retentionDays} days.
                  {app.retentionStatus === "active"
                    ? ` It is normally deleted after ${app.internalDeleteDays} days by a job that runs ${app.runsPerDay} times a day. Derived data and backups follow the same limit; keyword-level counts that identify nobody are kept for up to ${app.aggregateMonths} months.`
                    : " Automated deletion is being prepared and is not yet running, so data collected so far (including backups) has not been deleted automatically. This page will be updated when it is running."}
                </>,
                <>
                  <strong className="text-zinc-50">Sharing:</strong> never sold or shared. Others&apos; post text,
                  usernames and URLs are not sent to AI services.
                </>,
                <>
                  <strong className="text-zinc-50">Deletion and other requests:</strong> e-mail{" "}
                  <MailLink address={contact} /> — see the{" "}
                  <InlineLink href="/data-deletion#english">data deletion instructions</InlineLink>. A public post
                  URL alone is not proof of identity. We delete promptly after verification (at the latest within
                  30 days), including derived data and backups. On Meta&apos;s request or if the tool is
                  discontinued, all data obtained from the Threads API is deleted.
                </>,
                <>
                  <strong className="text-zinc-50">Advertising:</strong> we participate in the Amazon Associates
                  Program; posts are labelled #PR and replies containing links carry the Associates disclosure.
                </>,
              ]}
            />
          </div>
        </section>
      </div>

      <LegalFooterLinks links={[{ href: "/data-deletion", label: "データ削除のご案内 →" }]} />
    </LegalPage>
  );
}
