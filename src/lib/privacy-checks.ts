import type { ThreadsAppFacts } from "./threads-app";

/**
 * Pre-publish checks for /privacy and /data-deletion.
 *
 * Kept free of runtime imports so `scripts/check-privacy.mjs` and the tests can
 * load it with Node's type stripping. The facts are passed in.
 *
 * Categories separate what kind of thing each item is, so a deliberate policy
 * choice is never reported as a missing setting:
 *   fact        — confirmed by the operator or by reading the source document
 *   policy      — a publication decision the operator approved
 *   legal       — needs a legal or platform-terms decision before publishing
 *   post_deploy — can only be verified once the pages are live
 *
 * BLOCKED means "do not publish yet". WARNING means "publishable, but someone
 * must look at this". Nothing here can make the pages legally compliant by
 * itself; it only records what has and has not been checked.
 */

export type CheckStatus = "PASS" | "WARNING" | "BLOCKED";
export type CheckCategory = "fact" | "policy" | "legal" | "post_deploy";

export interface CheckResult {
  id: string;
  category: CheckCategory;
  status: CheckStatus;
  title: string;
  reason: string;
}

export function runPrivacyChecks(facts: ThreadsAppFacts): CheckResult[] {
  const results: CheckResult[] = [];
  const add = (r: CheckResult) => results.push(r);

  // ── Approved publication policy ───────────────────────────────────────────
  const { publication } = facts;
  add({
    id: "policy.naming",
    category: "policy",
    status: "PASS",
    title: "固有名を掲載しない（アプリ名・Threads アカウント名・メールサービス名）",
    reason:
      `${publication.decidedOn} にユーザーが承認した方針。対象のツールは「${facts.serviceLabel}」、` +
      `運営者は「${facts.operatorPublicName}」、連絡先は ${facts.deletionContact} と表示する。` +
      "Meta Platform Terms 4(b) が求めるのはデータの種類・処理方法・目的・削除の依頼方法の説明で、アプリ名の掲載は求めていない。",
  });

  // ── Legal: operator identity (APPI art. 32) ───────────────────────────────
  add(
    facts.operatorIdentityMethod === "on_request"
      ? {
          id: "legal.operator-identity",
          category: "legal",
          status: "PASS",
          title: "事業者の氏名・住所（個人情報保護法第32条）",
          reason:
            "ご請求に応じて遅滞なく回答する旨を C-3 に記載する方法をユーザーが承認済み。実際に遅滞なく回答する運用が前提。",
        }
      : {
          id: "legal.operator-identity",
          category: "legal",
          status: "BLOCKED",
          title: "事業者の氏名・住所（個人情報保護法第32条）",
          reason:
            "氏名又は名称及び住所を本人の知り得る状態（求めに応じて遅滞なく回答する場合を含む）に置く方法が未承認。" +
            "屋号「TREETH」だけで足りるかは確認していない。公表するか、請求時に遅滞なく回答するか（operatorIdentityMethod）をユーザーが決める。",
        },
  );

  // ── Legal: processing outside Japan (web part) ────────────────────────────
  const fp = facts.foreignProcessing;
  add(
    fp.disclosedOn === null
      ? {
          id: "legal.external-environment",
          category: "legal",
          status: "WARNING",
          title: "外国にある事業者による処理（お問い合わせ・ホスティング）",
          reason:
            "お問い合わせ内容は米国の事業者のサービスを経由するが、事業者とサーバーの所在国を示していない（PPC Q&A 10-25）。",
        }
      : {
          id: "legal.external-environment",
          category: "legal",
          status: fp.openPoints.length > 0 ? "WARNING" : "PASS",
          title: "外国にある事業者による処理（お問い合わせ・ホスティング）",
          reason:
            `${fp.disclosedOn} から A-10 に事業者とサーバーの所在国を記載（PPC Q&A 10-25。メールサービスの名称は方針により記載しない）。` +
            (fp.openPoints.length > 0 ? ` 契約・管理画面での確認事項: ${fp.openPoints.join(" / ")}` : ""),
        },
  );

  // ── Facts: storage ────────────────────────────────────────────────────────
  const s = facts.storage;
  const storageConfirmed =
    s.checkedOn !== null && s.icloudDesktopSync === "off" && s.timeMachine === "no_backup_disk";
  add(
    storageConfirmed
      ? {
          id: "fact.storage",
          category: "fact",
          status: "PASS",
          title: "保存場所（運営者が管理するコンピューターとそのバックアップ）",
          reason:
            `${s.checkedOn} に確認: iCloud Drive のデスクトップ同期はオフ、Time Machine はバックアップディスク未設定。` +
            `ページは「ローカルのみ」とは書いていない。確認していないもの: ${s.notCovered.join("、")}。`,
        }
      : {
          id: "fact.storage",
          category: "fact",
          status: "BLOCKED",
          title: "保存場所（運営者が管理するコンピューターとそのバックアップ）",
          reason: "同期・バックアップの設定が確認されていない、または外部への保存が有効になっている。B-6 の記載を確定できない。",
        },
  );

  // ── Facts: Meta submission ────────────────────────────────────────────────
  const m = facts.metaSubmission;
  add(
    m.checkedOn === null
      ? {
          id: "fact.meta-submission",
          category: "fact",
          status: "BLOCKED",
          title: "Meta App Review の提出内容との照合",
          reason: "提出した文面と照合していない。リポジトリの下書きは提出文の代わりにならない。",
        }
      : {
          id: "fact.meta-submission",
          category: "fact",
          status: m.openPoints.length > 0 ? "WARNING" : "PASS",
          title: "Meta App Review の提出内容との照合",
          reason:
            `${m.checkedOn} に照合（${m.source}）。公開ページとの矛盾なし。` +
            (m.openPoints.length > 0 ? ` 確認事項: ${m.openPoints.join(" / ")}` : ""),
        },
  );

  // ── Facts: retention status ───────────────────────────────────────────────
  if (facts.retentionStatus === "active") {
    add(
      facts.gateBVerifiedOn
        ? {
            id: "fact.retention",
            category: "fact",
            status: "PASS",
            title: "保存期間の表示（active）",
            reason: `定期処理の本番稼働を ${facts.gateBVerifiedOn} に確認済み。${facts.internalDeleteDays}日で削除・上限${facts.retentionDays}日・1日${facts.runsPerDay}回と表示する。`,
          }
        : {
            id: "fact.retention",
            category: "fact",
            status: "BLOCKED",
            title: "保存期間の表示（active）",
            reason:
              "retentionStatus が active だが、ゲート B（定期処理の本番稼働と検証）の確認日が無い。稼働していない仕組みを稼働中と表示することになる。",
          },
    );
  } else {
    add({
      id: "fact.retention",
      category: "fact",
      status: "PASS",
      title: "保存期間の表示（planned）",
      reason:
        "自動削除は導入準備中・未稼働と表示し、取得済みの情報は自動では削除されていないと説明している。ゲート A・B の後に active に切り替える。",
    });
  }

  // ── Post-deploy ───────────────────────────────────────────────────────────
  add({
    id: "post.public-access",
    category: "post_deploy",
    status: "WARNING",
    title: "本番 URL の公開状態",
    reason:
      "https://www.treeth.net/privacy と /data-deletion が 200 を返し、Meta のクローラーの User-Agent でも取得でき、og:url がそのページ自身であることを公開後に確認する。",
  });
  add({
    id: "post.meta-dashboard",
    category: "post_deploy",
    status: "WARNING",
    title: "Meta App Dashboard への登録",
    reason: "Privacy Policy URL と User data deletion（Data Deletion Instructions URL）を公開後にユーザーが登録する。",
  });

  return results;
}

export function overallStatus(results: CheckResult[]): CheckStatus {
  if (results.some((r) => r.status === "BLOCKED")) return "BLOCKED";
  if (results.some((r) => r.status === "WARNING")) return "WARNING";
  return "PASS";
}
