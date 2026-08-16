(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const manifest = window.__VSK_MANIFEST__ || { groups: [], summary: {} };
  const groups = (manifest.groups || []).filter(g => g.items?.length);
  const page = document.body.dataset.page || 'home';

  const familyMeta = {
    spm: { label: 'SPM & CNC', short: 'SPM / CNC', description: 'Dedicated turning, boring, drilling, cutting and CNC machine platforms built around a defined component or operation.' },
    automation: { label: 'Automation & Control', short: 'Automation', description: 'PLC, HMI and servo-controlled machines for testing, handling, finishing, assembly and dedicated production processes.' },
    retrofit: { label: 'Retrofit & Reconditioning', short: 'Retrofit', description: 'Machine-tool restoration, lifecycle extension and controls modernization across grinding and turning platforms.' },
    hydraulic: { label: 'Hydraulic & Pressing', short: 'Hydraulic', description: 'Hydraulic systems and dedicated pressing equipment engineered around force, workholding and the production sequence.' },
    new: { label: 'New Engineering', short: 'Recent work', description: 'Recent project references that extend VSK’s machine-building and process-engineering portfolio.' }
  };

  function familyFor(group) {
    const cat = `${group.category || ''} ${group.path || ''}`.toLowerCase();
    if (cat.includes('hydraulic')) return 'hydraulic';
    if (cat.includes('retrofit')) return 'retrofit';
    if (cat.includes('new project')) return 'new';
    if (cat.includes('plc') || cat.includes('servo controlled')) return 'automation';
    return 'spm';
  }

  function cleanTitle(value = '') {
    let s = value.replace(/\s+/g, ' ').trim();
    const replacements = [
      [/\bCnc\b/gi, 'CNC'], [/\bPlc\b/gi, 'PLC'], [/\bHmi\b/gi, 'HMI'], [/\bOd\b/g, 'OD'], [/\bId\b/g, 'ID'],
      [/\bVfd\b/gi, 'VFD'], [/\bSpm\b/gi, 'SPM'], [/\bHundai\b/gi, 'Hyundai'], [/\bKelingberg\b/gi, 'Kellenberg'],
      [/\bAggitating\b/gi, 'Agitating'], [/\bMc\b/g, 'Machine']
    ];
    replacements.forEach(([re, v]) => { s = s.replace(re, v); });
    return s.replace(/\b\w/g, c => c.toUpperCase())
      .replace(/\bCnc\b/g, 'CNC').replace(/\bPlc\b/g, 'PLC').replace(/\bHmi\b/g, 'HMI').replace(/\bSpm\b/g, 'SPM')
      .replace(/\bOd\b/g, 'OD').replace(/\bId\b/g, 'ID').replace(/\bVfd\b/g, 'VFD');
  }

  function mediaSrc(item, preferThumb = false) {
    if (!item) return '';
    return preferThumb ? (item.thumb || item.poster || item.web || item.src || '') : (item.web || item.src || item.src_mp4 || item.thumb || item.poster || '');
  }
  function coverFor(group) {
    const image = group?.items?.find(i => i.type === 'image');
    const video = group?.items?.find(i => i.type === 'video' && (i.poster || i.thumb));
    return mediaSrc(image || video, true);
  }
  function mediaCount(group) { return group?.items?.length || 0; }
  function projectUrl(group) { return `project.html?id=${encodeURIComponent(group.id)}`; }

  function findGroup(...terms) {
    const normalized = terms.map(t => t.toLowerCase());
    return groups.find(g => {
      const hay = `${g.id} ${g.title} ${g.project} ${g.path}`.toLowerCase();
      return normalized.every(term => hay.includes(term));
    });
  }

  const deepCaseMatchers = [
    { key:'kellenberg', terms:['kelingberg','grinding'], ref:'RTF / 11', title:'Kellenberg OD Grinding Machine', need:'When a mechanically valuable grinding machine needs a new control path instead of replacement.', response:'Recondition the machine platform and modernize the CNC system so useful machine life can be extended.', facts:[['Control','Fanuc 0i-TF Plus'],['Scope','Reconditioning / retrofit'],['Machine','OD grinding']], engineering:'Machine-tool restoration and control modernization are treated as one lifecycle project rather than separate service activities.' },
    { key:'jig', terms:['jig','grinding'], ref:'RTF / 09', title:'Hauser 5-Axis Jig Grinding Retrofit', need:'Modernize an existing jig-grinding platform while retaining the machine capability worth preserving.', response:'A PLC/HMI retrofit with servo motors applied to three axes of the five-axis jig-grinding platform.', facts:[['Platform','Hauser 5-axis jig grinding'],['Control scope','PLC + HMI'],['Motion scope','Servo motors · 3 axes']], engineering:'Controls, motion and the existing mechanical platform are considered together so modernization supports the original machine function.' },
    { key:'rod', terms:['rod','boring'], ref:'SPM / 09', title:'Rod Boring CNC Machine', need:'Repeatable pre-boring of PTFE tubes without relying on manual positioning for the machining operation.', response:'A dedicated CNC boring platform built around the component and workholding requirement.', facts:[['Control','Siemens 802D · 2 axis'],['Spindle','5 HP · VFD'],['Workholding','250 mm chuck'],['Application','PTFE tube pre-boring'],['Tolerance','±0.1 mm reference']], engineering:'A cast-bed machine architecture, dedicated workholding and CNC motion are combined around the boring process.' },
    { key:'slotting', terms:['4','servo','slotting'], ref:'SPM / 12', title:'4-Servo Seal Slotting Machine', need:'A repeatable seal slotting / notching operation that benefits from coordinated servo motion instead of a manual sequence.', response:'A dedicated multi-servo special-purpose machine family for seal slotting and notching operations.', facts:[['Motion','4-axis servo reference'],['Application','Seal slotting / notching'],['Automation','Auto-loading variant recorded']], engineering:'Mechanical architecture, servo motion and machine sequencing are developed around the seal-processing operation.' },
    { key:'air', terms:['air','leak'], ref:'SPM / 20', title:'Air Leak Testing Machine', need:'A repeatable production-floor leak test with a dedicated fixture, controlled motion and machine sequence.', response:'Testing equipment integrating the fixture, pneumatic system and a Festo servo unit into one dedicated station.', facts:[['Application','Air leakage testing'],['Motion','Festo servo unit'],['Scope','Fixture + pneumatic + control']], engineering:'The test fixture, pneumatics, machine structure and control sequence work as one inspection system.' },
    { key:'zcut', terms:['z','cut'], ref:'ENGINEERING CASE', title:'Z-Cut Machine', need:'A dedicated punching / Z-cut process with a recorded 0.02 mm application tolerance reference.', response:'A custom machine arrangement built around the operation, tooling interface and controlled machine sequence.', facts:[['Tolerance','0.02 mm reference'],['Application','Tercite punching / Z-cut'],['Scope','Custom machine engineering']], engineering:'Workholding, tooling interface, machine structure and process sequence are developed as one production solution.' }
  ];

  const deepCases = deepCaseMatchers.map(meta => ({ ...meta, group: findGroup(...meta.terms) })).filter(x => x.group);
  const deepFor = (group) => deepCases.find(c => c.group.id === group?.id) || null;

  function intentFor(group) {
    const t = `${group.title} ${group.project}`.toLowerCase();
    if (t.includes('rod boring')) return 'Repeatable tube pre-boring with dedicated CNC motion and workholding.';
    if (t.includes('air leak')) return 'Repeatable production-floor leak testing with dedicated machine sequencing.';
    if (t.includes('slotting') || t.includes('notching')) return 'Dedicated seal-processing motion for a defined slotting or notching operation.';
    if (t.includes('kelingberg') || t.includes('kellenberg')) return 'Extend useful grinding-machine life through reconditioning and controls modernization.';
    if (t.includes('jig grinding')) return 'Modernize an existing precision grinding platform while retaining useful mechanical capability.';
    if (t.includes('thread cutting')) return 'Dedicated CNC thread-cutting capability around the component and thread requirement.';
    if (t.includes('hydraulic press')) return 'Dedicated hydraulic pressing capability for a defined production or assembly operation.';
    if (t.includes('facing')) return 'A dedicated facing operation organized around the component, workholding and repeatable machine cycle.';
    if (t.includes('drill')) return 'A dedicated drilling operation developed around part presentation, workholding and repeatability.';
    if (t.includes('scrubbing') || t.includes('painting') || t.includes('spray')) return 'A dedicated finishing process engineered around repeatability, handling and the production sequence.';
    if (familyFor(group) === 'retrofit') return 'Machine lifecycle work focused on restoring useful capability and modernizing the existing asset.';
    if (familyFor(group) === 'automation') return 'A dedicated production process combining machine mechanics with PLC/HMI/servo control.';
    if (familyFor(group) === 'hydraulic') return familyMeta.hydraulic.description;
    return 'A dedicated machine reference developed around a defined production operation.';
  }

  function familyGroups(key) { return groups.filter(g => familyFor(g) === key); }
  function groupRef(group) {
    const index = groups.indexOf(group) + 1;
    return `PRJ / ${String(index).padStart(2,'0')}`;
  }

  function projectCard(group, compact = false) {
    const title = cleanTitle(group.title || group.project);
    const family = familyMeta[familyFor(group)];
    const cover = coverFor(group);
    return `<a class="ia-project-card${compact ? ' is-compact' : ''}" href="${projectUrl(group)}" data-ia-project="${group.id}" data-family="${familyFor(group)}">
      <div class="ia-project-media">${cover ? `<img src="${cover}" alt="${title}" loading="lazy">` : ''}</div>
      <div class="ia-project-copy"><span class="ia-project-meta">${groupRef(group)} · ${family.short}</span><h3>${title}</h3><p>${intentFor(group)}</p><div class="ia-project-action"><span>View project</span><i>→</i></div></div>
    </a>`;
  }

  function featuredCase(caseData) {
    const cover = coverFor(caseData.group);
    return `<a class="ia-featured-case ia-image-reveal" href="${projectUrl(caseData.group)}">${cover ? `<img src="${cover}" alt="${caseData.title}" loading="lazy">` : ''}<div class="ia-featured-case-copy"><span>${caseData.ref} · ${familyMeta[familyFor(caseData.group)].short}</span><h3>${caseData.title}</h3><p>${caseData.need}</p></div></a>`;
  }

  function rewriteFooter() {
    const footer = $('.site-footer');
    if (!footer) return;
    footer.innerHTML = `<div class="shell footer-grid"><div class="footer-brand"><a href="index.html"><img src="media/brand/vsk-logo.webp" width="58" height="58" alt="VSK Electro-Mech Solutions logo"><span><strong>VSK Electro-Mech Solutions</strong><small>Machine engineering from requirement to production.</small></span></a><p>Special purpose machines, controls, retrofit and manufacturing engineering from Peenya, Bengaluru.</p></div><div class="footer-col"><span>Explore</span><a href="company.html">Company</a><a href="solutions.html">Solutions</a><a href="projects.html">Projects</a><a href="experience.html">Experience</a><a href="gallery.html">Gallery</a></div><div class="footer-col"><span>Engineering</span><a href="reconditioning.html">Reconditioning</a><a href="retrofit-cnc.html">Retrofit & CNC</a><a href="solutions.html#automation">Automation</a><a href="solutions.html#manufacturing">Precision Manufacturing</a></div><div class="footer-col"><span>Contact</span><a href="tel:+919880336714">+91 98803 36714</a><a href="mailto:vsk.electromech@gmail.com">vsk.electromech@gmail.com</a><p>Peenya Industrial Area<br>Bengaluru 560058</p></div></div><div class="shell footer-bottom"><span>© 2026 VSK Electro-Mech Solutions</span><span>Peenya · Bengaluru · India</span><a href="#main">Back to top ↑</a></div>`;
  }
  rewriteFooter();

  function rewriteHome() {
    if (page !== 'home') return;
    const kicker = $('.hero-kicker');
    if (kicker) {
      const span = $('span', kicker), b = $('b', kicker);
      if (span) span.textContent = 'Bengaluru · Machine Engineering Since 2011';
      if (b) b.textContent = 'SPM · CNC · AUTOMATION · RETROFIT';
    }
    const title = $('.hero-title');
    if (title) title.innerHTML = '<span>Engineered</span><span>for <em>production.</em></span>';
    const intro = $('.hero-lower p');
    if (intro) intro.textContent = 'Special purpose machines, CNC retrofit, automation and precision manufacturing — developed around the operation, component and production target.';
    const heroButtons = $$('.hero-actions .btn');
    if (heroButtons[0]) heroButtons[0].innerHTML = 'Explore Projects <span>→</span>';
    if (heroButtons[1]) heroButtons[1].innerHTML = 'Discuss a Machine <span>↗</span>';

    const credibility = $('.credibility-band');
    if (credibility && !$('.ia-problem-router')) {
      credibility.insertAdjacentHTML('afterend', `<section class="ia-problem-router"><div class="shell ia-router-head ia-reveal"><div><span>START WITH THE PROBLEM</span><h2>What do you need to solve?</h2></div><p>Start with the production outcome. VSK can connect the requirement to relevant machine-building, control, retrofit or manufacturing experience.</p></div><div class="shell ia-router-grid">
        <a class="ia-route" href="solutions.html#new-machine"><small>01 / NEW MACHINE</small><strong>A component that needs a dedicated operation?</strong><i>↗</i></a>
        <a class="ia-route" href="reconditioning.html"><small>02 / OLD MACHINE</small><strong>A machine worth restoring instead of replacing?</strong><i>↗</i></a>
        <a class="ia-route" href="solutions.html#automation"><small>03 / BOTTLENECK</small><strong>A production step still dependent on manual handling?</strong><i>↗</i></a>
        <a class="ia-route" href="solutions.html#manufacturing"><small>04 / COMPONENT</small><strong>A part that needs repeatable machining or finishing?</strong><i>↗</i></a>
        <a class="ia-route" href="retrofit-cnc.html"><small>05 / CONTROL</small><strong>An obsolete CNC, PLC, HMI or drive system?</strong><i>↗</i></a>
        <a class="ia-route" href="solutions.html#testing"><small>06 / TESTING</small><strong>A process that needs repeatable testing or inspection?</strong><i>↗</i></a>
        <a class="ia-route" href="solutions.html#fluid-power"><small>07 / FLUID POWER</small><strong>A hydraulic or pneumatic machine function?</strong><i>↗</i></a>
        <button class="ia-route" type="button" data-quote-open><small>08 / NOT SURE YET</small><strong>Bring the machine, drawing, component or process.</strong><i>↗</i></button>
      </div></section>`);
    }

    const capIntro = $('.capabilities .section-intro');
    if (capIntro) {
      const p = $('p', capIntro);
      if (p) p.textContent = 'One production requirement can involve the mechanism, workholding, controls, motion, electrical system and manufacturing process. VSK brings those disciplines together so the machine works as one system.';
    }

    const projectIntro = $('.projects-showcase .section-intro');
    if (projectIntro) {
      const h2 = $('h2', projectIntro), p = $('p', projectIntro);
      if (h2) h2.innerHTML = 'See how a requirement<br><em>becomes a working machine.</em>';
      if (p) p.textContent = 'Selected cases show the relationship between the production need, machine architecture, controls and verified engineering details.';
    }

    const rodCase = deepCases.find(c => c.key === 'rod');
    const featured = $('.featured-case');
    if (featured && rodCase) {
      featured.outerHTML = `<div class="shell featured-case reveal"><a class="featured-case-media media-mode-photo" href="${projectUrl(rodCase.group)}"><img alt="${rodCase.title}" loading="lazy" src="${coverFor(rodCase.group)}"></a><div class="featured-case-copy"><span class="kicker light">${rodCase.ref} · CNC APPLICATION</span><h3>${rodCase.title}</h3><p><strong>THE NEED</strong><br>${rodCase.need}</p><div class="featured-facts">${rodCase.facts.slice(0,3).map(([a,b])=>`<span><small>${a}</small><strong>${b}</strong></span>`).join('')}</div><a class="text-arrow light" href="${projectUrl(rodCase.group)}">View the project <span>→</span></a></div></div>`;
    }

    const homeGrid = $('[data-home-projects]');
    if (homeGrid && groups.length) {
      const preferred = [
        findGroup('4','servo','slotting'), findGroup('air','leak'), findGroup('kelingberg','grinding'), findGroup('hydraulic','press'), findGroup('thread','cutting'), findGroup('vertical','turning')
      ].filter(Boolean);
      const unique = [...new Map(preferred.map(g => [g.id,g])).values()].slice(0,6);
      homeGrid.innerHTML = unique.map(group => projectCard(group,true)).join('');
      homeGrid.classList.add('ia-project-grid');
    }

    const depthP = $('.depth-head p');
    if (depthP) depthP.textContent = 'Tolerance, alignment and cycle references turn “precision” into evidence — and each figure leads back to a real engineering reference.';
    const archiveP = $('.archive-callout p');
    if (archiveP) archiveP.textContent = 'Find machines, processes, customers and control-platform experience relevant to your requirement across 39 custom-machine and 15 retrofit references.';

    const retrofitP = $('.retrofit-inner>p');
    if (retrofitP) retrofitP.textContent = 'When the machine is mechanically worth saving, reconditioning and controls modernization can restore useful capability without replacing the complete asset.';

    const processCopy = $('.process .section-intro>p');
    if (processCopy) processCopy.textContent = 'VSK starts with the application, builds the engineering around it, then validates the result on the machine — not on a presentation slide.';
    const processText = [
      ['What does the process need to achieve?'],['How should the machine work?'],['Can it be manufactured and assembled correctly?'],['Can the machine sequence reliably?'],['Does it meet the requirement?'],['Will it work on the production floor?']
    ];
    $$('.process-line article p').forEach((p,i)=>{ if(processText[i]) p.textContent=processText[i][0]; });

    const aboutH = $('.about-copy h2'), aboutP = $('.about-copy>p');
    if (aboutH) aboutH.innerHTML = 'Need a machine builder<br><em>who understands the machine beside it?</em>';
    if (aboutP) aboutP.textContent = 'VSK brings new machine development, CNC/PLC controls, retrofit, field experience and precision manufacturing together under one engineering organization.';
    const aboutActions = $('.about-actions');
    if (aboutActions) aboutActions.innerHTML = '<a class="text-arrow" href="company.html">Company & engineering approach <span>→</span></a><a class="text-arrow" href="experience.html">Explore VSK experience <span>↗</span></a>';

    const contactH = $('.contact-copy h2'), contactP = $('.contact-copy p'), contactMain = $('.contact-main');
    if (contactH) contactH.innerHTML = 'Have a production<br>problem?';
    if (contactP) contactP.textContent = 'Bring the component, machine, drawing or process. VSK can help determine the engineering route and connect it to relevant experience.';
    if (contactMain) contactMain.innerHTML = 'Discuss the Requirement <span>↗</span>';
  }

  function pageHero({eyebrow,title,copy,image,actions=''}) {
    return `<section class="ia-page-hero${image?' has-media':''}">${image?`<div class="ia-page-hero-media ia-image-reveal"><img src="${image}" alt="" fetchpriority="high"></div>`:''}<div class="shell ia-reveal"><span class="ia-eyebrow">${eyebrow}</span><h1>${title}</h1><p>${copy}</p>${actions?`<div class="ia-page-hero-actions">${actions}</div>`:''}</div></section>`;
  }
  const primaryButton = (label,href) => `<a class="btn btn-primary" href="${href}">${label} <span>→</span></a>`;
  const discussButton = (label='Discuss a Machine') => `<button class="btn btn-outline" type="button" data-quote-open>${label} <span>↗</span></button>`;

  function renderProjects() {
    if (page !== 'projects') return;
    const main = $('#main'); if (!main) return;
    const heroGroup = deepCases.find(c=>c.key==='slotting')?.group || groups[0];
    const keys = ['spm','automation','retrofit','hydraulic','new'];
    const familyCards = keys.map((key,i)=>{const meta=familyMeta[key],count=familyGroups(key).length;return `<a class="ia-family ia-reveal" href="#portfolio" data-family-jump="${key}"><small>${String(i+1).padStart(2,'0')} / ENGINEERING FAMILY</small><strong>${meta.label}</strong><p>${meta.description}</p><footer><span>${count} project group${count===1?'':'s'}</span><i>→</i></footer></a>`}).join('');
    main.className='ia-main';
    main.innerHTML = `${pageHero({eyebrow:'PROJECTS · VSK ENGINEERING PORTFOLIO',title:'Machines built around<br>the requirement.',copy:'Explore the strongest cases first, then search the complete project record by machine family, process or application.',image:coverFor(heroGroup),actions:primaryButton('Explore project index','#portfolio')+discussButton()})}
      <section class="ia-section paper"><div class="shell ia-section-head ia-reveal"><div><span class="ia-label">ENGINEERING FAMILIES</span><h2>See the breadth.<br>Then go into the detail.</h2></div><p>VSK’s project portfolio is organized into clear engineering families. Each family leads to relevant machine and project references without overwhelming the first view.</p></div><div class="shell ia-family-grid">${familyCards}</div></section>
      <section class="ia-section dark"><div class="shell ia-section-head ia-reveal"><div><span class="ia-label">DEEP CASES</span><h2>Start with the projects<br>that explain the engineering.</h2></div><p>These cases have enough verified technical context to show the requirement, response and engineering proof — not just the finished machine.</p></div><div class="shell ia-featured-cases">${deepCases.slice(0,6).map(featuredCase).join('')}</div></section>
      <div class="ia-portfolio-toolbar" id="portfolio"><div class="shell ia-toolbar-inner"><input class="ia-project-search" data-project-search type="search" placeholder="Search machine, process or application…" aria-label="Search projects"><div class="ia-filters"><button class="ia-filter is-active" data-family-filter="all" type="button">All</button>${keys.map(k=>`<button class="ia-filter" data-family-filter="${k}" type="button">${familyMeta[k].short}</button>`).join('')}</div></div></div>
      <section class="ia-section"><div class="shell"><div class="ia-portfolio-status"><span data-project-count>${groups.length} project groups</span><span>Complete project record · organized by engineering family</span></div><div class="ia-project-grid" data-project-grid>${groups.map(g=>projectCard(g)).join('')}</div><div class="ia-project-index" data-project-index>${groups.map((g,i)=>`<a class="ia-index-row" href="${projectUrl(g)}" data-family="${familyFor(g)}" data-search="${cleanTitle(g.title)} ${familyMeta[familyFor(g)].label}"><span>${String(i+1).padStart(2,'0')}</span><strong>${cleanTitle(g.title)}</strong><small>${familyMeta[familyFor(g)].label}</small><i>→</i></a>`).join('')}</div></div></section>
      ${ctaSection('Have a similar operation or machine problem?','Bring the component, process, machine or drawing. VSK can compare it with relevant project and retrofit experience.')}`;

    const search = $('[data-project-search]'); let active='all';
    const draw = () => {
      const q=(search?.value||'').toLowerCase().trim(); let visible=0;
      $$('[data-ia-project]').forEach(card=>{const g=groups.find(x=>x.id===card.dataset.iaProject);const text=`${cleanTitle(g?.title)} ${g?.category} ${intentFor(g)}`.toLowerCase();const ok=(active==='all'||card.dataset.family===active)&&(!q||text.includes(q));card.hidden=!ok;if(ok)visible++;});
      $$('.ia-index-row').forEach(row=>{const ok=(active==='all'||row.dataset.family===active)&&(!q||(row.dataset.search||'').toLowerCase().includes(q));row.hidden=!ok;});
      const count=$('[data-project-count]');if(count)count.textContent=`${visible} project group${visible===1?'':'s'}`;
    };
    search?.addEventListener('input',draw);
    $$('[data-family-filter]').forEach(btn=>btn.addEventListener('click',()=>{active=btn.dataset.familyFilter;$$('[data-family-filter]').forEach(b=>b.classList.toggle('is-active',b===btn));draw()}));
    $$('[data-family-jump]').forEach(link=>link.addEventListener('click',()=>{active=link.dataset.familyJump;setTimeout(()=>{$$('[data-family-filter]').forEach(b=>b.classList.toggle('is-active',b.dataset.familyFilter===active));draw()},50)}));
  }

  function ctaSection(title,copy) {
    return `<section class="ia-section dark"><div class="shell ia-section-head ia-reveal"><div><span class="ia-label">DISCUSS A MACHINE</span><h2>${title}</h2></div><div><p>${copy}</p><div class="ia-page-hero-actions">${discussButton('Start an Engineering Requirement')}</div></div></div></section>`;
  }

  const pageShell = (body) => { const main=$('#main'); if(main){main.className='ia-main';main.innerHTML=body;} };

  function renderSolutions() {
    if(page!=='solutions')return;
    const hero=findGroup('4','servo','slotting')||groups[0];
    const solutions=[
      ['new-machine','01 / NEW MACHINE','New machine development','A component or operation that needs a dedicated machine architecture, workholding and controls.','projects.html?family=spm'],
      ['automation','02 / AUTOMATION','Automation & controls','PLC, HMI, servo, VFD, handling, pick-and-place and machine sequencing around a production process.','projects.html?family=automation'],
      ['manufacturing','03 / MANUFACTURING','Precision manufacturing','Turning, machining, grinding and finishing supported by practical machine-tool and workholding knowledge.','projects.html'],
      ['testing','04 / TEST & INSPECTION','Testing & inspection equipment','Dedicated fixtures, pneumatics, controlled motion and machine sequencing for repeatable production testing.','projects.html'],
      ['handling','05 / MATERIAL FLOW','Material handling & integration','Conveyors, indexing, loading, unloading and machine interfaces designed around part flow.','projects.html'],
      ['fluid-power','06 / FLUID POWER','Hydraulic & pneumatic systems','Clamping, pressing, actuation and machine functions engineered as part of the complete production sequence.','projects.html?family=hydraulic']
    ];
    pageShell(`${pageHero({eyebrow:'SOLUTIONS · START WITH THE PRODUCTION NEED',title:'What does the process<br>need to achieve?',copy:'VSK connects machine mechanics, controls, fluid power, automation and manufacturing knowledge around the production outcome — rather than treating each discipline as a separate service.',image:coverFor(hero),actions:primaryButton('Explore Projects','projects.html')+discussButton()})}
      <section class="ia-section"><div class="shell ia-section-head ia-reveal"><div><span class="ia-label">SOLUTION ROUTES</span><h2>Choose the problem.<br>Then follow the evidence.</h2></div><p>Each route links back to actual machine and project experience so the capability is supported by something VSK has built, modernized or integrated.</p></div><div class="shell ia-solution-grid">${solutions.map(([id,no,title,copy,href])=>`<a class="ia-solution-card ia-reveal" id="${id}" href="${href}"><span>${no}</span><h3>${title}</h3><p>${copy}</p><i>→</i></a>`).join('')}</div></section>
      <section class="ia-section stone"><div class="shell ia-section-head ia-reveal"><div><span class="ia-label">CONNECTED ENGINEERING</span><h2>One machine can need<br>six disciplines at once.</h2></div><p>Machine design, controls, electrical, fluid power, automation and manufacturing decisions are coordinated around the same production target.</p></div><div class="shell ia-taxonomy">${['Mechanical Engineering','CNC / PLC / HMI','Hydraulics & Pneumatics','Electrical Systems','Automation & Handling','Precision Manufacturing'].map((x,i)=>`<article class="ia-reveal"><span>${String(i+1).padStart(2,'0')} / DISCIPLINE</span><h3>${x}</h3><p>${['Architecture, mechanisms, workholding and alignment.','CNC, PLC, HMI, servo, VFD and machine sequencing.','Clamping, pressing, testing and machine actuation.','Panels, field wiring, drives and machine integration.','Part flow, indexing, pick-and-place and machine interfaces.','Machining, grinding, finishing and process knowledge.'][i]}</p></article>`).join('')}</div></section>${ctaSection('Bring the operation, not a service list.','Share what the component or process needs to achieve. VSK can determine which engineering disciplines belong in the solution.')}`);
  }

  function renderCompany() {
    if(page!=='company')return;
    const hero=findGroup('vertical','turning')||groups[0];
    pageShell(`${pageHero({eyebrow:'VSK ELECTRO-MECH SOLUTIONS · PEENYA',title:'Machine engineering<br>from Bengaluru.',copy:'Established in 2011, VSK combines new machine development, controls, retrofit and manufacturing knowledge around real production requirements.',image:coverFor(hero),actions:primaryButton('Explore Experience','experience.html')+discussButton()})}
      <section class="ia-section paper"><div class="shell ia-detail-grid"><div class="ia-detail-sticky ia-reveal"><span>WHY VSK</span><h2>One engineering organization across the machine lifecycle.</h2><p>The useful distinction is not how many services are listed. It is whether the mechanical machine, control system and production process can be understood together.</p></div><div class="ia-detail-content"><article class="ia-detail-block ia-reveal"><span>01 / NEW MACHINE</span><h3>Build around the operation.</h3><p>Special purpose and CNC machine concepts can be developed around the component, workholding, motion and production target.</p></article><article class="ia-detail-block ia-reveal"><span>02 / EXISTING MACHINE</span><h3>Keep useful mechanical capability productive.</h3><p>Reconditioning, electrical work and control modernization provide a route for machines whose mechanical value justifies renewal.</p></article><article class="ia-detail-block ia-reveal"><span>03 / PRODUCTION</span><h3>Connect mechanics and controls to the real process.</h3><p>PLC/HMI/servo automation, fluid power, testing and handling are treated as parts of one machine sequence.</p></article></div></div></section>
      <section class="ia-section stone"><div class="shell ia-experience-stats"><article class="ia-experience-stat ia-reveal"><span>ESTABLISHED</span><strong>2011</strong><p>Peenya, Bengaluru.</p></article><article class="ia-experience-stat ia-reveal"><span>MACHINES</span><strong>300+</strong><p>Designed, manufactured and supplied across India.</p></article><article class="ia-experience-stat ia-reveal"><span>NAMED REFERENCES</span><strong>54</strong><p>39 custom / SPM references and 15 machine-tool retrofit references.</p></article></div></section>
      <section class="ia-section"><div class="shell ia-section-head ia-reveal"><div><span class="ia-label">COMPANY DOCUMENTS</span><h2>Open the material<br>behind the website.</h2></div><p>Use the company profile for VSK background and capabilities; use the engineering catalog for selected machine and technical references.</p></div><div class="shell ia-solution-grid"><a class="ia-solution-card" href="assets-source/VSK_ElectroMech_Corporate_Profile.pdf" target="_blank" rel="noopener"><span>PDF / COMPANY</span><h3>VSK Company Profile</h3><p>Company background, capabilities and engineering experience.</p><i>↗</i></a><a class="ia-solution-card" href="assets-source/VSK_Electro-Mech_Solutions_Professional_Catalog.pdf" target="_blank" rel="noopener"><span>PDF / CATALOG</span><h3>Machine & Engineering Catalog</h3><p>Selected machine-tool and engineering references.</p><i>↗</i></a><a class="ia-solution-card" href="experience.html"><span>ONLINE / EXPERIENCE</span><h3>Searchable Engineering Experience</h3><p>Browse machine families, project media and the 54-reference engineering archive.</p><i>→</i></a></div></section>${ctaSection('Have a machine, component or production problem?','Start with the requirement. The conversation can move from the production need into the relevant mechanical, control or manufacturing route.')}`);
  }

  function renderReconditioning() {
    if(page!=='reconditioning')return;
    const k=deepCases.find(c=>c.key==='kellenberg');
    const retrofitGroups=familyGroups('retrofit');
    pageShell(`${pageHero({eyebrow:'RECONDITIONING · MACHINE LIFECYCLE',title:'Restore the machine<br>before replacing the asset.',copy:'When the mechanical platform is worth retaining, reconditioning can address the machine structure, electrical system, controls and functional reliability as one lifecycle project.',image:coverFor(k?.group||retrofitGroups[0]),actions:primaryButton('See Retrofit Experience','#references')+discussButton()})}
      <section class="ia-section"><div class="shell ia-section-head ia-reveal"><div><span class="ia-label">RECONDITIONING SCOPE</span><h2>More than cleaning,<br>painting and rewiring.</h2></div><p>The useful question is what prevents the existing machine from being productive and supportable. The engineering route can include mechanical, electrical and controls work depending on the condition of the asset.</p></div><div class="shell ia-solution-grid">${[['01 / MECHANICAL','Mechanical restoration','Machine condition, alignment, mechanisms and interfaces.'],['02 / ELECTRICAL','Electrical rebuild','Panels, field wiring, drives and machine electrical functions.'],['03 / CONTROLS','Control modernization','CNC, PLC, HMI, servo and drive modernization where required.'],['04 / MACHINE FUNCTION','Functional restoration','Machine sequencing, interlocks and production functions.'],['05 / VALIDATION','Trials & validation','Confirm machine behavior against the intended process.'],['06 / SUPPORT','Lifecycle support','Commissioning and practical support after the machine returns to work.']].map(([n,t,c])=>`<article class="ia-solution-card ia-reveal"><span>${n}</span><h3>${t}</h3><p>${c}</p></article>`).join('')}</div></section>
      <section class="ia-section dark" id="references"><div class="shell ia-section-head ia-reveal"><div><span class="ia-label">REAL MACHINE REFERENCES</span><h2>See the machines<br>behind the lifecycle work.</h2></div><p>Selected retrofit and service projects show the machine platforms behind VSK’s lifecycle work.</p></div><div class="shell ia-project-grid">${retrofitGroups.map(g=>projectCard(g)).join('')}</div></section>${ctaSection('Is the machine mechanically worth saving?','Share the machine, current control, symptoms and the outcome you need. VSK can review whether reconditioning or modernization is a practical route.')}`);
  }

  function renderRetrofit() {
    if(page!=='retrofit')return;
    const k=deepCases.find(c=>c.key==='kellenberg');
    const retrofitGroups=familyGroups('retrofit');
    pageShell(`${pageHero({eyebrow:'RETROFIT & CNC · CONTROL MODERNIZATION',title:'Modern controls.<br>Useful machine capability.',copy:'CNC, PLC, HMI, servo and drive modernization should be engineered around the machine function — not treated as a control-panel replacement in isolation.',image:coverFor(k?.group||retrofitGroups[0]),actions:primaryButton('Open Kellenberg Case',k?projectUrl(k.group):'#references')+discussButton()})}
      <section class="ia-section paper"><div class="shell ia-section-head ia-reveal"><div><span class="ia-label">CONTROL SCOPE</span><h2>Modernize what the<br>machine needs to keep working.</h2></div><p>Retrofit decisions depend on the machine, motion system, process, operator interface and serviceability. The controls are one part of the complete machine behavior.</p></div><div class="shell ia-taxonomy">${[['CNC','Fanuc and other CNC retrofit experience recorded in the engineering archive.'],['PLC / HMI','Machine sequence, operator interface and production control.'],['Servo / Drives','Motion modernization and integration with the machine mechanics.'],['Machine Tools','Grinding, turning, honing and machining-platform references.']].map(([t,c],i)=>`<article class="ia-reveal"><span>${String(i+1).padStart(2,'0')} / RETROFIT</span><h3>${t}</h3><p>${c}</p></article>`).join('')}</div></section>
      <section class="ia-section" id="references"><div class="shell ia-section-head ia-reveal"><div><span class="ia-label">SELECTED RETROFIT EXPERIENCE</span><h2>Grinding, turning<br>and machine-tool renewal.</h2></div><p>Use the complete Engineering Archive for the full set of 15 named retrofit references and control-platform details.</p></div><div class="shell ia-project-grid">${retrofitGroups.map(g=>projectCard(g)).join('')}</div><div class="shell" style="margin-top:26px"><a class="btn btn-primary" href="machines.html?type=retrofit">Search all 15 retrofit references <span>→</span></a></div></section>${ctaSection('Have an obsolete control on a machine worth keeping?','Share the machine make/model, current control and what needs to change. VSK can connect the requirement to relevant retrofit experience.')}`);
  }

  function renderExperience() {
    if(page!=='experience')return;
    const hero=deepCases.find(c=>c.key==='air')?.group||groups[0];
    const controls=[...new Set((window.machineArchive||[]).map(x=>x.control).filter(Boolean))];
    const processTags=['Turning','Boring','Drilling','Cutting','Notching','Grinding','Testing','Assembly','Finishing','Handling'];
    const machineTags=['SPM','CNC Turning','Grinding','Testing Equipment','Pressing','Handling','Process Equipment','Retrofit'];
    pageShell(`${pageHero({eyebrow:'EXPERIENCE · FIND RELEVANT ENGINEERING',title:'What kind of work<br>can VSK handle?',copy:'Browse machine types, processes, controls, project families and named engineering references — then use the Archive to find experience close to your requirement.',image:coverFor(hero),actions:primaryButton('Search Engineering Archive','machines.html')+primaryButton('Explore Projects','projects.html')})}
      <section class="ia-section paper"><div class="shell ia-experience-stats"><article class="ia-experience-stat ia-reveal"><span>MACHINES</span><strong>300+</strong><p>Designed, manufactured and supplied across India.</p></article><article class="ia-experience-stat ia-reveal"><span>NAMED REFERENCES</span><strong>54</strong><p>39 custom / SPM · 15 retrofit.</p></article><article class="ia-experience-stat ia-reveal"><span>ORGANIZED VISUAL PROJECTS</span><strong>${groups.length}</strong><p>${groups.length} organized project groups · ${manifest.summary?.images||0} images · ${manifest.summary?.videos||0} videos.</p></article></div></section>
      <section class="ia-section"><div class="shell ia-section-head ia-reveal"><div><span class="ia-label">FIND BY ENGINEERING CONTEXT</span><h2>Start with what<br>you already know.</h2></div><p>A buyer may know the process, machine type or controller without knowing VSK’s internal project name. These routes lead into relevant project and Archive evidence.</p></div><div class="shell ia-taxonomy"><article><span>MACHINE TYPES</span><h3>What kind of machine?</h3><div class="ia-tag-cloud">${machineTags.map(t=>`<b>${t}</b>`).join('')}</div></article><article><span>PROCESSES</span><h3>What must the process do?</h3><div class="ia-tag-cloud">${processTags.map(t=>`<b>${t}</b>`).join('')}</div></article><article><span>CONTROLS</span><h3>What platform is involved?</h3><div class="ia-tag-cloud">${(controls.length?controls:['Fanuc CNC','PLC / HMI','Servo','VFD']).slice(0,12).map(t=>`<b>${t}</b>`).join('')}</div></article><article><span>LIFECYCLE</span><h3>Where is the asset today?</h3><div class="ia-tag-cloud"><b>Build</b><b>Automate</b><b>Retrofit</b><b>Recondition</b><b>Commission</b><b>Support</b></div></article></div></section>
      <section class="ia-section stone"><div class="shell ia-section-head ia-reveal"><div><span class="ia-label">ENGINEERING FAMILIES</span><h2>${groups.length} visual project groups.<br>Five clear families.</h2></div><p>The visual portfolio is organized by machine and engineering family so related experience can be found quickly.</p></div><div class="shell ia-family-grid">${Object.keys(familyMeta).map((k,i)=>{const m=familyMeta[k],c=familyGroups(k).length;return `<a class="ia-family" href="projects.html#portfolio" data-family-link="${k}"><small>${String(i+1).padStart(2,'0')} / FAMILY</small><strong>${m.label}</strong><p>${m.description}</p><footer><span>${c} project group${c===1?'':'s'}</span><i>→</i></footer></a>`}).join('')}</div></section>
      <section class="ia-section dark"><div class="shell ia-section-head ia-reveal"><div><span class="ia-label">SELECTED ENGINEERING EXPERIENCE</span><h2>Recognizable production<br>environments and requirements.</h2></div><p>Customer names are presented as engineering references rather than a decorative logo wall.</p></div><div class="shell customer-row" style="border-top-color:rgba(255,255,255,.18);color:#fff"><span>SELECTED REFERENCES</span><a href="machines.html?q=Trelleborg">Trelleborg</a><a href="machines.html?q=Yuken">Yuken India</a><a href="machines.html?q=Transtech">Transtech Gears</a><a href="machines.html?q=Rollon">TMI Rollon</a></div><div class="shell" style="margin-top:28px"><a class="btn btn-primary" href="machines.html">Open the 54-reference Engineering Archive <span>→</span></a></div></section>${ctaSection('Looking for experience close to your requirement?','Search the Archive or discuss the machine/process directly. The goal is to find evidence that is relevant, not simply show the largest possible project count.')}`);
  }

  function renderProjectDetail() {
    if(page!=='project')return;
    const params=new URLSearchParams(location.search);const id=params.get('id');const group=groups.find(g=>g.id===id)||groups[0];
    if(!group){pageShell(pageHero({eyebrow:'PROJECT',title:'Project media unavailable.',copy:'Return to the complete VSK project portfolio.',actions:primaryButton('Projects','projects.html')}));return;}
    const deep=deepFor(group);const title=deep?.title||cleanTitle(group.title);const family=familyMeta[familyFor(group)];const cover=coverFor(group);const facts=deep?.facts||[['Engineering family',family.label],['Visual record',`${mediaCount(group)} media item${mediaCount(group)===1?'':'s'}`],['Project media',`${mediaCount(group)} recorded media items`]];
    const requirement=deep?.need||intentFor(group);const response=deep?.response||`A ${family.label.toLowerCase()} project reference developed around the machine or production operation represented in the client project library.`;const engineering=deep?.engineering||family.description;
    const related=familyGroups(familyFor(group)).filter(g=>g.id!==group.id).slice(0,3);
    const media=group.items.map((item,i)=>{const src=mediaSrc(item);if(!src)return'';if(item.type==='video')return `<figure class="ia-media-item"><video controls muted playsinline ${item.poster?`poster="${item.poster}"`:''}><source src="${item.web||item.src_mp4||item.src}" type="video/mp4"></video><figcaption>${title} · motion reference ${String(i+1).padStart(2,'0')}</figcaption></figure>`;return `<figure class="ia-media-item"><img src="${src}" alt="${title} — project view ${i+1}" loading="lazy"><figcaption>${title} · project view ${String(i+1).padStart(2,'0')}</figcaption></figure>`}).join('');
    pageShell(`${pageHero({eyebrow:`${deep?.ref||groupRef(group)} · ${family.label}`,title,copy:requirement,image:cover,actions:discussButton('Discuss a Similar Requirement')})}
      <section class="ia-section paper"><div class="shell ia-detail-grid"><aside class="ia-detail-sticky ia-reveal"><span>WHAT THE MACHINE SOLVES</span><h2>${requirement}</h2><p>Understand the production need, the machine response and the verified engineering evidence in one place.</p></aside><div class="ia-detail-content"><article class="ia-detail-block ia-reveal"><span>01 / THE REQUIREMENT</span><h3>Start with the production need.</h3><p>${requirement}</p></article><article class="ia-detail-block ia-reveal"><span>02 / THE MACHINE</span><h3>${title}</h3><p>${response}</p></article><article class="ia-detail-block ia-reveal"><span>03 / THE ENGINEERING</span><h3>How the disciplines connect.</h3><p>${engineering}</p></article></div></div></section>
      <section class="ia-section stone"><div class="shell ia-section-head ia-reveal"><div><span class="ia-label">VERIFIED PROJECT CONTEXT</span><h2>Proof before promotion.</h2></div><p>Only information already supported by the project records or verified VSK reference data is shown as technical fact.</p></div><div class="shell ia-fact-grid">${facts.map(([a,b])=>`<div class="ia-fact"><small>${a}</small><strong>${b}</strong></div>`).join('')}</div></section>
      <section class="ia-section"><div class="shell ia-section-head ia-reveal"><div><span class="ia-label">PROJECT MEDIA · ${group.items.length}</span><h2>The machine.<br>The details. The motion.</h2></div><p>Project views, technical details and available motion references are presented together so the machine can be understood beyond a single hero photograph. Preview frames remain a consistent 4:3 for a disciplined visual rhythm.</p></div><div class="shell ia-media-story">${media}</div></section>
      ${related.length?`<section class="ia-section paper"><div class="shell ia-section-head ia-reveal"><div><span class="ia-label">RELATED REFERENCES</span><h2>More from ${family.label}.</h2></div><p>Continue through projects in the same engineering family.</p></div><div class="shell ia-related-grid">${related.map(g=>projectCard(g,true)).join('')}</div></section>`:''}${ctaSection('Have a similar requirement?','Share the operation, component, machine or drawing. VSK can review the requirement against related machine-building and retrofit experience.')}`);
    document.title=`${title} — VSK Electro-Mech Solutions`;
  }

  function polishGalleryAndArchive() {
    if(page==='gallery'){
      const kicker=$('.gallery-hero-copy .kicker'),h=$('.gallery-hero-copy h1'),p=$('.gallery-hero-copy p');
      if(kicker)kicker.textContent='VISUAL ARCHIVE · REAL VSK PROJECT MEDIA';
      if(h)h.innerHTML='Inside the work.<br><em>Every useful view.</em>';
      if(p)p.textContent='Machines, controls, mechanisms, assemblies and motion — organized project by project so each visual keeps its engineering context.';
      const bh=$('.gallery-browser-head h2'),bp=$('.gallery-browser-head p');if(bh)bh.innerHTML='Visual proof,<br><em>organized by project.</em>';if(bp)bp.textContent='Projects tells you what was built. Gallery shows what the engineering work actually looks like.';
    }
    if(page==='machines'){
      const candidates=$$('.archive-hero p,.archive-hero-grid p,.archive-intro p');candidates.forEach(p=>{if(p.textContent.toLowerCase().includes('search'))p.textContent='Find machines, processes, customers and control experience relevant to your requirement. The Archive is deliberately dense: 39 custom / SPM references and 15 retrofit references.';});
    }
  }

  function reveal() {
    const els=$$('.ia-reveal,.ia-image-reveal');if(reduced){els.forEach(e=>e.classList.add('is-visible'));return;}
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -35px'});els.forEach(e=>io.observe(e));
  }

  rewriteHome();
  renderProjects();
  renderSolutions();
  renderCompany();
  renderReconditioning();
  renderRetrofit();
  renderExperience();
  renderProjectDetail();
  polishGalleryAndArchive();
  reveal();

  // Architecture pages added after the legacy runtime still need quote-open bindings.
  // Re-dispatch to an existing hidden trigger so the tested V14 dialog logic remains the single form engine.
  document.addEventListener('click', e => {
    const trigger=e.target.closest('[data-quote-open]');
    if(!trigger || trigger.dataset.iaBound==='1') return;
    trigger.dataset.iaBound='1';
  }, true);
})();