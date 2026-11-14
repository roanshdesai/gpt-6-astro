"""Check every quote in data/found-quotes.json appears word for word in its source.

PSI-field sources are checked against the saved PSI snapshot. URL sources are
checked against a text copy in data/raw/sources/, mapped in SOURCE_FILES.
Whitespace runs are collapsed before comparing; nothing else is normalised.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PSI = ROOT / "data/raw/psi-combustion-2026-11-14.json"
QUOTES = ROOT / "data/found-quotes.json"
SOURCE_FILES = {
    "https://www.nasa.gov/sites/default/files/atoms/files/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf":
        "data/raw/sources/researchers-guide-combustion.txt",
    "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/":
        "data/raw/sources/nasa-combustion-science-page.txt",
}

def norm(s): return re.sub(r"\s+", " ", s).strip()

def page_text(path):
    # pdftotext output: drop lines that are only a printed page number,
    # so a sentence running across a page break still matches.
    lines = (ROOT / path).read_text().splitlines()
    return norm("\n".join(l for l in lines if not re.fullmatch(r"\s*\d+\s*", l)))

def main():
    psi = {h["_source"]["Accession"]: h["_source"] for h in json.loads(PSI.read_text())["hits"]["hits"]}
    bad = 0
    data = json.loads(QUOTES.read_text())
    items = [(f"quotes[{i}]", q) for i, q in enumerate(data["quotes"])]
    items += [(f"general[{i}]", q) for i, q in enumerate(data["general"])]
    for i, q in items:
        inv, src, text = q["investigation"], q["source"], norm(q["text"])
        if q.get("kind") != "found":
            print(f"[{i}] kind must be 'found'"); bad += 1; continue
        if inv is None and not src.startswith("http"):
            print(f"[{i}] general quote needs a URL source"); bad += 1; continue
        if inv is not None and inv not in psi:
            print(f"[{i}] unknown investigation {inv}"); bad += 1; continue
        if src.startswith("http"):
            f = SOURCE_FILES.get(src)
            hay = page_text(f) if f else None
        else:
            hay = norm(psi[inv].get(src) or "")
        if hay is None:
            print(f"[{i}] no saved text for source {src}"); bad += 1
        elif text not in hay:
            print(f"[{i}] {inv} quote not found verbatim in {src}"); bad += 1
    print("OK" if not bad else f"{bad} problem(s)")
    sys.exit(1 if bad else 0)

if __name__ == "__main__":
    main()
