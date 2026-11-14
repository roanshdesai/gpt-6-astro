import { Grow } from "./grow";

type Row = { id: string; name: string; title?: string; value: number };

/** Ranked horizontal bars on one baseline: a name, a bar, and its figure at the tip. */
export function RankedBars({ rows, max, label }: { rows: Row[]; max: number; label: string }) {
  return (
    <ol className="flex flex-col" aria-label={label}>
      {rows.map((row, index) => (
        <li
          key={row.id}
          className="grid grid-cols-1 items-center gap-x-5 gap-y-1.5 border-t border-hairline py-2.5 sm:grid-cols-[minmax(0,17rem)_1fr]"
        >
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[15px] font-semibold leading-snug">{row.name}</span>
            {row.title && row.title !== row.name && (
              <span className="truncate text-[13px] text-ink-subtle" title={row.title}>
                {row.title}
              </span>
            )}
          </span>
          <span className="flex min-w-0 items-center gap-3">
            {row.value > 0 && (
              <span className="block h-2.5" style={{ width: `calc((100% - 2.75rem) * ${row.value / max})`, minWidth: 3 }}>
                <Grow delay={index * 0.03} className="h-full rounded-r-[4px] bg-ink" />
              </span>
            )}
            <span className="text-[14px] font-semibold tabular-nums text-ink">{row.value}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
