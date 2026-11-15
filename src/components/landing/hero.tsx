"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { useGravity } from "@/components/scene/gravity";
import { SiteHeader } from "@/components/shell/site-header";

import landing from "../../../data/landing.json";
import GravityLetters from "@/components/smoothui/gravity-letters";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { cn } from "@/lib/utils";


const HEADLINE = ["Fire has", "no up", "in space."];

const FREEFALL_CAPTION =
  "In freefall nothing rises. Oxygen only drifts in, so the flame settles into a dim blue sphere that is easy to miss.";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const },
});

export function Hero() {
  const { gravity } = useGravity();
  const onEarth = gravity === "earth";
  // With "reduce motion" switched on, the letters stay put instead of falling.
  // The headline then steps aside, so the Earth note is not written over it.
  const still = useReducedMotion();

  return (
    <section className="relative min-h-svh">
      <ScrollProgress className="z-[60] bg-none bg-ink" />

      {/*
        The headline obeys the switch too. On Earth its letters fall to the floor
        of the page; in freefall they drift back into place.
      */}
      <h1
        aria-label={HEADLINE.join(" ")}
        className={cn(
          "pointer-events-none absolute inset-x-0 top-[11svh] bottom-0 z-10 transition-opacity duration-300 text-[clamp(2.75rem,8.6vw,10.5rem)] font-bold leading-[0.9] tracking-[-0.045em] text-ink",
          still && onEarth && "opacity-0",
        )}
      >
        {HEADLINE.map((line, index) => (
          // Each line keeps its own top edge and shares the page's floor.
          <span
            key={line}
            className="absolute inset-x-[3vw] bottom-0 block"
            style={{ top: `${index * 0.9}em` }}
          >
            <GravityLetters
              text={line}
              trigger="manual"
              collapsed={onEarth}
              className="h-full min-h-0"
            />
          </span>
        ))}
      </h1>

      {/*
        Once the headline has fallen, the space it left explains why. It arrives
        a beat after the letters start dropping and leaves before they return.
      */}
      <AnimatePresence>
        {onEarth && (
          <motion.div
            key="earth-note"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
            className="absolute top-[13svh] left-[3vw] z-10 flex max-w-[46rem] flex-col gap-6"
          >
            <p className="text-[clamp(2.25rem,5.6vw,6.75rem)] font-bold leading-[0.93] tracking-[-0.04em] text-ink [text-shadow:0_1px_18px_rgb(3_3_4/0.95)]">
              On Earth,
              <br />
              hot gas rises.
            </p>
            <p className="max-w-[34rem] text-xl leading-snug text-ink [text-shadow:0_1px_18px_rgb(3_3_4/0.95)] md:text-2xl">
              Fresh air rushes in from below and the flame stretches into a teardrop. Smoke climbs
              to the ceiling, where a detector is waiting. Everything else falls.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <SiteHeader current="home" />

      <div className="absolute bottom-[15svh] left-[3vw] z-20 flex max-w-[22rem] flex-col gap-5">
        <div className="min-h-[6.5rem]">
          <AnimatePresence initial={false}>
            {!onEarth && (
              <motion.p
                key="freefall-caption"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.25 } }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
                className="text-lg leading-snug text-ink [text-shadow:0_1px_12px_rgb(3_3_4/0.9)]"
              >
                {FREEFALL_CAPTION}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <motion.div {...rise(0.3)} className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center rounded-[2px] bg-ink px-5 text-[15px] font-medium text-canvas transition-[transform,background-color] duration-150 hover:bg-ink-muted active:scale-[0.98]"
          >
            Open the dashboard
          </Link>
          <a
            href={landing.video.url}
            target="_blank"
            rel="noreferrer"
            className="link-draw py-3 text-[15px] font-medium text-ink"
          >
            Watch NASA&apos;s video: {landing.video.title}
          </a>
        </motion.div>
        <p className="font-mono text-[13px] text-ink-subtle">
          Sky: NASA photograph · Flame: simulation
        </p>
      </div>

    </section>
  );
}
