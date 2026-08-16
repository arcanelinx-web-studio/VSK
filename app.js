(() => {
  'use strict';

  document.body.classList.add('vsk-ia');

  const ensureStylesheet = (href) => {
    if (document.querySelector(`link[href^="${href}"]`)) return;
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = `${href}?v=18.1`;
    document.head.appendChild(css);
  };
  const ensureFont = () => {
    if (document.querySelector('link[data-vsk-fonts]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.dataset.vskFonts = '1';
    link.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  };
  ensureFont();
  ensureStylesheet('v16.css');
  ensureStylesheet('architecture.css');
  ensureStylesheet('architecture-fixes.css');

  const isRenderableMedia = (item) => {
    if (!item || item.sourceOnly || item.displayable === false) return false;
    const src = item.thumb || item.poster || item.web || item.src || item.src_mp4 || '';
    if (!src) return false;
    if (item.type === 'image') return !/\.(heic|heif)(?:$|[?#])/i.test(src);
    if (item.type === 'video') return Boolean(item.web || item.src_mp4 || item.src);
    return false;
  };

  const cleanManifest = (input) => {
    if (!input || !Array.isArray(input.groups)) return input;
    const groups = input.groups
      .map(group => ({ ...group, items: (group.items || []).filter(isRenderableMedia) }))
      .filter(group => group.items.length);
    const images = groups.reduce((n, group) => n + group.items.filter(item => item.type === 'image').length, 0);
    const videos = groups.reduce((n, group) => n + group.items.filter(item => item.type === 'video').length, 0);
    return { ...input, groups, summary: { ...(input.summary || {}), groups: groups.length, images, videos } };
  };

  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    return nativeFetch(input, init).then(async response => {
      if (!response.ok || !url.includes('media/archive-manifest.json')) return response;
      try {
        const clean = cleanManifest(await response.clone().json());
        return new Response(JSON.stringify(clean), {
          status: response.status,
          statusText: response.statusText,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });
      } catch (_) { return response; }
    });
  };

  const page = document.body.dataset.page || 'home';
  const current = (name) => {
    if (name === 'projects') return ['projects','project'].includes(page);
    if (name === 'retrofit') return page === 'retrofit';
    return page === name;
  };
  const navItems = [
    ['Home', 'index.html', current('home')],
    ['Company', 'company.html', current('company')],
    ['Solutions', 'solutions.html', current('solutions')],
    ['Reconditioning', 'reconditioning.html', current('reconditioning')],
    ['Retrofit & CNC', 'retrofit-cnc.html', current('retrofit')],
    ['Projects', 'projects.html', current('projects')],
    ['Experience', 'experience.html', current('experience')]
  ];

  const header = document.querySelector('[data-header]');
  if (header) {
    header.innerHTML = `
      <a class="brand" href="index.html" aria-label="VSK Electro-Mech Solutions home">
        <img src="media/brand/vsk-logo.webp" alt="VSK Electro-Mech Solutions logo" width="52" height="52">
        <span class="brand-copy"><strong>VSK</strong><small>ELECTRO-MECH SOLUTIONS</small></span>
      </a>
      <nav class="desktop-nav" aria-label="Primary navigation">
        ${navItems.map(([label, href, active]) => `<a${active ? ' class="is-current" aria-current="page"' : ''} href="${href}">${label}</a>`).join('')}
      </nav>
      <button class="header-cta" type="button" data-quote-open>Discuss a Machine <span>↗</span></button>
      <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" data-menu-toggle><span></span><span></span></button>`;
  }

  const mobile = document.querySelector('[data-mobile-menu]');
  if (mobile) {
    const mobileItems = [...navItems, ['Gallery','gallery.html',page === 'gallery']];
    mobile.innerHTML = `
      <button class="mobile-menu-backdrop" data-menu-close type="button" aria-label="Close navigation"></button>
      <div class="mobile-menu-panel">
        <div class="mobile-menu-head"><span>NAVIGATE</span><button data-menu-close type="button">Close ×</button></div>
        <nav aria-label="Mobile navigation">
          ${mobileItems.map(([label, href], index) => `<a href="${href}"><span>${String(index + 1).padStart(2, '0')}</span>${label}<i>→</i></a>`).join('')}
        </nav>
        <button class="mobile-menu-cta" type="button" data-quote-open>Discuss a Machine <span>↗</span></button>
      </div>`;
  }

  function ensureQuoteDialog() {
    if (document.querySelector('[data-quote-panel]')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div aria-hidden="true" class="quote-dialog" data-quote-panel hidden>
        <button aria-label="Close requirement form" class="dialog-backdrop" data-quote-close type="button"></button>
        <section aria-labelledby="quote-title" aria-modal="true" class="quote-panel" role="dialog" tabindex="-1">
          <button aria-label="Close requirement form" class="quote-close" data-quote-close type="button">×</button>
          <header class="quote-head"><span>START AN ENGINEERING REQUIREMENT</span><h2 id="quote-title">Tell VSK what needs to change.</h2><div class="quote-progress"><i class="is-active"></i><i></i><i></i><i></i></div><b data-quote-count>01 / 04</b></header>
          <form data-quote-form>
            <section class="quote-step is-active" data-step="1"><span>01 / WHAT DO YOU NEED?</span><div class="quote-options">
              <button data-type="New Special Purpose Machine" type="button">New machine <i>→</i></button>
              <button data-type="Machine Reconditioning / Retrofit" type="button">Old machine / retrofit <i>→</i></button>
              <button data-type="Automation / Controls" type="button">Automation / controls <i>→</i></button>
              <button data-type="Precision Components" type="button">Component / machining <i>→</i></button>
              <button data-type="Hydraulic / Pneumatic System" type="button">Hydraulic / pneumatic <i>→</i></button>
              <button data-type="Engineering Support" type="button">Engineering support <i>→</i></button>
            </div></section>
            <section class="quote-step" data-step="2"><span>02 / WHAT ARE WE WORKING WITH?</span><label>Tell us what is happening today<textarea name="requirement" placeholder="Machine, component or process · current bottleneck · desired outcome · cycle / tolerance if known · controller · plant location..." required rows="7"></textarea></label><div class="quote-actions"><button data-quote-prev type="button">← Back</button><button class="quote-next" data-quote-next type="button">Continue →</button></div></section>
            <section class="quote-step" data-step="3"><span>03 / DRAWINGS & SPECIFICATIONS</span><label class="file-drop" data-file-drop><input accept=".pdf,.dwg,.dxf,.step,.stp,.iges,.igs,.zip,.jpg,.jpeg,.png" data-quote-file name="drawing" type="file"><strong>Select a drawing or specification</strong><em>Optional · attach after email or WhatsApp opens</em><small>PDF · DWG · DXF · STEP · STP · IGES · ZIP · JPG · PNG</small><b data-file-text>No file selected</b></label><div class="quote-actions"><button data-quote-prev type="button">← Back</button><button class="quote-next" data-quote-next type="button">Continue →</button></div></section>
            <section class="quote-step" data-step="4"><span>04 / HOW CAN WE REACH YOU?</span><div class="form-grid"><label>Name<input autocomplete="name" name="name" required></label><label>Company<input autocomplete="organization" name="company"></label><label>Email<input autocomplete="email" name="email" required type="email"></label><label>Phone<input autocomplete="tel" inputmode="numeric" maxlength="10" name="phone" required></label></div><p class="form-error" data-form-error></p><div class="quote-actions"><button data-quote-prev type="button">← Back</button><button class="quote-next" type="submit">Prepare enquiry →</button></div></section>
            <section class="quote-success" data-quote-success hidden><span>ENQUIRY READY</span><h3>Choose how you want to send it.</h3><p>Your requirement details are prepared. If you selected a drawing, attach it after email or WhatsApp opens.</p><div class="quote-actions quote-success-actions"><button data-copy-enquiry type="button">Copy details</button><a data-whatsapp-link href="#" rel="noopener" target="_blank">Send by WhatsApp ↗</a><a class="quote-next" data-mail-link href="#">Open email draft →</a></div></section>
          </form>
        </section>
      </div>`);
  }
  ensureQuoteDialog();

  const mediaMap = {
    kellenberg: 'media/v16/images/retrofitting-and-service/kelingberg-od-grinding-machine/img-0017.webp',
    jig: 'media/v16/images/retrofitting-and-service/jig-grinding-machine/img-0137.webp',
    rod: 'media/v16/images/spm-cnc-machines/rod-boring-machine/1520917541365.webp',
    zcut: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/z-cut-machine/img-0601.webp',
    slotting: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/4-servo-seal-slotting-machine/slotting-mc-1.webp',
    airleak: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/air-leak-testing-machine/20230415-191614.webp',
    paint: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/paint-aggitating-machine/paint-aggitating-unit.webp',
    electric: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/electric-oven/img-0021.webp'
  };

  function applyMediaToLegacyData(manifest) {
    if (typeof siteProjects !== 'undefined') siteProjects.forEach(project => { if (mediaMap[project.id]) project.cover = mediaMap[project.id]; });
    if (typeof featureData !== 'undefined') Object.entries(mediaMap).forEach(([id, src]) => {
      if (featureData[id]) featureData[id].media = [src, ...(featureData[id].media || []).filter(x => x !== src)];
    });

    if (typeof capabilityData !== 'undefined' && manifest?.groups?.length) {
      const groups = manifest.groups;
      const firstImage = (...terms) => {
        const g = groups.find(group => terms.some(term => `${group.category} ${group.title}`.toLowerCase().includes(term)) && group.items.some(i => i.type === 'image'));
        const i = g?.items.find(item => item.type === 'image');
        return i?.web || i?.src || i?.thumb || '';
      };
      const map = {
        mechanical: firstImage('spm cnc', 'thread cutting'),
        controls: firstImage('servo controlled', 'jig grinding'),
        fluid: firstImage('hydraulic press', 'air leak'),
        electrical: firstImage('kelingberg', 'jig grinding'),
        automation: firstImage('pick', 'slotting', 'air leak'),
        manufacturing: firstImage('motor flange', 'spigot', 'rod boring')
      };
      Object.entries(map).forEach(([key, src]) => { if (src && capabilityData[key]) capabilityData[key].image = src; });
    }
  }

  const loadRuntime = () => {
    const originalPage = document.body.dataset.page || page;
    if (page === 'projects') document.body.dataset.page = 'projects-ia';
    const legacy = document.createElement('script');
    legacy.src = 'app-v14.js?v=18.2';
    legacy.defer = true;
    legacy.onload = () => {
      if (page === 'projects') document.body.dataset.page = originalPage;
      const architecture = document.createElement('script');
      architecture.src = 'architecture.js?v=18.2';
      architecture.defer = true;
      architecture.onload = () => {
        const fixes = document.createElement('script');
        fixes.src = 'architecture-fixes.js?v=18.2';
        fixes.defer = true;
        document.body.appendChild(fixes);
      };
      document.body.appendChild(architecture);
    };
    document.body.appendChild(legacy);
  };

  nativeFetch('media/v16/manifest.json', { cache: 'no-store' })
    .then(r => r.ok ? r.json() : Promise.reject(new Error('Organized project manifest unavailable')))
    .then(raw => {
      const manifest = cleanManifest(raw);
      window.__VSK_MANIFEST__ = manifest;
      applyMediaToLegacyData(manifest);
      const summary = manifest.summary || {};
      const groups = document.querySelector('[data-gallery-group-count]');
      const images = document.querySelector('[data-gallery-image-count]');
      const videos = document.querySelector('[data-gallery-video-count]');
      if (groups) groups.textContent = `${summary.groups || 0} project groups`;
      if (images) images.textContent = `${summary.images || 0} images`;
      if (videos) videos.textContent = `${summary.videos || 0} videos`;
    })
    .catch(() => { window.__VSK_MANIFEST__ = null; })
    .finally(loadRuntime);
})();