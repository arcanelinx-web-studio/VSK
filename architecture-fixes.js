(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  // Dynamic architecture CTAs are created after the legacy form engine binds.
  document.addEventListener('click',e=>{
    const trigger=e.target.closest('.ia-main [data-quote-open],.ia-problem-router [data-quote-open]');
    if(!trigger)return;
    const canonical=$('.header-cta[data-quote-open]');
    if(canonical&&canonical!==trigger){e.preventDefault();canonical.click();}
  });

  // Preserve a family choice when arriving from Solutions / Experience.
  if(document.body.dataset.page==='projects'){
    const family=new URLSearchParams(location.search).get('family');
    if(family){requestAnimationFrame(()=>{const button=$(`[data-family-filter="${CSS.escape(family)}"]`);button?.click();document.querySelector('#portfolio')?.scrollIntoView({block:'start'});});}
  }

  $$('[data-family-link]').forEach(link=>link.addEventListener('click',e=>{
    const family=link.dataset.familyLink;if(!family)return;e.preventDefault();location.href=`projects.html?family=${encodeURIComponent(family)}#portfolio`;
  }));

  // New project detail pages inherit the review site's noindex state but still get a useful share title.
  if(document.body.dataset.page==='project'){
    const h1=$('.ia-page-hero h1');
    if(h1){const title=h1.textContent.trim();const og=$('meta[property="og:title"]');if(og)og.content=`${title} — VSK Electro-Mech Solutions`;}
  }
})();