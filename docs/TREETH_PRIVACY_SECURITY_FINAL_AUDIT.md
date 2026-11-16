# TREETH プライバシーポリシー・セキュリティ最終監査

- 対象: `treeth-official`、ブランチ `privacy-threads-app`（main `451cffc` から作成、**未コミット**）
- 実施日: 2026-11-16
- 実施しなかったこと: Git の commit・push・merge、Vercel へのデプロイ（本番・プレビューとも）、Meta のアプリ設定の変更、DNS の変更、Threads 自動投稿プロジェクトの変更、データの削除、実際のメール送信、従量課金の AI API の利用
- この文書には、運営者の個人名・Meta のアプリ名・アプリ ID・Threads アカウント名を書かない（公開方針）
- **追記（2026-11-16）**: この監査の後、案1（C-3）の有効化と A-10（外国にある事業者による取り扱い）の追加を行った。公開の記録は `docs/TREETH_PRIVACY_DEPLOYMENT_REPORT.md`

## 判定

**READY_AFTER_MANUAL_CHECK**

| 項目 | 結果 |
|---|---|
| 技術面（npm ci・型チェック・lint・テスト 28 件・ビルド 3 回・本番モードでの取得・フォーム） | すべて合格 |
| `npm audit --omit=dev` | 0 件 |
| `npm run privacy:check` | **BLOCKED 1 件**（個人情報保護法第32条の、事業者の氏名・住所の示し方が未承認）・WARNING 4 件・PASS 3 件。終了コード 1 |

BLOCKED の1件は、ユーザーの判断で解消できる（§4）。判断が済んで `operatorIdentityMethod` を設定すると、`privacy:check` は WARNING（公開後に確認する項目など）になり、プレビューへ進められる。

---

## 1. 採用した公開方針

ユーザーが 2026-11-16 に確定した方針。`src/lib/threads-app.ts` の `publication` に記録した。

| 方針 | 実装 |
|---|---|
| Threads アカウントの固有名を載せない | ページに出さない。`threadsUsername` のフィールド自体を削除した。本人確認で当方のアカウントが必要な場合は、受付のメールで個別に伝える（/data-deletion 3-2） |
| Meta アプリの固有名を載せない | `appName` のフィールドを削除した。対象は「TREETHが運用するThreadsの商品トレンド調査・投稿支援ツール」と書き、「Meta for Developers に登録した当方のアプリを通じて Threads API を利用」と説明する（B-1） |
| 運営者の表記は「TREETH」 | 冒頭・B-1・/data-deletion で「TREETH」と書く。「個人事業」の表記は外した（/tokushoho の既存の表記はそのまま） |
| 連絡先は `contact@treeth.net` | /privacy・/data-deletion の mailto（件名付き） |
| メールサービス名（Apple）を載せない | 載せていない（テストで確認） |
| 既存の Web 制作事業のポリシーを維持 | §5 |
| Threads 用のデータ削除案内ページを維持 | /data-deletion |

固有名を伏せても、次の点はページ上で明確にしている: 処理する主体（TREETH）、対象のツール（何をするツールか）、目的（B-4）、連絡先、削除の方法（B-9・/data-deletion）。

Meta Platform Terms 4(b) が求める内容は「データの種類・処理の方法・目的・利用者が削除を求める方法」で、アプリ名や開発者名の掲載は求めていない（[Platform Terms](https://developers.facebook.com/terms/)）。4(a) の、公開されていてクローラーが取得でき、地域でブロックされないという要件は §11 で確認した。

## 2. Meta 提出内容との整合

**照合元**: Meta の App Review の提出内容（2026-10-19 提出、2026-11-15 に App Dashboard から出力した PDF、3 ページ）。ユーザーの Downloads フォルダーにあった。

リポジトリの `REVIEW_SUBMISSION.md` は下書きなので、照合には使っていない。

| 提出内容 | 公開ページ | 判定 |
|---|---|---|
| 開発者本人が使う SNS 運用支援ツール。自分の Threads アカウントを運用するための内部ツール | B-1「当方だけが使う内部ツール」 | 一致 |
| `threads_keyword_search` で TOP / RECENT を検索する。取得するのは本文・投稿日時・投稿 URL・リンク情報など | B-2・B-3（投稿 ID・ユーザー名・本文・日時・URL・リンク先） | 一致（ページの方が詳しい） |
| Amazon の商品リンク・ASIN の解析、検索順位・新しさ・登場頻度によるトレンド分析、自分の投稿の企画・商品選定 | B-4 | 一致 |
| 第三者の投稿を自分の投稿として転載しない。個人のプロファイリングを目的としない | B-4（しないこと） | 一致 |
| 投稿は調査結果を参考に独自の文章を作る | B-4「オリジナルの投稿を企画」 | 一致 |
| `threads_basic` でアカウント ID・ユーザー名を取得する。自分のアカウントへの投稿・返信の管理に使う | B-2「当方自身のアカウントへの投稿と返信にも API を使う」 | 一致 |
| 審査用デモ: トークンはサーバーのメモリだけ（最長 60 分）、検索結果は保存しない、Disconnect で削除 | B-1 の第2段落 | 一致 |
| 第三者の投稿の抜粋を Anthropic API に送るという記述 | なし（B-5「AI サービスに送信しません」） | 矛盾なし |
| Facebook Login: No | ログインのデータは保存しない（/data-deletion 1-1） | 一致 |

**矛盾ではないが、確認が必要な点**（`privacy:check` は WARNING）:

1. **データの責任者**
   - 提出: 運営者の個人名、国は日本
   - 公開ページ: 「TREETH」
   - TREETH が同じ個人の屋号であれば実体は同じ。Meta から照会があった場合は、そのように説明する
2. **データ処理者**
   - 提出: 「なし」
   - 審査用デモは外部のホスティングで動いており、レビュアーのアクセストークン（Meta の定義ではプラットフォームデータ）をメモリで扱う
   - ホスティング事業者が「処理者」に当たるかは確認していない
   - 公開ページの記載とは矛盾しない。デモを廃止すれば解消する

## 3. privacy:check の全項目と結果

`npm run privacy:check` の結果（2026-11-16、終了コード 1）。判定の処理は `src/lib/privacy-checks.ts`、テストは `tests/privacy-checks.test.mjs`。

| ID | 種類 | 判定 | 理由 |
|---|---|---|---|
| policy.naming | 承認済みの方針 | PASS | 固有名を載せないのは方針であり、設定漏れではない。Platform Terms 4(b) はアプリ名の掲載を求めていない |
| legal.operator-identity | 法令 | **BLOCKED** | 第32条の、氏名又は名称及び住所の示し方が未承認（§4） |
| legal.external-environment | 法令 | WARNING | お問い合わせが米国の事業者（Resend・Vercel）を経由する。国名の記載と、委託・提供のどちらに当たるかは未確認 |
| fact.storage | 確認済みの事実 | PASS | iCloud Drive のデスクトップ同期はオフ、Time Machine はバックアップディスク未設定（2026-11-16 にユーザーが確認）。確認日より前のコピーと、ほかの同期サービスは確認の範囲外であり、ページには「ローカルのみ」と書いていない |
| fact.meta-submission | 確認済みの事実 | WARNING | 提出 PDF と照合済みで矛盾なし。§2 の確認事項 2 件 |
| fact.retention | 確認済みの事実 | PASS | planned（自動削除は未稼働と表示） |
| post.public-access | 公開後 | WARNING | 本番の 200・クローラーからの取得・og:url は公開後に確認する |
| post.meta-dashboard | 公開後 | WARNING | 2 つの URL の登録は公開後にユーザーが行う |

**判定のルール**

| 状態 | 判定 |
|---|---|
| `retentionStatus: "active"` なのに、ゲート B の確認日（`gateBVerifiedOn`）が無い | BLOCKED |
| 保存場所が未確認、または同期がオン | BLOCKED |
| 提出内容と照合していない | BLOCKED |
| 確認事項が残っている | WARNING（PASS とは表示しない） |

- 総合の判定は、BLOCKED が1件でもあれば BLOCKED、WARNING が残っていれば WARNING
- 終了コードは BLOCKED の時だけ 1

## 4. 運営者の表示の法的な確認

### 根拠

個人情報保護委員会「個人情報の保護に関する法律についてのガイドライン（通則編）」3-8-1（[PPC](https://www.ppc.go.jp/personalinfo/legal/guidelines_tsusoku/)）による。

保有個人データについて、次の5点を「本人の知り得る状態（本人の求めに応じて遅滞なく回答する場合を含む。）」に置く必要がある。

1. 事業者の氏名又は名称及び住所
2. 利用目的
3. 開示等の手続
4. 安全管理のために講じた措置
5. 苦情の申出先

ガイドラインの例には、問合せ窓口を設けて回答できる体制を整えることや、ホームページに問合せ先のメールアドレスを表示することが挙がっている。

Threads のツールが保存する公開投稿の情報は、ユーザー名で検索できるデータベースに入っているため、保有個人データに当たると考えて対応する。

### 各事項の対応

| 事項 | 対応 |
|---|---|
| 氏名又は名称及び住所 | **未承認**。屋号「TREETH」だけで「氏名又は名称」として足りるかは、ガイドラインに記述が無く、推測していない |
| 利用目的 | A-3・B-4 |
| 開示等の手続 | A-9・B-9（開示・訂正・利用停止も同じ窓口）・/data-deletion |
| 安全管理措置 | A-8・**B-12（新設）** |
| 苦情の申出先 | C-2（「苦情のお申し出を含みます」を追記） |

### ユーザーが選ぶ方法（個人の氏名・住所を無断で公開しない）

| 案 | 内容 | 状態 |
|---|---|---|
| (1) 請求があれば遅滞なく回答する | C-3「当方（TREETH）は個人で運営しています。運営者の氏名および住所は、ご請求があった場合に遅滞なくお知らせします。」を表示する。`operatorIdentityMethod: "on_request"` で表示される。/tokushoho の「請求があれば遅滞なく開示」と同じ考え方 | **実装済み・未有効**（ユーザーの承認待ち） |
| (2) ページに公表する | 氏名・住所をページに載せる | 実装していない（無断で公開しない） |

- どちらの案でも、実際に請求が来たら遅滞なく回答する運用が必要
- 屋号だけで足りるかの最終判断が必要な場合は、個人情報保護委員会の相談窓口や専門家に確認する

## 5. 既存ポリシー（2026-09-23 公開版、全11条）との条文差分

新しい構成は A（Web 制作事業）・B（Threads のツール）・C（共通事項）。

| 旧条文 | 新しい位置 | 変更 | 意味・責任範囲 |
|---|---|---|---|
| 1. 基本方針 | A-1 | 「本ポリシーは、本サイトで…」→「この部は、本サイトで…」 | 変わらない。ポリシー全体の範囲は冒頭で示す |
| 2. 取得する情報 | A-2 | 参照先を「第5項・第6項」→「A-5・A-6」 | 変わらない |
| 3. 利用目的 | A-3 | 文言は同じ | 変わらない |
| 4. 第三者提供・外部委託 | A-4 | 文言は同じ（Resend, Inc.・Vercel Inc.） | 変わらない |
| 5. アクセス解析 | A-5 | 文言は同じ | 変わらない |
| 6. ホスティング | A-6 | 文言は同じ | 変わらない |
| 7. データの保管 | A-7 | 文言は同じ | 変わらない |
| 8. 安全管理措置 | A-8 | 文言は同じ | 変わらない |
| 9. 開示・訂正・削除等 | A-9 | 窓口に「または contact@treeth.net」を追加。Threads に関する依頼の案内を追加。元の文は残した | 窓口が増えただけで、フォームは残る |
| 10. ポリシーの改定 | C-1 | 元の2文は残した。改定時に最終更新日を更新し、重要な変更を本ページで知らせる旨を追加 | 当方の義務が増えた（弱めていない） |
| 11. お問い合わせ窓口 | C-2 | 「フォーム」→「フォーム、または contact@treeth.net」。「苦情のお申し出を含みます」を追加 | 窓口が増えた |

- 削除した条文は無い
- 意味を弱めた条文も無い
- `tests/privacy-pages.test.mjs` が、`tests/fixtures/privacy-2026-09-23.json`（main から抽出）の 11 条すべてが残っていることを確認する

### 利用の実態（コードで確認）

| サービス | 確認した箇所 |
|---|---|
| Vercel（ホスティング） | `.vercel/project.json` |
| Vercel Web Analytics | `src/app/layout.tsx` の `<Analytics />`。カスタムイベントなし |
| Resend | `src/actions/contact.ts` |

- Cookie・localStorage・ほかの解析タグ（GA・GTM 等）は使っていない（`src/` を検索して 0 件）
- A-5 の「Cookie を使用しない」と一致する

### 方針により掲載していないもの

- 受信したメールを保管するメールサービスの名前
- 外国の事業者が扱う場合の国名
  - お問い合わせは Resend・Vercel（米国）を経由し、受信したメールの保管にもメールサービスを使う
  - ガイドライン 3-8-1・10-7 は、外国で個人データを取り扱う場合に国名を示すことを「望ましい」としている
  - 委託・提供・クラウドの例外のどれに当たるか、処理される国はどこかは**未確認**（`legal.external-environment` が WARNING）

## 6. planned と active の表示の比較

`tests/privacy-pages.test.mjs` が、両方の状態を React で実際に描画（`renderToStaticMarkup`）して確認する。

| 項目 | planned（現在） | active（ゲート A・B の後） |
|---|---|---|
| 上限 | 「取得から30日とする方針」 | 「取得から30日以内に削除」 |
| 自動削除 | 「導入の準備中で、まだ稼働していません」 | 「取得から28日を過ぎた後の定期処理（1日2回）で削除」 |
| 取得済みのデータ | 「取得済みの情報（バックアップを含む）は自動では削除されておらず、B-6 の保存場所に保存」。導入後は期限を過ぎたものから削除し、バックアップも整理する予定 | 削除が遅れた場合は再開後ただちに削除し、それまで新たな取得をしない |
| 派生データ・バックアップ | 「同じ期限を適用する予定」 | 期限前に、削除したコピーに置き換えるか、バックアップごと削除 |
| 削除依頼 | 「導入前であっても、削除のご依頼は受け付けており、個別に対応」 | 期限後の情報は「保存していない」と連絡 |
| 英語の要約 | 「not yet running … has not been deleted automatically」 | 「deleted after 28 days by a job that runs 2 times a day」 |

テストで確認していること:

- planned には「1日2回」「28日」「ご依頼がなくても削除しています」が出ない
- active には「まだ稼働していません」が出ない
- バックアップについて「すべて管理済み」とは書いていない
- active に切り替える条件:
  - ゲート A（P0 の本番反映）とゲート B（1日2回の処理の登録と、稼働の検証）が済んでいること
  - `gateBVerifiedOn` に確認日を入れること。入れなければ `privacy:check` が BLOCKED になる
- 設定を切り替えても、それだけで法的に適合するわけではない

## 7. Next.js の更新前後のバージョン

| パッケージ | 更新前 | 更新後 |
|---|---|---|
| next | 16.4.0 | **16.4.6**（2026-11-09 公開、16 系の latest） |
| eslint-config-next（dev） | 16.4.0 | 16.4.6 |
| @next/env・@next/eslint-plugin-next・@next/swc-*（8 種） | 16.4.0 | 16.4.6 |
| react / react-dom | 19.2.4 | 19.2.4（変えていない。next の peer は `^19.0.0`） |
| sharp | 0.35.5 | 0.35.5（next の optional 依存。該当する advisory は無い） |

- package-lock.json で変わったのは上の 12 パッケージだけ
- `npm audit fix --force`・メジャーの更新・依存関係全体の更新はしていない
- Node の要件は `>=20.9.0`（ローカルは v26.5.0・npm 11.17.0）

## 8. 解消した脆弱性

| Advisory | 重要度 | 修正版 | このサイトとの関係 |
|---|---|---|---|
| [GHSA-673q-mjm6-r5xr](https://github.com/advisories/GHSA-673q-mjm6-r5xr) `use cache` 経由の RCE | Critical | 16.4.1 | `use cache` は未使用 |
| [GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw) SVG の画像最適化経由の RCE | Critical | 16.4.1 | `next/image` は使用（Hero・ProjectsShowcase。ローカルの webp）。SVG なし、`dangerouslyAllowSVG`・`remotePatterns` なし |
| [GHSA-p3m5-59mp-jv5r](https://github.com/advisories/GHSA-p3m5-59mp-jv5r) Server Actions の DoS | High | 16.4.1 | **該当**。お問い合わせフォーム（`src/actions/contact.ts`）が Server Action |

- 公式のリリースノートで、16.4.1 にこの3件の修正が含まれることを確認した
- 16.4.5 では moderate 7 件（`use cache`・Edge・SVG の判定の回避など）が修正された
- 16.4.6 はバグ修正だけ

## 9. npm audit の結果

| コマンド | 結果 |
|---|---|
| `npm audit --omit=dev` | **found 0 vulnerabilities** |
| `npm audit`（開発依存を含む） | 8 件（moderate 7、high 1） |

残る 8 件は、すべて lint 用の開発依存（eslint-config-next 経由）。本番のバンドルには入らない。

- zod `<4.6.6`（high、GHSA-mrhx-c7xc-m3w5）: eslint-plugin-react-hooks 経由
- minimatch（moderate、GHSA-g3hv-75wg-m249）・typescript-eslint 系 6 件: eslint・typescript-eslint 経由

今回は「セキュリティに関係しない広範囲の更新を避ける」方針で、更新していない。semver の範囲内の `npm audit fix`（force なし）で解消できる見込みなので、別の変更として行うことを推奨する。

## 10. ビルドの結果（3回）

### 交互に失敗していた原因

脆弱性の警告そのものではなく、Next 16.4.0 の「エージェント向けアップグレード通知」の仕組みが原因だった（`node_modules/next/dist/lib/upgrade/nudge.js`）。

1. `experimental.agentUpgrade` の既定は `'security'`
2. `@vercel/detect-agent` が環境変数から AI エージェント（Claude Code）の実行を検知する
3. インストールされている Next が advisory に該当すると、`.next/cache/next-agentic-upgrade-retries/` に記録を書き、`SecurityFatalError`（終了コード 1）で止まる
4. 5 分以内の再実行では、その記録を消費して続行する
5. このため、1回おきに失敗していた

補足:

- この判定のために、npm レジストリの advisory を取得している（ネットワークに依存）。取得に失敗した場合は警告して続行する
- Vercel の CI ではエージェントとして検知されないため、この停止は起きない
- 16.4.6 は advisory に該当しないため、ローカルでも停止しない

### 実行結果

`.next` を退避（削除はしていない）したうえでの `npm ci` の後、連続で実行した。

| 実行 | 終了コード | 結果 |
|---|---|---|
| `npm ci` | 0 | 成功 |
| `tsc --noEmit` | 0 | 成功 |
| `npm run lint` | 0 | 成功 |
| `npm test` | 0 | 28 / 28 成功 |
| `npm run build` 1回目 | **0** | Next.js 16.4.6、Compiled successfully、静的ページ 9/9 |
| `npm run build` 2回目 | **0** | 同上 |
| `npm run build` 3回目 | **0** | 同上 |

- ルート（すべて静的に生成）: `/`、`/_not-found`、`/data-deletion`、`/privacy`、`/robots.txt`、`/sitemap.xml`、`/tokushoho`
- retry の記録ファイルは作られなかった
- 1回目の標準エラーには、Node の `DEP0205`（`module.register()` の非推奨の警告）が1行出た。Next の起動処理から出たもので、2回目以降は出ず、ビルドの結果に影響はない

## 11. 全ページの HTTP・メタデータ

`next start`（本番モード）で、ブラウザ・`facebookexternalhit/1.1`・`meta-externalagent/1.1` の各 User-Agent から取得した。

| パス | HTTP | canonical | og:url | noindex |
|---|---|---|---|---|
| / | 200/200/200 | https://www.treeth.net | https://www.treeth.net | なし |
| /privacy | 200/200/200 | https://www.treeth.net/privacy | 同じ | なし |
| /data-deletion | 200/200/200 | https://www.treeth.net/data-deletion | 同じ | なし |
| /tokushoho | 200/200/200 | https://www.treeth.net/tokushoho | 同じ | なし |
| /robots.txt | 200/200/200 | — | — | `Allow: /`（全体を許可） |
| /sitemap.xml | 200/200/200 | — | — | /、/privacy、/data-deletion、/tokushoho を含む |

- **相互リンク**: /privacy → /data-deletion、/data-deletion#english。/data-deletion → /privacy#threads-app。フッター（全ページ）→ /privacy、/data-deletion、/tokushoho
- **お問い合わせへの導線**: /privacy・/tokushoho → `/#contact`（トップの `id="contact"`）
- **メールリンク**: `mailto:contact@treeth.net`（件名なし・「【データ削除依頼】Threadsツール」・英語の件名）
- **HTML 内の個人情報**
  - 運営者の個人名・アプリ名・アプリ ID・審査用デモの URL は 0 件
  - メールアドレスは contact@treeth.net だけ（トップのフォームの入力例 `taro@example.com` は除く）
  - 「Apple」は Next 既定のエラー画面のフォント指定（Apple Color Emoji）で、メールサービスの名前ではない
- **スマホ（375px、CDP でエミュレーション）**
  - /privacy・/data-deletion・/tokushoho: 横スクロールなし、はみ出す要素 0、本文の最小 14px、`id="main"`（スキップリンクの移動先）あり
  - トップ（変更なし）: 横スクロールはなし。マーキー等の切り取られた要素がある
- **英語と日本語の整合**
  - 英語の要約の内容（収集する項目・目的・しないこと・保存場所・期限の状態・削除の方法・広告）は日本語と一致する
  - planned と active の切り替えも日本語に連動する（テストで確認）

## 12. お問い合わせフォームの検証

### ユニットテスト（`tests/contact-action.test.mjs`、7 件）

Resend と `next/headers` をテスト用の代わり（`tests/support/mocks`）に置き換えたので、メールは送らない。

- 正しい問い合わせ: 1 回だけ送られ、宛先は `CONTACT_TO_EMAIL`、返信先は訪問者、From は `TREETH <contact@treeth.net>`
- 名前の CR/LF が件名に入らない（ヘッダーインジェクションの防止）
- `CONTACT_TO_EMAIL` が無い場合は、送らずに失敗する
- 必須項目・メールの形式・5000 文字の上限: エラーを返し、送らない
- ハニーポット: 成功を返し、送らない
- 同じ IP からの 4 回目: レート制限
- Resend のエラー: 汎用のメッセージ

### E2E（本番モード）

- 条件: `next start` を `CONTACT_TO_EMAIL=""`・偽の `RESEND_API_KEY` で起動。`@next/env` は既に設定された値（空文字も含む）を `.env.local` で上書きしないことをコードで確認した
- 操作: ヘッドレス Chrome でフォームに入力し、送信した
- 結果:
  - 画面に「送信に失敗しました。しばらくしてから再度お試しください。」が出た
  - サーバーのログは `[contact] CONTACT_TO_EMAIL is not configured; cannot deliver.`
  - Server Action の往復は動き、送信の前で止まった
- **実際のメール送信はしていない**（ユーザーの承認が必要）

## 13. 変更したファイル

### 変更

| ファイル | 内容 |
|---|---|
| `package.json` | next・eslint-config-next を `^16.4.6` に。`test`・`privacy:check` を追加 |
| `package-lock.json` | Next 関連の 12 パッケージだけ |
| `src/app/layout.tsx` | OG 画像を共通の定数に |
| `src/app/privacy/page.tsx` | `PrivacyPolicy` を描画 |
| `src/app/sitemap.ts` | /data-deletion を追加 |
| `src/app/tokushoho/page.tsx` | canonical・og:url をそのページ自身に。`id="main"` |
| `src/components/sections/Footer.tsx` | 「データ削除のご案内」のリンク |

### 新規

| ファイル | 内容 |
|---|---|
| `src/app/data-deletion/page.tsx` | データ削除のご案内のページ |
| `src/components/legal/Legal.tsx` | 共通の部品 |
| `src/components/legal/PrivacyPolicy.tsx` | A・C・英語の要約 |
| `src/components/legal/ThreadsAppPolicy.tsx` | B |
| `src/components/legal/DataDeletion.tsx` | /data-deletion の本文 |
| `src/lib/threads-app.ts` | 事実と確認の記録 |
| `src/lib/privacy-checks.ts` | 判定 |
| `src/lib/metadata.ts` | ページごとの canonical・og:url |
| `scripts/check-privacy.mjs` | チェックの CLI |
| `tests/` 一式 | テスト 3 本、ローダー、モック 2 本、fixture 1 本 |
| `docs/TREETH_PRIVACY_SECURITY_FINAL_AUDIT.md` | この文書 |

## 14. コミット前の Git の状態

- ブランチ: `privacy-threads-app`（main `451cffc` から作成）。コミット・push はしていない
- 変更 7 ファイル（`git diff --stat`: 81 insertions、139 deletions）。ほかは未追跡の新規ファイル（§13）
- `git diff --check`: 問題なし
- 秘密情報: `.env.local` の値との照合で 0 件。運営者の個人名・アプリ名・アプリ ID・審査用デモの URL も 0 件
- 作業前の未コミットの変更は、スクラッチパッドにパッチと tar で退避してから作業した（リポジトリの外。セッションの終了とともに消える）

## 15. 未確認の事項と、残るリスク

| # | 事項 | 必要な対応 |
|---|---|---|
| 1 | **第32条の氏名・住所の示し方**（BLOCKED） | ユーザーが案 (1) か (2) を選ぶ。屋号だけで足りるかは未確認 |
| 2 | 外国の事業者による処理の扱い・国名（WARNING） | Resend・Vercel・メールサービスについて、処理される国と、委託・提供・クラウドの例外のどれに当たるかを確認する。必要なら A-4 に国名を追記する（サービス名の追加は方針と相談） |
| 3 | 提出時のデータの責任者（個人名）と公開表記（TREETH）の関係 | Meta から照会があれば説明する |
| 4 | 審査用デモのホスティングと、提出時の「処理者なし」 | 処理者に当たるか確認する。デモの廃止で解消する |
| 5 | 保存場所 | 確認日より前の外部のコピーや、ほかの同期・バックアップサービスの有無は確認していない（ページには「ローカルのみ」と書いていない） |
| 6 | 自動削除は未稼働 | 運用ツールの P0（保持・削除）のゲート A・B が済むまで planned のまま。それまでは期限を過ぎたデータが自動では消えない（ページにもそう書いた） |
| 7 | 削除の期限の基準 | ページは「本人確認の完了から30日以内」。運用ツール側の手順書（`DATA_DELETION_REQUEST_RUNBOOK.md` §0）の完了連絡の行は「受付から30日以内」で、そろえる必要がある（今回は運用ツールを変更しない条件のため未修正） |
| 8 | 開発依存の脆弱性 8 件 | 別の変更として `npm audit fix`（force なし）を検討する |
| 9 | AI を使った作業での第三者データの扱い | B-5・B-12 は「AI サービスに送信しない」と約束している。運用ツールの開発・運用で AI のコーディング支援を使う場合も、第三者の投稿の本文・ユーザー名・URL を表示させない運用を続ける |
| 10 | 最終更新日 | `POLICY_UPDATED_ON`（2026年11月16日）を公開する日に合わせる |

## 16. Vercel のプレビューから本番に反映するまでの手順（ユーザーの承認の後）

1. §15 の 1 を決めて、`operatorIdentityMethod` を設定する。`POLICY_UPDATED_ON` を公開日に合わせる
2. 次のコマンドがすべて成功し、`privacy:check` に BLOCKED が無いことを確認する
   ```bash
   npm ci && npx tsc --noEmit && npm run lint && npm test && npm run build && npm run privacy:check
   ```
3. ブランチでコミットし、push する（ユーザーの承認が必要）
4. Vercel の Git 連携でプレビューのデプロイができたら、プレビューの URL で /privacy・/data-deletion・お問い合わせの導線を確認する
   - プレビューは Vercel Authentication で保護されている場合がある
   - **プレビューの URL は Meta に登録しない**
5. main にマージして、本番にデプロイする
6. 本番で確認する
   ```bash
   curl -I https://www.treeth.net/privacy
   curl -I https://www.treeth.net/data-deletion
   curl -s -A "facebookexternalhit/1.1" -o /dev/null -w "%{http_code}\n" https://www.treeth.net/data-deletion
   ```
   - Meta のシェアデバッガーで og:url がページ自身であることを確認する
   - 確認できたら、`post.public-access` は確認済み
7. 運用ツールの P0 のゲート A・B が済み、定期処理の稼働を確認したら、`gateBVerifiedOn` と `retentionStatus: "active"` を設定して、もう一度 1〜6 を行う
8. IndexNow（`npm run indexnow -- /privacy /data-deletion`）は任意で、公開の条件ではない

## 17. Meta App Dashboard の設定手順（本番の公開後にユーザーが行う）

1. Meta for Developers の App Dashboard で対象のアプリを開く
2. App settings → Basic を開く
3. **Privacy Policy URL**: `https://www.treeth.net/privacy`
4. **User data deletion** で「Data deletion instructions URL」を選び、`https://www.treeth.net/data-deletion` を入れる
   - コールバック URL は、運用ツールに受け口が無いため選ばない
5. 保存する。エラーが出たら、URL が www 付きであること（www なしは 308 でリダイレクトされる）と、本番で 200 を返すことを確認する
6. 登録できたら、`post.meta-dashboard` は確認済み
