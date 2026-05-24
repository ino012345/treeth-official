"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "@phosphor-icons/react";

const NAV_LINKS = [
  { label: "Services",  href: "#services"  },
  { label: "Projects",  href: "#projects"  },
  { label: "FAQ",       href: "#faq"       },
] as const;

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

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

  const textColor   = scrolled ? "text-zinc-800"  : "text-white";
  const linkHover   = scrolled ? "hover:text-zinc-950" : "hover:text-white/80";
  const ctaClasses  = scrolled
    ? "bg-zinc-950 text-white hover:bg-zinc-800 border border-transparent"
    : "bg-white/15 text-white hover:bg-white/25 border border-white/30 backdrop-blur-sm";

  return (
    <header
      className={[
        "fixed top-0 inset-x-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-white/40 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/30 shadow-sm"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a
            href="/"
            className={`text-sm font-bold tracking-widest uppercase transition-colors duration-300 ${textColor}`}
          >
            treeth
          </a>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className={`text-sm transition-colors duration-200 ${textColor} ${linkHover}`}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className={[
                "inline-flex items-center rounded-2xl px-5 py-2.5 text-sm font-medium transition-colors duration-200",
                ctaClasses,
              ].join(" ")}
            >
              Start a Project
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${textColor}`}
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

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{    height: 0, opacity: 0 }}
            transition={SPRING}
            style={{ overflow: "hidden" }}
            className="bg-white/85 backdrop-blur-2xl border-t border-zinc-100 md:hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-sm font-medium text-zinc-700 hover:text-zinc-950 transition-colors border-b border-zinc-100 last:border-0"
                >
                  {label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-3 block w-full text-center rounded-2xl px-5 py-3 text-sm font-medium bg-zinc-950 text-white hover:bg-zinc-800 transition-colors"
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
