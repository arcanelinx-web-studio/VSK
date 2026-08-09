(()=>{
  const $=(s,c=document)=>c.querySelector(s);
  const $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const showroom=$('[data-showroom]');
  const stage=$('.machine-stage');
  const stageMedia=$('[data-stage-media]');
  const stageImage=$('[data-stage-image]');
  const stageVideo=$('[data-stage-video]');
  const title=$('[data-stage-title]');
  const subtitle=$('[data-stage-subtitle]');
  const kicker=$('[data-stage-kicker]');
  const backdrop=$('[data-stage-backdrop]');
  const drawer=$('[data-info-drawer]');
  const scrim=$('[data-drawer-scrim]');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  const projects=[
    {filter:'revive',title:'Kellenberg OD Grinding',subtitle:'Retrofit · Controls modernization · Grinding',kicker:'REVIVE / MACHINE SECOND LIFE',type:'video',poster:'media/motion/kellenberg-loop-poster.webp',webm:'media/motion/kellenberg-loop.webm',mp4:'media/motion/kellenberg-loop.mp4',alt:'VSK Kellenberg OD grinding retrofit',backdrop:'#11181d',copy:'Machine second-life engineering combining mechanical restoration and controls modernization around a proven machine-tool platform.',projectType:'Grinding machine retrofit',role:'Reconditioning · Controls · Recommissioning'},
    {filter:'build',title:'Z-Cut Machine',subtitle:'Dedicated SPM · Precision application',kicker:'BUILD / PURPOSE-BUILT MACHINE',type:'image',src:'media/projects/z-cut.webp',alt:'VSK Z-Cut machine',position:'center 46%',backdrop:'#171a1d',copy:'A dedicated production machine developed around a specific Z-cut operation, with a recorded 0.02 mm tolerance reference.',projectType:'Special Purpose Machine',role:'Machine design · Build · Process integration'},
    {filter:'build',title:'4-Servo Seal Slotting',subtitle:'Servo SPM · Dedicated production',kicker:'BUILD / SERVO MACHINE',type:'image',src:'media/projects/slotting.webp',alt:'VSK four-servo seal slotting machine',position:'center',backdrop:'#131b1f',copy:'A purpose-built servo machine created around a seal-slotting requirement, integrating mechanical design, motion and controls.',projectType:'Servo Special Purpose Machine',role:'Mechanical design · Servo automation · Build'},
    {filter:'build',title:'Air Leak Testing',subtitle:'Inspection equipment · Fixture engineering',kicker:'BUILD / TEST & INSPECTION',type:'image',src:'media/hero/air-leak.webp',alt:'VSK air leak testing machine reference',position:'center',backdrop:'#151719',copy:'Application-specific inspection equipment combining fixture engineering, controlled actuation and production-oriented test logic.',projectType:'Testing / inspection equipment',role:'Fixture · Pneumatics · Controls'},
    {filter:'make',title:'Electric Oven',subtitle:'Process equipment · Industrial application',kicker:'MAKE / PROCESS EQUIPMENT',type:'video',poster:'media/motion/electric-oven.webp',webm:'media/motion/electric-oven-loop.webm',mp4:'media/motion/electric-oven-loop.mp4',alt:'VSK electric oven project',backdrop:'#1a1714',copy:'Industrial process equipment developed around the required production sequence, integration and operating environment.',projectType:'Industrial process equipment',role:'Engineering · Fabrication · Integration'}
  ];

  let active=0;
  let visibleIndexes=projects.map((_,i)=>i);
  let locked=false;
  let dragStart=null;

  const updateDrawer=p=>{
    $('[data-drawer-category]').textContent=p.kicker;
    $('[data-drawer-title]').textContent=p.title;
    $('[data-drawer-copy]').textContent=p.copy;
    $('[data-drawer-type]').textContent=p.projectType;
    $('[data-drawer-role]').textContent=p.role;
  };

  const setVideoSources=p=>{
    stageVideo.pause();
    stageVideo.poster=p.poster||'';
    stageVideo.innerHTML='';
    if(p.webm){const s=document.createElement('source');s.src=p.webm;s.type='video/webm';stageVideo.append(s)}
    if(p.mp4){const s=document.createElement('source');s.src=p.mp4;s.type='video/mp4';stageVideo.append(s)}
    stageVideo.load();
    if(!reduce)stageVideo.play().catch(()=>{});
  };

  const render=index=>{
    active=index;
    const p=projects[index];
    stageMedia.classList.add('is-switching');
    setTimeout(()=>{
      title.textContent=p.title;
      subtitle.textContent=p.subtitle;
      kicker.textContent=p.kicker;
      backdrop.style.background=p.backdrop;
      updateDrawer(p);

      if(p.type==='video'){
        stage.classList.remove('is-image');
        stageImage.src=p.poster;
        stageImage.alt=p.alt;
        stageImage.style.objectPosition=p.position||'center';
        setVideoSources(p);
      }else{
        stageVideo.pause();
        stage.classList.add('is-image');
        stageImage.src=p.src;
        stageImage.alt=p.alt;
        stageImage.style.objectPosition=p.position||'center';
      }

      $$('[data-project]').forEach((btn,i)=>btn.classList.toggle('is-active',i===index));
      stageMedia.classList.remove('is-switching');
    },reduce?0:260);
  };

  const activePosition=()=>Math.max(0,visibleIndexes.indexOf(active));
  const move=dir=>{
    if(locked||drawer.classList.contains('is-open'))return;
    locked=true;
    const pos=activePosition();
    const next=visibleIndexes[(pos+dir+visibleIndexes.length)%visibleIndexes.length];
    render(next);
    setTimeout(()=>locked=false,reduce?80:620);
  };

  $$('[data-project]').forEach((btn,i)=>btn.addEventListener('click',()=>render(i)));
  $('[data-prev]').addEventListener('click',()=>move(-1));
  $('[data-next]').addEventListener('click',()=>move(1));

  let wheelTimer;
  showroom.addEventListener('wheel',e=>{
    e.preventDefault();
    if(Math.abs(e.deltaY)<8&&Math.abs(e.deltaX)<8)return;
    clearTimeout(wheelTimer);
    wheelTimer=setTimeout(()=>move((Math.abs(e.deltaY)>Math.abs(e.deltaX)?e.deltaY:e.deltaX)>0?1:-1),35);
  },{passive:false});

  showroom.addEventListener('pointerdown',e=>{if(e.target.closest('button,a'))return;dragStart={x:e.clientX,y:e.clientY}});
  showroom.addEventListener('pointerup',e=>{
    if(!dragStart)return;
    const dx=e.clientX-dragStart.x,dy=e.clientY-dragStart.y;
    dragStart=null;
    if(Math.max(Math.abs(dx),Math.abs(dy))<45)return;
    move(Math.abs(dx)>Math.abs(dy)?(dx<0?1:-1):(dy<0?1:-1));
  });

  document.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='ArrowDown')move(1);
    if(e.key==='ArrowLeft'||e.key==='ArrowUp')move(-1);
    if(e.key==='Escape')closeDrawer();
    if(e.key==='Enter'&&document.activeElement===showroom)openDrawer();
  });

  $$('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
    const filter=btn.dataset.filter;
    $$('[data-filter]').forEach(b=>b.classList.toggle('is-active',b===btn));
    visibleIndexes=projects.map((p,i)=>filter==='all'||p.filter===filter?i:null).filter(i=>i!==null);
    if(!visibleIndexes.includes(active))render(visibleIndexes[0]);
    $$('[data-project]').forEach((projectBtn,i)=>projectBtn.hidden=!visibleIndexes.includes(i));
  }));

  const openDrawer=()=>{drawer.classList.add('is-open');scrim.classList.add('is-open');drawer.setAttribute('aria-hidden','false');$('[data-info-close]').focus()};
  const closeDrawer=()=>{drawer.classList.remove('is-open');scrim.classList.remove('is-open');drawer.setAttribute('aria-hidden','true')};
  $$('[data-info-open]').forEach(btn=>btn.addEventListener('click',openDrawer));
  $('[data-info-close]').addEventListener('click',closeDrawer);
  scrim.addEventListener('click',closeDrawer);

  updateDrawer(projects[0]);
  if(reduce)stageVideo.pause();else stageVideo.play().catch(()=>{});
})();