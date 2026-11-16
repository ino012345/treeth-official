import type { ReactNode } from "react";
import Link from "next/link";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";

/** Page shell shared by /privacy and /data-deletion. */
export function LegalPage({
  eyebrow,
  title,
  updatedOn,
  children,
}: {
  eyebrow: string;
  title: string;
  updatedOn: string;
  children: ReactNode;
}) {
  return (
    <main
      id="main"
      className="min-h-screen bg-[var(--background)] px-6 pt-32 pb-24 md:px-8 md:pt-40 md:pb-32"
    >
      <div className="mx-auto max-w-3xl">
        <EyebrowBadge>{eyebrow}</EyebrowBadge>
        <h1 className="mt-4 mb-2 text-3xl md:text-5xl font-semibold tracking-tighter text-zinc-50">
          {title}
        </h1>
        <p className="mb-12 text-sm text-zinc-400">最終更新日：{updatedOn}</p>
        {children}
      </div>
    </main>
  );
}

/** A top-level part of a page (e.g. "A. Web制作事業"). */
export function LegalPart({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-16 scroll-mt-28 first:mt-0">
      <h2
        id={`${id}-title`}
        className="mb-4 border-b border-zinc-800 pb-3 text-xl md:text-2xl font-semibold tracking-tight text-zinc-50"
      >
        {title}
      </h2>
      {lead && <div className="mb-8 text-sm md:text-base leading-relaxed text-zinc-400">{lead}</div>}
      <div className="flex flex-col gap-10">{children}</div>
    </section>
  );
}

export function LegalSection({ heading, id, children }: { heading: string; id?: string; children: ReactNode }) {
  return (
    <section id={id} className={id ? "scroll-mt-28" : undefined}>
      <h3 className="mb-3 text-lg font-semibold text-zinc-50">{heading}</h3>
      <div className="flex flex-col gap-3 text-sm md:text-base leading-relaxed text-zinc-300">{children}</div>
    </section>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-zinc-500">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/** Highlighted note — used for "not yet in operation" statements. */
export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="card-surface px-5 py-4 text-sm leading-relaxed text-zinc-300">{children}</div>
  );
}

const linkClass = "text-indigo-400 underline-offset-4 hover:text-indigo-300 hover:underline transition-colors";

export function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={linkClass}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={linkClass}>
      {children}
    </a>
  );
}

export function MailLink({ address, subject }: { address: string; subject?: string }) {
  const href = subject ? `mailto:${address}?subject=${encodeURIComponent(subject)}` : `mailto:${address}`;
  return <InlineLink href={href}>{address}</InlineLink>;
}

/** Back links shown at the bottom of each legal page. */
export function LegalFooterLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <nav aria-label="関連ページ" className="mt-16 flex flex-wrap items-center gap-6 text-sm">
      {links.map(({ href, label }) => (
        <InlineLink key={href} href={href}>
          {label}
        </InlineLink>
      ))}
      <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
        ← トップへ戻る
      </Link>
    </nav>
  );
}
