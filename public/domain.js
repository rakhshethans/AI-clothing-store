export const money = p => new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:p%100?2:0}).format(p/100);
export function searchProducts(catalog, filters={}) {
  const words=(filters.query||'').trim().toLowerCase().split(/\s+/).filter(Boolean);
  const result=catalog.filter(p => {
    const text=[p.name,p.category,p.colour,p.description,p.style].join(' ').toLowerCase();
    return words.every(w=>text.includes(w)) && (!filters.category||p.category===filters.category) &&
      (!filters.retailer||p.retailerId===filters.retailer) && (!filters.colour||p.colour===filters.colour) &&
      (filters.maxPrice===undefined||p.price<=filters.maxPrice) &&
      (!filters.size||(p.stock==='in_stock'&&p.availableSizes.includes(filters.size))) &&
      (!filters.onlyAvailable||p.stock==='in_stock');
  });
  if(filters.sort==='price-low') result.sort((a,b)=>a.price-b.price||a.id.localeCompare(b.id));
  if(filters.sort==='price-high') result.sort((a,b)=>b.price-a.price||a.id.localeCompare(b.id));
  return result;
}
export function basketTotal(items,retailers) {
  const subtotals=new Map();
  for(const p of items) subtotals.set(p.retailerId,(subtotals.get(p.retailerId)||0)+p.price);
  let delivery=0; const groups=[];
  for(const [id,subtotal] of subtotals) {
    const retailer=retailers.find(r=>r.id===id);
    if(!retailer||!Number.isInteger(retailer.delivery)) return {complete:false,subtotal:items.reduce((s,p)=>s+p.price,0),delivery:null,total:null,groups:[]};
    const fee=Number.isInteger(retailer.freeOver)&&subtotal>=retailer.freeOver?0:retailer.delivery;
    groups.push({retailer,subtotal,delivery:fee}); delivery+=fee;
  }
  const subtotal=items.reduce((s,p)=>s+p.price,0);
  return {complete:true,subtotal,delivery,total:subtotal+delivery,groups};
}
export function planOutfit(catalog,retailers,{budget=15000,owned=[],style='minimal',size='',preferred=[]}={}) {
  if(!Number.isInteger(budget)||budget<0) throw new Error('Budget must be non-negative integer pence.');
  const slots=['tops','bottoms','layers'].filter(s=>!owned.includes(s));
  if(!slots.length) return {status:'owned',items:[],cost:basketTotal([],retailers)};
  const pool=slots.map(slot=>catalog.filter(p=>p.category===slot&&p.stock==='in_stock'&&(!size||p.availableSizes.includes(size))).sort((a,b)=>(preferred.includes(b.id)?10:0)+(b.style===style?2:0)-(preferred.includes(a.id)?10:0)-(a.style===style?2:0)||a.price-b.price).slice(0,12));
  if(pool.some(a=>!a.length)) return {status:'unavailable',items:[],missing:slots.filter((_,i)=>!pool[i].length)};
  let best=null,cheapest=null;
  function visit(items,index) {
    if(index<pool.length) {for(const p of pool[index]) visit([...items,p],index+1);return;}
    const cost=basketTotal(items,retailers); if(!cost.complete)return;
    const score=items.reduce((s,p)=>s+(p.style===style?2:0)+(preferred.includes(p.id)?10:0),0)-cost.groups.length*.2;
    const candidate={items,cost,score};
    if(!cheapest||cost.total<cheapest.cost.total)cheapest=candidate;
    if(cost.total<=budget&&(!best||score>best.score||(score===best.score&&cost.total<best.cost.total))) best=candidate;
  }
  visit([],0);
  return best?{status:'ok',...best}:cheapest?{status:'over-budget',...cheapest}:{status:'unavailable',items:[]};
}
export function validateCatalog(records,rights) {
  if(!rights||rights.display!==true||!rights.reference)throw new Error('A documented display permission is required.');
  if(!Array.isArray(records)||!records.length)throw new Error('Empty catalogue rejected; last good snapshot retained.');
  const ids=new Set();
  for(const p of records) {
    if(!p.id||ids.has(p.id))throw new Error('Missing or duplicate source ID.'); ids.add(p.id);
    if(!p.name||!['tops','bottoms','layers','shoes','accessories'].includes(p.category))throw new Error('Invalid product fields.');
    if(!Number.isInteger(p.price)||p.price<0||p.currency!=='GBP')throw new Error('Invalid GBP minor-unit price.');
    if(!['in_stock','out_of_stock','unknown'].includes(p.stock))throw new Error('Invalid stock status.');
    if(!Array.isArray(p.availableSizes))throw new Error('Available sizes must be explicit.');
    if(!p.observedAt||!Number.isFinite(Date.parse(p.observedAt)))throw new Error('Observation timestamp required.');
    const u=new URL(p.url); if(u.protocol!=='https:')throw new Error('HTTPS product URL required.');
    if(!rights.allowedDomains?.includes(u.hostname))throw new Error('Product domain is not permitted.');
  }
  return records;
}
