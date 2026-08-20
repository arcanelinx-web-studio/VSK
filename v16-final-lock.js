(() => {
  'use strict';

  const page = document.body.dataset.page || 'home';
  const mechanicalImage = 'media/v16/images/spm-cnc-machines/transtech-motor-flange-facing-cnc-mc/20230327-120458.webp';
  const mechanicalAlt = 'VSK motor flange facing CNC machine — mechanical engineering and machine build';

  /* The final review stylesheet is linked directly in each page head for first-paint stability.
     Only add it here as a fallback for an older bookmark/page that does not contain the link. */
  if (!document.querySelector('link[href^="v16-review-authority.css"]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'v16-review-authority.css?v=16.25';
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
