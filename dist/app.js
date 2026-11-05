(()=>{const config=window.OFERTA_CONFIG||{};document.querySelectorAll('[data-checkout]').forEach(a=>{const url=config.checkouts?.[a.dataset.checkout]||'';if(/^https?:\/\//.test(url)){a.href=url;a.removeAttribute('aria-disabled')}else{a.href='#checkout-pendiente';a.addEventListener('click',e=>e.preventDefault());}});document.querySelectorAll('.faq-item').forEach(d=>d.addEventListener('toggle',()=>{d.querySelector('summary span').textContent=d.open?'−':'+'}));const dialog=document.querySelector('.image-dialog');let trigger,overflow;document.querySelectorAll('main img').forEach(img=>{if(img.closest('[aria-hidden="true"],[data-craft-select],.payment-logos'))return;img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Ampliar foto: '+img.alt);const open=()=>{trigger=img;overflow=document.body.style.overflow;dialog.querySelector('img').src=img.src;dialog.querySelector('img').alt=img.alt;dialog.showModal();document.body.style.overflow='hidden'};img.addEventListener('click',open);img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})});dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog.addEventListener('close',()=>{document.body.style.overflow=overflow||'';trigger?.focus({preventScroll:true})});})();
document.querySelectorAll(".marquee-mask").forEach(mask=>{mask.addEventListener("pointerdown",()=>{mask.querySelector(".marquee-track").style.animationPlayState="paused"},{passive:true});mask.querySelectorAll("img").forEach(i=>i.draggable=false);});


// Conta apenas cliques reais em checkout. Purchase deve vir da Hotmart/Conversions API.
document.querySelectorAll('a[data-checkout]').forEach(link=>{
  link.addEventListener('click',()=>{
    if(typeof window.fbq==='function')window.fbq('track','InitiateCheckout',{
      content_name: link.dataset.checkout==='basico'?'Mini Biblia Navidad':'Pack Navidad Completo',
      content_category:'Produto digital',
    });
  });
});
