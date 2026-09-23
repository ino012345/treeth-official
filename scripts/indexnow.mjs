#!/usr/bin/env node
/**
 * Manually notify IndexNow (Bing, Yandex, and others) that specific URLs are
 * new or have changed.
 *
 *   npm run indexnow -- /            # notify the top page
 *   npm run indexnow -- / /privacy   # notify several
 *
 * Deliberately NOT wired into the build. This site is a handful of static
 * pages; firing on every deploy would resubmit unchanged URLs, which IndexNow
 * guidance explicitly discourages and which search engines rate-limit and
 * quality-score against. Run it when a page's content actually changed.
 *
 * The key is public by design: IndexNow verifies ownership by fetching
 * https://<host>/<key>.txt and checking it contains the same key.
 */

import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HOST = "www.treeth.net";
const ENDPOINT = "https://api.indexnow.org/IndexNow";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

// The key file lives at the site root; its filename is the key.
const keyFile = readdirSync(publicDir).find((f) => /^[0-9a-f]{8,128}\.txt$/i.test(f));
if (!keyFile) {
  console.error(
    "No IndexNow key file found in public/.\n" +
      "Expected a file named <key>.txt (8-128 hex chars) containing that key."
  );
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/i, "");

const paths = process.argv.slice(2);
if (paths.length === 0) {
  console.error("Usage: npm run indexnow -- <path> [<path>...]\n  e.g. npm run indexnow -- / /privacy");
  process.exit(1);
}

// Guard against the common mistake of blasting the whole site.
if (paths.length > 20) {
  console.error(`Refusing to submit ${paths.length} URLs at once. Submit only what changed.`);
  process.exit(1);
}

const urlList = paths.map((p) => new URL(p, `https://${HOST}`).toString());

const body = {
  host: HOST,
  key,
  keyLocation: `https://${HOST}/${keyFile}`,
  urlList,
};

console.log("Submitting to IndexNow:");
urlList.forEach((u) => console.log("  " + u));

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

// 200 = accepted, 202 = accepted pending key validation.
if (res.status === 200 || res.status === 202) {
  console.log(`\nOK (HTTP ${res.status}) — URLs accepted.`);
} else {
  console.error(`\nFailed: HTTP ${res.status}\n${await res.text()}`);
  process.exit(1);
}
