import {
  Bullets,
  InlineLink,
  LegalFooterLinks,
  LegalPage,
  LegalPart,
  LegalSection,
  MailLink,
} from "@/components/legal/Legal";
import type { ThreadsAppFacts } from "@/lib/threads-app";

export const THREADS_SUBJECT = "【データ削除依頼】Threadsツール";
export const WEB_SUBJECT = "【データ削除依頼】お問い合わせ内容";

/**
 * Public instructions for deletion requests — the page meant for the Data
 * Deletion Instructions URL in the Meta App Dashboard. The operator-side
 * procedure it promises is the tool's DATA_DELETION_REQUEST_RUNBOOK; the
 * timings here must not be looser than the policy's B-9.
 *
 * The operator's Threads handle is not published, so the identity check asks
 * the requester to act from their own account and tells them our account in
 * the reply e-mail rather than on this page.
 *
 * Japanese copy is kept on one line per paragraph: JSX joins wrapped text
 * lines with a space, which would put stray spaces between sentences.
 */
export function DataDeletion({ app, updatedOn }: { app: ThreadsAppFacts; updatedOn: string }) {
  const tool = app.serviceShort;
  const contact = app.deletionContact;

  return (
    <LegalPage eyebrow="DATA DELETION" title="データ削除のご案内" updatedOn={updatedOn}>
      <div className="card-surface flex flex-col gap-4 p-6 md:p-7 text-sm md:text-base leading-relaxed text-zinc-300">
        <p>
          {`${app.operatorPublicName}が保存しているあなたの情報の削除を、メールでご依頼いただけます。ログインや会員登録は不要です。`}
        </p>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-[9rem_1fr]">
          <dt className="font-semibold text-zinc-50">対象のサービス</dt>
          <dd>{`${app.serviceLabel}／本サイトのお問い合わせフォーム`}</dd>
          <dt className="font-semibold text-zinc-50">運営者</dt>
          <dd>{app.operatorPublicName}</dd>
          <dt className="font-semibold text-zinc-50">ご依頼の窓口</dt>
          <dd>
            <MailLink address={contact} subject={THREADS_SUBJECT} />
          </dd>
          <dt className="font-semibold text-zinc-50">取り扱いの詳細</dt>
          <dd>
            <InlineLink href="/privacy#threads-app">プライバシーポリシー（B. Threadsの商品トレンド調査・投稿支援ツール）</InlineLink>
          </dd>
        </dl>
      </div>

      <div className="mt-16">
        <LegalPart id="scope" title="1. 対象のサービスと削除できる情報">
          <LegalSection heading="1-1. Threadsの商品トレンド調査・投稿支援ツール">
            <p>
              {`${app.serviceLabel}（以下「${tool}」）は、${app.operatorPublicName}が自分のThreadsアカウントを運用するために使う内部ツールです。Meta の公式 Threads API のキーワード検索で取得した公開投稿の情報を保存しています。他の方がログインして使うサービスではないため、ログインに伴って保存している情報はありません。`}
            </p>
            <p>あなたの公開投稿について、次の情報を削除できます。</p>
            <Bullets
              items={[
                "投稿ID、ユーザー名、投稿の本文、投稿日時、投稿のURL、投稿に含まれるリンク先のURL",
                "その投稿を見つけた検索の記録（検索語ごとの検索結果での順位など）",
                "その投稿から派生した情報（投稿から推定した商品名・ブランド名の候補、短縮URLに由来する識別子、投稿と商品の対応、商品ごとの件数への反映）",
                "バックアップに含まれる、上記と同じ情報",
              ]}
            />
            {app.retentionStatus === "active" ? (
              <p>
                {`取得から${app.retentionDays}日を過ぎた情報は、ご依頼がなくても削除しています。その場合は「保存していない」旨をお知らせします。`}
              </p>
            ) : (
              <p>
                {`保存期間（取得から${app.retentionDays}日）による自動削除は導入の準備中で、まだ稼働していません。それまでの間も、ご依頼いただいた情報は個別に削除します。`}
              </p>
            )}
            <p>削除のほか、保存している情報の開示・訂正・利用停止のご請求も、同じ窓口で受け付けます。</p>
          </LegalSection>
          <LegalSection heading="1-2. 本サイトのお問い合わせフォーム">
            <p>
              お問い合わせフォームから送信されたお名前・メールアドレス・お問い合わせ内容（当方宛のメールとして受け取ったもの）を削除できます。
            </p>
          </LegalSection>
        </LegalPart>
      </div>

      <div className="mt-16">
        <LegalPart id="how" title="2. ご依頼の方法">
          <LegalSection heading="2-1. メールでご連絡ください">
            <p>
              宛先：
              <MailLink address={contact} subject={THREADS_SUBJECT} />
            </p>
            <p>件名の例：</p>
            <Bullets items={[THREADS_SUBJECT, WEB_SUBJECT]} />
          </LegalSection>
          <LegalSection heading="2-2. 本文に書いていただくこと（Threadsのツールの場合）">
            <Bullets
              items={[
                "対象の Threads のユーザー名（投稿した時点のもの。その後変更された場合は、現在のものも）",
                "対象の投稿のURL（複数可。threads.net・threads.com のどちらの形式でも構いません。すべての投稿が対象の場合はその旨）",
                "返信先のメールアドレス（送信元のアドレスと同じであれば不要です）",
              ]}
            />
            <p>
              ユーザー名を変更されている場合、ユーザー名だけでは投稿を特定できないことがあります。投稿のURLもお知らせください。お名前・ご住所・電話番号・身分証明書は必要ありません。
            </p>
          </LegalSection>
          <LegalSection heading="2-3. 本文に書いていただくこと（お問い合わせフォームの場合）">
            <p>お問い合わせの際に入力したメールアドレスから、送信したおおよその日付をお知らせください。</p>
          </LegalSection>
        </LegalPart>
      </div>

      <div className="mt-16">
        <LegalPart id="verification" title="3. ご本人確認">
          <LegalSection heading="3-1. 投稿のURLだけでは本人確認になりません">
            <p>
              公開投稿のURLやユーザー名は誰でも知ることができるため、それらを示していただくだけでは、ご本人からのご依頼であることを確認できません。他の方の投稿の削除を、ご本人の確認なしに行うことはありません。
            </p>
          </LegalSection>
          <LegalSection heading="3-2. 確認の方法">
            <p>
              ご依頼を受け付けると、受付番号をメールでお知らせします。対象の Threads アカウントから、次のいずれかの方法でその受付番号をお示しください。
            </p>
            <Bullets
              items={[
                "対象のアカウントのプロフィール（自己紹介欄）に、受付番号を一時的に記載する（確認が終わったら消していただいて構いません）",
                "対象のアカウントから、当方のThreadsアカウントへのメッセージで受付番号を送る（当方のアカウントは受付のメールでお知らせします。メッセージを送れる場合に限ります）",
              ]}
            />
            <p>
              アカウントを削除済みの場合など、上記の方法が難しい場合はご相談ください。お問い合わせフォームの内容については、お問い合わせの際に入力したメールアドレスからのご連絡で確認します。
            </p>
          </LegalSection>
        </LegalPart>
      </div>

      <div className="mt-16">
        <LegalPart id="timeline" title="4. 処理の目安と完了のご連絡">
          <LegalSection heading="4-1. 処理の目安">
            <Bullets
              items={[
                "受付のご返信：通常2営業日以内",
                `削除の処理：ご本人確認の完了後、原則${app.responseTargetBusinessDays}営業日以内に行うことを当方の目標としています`,
                <>
                  遅くとも、ご本人確認の完了から
                  <strong className="text-zinc-50">30日以内</strong>
                  に削除し、完了をご連絡します
                </>,
                "保存期間の経過を待たずに削除します。派生した情報とバックアップに含まれる分も削除の対象です",
              ]}
            />
          </LegalSection>
          <LegalSection heading="4-2. 完了のご連絡">
            <Bullets
              items={[
                "ご依頼いただいたメールアドレスへ、削除が完了したことと削除した件数（該当する情報がなかった場合はその旨）をお知らせします",
                "当方の対応記録には、受付番号・日付・件数だけを残し、あなたのユーザー名や投稿の情報は残しません",
                "ご依頼のやり取りのメールは、完了のご連絡の後、対応の確認に必要な期間を過ぎたら削除します",
              ]}
            />
          </LegalSection>
          <LegalSection heading="4-3. Meta から求められた場合・本ツールの利用終了">
            <p>
              {`Meta から削除を求められた場合は、その指示に従って削除します。${tool}の利用を終了する場合は、${tool}が Threads API から取得したすべての情報（派生した情報とバックアップに含まれる分を含みます）を削除します。`}
            </p>
          </LegalSection>
        </LegalPart>
      </div>

      <section id="english" lang="en" aria-labelledby="english-title" className="mt-16 scroll-mt-28">
        <h2
          id="english-title"
          className="mb-4 border-b border-zinc-800 pb-3 text-xl md:text-2xl font-semibold tracking-tight text-zinc-50"
        >
          Data deletion instructions (English)
        </h2>
        <div className="flex flex-col gap-3 text-sm md:text-base leading-relaxed text-zinc-300">
          <p>
            TREETH&apos;s internal Threads tool for product-trend research and post planning stores public Threads
            posts found through the official Threads API keyword search. No one else logs in to the tool, so no
            login data is stored.
          </p>
          <Bullets
            items={[
              <>
                <strong className="text-zinc-50">How to request:</strong> e-mail{" "}
                <MailLink address={contact} subject="Data deletion request: Threads tool" /> with your Threads
                username (and your current one if you changed it) and the URLs of the posts concerned.
              </>,
              <>
                <strong className="text-zinc-50">Identity check:</strong> a public post URL alone is not proof of
                identity. We send you a reference number; please show it from the Threads account concerned (for
                example, temporarily in your profile bio).
              </>,
              <>
                <strong className="text-zinc-50">What is deleted:</strong> the stored post data, data derived from
                it, and copies in backups.
                {app.retentionStatus === "active"
                  ? ""
                  : " Automatic deletion after the retention period is not yet running; requested data is deleted individually in the meantime."}
              </>,
              <>
                <strong className="text-zinc-50">When:</strong> our target is within{" "}
                {app.responseTargetBusinessDays} business days after verification, and at the latest within 30 days.
                We confirm completion by e-mail and keep only a reference number, the date and counts.
              </>,
            ]}
          />
        </div>
      </section>

      <LegalFooterLinks links={[{ href: "/privacy#threads-app", label: "プライバシーポリシー →" }]} />
    </LegalPage>
  );
}
