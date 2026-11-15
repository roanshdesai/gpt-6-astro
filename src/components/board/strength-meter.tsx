import { cn } from "@/lib/utils";

/**
 * One tick per investigation NASA has published. Filled ticks speak to this
 * question; green ones carry a stated result.
 */
export function StrengthMeter({
  count,
  withFindings,
  of,
  className,
}: {
  count: number;
  withFindings: number;
  of: number;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${count} of ${of} investigations speak to this, ${withFindings} with a stated result`}
      className={cn("flex gap-[3px]", className)}
    >
      {Array.from({ length: of }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-3.5 w-[5px] rounded-[1px]",
            index < withFindings ? "bg-tag-found" : index < count ? "bg-ink" : "bg-hairline-strong/50",
          )}
        />
      ))}
    </div>
  );
}
