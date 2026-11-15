// Tests for the honesty check: each tampering below must be caught.
//   node --test data/check/honesty.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { load, check } from "./honesty.mjs";

const fresh = () => structuredClone(load());
const fails = (d, pattern) => {
  const errors = check(d);
  assert.ok(errors.some((e) => pattern.test(e)), `expected an error matching ${pattern}, got:\n${errors.join("\n")}`);
};

test("the committed data passes", () => {
  assert.deepEqual(check(fresh()), []);
});

test("a changed word in an evidence quote fails", () => {
  const d = fresh();
  const q = d.questions[0].evidence[0].quotes[0];
  q.text = q.text.replace(/\b(\w{4,})\b/, "$1s");
  fails(d, /not word for word/);
});

test("a quote moved to another investigation's row fails", () => {
  const d = fresh();
  const [a, b] = d.questions[0].evidence;
  const psiQuote = a.quotes.find((x) => !x.source.startsWith("http")) ?? b.quotes.find((x) => !x.source.startsWith("http"));
  const other = a.quotes.includes(psiQuote) ? b : a;
  other.quotes.push(structuredClone(psiQuote));
  fails(d, /not word for word/);
});

test("an edited Guide quote fails", () => {
  const d = fresh();
  const q = d.foundQuotes.quotes[0];
  q.text = q.text.replace("lower", "higher");
  fails(d, /not word for word/);
});

test("an edited card condition fails", () => {
  const d = fresh();
  const c = d.investigations.find((x) => x.conditions.airflow !== "not stated");
  c.conditions.airflow += " or more";
  fails(d, /conditions\.airflow: not word for word/);
});

test("a citation to an investigation with no evidence row fails", () => {
  const d = fresh();
  const q = d.questions[0];
  const missing = d.investigations.map((c) => c.id).find((id) => !q.evidence.some((r) => r.investigation === id));
  q.answer[0].cites.push(missing);
  fails(d, /has no evidence row/);
});

test("an evidence row for a made-up investigation fails", () => {
  const d = fresh();
  d.questions[0].evidence[0].investigation = "PSI-9999";
  fails(d, /not one of the 24/);
});

test("a wrong strength count fails", () => {
  const d = fresh();
  d.questions[0].strength.withFindings += 1;
  fails(d, /strength is/);
});

test("'found' with no Found quote behind it fails", () => {
  const d = fresh();
  // A sentence whose cites and basis hold no Found quote.
  const s = d.questions
    .flatMap((q) => q.answer.map((a) => ({ q, a })))
    .find(({ q, a }) =>
      !a.scope && !(a.basis ?? []).some((b) => b.kind === "found") &&
      a.cites.every((c) => !q.evidence.find((r) => r.investigation === c).quotes.some((x) => x.kind === "found")));
  s.a.text = "NASA found that " + s.a.text;
  fails(d, /says "found"/);
});

test("a stated-result row ranked below a plain row fails", () => {
  const d = fresh();
  const q = d.questions.find((x) => x.strength.withFindings > 0 && x.strength.withFindings < x.strength.count);
  q.evidence.reverse();
  q.evidence.forEach((r, i) => (r.rank = i + 1));
  fails(d, /ranks below/);
});

test("an Earth line with a made-up quote fails", () => {
  const d = fresh();
  d.questions[0].earth = {
    text: "x",
    quote: "This sentence is not in any NASA source.",
    source: Object.keys(d.pages)[0],
  };
  fails(d, /earth: not word for word/);
});

test("an edited Spinoff Earth quote fails", () => {
  const d = fresh();
  const q = d.questions.find((x) => x.earth?.quote?.includes("dust"));
  q.earth.quote = q.earth.quote.replace("dust", "pollen");
  fails(d, /earth: not word for word/);
});

test("an edited incident card quote fails", () => {
  const d = fresh();
  d.landing.incidents[0].quote = d.landing.incidents[0].quote.replace("pure oxygen", "normal air");
  fails(d, /landing incident apollo-1 quote: not word for word/);
});

test("an incident support line from another page fails", () => {
  const d = fresh();
  const [a, b] = d.landing.incidents;
  a.support.push(b.quote);
  fails(d, /landing incident apollo-1 support \d+: not word for word/);
});

test("an incident card with an unsaved source fails", () => {
  const d = fresh();
  d.landing.incidents[1].source = "https://www.nasa.gov/not-saved/";
  fails(d, /no saved copy/);
});

test("an edited video quote fails", () => {
  const d = fresh();
  d.landing.video.quote = d.landing.video.quote.replace("cool", "hot");
  fails(d, /landing video quote: not word for word/);
});
