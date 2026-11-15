import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Page, TopNav, Value, pillarLabel } from "@/components/investigation/parts";
import { buttonVariants } from "@/components/ui/button";
import {
  allInvestigations,
  compareRows,
  displayName,
  getInvestigation,
  investigationHref,
  type CompareRow,
  type Investigation,
} from "@/lib/investigations";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Compare two investigations · Question Board",
  description: "Pick two of NASA's 24 combustion investigations and see what was the same and what differed.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default function ComparePage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Page current="investigations">
      <TopNav />
      <header className="flex flex-col gap-4">
        <h1 className="text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] tracking-[-0.04em]">Compare two investigations</h1>
        <p className="max-w-2xl text-lg leading-snug text-ink-muted">
          Pick two and see what was the same and what changed. &ldquo;Same&rdquo; means the NASA records use the same
          words; two different wordings are always shown as different.
        </p>
      </header>
      {/* searchParams is request-time data, so it renders inside Suspense (cacheComponents is on). */}
      <Suspense fallback={<Picker />}>
        <Comparison searchParams={searchParams} />
      </Suspense>
    </Page>
  );
}

async function Comparison({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const a = getInvestigation(first(sp.a) ?? "");
  const b = getInvestigation(first(sp.b) ?? "");
  return (
    <>
      <Picker a={a?.id} b={b?.id} />
      {a && b ? (
        a.id === b.id ? (
          <p className="text-ink-muted">Pick two different investigations.</p>
        ) : (
          <Table a={a} b={b} />
        )
      ) : (
        <p className="text-ink-muted">Pick two investigations above.</p>
      )}
    </>
  );
}

function Picker({ a, b }: { a?: string; b?: string }) {
  const options = allInvestigations();
  // A plain GET form: works with no JavaScript and gives a shareable URL.
  return (
    <form method="get" action="/compare" className="flex flex-col gap-3 sm:flex-row sm:items-end">
      {(["a", "b"] as const).map((name, i) => (
        <label key={name} className="flex min-w-0 flex-1 flex-col gap-1.5 font-mono text-[13px] text-ink-muted">
          {i === 0 ? "First" : "Second"}
          <select
            name={name}
            defaultValue={(name === "a" ? a : b) ?? ""}
            className="h-10 w-full min-w-0 rounded-lg border border-hairline-strong bg-surface-1 px-3 font-sans text-base text-ink"
          >
            <option value="" disabled>
              Choose an investigation
            </option>
            {options.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {displayName(inv)} ({inv.id})
              </option>
            ))}
          </select>
        </label>
      ))}
      <button type="submit" className={cn(buttonVariants({ size: "lg" }), "h-10 shrink-0 px-5")}>
        Compare
      </button>
    </form>
  );
}

const STATE_LABEL: Record<CompareRow["state"], string> = {
  same: "Same",
  differs: "Differs",
  neither: "Neither states",
};

function Cell({ value, quoted, shared }: { value: string | string[]; quoted: boolean; shared?: string[] }) {
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-ink-subtle italic">None listed</span>;
    const sharedSet = new Set((shared ?? []).map((s) => s.toLowerCase()));
    return (
      <ul className="flex flex-wrap gap-1.5">
        {value.map((v, i) => (
          <li
            key={`${v}-${i}`}
            className={cn(
              "rounded border px-1.5 py-0.5 text-sm",
              sharedSet.has(v.toLowerCase()) ? "border-ink-muted text-ink" : "border-hairline text-ink-muted",
            )}
          >
            {pillarLabel(v)}
          </li>
        ))}
      </ul>
    );
  }
  return <Value value={value} quoted={quoted} />;
}

function Table({ a, b }: { a: Investigation; b: Investigation }) {
  const rows = compareRows(a, b);
  const counts = { same: 0, differs: 0, neither: 0 };
  for (const r of rows) counts[r.state]++;
  return (
    <section className="flex min-w-0 flex-col gap-4">
      <p className="font-mono text-[13px] text-ink-muted">
        {counts.differs} differ · {counts.same} the same · {counts.neither} stated by neither record
      </p>
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-hairline-strong align-bottom">
              <th className="w-40 py-3 pr-4 font-mono text-[13px] font-normal text-ink-muted">Attribute</th>
              {[a, b].map((inv) => (
                <th key={inv.id} className="py-3 pr-4">
                  <Link href={investigationHref(inv.id)} className="link-draw text-xl tracking-[-0.02em]">
                    {displayName(inv)}
                  </Link>
                  <span className="block font-mono text-[12px] font-normal text-ink-subtle">{inv.id}</span>
                </th>
              ))}
              <th className="w-28 py-3 font-mono text-[13px] font-normal text-ink-muted">Result</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-hairline align-top">
                <th scope="row" className="py-3 pr-4 font-mono text-[13px] font-normal text-ink-muted">
                  {row.label}
                </th>
                <td className="py-3 pr-4 leading-snug">
                  <Cell value={row.a} quoted={row.quoted} shared={row.shared} />
                </td>
                <td className="py-3 pr-4 leading-snug">
                  <Cell value={row.b} quoted={row.quoted} shared={row.shared} />
                </td>
                <td
                  className={cn(
                    "py-3 font-mono text-[13px]",
                    row.state === "differs" ? "text-ink" : "text-ink-subtle",
                  )}
                >
                  {STATE_LABEL[row.state]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-ink-subtle">
        Text in quotation marks is word for word from each PSI record. Highlighted tags are shared by both.
      </p>
    </section>
  );
}
