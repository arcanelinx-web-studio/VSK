(() => {
  'use strict';
  if (document.body.dataset.page !== 'home') return;

  const apply = () => {
    document.getElementById('v16-bottom-space-lock')?.remove();
    const style = document.createElement('style');
    style.id = 'v16-bottom-space-lock';
    style.textContent = `
      html body.v8.v13.v14[data-page="home"] .engineering-depth .archive-callout{
        padding-bottom:60px!important;
      }
      html body.v8.v13.v14[data-page="home"] .engineering-depth .archive-callout .btn{
        margin-bottom:0!important;
      }
      @media (max-width:1599px){
        html body.v8.v13.v14[data-page="home"] .engineering-depth .archive-callout{padding-bottom:56px!important}
      }
      @media (max-width:1180px){
        html body.v8.v13.v14[data-page="home"] .engineering-depth .archive-callout{padding-bottom:50px!important}
      }
      @media (max-width:760px){
        html body.v8.v13.v14[data-page="home"] .engineering-depth .archive-callout{padding-bottom:44px!important}
      }
    `;
    document.head.appendChild(style);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, {once:true});
  else apply();
  window.addEventListener('load', apply, {once:true});
})();