(() => {
  'use strict';

  const page = document.body?.dataset?.page || '';
  const root = document.documentElement;

  const removeLegacyBalance = () => {
    document.getElementById('v16-user-balance-authority')?.remove();
  };

  const keepLegacyBalanceOut = () => {
    removeLegacyBalance();
    if (root.dataset.v16LegacyBalanceGuard) return;
    root.dataset.v16LegacyBalanceGuard = '1';
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node?.id === 'v16-user-balance-authority') node.remove();
        }
      }
    });
    observer.observe(document.head, {childList:true});
  };

  const keepClientFinalLast = () => {
    if (page !== 'home') return Promise.resolve();
    let link = document.querySelector('link[data-v16-client-final],link[href^="v16-client-final.css"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.dataset.v16ClientFinal = '1';
      link.href = `v16-client-final.css?review=${Date.now()}`;
      document.head.appendChild(link);
      return new Promise(resolve => {
        link.addEventListener('load', resolve, {once:true});
        link.addEventListener('error', resolve, {once:true});
        setTimeout(resolve, 700);
      });
    }
    link.dataset.v16ClientFinal = '1';
    document.head.appendChild(link);
    return Promise.resolve();
  };

  const homeReady = () => {
    if (page !== 'home') return true;
    return !!(
      document.querySelector('.vsk-google-reviews') &&
      document.querySelector('.vsk-selected-track') &&
      document.querySelector('.capability-gallery-cta') &&
      document.querySelector('.featured-case-media img')
    );
  };

  const machinesReady = () => {
    if (page !== 'machines') return true;
    const index = document.querySelector('[data-archive-index]');
    return !!(index && index.children.length);
  };

  const galleryReady = () => {
    if (page !== 'gallery') return true;
    const filters = document.querySelector('[data-gallery-filter-list]');
    const grid = document.querySelector('[data-gallery-grid]');
    return !!((filters && filters.children.length) || (grid && grid.children.length));
  };

  const isReady = () => homeReady() && machinesReady() && galleryReady();

  const reveal = async () => {
    removeLegacyBalance();
    await keepClientFinalLast();
    removeLegacyBalance();
    window.__vskRevealPage?.();
  };

  const revealWhenStable = () => {
    if (isReady()) {
      reveal();
      return;
    }

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      observer.disconnect();
      reveal();
    };

    const observer = new MutationObserver(() => {
      removeLegacyBalance();
      if (isReady()) finish();
    });
    observer.observe(document.body, {subtree:true, childList:true, attributes:false});
    setTimeout(finish, 900);
  };

  keepLegacyBalanceOut();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealWhenStable, {once:true});
  } else {
    revealWhenStable();
  }

  window.addEventListener('load', () => {
    removeLegacyBalance();
    keepClientFinalLast();
    if (isReady()) window.__vskRevealPage?.();
  }, {once:true});

  window.addEventListener('pageshow', event => {
    removeLegacyBalance();
    if (event.persisted) {
      keepClientFinalLast();
      window.__vskRevealPage?.(true);
    }
  });
})();
