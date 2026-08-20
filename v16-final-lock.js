(() => {
  'use strict';

  const page = document.body.dataset.page || 'home';
  const params = new URLSearchParams(location.search);
  const requestedType = params.get('type');
  const mechanicalImage = 'media/v16/images/spm-cnc-machines/transtech-motor-flange-facing-cnc-mc/20230327-120458.webp';
  const mechanicalAlt = 'VSK motor flange facing CNC machine — mechanical engineering and machine build';
  const galleryPreviewImage = 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/4-servo-seal-slotting-machine/slotting-mc-1.webp';

  const galleryCapabilityCategories = [
    ['New Projects', 'new-project'],
    ['SPM / CNC Machines', 'spm-cnc-machines'],
    ['SPM · PLC / HMI / Servo', 'spm-machines-plc-hmi-and-servo-controlled'],
    ['Hydraulics & Pressing', 'hydraulic-systems-and-pressing-units'],
    ['Retrofit & Service', 'retrofitting-and-service']
  ];

  const routeItems = [
    ['Home', 'index.html', 'home'],
    ['Company', page === 'home' ? '#about' : 'index.html#about', 'company'],
    ['Capabilities', page === 'home' ? '#expertise' : 'index.html#expertise', 'capabilities'],
    ['Custom & SPM', 'custom-spm.html', 'spm'],
    ['Retrofit & CNC', 'machines.html?type=retrofit', 'retrofit'],
    ['Experience', 'machines.html', 'experience'],
    ['Gallery', 'gallery.html', 'gallery']
  ];

  const activeRoute = () => {
    if (page === 'custom-spm') return 'spm';
    if (page === 'gallery') return 'gallery';
    if (page === 'machines' && requestedType === 'spm') return 'spm';
    if (page === 'machines' && requestedType === 'retrofit') return 'retrofit';
    if (page === 'machines') return 'experience';
    if (page === 'home') return 'home';
    return '';
  };

  const ensureGlobalStyles = () => {
    if (document.getElementById('v16-taxonomy-lock')) return;
    const style = document.createElement('style');
    style.id = 'v16-taxonomy-lock';
    style.textContent = `
      @media (min-width:1221px){
        body.v8.v13.v14 .desktop-nav{gap:clamp(9px,.9vw,15px)!important}
        body.v8.v13.v14 .desktop-nav a{font-size:9.7px!important;letter-spacing:.018em!important;white-space:nowrap!important}
      }
      @media (min-width:1221px) and (max-width:1480px){
        body.v8.v13.v14 .desktop-nav{gap:9px!important}
        body.v8.v13.v14 .desktop-nav a{font-size:9.2px!important}
        body.v8.v13.v14 .header-cta{padding-inline:11px!important;font-size:9.7px!important}
      }
      body.v8.v13.v14[data-page="home"] .capability-list a.capability-row{
        text-decoration:none!important;color:inherit!important;cursor:pointer!important
      }
      body.v8.v13.v14[data-page="home"] .capability-list a.capability-row strong{color:inherit!important}
      body.v8.v13.v14[data-page="home"] .capability-list a.capability-row i{font-style:normal!important;transition:transform .18s ease!important}
      body.v8.v13.v14[data-page="home"] .capability-list a.capability-row:hover i{transform:translateX(5px)!important}
      body.v8.v13.v14[data-page="home"] .capability-list a.capability-row:focus-visible,
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta:focus-visible{outline:2px solid #1e56aa!important;outline-offset:3px!important}
      body.v8.v13.v14[data-page="home"] .capability-media{display:grid!important}
      body.v8.v13.v14[data-page="home"] .capability-media figcaption{position:relative!important}
      body.v8.v13.v14[data-page="home"] .capability-media figcaption::after{
        content:"GALLERY-LINKED"!important;position:absolute!important;right:0!important;top:0!important;
        color:#1e56aa!important;font:500 8px/1 "IBM Plex Mono",monospace!important;letter-spacing:.13em!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta{
        width:100%!important;box-sizing:border-box!important;margin:20px 0 0!important;min-height:72px!important;padding:0 20px!important;
        border:1px solid #20394e!important;background:#0d1b29!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;
        color:#f7f8f8!important;text-decoration:none!important;font:600 10.5px/1.35 "IBM Plex Mono",monospace!important;letter-spacing:.075em!important;text-transform:uppercase!important;
        transition:background .18s ease,border-color .18s ease,color .18s ease!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta span{display:flex!important;align-items:center!important;gap:14px!important}
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta span::before{content:"PROJECT EVIDENCE"!important;color:#7591a8!important;font-size:8px!important;letter-spacing:.14em!important}
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta i{font-style:normal!important;color:#8fb8e8!important;font-size:17px!important;transition:transform .18s ease!important}
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta:hover{background:#10263a!important;border-color:#356ead!important;color:#fff!important}
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta:hover i{transform:translateX(5px)!important}
      body.v8.v13.v14[data-page="home"] .engineering-depth .archive-callout .btn{margin-bottom:30px!important}
      @media (max-width:760px){
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta{min-height:66px!important;padding:0 15px!important;font-size:9.6px!important}
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta span::before{display:none!important}
      }
    `;
    document.head.appendChild(style);
  };

  const normalizeNavigation = () => {
    const current = activeRoute();
    const desktop = document.querySelector('.desktop-nav');
    if (desktop) {
      desktop.innerHTML = routeItems.map(([label, href, route]) =>
        `<a href="${href}"${route === current ? ' class="is-current" aria-current="page"' : ''}>${label}</a>`
      ).join('');
    }

    const mobileNav = document.querySelector('[data-mobile-menu] nav');
    if (mobileNav) {
      mobileNav.innerHTML = routeItems.map(([label, href, route], index) =>
        `<a href="${href}"${route === current ? ' class="is-current" aria-current="page"' : ''}>${label} <span>${String(index + 1).padStart(2, '0')}</span></a>`
      ).join('');
    }

    const footerEngineering = [...document.querySelectorAll('.footer-col')].find(col => /engineering/i.test(col.querySelector(':scope > span')?.textContent || ''));
    if (footerEngineering) {
      const quote = footerEngineering.querySelector('[data-quote-open]');
      footerEngineering.innerHTML = '<span>Engineering</span><a href="index.html#expertise">Capabilities</a><a href="custom-spm.html">Custom &amp; SPM</a><a href="machines.html?type=retrofit">Retrofit &amp; CNC</a>';
      if (quote) footerEngineering.appendChild(quote);
      else footerEngineering.insertAdjacentHTML('beforeend','<button type="button" data-quote-open>Discuss a Machine ↗</button>');
    }
  };

  const alignCapabilitiesToGallery = () => {
    if (page !== 'home') return;
    const list = document.querySelector('[data-capability-list]');
    if (!list) return;

    const wanted = galleryCapabilityCategories.map(([label, key], index) =>
      `<a class="capability-row" href="gallery.html?category=${encodeURIComponent(key)}" data-gallery-capability="${key}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${label}</strong><i>→</i></a>`
    ).join('');
    if (list.dataset.galleryLinked !== 'true' || list.querySelectorAll('[data-gallery-capability]').length !== galleryCapabilityCategories.length) {
      list.innerHTML = wanted;
      list.dataset.galleryLinked = 'true';
    }

    let cta = document.querySelector('.capability-gallery-cta');
    if (!cta) {
      list.insertAdjacentHTML('afterend','<a class="capability-gallery-cta" href="gallery.html"><span>Explore the complete VSK project gallery</span><i>→</i></a>');
      cta = document.querySelector('.capability-gallery-cta');
    }
    if (cta) cta.href = 'gallery.html';

    const intro = document.querySelector('.capabilities .section-intro > p');
    if (intro) intro.textContent = 'Choose the engineering category closest to your requirement, then inspect the corresponding VSK project groups, machine photographs and engineering detail in the Gallery.';

    const media = document.querySelector('.capability-media');
    const image = media?.querySelector('[data-capability-image]');
    const index = media?.querySelector('[data-capability-index]');
    const title = media?.querySelector('[data-capability-title]');
    const copy = media?.querySelector('[data-capability-copy]');
    const tags = media?.querySelector('[data-capability-tags]');
    if (image) { image.src = galleryPreviewImage; image.alt = 'VSK custom machine project — engineering gallery reference'; }
    if (index) index.textContent = '05 ENGINEERING CATEGORIES / PROJECT GALLERY';
    if (title) title.textContent = 'Move from capability to actual VSK project evidence.';
    if (copy) copy.textContent = 'Each category opens Gallery already filtered to real project groups, so the customer can inspect machine views, controls, mechanisms and process detail instead of reading generic capability claims.';
    if (tags) tags.innerHTML = '<b>PROJECT GROUPS</b><b>PHOTOS</b><b>VIDEOS</b>';
  };

  const normalizeHomeTaxonomy = () => {
    if (page !== 'home') return;
    const referenceSmall = document.querySelector('.proof-grid article:nth-child(3) small');
    if (referenceSmall) referenceSmall.textContent = '39 Custom & SPM · 15 Retrofit & CNC';

    const split = document.querySelectorAll('.archive-callout-split span');
    if (split[0]) split[0].innerHTML = '<b>39</b> CUSTOM &amp; SPM';
    if (split[1]) split[1].innerHTML = '<b>15</b> RETROFIT &amp; CNC';
    const archiveCopy = document.querySelector('.archive-callout p');
    if (archiveCopy) archiveCopy.textContent = 'Search 39 Custom & SPM and 15 Retrofit & CNC references by process, machine type, customer need or control platform before you start the discussion.';

    const heroChips = [...document.querySelectorAll('.hero-chips span')];
    const retrofitChip = heroChips.find(el => /cnc.*retrofit|retrofit.*cnc/i.test(el.textContent));
    if (retrofitChip) retrofitChip.textContent = 'RETROFIT & CNC';

    const retrofitExperience = document.querySelector('.retrofit-actions a[href*="type=retrofit"]');
    if (retrofitExperience) retrofitExperience.innerHTML = 'See Retrofit &amp; CNC experience <span>↗</span>';
  };

  const normalizeExperienceTaxonomy = () => {
    if (page !== 'machines') return;
    const isRetrofit = requestedType === 'retrofit';
    const isSpm = requestedType === 'spm';

    const heroKicker = document.querySelector('.archive-hero .kicker');
    const heroNumberLabel = document.querySelector('.archive-hero-number small');
    const heroTitle = document.querySelector('.archive-hero h1');
    const heroCopy = document.querySelector('.archive-hero p');

    if (isRetrofit) {
      if (heroKicker) heroKicker.textContent = 'RETROFIT & CNC EXPERIENCE';
      if (heroNumberLabel) heroNumberLabel.textContent = '15 DOCUMENTED REFERENCES';
      if (heroTitle) heroTitle.innerHTML = 'Modernise a sound machine.<br><em>Recover capability and control.</em>';
      if (heroCopy) heroCopy.textContent = 'Explore VSK Retrofit & CNC experience across CNC, PLC, HMI, servo, drive, electrical and machine-tool systems, then compare the closest references with what you need to recover or upgrade.';
    } else if (isSpm) {
      if (heroKicker) heroKicker.textContent = 'CUSTOM & SPM EXPERIENCE';
      if (heroNumberLabel) heroNumberLabel.textContent = '39 DOCUMENTED REFERENCES';
      if (heroTitle) heroTitle.innerHTML = 'Find a custom-machine reference<br><em>close to your production need.</em>';
      if (heroCopy) heroCopy.textContent = 'Browse VSK Custom & SPM experience across purpose-built machines, CNC applications, servo systems, hydraulics, testing and process equipment.';
    } else {
      if (heroKicker) heroKicker.textContent = 'VSK ENGINEERING EXPERIENCE';
      if (heroNumberLabel) heroNumberLabel.textContent = '54 SEARCHABLE REFERENCES';
      if (heroTitle) heroTitle.innerHTML = 'Find experience<br><em>close to your requirement.</em>';
      if (heroCopy) heroCopy.textContent = 'Search VSK’s 39 Custom & SPM and 15 Retrofit & CNC references by process, machine type, application, customer or control platform. For photo-first browsing of actual project media, use the Gallery.';
    }

    const facts = document.querySelectorAll('.archive-hero-facts span');
    if (facts[0]) facts[0].innerHTML = '<strong>39</strong> CUSTOM &amp; SPM';
    if (facts[1]) facts[1].innerHTML = '<strong>15</strong> RETROFIT &amp; CNC';
    if (facts[2]) facts[2].innerHTML = '<strong>54</strong> DOCUMENTED REFERENCES';

    const spm = document.querySelector('[data-type-filter="spm"]');
    const retrofit = document.querySelector('[data-type-filter="retrofit"]');
    if (spm) spm.innerHTML = 'Custom &amp; SPM <b>39</b>';
    if (retrofit) retrofit.innerHTML = 'Retrofit &amp; CNC <b>15</b>';

    const active = document.querySelector('[data-active-filters]');
    if (active) {
      const text = active.textContent.trim();
      if (/^retrofit$/i.test(text)) active.textContent = 'Retrofit & CNC';
      if (/^custom \/ spm$/i.test(text) || /^custom & spm$/i.test(text)) active.textContent = 'Custom & SPM';
    }

    const dossierKicker = document.querySelector('[data-dossier-kicker]');
    if (dossierKicker && /retrofit experience/i.test(dossierKicker.textContent)) dossierKicker.textContent = 'RETROFIT & CNC EXPERIENCE';
    if (dossierKicker && /custom machine experience/i.test(dossierKicker.textContent)) dossierKicker.textContent = 'CUSTOM & SPM EXPERIENCE';
  };

  const ensureExperienceRoute = () => {
    if (page !== 'machines' || !['spm','retrofit'].includes(requestedType)) return;
    const target = document.querySelector(`[data-type-filter="${requestedType}"]`);
    if (target && !target.classList.contains('is-active')) target.click();
  };

  const applyMechanicalImage = () => {
    if (typeof capabilityData !== 'undefined' && capabilityData?.mechanical) {
      capabilityData.mechanical.image = mechanicalImage;
      capabilityData.mechanical.alt = mechanicalAlt;
    }
  };

  const ensureContactNumber = () => {
    const contactDirect = document.querySelector('.contact-direct');
    if (!contactDirect || contactDirect.querySelector('a[href="tel:+917353100095"]')) return;
    const primary = contactDirect.querySelector('a[href^="tel:"]');
    const secondary = document.createElement('a');
    secondary.href = 'tel:+917353100095';
    secondary.textContent = '+91 73531 00095';
    if (primary?.nextSibling) contactDirect.insertBefore(secondary, primary.nextSibling);
    else contactDirect.appendChild(secondary);
  };

  const ensureGalleryController = () => {
    if (page !== 'gallery') return;
    if (!document.getElementById('v16-gallery-first-paint-guard')) {
      const guard = document.createElement('style');
      guard.id = 'v16-gallery-first-paint-guard';
      guard.textContent = `
        body.v8.v13.v14[data-page="gallery"] .gallery-controls{min-height:146px!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
        body.v8.v13.v14[data-page="gallery"].gallery-categories-ready .gallery-controls{visibility:visible!important;opacity:1!important;pointer-events:auto!important;transition:opacity .16s ease!important}
      `;
      document.head.appendChild(guard);
    }
    if (!document.querySelector('script[data-v16-gallery-categories]')) {
      const script = document.createElement('script');
      script.src = 'gallery-categories.js?v=16.35';
      script.async = false;
      script.dataset.v16GalleryCategories = '';
      document.body.appendChild(script);
    }
  };

  [
    ['v16-user-polish.css', 'v16-user-polish.css?v=16.33'],
    ['v16-release-polish.css', 'v16-release-polish.css?v=16.33'],
    ['v16-corrections.css', 'v16-corrections.css?v=16.33']
  ].forEach(([prefix, href]) => {
    if (document.querySelector(`link[href^="${prefix}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.v16PreloadedPolish = '';
    document.head.appendChild(link);
  });

  if (typeof siteProjects !== 'undefined' && Array.isArray(siteProjects)) {
    const preferred = ['zcut', 'vertical', 'jig', 'udrill', 'slotting'];
    const rank = new Map(preferred.map((id, index) => [id, index]));
    siteProjects.sort((a, b) => {
      const ar = rank.has(a.id) ? rank.get(a.id) : preferred.length + 1;
      const br = rank.has(b.id) ? rank.get(b.id) : preferred.length + 1;
      return ar - br;
    });
  }

  const apply = () => {
    ensureGlobalStyles();
    normalizeNavigation();
    alignCapabilitiesToGallery();
    normalizeHomeTaxonomy();
    normalizeExperienceTaxonomy();
    applyMechanicalImage();
    ensureContactNumber();
    ensureGalleryController();
    ensureExperienceRoute();
  };

  apply();

  const afterOtherScripts = () => {
    setTimeout(apply, 0);
    requestAnimationFrame(() => requestAnimationFrame(apply));
  };

  document.addEventListener('DOMContentLoaded', afterOtherScripts, { once: true });
  window.addEventListener('load', () => {
    afterOtherScripts();
    setTimeout(apply, 250);
    setTimeout(apply, 900);
  }, { once: true });

  document.addEventListener('click', e => {
    if (page === 'machines' && e.target.closest('[data-type-filter],[data-machine-id],[data-archive-preview-open],[data-dossier-next],[data-dossier-prev]')) {
      setTimeout(() => {
        normalizeNavigation();
        normalizeExperienceTaxonomy();
      }, 0);
    }
  });
})();
