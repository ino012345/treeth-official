/**
 * Facts about the Threads tool that /privacy and /data-deletion describe, and
 * the record of what has been confirmed about them. The tool itself lives in a
 * separate repository; nothing here is read from it at runtime.
 *
 * Every statement on the pages must match what the tool actually does in
 * production and what was submitted in Meta App Review. `npm run privacy:check`
 * (src/lib/privacy-checks.ts) reads this record and reports PASS / WARNING /
 * BLOCKED.
 *
 * Names deliberately absent: the Meta app's name, the Threads account's
 * handle, and the operator's personal name and address. Leaving them out is an
 * approved publication policy (see `publication`), not a gap to fill in.
 */

export type RetentionStatus =
  /** Retention/deletion tooling is not yet running in production. */
  | "planned"
  /** Released to production, the twice-daily job registered and verified. */
  | "active";

export interface ThreadsAppFacts {
  /** How the tool is referred to on the pages, in place of the app name. */
  serviceLabel: string;
  /** Short form used after the first mention. */
  serviceShort: string;
  /** Public name of the operator. */
  operatorPublicName: string;
  deletionContact: string;

  /** Policy decisions made by the operator. Not configuration gaps. */
  publication: {
    decidedOn: string;
    showAppName: false;
    showThreadsHandle: false;
    showMailProviderName: false;
  };

  /**
   * Personal Information Protection Act art. 32 requires the business's
   * name and address to be in a state the person can know, which includes
   * answering without delay on request. Whether the trade name alone is
   * enough is not settled here. `null` until the operator approves a method;
   * "on_request" renders the C-3 statement that they are given on request.
   */
  operatorIdentityMethod: null | "on_request";

  /** Where the tool's database and backups live, as confirmed by the operator. */
  storage: {
    checkedOn: string | null;
    /** iCloud Drive "Desktop & Documents" sync. */
    icloudDesktopSync: "off" | "on" | null;
    /** Time Machine backup disk. */
    timeMachine: "no_backup_disk" | "configured" | null;
    /**
     * Not confirmed and not claimed: copies made before the check, and any
     * other sync or backup service.
     */
    notCovered: readonly string[];
  };

  /**
   * Web part: contact-form data handled by businesses outside Japan (APPI
   * art. 32 / PPC Q&A 10-25 ask for the countries to be made known). A-10
   * states the countries; `openPoints` lists what still needs the operator's
   * contracts or dashboards to settle.
   */
  foreignProcessing: {
    disclosedOn: string | null;
    openPoints: readonly string[];
  };

  /** Comparison with the App Review text actually submitted. */
  metaSubmission: {
    /** The submitted document, not the draft in the tool's repository. */
    source: string;
    checkedOn: string | null;
    /** Points to raise with the operator; empty when nothing is open. */
    openPoints: readonly string[];
  };

  retentionStatus: RetentionStatus;
  /**
   * Date the twice-daily retention job (release gate B) was verified running
   * in production. Required before `retentionStatus` may be "active".
   */
  gateBVerifiedOn: string | null;

  /** Upper limit stated publicly. */
  retentionDays: number;
  /** Internal deletion point, kept below the public limit. */
  internalDeleteDays: number;
  /** How many times a day the retention job runs once active. */
  runsPerDay: number;
  /** Keyword-level counts that identify nobody. */
  aggregateMonths: number;
  /** Internal target after identity is verified; not an external promise. */
  responseTargetBusinessDays: number;
}

export const THREADS_APP: ThreadsAppFacts = {
  serviceLabel: "TREETHが運用するThreadsの商品トレンド調査・投稿支援ツール",
  serviceShort: "本ツール",
  operatorPublicName: "TREETH",
  deletionContact: "contact@treeth.net",

  publication: {
    decidedOn: "2026-11-16",
    showAppName: false,
    showThreadsHandle: false,
    showMailProviderName: false,
  },

  // Option 1, approved by the operator on 2026-11-16. Requests are answered
  // under docs/OPERATOR_IDENTITY_REQUEST_PROCEDURE.md; the name and address
  // themselves are never added to this repository.
  operatorIdentityMethod: "on_request",

  storage: {
    checkedOn: "2026-11-16",
    icloudDesktopSync: "off",
    timeMachine: "no_backup_disk",
    notCovered: [
      "確認日より前に作られた外部のコピー",
      "iCloud Drive（デスクトップ同期）・Time Machine 以外の同期・バックアップサービス",
    ],
  },

  foreignProcessing: {
    disclosedOn: "2026-11-16",
    openPoints: [
      "Vercel の DPA は公開版で Pro・Enterprise プランが対象とされている。現在のプランで DPA が適用されるか、Vercel が個人データを「取り扱わないこととなっている」（Q7-53）と言えるかを確認する",
      "Resend の DPA（利用規約に組み込み）が、法第28条第1項の「相当措置を継続的に講ずるために必要な体制」として足りるかを確認する。足りない場合は、送信前の同意（法第28条第2項の情報提供を含む）を検討する",
      "受信メールを保管するメールサービスの契約上の位置づけ（委託か、取り扱わないこととなっているか）を確認する",
    ],
  },

  metaSubmission: {
    source: "App Review 提出内容（2026-10-19 提出、2026-11-15 に Meta から出力した PDF）",
    checkedOn: "2026-11-16",
    openPoints: [
      "提出時の「データの責任者」は運営者の個人名、公開ページの運営者表記は TREETH。矛盾ではないが、Meta から照会があれば TREETH が同じ個人の屋号であると説明する",
      "提出時の「データ処理者」は「なし」。審査用デモ（外部のホスティングで動作）はレビュアーのアクセストークンをメモリで扱うため、処理者に当たるかを確認する（公開ページの記載とは矛盾しない）",
    ],
  },

  retentionStatus: "planned",
  gateBVerifiedOn: null,

  retentionDays: 30,
  internalDeleteDays: 28,
  runsPerDay: 2,
  aggregateMonths: 12,
  responseTargetBusinessDays: 3,
};

/** Date shown as 最終更新日 on /privacy and /data-deletion. Set on publish. */
export const POLICY_UPDATED_ON = "2026年11月16日";
