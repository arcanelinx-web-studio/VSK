from __future__ import annotations

import json
import subprocess
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "media"
OUT.mkdir(exist_ok=True)

IMAGE_TARGETS = [
    # role, source, output stem, max width, quality
    ("brand", "assets-source/VSK LOGO.png", "brand/vsk-logo", 512, 92),
    ("hero", "assets-source/4 servo Seal  slotting machine/SLOTTING MC 3.JPG", "hero/slotting-main", 1600, 84),
    ("hero", "assets-source/rod boring machine/Picture_088[1].JPG", "hero/rod-boring", 900, 82),
    ("hero", "assets-source/Air leak testing machine/Machine Front view.JPG", "hero/air-leak", 900, 82),
    ("solution", "assets-source/VERTICAL TURNING CNC MACHINE/1520917541365.jpg", "solutions/vertical-turning", 1200, 84),
    ("solution", "assets-source/Retrofitted Machine/Jig Grinding machine/EKNG2128.JPG", "solutions/jig-grinding", 1400, 82),
    ("solution", "assets-source/rod boring machine/Picture_089[1].JPG", "solutions/precision", 1000, 82),
    ("project", "assets-source/4 servo Seal  slotting machine/SLOTTING MC 1.JPG", "projects/slotting", 1200, 82),
    ("project", "assets-source/Air leak testing machine/Machine Front view.JPG", "projects/air-leak", 1200, 82),
    ("project", "assets-source/rod boring machine/Picture_088[1].JPG", "projects/rod-boring", 1200, 82),
    ("project", "assets-source/Z CUT MACHINE/BEXX0731.JPG", "projects/z-cut", 1400, 82),
    ("project", "assets-source/VERTICAL TURNING CNC MACHINE/1520917541365.jpg", "projects/vertical-turning", 1200, 82),
    ("project", "assets-source/U DRILL MACHINE/1520917550194.jpg", "projects/u-drill", 1200, 82),
    ("project", "assets-source/paint aggitating machine/paint aggitating unit.jpg", "projects/paint-agitating", 1000, 82),
    ("retrofit", "assets-source/Retrofitted Machine/kelingberg od grinding machine/IMG_0007.JPG", "retrofit/kellenberg", 1500, 82),
    ("retrofit", "assets-source/Retrofitted Machine/Jig Grinding machine/FHPF9264.JPG", "retrofit/jig-grinding", 1500, 82),
    ("case", "assets-source/4 servo Seal  slotting machine/SLOTTING MC 3.JPG", "cases/slotting-main", 1400, 84),
    ("case", "assets-source/4 servo Seal  slotting machine/SLOTTING MC CLOSE.JPG", "cases/slotting-detail", 1000, 82),
    ("case", "assets-source/Retrofitted Machine/Jig Grinding machine/EKNG2128.JPG", "cases/jig-main", 1400, 82),
    ("case", "assets-source/Retrofitted Machine/Jig Grinding machine/FHPF9264.JPG", "cases/jig-detail", 1000, 82),
    ("case", "assets-source/Air leak testing machine/Machine Front view.JPG", "cases/air-leak-main", 1200, 82),
    ("case", "assets-source/Air leak testing machine/Fixture Section View.JPG", "cases/air-leak-detail", 1000, 82),
    ("motion", "assets-source/ELECTRIC OVEN/IMG_0021.JPG", "motion/electric-oven", 1400, 82),
    ("motion", "assets-source/Retrofitted Machine/kelingberg od grinding machine/IMG_0017.JPG", "motion/kellenberg-still", 1400, 82),
]

VIDEO_TARGETS = [
    ("assets-source/ELECTRIC OVEN/IMG_0028.MOV", "motion/electric-oven-loop"),
    ("assets-source/Retrofitted Machine/kelingberg od grinding machine/IMG_0014.MOV", "motion/kellenberg-loop"),
]


def human(n: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{n:.0f} {unit}" if unit == "B" else f"{n:.1f} {unit}"
        n /= 1024
    return str(n)


def save_webp(source: Path, rel_stem: str, max_width: int, quality: int) -> dict:
    target = OUT / f"{rel_stem}.webp"
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as raw:
        img = ImageOps.exif_transpose(raw)
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
        if img.width > max_width:
            height = round(img.height * max_width / img.width)
            img = img.resize((max_width, height), Image.Resampling.LANCZOS)
        kwargs = {"format": "WEBP", "quality": quality, "method": 6}
        if img.mode == "RGBA":
            kwargs["lossless"] = True
        img.save(target, **kwargs)
        dims = [img.width, img.height]
    return {
        "source": str(source.relative_to(ROOT)),
        "output": str(target.relative_to(ROOT)),
        "source_bytes": source.stat().st_size,
        "output_bytes": target.stat().st_size,
        "dimensions": dims,
    }


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, cwd=ROOT, check=True)


def transcode_video(source: Path, rel_stem: str) -> list[dict]:
    base = OUT / rel_stem
    base.parent.mkdir(parents=True, exist_ok=True)
    mp4 = base.with_suffix(".mp4")
    webm = base.with_suffix(".webm")
    poster = Path(str(base) + "-poster.webp")

    # Short, muted loops are intentionally capped at 6 seconds and 960px wide.
    common_vf = "scale='min(960,iw)':-2:force_original_aspect_ratio=decrease,fps=24"
    run([
        "ffmpeg", "-y", "-i", str(source), "-t", "6", "-an", "-vf", common_vf,
        "-c:v", "libx264", "-preset", "medium", "-crf", "28", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", str(mp4)
    ])
    run([
        "ffmpeg", "-y", "-i", str(source), "-t", "6", "-an", "-vf", common_vf,
        "-c:v", "libvpx-vp9", "-crf", "38", "-b:v", "0", "-row-mt", "1", str(webm)
    ])
    run([
        "ffmpeg", "-y", "-ss", "1", "-i", str(source), "-frames:v", "1",
        "-vf", "scale='min(1200,iw)':-2:force_original_aspect_ratio=decrease",
        "-c:v", "libwebp", "-quality", "82", str(poster)
    ])
    return [
        {"source": str(source.relative_to(ROOT)), "output": str(mp4.relative_to(ROOT)), "source_bytes": source.stat().st_size, "output_bytes": mp4.stat().st_size},
        {"source": str(source.relative_to(ROOT)), "output": str(webm.relative_to(ROOT)), "source_bytes": source.stat().st_size, "output_bytes": webm.stat().st_size},
        {"source": str(source.relative_to(ROOT)), "output": str(poster.relative_to(ROOT)), "source_bytes": source.stat().st_size, "output_bytes": poster.stat().st_size},
    ]


def main() -> None:
    manifest: dict[str, list] = {"images": [], "videos": []}
    for role, source_rel, out_stem, width, quality in IMAGE_TARGETS:
        source = ROOT / source_rel
        if not source.exists():
            raise FileNotFoundError(source)
        item = save_webp(source, out_stem, width, quality)
        item["role"] = role
        manifest["images"].append(item)

    for source_rel, out_stem in VIDEO_TARGETS:
        source = ROOT / source_rel
        if not source.exists():
            raise FileNotFoundError(source)
        manifest["videos"].extend(transcode_video(source, out_stem))

    manifest["summary"] = {
        "image_source_bytes": sum(x["source_bytes"] for x in manifest["images"]),
        "image_output_bytes": sum(x["output_bytes"] for x in manifest["images"]),
        "video_output_bytes": sum(x["output_bytes"] for x in manifest["videos"]),
    }
    (OUT / "media-manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    summary = manifest["summary"]
    readme = f"""# VSK production media\n\nGenerated automatically from `assets-source/`. Do not edit generated files manually.\n\n- Optimized image inputs: {human(summary['image_source_bytes'])}\n- Optimized WebP outputs: {human(summary['image_output_bytes'])}\n- Generated video/poster outputs: {human(summary['video_output_bytes'])}\n\nThe original files remain untouched in `assets-source/`. Re-run the GitHub Actions media workflow after changing source media or the media build script.\n"""
    (OUT / "README.md").write_text(readme, encoding="utf-8")


if __name__ == "__main__":
    main()
