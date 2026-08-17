from pathlib import Path
p=Path('v16-blue-refinement.css')
s=p.read_text(encoding='utf-8')
marker='/* V16 BLUE DEEP COMPONENT CLEANUP */'
if marker not in s:
    s += r'''

/* V16 BLUE DEEP COMPONENT CLEANUP */
/* Featured engineering: remove all warm-green remnants from the old final pass. */
body.v8.v13.v14 .projects-showcase .section-intro .kicker{color:#B7D7F2!important}
body.v8.v13.v14 .projects-showcase .section-intro h2 em{color:#45A9E8!important}
body.v8.v13.v14 .featured-case{
  border-top-color:rgba(183,215,242,.24)!important;
  border-bottom-color:rgba(183,215,242,.18)!important;
}
body.v8.v13.v14 .featured-case-media{
  background:#091824!important;
  border-right-color:rgba(183,215,242,.16)!important;
  border-bottom-color:rgba(183,215,242,.16)!important;
}
body.v8.v13.v14 .featured-case-copy{
  background:#111F2E!important;
  border-left-color:#167BC4!important;
  border-top-color:#167BC4!important;
}
body.v8.v13.v14 .featured-case-copy>.kicker{color:#45A9E8!important}
body.v8.v13.v14 .featured-facts{
  border-top-color:rgba(183,215,242,.20)!important;
  border-bottom-color:rgba(183,215,242,.20)!important;
}
body.v8.v13.v14 .featured-facts span{border-right-color:rgba(183,215,242,.14)!important;border-bottom-color:rgba(183,215,242,.14)!important}
body.v8.v13.v14 .featured-facts small{color:#B7D7F2!important;border-color:#B7D7F2!important}
body.v8.v13.v14 .featured-case-copy .text-arrow{border-bottom-color:#6CAEDF!important;color:#E5EEF5!important}
body.v8.v13.v14 .featured-case-copy .text-arrow span{color:#45A9E8!important}
body.v8.v13.v14 .selected-projects-strip .project-collection-head{
  border-top-color:rgba(183,215,242,.18)!important;
  border-bottom-color:rgba(183,215,242,.14)!important;
  color:#B7D7F2!important;
}
body.v8.v13.v14 .selected-projects-strip .project-collection-head span{color:#B7D7F2!important}
body.v8.v13.v14 .selected-projects-strip .project-card{border-color:rgba(183,215,242,.16)!important;background:#0A1723!important}
body.v8.v13.v14 .selected-projects-strip .project-card .project-shade{
  background:linear-gradient(0deg,rgba(6,18,29,.94) 0%,rgba(6,18,29,.55) 42%,rgba(6,18,29,.08) 76%),linear-gradient(90deg,rgba(6,18,29,.2),transparent 55%)!important;
}
body.v8.v13.v14 .selected-projects-strip .project-card .project-label{border-color:rgba(183,215,242,.20)!important;background:rgba(8,24,39,.74)!important;color:#B7D7F2!important}
body.v8.v13.v14 .selected-projects-strip .project-card small{color:#AFC9DC!important;border-color:#AFC9DC!important}
body.v8.v13.v14 .selected-projects-strip .project-card .project-copy i{color:#45A9E8!important}
body.v8.v13.v14 .featured-case-media:focus-visible,
body.v8.v13.v14 .selected-projects-strip .project-card:focus-visible{outline-color:#45A9E8!important}

/* Retrofit: use technical navy/blue rather than green-black. */
body.v8.v13.v14 .retrofit-overlay{
  background:linear-gradient(90deg,rgba(6,18,29,.97) 0%,rgba(6,18,29,.84) 34%,rgba(6,18,29,.43) 61%,rgba(6,18,29,.12) 82%,rgba(6,18,29,.36) 100%),linear-gradient(0deg,rgba(5,15,25,.42),transparent 46%)!important;
}
body.v8.v13.v14 .retrofit-inner>.kicker{color:#B7D7F2!important}
body.v8.v13.v14 .retrofit-inner h2 em{color:#45A9E8!important}
body.v8.v13.v14 .retrofit-facts{border-top-color:rgba(183,215,242,.22)!important;border-bottom-color:rgba(183,215,242,.22)!important}
body.v8.v13.v14 .retrofit-facts span{color:#B7D7F2!important;border-color:#B7D7F2!important}
body.v8.v13.v14 .retrofit-facts span+span{border-left-color:rgba(183,215,242,.16)!important;border-top-color:rgba(183,215,242,.16)!important}
body.v8.v13.v14 .retrofit-actions .btn-light{border-color:#167BC4!important;background:#167BC4!important;color:#fff!important}
body.v8.v13.v14 .retrofit-actions .btn-light:hover{border-color:#164A9C!important;background:#164A9C!important}
body.v8.v13.v14 .retrofit-actions .btn-ghost-light{background:rgba(8,24,39,.24)!important}

/* Process sequence. */
body.v8.v13.v14 .process .section-intro .kicker{color:#164A9C!important}
body.v8.v13.v14 .process .section-intro h2 em{color:#164A9C!important}
body.v8.v13.v14 .process-line>i{background:linear-gradient(90deg,#164A9C,#45A9E8)!important}
body.v8.v13.v14 .process-line article:hover{background:rgba(22,123,196,.035)!important}
body.v8.v13.v14 .process-line article::after{border-color:#167BC4!important;background:#F5F7F9!important}
body.v8.v13.v14 .process-line span{color:#164A9C!important;border-color:#164A9C!important}

/* Company/About. */
body.v8.v13.v14 .about-copy>.kicker{color:#164A9C!important}
body.v8.v13.v14 .about-copy h2 em{color:#164A9C!important}
body.v8.v13.v14 .about-copy blockquote{border-left-color:#167BC4!important;color:#273A4B!important}
body.v8.v13.v14 .about-mini-stats strong{color:#164A9C!important}
body.v8.v13.v14 .about-actions .text-arrow:hover{color:#167BC4!important}

/* Contact / conversion. */
body.v8.v13.v14 .contact-copy>.kicker{color:#B7D7F2!important}
body.v8.v13.v14 .contact-copy h2 em{color:#45A9E8!important}
body.v8.v13.v14 .contact-actions{border-top-color:rgba(183,215,242,.22)!important}
body.v8.v13.v14 .contact-main,
body.v8.v13.v14 .contact-secondary{border-bottom-color:rgba(183,215,242,.16)!important}
body.v8.v13.v14 .contact-main{color:#DCE8F1!important}
body.v8.v13.v14 .contact-main i,
body.v8.v13.v14 .contact-secondary i{color:#45A9E8!important}
body.v8.v13.v14 .contact-main:hover,
body.v8.v13.v14 .contact-secondary:hover{background:rgba(22,123,196,.055)!important}
body.v8.v13.v14 .contact-direct a{color:#DCE8F1!important}

/* Footer and interaction details missed by the broad layer. */
body.v8.v13.v14 .footer-brand button{border-bottom-color:#6CAEDF!important}
body.v8.v13.v14 .file-drop em{color:#164A9C!important}
body.v8.v13.v14 .quote-success>span{color:#164A9C!important}
body.v8.v13.v14 .quote-step textarea:focus,
body.v8.v13.v14 .quote-step input:focus{border-color:#167BC4!important;box-shadow:0 0 0 2px rgba(22,123,196,.08)!important}
body.v8.v13.v14 .dossier-media{background:#081827!important}
body.v8.v13.v14 .dossier-media img,
body.v8.v13.v14 .dossier-media video{background:#071521!important}
body.v8.v13.v14 .lightbox-caption span{color:#45A9E8!important}

@media (max-width:700px){
  body.v8.v13.v14 .retrofit-overlay{
    background:linear-gradient(0deg,rgba(6,18,29,.98) 0%,rgba(6,18,29,.88) 43%,rgba(6,18,29,.36) 73%,rgba(6,18,29,.2) 100%),linear-gradient(90deg,rgba(6,18,29,.58),rgba(6,18,29,.08))!important;
  }
}
'''
    p.write_text(s,encoding='utf-8')
print('deep blue component cleanup applied')
