(() => {
  'use strict';

  // Keep the large-desktop geometry layer. This is static and one-time only.
  if (!document.querySelector('link[data-v16-wide-final]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'v16-wide-final.css?v=16.18';
    link.dataset.v16WideFinal = '';
    document.head.appendChild(link);
  }

  // Curate Selected Engineering Experience before the home cards are rendered.
  // Rod Boring owns Featured Engineering and Kellenberg owns the dedicated Retrofit chapter.
  if (typeof siteProjects !== 'undefined' && Array.isArray(siteProjects)) {
    const preferred = ['zcut', 'vertical', 'jig', 'udrill', 'slotting'];
    const rank = new Map(preferred.map((id, index) => [id, index]));
    siteProjects.sort((a, b) => {
      const ar = rank.has(a.id) ? rank.get(a.id) : preferred.length + 1;
      const br = rank.has(b.id) ? rank.get(b.id) : preferred.length + 1;
      return ar - br;
    });
  }

  const applyAfterApp = () => {
    // This stylesheet is intentionally appended after app.js has injected all historical
    // V16 correction layers. It is therefore the real final authority for Engineering Depth.
    if (!document.querySelector('link[data-v16-engineering-depth-final]')) {
      const depthCss = document.createElement('link');
      depthCss.rel = 'stylesheet';
      depthCss.href = 'v16-engineering-depth-final.css?v=16.19';
      depthCss.dataset.v16EngineeringDepthFinal = '';
      document.head.appendChild(depthCss);
    }

    // Mechanical Engineering: one real VSK machine photograph in the initial state and
    // in every hover/focus/click state. app.js previously reset this after the earlier helper ran.
    const mechanicalImage = 'media/v16/images/spm-cnc-machines/transtech-motor-flange-facing-cnc-mc/20230327-120458.webp';
    const mechanicalAlt = 'VSK motor flange facing CNC machine — mechanical engineering and machine build';
    if (typeof capabilityData !== 'undefined' && capabilityData?.mechanical) {
      capabilityData.mechanical.image = mechanicalImage;
      capabilityData.mechanical.alt = mechanicalAlt;
    }
    const capabilityImage = document.querySelector('[data-capability-image]');
    const mechanicalRow = document.querySelector('[data-capability="mechanical"]');
    if (capabilityImage && mechanicalRow?.classList.contains('is-active')) {
      capabilityImage.src = mechanicalImage;
      capabilityImage.alt = mechanicalAlt;
    }

    // Engineering Depth: use final copy in the DOM itself instead of layering generated text
    // over the old "Recorded ... reference" labels.
    const depthCopy = document.querySelector('.engineering-depth .depth-head > p');
    if (depthCopy) {
      depthCopy.textContent = 'Three measured references show the precision and cycle focus VSK can engineer around. Use Experience to find the machine, process or control platform closest to your requirement.';
    }

    const proofs = {
      zcut: {
        machine: 'Z-CUT MACHINE', value: '0.02', unit: 'mm',
        title: 'Tolerance reference',
        copy: 'A documented application reference showing the level of precision VSK can engineer around.'
      },
      wheel: {
        machine: 'GRINDING WHEEL UNIT', value: '20', unit: 'μm',
        title: 'Alignment reference',
        copy: 'A measured face-out reference used in grinding-wheel alignment and machine setup.'
      },
      facing: {
        machine: 'METAL FACING MACHINE', value: '12', unit: 'sec',
        title: 'Cycle reference',
        copy: 'A recorded production-cycle reference from a dedicated metal-facing application.'
      }
    };

    Object.entries(proofs).forEach(([id, proof]) => {
      const card = document.querySelector(`.engineering-depth .metric-card[data-feature-open="${id}"]`);
      if (!card) return;
      card.setAttribute('aria-label', `${proof.machine}: ${proof.value} ${proof.unit} ${proof.title}`);
      card.innerHTML = `
        <small class="metric-machine">${proof.machine}</small>
        <div class="metric-number">${proof.value}<span>${proof.unit}</span></div>
        <div class="metric-proof"><strong>${proof.title}</strong><p>${proof.copy}</p></div>
        <i aria-hidden="true">↗</i>`;
    });

    const experienceCard = document.querySelector('.engineering-depth .archive-callout');
    if (experienceCard) {
      const kicker = experienceCard.querySelector('.kicker');
      const title = experienceCard.querySelector('h3');
      const copy = experienceCard.querySelector(':scope > p');
      const cta = experienceCard.querySelector('.btn');
      if (kicker) kicker.textContent = 'PROVEN EXPERIENCE';
      if (title) title.textContent = 'Find work relevant to your requirement.';
      if (copy) copy.textContent = 'Search 54 documented VSK references by process, machine type, customer need or control platform before you start the discussion.';
      if (cta) cta.innerHTML = 'Search relevant experience <span>→</span>';
    }

    // The direct contact block and footer should expose both customer contact numbers.
    const contactDirect = document.querySelector('.contact-direct');
    if (contactDirect && !contactDirect.querySelector('a[href="tel:+917353100095"]')) {
      const primary = contactDirect.querySelector('a[href^="tel:"]');
      const secondary = document.createElement('a');
      secondary.href = 'tel:+917353100095';
      secondary.textContent = '+91 73531 00095';
      if (primary?.nextSibling) contactDirect.insertBefore(secondary, primary.nextSibling);
      else contactDirect.appendChild(secondary);
    }
  };

  // Run exactly once after the parser and app.js have completed their synchronous setup.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(applyAfterApp), { once: true });
  } else {
    requestAnimationFrame(applyAfterApp);
  }
})();
