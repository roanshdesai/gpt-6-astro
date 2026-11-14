#!/usr/bin/env node
// Link test for the submission (backend part 7).
//
//   node data/check/links.mjs                       every URL in the data files and docs/submission
//   node data/check/links.mjs --site https://...     also every page of the deployed site
//   node data/check/links.mjs --site http://localhost:3000 --no-sources
//
// Run it from a computer that can reach nasa.gov (the cloud sandbox cannot).
// Exit 1 if any link fails, so it can gate a deploy if wanted.
//
// Sources: every http(s) string inside data/*.json, the source pages the
// honesty check reads (data/check/honesty.mjs SOURCE_FILES), and every link in
// docs/submission/*.md. A link passes on a final 2xx after redirects.
// Known exceptions are listed in EXPECTED below with the status we expect and
// why, so a known 404 does not hide a new one.
//
// Site mode checks the routes a judge can open: /, /investigations, each
// /investigations/<id>, /compare (empty and with two ids), and that a made-up
// id answers 404. Node standard library only (Node 18+ for fetch).

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { SOURCE_FILES } from "./honesty.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const TIMEOUT_MS = 25_000;
const CONCURRENCY = 4;
const UA = "Mozilla/5.0 (link check; NASA Space Apps project)";

// URL -> { status, why }. A link listed here passes only with exactly this status.
export const EXPECTED = {
  "https://science.nasa.gov/science-news/science-at-nasa/2013/18jun_strangeflames/": {
    status: 404,
    why: "original ScienceCasts page, gone from science.nasa.gov; kept as landing.json video.nasaUrl only. The UI must not link it.",
  },
};

function arg(name) {
  const i = process.argv.indexOf(name);
  return i === -1 ? null : (process.argv[i + 1] ?? "");
}
const flag = (name) => process.argv.includes(name);

/** Every http(s) string anywhere in a JSON value, with the path where it sits. */
export function urlsInJson(value, where, out = []) {
  if (typeof value === "string") {
    if (/^https?:\/\//.test(value)) out.push({ url: value, where });
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => urlsInJson(v, `${where}[${i}]`, out));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) urlsInJson(v, `${where}.${k}`, out);
  }
  return out;
}

/** Links in Markdown text: [x](url), <url> and bare urls. */
export function urlsInMarkdown(text, where) {
  const out = [];
  for (const m of text.matchAll(/https?:\/\/[^\s)<>"'`\]]+/g)) {
    const url = m[0].replace(/[.,;:]+$/, "");
    if (!/example\.|<|\{|YOUR-/.test(url)) out.push({ url, where });
  }
  return out;
}

export function collectSourceLinks(root = ROOT) {
  const found = [];
  const dataDir = path.join(root, "data");
  for (const f of readdirSync(dataDir).filter((f) => f.endsWith(".json")).sort()) {
    urlsInJson(JSON.parse(readFileSync(path.join(dataDir, f), "utf8")), `data/${f}`, found);
  }
  for (const url of Object.keys(SOURCE_FILES)) found.push({ url, where: "honesty.mjs SOURCE_FILES" });
  const docs = path.join(root, "docs/submission");
  if (existsSync(docs)) {
    for (const f of readdirSync(docs).filter((f) => f.endsWith(".md")).sort()) {
      found.push(...urlsInMarkdown(readFileSync(path.join(docs, f), "utf8"), `docs/submission/${f}`));
    }
  }
  // One row per URL, remembering every place it appears.
  const byUrl = new Map();
  for (const { url, where } of found) {
    if (!byUrl.has(url)) byUrl.set(url, new Set());
    byUrl.get(url).add(where.replace(/\[\d+\]/g, "[]"));
  }
  return [...byUrl].map(([url, wheres]) => ({ url, where: [...wheres].join(", ") }));
}

export function siteLinks(base, investigations) {
  const b = base.replace(/\/+$/, "");
  const ids = investigations.map((i) => i.id);
  const rows = [
    { url: `${b}/`, where: "site" },
    { url: `${b}/investigations`, where: "site" },
    ...ids.map((id) => ({ url: `${b}/investigations/${id}`, where: "site" })),
    { url: `${b}/compare`, where: "site" },
    { url: `${b}/compare?a=${ids[0]}&b=${ids[1]}`, where: "site" },
    { url: `${b}/investigations/PSI-0`, where: "site (made-up id)", expect: 404 },
  ];
  return rows;
}

async function check(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    // GET, not HEAD: several NASA pages answer HEAD differently from GET.
    const res = await fetch(url, { redirect: "follow", signal: ctrl.signal, headers: { "user-agent": UA } });
    res.body?.cancel().catch(() => {});
    return { status: res.status, final: res.url };
  } catch (e) {
    return { status: 0, final: "", error: e.name === "AbortError" ? "timeout" : String(e.cause?.code ?? e.message) };
  } finally {
    clearTimeout(timer);
  }
}

async function runAll(rows) {
  const results = new Array(rows.length);
  let next = 0;
  async function worker() {
    while (next < rows.length) {
      const i = next++;
      results[i] = { ...rows[i], ...(await check(rows[i].url)) };
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results;
}

export function verdict(r) {
  const want = r.expect ?? EXPECTED[r.url]?.status;
  if (want !== undefined) return r.status === want;
  return r.status >= 200 && r.status < 300;
}

async function main() {
  const site = arg("--site");
  const rows = flag("--no-sources") ? [] : collectSourceLinks();
  if (site) {
    const inv = JSON.parse(readFileSync(path.join(ROOT, "data/investigations.json"), "utf8"));
    rows.push(...siteLinks(site, inv));
  }
  if (rows.length === 0) {
    console.error("Nothing to check.");
    process.exit(2);
  }
  console.log(`Checking ${rows.length} links...`);
  const results = await runAll(rows);
  let bad = 0;
  for (const r of results) {
    const ok = verdict(r);
    if (!ok) bad++;
    const moved = r.final && r.final !== r.url ? `  -> ${r.final}` : "";
    const note = EXPECTED[r.url] ? `  (expected: ${EXPECTED[r.url].why})` : r.expect ? `  (expected ${r.expect})` : "";
    console.log(`${ok ? "ok  " : "FAIL"} ${String(r.status || r.error).padEnd(7)} ${r.url}${moved}${note}`);
    if (!ok) console.log(`       used in: ${r.where}`);
  }
  console.log(bad ? `\n${bad} of ${results.length} links failed.` : `\nAll ${results.length} links OK.`);
  process.exit(bad ? 1 : 0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
