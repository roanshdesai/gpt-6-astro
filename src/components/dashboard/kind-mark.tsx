import type { EvidenceKind } from "@/lib/types";
import { cn } from "@/lib/utils";

export const KIND_LABEL: Record<EvidenceKind, string> = {
  tested: "Tested",
  expected: "Expected",
  found: "Found",
};

// Shape as well as colour, the same way the tags do it: an outline for what
// was done, a dashed outline for what was predicted, a solid block for a result.
const MARK: Record<EvidenceKind, string> = {
  tested: "border-2 border-mark-tested",
  expected: "border-2 border-dashed border-mark-expected",
  found: "bg-mark-found",
};

export function KindMark({ kind, className }: { kind: EvidenceKind; className?: string }) {
  return <span aria-hidden className={cn("block size-3.5 rounded-[2px]", MARK[kind], className)} />;
}

export function KindLegend({ className, none }: { className?: string; none?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[12px] text-ink-muted", className)}>
      {(Object.keys(KIND_LABEL) as EvidenceKind[]).map((kind) => (
        <li key={kind} className="flex items-center gap-2">
          <KindMark kind={kind} />
          {KIND_LABEL[kind]}
        </li>
      ))}
      {none && (
        <li className="flex items-center gap-2">
          <span aria-hidden className="mx-[5px] block size-1 rounded-full bg-hairline-strong" />
          {none}
        </li>
      )}
    </ul>
  );
}
