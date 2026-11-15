import { cn } from "@/lib/utils";

import { Brackets, Ruler } from "./hud";

/**
 * One block of the dashboard. It asks one plain question, answers it in a
 * sentence with the number in it, and then shows the chart. The sentence has
 * to make sense with the chart covered up. The brackets, the label strip and
 * the ruler are framing: they carry no data.
 */
export function Panel({
  id,
  label,
  question,
  answer,
  note,
  className,
  children,
}: {
  /** Anchor for the links in the overview. */
  id?: string;
  /** Short name for the label strip, such as "01 · Evidence". */
  label?: string;
  question: string;
  answer: string;
  note?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative flex scroll-mt-6 flex-col gap-7 border border-flame/20 bg-surface-1/80 p-6 backdrop-blur-md sm:p-8",
        className,
      )}
    >
      <Brackets />
      {label && (
        <p className="-mb-2 flex items-center justify-between font-mono text-[11px] text-ink-subtle">
          <span>{label}</span>
          <Ruler />
        </p>
      )}
      <h2 className="flex flex-col gap-3">
        <span className="text-[17px] font-medium leading-snug text-ink-muted">{question}</span>
        <span className="max-w-[38rem] text-pretty text-[clamp(1.4rem,1.9vw,1.85rem)] font-semibold leading-[1.15] tracking-[-0.02em]">
          {answer}
        </span>
      </h2>
      {children}
      {note && (
        <p className="mt-auto border-t border-flame/15 pt-4 text-[13px] leading-relaxed text-ink-subtle">{note}</p>
      )}
    </section>
  );
}
