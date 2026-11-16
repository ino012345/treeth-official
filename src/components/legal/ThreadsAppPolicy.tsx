import { Bullets, InlineLink, LegalPart, LegalSection, MailLink, Notice } from "@/components/legal/Legal";
import type { ThreadsAppFacts } from "@/lib/threads-app";

/**
 * Part B of /privacy. Must stay in step with what the tool does in production
 * and with the Meta App Review submission — see src/lib/threads-app.ts.
 *
 * Retention wording has two versions. "planned" is what can be published while
 * the deletion tooling is not yet running in production: it states the policy,
 * says plainly that the mechanism is not live, and describes what is happening
 * to data already collected. "active" is for after release gates A and B; it
 * describes the actual schedule. Switching the value does not by itself make
 * anything compliant — privacy:check refuses "active" without gate B.
 *
 * The app name and the Threads handle are deliberately not shown (approved
 * publication policy); the tool is identified by what it is and who runs it.
 *
 * Japanese copy is kept on one line per paragraph: JSX joins wrapped text
 * lines with a space, which would put stray spaces between sentences.
 */
export function ThreadsAppPolicy({ app }: { app: ThreadsAppFacts }) {
  const active = app.retentionStatus === "active";
  const tool = app.serviceShort;

  return (
    <LegalPart
      id="threads-app"
      title="B. Threadsの商品トレンド調査・投稿支援ツール"
      lead={
        <p>
          {`この部は、${app.serviceLabel}（以下「${tool}」）が、Meta の Threads API を通じて取得する情報の取り扱いを定めます。${tool}は本サイトとは別に動作し、取得した情報を本サイト・ホスティング事業者・お問い合わせフォームの仕組みに保存することはありません。`}
        </p>
      }
    >
      <LegalSection heading="B-1. 対象のツールと運営者">
        <Bullets
          items={[
            `対象：${app.serviceLabel}。Meta for Developers に登録した当方のアプリを通じて Threads API を利用します`,
            "運用するThreadsアカウント：当方が運営するThreadsアカウント1つのみ",
            `運営者・責任者：${app.operatorPublicName}（本ポリシー冒頭の「運営者」と同じ）`,
            `${tool}は当方だけが使う内部ツールです。他の方がThreadsアカウントでログインして利用するサービスではありません。`,
          ]}
        />
        <p>
          Meta のアプリ審査のための確認用画面（審査担当者がご自身のアカウントで接続して動作を確認するもの）では、アクセストークンを接続中のサーバーのメモリにのみ保持し（最長60分）、検索結果は表示するだけで保存しません。接続を解除すると直ちに削除されます。この確認用画面は審査の完了後に廃止します。
        </p>
      </LegalSection>

      <LegalSection heading="B-2. Meta 公式 Threads API の利用">
        <p>
          {`${tool}は、Meta が提供する公式の Threads API のみを利用します。ウェブ画面のスクレイピングや非公式の API は使いません。`}
        </p>
        <Bullets
          items={[
            "キーワード検索（threads_keyword_search）で、Threads 上の公開投稿を検索します",
            "当方自身のThreadsアカウントへの投稿と、その投稿への返信にも Threads API を使います",
            "非公開の情報、フォロワーの情報、ダイレクトメッセージは取得しません",
          ]}
        />
      </LegalSection>

      <LegalSection heading="B-3. 取得する情報">
        <p>キーワード検索の結果として、公開投稿の次の項目を取得します。</p>
        <Bullets
          items={[
            "投稿ID",
            "ユーザー名",
            "投稿の本文",
            "投稿日時",
            "投稿のURL（permalink）",
            "投稿に含まれるリンク先のURL",
          ]}
        />
        <p>あわせて、検索に使ったキーワードと、検索結果の中での順位を記録します。</p>
      </LegalSection>

      <LegalSection heading="B-4. 利用目的">
        <p>取得した情報は、次の目的にのみ利用します。</p>
        <Bullets
          items={[
            "Threads で話題になっている商品の傾向を調べること（商品ごとの言及の数・投稿者の数・新しさなどの集計）",
            "投稿に含まれる Amazon の商品ページの URL から、商品を識別する番号（ASIN）を取り出すこと",
            "当方のThreadsアカウントで紹介する商品を選ぶこと",
            "当方自身のオリジナルの投稿を企画すること",
          ]}
        />
        <p>次のことは行いません。</p>
        <Bullets
          items={[
            "他の方の投稿の本文・画像を転載・引用・再投稿すること、当方の投稿として示すこと",
            "他の方になりすますこと",
            "特定の個人のプロフィールを作成すること、個人ごとに投稿を追跡・分析すること",
            "他の方のアフィリエイトリンクを使うこと",
            "投稿者に連絡・返信・フォロー・メッセージを行うこと",
            "広告の配信やターゲティングに使うこと",
          ]}
        />
      </LegalSection>

      <LegalSection heading="B-5. 第三者への提供・外部サービス">
        <Bullets
          items={[
            "取得した情報を販売・貸与・共有しません",
            "他の方の投稿の本文・ユーザー名・投稿のURLを、AI サービスに送信しません",
          ]}
        />
      </LegalSection>

      <LegalSection heading="B-6. 保存場所">
        <p>
          取得した情報は、運営者が管理するコンピューター上のデータベースと、そのバックアップに保存します。本サイト（Vercel）やお問い合わせフォームの仕組み（Resend）には保存しません。
        </p>
      </LegalSection>

      <LegalSection heading="B-7. 保存期間と削除" id="threads-retention">
        {active ? (
          <Bullets
            items={[
              <>
                取得した投稿の情報（本文・ユーザー名・投稿のURL・リンク先のURL・投稿ID、検索結果での順位・投稿日時など投稿ごとの記録）は、
                <strong className="text-zinc-50">取得から{app.retentionDays}日以内</strong>
                {`に削除します。通常は、取得から${app.internalDeleteDays}日を過ぎた後の定期処理（1日${app.runsPerDay}回）で削除します。`}
              </>,
              "運営者のコンピューターが停止していた等の理由で削除が遅れた場合は、再開後ただちに削除し、それまでの間は新たな取得を行いません。",
            ]}
          />
        ) : (
          <>
            <p>
              取得した投稿の情報（本文・ユーザー名・投稿のURL・リンク先のURL・投稿ID、検索結果での順位・投稿日時など投稿ごとの記録）は、保存期間の上限を
              <strong className="text-zinc-50">取得から{app.retentionDays}日</strong>
              とする方針です。
            </p>
            <Notice>
              この方針を自動で実行する仕組み（期限前の定期削除、削除が遅れた場合の新たな取得の停止、バックアップへの適用）は、現在導入の準備中で、まだ稼働していません。
            </Notice>
            <p>
              {`そのため現時点では、取得済みの情報（バックアップに含まれるものを含みます）は自動では削除されておらず、B-6 の保存場所に保存されています。仕組みの導入後は、期限を過ぎた情報から順に削除し、バックアップも同じ期限に沿って整理する予定です。導入が完了した時点で、本項と次項を更新します。`}
            </p>
            <p>導入前であっても、削除のご依頼は B-9 の窓口で受け付けており、個別に対応します。</p>
          </>
        )}
      </LegalSection>

      <LegalSection heading="B-8. 派生した情報とバックアップ">
        {active ? (
          <Bullets
            items={[
              `投稿から推定した商品名や、それに由来する情報（ブランド名の候補、短縮URLに由来する識別子など）も、もとの投稿の取得から${app.retentionDays}日以内に削除します。`,
              `商品ごと・検索ごとの投稿数や投稿者数も、${app.retentionDays}日以内に削除します。個人を特定できない、検索語ごとの件数だけは、最長${app.aggregateMonths}か月保存したのち削除します。`,
              "バックアップにも同じ期限を適用します。バックアップに含まれる情報が期限を迎える前に、その情報を削除したコピーに置き換えるか、バックアップそのものを削除します。",
            ]}
          />
        ) : (
          <p>
            {`投稿から推定した商品名などの派生した情報や、商品ごと・検索ごとの件数、バックアップにも、B-7 と同じ期限を適用する予定です（個人を特定できない検索語ごとの件数のみ、最長${app.aggregateMonths}か月）。仕組みの導入状況は B-7 のとおりです。`}
          </p>
        )}
        <p>
          当方が自分で確認した情報（紹介する商品の ASIN と、商品ページで確認した正式な商品名）と、当方自身の投稿の記録は、他の方の投稿に由来する情報とは区別して保存しており、上記の削除の対象ではありません。他の方の投稿から推定しただけの商品名は、紹介に使う商品であっても削除の対象です。
        </p>
      </LegalSection>

      <LegalSection heading="B-9. 削除・開示等のご依頼" id="threads-deletion">
        <p>
          ご自身の Threads 投稿に関する情報の削除をご希望の場合は、
          <MailLink address={app.deletionContact} subject="【データ削除依頼】Threadsツール" />
          までご連絡ください。ご依頼の方法・ご本人確認・処理の目安は、
          <InlineLink href="/data-deletion">データ削除のご案内</InlineLink>
          に記載しています。保存している情報の開示・訂正・利用停止のご請求も、同じ窓口で受け付けます。
        </p>
        <Bullets
          items={[
            "投稿のURLを示していただくだけでは、ご本人確認になりません",
            "ご本人確認の後、速やかに（遅くとも30日以内に）削除し、完了をお知らせします",
            "保存期間を待たずに削除し、派生した情報とバックアップに含まれる分も削除します",
          ]}
        />
      </LegalSection>

      <LegalSection heading="B-10. Meta からの要求・本ツールの利用終了">
        <p>
          {`Meta から求められた場合、または${tool}の利用を終了する場合は、${tool}が Threads API から取得したすべての情報（派生した情報とバックアップに含まれる分を含みます）を削除します。`}
        </p>
      </LegalSection>

      <LegalSection heading="B-11. 広告の表示（Amazonアソシエイト）">
        <p>
          当方は Amazon アソシエイト・プログラムに参加しており、当方のThreadsアカウントで紹介した商品のリンクから購入が行われた場合、当方は収入を得ることがあります。
        </p>
        <Bullets
          items={[
            "商品を紹介する投稿には「#PR」を付けます",
            "Amazonのリンクを置く返信には「Amazonのアソシエイトとして適格販売により収入を得ています」という旨の表記を付けます",
            `${tool}が取得した他の方の情報を、広告の表示や配信先の選定には使いません`,
          ]}
        />
      </LegalSection>

      <LegalSection heading="B-12. 安全管理のための措置">
        <Bullets
          items={[
            `${tool}を使い、取得した情報を取り扱うのは運営者本人だけです`,
            "取得した情報は、日本国内で運営者が管理するコンピューターで取り扱います",
            "Threads API のアクセストークンは運営者のコンピューター上の設定ファイルにのみ保存し、ログやエラーメッセージに出力しません",
            "他の方の投稿の情報を、AI サービスを含む外部のサービスに送信しません",
          ]}
        />
      </LegalSection>
    </LegalPart>
  );
}
