(()=>{
  const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData=navigator.connection?.saveData===true;
  if(saveData)document.body.classList.add('data-saver');

  const menuBtn=$('.menu-toggle'),nav=$('#site-nav'),header=$('[data-header]');
  const navOpen=()=>menuBtn?.getAttribute('aria-expanded')==='true';
  const syncNavState=()=>{const open=navOpen();document.body.classList.toggle('nav-open',open);menuBtn?.setAttribute('aria-label',open?'Close navigation':'Open navigation');if(open)requestAnimationFrame(()=>$('#site-nav a')?.focus())};
  menuBtn?.setAttribute('aria-label','Open navigation');
  menuBtn?.addEventListener('click',syncNavState);
  $$('#site-nav a').forEach(a=>a.addEventListener('click',()=>{document.body.classList.remove('nav-open');menuBtn?.setAttribute('aria-label','Open navigation')}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&navOpen()){nav?.classList.remove('is-open');menuBtn?.setAttribute('aria-expanded','false');syncNavState();menuBtn?.focus()}});
  document.addEventListener('pointerdown',e=>{if(navOpen()&&header&&!header.contains(e.target)){nav?.classList.remove('is-open');menuBtn?.setAttribute('aria-expanded','false');syncNavState()}});
  header?.addEventListener('keydown',e=>{if(e.key!=='Tab'||!navOpen())return;const focusables=$$('a[href],button:not([disabled])',header).filter(el=>el.offsetParent!==null);if(!focusables.length)return;const first=focusables[0],last=focusables.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});

  const navLinks=$$('#site-nav a[href^="#"]');
  const navMap=new Map(navLinks.map(a=>[a.getAttribute('href')?.slice(1),a]));
  const observed=[...navMap.keys()].map(id=>document.getElementById(id)).filter(Boolean);
  if('IntersectionObserver'in window&&observed.length){const sectionIO=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;navLinks.forEach(a=>a.removeAttribute('aria-current'));navMap.get(visible.target.id)?.setAttribute('aria-current','location')},{rootMargin:'-28% 0px -58% 0px',threshold:[0,.05,.25,.55]});observed.forEach(section=>sectionIO.observe(section))}

  const setupTabKeyboard=(selector,activate)=>{$$(selector).forEach((tab,index,tabs)=>tab.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();let next=index;if(e.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;if(e.key==='ArrowRight')next=(index+1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;tabs[next].focus();activate?.(tabs[next])||tabs[next].click()}))};
  setupTabKeyboard('.solution-tab');setupTabKeyboard('.case-tab');

  const scroller=$('[data-project-scroller]'),tools=$('.project-tools');
  if(scroller&&tools&&!$('.project-controls',tools)){
    tools.insertAdjacentHTML('beforeend','<div class="project-controls" aria-label="Machine reference navigation"><button class="project-control" type="button" data-project-prev aria-label="Previous machine reference"><span>←</span></button><button class="project-control" type="button" data-project-next aria-label="Next machine reference"><span>→</span></button></div>');
    const prev=$('[data-project-prev]'),next=$('[data-project-next]');
    const step=()=>{const card=$('.project-card:not(.is-filtered)',scroller);return card?card.getBoundingClientRect().width+18:Math.max(320,scroller.clientWidth*.72)};
    const update=()=>{const max=scroller.scrollWidth-scroller.clientWidth-2;prev.disabled=scroller.scrollLeft<=2;next.disabled=scroller.scrollLeft>=max};
    prev.addEventListener('click',()=>scroller.scrollBy({left:-step(),behavior:reduced?'auto':'smooth'}));
    next.addEventListener('click',()=>scroller.scrollBy({left:step(),behavior:reduced?'auto':'smooth'}));
    scroller.addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});update();
    $$('.project-filter').forEach(btn=>btn.addEventListener('click',()=>requestAnimationFrame(update)));
  }

  const modal=$('.project-modal');
  document.addEventListener('keydown',e=>{if(e.key!=='Tab'||!modal?.classList.contains('is-open'))return;const focusables=$$('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',modal).filter(el=>!el.disabled&&el.offsetParent!==null);if(!focusables.length)return;const first=focusables[0],last=focusables.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});

  const form=$('[data-enquiry-form]'),status=$('.form-status'),phone=$('input[name="phone"]',form),phoneError=$('[data-phone-error]',form);
  const formData=()=>Object.fromEntries(new FormData(form).entries());
  const setPhoneError=message=>{if(!phone)return;if(message){phone.setAttribute('aria-invalid','true');phoneError&&(phoneError.textContent=message,phoneError.classList.add('is-visible'))}else{phone.removeAttribute('aria-invalid');phoneError?.classList.remove('is-visible')}};
  phone?.addEventListener('input',()=>{const clean=phone.value.replace(/\D/g,'').slice(0,10);if(clean!==phone.value)phone.value=clean;if(!clean||clean.length===10)setPhoneError('')});
  phone?.addEventListener('blur',()=>{if(phone.value&&phone.value.length!==10)setPhoneError('Enter a 10-digit Indian mobile number.');else setPhoneError('')});
  const validate=()=>{if(!form?.reportValidity())return false;const d=formData();if(!/^\d{10}$/.test(d.phone||'')){setPhoneError('Enter a valid 10-digit Indian mobile number.');phone?.focus();return false}setPhoneError('');return true};
  const compose=d=>`VSK Engineering Enquiry\n\nName: ${d.name}\nCompany: ${d.company||'-'}\nPhone: ${d.phone}\nEmail: ${d.email}\nRequirement: ${d.requirement}\nMachine / Component: ${d.machine||'-'}\nController / System: ${d.controller||'-'}\nPlant / City: ${d.location||'-'}\n\nApplication / Requirement:\n${d.message}`;
  form?.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation();if(!validate())return;const d=formData();if(status)status.textContent='Opening your email app with the enquiry ready for review…';location.href=`mailto:vsk.electromech@gmail.com?subject=${encodeURIComponent('Website enquiry — '+d.requirement)}&body=${encodeURIComponent(compose(d))}`},true);
  $('[data-send="whatsapp"]')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();if(!validate())return;const d=formData();if(status)status.textContent='Opening WhatsApp with the enquiry ready for review…';window.open(`https://wa.me/919880336714?text=${encodeURIComponent(compose(d))}`,'_blank','noopener,noreferrer')},true);

  const dock=$('.mobile-contact-dock'),contact=$('#contact');
  if(dock&&contact&&'IntersectionObserver'in window){new IntersectionObserver(([entry])=>dock.classList.toggle('is-contact-visible',entry.isIntersecting),{threshold:.08}).observe(contact)}
})();
