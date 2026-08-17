from pathlib import Path

p=Path('v16-blue-refinement.css')
s=p.read_text(encoding='utf-8')
marker='/* V16 ORIGINAL HEADER TYPOGRAPHY + LARGER SCALE */'
if marker not in s:
    s += r'''

/* V16 ORIGINAL HEADER TYPOGRAPHY + LARGER SCALE */
/* Restore first-V16 type roles: Space Grotesk brand, Inter nav/CTA, Plex Mono technical descriptor. */
body.v8.v13.v14{
  --vsk-header:104px;
}
body.v8.v13.v14 .site-header,
body.v8.v13.v14 .site-header.is-solid,
body.v8.v13.v14 .site-header.is-scrolled{
  grid-template-columns:minmax(300px,.86fr) auto auto!important;
  gap:clamp(24px,2.2vw,38px)!important;
  padding-left:max(36px,calc((100vw - 1500px)/2))!important;
  padding-right:max(36px,calc((100vw - 1500px)/2))!important;
}
body.v8.v13.v14 .site-header{height:104px!important}
body.v8.v13.v14 .site-header.is-solid,
body.v8.v13.v14 .site-header.is-scrolled{height:88px!important}

body.v8.v13.v14 .brand{gap:16px!important}
body.v8.v13.v14 .brand img{
  width:70px!important;
  height:70px!important;
  object-fit:contain;
}
body.v8.v13.v14 .site-header.is-solid .brand img,
body.v8.v13.v14 .site-header.is-scrolled .brand img{
  width:60px!important;
  height:60px!important;
}
body.v8.v13.v14 .brand-copy{gap:4px!important}
body.v8.v13.v14 .brand-copy strong{
  font-family:"Space Grotesk",var(--display),sans-serif!important;
  font-size:19px!important;
  line-height:1.06!important;
  font-weight:600!important;
  letter-spacing:-.025em!important;
  color:#fff!important;
}
body.v8.v13.v14 .brand-copy small{
  font-family:"IBM Plex Mono",var(--mono),monospace!important;
  font-size:9px!important;
  line-height:1.2!important;
  font-weight:500!important;
  letter-spacing:.075em!important;
  color:#9FB5C7!important;
}

body.v8.v13.v14 .desktop-nav{
  gap:clamp(20px,1.7vw,30px)!important;
}
body.v8.v13.v14 .desktop-nav a{
  padding:39px 0 35px!important;
  font-family:"Inter",var(--body),sans-serif!important;
  font-size:12px!important;
  line-height:1!important;
  font-weight:650!important;
  letter-spacing:.035em!important;
  text-transform:uppercase!important;
}
body.v8.v13.v14 .site-header.is-solid .desktop-nav a,
body.v8.v13.v14 .site-header.is-scrolled .desktop-nav a{
  padding-top:31px!important;
  padding-bottom:29px!important;
}
body.v8.v13.v14 .desktop-nav a::after{
  bottom:22px!important;
  height:2px!important;
  background:#167BC4!important;
}
body.v8.v13.v14 .site-header.is-solid .desktop-nav a::after,
body.v8.v13.v14 .site-header.is-scrolled .desktop-nav a::after{bottom:16px!important}

body.v8.v13.v14 .header-cta{
  min-width:196px!important;
  height:54px!important;
  padding:0 20px!important;
  justify-content:center!important;
  font-family:"Inter",var(--body),sans-serif!important;
  font-size:11px!important;
  line-height:1!important;
  font-weight:650!important;
  letter-spacing:.045em!important;
  text-transform:uppercase!important;
}
body.v8.v13.v14 .header-cta span{font-size:18px!important}
body.v8.v13.v14 .subpage-main{padding-top:104px!important}

@media (min-width:1025px) and (max-width:1380px){
  body.v8.v13.v14{--vsk-header:98px}
  body.v8.v13.v14 .site-header{height:98px!important;padding-left:28px!important;padding-right:28px!important;gap:20px!important;grid-template-columns:minmax(250px,.72fr) auto auto!important}
  body.v8.v13.v14 .site-header.is-solid,
  body.v8.v13.v14 .site-header.is-scrolled{height:86px!important}
  body.v8.v13.v14 .brand img{width:64px!important;height:64px!important}
  body.v8.v13.v14 .site-header.is-solid .brand img,
  body.v8.v13.v14 .site-header.is-scrolled .brand img{width:56px!important;height:56px!important}
  body.v8.v13.v14 .brand-copy strong{font-size:17px!important}
  body.v8.v13.v14 .brand-copy small{font-size:8px!important}
  body.v8.v13.v14 .desktop-nav{gap:16px!important}
  body.v8.v13.v14 .desktop-nav a{font-size:11px!important;padding-top:36px!important;padding-bottom:33px!important}
  body.v8.v13.v14 .header-cta{min-width:176px!important;height:50px!important;font-size:10.5px!important;padding-inline:15px!important}
  body.v8.v13.v14 .subpage-main{padding-top:98px!important}
}

@media (max-width:1220px){
  body.v8.v13.v14 .site-header,
  body.v8.v13.v14 .site-header.is-solid,
  body.v8.v13.v14 .site-header.is-scrolled{grid-template-columns:1fr auto auto!important}
  body.v8.v13.v14 .desktop-nav{display:none!important}
  body.v8.v13.v14 .menu-toggle{display:block!important}
}

@media (max-width:760px){
  body.v8.v13.v14{--vsk-header:82px}
  body.v8.v13.v14 .site-header,
  body.v8.v13.v14 .site-header.is-solid,
  body.v8.v13.v14 .site-header.is-scrolled{
    height:82px!important;
    padding-left:16px!important;
    padding-right:12px!important;
    gap:10px!important;
    grid-template-columns:minmax(0,1fr) auto!important;
  }
  body.v8.v13.v14 .brand{gap:11px!important;min-width:0}
  body.v8.v13.v14 .brand img,
  body.v8.v13.v14 .site-header.is-solid .brand img,
  body.v8.v13.v14 .site-header.is-scrolled .brand img{width:52px!important;height:52px!important}
  body.v8.v13.v14 .brand-copy strong{
    max-width:min(245px,calc(100vw - 118px))!important;
    overflow:hidden!important;
    text-overflow:ellipsis!important;
    font-size:15px!important;
    white-space:nowrap!important;
  }
  body.v8.v13.v14 .brand-copy small{display:none!important}
  body.v8.v13.v14 .header-cta{display:none!important}
  body.v8.v13.v14 .menu-toggle{width:48px!important;height:48px!important;padding:11px!important}
  body.v8.v13.v14 .subpage-main{padding-top:82px!important}
  .hero-blue-layout{padding-top:126px!important}
}
'''
    p.write_text(s,encoding='utf-8')
print('larger original-V16 header treatment applied')
