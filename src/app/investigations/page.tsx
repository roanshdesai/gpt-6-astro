import type { Metadata } from "next";
import Link from "next/link";
import { Page, TopNav, pillarLabel } from "@/components/investigation/parts";
import { displayName, hardwareGroups, investigationHref, questionsUsing } from "@/lib/investigations";

export const metadata: Metadata = {
  title: "All 24 investigations · Question Board",
  description: "NASA's 24 combustion investigations in the PSI repository, grouped by the hardware they ran on.",
};

export default function InvestigationsIndex() {
  const groups = hardwareGroups();
  return (
    <Page>
      <TopNav />
      <header className="flex flex-col gap-4">
        <p className="font-mono text-[13px] text-ink-muted">NASA Physical Sciences Informatics · Combustion science</p>
        <h1 className="text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] tracking-[-0.04em]">All 24 investigations</h1>
        <p className="max-w-2xl text-lg leading-snug text-ink-muted">
          Grouped by the hardware they ran on. Each one opens to what it burned, under what conditions, and
          which questions on the board it helps answer.
        </p>
      </header>

      {groups.map((group) => (
        <section key={group.key} className="flex flex-col gap-3" aria-labelledby={`group-${group.key}`}>
          <div>
            <h2 id={`group-${group.key}`} className="text-2xl tracking-[-0.02em]">
              {group.label} <span className="font-mono text-base text-ink-subtle">({group.members.length})</span>
            </h2>
            <p className="text-ink-muted">{group.note}</p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2">
            {group.members.map((inv) => {
              const uses = questionsUsing(inv.id).length;
              return (
                <li key={inv.id} className="bg-canvas">
                  <Link
                    href={investigationHref(inv.id)}
                    className="group flex h-full flex-col gap-2 p-5 transition-colors hover:bg-surface-1"
                  >
                    <span className="flex items-baseline justify-between gap-3 font-mono text-[12px] text-ink-subtle">
                      <span>{inv.id}</span>
                      <span>{inv.years === "not stated" ? "Years not stated" : inv.years}</span>
                    </span>
                    <span className="link-draw self-start text-xl font-semibold tracking-[-0.02em]">
                      {displayName(inv)}
                    </span>
                    {inv.acronym && <span className="text-ink-muted">{inv.title}</span>}
                    <span className="mt-auto pt-2 font-mono text-[12px] text-ink-subtle">
                      {inv.pillars.length > 0 ? inv.pillars.map(pillarLabel).join(" · ") : "No pillar"}
                      {" · "}
                      {uses === 0 ? "not on the board" : `on ${uses} question${uses === 1 ? "" : "s"}`}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </Page>
  );
}
