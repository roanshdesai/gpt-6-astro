import "server-only";

import { investigations, questions, shortName } from "./data";
import type { EvidenceKind, Investigation, Question } from "./types";

// Every number on the dashboard is counted here, from the two data files.
// Nothing is typed in by hand.

const count = <T,>(items: T[], test: (item: T) => boolean) => items.filter(test).length;
const hasResult = (row: Question["evidence"][number]) => row.quotes.some((quote) => quote.kind === "found");

const paperTitles = new Set(
  investigations.flatMap((item) => item.publications.map((title) => title.toLowerCase())),
);

export const totals = {
  investigations: investigations.length,
  flight: count(investigations, (item) => item.kind === "flight"),
  ground: count(investigations, (item) => item.kind === "ground"),
  station: count(investigations, (item) => item.platform === "ISS"),
  cygnus: count(investigations, (item) => item.platform === "Cygnus"),
  /** Distinct titles: some papers are listed on more than one record. */
  papers: paperTitles.size,
  questions: questions.length,
};

// How much evidence stands behind each question.

export type Reach = {
  question: Question;
  /** One entry per investigation listed as evidence, those with a stated result first. */
  rows: { id: string; name: string; result: boolean }[];
  count: number;
  results: number;
};

export const reach: Reach[] = questions
  .map((item) => {
    const rows = item.evidence
      .map((row) => ({ id: row.investigation, name: shortName(row.investigation), result: hasResult(row) }))
      .sort((a, b) => Number(b.result) - Number(a.result));
    return { question: item, rows, count: rows.length, results: count(rows, (row) => row.result) };
  })
  .sort((a, b) => b.results - a.results || b.count - a.count);

// How far the 24 investigations get used, and how many have a stated result.

const cited = new Set(questions.flatMap((item) => item.evidence.map((row) => row.investigation)));
const withResult = new Set(
  questions.flatMap((item) => item.evidence.filter(hasResult).map((row) => row.investigation)),
);

export type Standing = "result" | "cited" | "unused";

const STANDING_ORDER: Record<Standing, number> = { result: 0, cited: 1, unused: 2 };

export const standing: { item: Investigation; state: Standing }[] = investigations
  .map((item) => ({
    item,
    state: (withResult.has(item.id) ? "result" : cited.has(item.id) ? "cited" : "unused") as Standing,
  }))
  .sort((a, b) => STANDING_ORDER[a.state] - STANDING_ORDER[b.state]);

export const standingCount = {
  result: withResult.size,
  cited: cited.size - withResult.size,
  unused: investigations.length - cited.size,
};

// The quotes shown on the Questions tab, by kind, and where the results come from.

const quotes = questions.flatMap((item) => item.evidence.flatMap((row) => row.quotes));

export const quoteKinds: Record<EvidenceKind, number> = {
  tested: count(quotes, (quote) => quote.kind === "tested"),
  expected: count(quotes, (quote) => quote.kind === "expected"),
  found: count(quotes, (quote) => quote.kind === "found"),
};

const results = quotes.filter((quote) => quote.kind === "found");
export const resultSources = {
  record: count(results, (quote) => !quote.source.startsWith("http")),
  guide: count(results, (quote) => quote.source.startsWith("http")),
};

// When the investigations ran, by the years on each record.

function span(years: string) {
  const found = years.match(/\d{4}/g);
  if (!found) return null;
  const start = Number(found[0]);
  // "2017-" has a start and no end: it counts in its start year only.
  return { start, end: found.length > 1 ? Number(found[1]) : start, open: /-\s*$/.test(years) };
}

const spans = investigations.flatMap((item) => span(item.years) ?? []);
const firstYear = Math.min(...spans.map((item) => item.start));
const lastYear = Math.max(...spans.map((item) => item.end));

export const activity = Array.from({ length: lastYear - firstYear + 1 }, (_, index) => {
  const year = firstYear + index;
  return { year, count: count(spans, (item) => item.start <= year && year <= item.end) };
});

export const dates = {
  firstYear,
  lastYear,
  undated: investigations.length - spans.length,
  open: count(spans, (item) => item.open),
};

// Published papers listed on each record.

export const papers = investigations
  .map((item) => ({ id: item.id, name: shortName(item.id), title: item.title, value: item.publications.length }))
  .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));

// The full table: every question against every investigation.

const STRENGTH: Record<EvidenceKind, number> = { found: 3, tested: 2, expected: 1 };

export const coverage = questions.map((item) => {
  const cells = new Map<string, EvidenceKind>();
  for (const row of item.evidence) {
    const kinds = row.quotes.map((quote) => quote.kind);
    if (kinds.length === 0) continue;
    cells.set(
      row.investigation,
      kinds.reduce((best, kind) => (STRENGTH[kind] > STRENGTH[best] ? kind : best)),
    );
  }
  return { question: item, cells };
});

/** Investigations ordered by how many questions they are evidence for, most first. */
export const coverageColumns = investigations
  .map((item) => ({
    id: item.id,
    name: shortName(item.id),
    title: item.title,
    questions: count(coverage, (row) => row.cells.has(item.id)),
  }))
  .sort((a, b) => b.questions - a.questions || a.name.localeCompare(b.name));
