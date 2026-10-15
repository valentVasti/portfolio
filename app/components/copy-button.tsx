"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon, WarningIcon } from "@phosphor-icons/react";

async function writeClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Some in-app browsers and webviews deny clipboard-write; fall through to the legacy path.
    }
  }
  // Legacy fallback: also covers insecure contexts (e.g. testing over a LAN IP) where the Clipboard API is missing.
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  ta.remove();
  if (!ok) throw new Error("copy failed");
}

/** Square icon button that copies `value` and briefly shows a check mark. */
export default function CopyButton({ value, label, className = "" }: { value: string; label: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await writeClipboard(value);
      setState("copied");
    } catch {
      setState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      title={state === "copied" ? "Copied" : state === "failed" ? "Could not copy" : `Copy ${label}`}
      className={`inline-grid size-10 place-items-center border border-current/30 text-xl transition-colors hover:bg-bg hover:text-fg active:scale-95 md:size-12 md:text-2xl ${className}`}
    >
      {state === "copied" ? <CheckIcon /> : state === "failed" ? <WarningIcon /> : <CopyIcon />}
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? `${label} copied` : state === "failed" ? `Could not copy ${label}` : ""}
      </span>
    </button>
  );
}
