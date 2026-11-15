import { cn } from "@/lib/utils";

/*
 * Drawing parts for the dashboard's instrument look. Two kinds, kept apart:
 *   - gauges, whose lit segments are counts from src/lib/stats.ts;
 *   - framing (brackets, guide rings, the sweep), which carries no data, is
 *     always fainter than a gauge and is hidden from screen readers.
 */

const point = (cx: number, cy: number, r: number, degrees: number) => {
  const a = (degrees * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
};

/** One arc of a ring, from one angle to another. 0 degrees is three o'clock; -90 is the top. */
export function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const [x0, y0] = point(cx, cy, r, from);
  const [x1, y1] = point(cx, cy, r, to);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

export type Segment = {
  /** Lit segments are the ones being counted. */
  lit: boolean;
  /** Shown on hover. */
  title?: string;
  /** Overrides the lit colour, for a gauge with more than one kind of lit segment. */
  className?: string;
};

/**
 * A gauge made of equal segments, one per thing counted. It counts one kind
 * of thing only; the total is the number of segments.
 */
export function SegmentRing({
  cx,
  cy,
  r,
  width,
  segments,
  start = -90,
  sweep = 360,
  gap = 2.2,
  litClassName = "stroke-ink",
  restClassName = "stroke-ink/[0.16]",
}: {
  cx: number;
  cy: number;
  r: number;
  width: number;
  segments: Segment[];
  /** Angle of the first segment's leading edge. */
  start?: number;
  /** How much of the circle the gauge covers. */
  sweep?: number;
  /** Space between segments, in degrees. */
  gap?: number;
  litClassName?: string;
  restClassName?: string;
}) {
  const step = sweep / segments.length;
  return (
    <g fill="none" strokeWidth={width}>
      {segments.map((segment, index) => (
        <path
          key={index}
          d={arcPath(cx, cy, r, start + index * step + gap / 2, start + (index + 1) * step - gap / 2)}
          className={cn("hud-seg", segment.lit ? (segment.className ?? litClassName) : restClassName)}
          style={{ animationDelay: `${0.25 + index * 0.035}s` }}
        >
          {segment.title && <title>{segment.title}</title>}
        </path>
      ))}
    </g>
  );
}

/** Thin guide rings that turn behind a gauge. Framing only. */
export function GuideRings({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const ticks = Array.from({ length: 72 }, (_, index) => index * 5);
  return (
    <g aria-hidden fill="none" className="stroke-flame">
      <circle cx={cx} cy={cy} r={r} strokeWidth={1} opacity={0.22} />
      <g className="hud-turn" opacity={0.4}>
        {ticks.map((degrees) => {
          const long = degrees % 30 === 0;
          const [x0, y0] = point(cx, cy, r + 6, degrees);
          const [x1, y1] = point(cx, cy, r + (long ? 16 : 10), degrees);
          return <line key={degrees} x1={x0} y1={y0} x2={x1} y2={y1} strokeWidth={long ? 1.5 : 1} />;
        })}
      </g>
      <g className="hud-turn-back" opacity={0.35}>
        <path d={arcPath(cx, cy, r - 12, 20, 110)} strokeWidth={1.5} />
        <path d={arcPath(cx, cy, r - 12, 150, 185)} strokeWidth={1.5} />
        <path d={arcPath(cx, cy, r - 12, 230, 330)} strokeWidth={1.5} />
      </g>
      <g className="hud-sweep" opacity={0.5}>
        <path d={arcPath(cx, cy, r + 26, -90, -62)} strokeWidth={2} strokeLinecap="round" />
      </g>
    </g>
  );
}

/** Corner marks on a panel. Framing only. */
export function Brackets({ className }: { className?: string }) {
  const corner = "absolute size-3.5 border-flame/70";
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <span className={cn(corner, "-top-px -left-px border-t-2 border-l-2")} />
      <span className={cn(corner, "-top-px -right-px border-t-2 border-r-2")} />
      <span className={cn(corner, "-bottom-px -left-px border-b-2 border-l-2")} />
      <span className={cn(corner, "-right-px -bottom-px border-r-2 border-b-2")} />
    </span>
  );
}

/** A short ruler for the corner of a panel. Framing only. */
export function Ruler({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("flex items-end gap-[3px]", className)}>
      {Array.from({ length: 16 }, (_, index) => (
        <span
          key={index}
          className={cn("block w-px bg-flame/50", index % 4 === 0 ? "h-2.5" : "h-1.5")}
        />
      ))}
    </span>
  );
}
