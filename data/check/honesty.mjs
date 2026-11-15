#!/usr/bin/env node
// Honesty check for the committed data files (backend part 4).
//
//   node data/check/honesty.mjs          check, print the evidence-strength table
//   node data/check/honesty.mjs --quiet  check, print only problems
//
// Runs before `next build` (see package.json), so a bad quote fails the build
// and the deploy. It re-checks the JSON files themselves, not the Python
// sources they were built from, so a hand edit to a .json file is caught too.
//
// Fails (exit 1) if:
//   - any quote is not word for word in its source (PSI field of its
//     investigation, or the saved text copy of the resource URL);
//   - any cited, ranked or related id is not one of the 24 investigations;
//   - an answer sentence cites an id with no evidence row;
//   - an answer sentence says "found" without resting on a Found quote;
//   - ranks are not 1..n with stated-result (Found) rows first;
//   - a stored strength count differs from the count recomputed here.
// Warns (does not fail) when a Found quote from a NASA resource is word for
// word in the source but not listed in data/found-quotes.json.
//
// Comparison collapses whitespace runs and nothing else. For the Researcher's
// Guide (a pdftotext copy), lines that are only a printed page number are
// dropped first, so a sentence across a page break still matches. Same rules
// as data/build/*.py.
//
// It cannot tell whether a quote supports the sentence it sits under. The team
// reads every answer against its quotes before submitting.
//
// Node standard library only, so it runs on Vercel without Python.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export const FILES = {
  psi: "data/raw/psi-combustion-2026-11-14.json",
  investigations: "data/investigations.json",
  questions: "data/questions.json",
  foundQuotes: "data/found-quotes.json",
};

export const SOURCE_FILES = {
  "https://www.nasa.gov/sites/default/files/atoms/files/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf":
    "data/raw/sources/researchers-guide-combustion.txt",
  "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/":
    "data/raw/sources/nasa-combustion-science-page.txt",
};

const PSI_FIELDS = new Set([
  "Objectives",
  "Approach",
  "Hypothesis",
  "Research Impacts/Earth Benefits",
  "Experiment Hardware",
]);
const KINDS = new Set(["tested", "expected", "found"]);
const Q_PILLARS = new Set(["prevent", "detect", "suppress", "across"]);
const I_PILLARS = new Set(["prevent", "detect", "suppress"]);
const HABITATS = new Set(["spacecraft", "station", "moon-base", "mars-base", "rover"]);
const NS = "not stated";
const PSI_URL = (id) => `https://psi.nasa.gov/physci/repo/data/investigations/${id}`;

export const norm = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

function pageText(raw) {
  return norm(
    raw
      .split(/\r?\n/)
      .filter((l) => !/^\s*\d+\s*$/.test(l))
      .join("\n"),
  );
}

// Every string in a PSI record, one level deep (same as build_investigations.py).
function recordText(src) {
  const parts = [];
  for (const v of Object.values(src)) {
    if (typeof v === "string") parts.push(v);
    else if (v && typeof v === "object" && !Array.isArray(v))
      for (const x of Object.values(v)) if (typeof x === "string") parts.push(x);
  }
  return norm(parts.join("\n"));
}

/** Load every input from disk. Returns null for a data file that is missing. */
export function load(root = ROOT) {
  const read = (rel) => {
    const p = path.join(root, rel);
    return existsSync(p) ? readFileSync(p, "utf8") : null;
  };
  const json = (rel) => {
    const t = read(rel);
    return t === null ? null : JSON.parse(t);
  };
  const pages = {};
  for (const [url, rel] of Object.entries(SOURCE_FILES)) {
    const t = read(rel);
    if (t !== null) pages[url] = pageText(t);
  }
  return {
    psi: json(FILES.psi),
    investigations: json(FILES.investigations),
    questions: json(FILES.questions),
    foundQuotes: json(FILES.foundQuotes),
    pages,
  };
}

const hasFound = (row) => (row.quotes ?? []).some((q) => q.kind === "found");

/** Strength as the contract defines it, recomputed from the evidence rows. */
export function strengthOf(question, total) {
  const rows = (question.evidence ?? []).filter((r) => (r.quotes ?? []).length > 0);
  return {
    count: new Set(rows.map((r) => r.investigation)).size,
    withFindings: new Set(rows.filter(hasFound).map((r) => r.investigation)).size,
    of: total,
  };
}

/** Pure check over loaded data. Returns a list of problems (empty = honest). */
export function check(d, warnings = []) {
  const errors = [];
  const err = (m) => errors.push(m);
  const warn = (m) => warnings.push(m);

  const psi = Object.fromEntries((d.psi?.hits?.hits ?? []).map((h) => [h._source.Accession, h._source]));
  const psiIds = new Set(Object.keys(psi));
  if (psiIds.size !== 24) err(`PSI snapshot: expected 24 records, found ${psiIds.size}`);

  // ---------- investigations.json ----------
  const invs = d.investigations ?? [];
  const invIds = new Set();
  for (const c of invs) {
    const where = `investigations ${c.id}`;
    if (invIds.has(c.id)) err(`${where}: listed twice`);
    invIds.add(c.id);
    const src = psi[c.id];
    if (!src) {
      err(`${where}: no PSI record with this id`);
      continue;
    }
    const text = recordText(src);
    const quoteFields = {
      objective: c.objective,
      "fuel.detail": c.fuel?.detail,
      "fuel.size": c.fuel?.size,
      "conditions.oxygen": c.conditions?.oxygen,
      "conditions.airflow": c.conditions?.airflow,
      "conditions.pressure": c.conditions?.pressure,
      "hardware.apparatus": c.hardware?.apparatus,
    };
    for (const [f, v] of Object.entries(quoteFields)) {
      if (typeof v !== "string" || !norm(v)) err(`${where} ${f}: empty; use "${NS}"`);
      else if (v !== NS && !text.includes(norm(v)))
        err(`${where} ${f}: not word for word in the PSI record: "${norm(v).slice(0, 70)}"`);
    }
    for (const p of c.pillars ?? []) if (!I_PILLARS.has(p)) err(`${where}: bad pillar ${p}`);
    for (const r of c.related ?? []) if (!psiIds.has(r)) err(`${where}: related ${r} is not one of the 24`);
    if (c.related?.includes(c.id)) err(`${where}: lists itself as related`);
    if (norm(c.title) !== norm(src.Title)) err(`${where}: title differs from PSI`);
    if (c.psiUrl !== PSI_URL(c.id)) err(`${where}: psiUrl should be ${PSI_URL(c.id)}`);
  }
  for (const id of psiIds) if (!invIds.has(id)) err(`investigations: no card for ${id}`);

  // ---------- quotes, shared rule ----------
  const curatedFound = new Set(
    [...(d.foundQuotes?.quotes ?? []), ...(d.foundQuotes?.general ?? [])].map((q) => `${q.source}\n${norm(q.text)}`),
  );

  function checkQuote(where, q, inv) {
    if (!KINDS.has(q?.kind)) err(`${where}: kind must be tested, expected or found`);
    const text = norm(q?.text);
    const source = q?.source ?? "";
    if (!text) return err(`${where}: empty quote`);
    if (source.startsWith("http")) {
      const hay = d.pages[source];
      if (hay === undefined) err(`${where}: no saved copy of ${source}`);
      else if (!hay.includes(text)) err(`${where}: not word for word in ${source}: "${text.slice(0, 70)}"`);
      else if (q.kind === "found" && d.foundQuotes && !curatedFound.has(`${source}\n${text}`))
        warn(`${where}: Found quote is not listed in data/found-quotes.json: "${text.slice(0, 70)}"`);
    } else {
      if (!inv) err(`${where}: a quote outside an evidence row needs a URL source`);
      else if (!PSI_FIELDS.has(source)) err(`${where}: unknown PSI field "${source}"`);
      else if (!psi[inv]) err(`${where}: no PSI record ${inv}`);
      else if (!norm(psi[inv][source]).includes(text))
        err(`${where}: not word for word in ${inv} ${source}: "${text.slice(0, 70)}"`);
    }
  }

  // ---------- found-quotes.json ----------
  if (d.foundQuotes) {
    const fq = d.foundQuotes;
    (fq.quotes ?? []).forEach((q, i) => {
      const where = `found-quotes quotes[${i}]`;
      if (q.kind !== "found") err(`${where}: kind must be found`);
      if (!psiIds.has(q.investigation)) err(`${where}: unknown investigation ${q.investigation}`);
      for (const a of q.alsoAbout ?? [])
        if (!psiIds.has(a) || a === q.investigation) err(`${where}: bad alsoAbout ${a}`);
      checkQuote(where, q, q.investigation);
    });
    (fq.general ?? []).forEach((q, i) => {
      const where = `found-quotes general[${i}]`;
      if (q.kind !== "found") err(`${where}: kind must be found`);
      if (q.investigation != null || q.alsoAbout?.length) err(`${where}: general quotes name no investigation`);
      if (!String(q.source).startsWith("http")) err(`${where}: general quote needs a URL source`);
      checkQuote(where, q, null);
    });
  }

  // ---------- questions.json ----------
  const qIds = new Set();
  for (const q of d.questions ?? []) {
    const qid = q.id;
    if (qIds.has(qid)) err(`${qid}: duplicate question id`);
    qIds.add(qid);
    if (!Q_PILLARS.has(q.pillar)) err(`${qid}: bad pillar ${q.pillar}`);
    for (const h of q.habitats ?? []) if (!HABITATS.has(h)) err(`${qid}: bad habitat ${h}`);
    if (!(q.unknown ?? []).length) err(`${qid}: needs at least one "not yet known" line`);
    if (!(q.answer ?? []).length) err(`${qid}: no answer`);

    const rows = q.evidence ?? [];
    const seen = new Set();
    const foundIds = new Set();
    rows.forEach((row, i) => {
      const inv = row.investigation;
      const where = `${qid} evidence ${inv}`;
      if (!invIds.has(inv) || !psiIds.has(inv)) err(`${where}: not one of the 24 investigations`);
      if (seen.has(inv)) err(`${where}: listed twice`);
      seen.add(inv);
      if (row.rank !== i + 1) err(`${where}: rank ${row.rank}, expected ${i + 1} (rows must be in rank order)`);
      if (!norm(row.why)) err(`${where}: needs a one-line reason`);
      if (!(row.quotes ?? []).length) err(`${where}: needs at least one quote`);
      (row.quotes ?? []).forEach((x, k) => checkQuote(`${where} quote ${k}`, x, inv));
      if (hasFound(row)) foundIds.add(inv);
    });
    // Found rows rank above rows that only say what was tested or expected.
    const firstPlain = rows.findIndex((r) => !hasFound(r));
    if (firstPlain >= 0 && rows.slice(firstPlain).some(hasFound))
      err(`${qid}: a row with a stated result ranks below one without`);

    (q.answer ?? []).forEach((s, n) => {
      const where = `${qid} answer ${n}`;
      const cites = s.cites ?? [];
      for (const c of cites) if (!seen.has(c)) err(`${where}: cites ${c}, which has no evidence row`);
      (s.basis ?? []).forEach((b, k) => checkQuote(`${where} basis ${k}`, b, null));
      if (s.scope && (cites.length || s.basis?.length)) err(`${where}: a scope sentence has no cites or basis`);
      if (!cites.length && !s.basis?.length && !s.scope) err(`${where}: needs cites, basis, or scope`);
      if (/\bfound\b/i.test(s.text) && !s.scope) {
        const ok = cites.some((c) => foundIds.has(c)) || (s.basis ?? []).some((b) => b.kind === "found");
        if (!ok) err(`${where}: says "found" but rests on no Found quote`);
      }
    });

    if (q.earth != null) {
      if (!norm(q.earth.text)) err(`${qid} earth: empty text`);
      checkQuote(`${qid} earth`, { kind: "found", text: q.earth.quote, source: q.earth.source }, null);
    }

    const want = strengthOf(q, psiIds.size);
    const got = q.strength ?? {};
    if (got.count !== want.count || got.withFindings !== want.withFindings || got.of !== want.of)
      err(`${qid}: strength is ${JSON.stringify(got)}, recomputed ${JSON.stringify(want)}`);
  }

  return errors;
}

/** Evidence strength per question and per investigation, for the report. */
export function strengthReport(d) {
  const total = (d.psi?.hits?.hits ?? []).length;
  const perQuestion = (d.questions ?? []).map((q) => ({ id: q.id, ...strengthOf(q, total) }));
  const perInv = new Map((d.investigations ?? []).map((c) => [c.id, { questions: 0, withFindings: 0 }]));
  for (const q of d.questions ?? [])
    for (const r of q.evidence ?? []) {
      const e = perInv.get(r.investigation);
      if (!e) continue;
      e.questions++;
      if (hasFound(r)) e.withFindings++;
    }
  return { perQuestion, perInvestigation: [...perInv].map(([id, v]) => ({ id, ...v })) };
}

function main() {
  const quiet = process.argv.includes("--quiet");
  const d = load();
  if (!d.psi || !d.investigations || !d.questions) {
    // Branches that predate the data files (UI work off an old main) still build.
    const missing = ["psi", "investigations", "questions"].filter((k) => !d[k]).map((k) => FILES[k]);
    console.warn(`honesty check SKIPPED: missing ${missing.join(", ")}`);
    return 0;
  }
  const warnings = [];
  const errors = check(d, warnings);
  for (const w of warnings) console.warn("  warning: " + w);
  if (errors.length) {
    console.error("Honesty check FAILED:");
    for (const e of errors) console.error("  - " + e);
    console.error(`${errors.length} problem(s). Fix the source in data/build/ and rebuild the JSON.`);
    return 1;
  }
  const nQuotes =
    d.questions.reduce(
      (n, q) =>
        n +
        q.evidence.reduce((m, r) => m + r.quotes.length, 0) +
        q.answer.reduce((m, s) => m + (s.basis?.length ?? 0), 0) +
        (q.earth ? 1 : 0),
      0,
    ) + (d.foundQuotes ? d.foundQuotes.quotes.length + d.foundQuotes.general.length : 0);
  if (!quiet) {
    const { perQuestion } = strengthReport(d);
    console.log("Evidence strength (investigations with a quote / of them with a stated result):");
    for (const s of perQuestion)
      console.log(`  ${s.id.padEnd(24)} ${String(s.count).padStart(2)} of ${s.of}, ${s.withFindings} with stated results`);
  }
  console.log(
    `Honesty check OK: ${d.investigations.length} investigations, ${d.questions.length} questions, ${nQuotes} quotes word for word.`,
  );
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main());
