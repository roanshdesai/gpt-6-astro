"""Build data/landing.json from data/build/landing_src.py (backend part 6).

Usage (from the repo root):
    python3 data/build/build_landing.py

Fails (exit 1), writing nothing, if a quote or support line is not word for
word in the saved copy of its NASA page, or a card is missing a field.
Standard library only; same matching rule as build_questions.py.
"""

import json
import sys

sys.dont_write_bytecode = True
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_questions import SOURCE_FILES, norm, page_text  # noqa: E402
from landing_src import INCIDENTS, VIDEO  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "data/landing.json"
FIELDS = ("id", "year", "name", "text", "quote", "source", "sourceTitle")


def main():
    pages = {url: page_text(f) for url, f in SOURCE_FILES.items()}
    errors = []

    def verbatim(where, text, source):
        if source not in pages:
            errors.append(f"{where}: no saved copy of {source}")
        elif not norm(text) or norm(text) not in pages[source]:
            errors.append(f"{where}: not word for word in {source}: {norm(text)[:70]}...")

    ids = set()
    for c in INCIDENTS:
        where = f"incident {c.get('id')}"
        for f in FIELDS:
            if not str(c.get(f, "")).strip():
                errors.append(f"{where}: missing {f}")
        if c["id"] in ids:
            errors.append(f"{where}: listed twice")
        ids.add(c["id"])
        verbatim(f"{where} quote", c["quote"], c["source"])
        for k, s in enumerate(c.get("support", [])):
            verbatim(f"{where} support {k}", s, c["source"])
    verbatim("video quote", VIDEO["quote"], VIDEO["source"])

    if errors:
        print("build_landing FAILED:", *errors, sep="\n  - ")
        sys.exit(1)
    OUT.write_text(json.dumps({"incidents": INCIDENTS, "video": VIDEO}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    n = len(INCIDENTS) + sum(len(c.get("support", [])) for c in INCIDENTS) + 1
    print(f"wrote {OUT.relative_to(ROOT)}: {len(INCIDENTS)} incident cards and the video link, {n} quotes, all word for word")


if __name__ == "__main__":
    main()
