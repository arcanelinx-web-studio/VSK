(() => {
  'use strict';

  // One-time static stylesheet load. No observers, timers or repeated DOM work.
  if (!document.querySelector('link[data-v16-wide-final]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'v16-wide-final.css?v=16.15';
    link.dataset.v16WideFinal = '';
    document.head.appendChild(link);
  }

  // Replace the weak Mechanical Engineering close-up with a real VSK machine build.
  const mechanicalImage = 'media/v16/images/new-project/cnc-thread-cutting-machine/20241017-202129.webp';
  if (typeof capabilityData !== 'undefined' && capabilityData?.mechanical) {
    capabilityData.mechanical.image = mechanicalImage;
    capabilityData.mechanical.alt = 'VSK CNC thread cutting machine — mechanical engineering and machine build';
  }

  const initialCapabilityImage = document.querySelector('[data-capability-image]');
  if (initialCapabilityImage) {
    initialCapabilityImage.src = mechanicalImage;
    initialCapabilityImage.alt = 'VSK CNC thread cutting machine — mechanical engineering and machine build';
  }
})();
