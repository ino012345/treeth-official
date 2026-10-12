/**
 * Spam screening for the contact form.
 *
 * The form previously had no bot defences at all: no honeypot, no rate limit,
 * no content checks. Anything that could POST the Server Action got delivered.
 *
 * Nothing here is a substitute for a real bot challenge (see docs/spam-protection.md
 * on adding Cloudflare Turnstile). These are cheap layers that stop the bulk of
 * automated form spam without adding a dependency or a third-party request.
 *
 * Design rules:
 *  - False positives cost a real lead, so anything that could plausibly match a
 *    genuine enquiry only contributes to a score; only patterns no human writes
 *    reject outright.
 *  - Nothing in here logs submitted content.
 */

export type Verdict =
  | { kind: "ok" }
  /** Certainly a bot. Pretend it worked so the sender does not adapt. */
  | { kind: "silent-drop"; reason: string }
  /** Probably spam, but a human could conceivably hit it — tell them it failed. */
  | { kind: "reject"; reason: string };

// ─── Character-class probes ───────────────────────────────────────────────────

const HAS_JAPANESE = /[぀-ゟ゠-ヿ一-鿿]/;
const HAS_CYRILLIC = /[Ѐ-ӿ]/;
/** BBCode or raw HTML anchors. No human types these into a contact form. */
const MARKUP_LINK = /\[url[\s=\]]|\[link[\s=\]]|<a\s+href/i;
const URL_PATTERN = /\bhttps?:\/\/[^\s<>"']+|\bwww\.[^\s<>"']+/gi;

/**
 * Phrases that show up in the unsolicited-services spam this form receives and
 * effectively never in a genuine enquiry about having a site built.
 */
const SPAM_PHRASES = [
  "backlink",
  "back link",
  "guest post",
  "link building",
  "seo service",
  "seo expert",
  "rank your",
  "first page of google",
  "crypto",
  "bitcoin",
  "forex",
  "casino",
  "viagra",
  "loan offer",
  "web development services",
  "mobile app development",
  "offshore team",
  "hire dedicated",
  "увеличить",
  "продвижение",
];

function countUrls(text: string): number {
  return (text.match(URL_PATTERN) ?? []).length;
}

// ─── Screening ────────────────────────────────────────────────────────────────

export interface Submission {
  name: string;
  email: string;
  message: string;
  /** Hidden field no human can reach. Any value means a bot filled the form. */
  honeypot: string;
  /** Milliseconds between the form mounting and submission, if reported. */
  elapsedMs: number | null;
}

export function screen(sub: Submission): Verdict {
  // ── Tier 1: certainly automated ────────────────────────────────────────────

  if (sub.honeypot.trim() !== "") {
    return { kind: "silent-drop", reason: "honeypot" };
  }

  const haystack = `${sub.name}\n${sub.message}`;

  if (MARKUP_LINK.test(haystack)) {
    return { kind: "silent-drop", reason: "markup-link" };
  }

  const urls = countUrls(haystack);
  if (urls >= 4) {
    return { kind: "silent-drop", reason: "url-flood" };
  }

  // A name is a name. Any URL in it is a bot filling every field with payload.
  if (countUrls(sub.name) > 0) {
    return { kind: "silent-drop", reason: "url-in-name" };
  }

  // ── Tier 2: weighted signals ───────────────────────────────────────────────

  let score = 0;
  const hits: string[] = [];
  const add = (points: number, label: string) => {
    score += points;
    hits.push(label);
  };

  // This site is written in Japanese and sells to Japanese businesses. Cyrillic
  // in an enquiry is a near-certain tell, but kept as a score so it alone does
  // not reject someone quoting a Russian brand name.
  if (HAS_CYRILLIC.test(haystack)) add(3, "cyrillic");

  if (urls >= 2) add(2, "urls");

  const lower = haystack.toLowerCase();
  const phraseHits = SPAM_PHRASES.filter((p) => lower.includes(p));
  if (phraseHits.length > 0) add(2 * Math.min(phraseHits.length, 2), "phrases");

  // No Japanese anywhere is only a mild signal: a genuine enquiry could arrive
  // in English. It needs to combine with something else to reject.
  if (!HAS_JAPANESE.test(haystack)) add(2, "no-japanese");

  // Humans need time to fill three fields, even pasting. Treated as a nudge
  // rather than proof, since the timing is client-reported and forgeable.
  if (sub.elapsedMs !== null && sub.elapsedMs < 2000) add(1, "too-fast");

  if (score >= 4) {
    return { kind: "reject", reason: `score=${score} [${hits.join(",")}]` };
  }

  return { kind: "ok" };
}

// ─── Rate limiting ────────────────────────────────────────────────────────────

/**
 * Best-effort per-IP throttle held in module memory.
 *
 * On serverless this is per-instance, so it does not bound a distributed flood.
 * It does stop the common case — one source hammering the endpoint — at near
 * zero cost, and it protects the Resend send quota, which is the thing that
 * actually breaks real enquiries when it runs out.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const MAX_TRACKED_IPS = 5000;

const hits = new Map<string, number[]>();

export function rateLimit(ip: string): { allowed: boolean } {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return { allowed: false };
  }

  recent.push(now);
  hits.set(ip, recent);

  // Bound memory: a flood of unique IPs must not grow this map without limit.
  if (hits.size > MAX_TRACKED_IPS) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
      if (hits.size <= MAX_TRACKED_IPS) break;
    }
  }

  return { allowed: true };
}
