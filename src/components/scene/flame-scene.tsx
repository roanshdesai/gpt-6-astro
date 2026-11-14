"use client";

import dynamic from "next/dynamic";

const FlameCanvas = dynamic(() => import("./flame-canvas"), { ssr: false });

/** Full-screen WebGL layer behind the page: the sky, the stars and the chamber. */
export function FlameScene() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <FlameCanvas />
    </div>
  );
}
