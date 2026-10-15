"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { Experience } from "../data";

/* Accessible master-detail tabs */
export default function ExperienceTabs({ items }: { items: Experience[] }) {
  const [sel, setSel] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const e = items[sel];

  function onKeyDown(ev: KeyboardEvent) {
    const n = items.length;
    let nx: number | null = null;
    if (ev.key === "ArrowDown" || ev.key === "ArrowRight") nx = (sel + 1) % n;
    else if (ev.key === "ArrowUp" || ev.key === "ArrowLeft") nx = (sel - 1 + n) % n;
    else if (ev.key === "Home") nx = 0;
    else if (ev.key === "End") nx = n - 1;
    if (nx !== null) {
      ev.preventDefault();
      setSel(nx);
      tabRefs.current[nx]?.focus();
    }
  }

  return (
    <>
      <div
        role="tablist"
        aria-label="Work experience"
        aria-orientation="vertical"
        className="flex snap-x overflow-x-auto md:col-span-4 md:flex-col md:overflow-visible"
        onKeyDown={onKeyDown}
      >
        {items.map((it, i) => (
          <button
            key={i}
            ref={(el) => { tabRefs.current[i] = el; }}
            type="button"
            role="tab"
            id={`exp-tab-${i}`}
            aria-selected={i === sel}
            aria-controls="exp-panel"
            tabIndex={i === sel ? 0 : -1}
            className="tab"
            onClick={() => setSel(i)}
          >
            <span className="block text-base font-medium">{it.role}</span>
            <span className="mt-1 block text-sm">{it.company}</span>
            <span className="mt-2 block font-mono text-xs">{it.period}</span>
          </button>
        ))}
      </div>
      <div
        id="exp-panel"
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`exp-tab-${sel}`}
        className="min-h-[26rem] md:col-span-8"
      >
        {/* keyed so the list items replay their entrance animation on every switch */}
        <div key={sel}>
          <h3 className="text-3xl font-medium leading-[1.05] tracking-tighter md:text-5xl">{e.role}</h3>
          <p className="mt-4 text-lg">{e.company}</p>
          <p className="mt-1 text-mute">{e.place}</p>
          <p className="mt-4 font-mono text-sm text-mute">{e.period}</p>
          <ul className="mt-10 max-w-[65ch] space-y-5">
            {e.points.map((p, k) => (
              <li key={k} className="pt-li" style={{ "--i": k } as CSSProperties}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
