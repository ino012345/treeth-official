#!/usr/bin/env node
/**
 * Pre-publish check for /privacy and /data-deletion.
 *
 *   npm run privacy:check
 *
 * Prints every item in src/lib/privacy-checks.ts with PASS / WARNING /
 * BLOCKED and the reason. Exits 1 while anything is BLOCKED, 0 otherwise
 * (WARNING items still need a person to look at them).
 *
 * Deliberately NOT wired into the build: the pages render truthful wording
 * either way, and an unrelated deploy should not be blocked. Run it before
 * publishing a change to these pages, and before registering their URLs with
 * Meta.
 *
 * Imports the TypeScript modules directly (Node's built-in type stripping).
 */

import { THREADS_APP } from "../src/lib/threads-app.ts";
import { overallStatus, runPrivacyChecks } from "../src/lib/privacy-checks.ts";

const CATEGORY = {
  fact: "確認済みの事実",
  policy: "承認済みの公開方針",
  legal: "法令・規約の確認",
  post_deploy: "公開後に確認",
};

const results = runPrivacyChecks(THREADS_APP);

for (const r of results) {
  console.log(`[${r.status}] ${r.title}（${CATEGORY[r.category]} / ${r.id}）`);
  console.log(`    ${r.reason}`);
}

const overall = overallStatus(results);
const counts = ["PASS", "WARNING", "BLOCKED"].map((s) => `${s} ${results.filter((r) => r.status === s).length}`);
console.log(`\n総合: ${overall}（${counts.join(" / ")}）`);
process.exit(overall === "BLOCKED" ? 1 : 0);
