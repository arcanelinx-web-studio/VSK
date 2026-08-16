(() => {
  'use strict';

  document.body.classList.add('v16-premium');

  const ensureStylesheet = (href) => {
    if (document.querySelector(`link[href^="${href}"]`)) return;
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = `${href}?v=17.1`;
    document.head.appendChild(css);
  };
  ensureStylesheet('v16.css');
  ensureStylesheet('v17.css');

  const isRenderableMedia = (item) => {
    if (!item || item.sourceOnly || item.displayable === false) return false;
    const src = item.thumb || item.poster || item.src || item.src_mp4 || item.web || '';
    if (!src) return false;
    if (item.type === 'image') return !/\.(heic|heif)(?:$|[?#])/i.test(src);
    if (item.type === 'video') return Boolean((item.poster || item.thumb) && (item.src_mp4 || item.web || item.src));
    return false;
  };

  const cleanManifest = (input) => {
    if (!input || !Array.isArray(input.groups)) return input;
    const groups = input.groups
      .map(group => ({ ...group, items: (group.items || []).filter(isRenderableMedia) }))
      .filter(group => group.items.length);
    const images = groups.reduce((n, group) => n + group.items.filter(item => item.type === 'image').length, 0);
    const videos = groups.reduce((n, group) => n + group.items.filter(item => item.type === 'video').length, 0);
    return {
      ...input,
      groups,
      summary: { ...(input.summary || {}), groups: groups.length, images, videos }
    };
  };

  const mediaSrc = item => item?.thumb || item?.poster || item?.src || item?.web || item?.src_mp4 || '';
  const groupText = group => `${group?.category || ''} ${group?.title || ''} ${group?.project || ''} ${group?.path || ''}`.toLowerCase();

  function buildMediaPools(manifest) {
    const pools = { turning: [], cutting: [], handling: [], testing: [], finishing: [], pressing: [], controls: [], grinding: [] };
    const push = (key, items) => items.forEach(item => { const src = mediaSrc(item); if (src && !pools[key].includes(src)) pools[key].push(src); });
    (manifest?.groups || []).forEach(group => {
      const text = groupText(group);
      const images = (group.items || []).filter(item => item.type === 'image');
      if (!images.length) return;
      if (/retrofit|grinding|jig|kellenberg|studer|voumard|jung|koyo/.test(text)) { push('grinding', images); push('controls', images); }
      if (/cnc|turning|lathe|boring|spigot|flange/.test(text)) push('turning', images);
      if (/cut|slot|notch|drill|u drill|thread/.test(text)) push('cutting', images);
      if (/conveyor|loading|handling|stacker|pick/.test(text)) push('handling', images);
      if (/leak|test|inspection|vision/.test(text)) push('testing', images);
      if (/paint|oven|deburr|polish|spray|finishing/.test(text)) push('finishing', images);
      if (/hydraulic|press|pneumatic|bearing/.test(text)) push('pressing', images);
      if (/plc|hmi|servo|control|panel|retrofit/.test(text)) push('controls', images);
    });
    return pools;
  }

  // V14's gallery/archive runtime fetches archive-manifest.json itself. Intercept that
  // one response so source-only HEIC/unsupported files never become broken browser tiles.
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    return nativeFetch(input, init).then(async response => {
      if (!response.ok || !url.includes('media/archive-manifest.json')) return response;
      try {
        const data = await response.clone().json();
        const clean = cleanManifest(data);
        return new Response(JSON.stringify(clean), {
          status: response.status,
          statusText: response.statusText,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });
      } catch (_) {
        return response;
      }
    });
  };

  const page = document.body.dataset.page || 'home';
  const homeHref = (hash) => page === 'home' ? hash : `index.html${hash}`;
  const desktopNav = [
    ['Projects', 'projects.html', page === 'projects'],
    ['Engineering', homeHref('#expertise'), false],
    ['Archive', 'machines.html', page === 'archive' || page === 'machines'],
    ['Gallery', 'gallery.html', page === 'gallery'],
    ['About', homeHref('#about'), false]
  ];
  const mobileNav = [
    ['Home', 'index.html'],
    ['Projects', 'projects.html'],
    ['Engineering', homeHref('#expertise')],
    ['Engineering Archive', 'machines.html'],
    ['Project Gallery', 'gallery.html'],
    ['About VSK', homeHref('#about')],
    ['Contact', homeHref('#contact')]
  ];

  const header = document.querySelector('[data-header]');
  if (header) {
    header.innerHTML = `
      <a class="brand" href="index.html" aria-label="VSK Electro-Mech Solutions home">
        <img src="media/brand/vsk-logo.webp" alt="VSK Electro-Mech Solutions logo" width="60" height="60">
        <span class="brand-copy"><strong>VSK Electro-Mech Solutions</strong><small>Special Purpose Machines · Retrofit · Automation</small></span>
      </a>
      <nav class="desktop-nav" aria-label="Primary navigation">
        ${desktopNav.map(([label, href, current]) => `<a${current ? ' class="is-current" aria-current="page"' : ''} href="${href}">${label}</a>`).join('')}
      </nav>
      <button class="header-cta" type="button" data-quote-open>Start a Requirement <span>↗</span></button>
      <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" data-menu-toggle><span></span><span></span></button>`;
  }

  const mobile = document.querySelector('[data-mobile-menu]');
  if (mobile) {
    mobile.innerHTML = `
      <button class="mobile-menu-backdrop" data-menu-close type="button" aria-label="Close navigation"></button>
      <div class="mobile-menu-panel">
        <div class="mobile-menu-head"><span>Navigate</span><button data-menu-close type="button">Close ×</button></div>
        <nav aria-label="Mobile navigation">
          ${mobileNav.map(([label, href], index) => `<a href="${href}">${label} <span>${String(index + 1).padStart(2, '0')}</span></a>`).join('')}
        </nav>
        <button class="mobile-menu-cta" type="button" data-quote-open>Start an Engineering Requirement ↗</button>
      </div>`;
  }

  const mediaMap = {
    kellenberg: 'media/v16/images/retrofitting-and-service/kelingberg-od-grinding-machine/img-0017.webp',
    jig: 'media/v16/images/retrofitting-and-service/jig-grinding-machine/img-0137.webp',
    rod: 'media/v16/images/spm-cnc-machines/rod-boring-machine/1520917541365.webp',
    zcut: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/z-cut-machine/img-0601.webp',
    slotting: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/4-servo-seal-slotting-machine/slotting-mc-1.webp',
    airleak: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/air-leak-testing-machine/20230415-191614.webp',
    paint: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/paint-aggitating-machine/paint-aggitating-unit.webp',
    udrill: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/single-spindle-u-drill-machine/img-20170518-210359.webp',
    electric: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/electric-oven/img-0021.webp'
  };

  const loadRuntime = () => {
    const original = document.createElement('script');
    original.src = 'app-v14.js?v=17.1';
    original.defer = true;
    original.onload = () => {
      const polish = document.createElement('script');
      polish.src = 'v17.js?v=17.1';
      polish.defer = true;
      document.body.appendChild(polish);
    };
    document.body.appendChild(original);
  };

  nativeFetch('media/v16/manifest.json', { cache: 'no-store' })
    .then(r => r.ok ? r.json() : Promise.reject(new Error('V16 media not built yet')))
    .then(rawManifest => {
      const manifest = cleanManifest(rawManifest);
      window.__VSK_MANIFEST__ = manifest;
      const pools = buildMediaPools(manifest);

      if (typeof siteProjects !== 'undefined') {
        siteProjects.forEach(project => { if (mediaMap[project.id]) project.cover = mediaMap[project.id]; });
      }

      if (typeof featureData !== 'undefined') {
        Object.entries(mediaMap).forEach(([id, src]) => {
          if (featureData[id]) featureData[id].media = [src, ...featureData[id].media.filter(x => x !== src && x.includes('/v16/'))];
        });
      }

      // Make organized PHOTOS-derived media the visible source of truth for capability panels.
      if (typeof capabilityData !== 'undefined') {
        const pick = (...keys) => keys.flatMap(key => pools[key] || []).find(Boolean);
        const capSources = {
          mechanical: pick('turning', 'pressing'),
          controls: pick('controls', 'grinding'),
          fluid: pick('pressing', 'testing'),
          electrical: pick('controls', 'grinding'),
          automation: pick('handling', 'cutting'),
          manufacturing: pick('turning', 'finishing')
        };
        Object.entries(capSources).forEach(([key, src]) => { if (src && capabilityData[key]) capabilityData[key].image = src; });
      }

      // Every archive reference receives a browser-safe image from the organized PHOTOS pool.
      // Known feature IDs use exact mapped project media; the rest use a related engineering category.
      if (typeof machineArchive !== 'undefined') {
        const offsets = { handling: 2, turning: 3, pressing: 5, cutting: 7, testing: 11, finishing: 13, controls: 17, grinding: 19 };
        machineArchive.forEach((machine, index) => {
          const exact = machine.featureId && mediaMap[machine.featureId];
          const pool = pools[machine.category] || [];
          const related = pool.length ? pool[(index + (offsets[machine.category] || 0)) % pool.length] : '';
          if (exact || related) machine.media = [exact || related];
        });
      }

      const hero = document.querySelector('[data-hero-image]');
      if (hero && mediaMap.kellenberg) {
        const fallback = hero.getAttribute('src');
        hero.addEventListener('error', () => {
          if (hero.getAttribute('src') !== fallback) hero.setAttribute('src', fallback);
        }, { once: true });
        hero.setAttribute('src', mediaMap.kellenberg);
      }

      const galleryHero = document.querySelectorAll('.gallery-hero-strip img');
      const galleryImages = [mediaMap.kellenberg, mediaMap.jig, mediaMap.airleak, mediaMap.slotting].filter(Boolean);
      galleryHero.forEach((img, i) => { if (galleryImages[i]) img.src = galleryImages[i]; });

      const summary = manifest?.summary || {};
      const groups = document.querySelector('[data-gallery-group-count]');
      const images = document.querySelector('[data-gallery-image-count]');
      const videos = document.querySelector('[data-gallery-video-count]');
      if (groups && Number.isFinite(summary.groups)) groups.textContent = `${summary.groups} project groups`;
      if (images && Number.isFinite(summary.images)) images.textContent = `${summary.images} images`;
      if (videos && Number.isFinite(summary.videos)) videos.textContent = `${summary.videos} videos`;
    })
    .catch(() => {})
    .finally(loadRuntime);
})();