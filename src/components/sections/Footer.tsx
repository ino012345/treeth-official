const NAV_SECTIONS: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    title: "Service",
    links: [
      { label: "コーポレートサイト", href: "#services" },
      { label: "LP制作",             href: "#services" },
      { label: "UI/UXデザイン",       href: "#services" },
    ],
  },
  {
    title: "Work",
    links: [
      { label: "制作実績", href: "#projects" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "よくある質問",   href: "#faq"     },
      { label: "お問い合わせ",   href: "#contact" },
      { label: "Coconala Profile", href: "https://coconala.com/users/2538632", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-zinc-950 px-6 py-16 md:px-8">
      <div className="mx-auto max-w-[1400px]">

        {/* ── Main row ────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between gap-12">

          {/* Brand block */}
          <div className="flex flex-col gap-4 max-w-xs">
            <p className="text-sm font-bold tracking-widest text-white uppercase">TREETH</p>
            <p className="text-sm text-zinc-500 leading-relaxed">
              店舗・企業向けのコーポレートサイト・LP制作を手がけるWeb制作チーム。
              成果につながるWebサイトをお届けします。
            </p>
          </div>

          {/* Nav sections */}
          <div className="flex flex-wrap gap-10 md:gap-16">
            {NAV_SECTIONS.map(({ title, links }) => (
              <div key={title} className="flex flex-col gap-4">
                <p className="text-[10px] font-medium tracking-widest uppercase text-zinc-600">
                  {title}
                </p>
                <ul className="flex flex-col gap-3">
                  {links.map(({ label, href, external }) => (
                    <li key={label}>
                      <a
                        href={href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────────── */}
        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-zinc-600">
            © {new Date().getFullYear()} treeth. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors">
              プライバシーポリシー
            </a>
            <a href="/tokushoho" className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors">
              特定商取引法に基づく表記
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
