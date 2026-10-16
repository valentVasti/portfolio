"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent } from "react";
import { InfoIcon, PaletteIcon } from "@phosphor-icons/react";

// `dot` is each colour's bright (dark-theme) shade from globals.css, used for the favicon dot on its black tile.
export const ACCENTS = [
  { id: "mono", name: "Monochrome", dot: "#ededed" },
  { id: "orange", name: "Signal orange", dot: "#ff5b1f" },
  { id: "lime", name: "Electric lime", dot: "#c8f031" },
  { id: "teal", name: "Teal", dot: "#2dd4bf" },
  { id: "blue", name: "Electric blue", dot: "#5b9bff" },
  { id: "orchid", name: "Orchid", dot: "#e879f9" },
] as const;

type AccentId = (typeof ACCENTS)[number]["id"];
const DEFAULT: AccentId = "mono";
const isAccent = (v: string | null): v is AccentId => ACCENTS.some((a) => a.id === v);

// The <html> attribute is the source of truth (set before paint by the inline script in the layout).
function subscribe(cb: () => void) {
  window.addEventListener("accentchange", cb);
  return () => window.removeEventListener("accentchange", cb);
}
const readAccent = (): AccentId => {
  const v = document.documentElement.getAttribute("data-accent");
  return isAccent(v) ? v : DEFAULT;
};

/* Left-edge tab that opens a minimal panel of colour swatches for picking the site's accent colour. The colour itself fades via
   the registered --accent custom property in globals.css, so changing it here never re-renders the page. */
export default function AccentPanel() {
  const accent = useSyncExternalStore(subscribe, readAccent, () => DEFAULT);
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // The inline <head> script sets data-accent before paint. React clears it on the dev-mode remount, so re-apply.
  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem("accent");
      if (isAccent(saved)) document.documentElement.setAttribute("data-accent", saved);
    } catch {}
    window.dispatchEvent(new Event("accentchange"));
  }, []);

  useEffect(() => {
    if (!open) return;
    const i = ACCENTS.findIndex((a) => a.id === readAccent());
    optionRefs.current[i]?.focus({ preventScroll: true });

    // No overlay, so close on any press outside the panel and its tab.
    const onDown = (ev: PointerEvent) => {
      const t = ev.target as Node;
      if (!panelRef.current?.contains(t) && !triggerRef.current?.contains(t)) hide();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  function choose(id: AccentId) {
    document.documentElement.setAttribute("data-accent", id);
    try { localStorage.setItem("accent", id); } catch {}
    window.dispatchEvent(new Event("accentchange"));
  }

  function hide() {
    setOpen(false);
    setTip(false);
  }

  function close() {
    hide();
    triggerRef.current?.focus({ preventScroll: true });
  }

  function onKeyDown(ev: KeyboardEvent) {
    if (ev.key === "Escape") {
      ev.stopPropagation();
      if (tip) setTip(false);
      else close();
      return;
    }
    const i = ACCENTS.findIndex((a) => a.id === accent);
    let nx: number | null = null;
    if (ev.key === "ArrowDown" || ev.key === "ArrowRight") nx = (i + 1) % ACCENTS.length;
    else if (ev.key === "ArrowUp" || ev.key === "ArrowLeft") nx = (i - 1 + ACCENTS.length) % ACCENTS.length;
    if (nx !== null && (ev.target as HTMLElement).getAttribute("role") === "radio") {
      ev.preventDefault();
      choose(ACCENTS[nx].id);
      optionRefs.current[nx]?.focus();
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? hide() : setOpen(true))}
        aria-label="Change accent colour"
        aria-expanded={open}
        aria-controls="accent-panel"
        className="hero-fade fixed left-0 top-1/2 z-[43] flex -translate-y-1/2 flex-col items-center gap-2 border border-l-0 border-line bg-bg/80 px-1.5 py-3 text-base text-fg backdrop-blur-md transition-colors hover:bg-accent hover:text-on-accent md:px-2 md:py-4 md:text-xl"
        style={{ "--d": "1200ms" } as CSSProperties}
      >
        <PaletteIcon />
        <span className="block size-2.5 bg-accent ring-1 ring-current/30 md:size-3" aria-hidden="true" />
      </button>

      <div
        ref={panelRef}
        id="accent-panel"
        role="dialog"
        aria-label="Accent colour"
        className={`ap${open ? " open" : ""}`}
        inert={!open}
        onKeyDown={onKeyDown}
      >
        <div role="radiogroup" aria-label="Accent colour" className="flex flex-col gap-2.5 p-3">
          {ACCENTS.map((a, i) => {
            const selected = a.id === accent;
            return (
              <button
                key={a.id}
                ref={(el) => { optionRefs.current[i] = el; }}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={a.name}
                title={a.name}
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(a.id)}
                className={`swatch-${a.id} block size-7 ring-offset-2 ring-offset-bg transition-[box-shadow,transform] duration-300 hover:scale-110 md:size-8 ${
                  selected ? "ring-2 ring-fg" : "ring-0"
                }`}
              />
            );
          })}
        </div>

        <div className="flex justify-center border-t border-line py-1.5">
          <span className="group relative">
            <button
              type="button"
              aria-label="About this panel"
              aria-describedby="accent-panel-tip"
              aria-expanded={tip}
              onClick={() => setTip((t) => !t)}
              className="grid size-6 place-items-center text-sm text-mute transition-colors hover:text-accent focus-visible:text-accent"
            >
              <InfoIcon />
            </button>
            <span
              id="accent-panel-tip"
              role="tooltip"
              className={`pointer-events-none absolute left-full top-1/2 z-10 ml-4 w-52 -translate-y-1/2 border border-line bg-surface px-3 py-2 text-xs leading-relaxed text-fg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 ${
                tip ? "opacity-100" : "opacity-0"
              }`}
            >
              Changes the highlight colour used across the site. Your choice is saved on this device.
            </span>
          </span>
        </div>
      </div>
    </>
  );
}
