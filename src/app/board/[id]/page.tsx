import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { EvidenceTag } from "@/components/board/evidence-tag";
import { StrengthMeter } from "@/components/board/strength-meter";
import { SiteHeader } from "@/components/shell/site-header";
import { investigation, pillarName, question, questions, shortName } from "@/lib/data";
import { quoteSourceLabel } from "@/lib/investigations";
import type { Quote } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

/** Where a quote comes from: a field of the PSI record, or a NASA page to open. */
function QuoteSource({ quote }: { quote: Quote }) {
  const label = quoteSourceLabel(quote);
  return (
    <span className="mt-1 block font-mono text-[12px] text-ink-subtle">
      {quote.source.startsWith("http") ? (
        <a href={quote.source} target="_blank" rel="noreferrer" className="link-draw hover:text-ink">
          {label}
        </a>
      ) : (
        label
      )}
    </span>
  );
}

const HABITATS: Record<string, string> = {
  spacecraft: "Spacecraft",
  station: "Station",
  "moon-base": "Moon Base",
  "mars-base": "Mars base",
  rover: "Pressurized rover",
};

export function generateStaticParams() {
  return questions.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const item = question(id);
  return { title: item ? `${item.question} | Question Board` : "Question Board" };
}

// The page frame renders at once; the part that reads the question id from the
// URL sits behind Suspense, so moving between questions is never blocked on it.
export default function AnswerPage({ params }: Params) {
  return (
    <main className="relative z-20 min-h-svh pb-32">
      <SiteHeader current="questions" />
      <Suspense fallback={<div className="min-h-svh" />}>
        <Answer params={params} />
      </Suspense>
    </main>
  );
}

async function Answer({ params }: Params) {
  const { id } = await params;
  const item = question(id);
  if (!item) notFound();

  const pillar = pillarName(item.pillar);
  const siblings = questions.filter((other) => other.pillar === item.pillar && other.id !== item.id);

  return (
      <div className="mx-auto max-w-[96rem] px-[3vw] pt-8">
        <p className="font-mono text-[13px] text-ink-muted">
          <Link href="/board" className="link-draw py-3 text-ink">
            Questions
          </Link>
          {"  /  "}
          {pillar}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
          <div className="flex flex-col gap-10 lg:col-span-8">
            <h1 className="text-[clamp(2.25rem,4.6vw,4.5rem)] leading-[0.96] tracking-[-0.04em]">
              {item.question}
            </h1>

            {/* The answer */}
            <section className="flex flex-col gap-5 border border-hairline-strong bg-surface-1 p-7">
              <h2 className="font-mono text-[13px] text-ink-muted">Answer</h2>
              {item.answer.map((sentence) => (
                <div key={sentence.text} className="flex flex-col gap-3">
                  {/* A sentence marked scope says what the data does not cover. */}
                  <p className={sentence.scope ? "text-lg leading-snug text-ink-muted" : "text-[1.35rem] leading-snug"}>
                    {sentence.text}{" "}
                    {sentence.cites.map((cite) => (
                      <a
                        key={cite}
                        href={`#${cite}`}
                        className="mr-1.5 inline-flex h-6 items-center rounded-[2px] border border-hairline-strong px-2 align-middle font-mono text-[11px] text-ink transition-colors duration-150 hover:border-ink"
                      >
                        {shortName(cite)}
                      </a>
                    ))}
                  </p>
                  {sentence.basis?.map((quote) => (
                    <div key={quote.text} className="grid grid-cols-1 gap-x-4 gap-y-2 border-l border-hairline-strong pl-4 sm:grid-cols-[5.75rem_1fr]">
                      <EvidenceTag kind={quote.kind} className="mt-0.5 w-fit" />
                      <blockquote className="text-[15px] leading-relaxed text-ink-muted">
                        &ldquo;{quote.text}&rdquo;
                        <QuoteSource quote={quote} />
                      </blockquote>
                    </div>
                  ))}
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-hairline pt-5">
                <StrengthMeter {...item.strength} />
                <p className="font-mono text-[12px] text-ink-muted">
                  {item.strength.count} of {item.strength.of} investigations speak to this ·{" "}
                  {item.strength.withFindings} with a stated result
                </p>
              </div>
            </section>

            {/* Ranked evidence */}
            <section className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-3xl tracking-[-0.03em]">Ranked evidence</h2>
                <div className="flex gap-2">
                  <EvidenceTag kind="tested" />
                  <EvidenceTag kind="expected" />
                  <EvidenceTag kind="found" />
                </div>
              </div>

              {item.evidence.map((row) => {
                const source = investigation(row.investigation);
                return (
                  <article
                    key={row.investigation}
                    id={row.investigation}
                    className="grid scroll-mt-24 grid-cols-[3rem_1fr] gap-x-5 border border-hairline-strong bg-surface-1 p-7"
                  >
                    <span className="font-mono text-3xl tabular-nums text-ink-muted">{row.rank}</span>
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-2xl tracking-[-0.02em]">{source?.acronym ?? source?.title ?? row.investigation}</h3>
                        <p className="text-[15px] text-ink-muted">
                          {source?.acronym && `${source.title} · `}
                          <span className="font-mono text-[12px]">{row.investigation}</span>
                        </p>
                      </div>
                      <p className="text-lg leading-snug">{row.why}</p>
                      <ul className="flex flex-col gap-4">
                        {row.quotes.map((quote) => (
                          <li key={quote.text} className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-[5.75rem_1fr]">
                            <EvidenceTag kind={quote.kind} className="mt-0.5 w-fit" />
                            <blockquote className="text-[15px] leading-relaxed text-ink">
                              &ldquo;{quote.text}&rdquo;
                              <QuoteSource quote={quote} />
                            </blockquote>
                          </li>
                        ))}
                      </ul>
                      {source && (
                        <p className="flex flex-wrap gap-x-6 gap-y-1 text-[15px] font-medium">
                          <Link href={`/investigations/${row.investigation}`} className="link-draw w-fit py-2">
                            What this investigation burned
                          </Link>
                          <a href={source.psiUrl} target="_blank" rel="noreferrer" className="link-draw w-fit py-2 text-ink-muted hover:text-ink">
                            Open {row.investigation} at NASA
                          </a>
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>
          </div>

          <aside className="flex flex-col gap-6 lg:col-span-4 lg:pt-4">
            <section className="flex flex-col gap-4 border border-dashed border-hairline-strong bg-surface-1 p-6">
              <h2 className="font-mono text-[13px] text-ink-muted">Not yet known</h2>
              {item.unknown.map((line) => (
                <p key={line} className="text-lg leading-snug">
                  {line}
                </p>
              ))}
            </section>

            <section className="flex flex-col gap-4 border border-hairline-strong bg-surface-1 p-6">
              <h2 className="font-mono text-[13px] text-ink-muted">Applies to</h2>
              <ul className="flex flex-wrap gap-2">
                {item.habitats.map((habitat) => (
                  <li
                    key={habitat}
                    className="inline-flex h-8 items-center rounded-[2px] border border-hairline-strong px-3 text-[14px]"
                  >
                    {HABITATS[habitat] ?? habitat}
                  </li>
                ))}
              </ul>
            </section>

            {item.earth && (
              <section className="flex flex-col gap-3 border border-hairline-strong bg-surface-1 p-6">
                <h2 className="font-mono text-[13px] text-ink-muted">On Earth</h2>
                <p className="text-lg leading-snug">{item.earth.text}</p>
                <blockquote className="border-l border-hairline-strong pl-4 text-[15px] leading-relaxed text-ink-muted">
                  &ldquo;{item.earth.quote}&rdquo;
                  <a
                    href={item.earth.source}
                    target="_blank"
                    rel="noreferrer"
                    className="link-draw mt-1 block w-fit font-mono text-[12px] text-ink-subtle hover:text-ink"
                  >
                    {item.earth.sourceTitle}
                  </a>
                </blockquote>
              </section>
            )}

            {siblings.length > 0 && (
              <section className="flex flex-col border border-hairline-strong bg-surface-1 p-6">
                <h2 className="pb-3 font-mono text-[13px] text-ink-muted">
                  More under {pillar}
                </h2>
                {siblings.map((other) => (
                  <Link
                    key={other.id}
                    href={`/board/${other.id}`}
                    className="group border-t border-hairline py-4 text-lg font-semibold leading-tight tracking-[-0.02em]"
                  >
                    <span className="link-draw">{other.question}</span>
                  </Link>
                ))}
              </section>
            )}
          </aside>
        </div>
      </div>
  );
}
