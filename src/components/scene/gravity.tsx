"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

export type Gravity = "earth" | "freefall";

type GravityContextValue = {
  gravity: Gravity;
  setGravity: (g: Gravity) => void;
  /** 0 = freefall, 1 = Earth. Read inside the render loop without re-rendering. */
  target: React.RefObject<number>;
  /** True once after a jump was requested: go straight to the target, no easing. */
  consumeSnap: () => boolean;
};

const GravityContext = createContext<GravityContextValue | null>(null);

export function GravityProvider({ children }: { children: React.ReactNode }) {
  const [gravity, setGravityState] = useState<Gravity>("freefall");
  const target = useRef(0);
  const snap = useRef(false);

  // ?gravity=earth opens the page already on Earth, with no morph. Handy for
  // sharing a link to either state and for recording the demo.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("gravity");
    if (wanted !== "earth") return;
    target.current = 1;
    snap.current = true;
    // Deferred so the first paint matches the server render.
    const id = window.setTimeout(() => setGravityState("earth"), 0);
    return () => window.clearTimeout(id);
  }, []);

  const value = useMemo<GravityContextValue>(
    () => ({
      gravity,
      setGravity: (g) => {
        target.current = g === "earth" ? 1 : 0;
        setGravityState(g);
      },
      target,
      consumeSnap: () => {
        const wanted = snap.current;
        snap.current = false;
        return wanted;
      },
    }),
    [gravity],
  );

  return (
    <GravityContext.Provider value={value}>{children}</GravityContext.Provider>
  );
}

export function useGravity() {
  const ctx = useContext(GravityContext);
  if (!ctx) throw new Error("useGravity must be used inside GravityProvider");
  return ctx;
}
