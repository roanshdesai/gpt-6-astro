// Read-only helpers over the two data files, for the investigation and
// compare pages (backend part 5). Server-side only: the JSON is read at build
// time and never shipped whole to the browser.
//
// Nothing here writes or rewrites data text. Fields typed QUOTE in
// data/investigations.types.ts are shown exactly as stored.

import investigationsRaw from "../../data/investigations.json";
import questionsRaw from "../../data/questions.json";
import type { Investigation, Pillar } from "../../data/investigations.types";
import type { Question, Quote } from "../../data/questions.types";

export type { Investigation, Pillar };

export const NOT_STATED = "not stated";

const investigations = investigationsRaw as Investigation[];
const questions = questionsRaw as Question[];

const byId = new Map(investigations.map((inv) => [inv.id, inv]));

export function allInvestigations(): Investigation[] {
  return investigations;
}

export function getInvestigation(id: string): Investigation | undefined {
  return byId.get(id);
}

/** Short display name: acronym, or the title for the five ground studies. */
export function displayName(inv: Investigation): string {
  return inv.acronym ?? inv.title;
}

export function isNotStated(value: string): boolean {
  return value.trim().toLowerCase() === NOT_STATED;
}

export function investigationHref(id: string): string {
  return `/investigations/${id}`;
}

export function compareHref(a?: string, b?: string): string {
  const params = new URLSearchParams();
  if (a) params.set("a", a);
  if (b) params.set("b", b);
  const qs = params.toString();
  return qs ? `/compare?${qs}` : "/compare";
}

// ---------------------------------------------------------------------------
// Hardware grouping. The brief calls out shared hardware, so the index page
// groups by it. Membership is decided only from the stored `facility` and
// `acronym` / `apparatus` fields; when the record names no facility, the
// investigation goes in "Facility not stated" rather than a guessed group.

export interface HardwareGroup {
  key: string;
  label: string;
  note: string;
  members: Investigation[];
}

const GROUPS: { key: string; label: string; note: string; match: (inv: Investigation) => boolean }[] = [
  {
    key: "acme",
    label: "ACME in the Combustion Integrated Rack",
    note: "Gaseous flames on the ACME burners, inside the CIR.",
    match: (inv) => inv.hardware.facility === "CIR" && (inv.acronym ?? "").startsWith("ACME"),
  },
  {
    key: "droplet",
    label: "Droplet apparatus in the Combustion Integrated Rack",
    note: "Free-floating fuel droplets in the Multi-user Droplet Combustion Apparatus (MDCA).",
    match: (inv) => inv.hardware.facility === "CIR" && /\bMDCA\b/.test(inv.hardware.apparatus),
  },
  {
    key: "msg",
    label: "Microgravity Science Glovebox",
    note: "Flow ducts and wind tunnels in the glovebox.",
    match: (inv) => inv.hardware.facility === "MSG",
  },
  {
    key: "cygnus",
    label: "Saffire, inside a Cygnus cargo ship",
    note: "Large-scale burns in an empty cargo vehicle after it left the station.",
    match: (inv) => inv.hardware.facility === "Cygnus",
  },
  {
    key: "ground",
    label: "Ground studies",
    note: "Earth-based studies that re-used flight data.",
    match: (inv) => inv.kind === "ground",
  },
  {
    key: "unstated",
    label: "Facility not stated in the record",
    note: "The PSI record names the apparatus but not the facility it ran in.",
    match: () => true,
  },
];

export function hardwareGroups(): HardwareGroup[] {
  const groups: HardwareGroup[] = GROUPS.map(({ key, label, note }) => ({ key, label, note, members: [] }));
  for (const inv of investigations) {
    const index = GROUPS.findIndex((g) => g.match(inv));
    groups[index].members.push(inv);
  }
  return groups.filter((g) => g.members.length > 0);
}

export function hardwareGroupOf(inv: Investigation): HardwareGroup {
  return hardwareGroups().find((g) => g.members.includes(inv))!;
}

// ---------------------------------------------------------------------------
// Reverse index: which board questions rank this investigation, and with
// which quotes. Read straight from questions.json.

export interface QuestionUse {
  questionId: string;
  question: string;
  pillar: Question["pillar"];
  rank: number;
  of: number;
  why: string;
  quotes: Quote[];
}

export function questionsUsing(id: string): QuestionUse[] {
  const uses: QuestionUse[] = [];
  for (const q of questions) {
    const row = q.evidence.find((r) => r.investigation === id);
    if (!row) continue;
    uses.push({
      questionId: q.id,
      question: q.question,
      pillar: q.pillar,
      rank: row.rank,
      of: q.evidence.length,
      why: row.why,
      quotes: row.quotes,
    });
  }
  return uses;
}

/** A Quote's source is a PSI field name or a resource URL. */
export function quoteSourceLabel(quote: Quote): string {
  if (!quote.source.startsWith("http")) return `PSI record, ${quote.source}`;
  if (quote.source.includes("combustion_in_reduced_gravity")) {
    return quote.page ? `Researcher's Guide, p. ${quote.page}` : "Researcher's Guide";
  }
  if (quote.source.includes("combustion-science")) return "NASA Combustion Science page";
  return quote.source;
}

// ---------------------------------------------------------------------------
// Compare. Each row is one attribute from Goal 1 of the design doc. "same"
// means the stored text is identical after trimming and lower-casing; the
// page never claims two different wordings mean the same thing.

export type RowState = "same" | "differs" | "neither";

export interface CompareRow {
  label: string;
  /** true = both values are word for word from the PSI record. */
  quoted: boolean;
  a: string | string[];
  b: string | string[];
  state: RowState;
  /** For list rows: items both share. */
  shared?: string[];
}

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function textRow(label: string, quoted: boolean, a: string, b: string): CompareRow {
  let state: RowState;
  if (isNotStated(a) && isNotStated(b)) state = "neither";
  else state = norm(a) === norm(b) ? "same" : "differs";
  return { label, quoted, a, b, state };
}

function listRow(label: string, a: string[], b: string[]): CompareRow {
  const bSet = new Set(b.map(norm));
  const shared = a.filter((x) => bSet.has(norm(x)));
  let state: RowState;
  if (a.length === 0 && b.length === 0) state = "neither";
  else if (shared.length === a.length && shared.length === b.length) state = "same";
  else state = "differs";
  return { label, quoted: false, a, b, state, shared };
}

export function compareRows(a: Investigation, b: Investigation): CompareRow[] {
  return [
    textRow("Kind", false, a.kind === "flight" ? "Flight" : "Ground study", b.kind === "flight" ? "Flight" : "Ground study"),
    listRow("Pillars", a.pillars, b.pillars),
    textRow("Platform", false, a.platform, b.platform),
    textRow("Years", false, a.years, b.years),
    textRow("Facility", false, a.hardware.facility, b.hardware.facility),
    textRow("Apparatus", true, a.hardware.apparatus, b.hardware.apparatus),
    textRow("Fuel state", false, a.fuel.state, b.fuel.state),
    textRow("Fuel", true, a.fuel.detail, b.fuel.detail),
    textRow("Sample size", true, a.fuel.size, b.fuel.size),
    textRow("Oxygen", true, a.conditions.oxygen, b.conditions.oxygen),
    textRow("Airflow", true, a.conditions.airflow, b.conditions.airflow),
    textRow("Pressure", true, a.conditions.pressure, b.conditions.pressure),
    textRow("Varied between tests", false, a.varied, b.varied),
    listRow("Measured", a.measurements, b.measurements),
    textRow("Objective", true, a.objective, b.objective),
  ];
}
