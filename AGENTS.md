<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — treeth-official

AI エージェント（Claude Code 含む）がこのリポジトリで作業する際のルール集。

## ビルド・確認コマンド

```bash
npm run dev      # 開発サーバー起動 (localhost:3000)
npm run build    # 本番ビルド（エラーチェック）
npm run lint     # ESLint
```

## 作業の進め方

1. セクションは **上から順番** に実装する（Hero → CoreServices → ProjectsShowcase → BentoFeatures → ProcessMethodology → FinalCTA）。
2. 各セクション実装後、必ずブラウザで実際にスクロールして動作確認してから次へ進む。
3. `npm run build` を通してからタスク完了とする。

## コーディング必須ルール

### `"use client"` ディレクティブ
- `useEffect`, `useRef`, `useState`, `framer-motion` を使うすべてのファイルの **先頭行** に `"use client"` を書く。
- 省略すると Next.js が hydration error を出す。エラーが出たらまずこれを確認する。

### アニメーション: RAF + ticking ref パターン
```ts
const tickingRef = useRef(false);

window.addEventListener("scroll", () => {
  if (!tickingRef.current) {
    tickingRef.current = true;
    requestAnimationFrame(() => {
      // ← ここで canvas.drawImage / ref.current.style など直接DOM操作
      tickingRef.current = false;
    });
  }
}, { passive: true });
```
- scroll ハンドラ内で直接 DOM を触らない。
- React state への更新はビジビリティの変化時のみ（毎フレームは禁止）。

### canvas: DPR 対応
```ts
const dpr = window.devicePixelRatio || 1;
canvas.width = window.innerWidth * dpr;
canvas.height = window.innerHeight * dpr;
canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";
ctx.scale(dpr, dpr);
```

### Phosphor Icons
- サーバーコンポーネント: `@phosphor-icons/react/dist/ssr`
- クライアントコンポーネント: `@phosphor-icons/react`

### デザイントークン
- 影は必ず `var(--card-shadow)` か `.card-surface` クラスを使う。個別に box-shadow を書かない。
- アクセントカラーは `indigo-500` / `violet-500` のみ。新色を追加しない。
- セクション spacing: `px-6 py-24 md:px-8 md:py-32`

## やってはいけないこと

- `React.useState` をスクロール値やフレーム番号の保持に使う（jank の原因）
- `scroll-behavior: smooth` を CSS で設定する（Lenis と競合する）
- Three.js / WebGL を導入する（フレームシーケンス方式で十分）
- `--no-verify` でコミットフックをスキップする
