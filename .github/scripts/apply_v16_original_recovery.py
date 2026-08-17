from pathlib import Path

PAGES = [Path('index.html'), Path('projects.html'), Path('machines.html'), Path('gallery.html')]
LINK = '<link href="v16-original-recovery.css" rel="stylesheet"/>'
BALANCE_LINK = '<link href="v16-desktop-balance.css" rel="stylesheet"/>'

if not Path('v16-desktop-balance.css').exists():
    raise SystemExit('v16-desktop-balance.css is missing')

for page in PAGES:
    text = page.read_text(encoding='utf-8')
    if LINK not in text:
        anchor = '<link href="v16-light-restore.css" rel="stylesheet"/>'
        if anchor not in text:
            raise SystemExit(f'{page}: expected light-restore stylesheet link not found')
        text = text.replace(anchor, anchor + '\n' + LINK, 1)
    if BALANCE_LINK not in text:
        text = text.replace(LINK, LINK + '\n' + BALANCE_LINK, 1)
    page.write_text(text, encoding='utf-8')

# Keep the exact requested hero structure, but use a VSK project close-up
# in the small lower-left card rather than the generic older detail reference.
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

# Historical guard: keep the recovery layer deterministic. The final desktop balance
# stylesheet is loaded after this recovery layer and owns the current viewport behavior.
css = Path('v16-original-recovery.css')
css_text = css.read_text(encoding='utf-8')
hero_fix_marker = '/* V16 RECOVERY QA — DESKTOP HERO FINAL OVERRIDE */'
if hero_fix_marker not in css_text:
    css_text += '''\n\n/* V16 RECOVERY QA — DESKTOP HERO FINAL OVERRIDE */\n@media (min-width:1181px){\n  body.v8.v13.v14 .hero.hero-blue{\n    height:clamp(700px,76svh,820px)!important;\n    min-height:700px!important;\n  }\n  body.v8.v13.v14 .hero-blue-copy .hero-actions{\n    justify-self:start!important;\n  }\n}\n'''
css.write_text(css_text, encoding='utf-8')

# Guardrails: do not regress the review indexing lock or remove core project/archive hooks.
for page in PAGES:
    text = page.read_text(encoding='utf-8')
    if 'noindex,nofollow' not in text:
        raise SystemExit(f'{page}: review indexing lock missing')
    if BALANCE_LINK not in text:
        raise SystemExit(f'{page}: desktop balance stylesheet link missing')

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

print('V16 original recovery + desktop balance polish linked and verified.')
