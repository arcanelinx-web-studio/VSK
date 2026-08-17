from pathlib import Path
import re


def replace_required(text, old, new, label):
    if old not in text:
        raise SystemExit(f"Missing replacement target: {label}")
    return text.replace(old, new, 1)


def add_style_layers(text):
    if 'v16.css?v=16.2' not in text:
        text = replace_required(
            text,
            '<link href="styles.css" rel="stylesheet"/>',
            '<link href="styles.css" rel="stylesheet"/>\n<link href="v16.css?v=16.2" rel="stylesheet"/>',
            'styles.css link',
        )
    if 'v16-blue-refinement.css' not in text:
        text = text.replace('</head>', '<link href="v16-blue-refinement.css" rel="stylesheet"/>\n</head>', 1)
    return text


# HOME
p = Path('index.html')
text = p.read_text(encoding='utf-8')
text = text.replace('<meta content="#F4F3EE" name="theme-color"/>', '<meta content="#0D1824" name="theme-color"/>', 1)
text = add_style_layers(text)

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

text, n = re.subn(r'<section class="hero" id="hero">.*?</section>', hero, text, count=1, flags=re.S)
if n != 1:
    raise SystemExit(f'Hero replacement count: {n}')

home_replacements = [
    ('One team for the machine, the controls and the part.', 'One engineering partner from mechanism to controls to finished part.'),
    ('VSK combines mechanical design, machine building, CNC and PLC control, retrofit engineering and precision manufacturing so complex production problems do not get divided between disconnected vendors.', 'Fewer handoffs. Better engineering decisions. Mechanical design, machine building, CNC and PLC systems, retrofit and precision manufacturing stay connected to the same production objective.'),
    ('Designed around your part, process, loading method, takt target and operator.', 'Built around the part, process, loading method, takt target and operator — not a catalogue machine forced into the job.'),
    ('Mechanical rebuilds, CNC migration, servo systems, PLC/HMI integration and commissioning.', 'Recover mechanical value while upgrading CNC, servo, PLC/HMI and feedback systems for the performance production needs now.'),
    ('Prototype and production machining when tolerances, geometry and repeatability cannot move.', 'Prototype and production machining for parts where tolerance, geometry and repeatability have no room to drift.'),
    ('Fixtures, tooling and supporting hardware engineered around the process instead of treated as an afterthought.', 'Fixtures and tooling designed as part of the process, so location, loading and repeatability are solved at the source.'),
    ('Reverse-engineered and build-to-print components for machines that cannot stay down.', 'Reverse-engineered and build-to-print components that help critical machines return to production when standard supply is no longer enough.'),
    ('Machining, fabrication and engineering support for defined production requirements.', 'Machining, fabrication and engineering capacity when your requirement needs a capable extension of the production team.'),
    ('A hard production problem. A machine built around it.', 'A difficult production problem. A machine engineered around it.'),
    ('Engineered for deep, controlled boring where concentricity, stability and repeatability matter.', 'Deep, controlled boring demanded concentricity, stability and repeatability. The machine architecture was engineered around those constraints.'),
    ('Different industries. Same first question: what does production need?', 'Proof across the problems that matter on the shop floor.'),
    ('Five documented references across new machine building, automation, process integration and retrofit work.', 'New machines, automation and retrofits built around real parts, real constraints and real production targets.'),
    ('Claims matter less when the machine can prove them.', 'Precision is more convincing when it is measurable.'),
    ('Three project references show the kind of dimensions VSK works around: loading repeatability, process accuracy and cycle time.', 'Repeatability, accuracy and cycle time become meaningful when they are engineered into the machine and documented in the result.'),
    ('Keep the iron. Replace the limitations.', 'Recover the machine you trust. Upgrade what holds it back.'),
    ('When machine geometry still has value, VSK rebuilds the mechanical and control systems around it instead of forcing a complete replacement.', 'When the machine structure still earns its place on your floor, VSK modernizes the mechanics, feedback, drives and controls around it — preserving what works and replacing what limits production.'),
    ('Mechanical rebuild, CNC/control modernization, feedback-system integration and recommissioning around an existing grinding platform.', 'A grinding platform with proven mechanical value, rebuilt around modern CNC/control, feedback and drive systems to return capability to production.'),
    ('From your requirement to a machine running on your floor.', 'Your requirement stays connected from first concept to final commissioning.'),
    ('A disciplined engineering process keeps the part, process, controls and production environment connected from concept through commissioning.', 'Every stage keeps part geometry, process logic, control architecture and production reality in the same engineering conversation.'),
    ('Machine-building depth built one project at a time.', 'Engineering depth built on machines that had to work.'),
    ('VSK Electro-Mech Solutions is a Bengaluru-based machine engineering company working across special purpose machines, CNC and PLC systems, retrofit engineering, fixtures and precision manufacturing.', 'Since 2011, VSK has built its engineering depth through special purpose machines, CNC and PLC systems, retrofit programs, fixtures and precision manufacturing for real production requirements.'),
    ('Fifteen years of solving production problems through machine engineering, retrofit and precision manufacturing.', 'Experience earned across machine building, retrofit and precision manufacturing — one production requirement at a time.'),
    ('Bring the production problem. We’ll start with the engineering.', 'Put your toughest production requirement on the table.'),
    ('New machine, retrofit, automation, control upgrade or precision component — share the application, drawings or constraints and start the discussion.', 'Share the part, drawing, cycle target, existing machine or bottleneck. The conversation starts with what the solution must achieve.'),
    ('Tell VSK what the machine needs to do, what the part needs to hold and what production cannot compromise.', 'Tell us what the part must hold, what the machine must achieve and what production cannot compromise. That is where the right engineering starts.'),
    ('Start with the requirement.', 'Start with what production needs to achieve.'),
    ('If you have a drawing, existing machine, cycle-time target or tolerance problem, include it. The engineering discussion can begin from there.', 'Bring the drawing, existing machine, cycle-time target or tolerance challenge. The more real the requirement, the more useful the first engineering discussion becomes.'),
]
for old, new in home_replacements:
    if old not in text:
        raise SystemExit('Missing home copy target: ' + old[:70])
    text = text.replace(old, new, 1)
p.write_text(text, encoding='utf-8')

# PROJECTS
p = Path('projects.html')
text = add_style_layers(p.read_text(encoding='utf-8'))
project_replacements = [
    ('Explore selected machines and retrofits through the application, engineering decisions, controls and machine views that shaped the final solution.', 'See how VSK turns production constraints into machine architecture, controls and commissioned hardware — with the engineering decisions visible, not hidden behind a finished photograph.'),
    ('See how the machine<br/><em>comes together.</em>', 'See the engineering<br/><em>behind the machine.</em>'),
    ('Each case brings the application, controls, machine configuration and project media together so you can judge experience relevant to your own requirement.', 'Compare real machine builds by application, controls and configuration, and find the experience closest to the production problem you need to solve.'),
    ('More machines.<br/><em>More applications.</em>', 'More engineering.<br/><em>More proof.</em>'),
    ('Explore additional machine builds, process equipment and retrofit work from the wider VSK portfolio.', 'Go beyond the featured cases with additional machine builds, process equipment and retrofit work from the wider VSK portfolio.'),
    ('Ten stories up front.<br/><em>Fifty-four references underneath.</em>', 'Start with the standout builds.<br/><em>Go deeper into 54 references.</em>'),
    ('When you need to go deeper, search the complete Engineering Archive or browse the full visual gallery project by project.', 'When your requirement gets specific, the full Engineering Archive makes it easier to find VSK experience by machine, process, application and control platform.'),
]
for old, new in project_replacements:
    if old not in text:
        raise SystemExit('Missing projects copy target: ' + old[:70])
    text = text.replace(old, new, 1)
p.write_text(text, encoding='utf-8')

# ARCHIVE
p = Path('machines.html')
text = add_style_layers(p.read_text(encoding='utf-8'))
archive_replacements = [
    ('Find the right<br/><em>engineering experience.</em>', 'Find the experience<br/><em>closest to your challenge.</em>'),
    ('Search VSK’s recorded machine-building and retrofit experience by process, customer, application or control platform.', 'Find the VSK reference closest to your process, machine and controls challenge — across 54 documented machine-building and retrofit references.'),
    ('54 references.<br/><em>One place to find relevance.</em>', '54 references.<br/><em>Built to make relevance visible.</em>'),
    ('Use the index for technical depth, or switch to the Visual Archive when you want to scan VSK’s experience machine by machine.', 'From a specific process to a specific control platform, the right engineering precedent is easier to find when VSK’s experience is organized machine by machine.'),
]
for old, new in archive_replacements:
    if old not in text:
        raise SystemExit('Missing archive copy target: ' + old[:70])
    text = text.replace(old, new, 1)
p.write_text(text, encoding='utf-8')

# GALLERY
p = Path('gallery.html')
text = add_style_layers(p.read_text(encoding='utf-8'))
gallery_replacements = [
    ('Inside the work.<br/><em>Project by project.</em>', 'See the engineering.<br/><em>Up close.</em>'),
    ('Browse machine builds, retrofit work, fixtures, controls and process equipment as complete project groups rather than a stream of unrelated photographs.', 'See VSK engineering up close — machine construction, retrofit detail, fixtures, controls and process equipment captured as complete project groups.'),
    ('Project by project.<br/><em>Every useful view.</em>', 'From machine overview<br/><em>to engineering detail.</em>'),
    ('Browse each project as a complete visual chapter — machine overview, technical detail, alternate views and motion where available.', 'Inspect the machine from overview to technical detail and judge the workmanship, integration and execution behind the finished result.'),
    ('The gallery complements the curated Projects page with the broader visual record of VSK engineering work across multiple machine and process categories.', 'The wider visual record shows the range behind the selected case studies — machine builds, retrofits and process equipment across multiple engineering categories.'),
]
for old, new in gallery_replacements:
    if old not in text:
        raise SystemExit('Missing gallery copy target: ' + old[:70])
    text = text.replace(old, new, 1)
p.write_text(text, encoding='utf-8')

# 404
error = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | VSK Electro-Mech Solutions</title><meta name="theme-color" content="#0D1824"><meta name="robots" content="noindex,nofollow"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet"><link href="media/brand/vsk-logo.webp" rel="icon" type="image/webp"><link href="v16-blue-refinement.css" rel="stylesheet"></head>
<body class="error-page"><main class="error-shell"><img src="media/brand/vsk-logo.webp" alt="VSK Electro-Mech Solutions logo"><div class="error-kicker">404 · OUTSIDE THE MACHINE ENVELOPE</div><h1>Wrong path.<em>Right way back.</em></h1><p>This page is not part of the VSK engineering archive. Return to the machine-building, retrofit and production experience that is.</p><a href="index.html">Return to VSK <span>↗</span></a></main></body></html>'''
Path('404.html').write_text(error, encoding='utf-8')

# Keep client-review build out of search engines.
for name in ('index.html', 'projects.html', 'machines.html', 'gallery.html', '404.html'):
    value = Path(name).read_text(encoding='utf-8')
    if 'noindex,nofollow' not in value:
        raise SystemExit(f'Indexing lock missing in {name}')
    if name != '404.html' and 'v16-blue-refinement.css' not in value:
        raise SystemExit(f'Blue refinement stylesheet missing in {name}')

print('V16 blue refinement applied successfully')
