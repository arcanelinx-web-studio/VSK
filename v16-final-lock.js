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
      const capability = links.find(a => /capabilit/i.test(a.textContent || ''));
      let spm = links.find(a => /custom/i.test(a.textContent || ''));
      const retrofit = links.find(a => /retrofit/i.test(a.textContent || ''));
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

  const normalizeExperienceHero = () => {
    if (page !== 'machines') return;

    const isSpm = requestedType === 'spm';
    const isRetrofit = requestedType === 'retrofit';
    const heroNumber = document.querySelector('.archive-hero-number > span');
    const heroNumberLabel = document.querySelector('.archive-hero-number small');
    const kicker = document.querySelector('.archive-hero .kicker');
    const title = document.querySelector('.archive-hero h1');
    const copy = document.querySelector('.archive-hero p');

    if (isSpm) {
      document.title = 'Custom & SPM Experience — VSK Electro-Mech Solutions';
      if (heroNumber) heroNumber.textContent = '39';
      if (heroNumberLabel) heroNumberLabel.textContent = 'CUSTOM & SPM REFERENCES';
      if (kicker) kicker.textContent = 'CUSTOM & SPM EXPERIENCE';
      if (title) title.innerHTML = 'Find custom-machine experience<br><em>close to your production need.</em>';
      if (copy) copy.textContent = 'Browse 39 VSK Custom & SPM references across purpose-built machines, CNC applications, servo systems, hydraulics, testing, handling and process equipment.';
    } else if (isRetrofit) {
      document.title = 'Retrofit & CNC Experience — VSK Electro-Mech Solutions';
      if (heroNumber) heroNumber.textContent = '15';
      if (heroNumberLabel) heroNumberLabel.textContent = 'RETROFIT & CNC REFERENCES';
      if (kicker) kicker.textContent = 'RETROFIT & CNC EXPERIENCE';
      if (title) title.innerHTML = 'Modernise a sound machine.<br><em>Recover capability and control.</em>';
      if (copy) copy.textContent = 'Explore 15 VSK Retrofit & CNC references across CNC, PLC, HMI, servo, drive, electrical and machine-tool systems, then compare the closest work with your upgrade requirement.';
    } else {
      document.title = 'Engineering Experience — VSK Electro-Mech Solutions';
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

    /* Legacy archive code expects this element even though V16 keeps visual mode hidden. */
    if (!document.querySelector('[data-visual-count]')) {
      const hiddenCount = document.createElement('span');
      hiddenCount.hidden = true;
      hiddenCount.dataset.visualCount = '';
      hiddenCount.textContent = '54';
      document.body.appendChild(hiddenCount);
    }
  };

  const syncExperienceStatus = () => {
    if (page !== 'machines') return;
    const activeType = document.querySelector('[data-type-filter].is-active')?.dataset.typeFilter || requestedType || 'all';
    const status = document.querySelector('[data-active-filters]');
    const count = document.querySelector('[data-result-count]');
    if (!status) return;

    let text = (status.textContent || '').trim();
    text = text.replace(/Custom\s*\/\s*SPM/ig, 'Custom & SPM');
    text = text.replace(/^Retrofit(?=\s*(?:·|$))/i, 'Retrofit & CNC');

    const generic = !text || /^All applications\s*·\s*All technologies$/i.test(text);
    if (generic && activeType === 'spm') text = 'Custom & SPM · All applications · All technologies';
    else if (generic && activeType === 'retrofit') text = 'Retrofit & CNC · All applications · All technologies';
    else if (generic) text = 'All applications · All technologies';
    status.textContent = text;

    if (count) {
      const n = parseInt((count.textContent || '').match(/\d+/)?.[0] || '0', 10);
      const hasSpecificFilter = /[“”]|Fanuc|Siemens|Fagor|PLC|Servo|VFD|Automation|Turning|Hydraulics|Cutting|Testing|Finishing|Controls|Grinding/i.test(text);
      if (!hasSpecificFilter && activeType === 'spm' && n === 39) count.textContent = '39 Custom & SPM references';
      else if (!hasSpecificFilter && activeType === 'retrofit' && n === 15) count.textContent = '15 Retrofit & CNC references';
      else if (!hasSpecificFilter && activeType === 'all' && n === 54) count.textContent = '54 engineering references';
    }
  };

  const bindExperienceStatus = () => {
    if (page !== 'machines' || document.documentElement.dataset.v16StatusBound) return;
    document.documentElement.dataset.v16StatusBound = '1';
    const schedule = () => setTimeout(syncExperienceStatus, 0);
    document.addEventListener('click', event => {
      if (event.target.closest('[data-type-filter],[data-category-filter],[data-tech-filter],[data-clear-filters]')) schedule();
    }, false);
    document.addEventListener('input', event => {
      if (event.target.matches?.('[data-archive-search]')) schedule();
    }, false);
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
    normalizeExperienceHero();
    bindExperienceStatus();
    syncExperienceStatus();
    ensureGalleryCategories();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, {once:true});
  else apply();

  window.addEventListener('load', () => {
    apply();
    setTimeout(syncExperienceStatus, 80);
    setTimeout(syncExperienceStatus, 650);
    setTimeout(syncExperienceStatus, 1800);
  }, {once:true});
})();