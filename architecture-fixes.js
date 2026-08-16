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

  // Gallery uses the same five engineering families as Projects rather than 34 tiny project-name filters.
  if(document.body.dataset.page==='gallery'){
    const original=$('[data-gallery-filter-list]');if(original)original.hidden=true;
    const controls=$('.gallery-controls');let active='all';
    const familyFromHeader=(text='')=>{const t=text.toLowerCase();if(t.includes('hydraulic'))return'hydraulic';if(t.includes('retrofit'))return'retrofit';if(t.includes('new project'))return'new';if(t.includes('plc')||t.includes('servo controlled'))return'automation';return'spm';};
    if(controls&&!$('.ia-gallery-family-filters',controls))controls.insertAdjacentHTML('beforeend','<div class="ia-gallery-family-filters"><button class="ia-filter is-active" data-gallery-family="all">All</button><button class="ia-filter" data-gallery-family="spm">SPM & CNC</button><button class="ia-filter" data-gallery-family="automation">Automation & Control</button><button class="ia-filter" data-gallery-family="retrofit">Retrofit</button><button class="ia-filter" data-gallery-family="hydraulic">Hydraulic</button><button class="ia-filter" data-gallery-family="new">New Engineering</button></div>');
    const apply=()=>{let visibleGroups=0,visibleMedia=0;$$('.gallery-project-group').forEach(group=>{const family=familyFromHeader($('header span',group)?.textContent||'');const show=active==='all'||family===active;group.hidden=!show;if(show){visibleGroups++;$$('.gallery-tile',group).forEach(tile=>{const badVideo=!!$('img[src$=".mp4"],img[src$=".mov"]',tile);tile.hidden=badVideo;if(!badVideo)visibleMedia++;});}});const status=$('[data-gallery-status]');if(status)status.textContent=`${visibleMedia} browser-ready media item${visibleMedia===1?'':'s'} · ${visibleGroups} project group${visibleGroups===1?'':'s'}`;};
    $$('.ia-gallery-family-filters [data-gallery-family]').forEach(btn=>btn.addEventListener('click',()=>{active=btn.dataset.galleryFamily;$$('.ia-gallery-family-filters [data-gallery-family]').forEach(b=>b.classList.toggle('is-active',b===btn));apply()}));
    const root=$('[data-gallery-grid]');if(root){new MutationObserver(apply).observe(root,{childList:true,subtree:true});requestAnimationFrame(apply);}
  }

  // New project detail pages inherit the review site's noindex state but still get a useful share title.
  if(document.body.dataset.page==='project'){
    const h1=$('.ia-page-hero h1');
    if(h1){const title=h1.textContent.trim();const og=$('meta[property="og:title"]');if(og)og.content=`${title} — VSK Electro-Mech Solutions`;}
  }
})();