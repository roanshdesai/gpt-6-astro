import Link from "next/link";
import type { ReactNode } from "react";
import type { QuoteKind } from "../../../data/questions.types";
import { cn } from "@/lib/utils";
import { isNotStated } from "@/lib/investigations";

/*
 * Plain building blocks for the investigation and compare pages. Roansh's
 * motion pass can swap any of these; the data rules they carry are:
 *  - a QUOTE field is shown in quotation marks, exactly as stored;
 *  - "not stated" is shown as such, never hidden or filled in.
 */

export function NotStated() {
  return <span className="text-ink-subtle italic">Not stated in the NASA record</span>;
}

/** A value from the data. `quoted` = word for word from the PSI record. */
export function Value({ value, quoted = false }: { value: string; quoted?: boolean }) {
  if (isNotStated(value)) return <NotStated />;
  if (!quoted) return <span>{value}</span>;
  return <q className="text-ink">{value}</q>;
}

const KIND_STYLE: Record<QuoteKind, string> = {
  tested: "text-tag-tested border-tag-tested/50",
  expected: "text-tag-expected border-tag-expected/50",
  found: "text-tag-found border-tag-found/50",
};

export function KindTag({ kind }: { kind: QuoteKind }) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 rounded border px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wide",
        KIND_STYLE[kind],
      )}
    >
      {kind}
    </span>
  );
}

export function Field({ label, children, note }: { label: string; children: ReactNode; note?: string }) {
  return (
    <div className="grid gap-1 border-t border-hairline py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
      <dt className="font-mono text-[13px] text-ink-muted">
        {label}
        {note && <span className="block text-[11px] text-ink-subtle">{note}</span>}
      </dt>
      <dd className="text-lg leading-snug">{children}</dd>
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-2 text-2xl tracking-[-0.02em]">{children}</h2>;
}

export function TopNav({ children }: { children?: ReactNode }) {
  return (
    <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[13px] text-ink-muted">
      <Link href="/" className="link-draw hover:text-ink">
        Home
      </Link>
      <Link href="/investigations" className="link-draw hover:text-ink">
        All 24 investigations
      </Link>
      <Link href="/compare" className="link-draw hover:text-ink">
        Compare
      </Link>
      {children}
    </nav>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <main className="mx-auto flex w-full min-w-0 max-w-5xl flex-col [&>*]:min-w-0 gap-12 px-4 py-10 sm:px-8 sm:py-14">{children}</main>;
}

export function pillarLabel(p: string): string {
  return p.charAt(0).toUpperCase() + p.slice(1);
}
