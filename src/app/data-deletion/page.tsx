import { DataDeletion } from "@/components/legal/DataDeletion";
import { standalonePageMetadata } from "@/lib/metadata";
import { POLICY_UPDATED_ON, THREADS_APP } from "@/lib/threads-app";

export const metadata = standalonePageMetadata({
  path: "/data-deletion",
  title: "データ削除のご案内 | TREETH",
  description:
    "TREETHが運用するThreadsの商品トレンド調査・投稿支援ツールが保存している公開投稿の情報や、本サイトへのお問い合わせ内容の削除をご依頼いただく方法・ご本人確認・処理の目安をご案内します。",
});

export default function DataDeletionPage() {
  return <DataDeletion app={THREADS_APP} updatedOn={POLICY_UPDATED_ON} />;
}
