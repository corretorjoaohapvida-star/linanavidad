(() => {
  'use strict';
  const config = window.OFERTA_CONFIG || {};
  const url = config.checkouts?.downsell;
  if (typeof url !== 'string' || !/^https:\/\/pay\.hotmart\.com\//.test(url)) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'mx-upgrade';
  dialog.setAttribute('aria-labelledby', 'downsell-title');
  dialog.innerHTML = `
    <button type="button" class="upgrade-close" aria-label="Cerrar oferta">×</button>
    <p class="upgrade-eyebrow">UNA OPCIÓN ESPECIAL PARA TI</p>
    <h2 id="downsell-title">¿Prefieres empezar por la Mini Biblia?</h2>
    <p>También puedes comenzar con una colección de Mini Biblias navideñas para imprimir, armar y compartir.</p>
    <div class="upgrade-price"><span>Disponible en una condición especial en Hotmart</span>
      <strong style="font-size:28px">Mini Biblia navideña</strong>
      <small>Consulta el importe final y la moneda en la página segura de pago.</small>
    </div>
    <a class="btn-base btn-success upgrade-accept" data-checkout="downsell" href="${url}">VER MI OFERTA ESPECIAL</a>
    <button type="button" class="upgrade-decline" style="background:none;border:0;cursor:pointer;width:100%">Seguir viendo la colección</button>
    <p class="upgrade-note">Producto digital. La oferta especial es para la Mini Biblia, no para la colección completa.</p>
  `;
  document.body.appendChild(dialog);
  let shown = false;
  let priceSeen = false;
  let previousOverflow='';
  const pricing = document.getElementById('pricing');
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry=>entry.isIntersecting)) priceSeen=true;
  }, {threshold:.08});
  if (pricing) observer.observe(pricing);
  const close=()=>dialog.close();
  function open(){
    if(dialog.open)return;
    shown=true;
    previousOverflow=document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow='hidden';
  }
  document.querySelectorAll('[data-open-downsell]').forEach(button=>button.addEventListener('click',open));
  document.addEventListener('mouseout', e=>{
    if(!priceSeen || shown || window.innerWidth<800)return;
    if(e.clientY <= 0 && !e.relatedTarget)open();
  });
  dialog.querySelector('.upgrade-close').addEventListener('click',close);
  dialog.querySelector('.upgrade-decline').addEventListener('click',close);
  dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
  dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow});
  dialog.querySelector('[data-checkout]').addEventListener('click',()=>{
    if(typeof window.fbq === 'function')window.fbq('track','InitiateCheckout',{content_name:'Mini Biblia Navidad - oferta especial'});
  });
})();
