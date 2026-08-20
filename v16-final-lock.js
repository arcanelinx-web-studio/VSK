(() => {
  'use strict';

  const page = document.body.dataset.page || 'home';
  const mechanicalImage = 'media/v16/images/spm-cnc-machines/transtech-motor-flange-facing-cnc-mc/20230327-120458.webp';
  const mechanicalAlt = 'VSK motor flange facing CNC machine — mechanical engineering and machine build';

  /* Tiny final spacing adjustment for the Engineering Depth Experience CTA. */
  if (page === 'home' && !document.getElementById('v16-experience-cta-breathing')) {
    const breathing = document.createElement('style');
    breathing.id = 'v16-experience-cta-breathing';
    breathing.textContent = `
      body.v8.v13.v14[data-page="home"] .engineering-depth .archive-callout .btn{
        margin-bottom:14px!important;
      }
    `;
    document.head.appendChild(breathing);
  }

  /* The three polish layers are already imported synchronously by v16-final-lock.css.
     Register matching link elements before app.js runs so it does not append older
     stylesheet versions after first paint. */
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

  /* Fallback only for older pages that do not already link the current review CSS. */
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

  /* Gallery only hides its local filter strip while the five category controls are built.
     This prevents the legacy 34-project control list from flashing; it is not a page loader. */
  if (page === 'gallery') {
    if (!document.getElementById('v16-gallery-first-paint-guard')) {
      const guard = document.createElement('style');
      guard.id = 'v16-gallery-first-paint-guard';
      guard.textContent = `
        body.v8.v13.v14[data-page="gallery"] .gallery-controls{
          min-height:146px!important;
          visibility:hidden!important;
          opacity:0!important;
          pointer-events:none!important;
        }
        body.v8.v13.v14[data-page="gallery"].gallery-categories-ready .gallery-controls{
          visibility:visible!important;
          opacity:1!important;
          pointer-events:auto!important;
          transition:opacity .16s ease!important;
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

  const ensureRetrofitRoute = () => {
    if (page !== 'machines') return;
    const params = new URLSearchParams(location.search);
    if (params.get('type') !== 'retrofit') return;
    const retrofit = document.querySelector('[data-type-filter="retrofit"]');
    if (retrofit && !retrofit.classList.contains('is-active')) retrofit.click();
  };

  const apply = () => {
    applyMechanicalImage();
    ensureContactNumber();
    ensureRetrofitRoute();
  };

  apply();
  document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(apply), { once: true });
  window.addEventListener('load', () => {
    apply();
    setTimeout(ensureRetrofitRoute, 450);
  }, { once: true });
})();
