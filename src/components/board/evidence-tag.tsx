import type { EvidenceKind } from "@/lib/types";
import { cn } from "@/lib/utils";

const LABEL: Record<EvidenceKind, string> = {
  tested: "Tested",
  expected: "Expected",
  found: "Found",
};

// The three kinds differ by shape as well as colour: an outline for what was
// done, a dashed outline for what was predicted, a filled chip for a result.
const STYLE: Record<EvidenceKind, string> = {
  tested: "border border-tag-tested text-tag-tested",
  expected: "border border-dashed border-tag-expected text-tag-expected",
  found: "border border-tag-found bg-tag-found text-canvas",
};

export function EvidenceTag({ kind, className }: { kind: EvidenceKind; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-[2px] px-2 font-mono text-[11px] uppercase tracking-[0.06em]",
        STYLE[kind],
        className,
      )}
    >
      {LABEL[kind]}
    </span>
  );
}
