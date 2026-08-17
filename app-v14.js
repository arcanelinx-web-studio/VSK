(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const page=document.body.dataset.page||'home';
  let activeDialog=null,lastFocus=null;

  function lockBody(on){document.body.classList.toggle('is-locked',on)}
  function progress(){const bar=$('[data-progress]'); if(!bar)return; const h=document.documentElement; const max=h.scrollHeight-innerHeight; bar.style.width=`${max?Math.min(100,scrollY/max*100):0}%`;}
  function headerState(){const h=$('[data-header]'); if(h)h.classList.toggle('is-scrolled',scrollY>28)}
  addEventListener('scroll',()=>{progress();headerState();},{passive:true});progress();headerState();

  // Reveals
  if(reduced){$$('.reveal').forEach(el=>el.classList.add('is-visible'));}
  else {const ro=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');ro.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -40px'});$$('.reveal').forEach(el=>ro.observe(el));}

  // Mobile navigation: closed by default, opens only on an intentional tap.
  const menu=$('[data-mobile-menu]'); const menuToggle=$('[data-menu-toggle]');
  if(menu){menu.hidden=true;menu.setAttribute('aria-hidden','true')}
  function openMenu(){if(!menu||!menu.hidden)return;menu.hidden=false;menu.setAttribute('aria-hidden','false');menuToggle?.setAttribute('aria-expanded','true');menuToggle?.setAttribute('aria-label','Close navigation');lockBody(true)}
  function closeMenu(){if(!menu)return;menu.setAttribute('aria-hidden','true');menu.hidden=true;menuToggle?.setAttribute('aria-expanded','false');menuToggle?.setAttribute('aria-label','Open navigation');if(!activeDialog)lockBody(false)}
  function toggleMenu(){if(!menu)return;menu.hidden?openMenu():closeMenu()}
  menuToggle?.addEventListener('click',toggleMenu);
  $$('[data-menu-close]').forEach(b=>b.addEventListener('click',closeMenu));
  $$('.mobile-menu nav a').forEach(a=>a.addEventListener('click',closeMenu));

  // Counts
  const countObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;countObserver.unobserve(el);if(reduced)return;const end=Number(el.dataset.count||0),suffix=el.dataset.suffix||'';const start=performance.now(),dur=650;function tick(now){const p=Math.min(1,(now-start)/dur),ease=1-Math.pow(1-p,3);el.textContent=Math.round(end*ease)+suffix;if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}),{threshold:.6});$$('[data-count]').forEach(el=>countObserver.observe(el));

  // Hero subtle parallax
  const heroImg=$('[data-hero-image]'); if(heroImg&&!reduced){addEventListener('scroll',()=>{if(scrollY<innerHeight*1.15)heroImg.style.transform=`translateY(${scrollY*.055}px) scale(1.015)`},{passive:true});}

  // Capability index
  const capImg=$('[data-capability-image]');
  if(capImg){$$('[data-capability]').forEach(btn=>{const activate=()=>{const d=capabilityData[btn.dataset.capability];if(!d)return;$$('[data-capability]').forEach(x=>x.classList.toggle('is-active',x===btn));capImg.style.opacity='.15';setTimeout(()=>{capImg.src=d.image;capImg.alt=d.alt;capImg.style.opacity='1'},120);$('[data-capability-index]').textContent=d.index;$('[data-capability-title]').textContent=d.title;$('[data-capability-copy]').textContent=d.copy;$('[data-capability-tags]').innerHTML=d.tags.map(t=>`<b>${t}</b>`).join('');};btn.addEventListener('mouseenter',activate);btn.addEventListener('focus',activate);btn.addEventListener('click',activate);});}

  // Project cards
  function projectCard(p,full=false,index=0){
    const mode=p.mediaMode||'photo';
    const pos=p.position||'center';
    const media=`<div class="${full?'project-page-media':'project-image'} media-mode-${mode}"><img src="${p.cover}" alt="${p.title}" loading="lazy" style="object-position:${pos}"></div>`;
    if(full){
      return `<button class="project-page-card project-layout-${index%6} media-card-${mode}" type="button" data-feature-open="${p.id}" id="${p.id}">${media}<div class="project-page-copy"><span>${p.code} · ${p.category}</span><h3>${p.title}</h3><p>${p.summary}</p><div class="project-page-meta"><b>VIEW ENGINEERING CASE</b><i>→</i></div></div></button>`;
    }
    return `<button class="project-card project-layout-${index%5} media-card-${mode}" type="button" data-feature-open="${p.id}" id="${p.id}">${media}<div class="project-shade"></div><span class="project-label">${p.code}</span><div class="project-copy"><div><small>${p.category}</small><strong>${p.title}</strong></div><i>↗</i></div></button>`;
  }
  const homeProjects=$('[data-home-projects]');
  if(homeProjects){
    const selected=siteProjects.filter(p=>p.id!=='rod').slice(0,5);
    homeProjects.innerHTML=selected.map((p,i)=>projectCard(p,false,i)).join('');
  }
  const projectGrid=$('[data-project-page-grid]');
  if(projectGrid){projectGrid.innerHTML=siteProjects.map((p,i)=>projectCard(p,true,i)).join('');}

  // Archive sampler
  $$('[data-sample]').forEach(btn=>{const act=()=>{const d=sampleData[btn.dataset.sample];if(!d)return;$$('[data-sample]').forEach(x=>x.classList.toggle('is-active',x===btn));const im=$('[data-sample-image]');im.style.opacity='.1';setTimeout(()=>{im.src=d.image;im.alt=d.alt;im.style.opacity='1'},100);$('[data-sample-label]').textContent=d.label;$('[data-sample-title]').textContent=d.title;};btn.addEventListener('mouseenter',act);btn.addEventListener('focus',act);btn.addEventListener('click',act);});

  // Process progress
  const processTrack=$('[data-process-track]');if(processTrack&&!reduced){const po=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const bar=$('[data-process-progress]',processTrack);let start=null;function step(ts){start??=ts;const p=Math.min(1,(ts-start)/1300);bar.style.width=`${p*100}%`;if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step);po.unobserve(processTrack)}),{threshold:.35});po.observe(processTrack)}

  // Lazy videos
  const lazyVideos=$$('[data-lazy-video]');if(lazyVideos.length){const vo=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const v=e.target;$$('source[data-src]',v).forEach(s=>{s.src=s.dataset.src;s.removeAttribute('data-src')});v.load();if(!reduced)v.play().catch(()=>{});vo.unobserve(v)}),{rootMargin:'250px'});lazyVideos.forEach(v=>vo.observe(v));}

  // Media manifest for gallery / archive. The generated archive manifest is preferred;
  // the compact media manifest and built-in portfolio keep the review package self-contained.
  let mediaManifestPromise=null;
  function compactManifestToGroups(data){
    if(!data?.images?.length)return null;
    const groups=new Map();
    const label=(source='')=>{
      const parts=source.replace(/^assets-source\//,'').split('/');
      return parts.length>1?parts.slice(0,-1).join('/'):'Engineering details';
    };
    data.images.forEach(item=>{
      const key=label(item.source),id=key.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      if(!groups.has(id))groups.set(id,{id,title:key.split('/').pop().replace(/\b\w/g,c=>c.toUpperCase()),category:'VSK Engineering',items:[]});
      groups.get(id).items.push({type:'image',src:item.output,thumb:item.output,source:item.source,width:item.dimensions?.[0],height:item.dimensions?.[1],caption:'Project view'});
    });
    return {summary:{groups:groups.size,images:data.images.length,videos:0},groups:[...groups.values()]};
  }
  function getMediaManifest(){
    if(!mediaManifestPromise)mediaManifestPromise=fetch('media/archive-manifest.json',{cache:'no-store'})
      .then(r=>{if(!r.ok)throw new Error('full manifest unavailable');return r.json()})
      .catch(()=>fetch('media/media-manifest.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(compactManifestToGroups))
      .then(m=>m?.groups?.length?m:galleryFallback)
      .catch(()=>galleryFallback);
    return mediaManifestPromise;
  }

  // Visual Archive: every reference carries a real VSK image.
  // Exact project folders are used when identified; otherwise photographs rotate through
  // the closest VSK capability area without claiming an unverified project attribution.
  let archiveGroupItems={},archiveCategoryPools={};
  const archiveExactGroups={
    spm07:'vertical-turning-cnc-machine',spm09:'rod-boring-machine',
    spm11:'4-servo-seal-slotting-machine',spm12:'4-servo-seal-slotting-machine',spm13:'4-servo-seal-slotting-machine',spm14:'4-servo-seal-slotting-machine',
    spm20:'air-leak-testing-machine',spm27:'epoxy-painting-machine-eor-washer',spm35:'paint-aggitating-machine',
    rtf09:'retrofitted-machine-jig-grinding-machine',rtf11:'retrofitted-machine-kelingberg-od-grinding-machine'
  };
  const fallbackPools={
    handling:['media/legacy/centerless-conveyor.webp','media/projects/u-drill.webp','media/cases/slotting-main.webp','media/legacy/enclosed-machine.webp'],
    turning:['media/projects/vertical-turning.webp','media/projects/rod-boring.webp','media/legacy/metal-facing-machine.webp','media/legacy/table-top-lathe.webp','media/legacy/spindle-interface.webp'],
    pressing:['media/legacy/enclosed-machine.webp','media/legacy/spindle-interface.webp','media/cases/air-leak-detail.webp','media/projects/paint-agitating.webp'],
    cutting:['media/projects/z-cut.webp','media/projects/u-drill.webp','media/cases/slotting-main.webp','media/cases/slotting-detail.webp'],
    testing:['media/cases/air-leak-main.webp','media/cases/air-leak-detail.webp','media/projects/air-leak.webp'],
    finishing:['media/legacy/paint-agitating-machine.webp','media/motion/electric-oven.webp','media/legacy/metal-facing-machine.webp','media/projects/paint-agitating.webp'],
    controls:['media/retrofit/jig-grinding.webp','media/motion/kellenberg-still.webp','media/cases/jig-main.webp','media/legacy/spindle-interface.webp'],
    grinding:['media/retrofit/kellenberg.webp','media/retrofit/jig-grinding.webp','media/legacy/wheel-balancing-unit.webp','media/motion/kellenberg-still.webp']
  };
  const groupCategoryHints={
    'vertical-turning-cnc-machine':['turning'],'rod-boring-machine':['turning'],
    'u-drill-machine':['cutting','handling'],'single-spindle-u-drill-machine':['cutting','handling'],
    '4-servo-seal-slotting-machine':['cutting','handling'],'air-leak-testing-machine':['testing'],
    'z-cut-machine':['cutting'],'epoxy-painting-machine-eor-washer':['finishing'],
    'laptop-panel-painting-mc':['finishing'],'paint-aggitating-machine':['finishing'],
    'electric-oven':['finishing'],'retrofitted-machine-jig-grinding-machine':['grinding','controls'],
    'retrofitted-machine-kelingberg-od-grinding-machine':['grinding','controls']
  };
  function itemSrc(item){return item?.thumb||item?.poster||item?.src||item?.src_mp4||''}
  function archiveManifestCover(m){
    const gid=archiveExactGroups[m.id],items=gid?archiveGroupItems[gid]:null;
    if(!items?.length)return '';
    const n=parseInt(m.id.slice(3),10)||0;
    return itemSrc(items[n%items.length]);
  }
  function archiveImageFor(m){
    if(m.media?.length)return m.media[0];
    const exact=archiveManifestCover(m);if(exact)return exact;
    const pool=archiveCategoryPools[m.category]?.length?archiveCategoryPools[m.category]:fallbackPools[m.category]||fallbackPools.controls;
    const n=parseInt(m.id.slice(3),10)||0,typeOffset=m.type==='retrofit'?11:0;
    const item=pool[(n+typeOffset)%pool.length];
    return typeof item==='string'?item:itemSrc(item);
  }
  function archiveImageIsExact(m){return !!(m.media?.length||archiveManifestCover(m))}

  // Additional source folders on projects page
  if($('[data-additional-projects]')){getMediaManifest().then(man=>{const represented=new Set(['slotting-machine','4-servo-seal-slotting-machine','air-leak-testing','air-leak-testing-machine','rod-boring','rod-boring-machine','vertical-turning','vertical-turning-cnc-machine','z-cut','z-cut-machine','u-drill','u-drill-machine','paint-agitating','paint-aggitating-machine','jig-grinding','hauser-jig-grinding','kellenberg','kellenberg-od-grinding-machine','electric-oven']);const groups=(man.groups||[]).filter(g=>!represented.has(g.id)&&g.items?.length);if(!groups.length)return;const section=$('[data-additional-projects-section]');section.hidden=false;const root=$('[data-additional-projects]');root.innerHTML=groups.slice(0,12).map(g=>{const first=g.items.find(i=>i.type==='image')||g.items[0];const thumb=first.thumb||first.poster||first.src;return `<a class="additional-project-card" href="gallery.html?group=${encodeURIComponent(g.id)}"><img src="${thumb}" alt="${g.title}" loading="lazy"><div><span>${g.category||'ENGINEERING PROJECT'} · ${g.items.length} MEDIA</span><strong>${g.title}</strong></div></a>`}).join('');});}

  // Dossier
  const dossier=$('[data-dossier]');let dossierSequence=[],dossierIndex=0;
  function codeFromMachine(m){const n=m.id.slice(3).padStart(2,'0');return `${m.type==='retrofit'?'RTF':'SPM'} / ${n}`}
  function genericFeature(m){
    const exact=archiveImageIsExact(m);
    return {
      title:m.title,type:archiveTypeName[m.type],index:codeFromMachine(m),
      summary:m.note||`${m.title} forms part of VSK’s machine-building and retrofit experience.`,
      media:[archiveImageFor(m)],
      facts:[['Reference',codeFromMachine(m)],['Application',categoryNames[m.category]||m.category],...(m.customer?[['Customer',m.customer]]:[]),...(m.control?[['Control',m.control]]:[])],
      sections:[
        ['Engineering scope',m.note||`Relevant experience across ${categoryNames[m.category]||m.category} applications.`],
        ['Machine view',exact?'The visual shown belongs to this recorded project or machine family.':'The visual is from related VSK work in the same engineering capability area.']
      ]
    }
  }
  function mediaMode(src){
    const low=(src||'').toLowerCase();
    if(low.includes('slotting')||low.includes('air-leak'))return 'technical';
    if(low.includes('z-cut')||low.includes('vertical-turning')||low.includes('jig-grinding')||low.includes('paint-agitating'))return 'portrait';
    return 'photo';
  }
  function findFeature(id){if(featureData[id])return featureData[id];const m=machineArchive.find(x=>x.id===id);if(m?.featureId&&featureData[m.featureId])return {...featureData[m.featureId],index:codeFromMachine(m)};return m?genericFeature(m):null}
  function renderDossier(id){
    const d=findFeature(id);if(!d||!dossier)return;
    const pos=dossierSequence.indexOf(id);dossierIndex=pos>=0?pos:0;
    $('[data-dossier-kicker]',dossier).textContent=d.type||'ENGINEERING REFERENCE';
    $('[data-dossier-id]',dossier).textContent=d.index||'VSK PROJECT';
    $('[data-dossier-title]',dossier).textContent=d.title;
    $('[data-dossier-summary]',dossier).textContent=d.summary||'';
    $('[data-dossier-position]',dossier).textContent=dossierSequence.length?`${dossierIndex+1} / ${dossierSequence.length}`:'';
    $('[data-dossier-facts]',dossier).innerHTML=(d.facts||[]).map(([a,b])=>`<div><span>${a}</span><strong>${b}</strong></div>`).join('');
    $('[data-dossier-sections]',dossier).innerHTML=(d.sections||[]).map(([h,p])=>`<article><h3>${h}</h3><p>${p}</p></article>`).join('');
    const media=$('[data-dossier-media]',dossier);let html='';
    (d.media||[]).forEach((src,i)=>{const mode=mediaMode(src);html+=`<figure class="dossier-media-item media-mode-${mode}"><img src="${src}" alt="${d.title}${i?` — project view ${i+1}`:''}" loading="${i?'lazy':'eager'}"></figure>`});
    if(d.video && !d.video.includes('electric-oven'))html+=`<figure class="dossier-media-item dossier-video"><video controls muted playsinline poster="${(d.media||[])[0]||''}"><source src="${d.video}" type="video/webm"></video></figure>`;
    if(!html)html=`<figure class="dossier-media-item media-mode-photo"><img src="media/legacy/enclosed-machine.webp" alt="VSK engineering work" loading="eager"></figure>`;
    media.innerHTML=html;
  }
  function openDossier(id,sequence){if(!dossier)return;dossierSequence=sequence?.length?sequence:[id];renderDossier(id);lastFocus=document.activeElement;dossier.hidden=false;dossier.setAttribute('aria-hidden','false');activeDialog='dossier';lockBody(true);$('.dossier-panel',dossier)?.focus()}
  function closeDossier(){if(!dossier)return;dossier.setAttribute('aria-hidden','true');dossier.hidden=true;activeDialog=null;lockBody(false);lastFocus?.focus?.()}
  function moveDossier(dir){if(!dossierSequence.length)return;dossierIndex=(dossierIndex+dir+dossierSequence.length)%dossierSequence.length;renderDossier(dossierSequence[dossierIndex])}
  document.addEventListener('click',e=>{const t=e.target.closest('[data-feature-open]');if(t){const id=t.dataset.featureOpen;const seq=page==='projects'?siteProjects.map(p=>p.id):siteProjects.map(p=>p.id);openDossier(id,seq)}});$$('[data-dossier-close]').forEach(b=>b.addEventListener('click',closeDossier));$$('[data-dossier-prev]').forEach(b=>b.addEventListener('click',()=>moveDossier(-1)));$$('[data-dossier-next]').forEach(b=>b.addEventListener('click',()=>moveDossier(1)));

  // Archive browser
  if(page==='machines')initArchive();
  function initArchive(){let mode='index',type='all',query='',cat='',tech='';let current=[];const url=new URL(location.href);query=url.searchParams.get('q')||'';type=url.searchParams.get('type')||'all';const search=$('[data-archive-search]');if(search)search.value=query;$$('[data-type-filter]').forEach(b=>b.classList.toggle('is-active',b.dataset.typeFilter===type));
    const catRoot=$('[data-category-filters]');catRoot.innerHTML=Object.entries(categoryNames).map(([k,v])=>`<button type="button" data-category-filter="${k}">${v}</button>`).join('');
    function matches(m){const text=[m.title,m.customer,m.control,m.note,categoryNames[m.category]].filter(Boolean).join(' ').toLowerCase();const techText=[m.title,m.control,m.note].filter(Boolean).join(' ').toLowerCase();return(type==='all'||m.type===type)&&(!query||text.includes(query.toLowerCase()))&&(!cat||m.category===cat)&&(!tech||techText.includes(tech));}
    function draw(){current=machineArchive.filter(matches);const result=$('[data-result-count]');result.textContent=`${current.length} reference${current.length===1?'':'s'}`;const empty=$('[data-archive-empty]');empty.hidden=current.length>0;const index=$('[data-archive-index]');const visual=$('[data-archive-visual-view]');
      index.innerHTML=current.map((m,i)=>`<button class="archive-row${i===0?' is-active':''}" type="button" data-machine-id="${m.id}"><span>${codeFromMachine(m)}</span><strong>${m.title}</strong><small>${m.customer||m.control||categoryNames[m.category]||''}</small><i>→</i></button>`).join('');
      const vm=current;visual.innerHTML=vm.map(m=>`<button class="archive-visual-card" type="button" data-machine-open="${m.id}"><div class="archive-visual-media media-mode-${mediaMode(archiveImageFor(m))}"><img src="${archiveImageFor(m)}" alt="${m.title}" loading="lazy"></div><div><span>${codeFromMachine(m)} · ${categoryNames[m.category]||''}</span><strong>${m.title}</strong><small>${m.customer||m.control||archiveTypeName[m.type]}</small></div></button>`).join('');$('[data-visual-count]').textContent=machineArchive.length;
      const active=[];if(type!=='all')active.push(type==='spm'?'Custom / SPM':'Retrofit');if(cat)active.push(categoryNames[cat]);if(tech)active.push(tech.toUpperCase());if(query)active.push(`“${query}”`);const activeEl=$('[data-active-filters]');if(activeEl)activeEl.textContent=active.length?active.join(' · '):'All applications · All technologies';
      if(current[0])updatePreview(current[0]);$$('[data-machine-id]').forEach(btn=>{const m=machineArchive.find(x=>x.id===btn.dataset.machineId);const act=()=>{$$('[data-machine-id]').forEach(x=>x.classList.toggle('is-active',x===btn));updatePreview(m)};btn.addEventListener('mouseenter',act);btn.addEventListener('focus',act);btn.addEventListener('click',()=>openDossier(m.featureId||m.id,current.map(x=>x.featureId||x.id)))});$$('[data-machine-open]').forEach(btn=>btn.addEventListener('click',()=>{const m=machineArchive.find(x=>x.id===btn.dataset.machineOpen);openDossier(m.featureId||m.id,current.map(x=>x.featureId||x.id))}));
    }
    function updatePreview(m){
      const box=$('[data-archive-preview-media]');
      box.className=`archive-preview-media media-mode-${mediaMode(archiveImageFor(m))}`;box.innerHTML=`<img src="${archiveImageFor(m)}" alt="${m.title}">`;
      $('[data-archive-preview-code]').textContent=`${codeFromMachine(m)} · ${(categoryNames[m.category]||'').toUpperCase()}`;
      $('[data-archive-preview-title]').textContent=m.title;
      const context=archiveImageIsExact(m)?'Project-specific machine view.':'Related VSK engineering work from the same capability is shown for context.';
      $('[data-archive-preview-copy]').textContent=`${m.note||`${m.title} within VSK’s engineering experience.`} ${context}`;
      const open=$('[data-archive-preview-open]');open.onclick=()=>openDossier(m.featureId||m.id,current.map(x=>x.featureId||x.id));
    }
    function setMode(next){mode=next;$$('[data-archive-mode]').forEach(b=>b.classList.toggle('is-active',b.dataset.archiveMode===mode));$('[data-archive-index-view]').hidden=mode!=='index';$('[data-archive-visual-view]').hidden=mode!=='visual';}
    $$('[data-archive-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.archiveMode)));$$('[data-type-filter]').forEach(b=>b.addEventListener('click',()=>{type=b.dataset.typeFilter;$$('[data-type-filter]').forEach(x=>x.classList.toggle('is-active',x===b));draw()}));search?.addEventListener('input',()=>{query=search.value.trim();draw()});catRoot.addEventListener('click',e=>{const b=e.target.closest('[data-category-filter]');if(!b)return;cat=cat===b.dataset.categoryFilter?'':b.dataset.categoryFilter;$$('[data-category-filter]').forEach(x=>x.classList.toggle('is-active',x.dataset.categoryFilter===cat));draw()});$$('[data-tech-filter]').forEach(b=>b.addEventListener('click',()=>{tech=tech===b.dataset.techFilter?'':b.dataset.techFilter;$$('[data-tech-filter]').forEach(x=>x.classList.toggle('is-active',x.dataset.techFilter===tech));draw()}));const panel=$('[data-filter-panel]');$('[data-filter-toggle]')?.addEventListener('click',()=>{panel.hidden=!panel.hidden});$$('[data-clear-filters]').forEach(b=>b.addEventListener('click',()=>{type='all';query=cat=tech='';search.value='';$$('[data-type-filter]').forEach(x=>x.classList.toggle('is-active',x.dataset.typeFilter==='all'));$$('[data-category-filter],[data-tech-filter]').forEach(x=>x.classList.remove('is-active'));draw()}));draw();setMode('index');getMediaManifest().then(man=>{
      archiveGroupItems={};archiveCategoryPools={};
      (man.groups||[]).forEach(g=>{
        const images=(g.items||[]).filter(i=>i.type==='image');
        if(images.length)archiveGroupItems[g.id]=images;
        (groupCategoryHints[g.id]||[]).forEach(cat=>{
          archiveCategoryPools[cat]??=[];
          archiveCategoryPools[cat].push(...images);
        });
      });
      draw();
    });
  }

  // Gallery — render immediately from packaged media, then enhance from the full manifest.
  if(page==='gallery')initGallery();
  function initGallery(){
    let manifest=galleryFallback,filter='all',flat=[];
    const root=$('[data-gallery-grid]'),list=$('[data-gallery-filter-list]'),lightbox=$('[data-lightbox]');
    let li=0;
    if(!root)return;

    function mediaClass(it){
      const w=Number(it.width||0),h=Number(it.height||0),low=`${it.source||''} ${it.caption||''} ${it.groupId||''}`.toLowerCase();
      if(low.includes('dimension')||low.includes('slotting')||low.includes('air-leak')||low.includes('fixture section'))return 'is-technical';
      if(h&&w&&h/w>1.28)return 'is-portrait';
      return 'is-photo';
    }
    function mediaThumb(it,index){
      const thumb=it.thumb||it.poster||it.src,cls=mediaClass(it),kind=it.type==='video'?'VIDEO':cls==='is-technical'?'TECHNICAL':'PHOTO';
      const media=it.type==='video'
        ? `<img src="${thumb}" alt="${it.groupTitle} — ${it.caption||'machine video'}" loading="lazy"><span class="gallery-video-badge">PLAY ▶</span>`
        : `<img src="${thumb}" alt="${it.groupTitle} — ${it.caption||'project image'}" loading="lazy">`;
      return `<button class="gallery-tile ${cls}" type="button" data-gallery-item="${index}">${media}<span class="gallery-kind">${kind}</span><span class="gallery-tile-caption"><b>${String((it.index??0)+1).padStart(2,'0')}</b>${it.caption||'Project view'}<i>↗</i></span></button>`;
    }
    function summary(){
      const groups=manifest.groups||[],sum=manifest.summary||{};
      const images=sum.images||groups.reduce((n,g)=>n+(g.items||[]).filter(i=>i.type==='image').length,0);
      const videos=sum.videos||groups.reduce((n,g)=>n+(g.items||[]).filter(i=>i.type==='video').length,0);
      const gc=sum.groups||groups.length;
      const g=$('[data-gallery-group-count]'),im=$('[data-gallery-image-count]'),v=$('[data-gallery-video-count]');
      if(g)g.textContent=`${gc} project groups`;if(im)im.textContent=`${images} images`;if(v)v.textContent=`${videos} video${videos===1?'':'s'}`;
    }
    function buildFilters(){
      if(!list)return;
      list.innerHTML=(manifest.groups||[]).map(g=>`<button type="button" data-gallery-filter="${g.id}">${g.title} <b>${g.items.length}</b></button>`).join('');
      $$('[data-gallery-filter]',list).forEach(b=>b.classList.toggle('is-active',b.dataset.galleryFilter===filter));
    }
    function setFilter(f){
      filter=f;
      $$('[data-gallery-filter]').forEach(b=>b.classList.toggle('is-active',b.dataset.galleryFilter===filter));
      render();
      try{history.replaceState(null,'',filter==='all'?'gallery.html':`gallery.html?group=${encodeURIComponent(filter)}`)}catch(_){}
    }
    function render(){
      const allGroups=manifest.groups||[];
      const groups=filter==='all'?allGroups:allGroups.filter(g=>g.id===filter);
      flat=[];
      groups.forEach(g=>(g.items||[]).forEach((item,i)=>flat.push({...item,groupId:g.id,groupTitle:g.title,category:g.category||'Engineering project',index:i})));
      const status=$('[data-gallery-status]');if(status)status.textContent=`${flat.length} media item${flat.length===1?'':'s'} · ${groups.length} project group${groups.length===1?'':'s'}`;
      let flatIndex=0;
      root.innerHTML=groups.map((g,groupIndex)=>{
        const items=(g.items||[]).map((item,i)=>({...item,groupId:g.id,groupTitle:g.title,category:g.category||'Engineering project',index:i}));
        const tiles=items.map(it=>mediaThumb(it,flatIndex++)).join('');
        return `<section class="gallery-project-group ${groupIndex===0?'is-featured':''}"><header><div><span>${String(groupIndex+1).padStart(2,'0')} · ${g.category||'ENGINEERING PROJECT'}</span><h3>${g.title}</h3></div><strong>${items.length} MEDIA</strong></header><div class="gallery-project-media">${tiles}</div></section>`;
      }).join('');
      $$('[data-gallery-item]',root).forEach(b=>b.addEventListener('click',()=>openLightbox(Number(b.dataset.galleryItem))));
    }
    function openLightbox(i){if(!lightbox||!flat[i])return;li=i;renderLightbox();lastFocus=document.activeElement;lightbox.hidden=false;lightbox.setAttribute('aria-hidden','false');activeDialog='lightbox';lockBody(true);$('.lightbox-panel')?.focus()}
    function renderLightbox(){
      const it=flat[li];if(!it)return;
      $('[data-lightbox-group]').textContent=it.groupTitle;$('[data-lightbox-count]').textContent=`${li+1} / ${flat.length}`;$('[data-lightbox-title]').textContent=it.caption||it.groupTitle;$('[data-lightbox-caption]').textContent=`${it.category} · ${it.groupTitle}`;
      const box=$('[data-lightbox-media]');
      if(it.type==='video')box.innerHTML=`<video controls autoplay muted playsinline poster="${it.poster||it.thumb||''}">${it.src_webm?`<source src="${it.src_webm}" type="video/webm">`:''}${it.src_mp4?`<source src="${it.src_mp4}" type="video/mp4">`:''}</video>`;
      else box.innerHTML=`<img src="${it.src}" alt="${it.groupTitle} — ${it.caption||'project image'}">`;
    }
    function closeLightbox(){if(!lightbox)return;lightbox.setAttribute('aria-hidden','true');lightbox.hidden=true;activeDialog=null;lockBody(false);lastFocus?.focus?.()}
    function move(n){if(!flat.length)return;li=(li+n+flat.length)%flat.length;renderLightbox()}

    const requested=(()=>{try{return new URL(location.href).searchParams.get('group')}catch(_){return null}})();
    if(requested&&(manifest.groups||[]).some(g=>g.id===requested))filter=requested;
    summary();buildFilters();render();
    list?.addEventListener('click',e=>{const b=e.target.closest('[data-gallery-filter]');if(b)setFilter(b.dataset.galleryFilter)});
    $('.gallery-filter')?.addEventListener('click',()=>setFilter('all'));
    $$('[data-lightbox-close]').forEach(b=>b.addEventListener('click',closeLightbox));
    $('[data-lightbox-prev]')?.addEventListener('click',()=>move(-1));$('[data-lightbox-next]')?.addEventListener('click',()=>move(1));
    if(lightbox){lightbox._move=move;lightbox._close=closeLightbox;}

    // Upgrade with the full generated archive when available. The fallback above always remains usable.
    getMediaManifest().then(m=>{
      if(!m?.groups?.length)return;
      manifest=m;
      if(filter!=='all'&&!manifest.groups.some(g=>g.id===filter))filter='all';
      summary();buildFilters();render();
    }).catch(()=>{});
  }

  // V16 mobile sticky CTA — stay clear of the hero, appear after it.
  const mobileSticky=$('.mobile-sticky-cta'); const heroSection=$('#hero');
  if(mobileSticky&&heroSection){
    const setStickyReady=(ready)=>{
      mobileSticky.classList.toggle('is-ready',ready);
      mobileSticky.setAttribute('aria-hidden',ready?'false':'true');
      mobileSticky.tabIndex=ready?0:-1;
    };
    const syncSticky=()=>{
      const heroBottom=heroSection.offsetTop+heroSection.offsetHeight;
      const triggerLine=scrollY+Math.max(110,innerHeight*.12);
      setStickyReady(triggerLine>=heroBottom);
    };
    const heroObserver=new IntersectionObserver(entries=>{
      const entry=entries[0];
      if(!entry)return;
      if(!entry.isIntersecting&&scrollY>0)setStickyReady(true);
      else syncSticky();
    },{threshold:.01});
    heroObserver.observe(heroSection);
    addEventListener('scroll',()=>requestAnimationFrame(syncSticky),{passive:true});
    addEventListener('resize',syncSticky,{passive:true});
    syncSticky();
  }

  // Quote workflow
  const quote=$('[data-quote-panel]');let qStep=1,qType='';
  function showQStep(n){qStep=n;$$('[data-step]',quote).forEach(s=>s.classList.toggle('is-active',Number(s.dataset.step)===n));$$('.quote-progress i',quote).forEach((d,i)=>d.classList.toggle('is-active',i<n));$('[data-quote-count]',quote).textContent=`0${n} / 04`}
  function openQuote(){if(!quote)return;lastFocus=document.activeElement;quote.hidden=false;quote.setAttribute('aria-hidden','false');activeDialog='quote';lockBody(true);showQStep(1);$('.quote-panel',quote)?.focus()}
  function closeQuote(){if(!quote)return;quote.hidden=true;quote.setAttribute('aria-hidden','true');activeDialog=null;lockBody(false);lastFocus?.focus?.()}
  $$('[data-quote-open]').forEach(b=>b.addEventListener('click',()=>{closeMenu();openQuote()}));$$('[data-quote-close]').forEach(b=>b.addEventListener('click',closeQuote));$$('[data-type]',quote).forEach(b=>b.addEventListener('click',()=>{qType=b.dataset.type;showQStep(2)}));$$('[data-quote-next]',quote).forEach(b=>b.addEventListener('click',()=>{if(qStep===2){const ta=$('textarea[name=requirement]',quote);if(!ta.value.trim()){ta.focus();return}}showQStep(Math.min(4,qStep+1))}));$$('[data-quote-prev]',quote).forEach(b=>b.addEventListener('click',()=>showQStep(Math.max(1,qStep-1))));const file=$('[data-quote-file]',quote);file?.addEventListener('change',()=>{$('[data-file-text]',quote).textContent=file.files?.[0]?.name||'No file selected'});
  const qForm=$('[data-quote-form]',quote);qForm?.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(qForm),name=(fd.get('name')||'').trim(),email=(fd.get('email')||'').trim(),phone=(fd.get('phone')||'').trim(),req=(fd.get('requirement')||'').trim();const err=$('[data-form-error]',quote);if(!name){err.textContent='Please enter your name.';return}if(!/^\S+@\S+\.\S+$/.test(email)){err.textContent='Please enter a valid email address.';return}if(!/^\d{10}$/.test(phone)){err.textContent='Phone number must contain exactly 10 digits.';return}err.textContent='';const company=(fd.get('company')||'').trim();const drawing=file?.files?.[0]?.name||'No file selected';const text=`VSK Engineering Requirement\n\nType: ${qType||'General Requirement'}\nName: ${name}\nCompany: ${company||'-'}\nEmail: ${email}\nPhone: ${phone}\nDrawing selected: ${drawing}\n\nRequirement:\n${req}`;const subject=encodeURIComponent(`Engineering Requirement — ${company||name}`),body=encodeURIComponent(text);$('[data-mail-link]',quote).href=`mailto:vsk.electromech@gmail.com?subject=${subject}&body=${body}`;const wa=$('[data-whatsapp-link]',quote);if(wa)wa.href=`https://wa.me/919880336714?text=${encodeURIComponent(text)}`;$('[data-quote-success]',quote).hidden=false;$$('[data-step]',quote).forEach(s=>s.classList.remove('is-active'));$('.quote-head',quote).style.display='none';const copy=$('[data-copy-enquiry]',quote);copy.onclick=()=>navigator.clipboard?.writeText(text);});

  // Keyboard handling
  addEventListener('keydown',e=>{if(e.key==='Escape'){if(activeDialog==='dossier')closeDossier();else if(activeDialog==='quote')closeQuote();else if(activeDialog==='lightbox')$('[data-lightbox]')?._close?.();else closeMenu()}if(activeDialog==='dossier'&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();moveDossier(e.key==='ArrowLeft'?-1:1)}if(activeDialog==='lightbox'&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();$('[data-lightbox]')?._move?.(e.key==='ArrowLeft'?-1:1)}});
})();
