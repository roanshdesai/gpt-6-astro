"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/** A bar that grows from its baseline the first time it scrolls into view. */
export function Grow({
  className,
  style,
  delay = 0,
  up = false,
}: {
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  /** Grow upwards from the bottom edge, for columns. Bars grow from the left. */
  up?: boolean;
}) {
  const still = useReducedMotion();
  const from = up ? { scaleY: 0 } : { scaleX: 0 };
  const to = up ? { scaleY: 1 } : { scaleX: 1 };
  return (
    <motion.span
      aria-hidden
      className={cn("block", up ? "origin-bottom" : "origin-left", className)}
      style={style}
      initial={still ? false : from}
      whileInView={to}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
