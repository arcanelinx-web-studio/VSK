(() => {
  'use strict';
  if (document.body.dataset.page !== 'machines') return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const archive = typeof machineArchive !== 'undefined' && Array.isArray(machineArchive) ? machineArchive : [];
  if (!archive.length) return;

  const categoryLabels = {
    handling:'Automation & handling',turning:'Turning & boring',pressing:'Hydraulics & pressing',
    cutting:'Cutting & machining',testing:'Testing & inspection',finishing:'Finishing & process equipment',
    controls:'Controls & systems',grinding:'Grinding & retrofit'
  };
  const params = new URL(location.href).searchParams;
  const requestedType = params.get('type');
  const state = {
    type:['all','spm','retrofit'].includes(requestedType) ? requestedType : 'all',
    query:params.get('q') || '', category:'', tech:'', current:[], activeId:''
  };
  let manifestGroups = [], validPaths = null;

  const aliases = {
    spm03:['spigot','turning'],spm04:['motor','flange','facing'],spm05:['hydraulic','press','transtech'],
    spm07:['vertical','turning'],spm09:['rod','boring'],spm11:['2','axis','notching'],spm12:['4','servo','slotting'],
    spm20:['air','leak','testing'],spm22:['drilling','chamfering'],spm27:['epoxy','painting'],spm35:['paint','agitating'],
    spm36:['control','panel','honing'],rtf09:['jig','grinding'],rtf11:['kellenberg','grinding'],rtf14:['hardinge','t40'],rtf15:['hyundai','sa160']
  };
  const verifiedCurated = new Set(['spm02','spm07','spm09','spm11','spm12','spm20','spm34','spm35','rtf09','rtf11']);
  const stopWords = new Set(['machine','machines','mc','cnc','spm','unit','system','systems','with','and','for','the','type','controlled','control','plc','hmi','servo','retrofit','retrofitted','retrofitting','service','new','project']);
  const relatedPools = {
    handling:['media/legacy/centerless-conveyor.webp','media/projects/u-drill.webp','media/projects/slotting.webp'],
    turning:['media/projects/vertical-turning.webp','media/projects/rod-boring.webp','media/legacy/metal-facing-machine.webp'],
    pressing:['media/v16/images/hydraulic-systems-and-pressing-units/hydraulic-press-transtech-gear/20230216-094120.webp','media/cases/air-leak-detail.webp','media/legacy/spindle-interface.webp'],
    cutting:['media/projects/z-cut.webp','media/projects/u-drill.webp','media/cases/slotting-main.webp'],
    testing:['media/cases/air-leak-main.webp','media/cases/air-leak-detail.webp','media/projects/air-leak.webp'],
    finishing:['media/projects/paint-agitating.webp','media/motion/electric-oven.webp','media/legacy/metal-facing-machine.webp'],
    controls:['media/retrofit/jig-grinding.webp','media/v16/images/spm-machines-plc-hmi-and-servo-controlled/control-panel-honning-machine/20250416-215953.webp','media/legacy/spindle-interface.webp'],
    grinding:['media/retrofit/kellenberg.webp','media/retrofit/jig-grinding.webp','media/legacy/wheel-balancing-unit.webp']
  };

  const normalize = value => String(value||'').toLowerCase()
    .replace(/hundai/g,'hyundai').replace(/kelingberg/g,'kellenberg').replace(/honning/g,'honing').replace(/aggitating/g,'agitating')
    .replace(/[^a-z0-9]+/g,' ').trim();
  const tokens = value => normalize(value).split(/\s+/).filter(Boolean).filter(t=>!stopWords.has(t));
  const cleanPath = p => String(p||'').replace(/^\.\//,'');
  const pathExists = p => !validPaths || validPaths.has(cleanPath(p));
  const code = m => `${m.type==='retrofit'?'RTF':'SPM'} / ${String(m.id?.slice(3)||'').padStart(2,'0')}`;
  const label = m => categoryLabels[m.category] || m.category || 'Machine engineering';

  function scoreGroup(m,g){
    const wanted=aliases[m.id] || tokens(`${m.title} ${m.customer||''}`);
    const got=tokens(`${g.title||''} ${g.project||''} ${g.path||''}`);
    if(!wanted.length || !got.length) return 0;
    const common=wanted.filter(t=>got.includes(t));
    if(!common.some(t=>t.length>2)) return 0;
    return common.length / Math.max(2,Math.min(wanted.length,got.length));
  }
  function groupFor(m){
    let best=null,bestScore=0;
    manifestGroups.forEach(g=>{const s=scoreGroup(m,g);if(s>bestScore){best=g;bestScore=s;}});
    return bestScore>=0.58 ? best : null;
  }
  function featureFor(m){
    if(typeof featureData!=='undefined' && m.featureId && featureData[m.featureId]) return featureData[m.featureId];
    if(typeof featureData!=='undefined' && featureData[m.id]) return featureData[m.id];
    return null;
  }
  function groupMedia(group){
    if(!group?.items?.length) return [];
    const images=group.items
      .map(i=>i.type==='image' ? (i.src||i.web||i.thumb||'') : '')
      .filter(src=>src&&pathExists(src)).map(src=>({type:'image',src}));
    const videos=group.items.filter(i=>i.type==='video').map(i=>{
      const src=[i.src_mp4,i.src,i.web].find(p=>p&&pathExists(p)) || '';
      const poster=[i.poster,i.thumb].find(p=>p&&pathExists(p)) || '';
      return src ? {type:'video',src,poster} : null;
    }).filter(Boolean);
    return [...images,...videos];
  }
  function exactMedia(m){
    const group=groupFor(m),items=groupMedia(group);
    if(items.length) return {items,source:'source-folder',group};
    if(verifiedCurated.has(m.id)){
      const f=featureFor(m);
      if(f?.media?.length){
        const curated=f.media.filter(pathExists).map(src=>({type:'image',src}));
        if(curated.length) return {items:curated,source:'curated'};
      }
      if(m.media?.length){
        const reference=m.media.filter(pathExists).map(src=>({type:'image',src}));
        if(reference.length) return {items:reference,source:'reference'};
      }
    }
    return {items:[],source:'unpublished'};
  }
  function relatedImage(m){
    const pool=(relatedPools[m.category]||relatedPools.controls).filter(pathExists);
    if(!pool.length) return 'media/legacy/spindle-interface.webp';
    const n=parseInt(m.id.slice(3),10)||0, offset=m.type==='retrofit'?2:0;
    return pool[(n+offset)%pool.length];
  }
  function visualFor(m){
    const exact=exactMedia(m);
    const image=exact.items.find(i=>i.type==='image');
    if(image) return {src:image.src,exact:true,media:exact};
    const video=exact.items.find(i=>i.type==='video'&&i.poster);
    if(video) return {src:video.poster,exact:true,media:exact};
    const src=relatedImage(m);
    return {src,exact:false,media:{items:[{type:'image',src,related:true}],source:'related'}};
  }
  const matches=m=>{
    const text=[m.title,m.customer,m.control,m.note,label(m)].filter(Boolean).join(' ').toLowerCase();
    const techText=[m.title,m.control,m.note].filter(Boolean).join(' ').toLowerCase();
    return (state.type==='all'||m.type===state.type)
      &&(!state.query||text.includes(state.query.toLowerCase()))
      &&(!state.category||m.category===state.category)
      &&(!state.tech||techText.includes(state.tech));
  };

  function ensureIndexLayout(){
    const indexLayout=$('[data-archive-index-view]');
    const visual=$('[data-archive-visual-view]');
    const oldShowcase=$('[data-experience-media-section]');
    if(oldShowcase) oldShowcase.remove();
    if(indexLayout){indexLayout.hidden=false;indexLayout.setAttribute('aria-hidden','false');}
    if(visual){visual.hidden=true;visual.setAttribute('aria-hidden','true');visual.innerHTML='';visual.classList.remove('experience-visual-grid');}
  }

  function updatePreview(m){
    if(!m) return;
    state.activeId=m.id;
    $$('[data-machine-id]').forEach(row=>row.classList.toggle('is-active',row.dataset.machineId===m.id));
    const visual=visualFor(m), media=$('[data-archive-preview-media]');
    if(media){
      const badge=visual.exact?'PROJECT-SPECIFIC MEDIA':'RELATED VSK WORK';
      media.innerHTML=`<div class="archive-preview-visual"><img src="${visual.src}" alt="${visual.exact?m.title:`Related VSK ${label(m)} work`}"><span class="archive-preview-badge${visual.exact?' is-exact':''}">${badge}</span></div>`;
    }
    const c=$('[data-archive-preview-code]'); if(c)c.textContent=`${code(m)} · ${label(m).toUpperCase()}`;
    const t=$('[data-archive-preview-title]'); if(t)t.textContent=m.title;
    const p=$('[data-archive-preview-copy]');
    if(p)p.textContent=visual.exact
      ? 'Project-specific VSK media is available for this reference. Compare the application, machine arrangement and controls with your own requirement.'
      : 'This is a documented VSK reference. The preview uses related VSK work from the same capability area because project-specific media is not published for this machine.';
    const open=$('[data-archive-preview-open]'); if(open)open.textContent='Open experience details →';
  }

  function render(){
    ensureIndexLayout();
    state.current=archive.filter(matches);
    const index=$('[data-archive-index]');
    if(index){
      index.innerHTML=state.current.map((m,i)=>`<button class="archive-row${m.id===state.activeId||(!state.activeId&&i===0)?' is-active':''}" type="button" data-machine-id="${m.id}"><span>${code(m)}</span><strong>${m.title}</strong><small>${m.customer||m.control||label(m)}</small><i>→</i></button>`).join('');
    }
    const count=$('[data-result-count]');if(count)count.textContent=`${state.current.length} result${state.current.length===1?'':'s'}`;
    const active=[];
    if(state.type!=='all')active.push(state.type==='spm'?'Custom / SPM':'Retrofit');
    if(state.category)active.push(categoryLabels[state.category]||state.category);
    if(state.tech)active.push(state.tech.toUpperCase());
    if(state.query)active.push(`“${state.query}”`);
    const activeText=$('[data-active-filters]');if(activeText)activeText.textContent=active.length?active.join(' · '):'All applications · All technologies';
    const empty=$('[data-archive-empty]');if(empty)empty.hidden=state.current.length>0;
    const current=state.current.find(m=>m.id===state.activeId) || state.current[0];
    if(current)updatePreview(current);
  }

  function renderDrawer(id){
    const m=archive.find(x=>x.id===id),drawer=$('[data-dossier]');
    if(!m||!drawer)return;
    state.activeId=id;
    const feature=featureFor(m), title=feature?.title||m.title, visual=visualFor(m), mediaItems=visual.media.items;
    $('[data-dossier-kicker]',drawer).textContent=m.type==='retrofit'?'RETROFIT EXPERIENCE':'CUSTOM MACHINE EXPERIENCE';
    $('[data-dossier-id]',drawer).textContent=`${code(m)} · ${label(m).toUpperCase()}`;
    $('[data-dossier-title]',drawer).textContent=title;
    $('[data-dossier-summary]',drawer).textContent=visual.exact
      ? `${title} includes project-specific VSK media. Compare the application, machine configuration and controls with the result you need from your own process.`
      : `VSK has recorded ${title} in its engineering experience. The image shown is real VSK work from the same capability area because project-specific media is not published for this reference.`;
    $('[data-dossier-media]',drawer).innerHTML=mediaItems.map((item,i)=>item.type==='video'
      ? `<figure class="dossier-media-item"><video controls playsinline ${item.poster?`poster="${item.poster}"`:''}><source src="${item.src}" type="video/mp4"></video></figure>`
      : `<figure class="dossier-media-item"><img src="${item.src}" alt="${visual.exact?`${title}${i?` — machine view ${i+1}`:''}`:`Related VSK ${label(m)} work`}"></figure>`).join('');
    const facts=[['Experience ID',code(m)],['Application',label(m)],...(m.customer?[['Customer',m.customer]]:[]),...(m.control?[['Control',m.control]]:[]),['Visual',visual.exact?'Project-specific media':'Related VSK capability media']];
    $('[data-dossier-facts]',drawer).innerHTML=facts.map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('');
    $('[data-dossier-sections]',drawer).innerHTML=`<section><h3>Why it may be relevant</h3><p>Compare the application, machine arrangement${m.control?`, ${m.control} controls`:''} and recorded scope with the part, cycle-time target, tolerance and production result you need.</p></section><section><h3>Discuss your requirement</h3><p>If this experience is close to your need, share your component, target cycle, tolerance and existing-machine details with VSK for an application review.</p></section>`;
    const pos=state.current.findIndex(x=>x.id===id);$('[data-dossier-position]',drawer).textContent=`${pos>=0?pos+1:1} / ${state.current.length||archive.length}`;
    drawer.hidden=false;drawer.setAttribute('aria-hidden','false');document.body.classList.add('is-locked');$('.dossier-panel',drawer)?.focus();
  }
  function closeDrawer(){const drawer=$('[data-dossier]');if(!drawer)return;drawer.hidden=true;drawer.setAttribute('aria-hidden','true');document.body.classList.remove('is-locked');}
  function moveDrawer(dir){const list=state.current.length?state.current:archive;let i=list.findIndex(x=>x.id===state.activeId);i=(Math.max(0,i)+dir+list.length)%list.length;renderDrawer(list[i].id);updatePreview(list[i]);}
  function resetActive(){state.activeId='';}
  function initialise(){
    ensureIndexLayout();
    const categories=$('[data-category-filters]');
    if(categories&&!categories.dataset.v16Ready){
      categories.dataset.v16Ready='1';
      categories.innerHTML=Object.entries(categoryLabels).map(([key,value])=>`<button type="button" data-category-filter="${key}">${value}</button>`).join('');
    }
    const search=$('[data-archive-search]');if(search&&state.query&&!search.value)search.value=state.query;
    $$('[data-type-filter]').forEach(x=>x.classList.toggle('is-active',x.dataset.typeFilter===state.type));
    render();
  }

  document.addEventListener('click',e=>{
    const row=e.target.closest('[data-machine-id]');
    if(row){e.preventDefault();e.stopImmediatePropagation();const m=archive.find(x=>x.id===row.dataset.machineId);if(m){updatePreview(m);renderDrawer(m.id);}return;}
    const preview=e.target.closest('[data-archive-preview-open]');
    if(preview){e.preventDefault();e.stopImmediatePropagation();renderDrawer(state.activeId||state.current[0]?.id||archive[0].id);return;}
    const filterToggle=e.target.closest('[data-filter-toggle]');
    if(filterToggle){e.preventDefault();e.stopImmediatePropagation();const panel=$('[data-filter-panel]');if(panel)panel.hidden=!panel.hidden;return;}
    const type=e.target.closest('[data-type-filter]');
    if(type){e.preventDefault();e.stopImmediatePropagation();state.type=type.dataset.typeFilter||'all';resetActive();$$('[data-type-filter]').forEach(x=>x.classList.toggle('is-active',x===type));render();return;}
    const cat=e.target.closest('[data-category-filter]');
    if(cat){e.preventDefault();e.stopImmediatePropagation();state.category=state.category===cat.dataset.categoryFilter?'':cat.dataset.categoryFilter;resetActive();$$('[data-category-filter]').forEach(x=>x.classList.toggle('is-active',x.dataset.categoryFilter===state.category));render();return;}
    const tech=e.target.closest('[data-tech-filter]');
    if(tech){e.preventDefault();e.stopImmediatePropagation();state.tech=state.tech===tech.dataset.techFilter?'':tech.dataset.techFilter;resetActive();$$('[data-tech-filter]').forEach(x=>x.classList.toggle('is-active',x.dataset.techFilter===state.tech));render();return;}
    const clear=e.target.closest('[data-clear-filters]');
    if(clear){e.preventDefault();e.stopImmediatePropagation();state.type='all';state.query=state.category=state.tech='';resetActive();const search=$('[data-archive-search]');if(search)search.value='';$$('[data-type-filter]').forEach(x=>x.classList.toggle('is-active',x.dataset.typeFilter==='all'));$$('[data-category-filter],[data-tech-filter]').forEach(x=>x.classList.remove('is-active'));render();return;}
    if(e.target.closest('[data-dossier-close]')){e.preventDefault();e.stopImmediatePropagation();closeDrawer();return;}
    if(e.target.closest('[data-dossier-prev]')){e.preventDefault();e.stopImmediatePropagation();moveDrawer(-1);return;}
    if(e.target.closest('[data-dossier-next]')){e.preventDefault();e.stopImmediatePropagation();moveDrawer(1);return;}
  },true);

  document.addEventListener('mouseover',e=>{const row=e.target.closest?.('[data-machine-id]');if(!row)return;const m=archive.find(x=>x.id===row.dataset.machineId);if(m)updatePreview(m);},true);
  document.addEventListener('focusin',e=>{const row=e.target.closest?.('[data-machine-id]');if(!row)return;const m=archive.find(x=>x.id===row.dataset.machineId);if(m)updatePreview(m);},true);
  document.addEventListener('input',e=>{if(!e.target.matches?.('[data-archive-search]'))return;state.query=e.target.value.trim();resetActive();render();},true);

  initialise();
  Promise.all([
    fetch('media/v16/manifest.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null),
    fetch('media/valid-paths.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)
  ]).then(([manifest,paths])=>{
    manifestGroups=Array.isArray(manifest?.groups)?manifest.groups:[];
    validPaths=Array.isArray(paths)?new Set(paths.map(cleanPath)):null;
    const firstExact=archive.filter(matches).find(m=>visualFor(m).exact);
    if(firstExact)state.activeId=firstExact.id;
    initialise();
  }).finally(()=>{
    setTimeout(initialise,550);
    setTimeout(initialise,1450);
    setTimeout(initialise,2600);
  });
})();