"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function sendContactEmail(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const name    = (formData.get("name")    as string | null)?.trim() ?? "";
  const email   = (formData.get("email")   as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  if (!name || !email || !message) {
    return { success: false, error: "すべての項目を入力してください。" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "有効なメールアドレスを入力してください。" };
  }

  const to = process.env.CONTACT_EMAIL ?? "yutainoue0225@gmail.com";

  const { error } = await resend.emails.send({
    from: "treeth お問い合わせフォーム <onboarding@resend.dev>",
    to: [to],
    replyTo: email,
    subject: `【treeth】${name} 様からのお問い合わせ`,
    text: [
      `お名前: ${name}`,
      `メールアドレス: ${email}`,
      "",
      "--- お問い合わせ内容 ---",
      message,
    ].join("\n"),
  });

  if (error) {
    console.error("Resend error:", error);
    return { success: false, error: "送信に失敗しました。しばらくしてから再度お試しください。" };
  }

  return { success: true };
}
