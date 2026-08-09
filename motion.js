(()=>{
  const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
  if(!$('link[href="styles-v4.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='styles-v4.css';document.head.append(l)}
  const caseSection=$('.case-studies');
  if(!caseSection||$('.motion-section'))return;

  caseSection.insertAdjacentHTML('afterend',`<section class="section motion-section" id="motion"><div class="motion-head"><div data-reveal><div class="section-kicker">05 · VSK IN MOTION</div><h2>Actual machines.<br><span>Actual movement.</span></h2></div><p data-reveal>Motion here comes from the VSK project archive itself. The clips are short, muted derivatives of the supplied machine footage and load only when this section approaches the viewport.</p></div><div class="motion-grid"><article class="motion-card is-paused" data-motion-card><video muted loop playsinline preload="none" poster="media/motion/kellenberg-loop-poster.webp" aria-label="Kellenberg OD grinding retrofit archive clip"><source data-src="media/motion/kellenberg-loop.webm" type="video/webm"><source data-src="media/motion/kellenberg-loop.mp4" type="video/mp4"></video><div class="motion-badge"><i></i>Archive motion reference</div><div class="motion-card__copy"><span>RETROFIT / GRINDING</span><h3>Kellenberg OD Grinding Machine</h3><p>A short motion reference derived from the supplied Kellenberg retrofit folder. It is presented as project evidence, not as stock video.</p></div><button class="motion-toggle" type="button" aria-label="Play Kellenberg machine clip"></button></article><article class="motion-card motion-card--secondary is-paused" data-motion-card><video muted loop playsinline preload="none" poster="media/motion/electric-oven.webp" aria-label="VSK electric oven archive clip"><source data-src="media/motion/electric-oven-loop.webm" type="video/webm"><source data-src="media/motion/electric-oven-loop.mp4" type="video/mp4"></video><div class="motion-badge"><i></i>Archive motion reference</div><div class="motion-card__copy"><span>PROCESS EQUIPMENT</span><h3>Electric Oven</h3><p>Machine footage from the supplied electric-oven archive, used to broaden the site beyond conventional machining equipment.</p></div><button class="motion-toggle" type="button" aria-label="Play electric oven clip"></button></article></div><div class="motion-foot"><div><span>REAL SOURCE</span><strong>Only VSK-supplied footage</strong><small>No stock manufacturing video is used in this section.</small></div><div><span>LIGHTWEIGHT</span><strong>Short web derivatives</strong><small>WebM and MP4 versions are generated from the original MOV files.</small></div><div><span>ACCESSIBLE</span><strong>Motion respects user settings</strong><small>Reduced-motion and data-saving preferences prevent automatic playback.</small></div></div></section>`);

  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData=Boolean(navigator.connection&&navigator.connection.saveData);
  const cards=$$('[data-motion-card]');
  const hydrate=card=>{const video=$('video',card);if(!video||video.dataset.hydrated)return;$$('source[data-src]',video).forEach(source=>{source.src=source.dataset.src});video.dataset.hydrated='true';video.load()};
  const setState=(card,playing)=>{card.classList.toggle('is-paused',!playing);const btn=$('.motion-toggle',card);if(btn)btn.setAttribute('aria-label',(playing?'Pause ':'Play ')+(card===cards[0]?'Kellenberg machine clip':'electric oven clip'))};
  const play=async card=>{const video=$('video',card);if(!video)return;hydrate(card);try{await video.play();setState(card,true)}catch{setState(card,false)}};
  const pause=card=>{const video=$('video',card);video?.pause();setState(card,false)};

  cards.forEach(card=>{$('.motion-toggle',card)?.addEventListener('click',()=>{const video=$('video',card);if(video&&!video.paused)pause(card);else play(card)})});

  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{const card=entry.target;if(entry.isIntersecting){hydrate(card);if(!reduce&&!saveData)play(card)}else pause(card)}),{rootMargin:'220px 0px',threshold:.18});
  cards.forEach(card=>observer.observe(card));

  const labels=[['#retrofit','06 · MACHINE SECOND LIFE'],['.process-section','07 · ENGINEERING FLOW'],['#reviews','08 · CUSTOMER SIGNAL'],['#company','09 · VSK ELECTRO-MECH SOLUTIONS'],['#contact','10 · START WITH THE REQUIREMENT']];
  labels.forEach(([sel,text])=>{const k=$(`${sel} .section-kicker`);if(k)k.textContent=text});

  // The main reveal observer lives in script.js; add a lightweight local one for
  // this late-inserted section so it receives the same visual language.
  const revealIO=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealIO.unobserve(entry.target)}}),{threshold:.14,rootMargin:'0px 0px -4%'});
  $$('[data-reveal]',$('.motion-section')).forEach(el=>revealIO.observe(el));
})();
