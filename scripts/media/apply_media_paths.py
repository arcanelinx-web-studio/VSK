from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def replace_all(path: Path, replacements: list[tuple[str, str]]) -> None:
    text = path.read_text(encoding="utf-8")
    original = text
    for old, new in replacements:
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding="utf-8")


# Static homepage imagery. Repeated hero/project references intentionally share
# one compact derivative where the resolution is already sufficient.
replace_all(ROOT / "index.html", [
    ("assets-source/VSK LOGO.png", "media/brand/vsk-logo.webp"),
    ("assets-source/4 servo Seal  slotting machine/SLOTTING MC 3.JPG", "media/hero/slotting-main.webp"),
    ("assets-source/rod boring machine/Picture_088[1].JPG", "media/hero/rod-boring.webp"),
    ("assets-source/Air leak testing machine/Machine Front view.JPG", "media/hero/air-leak.webp"),
    ("assets-source/VERTICAL TURNING CNC MACHINE/1520917541365.jpg", "media/solutions/vertical-turning.webp"),
    ("assets-source/Retrofitted Machine/Jig Grinding machine/EKNG2128.JPG", "media/solutions/jig-grinding.webp"),
    ("assets-source/rod boring machine/Picture_089[1].JPG", "media/solutions/precision.webp"),
    ("assets-source/4 servo Seal  slotting machine/SLOTTING MC 1.JPG", "media/projects/slotting.webp"),
    ("assets-source/Z CUT MACHINE/BEXX0731.JPG", "media/projects/z-cut.webp"),
    ("assets-source/Retrofitted Machine/kelingberg od grinding machine/IMG_0007.JPG", "media/retrofit/kellenberg.webp"),
    ("assets-source/Retrofitted Machine/Jig Grinding machine/FHPF9264.JPG", "media/retrofit/jig-grinding.webp"),
])

replace_all(ROOT / "404.html", [
    ("assets-source/VSK LOGO.png", "media/brand/vsk-logo.webp"),
])

# Dynamically inserted portfolio and case-study markup in script.js.
replace_all(ROOT / "script.js", [
    ("assets-source/VSK LOGO.png", "media/brand/vsk-logo.webp"),
    ("assets-source/VERTICAL TURNING CNC MACHINE/1520917541365.jpg", "media/projects/vertical-turning.webp"),
    ("assets-source/U DRILL MACHINE/1520917550194.jpg", "media/projects/u-drill.webp"),
    ("assets-source/paint aggitating machine/paint aggitating unit.jpg", "media/projects/paint-agitating.webp"),
    ("assets-source/4 servo Seal  slotting machine/SLOTTING MC 3.JPG", "media/cases/slotting-main.webp"),
    ("assets-source/4 servo Seal  slotting machine/SLOTTING MC CLOSE.JPG", "media/cases/slotting-detail.webp"),
    ("assets-source/Retrofitted Machine/Jig Grinding machine/EKNG2128.JPG", "media/cases/jig-main.webp"),
    ("assets-source/Retrofitted Machine/Jig Grinding machine/FHPF9264.JPG", "media/cases/jig-detail.webp"),
    ("assets-source/Air leak testing machine/Machine Front view.JPG", "media/cases/air-leak-main.webp"),
    ("assets-source/Air leak testing machine/Fixture Section View.JPG", "media/cases/air-leak-detail.webp"),
])

# Advanced styling must not depend on JavaScript. Linking each layer in the
# document head prevents a flash of the base design and preserves the premium
# layout even when JavaScript is slow or disabled.
index = ROOT / "index.html"
text = index.read_text(encoding="utf-8")
base_css = '<link rel="stylesheet" href="styles.css" />'
advanced_css = (
    '<link rel="stylesheet" href="styles.css" />\n'
    '  <link rel="stylesheet" href="styles-v2.css" />\n'
    '  <link rel="stylesheet" href="styles-v3.css" />\n'
    '  <link rel="stylesheet" href="styles-v4.css" />\n'
    '  <link rel="icon" href="media/brand/vsk-logo.webp" type="image/webp" />'
)
if 'href="styles-v4.css"' not in text:
    text = text.replace(base_css, advanced_css)
if 'src="motion.js"' not in text:
    text = text.replace('<script src="script.js" defer></script>', '<script src="script.js" defer></script>\n  <script src="motion.js" defer></script>')
index.write_text(text, encoding="utf-8")

headers = ROOT / "_headers"
header_text = headers.read_text(encoding="utf-8")
media_rule = "\n/media/*\n  Cache-Control: public, max-age=604800, stale-while-revalidate=86400\n"
if "/media/*" not in header_text:
    headers.write_text(header_text.rstrip() + "\n" + media_rule, encoding="utf-8")
