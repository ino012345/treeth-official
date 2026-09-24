import type { Metadata } from "next";
// Use the local `geist` npm package instead of next/font/google to avoid
// build-time network requests to Google Fonts.
// GeistMono is intentionally not loaded: it cost 70KB on the critical path —
// half the total font payload — to style four small decorative labels, and the
// extra bytes delayed the swap-in of the body font (the LCP element). A system
// monospace stack renders those labels indistinguishably at their sizes.
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SITE } from "@/lib/site";

// Keywords appear because they describe what is actually offered — the terms a
// shop owner would search. No stuffing, no ranking claims.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "TREETH — 店舗・企業のホームページ制作 / コーポレートサイト・LP制作",
  description:
    "店舗・企業向けのコーポレートサイト制作、ホームページ制作、LP制作。企画からデザイン・実装・公開まで一貫して対応します。Web制作が初めての方もご相談いただけます。",
  alternates: { canonical: "/" },
  // Search Console / Bing can also be verified by DNS TXT (preferred — it
  // covers the whole domain). These env vars exist so the HTML-tag method is
  // available without a code change; unset, they simply emit nothing.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE.url,
    siteName: SITE.name,
    title: "TREETH — 店舗・企業のホームページ制作 / コーポレートサイト・LP制作",
    description:
      "コーポレートサイト・LPを、企画からデザイン・実装・公開まで一貫して制作します。Web制作が初めての方もご相談いただけます。",
    images: [{ url: "/hero.webp", width: 1920, height: 1080, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TREETH — 店舗・企業のホームページ制作",
    description:
      "コーポレートサイト・LPを、企画からデザイン・実装・公開まで一貫して制作します。",
    images: ["/hero.webp"],
  },
};

// Structured data — only facts that are also stated on the page itself.
// No aggregateRating: the 5.0 figure belongs to an external marketplace
// profile, not to reviews collected on this site, so claiming it as our own
// review data here would be misrepresentation.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  url: SITE.url,
  description:
    "店舗・企業向けのコーポレートサイト制作・LP制作。企画からデザイン・実装・公開まで一貫して対応します。",
  areaServed: { "@type": "Country", name: "日本" },
  serviceType: ["コーポレートサイト制作", "LP制作", "UI/UXデザイン"],
  knowsAbout: [...SITE.certifications],
  sameAs: [SITE.coconalaUrl],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${GeistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* WCAG 2.2 SC 2.4.1 — lets keyboard users jump past the nav */}
        <a href="#main" className="skip-link">
          本文へスキップ
        </a>
        <SmoothScrollProvider>
          <Navbar />
          {children}
          <Footer />
        </SmoothScrollProvider>
        {/* Vercel Web Analytics — cookieless, no cross-site tracking, and no
            custom events: page views and referrers only. The project is on the
            Hobby plan, where custom events are unavailable anyway, so nothing
            about a form submission is reported. Self-disables outside
            production. See /privacy for the visitor-facing description. */}
        <Analytics />
      </body>
    </html>
  );
}
