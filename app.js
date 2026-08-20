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
    polish.href = 'v16-user-polish.css?v=16.4';
    document.head.appendChild(polish);
  }

  const nativeFetch = window.fetch.bind(window);
  const validMediaSetPromise = nativeFetch('media/valid-paths.json', { cache: 'no-store' })
    .then(r => r.ok ? r.json() : [])
    .then(paths => new Set((paths || []).map(p => String(p).replace(/^\.\//, ''))))
    .catch(() => null);

  const validPath = (set, ...paths) => {
    const candidates = paths.filter(Boolean).map(p => String(p).replace(/^\.\//, ''));
    if (!candidates.length) return '';
    if (!set) return candidates[0];
    return candidates.find(p => set.has(p)) || '';
  };

  const cleanManifest = (input, validSet = null) => {
    if (!input || !Array.isArray(input.groups)) return input;
    const groups = input.groups
      .map(group => {
        const normalized = (group.items || []).map(item => {
          if (!item || item.sourceOnly || item.displayable === false) return null;
          if (item.type === 'image') {
            const src = validPath(validSet, item.src, item.web, item.thumb);
            if (!src || /\.(heic|heif)(?:$|[?#])/i.test(src)) return null;
            return { ...item, src, web: src, thumb: src };
          }
          if (item.type === 'video') {
            const mp4 = validPath(validSet, item.src_mp4);
            const webm = validPath(validSet, item.src_webm);
            const generic = validPath(validSet, item.web, item.src);
            if (!mp4 && !webm && !generic) return null;
            return { ...item, src_mp4: mp4 || undefined, src_webm: webm || undefined, web: generic || mp4 || webm, src: generic || mp4 || webm };
          }
          return null;
        }).filter(Boolean);
        const groupImage = normalized.find(item => item.type === 'image');
        const groupPoster = groupImage?.src || '';
        return {
          ...group,
          items: normalized.map(item => item.type === 'video'
            ? { ...item, thumb: groupPoster || item.thumb || '', poster: groupPoster || item.poster || '' }
            : item)
        };
      })
      .filter(group => group.items.length);
    const images = groups.reduce((n, group) => n + group.items.filter(item => item.type === 'image').length, 0);
    const videos = groups.reduce((n, group) => n + group.items.filter(item => item.type === 'video').length, 0);
    return {
      ...input,
      groups,
      summary: { ...(input.summary || {}), groups: groups.length, images, videos }
    };
  };

  window.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    return nativeFetch(input, init).then(async response => {
      if (!response.ok || !url.includes('media/archive-manifest.json')) return response;
      try {
        const [data, validSet] = await Promise.all([response.clone().json(), validMediaSetPromise]);
        const clean = cleanManifest(data, validSet);
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
    ['Experience', 'machines.html', page === 'machines'],
    ['Gallery', 'gallery.html', page === 'gallery']
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
        </nav>
        <button class="mobile-menu-cta" type="button" data-quote-open>Discuss a Machine ↗</button>
      </div>`;
  }

  if (typeof capabilityData !== 'undefined') {
    Object.assign(capabilityData.mechanical, {
      image: 'media/legacy/spindle-interface.webp',
      alt: 'Machine-tool spindle and workholding interface',
      title: 'Machine architecture built around your component and operation.',
      copy: 'Structure, mechanisms, fixtures and workholding are developed around the part, process, access, accuracy and cycle target you need.'
    });
    Object.assign(capabilityData.controls, {
      image: 'media/retrofit/jig-grinding.webp',
      alt: 'Jig grinding machine CNC PLC and HMI retrofit',
      title: 'Controls engineered for the way your machine must actually run.',
      copy: 'CNC, PLC, HMI, servo and drive systems are integrated around sequence, safety, repeatability, diagnostics and operator use.'
    });
    Object.assign(capabilityData.fluid, {
      image: 'media/v16/images/hydraulic-systems-and-pressing-units/hydraulic-press-transtech-gear/20230216-094120.webp',
      alt: 'VSK hydraulic pressing system',
      title: 'Hydraulic and pneumatic systems sized for the force and motion your process needs.',
      copy: 'Clamping, pressing, testing and machine movement are engineered for dependable force, sequence, response and serviceability.'
    });
    Object.assign(capabilityData.electrical, {
      image: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/control-panel-honning-machine/20250416-215953.webp',
      alt: 'VSK machine control panel and electrical system',
      title: 'Electrical systems designed for reliable operation and easier fault finding.',
      copy: 'Panels, drives, field devices and machine wiring are integrated for clean commissioning, practical diagnostics and maintainable field service.'
    });
    Object.assign(capabilityData.automation, {
      image: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/4-servo-seal-slotting-machine/slotting-mc-1.webp',
      alt: 'VSK four-servo automated slotting machine',
      title: 'Automation that improves flow, repeatability and operator efficiency.',
      copy: 'Servo motion, indexing, loading, handling and interlocks are engineered around the required cycle instead of being added after the machine is built.'
    });
    Object.assign(capabilityData.manufacturing, {
      image: 'media/legacy/metal-facing-machine.webp',
      alt: 'VSK precision metal facing machine',
      title: 'Process knowledge that keeps the machine practical on the shop floor.',
      copy: 'Turning, machining, grinding and finishing experience supports realistic choices in workholding, tooling, access, tolerance and process stability.'
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

  setText('.footer-brand > p', 'Special purpose machines, CNC retrofit and automation engineered around difficult production requirements.');
  setText('.footer-brand small', 'Machine engineering for new equipment, retrofit and production improvement.');
  setText('.quote-head h2', 'Tell us the production or machine problem you need to solve.');

  const footerCols = document.querySelectorAll('.footer-col');
  if (footerCols[0]) footerCols[0].innerHTML = `<span>Explore</span><a href="projects.html">Projects</a><a href="machines.html">Engineering Experience</a><a href="gallery.html">Project Gallery</a><a href="${homeHref('#about')}">Company</a>`;
  if (footerCols[1]) footerCols[1].innerHTML = `<span>Engineering</span><a href="${homeHref('#expertise')}">Capabilities</a><a href="${homeHref('#retrofit')}">Retrofit & CNC</a><button type="button" data-quote-open>Discuss a Machine ↗</button>`;

  if (page === 'home') {
    setText('.hero-blue-copy > p', 'Bring VSK the part, cycle-time target, tolerance or machine challenge. We develop the mechanics, controls and process around the production result you need — whether that means a purpose-built SPM, automation or a CNC retrofit.');
    setText('.capabilities .section-intro > p', 'One requirement, one engineering team. Mechanical design, controls, electrical systems, fluid power and manufacturing decisions stay aligned to the production result you need.');
    setText('.projects-showcase .section-intro > p', 'See how VSK turns a difficult production requirement into a working machine by aligning workholding, mechanism, controls and cycle from the start.');
    setText('.engineering-depth .depth-head > p', 'Use proven tolerance, alignment and cycle-time references to assess VSK against your own requirement, then search 54 documented machine and retrofit projects for the closest precedent.');
    setText('.archive-callout .kicker', 'ENGINEERING EXPERIENCE');
    setText('.archive-callout h3', '54 documented references.');
    setText('.archive-callout > p', 'Search by process, machine type, application or control platform to find the most relevant VSK experience before you brief a new project.');
    setHTML('.archive-callout .btn', 'Search engineering experience <span>→</span>');
    setText('.retrofit-inner > p', 'Keep a sound mechanical platform productive for longer. VSK combines machine reconditioning with modern CNC, PLC, drive and electrical systems to recover capability and serviceability.');
    setText('.process .section-intro > p', 'From the first application study to trials and commissioning, the same production target guides machine architecture, controls, build and validation.');
    setText('.about-copy > p', 'For a new machine, a difficult retrofit or a production problem that needs more than an off-the-shelf answer, VSK brings machine-building, controls and machine-tool experience together under one engineering team.');
  }

  if (page === 'projects') {
    setText('.page-hero-copy > p', 'Start with machines VSK has already delivered and compare applications, controls and configurations to find the strongest precedent for your production requirement.');
    setText('.project-index .section-intro > p', 'Compare completed machines by application, architecture, controls and workholding to see where VSK experience aligns with the result you need.');
    setHTML('.additional-media .section-intro h2', 'More applications.<br><em>More ways to judge fit.</em>');
    setText('.additional-media .section-intro > p', 'Explore additional machines, process equipment and retrofit work to find an application, mechanism or control approach relevant to your plant.');
    setHTML('.projects-cta h2', 'Need a closer match?<br><em>Search all 54 references.</em>');
    setText('.projects-cta p', 'Filter VSK experience by machine, process, application and control platform to find the strongest precedent for your requirement.');
    const projectLinks = document.querySelectorAll('.projects-cta .big-link');
    if (projectLinks[0]) projectLinks[0].innerHTML = '<span>Engineering Experience</span><strong>54 searchable references</strong><i>→</i>';
    if (projectLinks[1]) projectLinks[1].innerHTML = '<span>Project Gallery</span><strong>Photos and videos from real project groups</strong><i>↗</i>';
  }

  if (page === 'machines') {
    setText('.archive-hero .kicker', 'ENGINEERING EXPERIENCE');
    setText('.archive-hero-number small', 'DOCUMENTED REFERENCES');
    setText('.archive-hero p', 'Search 54 documented machine and retrofit references by process, machine type, application and control platform to find the experience most relevant to your requirement.');
    setHTML('.archive-hero-facts span:nth-child(3)', '<strong>54</strong> DOCUMENTED PROJECTS');
    setText('.archive-status a', 'Browse project gallery ↗');
    setText('.archive-sticky-preview > p', 'Select a reference to compare its machine, application and controls with your own requirement.');
    setText('[data-archive-preview-open]', 'View full reference →');
    setHTML('.archive-note h2', 'Find the closest engineering precedent.<br><em>Start with relevant experience.</em>');
    setText('.archive-note p', 'Use process, machine type and control-platform filters to identify the VSK experience most useful for evaluating your own requirement.');
  }

  if (page === 'gallery') {
    setText('.gallery-hero-copy > p', 'Inspect real VSK project media to judge machine construction, retrofit quality, fixtures, controls and integration detail before you discuss your own requirement.');
    setText('.gallery-browser-head > p', 'Look beyond the finished machine. Compare construction quality, integration, controls, fixtures and execution detail across real project groups.');
    setHTML('.gallery-policy h2', 'See the range of work.<br><em>Then find what matches your requirement.</em>');
    setText('.gallery-policy p', 'Use the Gallery to inspect workmanship and integration detail, then use Experience to find the documented reference closest to your production requirement.');
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

  const improveDossierCopy = () => {
    const dossier = document.querySelector('[data-dossier]');
    if (!dossier || dossier.hidden) return;
    const summary = dossier.querySelector('[data-dossier-summary]');
    if (summary && /forms part of VSK|within VSK’s engineering experience/i.test(summary.textContent)) {
      const title = dossier.querySelector('[data-dossier-title]')?.textContent?.trim() || 'This machine';
      summary.textContent = `${title} is a documented VSK engineering reference. Compare the recorded application, machine configuration and controls with your own production requirement.`;
    }
    dossier.querySelectorAll('.dossier-sections p').forEach(p => {
      if (/The visual is from related VSK work|The visual shown belongs/i.test(p.textContent)) {
        p.textContent = 'Use this reference to compare application scope, machine configuration and controls with your requirement, then share your part, target cycle and tolerance with VSK for an application review.';
      }
    });
  };

  const postOriginalFixes = () => {
    const dossier = document.querySelector('[data-dossier]');
    if (dossier) {
      new MutationObserver(improveDossierCopy).observe(dossier, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['hidden'] });
      improveDossierCopy();
    }

    if (page === 'machines') {
      const previewOpen = document.querySelector('[data-archive-preview-open]');
      if (previewOpen) {
        previewOpen.addEventListener('click', () => {
          setTimeout(() => {
            const panel = document.querySelector('[data-dossier]');
            if (panel?.hidden) {
              const active = document.querySelector('.archive-row.is-active') || document.querySelector('[data-machine-id]');
              active?.click();
            }
          }, 90);
        }, true);
      }
    }
  };

  const loadOriginal = () => {
    const script = document.createElement('script');
    script.src = 'app-v14.js?v=16.2';
    script.defer = true;
    script.addEventListener('load', postOriginalFixes, { once: true });
    document.body.appendChild(script);
  };

  Promise.all([
    nativeFetch('media/v16/manifest.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null),
    validMediaSetPromise
  ])
    .then(([rawManifest, validSet]) => {
      const manifest = cleanManifest(rawManifest, validSet);
      if (typeof siteProjects !== 'undefined') {
        siteProjects.forEach(project => { if (mediaMap[project.id] && (!validSet || validSet.has(mediaMap[project.id]))) project.cover = mediaMap[project.id]; });
      }
      if (typeof featureData !== 'undefined') {
        Object.entries(mediaMap).forEach(([id, src]) => {
          if (featureData[id] && (!validSet || validSet.has(src))) featureData[id].media = [src, ...featureData[id].media.filter(x => x !== src)];
        });
      }

      const hero = document.querySelector('[data-hero-image]');
      if (hero && mediaMap.kellenberg && (!validSet || validSet.has(mediaMap.kellenberg))) {
        const fallback = hero.getAttribute('src');
        hero.addEventListener('error', () => { if (hero.getAttribute('src') !== fallback) hero.setAttribute('src', fallback); }, { once: true });
        hero.setAttribute('src', mediaMap.kellenberg);
      }

      const galleryHero = document.querySelectorAll('.gallery-hero-strip img');
      const galleryImages = [mediaMap.kellenberg, mediaMap.jig, mediaMap.airleak, mediaMap.slotting].filter(src => src && (!validSet || validSet.has(src)));
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