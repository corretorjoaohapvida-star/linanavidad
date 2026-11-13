const markets={MX:['México','MXN'],CL:['Chile','CLP'],PE:['Perú','PEN'],EC:['Ecuador','USD'],AR:['Argentina','ARS'],CO:['Colombia','COP'],UY:['Uruguay','UYU'],PY:['Paraguay','PYG'],DO:['República Dominicana','DOP'],PH:['Filipinas','PHP'],BR:['Brasil','BRL'],ES:['España','EUR']};
let cache=null,inflight=null;
async function exchange(){
 if(cache&&Date.now()-cache.fetched<86400000)return cache;
 if(!inflight)inflight=(async()=>{const response=await fetch('https://open.er-api.com/v6/latest/USD',{signal:AbortSignal.timeout(4500)});if(!response.ok)throw Error('Exchange unavailable');const data=await response.json();if(data.result!=='success'||data.base_code!=='USD'||!data.rates||!Number.isFinite(data.time_last_update_unix)||Date.now()/1000-data.time_last_update_unix>259200)throw Error('Invalid exchange data');cache={rates:data.rates,asOf:data.time_last_update_utc,fetched:Date.now()};return cache;})().finally(()=>{inflight=null});
 return inflight;
}
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','X-Vercel-IP-Country');
 if(req.method!=='GET'){res.statusCode=405;res.setHeader('Allow','GET');return res.end();}
 const url=new URL(req.url,'https://local.test');const selected=url.searchParams.get('country');
 if(selected&&!markets[selected]){res.statusCode=400;return res.json({error:'País no admitido'});}
 const detected=String(req.headers['x-vercel-ip-country']||'').toUpperCase();
 const country=selected||(markets[detected]?detected:null);const currency=country?markets[country][1]:'USD';
 let rate=1,asOf=null,available=currency==='USD';
 if(currency!=='USD')try{const data=await exchange();if(Number.isFinite(data.rates[currency])&&data.rates[currency]>0){rate=data.rates[currency];asOf=data.asOf;available=true;}}catch{}
 const used=available?currency:'USD';const digits=['CLP','PYG'].includes(used)?0:2;const round=n=>Math.round((n+Number.EPSILON)*10**digits)/10**digits;
 res.json({country,source:selected?'manual':country?'ip':'unknown',currency:used,requestedCurrency:currency,available,approximate:used!=='USD',asOf,prices:{basico:round(3.9*rate),completo:round(12*rate),upgrade:round(7.9*rate)}});
};
