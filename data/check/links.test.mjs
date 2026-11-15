// Tests for the link test's collection and pass/fail rules (no network).
//   node --test data/check/links.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { collectSourceLinks, urlsInJson, urlsInMarkdown, siteLinks, verdict, EXPECTED } from "./links.mjs";

test("every psiUrl and every quote source is collected", () => {
  const urls = new Set(collectSourceLinks().map((r) => r.url));
  assert.ok([...urls].filter((u) => u.startsWith("https://psi.nasa.gov/physci/repo/data/investigations/")).length === 24);
  assert.ok(urls.has("https://spinoff.nasa.gov/node/9407"));
  assert.ok(urls.has("https://www.youtube.com/watch?v=BxxqCLxxY3M"));
});

test("urls are found at any depth of the JSON", () => {
  const got = urlsInJson({ a: [{ b: "https://x.test/1" }], c: "not a url" }, "f");
  assert.deepEqual(got, [{ url: "https://x.test/1", where: "f.a[0].b" }]);
});

test("markdown links lose trailing punctuation and placeholders are skipped", () => {
  const got = urlsInMarkdown("See [a](https://x.test/a). Or https://x.test/b, and https://YOUR-SITE.vercel.app", "d");
  assert.deepEqual(got.map((r) => r.url), ["https://x.test/a", "https://x.test/b"]);
});

test("site mode visits the dashboard, the board and every question page", () => {
  const rows = siteLinks("https://x.test", [{ id: "PSI-10" }, { id: "PSI-20" }], [{ id: "fans-off" }, { id: "moon-mars" }]);
  const urls = rows.map((r) => r.url);
  for (const u of ["/dashboard", "/board", "/board/fans-off", "/board/moon-mars", "/investigations/PSI-20", "/compare"])
    assert.ok(urls.includes(`https://x.test${u}`), u);
});

test("site mode expects 404 for a made-up id", () => {
  const rows = siteLinks("http://localhost:3000/", [{ id: "PSI-10" }, { id: "PSI-20" }]);
  const madeUp = rows.find((r) => r.url.endsWith("/investigations/PSI-0"));
  assert.equal(madeUp.expect, 404);
  assert.equal(verdict({ ...madeUp, status: 200 }), false);
  assert.equal(verdict({ ...madeUp, status: 404 }), true);
});

test("a known 404 passes only as 404; anything else needs 2xx", () => {
  const known = Object.keys(EXPECTED)[0];
  assert.equal(verdict({ url: known, status: 404 }), true);
  assert.equal(verdict({ url: known, status: 200 }), false);
  assert.equal(verdict({ url: "https://x.test", status: 301 }), false);
  assert.equal(verdict({ url: "https://x.test", status: 0 }), false);
  assert.equal(verdict({ url: "https://x.test", status: 204 }), true);
});
