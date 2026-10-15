"use client";

import { useEffect, useRef } from "react";

const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/";

/* Hero role text: scrambles from one title into the next, in a loop.
   Shows the range of what I do without adding more copy to the hero. */
export default function Scramble({ words }: { words: string[] }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = words[0]; return; }

    const heroEl = document.getElementById("top")!;
    let seen = true;
    const io = new IntersectionObserver((es) => { seen = es[0].isIntersecting; });
    io.observe(heroEl);

    let from = "", to = words[0], idx = 0, plan: [number, number][] = [], phase = "scramble";
    const DUR = 1100, HOLD = 2600;
    let ts = performance.now() + 250, raf = 0;
    const make = () => {
      plan = [];
      for (let i = 0, n = Math.max(from.length, to.length); i < n; i++) {
        const st = Math.random() * 0.45; plan.push([st, st + 0.35 + Math.random() * 0.2]);
      }
    };
    const frame = (p: number) => {
      let out = "";
      for (let i = 0; i < plan.length; i++) {
        const pl = plan[i], t = to.charAt(i);
        if (p >= pl[1]) out += t;
        else if (p >= pl[0]) out += t === " " ? " " : CH.charAt(Math.floor(Math.random() * CH.length));
        else out += from.charAt(i);
      }
      return out;
    };
    make();
    const tick = (now: number) => {
      if (seen && !document.hidden) {
        if (phase === "scramble") {
          const p = (now - ts) / DUR;
          if (p >= 1) { el.textContent = to; phase = "hold"; ts = now; }
          else el.textContent = frame(Math.max(0, p));
        } else if (now - ts >= HOLD) {
          from = to; idx = (idx + 1) % words.length; to = words[idx]; make(); phase = "scramble"; ts = now;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [words]);

  return <span ref={ref} aria-hidden="true">{words[0]}</span>;
}
