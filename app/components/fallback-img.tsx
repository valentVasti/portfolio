"use client";

/* eslint-disable @next/next/no-img-element -- placeholder and logo images are hidden when they fail to load, like the original page */
import { useEffect, useRef, type ComponentProps } from "react";

export default function FallbackImg({ alt, ...props }: ComponentProps<"img">) {
  const ref = useRef<HTMLImageElement>(null);

  // The image may have failed before hydration, when onError was not attached yet.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0 && img.getAttribute("src")) img.style.display = "none";
  }, [props.src]);

  return (
    <img
      ref={ref}
      alt={alt}
      {...props}
      onLoad={(e) => (e.currentTarget.style.display = "")}
      onError={(e) => (e.currentTarget.style.display = "none")}
    />
  );
}
