(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ready=()=>document.body.classList.add('is-ready');
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();

  const orbit=document.querySelector('[data-orbit]');
  if(orbit&&!reduce){
    const stage=orbit.closest('.image-stage');
    stage?.addEventListener('pointermove',e=>{
      const r=stage.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      orbit.style.transform=`translate(${x*10}px,${y*10}px)`;
    });
    stage?.addEventListener('pointerleave',()=>orbit.style.transform='');
  }

  const disciplines=[...document.querySelectorAll('.discipline')];
  disciplines.forEach(item=>{
    const activate=()=>{
      disciplines.forEach(d=>d.classList.remove('is-active'));
      item.classList.add('is-active');
    };
    item.addEventListener('mouseenter',activate);
    item.addEventListener('focus',activate);
  });

  if(!reduce&&'IntersectionObserver'in window){
    const transition=document.querySelector('.transition');
    if(transition){
      const io=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            transition.classList.add('is-visible');
            io.disconnect();
          }
        });
      },{threshold:.2});
      io.observe(transition);
    }
  }
})();