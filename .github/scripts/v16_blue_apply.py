from pathlib import Path
import re


def required(text, old, new, label):
    if old not in text:
        raise SystemExit(f"Missing replacement target: {label}")
    return text.replace(old, new, 1)


def add_layers(text):
    if 'v16.css?v=16.2' not in text:
        text = required(
            text,
            '<link href="styles.css" rel="stylesheet"/>',
            '<link href="styles.css" rel="stylesheet"/>\n<link href="v16.css?v=16.2" rel="stylesheet"/>',
            'base stylesheet link',
        )
    if 'v16-blue-refinement.css' not in text:
        text = text.replace('</head>', '<link href="v16-blue-refinement.css" rel="stylesheet"/>\n</head>', 1)
    text = re.sub(r'<meta content="#[0-9A-Fa-f]{6}" name="theme-color"/>', '<meta content="#0D1824" name="theme-color"/>', text, count=1)
    return text


# HOME — preserve the first-V16 structure, improve the hero and buyer-facing narrative.
p = Path('index.html')
text = add_layers(p.read_text(encoding='utf-8'))
hero = '''<section class="hero hero-blue" id="hero">
<div aria-hidden="true" class="hero-blue-grid"></div>
<div class="shell hero-blue-layout">
<div class="hero-copy hero-blue-copy">
<span class="hero-kicker">BENGALURU · MACHINE ENGINEERING · SINCE 2011</span>
<h1><span>Engineered around</span><em>your production.</em></h1>
<p>When a standard machine cannot meet the part, cycle or process, VSK engineers the machine around what production actually demands — from special purpose equipment to critical CNC and control retrofits.</p>
<div class="hero-actions"><button class="text-cta" data-quote-open="" type="button">Discuss your requirement <span>↗</span></button><a class="ghost-cta" href="projects.html">See proven engineering</a></div>
<div class="hero-chips"><span>SPECIAL PURPOSE MACHINES</span><span>CNC &amp; RETROFIT</span><span>AUTOMATION</span><span>PRECISION MANUFACTURING</span></div>
</div>
<div aria-label="VSK machine engineering reference composition" class="hero-engineering-board">
<div aria-hidden="true" class="hero-board-grid"></div>
<div class="hero-board-tag"><b>SPM</b> / CNC ENGINEERING</div>
<figure class="hero-board-main"><img alt="VSK CNC rod boring machine engineering reference" decoding="async" fetchpriority="high" src="media/v16/images/spm-cnc-machines/rod-boring-machine/1520917541365.webp"/><figcaption><span>MACHINE BUILD</span><span>APPLICATION-LED ENGINEERING</span></figcaption></figure>
<figure class="hero-board-photo"><img alt="VSK Kellenberg grinding machine retrofit reference" decoding="async" src="media/retrofit/kellenberg.webp"/></figure>
<div aria-hidden="true" class="hero-tech-sheet"><span class="sheet-label">CONCEPT / MACHINE STUDY</span><div class="sheet-drawing"><i class="sheet-machine"></i></div><div class="sheet-meta"><strong>VSK ELECTRO-MECH</strong><span>APPLICATION · MACHINE · CONTROL</span><span>ENGINEERING REFERENCE</span></div></div>
<div class="hero-proof-chip"><strong>300+</strong><span>MACHINE REFERENCES</span></div>
<div class="hero-board-side-note">MECHANICAL · ELECTRICAL · CONTROLS</div>
<div aria-hidden="true" class="hero-crosshair"><i></i></div>
</div>
</div>
</section>'''
text, count = re.subn(r'<section class="hero" id="hero">.*?</section>', hero, text, count=1, flags=re.S)
if count != 1:
    raise SystemExit(f'Hero replacement count: {count}')

home_pairs = [
    ('<span class="kicker">MULTI-DISCIPLINARY ENGINEERING</span><h2>One requirement.<br/><em>Every discipline connected.</em></h2><p>From the first mechanism to the final control sequence, VSK combines mechanical, CNC/PLC, electrical, fluid-power and manufacturing expertise around the result your production line needs.</p>',
     '<span class="kicker">MULTI-DISCIPLINARY ENGINEERING</span><h2>One production objective.<br/><em>Every discipline connected.</em></h2><p>Bring one requirement. VSK connects mechanical engineering, CNC/PLC, electrical systems, fluid power and manufacturing around the result your production line needs to achieve.</p>'),
    ('<span class="kicker light">FEATURED ENGINEERING</span><h2>Purpose-built around<br/><em>the process.</em></h2></div><p>A closer look at machines and retrofit work where the application, workholding, control system and production target are engineered as one solution.</p>',
     '<span class="kicker light">FEATURED ENGINEERING</span><h2>Built around the part.<br/><em>Proven through the process.</em></h2></div><p>See how application, workholding, controls and production targets become one engineered machine — not a collection of disconnected subsystems.</p>'),
    ('<p>Purpose-built for PTFE tube pre-boring with a Siemens 802D two-axis platform, VFD-controlled spindle and dedicated workholding.</p>',
     '<p>Built specifically for PTFE tube pre-boring, with Siemens 802D control, a VFD-driven spindle and dedicated workholding selected around the application.</p>'),
    ('<div class="shell depth-head reveal"><div><span class="kicker">ENGINEERING DEPTH</span><h2>Precision you can<br/><em>put a number on.</em></h2></div><p>Application tolerances, alignment targets and cycle references sit alongside 54 named engineering references — giving buyers a practical way to judge relevant experience.</p></div>',
     '<div class="shell depth-head reveal"><div><span class="kicker">ENGINEERING DEPTH</span><h2>Precision you can<br/><em>put a number on.</em></h2></div><p>Compare recorded tolerance, alignment and cycle references alongside 54 named engineering projects — measurable proof that makes relevant experience easier to judge.</p></div>'),
    ('<p>Modern controls, renewed machine capability and a practical route to extending productive machine life.</p>',
     '<p>Modern controls and renewed machine capability show how a sound mechanical platform can return to productive service without starting from zero.</p>'),
    ('<div class="shell section-intro split reveal"><div><span class="kicker">HOW VSK WORKS</span><h2>From production problem<br/><em>to working machine.</em></h2></div><p>VSK starts with the application, builds the engineering around it, then validates the result on the machine — not on a presentation slide.</p></div>',
     '<div class="shell section-intro split reveal"><div><span class="kicker">HOW VSK WORKS</span><h2>Your requirement stays connected<br/><em>all the way to commissioning.</em></h2></div><p>Application, mechanism, controls, build and validation stay connected to the same production objective from first discussion to a working machine.</p></div>'),
    ('<div class="about-copy reveal"><span class="kicker">VSK ELECTRO-MECH SOLUTIONS</span><h2>Engineering from<br/><em>Peenya since 2011.</em></h2><p>For manufacturers that need a new machine, a control retrofit or a better production process, VSK brings machine-building and machine-tool experience together under one engineering team.</p><blockquote>Understand the production problem before designing the machine.</blockquote>',
     '<div class="about-copy reveal"><span class="kicker">VSK ELECTRO-MECH SOLUTIONS</span><h2>Engineering from<br/><em>Peenya since 2011.</em></h2><p>Whether the requirement is a new machine, a critical retrofit or a better production process, VSK brings machine-building and machine-tool experience together around one result: making the application work.</p><blockquote>Understand the production problem before designing the machine.</blockquote>'),
    ('<div class="contact-copy reveal"><span class="kicker light">START AN ENGINEERING REQUIREMENT</span><h2>Have a machine, component<br/>or automation requirement?</h2><p>Share the application, current bottleneck, drawing or specification. VSK can review the requirement against relevant machine-building, retrofit and automation experience.</p></div>',
     '<div class="contact-copy reveal"><span class="kicker light">START AN ENGINEERING REQUIREMENT</span><h2>Bring the requirement.<br/>Start with the engineering.</h2><p>Share the part, bottleneck, drawing, existing machine or production target. VSK can connect your requirement to relevant machine-building, retrofit and automation experience from the first discussion.</p></div>'),
]
for old, new in home_pairs:
    text = required(text, old, new, 'home buyer-facing copy')
p.write_text(text, encoding='utf-8')

# PROJECTS
p = Path('projects.html')
text = add_layers(p.read_text(encoding='utf-8'))
project_pairs = [
    ('Explore selected machines and retrofits through the application, engineering decisions, controls and machine views that shaped the final solution.', 'See how VSK turns production constraints into machine architecture, controls and commissioned hardware — with the engineering decisions visible, not hidden behind a finished photograph.'),
    ('See how the machine<br/><em>comes together.</em>', 'See the engineering<br/><em>behind the machine.</em>'),
    ('Each case brings the application, controls, machine configuration and project media together so you can judge experience relevant to your own requirement.', 'Compare real machine builds by application, controls and configuration, and find the experience closest to the production problem you need to solve.'),
    ('More machines.<br/><em>More applications.</em>', 'More engineering.<br/><em>More proof.</em>'),
    ('Explore additional machine builds, process equipment and retrofit work from the wider VSK portfolio.', 'Go beyond the featured cases with additional machine builds, process equipment and retrofit work from the wider VSK portfolio.'),
    ('Ten stories up front.<br/><em>Fifty-four references underneath.</em>', 'Start with the standout builds.<br/><em>Go deeper into 54 references.</em>'),
    ('When you need to go deeper, search the complete Engineering Archive or browse the full visual gallery project by project.', 'When your requirement gets specific, the full Engineering Archive makes it easier to find VSK experience by machine, process, application and control platform.'),
]
for old, new in project_pairs:
    text = required(text, old, new, 'projects buyer-facing copy')
p.write_text(text, encoding='utf-8')

# ARCHIVE
p = Path('machines.html')
text = add_layers(p.read_text(encoding='utf-8'))
archive_pairs = [
    ('Find the right<br/><em>engineering experience.</em>', 'Find the experience<br/><em>closest to your challenge.</em>'),
    ('Search VSK’s recorded machine-building and retrofit experience by process, customer, application or control platform.', 'Find the VSK reference closest to your process, machine and controls challenge — across 54 documented machine-building and retrofit references.'),
    ('54 references.<br/><em>One place to find relevance.</em>', '54 references.<br/><em>Built to make relevance visible.</em>'),
    ('Use the index for technical depth, or switch to the Visual Archive when you want to scan VSK’s experience machine by machine.', 'From a specific process to a specific control platform, the right engineering precedent is easier to find when VSK’s experience is organized machine by machine.'),
]
for old, new in archive_pairs:
    text = required(text, old, new, 'archive buyer-facing copy')
p.write_text(text, encoding='utf-8')

# GALLERY
p = Path('gallery.html')
text = add_layers(p.read_text(encoding='utf-8'))
gallery_pairs = [
    ('Inside the work.<br/><em>Project by project.</em>', 'See the engineering.<br/><em>Up close.</em>'),
    ('Browse machine builds, retrofit work, fixtures, controls and process equipment as complete project groups rather than a stream of unrelated photographs.', 'See VSK engineering up close — machine construction, retrofit detail, fixtures, controls and process equipment captured as complete project groups.'),
    ('Project by project.<br/><em>Every useful view.</em>', 'From machine overview<br/><em>to engineering detail.</em>'),
    ('Browse each project as a complete visual chapter — machine overview, technical detail, alternate views and motion where available.', 'Inspect the machine from overview to technical detail and judge the workmanship, integration and execution behind the finished result.'),
    ('The gallery complements the curated Projects page with the broader visual record of VSK engineering work across multiple machine and process categories.', 'The wider visual record shows the range behind the selected case studies — machine builds, retrofits and process equipment across multiple engineering categories.'),
]
for old, new in gallery_pairs:
    text = required(text, old, new, 'gallery buyer-facing copy')
p.write_text(text, encoding='utf-8')

# 404 matches the restored blue technical identity.
Path('404.html').write_text('''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | VSK Electro-Mech Solutions</title><meta name="theme-color" content="#0D1824"><meta name="robots" content="noindex,nofollow"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet"><link href="media/brand/vsk-logo.webp" rel="icon" type="image/webp"><link href="v16-blue-refinement.css" rel="stylesheet"></head>
<body class="error-page"><main class="error-shell"><img src="media/brand/vsk-logo.webp" alt="VSK Electro-Mech Solutions logo"><div class="error-kicker">404 · OUTSIDE THE MACHINE ENVELOPE</div><h1>Wrong path.<em>Right way back.</em></h1><p>This page is not part of the VSK engineering archive. Return to the machine-building, retrofit and production experience that is.</p><a href="index.html">Return to VSK <span>↗</span></a></main></body></html>''', encoding='utf-8')

# Review-site safety and deterministic cascade.
for name in ('index.html', 'projects.html', 'machines.html', 'gallery.html', '404.html'):
    value = Path(name).read_text(encoding='utf-8')
    if 'noindex,nofollow' not in value:
        raise SystemExit(f'Indexing lock missing in {name}')
    if name != '404.html':
        if 'v16.css?v=16.2' not in value or 'v16-blue-refinement.css' not in value:
            raise SystemExit(f'V16 blue style stack missing in {name}')

print('V16 blue refinement applied successfully')
