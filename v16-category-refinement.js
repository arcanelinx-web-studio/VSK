(() => {
  'use strict';
  if (document.body.dataset.page !== 'home') return;

  const categorySpecs = [
    {
      label:'SPM / CNC Machines', slug:'spm-cnc-machines',
      match:c=>/spm/i.test(c)&&/cnc/i.test(c)&&!/plc|hmi|servo/i.test(c),
      preferred:/rod boring|vertical turning|flange facing|facing/i,
      copy:'Purpose-built SPM and CNC machine applications engineered around the component, operation, workholding and cycle target.'
    },
    {
      label:'SPM · PLC / HMI / Servo', slug:'spm-machines-plc-hmi-and-servo-controlled',
      match:c=>/plc|hmi|servo/i.test(c),
      preferred:/4\s*servo|slotting/i,
      copy:'Machine projects where PLC, HMI, servo motion and control integration are central to the production result.'
    },
    {
      label:'Hydraulics & Pressing', slug:'hydraulic-systems-and-pressing-units',
      match:c=>/hydraulic|pressing/i.test(c),
      preferred:/hydraulic press/i,
      copy:'Hydraulic systems, pressing units and force-driven applications developed for controlled motion, clamping and process reliability.'
    },
    {
      label:'Retrofit & Service', slug:'retrofitting-and-service',
      match:c=>/retrofitting|service/i.test(c),
      preferred:/kellenberg|hardinge/i,
      copy:'Reconditioning, retrofit and service projects for existing production machines, controls and machine-tool systems.'
    }
  ];

  const firstVisual = group => {
    const items = Array.isArray(group?.items) ? group.items : [];
    const image = items.find(item => item?.type === 'image' && (item.src || item.web || item.thumb));
    if (image) return image.src || image.web || image.thumb;
    const video = items.find(item => item?.type === 'video' && (item.poster || item.thumb));
    return video?.poster || video?.thumb || '';
  };

  const injectStyles = () => {
    let style = document.getElementById('v16-category-refinement-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'v16-category-refinement-style';
      document.head.appendChild(style);
    }
    style.textContent = `
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row[data-v16-category-row]{text-decoration:none!important}
      body.v8.v13.v14[data-page="home"] .capability-media [data-capability-index]{color:#5f7890!important}
      body.v8.v13.v14[data-page="home"] .capability-media [data-capability-title]{max-width:650px!important}
      body.v8.v13.v14[data-page="home"] .capability-project-link{min-width:210px!important}
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta{display:none!important}

      body.v8.v13.v14[data-page="home"] .capability-gallery-gateway{
        box-sizing:border-box!important;
        width:var(--audit-shell,calc(100% - 80px))!important;
        max-width:none!important;
        min-height:108px!important;
        margin:34px auto 0!important;
        display:grid!important;
        grid-template-columns:170px minmax(0,1fr) 205px!important;
        background:#0d1824!important;
        border:1px solid #23384b!important;
        box-shadow:0 20px 46px rgba(13,24,36,.12)!important;
        text-decoration:none!important;
        overflow:hidden!important;
        transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-gateway:hover{
        transform:translateY(-2px)!important;
        border-color:#356ead!important;
        box-shadow:0 26px 54px rgba(13,24,36,.16)!important;
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-count{
        padding:20px 26px!important;
        display:flex!important;flex-direction:column!important;justify-content:center!important;
        background:#164a9c!important;color:#fff!important;
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-count b{
        font:600 42px/.9 "Space Grotesk",sans-serif!important;letter-spacing:-.055em!important;color:#fff!important
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-count small{
        margin-top:9px!important;font:500 8px/1.3 "IBM Plex Mono",monospace!important;letter-spacing:.14em!important;text-transform:uppercase!important;color:#c8ddf4!important
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-copy{
        min-width:0!important;padding:21px 32px!important;display:flex!important;flex-direction:column!important;justify-content:center!important
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-copy small{
        color:#7faad4!important;font:500 8px/1.2 "IBM Plex Mono",monospace!important;letter-spacing:.15em!important;text-transform:uppercase!important
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-copy strong{
        margin-top:8px!important;color:#f7f9fb!important;font:600 clamp(20px,1.6vw,27px)/1.04 "Space Grotesk",sans-serif!important;letter-spacing:-.035em!important
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-copy em{
        margin-top:7px!important;color:#9fb0bf!important;font:400 12px/1.45 Inter,sans-serif!important;font-style:normal!important
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-action{
        padding:0 26px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;
        border-left:1px solid #2c4154!important;color:#eef5fb!important;font:600 9px/1.2 "IBM Plex Mono",monospace!important;letter-spacing:.08em!important;text-transform:uppercase!important
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-action i{
        width:40px!important;height:40px!important;border-radius:50%!important;display:grid!important;place-items:center!important;
        background:#fff!important;color:#164a9c!important;font-style:normal!important;font-size:17px!important;transition:transform .2s ease,background .2s ease!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-gateway:hover .gallery-gateway-action i{transform:translateX(4px)!important;background:#dcecff!important}

      /* Engineering Depth — approved internal breathing room from the earlier V16 review. */
      @media (min-width:1501px){
        body.v8.v13.v14[data-page="home"] .engineering-depth .metric-card{padding-left:50px!important;padding-right:50px!important}
      }
      @media (min-width:1181px) and (max-width:1500px){
        body.v8.v13.v14[data-page="home"] .engineering-depth .metric-card{padding-left:clamp(38px,3vw,50px)!important;padding-right:clamp(38px,3vw,50px)!important}
      }
      @media (min-width:721px) and (max-width:1180px){
        body.v8.v13.v14[data-page="home"] .engineering-depth .metric-card{padding-left:32px!important;padding-right:32px!important}
      }
      @media (max-width:900px){
        body.v8.v13.v14[data-page="home"] .capability-gallery-gateway{grid-template-columns:130px minmax(0,1fr)!important}
        body.v8.v13.v14[data-page="home"] .gallery-gateway-action{grid-column:1/-1!important;min-height:56px!important;border-left:0!important;border-top:1px solid #2c4154!important}
      }
      @media (max-width:620px){
        body.v8.v13.v14[data-page="home"] .capability-gallery-gateway{width:calc(100% - 40px)!important;grid-template-columns:92px minmax(0,1fr)!important;margin-top:24px!important}
        body.v8.v13.v14[data-page="home"] .gallery-gateway-count{padding:16px!important}
        body.v8.v13.v14[data-page="home"] .gallery-gateway-count b{font-size:34px!important}
        body.v8.v13.v14[data-page="home"] .gallery-gateway-copy{padding:18px!important}
        body.v8.v13.v14[data-page="home"] .gallery-gateway-copy strong{font-size:19px!important}
      }
    `;
  };

  const build = manifest => {
    if (!manifest?.groups?.length) return;
    const list = document.querySelector('[data-capability-list]');
    const layout = document.querySelector('.capability-layout');
    const media = document.querySelector('.capability-media');
    if (!list || !layout || !media) return;

    const categories = categorySpecs.map(spec => {
      const groups = manifest.groups.filter(group => spec.match(String(group.category || '')));
      const representative = groups.find(group => spec.preferred.test(`${group.title || ''} ${group.project || ''}`) && firstVisual(group)) || groups.find(firstVisual) || groups[0];
      return {...spec, groups, representative};
    }).filter(item => item.groups.length);

    const renderCategory = index => {
      const category = categories[index];
      if (!category) return;
      list.querySelectorAll('[data-v16-category-row]').forEach((row,rowIndex)=>{
        row.classList.toggle('is-active',rowIndex===index);
        row.setAttribute('aria-pressed',rowIndex===index?'true':'false');
      });
      const image = media.querySelector('[data-capability-image]');
      const meta = media.querySelector('[data-capability-index]');
      const title = media.querySelector('[data-capability-title]');
      const copy = media.querySelector('[data-capability-copy]');
      const tags = media.querySelector('[data-capability-tags]');
      const visual = firstVisual(category.representative);
      if (image && visual) { image.src = visual; image.alt = `${category.label} — VSK Gallery category`; }
      if (meta) meta.textContent = `GALLERY CATEGORY · ${category.groups.length} PROJECT GROUP${category.groups.length===1?'':'S'}`;
      if (title) title.textContent = category.label;
      if (copy) copy.textContent = category.copy;
      if (tags) tags.innerHTML = `<b>${category.groups.length} PROJECT GROUP${category.groups.length===1?'':'S'}</b><b>PHOTOS &amp; VIDEOS</b>`;
      let link = media.querySelector('.capability-project-link');
      if (!link) {
        link = document.createElement('a');
        link.className = 'capability-project-link';
        media.querySelector('figcaption')?.appendChild(link);
      }
      link.href = `gallery.html?category=${encodeURIComponent(category.slug)}`;
      link.innerHTML = '<span>View category in Gallery</span><i>→</i>';
    };

    const renderList = () => {
      list.innerHTML = categories.map((category,index) => `
        <button class="capability-row${index===0?' is-active':''}" type="button" data-v16-category-row="${index}" aria-pressed="${index===0?'true':'false'}">
          <span>${String(index+1).padStart(2,'0')}</span><strong>${category.label}</strong><i>→</i>
        </button>`).join('');
      list.querySelectorAll('[data-v16-category-row]').forEach(row => {
        const index = Number(row.dataset.v16CategoryRow);
        const select = () => renderCategory(index);
        row.addEventListener('click', select);
        row.addEventListener('mouseenter', select);
        row.addEventListener('focus', select);
      });
    };

    const intro = document.querySelector('.capabilities .section-intro > p');
    if (intro) intro.textContent = 'Choose the engineering category closest to your requirement, then open the Gallery to inspect the complete project groups, photographs and videos behind that capability.';

    document.querySelectorAll('.capability-gallery-cta').forEach(el=>el.remove());
    let gateway = document.querySelector('.capability-gallery-gateway');
    if (!gateway) {
      gateway = document.createElement('a');
      gateway.className = 'capability-gallery-gateway';
      gateway.href = 'gallery.html';
      layout.insertAdjacentElement('afterend', gateway);
    }
    gateway.innerHTML = `
      <span class="gallery-gateway-count"><b>${manifest.groups.length}</b><small>Project Groups</small></span>
      <span class="gallery-gateway-copy"><small>VSK Project Gallery</small><strong>Browse the complete engineering record.</strong><em>4 core engineering categories · actual machine photographs · videos · project detail</em></span>
      <span class="gallery-gateway-action"><b>Open Gallery</b><i>→</i></span>`;

    renderList();
    renderCategory(0);
    document.body.classList.add('v16-category-refinement-ready');

    const observer = new MutationObserver(() => {
      if (list.querySelectorAll('[data-v16-category-row]').length !== categories.length || list.querySelector('[data-v16-gallery-project]')) {
        renderList();
        renderCategory(0);
      }
      document.querySelectorAll('.capability-gallery-cta').forEach(el=>el.remove());
    });
    observer.observe(list,{childList:true,subtree:false});
    setTimeout(()=>observer.disconnect(),8000);
  };

  injectStyles();
  const start = () => {
    fetch('media/archive-manifest.json',{cache:'no-store'})
      .then(response=>response.ok?response.json():null)
      .then(manifest=>{
        if (!manifest) return;
        build(manifest);
        setTimeout(()=>build(manifest),450);
        setTimeout(()=>build(manifest),1200);
      })
      .catch(()=>{});
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();