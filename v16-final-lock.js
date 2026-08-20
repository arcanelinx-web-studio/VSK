(() => {
  'use strict';

  const page = document.body.dataset.page || 'home';
  const mechanicalImage = 'media/v16/images/spm-cnc-machines/transtech-motor-flange-facing-cnc-mc/20230327-120458.webp';
  const mechanicalAlt = 'VSK motor flange facing CNC machine — mechanical engineering and machine build';

  /* ---------------------------------------------------------
     Smooth boot / page transition.
     Covers legacy static markup until the final V16 runtime is ready.
     --------------------------------------------------------- */
  const bootStyle = document.createElement('style');
  bootStyle.dataset.v16BootStyle = '';
  bootStyle.textContent = `
    #v16-boot-screen{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:linear-gradient(135deg,#0b1723 0%,#10365f 58%,#174f9f 100%);opacity:1;visibility:visible;transition:opacity .28s ease,visibility .28s ease;color:#fff;font-family:Inter,system-ui,sans-serif}
    #v16-boot-screen.is-leaving{opacity:0;visibility:hidden}
    #v16-boot-screen .v16-boot-inner{width:min(560px,calc(100vw - 48px))}
    #v16-boot-screen .v16-boot-brand{display:flex;align-items:center;gap:14px;margin-bottom:32px}
    #v16-boot-screen .v16-boot-mark{width:42px;height:42px;border:1px solid rgba(255,255,255,.42);display:grid;place-items:center;font:600 11px/1 'IBM Plex Mono',monospace;letter-spacing:.08em}
    #v16-boot-screen .v16-boot-brand strong{display:block;font-size:17px;line-height:1.1}
    #v16-boot-screen .v16-boot-brand small{display:block;margin-top:5px;color:#acd7ee;font:500 8px/1.2 'IBM Plex Mono',monospace;letter-spacing:.13em}
    #v16-boot-screen .v16-skeleton{display:grid;gap:11px}
    #v16-boot-screen .v16-skeleton i{display:block;height:9px;background:linear-gradient(90deg,rgba(255,255,255,.08),rgba(117,199,241,.34),rgba(255,255,255,.08));background-size:220% 100%;animation:v16BootSweep 1.35s ease-in-out infinite}
    #v16-boot-screen .v16-skeleton i:nth-child(1){width:82%;height:18px}
    #v16-boot-screen .v16-skeleton i:nth-child(2){width:61%}
    #v16-boot-screen .v16-skeleton i:nth-child(3){width:73%}
    #v16-boot-screen .v16-skeleton i:nth-child(4){width:46%;margin-top:12px}
    @keyframes v16BootSweep{0%{background-position:100% 0}100%{background-position:-110% 0}}
    @media (prefers-reduced-motion:reduce){#v16-boot-screen,#v16-boot-screen .v16-skeleton i{transition:none!important;animation:none!important}}
  `;
  document.head.appendChild(bootStyle);

  const mountBoot = () => {
    let boot = document.getElementById('v16-boot-screen');
    if (boot) {
      boot.classList.remove('is-leaving');
      return boot;
    }
    boot = document.createElement('div');
    boot.id = 'v16-boot-screen';
    boot.setAttribute('aria-hidden','true');
    boot.innerHTML = `<div class="v16-boot-inner"><div class="v16-boot-brand"><span class="v16-boot-mark">VSK</span><span><strong>VSK Electro-Mech Solutions</strong><small>PREPARING ENGINEERING EXPERIENCE</small></span></div><div class="v16-skeleton"><i></i><i></i><i></i><i></i></div></div>`;
    document.body.appendChild(boot);
    return boot;
  };

  const boot = mountBoot();
  const startedAt = performance.now();
  let ready = false;
  const reveal = () => {
    if (ready) return;
    ready = true;
    const minimum = 260;
    const delay = Math.max(0, minimum - (performance.now() - startedAt));
    setTimeout(() => {
      document.body.classList.add('v16-ready');
      boot.classList.add('is-leaving');
      setTimeout(() => boot.remove(), 320);
    }, delay);
  };

  /* Show the transition immediately when navigating to another local page. */
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link || event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;
    const href = link.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
    try {
      const next = new URL(link.href, location.href);
      if (next.origin !== location.origin) return;
      const sameDocument = next.pathname === location.pathname && next.search === location.search;
      if (sameDocument && next.hash) return;
      mountBoot();
    } catch (_) {}
  }, true);

  if (!document.querySelector('link[data-v16-wide-final]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'v16-wide-final.css?v=16.18';
    link.dataset.v16WideFinal = '';
    document.head.appendChild(link);
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

  const ensureReviewAuthority = () => {
    document.querySelectorAll('link[data-v16-review-authority]').forEach(link => link.remove());
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'v16-review-authority.css?v=16.24';
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

  const prepareFinalView = () => {
    ensureReviewAuthority();
    applyMechanicalImage();
    ensureContactNumber();
    ensureRetrofitRoute();
  };

  prepareFinalView();
  document.addEventListener('DOMContentLoaded', () => {
    prepareFinalView();
    requestAnimationFrame(prepareFinalView);
  }, { once:true });

  window.addEventListener('load', () => {
    prepareFinalView();
    setTimeout(() => {
      applyMechanicalImage();
      ensureRetrofitRoute();
      reveal();
    }, 180);
  }, { once:true });

  /* Never leave the user behind the transition if a remote font/media request stalls. */
  setTimeout(() => {
    prepareFinalView();
    reveal();
  }, 2200);
})();
