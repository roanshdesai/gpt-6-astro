import Link from "next/link";

import { EvidenceTag } from "@/components/board/evidence-tag";
import { shortName } from "@/lib/data";
import { type Standing, standing, standingCount } from "@/lib/stats";
import { cn } from "@/lib/utils";

import { arcPath, type Segment, SegmentRing } from "./hud";

// One segment of the arc per experiment: green for a result, grey for quoted
// without one, faint for not used at all.
const STROKE: Record<Standing, string> = {
  result: "stroke-mark-found",
  cited: "stroke-ink/50",
  unused: "stroke-ink/[0.14]",
};
const SWATCH: Record<Standing, string> = {
  result: "bg-mark-found",
  cited: "bg-ink/50",
  unused: "bg-ink/[0.14]",
};
const ORDER: Record<Standing, number> = { result: 0, cited: 1, unused: 2 };
const MEANING: Record<Standing, string> = {
  result: "have a result quoted, in NASA's own words",
  cited: "are quoted only for what they tested or expected",
  unused: "are not used on any question",
};
const STATES: Standing[] = ["result", "cited", "unused"];

const TAGS = [
  { kind: "tested", text: "What the experiment did and how." },
  { kind: "expected", text: "What its team predicted would happen." },
  { kind: "found", text: "A result, in NASA's own words." },
] as const;

/** All 24 experiments on one arc, split by how far their evidence goes. */
export function ResultGrid() {
  const withResult = standing.filter((entry) => entry.state === "result");
  const segments: Segment[] = [...standing]
    .sort((x, y) => ORDER[x.state] - ORDER[y.state])
    .map((entry) => ({
      lit: true,
      className: STROKE[entry.state],
      title: `${shortName(entry.item.id)}: ${MEANING[entry.state].replace(/^(have|are) /, "")}`,
    }));

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
        <div className="relative w-[15rem] shrink-0">
          <svg
            viewBox="0 0 240 172"
            role="img"
            aria-label={STATES.map((state) => `${standingCount[state]} ${MEANING[state]}`).join(", ")}
            className="w-full overflow-visible"
            style={{ filter: "drop-shadow(0 0 6px rgb(111 155 255 / 0.4))" }}
          >
            <path aria-hidden d={arcPath(120, 116, 78, 150, 390)} fill="none" strokeWidth={1} className="stroke-flame" opacity={0.3} />
            <SegmentRing cx={120} cy={116} r={98} width={18} segments={segments} start={150} sweep={240} gap={2.4} />
          </svg>
          <p className="absolute inset-x-0 top-[44%] flex flex-col items-center leading-none">
            <span className="text-[2.75rem] font-bold tracking-[-0.04em] text-ink">{standingCount.result}</span>
            <span className="mt-1.5 text-[14px] text-ink-muted">of {standing.length} with a result</span>
          </p>
        </div>
        <ul className="flex min-w-[14rem] flex-1 flex-col gap-2.5">
          {STATES.map((state) => (
            <li key={state} className="flex items-center gap-3 text-[15px] leading-snug text-ink-muted">
              <span aria-hidden className={cn("block h-4 w-2.5 shrink-0 rounded-[2px]", SWATCH[state])} />
              <span>
                <span className="font-semibold tabular-nums text-ink">{standingCount[state]}</span> {MEANING[state]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {withResult.length > 0 && (
        <p className="text-[15px] leading-relaxed text-ink-muted">
          The ones with a result:{" "}
          {withResult.map((entry, index) => (
            <span key={entry.item.id}>
              {index > 0 && ", "}
              <Link href={`/investigations/${entry.item.id}`} className="link-draw text-ink">
                {shortName(entry.item.id)}
              </Link>
            </span>
          ))}
          .
        </p>
      )}

      <div className="flex flex-col gap-4 border-t border-flame/15 pt-6">
        <h3 className="text-[17px] leading-snug">Every quote on the Questions tab carries one of three tags</h3>
        <ul className="flex flex-col gap-3">
          {TAGS.map((tag) => (
            <li key={tag.kind} className="grid grid-cols-[5.75rem_1fr] items-center gap-x-4 text-[15px] leading-snug text-ink-muted">
              <EvidenceTag kind={tag.kind} className="w-fit" />
              {tag.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
