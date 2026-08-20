(() => {
  'use strict';
  if (document.body.dataset.page !== 'machines') return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const archive = typeof machineArchive !== 'undefined' && Array.isArray(machineArchive) ? machineArchive : [];
  if (!archive.length) return;

  const categoryLabels = {
    handling: 'Automation & handling', turning: 'Turning & boring', pressing: 'Hydraulics & pressing',
    cutting: 'Cutting & machining', testing: 'Testing & inspection', finishing: 'Finishing & process equipment',
    controls: 'Controls & systems', grinding: 'Grinding & retrofit'
  };
  const state = { type: 'all', query: '', category: '', tech: '', current: [], activeId: '' };
  let manifestGroups = [];

  const aliases = {
    spm03:['spigot','turning'], spm04:['motor','flange','facing'], spm05:['hydraulic','press','transtech'],
    spm07:['vertical','turning'], spm09:['rod','boring'], spm11:['2','axis','notching'],
    spm12:['4','servo','slotting'], spm13:['4','servo','slotting'], spm14:['4','servo','slotting'],
    spm20:['air','leak','testing'], spm22:['drilling','chamfering'], spm27:['epoxy','painting'],
    spm35:['paint','agitating'], spm36:['control','panel','honing'], rtf09:['jig','grinding'],
    rtf11:['kellenberg','grinding'], rtf14:['hardinge','t40'], rtf15:['hyundai','sa160']
  };
  const stopWords = new Set(['machine','machines','mc','cnc','spm','unit','system','systems','with','and','for','the','type','controlled','control','plc','hmi','servo','retrofit','retrofitted','retrofitting','service','new','project']);
  const normalize = value => String(value || '').toLowerCase().replace(/hundai/g,'hyundai').replace(/kelingberg/g,'kellenberg').replace(/honning/g,'honing').replace(/aggitating/g,'agitating').replace(/[^a-z0-9]+/g,' ').trim();
  const tokens = value => normalize(value).split(/\s+/).filter(Boolean).filter(t => !stopWords.has(t));
  const code = m => `${m.type === 'retrofit' ? 'RTF' : 'SPM'} / ${String(m.id?.slice(3) || '').padStart(2,'0')}`;
  const label = m => categoryLabels[m.category] || m.category || 'Machine engineering';

  function scoreGroup(m,g){
    const wanted = aliases[m.id] || tokens(`${m.title} ${m.customer || ''}`);
    const got = tokens(`${g.title || ''} ${g.project || ''} ${g.path || ''}`);
    if(!wanted.length || !got.length) return 0;
    const common = wanted.filter(t => got.includes(t));
    const distinctive = common.filter(t => t.length > 2);
    if(!distinctive.length) return 0;
    return common.length / Math.max(2, Math.min(wanted.length, got.length));
  }
  function groupFor(m){
    let best=null,bestScore=0;
    manifestGroups.forEach(g=>{const s=scoreGroup(m,g);if(s>bestScore){best=g;bestScore=s;}});
    return bestScore>=0.58?best:null;
  }
  function featureFor(m){
    if(typeof featureData!=='undefined' && m.featureId && featureData[m.featureId]) return featureData[m.featureId];
    if(typeof featureData!=='undefined' && featureData[m.id]) return featureData[m.id];
    return null;
  }
  function groupMedia(group){
    if(!group?.items?.length) return [];
    const images=group.items.filter(i=>i.type==='image'&&(i.src||i.web)).map(i=>({type:'image',src:i.src||i.web}));
    const videos=group.items.filter(i=>i.type==='video'&&(i.src_mp4||i.src)).map(i=>({type:'video',src:i.src_mp4||i.src,poster:i.poster||''}));
    return [...images,...videos];
  }
  function exactMedia(m){
    const f=featureFor(m);
    if(f?.media?.length) return {items:f.media.map(src=>({type:'image',src})),source:'curated'};
    if(m.media?.length) return {items:m.media.map(src=>({type:'image',src})),source:'reference'};
    const group=groupFor(m),items=groupMedia(group);
    return items.length?{items,source:'source-folder',group}:{items:[],source:'unpublished'};
  }
  function escapeXml(value){return String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));}
  function referenceCard(m){
    const title=escapeXml(m.title),category=escapeXml(label(m).toUpperCase()),ref=escapeXml(code(m));
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760"><rect width="1200" height="760" fill="#e6e4de"/><path d="M60 78h1080M60 682h1080" stroke="#b8c0c7"/><path d="M840 78v604" stroke="#c6ccd1"/><circle cx="1020" cy="180" r="86" fill="none" stroke="#164a9c" stroke-width="3"/><path d="M934 180h172M1020 94v172" stroke="#164a9c" stroke-width="2" opacity=".45"/><text x="72" y="142" fill="#164a9c" font-family="monospace" font-size="24" letter-spacing="4">${ref} · DOCUMENTED REFERENCE</text><text x="72" y="252" fill="#0d1824" font-family="Arial,sans-serif" font-weight="700" font-size="44">${title}</text><text x="72" y="330" fill="#5f6e7b" font-family="Arial,sans-serif" font-size="26">${category}</text><text x="72" y="580" fill="#5f6e7b" font-family="Arial,sans-serif" font-size="23">Project-specific photo/video is not published in the current VSK media archive.</text><text x="72" y="625" fill="#0d1824" font-family="Arial,sans-serif" font-size="23">Another machine’s photograph is deliberately not substituted.</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
  function visualFor(m){
    const exact=exactMedia(m),firstImage=exact.items.find(i=>i.type==='image');
    if(firstImage) return {src:firstImage.src,exact:true,media:exact};
    const firstVideo=exact.items.find(i=>i.type==='video'&&i.poster);
    if(firstVideo) return {src:firstVideo.poster,exact:true,media:exact};
    return {src:referenceCard(m),exact:false,media:exact};
  }
  const matches=m=>{
    const text=[m.title,m.customer,m.control,m.note,label(m)].filter(Boolean).join(' ').toLowerCase();
    const techText=[m.title,m.control,m.note].filter(Boolean).join(' ').toLowerCase();
    return(state.type==='all'||m.type===state.type)&&(!state.query||text.includes(state.query.toLowerCase()))&&(!state.category||m.category===state.category)&&(!state.tech||techText.includes(state.tech));
  };

  function updatePreview(m){
    if(!m)return;state.activeId=m.id;
    $$('[data-machine-id]').forEach(row=>row.classList.toggle('is-active',row.dataset.machineId===m.id));
    const visual=visualFor(m),media=$('[data-archive-preview-media]');
    if(media)media.innerHTML=`<img src="${visual.src}" alt="${visual.exact?m.title:`${m.title} documented reference card`}">`;
    const c=$('[data-archive-preview-code]');if(c)c.textContent=`${code(m)} · ${label(m).toUpperCase()}`;
    const t=$('[data-archive-preview-title]');if(t)t.textContent=m.title;
    const p=$('[data-archive-preview-copy]');if(p)p.textContent=visual.exact?'Project-specific VSK media is mapped to this reference. Compare its application, machine configuration and controls with your own requirement.':'This is a documented VSK reference. Project-specific media is not published, so another machine’s photograph is not substituted.';
    const open=$('[data-archive-preview-open]');if(open)open.textContent='View reference details →';
  }
  function render(){
    state.current=archive.filter(matches);const index=$('[data-archive-index]');if(!index)return;
    index.innerHTML=state.current.map((m,i)=>`<button class="archive-row${i===0?' is-active':''}" type="button" data-machine-id="${m.id}"><span>${code(m)}</span><strong>${m.title}</strong><small>${m.customer||m.control||label(m)}</small><i>→</i></button>`).join('');
    const count=$('[data-result-count]');if(count)count.textContent=`${state.current.length} reference${state.current.length===1?'':'s'}`;
    const active=[];if(state.type!=='all')active.push(state.type==='spm'?'Custom / SPM':'Retrofit');if(state.category)active.push(categoryLabels[state.category]||state.category);if(state.tech)active.push(state.tech.toUpperCase());if(state.query)active.push(`“${state.query}”`);
    const activeText=$('[data-active-filters]');if(activeText)activeText.textContent=active.length?active.join(' · '):'All applications · All technologies';
    const empty=$('[data-archive-empty]');if(empty)empty.hidden=state.current.length>0;
    if(state.current[0])updatePreview(state.current.find(m=>m.id===state.activeId)||state.current[0]);
  }
  function renderDrawer(id){
    const m=archive.find(x=>x.id===id),drawer=$('[data-dossier]');if(!m||!drawer)return;state.activeId=id;
    const feature=featureFor(m),title=feature?.title||m.title,visual=visualFor(m),mediaItems=visual.media.items.length?visual.media.items:[{type:'image',src:referenceCard(m)}];
    $('[data-dossier-kicker]',drawer).textContent=m.type==='retrofit'?'RETROFIT REFERENCE':'CUSTOM / SPM REFERENCE';
    $('[data-dossier-id]',drawer).textContent=`${code(m)} · ${label(m).toUpperCase()}`;$('[data-dossier-title]',drawer).textContent=title;
    $('[data-dossier-summary]',drawer).textContent=visual.exact?`${title} is a documented VSK reference with project-specific media. Use the application, machine configuration and controls to judge how closely it matches your production requirement.`:`${title} is a documented VSK engineering reference. Project-specific media is not published, so this page does not substitute an unrelated machine photograph.`;
    $('[data-dossier-media]',drawer).innerHTML=mediaItems.map((item,i)=>item.type==='video'?`<figure class="dossier-media-item"><video controls playsinline ${item.poster?`poster="${item.poster}"`:''}><source src="${item.src}" type="video/mp4"></video></figure>`:`<figure class="dossier-media-item"><img src="${item.src}" alt="${visual.exact?`${title}${i?` — project view ${i+1}`:''}`:`${title} documented reference card`}"></figure>`).join('');
    const facts=[['Reference',code(m)],['Application',label(m)],...(m.customer?[['Customer',m.customer]]:[]),...(m.control?[['Control',m.control]]:[]),['Media',visual.exact?'Project-specific media verified':'Project media not published']];
    $('[data-dossier-facts]',drawer).innerHTML=facts.map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('');
    $('[data-dossier-sections]',drawer).innerHTML=`<section><h3>What to compare</h3><p>Compare the application, machine arrangement${m.control?`, ${m.control} controls`:''} and recorded scope with the part, cycle-time target and tolerance you need.</p></section><section><h3>Next step</h3><p>If this reference is relevant, share your component, target cycle, tolerance and existing-machine details with VSK for an application review.</p></section>`;
    const pos=state.current.findIndex(x=>x.id===id);$('[data-dossier-position]',drawer).textContent=`${pos>=0?pos+1:1} / ${state.current.length||archive.length}`;
    drawer.hidden=false;drawer.setAttribute('aria-hidden','false');document.body.classList.add('is-locked');$('.dossier-panel',drawer)?.focus();
  }
  function closeDrawer(){const drawer=$('[data-dossier]');if(!drawer)return;drawer.hidden=true;drawer.setAttribute('aria-hidden','true');document.body.classList.remove('is-locked');}
  function moveDrawer(dir){const list=state.current.length?state.current:archive;let i=list.findIndex(x=>x.id===state.activeId);i=(Math.max(0,i)+dir+list.length)%list.length;renderDrawer(list[i].id);updatePreview(list[i]);}
  function initialise(){
    const categories=$('[data-category-filters]');if(categories&&!categories.dataset.v16Ready){categories.dataset.v16Ready='1';categories.innerHTML=Object.entries(categoryLabels).map(([key,value])=>`<button type="button" data-category-filter="${key}">${value}</button>`).join('');}
    const search=$('[data-archive-search]');if(search)state.query=search.value.trim();const activeType=$('[data-type-filter].is-active');if(activeType)state.type=activeType.dataset.typeFilter||'all';render();
  }

  document.addEventListener('click',e=>{
    const row=e.target.closest('[data-machine-id]');if(row){e.preventDefault();e.stopImmediatePropagation();const m=archive.find(x=>x.id===row.dataset.machineId);if(m){updatePreview(m);renderDrawer(m.id);}return;}
    const preview=e.target.closest('[data-archive-preview-open]');if(preview){e.preventDefault();e.stopImmediatePropagation();renderDrawer(state.activeId||state.current[0]?.id||archive[0].id);return;}
    const type=e.target.closest('[data-type-filter]');if(type){e.preventDefault();e.stopImmediatePropagation();state.type=type.dataset.typeFilter||'all';$$('[data-type-filter]').forEach(x=>x.classList.toggle('is-active',x===type));render();return;}
    const cat=e.target.closest('[data-category-filter]');if(cat){e.preventDefault();e.stopImmediatePropagation();state.category=state.category===cat.dataset.categoryFilter?'':cat.dataset.categoryFilter;$$('[data-category-filter]').forEach(x=>x.classList.toggle('is-active',x.dataset.categoryFilter===state.category));render();return;}
    const tech=e.target.closest('[data-tech-filter]');if(tech){e.preventDefault();e.stopImmediatePropagation();state.tech=state.tech===tech.dataset.techFilter?'':tech.dataset.techFilter;$$('[data-tech-filter]').forEach(x=>x.classList.toggle('is-active',x.dataset.techFilter===state.tech));render();return;}
    const clear=e.target.closest('[data-clear-filters]');if(clear){e.preventDefault();e.stopImmediatePropagation();state.type='all';state.query=state.category=state.tech='';const search=$('[data-archive-search]');if(search)search.value='';$$('[data-type-filter]').forEach(x=>x.classList.toggle('is-active',x.dataset.typeFilter==='all'));$$('[data-category-filter],[data-tech-filter]').forEach(x=>x.classList.remove('is-active'));render();return;}
    if(e.target.closest('[data-dossier-close]')){e.preventDefault();e.stopImmediatePropagation();closeDrawer();return;}
    if(e.target.closest('[data-dossier-prev]')){e.preventDefault();e.stopImmediatePropagation();moveDrawer(-1);return;}
    if(e.target.closest('[data-dossier-next]')){e.preventDefault();e.stopImmediatePropagation();moveDrawer(1);return;}
  },true);
  document.addEventListener('mouseover',e=>{const row=e.target.closest?.('[data-machine-id]');if(!row)return;const m=archive.find(x=>x.id===row.dataset.machineId);if(m)updatePreview(m);},true);
  document.addEventListener('focusin',e=>{const row=e.target.closest?.('[data-machine-id]');if(!row)return;const m=archive.find(x=>x.id===row.dataset.machineId);if(m)updatePreview(m);},true);
  document.addEventListener('input',e=>{if(!e.target.matches?.('[data-archive-search]'))return;state.query=e.target.value.trim();render();},true);

  initialise();
  fetch('media/v16/manifest.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(m=>{manifestGroups=Array.isArray(m?.groups)?m.groups:[];initialise();}).catch(()=>{}).finally(()=>{setTimeout(initialise,500);setTimeout(initialise,1400);});
})();