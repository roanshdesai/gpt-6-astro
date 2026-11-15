import { cn } from "@/lib/utils";

import { Grow } from "./grow";

type Row = { id: string; name: string; title?: string; value: number };

/**
 * Ranked horizontal bars on one baseline: a name, a bar on a faint track, and
 * its figure at the tip. The first `lit` rows are the ones the answer names;
 * they are drawn bright and the rest sit back.
 */
export function RankedBars({ rows, max, label, lit = 0 }: { rows: Row[]; max: number; label: string; lit?: number }) {
  return (
    <ol className="flex flex-col" aria-label={label}>
      {rows.map((row, index) => {
        const bright = index < lit;
        return (
          <li
            key={row.id}
            className="grid grid-cols-1 items-center gap-x-5 gap-y-1.5 border-t border-flame/15 py-2.5 sm:grid-cols-[minmax(0,17rem)_1fr]"
          >
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[15px] font-semibold leading-snug">{row.name}</span>
              {row.title && row.title !== row.name && (
                <span className="truncate text-[13px] text-ink-subtle" title={row.title}>
                  {row.title}
                </span>
              )}
            </span>
            <span className="relative flex min-w-0 items-center gap-3">
              {/* The track shows where the longest bar would reach. Framing only. */}
              <span aria-hidden className="absolute inset-y-0 left-0 right-[2.75rem] my-auto h-px bg-flame/20" />
              {row.value > 0 && (
                <span className="relative block h-2.5" style={{ width: `calc((100% - 2.75rem) * ${row.value / max})`, minWidth: 3 }}>
                  <Grow
                    delay={index * 0.03}
                    className={cn(
                      "h-full rounded-r-[3px]",
                      bright ? "bg-ink shadow-[0_0_12px_rgb(111_155_255/0.7)]" : "bg-ink-subtle/75",
                    )}
                  />
                </span>
              )}
              <span className="relative text-[14px] font-semibold tabular-nums text-ink">{row.value}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
