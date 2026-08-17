from pathlib import Path

PAGES = [Path('index.html'), Path('projects.html'), Path('machines.html'), Path('gallery.html')]
LINK = '<link href="v16-original-recovery.css" rel="stylesheet"/>'

for page in PAGES:
    text = page.read_text(encoding='utf-8')
    if LINK not in text:
        anchor = '<link href="v16-light-restore.css" rel="stylesheet"/>'
        if anchor not in text:
            raise SystemExit(f'{page}: expected light-restore stylesheet link not found')
        text = text.replace(anchor, anchor + '\n' + LINK, 1)
    page.write_text(text, encoding='utf-8')

# Keep the exact requested hero structure, but use a real VSK project close-up
# in the small lower-left card rather than a second CAD-style detail.
index = Path('index.html')
text = index.read_text(encoding='utf-8')
old = 'src="media/cases/slotting-detail.webp"'
new = 'src="media/v16/images/spm-machines-plc-hmi-and-servo-controlled/4-servo-seal-slotting-machine/slotting-mc-close.webp"'
if old in text:
    text = text.replace(old, new, 1)

# Ensure the requested headline remains exact.
if '<h1><span>Engineered for</span><em>Precision</em></h1>' not in text:
    raise SystemExit('index.html: Engineered for Precision headline missing')

index.write_text(text, encoding='utf-8')

# Guardrails: do not regress the review indexing lock or remove core project/archive hooks.
for page in PAGES:
    text = page.read_text(encoding='utf-8')
    if 'noindex,nofollow' not in text:
        raise SystemExit(f'{page}: review indexing lock missing')

required = {
    'index.html': ['data-home-projects', 'engineering-depth', 'data-process-track', 'site-footer'],
    'projects.html': ['data-project-page-grid', 'data-additional-projects', 'site-footer'],
    'machines.html': ['data-archive-index', 'data-archive-preview', 'site-footer'],
    'gallery.html': ['data-gallery', 'site-footer'],
}
for name, hooks in required.items():
    text = Path(name).read_text(encoding='utf-8')
    for hook in hooks:
        if hook not in text:
            raise SystemExit(f'{name}: required hook {hook!r} missing')

print('V16 original recovery linked and verified.')
