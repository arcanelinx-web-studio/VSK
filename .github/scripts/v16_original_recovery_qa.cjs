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

      const geom = await page.evaluate(()=>{
        const q=s=>document.querySelector(s);
        const shell=q('.shell')?.getBoundingClientRect();
        return {
          iw:innerWidth, ih:innerHeight,
          sw:document.documentElement.scrollWidth,
          bodySw:document.body.scrollWidth,
          shellWidth:shell?.width||0,
          hasDesktop100:[...document.querySelectorAll('link[rel="stylesheet"]')].some(x=>(x.getAttribute('href')||'').includes('v16-desktop-100.css')),
        };
      });
      if(geom.sw > geom.iw + 1 || geom.bodySw > geom.iw + 1) fail(`${vp.name} ${path}: horizontal overflow ${JSON.stringify(geom)}`);
      if(pageErrors.length) fail(`${vp.name} ${path}: page errors ${pageErrors.join(' | ')}`);
      const meaningfulFailures=requestFailures.filter(x=>!x.includes('favicon')&&!x.includes('fonts.gstatic.com')&&!x.includes('fonts.googleapis.com'));
      if(meaningfulFailures.length) fail(`${vp.name} ${path}: request failures ${meaningfulFailures.slice(0,4).join(' | ')}`);
      if(!geom.hasDesktop100) fail(`${vp.name} ${path}: final desktop calibration stylesheet missing`);
      if(vp.width===1920 && geom.shellWidth<1600) fail(`${path}: 1920 desktop shell still too narrow (${geom.shellWidth})`);
      if(vp.width===1440 && geom.shellWidth<1300) fail(`${path}: 1440 desktop shell still too narrow (${geom.shellWidth})`);

      const data={viewport:vp.name,path,overflow:Math.max(geom.sw,geom.bodySw)-geom.iw,shellWidth:geom.shellWidth};

      if(path==='index.html'){
        const home=await page.evaluate(()=>{
          const q=s=>document.querySelector(s);
          const r=s=>q(s)?.getBoundingClientRect();
          const c=s=>q(s)?getComputedStyle(q(s)):null;
          const header=r('.site-header'),hero=r('.hero.hero-blue'),copy=r('.hero-blue-copy'),board=r('.hero-engineering-board');
          const h1=r('.hero-blue-copy h1'),para=r('.hero-blue-copy>p'),actions=r('.hero-blue-copy .hero-actions'),chips=r('.hero-blue-copy .hero-chips');
          const featured=r('.featured-case'),featuredMedia=r('.featured-case-media'),featuredCopy=r('.featured-case-copy');
          const selected=[...document.querySelectorAll('.selected-projects-strip .project-card')].map(el=>{const x=el.getBoundingClientRect();return{x:x.x,y:x.y,w:x.width,h:x.height};});
          const cards=[...document.querySelectorAll('.engineering-depth .metric-card')].map(el=>{const x=el.getBoundingClientRect();return{x:x.x,y:x.y,w:x.width,h:x.height};});
          const footer=r('.site-footer'),footerGrid=r('.footer-grid');
          const groupTop=Math.min(copy?.top??Infinity,board?.top??Infinity);
          const groupBottom=Math.max(copy?.bottom??0,board?.bottom??0);
          return {
            header,hero,copy,board,h1,para,actions,chips,
            headlineGap:header&&h1?h1.top-header.bottom:null,
            topGroupGap:header?groupTop-header.bottom:null,
            bottomGroupGap:hero?hero.bottom-groupBottom:null,
            actionCenter:actions&&para?{actions:actions.x+actions.width/2,para:para.x+para.width/2}:null,
            precisionColor:c('.hero-blue-copy h1 em')?.color,
            capAccent:c('.capabilities h2 em')?.color,
            heroGrid:c('.hero-blue-grid')?.display,boardGrid:c('.hero-board-grid')?.display,
            headerCtaBg:c('.header-cta')?.backgroundColor,
            headerCtaWidth:r('.header-cta')?.width,
            featured,featuredMedia,featuredCopy,
            featuredCopyBg:c('.featured-case-copy')?.backgroundColor,
            selected,
            cards,stack:r('.engineering-depth .metric-stack'),archive:r('.engineering-depth .archive-callout'),
            footerHeight:footer?.height,footerGridOffset:footer&&footerGrid?footerGrid.top-footer.top:null,
            brandFont:c('.brand-copy strong')?.fontFamily,navFont:c('.desktop-nav a')?.fontFamily,
          };
        });
        data.home=home;

        if(vp.width>=1366){
          if(home.hero && !near(home.hero.bottom,geom.ih,4)) fail(`${vp.name}: hero does not end at viewport bottom (${home.hero.bottom} vs ${geom.ih})`);
          if(home.precisionColor!=='rgb(22, 74, 156)') fail(`${vp.name}: Precision color drifted ${home.precisionColor}`);
          if(home.capAccent!=='rgb(22, 74, 156)') fail(`${vp.name}: capability cobalt drifted ${home.capAccent}`);
          if(home.heroGrid!=='none'||home.boardGrid!=='none') fail(`${vp.name}: hero grid returned`);
          if(home.actionCenter&&!near(home.actionCenter.actions,home.actionCenter.para,18)) fail(`${vp.name}: hero CTAs not centered under paragraph ${JSON.stringify(home.actionCenter)}`);
          if(vp.width>=1440){
            if(home.headlineGap<120||home.headlineGap>270) fail(`${vp.name}: hero headline gap is not balanced (${home.headlineGap})`);
            if(home.topGroupGap<100||home.bottomGroupGap<90||Math.abs(home.topGroupGap-home.bottomGroupGap)>110) fail(`${vp.name}: hero composition breathing room unbalanced top=${home.topGroupGap} bottom=${home.bottomGroupGap}`);
            if(home.board?.width<620) fail(`${vp.name}: engineering board still too small (${home.board?.width})`);
          }
          if(home.headerCtaBg!=='rgb(22, 74, 156)') fail(`${vp.name}: header CTA is not exact cobalt ${home.headerCtaBg}`);
          if(home.headerCtaWidth>225) fail(`${vp.name}: header CTA oversized ${home.headerCtaWidth}`);

          if(home.featured&&home.featuredMedia&&home.featuredCopy){
            const share=home.featuredMedia.width/home.featured.width;
            if(share<.62||share>.69) fail(`${vp.name}: Featured Engineering image/copy ratio wrong ${share}`);
            if(home.featured.height<500||home.featured.height>575) fail(`${vp.name}: Featured Engineering height wrong ${home.featured.height}`);
            if(home.featuredCopyBg!=='rgb(13, 24, 36)') fail(`${vp.name}: Featured Engineering panel left original navy ${home.featuredCopyBg}`);
          }

          if(home.selected.length!==5) fail(`${vp.name}: expected 5 selected project cards, got ${home.selected.length}`);
          if(home.selected.length===5){
            if(!near(home.selected[0].y,home.selected[1].y,3)) fail(`${vp.name}: first two selected projects are not one row`);
            if(!(home.selected[2].y>home.selected[0].y+80)) fail(`${vp.name}: supporting selected projects did not move to second row`);
            if(!(near(home.selected[2].y,home.selected[3].y,3)&&near(home.selected[3].y,home.selected[4].y,3))) fail(`${vp.name}: supporting selected projects are not one row`);
            if(!(home.selected[0].w>home.selected[2].w*1.35)) fail(`${vp.name}: selected project hierarchy is not 2 large + 3 supporting`);
          }

          if(home.cards.length!==3) fail(`${vp.name}: expected 3 engineering metric rows, got ${home.cards.length}`);
          if(home.cards.some(x=>x.h>235)) fail(`${vp.name}: engineering metrics oversized ${JSON.stringify(home.cards)}`);
          if(home.cards.length===3&&!(home.cards[1].y>home.cards[0].y+50&&home.cards[2].y>home.cards[1].y+50)) fail(`${vp.name}: engineering metrics not stacked rows`);
          if(home.stack&&home.archive&&home.archive.x<home.stack.x+home.stack.w-5) fail(`${vp.name}: archive panel not beside metrics`);
          if(home.footerHeight>430) fail(`${vp.name}: footer too tall ${home.footerHeight}`);
          if(home.footerGridOffset>80) fail(`${vp.name}: footer top gap too large ${home.footerGridOffset}`);
          if(!home.brandFont?.includes('Space Grotesk')||!home.navFont?.includes('Inter')) fail(`${vp.name}: V16 header fonts changed`);
        }

        if(vp.name==='desktop-1920'){
          await page.screenshot({path:'artifacts/v16-recovery/index-desktop-1920.png'});
          await page.locator('.projects-showcase').screenshot({path:'artifacts/v16-recovery/home-featured-engineering-1920.png'});
          await page.locator('.selected-projects-strip').screenshot({path:'artifacts/v16-recovery/home-selected-projects-1920.png'});
        }
      }

      if(path==='projects.html'){
        try{await page.waitForFunction(()=>document.querySelectorAll('.project-page-card').length>=10,{timeout:3500});}catch{}
        try{await page.waitForFunction(()=>document.querySelectorAll('.additional-project-card').length>0,{timeout:3500});}catch{}
        const p=await page.evaluate(()=>({
          cases:document.querySelectorAll('.project-page-card').length,
          additional:document.querySelectorAll('.additional-project-card').length,
          gridWidth:document.querySelector('.project-page-grid')?.getBoundingClientRect().width||0,
        }));
        data.projects=p;
        if(p.cases<10) fail(`${vp.name} projects: expected 10 cases, got ${p.cases}`);
        if(vp.width>=1366&&p.additional<1) fail(`${vp.name} projects: additional media library missing`);
        if(vp.width===1920&&p.gridWidth<1600) fail(`projects 1920 grid too narrow ${p.gridWidth}`);
      }

      if(path==='machines.html'){
        await page.waitForTimeout(500);
        const m=await page.evaluate(()=>{
          const card=document.querySelector('.archive-sticky-preview'),h=card?.querySelector('h2');
          return {bg:card?getComputedStyle(card).backgroundColor:null,color:h?getComputedStyle(h).color:null,rows:document.querySelectorAll('.archive-row').length,layoutWidth:document.querySelector('.archive-index-layout')?.getBoundingClientRect().width||0};
        });
        data.archive=m;
        if(m.rows<54) fail(`${vp.name} archive: expected 54 references, got ${m.rows}`);
        if(vp.width>=1366){
          if(m.bg!=='rgb(255, 255, 255)') fail(`${vp.name} archive preview not light ${m.bg}`);
          if(m.color!=='rgb(13, 24, 36)') fail(`${vp.name} archive preview contrast wrong ${m.color}`);
        }
        if(vp.width===1920&&m.layoutWidth<1600) fail(`experience 1920 layout too narrow ${m.layoutWidth}`);
        if(vp.width>=1366){
          await page.locator('.archive-row').first().click();
          try{await page.waitForFunction(()=>{const d=document.querySelector('[data-dossier]');return d&&!d.hidden;},{timeout:2500});}catch{}
          const dossier=await page.evaluate(()=>{
            const panel=document.querySelector('.dossier-panel'),copy=document.querySelector('.dossier-copy');
            return panel?{panelBg:getComputedStyle(panel).backgroundColor,copyBg:copy?getComputedStyle(copy).backgroundColor:null,width:panel.getBoundingClientRect().width,viewport:innerWidth}:null;
          });
          data.dossier=dossier;
          if(!dossier) fail(`${vp.name} archive: dossier did not open`);
          else{
            if(dossier.panelBg!=='rgb(230, 228, 222)') fail(`${vp.name} archive: dossier not grey ${dossier.panelBg}`);
            if(dossier.copyBg!=='rgb(241, 240, 236)') fail(`${vp.name} archive: dossier copy not stone ${dossier.copyBg}`);
            if(dossier.width>dossier.viewport*.94) fail(`${vp.name} archive: dossier too wide ${dossier.width}`);
          }
        }
      }

      if(path==='gallery.html'){
        try{await page.waitForFunction(()=>document.querySelectorAll('.gallery-project-group').length>0,{timeout:4000});}catch{}
        const g=await page.evaluate(()=>{
          const groups=[...document.querySelectorAll('.gallery-project-group')];
          const five=groups.find(x=>x.querySelectorAll('.gallery-tile').length===5);
          let fiveLayout=null;
          if(five){
            const tiles=[...five.querySelectorAll('.gallery-tile')].map(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width};});
            fiveLayout={width:five.getBoundingClientRect().width,tiles};
          }
          return {groups:groups.length,tiles:document.querySelectorAll('.gallery-tile').length,fiveLayout};
        });
        data.gallery=g;
        if(g.groups<1||g.tiles<1) fail(`${vp.name} gallery: media did not render ${JSON.stringify(g)}`);
        if(vp.width===1920&&g.fiveLayout){
          if(g.fiveLayout.width<1600) fail(`gallery 1920 five-media group too narrow ${g.fiveLayout.width}`);
          const ys=g.fiveLayout.tiles.map(x=>Math.round(x.y));
          const firstY=ys[0],sameRow=ys.filter(y=>Math.abs(y-firstY)<3).length;
          if(sameRow<5) fail(`gallery 1920 five-media group still wraps (${sameRow}/5 on first row)`);
        }
      }

      await page.evaluate(async()=>{
        for(let y=0;y<document.documentElement.scrollHeight;y+=Math.max(500,innerHeight*.7)){
          window.scrollTo(0,y); await new Promise(r=>setTimeout(r,18));
        }
        window.scrollTo(0,0);
      });
      await page.waitForTimeout(280);
      const broken=await page.evaluate(()=>[...document.images].filter(img=>{const s=getComputedStyle(img),r=img.getBoundingClientRect();const rendered=s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;return rendered&&img.complete&&img.naturalWidth===0;}).map(img=>img.getAttribute('src')));
      if(broken.length) fail(`${vp.name} ${path}: broken rendered images ${broken.slice(0,6).join(', ')}`);

      if((vp.name==='desktop-1920'||vp.name==='laptop-1366'||vp.name==='mobile-390')&&['projects.html','machines.html'].includes(path)){
        await page.screenshot({path:`artifacts/v16-recovery/${path.replace('.html','')}-${vp.name}.png`,fullPage:true});
      }

      report.push(data);
      await page.close();
    }
  }

  await browser.close();
  fs.writeFileSync('artifacts/v16-recovery/report.json',JSON.stringify({report,failures},null,2));
  if(failures.length){console.error('\nV16 desktop calibration QA failures:\n- '+failures.join('\n- '));process.exit(1);}
  console.log(`V16 100% desktop calibration passed across ${viewports.length} viewports and ${pages.length} pages.`);
})().catch(err=>{console.error(err);process.exit(1)});
