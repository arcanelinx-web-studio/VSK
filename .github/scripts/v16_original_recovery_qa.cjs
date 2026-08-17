const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'http://127.0.0.1:4173';
const viewports = [
  {name:'desktop-1920', width:1920, height:1080},
  {name:'desktop-1440', width:1440, height:900},
  {name:'laptop-1366', width:1366, height:768},
  {name:'tablet-1024', width:1024, height:768},
  {name:'tablet-768', width:768, height:1024},
  {name:'mobile-390', width:390, height:844},
];
const pages = ['index.html','projects.html','machines.html','gallery.html'];
const report = [];
let failures = [];

function fail(msg){ failures.push(msg); }
function near(a,b,t=3){ return Math.abs(a-b) <= t; }

(async()=>{
  fs.mkdirSync('artifacts/v16-recovery',{recursive:true});
  const browser = await chromium.launch({headless:true});

  for(const vp of viewports){
    for(const path of pages){
      const page = await browser.newPage({viewport:{width:vp.width,height:vp.height}});
      const pageErrors=[]; const requestFailures=[];
      page.on('pageerror',e=>pageErrors.push(String(e)));
      page.on('requestfailed',r=>requestFailures.push(`${r.method()} ${r.url()} :: ${r.failure()?.errorText||'failed'}`));
      const res = await page.goto(`${BASE}/${path}`,{waitUntil:'networkidle'});
      await page.waitForTimeout(500);
      if(!res || !res.ok()) fail(`${vp.name} ${path}: navigation failed ${res?.status()}`);

      const geom = await page.evaluate(()=>({
        iw: innerWidth,
        sw: document.documentElement.scrollWidth,
        bodySw: document.body.scrollWidth,
        bodyBg: getComputedStyle(document.body).backgroundColor,
      }));
      if(geom.sw > geom.iw + 1 || geom.bodySw > geom.iw + 1){
        fail(`${vp.name} ${path}: horizontal overflow ${JSON.stringify(geom)}`);
      }
      if(pageErrors.length) fail(`${vp.name} ${path}: page errors ${pageErrors.join(' | ')}`);
      const meaningfulFailures=requestFailures.filter(x=>!x.includes('favicon'));
      if(meaningfulFailures.length) fail(`${vp.name} ${path}: request failures ${meaningfulFailures.slice(0,4).join(' | ')}`);

      const data = {viewport:vp.name,path,overflow:Math.max(geom.sw,geom.bodySw)-geom.iw};

      if(path==='index.html'){
        const home = await page.evaluate(()=>{
          const q=s=>document.querySelector(s);
          const r=s=>q(s)?.getBoundingClientRect();
          const c=s=>q(s)?getComputedStyle(q(s)):null;
          const cards=[...document.querySelectorAll('.engineering-depth .metric-card')].map(el=>{
            const x=el.getBoundingClientRect(); return {x:x.x,y:x.y,w:x.width,h:x.height};
          });
          const footer=r('.site-footer'), footerGrid=r('.footer-grid');
          const copy=r('.hero-blue-copy'), actions=r('.hero-blue-copy .hero-actions');
          return {
            hero:r('.hero.hero-blue'), board:r('.hero-engineering-board'),
            h1:r('.hero-blue-copy h1'), first:r('.hero-blue-copy h1 span'), precisionColor:c('.hero-blue-copy h1 em')?.color,
            firstWhiteSpace:c('.hero-blue-copy h1 span')?.whiteSpace,
            actionCenter: actions&&copy ? {actions:actions.x+actions.width/2,copy:copy.x+Math.min(copy.width,630)/2} : null,
            heroGrid:c('.hero-blue-grid')?.display, boardGrid:c('.hero-board-grid')?.display,
            capAccent:c('.capabilities h2 em')?.color,
            capBg:c('.capabilities')?.backgroundColor,
            projectBg:c('.projects-showcase')?.backgroundColor,
            depthBg:c('.engineering-depth')?.backgroundColor,
            cards,
            stack:r('.engineering-depth .metric-stack'), archive:r('.engineering-depth .archive-callout'),
            processHeight:r('.process')?.height,
            aboutTop:r('.about')?.top,
            footerHeight:footer?.height, footerGridOffset:footer&&footerGrid?footerGrid.top-footer.top:null,
            headerHeight:r('.site-header')?.height,
            brandFont:c('.brand-copy strong')?.fontFamily, navFont:c('.desktop-nav a')?.fontFamily,
          };
        });
        Object.assign(data,{home});

        if(vp.width>=1366){
          if(home.hero?.height > 830) fail(`${vp.name}: hero too tall at 100% desktop (${home.hero?.height})`);
          if(home.firstWhiteSpace!=='nowrap') fail(`${vp.name}: Engineered for line not locked to one line`);
          if(home.precisionColor!=='rgb(22, 74, 156)') fail(`${vp.name}: Precision is not exact Deep Cobalt: ${home.precisionColor}`);
          if(home.capAccent!=='rgb(22, 74, 156)') fail(`${vp.name}: capability headline accent drifted: ${home.capAccent}`);
          if(home.capBg!=='rgb(250, 250, 247)') fail(`${vp.name}: capabilities not ivory: ${home.capBg}`);
          if(home.projectBg!=='rgb(13, 24, 36)') fail(`${vp.name}: projects not Industrial Navy: ${home.projectBg}`);
          if(home.heroGrid!=='none' || home.boardGrid!=='none') fail(`${vp.name}: hero grid is visible`);
          if(home.actionCenter && !near(home.actionCenter.actions,home.actionCenter.copy,26)) fail(`${vp.name}: hero buttons are not centered ${JSON.stringify(home.actionCenter)}`);
          if(home.cards.length!==3) fail(`${vp.name}: expected 3 engineering metric rows, got ${home.cards.length}`);
          if(home.cards.some(x=>x.h>235)) fail(`${vp.name}: engineering metrics became oversized again ${JSON.stringify(home.cards)}`);
          if(home.cards.length===3 && !(home.cards[1].y>home.cards[0].y+50 && home.cards[2].y>home.cards[1].y+50)) fail(`${vp.name}: engineering metrics are not stacked rows ${JSON.stringify(home.cards)}`);
          if(home.stack&&home.archive&&home.archive.x < home.stack.x+home.stack.w-5) fail(`${vp.name}: archive panel is not beside metric rows`);
          if(home.footerHeight>430) fail(`${vp.name}: footer too tall (${home.footerHeight})`);
          if(home.footerGridOffset>80) fail(`${vp.name}: footer has oversized top gap (${home.footerGridOffset})`);
          if(!home.brandFont?.includes('Space Grotesk') || !home.navFont?.includes('Inter')) fail(`${vp.name}: original V16 header fonts not preserved`);
        }
      }

      if(path==='projects.html'){
        try{ await page.waitForFunction(()=>document.querySelectorAll('.project-page-card').length>=10,{timeout:3500}); }catch{}
        try{ await page.waitForFunction(()=>document.querySelectorAll('.additional-project-card').length>0,{timeout:3500}); }catch{}
        const p = await page.evaluate(()=>({
          cases:document.querySelectorAll('.project-page-card').length,
          additional:document.querySelectorAll('.additional-project-card').length,
          addHidden:document.querySelector('[data-additional-projects-section]')?.hidden,
          grid:getComputedStyle(document.querySelector('.project-page-grid')).gridTemplateColumns,
        }));
        data.projects=p;
        if(p.cases<10) fail(`${vp.name} projects: expected all 10 featured project cases, got ${p.cases}`);
        if(vp.width>=1366 && p.additional<1) fail(`${vp.name} projects: wider project media library did not render`);
      }

      if(path==='machines.html'){
        await page.waitForTimeout(500);
        const m=await page.evaluate(()=>{
          const card=document.querySelector('.archive-sticky-preview');
          const h=card?.querySelector('h2');
          const cr=card?.getBoundingClientRect();
          return {
            bg:card?getComputedStyle(card).backgroundColor:null,
            color:h?getComputedStyle(h).color:null,
            display:card?getComputedStyle(card).display:null,
            width:cr?.width,
            rows:document.querySelectorAll('.archive-row').length,
          };
        });
        data.archive=m;
        if(m.rows<54) fail(`${vp.name} archive: expected 54 references, got ${m.rows}`);
        if(vp.width>=1366){
          if(m.bg!=='rgb(255, 255, 255)') fail(`${vp.name} archive: sticky preview is not light ${m.bg}`);
          if(m.color!=='rgb(13, 24, 36)') fail(`${vp.name} archive: preview heading contrast wrong ${m.color}`);
        }
      }

      if(path==='gallery.html'){
        try{ await page.waitForFunction(()=>document.querySelectorAll('.gallery-project-group').length>0,{timeout:4000}); }catch{}
        const g=await page.evaluate(()=>({groups:document.querySelectorAll('.gallery-project-group').length,tiles:document.querySelectorAll('.gallery-tile').length}));
        data.gallery=g;
        if(g.groups<1 || g.tiles<1) fail(`${vp.name} gallery: project media did not render ${JSON.stringify(g)}`);
      }

      // Trigger lazy media and validate visible images after the page has been exercised.
      await page.evaluate(async()=>{
        for(let y=0;y<document.documentElement.scrollHeight;y+=Math.max(500,innerHeight*.7)){
          window.scrollTo(0,y); await new Promise(r=>setTimeout(r,20));
        }
        window.scrollTo(0,0);
      });
      await page.waitForTimeout(300);
      const broken=await page.evaluate(()=>[...document.images].filter(img=>{
        const s=getComputedStyle(img),r=img.getBoundingClientRect();
        const rendered=s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
        return rendered && img.complete && img.naturalWidth===0;
      }).map(img=>img.getAttribute('src')));
      if(broken.length) fail(`${vp.name} ${path}: broken rendered images ${broken.slice(0,6).join(', ')}`);

      if((vp.name==='desktop-1920'||vp.name==='laptop-1366'||vp.name==='mobile-390') && ['index.html','projects.html','machines.html'].includes(path)){
        await page.screenshot({path:`artifacts/v16-recovery/${path.replace('.html','')}-${vp.name}.png`,fullPage:path!=='index.html'});
      }

      report.push(data);
      await page.close();
    }
  }

  await browser.close();
  fs.writeFileSync('artifacts/v16-recovery/report.json',JSON.stringify({report,failures},null,2));
  if(failures.length){
    console.error('\nV16 recovery QA failures:\n- '+failures.join('\n- '));
    process.exit(1);
  }
  console.log(`V16 recovery QA passed across ${viewports.length} viewports and ${pages.length} pages.`);
})().catch(err=>{console.error(err);process.exit(1)});
