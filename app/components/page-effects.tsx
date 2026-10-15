"use client";

import { useEffect } from "react";

/* Scroll reveal for every [data-reveal] element and the spotlight that follows the pointer on [data-spot] cards. */
export default function PageEffects() {
  useEffect(() => {
    const ro = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll("[data-reveal]").forEach((el) => ro.observe(el));

    const onMove = (ev: PointerEvent) => {
      const el = (ev.target as Element).closest?.<HTMLElement>("[data-spot]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ev.clientX - r.left + "px");
      el.style.setProperty("--my", ev.clientY - r.top + "px");
    };
    document.addEventListener("pointermove", onMove, { passive: true });

    return () => { ro.disconnect(); document.removeEventListener("pointermove", onMove); };
  }, []);

  return null;
}
