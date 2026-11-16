/**
 * The contact form's Server Action, with Resend and next/headers replaced by
 * test doubles (tests/support/mocks). No mail is sent.
 */
import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";

let importCount = 0;
async function loadAction(env) {
  // contact.ts reads its environment at module load, so each configuration
  // gets a fresh module instance.
  const saved = { ...process.env };
  Object.assign(process.env, { RESEND_API_KEY: "re_test_not_a_real_key", ...env });
  for (const [k, v] of Object.entries(env)) if (v === undefined) delete process.env[k];
  try {
    const url = new URL(`../src/actions/contact.ts?instance=${++importCount}`, import.meta.url);
    return (await import(url.href)).sendContactEmail;
  } finally {
    process.env = saved;
  }
}

let ipSeq = 0;
function form(fields, { ip } = {}) {
  globalThis.__testIp = ip ?? `198.51.100.${++ipSeq}`;
  const fd = new FormData();
  const values = {
    name: "山田 太郎",
    email: "taro@example.com",
    message: "ホームページ制作のご相談です。",
    website: "",
    startedAt: String(Date.now() - 30_000),
    ...fields,
  };
  for (const [k, v] of Object.entries(values)) fd.set(k, v);
  return fd;
}

const initial = { success: false };

beforeEach(() => {
  globalThis.__resendSent = [];
  globalThis.__resendError = null;
});

test("a genuine enquiry is sent once, to CONTACT_TO_EMAIL, replying to the visitor", async () => {
  const send = await loadAction({ CONTACT_TO_EMAIL: "inbox@example.test", RESEND_FROM_EMAIL: undefined });
  const result = await send(initial, form({}));
  assert.deepEqual(result, { success: true });
  assert.equal(globalThis.__resendSent.length, 1);
  const [mail] = globalThis.__resendSent;
  assert.deepEqual(mail.to, ["inbox@example.test"]);
  assert.equal(mail.replyTo, "taro@example.com");
  assert.equal(mail.from, "TREETH <contact@treeth.net>");
  assert.match(mail.text, /ホームページ制作のご相談です。/);
});

test("CR/LF in the name cannot reach the subject header", async () => {
  const send = await loadAction({ CONTACT_TO_EMAIL: "inbox@example.test" });
  await send(initial, form({ name: "山田\r\nBcc: x@example.com" }));
  const [mail] = globalThis.__resendSent;
  assert.doesNotMatch(mail.subject, /[\r\n]/);
});

test("missing CONTACT_TO_EMAIL fails closed without sending", async () => {
  const send = await loadAction({ CONTACT_TO_EMAIL: undefined });
  const result = await send(initial, form({}));
  assert.equal(result.success, false);
  assert.equal(globalThis.__resendSent.length, 0);
});

test("validation errors are reported and nothing is sent", async () => {
  const send = await loadAction({ CONTACT_TO_EMAIL: "inbox@example.test" });
  assert.equal((await send(initial, form({ name: "" }))).success, false);
  assert.equal((await send(initial, form({ email: "not-an-email" }))).success, false);
  assert.equal((await send(initial, form({ message: "あ".repeat(5001) }))).success, false);
  assert.equal(globalThis.__resendSent.length, 0);
});

test("a filled honeypot is dropped silently (reported as success, not sent)", async () => {
  const send = await loadAction({ CONTACT_TO_EMAIL: "inbox@example.test" });
  const result = await send(initial, form({ website: "https://spam.example" }));
  assert.deepEqual(result, { success: true });
  assert.equal(globalThis.__resendSent.length, 0);
});

test("the fourth submission from one IP within the window is rate limited", async () => {
  const send = await loadAction({ CONTACT_TO_EMAIL: "inbox@example.test" });
  const ip = "192.0.2.77";
  for (let i = 0; i < 3; i++) assert.equal((await send(initial, form({}, { ip }))).success, true);
  const fourth = await send(initial, form({}, { ip }));
  assert.equal(fourth.success, false);
  assert.match(fourth.error, /上限/);
  assert.equal(globalThis.__resendSent.length, 3);
});

test("a provider error shows the generic message", async () => {
  const send = await loadAction({ CONTACT_TO_EMAIL: "inbox@example.test" });
  globalThis.__resendError = { name: "validation_error", message: "x" };
  const result = await send(initial, form({}));
  assert.equal(result.success, false);
  assert.match(result.error, /送信に失敗しました/);
});
