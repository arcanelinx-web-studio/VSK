(() => {
  'use strict';
  if (document.body.dataset.page !== 'machines') return;
  document.documentElement.dataset.v16ExperienceEngine = 'single';

  let currentMode = 'related';
  let framePending = false;

  const modeFromText = text => {
    const value = String(text || '').toLowerCase();
    if (/project-specific machine view|belongs to this recorded project|belongs to this recorded project or machine family/.test(value)) return 'exact';
    if (/related vsk engineering work|visual is from related vsk work|same engineering capability area/.test(value)) return 'related';
    return null;
  };

  const resolvePreviewMode = () => {
    const copy = document.querySelector('[data-archive-preview-copy]')?.textContent || '';
    return modeFromText(copy) || currentMode || 'related';
  };

  const syncPreviewBadge = () => {
    const media = document.querySelector('[data-archive-preview-media]');
    if (!media) return;
    currentMode = resolvePreviewMode();
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
    if (!dossier || !media) return;

    const dossierText = dossier.querySelector('[data-dossier-sections]')?.textContent || '';
    const dossierMode = modeFromText(dossierText) || currentMode || 'related';
    currentMode = dossierMode;

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

  const bind = () => {
    sync();
    const preview = document.querySelector('.archive-preview');
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
      if (event.target.closest('[data-archive-preview-open],[data-archive-preview-details],[data-machine-id],[data-machine-open],[data-dossier-next],[data-dossier-prev]')) schedule();
    }, true);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, {once:true});
  else bind();
  window.addEventListener('load', schedule, {once:true});
})();