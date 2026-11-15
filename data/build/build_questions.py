"""Build data/questions.json from data/build/questions_src.py.

Usage (from the repo root):
    python3 data/build/build_questions.py

Inputs:  data/build/questions_src.py               (hand-written questions)
         data/investigations.json                  (the 24 cards, part 1)
         data/raw/psi-combustion-2026-11-14.json   (PSI snapshot)
         data/raw/sources/*.txt                    (saved Guide and NASA page)
Output:  data/questions.json

Fails (exit 1), writing nothing, if:
  - a quote is not word for word in its source (PSI field of that row's
    investigation, or the saved copy of the resource URL);
  - a row names an investigation that is not one of the 24, or appears twice;
  - an answer sentence cites an id that has no evidence row;
  - an answer sentence has no cites and no basis (unless marked scope);
  - an answer sentence says "found" without resting on a Found quote;
  - a question has no "unknown" line, or uses an unknown pillar/habitat.
Ranks (Found rows first, then list order) and strength are computed here. Standard library only.
"""

import json
import re
import sys

sys.dont_write_bytecode = True
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from questions_src import QUESTIONS  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
PSI = ROOT / "data/raw/psi-combustion-2026-11-14.json"
INV = ROOT / "data/investigations.json"
OUT = ROOT / "data/questions.json"
SOURCE_FILES = {
    "https://www.nasa.gov/sites/default/files/atoms/files/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf":
        "data/raw/sources/researchers-guide-combustion.txt",
    "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/":
        "data/raw/sources/nasa-combustion-science-page.txt",
    # Part 6 pages (see data/raw/sources/html/SOURCES.txt).
    "https://www.nasa.gov/mission/apollo-1/":
        "data/raw/sources/apollo-1.txt",
    "https://www.nasa.gov/history/55-years-ago-the-apollo-1-fire-and-its-aftermath/":
        "data/raw/sources/apollo-1-fire-aftermath.txt",
    "https://www.nasa.gov/mission/apollo-13/":
        "data/raw/sources/apollo-13.txt",
    "https://www.nasa.gov/history/houston-weve-had-a-problem/":
        "data/raw/sources/apollo-13-problem.txt",
    "https://www.nasa.gov/history/50-years-ago-apollo-13-review-board-report/":
        "data/raw/sources/apollo-13-review-board.txt",
    "https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/":
        "data/raw/sources/mir-fire.txt",
    "https://spinoff.nasa.gov/node/9582":
        "data/raw/sources/spinoff-air-tanks.txt",
    "https://spinoff.nasa.gov/node/9407":
        "data/raw/sources/spinoff-fire-detector.txt",
    "https://spinoff.nasa.gov/node/9918":
        "data/raw/sources/spinoff-fire-attire.txt",
    "http://web.archive.org/web/20230602193621id_/https://science.nasa.gov/science-news/science-at-nasa/2013/18jun_strangeflames/":
        "data/raw/sources/sciencecasts.txt",
    "https://www.nasa.gov/humans-in-space/space-stations-quest-for-the-secrets-of-fire/":
        "data/raw/sources/sciencecasts-related-quest-for-fire.txt",
}
PSI_FIELDS = {"Objectives", "Approach", "Hypothesis", "Research Impacts/Earth Benefits", "Experiment Hardware"}
PILLARS = {"prevent", "detect", "suppress", "across"}
HABITATS = {"spacecraft", "station", "moon-base", "mars-base", "rover"}
KINDS = {"tested", "expected", "found"}


def norm(s):
    return re.sub(r"\s+", " ", s or "").strip()


def page_text(path):
    # Same rule as check_found_quotes.py: drop lines that are only a printed
    # page number so a sentence across a page break still matches.
    lines = (ROOT / path).read_text(encoding="utf-8").splitlines()
    return norm("\n".join(l for l in lines if not re.fullmatch(r"\s*\d+\s*", l)))


def main():
    psi = {h["_source"]["Accession"]: h["_source"] for h in json.loads(PSI.read_text())["hits"]["hits"]}
    inv_ids = {i["id"] for i in json.loads(INV.read_text())}
    pages = {url: page_text(f) for url, f in SOURCE_FILES.items()}
    errors = []

    def check_quote(where, q, inv=None):
        if q.get("kind") not in KINDS:
            errors.append(f"{where}: kind must be one of {sorted(KINDS)}")
        src, text = q.get("source", ""), norm(q.get("text"))
        if not text:
            errors.append(f"{where}: empty quote")
        elif src.startswith("http"):
            if src not in pages:
                errors.append(f"{where}: no saved copy of {src}")
            elif text not in pages[src]:
                errors.append(f"{where}: not word for word in {src}: {text[:70]}...")
        else:
            if inv is None:
                errors.append(f"{where}: a quote outside an evidence row needs a URL source")
            elif src not in PSI_FIELDS:
                errors.append(f"{where}: unknown PSI field {src!r}")
            elif text not in norm(psi[inv].get(src)):
                errors.append(f"{where}: not word for word in {inv} {src}: {text[:70]}...")

    out, seen_q = [], set()
    for q in QUESTIONS:
        qid = q["id"]
        if qid in seen_q:
            errors.append(f"{qid}: duplicate question id")
        seen_q.add(qid)
        if q["pillar"] not in PILLARS:
            errors.append(f"{qid}: bad pillar {q['pillar']}")
        bad_h = set(q["habitats"]) - HABITATS
        if bad_h:
            errors.append(f"{qid}: bad habitats {sorted(bad_h)}")
        if not q["unknown"]:
            errors.append(f"{qid}: needs at least one 'unknown' line")

        # Rank: rows with a stated result (a Found quote) first, then the
        # hand-written order in questions_src.py, which puts the most direct
        # test of the question first.
        rows = sorted(q["evidence"], key=lambda r: not any(x["kind"] == "found" for x in r["quotes"]))
        evidence, found_ids, seen_inv = [], set(), set()
        for rank, row in enumerate(rows, 1):
            inv = row["investigation"]
            where = f"{qid} evidence {inv}"
            if inv not in inv_ids or inv not in psi:
                errors.append(f"{where}: not one of the 24 investigations")
                continue
            if inv in seen_inv:
                errors.append(f"{where}: listed twice")
            seen_inv.add(inv)
            if not row["quotes"]:
                errors.append(f"{where}: needs at least one quote")
            for k, quote in enumerate(row["quotes"]):
                check_quote(f"{where} quote {k}", quote, inv)
            if any(x["kind"] == "found" for x in row["quotes"]):
                found_ids.add(inv)
            evidence.append({"investigation": inv, "rank": rank, "why": row["why"], "quotes": row["quotes"]})

        for n, s in enumerate(q["answer"]):
            where = f"{qid} answer {n}"
            for c in s["cites"]:
                if c not in seen_inv:
                    errors.append(f"{where}: cites {c}, which has no evidence row")
            for k, b in enumerate(s.get("basis", [])):
                check_quote(f"{where} basis {k}", b)
            if not s["cites"] and not s.get("basis") and not s.get("scope"):
                errors.append(f"{where}: needs cites, basis, or scope")
            if re.search(r"\bfound\b", s["text"], re.I) and not s.get("scope"):
                has_found = any(c in found_ids for c in s["cites"]) or any(b["kind"] == "found" for b in s.get("basis", []))
                if not has_found:
                    errors.append(f"{where}: says 'found' but rests on no Found quote")

        earth = q.get("earth")
        if earth is not None:
            check_quote(f"{qid} earth", {"kind": "found", "text": earth["quote"], "source": earth["source"]})

        out.append({
            "id": qid,
            "pillar": q["pillar"],
            "question": q["question"],
            "answer": q["answer"],
            "evidence": evidence,
            "strength": {"count": len(evidence), "withFindings": len(found_ids), "of": len(inv_ids)},
            "unknown": q["unknown"],
            "habitats": q["habitats"],
            "earth": earth,
        })

    if errors:
        print("\n".join(errors))
        print(f"{len(errors)} problem(s); data/questions.json not written")
        sys.exit(1)
    OUT.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
    n_quotes = sum(len(r["quotes"]) for q in out for r in q["evidence"]) + sum(len(s.get("basis", [])) for q in out for s in q["answer"])
    print(f"wrote data/questions.json: {len(out)} questions, {n_quotes} quotes, all word for word")


if __name__ == "__main__":
    main()
