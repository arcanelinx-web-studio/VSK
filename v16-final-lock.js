(() => {
  'use strict';

  const page = document.body.dataset.page || 'home';

  if (!document.querySelector('link[data-v16-wide-final]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'v16-wide-final.css?v=16.18';
    link.dataset.v16WideFinal = '';
    document.head.appendChild(link);
  }

  // Curated homepage peer set. Rod Boring and Kellenberg already own dedicated features.
  if (typeof siteProjects !== 'undefined' && Array.isArray(siteProjects)) {
    const preferred = ['zcut', 'vertical', 'jig', 'udrill', 'slotting'];
    const rank = new Map(preferred.map((id, index) => [id, index]));
    siteProjects.sort((a, b) => {
      const ar = rank.has(a.id) ? rank.get(a.id) : preferred.length + 1;
      const br = rank.has(b.id) ? rank.get(b.id) : preferred.length + 1;
      return ar - br;
    });
  }

  const mechanicalImage = 'media/v16/images/spm-cnc-machines/transtech-motor-flange-facing-cnc-mc/20230327-120458.webp';
  const mechanicalAlt = 'VSK motor flange facing CNC machine — mechanical engineering and machine build';
  const galleryImage = 'media/v16/images/hydraulic-systems-and-pressing-units/hydraulic-press-transtech-gear/20230216-094310.webp';
  const galleryAlt = 'VSK Transtech Gear hydraulic press engineering project';

  const ensureReviewAuthority = () => {
    document.querySelectorAll('link[data-v16-review-authority]').forEach(link => link.remove());
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'v16-review-authority.css?v=16.23';
    css.dataset.v16ReviewAuthority = '';
    document.head.appendChild(css);
  };

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

  const lockGalleryHeroOnce = () => {
    if (page !== 'gallery') return;
    const image = document.querySelector('.gallery-hero-strip img:last-child');
    if (!image) return;

    const apply = () => {
      if (image.getAttribute('src') !== galleryImage) image.setAttribute('src', galleryImage);
      image.alt = galleryAlt;
      delete image.dataset.galleryHeroSpigot;
      image.dataset.galleryHeroHydraulic = '';
    };

    apply();

    // app.js refreshes Gallery media asynchronously once. Observe only this image's src,
    // restore the curated banner if that refresh replaces it, then disconnect immediately.
    const observer = new MutationObserver(() => {
      if (image.getAttribute('src') !== galleryImage) {
        apply();
        queueMicrotask(() => observer.disconnect());
      }
    });
    observer.observe(image, { attributes: true, attributeFilter: ['src'] });
    setTimeout(() => observer.disconnect(), 6000);
  };

  const ensureRetrofitRoute = () => {
    if (page !== 'machines') return;
    const params = new URLSearchParams(location.search);
    if (params.get('type') !== 'retrofit') return;
    const retrofit = document.querySelector('[data-type-filter="retrofit"]');
    if (retrofit && !retrofit.classList.contains('is-active')) retrofit.click();
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

  const applyAfterScripts = () => {
    ensureReviewAuthority();
    applyMechanicalImage();
    ensureContactNumber();
    lockGalleryHeroOnce();
    ensureRetrofitRoute();
    setTimeout(ensureRetrofitRoute, 700);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(applyAfterScripts), { once: true });
  } else {
    requestAnimationFrame(applyAfterScripts);
  }
})();
