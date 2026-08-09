from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / "dist"
ERRORS: list[str] = []


class RefParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        for key in ("src", "href", "poster"):
            value = data.get(key)
            if not value or value.startswith(("#", "http://", "https://", "mailto:", "tel:", "data:")):
                continue
            self.refs.append(value.split("?", 1)[0].split("#", 1)[0])


def check(condition: bool, message: str) -> None:
    if not condition:
        ERRORS.append(message)


check(DIST.is_dir(), "dist/ does not exist; run build_dist.py first")
if DIST.is_dir():
    check(not (DIST / "assets-source").exists(), "raw assets-source directory leaked into dist/")
    check((DIST / "index.html").is_file(), "dist/index.html is missing")
    check((DIST / "404.html").is_file(), "dist/404.html is missing")
    check((DIST / "_headers").is_file(), "dist/_headers is missing")
    check((DIST / "robots.txt").is_file(), "dist/robots.txt is missing")
    check((DIST / "media" / "brand" / "vsk-logo.webp").is_file(), "dist optimized logo is missing")
    check((DIST / "downloads" / "vsk-electromech-corporate-profile.pdf").is_file(), "corporate profile download is missing")
    check((DIST / "downloads" / "vsk-machine-tool-catalog.pdf").is_file(), "machine-tool catalog download is missing")

    forbidden_suffixes = {".mov", ".jpg", ".jpeg", ".heic", ".tiff", ".bmp"}
    leaked = [str(p.relative_to(DIST)) for p in DIST.rglob("*") if p.is_file() and p.suffix.lower() in forbidden_suffixes]
    check(not leaked, f"unoptimized/raw media formats found in dist/: {leaked[:10]}")

    for page_name in ("index.html", "404.html"):
        page = DIST / page_name
        if not page.is_file():
            continue
        text = page.read_text(encoding="utf-8")
        check("assets-source/" not in text, f"{page_name}: raw archive path remains")
        check("file://" not in text, f"{page_name}: local file URL remains")
        parser = RefParser()
        parser.feed(text)
        for ref in parser.refs:
            check((DIST / ref).exists(), f"{page_name}: missing production resource {ref}")

if ERRORS:
    print("VSK deployment package validation failed:\n")
    for error in ERRORS:
        print(f"- {error}")
    sys.exit(1)

size = sum(p.stat().st_size for p in DIST.rglob("*") if p.is_file())
print("VSK deployment package validation passed.")
print("- Raw source archive is excluded")
print("- Production references resolve")
print("- Customer-facing PDF downloads are packaged")
print("- Raw camera formats are excluded")
print(f"- Packaged size: {size / 1024 / 1024:.2f} MB")
