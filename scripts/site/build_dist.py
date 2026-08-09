from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / "dist"

FILES = [
    "index.html",
    "404.html",
    "styles.css",
    "styles-v2.css",
    "styles-v3.css",
    "styles-v4.css",
    "styles-v5.css",
    "script.js",
    "motion.js",
    "ux-v2.js",
    "_headers",
    "robots.txt",
]

DOWNLOADS = {
    "assets-source/VSK_ElectroMech_Corporate_Profile.pdf": "downloads/vsk-electromech-corporate-profile.pdf",
    "assets-source/VSK_Electro-Mech_Solutions_Professional_Catalog.pdf": "downloads/vsk-machine-tool-catalog.pdf",
}


def copy_file(source_rel: str, target_rel: str | None = None) -> None:
    source = ROOT / source_rel
    if not source.is_file():
        raise FileNotFoundError(source)
    target = DIST / (target_rel or source_rel)
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)


if DIST.exists():
    shutil.rmtree(DIST)
DIST.mkdir()

for rel in FILES:
    copy_file(rel)

media = ROOT / "media"
if not media.is_dir():
    raise FileNotFoundError(media)
shutil.copytree(media, DIST / "media")

for source_rel, target_rel in DOWNLOADS.items():
    copy_file(source_rel, target_rel)

index = DIST / "index.html"
text = index.read_text(encoding="utf-8")
text = text.replace(
    "assets-source/VSK_ElectroMech_Corporate_Profile.pdf",
    "downloads/vsk-electromech-corporate-profile.pdf",
)
text = text.replace(
    "assets-source/VSK_Electro-Mech_Solutions_Professional_Catalog.pdf",
    "downloads/vsk-machine-tool-catalog.pdf",
)
index.write_text(text, encoding="utf-8")

# Deployment safety: production output must never expose the raw source archive.
for path in DIST.rglob("*"):
    if path.is_file() and path.suffix.lower() in {".html", ".css", ".js", ".txt"}:
        contents = path.read_text(encoding="utf-8", errors="ignore")
        if "assets-source/" in contents:
            raise RuntimeError(f"Raw archive reference leaked into production build: {path.relative_to(DIST)}")

size = sum(path.stat().st_size for path in DIST.rglob("*") if path.is_file())
count = sum(1 for path in DIST.rglob("*") if path.is_file())
print(f"Built production site: {count} files, {size / 1024 / 1024:.2f} MB")
print("Output directory: dist/")
print("Raw assets-source archive: excluded")
