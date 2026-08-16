from __future__ import annotations

import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageOps

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except Exception:
    pass

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


def open_rgb(source: Path) -> Image.Image | None:
    try:
        with Image.open(source) as im:
            return ImageOps.exif_transpose(im).convert("RGB")
    except Exception:
        pass

    if source.suffix.lower() in {".heic", ".heif"}:
        with tempfile.TemporaryDirectory() as tmpdir:
            converted = Path(tmpdir) / "converted.jpg"
            if run(["heif-convert", str(source), str(converted)]):
                try:
                    with Image.open(converted) as im:
                        return ImageOps.exif_transpose(im).convert("RGB")
                except Exception:
                    pass

    with tempfile.TemporaryDirectory() as tmpdir:
        converted = Path(tmpdir) / "frame.png"
        if run(["ffmpeg", "-y", "-i", str(source), "-frames:v", "1", str(converted)]):
            try:
                with Image.open(converted) as im:
                    return ImageOps.exif_transpose(im).convert("RGB")
            except Exception:
                pass
    return None


def save_web_image(source: Path, web_path: Path, thumb_path: Path) -> tuple[int, int] | None:
    im = open_rgb(source)
    if im is None:
        return None
    width, height = im.size

    web = im.copy()
    web.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
    web_path.parent.mkdir(parents=True, exist_ok=True)
    web.save(web_path, "WEBP", quality=82, method=5)

    thumb = im.copy()
    thumb.thumbnail((760, 760), Image.Resampling.LANCZOS)
    thumb_path.parent.mkdir(parents=True, exist_ok=True)
    thumb.save(thumb_path, "WEBP", quality=76, method=4)
    return width, height


def save_pdf_preview(source: Path, web_path: Path, thumb_path: Path) -> tuple[int, int] | None:
    with tempfile.TemporaryDirectory() as tmpdir:
        prefix = Path(tmpdir) / "page"
        if not run(["pdftoppm", "-f", "1", "-singlefile", "-png", "-r", "150", str(source), str(prefix)]):
            return None
        rendered = prefix.with_suffix(".png")
        if not rendered.exists():
            return None
        return save_web_image(rendered, web_path, thumb_path)


def save_poster(video_path: Path, poster_path: Path) -> bool:
    poster_path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmpdir:
        jpg = Path(tmpdir) / "poster.jpg"
        ok = run([
            "ffmpeg", "-y", "-ss", "0.15", "-i", str(video_path), "-frames:v", "1",
            "-vf", "scale='min(1280,iw)':-2:force_original_aspect_ratio=decrease", str(jpg)
        ])
        if not ok:
            ok = run([
                "ffmpeg", "-y", "-i", str(video_path), "-frames:v", "1",
                "-vf", "scale='min(1280,iw)':-2:force_original_aspect_ratio=decrease", str(jpg)
            ])
        if not ok or not jpg.exists():
            return False
        try:
            with Image.open(jpg) as im:
                ImageOps.exif_transpose(im).convert("RGB").save(poster_path, "WEBP", quality=80, method=4)
            return True
        except Exception:
            return False


def save_web_video(source: Path, video_path: Path, poster_path: Path) -> bool:
    video_path.parent.mkdir(parents=True, exist_ok=True)
    if not run([
        "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=codec_name",
        "-of", "default=nw=1:nk=1", str(source)
    ]):
        return False

    if not run([
        "ffmpeg", "-y", "-i", str(source),
        "-vf", "scale='min(1280,iw)':-2:force_original_aspect_ratio=decrease",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "28", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", "-an", str(video_path)
    ]):
        return False
    save_poster(video_path, poster_path)
    return True


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit("PHOTOS directory is missing")

    if OUT.exists():
        shutil.rmtree(OUT)
    for directory in (IMAGE_DIR, THUMB_DIR, VIDEO_DIR, POSTER_DIR):
        directory.mkdir(parents=True, exist_ok=True)

    groups: dict[str, dict] = {}
    totals = {
        "files": 0, "images": 0, "videos": 0, "documents": 0,
        "source_only": 0, "failed_images": 0, "failed_videos": 0, "unsupported": 0
    }

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
                item.update({
                    "web": rel_url(web_path), "src": rel_url(web_path), "thumb": rel_url(thumb_path),
                    "width": dims[0], "height": dims[1], "displayable": True
                })
                totals["images"] += 1
            else:
                item.update({"src": rel_url(source), "sourceOnly": True, "displayable": False})
                totals["source_only"] += 1
                totals["failed_images"] += 1

        elif ext in VIDEO_EXTS:
            video_path = VIDEO_DIR / relative_group / f"{item_base}.mp4"
            poster_path = POSTER_DIR / relative_group / f"{item_base}.webp"
            item["kind"] = item["type"] = "video"
            if save_web_video(source, video_path, poster_path):
                poster = rel_url(poster_path) if poster_path.exists() else None
                item.update({
                    "web": rel_url(video_path), "src": rel_url(video_path), "src_mp4": rel_url(video_path),
                    "poster": poster, "thumb": poster, "displayable": True
                })
                totals["videos"] += 1
            else:
                item.update({"src": rel_url(source), "sourceOnly": True, "displayable": False})
                totals["source_only"] += 1
                totals["failed_videos"] += 1

        elif ext in DOCUMENT_EXTS:
            web_path = IMAGE_DIR / relative_group / f"{item_base}-document.webp"
            thumb_path = THUMB_DIR / relative_group / f"{item_base}-document.webp"
            dims = save_pdf_preview(source, web_path, thumb_path)
            item["kind"] = "document"
            item["type"] = "image"
            item["document"] = rel_url(source)
            totals["documents"] += 1
            if dims:
                item.update({
                    "src": rel_url(web_path), "thumb": rel_url(thumb_path), "width": dims[0], "height": dims[1],
                    "caption": f"{titlecase(source.stem)} · technical document", "displayable": True
                })
                totals["images"] += 1
            else:
                item.update({"type": "source", "src": rel_url(source), "sourceOnly": True, "displayable": False})
                totals["source_only"] += 1
        else:
            item.update({"kind": "source", "type": "source", "src": rel_url(source), "sourceOnly": True, "displayable": False})
            totals["source_only"] += 1
            totals["unsupported"] += 1

        group["items"].append(item)

    display_groups = [g for g in groups.values() if any(i.get("displayable") for i in g["items"])]
    manifest = {
        "version": 16,
        "source": "PHOTOS",
        "summary": {
            **totals,
            "groups": len(display_groups),
            "source_groups": len(groups),
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
