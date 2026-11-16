import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * All URLs use the www host, matching the canonical tag and the 308 redirect
 * from the apex domain — so the sitemap never advertises a URL that redirects.
 *
 * /privacy and /tokushoho are included rather than noindexed: they are real,
 * useful pages that a cautious prospect may well look for, and 特定商取引法 in
 * particular is a trust signal. They carry a low priority because they are not
 * pages we want ranking for service queries.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE.url}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE.url}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      // The URL meant for the Meta App Dashboard's data deletion instructions
      // field; listed so it is discoverable like the policy it belongs to.
      url: `${SITE.url}/data-deletion`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE.url}/tokushoho`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
