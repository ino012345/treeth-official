/**
 * Verified, single-source-of-truth facts about TREETH.
 *
 * Every number here must be traceable to a public, checkable source.
 * Do NOT add invented figures (conversion rates, revenue impact, response
 * times, pricing). If a value cannot be verified, it does not belong here.
 *
 * Values are hardcoded on purpose — the Coconala profile is never scraped at
 * runtime. When the source page changes, update this file.
 */

export const SITE = {
  name: "TREETH",
  url: "https://www.treeth.net",

  /** Public Coconala profile these figures come from. */
  coconalaUrl: "https://coconala.com/users/2538632",

  /**
   * Source: Coconala public profile, checked 2026-09-23.
   *   販売実績 45 / 評価 5.0
   */
  deliveredProjects: 45,
  rating: "5.0",
  ratingSourceLabel: "ココナラ評価",
  factsCheckedOn: "2026-09-23",

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
