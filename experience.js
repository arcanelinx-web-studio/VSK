(() => {
  'use strict';
  if (document.body.dataset.page !== 'machines') return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const archive = typeof machineArchive !== 'undefined' && Array.isArray(machineArchive) ? machineArchive : [];
  if (!archive.length) return;

  const categoryLabels = {handling:'Automation & handling',turning:'Turning & boring',pressing:'Hydraulics & pressing',cutting:'Cutting & machining',testing:'Testing & inspection',finishing:'Finishing & process equipment',controls:'Controls & systems',grinding:'Grinding & retrofit'};
  const params = new URL(location.href).searchParams;
  const requestedType = params.get('type');
  const state = {type:['all','spm','retrofit'].includes(requestedType)?requestedType:'all',query:params.get('q')||'',category:'',tech:'',current:[],activeId:''};
  let manifestGroups = [], validPaths = null;

  const aliases = {
    spm03:['spigot','turning'],spm04:['motor','flange','facing'],spm05:['hydraulic','press','transtech'],
    spm07:['vertical','turning'],spm09:['rod','boring'],spm11:['2','axis','notching'],spm12:['4','servo','slotting'],
    spm20:['air','leak','testing'],spm22:['drilling','chamfering'],spm27:['epoxy','painting'],spm35:['paint','agitating'],
    spm36:['control','panel','honing'],rtf09:['jig','grinding'],rtf11:['kellenberg','grinding'],rtf14:['hardinge','t40'],rtf15:['hyundai','sa160']
  };
  const verifiedCurated = new Set(['spm02','spm07','spm09','spm11','spm12','spm20','spm34','spm35','rtf09','rtf11']);
  const stopWords = new Set(['machine','machines','mc','cnc','spm','unit','system','systems','with','and','for','the','type','controlled','control','plc','hmi','servo','retrofit','retrofitted','retrofitting','service','new','project']);
  const normalize = value => String(value||'').toLowerCase().replace(/hundai/g,'hyundai').replace(/kelingberg/g,'kellenberg').replace(/honning/g,'honing').replace(/aggitating/g,'agitating').replace(/[^a-z0-9]+/g,' ').trim();
  const tokens = value => normalize(value).split(/\s+/).filter(Boolean).filter(t=>!stopWords.has(t));
  const cleanPath = p => String(p||'').replace(/^\.\//,'');
  const pathExists = p => !validPaths || validPaths.has(cleanPath(p));
  const code = m => `${m.type==='retrofit'?'RTF':'SPM'} / ${String(m.id?.slice(3)||'').padStart(2,'0')}`;
  const label = m => categoryLabels[m.category]||m.category||'Machine engineering';

  function scoreGroup(m,g){const wanted=aliases[m.id]||tokens(`${m.title} ${m.customer||''}`),got=tokens(`${g.title||''} ${g.project||''} ${g.path||''}`);if(!wanted.length||!got.length)return 0;const common=wanted.filter(t=>got.includes(t)),distinctive=common.filter(t=>t.length>2);if(!distinctive.length)return 0;return common.length/Math.max(2,Math.min(wanted.length,got.length));}
  function groupFor(m){let best=null,bestScore=0;manifestGroups.forEach(g=>{const s=scoreGroup(m,g);if(s>bestScore){best=g;bestScore=s;}});return bestScore>=0.58?best:null;}
  function featureFor(m){if(typeof featureData!=='undefined'&&m.featureId&&featureData[m.featureId])return featureData[m.featureId];if(typeof featureData!=='undefined'&&featureData[m.id])return featureData[m.id];return null;}
  function groupMedia(group){if(!group?.items?.length)return[];const images=group.items.map(i=>i.type==='image'?(i.src||i.web||''):'').filter(src=>src&&pathExists(src)).map(src=>({type:'image',src}));const videos=group.items.filter(i=>i.type==='video').map(i=>{const src=[i.src_mp4,i.src,i.web].find(p=>p&&pathExists(p))||'',poster=[i.poster,i.thumb].find(p=>p&&pathExists(p))||'';return src?{type:'video',src,poster}:null;}).filter(Boolean);return[...images,...videos];}
  function exactMedia(m){
    const group=groupFor(m),groupItems=groupMedia(group);if(groupItems.length)return{items:groupItems,source:'source-folder',group};
    if(verifiedCurated.has(m.id)){
      const f=featureFor(m);if(f?.media?.length){const items=f.media.filter(pathExists).map(src=>({type:'image',src}));if(items.length)return{items,source:'curated'};}
      if(m.media?.length){const items=m.media.filter(pathExists).map(src=>({type:'image',src}));if(items.length)return{items,source:'reference'};}
    }
    return{items:[],source:'unpublished'};
  }
  function escapeXml(value){return String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));}
  function referenceCard(m){
    const title=escapeXml(m.title),category=escapeXml(label(m).toUpperCase()),ref=escapeXml(code(m));
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760"><rect width="1200" height="760" fill="#e6e4de"/><path d="M60 78h1080M60 682h1080" stroke="#b8c0c7"/><path d="M840 78v604" stroke="#c6ccd1"/><circle cx="1020" cy="180" r="86" fill="none" stroke="#164a9c" stroke-width="3"/><path d="M934 180h172M1020 94v172" stroke="#164a9c" stroke-width="2" opacity=".45"/><text x="72" y="142" fill="#164a9c" font-family="monospace" font-size="24" letter-spacing="4">${ref} · VSK ENGINEERING EXPERIENCE</text><text x="72" y="252" fill="#0d1824" font-family="Arial,sans-serif" font-weight="700" font-size="44">${title}</text><text x="72" y="330" fill="#5f6e7b" font-family="Arial,sans-serif" font-size="26">${category}</text><text x="72" y="580" fill="#5f6e7b" font-family="Arial,sans-serif" font-size="23">Project photos are not published for this machine.</text><text x="72" y="625" fill="#0d1824" font-family="Arial,sans-serif" font-size="23">No unrelated machine photograph is substituted.</text></svg>`;
    return`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
  function visualFor(m){const exact=exactMedia(m),firstImage=exact.items.find(i=>i.type==='image');if(firstImage)return{src:firstImage.src,exact:true,media:exact};const firstVideo=exact.items.find(i=>i.type==='video'&&i.poster);if(firstVideo)return{src:firstVideo.poster,exact:true,media:exact};return{src:referenceCard(m),exact:false,media:exact};}
  const matches=m=>{const text=[m.title,m.customer,m.control,m.note,label(m)].filter(Boolean).join(' ').toLowerCase(),techText=[m.title,m.control,m.note].filter(Boolean).join(' ').toLowerCase();return(state.type==='all'||m.type===state.type)&&(!state.query||text.includes(state.query.toLowerCase()))&&(!state.category||m.category===state.category)&&(!state.tech||techText.includes(state.tech));};

  function renderMediaShowcase(){
    if(!manifestGroups.length)return;
    let section=$('[data-experience-media-section]');
    if(!section){
      section=document.createElement('section');
      section.className='experience-media-showcase section-light';
      section.dataset.experienceMediaSection='';
      section.innerHTML=`<div class="shell"><div class="experience-media-head"><div><span class="kicker">ACTUAL VSK MACHINE WORK</span><h2>See the machines behind<br><em>the experience.</em></h2></div><p>These examples use project-specific VSK photos or video frames. Open one to compare the machine, application and controls with what your production needs.</p></div><div class="experience-media-grid" data-experience-media></div></div>`;
      const browser=$('.archive-browser');
      browser?.parentNode?.insertBefore(section,browser);
    }
    const candidates=archive.filter(matches).map(m=>({m,media:exactMedia(m)})).filter(x=>x.media.items.length).map(x=>{
      const image=x.media.items.find(i=>i.type==='image')||x.media.items.find(i=>i.poster);
      return image?{...x,src:image.src||image.poster}:null;
    }).filter(Boolean).slice(0,6);
    const grid=$('[data-experience-media]',section);
    if(!grid)return;
    grid.innerHTML=candidates.map(({m,src})=>`<button type="button" class="experience-media-card" data-machine-id="${m.id}"><img src="${src}" alt="${m.title}" loading="lazy"><div><span>${code(m)} · ${label(m).toUpperCase()}</span><strong>${m.title}</strong><small>${m.customer||m.control||'VSK machine engineering'}</small></div></button>`).join('');
    section.hidden=!candidates.length;
  }

  function updatePreview(m){
    if(!m)return;
    state.activeId=m.id;
    $$('[data-machine-id]').forEach(row=>row.classList.toggle('is-active',row.dataset.machineId===m.id));
    const visual=visualFor(m),media=$('[data-archive-preview-media]');
    if(media)media.innerHTML=`<img src="${visual.src}" alt="${visual.exact?m.title:`${m.title} engineering experience card`}">`;
    const c=$('[data-archive-preview-code]');if(c)c.textContent=`${code(m)} · ${label(m).toUpperCase()}`;
    const t=$('[data-archive-preview-title]');if(t)t.textContent=m.title;
    const p=$('[data-archive-preview-copy]');
    if(p)p.textContent=visual.exact?'Actual VSK media from this machine is available. Compare the application, machine configuration and controls with what your production needs.':'This machine remains searchable because its engineering scope may be relevant to your requirement. Photos are not published, so no unrelated machine image is shown.';
    const open=$('[data-archive-preview-open]');if(open)open.textContent='See machine experience →';
  }

  function render(){
    state.current=archive.filter(matches);
    const index=$('[data-archive-index]');if(!index)return;
    index.innerHTML=state.current.map((m,i)=>`<button class="archive-row${m.id===state.activeId||(!state.activeId&&i===0)?' is-active':''}" type="button" data-machine-id="${m.id}"><span>${code(m)}</span><strong>${m.title}</strong><small>${m.customer||m.control||label(m)}</small><i>→</i></button>`).join('');
    const count=$('[data-result-count]');if(count)count.textContent=`${state.current.length} result${state.current.length===1?'':'s'}`;
    const active=[];if(state.type!=='all')active.push(state.type==='spm'?'Custom / SPM':'Retrofit');if(state.category)active.push(categoryLabels[state.category]||state.category);if(state.tech)active.push(state.tech.toUpperCase());if(state.query)active.push(`“${state.query}”`);
    const activeText=$('[data-active-filters]');if(activeText)activeText.textContent=active.length?active.join(' · '):'All applications · All technologies';
    const empty=$('[data-archive-empty]');if(empty)empty.hidden=state.current.length>0;
    const activeMachine=state.current.find(m=>m.id===state.activeId)||state.current[0];
    if(activeMachine)updatePreview(activeMachine);
    renderMediaShowcase();
  }

  function renderDrawer(id){
    const m=archive.find(x=>x.id===id),drawer=$('[data-dossier]');if(!m||!drawer)return;
    state.activeId=id;
    const feature=featureFor(m),title=feature?.title||m.title,visual=visualFor(m),mediaItems=visual.media.items.length?visual.media.items:[{type:'image',src:referenceCard(m)}];
    $('[data-dossier-kicker]',drawer).textContent=m.type==='retrofit'?'RETROFIT EXPERIENCE':'CUSTOM MACHINE EXPERIENCE';
    $('[data-dossier-id]',drawer).textContent=`${code(m)} · ${label(m).toUpperCase()}`;
    $('[data-dossier-title]',drawer).textContent=title;
    $('[data-dossier-summary]',drawer).textContent=visual.exact?`${title} includes verified VSK project media. Compare the application, machine configuration and controls with the result you need from your own process.`:`VSK has recorded ${title} in its engineering experience. Project photos are not published, so an unrelated machine is not shown in their place.`;
    $('[data-dossier-media]',drawer).innerHTML=mediaItems.map((item,i)=>item.type==='video'?`<figure class="dossier-media-item"><video controls playsinline ${item.poster?`poster="${item.poster}"`:''}><source src="${item.src}" type="video/mp4"></video></figure>`:`<figure class="dossier-media-item"><img src="${item.src}" alt="${visual.exact?`${title}${i?` — machine view ${i+1}`:''}`:`${title} engineering experience card`}"></figure>`).join('');
    const facts=[['Experience ID',code(m)],['Application',label(m)],...(m.customer?[['Customer',m.customer]]:[]),...(m.control?[['Control',m.control]]:[]),['Media',visual.exact?'Actual machine media':'Photos not published']];
    $('[data-dossier-facts]',drawer).innerHTML=facts.map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('');
    $('[data-dossier-sections]',drawer).innerHTML=`<section><h3>Why it may be relevant</h3><p>Compare the application, machine arrangement${m.control?`, ${m.control} controls`:''} and recorded scope with the part, cycle-time target, tolerance and production result you need.</p></section><section><h3>Discuss your requirement</h3><p>If this experience is close to your need, share your component, target cycle, tolerance and existing-machine details with VSK for an application review.</p></section>`;
    const pos=state.current.findIndex(x=>x.id===id);$('[data-dossier-position]',drawer).textContent=`${pos>=0?pos+1:1} / ${state.current.length||archive.length}`;
    drawer.hidden=false;drawer.setAttribute('aria-hidden','false');document.body.classList.add('is-locked');$('.dossier-panel',drawer)?.focus();
  }
  function closeDrawer(){const drawer=$('[data-dossier]');if(!drawer)return;drawer.hidden=true;drawer.setAttribute('aria-hidden','true');document.body.classList.remove('is-locked');}
  function moveDrawer(dir){const list=state.current.length?state.current:archive;let i=list.findIndex(x=>x.id===state.activeId);i=(Math.max(0,i)+dir+list.length)%list.length;renderDrawer(list[i].id);updatePreview(list[i]);}
  function initialise(){const categories=$('[data-category-filters]');if(categories&&!categories.dataset.v16Ready){categories.dataset.v16Ready='1';categories.innerHTML=Object.entries(categoryLabels).map(([key,value])=>`<button type="button" data-category-filter="${key}">${value}</button>`).join('');}const search=$('[data-archive-search]');if(search){if(state.query&&!search.value)search.value=state.query;}$$('[data-type-filter]').forEach(x=>x.classList.toggle('is-active',x.dataset.typeFilter===state.type));render();}

  document.addEventListener('click',e=>{const row=e.target.closest('[data-machine-id]');if(row){e.preventDefault();e.stopImmediatePropagation();const m=archive.find(x=>x.id===row.dataset.machineId);if(m){updatePreview(m);renderDrawer(m.id);}return;}const preview=e.target.closest('[data-archive-preview-open]');if(preview){e.preventDefault();e.stopImmediatePropagation();renderDrawer(state.activeId||state.current[0]?.id||archive[0].id);return;}const filterToggle=e.target.closest('[data-filter-toggle]');if(filterToggle){e.preventDefault();e.stopImmediatePropagation();const panel=$('[data-filter-panel]');if(panel)panel.hidden=!panel.hidden;return;}const type=e.target.closest('[data-type-filter]');if(type){e.preventDefault();e.stopImmediatePropagation();state.type=type.dataset.typeFilter||'all';state.activeId='';$$('[data-type-filter]').forEach(x=>x.classList.toggle('is-active',x===type));render();return;}const cat=e.target.closest('[data-category-filter]');if(cat){e.preventDefault();e.stopImmediatePropagation();state.category=state.category===cat.dataset.categoryFilter?'':cat.dataset.categoryFilter;state.activeId='';$$('[data-category-filter]').forEach(x=>x.classList.toggle('is-active',x.dataset.categoryFilter===state.category));render();return;}const tech=e.target.closest('[data-tech-filter]');if(tech){e.preventDefault();e.stopImmediatePropagation();state.tech=state.tech===tech.dataset.techFilter?'':tech.dataset.techFilter;state.activeId='';$$('[data-tech-filter]').forEach(x=>x.classList.toggle('is-active',x.dataset.techFilter===state.tech));render();return;}const clear=e.target.closest('[data-clear-filters]');if(clear){e.preventDefault();e.stopImmediatePropagation();state.type='all';state.query=state.category=state.tech=state.activeId='';const search=$('[data-archive-search]');if(search)search.value='';$$('[data-type-filter]').forEach(x=>x.classList.toggle('is-active',x.dataset.typeFilter==='all'));$$('[data-category-filter],[data-tech-filter]').forEach(x=>x.classList.remove('is-active'));render();return;}if(e.target.closest('[data-dossier-close]')){e.preventDefault();e.stopImmediatePropagation();closeDrawer();return;}if(e.target.closest('[data-dossier-prev]')){e.preventDefault();e.stopImmediatePropagation();moveDrawer(-1);return;}if(e.target.closest('[data-dossier-next]')){e.preventDefault();e.stopImmediatePropagation();moveDrawer(1);return;}},true);
  document.addEventListener('mouseover',e=>{const row=e.target.closest?.('[data-machine-id]');if(!row)return;const m=archive.find(x=>x.id===row.dataset.machineId);if(m)updatePreview(m);},true);
  document.addEventListener('focusin',e=>{const row=e.target.closest?.('[data-machine-id]');if(!row)return;const m=archive.find(x=>x.id===row.dataset.machineId);if(m)updatePreview(m);},true);
  document.addEventListener('input',e=>{if(!e.target.matches?.('[data-archive-search]'))return;state.query=e.target.value.trim();state.activeId='';render();},true);

  initialise();
  Promise.all([
    fetch('media/v16/manifest.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null),
    fetch('media/valid-paths.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)
  ]).then(([manifest,paths])=>{
    manifestGroups=Array.isArray(manifest?.groups)?manifest.groups:[];
    validPaths=Array.isArray(paths)?new Set(paths.map(cleanPath)):null;
    const firstWithMedia=archive.filter(matches).find(m=>exactMedia(m).items.length);
    if(firstWithMedia)state.activeId=firstWithMedia.id;
    initialise();
  }).finally(()=>{setTimeout(initialise,500);setTimeout(initialise,1400);});
})();