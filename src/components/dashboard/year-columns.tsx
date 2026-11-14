import { activity } from "@/lib/stats";
import { cn } from "@/lib/utils";

import { Grow } from "./grow";

/** How many experiments were running in each year. The busiest years stand out; the rest sit back. */
export function YearColumns() {
  const peak = Math.max(...activity.map((entry) => entry.count));
  const step = peak <= 6 ? 2 : peak <= 12 ? 4 : 5;
  const top = Math.ceil(peak / step) * step;
  const ticks = Array.from({ length: top / step + 1 }, (_, index) => index * step);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] text-ink-subtle">Experiments running in each year</p>
      {/* Room above the top line for the figure on the tallest columns. */}
      <div className="relative ml-7 mt-6 h-56">
        {ticks.map((tick) => (
          <div
            key={tick}
            aria-hidden
            className="absolute inset-x-0 border-t border-hairline"
            style={{ bottom: `${(tick / top) * 100}%` }}
          >
            <span className="absolute -left-7 -top-2 w-5 text-right text-[12px] tabular-nums text-ink-subtle">
              {tick}
            </span>
          </div>
        ))}
        <ol className="absolute inset-0 flex items-end gap-0.5">
          {activity.map((entry, index) => {
            const busiest = entry.count === peak;
            return (
              <li
                key={entry.year}
                title={`${entry.year}: ${entry.count} running`}
                className="relative flex h-full min-w-0 flex-1 items-end justify-center"
              >
                <span className="sr-only">{`${entry.year}: ${entry.count} running`}</span>
                <span className="relative block w-full max-w-6" style={{ height: `${(entry.count / top) * 100}%` }}>
                  {busiest && (
                    <span aria-hidden className="absolute inset-x-0 -top-5 text-center text-[12px] font-semibold tabular-nums text-ink">
                      {entry.count}
                    </span>
                  )}
                  <Grow
                    up
                    delay={index * 0.012}
                    className={cn("h-full rounded-t-[4px]", busiest ? "bg-ink" : "bg-ink-subtle/70")}
                  />
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <ol aria-hidden className="ml-7 flex gap-0.5">
        {activity.map((entry) => (
          <li key={entry.year} className="relative h-5 min-w-0 flex-1">
            {entry.year % 5 === 0 && (
              <span className="absolute left-1/2 top-1 -translate-x-1/2 whitespace-nowrap text-[12px] tabular-nums text-ink-subtle">
                {entry.year}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
