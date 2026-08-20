(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const page=document.body.dataset.page||'home';
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
      <div class="ia-project-copy"><span class="ia-project-meta">VERIFIED PROJECT MEDIA · ${family}</span><h3>${title}</h3><p>${context==='home'?`${mediaCount} recorded media item${mediaCount===1?'':'s'} from this project.`:`Image and title are taken from the same VSK project folder · ${mediaCount} recorded media item${mediaCount===1?'':'s'}.`}</p><div class="ia-project-action"><span>${context==='home'?'Open experience':'View verified case'}</span><i>→</i></div></div>
    </a>`;
  };
  const pickVerified=(limit=9)=>{
    const preferred=[
      findExactGroup('4','servo','slotting'),findExactGroup('air','leak'),findExactGroup('kelingberg','grinding'),findExactGroup('hydraulic','press'),findExactGroup('thread','cutting'),findExactGroup('vertical','turning'),findExactGroup('rod','boring'),findExactGroup('jig','grinding'),findExactGroup('hardinge','t40'),findExactGroup('paint','aggitating'),findExactGroup('electric','oven')
    ].filter(Boolean);
    const pool=[...preferred,...groups().filter(g=>coverFor(g))];
    return [...new Map(pool.map(g=>[g.id,g])).values()].slice(0,limit);
  };

  // Keep the public navigation simple: Projects is folded into Experience.
  // Gallery remains the visual library; project.html remains available only as a detail view.
  const simplifyNavigation=()=>{
    $$('.desktop-nav a[href="projects.html"],.mobile-menu nav a[href="projects.html"]').forEach(a=>a.remove());
    const desktop=$('.desktop-nav');
    if(desktop&&!$('.desktop-nav a[href="gallery.html"]')){
      const experience=$('.desktop-nav a[href="experience.html"]');
      experience?.insertAdjacentHTML('afterend',`<a${page==='gallery'?' class="is-current" aria-current="page"':''} href="gallery.html">Gallery</a>`);
    }
    if(page==='project'){
      $$('.desktop-nav a,.mobile-menu nav a').forEach(a=>a.classList.remove('is-current'));
      const exp=$('.desktop-nav a[href="experience.html"]');if(exp){exp.classList.add('is-current');exp.setAttribute('aria-current','page');}
    }
    $$('.mobile-menu nav a').forEach((a,i)=>{const n=$('span',a);if(n)n.textContent=String(i+1).padStart(2,'0');});
  };
  simplifyNavigation();

  // Old Projects URLs now land on the single customer-facing Experience destination.
  if(page==='projects'){
    location.replace('experience.html#verified-experience');
    return;
  }

  // Dynamic architecture CTAs are created after the legacy form engine binds.
  document.addEventListener('click',e=>{
    const trigger=e.target.closest('.ia-main [data-quote-open],.ia-problem-router [data-quote-open]');
    if(!trigger)return;
    const canonical=$('.header-cta[data-quote-open]');
    if(canonical&&canonical!==trigger){e.preventDefault();canonical.click();}
  });

  // Redirect any remaining customer-facing Projects links into Experience.
  $$('a[href^="projects.html"]').forEach(a=>{
    a.href='experience.html#verified-experience';
    if(/project/i.test(a.textContent||''))a.textContent=(a.textContent||'').replace(/projects?/ig,'Experience');
  });

  // Homepage: make Experience the proof destination and keep the selected work full-width.
  if(page==='home'){
    const heroPrimary=$('.hero-actions a.btn');
    if(heroPrimary){heroPrimary.href='experience.html';heroPrimary.innerHTML='Explore Experience <span>→</span>';}
    const root=$('[data-home-projects]');
    const selected=pickVerified(6);
    if(root&&selected.length){
      root.classList.remove('project-grid','project-grid-editorial');
      root.classList.add('ia-project-grid','ia-home-project-grid');
      root.innerHTML=selected.map(g=>exactProjectCard(g,'home')).join('');
      const head=root.previousElementSibling;
      if(head?.classList.contains('project-collection-head')){
        const label=$('span',head),link=$('a',head);
        if(label)label.textContent='SELECTED EXPERIENCE · VERIFIED MACHINE WORK';
        if(link){link.textContent='Explore VSK engineering experience →';link.href='experience.html#verified-experience';}
      }
    }
  }

  // Experience is the curated engineering-proof destination.
  // Every picture here is sourced from the exact project folder represented by its title.
  if(page==='experience'){
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
          <div class="shell"><span class="ia-eyebrow">ENGINEERING EXPERIENCE · VERIFIED EVIDENCE</span><h1>Experience is the proof.<br>Gallery is the visual record.</h1><p>Use Experience to judge VSK’s machine-building, automation and retrofit capability through curated real cases. Use Gallery when you simply want to browse the wider photo and video record project by project.</p><div class="ia-page-hero-actions"><a class="btn btn-primary" href="#verified-experience">See verified experience <span>↓</span></a><a class="btn btn-outline" href="gallery.html">Open Gallery <span>→</span></a></div></div>
        </section>
        <section class="ia-section paper ia-experience-definition"><div class="shell ia-experience-purpose">
          <article><span>EXPERIENCE</span><h2>Curated engineering proof.</h2><p>Come here when you want to understand what VSK has actually handled: machine types, applications, controls, engineering families and selected cases with verified media.</p><a href="#verified-experience">See verified experience →</a></article>
          <article><span>GALLERY</span><h2>The complete visual library.</h2><p>Come here when you want to browse VSK’s own project photos and videos with minimal explanation, grouped by the real project folders they came from.</p><a href="gallery.html">Browse Gallery →</a></article>
        </div></section>
        <section class="ia-section stone"><div class="shell ia-experience-stats"><article class="ia-experience-stat"><span>MACHINES</span><strong>300+</strong><p>Designed, manufactured and supplied across India.</p></article><article class="ia-experience-stat"><span>NAMED REFERENCES</span><strong>54</strong><p>39 custom / SPM · 15 machine-tool retrofit references.</p></article><article class="ia-experience-stat"><span>VERIFIED VISUAL GROUPS</span><strong>${summary.groups||groups().length}</strong><p>${summary.images||0} images · ${summary.videos||0} videos organized from VSK’s own project folders.</p></article></div></section>
        <section class="ia-section dark ia-verified-experience" id="verified-experience"><div class="shell ia-section-head"><div><span class="ia-label">SELECTED VERIFIED EXPERIENCE</span><h2>Real image.<br>Real project title.</h2></div><div><p>Every picture in this section is taken from the same project folder as the title shown on its card. No generic or “similar machine” photograph is substituted.</p><div class="ia-verification-key"><span></span> Exact project-folder match</div></div></div><div class="shell ia-project-grid ia-experience-project-grid">${verified.map(g=>exactProjectCard(g,'experience')).join('')}</div></section>
        <section class="ia-section"><div class="shell ia-section-head"><div><span class="ia-label">BREADTH OF EXPERIENCE</span><h2>Find the relevant<br>engineering context.</h2></div><p>The selected visual cases are the front door. The broader VSK record spans machine building, automation, retrofit, fluid power and recent engineering work.</p></div><div class="shell ia-family-grid ia-experience-family-grid">
          <a class="ia-family" href="#verified-experience"><small>01 / MACHINE BUILDING</small><strong>SPM & CNC</strong><p>Dedicated turning, boring, drilling, cutting and CNC machine applications.</p><footer><span>${counts.spm||0} visual groups</span><i>↓</i></footer></a>
          <a class="ia-family" href="#verified-experience"><small>02 / AUTOMATION</small><strong>Automation & Control</strong><p>PLC, HMI, servo, testing, handling and controlled production processes.</p><footer><span>${counts.automation||0} visual groups</span><i>↓</i></footer></a>
          <a class="ia-family" href="#verified-experience"><small>03 / LIFECYCLE</small><strong>Retrofit & Reconditioning</strong><p>Grinding, turning and machine-tool modernization with existing assets.</p><footer><span>${counts.retrofit||0} visual groups</span><i>↓</i></footer></a>
          <a class="ia-family" href="#verified-experience"><small>04 / FLUID POWER</small><strong>Hydraulic & Pressing</strong><p>Pressing, clamping and hydraulic machine functions around the production sequence.</p><footer><span>${counts.hydraulic||0} visual groups</span><i>↓</i></footer></a>
          <a class="ia-family" href="#verified-experience"><small>05 / RECENT WORK</small><strong>Recent Engineering</strong><p>Newer recorded projects extending the machine-building portfolio.</p><footer><span>${counts.new||0} visual groups</span><i>↓</i></footer></a>
        </div></section>
        <section class="ia-section paper ia-experience-archive-cta"><div class="shell ia-section-head"><div><span class="ia-label">COMPLETE ENGINEERING RECORD</span><h2>Need the exact machine,<br>customer or controller?</h2></div><div><p>The 54-reference Engineering Archive is the technical database behind Experience. Search it when you need evidence beyond the curated visual cases.</p><div class="ia-page-hero-actions"><a class="btn btn-primary" href="machines.html">Search 54-reference archive <span>→</span></a><button class="btn ia-btn-outline-dark" type="button" data-quote-open>Discuss a Machine <span>↗</span></button></div></div></div></section>`;
    }
  }

  // Gallery uses the same five engineering families as Experience rather than dozens of tiny project-name filters.
  if(page==='gallery'){
    const original=$('[data-gallery-filter-list]');if(original)original.hidden=true;
    const controls=$('.gallery-controls');let active='all';
    const familyFromHeader=(text='')=>{const t=text.toLowerCase();if(t.includes('hydraulic'))return'hydraulic';if(t.includes('retrofit'))return'retrofit';if(t.includes('new project'))return'new';if(t.includes('plc')||t.includes('servo controlled'))return'automation';return'spm';};
    if(controls&&!$('.ia-gallery-family-filters',controls))controls.insertAdjacentHTML('beforeend','<div class="ia-gallery-family-filters"><button class="ia-filter is-active" data-gallery-family="all">All</button><button class="ia-filter" data-gallery-family="spm">SPM & CNC</button><button class="ia-filter" data-gallery-family="automation">Automation & Control</button><button class="ia-filter" data-gallery-family="retrofit">Retrofit</button><button class="ia-filter" data-gallery-family="hydraulic">Hydraulic</button><button class="ia-filter" data-gallery-family="new">New Engineering</button></div>');
    const apply=()=>{let visibleGroups=0,visibleMedia=0;$$('.gallery-project-group').forEach(group=>{const family=familyFromHeader($('header span',group)?.textContent||'');const show=active==='all'||family===active;group.hidden=!show;if(show){visibleGroups++;$$('.gallery-tile',group).forEach(tile=>{const badVideo=!!$('img[src$=".mp4"],img[src$=".mov"]',tile);tile.hidden=badVideo;if(!badVideo)visibleMedia++;});}});const status=$('[data-gallery-status]');if(status)status.textContent=`${visibleMedia} browser-ready media item${visibleMedia===1?'':'s'} · ${visibleGroups} project group${visibleGroups===1?'':'s'}`;};
    $$('.ia-gallery-family-filters [data-gallery-family]').forEach(btn=>btn.addEventListener('click',()=>{active=btn.dataset.galleryFamily;$$('.ia-gallery-family-filters [data-gallery-family]').forEach(b=>b.classList.toggle('is-active',b===btn));apply()}));
    const root=$('[data-gallery-grid]');if(root){new MutationObserver(apply).observe(root,{childList:true,subtree:true});requestAnimationFrame(apply);}
  }

  // Specific machine/detail pages remain available from Experience and Gallery.
  if(page==='project'){
    const h1=$('.ia-page-hero h1');
    if(h1){const title=h1.textContent.trim();const og=$('meta[property="og:title"]');if(og)og.content=`${title} — VSK Electro-Mech Solutions`;}
  }
})();