(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const manifest=()=>window.__VSK_MANIFEST__||{groups:[],summary:{}};
  const groups=()=>Array.isArray(manifest().groups)?manifest().groups.filter(g=>g?.items?.length):[];
  const cleanTitle=(value='')=>{
    let s=value.replace(/\s+/g,' ').trim();
    const replacements=[[/\bCnc\b/gi,'CNC'],[/\bPlc\b/gi,'PLC'],[/\bHmi\b/gi,'HMI'],[/\bSpm\b/gi,'SPM'],[/\bVfd\b/gi,'VFD'],[/\bHundai\b/gi,'Hyundai'],[/\bKelingberg\b/gi,'Kellenberg'],[/\bAggitating\b/gi,'Agitating'],[/\bOd\b/g,'OD'],[/\bId\b/g,'ID']];
    replacements.forEach(([re,v])=>{s=s.replace(re,v)});
    return s.replace(/\b\w/g,c=>c.toUpperCase()).replace(/\bCnc\b/g,'CNC').replace(/\bPlc\b/g,'PLC').replace(/\bHmi\b/g,'HMI').replace(/\bSpm\b/g,'SPM').replace(/\bVfd\b/g,'VFD').replace(/\bOd\b/g,'OD').replace(/\bId\b/g,'ID');
  };
  const familyFor=(group)=>{
    const t=`${group?.category||''} ${group?.path||''}`.toLowerCase();
    if(t.includes('hydraulic'))return'hydraulic';
    if(t.includes('retrofit'))return'retrofit';
    if(t.includes('new project'))return'new';
    if(t.includes('plc')||t.includes('servo controlled'))return'automation';
    return'spm';
  };
  const familyLabel={spm:'SPM / CNC',automation:'Automation / Control',retrofit:'Retrofit',hydraulic:'Hydraulic',new:'Recent Engineering'};
  const coverFor=(group)=>{
    const item=group?.items?.find(i=>i.type==='image'&&(i.thumb||i.web||i.src))||group?.items?.find(i=>i.type==='video'&&(i.poster||i.thumb));
    return item?.thumb||item?.poster||item?.web||item?.src||'';
  };
  const groupHay=(group)=>`${group?.id||''} ${group?.title||''} ${group?.project||''} ${group?.path||''}`.toLowerCase();
  const findExactGroup=(...terms)=>groups().find(g=>terms.every(t=>groupHay(g).includes(String(t).toLowerCase()))&&coverFor(g));
  const projectHref=(group)=>`project.html?id=${encodeURIComponent(group.id)}`;
  const exactProjectCard=(group,context='experience')=>{
    const title=cleanTitle(group.title||group.project||'VSK Engineering Project');
    const cover=coverFor(group);
    const family=familyLabel[familyFor(group)]||'Engineering';
    const mediaCount=group.items?.length||0;
    return `<a class="ia-project-card ia-exact-project-card ${context==='home'?'is-home-selected':'is-experience-verified'}" href="${projectHref(group)}" data-exact-project="${group.id}">
      <div class="ia-project-media">${cover?`<img src="${cover}" alt="${title}" loading="lazy">`:''}</div>
      <div class="ia-project-copy"><span class="ia-project-meta">VERIFIED PROJECT MEDIA · ${family}</span><h3>${title}</h3><p>${context==='home'?`${mediaCount} recorded media item${mediaCount===1?'':'s'} from this project.`:`Image and title are taken from the same VSK project folder · ${mediaCount} recorded media item${mediaCount===1?'':'s'}.`}</p><div class="ia-project-action"><span>${context==='home'?'Open project':'View verified project'}</span><i>→</i></div></div>
    </a>`;
  };
  const pickVerified=(limit=9)=>{
    const preferred=[
      findExactGroup('4','servo','slotting'),findExactGroup('air','leak'),findExactGroup('kelingberg','grinding'),findExactGroup('hydraulic','press'),findExactGroup('thread','cutting'),findExactGroup('vertical','turning'),findExactGroup('rod','boring'),findExactGroup('jig','grinding'),findExactGroup('hardinge','t40'),findExactGroup('paint','aggitating'),findExactGroup('electric','oven')
    ].filter(Boolean);
    const pool=[...preferred,...groups().filter(g=>coverFor(g))];
    return [...new Map(pool.map(g=>[g.id,g])).values()].slice(0,limit);
  };

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

  // Homepage Selected Projects must always be a complete visual composition.
  // Every card below is built from the matching manifest group, so image/title attribution is exact.
  if(document.body.dataset.page==='home'){
    const root=$('[data-home-projects]');
    const selected=pickVerified(6);
    if(root&&selected.length){
      root.classList.remove('project-grid','project-grid-editorial');
      root.classList.add('ia-project-grid','ia-home-project-grid');
      root.innerHTML=selected.map(g=>exactProjectCard(g,'home')).join('');
      const head=root.previousElementSibling;
      if(head?.classList.contains('project-collection-head')){
        const label=$('span',head),link=$('a',head);
        if(label)label.textContent='SELECTED PROJECTS · VERIFIED VISUAL WORK';
        if(link){link.textContent='Explore the complete project portfolio →';link.href='projects.html';}
      }
    }
  }

  // Experience is the evidence layer, not a second Projects page.
  // It shows breadth and the 54-reference record, with images only where the title/image relationship is directly verified.
  if(document.body.dataset.page==='experience'){
    const main=$('#main');
    const verified=pickVerified(9);
    const hero=verified[0];
    const heroImage=coverFor(hero);
    const summary=manifest().summary||{};
    const counts={spm:0,automation:0,retrofit:0,hydraulic:0,new:0};
    groups().forEach(g=>{counts[familyFor(g)]=(counts[familyFor(g)]||0)+1});
    if(main){
      main.className='ia-main ia-experience-page';
      main.innerHTML=`
        <section class="ia-page-hero has-media ia-experience-hero">
          ${heroImage?`<div class="ia-page-hero-media"><img src="${heroImage}" alt="${cleanTitle(hero.title||hero.project)}" fetchpriority="high"></div>`:''}
          <div class="shell"><span class="ia-eyebrow">ENGINEERING EXPERIENCE · VERIFIED EVIDENCE</span><h1>Experience is the proof.<br>Projects are the stories.</h1><p>Projects shows documented machine work in depth. Experience helps you verify breadth across machine types, processes, controls, customers and VSK’s 54 named engineering references.</p><div class="ia-page-hero-actions"><a class="btn btn-primary" href="#verified-experience">See verified visual experience <span>↓</span></a><a class="btn btn-outline" href="machines.html">Search all 54 references <span>→</span></a></div></div>
        </section>
        <section class="ia-section paper ia-experience-definition"><div class="shell ia-experience-purpose">
          <article><span>PROJECTS</span><h2>Visual project work.</h2><p>Use Projects when you want to see a machine or retrofit as a project: its images, project group, engineering context and deeper project page.</p><a href="projects.html">Explore Projects →</a></article>
          <article><span>EXPERIENCE</span><h2>Capability evidence.</h2><p>Use Experience when you want to judge whether VSK has worked on a similar machine, process, control platform or application across the wider engineering history.</p><a href="machines.html">Search Engineering Experience →</a></article>
        </div></section>
        <section class="ia-section stone"><div class="shell ia-experience-stats"><article class="ia-experience-stat"><span>MACHINES</span><strong>300+</strong><p>Designed, manufactured and supplied across India.</p></article><article class="ia-experience-stat"><span>NAMED REFERENCES</span><strong>54</strong><p>39 custom / SPM · 15 machine-tool retrofit references.</p></article><article class="ia-experience-stat"><span>VERIFIED VISUAL PROJECT GROUPS</span><strong>${summary.groups||groups().length}</strong><p>${summary.images||0} images · ${summary.videos||0} videos organized from VSK’s own project folders.</p></article></div></section>
        <section class="ia-section dark ia-verified-experience" id="verified-experience"><div class="shell ia-section-head"><div><span class="ia-label">VERIFIED VISUAL EXPERIENCE</span><h2>Real image.<br>Real project title.</h2></div><div><p>Every picture in this section is taken from the same project folder as the title shown on its card. No generic or “similar machine” photograph is substituted here.</p><div class="ia-verification-key"><span></span> Exact project-folder match</div></div></div><div class="shell ia-project-grid ia-experience-project-grid">${verified.map(g=>exactProjectCard(g,'experience')).join('')}</div></section>
        <section class="ia-section"><div class="shell ia-section-head"><div><span class="ia-label">BREADTH OF EXPERIENCE</span><h2>Find the relevant<br>engineering context.</h2></div><p>The visual projects are only one part of the record. Use the complete engineering archive when your starting point is a process, machine type, customer or control platform.</p></div><div class="shell ia-family-grid ia-experience-family-grid">
          <a class="ia-family" href="projects.html?family=spm#portfolio"><small>01 / MACHINE BUILDING</small><strong>SPM & CNC</strong><p>Dedicated turning, boring, drilling, cutting and CNC machine applications.</p><footer><span>${counts.spm||0} visual groups</span><i>→</i></footer></a>
          <a class="ia-family" href="projects.html?family=automation#portfolio"><small>02 / AUTOMATION</small><strong>Automation & Control</strong><p>PLC, HMI, servo, testing, handling and controlled production processes.</p><footer><span>${counts.automation||0} visual groups</span><i>→</i></footer></a>
          <a class="ia-family" href="projects.html?family=retrofit#portfolio"><small>03 / LIFECYCLE</small><strong>Retrofit & Reconditioning</strong><p>Grinding, turning and machine-tool modernization with existing assets.</p><footer><span>${counts.retrofit||0} visual groups</span><i>→</i></footer></a>
          <a class="ia-family" href="projects.html?family=hydraulic#portfolio"><small>04 / FLUID POWER</small><strong>Hydraulic & Pressing</strong><p>Pressing, clamping and hydraulic machine functions around the production sequence.</p><footer><span>${counts.hydraulic||0} visual groups</span><i>→</i></footer></a>
          <a class="ia-family" href="projects.html?family=new#portfolio"><small>05 / RECENT WORK</small><strong>Recent Engineering</strong><p>Newer recorded projects extending the machine-building portfolio.</p><footer><span>${counts.new||0} visual groups</span><i>→</i></footer></a>
        </div></section>
        <section class="ia-section paper ia-experience-archive-cta"><div class="shell ia-section-head"><div><span class="ia-label">COMPLETE ENGINEERING RECORD</span><h2>Need the exact machine,<br>customer or controller?</h2></div><div><p>The 54-reference Engineering Archive is the database layer behind Experience. Search it when you need evidence beyond the visual project library.</p><div class="ia-page-hero-actions"><a class="btn btn-primary" href="machines.html">Open 54-reference archive <span>→</span></a><button class="btn ia-btn-outline-dark" type="button" data-quote-open>Discuss a Machine <span>↗</span></button></div></div></div></section>`;
    }
  }

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