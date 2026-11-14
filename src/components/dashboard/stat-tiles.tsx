import { NumberTicker } from "@/components/ui/number-ticker";
import { totals } from "@/lib/stats";

/** The three numbers the page leads with. */
export function StatTiles() {
  const tiles = [
    {
      value: totals.investigations,
      label: "NASA fire experiments",
      note: "in NASA's open combustion data. NASA calls each one an investigation.",
    },
    {
      value: totals.flight,
      label: "flew in space",
      note: `${totals.station} on the space station and ${totals.cygnus} on Cygnus cargo ships. The other ${totals.ground} are ground studies.`,
    },
    {
      value: totals.papers,
      label: "published papers",
      note: `listed across the ${totals.investigations} records.`,
    },
  ];

  return (
    <dl className="grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-3">
      {tiles.map((tile, index) => (
        <div key={tile.label} className="flex flex-col gap-3 bg-surface-1 p-6 sm:p-8">
          {/* The real figure is in the label for anyone not watching it count up. */}
          <dd role="img" aria-label={String(tile.value)} className="flex items-baseline">
            <NumberTicker
              value={tile.value}
              delay={index * 0.08}
              className="text-[clamp(3rem,5vw,4.75rem)] font-bold leading-none tracking-[-0.045em] text-ink proportional-nums dark:text-ink"
            />
          </dd>
          <dt className="flex flex-col gap-1.5">
            <span className="text-xl font-semibold leading-tight tracking-[-0.015em]">{tile.label}</span>
            <span className="max-w-[24rem] text-[15px] leading-snug text-ink-muted">{tile.note}</span>
          </dt>
        </div>
      ))}
    </dl>
  );
}
