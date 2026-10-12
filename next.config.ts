import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * Vercel already sends HSTS; everything else was missing. These are the
 * directives that can be applied to a statically prerendered site without
 * making it dynamic.
 *
 * On script-src: a strict, nonce-based CSP would need a nonce generated per
 * request, which forces every page out of static prerendering. For a marketing
 * site with no user accounts and no user-generated content on the page, that
 * trade is not worth it, so 'unsafe-inline' stays to allow Next.js's bootstrap
 * scripts and the JSON-LD block. The policy still earns its place: it pins
 * script, style, font, image and connection origins to this site, so an
 * injected reference to an external host is blocked, and frame-ancestors
 * 'none' is not weakened by 'unsafe-inline' at all.
 */
const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' for Next.js bootstrap + JSON-LD; see note above.
  "script-src 'self' 'unsafe-inline'",
  // Tailwind and React write inline styles.
  "style-src 'self' 'unsafe-inline'",
  // data: covers next/image placeholders.
  "img-src 'self' data: blob:",
  // Geist is self-hosted through next/font.
  "font-src 'self'",
  // Vercel Web Analytics beacons go to /_vercel/insights on this origin.
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  // Defence in depth for clickjacking alongside frame-ancestors, for anything
  // that still honours the older header.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the origin cross-site, the full path same-site. Keeps referrer-based
  // analytics working without leaking paths to third parties.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site uses none of these; deny them so injected code cannot either.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // Hide the framework version from responses.
  poweredByHeader: false,

  experimental: {
    // Tree-shake Phosphor Icons — avoids importing the entire icon set
    optimizePackageImports: ["@phosphor-icons/react"],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
