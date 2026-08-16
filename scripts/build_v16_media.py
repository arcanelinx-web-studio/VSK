from __future__ import annotations

import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "PHOTOS"
OUT = ROOT / "media" / "v16"
IMAGE_DIR = OUT / "images"
THUMB_DIR = OUT / "thumbs"
VIDEO_DIR = OUT / "videos"
POSTER_DIR = OUT / "posters"

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff", ".heic", ".heif"}
VIDEO_EXTS = {".mp4", ".mov", ".m4v", ".avi"}
DOCUMENT_EXTS = {".pdf"}


def slug(value: str) -> str:
    value = value.lower().strip().replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "media"


def titlecase(value: str) -> str:
    cleaned = re.sub(r"[_-]+", " ", value).strip()
    return re.sub(r"\s+", " ", cleaned).title()


def rel_url(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def run(cmd: list[str]) -> bool:
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except Exception:
        return False


def save_web_image(source: Path, web_path: Path, thumb_path: Path) -> tuple[int, int] | None:
    converted: Path | None = None
    try:
        image_source = source
        if source.suffix.lower() in {".heic", ".heif"}:
            tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
            tmp.close()
            converted = Path(tmp.name)
            if not run(["heif-convert", str(source), str(converted)]):
                return None
            image_source = converted

        with Image.open(image_source) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            width, height = im.size

            web = im.copy()
            web.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
            web_path.parent.mkdir(parents=True, exist_ok=True)
            web.save(web_path, "WEBP", quality=82, method=6)

            thumb = im.copy()
            thumb.thumbnail((720, 720), Image.Resampling.LANCZOS)
            thumb_path.parent.mkdir(parents=True, exist_ok=True)
            thumb.save(thumb_path, "WEBP", quality=74, method=6)
            return width, height
    except Exception:
        return None
    finally:
        if converted and converted.exists():
            converted.unlink(missing_ok=True)


def save_pdf_preview(source: Path, web_path: Path, thumb_path: Path) -> tuple[int, int] | None:
    with tempfile.TemporaryDirectory() as tmpdir:
        prefix = Path(tmpdir) / "page"
        if not run(["pdftoppm", "-f", "1", "-singlefile", "-png", "-r", "150", str(source), str(prefix)]):
            return None
        rendered = prefix.with_suffix(".png")
        if not rendered.exists():
            return None
        return save_web_image(rendered, web_path, thumb_path)


def save_web_video(source: Path, video_path: Path, poster_path: Path) -> bool:
    video_path.parent.mkdir(parents=True, exist_ok=True)
    poster_path.parent.mkdir(parents=True, exist_ok=True)

    if not run([
        "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=codec_name",
        "-of", "default=nw=1:nk=1", str(source)
    ]):
        return False

    if not run([
        "ffmpeg", "-y", "-i", str(source),
        "-vf", "scale='min(1280,iw)':-2:force_original_aspect_ratio=decrease",
        "-c:v", "libx264", "-preset", "medium", "-crf", "27", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", "-an", str(video_path)
    ]):
        return False

    poster_jpg = poster_path.with_suffix(".jpg")
    poster_ok = run([
        "ffmpeg", "-y", "-ss", "0.8", "-i", str(source), "-frames:v", "1",
        "-vf", "scale='min(1280,iw)':-2:force_original_aspect_ratio=decrease", str(poster_jpg)
    ])
    if poster_ok:
        try:
            with Image.open(poster_jpg) as im:
                im = ImageOps.exif_transpose(im).convert("RGB")
                im.save(poster_path, "WEBP", quality=78, method=6)
        except Exception:
            poster_ok = False
        finally:
            poster_jpg.unlink(missing_ok=True)
    return True


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit("PHOTOS directory is missing")

    if OUT.exists():
        shutil.rmtree(OUT)
    for directory in (IMAGE_DIR, THUMB_DIR, VIDEO_DIR, POSTER_DIR):
        directory.mkdir(parents=True, exist_ok=True)

    groups: dict[str, dict] = {}
    totals = {"files": 0, "images": 0, "videos": 0, "documents": 0, "source_only": 0}

    for source in sorted(SOURCE.rglob("*"), key=lambda p: p.as_posix().lower()):
        if not source.is_file() or source.name == ".gitkeep":
            continue

        rel = source.relative_to(SOURCE)
        parts = rel.parts
        category = parts[0] if len(parts) > 1 else "Other"
        project_parts = parts[:-1]
        project = project_parts[-1] if project_parts else category
        group_key = slug("--".join(project_parts or (category,)))
        group = groups.setdefault(group_key, {
            "id": group_key,
            "title": titlecase(project),
            "category": titlecase(category),
            "project": project,
            "path": "/".join(project_parts),
            "items": [],
        })

        ext = source.suffix.lower()
        item_base = slug(source.stem)
        relative_group = Path(*[slug(p) for p in project_parts]) if project_parts else Path(slug(category))
        item = {
            "name": source.name,
            "source": rel_url(source),
            "extension": ext.lstrip("."),
            "caption": titlecase(source.stem),
        }
        totals["files"] += 1

        if ext in IMAGE_EXTS:
            web_path = IMAGE_DIR / relative_group / f"{item_base}.webp"
            thumb_path = THUMB_DIR / relative_group / f"{item_base}.webp"
            dims = save_web_image(source, web_path, thumb_path)
            item["kind"] = item["type"] = "image"
            if dims:
                item.update({"web": rel_url(web_path), "src": rel_url(web_path), "thumb": rel_url(thumb_path), "width": dims[0], "height": dims[1]})
                totals["images"] += 1
            else:
                item.update({"src": rel_url(source), "sourceOnly": True})
                totals["source_only"] += 1

        elif ext in VIDEO_EXTS:
            video_path = VIDEO_DIR / relative_group / f"{item_base}.mp4"
            poster_path = POSTER_DIR / relative_group / f"{item_base}.webp"
            item["kind"] = item["type"] = "video"
            if save_web_video(source, video_path, poster_path):
                poster = rel_url(poster_path) if poster_path.exists() else None
                item.update({"web": rel_url(video_path), "src": rel_url(video_path), "src_mp4": rel_url(video_path), "poster": poster, "thumb": poster})
                totals["videos"] += 1
            else:
                item.update({"src": rel_url(source), "sourceOnly": True})
                totals["source_only"] += 1

        elif ext in DOCUMENT_EXTS:
            web_path = IMAGE_DIR / relative_group / f"{item_base}-document.webp"
            thumb_path = THUMB_DIR / relative_group / f"{item_base}-document.webp"
            dims = save_pdf_preview(source, web_path, thumb_path)
            item["kind"] = "document"
            item["type"] = "image"
            item["document"] = rel_url(source)
            if dims:
                item.update({"src": rel_url(web_path), "thumb": rel_url(thumb_path), "width": dims[0], "height": dims[1], "caption": f"{titlecase(source.stem)} · technical document"})
                totals["documents"] += 1
                totals["images"] += 1
            else:
                item.update({"type": "source", "src": rel_url(source), "sourceOnly": True})
                totals["documents"] += 1
                totals["source_only"] += 1
        else:
            item.update({"kind": "source", "type": "source", "src": rel_url(source), "sourceOnly": True})
            totals["source_only"] += 1

        group["items"].append(item)

    manifest = {
        "version": 16,
        "source": "PHOTOS",
        "summary": {
            **totals,
            "groups": len(groups),
            "categories": len({g["category"] for g in groups.values()}),
        },
        "groups": list(groups.values()),
    }
    payload = json.dumps(manifest, indent=2, ensure_ascii=False)
    (OUT / "manifest.json").write_text(payload, encoding="utf-8")
    (ROOT / "media" / "archive-manifest.json").write_text(payload, encoding="utf-8")
    print(json.dumps(manifest["summary"], indent=2))


if __name__ == "__main__":
    main()
