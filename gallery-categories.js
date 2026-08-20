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

  /* Final Gallery category presentation. The legacy project-name controls are never shown. */
  if (!document.getElementById('v16-gallery-category-field')) {
    const style = document.createElement('style');
    style.id = 'v16-gallery-category-field';
    style.textContent = `
      body.v8.v13.v14[data-page="gallery"] .gallery-controls{
        display:grid!important;
        grid-template-columns:repeat(3,minmax(0,1fr))!important;
        gap:10px!important;
        align-items:stretch!important;
        margin-top:28px!important;
      }
      body.v8.v13.v14[data-page="gallery"] [data-gallery-filter-list]{display:contents!important}
      body.v8.v13.v14[data-page="gallery"] [data-gallery-filter-list] > [data-gallery-filter]{display:none!important}
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category]{
        box-sizing:border-box!important;
        width:100%!important;
        min-width:0!important;
        min-height:68px!important;
        margin:0!important;
        padding:12px 17px 11px!important;
        display:flex!important;
        flex-direction:column!important;
        align-items:flex-start!important;
        justify-content:center!important;
        gap:5px!important;
        border:1px solid #c9d5df!important;
        background:#fff!important;
        color:#314254!important;
        text-align:left!important;
        box-shadow:none!important;
        transition:border-color .18s ease,background .18s ease,color .18s ease!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter span,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category] span{
        display:block!important;
        color:#31567f!important;
        font:500 10px/1.2 "IBM Plex Mono",monospace!important;
        letter-spacing:.075em!important;
        text-transform:uppercase!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter b,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category] b{
        display:block!important;
        color:#314254!important;
        font:600 15px/1.15 Inter,sans-serif!important;
        letter-spacing:-.01em!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter:hover,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category]:hover{
        border-color:#1e56aa!important;
        background:#f7fafc!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter.is-active,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category].is-active{
        background:#1e56aa!important;
        border-color:#1e56aa!important;
        color:#fff!important;
      }
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter.is-active span,
      body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter.is-active b,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category].is-active span,
      body.v8.v13.v14[data-page="gallery"] [data-gallery-category].is-active b{color:#fff!important}
      body.v8.v13.v14[data-page="gallery"] .gallery-status{margin-top:22px!important}
      @media (max-width:980px){
        body.v8.v13.v14[data-page="gallery"] .gallery-controls{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      }
      @media (max-width:620px){
        body.v8.v13.v14[data-page="gallery"] .gallery-controls{grid-template-columns:1fr!important;gap:8px!important}
        body.v8.v13.v14[data-page="gallery"] .gallery-controls > .gallery-filter,
        body.v8.v13.v14[data-page="gallery"] [data-gallery-category]{min-height:60px!important;padding:11px 14px!important}
      }
    `;
    document.head.appendChild(style);
  }

  if (browserKicker) browserKicker.textContent = 'PROJECT CATEGORIES';
  if (browserCopy) browserCopy.textContent = 'Choose the engineering category closest to your requirement, then open the individual project groups to inspect machine construction, controls, mechanisms and process detail.';

  let manifest = null;
  let activeCategory = 'all';

  const slug = value => String(value || 'Other')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const categoryLabel = value => {
    const raw = String(value || 'Other');
    if (/^new project$/i.test(raw)) return 'New Projects';
    if (/retrofitting/i.test(raw)) return 'Retrofit & Service';
    if (/spm.*cnc/i.test(raw)) return 'SPM / CNC Machines';
    if (/plc|hmi|servo/i.test(raw)) return 'SPM · PLC / HMI / Servo';
    if (/hydraulic|press/i.test(raw)) return 'Hydraulics & Pressing';
    return raw.replace(/\bAnd\b/g, '&');
  };

  const categoryOrder = new Map([
    ['New Projects', 0],
    ['SPM / CNC Machines', 1],
    ['SPM · PLC / HMI / Servo', 2],
    ['Hydraulics & Pressing', 3],
    ['Retrofit & Service', 4]
  ]);

  const categories = () => {
    const map = new Map();
    (manifest?.groups || []).forEach(group => {
      const key = slug(group.category);
      if (!map.has(key)) map.set(key, { key, label: categoryLabel(group.category), groups: [] });
      map.get(key).groups.push(group);
    });
    return [...map.values()].sort((a, b) => (categoryOrder.get(a.label) ?? 99) - (categoryOrder.get(b.label) ?? 99));
  };

  const updateSummary = () => {
    const cats = categories();
    const totalGroups = manifest?.groups?.length || 0;
    const totalMedia = (manifest?.groups || []).reduce((n, group) => n + (group.items?.length || 0), 0);
    const groupCount = document.querySelector('[data-gallery-group-count]');
    const imageCount = document.querySelector('[data-gallery-image-count]');
    const videoCount = document.querySelector('[data-gallery-video-count]');
    if (groupCount) groupCount.textContent = `${totalGroups} project groups`;
    if (imageCount) imageCount.textContent = `${cats.length} categories`;
    if (videoCount) videoCount.textContent = `${totalMedia} media items`;
  };

  const buildCategoryButtons = () => {
    if (!manifest?.groups?.length) return;
    const cats = categories();
    list.innerHTML = cats.map(cat => `
      <button type="button" data-gallery-category="${cat.key}" class="${cat.key === activeCategory ? 'is-active' : ''}">
        <span>${cat.label}</span><b>${cat.groups.length} project${cat.groups.length === 1 ? '' : 's'}</b>
      </button>`).join('');
    allButton.innerHTML = `<span>All projects</span><b>${manifest.groups.length} projects</b>`;
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
      const show = activeCategory === 'all' || slug(group?.category) === activeCategory;
      section.hidden = !show;
      if (show) visibleGroups += 1;
    });
    [...list.querySelectorAll('[data-gallery-category]')].forEach(button => {
      button.classList.toggle('is-active', button.dataset.galleryCategory === activeCategory);
    });
    allButton.classList.toggle('is-active', activeCategory === 'all');
    if (status) {
      if (activeCategory === 'all') status.textContent = `${manifest.groups.length} project groups · ${categories().length} engineering categories`;
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

  allButton.addEventListener('click', () => selectCategory('all'));

  const syncAfterLegacyRender = () => {
    if (!manifest?.groups?.length) return;
    if (list.querySelector('[data-gallery-filter]')) buildCategoryButtons();
    applyCategory();
  };

  /* Legacy gallery rendering can replace the filter list during initial manifest hydration.
     Watch only this local control/grid boot window, then disconnect permanently. */
  const observer = new MutationObserver(syncAfterLegacyRender);
  observer.observe(list, { childList: true });
  observer.observe(grid, { childList: true });
  setTimeout(() => observer.disconnect(), 8000);

  fetch('media/archive-manifest.json', { cache: 'no-store' })
    .then(response => response.ok ? response.json() : null)
    .then(data => {
      if (!data?.groups?.length) return;
      manifest = data;
      const requested = new URL(location.href).searchParams.get('category');
      const available = new Set(categories().map(cat => cat.key));
      activeCategory = requested && available.has(requested) ? requested : 'all';
      buildCategoryButtons();
      requestAnimationFrame(applyCategory);
      setTimeout(syncAfterLegacyRender, 500);
      setTimeout(syncAfterLegacyRender, 1300);
    })
    .catch(() => document.body.classList.add('gallery-categories-ready'));
})();
