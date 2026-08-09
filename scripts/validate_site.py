from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ERRORS: list[str] = []


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []
        self.local_refs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if data.get("id"):
            self.ids.append(data["id"] or "")
        for key in ("src", "href", "poster"):
            value = data.get(key)
            if not value:
                continue
            if value.startswith(("#", "http://", "https://", "mailto:", "tel:", "data:")):
                continue
            self.local_refs.append(value.split("?", 1)[0].split("#", 1)[0])


def check(condition: bool, message: str) -> None:
    if not condition:
        ERRORS.append(message)


def validate_html(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    parser = PageParser()
    parser.feed(text)

    duplicates = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
    check(not duplicates, f"{path.name}: duplicate IDs: {', '.join(duplicates)}")

    for ref in parser.local_refs:
        check((ROOT / ref).exists(), f"{path.name}: missing local resource: {ref}")

    raw_media = re.findall(r"assets-source/[^\"'<>]+\.(?:jpe?g|png|webp|avif|mov|mp4|webm)", text, flags=re.I)
    check(not raw_media, f"{path.name}: raw source media is still exposed: {raw_media[:5]}")


for page in (ROOT / "index.html", ROOT / "404.html"):
    validate_html(page)

# Dynamic markup in the JavaScript files can reference local production media.
for script_name in ("script.js", "motion.js"):
    path = ROOT / script_name
    text = path.read_text(encoding="utf-8")
    raw_media = re.findall(r"assets-source/[^\"'`<>]+\.(?:jpe?g|png|webp|avif|mov|mp4|webm)", text, flags=re.I)
    check(not raw_media, f"{script_name}: raw source media reference found: {raw_media[:5]}")
    media_refs = set(re.findall(r"(?:media/)[A-Za-z0-9_./-]+\.(?:webp|avif|mp4|webm)", text, flags=re.I))
    for ref in sorted(media_refs):
        check((ROOT / ref).exists(), f"{script_name}: missing generated media: {ref}")

# Ensure all design layers are part of normal HTML loading, not JS-only styling.
index = (ROOT / "index.html").read_text(encoding="utf-8")
for css in ("styles.css", "styles-v2.css", "styles-v3.css", "styles-v4.css"):
    check(f'href="{css}"' in index, f"index.html: missing direct stylesheet link for {css}")
for script in ("script.js", "motion.js"):
    check(f'src="{script}"' in index, f"index.html: missing script {script}")

# Minimum security baseline for static deployment.
headers = (ROOT / "_headers").read_text(encoding="utf-8")
for directive in (
    "Content-Security-Policy:",
    "X-Content-Type-Options: nosniff",
    "X-Frame-Options: DENY",
    "Referrer-Policy:",
    "Permissions-Policy:",
    "Strict-Transport-Security:",
    "object-src 'none'",
    "frame-ancestors 'none'",
):
    check(directive in headers, f"_headers: missing security directive: {directive}")
check("/media/*" in headers, "_headers: missing cache policy for generated media")

# Production media should exist and never replace the source archive.
check((ROOT / "assets-source").is_dir(), "assets-source archive is missing")
check((ROOT / "media" / "media-manifest.json").is_file(), "media manifest is missing")
check((ROOT / "media" / "brand" / "vsk-logo.webp").is_file(), "optimized VSK logo is missing")

if ERRORS:
    print("VSK site validation failed:\n")
    for error in ERRORS:
        print(f"- {error}")
    sys.exit(1)

print("VSK site validation passed.")
print("- Local resources resolve")
print("- No raw image/video references remain in web-facing code")
print("- Advanced CSS loads directly")
print("- Security header baseline is present")
