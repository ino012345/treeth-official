import { test } from "node:test";
import assert from "node:assert/strict";
import { THREADS_APP } from "@/lib/threads-app";
import { overallStatus, runPrivacyChecks } from "@/lib/privacy-checks";

const statusOf = (facts, id) => runPrivacyChecks(facts).find((r) => r.id === id)?.status;

test("the committed facts are blocked only by the unapproved art. 32 method", () => {
  const results = runPrivacyChecks(THREADS_APP);
  const blocked = results.filter((r) => r.status === "BLOCKED").map((r) => r.id);
  assert.deepEqual(blocked, THREADS_APP.operatorIdentityMethod === null ? ["legal.operator-identity"] : []);
});

test("not showing the app name or handle is an approved policy, never a gap", () => {
  assert.equal(statusOf(THREADS_APP, "policy.naming"), "PASS");
  assert.equal("appName" in THREADS_APP, false);
  assert.equal("threadsUsername" in THREADS_APP, false);
});

test("active retention without gate B verification is BLOCKED", () => {
  const facts = { ...THREADS_APP, retentionStatus: "active", gateBVerifiedOn: null };
  assert.equal(statusOf(facts, "fact.retention"), "BLOCKED");
  assert.equal(overallStatus(runPrivacyChecks(facts)), "BLOCKED");
});

test("active retention with gate B verified passes that check", () => {
  const facts = { ...THREADS_APP, retentionStatus: "active", gateBVerifiedOn: "2026-12-01" };
  assert.equal(statusOf(facts, "fact.retention"), "PASS");
});

test("the committed retention status is never active without gate B", () => {
  if (THREADS_APP.retentionStatus === "active") assert.ok(THREADS_APP.gateBVerifiedOn);
});

test("operator identity: BLOCKED until a method is approved, PASS with on_request", () => {
  assert.equal(statusOf({ ...THREADS_APP, operatorIdentityMethod: null }, "legal.operator-identity"), "BLOCKED");
  assert.equal(statusOf({ ...THREADS_APP, operatorIdentityMethod: "on_request" }, "legal.operator-identity"), "PASS");
});

test("storage: unconfirmed or syncing settings are BLOCKED", () => {
  const unchecked = { ...THREADS_APP, storage: { ...THREADS_APP.storage, checkedOn: null } };
  const syncing = { ...THREADS_APP, storage: { ...THREADS_APP.storage, icloudDesktopSync: "on" } };
  assert.equal(statusOf(unchecked, "fact.storage"), "BLOCKED");
  assert.equal(statusOf(syncing, "fact.storage"), "BLOCKED");
  assert.equal(statusOf(THREADS_APP, "fact.storage"), "PASS");
});

test("Meta submission: unchecked is BLOCKED; open points are WARNING, not PASS", () => {
  const unchecked = { ...THREADS_APP, metaSubmission: { ...THREADS_APP.metaSubmission, checkedOn: null } };
  assert.equal(statusOf(unchecked, "fact.meta-submission"), "BLOCKED");
  const open = { ...THREADS_APP, metaSubmission: { ...THREADS_APP.metaSubmission, openPoints: ["x"] } };
  assert.equal(statusOf(open, "fact.meta-submission"), "WARNING");
  const clear = { ...THREADS_APP, metaSubmission: { ...THREADS_APP.metaSubmission, openPoints: [] } };
  assert.equal(statusOf(clear, "fact.meta-submission"), "PASS");
});

test("post-deploy items stay WARNING before publishing; overall never reports PASS while they are open", () => {
  const facts = { ...THREADS_APP, operatorIdentityMethod: "on_request" };
  const results = runPrivacyChecks(facts);
  for (const r of results.filter((x) => x.category === "post_deploy")) assert.equal(r.status, "WARNING");
  assert.equal(overallStatus(results), "WARNING");
});

test("the CLI exits 1 while anything is BLOCKED", async () => {
  const { spawnSync } = await import("node:child_process");
  const run = spawnSync(process.execPath, ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "scripts/check-privacy.mjs"], {
    encoding: "utf8",
  });
  const blocked = overallStatus(runPrivacyChecks(THREADS_APP)) === "BLOCKED";
  assert.equal(run.status, blocked ? 1 : 0);
  assert.match(run.stdout, /総合: (PASS|WARNING|BLOCKED)/);
  for (const r of runPrivacyChecks(THREADS_APP)) assert.ok(run.stdout.includes(`[${r.status}] ${r.title}`));
});
