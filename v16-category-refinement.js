(() => {
  'use strict';
  if (document.body.dataset.page !== 'home') return;

  const categorySpecs = [
    {
      label: 'SPM / CNC Machines',
      slug: 'spm-cnc-machines',
      match: c => /spm/i.test(c) && /cnc/i.test(c) && !/plc|hmi|servo/i.test(c),
      preferred: /twin spindle|u drill/i,
      image: 'media/v16/images/spm-cnc-machines/twin-spindle-u-drill-mc/20240921-125313.webp',
      copy: 'Purpose-built SPM and CNC machine applications engineered around the component, operation, workholding and cycle target.'
    },
    {
      label: 'SPM · PLC / HMI / Servo',
      slug: 'spm-machines-plc-hmi-and-servo-controlled',
      match: c => /plc|hmi|servo/i.test(c),
      preferred: /4 hole drilling|chamfering|pick and place/i,
      image: 'media/v16/images/spm-machines-plc-hmi-and-servo-controlled/4-hole-drilling-and-chamfering-mc-with-auto-comp-pick-and-place-type/20230716-121301.webp',
      copy: 'Machine projects where PLC, HMI, servo motion and control integration are central to the production result.'
    },
    {
      label: 'Hydraulics & Pressing',
      slug: 'hydraulic-systems-and-pressing-units',
      match: c => /hydraulic|pressing/i.test(c),
      preferred: /hydraulic press/i,
      copy: 'Hydraulic systems, pressing units and force-driven applications developed for controlled motion, clamping and process reliability.'
    },
    {
      label: 'Retrofit & CNC',
      slug: 'retrofitting-and-service',
      match: c => /retrofitting|service/i.test(c),
      preferred: /kellenberg|hardinge/i,
      copy: 'Machine reconditioning and CNC retrofit work covering controls, drives, electrical systems and machine-tool recovery.'
    }
  ];

  const firstVisual = group => {
    const items = Array.isArray(group?.items) ? group.items : [];
    const image = items.find(item => item?.type === 'image' && (item.src || item.web || item.thumb));
    if (image) return image.src || image.web || image.thumb;
    const video = items.find(item => item?.type === 'video' && (item.poster || item.thumb));
    return video?.poster || video?.thumb || '';
  };

  const injectStyles = () => {
    document.getElementById('v16-category-refinement-style')?.remove();
    const style = document.createElement('style');
    style.id = 'v16-category-refinement-style';
    style.textContent = `
      body.v8.v13.v14[data-page="home"] .capability-list .capability-row[data-v16-category-row]{text-decoration:none!important}
      body.v8.v13.v14[data-page="home"] .capability-media [data-capability-index]{color:#5f7890!important}
      body.v8.v13.v14[data-page="home"] .capability-media [data-capability-title]{max-width:650px!important}
      body.v8.v13.v14[data-page="home"] .capability-project-link{min-width:210px!important}
      body.v8.v13.v14[data-page="home"] .capability-gallery-gateway{display:none!important}

      /* Gallery gateway: editorial V16 treatment rather than a separate dark banner. */
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta{
        position:relative!important;
        box-sizing:border-box!important;
        width:var(--audit-shell,calc(100% - 80px))!important;
        max-width:none!important;
        min-height:86px!important;
        margin:34px auto 0!important;
        padding:0 18px 0 0!important;
        display:grid!important;
        grid-template-columns:minmax(0,1fr) auto 48px!important;
        align-items:center!important;
        gap:26px!important;
        overflow:hidden!important;
        border:1px solid #c7d2dc!important;
        border-left:4px solid #164a9c!important;
        background:#f7f8f6!important;
        color:#102333!important;
        text-decoration:none!important;
        box-shadow:none!important;
        transition:background .2s ease,border-color .2s ease,transform .2s ease,box-shadow .2s ease!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta::after{
        content:""!important;
        position:absolute!important;
        left:0!important;right:0!important;bottom:0!important;
        height:2px!important;
        background:#164a9c!important;
        transform:scaleX(0)!important;
        transform-origin:left center!important;
        transition:transform .28s ease!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta .gallery-cta-copy{
        min-width:0!important;
        padding:17px 0 17px 24px!important;
        display:grid!important;
        grid-template-columns:170px minmax(0,1fr)!important;
        align-items:center!important;
        gap:24px!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta .gallery-cta-copy small{
        display:block!important;
        color:#164a9c!important;
        font:500 8px/1.3 "IBM Plex Mono",monospace!important;
        letter-spacing:.15em!important;
        text-transform:uppercase!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta .gallery-cta-copy strong{
        display:block!important;
        min-width:0!important;
        color:#102333!important;
        font:600 clamp(16px,1.2vw,20px)/1.15 "Space Grotesk",sans-serif!important;
        letter-spacing:-.025em!important;
        text-transform:none!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta .gallery-cta-meta{
        color:#6b7f91!important;
        white-space:nowrap!important;
        font:500 8px/1.3 "IBM Plex Mono",monospace!important;
        letter-spacing:.11em!important;
        text-transform:uppercase!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta i{
        width:44px!important;
        height:44px!important;
        display:grid!important;
        place-items:center!important;
        justify-self:end!important;
        border:1px solid #b7c6d2!important;
        background:#fff!important;
        color:#164a9c!important;
        font-style:normal!important;
        font-size:18px!important;
        line-height:1!important;
        transition:transform .22s ease,background .2s ease,color .2s ease,border-color .2s ease!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta:hover{
        background:#f0f4f7!important;
        border-color:#9fb6c9!important;
        border-left-color:#164a9c!important;
        transform:translateY(-1px)!important;
        box-shadow:0 12px 28px rgba(16,35,51,.07)!important;
      }
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta:hover::after{transform:scaleX(1)!important}
      body.v8.v13.v14[data-page="home"] .capability-gallery-cta:hover i{
        transform:translateX(6px)!important;
        background:#164a9c!important;
        border-color:#164a9c!important;
        color:#fff!important;
      }

      html body.v8.v13.v14[data-page="home"] .engineering-depth .metric-card{
        padding-left:30px!important;
        padding-right:30px!important;
      }
      html body.v8.v13.v14[data-page="home"] .engineering-depth .archive-callout{
        padding-bottom:60px!important;
      }
      html body.v8.v13.v14[data-page="home"] .engineering-depth .archive-callout .btn{
        margin-bottom:0!important;
      }

      @media (max-width:1599px){
        html body.v8.v13.v14[data-page="home"] .engineering-depth .archive-callout{padding-bottom:56px!important}
      }
      @media (max-width:1180px){
        html body.v8.v13.v14[data-page="home"] .engineering-depth .archive-callout{padding-bottom:50px!important}
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta{grid-template-columns:minmax(0,1fr) 48px!important;gap:16px!important}
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta .gallery-cta-meta{display:none!important}
      }
      @media (max-width:760px){
        html body.v8.v13.v14[data-page="home"] .engineering-depth .metric-card{padding-left:26px!important;padding-right:26px!important}
        html body.v8.v13.v14[data-page="home"] .engineering-depth .archive-callout{padding-bottom:44px!important}
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta{
          width:calc(100% - 40px)!important;
          min-height:78px!important;
          margin-top:24px!important;
          grid-template-columns:minmax(0,1fr) 42px!important;
          gap:10px!important;
          padding-right:12px!important;
        }
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta .gallery-cta-copy{
          grid-template-columns:1fr!important;
          gap:6px!important;
          padding:14px 0 14px 16px!important;
        }
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta .gallery-cta-copy strong{font-size:16px!important}
        body.v8.v13.v14[data-page="home"] .capability-gallery-cta i{width:38px!important;height:38px!important}
      }
    `;
    document.head.appendChild(style);
  };

  const build = manifest => {
    if (!manifest?.groups?.length) return;
    const list = document.querySelector('[data-capability-list]');
    const layout = document.querySelector('.capability-layout');
    const media = document.querySelector('.capability-media');
    if (!list || !layout || !media) return;

    const categories = categorySpecs.map(spec => {
      const groups = manifest.groups.filter(group => spec.match(String(group.category || '')));
      const representative = groups.find(group => spec.preferred.test(`${group.title || ''} ${group.project || ''}`) && firstVisual(group)) || groups.find(firstVisual) || groups[0];
      return { ...spec, groups, representative };
    }).filter(item => item.groups.length);

    const renderCategory = index => {
      const category = categories[index];
      if (!category) return;
      list.querySelectorAll('[data-v16-category-row]').forEach((row, rowIndex) => {
        row.classList.toggle('is-active', rowIndex === index);
        row.setAttribute('aria-pressed', rowIndex === index ? 'true' : 'false');
      });

      const image = media.querySelector('[data-capability-image]');
      const meta = media.querySelector('[data-capability-index]');
      const title = media.querySelector('[data-capability-title]');
      const copy = media.querySelector('[data-capability-copy]');
      const tags = media.querySelector('[data-capability-tags]');
      const visual = category.image || firstVisual(category.representative);

      if (image && visual) {
        image.src = visual;
        image.alt = `${category.label} — VSK Gallery category`;
      }
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

    const renderList = () => {
      list.innerHTML = categories.map((category, index) => `
        <button class="capability-row${index === 0 ? ' is-active' : ''}" type="button" data-v16-category-row="${index}" aria-pressed="${index === 0 ? 'true' : 'false'}">
          <span>${String(index + 1).padStart(2, '0')}</span><strong>${category.label}</strong><i>→</i>
        </button>`).join('');

      list.querySelectorAll('[data-v16-category-row]').forEach(row => {
        const index = Number(row.dataset.v16CategoryRow);
        const select = () => renderCategory(index);
        row.addEventListener('click', select);
        row.addEventListener('mouseenter', select);
        row.addEventListener('focus', select);
      });
    };

    const intro = document.querySelector('.capabilities .section-intro > p');
    if (intro) intro.textContent = 'Choose the Gallery category closest to your requirement, then inspect the actual VSK project groups, machine photographs, videos and engineering details behind it.';

    document.querySelectorAll('.capability-gallery-gateway').forEach(el => el.remove());
    let cta = document.querySelector('.capability-gallery-cta');
    if (!cta) {
      cta = document.createElement('a');
      cta.className = 'capability-gallery-cta';
      cta.href = 'gallery.html';
      layout.insertAdjacentElement('afterend', cta);
    }
    cta.innerHTML = '<span class="gallery-cta-copy"><small>Visual project archive</small><strong>Explore the complete VSK project gallery</strong></span><span class="gallery-cta-meta">Photos · Videos · Machine detail</span><i aria-hidden="true">→</i>';

    renderList();
    renderCategory(0);
    document.body.classList.add('v16-category-refinement-ready');

    const observer = new MutationObserver(() => {
      if (list.querySelectorAll('[data-v16-category-row]').length !== categories.length || list.querySelector('[data-v16-gallery-project]')) {
        renderList();
        renderCategory(0);
      }
      document.querySelectorAll('.capability-gallery-gateway').forEach(el => el.remove());
    });
    observer.observe(list, { childList: true, subtree: false });
    setTimeout(() => observer.disconnect(), 8000);
  };

  injectStyles();
  const start = () => {
    injectStyles();
    fetch('media/archive-manifest.json', { cache: 'no-store' })
      .then(response => response.ok ? response.json() : null)
      .then(manifest => {
        if (!manifest) return;
        build(manifest);
        setTimeout(() => build(manifest), 450);
        setTimeout(() => build(manifest), 1200);
      })
      .catch(() => {});
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
  window.addEventListener('load', injectStyles, { once: true });
})();