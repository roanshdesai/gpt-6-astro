import Link from "next/link";

import { EvidenceTag } from "@/components/board/evidence-tag";
import { shortName } from "@/lib/data";
import { type Standing, standing, standingCount } from "@/lib/stats";
import { cn } from "@/lib/utils";

const SQUARE = "flex size-7 items-center justify-center rounded-[4px]";
const STYLE: Record<Standing, string> = {
  result: "bg-mark-found",
  cited: "border-[1.5px] border-ink-subtle",
  unused: "border border-dashed border-hairline-strong",
};
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

/** All 24 experiments as squares, split by how far their evidence goes. */
export function ResultGrid() {
  const withResult = standing.filter((entry) => entry.state === "result");

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap items-start gap-x-8 gap-y-5">
        <div
          role="img"
          aria-label={STATES.map((state) => `${standingCount[state]} ${MEANING[state]}`).join(", ")}
          className="grid w-fit shrink-0 grid-cols-8 gap-1.5"
        >
          {standing.map((entry) => (
            <span
              key={entry.item.id}
              title={`${shortName(entry.item.id)}: ${MEANING[entry.state].replace(/^(have|are) /, "")}`}
              className={cn(SQUARE, STYLE[entry.state])}
            />
          ))}
        </div>
        <ul className="flex min-w-[14rem] flex-1 flex-col gap-2.5">
          {STATES.map((state) => (
            <li key={state} className="flex items-center gap-3 text-[15px] leading-snug text-ink-muted">
              <span aria-hidden className={cn("block size-4 shrink-0 rounded-[3px]", STYLE[state])} />
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

      <div className="flex flex-col gap-4 border-t border-hairline pt-6">
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
