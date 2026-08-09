(()=>{
  const ready=()=>document.body.classList.add('is-ready');
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();

  const rows=[...document.querySelectorAll('.scope-row')];
  rows.forEach(row=>{
    const activate=()=>{
      rows.forEach(item=>item.classList.remove('is-active'));
      row.classList.add('is-active');
    };
    row.addEventListener('mouseenter',activate);
    row.addEventListener('focus',activate);
  });
})();