import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * There was no robots.txt at all before this (the URL 404'd), so nothing here
 * is loosening an existing restriction — it is stating intent explicitly.
 *
 * On AI crawlers: OAI-SearchBot is the crawler behind ChatGPT Search's result
 * surfacing, and is allowed so TREETH can appear there. GPTBot — which collects
 * data for model training — is a separate user agent with a different purpose
 * and is deliberately left out of the allow list rather than being granted
 * access implicitly.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        // ChatGPT Search result surfacing — wanted.
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
