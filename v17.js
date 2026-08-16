(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.body.classList.add('v17-final');

  // Hero sequencing starts only after the final V17 layer is available.
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('v17-ready')));

  // Current nav semantics.
  $$('.desktop-nav a.is-current').forEach(a => a.setAttribute('aria-current', 'page'));

  // ------------------------------------------------------------------------
  // V17 reveal vocabulary: deliberate variants instead of one repeated reveal.
  // ------------------------------------------------------------------------
  const revealTargets = [
    ['.section-intro', 'v17-reveal-up'],
    ['.featured-case', 'v17-reveal-clip'],
    ['.depth-head', 'v17-reveal-up'],
    ['.depth-grid', 'v17-reveal-up'],
    ['.archive-callout', 'v17-reveal-left'],
    ['.about-v8-grid', 'v17-reveal-up'],
    ['.contact-grid', 'v17-reveal-up'],
    ['.page-hero-copy', 'v17-reveal-up'],
    ['.archive-hero-grid', 'v17-reveal-up'],
    ['.gallery-browser-head', 'v17-reveal-up'],
    ['.gallery-project-group', 'v17-reveal-up']
  ];

  const revealObserver = reduced ? null : new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-v17-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -45px' });

  function registerReveals(root = document) {
    revealTargets.forEach(([selector, cls]) => {
      $$(selector, root).forEach(el => {
        if (el.dataset.v17Reveal) return;
        el.dataset.v17Reveal = '1';
        el.classList.add(cls);
        if (reduced) el.classList.add('is-v17-visible');
        else revealObserver.observe(el);
      });
    });
  }
  registerReveals();

  // ------------------------------------------------------------------------
  // Project cards become compact engineering dossiers.
  // ------------------------------------------------------------------------
  const sanitizeFact = value => String(value || '').replace(/\s+/g, ' ').trim();
  const getFeature = id => (typeof featureData !== 'undefined' && featureData[id]) ? featureData[id] : null;

  function enhanceProjectCards(root = document) {
    $$('[data-feature-open]', root).forEach(card => {
      if (card.dataset.v17Card) return;
      if (!card.matches('.project-card,.project-page-card')) return;
      card.dataset.v17Card = '1';
      const id = card.dataset.featureOpen;
      const data = getFeature(id);
      const copy = $('.project-copy,.project-page-copy', card);
      if (!copy) return;

      if (card.matches('.project-page-card') && data?.facts?.length) {
        const facts = data.facts.slice(0, 2).map(([label, value]) => {
          const text = `${sanitizeFact(label)} · ${sanitizeFact(value)}`;
          return `<span>${text}</span>`;
        }).join('');
        if (facts) copy.insertAdjacentHTML('beforeend', `<div class="v17-card-tech">${facts}</div>`);
      }

      copy.insertAdjacentHTML('beforeend', `<div class="v17-case-action"><span>${card.matches('.project-page-card') ? 'OPEN ENGINEERING CASE' : 'OPEN CASE'}</span><i>→</i></div>`);
    });
  }
  enhanceProjectCards();

  // Project/gallery content is generated dynamically by the V14 runtime.
  const dynamicObserver = new MutationObserver(mutations => {
    if (!mutations.some(m => m.addedNodes.length)) return;
    enhanceProjectCards();
    registerReveals();
  });
  dynamicObserver.observe(document.body, { childList: true, subtree: true });

  // ------------------------------------------------------------------------
  // Precision evidence counters — animate the evidence, not decorative numbers.
  // ------------------------------------------------------------------------
  function animateMetric(el) {
    if (el.dataset.v17Counted) return;
    el.dataset.v17Counted = '1';
    const number = $('.metric-number', el);
    if (!number) return;
    const textNode = [...number.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim());
    if (!textNode) return;
    const raw = textNode.nodeValue.trim();
    const target = Number(raw);
    if (!Number.isFinite(target)) return;
    const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
    if (reduced) { el.classList.add('is-v17-active'); return; }
    const duration = 850;
    const start = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      textNode.nodeValue = `${(target * eased).toFixed(decimals)}`;
      if (p < 1) requestAnimationFrame(tick);
      else { textNode.nodeValue = raw; el.classList.add('is-v17-active'); }
    };
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    const metricObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateMetric(entry.target);
        metricObserver.unobserve(entry.target);
      });
    }, { threshold: .55 });
    $$('.metric-card').forEach(card => metricObserver.observe(card));
  } else {
    $$('.metric-card').forEach(animateMetric);
  }

  // ------------------------------------------------------------------------
  // Process line: the existing bar draws, V17 activates stages in sequence.
  // ------------------------------------------------------------------------
  const process = $('[data-process-track]');
  if (process) {
    const stages = $$('article', process);
    const activate = () => stages.forEach((stage, i) => {
      if (reduced) stage.classList.add('is-v17-stage');
      else setTimeout(() => stage.classList.add('is-v17-stage'), 180 + i * 150);
    });
    if ('IntersectionObserver' in window) {
      const processObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          activate();
          processObserver.disconnect();
        });
      }, { threshold: .35 });
      processObserver.observe(process);
    } else activate();
  }

  // ------------------------------------------------------------------------
  // Requirement wizard active-state polish.
  // ------------------------------------------------------------------------
  $$('.quote-options button').forEach(button => {
    button.addEventListener('click', () => {
      $$('.quote-options button').forEach(b => b.classList.toggle('is-v17-selected', b === button));
    });
  });

  const quotePanel = $('[data-quote-panel]');
  if (quotePanel) {
    const syncQuoteProgress = () => {
      const steps = $$('.quote-step', quotePanel);
      const activeIndex = Math.max(0, steps.findIndex(step => step.classList.contains('is-active')));
      $$('.quote-progress i', quotePanel).forEach((bar, i) => bar.classList.toggle('is-active', i <= activeIndex));
    };
    syncQuoteProgress();
    const quoteObserver = new MutationObserver(syncQuoteProgress);
    quoteObserver.observe(quotePanel, { attributes: true, subtree: true, attributeFilter: ['class'] });
  }

  // ------------------------------------------------------------------------
  // Gallery technical context: project cards remain a consistent 4:3 system.
  // ------------------------------------------------------------------------
  function enhanceGallery() {
    $$('.gallery-project-group').forEach((group, index) => {
      if (group.dataset.v17Gallery) return;
      group.dataset.v17Gallery = '1';
      group.style.setProperty('--v17-group-index', String(index + 1));
      const header = $('header', group);
      const count = $('.gallery-project-media', group)?.children.length || 0;
      const strong = $('header > strong', group);
      if (strong && count) strong.textContent = `${String(count).padStart(2, '0')} MEDIA`;
      header?.setAttribute('aria-label', `Project group ${index + 1}`);
    });
  }
  enhanceGallery();
  const galleryRoot = $('[data-gallery-grid]');
  if (galleryRoot) new MutationObserver(enhanceGallery).observe(galleryRoot, { childList: true, subtree: true });

  // ------------------------------------------------------------------------
  // Metadata / structured data polish. Existing static metadata stays intact;
  // this fills canonical + local organization data without adding a framework.
  // ------------------------------------------------------------------------
  const pageName = document.body.dataset.page || 'home';
  const canonicalPath = pageName === 'home' ? '/' : pageName === 'projects' ? '/projects.html' : pageName === 'gallery' ? '/gallery.html' : '/machines.html';
  if (!$('link[rel="canonical"]')) {
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = `https://arcanelinx-web-studio.github.io/VSK${canonicalPath}`;
    document.head.appendChild(canonical);
  }

  if (pageName === 'home' && !$('script[data-vsk-schema]')) {
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.dataset.vskSchema = '1';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness'],
      name: 'VSK Electro-Mech Solutions',
      foundingDate: '2011',
      description: 'Special purpose machines, CNC retrofit, industrial automation and precision manufacturing from Bengaluru, India.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bengaluru',
        addressRegion: 'Karnataka',
        postalCode: '560058',
        addressCountry: 'IN'
      },
      telephone: '+91-98803-36714',
      email: 'vsk.electromech@gmail.com',
      url: 'https://arcanelinx-web-studio.github.io/VSK/'
    });
    document.head.appendChild(schema);
  }

  // Use the vector favicon when available; keep raster favicon as fallback.
  if (!$('link[href="favicon.svg"]')) {
    const icon = document.createElement('link');
    icon.rel = 'icon';
    icon.href = 'favicon.svg';
    icon.type = 'image/svg+xml';
    document.head.appendChild(icon);
  }
})();
