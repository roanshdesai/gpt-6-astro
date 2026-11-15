"use client";

import { useLenis } from "lenis/react";
import Snap from "lenis/snap";
import { useEffect } from "react";

/**
 * On Home, a scroll that stops between two full-screen sections settles on the
 * nearer one, so the page never rests with half of each on screen.
 *
 * Only sections marked `data-snap` take part. The long sections at the end of
 * the page are left out, so they still scroll freely. It is off on touch
 * screens, on narrow screens and when "reduce motion" is switched on.
 */
export function SectionSnap() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const desktop = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktop.matches || still.matches) return;

    const snap = new Snap(lenis, {
      type: "proximity",
      // Half a screen: any resting point between two full-screen sections is
      // within reach of one of them.
      distanceThreshold: "50%",
      debounce: 380,
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"));
    const remove = snap.addElements(sections, { align: "start" });

    return () => {
      remove();
      snap.destroy();
    };
  }, [lenis]);

  return null;
}
