from pathlib import Path
p=Path('v16-blue-refinement.css')
s=p.read_text(encoding='utf-8')
marker='/* V16 BLUE LAST COMPUTED-COLOR SURVIVORS */'
if marker not in s:
    s += r'''

/* V16 BLUE LAST COMPUTED-COLOR SURVIVORS */
/* Unclassed metadata inherited green from older section rules. Keep each section intentional. */
body.v8.v13.v14[data-page="home"] main span:not([class]){color:inherit!important}
body.v8.v13.v14[data-page="home"] .process-line span{color:#164A9C!important}
body.v8.v13.v14[data-page="home"] .retrofit-facts span{color:#B7D7F2!important}
body.v8.v13.v14[data-page="home"] .about-mini-stats span{color:#627486!important}
body.v8.v13.v14[data-page="home"] .contact-direct span{color:#8EA8BC!important}
body.v8.v13.v14[data-page="home"] .archive-callout-split span{color:#B7D7F2!important;border-color:rgba(183,215,242,.18)!important}
body.v8.v13.v14[data-page="machines"] .archive-row.is-active{color:#142333!important;box-shadow:inset 3px 0 0 0 #167BC4!important}
body.v8.v13.v14[data-page="machines"] .archive-row.is-active *{color:inherit}
body.v8.v13.v14[data-page="machines"] .archive-row.is-active .archive-row-code{color:#164A9C!important}
body.v8.v13.v14[data-page="gallery"] .gallery-browser span:not([class]){color:#164A9C!important;border-color:currentColor!important}
'''
    p.write_text(s,encoding='utf-8')
print('last computed-color survivors remapped')
