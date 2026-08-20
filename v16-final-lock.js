(() => {
  'use strict';

  // One-time static stylesheet load. No observers, timers or repeated DOM work.
  if (!document.querySelector('link[data-v16-wide-final]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'v16-wide-final.css?v=16.17';
    link.dataset.v16WideFinal = '';
    document.head.appendChild(link);
  }

  // Keep Mechanical Engineering on one consistent VSK machine-build image
  // before and after capability hover/focus/click interactions.
  const mechanicalImage = 'media/v16/images/new-project/cnc-thread-cutting-machine/20241017-202129.webp';
  const mechanicalAlt = 'VSK CNC thread cutting machine — mechanical engineering and machine build';
  if (typeof capabilityData !== 'undefined' && capabilityData?.mechanical) {
    capabilityData.mechanical.image = mechanicalImage;
    capabilityData.mechanical.alt = mechanicalAlt;
  }

  const initialCapabilityImage = document.querySelector('[data-capability-image]');
  if (initialCapabilityImage) {
    initialCapabilityImage.src = mechanicalImage;
    initialCapabilityImage.alt = mechanicalAlt;
  }

  // Selected Engineering Experience is a curated peer set. Rod Boring already
  // owns Featured Engineering and Kellenberg already owns the dedicated Retrofit
  // chapter, so neither should be duplicated here.
  if (typeof siteProjects !== 'undefined' && Array.isArray(siteProjects)) {
    const preferred = ['zcut', 'vertical', 'jig', 'udrill', 'slotting'];
    const rank = new Map(preferred.map((id, index) => [id, index]));
    siteProjects.sort((a, b) => {
      const ar = rank.has(a.id) ? rank.get(a.id) : preferred.length + 1;
      const br = rank.has(b.id) ? rank.get(b.id) : preferred.length + 1;
      return ar - br;
    });
  }

  // The direct-contact block and footer must expose the same two telephone numbers.
  const contactDirect = document.querySelector('.contact-direct');
  if (contactDirect && !contactDirect.querySelector('a[href="tel:+917353100095"]')) {
    const primary = contactDirect.querySelector('a[href^="tel:"]');
    const secondary = document.createElement('a');
    secondary.href = 'tel:+917353100095';
    secondary.textContent = '+91 73531 00095';
    if (primary?.nextSibling) contactDirect.insertBefore(secondary, primary.nextSibling);
    else contactDirect.appendChild(secondary);
  }
})();
