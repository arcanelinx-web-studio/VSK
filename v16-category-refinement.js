(() => {
  'use strict';
  if (document.body.dataset.page !== 'home') return;

  const ensureHomeStyles = () => {
    let link = document.querySelector('link[href^="v16-home-consistency.css"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = `v16-home-consistency.css?review=${Date.now()}`;

    /* Keep Reviews inside the established VSK palette. This style is appended
       after the harmony layer so an old cached one-off mineral tone cannot win. */
    let palette = document.getElementById('v16-review-palette-balance');
    if (!palette) {
      palette = document.createElement('style');
      palette.id = 'v16-review-palette-balance';
      document.head.appendChild(palette);
    }
    palette.textContent = `
      html body.v8.v13.v14[data-page="home"] .vsk-google-reviews{
        background:#fbfaf6!important;
        border-top-color:#d6e0e6!important;
        border-bottom-color:#d6e0e6!important;
      }
      html body.v8.v13.v14[data-page="home"] .vsk-google-reviews-intro>a{
        background:#fff!important;
        border-color:#b9c9d5!important;
      }
      html body.v8.v13.v14[data-page="home"] .vsk-google-review-list{
        border-top-color:#cad6df!important;
        border-bottom-color:#cad6df!important;
      }
      html body.v8.v13.v14[data-page="home"] .vsk-google-review-list article{
        background:rgba(255,255,255,.62)!important;
        border-right-color:#cad6df!important;
      }
      @media(max-width:720px){
        html body.v8.v13.v14[data-page="home"] .vsk-google-review-list article{
          border-bottom-color:#cad6df!important;
        }
      }
    `;
  };

  const categorySpecs = [
    {
      label:'SPM / CNC Machines', slug:'spm-cnc-machines',
      match:c=>(/spm/i.test(c)&&/cnc/i.test(c)&&!/plc|hmi|servo/i.test(c))||/^new project$/i.test(c),
      image:'media/v16/images/spm-cnc-machines/twin-spindle-u-drill-mc/20240921-125313.webp',
      copy:'Purpose-built SPM and CNC machine applications engineered around the component, operation, workholding and cycle target.'
    },
    {
      label:'SPM · PLC / HMI / Servo', slug:'spm-machines-plc-hmi-and-servo-controlled',
      match:c=>/plc|hmi|servo/i.test(c),
      image:'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/4-hole-drilling-and-chamfering-mc-with-auto-comp-pick-and-place-type/20230716-121301.webp',
      copy:'Machine projects where PLC, HMI, servo motion and control integration are central to the production result.'
    },
    {
      label:'Hydraulics & Pressing', slug:'hydraulic-systems-and-pressing-units',
      match:c=>/hydraulic|pressing/i.test(c),
      image:'media/v16/images/hydraulic-systems-and-pressing-units/hydraulic-press-transtech-gear/20230216-094120.webp',
      copy:'Hydraulic systems, pressing units and force-driven applications developed for controlled motion, clamping and process reliability.'
    },
    {
      label:'Retrofit & CNC', slug:'retrofitting-and-service',
      match:c=>/retrofitting|service/i.test(c),
      image:'media/v16/images/retrofitting-and-service/hardinge-t40-cnc-machine/20250401-114504.webp',
      copy:'Machine reconditioning and CNC retrofit work covering controls, drives, electrical systems and machine-tool recovery.'
    }
  ];

  const selectedProjects = [
    {code:'SPM / 07',family:'CUSTOM & SPM',title:'Vertical Turning CNC Lathe',copy:'Vertical CNC turning reference developed around a dedicated PTFE rod application.',image:'media/projects/vertical-turning.webp',href:'machines.html?q=Vertical%20Turning'},
    {code:'RTF / 09',family:'RETROFIT & CNC',title:'Hauser Jig Grinding Retrofit',copy:'Five-axis jig-grinding modernization using PLC, HMI and servo motion on three axes.',image:'media/v16/images/retrofitting-and-service/jig-grinding-machine/img-0137.webp',href:'machines.html?q=Hauser'},
    {code:'SPM / DRILLING',family:'CUSTOM & SPM',title:'U Drill Machine',copy:'Production-focused special-purpose drilling equipment built around the machining application.',image:'media/projects/u-drill.webp',href:'machines.html?q=U%20Drill'},
    {code:'SPM / 35',family:'PROCESS EQUIPMENT',title:'Paint Agitating Machine',copy:'Dedicated process equipment showing VSK engineering beyond conventional CNC machine tools.',image:'media/legacy/paint-agitating-machine.webp',href:'machines.html?q=Paint%20Agitating'}
  ];

  const normalizeHomeNavigation = () => {
    document.querySelectorAll('a[href="custom-spm.html"]').forEach(a=>a.href='machines.html?type=spm');
    [document.querySelector('.desktop-nav'),document.querySelector('[data-mobile-menu] nav')].filter(Boolean).forEach(nav=>{
      const custom=[...nav.querySelectorAll('a')].find(a=>/custom/i.test(a.textContent||''));
      const retrofit=[...nav.querySelectorAll('a')].find(a=>/retrofit/i.test(a.textContent||''));
      if(custom)custom.href='machines.html?type=spm';
      if(retrofit)retrofit.href='machines.html?type=retrofit';
    });
  };

  const firstVisual = group => {
    const items=Array.isArray(group?.items)?group.items:[];
    const image=items.find(item=>item?.type==='image'&&(item.src||item.web||item.thumb));
    return image?(image.src||image.web||image.thumb):'';
  };

  const buildCategories = manifest => {
    const list=document.querySelector('[data-capability-list]');
    const layout=document.querySelector('.capability-layout');
    const media=document.querySelector('.capability-media');
    if(!list||!layout||!media)return;

    const categories=categorySpecs.map(spec=>{
      const groups=(manifest?.groups||[]).filter(group=>spec.match(String(group.category||'')));
      return {...spec,groups,fallback:groups.find(firstVisual)};
    });

    const render=index=>{
      const category=categories[index];if(!category)return;
      list.querySelectorAll('[data-v16-category-row]').forEach((row,i)=>{
        row.classList.toggle('is-active',i===index);
        row.setAttribute('aria-pressed',i===index?'true':'false');
      });
      const image=media.querySelector('[data-capability-image]');
      const meta=media.querySelector('[data-capability-index]');
      const title=media.querySelector('[data-capability-title]');
      const copy=media.querySelector('[data-capability-copy]');
      const tags=media.querySelector('[data-capability-tags]');
      const visual=category.image||firstVisual(category.fallback);
      if(image&&visual){image.src=visual;image.alt=`${category.label} — VSK Gallery category`;}
      if(meta)meta.textContent=`GALLERY CATEGORY · ${category.groups.length} PROJECT GROUP${category.groups.length===1?'':'S'}`;
      if(title)title.textContent=category.label;
      if(copy)copy.textContent=category.copy;
      if(tags)tags.innerHTML=`<b>${category.groups.length} PROJECT GROUP${category.groups.length===1?'S':''}</b><b>PHOTOS &amp; VIDEOS</b>`;
      let link=media.querySelector('.capability-project-link');
      if(!link){link=document.createElement('a');link.className='capability-project-link';media.querySelector('figcaption')?.appendChild(link);}
      link.classList.add('vsk-related-projects-cta');
      link.href=`gallery.html?category=${encodeURIComponent(category.slug)}`;
      link.innerHTML='<span>See related projects</span><i>→</i>';
    };

    list.innerHTML=categories.map((category,index)=>`<button class="capability-row${index===0?' is-active':''}" type="button" data-v16-category-row="${index}" aria-pressed="${index===0?'true':'false'}"><span>${String(index+1).padStart(2,'0')}</span><strong>${category.label}</strong><i>→</i></button>`).join('');
    list.querySelectorAll('[data-v16-category-row]').forEach(row=>{
      const index=Number(row.dataset.v16CategoryRow);const select=()=>render(index);
      row.addEventListener('click',select);row.addEventListener('mouseenter',select);row.addEventListener('focus',select);
    });

    const intro=document.querySelector('.capabilities .section-intro > p');
    if(intro)intro.textContent='Choose the engineering category closest to your requirement, then inspect the actual VSK project groups, machine photographs, videos and engineering detail behind it.';

    let cta=document.querySelector('.capability-gallery-cta');
    if(!cta){cta=document.createElement('a');cta.className='capability-gallery-cta';layout.insertAdjacentElement('afterend',cta);}
    cta.href='gallery.html';
    cta.innerHTML='<span class="gallery-cta-label">Project Gallery</span><strong class="gallery-cta-title">Explore the complete VSK project gallery</strong><span class="gallery-cta-meta">Photos · Videos · Machine detail</span><i aria-hidden="true">→</i>';
    render(0);
  };

  const rebuildFeatured = () => {
    const section=document.querySelector('.projects-showcase');if(!section)return;
    const mediaButton=section.querySelector('.featured-case-media');
    const image=mediaButton?.querySelector('img');
    const kicker=section.querySelector('.featured-case-copy .kicker');
    const title=section.querySelector('.featured-case-copy h3');
    const copy=section.querySelector('.featured-case-copy > p');
    const facts=section.querySelector('.featured-facts');
    const action=section.querySelector('.featured-case-copy .text-arrow');
    if(image){image.src='media/v16/images/spm-machines-plc-hmi-and-servo-controlled/air-leak-testing-machine/20230415-191614.webp';image.alt='VSK air leakage testing machine';}
    if(kicker)kicker.textContent='SPM / 20 · TESTING & AUTOMATION';
    if(title)title.innerHTML='Air Leakage<br>Testing Machine';
    if(copy)copy.textContent='A dedicated testing system combining the fixture, pneumatic circuit, Festo servo motion and controlled sequence into one production-ready machine.';
    if(facts)facts.innerHTML='<span><small>MOTION</small><strong>Festo Servo Unit</strong></span><span><small>SCOPE</small><strong>Fixture + Pneumatic + Control</strong></span><span><small>APPLICATION</small><strong>Air Leakage Testing</strong></span>';
    if(mediaButton){mediaButton.removeAttribute('data-feature-open');mediaButton.setAttribute('aria-label','Find Air Leakage Testing Machine experience');mediaButton.onclick=()=>{location.href='machines.html?q=Air%20Leakage';};}
    if(action){action.removeAttribute('data-feature-open');action.innerHTML='Find related experience <span>→</span>';action.onclick=()=>{location.href='machines.html?q=Air%20Leakage';};}
  };

  const selectedCardMarkup = (item, duplicate=false) => `<a class="v16-selected-card" href="${item.href}"${duplicate?' tabindex="-1"':''}><figure><img src="${item.image}" alt="${item.title}" loading="lazy"></figure><span class="v16-selected-card-copy"><span class="v16-selected-meta"><span>${item.code}</span><span>${item.family}</span></span><h3>${item.title}</h3><p>${item.copy}</p><b>FIND RELATED EXPERIENCE →</b></span></a>`;

  const rebuildSelected = () => {
    const grid=document.querySelector('[data-home-projects]');if(!grid)return;
    const signature='v16-47-moving-engineering-rail';
    if(grid.dataset.v16Selection===signature&&grid.querySelector('.vsk-selected-track')&&grid.querySelectorAll('.vsk-selected-group').length===2)return;
    const primary=selectedProjects.map(item=>selectedCardMarkup(item,false)).join('');
    const duplicate=selectedProjects.map(item=>selectedCardMarkup(item,true)).join('');
    grid.dataset.v16Selection=signature;
    grid.classList.add('vsk-selected-rail');
    grid.innerHTML=`<div class="vsk-selected-track"><div class="vsk-selected-group">${primary}</div><div class="vsk-selected-group" aria-hidden="true">${duplicate}</div></div>`;
  };

  const buildGoogleReviews = () => {
    if(document.querySelector('.vsk-google-reviews'))return;
    const selected=document.querySelector('.selected-projects-strip');
    if(!selected)return;
    const section=document.createElement('section');
    section.className='vsk-google-reviews';
    section.setAttribute('aria-labelledby','vsk-google-reviews-title');
    section.innerHTML=`<div class="shell vsk-google-reviews-grid"><div class="vsk-google-reviews-intro"><span class="kicker">GOOGLE REVIEWS</span><h2 id="vsk-google-reviews-title">Trusted for practical<br><em>machine engineering.</em></h2><div class="vsk-google-rating"><strong>4.9</strong><span><b aria-label="5 stars">★★★★★</b><small>14 Google reviews</small></span></div><p>Feedback from customers who have worked with VSK on machine building, retrofit and engineering support.</p><a href="https://www.google.com/maps/search/?api=1&query=VSK+Electro-Mech+Solutions+Bengaluru" target="_blank" rel="noopener">View all Google reviews <span>↗</span></a></div><div class="vsk-google-review-list"><article><span>GOOGLE REVIEW</span><p>“Good service company”</p></article><article><span>GOOGLE REVIEW</span><p>“Special purpose machines effective price”</p></article><article><span>GOOGLE REVIEW</span><p>“Custom built machines, CNC retrofit solution services provider.”</p></article></div></div>`;
    selected.insertAdjacentElement('afterend',section);
  };

  const normalizeCopy = () => {
    const proof=document.querySelector('.proof-grid article:nth-child(3) small');if(proof)proof.textContent='39 Custom & SPM · 15 Retrofit & CNC';
    const split=document.querySelectorAll('.archive-callout-split span');
    if(split[0])split[0].innerHTML='<b>39</b> CUSTOM &amp; SPM';
    if(split[1])split[1].innerHTML='<b>15</b> RETROFIT &amp; CNC';
    const callout=document.querySelector('.archive-callout > p');
    if(callout)callout.textContent='Search 39 Custom & SPM and 15 Retrofit & CNC references by process, machine type, customer need or control platform before you start the discussion.';
  };

  const applyStatic = () => {
    normalizeHomeNavigation();
    rebuildFeatured();
    document.querySelector('.retrofit')?.remove();
    rebuildSelected();
    buildGoogleReviews();
    normalizeCopy();
  };

  const start = () => {
    ensureHomeStyles();
    applyStatic();
    fetch(`media/archive-manifest.json?review=${Date.now()}`,{cache:'no-store'})
      .then(r=>r.ok?r.json():null).then(manifest=>buildCategories(manifest||{groups:[]})).catch(()=>buildCategories({groups:[]}));

    const grid=document.querySelector('[data-home-projects]');
    if(grid&&!grid.dataset.v16Observer){
      grid.dataset.v16Observer='1';
      const observer=new MutationObserver(rebuildSelected);
      observer.observe(grid,{childList:true});
      setTimeout(()=>observer.disconnect(),10000);
    }
    setTimeout(applyStatic,250);setTimeout(applyStatic,1000);setTimeout(applyStatic,2500);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.addEventListener('load',applyStatic,{once:true});
})();