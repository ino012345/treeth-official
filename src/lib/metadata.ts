import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const OG_IMAGE = { url: "/hero.webp", width: 1920, height: 1080, alt: SITE.name };

/**
 * Metadata for a standalone page such as /privacy.
 *
 * Without this, a page inherits the root layout's canonical ("/") and og:url
 * (the top page), which tells search engines — and Meta's crawler, which
 * follows og:url — that the page is a duplicate of the top page. Metadata
 * merges shallowly, so openGraph is restated in full here.
 */
export function standalonePageMetadata({
  path,
  title,
  description,
}: {
  path: `/${string}`;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      url: `${SITE.url}${path}`,
      siteName: SITE.name,
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
