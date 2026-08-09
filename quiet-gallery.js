(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(()=>document.documentElement.classList.add('is-ready'));

  const rail=document.querySelector('[data-rail]');
  const pointer=document.querySelector('[data-pointer]');
  const counter=document.querySelector('[data-counter]');
  const works=[...document.querySelectorAll('[data-work]')];
  if(!rail)return;

  let down=false,startX=0,startScroll=0,moved=false;
  const setPointer=(x,y,show=true)=>{
    if(!pointer)return;
    pointer.style.left=`${x}px`;
    pointer.style.top=`${y}px`;
    pointer.classList.toggle('is-visible',show);
  };

  rail.addEventListener('pointerdown',e=>{
    down=true;moved=false;startX=e.clientX;startScroll=rail.scrollLeft;
    rail.classList.add('is-dragging');rail.setPointerCapture?.(e.pointerId);
  });
  rail.addEventListener('pointermove',e=>{
    setPointer(e.clientX,e.clientY,true);
    if(!down)return;
    const dx=e.clientX-startX;
    if(Math.abs(dx)>4)moved=true;
    rail.scrollLeft=startScroll-dx;
  });
  const end=()=>{down=false;rail.classList.remove('is-dragging')};
  rail.addEventListener('pointerup',end);rail.addEventListener('pointercancel',end);rail.addEventListener('pointerleave',e=>{end();setPointer(e.clientX,e.clientY,false)});
  rail.addEventListener('mouseenter',e=>setPointer(e.clientX,e.clientY,true));

  rail.addEventListener('wheel',e=>{
    if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){
      e.preventDefault();rail.scrollLeft+=e.deltaY;
    }
  },{passive:false});

  works.forEach(work=>{
    work.addEventListener('click',e=>{
      if(moved){e.preventDefault();moved=false;}
    });
  });

  const updateCounter=()=>{
    if(!counter||!works.length)return;
    const center=rail.scrollLeft+rail.clientWidth/2;
    let best=0,dist=Infinity;
    works.forEach((el,i)=>{
      const c=el.offsetLeft+el.offsetWidth/2;
      const d=Math.abs(c-center);
      if(d<dist){dist=d;best=i;}
    });
    counter.textContent=String(best+1).padStart(2,'0');
  };
  rail.addEventListener('scroll',updateCounter,{passive:true});
  addEventListener('resize',updateCounter,{passive:true});
  updateCounter();

  if(reduce)document.documentElement.classList.add('reduce-motion');
})();