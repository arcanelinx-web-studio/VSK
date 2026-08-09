(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ready=()=>document.body.classList.add('is-ready');
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();

  const stage=document.querySelector('[data-stage]');
  const image=stage?.querySelector('.hero-image');
  const plaque=stage?.querySelector('.project-plaque');
  if(stage&&image&&plaque&&!reduce){
    stage.addEventListener('pointermove',e=>{
      const r=stage.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      image.style.transform=`scale(1.008) translate(${x*-5}px,${y*-4}px)`;
      plaque.style.transform=`translate(${x*3}px,${y*3}px)`;
    });
    stage.addEventListener('pointerleave',()=>{
      image.style.transform='';
      plaque.style.transform='';
    });
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
      },{threshold:.16});
      io.observe(transition);
    }
  }
})();