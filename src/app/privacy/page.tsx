import { PrivacyPolicy } from "@/components/legal/PrivacyPolicy";
import { standalonePageMetadata } from "@/lib/metadata";
import { POLICY_UPDATED_ON, THREADS_APP } from "@/lib/threads-app";

export const metadata = standalonePageMetadata({
  path: "/privacy",
  title: "プライバシーポリシー | TREETH",
  description:
    "TREETHのWeb制作事業（本サイト・お問い合わせ）と、TREETHが運用するThreadsの商品トレンド調査・投稿支援ツールにおける情報の取り扱い・保存期間・削除のご依頼について説明します。",
});

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy app={THREADS_APP} updatedOn={POLICY_UPDATED_ON} />;
}
