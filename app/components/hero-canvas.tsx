"use client";

import { useEffect, useRef } from "react";

/* Generative sci-fi canvas (particle sphere, wireframe, orbital rings, scanner band, dust).
   Pure canvas, no libraries. Scroll progress is read inside the animation loop only. */
export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const hero = cv.parentElement!;
    const ctx = cv.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const TAU = Math.PI * 2, F = 5;
    let W = 0, H = 0, DPR = 1, cx = 0, cy = 0, R = 0, mobile = false;
    let sc = 1, cyOff = 0, fgRgb = "rgb(237,237,237)", accent = "#ededed", accentUntil = 0;
    let px = 0, py = 0, ps = 1, ox = 0, oy = 0, oz = 0;
    let tmx = 0, tmy = 0, mx = 0, my = 0;

    const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
    const smooth = (x: number) => { x = clamp01(x); return x * x * (3 - 2 * x); };
    const ease3 = (x: number) => { x = clamp01(x); return 1 - Math.pow(1 - x, 3); };

    const N = 1400;
    const tx = new Float32Array(N), ty = new Float32Array(N), tz = new Float32Array(N);
    const sx = new Float32Array(N), sy = new Float32Array(N), sz = new Float32Array(N), dl = new Float32Array(N);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
      tx[i] = Math.cos(th) * r; ty[i] = y; tz[i] = Math.sin(th) * r;
      const u = Math.random() * 2 - 1, a = Math.random() * TAU, rr = Math.sqrt(1 - u * u), d = 2.4 + Math.random() * 3.2;
      sx[i] = Math.cos(a) * rr * d; sy[i] = u * d; sz[i] = Math.sin(a) * rr * d;
      dl[i] = ((y + 1) / 2) * 0.9 + Math.random() * 0.35;
    }

    const M = 240;
    const dx = new Float32Array(M), dy = new Float32Array(M), dz = new Float32Array(M), dp = new Float32Array(M);
    for (let q = 0; q < M; q++) { dx[q] = Math.random(); dy[q] = Math.random(); dz[q] = 0.2 + Math.random() * 0.8; dp[q] = Math.random() * TAU; }

    type Ring = { a: number; tx: number; tz: number; spd: number; off: number; drift: number };
    const rings: Ring[] = [
      { a: 1.5, tx: 1.15, tz: 0.25, spd: 0.18, off: 0, drift: 0.03 },
      { a: 1.85, tx: -0.55, tz: -0.6, spd: -0.12, off: 2, drift: -0.02 },
      { a: 2.25, tx: 0.2, tz: 0.9, spd: 0.08, off: 4, drift: 0.015 },
    ];

    function rot(x: number, y: number, z: number, cY: number, sY: number, cX: number, sX: number) {
      const x1 = x * cY + z * sY, z1 = -x * sY + z * cY;
      ox = x1; oy = y * cX - z1 * sX; oz = y * sX + z1 * cX;
    }
    function project(x: number, y: number, z: number) {
      ps = F / (F + z); px = cx + x * R * ps * sc; py = cy + cyOff + y * R * ps * sc;
    }
    function ringPt(rg: Ring, u: number, c1: number, s1: number, c2: number, s2: number, cd: number, sd: number, cX: number, sX: number) {
      const x = Math.cos(u) * rg.a, z = Math.sin(u) * rg.a;
      const y1 = -z * s1, z1 = z * c1;
      const x2 = x * c2 - y1 * s2, y2 = x * s2 + y1 * c2;
      rot(x2, y2, z1, cd, sd, cX, sX); project(ox, oy, oz);
    }

    function readTheme() {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--fg-rgb").trim();
      fgRgb = "rgb(" + v + ")";
    }
    // --accent fades in CSS when the accent or theme changes; follow it frame by frame only while that fade runs.
    function readAccent() {
      accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || accent;
    }

    function resize() {
      const rect = hero.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width; H = rect.height;
      cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
      mobile = W < 768;
      if (mobile) { cx = W * 0.5; cy = H * 0.30; R = Math.min(W * 0.36, H * 0.24); }
      else { cx = W * 0.72; cy = H * 0.52; R = Math.min(W * 0.26, H * 0.36); }
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      readTheme();
      readAccent();
      if (reduce) draw(5);
    }

    function draw(T: number) {
      if (accentUntil) {
        readAccent();
        // One last read once the fade has finished, so the final colour sticks even if frames were skipped.
        if (performance.now() >= accentUntil) accentUntil = 0;
      }
      const p = reduce ? 0 : clamp01(window.scrollY / (H * 0.85));
      const ga = 1 - p * 0.96;
      ctx.clearRect(0, 0, W, H);
      if (ga <= 0.01) return;
      sc = 1 + p * 0.28; cyOff = -p * H * 0.10;
      const ex = 1 + p * 1.6;
      mx += (tmx - mx) * 0.045; my += (tmy - my) * 0.045;
      const rotY = T * 0.11 + mx * 0.75, rotX = 0.30 + my * 0.28;
      const cY = Math.cos(rotY), sY = Math.sin(rotY), cX = Math.cos(rotX), sX = Math.sin(rotX);
      ctx.fillStyle = fgRgb; ctx.strokeStyle = fgRgb;

      const wf = smooth((T - 1.3) / 1.6), rf = smooth((T - 1.9) / 1.4), sf = smooth((T - 2.4) / 0.8);
      const df = smooth(T / 1.2);

      /* dust */
      for (let i = 0; i < M; i++) {
        const z = dz[i];
        const x = (((dx[i] * W - mx * 22 * z) % W) + W) % W;
        const y = (((dy[i] * H - (reduce ? 0 : T * 5 * z) + my * 14 * z) % H) + H) % H;
        ctx.globalAlpha = (0.10 + 0.35 * z) * (0.65 + 0.35 * Math.sin(T * 1.4 + dp[i])) * df * ga;
        const s0 = z > 0.85 ? 1.6 : 1;
        ctx.fillRect(x, y, s0, s0);
      }

      /* wireframe sphere */
      if (wf > 0) {
        ctx.lineWidth = 0.7; ctx.globalAlpha = 0.11 * wf * ga;
        for (let k = 1; k <= 8; k++) {
          const phi = -Math.PI / 2 + k * Math.PI / 9, yy = Math.sin(phi), r2 = Math.cos(phi);
          ctx.beginPath();
          for (let j = 0; j <= 72; j++) {
            const t2 = j / 72 * TAU;
            rot(Math.cos(t2) * r2 * ex, yy * ex, Math.sin(t2) * r2 * ex, cY, sY, cX, sX); project(ox, oy, oz);
            if (j) ctx.lineTo(px, py); else ctx.moveTo(px, py);
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 0.08 * wf * ga;
        for (let m = 0; m < 6; m++) {
          const tm = m / 6 * Math.PI, ct = Math.cos(tm), st = Math.sin(tm);
          ctx.beginPath();
          for (let j2 = 0; j2 <= 72; j2++) {
            const uu = j2 / 72 * TAU, cu = Math.cos(uu);
            rot(cu * ct * ex, Math.sin(uu) * ex, cu * st * ex, cY, sY, cX, sX); project(ox, oy, oz);
            if (j2) ctx.lineTo(px, py); else ctx.moveTo(px, py);
          }
          ctx.stroke();
        }
      }

      /* particles */
      const intro = T < 3.4, scanY = Math.sin(T * 0.6) * 0.92;
      let style = fgRgb;
      ctx.fillStyle = style;
      for (let n = 0; n < N; n++) {
        let e = 1, kk = 0, X: number, Y: number, Z: number;
        if (intro) { e = ease3((T - dl[n]) / 1.8); kk = 1 - e; }
        const b = 1 + 0.016 * Math.sin(T * 1.2 + n * 0.37);
        if (kk > 0.0005) {
          X = sx[n] * kk + tx[n] * e * b; Y = sy[n] * kk + ty[n] * e * b; Z = sz[n] * kk + tz[n] * e * b;
          const ang = kk * 2.6, ca = Math.cos(ang), sa = Math.sin(ang);
          const X2 = X * ca + Z * sa; Z = -X * sa + Z * ca; X = X2;
        } else { X = tx[n] * b; Y = ty[n] * b; Z = tz[n] * b; }
        if (p > 0) { X *= ex; Y *= ex; Z *= ex; }
        rot(X, Y, Z, cY, sY, cX, sX); project(ox, oy, oz);
        const near = clamp01((1 - oz) * 0.5);
        let al = 0.10 + 0.90 * near * near, size = 0.7 + 1.6 * near, hot = false;
        if (sf > 0) { const dd = Math.abs(oy - scanY); if (dd < 0.05) { al += 0.8 * sf * (1 - dd / 0.05); size *= 1 + 0.8 * sf; hot = true; } }
        al *= ga * (intro ? Math.min(1, e * 2.2) : 1);
        if (al < 0.02) continue;
        if (mobile) size *= 0.85;
        const want = hot ? accent : fgRgb;
        if (want !== style) ctx.fillStyle = style = want;
        ctx.globalAlpha = al > 1 ? 1 : al;
        ctx.fillRect(px - size / 2, py - size / 2, size, size);
      }

      /* orbital rings and satellites */
      if (rf > 0) {
        ctx.lineWidth = 1; ctx.setLineDash([2, 9]);
        for (const rg of rings) {
          const c1 = Math.cos(rg.tx), s1 = Math.sin(rg.tx), c2 = Math.cos(rg.tz), s2 = Math.sin(rg.tz);
          const dr = T * rg.drift + rotY, cd = Math.cos(dr), sd = Math.sin(dr);
          ctx.globalAlpha = 0.30 * rf * ga;
          ctx.beginPath();
          for (let jr = 0; jr <= 120; jr++) {
            ringPt(rg, jr / 120 * TAU, c1, s1, c2, s2, cd, sd, cX, sX);
            if (jr) ctx.lineTo(px, py); else ctx.moveTo(px, py);
          }
          ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.fillStyle = accent;
        for (const rg2 of rings) {
          const d1 = Math.cos(rg2.tx), d2 = Math.sin(rg2.tx), d3 = Math.cos(rg2.tz), d4 = Math.sin(rg2.tz);
          const dr2 = T * rg2.drift + rotY, cd2 = Math.cos(dr2), sd2 = Math.sin(dr2);
          const dir = rg2.spd < 0 ? -1 : 1;
          for (let sIdx = 0; sIdx < 2; sIdx++) {
            const u0 = T * rg2.spd * 2.4 + rg2.off + sIdx * Math.PI;
            for (let tr = 0; tr < 14; tr++) {
              ringPt(rg2, u0 - dir * tr * 0.04, d1, d2, d3, d4, cd2, sd2, cX, sX);
              const nr = clamp01((1 - oz / 1.5) * 0.5);
              ctx.globalAlpha = (1 - tr / 14) * 0.9 * rf * ga * (0.35 + 0.65 * nr);
              const sz2 = tr === 0 ? 3.4 : 2.2 * (1 - tr / 18);
              ctx.fillRect(px - sz2 / 2, py - sz2 / 2, sz2, sz2);
            }
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    /* loop control: only runs while the hero is on screen */
    let running = false, raf = 0;
    const t0 = performance.now();
    function loop(now: number) { if (!running) return; draw((now - t0) / 1000); raf = requestAnimationFrame(loop); }
    // The loop pauses while the hero is off screen; re-read the accent on resume in case it changed meanwhile.
    function start() { if (reduce || running) return; readAccent(); running = true; raf = requestAnimationFrame(loop); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    const onMove = (ev: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      tmx = ((ev.clientX - rect.left) / rect.width - 0.5) * 2;
      tmy = ((ev.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onLeave = () => { tmx = 0; tmy = 0; };
    const onTheme = () => { readTheme(); readAccent(); accentUntil = performance.now() + 800; if (reduce) draw(5); };
    const onAccent = () => { readAccent(); accentUntil = performance.now() + 800; if (reduce) draw(5); };

    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    window.addEventListener("themechange", onTheme);
    window.addEventListener("accentchange", onAccent);
    const ro = new ResizeObserver(resize);
    ro.observe(hero);
    const io = new IntersectionObserver((es) => (es[0].isIntersecting ? start() : stop()), { threshold: 0 });
    io.observe(hero);
    resize();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("themechange", onTheme);
      window.removeEventListener("accentchange", onAccent);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
