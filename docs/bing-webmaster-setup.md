# Bing Webmaster Tools / IndexNow セットアップ手順

作成日: 2026年9月23日
対象: `treeth.net`（本番は `https://www.treeth.net`）

## なぜ Bing も登録するのか

2026年現在、**ChatGPT Search は Bing のインデックスを利用してWeb検索結果を取得**しています。
Google だけでなく Bing にインデックスされていることが、AI検索経由での露出に直結します。

`robots.txt` では ChatGPT Search のクローラー `OAI-SearchBot` を明示的に許可済みです
（モデル学習用の `GPTBot` とは目的が異なるため、そちらは許可リストに含めていません）。

---

## パート1: Bing Webmaster Tools への登録

### 1. サイトを追加する

1. https://www.bing.com/webmasters にアクセスし、Microsoft アカウントでログイン
2. サイトの追加方法は2通り:
   - **Google Search Console からインポート**（最も簡単。GSC登録済みなら所有権確認も引き継がれます）
   - **手動で追加** … `https://www.treeth.net` を入力

Search Console を先に設定済みであれば、インポートを推奨します。

### 2. 所有権の確認（手動追加の場合）

いずれか1つの方法で確認します。**DNS TXT を推奨**します。

#### 方法A: DNS TXT（推奨）

| 項目 | 値 |
|---|---|
| タイプ | TXT |
| ホスト名 | `@` |
| 値 | Bing が表示する確認用文字列 |

#### 方法B: metaタグ（コード側に受け口あり）

1. Bing が表示する `<meta name="msvalidate.01" content="XXXX" />` の `content` 値をコピー
2. Vercel の Environment Variables に追加:

   ```
   NEXT_PUBLIC_BING_SITE_VERIFICATION = <コピーした値>
   ```
3. 再デプロイすると metaタグが出力されます

### 3. サイトマップを送信する

1. 左メニュー →「サイトマップ」
2. `https://www.treeth.net/sitemap.xml` を送信

### 4. 確認すべきレポート

| レポート | 内容 |
|---|---|
| Search Performance | クリック・表示回数・掲載順位 |
| Site Explorer | インデックスされているURL一覧 |
| URL Inspection | 個別URLのインデックス状況 |
| SEO Reports | Bing独自のSEO改善提案 |

---

## パート2: IndexNow

### 現在の実装状況

| 項目 | 状態 |
|---|---|
| APIキー | `fbe4d0b75ff01d95156e77bd8ee1e8e2` |
| キーファイル | `public/fbe4d0b75ff01d95156e77bd8ee1e8e2.txt`（`https://www.treeth.net/fbe4d0b75ff01d95156e77bd8ee1e8e2.txt` で配信） |
| 送信スクリプト | `scripts/indexnow.mjs`（`npm run indexnow`） |
| 自動送信 | **していません**（意図的） |

キーは公開前提の仕組みです。IndexNow は「キーファイルが実際にそのドメインで配信されているか」で所有権を検証するため、リポジトリに含まれていて問題ありません。

### なぜビルド時の自動送信にしないのか

本サイトは実質3ページの静的サイトで、内容が変わる頻度は高くありません。
デプロイのたびに全URLを送信すると、**変更のないURLを繰り返し送ることになります**。
IndexNow のガイダンスはこれを明確に非推奨としており、検索エンジン側もレート制限と品質スコアリングで評価を下げます。

そのため、**内容を実際に更新したときだけ手動で叩く**設計にしています。

### 使い方

```bash
# トップページを更新したとき
npm run indexnow -- /

# 複数ページ
npm run indexnow -- / /privacy
```

- HTTP 200（受理）または 202（キー検証待ちで受理）が返れば成功です
- 誤って大量送信しないよう、21件以上はスクリプト側で拒否します

### 送ってよいタイミング / 送るべきでないタイミング

| 送る | 送らない |
|---|---|
| 新しいページを公開した | デザインだけ調整した |
| 本文・料金・サービス内容を更新した | 依存パッケージを更新しただけ |
| URLを変更した | 何も変えずに再デプロイした |

### 動作確認

```bash
# キーファイルが配信されているか
curl https://www.treeth.net/fbe4d0b75ff01d95156e77bd8ee1e8e2.txt
# → fbe4d0b75ff01d95156e77bd8ee1e8e2 が返れば正常
```

Bing Webmaster Tools の「URL送信 → IndexNow」画面でも送信履歴を確認できます。

---

## 関連

- Google Search Console: [search-console-setup.md](./search-console-setup.md)
- 今後のページ追加計画: [seo-content-roadmap.md](./seo-content-roadmap.md)
