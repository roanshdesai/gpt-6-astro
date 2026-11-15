import Link from "next/link";

import { pillarName } from "@/lib/data";
import { reach } from "@/lib/stats";
import { cn } from "@/lib/utils";

const SQUARE = "block size-4 rounded-[3px]";
// A lit cell glows a little, like an indicator lamp.
const RESULT = "bg-mark-found shadow-[0_0_8px_rgb(64_173_96/0.55)]";
const NO_RESULT = "border-[1.5px] border-ink-subtle";

/**
 * One row per question, one square per experiment listed as evidence for it.
 * A filled square is an experiment with a result NASA has stated.
 */
export function QuestionReach() {
  const widest = Math.max(...reach.map((row) => row.count));

  return (
    <div className="flex flex-1 flex-col gap-4">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-ink-muted">
        <li className="flex items-center gap-2">
          <span aria-hidden className={cn(SQUARE, RESULT)} />
          An experiment with a result quoted
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className={cn(SQUARE, NO_RESULT)} />
          An experiment quoted only for what it tested or expected
        </li>
      </ul>

      {/* The rows share out whatever height the panel has, so the list always fills it. */}
      <ol className="flex flex-1 flex-col">
        {reach.map((row) => (
          <li key={row.question.id} className="flex flex-1 border-t border-flame/15">
            <Link
              href={`/board/${row.question.id}`}
              className="group -mx-3 grid flex-1 grid-cols-1 items-center gap-x-6 gap-y-3 px-3 py-3.5 transition-colors duration-150 hover:bg-flame/[0.07] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink sm:grid-cols-[minmax(0,1fr)_auto]"
            >
              <span className="flex flex-col gap-0.5">
                <span className="text-[13px] text-ink-subtle">{pillarName(row.question.pillar)}</span>
                <span className="text-lg font-semibold leading-snug tracking-[-0.01em]">
                  <span className="link-draw">{row.question.question}</span>
                </span>
              </span>
              <span className="flex items-center gap-4">
                <span
                  role="img"
                  aria-label={`${row.count} experiments, ${row.results} with a result quoted`}
                  className="flex shrink-0 gap-1"
                  style={{ width: `${widest * 1.25 - 0.25}rem` }}
                >
                  {row.rows.map((experiment) => (
                    <span
                      key={experiment.id}
                      title={`${experiment.name}: ${experiment.result ? "result quoted" : "tested or expected only"}`}
                      className={cn(SQUARE, experiment.result ? RESULT : NO_RESULT)}
                    />
                  ))}
                </span>
                <span className="w-[8.75rem] shrink-0 text-[14px] tabular-nums text-ink-muted">
                  <span className="text-ink">
                    {row.results} of {row.count}
                  </span>{" "}
                  with a result
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
