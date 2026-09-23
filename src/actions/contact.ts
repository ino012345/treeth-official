"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sender identity. Must be an address on a domain verified in Resend —
 * treeth.net is verified (DKIM at resend._domainkey.treeth.net, SPF + bounce MX
 * on send.treeth.net), so mail sent from it aligns for DMARC.
 *
 * The visitor's own address is never used here: putting a third party's address
 * in From fails their domain's SPF/DKIM and gets the mail spam-foldered or
 * rejected. Their address goes in Reply-To instead, so hitting reply still
 * reaches them.
 */
const FROM = process.env.RESEND_FROM_EMAIL ?? "TREETH <contact@treeth.net>";

/**
 * Where notifications land. contact@treeth.net is an iCloud Mail custom-domain
 * address, so From and To are the same mailbox — replying from there keeps the
 * treeth.net identity, and the visitor's address in Reply-To becomes the
 * recipient of that reply.
 *
 * Read from CONTACT_TO_EMAIL only. There is deliberately no fallback: an older
 * CONTACT_EMAIL variable used to hold a personal Gmail address, and silently
 * falling back to it would keep routing mail somewhere this change is meant to
 * move it away from. Missing config fails closed instead.
 */
const TO = process.env.CONTACT_TO_EMAIL;

export interface ActionResult {
  success: boolean;
  error?: string;
}

/** Generic message shown to visitors. Never surfaces internal detail. */
const GENERIC_ERROR = "送信に失敗しました。しばらくしてから再度お試しください。";

// Subject lines carry the visitor's name. Strip CR/LF so a crafted name cannot
// attempt header injection, and cap the length so the header stays sane.
function sanitizeForHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").slice(0, 80);
}

const LIMITS = { name: 100, email: 254, message: 5000 };

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
  if (!emailRegex.test(email) || email.length > LIMITS.email) {
    return { success: false, error: "有効なメールアドレスを入力してください。" };
  }

  if (name.length > LIMITS.name) {
    return { success: false, error: "お名前は100文字以内でご入力ください。" };
  }

  if (message.length > LIMITS.message) {
    return { success: false, error: "お問い合わせ内容は5000文字以内でご入力ください。" };
  }

  if (!TO) {
    // Misconfiguration, not a visitor mistake. Log the fact without any form
    // data, and show the visitor the same generic message.
    console.error("[contact] CONTACT_TO_EMAIL is not configured; cannot deliver.");
    return { success: false, error: GENERIC_ERROR };
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: [TO],
    // Replying to the notification reaches the person who filled in the form.
    replyTo: email,
    subject: `【treeth】${sanitizeForHeader(name)} 様からのお問い合わせ`,
    text: [
      `お名前: ${name}`,
      `メールアドレス: ${email}`,
      "",
      "--- お問い合わせ内容 ---",
      message,
    ].join("\n"),
  });

  if (error) {
    // Log only the error type. The full error object can echo back request
    // content, and this runs in a shared log stream — no submitted data, no
    // address, no message body goes to the console.
    console.error(`[contact] send failed: ${error.name}`);
    return { success: false, error: GENERIC_ERROR };
  }

  return { success: true };
}
