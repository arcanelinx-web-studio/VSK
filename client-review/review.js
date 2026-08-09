(()=>{
  const fixSheet=document.createElement('link');
  fixSheet.rel='stylesheet';
  fixSheet.href='review-fixes.css';
  document.head.append(fixSheet);

  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const chooser=$('[data-chooser]');
  const concepts=$$('[data-concept]');
  const switcher=$('[data-switcher]');
  const back=$('[data-back]');
  const header=$('[data-review-header]');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active=null;

  const setTheme=id=>{
    const colors={a:'#07111d',b:'#020508',c:'#f7f8f8'};
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',colors[id]||'#07111d');
  };

  const pauseHiddenVideos=()=>{
    $$('video').forEach(v=>{const concept=v.closest('[data-concept]');if(concept?.hidden){v.pause()}else if(v.autoplay&&!reduce){v.play().catch(()=>{})}});
  };

  const openConcept=id=>{
    active=id;
    chooser.hidden=true;
    concepts.forEach(section=>section.hidden=section.dataset.concept!==id);
    switcher.hidden=false;
    back.hidden=false;
    $$('[data-switch]').forEach(btn=>btn.classList.toggle('is-active',btn.dataset.switch===id));
    setTheme(id);
    document.body.dataset.activeConcept=id;
    scrollTo({top:0,behavior:'auto'});
    pauseHiddenVideos();
    document.title=`VSK Website Review — Option ${id.toUpperCase()}`;
  };

  const showChooser=()=>{
    active=null;
    chooser.hidden=false;
    concepts.forEach(section=>section.hidden=true);
    switcher.hidden=true;
    back.hidden=true;
    document.body.removeAttribute('data-active-concept');
    header?.classList.remove('is-away');
    setTheme(null);
    scrollTo({top:0,behavior:'auto'});
    pauseHiddenVideos();
    document.title='VSK Website Design Review — Options A, B & C';
  };

  $$('[data-open]').forEach(btn=>btn.addEventListener('click',()=>openConcept(btn.dataset.open)));
  $$('[data-switch]').forEach(btn=>btn.addEventListener('click',()=>openConcept(btn.dataset.switch)));
  back?.addEventListener('click',showChooser);
  $('[data-home]')?.addEventListener('click',e=>{if(active){e.preventDefault();showChooser()}});

  $$('[data-a-tab]').forEach(btn=>btn.addEventListener('click',()=>{
    const id=btn.dataset.aTab;
    $$('[data-a-tab]').forEach(b=>b.classList.toggle('is-active',b===btn));
    $$('[data-a-panel]').forEach(p=>p.classList.toggle('is-active',p.dataset.aPanel===id));
  }));

  const dialog=$('[data-project-dialog]');
  $$('[data-project]').forEach(btn=>btn.addEventListener('click',()=>{
    const [title,copy,image]=btn.dataset.project.split('|');
    $('[data-dialog-title]').textContent=title;
    $('[data-dialog-copy]').textContent=copy;
    const img=$('[data-dialog-image]');
    img.src=image;img.alt=title;
    dialog?.showModal();
  }));
  $$('[data-dialog-close]').forEach(btn=>btn.addEventListener('click',()=>dialog?.close()));
  dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});

  $$('.c-register button').forEach(row=>row.addEventListener('click',()=>{
    const was=row.classList.contains('is-open');
    $$('.c-register button').forEach(r=>r.classList.remove('is-open'));
    if(!was)row.classList.add('is-open');
  }));

  const observeSections=()=>{
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        const id=entry.target.id;
        const concept=entry.target.closest('[data-concept]');
        if(!concept||concept.hidden)return;
        $$('.concept-nav a[href^="#"]',concept).forEach(a=>a.classList.toggle('is-current',a.getAttribute('href')===`#${id}`));
      });
    },{rootMargin:'-25% 0px -65%',threshold:0});
    concepts.forEach(c=>$$('section[id]',c).forEach(s=>io.observe(s)));
  };
  observeSections();

  let lastY=0;
  addEventListener('scroll',()=>{
    if(!active){header?.classList.remove('is-away');return}
    const y=scrollY;
    header?.classList.toggle('is-away',y>160&&y>lastY);
    lastY=y;
  },{passive:true});

  const requested=new URLSearchParams(location.search).get('option');
  if(['a','b','c'].includes(requested))openConcept(requested);

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&dialog?.open)return;
    if(e.key==='Escape'&&active)showChooser();
    if(!e.altKey||!active)return;
    if(e.key==='1')openConcept('a');
    if(e.key==='2')openConcept('b');
    if(e.key==='3')openConcept('c');
  });

  if(reduce)$$('video').forEach(v=>v.pause());
})();