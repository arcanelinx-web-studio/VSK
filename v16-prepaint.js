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
    @keyframes vskNavLoaderSweep{
      0%{background-position:center 0,-52% 100%,center 100%}
      100%{background-position:center 0,152% 100%,center 100%}
    }

    html.vsk-page-preparing{
      background:#fbfaf6!important;
    }

    html.vsk-page-preparing body{
      opacity:0!important;
      visibility:hidden!important;
    }

    html.vsk-page-preparing::before{
      content:"";
      position:fixed;
      inset:0;
      z-index:2147483646;
      pointer-events:none;
      background:#fbfaf6;
      opacity:1;
    }

    html.vsk-page-preparing::after{
      content:"VSK Electro-Mech Solutions";
      position:fixed;
      z-index:2147483647;
      left:50%;
      top:50%;
      width:min(310px,calc(100vw - 48px));
      min-height:92px;
      box-sizing:border-box;
      padding:62px 0 16px;
      transform:translate(-50%,-50%);
      pointer-events:none;
      color:#102333;
      font-family:"Space Grotesk",Inter,Arial,sans-serif;
      font-size:16px;
      font-weight:600;
      line-height:1.15;
      letter-spacing:-.02em;
      text-align:center;
      white-space:nowrap;
      background-image:
        url("media/brand/vsk-logo.webp"),
        linear-gradient(90deg,#1e56aa 0,#1e56aa 100%),
        linear-gradient(90deg,#d7e1e7 0,#d7e1e7 100%);
      background-repeat:no-repeat;
      background-position:center 0,-52% 100%,center 100%;
      background-size:48px 48px,34% 2px,100% 1px;
      animation:vskNavLoaderSweep .95s cubic-bezier(.4,0,.2,1) infinite;
      opacity:1;
    }

    html.vsk-page-preparing.vsk-page-ready body{
      opacity:1!important;
      visibility:visible!important;
      transition:opacity .14s ease!important;
    }

    html.vsk-page-preparing.vsk-page-ready::before,
    html.vsk-page-preparing.vsk-page-ready::after{
      opacity:0;
      transition:opacity .14s ease!important;
    }

    html.vsk-page-ready:not(.vsk-page-preparing) body{
      opacity:1!important;
      visibility:visible!important;
    }

    html.vsk-page-ready.vsk-page-no-transition body{
      transition:none!important;
    }

    @media(max-width:720px){
      html.vsk-page-preparing::after{
        width:min(270px,calc(100vw - 40px));
        min-height:84px;
        padding-top:56px;
        font-size:14px;
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

  if (!firstHomeVisit) root.classList.add('vsk-page-preparing');

  window.__vskRevealPage = (instant = false) => {
    if (!root.classList.contains('vsk-page-preparing')) {
      root.classList.add('vsk-page-ready');
      return;
    }

    if (instant) {
      root.classList.add('vsk-page-no-transition','vsk-page-ready');
      root.classList.remove('vsk-page-preparing');
      requestAnimationFrame(() => root.classList.remove('vsk-page-no-transition'));
      return;
    }

    root.classList.add('vsk-page-ready');
    setTimeout(() => {
      root.classList.remove('vsk-page-preparing');
    }, 150);
  };

  window.addEventListener('pageshow', event => {
    if (event.persisted) window.__vskRevealPage?.(true);
  });

  /* Fail-safe only: runtime-stability normally reveals much sooner. */
  setTimeout(() => window.__vskRevealPage?.(), 1200);
})();
