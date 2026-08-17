(() => {
  'use strict';

  document.body.classList.add('v16-premium');

  if (!document.querySelector('link[href^="v16.css"]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'v16.css?v=16.2';
    document.head.appendChild(css);
  }
  if (!document.querySelector('link[href^="v16-user-polish.css"]')) {
    const polish = document.createElement('link');
    polish.rel = 'stylesheet';
    polish.href = 'v16-user-polish.css?v=16.1';
    document.head.appendChild(polish);
  }

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
  const navItems = [
    ['Home', 'index.html', page === 'home'],
    ['Company', homeHref('#about'), false],
    ['Capabilities', homeHref('#expertise'), false],
    ['Retrofit & CNC', homeHref('#retrofit'), false],
    ['Projects', 'projects.html', page === 'projects'],
    ['Experience', 'machines.html', page === 'machines']
  ];

  const header = document.querySelector('[data-header]');
  if (header) {
    header.innerHTML = `
      <a class="brand" href="index.html" aria-label="VSK Electro-Mech Solutions home">
        <img src="media/brand/vsk-logo.webp" alt="VSK Electro-Mech Solutions logo" width="60" height="60">
        <span class="brand-copy"><strong>VSK Electro-Mech Solutions</strong><small>Special Purpose Machines · Retrofit · Automation</small></span>
      </a>
      <nav class="desktop-nav" aria-label="Primary navigation">
        ${navItems.map(([label, href, current]) => `<a${current ? ' class="is-current"' : ''} href="${href}">${label}</a>`).join('')}
      </nav>
      <button class="header-cta" type="button" data-quote-open>Discuss a Machine <span>↗</span></button>
      <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" data-menu-toggle><span></span><span></span></button>`;
  }

  const mobile = document.querySelector('[data-mobile-menu]');
  if (mobile) {
    mobile.innerHTML = `
      <button class="mobile-menu-backdrop" data-menu-close type="button" aria-label="Close navigation"></button>
      <div class="mobile-menu-panel">
        <div class="mobile-menu-head"><span>Navigate</span><button data-menu-close type="button">Close ×</button></div>
        <nav aria-label="Mobile navigation">
          ${navItems.map(([label, href], index) => `<a href="${href}">${label} <span>${String(index + 1).padStart(2, '0')}</span></a>`).join('')}
          <a href="gallery.html">Project Gallery <span>07</span></a>
        </nav>
        <button class="mobile-menu-cta" type="button" data-quote-open>Discuss a Machine ↗</button>
      </div>`;
  }

  if (typeof capabilityData !== 'undefined') {
    Object.assign(capabilityData.mechanical, {
      image: 'media/legacy/spindle-interface.webp',
      alt: 'Machine-tool spindle and workholding interface',
      title: 'Machine architecture, workholding and mechanisms engineered around the component.',
      copy: 'Machine structure, mechanisms, fixtures and workholding are developed from the operation, component and production target.'
    });
    Object.assign(capabilityData.controls, {
      image: 'media/retrofit/jig-grinding.webp',
      alt: 'Jig grinding machine CNC PLC and HMI retrofit',
      title: 'Controls that make the complete machine behave as one production system.',
      copy: 'CNC, PLC, HMI, servo and drive systems are integrated around machine sequence, safety, repeatability and operator use.'
    });
    Object.assign(capabilityData.fluid, {
      image: 'media/v16/images/hydraulic-systems-and-pressing-units/hydraulic-press-transtech-gear/20230216-094120.webp',
      alt: 'VSK hydraulic pressing system',
      title: 'Hydraulic and pneumatic systems designed for reliable machine action.',
      copy: 'Clamping, pressing, testing and machine movement are engineered with the required force, sequence and serviceability in mind.'
    });
    Object.assign(capabilityData.electrical, {
      image: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/control-panel-honning-machine/20250416-215953.webp',
      alt: 'VSK machine control panel and electrical system',
      title: 'Electrical systems built for dependable control, diagnostics and field service.',
      copy: 'Panels, drives, field devices and machine wiring are integrated for clean commissioning and practical maintenance.'
    });
    Object.assign(capabilityData.automation, {
      image: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/4-servo-seal-slotting-machine/slotting-mc-1.webp',
      alt: 'VSK four-servo automated slotting machine',
      title: 'Automation built around part flow, repeatability and operator efficiency.',
      copy: 'Servo motion, indexing, loading, handling and interlocks are engineered around the cycle rather than added after the machine is built.'
    });
    Object.assign(capabilityData.manufacturing, {
      image: 'media/legacy/metal-facing-machine.webp',
      alt: 'VSK precision metal facing machine',
      title: 'Manufacturing knowledge that keeps machine design grounded in the process.',
      copy: 'Turning, machining, grinding and finishing experience supports practical workholding, tooling and process decisions.'
    });
  }

  const setText = (selector, text) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  };
  const setHTML = (selector, html) => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = html;
  };

  if (page === 'home') {
    setText('.engineering-depth .depth-head > p', 'Compare proven tolerance, alignment and cycle-time references with the demands of your own application — then explore 54 documented VSK machine and retrofit projects.');
    setText('.archive-callout > p', 'Find VSK experience relevant to your process, machine type, customer application or control platform.');
    setText('.process .section-intro > p', 'Follow the path from application study and machine architecture through controls, trials and commissioning — with one engineering team accountable for the result.');
    setText('.about-copy > p', 'If you need a new machine, a difficult retrofit or a more reliable production process, VSK brings machine-building, controls and machine-tool experience together under one engineering team.');
  }
  if (page === 'projects') {
    setText('.page-hero-copy > p', 'Review completed VSK machines and retrofit work by application, controls and machine configuration — and find the experience closest to your production requirement.');
    setText('.project-index .section-intro > p', 'Compare real machine builds by application, control platform and configuration to find the strongest starting point for your requirement.');
  }
  if (page === 'machines') {
    setText('.archive-hero p', 'Search 54 documented VSK machine-building and retrofit references by process, machine type, customer and control platform.');
    setHTML('.archive-note h2', 'Find a proven starting point.<br><em>Then engineer from there.</em>');
    setText('.archive-note p', 'Search by process, machine type, customer or control platform to reach the VSK references most relevant to your next requirement.');
  }
  if (page === 'gallery') {
    setText('.gallery-policy p', 'Review the wider visual record of VSK machine builds, retrofits and process equipment to see the breadth of execution beyond the featured case studies.');
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

  const loadOriginal = () => {
    const script = document.createElement('script');
    script.src = 'app-v14.js?v=16.2';
    script.defer = true;
    document.body.appendChild(script);
  };

  nativeFetch('media/v16/manifest.json', { cache: 'no-store' })
    .then(r => r.ok ? r.json() : Promise.reject(new Error('V16 media not built yet')))
    .then(rawManifest => {
      const manifest = cleanManifest(rawManifest);
      if (typeof siteProjects !== 'undefined') {
        siteProjects.forEach(project => { if (mediaMap[project.id]) project.cover = mediaMap[project.id]; });
      }
      if (typeof featureData !== 'undefined') {
        Object.entries(mediaMap).forEach(([id, src]) => {
          if (featureData[id]) featureData[id].media = [src, ...featureData[id].media.filter(x => x !== src)];
        });
      }

      const hero = document.querySelector('[data-hero-image]');
      if (hero && mediaMap.kellenberg) {
        const fallback = hero.getAttribute('src');
        hero.addEventListener('error', () => { if (hero.getAttribute('src') !== fallback) hero.setAttribute('src', fallback); }, { once: true });
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
    .finally(loadOriginal);
})();