"use client";

import { useEffect, useRef, type ComponentProps } from "react";

type Props = { to: number; dec?: number; pre?: string; suf?: string } & ComponentProps<"span">;

/* Count-up for real resume numbers, starts when the number scrolls into view. */
export default function CountUp({ to, dec = 0, pre = "", suf = "", ...rest }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const fmt = (v: number) =>
      pre + v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = fmt(to); return; }
    el.textContent = fmt(0);
    let raf = 0;
    const co = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      co.disconnect();
      const t0 = performance.now(), dur = 1600;
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / dur), v = to * (1 - Math.pow(1 - k, 4));
        el.textContent = fmt(k < 1 ? v : to);
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      tick(t0);
    }, { threshold: 0.6 });
    co.observe(el);
    return () => { co.disconnect(); cancelAnimationFrame(raf); };
  }, [to, dec, pre, suf]);

  return (
    <span ref={ref} {...rest}>
      {pre}
      {to.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec })}
      {suf}
    </span>
  );
}
