(() => {
 'use strict';
 const config=window.OFERTA_CONFIG||{},prices=config.prices||{};
 const basic=Number(prices.basico),full=Number(prices.completo),upgrade=Number(prices.upgrade);
 if(![basic,full,upgrade].every(n=>Number.isFinite(n)&&n>0))return;
 const money=n=>'MX$'+n.toLocaleString('es-MX',{minimumFractionDigits:2,maximumFractionDigits:2});
 const dialog=document.createElement('dialog');dialog.className='mx-upgrade';dialog.setAttribute('aria-labelledby','upgrade-title');
 dialog.innerHTML='<button type="button" class="upgrade-close" aria-label="Cerrar oferta">×</button><p class="upgrade-eyebrow">UNA CONDICIÓN ESPECIAL PARA TI</p><h2 id="upgrade-title">¿Solo la Mini Biblia?<br>Llévate la colección completa.</h2><p>En lugar de pagar <strong>'+money(basic)+'</strong> por los archivos de la Mini Biblia, agrega <strong>'+money(upgrade-basic)+'</strong> y llévate todas las piezas del Pack de Navidad.</p><div class="upgrade-price"><span>Colección completa <del>'+money(full)+'</del></span><strong>'+money(upgrade)+'</strong><small>Total por la colección completa. No es un cargo adicional de '+money(upgrade)+'.</small></div><p>Mini Biblia, libreta, mini calendario, diseños para taza, canasta y empaques que combinan. Archivos digitales para imprimir y armar.</p><a class="btn-base btn-success upgrade-accept" href="#checkout-upgrade-pendiente" aria-disabled="true">SÍ, QUIERO EL COMPLETO POR '+money(upgrade)+'</a><a class="upgrade-decline" href="#checkout-basico-pendiente">No, gracias. Solo la Mini Biblia por '+money(basic)+'</a><p class="upgrade-note">Pago único. Impresión, materiales y piezas físicas no incluidos.</p>';
 document.body.append(dialog);let trigger,previousOverflow;
 function destination(plan){const url=config.checkouts?.[plan];return typeof url==='string'&&/^https:\/\/pay\.hotmart\.com\//.test(url)?(window.hotmartDestination?window.hotmartDestination(url):url):null;}
 const accept=dialog.querySelector('.upgrade-accept'),decline=dialog.querySelector('.upgrade-decline');
 const upgradeURL=destination('upgrade'),basicURL=destination('basico');
 if(upgradeURL){accept.href=upgradeURL;accept.removeAttribute('aria-disabled');}else{accept.title='Enlace de Hotmart pendiente de configurar';accept.addEventListener('click',e=>e.preventDefault());}
 if(basicURL)decline.href=basicURL;else{decline.setAttribute('aria-disabled','true');decline.title='Enlace de Hotmart pendiente de configurar';decline.addEventListener('click',e=>e.preventDefault());}
 function close(){dialog.close();}
 dialog.querySelector('.upgrade-close').addEventListener('click',close);
 dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow||'';trigger?.focus({preventScroll:true});});
 document.addEventListener('click',e=>{const anchor=e.target.closest('[data-checkout="basico"]');if(!anchor)return;e.preventDefault();e.stopImmediatePropagation();trigger=anchor;previousOverflow=document.body.style.overflow;dialog.showModal();document.body.style.overflow='hidden';},true);
})();
