"use client";

import { usePathname } from "next/navigation";

import { GravitySwitch } from "@/components/landing/gravity-switch";
import { FlameScene } from "@/components/scene/flame-scene";
import { GravityProvider } from "@/components/scene/gravity";
import { SmoothScroll } from "@/components/smooth-scroll";

import { SpaceBackdrop } from "./space-backdrop";

/**
 * Wraps every page. The live scene, the chamber and the Earth / Freefall
 * switch belong to Home only. Every other page sits on a still backdrop of
 * the same sky, which answers the cursor and otherwise does not move.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const home = usePathname() === "/";

  return (
    <GravityProvider>
      <SmoothScroll>
        {home ? <FlameScene /> : <SpaceBackdrop />}
        {children}
        {home ? (
          <GravitySwitch />
        ) : (
          <p className="relative z-20 px-[3vw] pb-6 font-mono text-[12px] text-ink-subtle">
            Backdrop: NASA photograph iss074e0521637, NASA/Chris Williams
          </p>
        )}
      </SmoothScroll>
    </GravityProvider>
  );
}
