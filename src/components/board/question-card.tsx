import Link from "next/link";

import { shortName } from "@/lib/data";
import type { Question } from "@/lib/types";

import { StrengthMeter } from "./strength-meter";

/** One question on the board: the question, how much evidence stands behind it, and who. */
export function QuestionCard({ question }: { question: Question }) {
  const leaders = question.evidence
    .slice(0, 3)
    .map((row) => shortName(row.investigation));

  return (
    <Link
      href={`/board/${question.id}`}
      className="group flex flex-col gap-5 border border-hairline-strong bg-surface-1 p-6 transition-[transform,border-color,background-color] duration-150 hover:-translate-y-0.5 hover:border-ink hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:translate-y-0"
    >
      <h4 className="text-[1.6rem] font-semibold leading-[1.1] tracking-[-0.025em]">
        {question.question}
      </h4>
      <div className="mt-auto flex flex-col gap-3">
        <StrengthMeter {...question.strength} />
        <p className="font-mono text-[12px] text-ink-muted">
          {question.strength.count} of {question.strength.of} investigations ·{" "}
          {question.strength.withFindings} with a stated result
        </p>
        <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[12px] text-ink">
          {leaders.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </p>
      </div>
      <span className="link-draw w-fit text-[15px] font-medium text-ink">Open the evidence</span>
    </Link>
  );
}
