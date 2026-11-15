"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * The backdrop of every page except Home: the same NASA photograph as Home,
 * dimmed, under a drafting grid. It answers the cursor: the sky shifts a
 * little against it, and the grid lights up in a soft pool around it.
 *
 * It only moves when the reader moves, and stays still with "reduce motion"
 * on and on touch screens, so nothing drifts behind the numbers by itself.
 */
export function SpaceBackdrop() {
  const root = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();

  useEffect(() => {
    const node = root.current;
    if (!node || still) return;

    // Where the cursor is (target) and where the backdrop has eased to (now),
    // both as a share of the window: 0 is the left or top edge, 1 the far one.
    const target = { x: 0.5, y: 0.3 };
    const now = { x: 0.5, y: 0.3 };
    let lit = 0;
    let wanted = 0;
    let frame = 0;

    const paint = () => {
      now.x += (target.x - now.x) * 0.09;
      now.y += (target.y - now.y) * 0.09;
      lit += (wanted - lit) * 0.08;
      node.style.setProperty("--cursor-x", `${(now.x * 100).toFixed(2)}%`);
      node.style.setProperty("--cursor-y", `${(now.y * 100).toFixed(2)}%`);
      node.style.setProperty("--shift-x", `${((0.5 - now.x) * 36).toFixed(2)}px`);
      node.style.setProperty("--shift-y", `${((0.5 - now.y) * 24).toFixed(2)}px`);
      node.style.setProperty("--lit", lit.toFixed(3));
      const settled =
        Math.abs(target.x - now.x) < 0.0005 && Math.abs(target.y - now.y) < 0.0005 && Math.abs(wanted - lit) < 0.005;
      frame = settled ? 0 : requestAnimationFrame(paint);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      target.x = event.clientX / window.innerWidth;
      target.y = event.clientY / window.innerHeight;
      wanted = 1;
      wake();
    };
    const leave = () => {
      wanted = 0;
      wake();
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [still]);

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* The sky, a little larger than the window so it has room to shift. */}
      <div
        className="absolute -inset-10 bg-[url(/nasa/milky-way-over-earth.jpg)] bg-cover bg-center opacity-45 will-change-transform"
        style={{ transform: "translate3d(var(--shift-x, 0px), var(--shift-y, 0px), 0)" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,transparent_0%,rgb(3_3_4/0.72)_46%,rgb(3_3_4/0.94)_100%)]" />
      {/* The planet's bright edge sits low in the photograph; the shade above keeps text readable over it. */}
      <div className="hud-grid absolute inset-0" />
      {/* Around the cursor: a pool of blue light, and the grid drawn brighter inside it. */}
      <div
        className="absolute inset-0"
        style={{
          opacity: "var(--lit, 0)",
          background:
            "radial-gradient(circle 26rem at var(--cursor-x, 50%) var(--cursor-y, 30%), rgb(111 155 255 / 0.19), transparent 70%)",
        }}
      />
      <div
        className="hud-grid-bright absolute inset-0"
        style={{
          opacity: "var(--lit, 0)",
          maskImage:
            "radial-gradient(circle 17rem at var(--cursor-x, 50%) var(--cursor-y, 30%), black 0%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle 17rem at var(--cursor-x, 50%) var(--cursor-y, 30%), black 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
