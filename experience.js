(() => {
  'use strict';
  if (document.body.dataset.page !== 'machines') return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const archive = typeof machineArchive !== 'undefined' && Array.isArray(machineArchive) ? machineArchive : [];
  if (!archive.length) return;

  /* app-v14 still references this node internally. Keep it hidden for compatibility;
     Experience itself deliberately exposes only the searchable index. */
  if (!$('[data-archive-visual-view]')) {
    const legacyVisual = document.createElement('div');
    legacyVisual.hidden = true;
    legacyVisual.setAttribute('data-archive-visual-view', '');
    legacyVisual.className = 'shell archive-visual-grid';
    $('.archive-browser')?.appendChild(legacyVisual);
  }

  const categoryLabels = {
    handling: 'Automation & handling',
    turning: 'Turning & boring',
    pressing: 'Hydraulics & pressing',
    cutting: 'Cutting & machining',
    testing: 'Testing & inspection',
    finishing: 'Finishing & process equipment',
    controls: 'Controls & systems',
    grinding: 'Grinding & retrofit'
  };
  const fallbackMedia = {
    handling: 'media/projects/u-drill.webp',
    turning: 'media/projects/vertical-turning.webp',
    pressing: 'media/v16/images/hydraulic-systems-and-pressing-units/hydraulic-press-transtech-gear/20230216-094120.webp',
    cutting: 'media/projects/z-cut.webp',
    testing: 'media/projects/air-leak.webp',
    finishing: 'media/projects/paint-agitating.webp',
    controls: 'media/retrofit/jig-grinding.webp',
    grinding: 'media/retrofit/kellenberg.webp'
  };

  const state = { type: 'all', query: '', category: '', tech: '', current: [], activeId: '' };
  const code = m => `${m.type === 'retrofit' ? 'RTF' : 'SPM'} / ${String(m.id?.slice(3) || '').padStart(2, '0')}`;
  const label = m => categoryLabels[m.category] || m.category || 'Machine engineering';
  const featureFor = m => {
    if (typeof featureData !== 'undefined' && m.featureId && featureData[m.featureId]) return featureData[m.featureId];
    if (typeof featureData !== 'undefined' && featureData[m.id]) return featureData[m.id];
    return null;
  };
  const mediaFor = m => {
    const f = featureFor(m);
    return f?.media?.[0] || m.media?.[0] || fallbackMedia[m.category] || 'media/legacy/enclosed-machine.webp';
  };
  const matches = m => {
    const text = [m.title, m.customer, m.control, m.note, label(m)].filter(Boolean).join(' ').toLowerCase();
    const techText = [m.title, m.control, m.note].filter(Boolean).join(' ').toLowerCase();
    return (state.type === 'all' || m.type === state.type)
      && (!state.query || text.includes(state.query.toLowerCase()))
      && (!state.category || m.category === state.category)
      && (!state.tech || techText.includes(state.tech));
  };

  function updatePreview(m) {
    if (!m) return;
    state.activeId = m.id;
    $$('[data-machine-id]').forEach(row => row.classList.toggle('is-active', row.dataset.machineId === m.id));
    const media = $('[data-archive-preview-media]');
    if (media) media.innerHTML = `<img src="${mediaFor(m)}" alt="${m.title}">`;
    const codeEl = $('[data-archive-preview-code]'); if (codeEl) codeEl.textContent = `${code(m)} · ${label(m).toUpperCase()}`;
    const title = $('[data-archive-preview-title]'); if (title) title.textContent = m.title;
    const copy = $('[data-archive-preview-copy]');
    if (copy) copy.textContent = `Compare this ${label(m).toLowerCase()} reference${m.control ? ` using ${m.control}` : ''} with your own machine, process and production target.`;
    const open = $('[data-archive-preview-open]'); if (open) open.textContent = 'View full reference →';
  }

  function render() {
    state.current = archive.filter(matches);
    const index = $('[data-archive-index]');
    if (!index) return;
    index.innerHTML = state.current.map((m, i) => `<button class="archive-row${i === 0 ? ' is-active' : ''}" type="button" data-machine-id="${m.id}"><span>${code(m)}</span><strong>${m.title}</strong><small>${m.customer || m.control || label(m)}</small><i>→</i></button>`).join('');
    const count = $('[data-result-count]'); if (count) count.textContent = `${state.current.length} reference${state.current.length === 1 ? '' : 's'}`;
    const active = [];
    if (state.type !== 'all') active.push(state.type === 'spm' ? 'Custom / SPM' : 'Retrofit');
    if (state.category) active.push(categoryLabels[state.category] || state.category);
    if (state.tech) active.push(state.tech.toUpperCase());
    if (state.query) active.push(`“${state.query}”`);
    const activeText = $('[data-active-filters]'); if (activeText) activeText.textContent = active.length ? active.join(' · ') : 'All applications · All technologies';
    const empty = $('[data-archive-empty]'); if (empty) empty.hidden = state.current.length > 0;
    if (state.current[0]) updatePreview(state.current.find(m => m.id === state.activeId) || state.current[0]);
  }

  function renderDrawer(id) {
    const m = archive.find(x => x.id === id);
    const drawer = $('[data-dossier]');
    if (!m || !drawer) return;
    state.activeId = id;
    const feature = featureFor(m);
    const title = feature?.title || m.title;
    const media = feature?.media?.length ? feature.media : [mediaFor(m)];
    $('[data-dossier-kicker]', drawer).textContent = m.type === 'retrofit' ? 'RETROFIT REFERENCE' : 'CUSTOM / SPM REFERENCE';
    $('[data-dossier-id]', drawer).textContent = `${code(m)} · ${label(m).toUpperCase()}`;
    $('[data-dossier-title]', drawer).textContent = title;
    $('[data-dossier-summary]', drawer).textContent = `${title} is a documented VSK ${label(m).toLowerCase()} reference. Use the recorded application, machine configuration and controls to judge how closely it matches your own production requirement.`;
    $('[data-dossier-media]', drawer).innerHTML = media.map((src, i) => `<figure class="dossier-media-item"><img src="${src}" alt="${title}${i ? ` — view ${i + 1}` : ''}"></figure>`).join('');
    const facts = [
      ['Reference', code(m)],
      ['Application', label(m)],
      ...(m.customer ? [['Customer', m.customer]] : []),
      ...(m.control ? [['Control', m.control]] : [])
    ];
    $('[data-dossier-facts]', drawer).innerHTML = facts.map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join('');
    $('[data-dossier-sections]', drawer).innerHTML = `<section><h3>What to compare</h3><p>Compare the application, machine arrangement${m.control ? `, ${m.control} controls` : ''} and recorded scope with the part, cycle-time target and tolerance you need.</p></section><section><h3>Next step</h3><p>If this reference is relevant, share your component, target cycle, tolerance and existing-machine details with VSK for an application review.</p></section>`;
    const pos = state.current.findIndex(x => x.id === id);
    $('[data-dossier-position]', drawer).textContent = `${pos >= 0 ? pos + 1 : 1} / ${state.current.length || archive.length}`;
    drawer.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    $('.dossier-panel', drawer)?.focus();
  }

  function closeDrawer() {
    const drawer = $('[data-dossier]');
    if (!drawer) return;
    drawer.hidden = true;
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
  }
  function moveDrawer(dir) {
    const list = state.current.length ? state.current : archive;
    let i = list.findIndex(x => x.id === state.activeId);
    i = (Math.max(0, i) + dir + list.length) % list.length;
    renderDrawer(list[i].id);
    updatePreview(list[i]);
  }

  function initialise() {
    const categories = $('[data-category-filters]');
    if (categories && !categories.dataset.v16Ready) {
      categories.dataset.v16Ready = '1';
      categories.innerHTML = Object.entries(categoryLabels).map(([key, value]) => `<button type="button" data-category-filter="${key}">${value}</button>`).join('');
    }
    const search = $('[data-archive-search]'); if (search) state.query = search.value.trim();
    const activeType = $('[data-type-filter].is-active'); if (activeType) state.type = activeType.dataset.typeFilter || 'all';
    render();
  }

  document.addEventListener('click', e => {
    if (document.body.dataset.page !== 'machines') return;
    const row = e.target.closest('[data-machine-id]');
    if (row) {
      e.preventDefault(); e.stopImmediatePropagation();
      const m = archive.find(x => x.id === row.dataset.machineId);
      if (m) { updatePreview(m); renderDrawer(m.id); }
      return;
    }
    const preview = e.target.closest('[data-archive-preview-open]');
    if (preview) {
      e.preventDefault(); e.stopImmediatePropagation();
      renderDrawer(state.activeId || state.current[0]?.id || archive[0].id);
      return;
    }
    const type = e.target.closest('[data-type-filter]');
    if (type) {
      e.preventDefault(); e.stopImmediatePropagation(); state.type = type.dataset.typeFilter || 'all';
      $$('[data-type-filter]').forEach(x => x.classList.toggle('is-active', x === type)); render(); return;
    }
    const cat = e.target.closest('[data-category-filter]');
    if (cat) {
      e.preventDefault(); e.stopImmediatePropagation(); state.category = state.category === cat.dataset.categoryFilter ? '' : cat.dataset.categoryFilter;
      $$('[data-category-filter]').forEach(x => x.classList.toggle('is-active', x.dataset.categoryFilter === state.category)); render(); return;
    }
    const tech = e.target.closest('[data-tech-filter]');
    if (tech) {
      e.preventDefault(); e.stopImmediatePropagation(); state.tech = state.tech === tech.dataset.techFilter ? '' : tech.dataset.techFilter;
      $$('[data-tech-filter]').forEach(x => x.classList.toggle('is-active', x.dataset.techFilter === state.tech)); render(); return;
    }
    const clear = e.target.closest('[data-clear-filters]');
    if (clear) {
      e.preventDefault(); e.stopImmediatePropagation(); state.type = 'all'; state.query = state.category = state.tech = '';
      const search = $('[data-archive-search]'); if (search) search.value = '';
      $$('[data-type-filter]').forEach(x => x.classList.toggle('is-active', x.dataset.typeFilter === 'all'));
      $$('[data-category-filter],[data-tech-filter]').forEach(x => x.classList.remove('is-active')); render(); return;
    }
    if (e.target.closest('[data-dossier-close]')) { e.preventDefault(); e.stopImmediatePropagation(); closeDrawer(); return; }
    if (e.target.closest('[data-dossier-prev]')) { e.preventDefault(); e.stopImmediatePropagation(); moveDrawer(-1); return; }
    if (e.target.closest('[data-dossier-next]')) { e.preventDefault(); e.stopImmediatePropagation(); moveDrawer(1); return; }
  }, true);

  document.addEventListener('mouseover', e => {
    const row = e.target.closest?.('[data-machine-id]');
    if (!row) return;
    const m = archive.find(x => x.id === row.dataset.machineId); if (m) updatePreview(m);
  }, true);
  document.addEventListener('focusin', e => {
    const row = e.target.closest?.('[data-machine-id]');
    if (!row) return;
    const m = archive.find(x => x.id === row.dataset.machineId); if (m) updatePreview(m);
  }, true);
  document.addEventListener('input', e => {
    if (!e.target.matches?.('[data-archive-search]')) return;
    state.query = e.target.value.trim(); render();
  }, true);

  initialise();
  setTimeout(initialise, 700);
  setTimeout(initialise, 1600);
})();
