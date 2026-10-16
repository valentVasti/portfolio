"use client";

import { useEffect } from "react";
import { monogramSvg } from "../monogram";
import { ACCENTS } from "./accent-panel";

/* Keeps the favicon's dot in the selected accent colour. Adds one <link rel="icon"> after the static icons Next.js
   generates from app/icon.svg and app/favicon.ico (browsers use the last matching icon) and rewrites its SVG data URL
   whenever the accent changes. Renders nothing. */
export default function LiveFavicon() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.sizes = "any";
    link.setAttribute("data-live-favicon", "");
    document.head.appendChild(link);

    const update = () => {
      const id = document.documentElement.getAttribute("data-accent");
      const dot = (ACCENTS.find((a) => a.id === id) ?? ACCENTS[0]).dot;
      link.href = "data:image/svg+xml," + encodeURIComponent(monogramSvg(dot));
    };
    update();
    window.addEventListener("accentchange", update);

    // Next.js streams its metadata <link>s into <head> after hydration, which can land them after ours.
    // Move ours back to the end whenever another icon link follows it.
    const keepLast = () => {
      const icons = document.head.querySelectorAll('link[rel~="icon"]');
      if (icons[icons.length - 1] !== link) document.head.appendChild(link);
    };
    keepLast();
    const mo = new MutationObserver(keepLast);
    mo.observe(document.head, { childList: true });

    return () => {
      mo.disconnect();
      window.removeEventListener("accentchange", update);
      link.remove();
    };
  }, []);

  return null;
}
