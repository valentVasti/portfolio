"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { ListIcon, MoonIcon, SunIcon, XIcon } from "@phosphor-icons/react";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
];

function subscribeTheme(cb: () => void) {
  window.addEventListener("themechange", cb);
  return () => window.removeEventListener("themechange", cb);
}
const isDark = () => document.documentElement.getAttribute("data-theme") !== "light";

export default function Nav() {
  const sentinel = useRef<HTMLDivElement>(null);
  const dark = useSyncExternalStore(subscribeTheme, isDark, () => true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [away, setAway] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // The inline <head> script sets these before paint. React clears them on the dev-mode remount, so re-apply.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    try {
      const t = localStorage.getItem("theme");
      if (t === "light" || t === "dark") root.setAttribute("data-theme", t);
    } catch {}
    window.dispatchEvent(new Event("themechange"));
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch {}
    window.dispatchEvent(new Event("themechange"));
  }

  /* nav background after leaving the top (IntersectionObserver, no scroll listener) */
  useEffect(() => {
    const io = new IntersectionObserver((es) => setAway(!es[0].isIntersecting));
    io.observe(sentinel.current!);
    return () => io.disconnect();
  }, []);

  /* active section link */
  useEffect(() => {
    const so = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    [...SECTIONS.map((s) => s.id), "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) so.observe(el);
    });
    return () => so.disconnect();
  }, []);

  /* mobile menu */
  useEffect(() => {
    document.documentElement.classList.toggle("locked", menuOpen);
  }, [menuOpen]);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <div ref={sentinel} className="pointer-events-none absolute left-0 top-0 h-10 w-px" aria-hidden="true" />

      {/* Navigation: one line, 64px */}
      <header
        className="fixed inset-x-0 top-0 z-30 transition-colors duration-300"
        style={{
          backgroundColor: away ? "color-mix(in srgb, var(--bg) 72%, transparent)" : "transparent",
          backdropFilter: away ? "blur(12px)" : "none",
          borderBottom: away ? "1px solid var(--line)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
          <a href="#top" className="min-w-0 truncate font-mono text-xs tracking-tight sm:text-sm">
            Metodius Frenaldy Vasti Valentino
          </a>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="nl" aria-current={active === s.id ? "true" : undefined}>
                {s.label}
              </a>
            ))}
            <a href="#contact" className="btn btn-sm btn-ghost">Contact</a>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <button
              className="icon-btn"
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
              type="button"
              onClick={toggleTheme}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              className="icon-btn lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <XIcon /> : <ListIcon />}
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`mm${menuOpen ? " open" : ""}`} inert={!menuOpen}>
        <nav className="flex h-full flex-col justify-center gap-6 px-5 pt-16" aria-label="Mobile">
          {[...SECTIONS, { id: "contact", label: "Contact" }].map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-4xl font-medium tracking-tighter transition-colors hover:text-accent"
              onClick={() => setMenuOpen(false)}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
