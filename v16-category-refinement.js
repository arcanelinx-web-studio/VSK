(() => {
  'use strict';
  if (document.body.dataset.page !== 'home') return;

  const categorySpecs = [
    {
      key:'new', label:'New Projects', slug:'new-project', match:c=>/new project/i.test(c), preferred:/thread cutting/i,
      copy:'Recent VSK development work and newly documented machine projects across custom applications.'
    },
    {
      key:'spm-cnc', label:'SPM / CNC Machines', slug:'spm-cnc-machines', match:c=>/spm/i.test(c)&&/cnc/i.test(c)&&!/plc|hmi|servo/i.test(c), preferred:/rod boring|vertical turning|flange facing|facing/i,
      copy:'Purpose-built SPM and CNC machine applications engineered around the component, operation, workholding and cycle target.'
    },
    {
      key:'controls', label:'SPM · PLC / HMI / Servo', slug:'spm-machines-plc-hmi-and-servo-controlled', match:c=>/plc|hmi|servo/i.test(c), preferred:/4\s*servo|slotting/i,
      copy:'Machine projects where PLC, HMI, servo motion and control integration are central to the production result.'
    },
    {
      key:'hydraulic', label:'Hydraulics & Pressing', slug:'hydraulic-systems-and-pressing-units', match:c=>/hydraulic|pressing/i.test(c), preferred:/hydraulic press/i,
      copy:'Hydraulic systems, pressing units and force-driven applications developed for controlled motion, clamping and process reliability.'
    },
    {
      key:'retrofit', label:'Retrofit & Service', slug:'retrofitting-and-service', match:c=>/retrofitting|service/i.test(c), preferred:/kellenberg|hardinge/i,
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
    if (document.getElementById('v16-category-refinement-style')) return;
    const style = document.createElement('style');
    style.id = 'v16-category-refinement-style';
    style.textContent = `
      /* Multidisciplinary Engineering — category-led, not individual project-led. */
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row[data-v16-category-row]{text-decoration:none!important}
      body.v8.v13.v14[data-page="home"] .capability-media [data-capability-index]{color:#5f7890!important}
      body.v8.v13.v14[data-page="home"] .capability-media [data-capability-title]{max-width:650px!important}
      body.v8.v13.v14[data-page="home"] .capability-project-link{min-width:205px!important}

      /* Gallery gateway — premium editorial card instead of a flat banner. */
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta{display:none!important}
      body.v8.v13.v14[data-page="home"] .capability-gallery-gateway{
        box-sizing:border-box!important;
        width:var(--audit-shell,calc(100% - 80px))!important;
        max-width:none!important;
        min-height:118px!important;
        margin:34px auto 0!important;
        padding:0!important;
        display:grid!important;
        grid-template-columns:168px minmax(0,1fr) auto!important;
        align-items:stretch!important;
        text-decoration:none!important;
        color:#0d1824!important;
        background:linear-gradient(100deg,#f1f5f8 0%,#f8fafb 62%,#eef4f8 100%)!important;
        border:1px solid #cbd7e1!important;
        border-top:3px solid #164a9c!important;
        box-shadow:0 18px 42px rgba(13,24,36,.055)!important;
        overflow:hidden!important;
        transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-gateway:hover{
        transform:translateY(-2px)!important;
        border-color:#9fb7ca!important;
        border-top-color:#167bc4!important;
        box-shadow:0 24px 50px rgba(13,24,36,.08)!important;
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-count{
        display:flex!important;flex-direction:column!important;justify-content:center!important;
        padding:20px 28px!important;border-right:1px solid #cbd7e1!important;background:rgba(255,255,255,.48)!important;
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-count b{
        color:#164a9c!important;font:600 42px/.9 "Space Grotesk",sans-serif!important;letter-spacing:-.05em!important
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-count small{
        margin-top:9px!important;color:#66798b!important;font:500 8px/1.25 "IBM Plex Mono",monospace!important;letter-spacing:.13em!important;text-transform:uppercase!important
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-copy{
        min-width:0!important;padding:23px 34px!important;display:flex!important;flex-direction:column!important;justify-content:center!important
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-copy small{
        color:#164a9c!important;font:500 8px/1.2 "IBM Plex Mono",monospace!important;letter-spacing:.14em!important;text-transform:uppercase!important
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-copy strong{
        margin-top:8px!important;color:#102333!important;font:600 clamp(20px,1.7vw,28px)/1.04 "Space Grotesk",sans-serif!important;letter-spacing:-.035em!important
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-copy em{
        margin-top:7px!important;color:#687b8d!important;font:400 12px/1.4 Inter,sans-serif!important;font-style:normal!important
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-action{
        min-width:205px!important;padding:0 28px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:20px!important;
        border-left:1px solid #cbd7e1!important;color:#164a9c!important;font:600 10px/1.2 "IBM Plex Mono",monospace!important;letter-spacing:.06em!important;text-transform:uppercase!important
      }
      body.v8.v13.v14[data-page="home"] .gallery-gateway-action i{
        width:38px!important;height:38px!important;border-radius:50%!important;display:grid!important;place-items:center!important;
        background:#164a9c!important;color:#fff!important;font-style:normal!important;font-size:16px!important;transition:transform .2s ease,background .2s ease!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-gateway:hover .gallery-gateway-action i{transform:translateX(4px)!important;background:#167bc4!important}

      /* Engineering Depth — restore the requested internal breathing room. */
      @media (min-width:1501px){
        body.v8.v13.v14[data-page="home"] .engineering-depth .metric-card{
          padding-left:50px!important;padding-right:50px!important;
        }
      }
      @media (min-width:1181px) and (max-width:1500px){
        body.v8.v13.v14[data-page="home"] .engineering-depth .metric-card{
          padding-left:clamp(38px,3vw,50px)!important;padding-right:clamp(38px,3vw,50px)!important;
        }
      }
      @media (min-width:721px) and (max-width:1180px){
        body.v8.v13.v14[data-page="home"] .engineering-depth .metric-card{
          padding-left:32px!important;padding-right:32px!important;
        }
      }
      @media (max-width:900px){
        body.v8.v13.v14[data-page="home"] .capability-gallery-gateway{grid-template-columns:118px minmax(0,1fr)!important}
        body.v8.v13.v14[data-page="home"] .gallery-gateway-count{padding:18px 20px!important}
        body.v8.v13.v14[data-page="home"] .gallery-gateway-action{grid-column:1/-1!important;min-width:0!important;min-height:58px!important;border-left:0!important;border-top:1px solid #cbd7e1!important;justify-content:space-between!important}
      }
      @media (max-width:620px){
        body.v8.v13.v14[data-page="home"] .capability-gallery-gateway{width:calc(100% - 40px)!important;grid-template-columns:86px minmax(0,1fr)!important;margin-top:24px!important}
        body.v8.v13.v14[data-page="home"] .gallery-gateway-count{padding:16px!important}
        body.v8.v13.v14[data-page="home"] .gallery-gateway-count b{font-size:34px!important}
        body.v8.v13.v14[data-page="home"] .gallery-gateway-copy{padding:19px 18px!important}
        body.v8.v13.v14[data-page="home"] .gallery-gateway-copy strong{font-size:19px!important}
      }
    `;
    document.head.appendChild(style);
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

    const renderList = () => {
      if (list.querySelectorAll('[data-v16-category-row]').length === categories.length && !list.querySelector('[data-v16-gallery-project]')) return;
      list.innerHTML = categories.map((category,index) => `
        <button class="capability-row${index===0?' is-active':''}" type="button" data-v16-category-row="${index}" aria-pressed="${index===0?'true':'false'}">
          <span>${String(index+1).padStart(2,'0')}</span><strong>${category.label}</strong><i>→</i>
        </button>`).join('');
      bindRows();
    };

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
        link.innerHTML = '<span>View category in Gallery</span><i>→</i>';
        media.querySelector('figcaption')?.appendChild(link);
      }
      link.href = `gallery.html?category=${encodeURIComponent(category.slug)}`;
      link.innerHTML = '<span>View category in Gallery</span><i>→</i>';
    };

    const bindRows = () => {
      list.querySelectorAll('[data-v16-category-row]').forEach(row => {
        const index = Number(row.dataset.v16CategoryRow);
        const select = () => renderCategory(index);
        row.addEventListener('click', select);
        row.addEventListener('mouseenter', select);
        row.addEventListener('focus', select);
      });
    };

    const intro = document.querySelector('.capabilities .section-intro > p');
    if (intro) intro.textContent = 'Choose a VSK engineering category to see the type of work behind it, then open the Gallery to inspect the complete project groups, photographs and videos.';

    document.querySelectorAll('.capability-gallery-cta').forEach(el=>el.remove());
    let gateway = document.querySelector('.capability-gallery-gateway');
    if (!gateway) {
      gateway = document.createElement('a');
      gateway.className = 'capability-gallery-gateway';
      gateway.href = 'gallery.html';
      gateway.innerHTML = `
        <span class="gallery-gateway-count"><b>${manifest.groups.length}</b><small>Project Groups</small></span>
        <span class="gallery-gateway-copy"><small>VSK Project Gallery</small><strong>See the complete engineering record.</strong><em>${categories.length} engineering categories · actual project photos · videos · machine details</em></span>
        <span class="gallery-gateway-action"><b>Explore Gallery</b><i>→</i></span>`;
      layout.insertAdjacentElement('afterend', gateway);
    }

    renderList();
    renderCategory(0);

    const observer = new MutationObserver(() => {
      if (list.querySelector('[data-v16-gallery-project]') || list.querySelectorAll('[data-v16-category-row]').length !== categories.length) {
        renderList();
        renderCategory(0);
      }
      document.querySelectorAll('.capability-gallery-cta').forEach(el=>el.remove());
    });
    observer.observe(list,{childList:true,subtree:false});
    setTimeout(()=>observer.disconnect(),6000);
  };

  injectStyles();

  const start = () => {
    fetch('media/archive-manifest.json',{cache:'no-store'})
      .then(response=>response.ok?response.json():null)
      .then(manifest=>{
        if (!manifest) return;
        build(manifest);
        setTimeout(()=>build(manifest),350);
        setTimeout(()=>build(manifest),1000);
      })
      .catch(()=>{});
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
