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

  /* One compact category language: All + the same four engineering families used on Home. */
  if (!document.getElementById('v16-gallery-category-field')) {
    const style = document.createElement('style');
    style.id = 'v16-gallery-category-field';
    style.textContent = `
      body.v8.v13.v14[data-page="gallery"] .gallery-controls{
        display:grid!important;
        grid-template-columns:repeat(5,minmax(0,1fr))!important;
        gap:1px!important;
        align-items:stretch!important;
        margin-top:26px!important;
        padding:1px!important;
        border:0!important;
        background:#d3dde4!important;
        overflow:visible!important;
      }
      body.v8.v13.v14[data-page="gallery"] [data-gallery-filter-list]{display:contents!important}
      body.v8.v13.v14[data-page="gallery"] [data-gallery-filter-list] > [data-gallery-filter]{display:none!important}
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category]{
        position:relative!important;
        box-sizing:border-box!important;
        width:100%!important;
        min-width:0!important;
        min-height:82px!important;
        height:82px!important;
        margin:0!important;
        padding:13px 14px 12px!important;
        display:grid!important;
        grid-template-columns:minmax(0,1fr) 20px!important;
        grid-template-rows:auto 1fr!important;
        column-gap:10px!important;
        align-items:start!important;
        border:0!important;
        background:#fbfcfc!important;
        color:#102333!important;
        text-align:left!important;
        box-shadow:none!important;
        overflow:hidden!important;
        transition:background .18s ease,box-shadow .18s ease!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter span,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category] span{
        grid-column:1!important;
        min-width:0!important;
        display:flex!important;
        align-items:center!important;
        gap:8px!important;
        overflow:hidden!important;
        color:#31567f!important;
        font:500 9px/1.25 "IBM Plex Mono",monospace!important;
        letter-spacing:.075em!important;
        text-transform:uppercase!important;
        white-space:nowrap!important;
        text-overflow:ellipsis!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls button span em{
        flex:0 0 auto!important;
        color:#91a3b2!important;
        font-style:normal!important;
        font-weight:500!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter b,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category] b{
        grid-column:1!important;
        align-self:end!important;
        display:block!important;
        margin:8px 0 0!important;
        color:#102333!important;
        font:600 16px/1.08 "Space Grotesk",Inter,sans-serif!important;
        letter-spacing:-.025em!important;
        white-space:nowrap!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls button i{
        grid-column:2!important;
        grid-row:1/3!important;
        align-self:end!important;
        justify-self:end!important;
        color:#94a8b8!important;
        font-style:normal!important;
        font-size:15px!important;
        transition:transform .18s ease,color .18s ease!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter:hover,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category]:hover{background:#f3f7f9!important}
      body.v8.v13.v14[data-page="gallery"] .gallery-controls button:hover i{color:#167bc4!important;transform:translateX(4px)!important}
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter.is-active,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category].is-active{
        background:#eef4fa!important;
        box-shadow:inset 0 3px 0 #1e56aa!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter.is-active span,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category].is-active span{color:#174f9f!important}
      body.v8.v13.v14[data-page="gallery"] .gallery-controls button.is-active i{color:#1e56aa!important}
      body.v8.v13.v14[data-page="gallery"] .gallery-status{
        margin-top:14px!important;
        padding-top:0!important;
        min-height:30px!important;
        border:0!important;
        font-size:12px!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-status::before,
      body.v8.v13.v14[data-page="gallery"] .gallery-status::after{display:none!important;content:none!important}
      @media (max-width:1220px){
        body.v8.v13.v14[data-page="gallery"] .gallery-controls{grid-template-columns:repeat(3,minmax(0,1fr))!important}
      }
      @media (max-width:760px){
        body.v8.v13.v14[data-page="gallery"] .gallery-controls{grid-template-columns:1fr!important}
        body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter,
        body.v8.v13.v14[data-page="gallery"] [data-gallery-category]{height:70px!important;min-height:70px!important;padding:11px 13px!important}
        body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter span,
        body.v8.v13.v14[data-page="gallery"] [data-gallery-category] span{white-space:normal!important}
      }
    `;
    document.head.appendChild(style);
  }

  if (browserKicker) browserKicker.textContent = 'PROJECT CATEGORIES';
  if (browserCopy) browserCopy.textContent = 'Choose the engineering family closest to your requirement, then inspect the individual project groups, machine construction, controls and process detail.';

  let manifest = null;
  let activeCategory = 'all';

  const taxonomy = [
    {key:'spm-cnc-machines', label:'SPM / CNC Machines', match:value => (/spm/i.test(value)&&/cnc/i.test(value)&&!/plc|hmi|servo/i.test(value)) || /^new project$/i.test(value)},
    {key:'spm-machines-plc-hmi-and-servo-controlled', label:'SPM · PLC / HMI / Servo', match:value => /plc|hmi|servo/i.test(value)},
    {key:'hydraulic-systems-and-pressing-units', label:'Hydraulics & Pressing', match:value => /hydraulic|press/i.test(value)},
    {key:'retrofitting-and-service', label:'Retrofit & CNC', match:value => /retrofitting|service/i.test(value)}
  ];

  const categoryKey = value => taxonomy.find(item => item.match(String(value || '')))?.key || 'spm-cnc-machines';
  const categories = () => taxonomy.map(item => ({...item, groups:(manifest?.groups || []).filter(group => categoryKey(group.category) === item.key)}));

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
        <b>${cat.groups.length} ${cat.groups.length === 1 ? 'project' : 'projects'}</b><i>→</i>
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

  /* app.js hydrates the gallery once. If it restores legacy project-name filters,
     replace them with this one category rail, then stop observing. */
  const syncAfterLegacyRender = () => {
    if (!manifest?.groups?.length) return;
    if (list.querySelector('[data-gallery-filter]')) buildCategoryButtons();
    applyCategory();
  };
  const observer = new MutationObserver(syncAfterLegacyRender);
  observer.observe(list, { childList:true });
  observer.observe(grid, { childList:true });
  setTimeout(() => observer.disconnect(), 7000);

  fetch(`media/archive-manifest.json?review=${Date.now()}`, {cache:'no-store'})
    .then(response => response.ok ? response.json() : null)
    .then(data => {
      if (!data?.groups?.length) return;
      manifest = data;
      const requested = new URL(location.href).searchParams.get('category');
      const available = new Set(taxonomy.map(cat => cat.key));
      activeCategory = requested && available.has(requested) ? requested : 'all';
      buildCategoryButtons();
      requestAnimationFrame(applyCategory);
      setTimeout(syncAfterLegacyRender, 450);
      setTimeout(syncAfterLegacyRender, 1200);
    })
    .catch(() => document.body.classList.add('gallery-categories-ready'));
})();