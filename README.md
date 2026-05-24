# treeth — コーポレートサイト / ポートフォリオ

店舗・企業向けWebサイト制作事業「treeth」の公式コーポレートサイト兼ポートフォリオ。  
プレミアムな3Dスクロールアニメーション × Next.js App Router × Resendお問い合わせフォームで構成されたモダンサイトです。

---

## 技術スタック

| カテゴリ | 技術 | バージョン |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.2 |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS v4 | 4.x |
| Animation | Framer Motion | 12.38.0 |
| Smooth Scroll | Lenis | 1.3.21 |
| Icons | Phosphor Icons | 2.1.10 |
| Fonts | Geist (ローカルパッケージ) | 1.7.0 |
| Email送信 | Resend | 6.x |
| Language | TypeScript | 5.x |

---

## Vercel へのデプロイ手順

このプロジェクトは **Vercel + GitHub 連携** でのデプロイを前提としています。

### 1. GitHub にプッシュ

```bash
git add .
git commit -m "initial commit"
git push origin main
```

### 2. Vercel プロジェクトを作成

1. [vercel.com](https://vercel.com) にログイン
2. **Add New → Project** を選択
3. 連携済みの GitHub リポジトリ（`treeth-official`）をインポート
4. Framework Preset が **Next.js** になっていることを確認
5. Build & Output Settings はすべてデフォルトのままでOK

### 3. 環境変数を Vercel ダッシュボードで設定（重要）

> **注意:** `.env.local` はローカル専用ファイルであり、Git管理対象外です。  
> Vercel 本番環境には **Vercelダッシュボード上** で別途環境変数を設定する必要があります。

**設定場所:** Vercel プロジェクト → **Settings** → **Environment Variables**

以下の2つの変数を追加してください。

| 変数名 | 説明 | 例 |
|---|---|---|
| `RESEND_API_KEY` | Resend のAPIキー（メール送信に必須） | `re_xxxxxxxxxxxxxxxx` |
| `CONTACT_EMAIL` | お問い合わせの受信先メールアドレス | `your@email.com` |

**`RESEND_API_KEY` の取得方法:**

1. [resend.com](https://resend.com) でアカウントを作成
2. ダッシュボード → **API Keys** → **Create API Key**
3. 生成されたキーをコピーして Vercel の環境変数に貼り付け

> **送信ドメインについて**  
> デフォルトの `from` アドレスは `onboarding@resend.dev`（Resend提供のテスト用）です。  
> 独自ドメインから送信したい場合は、Resend の **Domains** でドメイン検証を行い、  
> `src/actions/contact.ts` の `from` フィールドを `noreply@yourdomain.com` 等に変更してください。

### 4. デプロイ

環境変数を保存したら **Deployments** タブから **Redeploy** を実行（または次の push で自動デプロイ）。

---

## ローカル開発環境の起動

```bash
# 依存パッケージをインストール
npm install

# 環境変数ファイルを作成
cp .env.local.example .env.local
# → .env.local を編集して RESEND_API_KEY と CONTACT_EMAIL を設定

# 開発サーバーを起動
npm run dev
# → http://localhost:3000 で確認

# 本番ビルドの確認（Vercelデプロイ前に必ず実行）
npm run build
```

---

## 環境変数リファレンス

```env
# Resend APIキー（メール送信に必須）
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# お問い合わせの受信先メールアドレス
CONTACT_EMAIL=your@email.com
```

---

## フレームシーケンス画像

ヒーロー・トンネルアニメーションは事前書き出しの連番JPEGを Canvas でスクロール同期描画する方式です。

| パス | 用途 | フレーム数 |
|---|---|---|
| `public/frames/frame_XXXX.jpg` | Hero セクション | 111枚 |
| `public/tunnel-frames/frame_XXXX.jpg` | Projects セクション | 111枚 |

差し替え時は Blender / After Effects 等で新シーケンスを書き出し、各コンポーネントの `FRAME_COUNT` 定数を更新してください。

---

## ディレクトリ構成

```
treeth-official/
├── src/
│   ├── actions/
│   │   └── contact.ts          # Server Action（Resend メール送信）
│   ├── app/
│   │   ├── layout.tsx           # Geistフォント・Navbar・Footer
│   │   ├── page.tsx             # 全セクション組み立て
│   │   └── globals.css          # Tailwind v4 + デザイントークン + CSSアニメーション
│   └── components/
│       ├── sections/            # Hero / CoreServices / ProjectsShowcase / …
│       ├── ui/                  # AnimatedSection / Button / ContactForm / Navbar / CpuArchitecture 等
│       └── providers/           # SmoothScrollProvider
├── public/
│   ├── frames/                  # Hero フレームシーケンス（111枚）
│   └── tunnel-frames/           # Projects フレームシーケンス（111枚）
├── .env.local                   # ローカル環境変数（Git管理対象外）
├── CLAUDE.md                    # Claude Code 向けプロジェクトルール
└── README.md
```

---

## ライセンス

Copyright © 2025 treeth. All rights reserved.
