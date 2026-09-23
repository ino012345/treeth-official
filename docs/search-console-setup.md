# Google Search Console セットアップ手順

作成日: 2026年9月23日
対象: `treeth.net`（本番は `https://www.treeth.net`）

Search Console への登録はコードからは行えないため、以下はサイトオーナーが手動で実施する作業です。
コード側の準備（sitemap.xml / robots.txt / verification meta タグの受け口）は実装済みです。

---

## 1. Domain Property として登録する

**URL prefix ではなく Domain property を選んでください。**

理由: `treeth.net`（apex）は `https://www.treeth.net` へ 308 リダイレクトしています。
URL prefix で登録すると www とapex、http と https が別プロパティ扱いになり、データが分散します。
Domain property は**サブドメインとプロトコルをまとめて1つ**として扱うため、この構成に適しています。

手順:

1. https://search.google.com/search-console へアクセス
2. 「プロパティを追加」→ 左側の **「ドメイン」** を選択
3. `treeth.net` と入力（`https://` や `www.` は付けない）

---

## 2. DNS TXT レコードで所有権を確認する

Domain property は DNS 認証のみ対応しています。

1. Search Console が `google-site-verification=xxxxxxxx` という TXT 値を表示します
2. ドメインを管理している DNS（お名前.com / Cloudflare / Vercel DNS 等）の管理画面を開く
3. 以下のレコードを追加:

   | 項目 | 値 |
   |---|---|
   | タイプ | TXT |
   | ホスト名 / 名前 | `@`（またはドメイン名そのもの。空欄の場合もあります） |
   | 値 | `google-site-verification=...`（Search Console が表示した文字列） |
   | TTL | 既定値のままで可 |

4. 保存後、Search Console の「確認」を押す
   - DNS の反映に数分〜最大48時間かかることがあります。すぐに失敗しても時間をおいて再試行してください

### HTMLタグ方式を使いたい場合（代替手段）

DNS を触れない事情がある場合のみ。コード側に受け口を用意してあります。

1. Search Console で「URL プレフィックス」→「HTML タグ」を選び、`content="..."` の値をコピー
2. Vercel のプロジェクト設定 → Environment Variables に追加:

   ```
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION = <コピーした値>
   ```
3. 再デプロイすると `<meta name="google-site-verification" ...>` が出力されます

※ 推奨は DNS TXT です。HTMLタグ方式はドメイン全体をカバーしません。

---

## 3. sitemap.xml を送信する

サイトマップは実装済みで、`https://www.treeth.net/sitemap.xml` で配信されています。

1. Search Console 左メニュー →「サイトマップ」
2. 「新しいサイトマップの追加」に `sitemap.xml` と入力して送信
3. ステータスが「成功しました」になることを確認

現在の収録URL:

| URL | priority | 備考 |
|---|---|---|
| `/` | 1.0 | トップページ |
| `/privacy` | 0.3 | プライバシーポリシー |
| `/tokushoho` | 0.3 | 特定商取引法に基づく表記 |

`robots.txt`（`https://www.treeth.net/robots.txt`）からもサイトマップを参照しています。

---

## 4. URL Inspection（URL検査）

公開直後やページを更新した直後に、インデックス状況を個別に確認・リクエストできます。

1. Search Console 上部の検索窓に `https://www.treeth.net/` を入力
2. 「URLがGoogleに登録されています」と出れば正常
3. 未登録・古い内容のままの場合は **「インデックス登録をリクエスト」**
4. 「公開URLをテスト」でレンダリング結果（Googleが実際に見ている画面）を確認できます

**注意**: リクエストは1日あたりの上限があります。更新していないURLを繰り返し送る必要はありません。

---

## 5. Core Web Vitals を確認する

左メニュー →「エクスペリエンス」→「ウェブに関する主な指標」

- **実測データ（CrUX）が表示されるまで、一定数のアクセスが必要**です。アクセスが少ない期間は「データ不足」と表示されます
- 表示されるようになったら、モバイル/PC それぞれで LCP・INP・CLS を確認します

参考値（2026年9月時点の Lighthouse 実測 / ローカル本番ビルド）:

| 指標 | 目標 | 実測 |
|---|---|---|
| LCP | ≤ 2.5s | 2.8s（モバイル・低速4Gシミュレーション） / 0.9s（PC） |
| INP | ≤ 200ms | TBT 10ms（良好） |
| CLS | ≤ 0.1 | 0 |

※ Lighthouse は低速回線を想定した厳しめの試算です。CrUX の実ユーザーデータはこれより良い値になる見込みです。実データが出たら、そちらを正とします。

---

## 6. 検索パフォーマンスを確認する

左メニュー →「検索結果」

見るべき指標:

- **クリック数 / 表示回数 / CTR / 平均掲載順位**
- 「クエリ」タブ … どんな検索語で表示されているか
- 「ページ」タブ … どのページが表示されているか

最初の数週間はデータがほとんど出ません。**新規ドメインがインデックスされ評価が安定するまで数週間〜数ヶ月かかる**のが通常です。

狙いたいクエリの例（サイト内で実際に扱っている内容と一致するもの）:
- ホームページ制作／コーポレートサイト制作／LP制作
- 店舗 ホームページ制作

---

## 7. Generative AI Performance（2026年追加）

2026年に Search Console へ追加された、**AI による検索体験（AI Overviews / AI Mode）経由の表示・クリックを確認するためのレポート**です。

1. 左メニュー →「検索結果」→ 検索タイプまたはレポート種別の切り替えで該当のビューを選択
2. 従来の検索結果とは分けて、AI 生成回答に引用された際の表示回数・クリック数を確認します

見るときの注意:

- **AI 経由は「表示されてもクリックされない」傾向**があります。クリック数だけでなく表示回数も見てください
- ここで引用されやすくするために特別な schema を追加する必要はありません。**明確な見出し構造と、事実に基づいた具体的な記述**が最も効きます
- 本サイトは FAQ を持っていますが、FAQ rich results は2026年5月に廃止されたため FAQPage schema は意図的に入れていません（ユーザー向けコンテンツとしてのFAQは維持）

---

## 8. 登録後の定期確認（推奨頻度）

| 項目 | 頻度 |
|---|---|
| インデックス カバレッジのエラー | 月1回 |
| 検索パフォーマンス | 月1回 |
| Core Web Vitals | 四半期に1回、または大きな改修後 |
| Generative AI Performance | 月1回 |

---

## 関連

- Bing / IndexNow: [bing-webmaster-setup.md](./bing-webmaster-setup.md)
- 今後のページ追加計画: [seo-content-roadmap.md](./seo-content-roadmap.md)
