from pathlib import Path

index=Path('index.html')
text=index.read_text(encoding='utf-8')
replacements={
  '<div class="hero-board-tag"><b>SPM</b> / CNC ENGINEERING</div>':'<div class="hero-board-tag"><b>04 SERVO</b> / SPM</div>',
  'src="media/v16/images/spm-cnc-machines/rod-boring-machine/1520917541365.webp"/><figcaption><span>MACHINE BUILD</span><span>APPLICATION-LED ENGINEERING</span>':'src="media/v16/images/spm-machines-plc-hmi-and-servo-controlled/4-servo-seal-slotting-machine/slotting-mc-1.webp"/><figcaption><span>4-SERVO SLOTTING MACHINE</span><span>APPLICATION-LED ENGINEERING</span>',
  'alt="VSK CNC rod boring machine engineering reference"':'alt="VSK 4-servo seal slotting machine CAD engineering reference"',
  'src="media/retrofit/kellenberg.webp"/></figure>':'src="media/cases/slotting-main.webp"/></figure>',
  'alt="VSK Kellenberg grinding machine retrofit reference"':'alt="VSK 4-servo slotting machine project reference"',
}
for old,new in replacements.items():
    if old not in text:
        raise SystemExit('Missing hero polish target: '+old[:80])
    text=text.replace(old,new,1)
index.write_text(text,encoding='utf-8')

css=Path('v16-blue-refinement.css')
s=css.read_text(encoding='utf-8')
marker='/* BLUE REFINEMENT FINAL SPECIFICITY CLEANUP */'
if marker not in s:
    s += '''\n\n/* BLUE REFINEMENT FINAL SPECIFICITY CLEANUP */
body.v8.v13.v14 .capability-row{border-color:#D4DEE6!important;color:#627486!important;background:transparent!important}
body.v8.v13.v14 .capability-row>span,
body.v8.v13.v14 .capability-row>i{color:#7890A3!important}
body.v8.v13.v14 .capability-row.is-active,
body.v8.v13.v14 .capability-row:hover{background:#FFFFFF!important;border-color:#B9CBD9!important;color:#142333!important}
body.v8.v13.v14 .capability-row.is-active{border-left-color:#167BC4!important}
body.v8.v13.v14 .capability-row.is-active>span,
body.v8.v13.v14 .capability-row.is-active>i,
body.v8.v13.v14 .capability-row:hover>i{color:#167BC4!important}
body.v8.v13.v14 .capability-media figcaption>span{color:#164A9C!important}
body.v8.v13.v14 .capability-media figcaption>p{color:#627486!important}
body.v8.v13.v14 .tag-row b{color:#164A9C!important;border-color:#B9CBD9!important;background:#F8FBFD!important}
body.v8.v13.v14 .metric-card small,
body.v8.v13.v14 .metric-card i{color:#164A9C!important}
body.v8.v13.v14 .metric-card strong{color:#164A9C!important}
body.v8.v13.v14 .archive-callout .kicker{color:#45A9E8!important}
body.v8.v13.v14 .archive-callout-split b{color:#B7D7F2!important}
body.error-page{width:100%;max-width:100%;box-sizing:border-box}
.error-shell{box-sizing:border-box;max-width:calc(100vw - 24px)}
'''
    css.write_text(s,encoding='utf-8')
print('V16 blue visual polish applied')
