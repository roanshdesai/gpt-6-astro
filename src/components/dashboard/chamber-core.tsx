"use client";

import dynamic from "next/dynamic";

const ChamberCanvas = dynamic(() => import("./chamber-canvas"), { ssr: false });

/** The live 3D chamber. Loaded in the browser only, after the page has drawn. */
export function ChamberCore({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <ChamberCanvas />
    </div>
  );
}
