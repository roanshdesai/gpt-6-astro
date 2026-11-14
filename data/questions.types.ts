// Shape of data/questions.json (an array of 11 Question).
// Built by data/build/build_questions.py from data/build/questions_src.py.
// Every quote is checked word for word against its source; the build fails otherwise.
//
// Import with a cast, because JSON literal types widen:
//   import raw from "@/../data/questions.json";
//   const questions = raw as Question[];

export type QPillar = "prevent" | "detect" | "suppress" | "across";
export type Habitat = "spacecraft" | "station" | "moon-base" | "mars-base" | "rover";
export type QuoteKind = "tested" | "expected" | "found";

export interface Quote {
  kind: QuoteKind;
  /** Word for word from the source. */
  text: string;
  /** A PSI field name ("Objectives", "Approach", "Hypothesis",
   *  "Research Impacts/Earth Benefits") of the row's investigation,
   *  or the URL of a NASA resource. */
  source: string;
  /** Printed page in the Researcher's Guide, when source is the Guide. */
  page?: string;
}

export interface AnswerSentence {
  text: string;
  /** PSI ids this sentence rests on; shown as citation chips. Each one has an evidence row. */
  cites: string[];
  /** Optional. NASA statements this sentence rests on that are not about one
   *  of the 24 (general findings in the Researcher's Guide). Not ranked evidence. */
  basis?: Quote[];
  /** Optional. true = the sentence says what the data does NOT cover
   *  (e.g. "no Moon-gravity tests"). It has no cites and no basis. */
  scope?: true;
}

export interface EvidenceRow {
  /** One of the 24 PSI ids in investigations.json. */
  investigation: string;
  /** 1 = strongest. Rows with a "found" quote rank first. */
  rank: number;
  /** One line on why this investigation matters to the question. Written, not a quote. */
  why: string;
  quotes: Quote[];
}

export interface Question {
  id: string;
  pillar: QPillar;
  question: string;
  answer: AnswerSentence[];
  evidence: EvidenceRow[];
  /** count = evidence rows; withFindings = rows with a "found" quote; of = 24. */
  strength: { count: number; withFindings: number; of: number };
  /** Written lines on what the NASA text does not answer. */
  unknown: string[];
  habitats: Habitat[];
  /** null for now: the Earth line comes from the spinoff pages (backend part 6). */
  earth: { text: string; quote: string; source: string } | null;
}
