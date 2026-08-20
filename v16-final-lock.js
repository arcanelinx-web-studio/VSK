(() => {
  'use strict';

  const page = document.body.dataset.page || 'home';
  const mechanicalImage = 'media/v16/images/spm-cnc-machines/transtech-motor-flange-facing-cnc-mc/20230327-120458.webp';
  const mechanicalAlt = 'VSK motor flange facing CNC machine — mechanical engineering and machine build';

  const galleryCapabilityCategories = [
    ['SPM / CNC Machines', 'spm-cnc-machines'],
    ['SPM · PLC / HMI / Servo', 'spm-machines-plc-hmi-and-servo-controlled'],
    ['Hydraulics & Pressing', 'hydraulic-systems-and-pressing-units'],
    ['Retrofit & Service', 'retrofitting-and-service']
  ];

  const ensureGlobalStyles = () => {
    if (document.getElementById('v16-taxonomy-lock')) return;
    const style = document.createElement('style');
    style.id = 'v16-taxonomy-lock';
    style.textContent = `
      @media (min-width:1221px){
        body.v8.v13.v14 .desktop-nav{gap:clamp(10px,1vw,17px)!important}
        body.v8.v13.v14 .desktop-nav a{font-size:10px!important;letter-spacing:.025em!important}
      }
      @media (min-width:1221px) and (max-width:1480px){
        body.v8.v13.v14 .desktop-nav{gap:11px!important}
        body.v8.v13.v14 .desktop-nav a{font-size:9.6px!important}
        body.v8.v13.v14 .header-cta{padding-inline:12px!important;font-size:10px!important}
      }
      body.v8.v13.v14[data-page="home"] .capability-layout{grid-template-columns:minmax(0,1fr)!important}
      body.v8.v13.v14[data-page="home"] .capability-media{display:none!important}
      body.v8.v13.v14[data-page="home"] .capability-list a.capability-row{
        text-decoration:none!important;color:inherit!important;cursor:pointer!important
      }
      body.v8.v13.v14[data-page="home"] .capability-list a.capability-row:focus-visible,
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta:focus-visible{
        outline:2px solid #1e56aa!important;outline-offset:3px!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta{
        width:100%!important;box-sizing:border-box!important;margin:26px 0 0!important;
        min-height:76px!important;padding:0 24px!important;border:1px solid rgba(255,255,255,.12)!important;
        border-top-color:rgba(147,177,203,.34)!important;background:#0d1b29!important;
        display:flex!important;align-items:center!important;justify-content:space-between!important;gap:20px!important;
        color:#f7f8f8!important;text-decoration:none!important;
        font:600 12px/1.35 "IBM Plex Mono",monospace!important;letter-spacing:.055em!important;
        transition:background .18s ease,border-color .18s ease,color .18s ease!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta i{
        font-style:normal!important;color:#f7f8f8!important;font-size:16px!important;
        transition:transform .18s ease,color .18s ease!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta:hover{
        background:#10263a!important;border-color:#356ead!important;color:#fff!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta:hover i{
        transform:translateX(5px)!important;color:#8fb8e8!important
      }
      body.v8.v13.v14[data-page="home"] .engineering-depth .archive-callout .btn{margin-bottom:30px!important}
      @media (max-width:760px){
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta{
          min-height:68px!important;padding:0 17px!important;font-size:10.5px!important
        }
      }
    `;
    document.head.appendChild(style);
  };

  const alignCapabilitiesToGallery = () => {
    if (page !== 'home') return;
    const list = document.querySelector('[data-capability-list]');
    if (!list) return;

    if (list.dataset.galleryLinked !== 'true') {
      list.innerHTML = galleryCapabilityCategories.map(([label, key], index) => `
        <a class="capability-row" href="gallery.html?category=${encodeURIComponent(key)}" data-gallery-capability>
          <span>${String(index + 1).padStart(2, '0')}</span><strong>${label}</strong><i>→</i>
        </a>`).join('');
      list.dataset.galleryLinked = 'true';
    }

    if (!document.querySelector('.capability-gallery-cta')) {
      list.insertAdjacentHTML('afterend', `
        <a class="capability-gallery-cta" href="gallery.html">
          <span>Explore the complete VSK project gallery</span><i>→</i>
        </a>`);
    }

    const introCopy = document.querySelector('.capabilities .section-intro > p');
    if (introCopy) introCopy.textContent = 'Choose the engineering category closest to your requirement, then open the corresponding VSK project groups, machine photos and engineering detail in Gallery.';
  };

  const makeNavLink = (label, href, route) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    a.dataset.v16Route = route;
    return a;
  };

  const normalizeNavigation = () => {
    const params = new URLSearchParams(location.search);
    const requestedType = params.get('type');

    const desktop = document.querySelector('.desktop-nav');
    if (desktop) {
      let retrofit = [...desktop.querySelectorAll('a')].find(a => a.href.includes('type=retrofit') || /retrofit\s*&\s*cnc/i.test(a.textContent));
      let custom = desktop.querySelector('[data-v16-route="spm"]');
      if (!custom) {
        custom = makeNavLink('Custom & SPM', 'machines.html?type=spm', 'spm');
        if (retrofit) desktop.insertBefore(custom, retrofit);
        else {
          const experience = [...desktop.querySelectorAll('a')].find(a => /experience/i.test(a.textContent));
          desktop.insertBefore(custom, experience || null);
        }
      }
      custom.href = 'machines.html?type=spm';
      custom.textContent = 'Custom & SPM';
      if (retrofit) {
        retrofit.href = 'machines.html?type=retrofit';
        retrofit.textContent = 'Retrofit & CNC';
        retrofit.dataset.v16Route = 'retrofit';
      }

      if (page === 'machines') {
        desktop.querySelectorAll('a').forEach(a => { a.classList.remove('is-current'); a.removeAttribute('aria-current'); });
        let active;
        if (requestedType === 'spm') active = custom;
        else if (requestedType === 'retrofit') active = retrofit;
        else active = [...desktop.querySelectorAll('a')].find(a => /^experience$/i.test(a.textContent.trim()));
        if (active) { active.classList.add('is-current'); active.setAttribute('aria-current','page'); }
      }
    }

    const mobile = document.querySelector('[data-mobile-menu] nav');
    if (mobile) {
      let retrofit = [...mobile.querySelectorAll('a')].find(a => a.href.includes('type=retrofit') || /retrofit\s*&\s*cnc/i.test(a.textContent));
      let custom = mobile.querySelector('[data-v16-route="spm"]');
      if (!custom) {
        custom = document.createElement('a');
        custom.href = 'machines.html?type=spm';
        custom.dataset.v16Route = 'spm';
        custom.innerHTML = 'Custom &amp; SPM <span></span>';
        if (retrofit) mobile.insertBefore(custom, retrofit);
        else mobile.appendChild(custom);
      }
      custom.href = 'machines.html?type=spm';
      const customNo = custom.querySelector('span');
      custom.innerHTML = 'Custom &amp; SPM <span></span>';
      if (customNo && !custom.querySelector('span')) custom.appendChild(customNo);
      retrofit = [...mobile.querySelectorAll('a')].find(a => a.href.includes('type=retrofit') || /retrofit/i.test(a.textContent));
      if (retrofit) {
        retrofit.href = 'machines.html?type=retrofit';
        const span = retrofit.querySelector('span');
        retrofit.innerHTML = 'Retrofit &amp; CNC <span></span>';
        if (span && !retrofit.querySelector('span')) retrofit.appendChild(span);
      }
      [...mobile.querySelectorAll('a')].forEach((a, index) => {
        let n = a.querySelector('span');
        if (!n) { n = document.createElement('span'); a.appendChild(n); }
        n.textContent = String(index + 1).padStart(2,'0');
      });
    }

    const footerEngineering = [...document.querySelectorAll('.footer-col')].find(col => /engineering/i.test(col.querySelector(':scope > span')?.textContent || ''));
    if (footerEngineering) {
      let retrofit = [...footerEngineering.querySelectorAll('a')].find(a => a.href.includes('type=retrofit'));
      let custom = footerEngineering.querySelector('[data-v16-route="spm"]');
      if (!custom) {
        custom = makeNavLink('Custom & SPM', 'machines.html?type=spm', 'spm');
        footerEngineering.insertBefore(custom, retrofit || footerEngineering.querySelector('button') || null);
      }
      if (retrofit) retrofit.textContent = 'Retrofit & CNC';
    }
  };

  const normalizeHomeTaxonomy = () => {
    if (page !== 'home') return;
    const referenceSmall = document.querySelector('.proof-grid article:nth-child(3) small');
    if (referenceSmall) referenceSmall.textContent = '39 Custom / SPM · 15 Retrofit & CNC';

    const split = document.querySelectorAll('.archive-callout-split span');
    if (split[0]) split[0].innerHTML = '<b>39</b> CUSTOM / SPM';
    if (split[1]) split[1].innerHTML = '<b>15</b> RETROFIT &amp; CNC';
    const archiveCopy = document.querySelector('.archive-callout p');
    if (archiveCopy) archiveCopy.textContent = 'Search 39 Custom / SPM and 15 Retrofit & CNC references by process, machine type, customer need or control platform before you start the discussion.';

    const heroChips = [...document.querySelectorAll('.hero-chips span')];
    const cncChip = heroChips.find(el => /cnc.*retrofit|retrofit.*cnc/i.test(el.textContent));
    if (cncChip) cncChip.textContent = 'RETROFIT & CNC';

    const retrofitExperience = document.querySelector('.retrofit-actions a[href*="type=retrofit"]');
    if (retrofitExperience) retrofitExperience.innerHTML = 'See Retrofit &amp; CNC experience <span>↗</span>';
  };

  const normalizeExperienceTaxonomy = () => {
    if (page !== 'machines') return;
    const heroCopy = document.querySelector('.archive-hero p');
    if (heroCopy) heroCopy.textContent = 'Search VSK’s Custom & SPM and Retrofit & CNC experience by process, machine type, application, customer or control platform. For photo-first browsing of actual project media, use the Gallery.';

    const facts = document.querySelectorAll('.archive-hero-facts span');
    if (facts[0]) facts[0].innerHTML = '<strong>39</strong> CUSTOM / SPM';
    if (facts[1]) facts[1].innerHTML = '<strong>15</strong> RETROFIT &amp; CNC';

    const spm = document.querySelector('[data-type-filter="spm"]');
    const retrofit = document.querySelector('[data-type-filter="retrofit"]');
    if (spm) spm.innerHTML = 'Custom &amp; SPM <b>39</b>';
    if (retrofit) retrofit.innerHTML = 'Retrofit &amp; CNC <b>15</b>';

    const active = document.querySelector('[data-active-filters]');
    if (active && /^retrofit$/i.test(active.textContent.trim())) active.textContent = 'Retrofit & CNC';

    const dossierKicker = document.querySelector('[data-dossier-kicker]');
    if (dossierKicker && /^retrofit experience$/i.test(dossierKicker.textContent.trim())) dossierKicker.textContent = 'RETROFIT & CNC EXPERIENCE';
  };

  const ensureExperienceRoute = () => {
    if (page !== 'machines') return;
    const requestedType = new URLSearchParams(location.search).get('type');
    if (!['spm','retrofit'].includes(requestedType)) return;
    const target = document.querySelector(`[data-type-filter="${requestedType}"]`);
    if (target && !target.classList.contains('is-active')) target.click();
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

  if (!document.querySelector('link[href^="v16-review-authority.css"]') && !document.querySelector('link[href^="v16-final-lock.css"]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'v16-review-authority.css?v=16.33';
    document.head.appendChild(css);
  }

  if (typeof siteProjects !== 'undefined' && Array.isArray(siteProjects)) {
    const preferred = ['zcut', 'vertical', 'jig', 'udrill', 'slotting'];
    const rank = new Map(preferred.map((id, index) => [id, index]));
    siteProjects.sort((a, b) => {
      const ar = rank.has(a.id) ? rank.get(a.id) : preferred.length + 1;
      const br = rank.has(b.id) ? rank.get(b.id) : preferred.length + 1;
      return ar - br;
    });
  }

  if (page === 'gallery') {
    if (!document.getElementById('v16-gallery-first-paint-guard')) {
      const guard = document.createElement('style');
      guard.id = 'v16-gallery-first-paint-guard';
      guard.textContent = `
        body.v8.v13.v14[data-page="gallery"] .gallery-controls{
          min-height:146px!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important
        }
        body.v8.v13.v14[data-page="gallery"].gallery-categories-ready .gallery-controls{
          visibility:visible!important;opacity:1!important;pointer-events:auto!important;transition:opacity .16s ease!important
        }
      `;
      document.head.appendChild(guard);
    }
    if (!document.querySelector('script[data-v16-gallery-categories]')) {
      const script = document.createElement('script');
      script.src = 'gallery-categories.js?v=16.33';
      script.async = false;
      script.dataset.v16GalleryCategories = '';
      document.body.appendChild(script);
    }
  }

  const applyMechanicalImage = () => {
    if (typeof capabilityData !== 'undefined' && capabilityData?.mechanical) {
      capabilityData.mechanical.image = mechanicalImage;
      capabilityData.mechanical.alt = mechanicalAlt;
    }
    const image = document.querySelector('[data-capability-image]');
    const row = document.querySelector('[data-capability="mechanical"]');
    if (image && row?.classList.contains('is-active')) {
      image.src = mechanicalImage;
      image.alt = mechanicalAlt;
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

  const apply = () => {
    ensureGlobalStyles();
    normalizeNavigation();
    alignCapabilitiesToGallery();
    normalizeHomeTaxonomy();
    normalizeExperienceTaxonomy();
    applyMechanicalImage();
    ensureContactNumber();
    ensureExperienceRoute();
  };

  apply();
  document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(apply), { once: true });
  window.addEventListener('load', () => {
    apply();
    setTimeout(apply, 450);
    setTimeout(apply, 1100);
  }, { once: true });

  if (page === 'machines') {
    const observer = new MutationObserver(() => normalizeExperienceTaxonomy());
    document.addEventListener('DOMContentLoaded', () => {
      const root = document.querySelector('.archive-browser') || document.querySelector('#main');
      if (root) observer.observe(root, {childList:true,subtree:true,characterData:true});
    }, { once:true });
  }
})();
