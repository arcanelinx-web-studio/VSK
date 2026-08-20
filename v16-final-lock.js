(() => {
  'use strict';

  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page || 'home';

  function lockSelectedExperience(){
    if(page!=='home') return;
    const grid=$('[data-home-projects]');
    if(!grid) return;
    grid.classList.remove('project-grid-editorial');
    grid.classList.add('selected-experience-grid');
    [...grid.children].forEach(card=>{
      [...card.classList].filter(c=>/^project-layout-\d+$/.test(c)).forEach(c=>card.classList.remove(c));
      card.classList.add('selected-experience-card');
    });
  }

  function lockGalleryHero(){
    if(page!=='gallery') return;
    const images=$$('.gallery-hero-strip img');
    const last=images.at(-1);
    if(!last) return;
    const desired='media/v16/images/spm-machines-plc-hmi-and-servo-controlled/single-spindle-u-drill-machine/img-20170518-210359.webp';
    if(last.getAttribute('src')!==desired) last.setAttribute('src',desired);
    last.setAttribute('alt','VSK U Drill special purpose machine');
  }

  function lockExperienceCopy(){
    if(page!=='machines') return;
    const button=$('[data-archive-preview-open]');
    if(button && button.textContent.trim()!=='View this experience →') button.textContent='View this experience →';
  }

  function apply(){
    lockSelectedExperience();
    lockGalleryHero();
    lockExperienceCopy();
  }

  apply();
  addEventListener('DOMContentLoaded',apply,{once:true});
  addEventListener('load',()=>{apply();setTimeout(apply,350);setTimeout(apply,1100);setTimeout(apply,2400);},{once:true});

  const observer=new MutationObserver(()=>apply());
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src','class']});
  setTimeout(()=>observer.disconnect(),7000);
})();
