(() => {
  'use strict';

  document.body.classList.add('v16-premium');
  const page = document.body.dataset.page || 'home';
  const homeHref = hash => page === 'home' ? hash : `index.html${hash}`;
  const query = new URLSearchParams(location.search);
  const isRetrofitExperience = page === 'machines' && query.get('type') === 'retrofit';

  /* Projects is no longer a customer-facing destination. Preserve old links/bookmarks by
     taking visitors directly to the searchable Experience page. */
  if (page === 'projects') {
    const target = new URL('machines.html', location.href);
    location.replace(target.href);
    return;
  }

  if (!document.querySelector('link[href^="v16.css"]')) {
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'v16.css?v=16.2'; document.head.appendChild(css);
  }
  if (!document.querySelector('link[href^="v16-user-polish.css"]')) {
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'v16-user-polish.css?v=16.6'; document.head.appendChild(css);
  }
  if (!document.querySelector('link[href^="v16-release-polish.css"]')) {
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'v16-release-polish.css?v=16.8'; document.head.appendChild(css);
  }
  if (!document.querySelector('link[href^="v16-corrections.css"]')) {
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'v16-corrections.css?v=16.11'; document.head.appendChild(css);
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
    const groups = input.groups.map(group => {
      const normalized = (group.items || []).map(item => {
        if (!item || item.sourceOnly || item.displayable === false) return null;
        if (item.type === 'image') {
          const src = validPath(validSet, item.src, item.web, item.thumb);
          if (!src || /\.(heic|heif)(?:$|[?#])/i.test(src)) return null;
          return { ...item, src, web: src, thumb: src };
        }
        if (item.type === 'video') {
          const mp4 = validPath(validSet, item.src_mp4), webm = validPath(validSet, item.src_webm), generic = validPath(validSet, item.web, item.src);
          if (!mp4 && !webm && !generic) return null;
          return { ...item, src_mp4: mp4 || undefined, src_webm: webm || undefined, web: generic || mp4 || webm, src: generic || mp4 || webm };
        }
        return null;
      }).filter(Boolean);
      const poster = normalized.find(item => item.type === 'image')?.src || '';
      return { ...group, items: normalized.map(item => item.type === 'video' ? { ...item, thumb: poster || item.thumb || '', poster: poster || item.poster || '' } : item) };
    }).filter(group => group.items.length);
    return {
      ...input,
      groups,
      summary: {
        ...(input.summary || {}),
        groups: groups.length,
        images: groups.reduce((n,g) => n + g.items.filter(i => i.type === 'image').length, 0),
        videos: groups.reduce((n,g) => n + g.items.filter(i => i.type === 'video').length, 0)
      }
    };
  };

  window.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    return nativeFetch(input, init).then(async response => {
      if (!response.ok || !url.includes('media/archive-manifest.json')) return response;
      try {
        const [data, validSet] = await Promise.all([response.clone().json(), validMediaSetPromise]);
        const clean = cleanManifest(data, validSet);
        return new Response(JSON.stringify(clean), { status: response.status, statusText: response.statusText, headers: { 'Content-Type':'application/json', 'Cache-Control':'no-store' } });
      } catch (_) { return response; }
    });
  };

  const navItems = [
    ['Home','index.html',page === 'home'],
    ['Company',homeHref('#about'),false],
    ['Capabilities',homeHref('#expertise'),false],
    ['Retrofit & CNC','machines.html?type=retrofit',isRetrofitExperience],
    ['Experience','machines.html',page === 'machines' && !isRetrofitExperience],
    ['Gallery','gallery.html',page === 'gallery']
  ];

  const header = document.querySelector('[data-header]');
  if (header) header.innerHTML = `
    <a class="brand" href="index.html" aria-label="VSK Electro-Mech Solutions home"><img src="media/brand/vsk-logo.webp" alt="VSK Electro-Mech Solutions logo" width="60" height="60"><span class="brand-copy"><strong>VSK Electro-Mech Solutions</strong><small>Special Purpose Machines · Retrofit · Automation</small></span></a>
    <nav class="desktop-nav" aria-label="Primary navigation">${navItems.map(([label,href,current]) => `<a${current?' class="is-current"':''} href="${href}">${label}</a>`).join('')}</nav>
    <button class="header-cta" type="button" data-quote-open>Discuss a Machine <span>↗</span></button>
    <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" data-menu-toggle><span></span><span></span></button>`;

  const mobile = document.querySelector('[data-mobile-menu]');
  if (mobile) mobile.innerHTML = `<button class="mobile-menu-backdrop" data-menu-close type="button" aria-label="Close navigation"></button><div class="mobile-menu-panel"><div class="mobile-menu-head"><span>Navigate</span><button data-menu-close type="button">Close ×</button></div><nav aria-label="Mobile navigation">${navItems.map(([label,href],i) => `<a href="${href}">${label} <span>${String(i+1).padStart(2,'0')}</span></a>`).join('')}</nav><button class="mobile-menu-cta" type="button" data-quote-open>Discuss a Machine ↗</button></div>`;

  /* Any old static Projects link is intentionally folded into Experience before interaction. */
  document.querySelectorAll('a[href="projects.html"]').forEach(a => { a.href = 'machines.html'; });

  if (typeof capabilityData !== 'undefined') {
    Object.assign(capabilityData.mechanical,{image:'media/legacy/spindle-interface.webp',alt:'Machine-tool spindle and workholding interface',title:'Machine architecture built around your component and operation.',copy:'Structure, mechanisms, fixtures and workholding are developed around the part, process, access, accuracy and cycle target you need.'});
    Object.assign(capabilityData.controls,{image:'media/retrofit/jig-grinding.webp',alt:'Jig grinding machine CNC PLC and HMI retrofit',title:'Controls engineered for the way your machine must actually run.',copy:'CNC, PLC, HMI, servo and drive systems are integrated around sequence, safety, repeatability, diagnostics and operator use.'});
    Object.assign(capabilityData.fluid,{image:'media/v16/images/hydraulic-systems-and-pressing-units/hydraulic-press-transtech-gear/20230216-094120.webp',alt:'VSK hydraulic pressing system',title:'Hydraulic and pneumatic systems sized for the force and motion your process needs.',copy:'Clamping, pressing, testing and machine movement are engineered for dependable force, sequence, response and serviceability.'});
    Object.assign(capabilityData.electrical,{image:'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/control-panel-honning-machine/20250416-215953.webp',alt:'VSK machine control panel and electrical system',title:'Electrical systems designed for reliable operation and easier fault finding.',copy:'Panels, drives, field devices and machine wiring are integrated for clean commissioning, practical diagnostics and maintainable field service.'});
    Object.assign(capabilityData.automation,{image:'media/legacy/centerless-conveyor.webp',alt:'VSK automated conveyor and machine handling system',title:'Automation that improves flow, repeatability and operator efficiency.',copy:'Servo motion, indexing, loading, handling and interlocks are engineered around the required cycle instead of being added after the machine is built.'});
    Object.assign(capabilityData.manufacturing,{image:'media/legacy/metal-facing-machine.webp',alt:'VSK precision metal facing machine',title:'Process knowledge that keeps the machine practical on the shop floor.',copy:'Turning, machining, grinding and finishing experience supports realistic choices in workholding, tooling, access, tolerance and process stability.'});
  }

  const setText = (selector,text) => { const el = document.querySelector(selector); if (el) el.textContent = text; };
  const setHTML = (selector,html) => { const el = document.querySelector(selector); if (el) el.innerHTML = html; };
  const setMeta = (name,content) => { const el = document.querySelector(`meta[name="${name}"]`); if (el) el.content = content; };

  /* One footer source for every page. */
  setText('.footer-brand > p','Special purpose machines, CNC retrofit and automation built around demanding production requirements.');
  setText('.footer-brand small','Machine engineering for new equipment, retrofit and production improvement.');
  const footerButton = document.querySelector('.footer-brand button');
  if (footerButton) footerButton.textContent = 'Discuss a Machine ↗';
  setText('.quote-head h2','Tell us what your machine or production needs to achieve.');
  const footerCols = document.querySelectorAll('.footer-col');
  if (footerCols[0]) footerCols[0].innerHTML = `<span>Explore</span><a href="machines.html">Experience</a><a href="gallery.html">Gallery</a><a href="${homeHref('#about')}">Company</a>`;
  if (footerCols[1]) footerCols[1].innerHTML = `<span>Engineering</span><a href="${homeHref('#expertise')}">Capabilities</a><a href="machines.html?type=retrofit">Retrofit & CNC</a><button type="button" data-quote-open>Discuss a Machine ↗</button>`;
  if (footerCols[2]) footerCols[2].innerHTML = `<span>Contact</span><a href="tel:+919880336714">+91 98803 36714</a><a href="tel:+917353100095">+91 73531 00095</a><a href="mailto:vsk.electromech@gmail.com">vsk.electromech@gmail.com</a><p>Peenya Industrial Area<br>Bengaluru 560058<br>Karnataka, India</p>`;

  if (page === 'home') {
    setText('.hero-blue-copy > p','Bring VSK the part, cycle-time target, tolerance or machine challenge. We develop the mechanics, controls and process around the production result you need — whether that means a purpose-built SPM, automation or a CNC retrofit.');
    const heroSecondary = document.querySelector('.hero-actions .ghost-cta');
    if (heroSecondary) { heroSecondary.href = 'machines.html'; heroSecondary.textContent = 'See relevant experience'; }
    const heroCaption = document.querySelector('.hero-board-main figcaption');
    if (heroCaption) heroCaption.innerHTML = '<span>4-SERVO SLOTTING MACHINE</span><span>APPLICATION-LED SPM</span>';
    const heroTag = document.querySelector('.hero-board-tag');
    if (heroTag) heroTag.innerHTML = '<b>04 SERVO</b> / CUSTOM SPM';

    setText('.capabilities .section-intro > p','One requirement, one engineering team. Mechanical design, controls, electrical systems, fluid power and manufacturing decisions stay aligned to the result your production needs.');
    setText('.projects-showcase .section-intro > p','See how a demanding application becomes a working machine when workholding, mechanism, controls and cycle are engineered together from the start.');

    setText('.project-collection-head span','SELECTED ENGINEERING EXPERIENCE');
    const selectedLink = document.querySelector('.project-collection-head a');
    if (selectedLink) { selectedLink.href = 'machines.html'; selectedLink.textContent = 'Find experience relevant to your requirement →'; }
    const selectedSection = document.querySelector('.selected-projects-strip');
    if (selectedSection) selectedSection.setAttribute('aria-label','Selected VSK engineering experience');

    setText('.engineering-depth .depth-head > p','Three documented figures show the precision and cycle focus VSK works around. Use Experience to find the machine, process or control platform closest to your requirement.');
    setText('.archive-callout .kicker','ENGINEERING EXPERIENCE');
    setText('.archive-callout h3','Search 54 documented machine references.');
    setText('.archive-callout > p','Filter by process, machine type or control platform to find the closest VSK experience.');
    setHTML('.archive-callout .btn','Search Experience <span>→</span>');

    setText('.retrofit-inner > p','Keep a sound mechanical platform productive for longer. VSK combines machine reconditioning with modern CNC, PLC, drive and electrical systems to recover capability, reliability and serviceability.');
    const retrofitAll = document.querySelector('.retrofit-actions a[href*="machines.html"]');
    if (retrofitAll) retrofitAll.innerHTML = 'See retrofit experience <span>↗</span>';
    const retrofitOpen = document.querySelector('.retrofit-actions [data-feature-open]');
    if (retrofitOpen) retrofitOpen.innerHTML = 'See machine details <span>→</span>';

    setText('.process .section-intro > p','From application study to trials and commissioning, the same production target guides machine architecture, controls, build and validation.');
    setText('.about-copy > p','Whether you need a new machine, a difficult retrofit or a production improvement that cannot be solved off the shelf, VSK brings machine-building, controls and machine-tool experience together around your requirement.');
  }

  if (page === 'machines') {
    document.title = isRetrofitExperience ? 'CNC Retrofit & Reconditioning Experience — VSK Electro-Mech Solutions' : 'Engineering Experience — VSK Electro-Mech Solutions';
    setMeta('description',isRetrofitExperience ? 'Explore VSK CNC, PLC, HMI, servo, drive and machine-tool retrofit experience for grinding, turning, machining and other production equipment.' : 'Search VSK machine-building, special purpose machine and CNC retrofit experience by process, machine type, application or control platform.');
    if (isRetrofitExperience) {
      setText('.archive-hero .kicker','CNC RETROFIT & RECONDITIONING');
      setText('.archive-hero-number small','RETROFIT EXPERIENCE');
      setHTML('.archive-hero h1','Recover capability.<br><em>Modernise what is worth keeping.</em>');
      setText('.archive-hero p','Explore VSK retrofit and reconditioning experience across CNC, PLC, HMI, servo, drive and machine-tool systems. Use the index to find comparable work, then open the closest reference for detail.');
    } else {
      setText('.archive-hero .kicker','VSK ENGINEERING EXPERIENCE');
      setText('.archive-hero-number small','SEARCHABLE EXPERIENCE');
      setHTML('.archive-hero h1','Find experience<br><em>close to your requirement.</em>');
      setText('.archive-hero p','Use this structured index to search VSK experience by process, machine type, application or control platform. For photo-first browsing of actual project media, use the Gallery.');
    }
    setText('.archive-search span','Find relevant experience');
    const search = document.querySelector('[data-archive-search]');
    if (search) search.placeholder = 'Machine, process, customer, control…';
    setText('.archive-status a','Browse the Gallery for photos & videos ↗');
    setHTML('.archive-note h2','Found something similar?<br><em>Let’s discuss what you need.</em>');
    setText('.archive-note p','Share your part, target cycle, tolerance, control platform or existing-machine details. VSK can start from comparable experience and focus the discussion on your production objective.');
  }

  if (page === 'gallery') {
    document.title = 'Machine Gallery — VSK Electro-Mech Solutions';
    setMeta('description','Browse actual VSK machine builds, CNC retrofits, fixtures, controls and process equipment through project photos and videos.');
    setText('.gallery-hero-copy .kicker','VSK MACHINE GALLERY');
    setText('.gallery-hero-copy > p','Browse actual VSK machine builds, retrofit work, fixtures, controls and process equipment. Open a group to inspect the workmanship and integration in more detail.');
    setText('.gallery-browser-head > p','Look from the complete machine down to fixtures, mechanisms, control panels and process details to judge how VSK executes real shop-floor engineering.');
    setText('.gallery-status a','Find similar engineering experience →');
    const galleryStatusLink = document.querySelector('.gallery-status a');
    if (galleryStatusLink) galleryStatusLink.href = 'machines.html';
    setHTML('.gallery-policy h2','Seen something relevant?<br><em>Bring us your requirement.</em>');
    setText('.gallery-policy p','Use the Gallery to inspect VSK workmanship, then use Experience to search by machine, process or control platform and start a discussion around your own production need.');
  }

  const mediaMap = {
    kellenberg:'media/v16/images/retrofitting-and-service/kelingberg-od-grinding-machine/img-0017.webp',
    jig:'media/v16/images/retrofitting-and-service/jig-grinding-machine/img-0137.webp',
    rod:'media/v16/images/spm-cnc-machines/rod-boring-machine/1520917541365.webp',
    zcut:'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/z-cut-machine/img-0601.webp',
    slotting:'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/4-servo-seal-slotting-machine/slotting-mc-1.webp',
    airleak:'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/air-leak-testing-machine/20230415-191614.webp',
    paint:'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/paint-aggitating-machine/paint-aggitating-unit.webp',
    udrill:'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/single-spindle-u-drill-machine/img-20170518-210359.webp',
    electric:'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/electric-oven/img-0021.webp'
  };

  const loadOriginal = () => {
    const script = document.createElement('script');
    script.src = 'app-v14.js?v=16.7';
    script.defer = true;
    document.body.appendChild(script);
  };

  Promise.all([
    nativeFetch('media/v16/manifest.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null),
    validMediaSetPromise
  ]).then(([rawManifest,validSet]) => {
    const manifest = cleanManifest(rawManifest,validSet);
    if (typeof siteProjects !== 'undefined') {
      siteProjects.forEach(project => { if (mediaMap[project.id] && (!validSet || validSet.has(mediaMap[project.id]))) project.cover = mediaMap[project.id]; });
      /* Rod Boring is already Featured Engineering; Kellenberg already owns the dedicated retrofit chapter. */
      const kellenbergIndex = siteProjects.findIndex(project => project.id === 'kellenberg');
      if (kellenbergIndex >= 0) siteProjects.push(...siteProjects.splice(kellenbergIndex,1));
    }
    if (typeof featureData !== 'undefined') Object.entries(mediaMap).forEach(([id,src]) => { if (featureData[id] && (!validSet || validSet.has(src))) featureData[id].media = [src,...featureData[id].media.filter(x=>x!==src)]; });
    const galleryHero = document.querySelectorAll('.gallery-hero-strip img');
    [mediaMap.kellenberg,mediaMap.jig,mediaMap.airleak,mediaMap.slotting].filter(src=>src&&(!validSet||validSet.has(src))).forEach((src,i)=>{if(galleryHero[i])galleryHero[i].src=src;});
    const summary = manifest?.summary || {};
    const groups=document.querySelector('[data-gallery-group-count]'),images=document.querySelector('[data-gallery-image-count]'),videos=document.querySelector('[data-gallery-video-count]');
    if(groups&&Number.isFinite(summary.groups))groups.textContent=`${summary.groups} project groups`;
    if(images&&Number.isFinite(summary.images))images.textContent=`${summary.images} images`;
    if(videos&&Number.isFinite(summary.videos))videos.textContent=`${summary.videos} videos`;
  }).catch(()=>{}).finally(loadOriginal);
})();