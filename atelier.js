(()=>{
  const $=(s,c=document)=>c.querySelector(s);
  const $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const body=document.body;
  const mosaic=$('[data-mosaic]');
  const archive=$('[data-archive]');
  const capabilities=$('[data-capabilities]');
  const projectPanel=$('[data-project-panel]');
  const scrim=$('[data-scrim]');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  const projects={
    'kellenberg':{
      index:'01 / 05',category:'REVIVE / MACHINE SECOND LIFE',title:'Kellenberg OD Grinding',
      copy:'Machine second-life engineering combining restoration and controls modernization around a proven grinding platform.',
      scope:'Reconditioning · Controls · Recommissioning',proof:'Real VSK retrofit reference',
      image:'media/retrofit/kellenberg.webp',alt:'VSK Kellenberg OD grinding machine retrofit',technical:false
    },
    'air-leak':{
      index:'02 / 05',category:'BUILD / INSPECTION EQUIPMENT',title:'Air Leak Testing',
      copy:'A dedicated inspection system developed around the fixture, test sequence and production handling requirement.',
      scope:'Fixture engineering · Pneumatics · Controls',proof:'VSK engineering drawing + project reference',
      image:'media/hero/air-leak.webp',alt:'VSK air leak testing machine engineering drawing',technical:true
    },
    'z-cut':{
      index:'03 / 05',category:'BUILD / SPECIAL PURPOSE MACHINE',title:'Z-Cut Machine',
      copy:'A compact purpose-built machine developed for a dedicated production operation with a recorded 0.02 mm tolerance reference.',
      scope:'Machine design · Actuation · Controls',proof:'0.02 mm project tolerance reference',
      image:'media/projects/z-cut.webp',alt:'VSK Z-Cut machine',technical:false
    },
    'slotting':{
      index:'04 / 05',category:'BUILD / SERVO SPM',title:'Four-Servo Seal Slotting',
      copy:'Servo-driven special-purpose equipment designed around a repeatable seal-processing operation and its motion sequence.',
      scope:'Mechanical design · Servo motion · Controls',proof:'VSK CAD model + machine reference',
      image:'media/cases/slotting-detail.webp',alt:'VSK four-servo seal slotting machine engineering model',technical:true
    },
    'jig':{
      index:'05 / 05',category:'REVIVE / GRINDING',title:'Jig Grinding Retrofit',
      copy:'A machine-tool modernization reference where controls, electrical systems and mechanical condition are treated as one recommissioning scope.',
      scope:'Electrical · Controls · Machine integration',proof:'Real VSK retrofit detail',
      image:'media/retrofit/jig-grinding.webp',alt:'VSK jig grinding retrofit detail',technical:false
    }
  };

  requestAnimationFrame(()=>body.classList.add('is-ready'));

  const closePanels=()=>{
    [archive,capabilities].forEach(panel=>{panel?.classList.remove('is-open');panel?.setAttribute('aria-hidden','true')});
    scrim?.classList.remove('is-on');
  };

  const openPanel=panel=>{
    closePanels();
    panel?.classList.add('is-open');
    panel?.setAttribute('aria-hidden','false');
    scrim?.classList.add('is-on');
  };

  $$('[data-open-archive]').forEach(btn=>btn.addEventListener('click',()=>openPanel(archive)));
  $$('[data-open-capabilities]').forEach(btn=>btn.addEventListener('click',()=>openPanel(capabilities)));
  $$('[data-close-panel]').forEach(btn=>btn.addEventListener('click',closePanels));
  scrim?.addEventListener('click',()=>{closePanels();closeProject()});
  $('[data-home]')?.addEventListener('click',e=>{e.preventDefault();closePanels();closeProject()});

  const openProject=id=>{
    const p=projects[id]; if(!p)return;
    closePanels();
    $('[data-project-category]').textContent=p.category;
    $('[data-project-title]').textContent=p.title;
    $('[data-project-copy]').textContent=p.copy;
    $('[data-project-scope]').textContent=p.scope;
    $('[data-project-proof]').textContent=p.proof;
    $('[data-project-index]').textContent=p.index;
    const img=$('[data-project-image]');
    img.src=p.image; img.alt=p.alt;
    $('[data-project-visual]').classList.toggle('is-technical',p.technical);
    projectPanel.classList.add('is-open');
    projectPanel.setAttribute('aria-hidden','false');
    scrim.classList.add('is-on');
    $('[data-project-close]')?.focus({preventScroll:true});
  };

  function closeProject(){
    projectPanel?.classList.remove('is-open');
    projectPanel?.setAttribute('aria-hidden','true');
    if(!archive?.classList.contains('is-open')&&!capabilities?.classList.contains('is-open'))scrim?.classList.remove('is-on');
  }

  $$('[data-project]').forEach(btn=>btn.addEventListener('click',()=>{
    const id=btn.dataset.project;
    if(document.startViewTransition&&!reduce){document.startViewTransition(()=>openProject(id));}
    else openProject(id);
  }));
  $('[data-project-close]')?.addEventListener('click',closeProject);

  if(mosaic&&!reduce&&matchMedia('(pointer:fine)').matches){
    const tiles=$$('.tile',mosaic);
    mosaic.addEventListener('pointermove',e=>{
      const r=mosaic.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      tiles.forEach((tile,i)=>{
        const depth=(i%3+1)*2.2;
        tile.style.translate=`${x*depth}px ${y*depth}px`;
      });
    });
    mosaic.addEventListener('pointerleave',()=>tiles.forEach(tile=>tile.style.translate='0 0'));
  }

  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape')return;
    if(projectPanel?.classList.contains('is-open'))closeProject();
    else closePanels();
  });
})();