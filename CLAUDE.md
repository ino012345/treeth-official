# treeth-official

コーポレート・ポートフォリオサイト for treeth

## プロジェクト概要

ホームページ制作事業「treeth」のコーポレートサイト兼ポートフォリオサイト。
店舗・企業向けのコーポレートサイト・LP制作の実績と強みを伝えるサイト。

## ディレクトリ構成

```
treeth-official/
├── .claude/
│   └── commands/       # Claude Code プロジェクト専用スキル
├── src/
│   ├── components/     # 再利用可能なUIコンポーネント
│   ├── pages/          # ページコンポーネント
│   ├── styles/         # グローバルCSS・スタイル定義
│   └── assets/
│       └── images/     # 画像素材
├── public/             # 静的ファイル
└── CLAUDE.md
```

## Claude Code スキルの格納場所

プロジェクト固有のカスタムスキルは `.claude/commands/` に配置する。
- ファイル名がそのままスラッシュコマンド名になる（例: `deploy.md` → `/deploy`）
