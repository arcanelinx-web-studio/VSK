(() => {
  'use strict';
  if (document.body.dataset.page !== 'home') return;

  const categorySpecs = [
    {
      label:'SPM / CNC Machines',
      slug:'spm-cnc-machines',
      match:c=>/spm/i.test(c)&&/cnc/i.test(c)&&!/plc|hmi|servo/i.test(c),
      image:'media/v16/images/spm-cnc-machines/twin-spindle-u-drill-mc/20240921-125313.webp',
      copy:'Purpose-built SPM and CNC machine applications engineered around the component, operation, workholding and cycle target.'
    },
    {
      label:'SPM · PLC / HMI / Servo',
      slug:'spm-machines-plc-hmi-and-servo-controlled',
      match:c=>/plc|hmi|servo/i.test(c),
      image:'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/4-hole-drilling-and-chamfering-mc-with-auto-comp-pick-and-place-type/20230716-121301.webp',
      copy:'Machine projects where PLC, HMI, servo motion and control integration are central to the production result.'
    },
    {
      label:'Hydraulics & Pressing',
      slug:'hydraulic-systems-and-pressing-units',
      match:c=>/hydraulic|pressing/i.test(c),
      image:'media/v16/images/hydraulic-systems-and-pressing-units/hydraulic-press-transtech-gear/20230216-094310.webp',
      copy:'Hydraulic systems, pressing units and force-driven applications developed for controlled motion, clamping and process reliability.'
    },
    {
      label:'Retrofit & CNC',
      slug:'retrofitting-and-service',
      match:c=>/retrofitting|service/i.test(c),
      image:'media/v16/images/retrofitting-and-service/hardinge-t40-cnc-machine/20250401-114504.webp',
      copy:'Machine reconditioning and CNC retrofit work covering controls, drives, electrical systems and machine-tool recovery.'
    }
  ];

  const selectedProjects = [
    {
      code:'SPM / 07', family:'CUSTOM & SPM', title:'Vertical Turning CNC Lathe',
      copy:'Vertical CNC turning reference developed around a dedicated PTFE rod application.',
      image:'media/projects/vertical-turning.webp', href:'machines.html?q=Vertical%20Turning'
    },
    {
      code:'RTF / 09', family:'RETROFIT & CNC', title:'Hauser Jig Grinding Retrofit',
      copy:'Five-axis jig-grinding modernization using PLC, HMI and servo motion on three axes.',
      image:'media/v16/images/retrofitting-and-service/jig-grinding-machine/img-0137.webp', href:'machines.html?q=Hauser'
    },
    {
      code:'SPM / DRILLING', family:'CUSTOM & SPM', title:'U Drill Machine',
      copy:'Production-focused special-purpose drilling equipment built around the machining application.',
      image:'media/projects/u-drill.webp', href:'machines.html?q=U%20Drill'
    },
    {
      code:'SPM / 35', family:'PROCESS EQUIPMENT', title:'Paint Agitating Machine',
      copy:'Dedicated process equipment showing VSK engineering beyond conventional CNC machine tools.',
      image:'media/legacy/paint-agitating-machine.webp', href:'machines.html?q=Paint%20Agitating'
    }
  ];

  const injectStyles = () => {
    document.getElementById('v16-category-refinement-style')?.remove();
    const style = document.createElement('style');
    style.id = 'v16-category-refinement-style';
    style.textContent = `
      /* One owner for the Multidisciplinary Engineering section. */
      body.v8.v13.v14[data-page="home"] .capabilities{padding-bottom:92px!important}
      body.v8.v13.v14[data-page="home"] .capability-layout{
        display:grid!important;grid-template-columns:minmax(420px,540px) minmax(0,1fr)!important;
        gap:clamp(54px,5vw,90px)!important;align-items:start!important
      }
      body.v8.v13.v14[data-page="home"] .capability-list{width:100%!important;border-top:1px solid #cbd5df!important}
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row{
        width:100%!important;min-height:72px!important;margin:0!important;padding:0 14px 0 0!important;
        display:grid!important;grid-template-columns:44px minmax(0,1fr) 28px!important;gap:14px!important;align-items:center!important;
        border:0!important;border-bottom:1px solid #cbd5df!important;background:transparent!important;color:#102333!important;text-align:left!important
      }
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row>span{color:#64778a!important;font:500 9px/1 "IBM Plex Mono",monospace!important;letter-spacing:.1em!important}
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row>strong{color:#102333!important;font:500 clamp(18px,1.35vw,24px)/1.14 Inter,sans-serif!important;letter-spacing:-.025em!important}
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row>i{color:#9db1c2!important;font-style:normal!important;font-size:18px!important;transition:transform .18s ease,color .18s ease!important}
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row:hover>strong,
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row.is-active>strong{color:#164a9c!important}
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row:hover>i,
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row.is-active>i{color:#167bc4!important;transform:translateX(4px)!important}
      body.v8.v13.v14[data-page="home"] .capability-media{display:grid!important;width:100%!important;grid-template-rows:390px auto!important;margin:0!important}
      body.v8.v13.v14[data-page="home"] .capability-media .media-frame{width:100%!important;height:390px!important;overflow:hidden!important;background:#e8ecef!important}
      body.v8.v13.v14[data-page="home"] .capability-media .media-frame img{width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important}
      body.v8.v13.v14[data-page="home"] .capability-media figcaption{padding:20px 0 0!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:10px 24px!important;align-items:start!important}
      body.v8.v13.v14[data-page="home"] .capability-media [data-capability-index]{grid-column:1/-1!important;color:#5f7890!important}
      body.v8.v13.v14[data-page="home"] .capability-media [data-capability-title]{grid-column:1!important;max-width:650px!important}
      body.v8.v13.v14[data-page="home"] .capability-media [data-capability-copy]{grid-column:1!important;max-width:650px!important;margin:0!important}
      body.v8.v13.v14[data-page="home"] .capability-media [data-capability-tags]{grid-column:1!important;margin-top:3px!important}
      body.v8.v13.v14[data-page="home"] .capability-project-link{
        grid-column:2!important;grid-row:2/5!important;align-self:start!important;min-width:190px!important;min-height:46px!important;padding:0 14px!important;
        display:flex!important;align-items:center!important;justify-content:space-between!important;gap:16px!important;
        border:1px solid #c6d2dc!important;background:#fff!important;color:#164a9c!important;text-decoration:none!important;
        font:600 9px/1.2 "IBM Plex Mono",monospace!important;letter-spacing:.06em!important;text-transform:uppercase!important
      }

      /* Gallery CTA: return to the compact navy strip, keep the refined hover/arrow behaviour. */
      body.v8.v13.v14[data-page="home"] .capability-gallery-gateway{display:none!important}
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta{
        position:relative!important;box-sizing:border-box!important;width:var(--audit-shell,calc(100% - 80px))!important;max-width:none!important;
        min-height:72px!important;height:72px!important;margin:30px auto 0!important;padding:0 14px 0 22px!important;
        display:grid!important;grid-template-columns:150px minmax(0,1fr) auto 46px!important;gap:24px!important;align-items:center!important;
        overflow:hidden!important;border:1px solid #263b4f!important;background:#0d1b29!important;color:#f5f8fa!important;text-decoration:none!important;
        box-shadow:none!important;transition:background .2s ease,border-color .2s ease,box-shadow .2s ease!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta::before{
        content:""!important;position:absolute!important;left:0!important;top:0!important;bottom:0!important;width:4px!important;background:#1e56aa!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta::after{
        content:""!important;position:absolute!important;left:0!important;right:0!important;bottom:0!important;height:2px!important;background:#248ed0!important;
        transform:scaleX(0)!important;transform-origin:left!important;transition:transform .28s ease!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta .gallery-cta-label{
        color:#7f98ad!important;font:500 8px/1.25 "IBM Plex Mono",monospace!important;letter-spacing:.14em!important;text-transform:uppercase!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta .gallery-cta-title{
        color:#f5f8fa!important;font:600 clamp(15px,1.15vw,18px)/1.15 "Space Grotesk",sans-serif!important;letter-spacing:-.015em!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta .gallery-cta-meta{
        color:#8da2b4!important;white-space:nowrap!important;font:500 8px/1.25 "IBM Plex Mono",monospace!important;letter-spacing:.1em!important;text-transform:uppercase!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta i{
        width:40px!important;height:40px!important;display:grid!important;place-items:center!important;justify-self:end!important;
        border:1px solid #466176!important;background:#10263a!important;color:#9bc8ec!important;font-style:normal!important;font-size:18px!important;
        transition:transform .22s ease,background .2s ease,color .2s ease,border-color .2s ease!important
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta:hover{background:#10263a!important;border-color:#356ead!important;box-shadow:0 12px 28px rgba(13,24,36,.12)!important}
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta:hover::after{transform:scaleX(1)!important}
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta:hover .gallery-cta-title{color:#9fd4f3!important}
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta:hover i{transform:translateX(6px)!important;background:#1e56aa!important;border-color:#1e56aa!important;color:#fff!important}

      /* Selected Engineering Experience: one clean, non-duplicated portfolio row. */
      body.v8.v13.v14[data-page="home"] .selected-projects-strip{padding:68px 0 78px!important}
      body.v8.v13.v14[data-page="home"] .selected-projects-strip .project-grid-editorial{
        display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:1px!important;margin-top:30px!important;
        background:#294057!important;border:1px solid #294057!important
      }
      body.v8.v13.v14[data-page="home"] .v16-selected-card{
        min-width:0!important;background:#101c29!important;color:#fff!important;text-decoration:none!important;display:grid!important;grid-template-rows:210px auto!important;overflow:hidden!important
      }
      body.v8.v13.v14[data-page="home"] .v16-selected-card figure{margin:0!important;height:210px!important;overflow:hidden!important;background:#182738!important}
      body.v8.v13.v14[data-page="home"] .v16-selected-card img{width:100%!important;height:100%!important;object-fit:cover!important;transition:transform .3s ease,filter .3s ease!important}
      body.v8.v13.v14[data-page="home"] .v16-selected-card-copy{min-height:190px!important;padding:24px 24px 22px!important;display:flex!important;flex-direction:column!important}
      body.v8.v13.v14[data-page="home"] .v16-selected-meta{display:flex!important;justify-content:space-between!important;gap:12px!important;color:#7faad4!important;font:500 8px/1.2 "IBM Plex Mono",monospace!important;letter-spacing:.1em!important;text-transform:uppercase!important}
      body.v8.v13.v14[data-page="home"] .v16-selected-card h3{margin:18px 0 10px!important;color:#fff!important;font:600 23px/1.05 "Space Grotesk",sans-serif!important;letter-spacing:-.03em!important}
      body.v8.v13.v14[data-page="home"] .v16-selected-card p{margin:0!important;color:#aab9c6!important;font-size:12.5px!important;line-height:1.55!important}
      body.v8.v13.v14[data-page="home"] .v16-selected-card b{margin-top:auto!important;padding-top:20px!important;color:#8fb8e8!important;font:600 9px/1 "IBM Plex Mono",monospace!important;letter-spacing:.07em!important}
      body.v8.v13.v14[data-page="home"] .v16-selected-card:hover img{transform:scale(1.035)!important;filter:brightness(1.06)!important}
      body.v8.v13.v14[data-page="home"] .v16-selected-card:hover b{color:#fff!important}

      /* Engineering Depth: keep real breathing room under the blue-card CTA. */
      html body.v8.v13.v14[data-page="home"] main#main .engineering-depth .archive-callout{
        height:442px!important;min-height:442px!important;padding-bottom:34px!important
      }
      html body.v8.v13.v14[data-page="home"] main#main .engineering-depth .archive-callout .btn{margin-bottom:0!important}

      @media(max-width:1180px){
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta{grid-template-columns:130px minmax(0,1fr) 44px!important;gap:18px!important}
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta .gallery-cta-meta{display:none!important}
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta i{grid-column:3!important}
        body.v8.v13.v14[data-page="home"] .selected-projects-strip .project-grid-editorial{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      }
      @media(max-width:1050px){
        body.v8.v13.v14[data-page="home"] .capability-layout{grid-template-columns:1fr!important;gap:34px!important}
        body.v8.v13.v14[data-page="home"] .capability-media{grid-template-rows:min(52vw,420px) auto!important}
        body.v8.v13.v14[data-page="home"] .capability-media .media-frame{height:min(52vw,420px)!important}
      }
      @media(max-width:720px){
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta{width:calc(100% - 40px)!important;height:auto!important;min-height:66px!important;grid-template-columns:minmax(0,1fr) 40px!important;gap:12px!important;padding:12px 12px 12px 18px!important}
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta .gallery-cta-label{display:none!important}
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta .gallery-cta-meta{display:none!important}
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta i{grid-column:2!important;width:38px!important;height:38px!important}
        body.v8.v13.v14[data-page="home"] .selected-projects-strip .project-grid-editorial{grid-template-columns:1fr!important}
        body.v8.v13.v14[data-page="home"] .v16-selected-card{grid-template-columns:120px minmax(0,1fr)!important;grid-template-rows:auto!important}
        body.v8.v13.v14[data-page="home"] .v16-selected-card figure{height:100%!important;min-height:180px!important}
      }
    `;
    document.head.appendChild(style);
  };

  const normalizeHomeNavigation = () => {
    const nav = document.querySelector('.desktop-nav');
    if (nav) {
      const custom = [...nav.querySelectorAll('a')].find(a => /custom/i.test(a.textContent || ''));
      if (custom) custom.href = 'machines.html?type=spm';
    }
    const mobile = document.querySelector('[data-mobile-menu] nav');
    if (mobile) {
      const custom = [...mobile.querySelectorAll('a')].find(a => /custom/i.test(a.textContent || ''));
      if (custom) custom.href = 'machines.html?type=spm';
    }
    document.querySelectorAll('a[href="custom-spm.html"]').forEach(a => a.href = 'machines.html?type=spm');
  };

  const firstVisual = group => {
    const items = Array.isArray(group?.items) ? group.items : [];
    const image = items.find(item => item?.type === 'image' && (item.src || item.web || item.thumb));
    return image ? (image.src || image.web || image.thumb) : '';
  };

  const buildCategories = manifest => {
    const list = document.querySelector('[data-capability-list]');
    const layout = document.querySelector('.capability-layout');
    const media = document.querySelector('.capability-media');
    if (!list || !layout || !media) return;

    const categories = categorySpecs.map(spec => {
      const groups = (manifest?.groups || []).filter(group => spec.match(String(group.category || '')));
      return {...spec, groups, fallback: groups.find(firstVisual)};
    });

    const render = index => {
      const category = categories[index];
      if (!category) return;
      list.querySelectorAll('[data-v16-category-row]').forEach((row, i) => {
        row.classList.toggle('is-active', i === index);
        row.setAttribute('aria-pressed', i === index ? 'true' : 'false');
      });
      const image = media.querySelector('[data-capability-image]');
      const meta = media.querySelector('[data-capability-index]');
      const title = media.querySelector('[data-capability-title]');
      const copy = media.querySelector('[data-capability-copy]');
      const tags = media.querySelector('[data-capability-tags]');
      const visual = category.image || firstVisual(category.fallback);
      if (image && visual) { image.src = visual; image.alt = `${category.label} — VSK Gallery category`; }
      if (meta) meta.textContent = `GALLERY CATEGORY · ${category.groups.length} PROJECT GROUP${category.groups.length === 1 ? '' : 'S'}`;
      if (title) title.textContent = category.label;
      if (copy) copy.textContent = category.copy;
      if (tags) tags.innerHTML = `<b>${category.groups.length} PROJECT GROUP${category.groups.length === 1 ? '' : 'S'}</b><b>PHOTOS &amp; VIDEOS</b>`;
      let link = media.querySelector('.capability-project-link');
      if (!link) {
        link = document.createElement('a');
        link.className = 'capability-project-link';
        media.querySelector('figcaption')?.appendChild(link);
      }
      link.href = `gallery.html?category=${encodeURIComponent(category.slug)}`;
      link.innerHTML = '<span>See related projects</span><i>→</i>';
    };

    list.innerHTML = categories.map((category, index) => `
      <button class="capability-row${index === 0 ? ' is-active' : ''}" type="button" data-v16-category-row="${index}" aria-pressed="${index === 0 ? 'true' : 'false'}">
        <span>${String(index + 1).padStart(2,'0')}</span><strong>${category.label}</strong><i>→</i>
      </button>`).join('');
    list.querySelectorAll('[data-v16-category-row]').forEach(row => {
      const index = Number(row.dataset.v16CategoryRow);
      const select = () => render(index);
      row.addEventListener('click', select);
      row.addEventListener('mouseenter', select);
      row.addEventListener('focus', select);
    });

    const intro = document.querySelector('.capabilities .section-intro > p');
    if (intro) intro.textContent = 'Choose the engineering category closest to your requirement, then inspect the actual VSK project groups, machine photographs, videos and engineering detail behind it.';

    let cta = document.querySelector('.capability-gallery-cta');
    if (!cta) {
      cta = document.createElement('a');
      cta.className = 'capability-gallery-cta';
      cta.href = 'gallery.html';
      layout.insertAdjacentElement('afterend', cta);
    }
    cta.href = 'gallery.html';
    cta.innerHTML = '<span class="gallery-cta-label">Project Gallery</span><strong class="gallery-cta-title">Explore the complete VSK project gallery</strong><span class="gallery-cta-meta">Photos · Videos · Machine detail</span><i aria-hidden="true">→</i>';
    render(0);
  };

  const rebuildFeatured = () => {
    const section = document.querySelector('.projects-showcase');
    if (!section) return;
    const mediaButton = section.querySelector('.featured-case-media');
    const image = mediaButton?.querySelector('img');
    const kicker = section.querySelector('.featured-case-copy .kicker');
    const title = section.querySelector('.featured-case-copy h3');
    const copy = section.querySelector('.featured-case-copy > p');
    const facts = section.querySelector('.featured-facts');
    const action = section.querySelector('.featured-case-copy .text-arrow');
    if (image) {
      image.src = 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/air-leak-testing-machine/20230415-191614.webp';
      image.alt = 'VSK air leakage testing machine';
    }
    if (kicker) kicker.textContent = 'SPM / 20 · TESTING & AUTOMATION';
    if (title) title.innerHTML = 'Air Leakage<br>Testing Machine';
    if (copy) copy.textContent = 'A dedicated testing system combining the fixture, pneumatic circuit, Festo servo motion and controlled sequence into one production-ready machine.';
    if (facts) facts.innerHTML = '<span><small>MOTION</small><strong>Festo Servo Unit</strong></span><span><small>SCOPE</small><strong>Fixture + Pneumatic + Control</strong></span><span><small>APPLICATION</small><strong>Air Leakage Testing</strong></span>';

    if (mediaButton) {
      const clean = mediaButton.cloneNode(true);
      clean.removeAttribute('data-feature-open');
      clean.setAttribute('aria-label','Find Air Leakage Testing Machine experience');
      clean.addEventListener('click', () => { location.href = 'machines.html?q=Air%20Leakage'; });
      mediaButton.replaceWith(clean);
    }
    if (action) {
      const clean = action.cloneNode(true);
      clean.removeAttribute('data-feature-open');
      clean.innerHTML = 'Find related experience <span>→</span>';
      clean.addEventListener('click', () => { location.href = 'machines.html?q=Air%20Leakage'; });
      action.replaceWith(clean);
    }
  };

  const removeDuplicateRetrofitSpotlight = () => {
    document.querySelector('.retrofit')?.remove();
  };

  const rebuildSelected = () => {
    const grid = document.querySelector('[data-home-projects]');
    if (!grid) return;
    const expected = selectedProjects.map(item => item.title).join('|');
    if (grid.dataset.v16Selection === expected && grid.querySelectorAll('.v16-selected-card').length === selectedProjects.length) return;
    grid.dataset.v16Selection = expected;
    grid.innerHTML = selectedProjects.map(item => `
      <a class="v16-selected-card" href="${item.href}">
        <figure><img src="${item.image}" alt="${item.title}" loading="lazy"></figure>
        <span class="v16-selected-card-copy">
          <span class="v16-selected-meta"><span>${item.code}</span><span>${item.family}</span></span>
          <h3>${item.title}</h3><p>${item.copy}</p><b>FIND RELATED EXPERIENCE →</b>
        </span>
      </a>`).join('');
  };

  const normalizeCopy = () => {
    const proof = document.querySelector('.proof-grid article:nth-child(3) small');
    if (proof) proof.textContent = '39 Custom & SPM · 15 Retrofit & CNC';
    const split = document.querySelectorAll('.archive-callout-split span');
    if (split[0]) split[0].innerHTML = '<b>39</b> CUSTOM &amp; SPM';
    if (split[1]) split[1].innerHTML = '<b>15</b> RETROFIT &amp; CNC';
    const callout = document.querySelector('.archive-callout > p');
    if (callout) callout.textContent = 'Search 39 Custom & SPM and 15 Retrofit & CNC references by process, machine type, customer need or control platform before you start the discussion.';
  };

  const applyStatic = () => {
    injectStyles();
    normalizeHomeNavigation();
    rebuildFeatured();
    removeDuplicateRetrofitSpotlight();
    rebuildSelected();
    normalizeCopy();
  };

  const start = () => {
    applyStatic();
    fetch(`media/archive-manifest.json?review=${Date.now()}`, {cache:'no-store'})
      .then(r => r.ok ? r.json() : null)
      .then(manifest => { buildCategories(manifest || {groups:[]}); applyStatic(); })
      .catch(() => { buildCategories({groups:[]}); applyStatic(); });

    const grid = document.querySelector('[data-home-projects]');
    if (grid && !grid.dataset.v16Observer) {
      grid.dataset.v16Observer = '1';
      const observer = new MutationObserver(rebuildSelected);
      observer.observe(grid,{childList:true});
      setTimeout(() => observer.disconnect(),5000);
    }
    setTimeout(applyStatic,250);
    setTimeout(applyStatic,900);
    setTimeout(applyStatic,1800);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
  window.addEventListener('load',applyStatic,{once:true});
})();