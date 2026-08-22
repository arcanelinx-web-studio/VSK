(() => {
  'use strict';
  if (document.body.dataset.page !== 'machines') return;
  document.documentElement.dataset.v16ExperienceEngine = 'single';

  let currentMode = 'related';
  let framePending = false;
  let quoteType = '';

  const modeFromText = text => {
    const value = String(text || '').toLowerCase();
    if (/project-specific machine view|belongs to this recorded project|belongs to this recorded project or machine family/.test(value)) return 'exact';
    if (/related vsk engineering work|visual is from related vsk work|same engineering capability area/.test(value)) return 'related';
    return null;
  };

  const cleanPreviewCopy = text => String(text || '')
    .replace(/\s*Project-specific machine view\.?\s*$/i, '')
    .replace(/\s*Related VSK engineering work from the same capability is shown for context\.?\s*$/i, '')
    .trim();

  const resolvePreviewMode = () => {
    const copy = document.querySelector('[data-archive-preview-copy]')?.textContent || '';
    return modeFromText(copy) || currentMode || 'related';
  };

  const syncPreviewBadge = () => {
    const media = document.querySelector('[data-archive-preview-media]');
    const copy = document.querySelector('[data-archive-preview-copy]');
    if (!media) return;

    const rawCopy = copy?.textContent || '';
    currentMode = modeFromText(rawCopy) || resolvePreviewMode();

    if (copy) {
      const cleaned = cleanPreviewCopy(rawCopy);
      if (cleaned && cleaned !== rawCopy.trim()) copy.textContent = cleaned;
    }

    let badge = media.querySelector('.vsk-image-source-badge');
    if (!badge) {
      badge = document.createElement('span');
      media.appendChild(badge);
    }
    const label = currentMode === 'exact' ? 'ACTUAL VSK WORK' : 'RELATED VSK WORK';
    const className = `vsk-image-source-badge is-${currentMode}`;
    if (badge.textContent !== label) badge.textContent = label;
    if (badge.className !== className) badge.className = className;
    media.dataset.vskImageSource = currentMode;
  };

  const syncDossierNote = () => {
    const dossier = document.querySelector('[data-dossier]');
    const media = dossier?.querySelector('[data-dossier-media]');
    const sections = dossier?.querySelector('[data-dossier-sections]');
    if (!dossier || !media) return;

    const dossierText = sections?.textContent || '';
    const dossierMode = modeFromText(dossierText) || currentMode || 'related';
    currentMode = dossierMode;

    /* Provenance belongs on the image. Remove the old Machine view article so
       the same related/actual-work message is not repeated in the copy column. */
    sections?.querySelectorAll('article').forEach(article => {
      const heading = article.querySelector('h3')?.textContent?.trim() || '';
      if (/^Machine view$/i.test(heading)) article.remove();
    });

    let note = media.querySelector('.vsk-dossier-image-source');
    if (!note) {
      note = document.createElement('div');
      media.appendChild(note);
    }
    const text = dossierMode === 'exact'
      ? 'Actual VSK work image from this reference.'
      : 'Image from related VSK work — shown as a closely related VSK engineering reference.';
    const className = `vsk-dossier-image-source is-${dossierMode}`;
    if (note.textContent !== text) note.textContent = text;
    if (note.className !== className) note.className = className;
  };

  const sync = () => {
    framePending = false;
    syncPreviewBadge();
    syncDossierNote();
  };

  const schedule = () => {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(sync);
  };

  const copyText = async text => {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.left = '-9999px';
    area.style.top = '0';
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, area.value.length);
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
    area.remove();
    if (!copied) throw new Error('Copy failed');
    return true;
  };

  const enquiryText = () => {
    const form = document.querySelector('[data-quote-form]');
    if (!form) return '';
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const company = String(fd.get('company') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const requirement = String(fd.get('requirement') || '').trim();
    const file = document.querySelector('[data-quote-file]');
    const drawing = file?.files?.[0]?.name || 'No file selected';
    return `VSK Engineering Requirement\n\nType: ${quoteType || 'General Requirement'}\nName: ${name}\nCompany: ${company || '-'}\nEmail: ${email}\nPhone: ${phone}\nDrawing selected: ${drawing}\n\nRequirement:\n${requirement}`;
  };

  const bind = () => {
    sync();
    const preview = document.querySelector('.archive-sticky-preview');
    const dossier = document.querySelector('[data-dossier]');
    if (preview && !preview.dataset.vskProvenanceBound) {
      preview.dataset.vskProvenanceBound = '1';
      new MutationObserver(schedule).observe(preview, {subtree:true, childList:true, characterData:true});
    }
    if (dossier && !dossier.dataset.vskProvenanceBound) {
      dossier.dataset.vskProvenanceBound = '1';
      new MutationObserver(schedule).observe(dossier, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:['hidden','aria-hidden']});
    }

    document.addEventListener('click', event => {
      const typeButton = event.target.closest('[data-type]');
      if (typeButton) quoteType = typeButton.dataset.type || '';

      if (event.target.closest('[data-archive-preview-open],[data-archive-preview-details],[data-machine-id],[data-machine-open],[data-dossier-next],[data-dossier-prev]')) schedule();
    }, true);

    document.addEventListener('click', async event => {
      const button = event.target.closest('[data-copy-enquiry]');
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const original = button.dataset.vskOriginalLabel || button.textContent.trim() || 'Copy details';
      button.dataset.vskOriginalLabel = original;
      const text = enquiryText();
      try {
        await copyText(text);
        button.textContent = 'COPIED ✓';
        button.setAttribute('aria-live', 'polite');
        clearTimeout(button._vskCopyTimer);
        button._vskCopyTimer = setTimeout(() => { button.textContent = original; }, 1700);
      } catch (_) {
        button.textContent = 'COPY FAILED';
        clearTimeout(button._vskCopyTimer);
        button._vskCopyTimer = setTimeout(() => { button.textContent = original; }, 1700);
      }
    }, true);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, {once:true});
  else bind();
  window.addEventListener('load', schedule, {once:true});
})();