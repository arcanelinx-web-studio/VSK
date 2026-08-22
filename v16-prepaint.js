(() => {
  'use strict';

  const root = document.documentElement;
  const path = location.pathname.replace(/\/+$/,'');
  const isHomePath = /(?:^|\/)index\.html$/i.test(path) || /\/VSK$/i.test(path) || path === '';
  let firstHomeVisit = false;

  try {
    firstHomeVisit = isHomePath && sessionStorage.getItem('vskBootSeen') !== '1';
  } catch (_) {
    firstHomeVisit = false;
  }

  const style = document.createElement('style');
  style.id = 'v16-prepaint-gate';
  style.textContent = `
    html.vsk-page-preparing{background:#eef3f6!important}
    html.vsk-page-preparing body{opacity:0!important;visibility:hidden!important}
    html.vsk-page-ready body{opacity:1!important;visibility:visible!important;transition:opacity .12s ease!important}
    html.vsk-page-ready.vsk-page-no-transition body{transition:none!important}
    @media(prefers-reduced-motion:reduce){html.vsk-page-ready body{transition:none!important}}
  `;
  document.head.appendChild(style);

  if (!firstHomeVisit) root.classList.add('vsk-page-preparing');

  window.__vskRevealPage = (instant = false) => {
    if (instant) root.classList.add('vsk-page-no-transition');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('vsk-page-preparing');
        root.classList.add('vsk-page-ready');
        if (instant) requestAnimationFrame(() => root.classList.remove('vsk-page-no-transition'));
      });
    });
  };

  window.addEventListener('pageshow', event => {
    if (event.persisted) window.__vskRevealPage?.(true);
  });

  /* Fail-safe only: runtime-stability normally reveals much sooner. */
  setTimeout(() => window.__vskRevealPage?.(), 1200);
})();
