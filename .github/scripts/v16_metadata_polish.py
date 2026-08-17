from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
changes={
'<title>VSK Electro-Mech Solutions — Engineered for Precision</title>':'<title>VSK Electro-Mech Solutions — Engineered Around Your Production</title>',
'<meta content="VSK Electro-Mech Solutions designs special purpose machines, modernizes CNC and grinding machines, integrates automation and manufactures precision components in Bengaluru, India." name="description"/>':'<meta content="Special purpose machines, CNC and machine-tool retrofit, automation and precision manufacturing engineered around real production requirements in Bengaluru, India." name="description"/>',
'<meta content="VSK Electro-Mech Solutions — Engineered for Precision" property="og:title"/>':'<meta content="VSK Electro-Mech Solutions — Engineered Around Your Production" property="og:title"/>',
'<meta content="Special purpose machines, CNC retrofit, automation and precision manufacturing from Bengaluru." property="og:description"/>':'<meta content="Machine engineering built around the part, process, cycle and production result — from special purpose machines to CNC retrofit and automation." property="og:description"/>',
'<meta content="media/retrofit/kellenberg.webp" property="og:image"/>':'<meta content="media/v16/images/spm-machines-plc-hmi-and-servo-controlled/4-servo-seal-slotting-machine/slotting-mc-1.webp" property="og:image"/>',
'<link as="image" fetchpriority="high" href="media/retrofit/kellenberg.webp" rel="preload"/>':'<link as="image" fetchpriority="high" href="media/v16/images/spm-machines-plc-hmi-and-servo-controlled/4-servo-seal-slotting-machine/slotting-mc-1.webp" rel="preload"/>'
}
for old,new in changes.items():
    if old not in s: raise SystemExit('Missing home metadata target: '+old[:70])
    s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')

for name,old,new in [
('projects.html','Documented special purpose machines, automation systems and retrofit projects from VSK Electro-Mech Solutions.','See how VSK turns production constraints into special purpose machines, automation systems and CNC/PLC retrofit solutions.'),
('machines.html','Explore 54 named custom machine and machine-tool retrofit references from VSK Electro-Mech Solutions.','Search 54 documented VSK machine-building and retrofit references by process, application and control platform.'),
('gallery.html','Browse VSK machine photographs, retrofit work and engineering project media grouped by project.','Inspect VSK machine builds, retrofit work, fixtures, controls and process equipment through complete project media groups.')]:
    p=Path(name);t=p.read_text(encoding='utf-8')
    target=f'<meta content="{old}" name="description"/>'
    replacement=f'<meta content="{new}" name="description"/>'
    if target not in t: raise SystemExit('Missing description target in '+name)
    p.write_text(t.replace(target,replacement,1),encoding='utf-8')
print('metadata aligned to V16 blue refinement')
