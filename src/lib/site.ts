/**
 * Verified, single-source-of-truth facts about TREETH.
 *
 * Every number here must be traceable to a public, checkable source.
 * Do NOT add invented figures (conversion rates, revenue impact, response
 * times, pricing). If a value cannot be verified, it does not belong here.
 *
 * Values are hardcoded on purpose — the Coconala profile is never scraped at
 * runtime. When the source page changes, update this file and `factsCheckedOn`.
 */

/**
 * Source: Coconala public profile, re-checked 2026-09-23.
 *
 * Two DIFFERENT counts live on that profile and must not be conflated:
 *   - 販売実績 45   … every service sold, across all categories
 *   - 制作実績26件〜 … web production work specifically
 *
 * The site previously labelled 45 as "これまでの制作・納品実績", which reads as
 * "45 websites built". Each figure now carries the label of what it actually
 * counts.
 */
export const SITE = {
  name: "TREETH",
  url: "https://www.treeth.net",

  coconalaUrl: "https://coconala.com/users/2538632",
  factsCheckedOn: "2026-09-23",

  /** 販売実績 — all services sold on Coconala, not web projects alone. */
  coconalaSales: {
    value: 45,
    display: "45件",
    label: "ココナラ販売実績",
  },

  /** 制作実績26件〜 — web production work specifically. */
  webProjects: {
    display: "26件以上",
    label: "Web制作実績",
  },

  /** 評価 — Coconala's rating, out of 5. */
  rating: {
    display: "5.0",
    label: "ココナラ評価",
  },

  /**
   * Source: Coconala public profile, checked 2026-09-23.
   * Used as evidence for security-conscious design claims — not decoration.
   */
  certifications: [
    "情報処理安全確保支援士",
    "応用情報技術者",
    "個人情報保護士",
    "ITパスポート",
  ],
} as const;
