import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PrivacyPolicy } from "@/components/legal/PrivacyPolicy";
import { DataDeletion } from "@/components/legal/DataDeletion";
import { POLICY_UPDATED_ON, THREADS_APP } from "@/lib/threads-app";

const PLANNED = { ...THREADS_APP, retentionStatus: "planned", gateBVerifiedOn: null };
const ACTIVE = { ...THREADS_APP, retentionStatus: "active", gateBVerifiedOn: "2026-12-01" };

const render = (Component, app) => renderToStaticMarkup(createElement(Component, { app, updatedOn: POLICY_UPDATED_ON }));

/** Visible text with tags removed and whitespace collapsed away (Japanese has none). */
const text = (html) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, "");

const STRAY_JP_SPACE =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}、。）」] +[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}（「]/u;

for (const [label, app] of [
  ["planned", PLANNED],
  ["active", ACTIVE],
]) {
  test(`${label}: both pages render, link to each other and name the contact`, () => {
    const privacy = render(PrivacyPolicy, app);
    const deletion = render(DataDeletion, app);
    assert.match(privacy, /href="\/data-deletion"/);
    assert.match(deletion, /href="\/privacy#threads-app"/);
    assert.match(privacy, /href="\/#contact"/);
    for (const html of [privacy, deletion]) {
      assert.ok(html.includes("mailto:contact@treeth.net"));
      assert.ok(text(html).includes("TREETHが運用するThreadsの商品トレンド調査・投稿支援ツール"));
    }
  });

  test(`${label}: no placeholders, handles or personal identifiers leak into the pages`, () => {
    for (const html of [render(PrivacyPolicy, app), render(DataDeletion, app)]) {
      const visible = html.replace(/<[^>]+>/g, " ");
      assert.doesNotMatch(visible, /[{}]/, "unfilled placeholder");
      // The only "@" on the pages is the contact address.
      assert.deepEqual([...new Set(visible.match(/\S*@\S*/g))], ["contact@treeth.net"]);
      assert.doesNotMatch(visible, /iCloud|Apple/);
      assert.doesNotMatch(visible, /個人事業/);
    }
  });

  test(`${label}: no stray spaces between Japanese sentences`, () => {
    for (const html of [render(PrivacyPolicy, app), render(DataDeletion, app)]) {
      for (const chunk of html.split(/<[^>]+>/)) assert.doesNotMatch(chunk, STRAY_JP_SPACE, chunk);
    }
  });
}

test("planned: says automated deletion is not running and how existing data stands", () => {
  const privacy = text(render(PrivacyPolicy, PLANNED));
  const deletion = text(render(DataDeletion, PLANNED));
  assert.ok(privacy.includes("現在導入の準備中で、まだ稼働していません"));
  assert.ok(privacy.includes("取得済みの情報（バックアップに含まれるものを含みます）は自動では削除されておらず"));
  assert.ok(privacy.includes("導入前であっても、削除のご依頼はB-9の窓口で受け付けており"));
  assert.ok(deletion.includes("自動削除は導入の準備中で、まだ稼働していません"));
  assert.ok(privacy.includes("Automateddeletionisbeingpreparedandisnotyetrunning"));
  // Nothing that only becomes true after release.
  for (const t of [privacy, deletion]) {
    assert.ok(!t.includes("1日2回"));
    assert.ok(!t.includes("28日"));
    assert.ok(!t.includes("ご依頼がなくても削除しています"));
  }
});

test("active: describes the 28-day deletion, 30-day limit and twice-daily job", () => {
  const privacy = text(render(PrivacyPolicy, ACTIVE));
  const deletion = text(render(DataDeletion, ACTIVE));
  assert.ok(privacy.includes("取得から30日以内に削除します"));
  assert.ok(privacy.includes("取得から28日を過ぎた後の定期処理（1日2回）で削除します"));
  assert.ok(privacy.includes("削除が遅れた場合は、再開後ただちに削除し、それまでの間は新たな取得を行いません"));
  assert.ok(privacy.includes("その情報を削除したコピーに置き換えるか、バックアップそのものを削除します"));
  assert.ok(privacy.includes("after28daysbyajobthatruns2timesaday"));
  assert.ok(deletion.includes("ご依頼がなくても削除しています"));
  for (const t of [privacy, deletion]) assert.ok(!t.includes("まだ稼働していません"));
});

test("both states: identity check and the 3-day target / 30-day limit are stated", () => {
  for (const app of [PLANNED, ACTIVE]) {
    const deletion = text(render(DataDeletion, app));
    assert.ok(deletion.includes("投稿のURLだけでは本人確認になりません"));
    assert.ok(deletion.includes("原則3営業日以内に行うことを当方の目標としています"));
    assert.ok(deletion.includes("ご本人確認の完了から30日以内に削除し"));
    assert.ok(deletion.includes("バックアップに含まれる分も削除の対象です"));
  }
});

test("C-3 (operator name and address on request) renders only once approved", () => {
  assert.ok(!text(render(PrivacyPolicy, { ...PLANNED, operatorIdentityMethod: null })).includes("C-3."));
  const approved = text(render(PrivacyPolicy, { ...PLANNED, operatorIdentityMethod: "on_request" }));
  assert.ok(approved.includes("運営者の氏名および住所は、ご請求があった場合に遅滞なくお知らせします"));
});

test("the committed configuration publishes C-3 (option 1) and stays planned", () => {
  assert.equal(THREADS_APP.operatorIdentityMethod, "on_request");
  assert.equal(THREADS_APP.retentionStatus, "planned");
  const page = text(render(PrivacyPolicy, THREADS_APP));
  assert.ok(page.includes("C-3.事業者の氏名・住所"));
  assert.ok(page.includes("まだ稼働していません"));
});

test("A-10 names the countries of the overseas services without naming the mail provider", () => {
  const html = render(PrivacyPolicy, THREADS_APP);
  const page = text(html);
  assert.ok(page.includes("A-10.外国にある事業者による取り扱い"));
  assert.ok(page.includes("VercelInc.（所在国：米国）"));
  assert.ok(page.includes("Resend,Inc.（所在国：米国）"));
  assert.ok(page.includes("事業者が国を特定して公表していないため特定できません"));
  assert.match(html, /href="https:\/\/www\.ppc\.go\.jp\/personalinfo\/legal\/kaiseihogohou\/#gaikoku"/);
  assert.doesNotMatch(page, /iCloud|Apple/);
});

test("every clause of the 2026-09-23 web policy is still present", () => {
  const fixture = JSON.parse(readFileSync(new URL("./fixtures/privacy-2026-09-23.json", import.meta.url), "utf8"));
  assert.equal(fixture.sections.length, 11);
  const page = text(render(PrivacyPolicy, PLANNED));

  // Kept word for word apart from renumbering, the A-2 cross-reference and A-1's "この部は".
  const allowed = (body) => [
    body,
    body.replace("詳細は第5項・第6項をご覧ください", "詳細はA-5・A-6をご覧ください"),
    body.replace("本ポリシーは、本サイトで", "この部は、本サイトで"),
  ];
  const verbatim = fixture.sections.slice(0, 8);
  for (const { body } of verbatim) {
    assert.ok(allowed(body).some((b) => page.includes(b.replace(/\s+/g, ""))), body.slice(0, 30));
  }

  // 9 / 10 / 11 were extended with the e-mail address; their original sentences remain.
  assert.ok(page.includes("本人確認のうえ、法令に従い速やかに対応いたします。"));
  assert.ok(page.includes("本ポリシーの内容は、必要に応じて予告なく変更する場合があります。変更後の内容は本ページに掲載した時点で効力を生じるものとします。"));
  assert.ok(page.includes("本ポリシーに関するお問い合わせ"));
  assert.ok(page.includes("本サイトのお問い合わせフォーム"));
});
