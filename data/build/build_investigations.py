"""Build data/investigations.json from the saved PSI snapshot.

Usage (from the repo root):
    python3 data/build/build_investigations.py

Inputs:  data/raw/psi-combustion-2026-11-14.json  (24 PSI records)
         data/build/cards.py                      (hand-written card fields)
Output:  data/investigations.json

Fails (exit 1) if any quote field is not word for word in its PSI record,
if a card is missing, or if a related id is not one of the 24.
No network, no API key, standard library only.
"""

import json
import re
import sys

sys.dont_write_bytecode = True
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from cards import CARDS, NS  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "data" / "raw" / "psi-combustion-2026-11-14.json"
OUT = ROOT / "data" / "investigations.json"

# Public page pattern, confirmed by opening PSI-117 in a browser (Nov 14).
PSI_URL = "https://psi.nasa.gov/physci/repo/data/investigations/{id}"

PILLARS = {"prevent", "detect", "suppress"}
FUEL_STATES = {"solid", "liquid", "gas", "none", NS}
FACILITIES = {"CIR", "MSG", "Cygnus", "ground", NS}


def split_list(value: str) -> list[str]:
    """PSI joins list items with runs of spaces (and sometimes a newline)."""
    return [p.strip() for p in re.split(r"\s{3,}|\n", value or "") if p.strip()]


def record_text(src: dict) -> str:
    parts = []
    for v in src.values():
        if isinstance(v, str):
            parts.append(v)
        elif isinstance(v, dict):
            parts.extend(x for x in v.values() if isinstance(x, str))
    return "\n".join(parts)


def platform(src: dict) -> str:
    project = src.get("Project Type", "")
    if project == "Ground Investigation":
        return "Ground"
    # Saffire runs happened on Cygnus after it left the ISS, per each record's
    # Approach text, even where "Flight Platform" says ISS.
    if "Cygnus" in src.get("Flight Platform", "") or "Cygnus resupply vehicle" in src.get("Approach", ""):
        return "Cygnus"
    if "ISS" in src.get("Flight Platform", ""):
        return "ISS"
    return NS


def years(src: dict) -> str:
    def yr(d):
        m = re.search(r"(\d{4})\s*$", d or "")
        return m.group(1) if m else None

    a, b = yr(src.get("Investigation Start Date")), yr(src.get("Investigation End Date"))
    if a and b:
        return a if a == b else f"{a}-{b}"
    if a:
        return f"{a}-"
    return NS


def main() -> int:
    hits = json.loads(RAW.read_text(encoding="utf-8"))["hits"]["hits"]
    records = {h["_source"]["Accession"]: h["_source"] for h in hits}
    ids = set(records)
    errors = []

    if len(records) != 24:
        errors.append(f"expected 24 records, found {len(records)}")
    for missing in sorted(ids - set(CARDS)):
        errors.append(f"{missing}: no card in cards.py")
    for extra in sorted(set(CARDS) - ids):
        errors.append(f"{extra}: card has no PSI record")

    out = []
    for pid, src in records.items():
        card = CARDS.get(pid)
        if card is None:
            continue
        text = record_text(src)

        quotes = {
            "objective": card["objective"],
            "fuel.detail": card["fuel"]["detail"],
            "fuel.size": card["fuel"]["size"],
            "conditions.oxygen": card["conditions"]["oxygen"],
            "conditions.airflow": card["conditions"]["airflow"],
            "conditions.pressure": card["conditions"]["pressure"],
            "hardware.apparatus": card["hardware"]["apparatus"],
        }
        for field, q in quotes.items():
            if q != NS and q not in text:
                errors.append(f"{pid} {field}: not word for word in the PSI record: {q!r}")

        if not set(card["pillars"]) <= PILLARS:
            errors.append(f"{pid}: bad pillar {card['pillars']}")
        if card["fuel"]["state"] not in FUEL_STATES:
            errors.append(f"{pid}: bad fuel.state {card['fuel']['state']!r}")
        if card["hardware"]["facility"] not in FACILITIES:
            errors.append(f"{pid}: bad hardware.facility {card['hardware']['facility']!r}")

        related = split_list(src.get("Related Investigations", ""))
        for r in related:
            if r not in ids:
                errors.append(f"{pid}: related id {r} is not one of the 24")

        out.append(
            {
                "id": pid,
                "acronym": src.get("Acronym") or None,
                "title": src["Title"].strip(),
                "kind": "ground" if src.get("Project Type") == "Ground Investigation" else "flight",
                "pillars": card["pillars"],
                "summary": card["summary"],
                "objective": card["objective"],
                "fuel": card["fuel"],
                "conditions": card["conditions"],
                "varied": card["varied"],
                "measurements": card["measurements"],
                "hardware": card["hardware"],
                "platform": platform(src),
                "years": years(src),
                "related": related,
                "publications": split_list(src.get("Publication Title", "")),
                "psiUrl": PSI_URL.format(id=pid),
            }
        )

    if errors:
        print("investigations.json NOT written:", file=sys.stderr)
        for e in errors:
            print("  -", e, file=sys.stderr)
        return 1

    out.sort(key=lambda c: int(c["id"].split("-")[1]))
    OUT.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)}: {len(out)} investigations, all quotes word for word")
    return 0


if __name__ == "__main__":
    sys.exit(main())
