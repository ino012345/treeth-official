# treeth-official

コーポレート・ポートフォリオサイト for treeth

## プロジェクト概要

ホームページ制作事業「treeth」のコーポレートサイト兼ポートフォリオサイト。
店舗・企業向けのコーポレートサイト・LP制作の実績と強みを伝えるサイト。

## スタック

| レイヤー | パッケージ | バージョン |
|---------|-----------|-----------|
| Framework | next | 16.2.2 |
| UI | react | 19.2.4 |
| Styling | tailwindcss | v4 |
| Animation | framer-motion | 12.38.0 |
| Smooth scroll | lenis | 1.3.21 |
| Icons | @phosphor-icons/react | 2.1.10 |
| Fonts | geist | 1.7.0 |

## ディレクトリ構成

```
treeth-official/
├── .claude/
│   ├── commands/           # Claude Code プロジェクト専用スキル
│   └── skills/             # 3d-scroll-website スキルリファレンス
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Geistフォント + SmoothScrollProvider
│   │   ├── page.tsx        # セクション組み立て
│   │   └── globals.css     # Tailwind v4 + デザイントークン
│   └── components/
│       ├── sections/       # Hero / CoreServices / ProjectsShowcase / BentoFeatures / ProcessMethodology / FinalCTA
│       ├── ui/             # AnimatedSection / Button / EyebrowBadge など
│       └── providers/      # SmoothScrollProvider
├── src/lib/                # ユーティリティ関数
├── public/
│   ├── frames/             # ヒーローフレームシーケンス
│   └── tunnel-frames/      # トンネルフレームシーケンス
└── CLAUDE.md
```

## コーディングルール

### コンポーネント
- **クライアントコンポーネントには必ず `"use client"` を記述する**（useEffect / useRef / useState / framer-motion を使うすべてのファイルに必須）。抜けると hydration mismatch が起きる。
- Phosphor Icons をサーバーコンポーネントで使う場合は `@phosphor-icons/react/dist/ssr` からインポートする。
- セクションファイルが 300 行を超えたら `ui/` に分割する。

### アニメーション・スクロール
- **スクロールハンドラ内では必ず RAF + ticking ref を使う**。scroll イベント内で直接 DOM や canvas を更新しない。
- canvas の drawImage / テキスト opacity / transform は ref 経由で直接 DOM に書き込む。React state はビジビリティフラグなど最低限に絞る。
- canvas は `devicePixelRatio` 対応必須（Retina でぼやけ防止）。
- スクロールリスナーは `{ passive: true }` を常につける。

### デザインシステム
- セクション spacing: `px-6 py-24 md:px-8 md:py-32`
- コンテナ: `mx-auto max-w-[1400px]`
- カード: `.card-surface`（globals.css で定義済み）を使う。影を個別に書かない。
- アクセントカラー: Indigo-500 / Violet-500 のグラデーション。色を増やさない。

### Tailwind
- v4 構文を使う（`@import "tailwindcss"`, `@theme inline`）。v3 の `@tailwind base` 等は使わない。

## Claude Code スキルの格納場所

プロジェクト固有のカスタムスキルは `.claude/commands/` に配置する。
- ファイル名がそのままスラッシュコマンド名になる（例: `deploy.md` → `/deploy`）
