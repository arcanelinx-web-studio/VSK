(() => {
  'use strict';

  const page = document.body.dataset.page || 'home';
  const params = new URLSearchParams(location.search);
  const requestedType = params.get('type');
  const harmonyToken = Date.now();

  let returningHome = false;
  if (page === 'home') {
    try {
      returningHome = sessionStorage.getItem('vskBootSeen') === '1';
      if (returningHome) document.documentElement.classList.add('vsk-returning-session');
      else sessionStorage.setItem('vskBootSeen', '1');
    } catch (_) {
      returningHome = false;
    }
  }

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

      @keyframes vskOpenEyebrow{from{opacity:0;translate:0 12px}to{opacity:1;translate:0 0}}
      @keyframes vskOpenLine{from{opacity:0;translate:0 34px}to{opacity:1;translate:0 0}}
      @keyframes vskOpenCopy{from{opacity:0;translate:0 20px}to{opacity:1;translate:0 0}}
      @keyframes vskOpenBoard{from{opacity:0;translate:32px 0;scale:.975}to{opacity:1;translate:0 0;scale:1}}
      @keyframes vskOpenWipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
      @keyframes vskOpenMeta{from{opacity:0;translate:0 10px}to{opacity:1;translate:0 0}}
      @keyframes vskOpenTech{from{opacity:0}to{opacity:1}}
      @keyframes vskOpenCross{from{opacity:0;scale:.7;rotate:-10deg}to{opacity:1;scale:1;rotate:0deg}}

      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-kicker,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy h1 span,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy h1 em,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy>p,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-actions,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-chips,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-chips span,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-engineering-board,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-board-main img,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-board-tag,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-tech-sheet,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-proof-chip,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-board-side-note,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-crosshair{
        animation:none!important;
      }
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-kicker,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy h1 span,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy h1 em,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy>p,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-actions,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-chips,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-chips span,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-engineering-board,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-board-tag,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-tech-sheet,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-proof-chip,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-board-side-note,
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-crosshair{opacity:0!important}
      html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-board-main img{clip-path:inset(0 100% 0 0)!important}

      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-kicker{animation:vskOpenEyebrow .50s cubic-bezier(.2,.76,.2,1) .05s both!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-blue-copy h1 span{animation:vskOpenLine .72s cubic-bezier(.18,.8,.2,1) .20s both!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-blue-copy h1 em{animation:vskOpenLine .74s cubic-bezier(.18,.8,.2,1) .36s both!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-blue-copy>p{animation:vskOpenCopy .62s cubic-bezier(.2,.74,.2,1) .62s both!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-actions{animation:vskOpenCopy .56s cubic-bezier(.2,.74,.2,1) .84s both!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-engineering-board{animation:vskOpenBoard .78s cubic-bezier(.18,.78,.2,1) .72s both!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-board-main img{animation:vskOpenWipe .92s cubic-bezier(.2,.8,.2,1) 1.04s both!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-board-tag{animation:vskOpenMeta .46s ease-out 1.42s both!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-tech-sheet{animation:vskOpenTech .52s ease-out 1.54s both!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-proof-chip{animation:vskOpenMeta .46s ease-out 1.66s both!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-board-side-note{animation:vskOpenMeta .44s ease-out 1.76s both!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-crosshair{animation:vskOpenCross .62s cubic-bezier(.2,.74,.2,1) 1.70s both!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-chips{animation:vskOpenMeta .46s ease-out 1.70s both!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-chips span{animation:vskOpenMeta .40s ease-out both!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-chips span:nth-child(1){animation-delay:1.76s!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-chips span:nth-child(2){animation-delay:1.84s!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-chips span:nth-child(3){animation-delay:1.92s!important}
      html.vsk-opening-live body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-chips span:nth-child(4){animation-delay:2s!important}

      html.vsk-returning-session body.v8.v13.v14[data-page="home"]::before,
      html.vsk-returning-session body.v8.v13.v14[data-page="home"]::after{content:none!important;display:none!important;visibility:hidden!important;opacity:0!important;animation:none!important}
      html.vsk-returning-session body.v8.v13.v14[data-page="home"] > :not(script):not(style){animation:none!important;visibility:visible!important;opacity:1!important}
      html.vsk-returning-session body.v8.v13.v14[data-page="home"] #hero .hero-blue-copy .hero-kicker,
      html.vsk-returning-session body.v8.v13.v14[data-page="home"] #hero .hero-blue-copy h1 span,
      html.vsk-returning-session body.v8.v13.v14[data-page="home"] #hero .hero-blue-copy h1 em,
      html.vsk-returning-session body.v8.v13.v14[data-page="home"] #hero .hero-blue-copy>p,
      html.vsk-returning-session body.v8.v13.v14[data-page="home"] #hero .hero-blue-copy .hero-actions,
      html.vsk-returning-session body.v8.v13.v14[data-page="home"] #hero .hero-blue-copy .hero-chips,
      html.vsk-returning-session body.v8.v13.v14[data-page="home"] #hero .hero-blue-copy .hero-chips span,
      html.vsk-returning-session body.v8.v13.v14[data-page="home"] #hero .hero-engineering-board,
      html.vsk-returning-session body.v8.v13.v14[data-page="home"] #hero .hero-board-main img,
      html.vsk-returning-session body.v8.v13.v14[data-page="home"] #hero .hero-board-tag,
      html.vsk-returning-session body.v8.v13.v14[data-page="home"] #hero .hero-tech-sheet,
      html.vsk-returning-session body.v8.v13.v14[data-page="home"] #hero .hero-proof-chip,
      html.vsk-returning-session body.v8.v13.v14[data-page="home"] #hero .hero-board-side-note,
      html.vsk-returning-session body.v8.v13.v14[data-page="home"] #hero .hero-crosshair{animation:none!important;opacity:1!important;transform:none!important;translate:none!important;clip-path:none!important;-webkit-mask:none!important;mask:none!important}

      @media (prefers-reduced-motion:reduce){
        html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-kicker,
        html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy h1 span,
        html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy h1 em,
        html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy>p,
        html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-actions,
        html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-chips,
        html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-blue-copy .hero-chips span,
        html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-engineering-board,
        html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-board-tag,
        html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-tech-sheet,
        html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-proof-chip,
        html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-board-side-note,
        html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-crosshair{opacity:1!important;animation:none!important}
        html.vsk-opening-prep body.v8.v13.v14[data-page="home"] .hero-board-main img{clip-path:none!important;animation:none!important}
      }
    `;
  };

  const ensureBalanceStyles = () => {
    let style = document.getElementById('v16-user-balance-authority');
    if (!style) {
      style = document.createElement('style');
      style.id = 'v16-user-balance-authority';
    }
    style.textContent = `
      /* Final client-review authority: these rules are always appended after harmony. */
      html body.v8.v13.v14 .capability-media .vsk-related-projects-cta,
      html body.v8.v13.v14 .capability-media .capability-project-link{
        width:min(100%,276px)!important;
        min-width:250px!important;
        min-height:54px!important;
        height:54px!important;
        margin-top:20px!important;
        padding:0 18px!important;
        gap:16px!important;
        font-size:12px!important;
      }
      html body.v8.v13.v14 .capability-media .vsk-related-projects-cta i,
      html body.v8.v13.v14 .capability-media .capability-project-link i{font-size:15px!important}

      html body.v8.v13.v14[data-page="home"] .vsk-google-reviews{
        background:#fff!important;
        border-top-color:#d6e0e7!important;
        border-bottom-color:#d6e0e7!important;
        color:#102333!important;
      }
      html body.v8.v13.v14[data-page="home"] .vsk-google-reviews .kicker{color:#1e56aa!important}
      html body.v8.v13.v14[data-page="home"] .vsk-google-reviews-intro h2{color:#102333!important}
      html body.v8.v13.v14[data-page="home"] .vsk-google-reviews-intro h2 em,
      html body.v8.v13.v14[data-page="home"] .vsk-google-rating>strong,
      html body.v8.v13.v14[data-page="home"] .vsk-google-rating b{color:#1e56aa!important}
      html body.v8.v13.v14[data-page="home"] .vsk-google-rating small{color:#66798a!important}
      html body.v8.v13.v14[data-page="home"] .vsk-google-reviews-intro>p{color:#566a7b!important}
      html body.v8.v13.v14[data-page="home"] .vsk-google-reviews-intro>a{
        background:#eef3f6!important;
        border-color:#b9c9d5!important;
        color:#164a9c!important;
      }
      html body.v8.v13.v14[data-page="home"] .vsk-google-review-list{
        border-top-color:#cad6df!important;
        border-bottom-color:#cad6df!important;
      }
      html body.v8.v13.v14[data-page="home"] .vsk-google-review-list article{
        background:#eef3f6!important;
        border-right-color:#cad6df!important;
      }
      html body.v8.v13.v14[data-page="home"] .vsk-google-review-list article>span{color:#1e56aa!important}
      html body.v8.v13.v14[data-page="home"] .vsk-google-review-list article>p{color:#172b3d!important}

      /* The former 9px mono utility tier is now 12px throughout the site. */
      html body.v8.v13.v14 .proof-grid span,
      html body.v8.v13.v14 .customer-row>span,
      html body.v8.v13.v14 .hero-reference span,
      html body.v8.v13.v14 .hero-reference small,
      html body.v8.v13.v14 .hero-reference i,
      html body.v8.v13.v14 .scroll-cue,
      html body.v8.v13.v14 .capability-media figcaption>span,
      html body.v8.v13.v14 .archive-status,
      html body.v8.v13.v14 .archive-status a,
      html body.v8.v13.v14 .archive-row>span,
      html body.v8.v13.v14 .archive-sticky-preview>span,
      html body.v8.v13.v14 .archive-sticky-preview>button,
      html body.v8.v13.v14 .gallery-status,
      html body.v8.v13.v14 .gallery-status a,
      html body.v8.v13.v14 .gallery-load button,
      html body.v8.v13.v14[data-page="home"] .project-collection-head>span{
        font-size:12px!important;
      }
      @media(max-width:720px){
        html body.v8.v13.v14[data-page="home"] .vsk-google-review-list article{border-bottom-color:#cad6df!important}
        html body.v8.v13.v14 .capability-media .vsk-related-projects-cta,
        html body.v8.v13.v14 .capability-media .capability-project-link{width:100%!important;min-width:0!important}
      }
    `;
    document.head.appendChild(style);
  };

  const ensureHarmonyStyles = () => {
    let link = document.querySelector('link[data-v16-site-harmony]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.dataset.v16SiteHarmony = '1';
      link.href = `v16-site-harmony.css?review=${harmonyToken}`;
    }
    document.head.appendChild(link);
    ensureBalanceStyles();
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

  const repositionHomeCompany = () => {
    if (page !== 'home') return;
    const featured = document.querySelector('main#main .projects-showcase#projects');
    const about = document.querySelector('main#main .about#about');
    if (!featured || !about) return;
    if (featured.nextElementSibling !== about) featured.insertAdjacentElement('afterend', about);
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
    script.async = false;
    script.onload = () => {
      ensureHarmonyStyles();
      setTimeout(ensureHarmonyStyles, 80);
      setTimeout(ensureHarmonyStyles, 500);
    };
    document.body.appendChild(script);
  };

  let heroOpeningStarted = false;
  const startHeroOpening = () => {
    if (page !== 'home' || heroOpeningStarted || returningHome) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const hero = document.querySelector('.hero.hero-blue');
    const machineImage = document.querySelector('.hero-board-main img');
    if (!hero) return;

    const begin = () => {
      if (heroOpeningStarted) return;
      heroOpeningStarted = true;
      const root = document.documentElement;
      root.classList.remove('vsk-opening-live');
      root.classList.add('vsk-opening-prep');
      void hero.offsetWidth;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => root.classList.add('vsk-opening-live'));
      });
      setTimeout(() => {
        root.classList.remove('vsk-opening-prep', 'vsk-opening-live');
      }, 2850);
    };

    if (machineImage?.complete) setTimeout(begin, 120);
    else {
      machineImage?.addEventListener('load', () => setTimeout(begin, 80), {once:true});
      setTimeout(begin, 850);
    }
  };

  const apply = () => {
    ensureStyles();
    ensureHarmonyStyles();
    normalizeNavigation();
    repositionHomeCompany();
    normalizeExperienceHero();
    bindExperienceStatus();
    syncExperienceStatus();
    ensureGalleryCategories();
    startHeroOpening();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, {once:true});
  else apply();

  window.addEventListener('load', () => {
    apply();
    startHeroOpening();
    setTimeout(ensureHarmonyStyles, 120);
    setTimeout(ensureHarmonyStyles, 700);
    setTimeout(ensureHarmonyStyles, 1800);
    setTimeout(ensureHarmonyStyles, 3200);
    setTimeout(repositionHomeCompany, 80);
    setTimeout(repositionHomeCompany, 650);
    setTimeout(syncExperienceStatus, 80);
    setTimeout(syncExperienceStatus, 650);
    setTimeout(syncExperienceStatus, 1800);
  }, {once:true});
})();