import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Field,
  KindTag,
  NotStated,
  Page,
  SectionTitle,
  TopNav,
  Value,
  pillarLabel,
} from "@/components/investigation/parts";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  allInvestigations,
  compareHref,
  displayName,
  getInvestigation,
  hardwareGroupOf,
  investigationHref,
  isNotStated,
  questionsUsing,
  quoteSourceLabel,
} from "@/lib/investigations";

export function generateStaticParams() {
  return allInvestigations().map((inv) => ({ id: inv.id }));
}

export async function generateMetadata({ params }: PageProps<"/investigations/[id]">): Promise<Metadata> {
  const { id } = await params;
  const inv = getInvestigation(id);
  if (!inv) return {};
  return {
    title: `${displayName(inv)} · Question Board`,
    description: inv.summary,
  };
}

export default async function InvestigationPage({ params }: PageProps<"/investigations/[id]">) {
  const { id } = await params;
  const inv = getInvestigation(id);
  if (!inv) notFound();

  const uses = questionsUsing(inv.id);
  const group = hardwareGroupOf(inv);
  const related = inv.related.map(getInvestigation).filter((r) => r !== undefined);

  return (
    <Page>
      <TopNav />

      <header className="flex flex-col gap-4">
        <p className="font-mono text-[13px] text-ink-muted">
          {inv.id} · {inv.kind === "flight" ? "Flight investigation" : "Ground study"} ·{" "}
          {isNotStated(inv.years) ? "Years not stated" : inv.years}
        </p>
        <h1 className="text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] tracking-[-0.04em]">{displayName(inv)}</h1>
        {inv.acronym && <p className="text-xl text-ink-muted">{inv.title}</p>}
        <p className="max-w-2xl text-lg leading-snug">{inv.summary}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a href={inv.psiUrl} className={cn(buttonVariants({ size: "lg" }), "border-hairline-strong bg-transparent text-ink hover:bg-surface-2")} rel="noreferrer" target="_blank">
            Open the NASA PSI record
          </a>
          <Link href={compareHref(inv.id)} className={cn(buttonVariants({ size: "lg" }), "bg-transparent text-ink-muted hover:bg-surface-2 hover:text-ink")}>
            Compare with another
          </Link>
        </div>
      </header>

      <section>
        <SectionTitle>The experiment</SectionTitle>
        <p className="mb-4 text-ink-muted">
          Text in quotation marks is word for word from the NASA PSI record. The rest is written from it.
        </p>
        <dl>
          <Field label="Objective">
            <Value value={inv.objective} quoted />
          </Field>
          <Field label="Fuel">
            <span className="mr-2 font-mono text-[13px] uppercase text-ink-muted">
              {isNotStated(inv.fuel.state) ? "state not stated" : inv.fuel.state}
            </span>
            <Value value={inv.fuel.detail} quoted />
          </Field>
          <Field label="Sample size">
            <Value value={inv.fuel.size} quoted />
          </Field>
          <Field label="Oxygen">
            <Value value={inv.conditions.oxygen} quoted />
          </Field>
          <Field label="Airflow">
            <Value value={inv.conditions.airflow} quoted />
          </Field>
          <Field label="Pressure">
            <Value value={inv.conditions.pressure} quoted />
          </Field>
          <Field label="Varied between tests">
            <Value value={inv.varied} />
          </Field>
          <Field label="Measured">
            {inv.measurements.length === 0 ? (
              <NotStated />
            ) : (
              <ul className="flex flex-wrap gap-2">
                {inv.measurements.map((m) => (
                  <li key={m} className="rounded border border-hairline px-2 py-0.5 text-base">
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </Field>
          <Field label="Apparatus">
            <Value value={inv.hardware.apparatus} quoted />
          </Field>
          <Field label="Facility">
            {isNotStated(inv.hardware.facility) ? <NotStated /> : inv.hardware.facility}{" "}
            <Link href={`/investigations#group-${group.key}`} className="link-draw text-ink-muted hover:text-ink">
              ({group.label})
            </Link>
          </Field>
          <Field label="Platform">
            <Value value={inv.platform} />
          </Field>
          <Field label="Pillars">
            {inv.pillars.length > 0 ? (
              inv.pillars.map(pillarLabel).join(" · ")
            ) : (
              <span className="text-ink-subtle italic">The record states no space fire-safety application</span>
            )}
          </Field>
        </dl>
      </section>

      <section>
        <SectionTitle>On the question board</SectionTitle>
        {uses.length === 0 ? (
          <p className="text-ink-muted">No question on the board ranks this investigation.</p>
        ) : (
          <ol className="flex flex-col">
            {uses.map((use) => (
              <li key={use.questionId} className="flex flex-col gap-3 border-t border-hairline py-5">
                <p className="font-mono text-[12px] text-ink-subtle">
                  {pillarLabel(use.pillar)} · ranked {use.rank} of {use.of}
                </p>
                <h3 className="text-xl tracking-[-0.02em]">{use.question}</h3>
                <p className="text-ink-muted">{use.why}</p>
                <ul className="flex flex-col gap-3">
                  {use.quotes.map((quote) => (
                    <li key={quote.text} className="flex flex-col gap-1.5 sm:flex-row sm:gap-3">
                      <KindTag kind={quote.kind} />
                      <span className="leading-snug">
                        <q>{quote.text}</q>{" "}
                        {quote.source.startsWith("http") ? (
                          <a href={quote.source} className="link-draw font-mono text-[12px] text-ink-subtle" rel="noreferrer" target="_blank">
                            {quoteSourceLabel(quote)}
                          </a>
                        ) : (
                          <span className="font-mono text-[12px] text-ink-subtle">{quoteSourceLabel(quote)}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </section>

      {related.length > 0 && (
        <section>
          <SectionTitle>Related investigations</SectionTitle>
          <p className="mb-3 text-ink-muted">As listed in this PSI record.</p>
          <ul className="flex flex-col">
            {related.map((r) => (
              <li key={r.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-hairline py-3">
                <Link href={investigationHref(r.id)} className="link-draw text-lg font-semibold">
                  {displayName(r)}
                </Link>
                <Link href={compareHref(inv.id, r.id)} className="link-draw font-mono text-[13px] text-ink-muted hover:text-ink">
                  Compare with {displayName(inv)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <SectionTitle>Publications</SectionTitle>
        {inv.publications.length === 0 ? (
          <p className="text-ink-muted">The PSI record lists none.</p>
        ) : (
          <>
            <p className="mb-3 text-ink-muted">
              {inv.publications.length} title{inv.publications.length === 1 ? "" : "s"}, as the PSI record lists them.
            </p>
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-ink-muted marker:text-ink-subtle">
              {inv.publications.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </>
        )}
      </section>
    </Page>
  );
}
