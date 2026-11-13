(()=>{'use strict';
const countries=['MX','CL','PE','EC','AR','CO','UY','PY','DO','PH','BR','ES'];
const locales={MX:'es-MX',CL:'es-CL',PE:'es-PE',EC:'es-EC',AR:'es-AR',CO:'es-CO',UY:'es-UY',PY:'es-PY',DO:'es-DO',PH:'es-PH',BR:'pt-BR',ES:'es-ES'};
let state={country:null,currency:'USD',approximate:false,prices:{basico:3.9,completo:12,upgrade:7.9}};
function money(n){const digits=['CLP','PYG'].includes(state.currency)?0:2;return new Intl.NumberFormat(locales[state.country]||'es-419',{style:'currency',currency:state.currency,currencyDisplay:'symbol',minimumFractionDigits:digits,maximumFractionDigits:digits}).format(n);}
function valid(data){return data&&['USD','MXN','CLP','PEN','ARS','COP','UYU','PYG','DOP','PHP','BRL','EUR'].includes(data.currency)&&['basico','completo','upgrade'].every(k=>Number.isFinite(data.prices?.[k])&&data.prices[k]>0);}
function apply(data){state=data;window.LINA_MARKET.state=state;
 document.querySelectorAll('[data-money]').forEach(el=>{const key=el.dataset.money;const amount=key==='difference'?state.prices.completo-state.prices.basico:key==='upgradeDifference'?state.prices.upgrade-state.prices.basico:state.prices[key];if(Number.isFinite(amount))el.textContent=money(amount);});
 document.querySelectorAll('.local-price-note').forEach(el=>el.textContent=state.approximate?'Conversión aproximada. Total confirmado en Hotmart.':'Precio base en USD. Total confirmado en Hotmart.');
 document.dispatchEvent(new CustomEvent('lina:market-change',{detail:state}));
}
window.LINA_MARKET={state,money};
document.querySelectorAll('.plan-price').forEach(el=>{const note=document.createElement('p');note.className='local-price-note';el.after(note);});apply(state);
async function quote(country){const response=await fetch('/api/market'+(country?'?country='+encodeURIComponent(country):''),{cache:'no-store',signal:AbortSignal.timeout(6500)});if(!response.ok)throw Error('Market unavailable');const data=await response.json();if(!valid(data))throw Error('Invalid prices');return data;}
(async()=>{
 try{const first=await quote();if(first.country){apply(first);return;}}catch{}
 // Local/static preview has no hosting geo header: resolve the visitor's IP in their browser.
 try{const response=await fetch('https://api.country.is/',{signal:AbortSignal.timeout(3500)});if(!response.ok)throw Error('Geo unavailable');const geo=await response.json();if(countries.includes(geo.country)){const data=await quote(geo.country);data.source='ip-fallback';apply(data);return;}}catch{}
 // Never reuse a manual country stored by an earlier version.
 apply(state);
})();
})();