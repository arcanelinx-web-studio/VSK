from pathlib import Path

js=Path('app-v14.js')
s=js.read_text(encoding='utf-8')
marker='// V16 mobile sticky CTA — stay clear of the hero, appear after it.'
if marker not in s:
    target='  // Quote workflow\n'
    block='''  // V16 mobile sticky CTA — stay clear of the hero, appear after it.\n  const mobileSticky=$('.mobile-sticky-cta'); const heroSection=$('#hero');\n  if(mobileSticky&&heroSection){\n    const syncSticky=()=>{\n      const ready=heroSection.getBoundingClientRect().bottom<=Math.max(110,innerHeight*.12);\n      mobileSticky.classList.toggle('is-ready',ready);\n      mobileSticky.setAttribute('aria-hidden',ready?'false':'true');\n      mobileSticky.tabIndex=ready?0:-1;\n    };\n    addEventListener('scroll',syncSticky,{passive:true});\n    addEventListener('resize',syncSticky,{passive:true});\n    syncSticky();\n  }\n\n'''
    if target not in s: raise SystemExit('Quote workflow insertion target missing')
    s=s.replace(target,block+target,1)
    js.write_text(s,encoding='utf-8')

css=Path('v16-blue-refinement.css')
c=css.read_text(encoding='utf-8')
cm='/* V16 MOBILE STICKY CTA REVEAL */'
if cm not in c:
    c += r'''

/* V16 MOBILE STICKY CTA REVEAL */
@media (max-width:700px){
  body.v8.v13.v14 .mobile-sticky-cta{
    display:flex!important;
    opacity:0!important;
    transform:translateY(calc(100% + 18px))!important;
    pointer-events:none!important;
    transition:opacity .24s ease,transform .3s cubic-bezier(.2,.65,.2,1),background .2s ease!important;
  }
  body.v8.v13.v14 .mobile-sticky-cta.is-ready{
    opacity:1!important;
    transform:translateY(0)!important;
    pointer-events:auto!important;
  }
}
'''
    css.write_text(c,encoding='utf-8')
print('mobile sticky CTA hero-overlap polish applied')
