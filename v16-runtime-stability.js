(() => {
  'use strict';

  const page = document.body?.dataset?.page || '';
  const root = document.documentElement;
  let visualFrame = 0;

  const setImportant = (el, property, value) => {
    if (el) el.style.setProperty(property, value, 'important');
  };
  const clearInline = (el, ...properties) => {
    if (!el) return;
    properties.forEach(property => el.style.removeProperty(property));
  };

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

  /* Only client-approved corrections live here. This runs after app.js,
     whose older visual-balance observer otherwise writes conflicting inline styles. */
  const enforceApprovedVisuals = () => {
    if (page !== 'home') return;

    /* Proof / credibility band — cool grey-blue only; no geometry changes. */
    const credibility = document.querySelector('main#main > .credibility-band');
    if (credibility) {
      setImportant(credibility, 'background', '#eaf1f5');
      setImportant(credibility, 'background-image', 'none');
      setImportant(credibility, 'border-top-color', '#d3dfe6');
      setImportant(credibility, 'border-bottom-color', '#d3dfe6');
    }

    /* 1 / Featured Engineering — blurred field with the sharp machine exactly centered.
       On desktop the sharp image meets the top and bottom edges of the media field. */
    const media = document.querySelector('.projects-showcase#projects .featured-case-media');
    const machine = media?.querySelector(':scope > img');
    if (media && machine) {
      setImportant(media, 'position', 'relative');
      setImportant(media, 'isolation', 'isolate');
      setImportant(media, 'overflow', 'hidden');
      if (window.matchMedia('(min-width:721px)').matches) {
        setImportant(media, 'padding', '0');
        setImportant(machine, 'position', 'absolute');
        setImportant(machine, 'z-index', '2');
        setImportant(machine, 'top', '0');
        setImportant(machine, 'bottom', '0');
        setImportant(machine, 'left', '50%');
        setImportant(machine, 'right', 'auto');
        setImportant(machine, 'width', 'auto');
        setImportant(machine, 'max-width', '78%');
        setImportant(machine, 'height', '100%');
        setImportant(machine, 'min-height', '100%');
        setImportant(machine, 'max-height', 'none');
        setImportant(machine, 'margin', '0');
        setImportant(machine, 'padding', '0');
        setImportant(machine, 'object-fit', 'contain');
        setImportant(machine, 'object-position', 'center center');
        setImportant(machine, 'transform', 'translateX(-50%)');
        setImportant(machine, 'background', 'transparent');
        setImportant(machine, 'border', '0');
      } else {
        clearInline(machine, 'position','z-index','top','bottom','left','right','width','max-width','height','min-height','max-height','margin','padding','object-fit','object-position','transform','background','border');
        clearInline(media, 'padding');
      }
    }

    /* 2 / Google Reviews — same dark language as the Proven Experience card.
       Preserve the existing review layout; only the palette is changed. */
    const reviews = document.querySelector('.vsk-google-reviews');
    if (reviews) {
      const dark = '#0d1824';
      const panel = '#0f1e2c';
      const line = '#32495d';
      const white = '#f5f8fa';
      const muted = '#a6b6c3';
      const blue = '#2f79d0';
      const cyan = '#6cb7e8';

      setImportant(reviews, 'background', dark);
      setImportant(reviews, 'background-image', 'none');
      setImportant(reviews, 'color', white);
      setImportant(reviews, 'border-top-color', '#294057');
      setImportant(reviews, 'border-bottom-color', '#294057');

      reviews.querySelectorAll(':scope > .shell,.vsk-google-reviews-grid,.vsk-google-reviews-intro,.vsk-google-review-list').forEach(el => {
        setImportant(el, 'background', dark);
        setImportant(el, 'background-image', 'none');
      });

      const kicker = reviews.querySelector('.kicker');
      const title = reviews.querySelector('.vsk-google-reviews-intro h2');
      const titleAccent = reviews.querySelector('.vsk-google-reviews-intro h2 em');
      const introCopy = reviews.querySelector('.vsk-google-reviews-intro > p');
      const rating = reviews.querySelector('.vsk-google-rating');
      const ratingNumber = reviews.querySelector('.vsk-google-rating > strong');
      const stars = reviews.querySelector('.vsk-google-rating b');
      const ratingSmall = reviews.querySelector('.vsk-google-rating small');
      const reviewLink = reviews.querySelector('.vsk-google-reviews-intro > a');
      const list = reviews.querySelector('.vsk-google-review-list');

      setImportant(kicker, 'color', cyan);
      setImportant(title, 'color', white);
      setImportant(titleAccent, 'color', blue);
      setImportant(introCopy, 'color', muted);
      setImportant(rating, 'background', 'transparent');
      setImportant(rating, 'background-image', 'none');
      setImportant(rating, 'border', '0');
      setImportant(rating, 'box-shadow', 'none');
      setImportant(ratingNumber, 'color', blue);
      setImportant(stars, 'color', cyan);
      setImportant(ratingSmall, 'color', muted);
      setImportant(list, 'background', dark);
      setImportant(list, 'border-color', line);
      setImportant(reviewLink, 'background', panel);
      setImportant(reviewLink, 'border-color', '#496176');
      setImportant(reviewLink, 'color', '#7fc3ed');

      reviews.querySelectorAll('.vsk-google-review-list article').forEach(article => {
        setImportant(article, 'background', panel);
        setImportant(article, 'background-image', 'none');
        setImportant(article, 'border-color', line);
        setImportant(article, 'color', white);
        setImportant(article.querySelector(':scope > span'), 'color', cyan);
        setImportant(article.querySelector(':scope > p'), 'color', white);
      });
    }

    /* 3 / Proven Experience — keep the approved larger 14px labels, but regular weight. */
    document.querySelectorAll('.engineering-depth .archive-callout-split span').forEach(label => {
      setImportant(label, 'font-size', '14px');
      setImportant(label, 'font-weight', '400');
    });
    const relevantExperience = document.querySelector('.engineering-depth .archive-callout .btn');
    setImportant(relevantExperience, 'font-size', '14px');
    setImportant(relevantExperience, 'font-weight', '400');
  };

  const scheduleApprovedVisuals = () => {
    if (visualFrame) cancelAnimationFrame(visualFrame);
    visualFrame = requestAnimationFrame(() => {
      visualFrame = 0;
      enforceApprovedVisuals();
    });
  };

  const keepApprovedVisualsStable = () => {
    if (page !== 'home' || root.dataset.v16ApprovedVisualGuard) return;
    root.dataset.v16ApprovedVisualGuard = '1';
    const observer = new MutationObserver(scheduleApprovedVisuals);
    observer.observe(document.body, {subtree:true, childList:true});
    window.addEventListener('resize', scheduleApprovedVisuals, {passive:true});
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
    enforceApprovedVisuals();
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
      scheduleApprovedVisuals();
      if (isReady()) finish();
    });
    observer.observe(document.body, {subtree:true, childList:true, attributes:false});
    setTimeout(finish, 900);
  };

  keepLegacyBalanceOut();
  keepApprovedVisualsStable();
  enforceApprovedVisuals();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealWhenStable, {once:true});
  } else {
    revealWhenStable();
  }

  window.addEventListener('load', () => {
    removeLegacyBalance();
    keepClientFinalLast();
    enforceApprovedVisuals();
    if (isReady()) window.__vskRevealPage?.();
  }, {once:true});

  window.addEventListener('pageshow', event => {
    removeLegacyBalance();
    keepClientFinalLast();
    enforceApprovedVisuals();
    if (event.persisted) window.__vskRevealPage?.(true);
  });
})();