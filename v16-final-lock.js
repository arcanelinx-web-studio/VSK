(() => {
  'use strict';

  const page = document.body.dataset.page || 'home';
  const params = new URLSearchParams(location.search);
  const requestedType = params.get('type');

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
    if (page === 'machines' && requestedType === 'retrofit') return 'retrofit';
    if (page === 'machines' && requestedType === 'spm') return 'spm';
    if (page === 'machines') return 'experience';
    if (page === 'home') return 'home';
    return '';
  };

  const ensureStyles = () => {
    let style = document.getElementById('v16-client-correction-lock');
    if (!style) {
      style = document.createElement('style');
      style.id = 'v16-client-correction-lock';
      document.head.appendChild(style);
    }
    style.textContent = `
      /* Header: restore the V16 visual scale; only tighten spacing enough for the extra route. */
      @media (min-width:1481px){
        body.v8.v13.v14 .site-header,
        body.v8.v13.v14 .site-header.is-solid,
        body.v8.v13.v14 .site-header.is-scrolled{
          grid-template-columns:minmax(330px,1fr) auto 196px!important;
          gap:30px!important;
          padding-inline:40px!important;
        }
        body.v8.v13.v14 .desktop-nav{gap:22px!important}
        body.v8.v13.v14 .desktop-nav a{
          font-size:11px!important;
          letter-spacing:.02em!important;
          font-weight:600!important;
        }
        body.v8.v13.v14 .header-cta{
          width:196px!important;min-width:196px!important;max-width:196px!important;
          padding:0 20px!important;font-size:11px!important;
        }
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
        body.v8.v13.v14 .desktop-nav a{font-size:10.3px!important;letter-spacing:.012em!important;font-weight:600!important}
        body.v8.v13.v14 .header-cta{
          width:176px!important;min-width:176px!important;max-width:176px!important;
          padding:0 14px!important;font-size:10.3px!important;
        }
      }

      /* Multidisciplinary Engineering: balanced two-column project proof, no empty right-hand field. */
      body.v8.v13.v14[data-page="home"] .capabilities{padding-bottom:88px!important}
      body.v8.v13.v14[data-page="home"] .capability-layout{
        display:grid!important;
        grid-template-columns:minmax(420px,540px) minmax(0,1fr)!important;
        gap:clamp(54px,5vw,90px)!important;
        align-items:start!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-list{
        width:100%!important;
        border-top:1px solid #cbd5df!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row{
        width:100%!important;
        min-height:72px!important;
        box-sizing:border-box!important;
        margin:0!important;
        padding:0 14px 0 0!important;
        display:grid!important;
        grid-template-columns:44px minmax(0,1fr) 28px!important;
        align-items:center!important;
        gap:14px!important;
        border:0!important;
        border-bottom:1px solid #cbd5df!important;
        background:transparent!important;
        color:#102333!important;
        text-align:left!important;
        cursor:pointer!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row>span{
        color:#64778a!important;
        font:500 9px/1 "IBM Plex Mono",monospace!important;
        letter-spacing:.1em!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row>strong{
        color:#102333!important;
        font:500 clamp(18px,1.35vw,24px)/1.14 Inter,sans-serif!important;
        letter-spacing:-.025em!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row>i{
        color:#9db1c2!important;
        font-style:normal!important;
        font-size:18px!important;
        transition:transform .18s ease,color .18s ease!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row:hover,
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row.is-active{
        color:#164a9c!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row:hover>strong,
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row.is-active>strong{color:#164a9c!important}
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row:hover>i,
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row.is-active>i{
        color:#167bc4!important;transform:translateX(4px)!important
      }
      body.v8.v13.v14[data-page="home"] .capability-media{
        display:grid!important;
        width:100%!important;
        max-width:none!important;
        justify-self:stretch!important;
        align-self:start!important;
        grid-template-rows:390px auto!important;
        margin:0!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-media .media-frame{
        width:100%!important;
        height:390px!important;
        aspect-ratio:auto!important;
        overflow:hidden!important;
        background:#e8ecef!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-media .media-frame img{
        width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-media figcaption{
        box-sizing:border-box!important;
        padding:22px 0 0!important;
        display:grid!important;
        grid-template-columns:minmax(0,1fr) auto!important;
        column-gap:28px!important;
        row-gap:10px!important;
        align-items:start!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-media figcaption::after{content:none!important;display:none!important}
      body.v8.v13.v14[data-page="home"] .capability-media [data-capability-index]{grid-column:1/-1!important}
      body.v8.v13.v14[data-page="home"] .capability-media [data-capability-title]{
        grid-column:1!important;
        display:block!important;
        max-width:620px!important;
        font-size:clamp(24px,2vw,34px)!important;
        line-height:1.03!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-media [data-capability-copy]{
        grid-column:1!important;
        max-width:650px!important;
        margin:0!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-media [data-capability-tags]{grid-column:1!important;margin-top:3px!important}
      body.v8.v13.v14[data-page="home"] .capability-project-link{
        grid-column:2!important;grid-row:2/5!important;
        align-self:start!important;
        min-width:190px!important;min-height:46px!important;
        padding:0 14px!important;
        display:flex!important;align-items:center!important;justify-content:space-between!important;gap:16px!important;
        border:1px solid #c6d2dc!important;background:#fff!important;color:#164a9c!important;text-decoration:none!important;
        font:600 9px/1.2 "IBM Plex Mono",monospace!important;letter-spacing:.06em!important;text-transform:uppercase!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta{
        box-sizing:border-box!important;
        width:var(--audit-shell,calc(100% - 80px))!important;
        max-width:none!important;
        min-height:62px!important;
        margin:26px auto 0!important;
        padding:0 22px!important;
        display:flex!important;align-items:center!important;justify-content:space-between!important;gap:20px!important;
        border:1px solid #20394e!important;background:#0d1b29!important;color:#f7f8f8!important;text-decoration:none!important;
        font:600 10.5px/1.35 "IBM Plex Mono",monospace!important;letter-spacing:.07em!important;text-transform:uppercase!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta span{display:flex!important;align-items:center!important;gap:16px!important}
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta span::before{
        content:"PROJECT GALLERY"!important;color:#7f98ad!important;font-size:8px!important;letter-spacing:.14em!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta i{
        color:#8fb8e8!important;font-style:normal!important;font-size:17px!important;transition:transform .18s ease!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta:hover{background:#10263a!important;border-color:#356ead!important}
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta:hover i{transform:translateX(5px)!important}
      body.v8.v13.v14[data-page="home"] .engineering-depth .archive-callout .btn{margin-bottom:30px!important}

      @media (max-width:1050px){
        body.v8.v13.v14[data-page="home"] .capability-layout{grid-template-columns:1fr!important;gap:34px!important}
        body.v8.v13.v14[data-page="home"] .capability-media{grid-template-rows:min(52vw,420px) auto!important}
        body.v8.v13.v14[data-page="home"] .capability-media .media-frame{height:min(52vw,420px)!important}
      }
      @media (max-width:720px){
        body.v8.v13.v14[data-page="home"] .capability-list .capability-row{min-height:64px!important;grid-template-columns:34px minmax(0,1fr) 22px!important;gap:10px!important}
        body.v8.v13.v14[data-page="home"] .capability-list .capability-row>strong{font-size:17px!important}
        body.v8.v13.v14[data-page="home"] .capability-media{grid-template-rows:260px auto!important}
        body.v8.v13.v14[data-page="home"] .capability-media .media-frame{height:260px!important}
        body.v8.v13.v14[data-page="home"] .capability-media figcaption{grid-template-columns:1fr!important}
        body.v8.v13.v14[data-page="home"] .capability-project-link{grid-column:1!important;grid-row:auto!important;min-width:0!important;width:100%!important;margin-top:6px!important}
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta{width:calc(100% - 40px)!important;min-height:58px!important;padding:0 15px!important;font-size:9.4px!important}
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta span::before{display:none!important}
      }
    `;
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
      footerEngineering.innerHTML = '<span>Engineering</span><a href="index.html#expertise">Capabilities</a><a href="custom-spm.html">Custom &amp; SPM</a><a href="machines.html?type=retrofit">Retrofit &amp; CNC</a><button type="button" data-quote-open>Discuss a Machine ↗</button>';
    }
  };

  const titleCaseAcronyms = value => String(value || '')
    .replace(/\bCnc\b/gi, 'CNC')
    .replace(/\bPlc\b/gi, 'PLC')
    .replace(/\bHmi\b/gi, 'HMI')
    .replace(/\bSpm\b/gi, 'SPM')
    .replace(/\bVmc\b/gi, 'VMC')
    .replace(/\bHmc\b/gi, 'HMC')
    .replace(/\bHundai\b/gi, 'Hyundai');

  const categoryKey = category => {
    const raw = String(category || '').toLowerCase();
    if (raw.includes('new project')) return 'new';
    if (raw.includes('retrofitting')) return 'retrofit';
    if (raw.includes('hydraulic') || raw.includes('pressing')) return 'hydraulic';
    if (raw.includes('plc') || raw.includes('hmi') || raw.includes('servo')) return 'controls';
    if (raw.includes('spm') && raw.includes('cnc')) return 'spm-cnc';
    return 'other';
  };

  const categorySlug = category => String(category || 'Other')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const categoryLabel = category => {
    const key = categoryKey(category);
    if (key === 'new') return 'New Project';
    if (key === 'spm-cnc') return 'SPM / CNC Machines';
    if (key === 'controls') return 'SPM · PLC / HMI / Servo';
    if (key === 'hydraulic') return 'Hydraulics & Pressing';
    if (key === 'retrofit') return 'Retrofit & CNC';
    return titleCaseAcronyms(category);
  };

  const firstVisual = group => {
    const items = Array.isArray(group?.items) ? group.items : [];
    const image = items.find(item => item?.type === 'image' && (item.src || item.web || item.thumb));
    if (image) return image.src || image.web || image.thumb;
    const video = items.find(item => item?.type === 'video' && (item.poster || item.thumb));
    return video?.poster || video?.thumb || '';
  };

  const chooseRepresentativeProjects = groups => {
    const specs = [
      ['new', /thread cutting/i],
      ['spm-cnc', /rod boring|vertical turning|flange facing|facing/i],
      ['controls', /4\s*servo|slotting/i],
      ['hydraulic', /hydraulic press/i],
      ['retrofit', /kellenberg|hardinge/i]
    ];
    const chosen = [];
    specs.forEach(([key, preferred]) => {
      const pool = groups.filter(group => categoryKey(group.category) === key && firstVisual(group));
      const pick = pool.find(group => preferred.test(`${group.title || ''} ${group.project || ''}`)) || pool[0];
      if (pick && !chosen.includes(pick)) chosen.push(pick);
    });
    if (chosen.length < 5) {
      groups.filter(firstVisual).forEach(group => {
        if (chosen.length < 5 && !chosen.includes(group)) chosen.push(group);
      });
    }
    return chosen.slice(0, 5);
  };

  const renderProjectPreview = (projects, index) => {
    const project = projects[index];
    if (!project) return;

    document.querySelectorAll('[data-v16-gallery-project]').forEach((row, rowIndex) => {
      row.classList.toggle('is-active', rowIndex === index);
      row.setAttribute('aria-pressed', rowIndex === index ? 'true' : 'false');
    });

    const media = document.querySelector('.capability-media');
    if (!media) return;
    const image = media.querySelector('[data-capability-image]');
    const meta = media.querySelector('[data-capability-index]');
    const title = media.querySelector('[data-capability-title]');
    const copy = media.querySelector('[data-capability-copy]');
    const tags = media.querySelector('[data-capability-tags]');
    const visual = firstVisual(project);
    const projectTitle = titleCaseAcronyms(project.title || project.project || 'VSK Project');
    const mediaCount = Array.isArray(project.items) ? project.items.length : 0;
    const galleryHref = `gallery.html?category=${encodeURIComponent(categorySlug(project.category))}`;

    if (image && visual) {
      image.src = visual;
      image.alt = `${projectTitle} — VSK project gallery`;
    }
    if (meta) meta.textContent = `ACTUAL VSK PROJECT · ${categoryLabel(project.category).toUpperCase()}`;
    if (title) title.textContent = projectTitle;
    if (copy) copy.textContent = `This title and media come directly from VSK’s Gallery archive. Open the related Gallery category to inspect the complete project group and additional machine views.`;
    if (tags) tags.innerHTML = `<b>${mediaCount} MEDIA ITEM${mediaCount === 1 ? '' : 'S'}</b><b>PROJECT GALLERY</b>`;

    let link = media.querySelector('.capability-project-link');
    if (!link) {
      link = document.createElement('a');
      link.className = 'capability-project-link';
      link.innerHTML = '<span>Open in Gallery</span><i>→</i>';
      media.querySelector('figcaption')?.appendChild(link);
    }
    link.href = galleryHref;
  };

  const buildHomeProjectSection = manifest => {
    if (page !== 'home' || !manifest?.groups?.length) return;
    const list = document.querySelector('[data-capability-list]');
    const layout = document.querySelector('.capability-layout');
    if (!list || !layout) return;

    const projects = chooseRepresentativeProjects(manifest.groups);
    if (!projects.length) return;

    list.innerHTML = projects.map((project, index) => {
      const title = titleCaseAcronyms(project.title || project.project || `VSK Project ${index + 1}`);
      return `<button class="capability-row${index === 0 ? ' is-active' : ''}" type="button" data-v16-gallery-project="${index}" aria-pressed="${index === 0 ? 'true' : 'false'}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${title}</strong><i>→</i></button>`;
    }).join('');

    const intro = document.querySelector('.capabilities .section-intro > p');
    if (intro) intro.textContent = 'These selected titles come directly from VSK’s Gallery. Each project shows a different combination of mechanical design, CNC / PLC controls, electrical systems, fluid power, automation and manufacturing working together around one production objective.';

    let cta = document.querySelector('.capability-gallery-cta');
    if (!cta) {
      cta = document.createElement('a');
      cta.className = 'capability-gallery-cta';
      cta.href = 'gallery.html';
      cta.innerHTML = '<span>Explore the complete VSK project gallery</span><i>→</i>';
    }
    if (cta.parentElement !== layout.parentElement || cta.previousElementSibling !== layout) layout.insertAdjacentElement('afterend', cta);

    list.querySelectorAll('[data-v16-gallery-project]').forEach(row => {
      const select = () => renderProjectPreview(projects, Number(row.dataset.v16GalleryProject));
      row.addEventListener('click', select);
      row.addEventListener('mouseenter', select);
      row.addEventListener('focus', select);
    });
    renderProjectPreview(projects, 0);
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

  const setupExperienceLabelGuard = () => {
    if (page !== 'machines') return;
    const active = document.querySelector('[data-active-filters]');
    if (active && !active.dataset.v16Guarded) {
      active.dataset.v16Guarded = '1';
      const observer = new MutationObserver(() => normalizeExperienceTaxonomy());
      observer.observe(active, { childList: true, subtree: true, characterData: true });
    }
    document.addEventListener('click', event => {
      if (event.target.closest('[data-type-filter],[data-machine-id],[data-archive-preview-open],[data-dossier-next],[data-dossier-prev]')) {
        setTimeout(normalizeExperienceTaxonomy, 0);
      }
    });
  };

  const ensureExperienceRoute = () => {
    if (page !== 'machines' || !['spm', 'retrofit'].includes(requestedType)) return;
    const target = document.querySelector(`[data-type-filter="${requestedType}"]`);
    if (target && !target.classList.contains('is-active')) target.click();
  };

  const ensureGalleryCategories = () => {
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
      script.src = 'gallery-categories.js?v=16.36';
      script.async = false;
      script.dataset.v16GalleryCategories = '';
      document.body.appendChild(script);
    }
  };

  const apply = () => {
    ensureStyles();
    normalizeNavigation();
    normalizeHomeTaxonomy();
    normalizeExperienceTaxonomy();
    ensureExperienceRoute();
  };

  ensureGalleryCategories();

  document.addEventListener('DOMContentLoaded', () => {
    apply();
    setupExperienceLabelGuard();
    if (page === 'home') {
      fetch('media/archive-manifest.json', { cache: 'no-store' })
        .then(response => response.ok ? response.json() : null)
        .then(buildHomeProjectSection)
        .catch(() => {});
    }
  }, { once: true });

  window.addEventListener('load', () => {
    apply();
    if (page === 'machines') setTimeout(normalizeExperienceTaxonomy, 120);
  }, { once: true });
})();
