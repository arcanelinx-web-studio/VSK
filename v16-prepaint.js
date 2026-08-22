(() => {
  'use strict';

  const root = document.documentElement;
  const path = location.pathname.replace(/\/+$/,'');
  const isHomePath = /(?:^|\/)index\.html$/i.test(path) || /\/VSK$/i.test(path) || path === '';
  let firstHomeVisit = false;
  let returningHome = false;
  let revealPromise = null;

  try {
    const bootSeen = sessionStorage.getItem('vskBootSeen') === '1';
    firstHomeVisit = isHomePath && !bootSeen;
    returningHome = isHomePath && bootSeen;
  } catch (_) {
    firstHomeVisit = isHomePath;
    returningHome = false;
  }

  /* Mark a returning Home visit before any later stylesheet can paint the
     first-visit curtain or the old content gate. */
  if (returningHome) {
    root.classList.add('vsk-returning-session','vsk-page-ready','vsk-page-no-transition');
  }

  const style = document.createElement('style');
  style.id = 'v16-prepaint-gate';
  style.textContent = `
    @keyframes vskNavLoaderSweep{
      0%{background-position:center 0,-52% 100%,center 100%}
      100%{background-position:center 0,152% 100%,center 100%}
    }

    /* Normal navigation loader is for non-home pages only. */
    html.vsk-page-preparing{background:#fbfaf6!important}
    html.vsk-page-preparing body{opacity:0!important;visibility:hidden!important}
    html.vsk-page-preparing::before{
      content:"";position:fixed;inset:0;z-index:2147483646;pointer-events:none;
      background:#fbfaf6;opacity:1;
    }
    html.vsk-page-preparing::after{
      content:"VSK Electro-Mech Solutions";
      position:fixed;z-index:2147483647;left:50%;top:50%;
      width:min(310px,calc(100vw - 48px));min-height:92px;box-sizing:border-box;
      padding:62px 0 16px;transform:translate(-50%,-50%);pointer-events:none;
      color:#102333;font-family:"Space Grotesk",Inter,Arial,sans-serif;font-size:16px;
      font-weight:600;line-height:1.15;letter-spacing:-.02em;text-align:center;white-space:nowrap;
      background-image:url("media/brand/vsk-logo.webp"),linear-gradient(90deg,#1e56aa 0,#1e56aa 100%),linear-gradient(90deg,#d7e1e7 0,#d7e1e7 100%);
      background-repeat:no-repeat;background-position:center 0,-52% 100%,center 100%;
      background-size:48px 48px,34% 2px,100% 1px;
      animation:vskNavLoaderSweep .95s cubic-bezier(.4,0,.2,1) infinite;opacity:1;
    }
    html.vsk-page-preparing.vsk-page-ready body{
      opacity:1!important;visibility:visible!important;transition:opacity .14s ease!important;
    }
    html.vsk-page-preparing.vsk-page-ready::before,
    html.vsk-page-preparing.vsk-page-ready::after{
      opacity:0;transition:opacity .14s ease!important;
    }
    html.vsk-page-ready:not(.vsk-page-preparing) body{opacity:1!important;visibility:visible!important}
    html.vsk-page-ready.vsk-page-no-transition body{transition:none!important}

    /* Returning Home: no navigation loader, no branded boot curtain, no old
       first-paint hold, and no replay of the first-load hero sequence. These
       selectors intentionally outrank the later inline boot stylesheet. */
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"]::before,
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"]::after{
      content:none!important;display:none!important;visibility:hidden!important;
      opacity:0!important;animation:none!important;
    }
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"] > :not(script):not(style){
      animation:none!important;visibility:visible!important;opacity:1!important;
    }
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"] #hero .hero-blue-copy .hero-kicker,
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"] #hero .hero-blue-copy h1 span,
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"] #hero .hero-blue-copy h1 em,
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"] #hero .hero-blue-copy>p,
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"] #hero .hero-blue-copy .hero-actions,
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"] #hero .hero-blue-copy .hero-chips,
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"] #hero .hero-blue-copy .hero-chips span,
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"] #hero .hero-engineering-board,
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"] #hero .hero-board-tag,
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"] #hero .hero-tech-sheet,
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"] #hero .hero-proof-chip,
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"] #hero .hero-board-side-note,
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"] #hero .hero-crosshair{
      animation:none!important;opacity:1!important;
    }
    html.vsk-returning-session.vsk-returning-session body.v8.v13.v14[data-page="home"][data-page="home"] #hero .hero-board-main img{
      animation:none!important;clip-path:none!important;-webkit-mask:none!important;mask:none!important;
    }

    @media(max-width:720px){
      html.vsk-page-preparing::after{
        width:min(270px,calc(100vw - 40px));min-height:84px;padding-top:56px;font-size:14px;
        background-size:44px 44px,34% 2px,100% 1px;
      }
    }
    @media(prefers-reduced-motion:reduce){
      html.vsk-page-preparing::after{animation:none!important;background-position:center 0,center 100%,center 100%!important}
      html.vsk-page-preparing.vsk-page-ready body,
      html.vsk-page-preparing.vsk-page-ready::before,
      html.vsk-page-preparing.vsk-page-ready::after{transition:none!important}
    }
  `;
  document.head.appendChild(style);

  /* Never use the normal navigation loader on Home. */
  if (!isHomePath) root.classList.add('vsk-page-preparing');

  if (returningHome) {
    requestAnimationFrame(() => root.classList.remove('vsk-page-no-transition'));
  }

  const waitForSettledPaint = async () => {
    if (document.fonts?.ready) {
      await Promise.race([
        document.fonts.ready.catch(() => {}),
        new Promise(resolve => setTimeout(resolve, 650))
      ]);
    }
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  };

  window.__vskRevealPage = (instant = false) => {
    /* Home returns are already visible and must never enter the loader path. */
    if (returningHome) {
      root.classList.add('vsk-page-ready');
      root.classList.remove('vsk-page-preparing');
      return Promise.resolve();
    }

    if (instant) {
      root.classList.add('vsk-page-no-transition','vsk-page-ready');
      root.classList.remove('vsk-page-preparing');
      requestAnimationFrame(() => root.classList.remove('vsk-page-no-transition'));
      return Promise.resolve();
    }

    if (!root.classList.contains('vsk-page-preparing')) {
      root.classList.add('vsk-page-ready');
      return Promise.resolve();
    }

    if (revealPromise) return revealPromise;
    revealPromise = (async () => {
      await waitForSettledPaint();
      root.classList.add('vsk-page-ready');
      await new Promise(resolve => setTimeout(resolve, 150));
      root.classList.remove('vsk-page-preparing');
    })();
    return revealPromise;
  };

  window.addEventListener('pageshow', event => {
    if (event.persisted) window.__vskRevealPage?.(true);
  });

  /* Fail-safe only: runtime-stability normally reveals much sooner. */
  if (!returningHome && !firstHomeVisit) {
    setTimeout(() => window.__vskRevealPage?.(), 1200);
  }
})();
