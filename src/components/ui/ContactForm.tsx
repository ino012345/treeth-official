"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { sendContactEmail } from "@/actions/contact";
import type { ActionResult } from "@/actions/contact";
import { ArrowRight } from "@phosphor-icons/react";

const initialState: ActionResult = { success: false };

// ─── Submit button — must be a separate component to access useFormStatus ─────

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={[
        "w-full inline-flex items-center justify-center gap-2",
        "rounded-2xl px-5 py-3 text-sm font-medium transition-colors duration-200",
        "bg-white text-zinc-950 hover:bg-zinc-100 border border-zinc-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        pending ? "opacity-60 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {pending ? "送信中..." : (
        <>
          送信する
          <ArrowRight size={16} weight="bold" />
        </>
      )}
    </button>
  );
}

// ─── Shared input class ───────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-xl bg-zinc-900/60 border border-zinc-700 px-4 py-3 text-sm text-white " +
  "placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors duration-200";

// ─── Component ────────────────────────────────────────────────────────────────

export function ContactForm() {
  const [state, action] = useActionState(sendContactEmail, initialState);

  if (state.success) {
    return (
      <div className="text-center py-6">
        <p className="text-lg font-semibold text-white mb-2">
          ありがとうございます！
        </p>
        <p className="text-sm text-white/60 leading-relaxed">
          お問い合わせを受け付けました。
          <br />
          通常1〜2営業日以内にご返信いたします。
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="cf-name"
          className="text-[10px] font-medium tracking-widest uppercase text-zinc-500"
        >
          お名前 <span className="text-indigo-400">*</span>
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="山田 太郎"
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="cf-email"
          className="text-[10px] font-medium tracking-widest uppercase text-zinc-500"
        >
          メールアドレス <span className="text-indigo-400">*</span>
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="taro@example.com"
          className={inputClass}
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="cf-message"
          className="text-[10px] font-medium tracking-widest uppercase text-zinc-500"
        >
          お問い合わせ内容 <span className="text-indigo-400">*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          required
          placeholder="ご依頼の詳細・ご要望をご自由にお書きください。"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Error message */}
      {state.error && (
        <p className="text-xs text-red-400 bg-red-950/50 border border-red-900/50 rounded-xl px-4 py-3">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
