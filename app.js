(() => {
  'use strict';

  document.body.classList.add('v16-premium');

  if (!document.querySelector('link[href="v16.css"]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'v16.css';
    document.head.appendChild(css);
  }

  const page = document.body.dataset.page || 'home';
  const homeHref = (hash) => page === 'home' ? hash : `index.html${hash}`;
  const currentExperience = ['gallery', 'archive', 'machines'].includes(page);
  const navItems = [
    ['Home', 'index.html', page === 'home'],
    ['Company', homeHref('#about'), false],
    ['Services', homeHref('#systems'), false],
    ['Reconditioning', 'machines.html?type=retrofit', false],
    ['Retrofit & CNC', homeHref('#retrofit'), false],
    ['Projects', 'projects.html', page === 'projects'],
    ['Experience', 'gallery.html', currentExperience]
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
          <a href="machines.html">Engineering Archive <span>08</span></a>
        </nav>
        <button class="mobile-menu-cta" type="button" data-quote-open>Discuss a Machine ↗</button>
      </div>`;
  }

  const mediaMap = {
    kellenberg: 'media/v16/images/retrofitting-and-service/kelingberg-od-grinding-machine/img-0017.webp',
    jig: 'media/v16/images/retrofitting-and-service/jig-grinding-machine/img-0137.webp',
    rod: 'media/v16/images/spm-cnc-machines/rod-boring-machine/1520917541365.webp',
    zcut: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/z-cut-machine/bexx0731.webp',
    slotting: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/4-servo-seal-slotting-machine/slotting-mc-1.webp',
    airleak: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/air-leak-testing-machine/20230415-191614.webp',
    paint: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/paint-aggitating-machine/paint-aggitating-unit.webp',
    udrill: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/single-spindle-u-drill-machine/img-20170518-210359.webp',
    electric: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/electric-oven/img-0021.webp'
  };

  const loadOriginal = () => {
    const script = document.createElement('script');
    script.src = 'app-v14.js';
    script.defer = true;
    document.body.appendChild(script);
  };

  fetch('media/v16/manifest.json', { cache: 'no-store' })
    .then(r => r.ok ? r.json() : Promise.reject(new Error('V16 media not built yet')))
    .then(manifest => {
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
