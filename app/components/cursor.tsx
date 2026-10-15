"use client";

import { useEffect, useRef } from "react";

const HOT = 'a, button, [role="tab"], input, textarea, select';

/* Small square dot that trails the pointer and grows over clickable things.
   Mouse only (not touch). Writes straight to the element's transform. Native cursor stays visible. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ref.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tx = 0, ty = 0, x = 0, y = 0, sc = 1, ts = 1, raf = 0, placed = false;
    const K = reduce ? 1 : 0.22;
    const isHot = (t: EventTarget | null) => !!(t as Element | null)?.closest?.(HOT);

    function paint() {
      x += (tx - x) * K; y += (ty - y) * K; sc += (ts - sc) * (reduce ? 1 : 0.2);
      el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${sc.toFixed(3)})`;
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1 || Math.abs(ts - sc) > 0.01) raf = requestAnimationFrame(paint);
      else raf = 0;
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(paint); };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX; ty = e.clientY;
      if (!placed) { x = tx; y = ty; placed = true; }
      el.classList.add("on"); kick();
    };
    const onOver = (e: PointerEvent) => { const hot = isHot(e.target); ts = hot ? 4 : 1; el.classList.toggle("hot", hot); kick(); };
    const onDown = () => { ts = 0.6; kick(); };
    const onUp = (e: PointerEvent) => { ts = isHot(e.target) ? 4 : 1; kick(); };
    const onLeave = () => el.classList.remove("on");

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="cur" aria-hidden="true" />;
}
