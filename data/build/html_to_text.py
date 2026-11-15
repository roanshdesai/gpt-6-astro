"""Turn the saved NASA web pages (data/raw/sources/html/*.html) into the plain
text copies the honesty check reads (data/raw/sources/<name>.txt).

Usage (from the repo root):
    python3 data/build/html_to_text.py

The pages were downloaded on Nov 14 and 15, 2026 from a laptop (nasa.gov is
not reachable from the cloud); data/raw/sources/html/SOURCES.txt lists the URL
and the date of each file. Text only: scripts, styles, nav, header and footer are dropped,
entities are decoded, whitespace runs are collapsed. No words are changed, so
a quote found in the .txt is word for word on the page. Standard library only.
"""

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HTML_DIR = ROOT / "data/raw/sources/html"
OUT_DIR = ROOT / "data/raw/sources"

SKIP = {"script", "style", "noscript", "svg", "nav", "footer", "header"}
BLOCK = {"p", "br", "div", "h1", "h2", "h3", "h4", "h5", "li", "tr", "section", "article", "figcaption"}


class _Text(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.skip = [], 0

    def handle_starttag(self, tag, attrs):
        if tag in SKIP:
            self.skip += 1
        if tag in BLOCK:
            self.out.append("\n")

    def handle_endtag(self, tag):
        if tag in SKIP and self.skip:
            self.skip -= 1
        if tag in BLOCK:
            self.out.append("\n")

    def handle_data(self, data):
        if not self.skip:
            self.out.append(data)


def to_text(raw: str) -> str:
    p = _Text()
    p.feed(raw)
    t = "".join(p.out)
    t = re.sub(r"[ \t\r\f\v\xa0]+", " ", t)
    t = re.sub(r"\n\s*\n+", "\n\n", t)
    return t.strip() + "\n"


def sources():
    """file stem -> (final URL, date saved), from SOURCES.txt."""
    urls = {}
    for line in (HTML_DIR / "SOURCES.txt").read_text(encoding="utf-8").splitlines():
        parts = [p.strip() for p in line.split("|")]
        if len(parts) >= 3 and parts[0].endswith(".html"):
            saved = parts[4] if len(parts) >= 5 and re.fullmatch(r"\d{4}-\d{2}-\d{2}", parts[4]) else "2026-11-14"
            urls[parts[0][:-5]] = (parts[2], saved)
    return urls


def main():
    urls = sources()
    for f in sorted(HTML_DIR.glob("*.html")):
        if f.stem not in urls:
            sys.exit(f"{f.name}: no URL in SOURCES.txt")
        url, saved = urls[f.stem]
        head = f"Saved {saved} from {url}\n(text of {f.relative_to(ROOT)}, made by data/build/html_to_text.py)\n\n"
        out = OUT_DIR / f"{f.stem}.txt"
        out.write_text(head + to_text(f.read_text(encoding="utf-8", errors="replace")), encoding="utf-8")
        print(f"wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
