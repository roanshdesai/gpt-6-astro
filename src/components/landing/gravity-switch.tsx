"use client";

import { motion } from "motion/react";

import { type Gravity, useGravity } from "@/components/scene/gravity";
import { cn } from "@/lib/utils";

const OPTIONS: { id: Gravity; label: string }[] = [
  { id: "earth", label: "Earth" },
  { id: "freefall", label: "Freefall" },
];

/** The one control that rules the page. It stays pinned to the bottom of the screen. */
export function GravitySwitch() {
  const { gravity, setGravity } = useGravity();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      <div
        role="group"
        aria-label="Gravity"
        className="pointer-events-auto flex gap-1 rounded-[4px] border border-hairline-strong bg-canvas/85 p-1 backdrop-blur-sm"
      >
        {OPTIONS.map((option) => {
          const selected = option.id === gravity;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setGravity(option.id)}
              className={cn(
                "relative z-10 flex h-11 min-w-32 items-center justify-center gap-2.5 rounded-[2px] px-5 text-[15px] font-medium transition-colors duration-150 active:scale-[0.98]",
                selected ? "text-canvas" : "text-ink-muted hover:text-ink",
              )}
            >
              {selected && (
                <motion.span
                  layoutId="gravity-thumb"
                  className="absolute inset-0 -z-10 rounded-[2px] bg-ink"
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                />
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
