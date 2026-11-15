import "server-only";

import investigationsRaw from "../../data/investigations.json";
import questionsRaw from "../../data/questions.json";

import type { Investigation, Pillar, Question } from "./types";

// The curated files from the data track. Every quote in them is checked word
// for word against its NASA source before the site builds.
export const investigations = investigationsRaw as Investigation[];
export const questions = questionsRaw as Question[];

const byId = new Map(investigations.map((item) => [item.id, item]));

export function investigation(id: string) {
  return byId.get(id);
}

export function question(id: string) {
  return questions.find((item) => item.id === id);
}

/** A name short enough for a chip or a chart row. The five ground studies have no acronym. */
export function shortName(id: string) {
  return byId.get(id)?.acronym ?? id;
}

export const PILLARS: { id: Pillar; name: string; line: string }[] = [
  { id: "prevent", name: "Prevent", line: "Stop it starting" },
  { id: "detect", name: "Detect", line: "Notice it early" },
  { id: "suppress", name: "Suppress", line: "Put it out" },
];

export function pillarName(id: Pillar) {
  return PILLARS.find((pillar) => pillar.id === id)?.name ?? "Across all three";
}
