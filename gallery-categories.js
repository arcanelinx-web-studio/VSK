(() => {
  'use strict';
  if (document.body.dataset.page !== 'gallery') return;

  const controls = document.querySelector('.gallery-controls');
  const grid = document.querySelector('[data-gallery-grid]');
  const status = document.querySelector('[data-gallery-status]');
  const browserKicker = document.querySelector('.gallery-browser-head .kicker');
  const browserCopy = document.querySelector('.gallery-browser-head > p');
  if (!controls || !grid) return;

  const taxonomy = [
    {key:'spm-cnc-machines', label:'SPM / CNC Machines', match:value => (/spm/i.test(value)&&/cnc/i.test(value)&&!/plc|hmi|servo/i.test(value)) || /^new project$/i.test(value)},
    {key:'spm-machines-plc-hmi-and-servo-controlled', label:'SPM · PLC / HMI / Servo', match:value => /plc|hmi|servo/i.test(value)},
    {key:'hydraulic-systems-and-pressing-units', label:'Hydraulics & Pressing', match:value => /hydraulic|press/i.test(value)},
    {key:'retrofitting-and-service', label:'Retrofit & CNC', match:value => /retrofitting|service/i.test(value)}
  ];

  let manifest = null;
  let activeCategory = 'all';

  const categoryKey = value => taxonomy.find(item => item.match(String(value || '')))?.key || 'spm-cnc-machines';
  const categories = () => taxonomy.map(item => ({
    ...item,
    groups:(manifest?.groups || []).filter(group => categoryKey(group.category) === item.key)
  }));

  const ensureStyles = () => {
    let style = document.getElementById('v16-gallery-compact-rail');
    if (!style) {
      style = document.createElement('style');
      style.id = 'v16-gallery-compact-rail';
      document.head.appendChild(style);
    }
    style.textContent = `
      html body.v8.v13.v14[data-page="gallery"] .gallery-controls{
        box-sizing:border-box!important;
        width:var(--audit-shell,calc(100% - 80px))!important;
        max-width:none!important;
        margin:22px auto 0!important;
        padding:0!important;
        display:grid!important;
        grid-template-columns:repeat(5,minmax(0,1fr))!important;
        gap:8px!important;
        align-items:stretch!important;
        background:transparent!important;
        border:0!important;
        min-height:0!important;
        height:auto!important;
        overflow:visible!important;
      }
      html body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-category-button{
        position:relative!important;
        box-sizing:border-box!important;
        width:100%!important;
        min-width:0!important;
        min-height:64px!important;
        height:64px!important;
        margin:0!important;
        padding:10px 12px!important;
        display:grid!important;
        grid-template-columns:minmax(0,1fr) 18px!important;
        grid-template-rows:auto 1fr!important;
        column-gap:8px!important;
        align-items:start!important;
        border:1px solid #cbd7df!important;
        background:#fbfcfc!important;
        color:#102333!important;
        text-align:left!important;
        box-shadow:none!important;
        overflow:hidden!important;
        cursor:pointer!important;
        transition:background .18s ease,border-color .18s ease,transform .18s ease!important;
      }
      html body.v8.v13.v14[data-page="gallery"] .gallery-category-button .gallery-cat-label{
        grid-column:1!important;
        min-width:0!important;
        display:flex!important;
        align-items:center!important;
        gap:7px!important;
        overflow:hidden!important;
        color:#31567f!important;
        font:500 9px/1.15 "IBM Plex Mono",monospace!important;
        letter-spacing:.07em!important;
        text-transform:uppercase!important;
        white-space:nowrap!important;
        text-overflow:ellipsis!important;
      }
      html body.v8.v13.v14[data-page="gallery"] .gallery-category-button .gallery-cat-index{
        flex:0 0 auto!important;
        color:#91a3b2!important;
      }
      html body.v8.v13.v14[data-page="gallery"] .gallery-category-button strong{
        grid-column:1!important;
        align-self:end!important;
        margin:5px 0 0!important;
        color:#102333!important;
        font:600 14px/1 "Space Grotesk",Inter,sans-serif!important;
        letter-spacing:-.02em!important;
        white-space:nowrap!important;
      }
      html body.v8.v13.v14[data-page="gallery"] .gallery-category-button i{
        grid-column:2!important;
        grid-row:1/3!important;
        align-self:end!important;
        justify-self:end!important;
        color:#8ca2b3!important;
        font-style:normal!important;
        font-size:14px!important;
        transition:transform .18s ease,color .18s ease!important;
      }
      html body.v8.v13.v14[data-page="gallery"] .gallery-category-button:hover{
        background:#f3f7f9!important;
        border-color:#aebfcb!important;
        transform:translateY(-1px)!important;
      }
      html body.v8.v13.v14[data-page="gallery"] .gallery-category-button:hover i{
        color:#167bc4!important;
        transform:translateX(3px)!important;
      }
      html body.v8.v13.v14[data-page="gallery"] .gallery-category-button.is-active{
        background:#edf4f9!important;
        border-color:#9fb8ce!important;
        box-shadow:inset 0 3px 0 #1e56aa!important;
      }
      html body.v8.v13.v14[data-page="gallery"] .gallery-status{
        margin-top:10px!important;
        min-height:24px!important;
        padding:0!important;
        border:0!important;
        font-size:11px!important;
      }
      html body.v8.v13.v14[data-page="gallery"] .gallery-status::before,
      html body.v8.v13.v14[data-page="gallery"] .gallery-status::after{display:none!important;content:none!important}
      @media(max-width:1220px){
        html body.v8.v13.v14[data-page="gallery"] .gallery-controls{grid-template-columns:repeat(3,minmax(0,1fr))!important}
      }
      @media(max-width:760px){
        html body.v8.v13.v14[data-page="gallery"] .gallery-controls{
          width:calc(100% - 40px)!important;
          grid-template-columns:1fr 1fr!important;
          gap:7px!important;
        }
        html body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-category-button{height:62px!important;min-height:62px!important}
      }
      @media(max-width:500px){
        html body.v8.v13.v14[data-page="gallery"] .gallery-controls{grid-template-columns:1fr!important}
      }
    `;
    document.head.appendChild(style);
  };

  if (browserKicker) browserKicker.textContent = 'PROJECT CATEGORIES';
  if (browserCopy) browserCopy.textContent = 'Choose the engineering family closest to your requirement, then inspect the individual project groups, machine construction, controls and process detail.';

  const updateSummary = () => {
    const groups = manifest?.groups || [];
    const totalMedia = groups.reduce((n, group) => n + (group.items?.length || 0), 0);
    const groupCount = document.querySelector('[data-gallery-group-count]');
    const imageCount = document.querySelector('[data-gallery-image-count]');
    const videoCount = document.querySelector('[data-gallery-video-count]');
    if (groupCount) groupCount.textContent = `${groups.length} project groups`;
    if (imageCount) imageCount.textContent = '4 engineering categories';
    if (videoCount) videoCount.textContent = `${totalMedia} media items`;
  };

  const renderControls = () => {
    if (!manifest?.groups?.length) return;
    const items = [
      {key:'all', label:'All Projects', count:manifest.groups.length, suffix:'project groups'},
      ...categories().map(cat => ({key:cat.key, label:cat.label, count:cat.groups.length, suffix:cat.groups.length === 1 ? 'project' : 'projects'}))
    ];
    controls.innerHTML = items.map((item,index) => `
      <button class="gallery-category-button${item.key === activeCategory ? ' is-active' : ''}" type="button" data-gallery-category="${item.key}">
        <span class="gallery-cat-label"><span class="gallery-cat-index">${String(index).padStart(2,'0')}</span>${item.label}</span>
        <strong>${item.count} ${item.suffix}</strong><i>→</i>
      </button>`).join('');
    updateSummary();
  };

  const applyCategory = () => {
    if (!manifest?.groups?.length) return;
    const sections = [...grid.querySelectorAll('.gallery-project-group')];
    const groups = manifest.groups || [];
    let visible = 0;
    sections.forEach((section,index) => {
      const group = groups[index];
      const show = activeCategory === 'all' || categoryKey(group?.category) === activeCategory;
      section.hidden = !show;
      if (show) visible += 1;
    });
    controls.querySelectorAll('[data-gallery-category]').forEach(button => {
      button.classList.toggle('is-active', button.dataset.galleryCategory === activeCategory);
    });
    if (status) {
      if (activeCategory === 'all') status.textContent = `${groups.length} project groups · 4 engineering categories`;
      else {
        const cat = categories().find(item => item.key === activeCategory);
        status.textContent = `${visible} project group${visible === 1 ? '' : 's'} · ${cat?.label || 'Selected category'}`;
      }
    }
  };

  const selectCategory = key => {
    activeCategory = key;
    renderControls();
    applyCategory();
    try { history.replaceState(null, '', key === 'all' ? 'gallery.html' : `gallery.html?category=${encodeURIComponent(key)}`); } catch (_) {}
  };

  controls.addEventListener('click', event => {
    const button = event.target.closest('[data-gallery-category]');
    if (!button) return;
    event.preventDefault();
    selectCategory(button.dataset.galleryCategory || 'all');
  });

  ensureStyles();
  fetch(`media/archive-manifest.json?review=${Date.now()}`, {cache:'no-store'})
    .then(response => response.ok ? response.json() : null)
    .then(data => {
      if (!data?.groups?.length) return;
      manifest = data;
      const requested = new URL(location.href).searchParams.get('category');
      const available = new Set(['all', ...taxonomy.map(cat => cat.key)]);
      activeCategory = requested && available.has(requested) ? requested : 'all';
      renderControls();
      requestAnimationFrame(applyCategory);
      setTimeout(applyCategory, 450);
      setTimeout(applyCategory, 1200);
    })
    .catch(() => {});
})();