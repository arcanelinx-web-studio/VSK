from pathlib import Path

# Improve the secondary hero photo while keeping the 4-servo CAD as the main engineering visual.
p = Path('index.html')
text = p.read_text(encoding='utf-8')
old = 'src="media/cases/slotting-main.webp"/></figure>'
new = 'src="media/cases/slotting-detail.webp"/></figure>'
if old not in text and new not in text:
    raise SystemExit('Secondary hero image target not found')
if old in text:
    text = text.replace(old, new, 1)
text = text.replace('alt="VSK 4-servo slotting machine project reference"', 'alt="VSK 4-servo slotting machine engineering detail"', 1)
p.write_text(text, encoding='utf-8')

css = Path('v16-blue-refinement.css')
s = css.read_text(encoding='utf-8')
marker = '/* V16 BLUE ABSOLUTE PALETTE CLEANUP */'
if marker not in s:
    s += r'''

/* V16 BLUE ABSOLUTE PALETTE CLEANUP */
/* Keep the first-V16 navy/cobalt/engineering-blue language authoritative over later green layers. */
@media (min-width:981px){
  .hero-blue-layout{
    padding-left:clamp(30px,3.7vw,64px)!important;
    padding-right:clamp(28px,3vw,52px)!important;
    box-sizing:border-box;
  }
}

body.v8.v13.v14 .capability-row.is-active{
  background:#FFFFFF!important;
  box-shadow:inset 3px 0 0 0 #167BC4!important;
  border-left-color:#167BC4!important;
}
body.v8.v13.v14 .capability-row.is-active>span,
body.v8.v13.v14 .capability-row.is-active>i,
body.v8.v13.v14 .capability-row:hover>i{color:#167BC4!important}
body.v8.v13.v14 .capability-row.is-active strong,
body.v8.v13.v14 .capability-row:hover strong{color:#142333!important}

body.v8.v13.v14 .metric-number span,
body.v8.v13.v14 .metric-type,
body.v8.v13.v14 .metric-open{color:#164A9C!important}
body.v8.v13.v14 .metric-open:hover{color:#167BC4!important}
body.v8.v13.v14 .archive-callout>span{color:#45A9E8!important}
body.v8.v13.v14 .archive-callout-split span{
  color:#B7D7F2!important;
  border-color:rgba(183,215,242,.18)!important;
  background:rgba(22,123,196,.06)!important;
}
body.v8.v13.v14 .archive-callout-split b{color:#45A9E8!important}

body.v8.v13.v14 .archive-hero-number{color:#45A9E8!important}
body.v8.v13.v14 .archive-hero-number span{color:#45A9E8!important}
body.v8.v13.v14 .archive-types b{color:#164A9C!important}
body.v8.v13.v14 .archive-types button.is-active b{color:#FFFFFF!important}
body.v8.v13.v14 .archive-status a{color:#164A9C!important}
body.v8.v13.v14 .archive-status a:hover{color:#167BC4!important}
body.v8.v13.v14 .archive-sticky-preview{border-color:rgba(69,169,232,.20)!important}

body.v8.v13.v14 .gallery-status a{color:#164A9C!important}
body.v8.v13.v14 .gallery-status a:hover{color:#167BC4!important}
body.v8.v13.v14 .gallery-project-head>div>span,
body.v8.v13.v14 .gallery-tile-caption span{color:#164A9C!important}

/* Older layers used green as a semantic accent on a few controls. Re-map all known survivors. */
body.v8.v13.v14 [style*="#285f50"],
body.v8.v13.v14 [style*="#285F50"]{color:#164A9C!important}

body.error-page{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow-x:hidden!important}
.error-shell{box-sizing:border-box!important;width:min(900px,calc(100vw - 24px))!important;max-width:calc(100vw - 24px)!important}
'''
    css.write_text(s, encoding='utf-8')

print('Final V16 blue cleanup applied')
