"use client";

import { usePathname } from "next/navigation";

import { GravitySwitch } from "@/components/landing/gravity-switch";
import { FlameScene } from "@/components/scene/flame-scene";
import { GravityProvider } from "@/components/scene/gravity";
import { SmoothScroll } from "@/components/smooth-scroll";

/**
 * Wraps every page. The sky, the chamber and the Earth / Freefall switch
 * belong to Home only: the data pages sit on a plain surface so nothing
 * moves behind the numbers.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const home = usePathname() === "/";

  return (
    <GravityProvider>
      <SmoothScroll>
        {home && <FlameScene />}
        {children}
        {home && <GravitySwitch />}
      </SmoothScroll>
    </GravityProvider>
  );
}
