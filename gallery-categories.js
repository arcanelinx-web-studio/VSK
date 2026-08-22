(() => {
  'use strict';
  if (document.body.dataset.page !== 'gallery') return;

  const list = document.querySelector('[data-gallery-filter-list]');
  const allButton = document.querySelector('.gallery-controls > .gallery-filter');
  const grid = document.querySelector('[data-gallery-grid]');
  const status = document.querySelector('[data-gallery-status]');
  const browserKicker = document.querySelector('.gallery-browser-head .kicker');
  const browserCopy = document.querySelector('.gallery-browser-head > p');
  if (!list || !allButton || !grid) return;

  if (!document.getElementById('v16-gallery-category-field')) {
    const style = document.createElement('style');
    style.id = 'v16-gallery-category-field';
    style.textContent = `
      body.v8.v13.v14[data-page="gallery"] .gallery-controls{
        display:grid!important;
        grid-template-columns:1.08fr repeat(4,minmax(0,1fr))!important;
        gap:0!important;
        align-items:stretch!important;
        margin-top:30px!important;
        border:1px solid #c8d4de!important;
        background:#fff!important;
        overflow:hidden!important;
      }
      body.v8.v13.v14[data-page="gallery"] [data-gallery-filter-list]{display:contents!important}
      body.v8.v13.v14[data-page="gallery"] [data-gallery-filter-list] > [data-gallery-filter]{display:none!important}
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category]{
        position:relative!important;
        box-sizing:border-box!important;
        width:100%!important;
        min-width:0!important;
        min-height:96px!important;
        margin:0!important;
        padding:17px 18px 15px!important;
        display:grid!important;
        grid-template-columns:minmax(0,1fr) 24px!important;
        grid-template-rows:auto 1fr!important;
        column-gap:12px!important;
        align-items:start!important;
        border:0!important;
        border-right:1px solid #d4dee5!important;
        background:#fff!important;
        color:#102333!important;
        text-align:left!important;
        box-shadow:none!important;
        transition:background .18s ease,color .18s ease,box-shadow .18s ease!important;
      }
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category]:last-child{border-right:0!important}
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter span,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category] span{
        grid-column:1!important;
        display:flex!important;
        align-items:center!important;
        gap:9px!important;
        color:#31567f!important;
        font:500 8px/1.2 "IBM Plex Mono",monospace!important;
        letter-spacing:.105em!important;
        text-transform:uppercase!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls button span em{
        color:#8ea2b3!important;
        font-style:normal!important;
        font-weight:500!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter b,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category] b{
        grid-column:1!important;
        align-self:end!important;
        display:block!important;
        margin-top:11px!important;
        color:#102333!important;
        font:600 clamp(15px,1.05vw,18px)/1.12 "Space Grotesk",Inter,sans-serif!important;
        letter-spacing:-.02em!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls button i{
        grid-column:2!important;
        grid-row:1/3!important;
        align-self:center!important;
        justify-self:end!important;
        color:#9aabb9!important;
        font-style:normal!important;
        font-size:16px!important;
        transition:transform .18s ease,color .18s ease!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter:hover,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category]:hover{
        background:#f6f9fb!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls button:hover i{
        color:#167bc4!important;
        transform:translateX(3px)!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter.is-active,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category].is-active{
        background:#eef4fa!important;
        box-shadow:inset 0 4px 0 #1e56aa!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter.is-active span,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category].is-active span{color:#174f9f!important}
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter.is-active b,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category].is-active b{color:#0d1824!important}
      body.v8.v13.v14[data-page="gallery"] .gallery-controls button.is-active i{color:#1e56aa!important}
      body.v8.v13.v14[data-page="gallery"] .gallery-status{margin-top:20px!important}
      @media (max-width:1180px){
        body.v8.v13.v14[data-page="gallery"] .gallery-controls{
          grid-template-columns:repeat(3,minmax(0,1fr))!important;
          gap:1px!important;
          background:#d4dee5!important;
        }
        body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter,
        body.v8.v13.v14[data-page="gallery"] [data-gallery-category]{border-right:0!important}
      }
      @media (max-width:720px){
        body.v8.v13.v14[data-page="gallery"] .gallery-controls{grid-template-columns:1fr!important}
        body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter,
        body.v8.v13.v14[data-page="gallery"] [data-gallery-category]{min-height:76px!important;padding:14px 16px!important}
      }
    `;
    document.head.appendChild(style);
  }

  if (browserKicker) browserKicker.textContent = 'PROJECT CATEGORIES';
  if (browserCopy) browserCopy.textContent = 'Choose one of the same four engineering categories used across the VSK website, then open individual project groups to inspect machine construction, controls, mechanisms and process detail.';

  let manifest = null;
  let activeCategory = 'all';

  const taxonomy = [
    {key:'spm-cnc-machines', label:'SPM / CNC Machines', match:value => (/spm/i.test(value)&&/cnc/i.test(value)&&!/plc|hmi|servo/i.test(value)) || /^new project$/i.test(value)},
    {key:'spm-machines-plc-hmi-and-servo-controlled', label:'SPM · PLC / HMI / Servo', match:value => /plc|hmi|servo/i.test(value)},
    {key:'hydraulic-systems-and-pressing-units', label:'Hydraulics & Pressing', match:value => /hydraulic|press/i.test(value)},
    {key:'retrofitting-and-service', label:'Retrofit & CNC', match:value => /retrofitting|service/i.test(value)}
  ];

  const categoryKey = value => taxonomy.find(item => item.match(String(value || '')))?.key || 'spm-cnc-machines';

  const categories = () => taxonomy.map(item => ({
    ...item,
    groups:(manifest?.groups || []).filter(group => categoryKey(group.category) === item.key)
  }));

  const updateSummary = () => {
    const totalGroups = manifest?.groups?.length || 0;
    const totalMedia = (manifest?.groups || []).reduce((n, group) => n + (group.items?.length || 0), 0);
    const groupCount = document.querySelector('[data-gallery-group-count]');
    const imageCount = document.querySelector('[data-gallery-image-count]');
    const videoCount = document.querySelector('[data-gallery-video-count]');
    if (groupCount) groupCount.textContent = `${totalGroups} project groups`;
    if (imageCount) imageCount.textContent = '4 engineering categories';
    if (videoCount) videoCount.textContent = `${totalMedia} media items`;
  };

  const buildCategoryButtons = () => {
    if (!manifest?.groups?.length) return;
    const cats = categories();
    list.innerHTML = cats.map((cat,index) => `
      <button type="button" data-gallery-category="${cat.key}" class="${cat.key === activeCategory ? 'is-active' : ''}">
        <span><em>${String(index + 1).padStart(2,'0')}</em>${cat.label}</span>
        <b>${cat.groups.length} project${cat.groups.length === 1 ? '' : 's'}</b><i>→</i>
      </button>`).join('');
    allButton.innerHTML = `<span><em>00</em>All projects</span><b>${manifest.groups.length} project groups</b><i>→</i>`;
    allButton.classList.toggle('is-active', activeCategory === 'all');
    document.body.classList.add('gallery-categories-ready');
    updateSummary();
  };

  const applyCategory = () => {
    if (!manifest?.groups?.length) return;
    const sections = [...grid.querySelectorAll('.gallery-project-group')];
    const groups = manifest.groups || [];
    let visibleGroups = 0;
    sections.forEach((section, index) => {
      const group = groups[index];
      const show = activeCategory === 'all' || categoryKey(group?.category) === activeCategory;
      section.hidden = !show;
      if (show) visibleGroups += 1;
    });
    [...list.querySelectorAll('[data-gallery-category]')].forEach(button => {
      button.classList.toggle('is-active', button.dataset.galleryCategory === activeCategory);
    });
    allButton.classList.toggle('is-active', activeCategory === 'all');
    if (status) {
      if (activeCategory === 'all') status.textContent = `${manifest.groups.length} project groups · 4 engineering categories`;
      else {
        const cat = categories().find(item => item.key === activeCategory);
        status.textContent = `${visibleGroups} project group${visibleGroups === 1 ? '' : 's'} · ${cat?.label || 'Selected category'}`;
      }
    }
  };

  const selectCategory = key => {
    activeCategory = key;
    buildCategoryButtons();
    applyCategory();
    try { history.replaceState(null, '', key === 'all' ? 'gallery.html' : `gallery.html?category=${encodeURIComponent(key)}`); } catch (_) {}
  };

  list.addEventListener('click', event => {
    const button = event.target.closest('[data-gallery-category]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    selectCategory(button.dataset.galleryCategory || 'all');
  });

  allButton.addEventListener('click', event => {
    event.preventDefault();
    selectCategory('all');
  });

  const syncAfterLegacyRender = () => {
    if (!manifest?.groups?.length) return;
    if (list.querySelector('[data-gallery-filter]')) buildCategoryButtons();
    applyCategory();
  };

  const observer = new MutationObserver(syncAfterLegacyRender);
  observer.observe(list, { childList: true });
  observer.observe(grid, { childList: true });
  setTimeout(() => observer.disconnect(), 8000);

  fetch(`media/archive-manifest.json?review=${Date.now()}`, { cache: 'no-store' })
    .then(response => response.ok ? response.json() : null)
    .then(data => {
      if (!data?.groups?.length) return;
      manifest = data;
      const requested = new URL(location.href).searchParams.get('category');
      const available = new Set(taxonomy.map(cat => cat.key));
      activeCategory = requested && available.has(requested) ? requested : 'all';
      buildCategoryButtons();
      requestAnimationFrame(applyCategory);
      setTimeout(syncAfterLegacyRender, 500);
      setTimeout(syncAfterLegacyRender, 1300);
    })
    .catch(() => document.body.classList.add('gallery-categories-ready'));
})();