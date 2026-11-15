import { NumberTicker } from "@/components/ui/number-ticker";
import { investigations } from "@/lib/data";
import { dates, reach, standing, standingCount, totals } from "@/lib/stats";

import { ChamberCore } from "./chamber-core";
import { Brackets, GuideRings, Ruler, type Segment, SegmentRing } from "./hud";

const GLOW = { filter: "drop-shadow(0 0 7px rgb(111 155 255 / 0.5))" };

/** A small gauge beside a figure. It counts one thing; its total is the number of segments. */
function Gauge({ segments, label }: { segments: Segment[]; label: string }) {
  return (
    <svg viewBox="0 0 80 80" role="img" aria-label={label} className="size-[4.5rem] shrink-0" style={GLOW}>
      <SegmentRing
        cx={40}
        cy={40}
        r={30}
        width={7}
        segments={segments}
        gap={segments.length > 16 ? 3.5 : 6}
        litClassName="stroke-mark-found"
      />
    </svg>
  );
}

function Readout({
  href,
  figure,
  unit,
  line,
  gauge,
}: {
  href: string;
  figure: React.ReactNode;
  unit?: string;
  line: string;
  gauge?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-5 border-t border-flame/20 py-5 transition-colors duration-150 first:border-t-0 hover:bg-flame/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:px-3"
    >
      {gauge}
      <span className="flex min-w-0 flex-col gap-1">
        <span className="flex items-baseline gap-2">
          <span className="text-[2rem] font-bold leading-none tracking-[-0.03em] text-ink">{figure}</span>
          {unit && <span className="text-[15px] text-ink-muted">{unit}</span>}
        </span>
        <span className="text-[15px] leading-snug text-ink-muted">
          <span className="link-draw">{line}</span>
        </span>
      </span>
    </a>
  );
}

/**
 * The top of the dashboard: all 24 experiments as one ring, with the four
 * answers further down the page summed up around it. Every lit segment is a
 * count from src/lib/stats.ts.
 */
export function Overview() {
  // Flight experiments first, so the lit part of the ring is one unbroken run.
  const ordered = [...investigations].sort((a, b) => Number(b.kind === "flight") - Number(a.kind === "flight"));
  const experiments: Segment[] = ordered.map((item) => ({
    lit: item.kind === "flight",
    title: `${item.acronym ?? item.title}: ${
      item.kind === "flight" ? (item.platform === "Cygnus" ? "flew on a Cygnus cargo ship" : "flew on the space station") : "ground study"
    }`,
  }));

  const questions: Segment[] = reach.map((row) => ({
    lit: row.results > 0,
    title: `${row.question.question} ${row.results} of ${row.count} experiments with a result.`,
  }));
  const answered = questions.filter((segment) => segment.lit).length;

  const results: Segment[] = standing
    .map((entry) => ({ lit: entry.state === "result", title: entry.item.acronym ?? entry.item.title }))
    .sort((a, b) => Number(b.lit) - Number(a.lit));

  return (
    <section
      aria-label="Overview"
      className="relative grid grid-cols-1 items-center gap-x-10 gap-y-8 border border-flame/20 bg-surface-1/75 p-6 backdrop-blur-md sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
    >
      <Brackets />
      <p className="absolute top-4 right-5 left-5 flex items-center justify-between font-mono text-[11px] text-ink-subtle sm:right-10 sm:left-10">
        <span>NASA PSI open data · {totals.investigations} records</span>
        <Ruler />
      </p>

      <div className="order-2 flex flex-col pt-4 lg:order-1 lg:pt-6">
        <Readout
          href="#evidence"
          gauge={<Gauge segments={questions} label={`${answered} of ${questions.length} questions have a result`} />}
          figure={answered}
          unit={`of ${questions.length} questions`}
          line="have a result from at least one experiment"
        />
        <Readout
          href="#results"
          gauge={
            <Gauge
              segments={results}
              label={`${standingCount.result} of ${totals.investigations} experiments have a result quoted`}
            />
          }
          figure={standingCount.result}
          unit={`of ${totals.investigations} experiments`}
          line="have a result quoted on this site"
        />
      </div>

      <figure className="order-1 flex flex-col items-center gap-4 pt-8 lg:order-2 lg:pt-6">
        <div className="relative size-[min(78vw,23rem)]">
          <svg viewBox="0 0 400 400" className="size-full overflow-visible">
            <GuideRings cx={200} cy={200} r={168} />
            <circle aria-hidden cx={200} cy={200} r={118} fill="none" strokeWidth={1} className="stroke-flame" opacity={0.18} />
            <g
              role="img"
              aria-label={`${totals.flight} of the ${totals.investigations} experiments flew in space`}
              style={GLOW}
            >
              <SegmentRing cx={200} cy={200} r={146} width={20} segments={experiments} />
            </g>
          </svg>
          {/* The live chamber floats in the middle of the ring. */}
          <ChamberCore className="pointer-events-none absolute inset-[14%]" />
        </div>
        <p className="flex items-baseline gap-3">
          {/* The real figure is in the label for anyone not watching it count up. */}
          <span role="img" aria-label={String(totals.investigations)}>
            <NumberTicker
              value={totals.investigations}
              className="text-[clamp(3.25rem,5vw,4.5rem)] font-bold leading-none tracking-[-0.05em] text-ink proportional-nums dark:text-ink"
            />
          </span>
          <span className="text-xl font-semibold leading-tight tracking-[-0.015em]">NASA fire experiments</span>
        </p>
        <figcaption className="max-w-[26rem] text-center text-[14px] leading-relaxed text-ink-muted">
          Each segment of the ring is one experiment. NASA calls each one an investigation. The{" "}
          <span className="font-semibold text-ink">{totals.flight} lit ones flew in space</span>: {totals.station} on
          the space station and {totals.cygnus} on Cygnus cargo ships. The other {totals.ground} are ground studies.
          <span className="mt-2 block font-mono text-[11px] text-ink-subtle">
            Centre: a simulation of a droplet flame in a combustion chamber
          </span>
        </figcaption>
      </figure>

      <div className="order-3 flex flex-col lg:pt-6">
        <Readout
          href="#years"
          figure={
            <>
              {dates.firstYear}
              <span className="mx-1.5 text-ink-subtle">to</span>
              {dates.lastYear}
            </>
          }
          line="the years the experiments ran"
        />
        <Readout
          href="#papers"
          figure={totals.papers}
          unit="published papers"
          line={`listed across the ${totals.investigations} records`}
        />
      </div>
    </section>
  );
}
