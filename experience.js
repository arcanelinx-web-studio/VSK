(() => {
  'use strict';
  /* V16 uses the archive browser in app-v14.js as the single owner of Experience.
     This file intentionally stays lightweight so a second filter/render engine does not
     attach duplicate listeners, redraw the same index, or fight the route state. */
  if (document.body.dataset.page !== 'machines') return;
  document.documentElement.dataset.v16ExperienceEngine = 'single';
})();