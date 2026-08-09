(()=>{
  const $=(s,c=document)=>c.querySelector(s);const $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ready=()=>document.body.classList.add('is-ready');
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();

  const header=$('[data-header]');
  const nav=$('[data-nav]');
  const menu=$('[data-menu]');
  const setMenu=open=>{nav?.classList.toggle('is-open',open);document.body.classList.toggle('menu-open',open);menu?.setAttribute('aria-expanded',String(open))};
  menu?.addEventListener('click',()=>setMenu(!nav?.classList.contains('is-open')));
  $$('.nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  addEventListener('scroll',()=>header?.classList.toggle('is-compact',scrollY>60),{passive:true});

  const revealEls=$$('.reveal,.reveal-media');
  if(reduce||!('IntersectionObserver'in window)){revealEls.forEach(el=>el.classList.add('is-visible'))}else{
    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -6%'});
    revealEls.forEach(el=>revealObserver.observe(el));
  }

  const capabilityData={
    build:{copy:'Application study, machine concept, mechanical design, hydraulic and pneumatic systems, controls, assembly, trials and commissioning.',tags:['Mechanical design','Fluid power','CNC / PLC / HMI / Servo','Electrical integration']},
    revive:{copy:'Mechanical restoration and controls modernization are treated as one machine problem — from condition assessment and panel rebuilding to drives, feedback, trials and recommissioning.',tags:['Reconditioning','CNC retrofit','Servo & drives','Recommissioning']},
    make:{copy:'Turning, machining and grinding are supported by machine-builder process knowledge, fixture thinking and production-engineering support.',tags:['Turning','Machining','Grinding','Fixtures & process support']}
  };
  const capRows=$$('[data-capability]');const capImage=$('[data-capability-image]');const capCopy=$('[data-capability-copy]');const capTags=$('[data-capability-tags]');const capImageWrap=$('.capability-image');
  const activateCapability=row=>{
    if(!row||row.classList.contains('is-active'))return;
    capRows.forEach(r=>r.classList.toggle('is-active',r===row));
    const key=row.dataset.capability;const data=capabilityData[key];
    capImageWrap?.classList.add('is-changing');
    setTimeout(()=>{if(capImage){capImage.src=row.dataset.image;capImage.alt=`VSK ${key} capability`;}if(capCopy)capCopy.textContent=data.copy;if(capTags)capTags.innerHTML=data.tags.map(t=>`<span>${t}</span>`).join('');capImageWrap?.classList.remove('is-changing')},180);
  };
  capRows.forEach(row=>{row.addEventListener('mouseenter',()=>activateCapability(row));row.addEventListener('focus',()=>activateCapability(row));row.addEventListener('click',()=>activateCapability(row))});

  const dialog=$('[data-project-dialog]');
  $$('[data-project]').forEach(btn=>btn.addEventListener('click',()=>{
    const image=$('[data-dialog-image]'),title=$('[data-dialog-title]'),type=$('[data-dialog-type]'),copy=$('[data-dialog-copy]');
    if(image){image.src=btn.dataset.image;image.alt=btn.dataset.project}if(title)title.textContent=btn.dataset.project;if(type)type.textContent=btn.dataset.type;if(copy)copy.textContent=btn.dataset.copy;dialog?.showModal();
  }));
  $$('[data-dialog-close]').forEach(btn=>btn.addEventListener('click',()=>dialog?.close()));
  dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});

  const reviews=['“Custom built machines, CNC retrofit solution services provider.”','“Special purpose machines effective price”','“Good service company”'];
  let reviewIndex=0;const review=$('[data-review]');const reviewCount=$('[data-review-count]');
  const renderReview=()=>{if(review)review.textContent=reviews[reviewIndex];if(reviewCount)reviewCount.textContent=`${String(reviewIndex+1).padStart(2,'0')} / ${String(reviews.length).padStart(2,'0')}`};
  $('[data-review-prev]')?.addEventListener('click',()=>{reviewIndex=(reviewIndex-1+reviews.length)%reviews.length;renderReview()});
  $('[data-review-next]')?.addEventListener('click',()=>{reviewIndex=(reviewIndex+1)%reviews.length;renderReview()});

  const sections=$$('main section[id]');
  if('IntersectionObserver'in window){const sectionObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;$$('.nav a').forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')===`#${entry.target.id}`))})},{rootMargin:'-30% 0px -60%',threshold:0});sections.forEach(s=>sectionObserver.observe(s))}

  const form=$('[data-enquiry-form]');const error=$('[data-form-error]');
  form?.addEventListener('submit',e=>{
    e.preventDefault();const data=new FormData(form);const name=String(data.get('name')||'').trim();const company=String(data.get('company')||'').trim();const phone=String(data.get('phone')||'').replace(/\D/g,'');const email=String(data.get('email')||'').trim();const type=String(data.get('type')||'').trim();const requirement=String(data.get('requirement')||'').trim();
    if(name.length<2){if(error)error.textContent='Please enter your name.';return}if(phone.length<10){if(error)error.textContent='Please enter a valid phone number with at least 10 digits.';return}if(!/^\S+@\S+\.\S+$/.test(email)){if(error)error.textContent='Please enter a valid email address.';return}if(requirement.length<12){if(error)error.textContent='Please add a little more detail about the engineering requirement.';return}if(error)error.textContent='';
    const subject=`VSK website enquiry — ${type}`;const body=[`Name: ${name}`,`Company: ${company||'-'}`,`Phone: ${phone}`,`Email: ${email}`,`Requirement type: ${type}`,'',requirement].join('\n');
    location.href=`mailto:vsk.electromech@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();