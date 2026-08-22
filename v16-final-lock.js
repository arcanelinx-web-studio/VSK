(() => {
  'use strict';

  const page = document.body.dataset.page || 'home';
  const params = new URLSearchParams(location.search);
  const requestedType = params.get('type');

  const routes = [
    ['Home', 'index.html', 'home'],
    ['Company', page === 'home' ? '#about' : 'index.html#about', 'company'],
    ['Capabilities', page === 'home' ? '#expertise' : 'index.html#expertise', 'capabilities'],
    ['Custom & SPM', 'machines.html?type=spm', 'spm'],
    ['Retrofit & CNC', 'machines.html?type=retrofit', 'retrofit'],
    ['Experience', 'machines.html', 'experience'],
    ['Gallery', 'gallery.html', 'gallery']
  ];

  const currentRoute = () => {
    if (page === 'gallery') return 'gallery';
    if (page === 'machines' && requestedType === 'spm') return 'spm';
    if (page === 'machines' && requestedType === 'retrofit') return 'retrofit';
    if (page === 'machines') return 'experience';
    if (page === 'custom-spm') return 'spm';
    if (page === 'home') return 'home';
    return '';
  };

  const ensureStyles = () => {
    let style = document.getElementById('v16-navigation-consistency');
    if (!style) {
      style = document.createElement('style');
      style.id = 'v16-navigation-consistency';
      document.head.appendChild(style);
    }
    style.textContent = `
      @media (min-width:1481px){
        body.v8.v13.v14 .site-header,
        body.v8.v13.v14 .site-header.is-solid,
        body.v8.v13.v14 .site-header.is-scrolled{
          grid-template-columns:minmax(330px,1fr) auto 196px!important;
          gap:28px!important;
          padding-inline:40px!important;
        }
        body.v8.v13.v14 .desktop-nav{gap:20px!important}
        body.v8.v13.v14 .desktop-nav a{font-size:11px!important;letter-spacing:.015em!important;font-weight:600!important}
      }
      @media (min-width:1221px) and (max-width:1480px){
        body.v8.v13.v14 .site-header,
        body.v8.v13.v14 .site-header.is-solid,
        body.v8.v13.v14 .site-header.is-scrolled{
          grid-template-columns:minmax(285px,1fr) auto 176px!important;
          gap:18px!important;
          padding-inline:30px!important;
        }
        body.v8.v13.v14 .desktop-nav{gap:11px!important}
        body.v8.v13.v14 .desktop-nav a{font-size:10.3px!important;letter-spacing:.01em!important;font-weight:600!important}
      }
    `;
  };

  const normalizeNavigation = () => {
    const current = currentRoute();
    const desktop = document.querySelector('.desktop-nav');
    if (desktop) {
      desktop.innerHTML = routes.map(([label, href, route]) =>
        `<a href="${href}"${route === current ? ' class="is-current" aria-current="page"' : ''}>${label}</a>`
      ).join('');
    }

    const mobile = document.querySelector('[data-mobile-menu] nav');
    if (mobile) {
      mobile.innerHTML = routes.map(([label, href, route], index) =>
        `<a href="${href}"${route === current ? ' class="is-current" aria-current="page"' : ''}>${label} <span>${String(index + 1).padStart(2, '0')}</span></a>`
      ).join('');
    }

    document.querySelectorAll('a[href="custom-spm.html"]').forEach(anchor => {
      anchor.href = 'machines.html?type=spm';
      if (/custom/i.test(anchor.textContent || '')) anchor.textContent = 'Custom & SPM';
    });

    const engineeringCol = [...document.querySelectorAll('.footer-col')]
      .find(col => /engineering/i.test(col.querySelector(':scope > span')?.textContent || ''));
    if (engineeringCol) {
      const links = [...engineeringCol.querySelectorAll(':scope > a')];
      let capability = links.find(a => /capabilit/i.test(a.textContent || ''));
      let spm = links.find(a => /custom/i.test(a.textContent || ''));
      let retrofit = links.find(a => /retrofit/i.test(a.textContent || ''));
      if (!spm) {
        spm = document.createElement('a');
        if (retrofit) engineeringCol.insertBefore(spm, retrofit); else engineeringCol.appendChild(spm);
      }
      spm.href = 'machines.html?type=spm';
      spm.textContent = 'Custom & SPM';
      if (retrofit) {
        retrofit.href = 'machines.html?type=retrofit';
        retrofit.textContent = 'Retrofit & CNC';
      }
      if (capability) capability.href = page === 'home' ? '#expertise' : 'index.html#expertise';
    }
  };

  const normalizeExperience = () => {
    if (page !== 'machines') return;

    const isSpm = requestedType === 'spm';
    const isRetrofit = requestedType === 'retrofit';
    const heroNumber = document.querySelector('.archive-hero-number > span');
    const heroNumberLabel = document.querySelector('.archive-hero-number small');
    const kicker = document.querySelector('.archive-hero .kicker');
    const title = document.querySelector('.archive-hero h1');
    const copy = document.querySelector('.archive-hero p');

    if (isSpm) {
      if (heroNumber) heroNumber.textContent = '39';
      if (heroNumberLabel) heroNumberLabel.textContent = 'CUSTOM & SPM REFERENCES';
      if (kicker) kicker.textContent = 'CUSTOM & SPM EXPERIENCE';
      if (title) title.innerHTML = 'Find custom-machine experience<br><em>close to your production need.</em>';
      if (copy) copy.textContent = 'Browse 39 VSK Custom & SPM references across purpose-built machines, CNC applications, servo systems, hydraulics, testing, handling and process equipment.';
    } else if (isRetrofit) {
      if (heroNumber) heroNumber.textContent = '15';
      if (heroNumberLabel) heroNumberLabel.textContent = 'RETROFIT & CNC REFERENCES';
      if (kicker) kicker.textContent = 'RETROFIT & CNC EXPERIENCE';
      if (title) title.innerHTML = 'Modernise a sound machine.<br><em>Recover capability and control.</em>';
      if (copy) copy.textContent = 'Explore 15 VSK Retrofit & CNC references across CNC, PLC, HMI, servo, drive, electrical and machine-tool systems, then compare the closest work with your upgrade requirement.';
    } else {
      if (heroNumber) heroNumber.textContent = '54';
      if (heroNumberLabel) heroNumberLabel.textContent = 'SEARCHABLE EXPERIENCE';
      if (kicker) kicker.textContent = 'VSK ENGINEERING EXPERIENCE';
      if (title) title.innerHTML = 'Find experience<br><em>close to your requirement.</em>';
      if (copy) copy.textContent = 'Search VSK’s 39 Custom & SPM and 15 Retrofit & CNC references by process, machine type, application, customer or control platform. For photo-first browsing, use the Gallery.';
    }

    const facts = document.querySelectorAll('.archive-hero-facts span');
    if (facts[0]) facts[0].innerHTML = '<strong>39</strong> CUSTOM &amp; SPM';
    if (facts[1]) facts[1].innerHTML = '<strong>15</strong> RETROFIT &amp; CNC';
    if (facts[2]) facts[2].innerHTML = '<strong>54</strong> DOCUMENTED REFERENCES';

    const all = document.querySelector('[data-type-filter="all"]');
    const spm = document.querySelector('[data-type-filter="spm"]');
    const retrofit = document.querySelector('[data-type-filter="retrofit"]');
    if (all) all.innerHTML = 'All <b>54</b>';
    if (spm) spm.innerHTML = 'Custom &amp; SPM <b>39</b>';
    if (retrofit) retrofit.innerHTML = 'Retrofit &amp; CNC <b>15</b>';

    const active = document.querySelector('[data-active-filters]');
    if (active) {
      const text = (active.textContent || '').trim();
      if (/^retrofit$/i.test(text)) active.textContent = 'Retrofit & CNC';
      if (/^custom\s*[\/&]\s*spm$/i.test(text)) active.textContent = 'Custom & SPM';
    }

    const expected = isSpm ? spm : isRetrofit ? retrofit : null;
    if (expected && !expected.classList.contains('is-active')) expected.click();
  };

  const guardExperienceLabels = () => {
    if (page !== 'machines') return;
    const active = document.querySelector('[data-active-filters]');
    if (!active || active.dataset.v16ConsistencyGuard) return;
    active.dataset.v16ConsistencyGuard = '1';
    const observer = new MutationObserver(() => {
      const text = (active.textContent || '').trim();
      if (/^retrofit$/i.test(text)) active.textContent = 'Retrofit & CNC';
      else if (/^custom\s*[\/&]\s*spm$/i.test(text)) active.textContent = 'Custom & SPM';
    });
    observer.observe(active, {childList:true, subtree:true, characterData:true});
  };

  const ensureGalleryCategories = () => {
    if (page !== 'gallery') return;
    if (document.querySelector('script[data-v16-gallery-categories]')) return;
    const script = document.createElement('script');
    script.src = `gallery-categories.js?review=${Date.now()}`;
    script.dataset.v16GalleryCategories = '1';
    document.body.appendChild(script);
  };

  const apply = () => {
    ensureStyles();
    normalizeNavigation();
    normalizeExperience();
    guardExperienceLabels();
    ensureGalleryCategories();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, {once:true});
  } else {
    apply();
  }
  window.addEventListener('load', apply, {once:true});
  setTimeout(apply, 80);
  setTimeout(apply, 500);
  setTimeout(apply, 1300);
})();