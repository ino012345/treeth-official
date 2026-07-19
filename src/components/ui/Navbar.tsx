"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "@phosphor-icons/react";

const NAV_LINKS = [
  { label: "Services",  href: "#services"  },
  { label: "Projects",  href: "#projects"  },
  { label: "FAQ",       href: "#faq"       },
] as const;

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };
const MAGNET_SPRING = { type: "spring" as const, stiffness: 200, damping: 15, mass: 0.4 };

// ─── Magnetic nav link ────────────────────────────────────────────────────────
// Drifts toward the cursor while hovered, springs back on leave.

function MagneticLink({ label, href }: { label: string; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setOffset({
      x: (e.clientX - (rect.left + rect.width / 2)) * 0.3,
      y: (e.clientY - (rect.top + rect.height / 2)) * 0.3,
    });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={MAGNET_SPRING}
      className="text-sm text-white transition-colors duration-200 hover:text-white/80 px-1 py-2"
    >
      {label}
    </motion.a>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detect scroll to apply glassmorphism
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Before scroll: white text inverts against the hero canvas via blend mode.
  // The blend must live on an element without a background, so it sits on the
  // inner row, not the glassmorphic header itself.
  const blend = !scrolled && !menuOpen ? "mix-blend-difference" : "";

  return (
    <header
      className={[
        "fixed top-0 inset-x-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-zinc-950/80 backdrop-blur-2xl backdrop-saturate-150 border-b border-zinc-800/60 shadow-sm"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-8">
        <div className={`relative flex items-center justify-between h-16 ${blend}`}>

          {/* Logo — tight tracking + gradient clip */}
          <a
            href="/"
            className="text-lg font-black uppercase select-none"
            style={{ letterSpacing: "-0.08em" }}
          >
            <span className={scrolled ? "text-gradient-accent" : "text-white"}>
              TREETH
            </span>
          </a>

          {/* Desktop nav links — absolutely centered, magnetic */}
          <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <MagneticLink key={label} label={label} href={href} />
            ))}
          </nav>

          {/* Right side: Desktop CTA + Mobile hamburger */}
          <div className="flex items-center">
            <div className="hidden md:block">
              {/* CTA — rounded rectangle with left→right gradient border reveal */}
              <a
                href="#contact"
                className="group relative inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium text-white bg-white/10 backdrop-blur-sm transition-colors duration-200 hover:bg-white/[0.16] overflow-hidden"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-lg border border-white/25"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-lg border-2 transition-[clip-path] duration-500 ease-out [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)]"
                  style={{ borderColor: "var(--accent-primary)" }}
                />
                <span className="relative">Start a Project</span>
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors text-white"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{    rotate:  90, opacity: 0 }}
                    transition={SPRING}
                  >
                    <X size={20} weight="bold" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate:  90, opacity: 0 }}
                    animate={{ rotate:   0, opacity: 1 }}
                    exit={{    rotate: -90, opacity: 0 }}
                    transition={SPRING}
                  >
                    <List size={20} weight="bold" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{    height: 0, opacity: 0 }}
            transition={SPRING}
            style={{ overflow: "hidden" }}
            className="bg-zinc-950/90 backdrop-blur-2xl border-t border-zinc-800 md:hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-sm font-medium text-zinc-300 hover:text-zinc-50 transition-colors border-b border-zinc-800 last:border-0"
                >
                  {label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-3 block w-full text-center rounded-lg px-5 py-3 text-sm font-medium bg-zinc-950 text-white hover:bg-zinc-800 transition-colors border border-zinc-800"
              >
                Start a Project
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
