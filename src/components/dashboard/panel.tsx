import { cn } from "@/lib/utils";

/**
 * One block of the dashboard. It asks one plain question, answers it in a
 * sentence with the number in it, and then shows the chart. The sentence has
 * to make sense with the chart covered up.
 */
export function Panel({
  question,
  answer,
  note,
  className,
  children,
}: {
  question: string;
  answer: string;
  note?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("flex flex-col gap-7 border border-hairline bg-surface-1 p-6 sm:p-8", className)}>
      <h2 className="flex flex-col gap-3">
        <span className="text-[17px] font-medium leading-snug text-ink-muted">{question}</span>
        <span className="max-w-[38rem] text-pretty text-[clamp(1.4rem,1.9vw,1.85rem)] font-semibold leading-[1.15] tracking-[-0.02em]">
          {answer}
        </span>
      </h2>
      {children}
      {note && (
        <p className="mt-auto border-t border-hairline pt-4 text-[13px] leading-relaxed text-ink-subtle">{note}</p>
      )}
    </section>
  );
}
