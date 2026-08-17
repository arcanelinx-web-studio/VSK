from pathlib import Path

js=Path('app-v14.js')
s=js.read_text(encoding='utf-8')
marker='// V16 mobile sticky CTA — stay clear of the hero, appear after it.'
old_block='''  // V16 mobile sticky CTA — stay clear of the hero, appear after it.\n  const mobileSticky=$('.mobile-sticky-cta'); const heroSection=$('#hero');\n  if(mobileSticky&&heroSection){\n    const syncSticky=()=>{\n      const ready=heroSection.getBoundingClientRect().bottom<=Math.max(110,innerHeight*.12);\n      mobileSticky.classList.toggle('is-ready',ready);\n      mobileSticky.setAttribute('aria-hidden',ready?'false':'true');\n      mobileSticky.tabIndex=ready?0:-1;\n    };\n    addEventListener('scroll',syncSticky,{passive:true});\n    addEventListener('resize',syncSticky,{passive:true});\n    syncSticky();\n  }\n\n'''
new_block='''  // V16 mobile sticky CTA — stay clear of the hero, appear after it.\n  const mobileSticky=$('.mobile-sticky-cta'); const heroSection=$('#hero');\n  if(mobileSticky&&heroSection){\n    const setStickyReady=(ready)=>{\n      mobileSticky.classList.toggle('is-ready',ready);\n      mobileSticky.setAttribute('aria-hidden',ready?'false':'true');\n      mobileSticky.tabIndex=ready?0:-1;\n    };\n    const syncSticky=()=>{\n      const heroBottom=heroSection.offsetTop+heroSection.offsetHeight;\n      const triggerLine=scrollY+Math.max(110,innerHeight*.12);\n      setStickyReady(triggerLine>=heroBottom);\n    };\n    const heroObserver=new IntersectionObserver(entries=>{\n      const entry=entries[0];\n      if(!entry)return;\n      if(!entry.isIntersecting&&scrollY>0)setStickyReady(true);\n      else syncSticky();\n    },{threshold:.01});\n    heroObserver.observe(heroSection);\n    addEventListener('scroll',()=>requestAnimationFrame(syncSticky),{passive:true});\n    addEventListener('resize',syncSticky,{passive:true});\n    syncSticky();\n  }\n\n'''
if old_block in s:
    s=s.replace(old_block,new_block,1)
elif marker not in s:
    target='  // Quote workflow\n'
    if target not in s: raise SystemExit('Quote workflow insertion target missing')
    s=s.replace(target,new_block+target,1)
elif new_block not in s:
    raise SystemExit('Existing sticky CTA block differs from expected versions')
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
print('mobile sticky CTA reveal trigger updated')
