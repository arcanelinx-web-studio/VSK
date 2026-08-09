(()=>{
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer=matchMedia('(pointer:fine)').matches;
  if(pointer) document.body.classList.add('has-pointer');

  const cross=$('.cursor-cross');
  if(cross&&pointer){
    addEventListener('pointermove',e=>{cross.style.transform=`translate(${e.clientX-17}px,${e.clientY-17}px)`},{passive:true});
  }

  const compass=$('.compass');
  if(compass&&pointer&&!reduce){
    compass.addEventListener('pointermove',e=>{
      const r=compass.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      compass.style.transform=`perspective(1100px) rotateX(${y*-5}deg) rotateY(${x*6}deg)`;
    });
    compass.addEventListener('pointerleave',()=>compass.style.transform='');
  }

  const readout=$('.compass-readout');
  const label=$('.compass-label strong');
  const nodeData={
    build:['BUILD','Purpose-built machines','Application-led SPM engineering from concept to trials and commissioning.'],
    revive:['REVIVE','Machine second life','Mechanical restoration plus electrical and CNC/PLC modernization.'],
    make:['MAKE','Precision manufacturing','Turning, machining, grinding, fixtures and process support.'],
    fluid:['FLUID POWER','Hydraulic + pneumatic','Actuation, circuits, integration and troubleshooting.'],
    controls:['CONTROL','CNC + PLC + HMI','Fanuc, Siemens, Mitsubishi, Delta, servo and VFD integration.'],
    proof:['PROVE','Trials + inspection','Machine proof through application tolerance, cycle time and commissioning.']
  };
  $$('.compass-node').forEach(btn=>btn.addEventListener('mouseenter',()=>{
    $$('.compass-node').forEach(b=>b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const d=nodeData[btn.dataset.node];
    if(!d)return;
    label.textContent=d[0];
    if(readout) readout.innerHTML=`<span>${d[0]}</span><h2>${d[1]}</h2><p>${d[2]}</p>`;
  }));

  const journeyBtns=$$('.journey-nav button');
  const journeyPanels=$$('.journey-panel');
  const activateJourney=id=>{
    journeyBtns.forEach(b=>b.classList.toggle('is-active',b.dataset.step===id));
    journeyPanels.forEach(p=>p.classList.toggle('is-active',p.dataset.stepPanel===id));
  };
  journeyBtns.forEach(b=>b.addEventListener('click',()=>activateJourney(b.dataset.step)));

  if(!reduce){
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const id=entry.target.dataset.autoStep;
      if(id) activateJourney(id);
    }),{threshold:.55});
    $$('[data-auto-step]').forEach(el=>io.observe(el));
  }

  const preview=$('.hover-preview'), previewImg=$('.hover-preview img');
  if(preview&&pointer){
    $$('.archive-row').forEach(row=>{
      row.addEventListener('pointerenter',()=>{previewImg.src=row.dataset.image;preview.classList.add('is-visible')});
      row.addEventListener('pointermove',e=>{preview.style.left=`${e.clientX+170}px`;preview.style.top=`${e.clientY}px`});
      row.addEventListener('pointerleave',()=>preview.classList.remove('is-visible'));
    });
  }

  const caseBtns=$$('.case-nav button'), casePanels=$$('.case-panel');
  caseBtns.forEach(btn=>btn.addEventListener('click',()=>{
    caseBtns.forEach(b=>b.classList.toggle('is-active',b===btn));
    casePanels.forEach(panel=>panel.classList.toggle('is-active',panel.dataset.case===btn.dataset.case));
  }));

  const sections=$$('section[id]');
  const navLinks=$$('.topbar nav a[href^="#"]');
  const navIO=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(!e.isIntersecting)return;
    navLinks.forEach(a=>a.classList.toggle('is-current',a.getAttribute('href')===`#${e.target.id}`));
  }),{rootMargin:'-30% 0px -60%',threshold:0});
  sections.forEach(s=>navIO.observe(s));

  const form=$('[data-form]');
  const compose=d=>`VSK Engineering Enquiry\n\nName: ${d.name}\nCompany: ${d.company||'-'}\nPhone: ${d.phone}\nEmail: ${d.email}\nRequirement: ${d.requirement}\n\nApplication / Requirement:\n${d.message}`;
  form?.addEventListener('submit',e=>{
    e.preventDefault();
    if(!form.reportValidity())return;
    const d=Object.fromEntries(new FormData(form));
    if(!/^\d{10}$/.test(d.phone)){alert('Please enter a valid 10-digit mobile number.');return}
    location.href=`mailto:vsk.electromech@gmail.com?subject=${encodeURIComponent('Website enquiry — '+d.requirement)}&body=${encodeURIComponent(compose(d))}`;
  });
  $('[data-whatsapp]')?.addEventListener('click',()=>{
    if(!form?.reportValidity())return;
    const d=Object.fromEntries(new FormData(form));
    if(!/^\d{10}$/.test(d.phone)){alert('Please enter a valid 10-digit mobile number.');return}
    window.open(`https://wa.me/919880336714?text=${encodeURIComponent(compose(d))}`,'_blank','noopener');
  });
})();