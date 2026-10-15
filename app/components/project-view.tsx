"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { SITE_TITLE, type Project } from "../data";
import FallbackImg from "./fallback-img";

/* Client-side route: #/project/<slug> opens the detail view. Any other hash is a normal in-page anchor. */
export default function ProjectView({ projects }: { projects: Project[] }) {
  const [slug, setSlug] = useState<string | null>(null);
  const pvRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const internal = useRef(false);

  const idx = projects.findIndex((p) => p.slug === slug);
  const open = idx >= 0;
  const p = open ? projects[idx] : null;
  const next = open ? projects[(idx + 1) % projects.length] : null;

  useEffect(() => {
    const route = () => {
      const m = location.hash.match(/^#\/project\/([\w-]+)/);
      setSlug(m && projects.some((pr) => pr.slug === m[1]) ? m[1] : null);
    };
    const onHash = () => { internal.current = true; route(); };
    window.addEventListener("hashchange", onHash);
    route();
    return () => window.removeEventListener("hashchange", onHash);
  }, [projects]);

  const requestClose = useCallback(() => {
    if (internal.current) history.back(); else location.hash = "#projects";
  }, []);

  useEffect(() => {
    const app = document.getElementById("app");
    if (p) {
      if (!lastFocus.current) lastFocus.current = document.activeElement as HTMLElement | null;
      if (app) app.inert = true;
      if (pvRef.current) pvRef.current.scrollTop = 0;
      document.documentElement.classList.add("locked");
      document.title = `${p.title} | Metodius Frenaldy Vasti Valentino`;
      closeRef.current?.focus({ preventScroll: true });
    } else if (lastFocus.current) {
      if (app) app.inert = false;
      document.documentElement.classList.remove("locked");
      document.title = SITE_TITLE;
      lastFocus.current.focus?.({ preventScroll: true });
      lastFocus.current = null;
    }
  }, [p]);

  useEffect(() => {
    if (!open) return;
    const onKey = (ev: KeyboardEvent) => { if (ev.key === "Escape") requestClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, requestClose]);

  return (
    <div
      ref={pvRef}
      className={`pv${open ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pv-title"
      inert={!open}
    >
      <div className="sticky top-0 z-10 border-b border-line bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-5 md:px-8">
          <button ref={closeRef} type="button" className="btn btn-sm btn-ghost" onClick={requestClose}>
            <ArrowLeftIcon /> Projects
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-5 pb-24 pt-10 md:px-8 md:pt-14">
        <div className={`${p?.original ? "" : "scan "}aspect-[21/9] overflow-hidden bg-surface`}>
          {p && (
            <FallbackImg
              key={p.slug}
              src={p.img}
              alt=""
              className={`h-full w-full object-cover${p.original ? "" : " grayscale"}`}
            />
          )}
        </div>
        <h2 id="pv-title" className="h2 mt-10 max-w-4xl">{p?.title}</h2>
        <p className="mt-5 font-mono text-sm text-mute">{p?.period}</p>
        <ul key={p?.slug} className="mt-10 max-w-[65ch] space-y-5 text-lg">
          {p?.points.map((t, k) => <li key={k} className="pt-li">{t}</li>)}
        </ul>
        <a
          href={next ? `#/project/${next.slug}` : "#"}
          className="contact-row mt-20 border-y border-line"
          onClick={(ev) => {
            ev.preventDefault();
            if (next) location.replace(`#/project/${next.slug}`);
          }}
        >
          <ArrowRightIcon className="text-2xl" />
          <span className="min-w-0">
            <span className="block text-sm opacity-70">Next project</span>
            <span className="block text-xl tracking-tight md:text-3xl">{next?.title}</span>
          </span>
          <ArrowUpRightIcon className="text-2xl" />
        </a>
      </div>
    </div>
  );
}
