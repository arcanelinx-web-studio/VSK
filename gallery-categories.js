(() => {
  'use strict';
  if (document.body.dataset.page !== 'gallery') return;

  const list = document.querySelector('[data-gallery-filter-list]');
  const allButton = document.querySelector('.gallery-filter');
  const grid = document.querySelector('[data-gallery-grid]');
  const status = document.querySelector('[data-gallery-status]');
  const browserKicker = document.querySelector('.gallery-browser-head .kicker');
  const browserCopy = document.querySelector('.gallery-browser-head > p');
  if (!list || !allButton || !grid) return;

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
    try {
      history.replaceState(null, '', key === 'all' ? 'gallery.html' : `gallery.html?category=${encodeURIComponent(key)}`);
    } catch (_) {}
  };

  list.addEventListener('click', event => {
    const button = event.target.closest('[data-gallery-category]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    selectCategory(button.dataset.galleryCategory || 'all');
  });

  allButton.addEventListener('click', () => {
    activeCategory = 'all';
    requestAnimationFrame(() => {
      buildCategoryButtons();
      applyCategory();
    });
  });

  const syncAfterLegacyRender = () => {
    if (!manifest?.groups?.length) return;
    if (list.querySelector('[data-gallery-filter]')) buildCategoryButtons();
    applyCategory();
  };

  /* app-v14 replaces the filter list once when the full manifest arrives. Watch only the
     Gallery controls/grid during that short boot window, then disconnect permanently. */
  const observer = new MutationObserver(syncAfterLegacyRender);
  observer.observe(list, { childList: true });
  observer.observe(grid, { childList: true });
  setTimeout(() => observer.disconnect(), 10000);

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
      setTimeout(syncAfterLegacyRender, 650);
      setTimeout(syncAfterLegacyRender, 1600);
    })
    .catch(() => {
      document.body.classList.add('gallery-categories-ready');
    });
})();
