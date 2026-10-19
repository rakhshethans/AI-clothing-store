export function retailerLink(value){
  let url;try{url=new URL(String(value).trim());}catch{throw new Error('Add a complete retailer link, starting with https://.');}
  if(url.protocol!=='https:'||url.username||url.password||!url.hostname.includes('.')||/^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(url.hostname)||url.hostname.includes(':'))throw new Error('Use a public HTTPS retailer link without login details.');
  return url.href;
}
export function createGarment({name,retailer,url,price='',kind='linked'}){
  name=String(name||'').trim();retailer=String(retailer||'').trim();
  if(!name||name.length>80||!retailer||retailer.length>60)throw new Error('Add a piece name and retailer (up to 80 and 60 characters).');
  let pence=null;
  if(String(price).trim()!==''){const amount=Number(price);if(!Number.isFinite(amount)||amount<0||amount>10000)throw new Error('Enter a price between £0 and £10,000, or leave it blank.');pence=Math.round(amount*100);}
  return {name,retailer,url:retailerLink(url),price:pence,kind:kind==='similar'?'similar':'linked'};
}
export function createLocalProfile(name,handle){
  name=String(name||'').trim();handle=String(handle||'').trim().toLowerCase().replace(/^@/,'');
  if(!name||name.length>40)throw new Error('Choose a display name up to 40 characters.');
  if(!/^[a-z0-9_.]{3,24}$/.test(handle))throw new Error('Use 3–24 letters, numbers, dots or underscores for your handle.');
  return {name,handle};
}
export function uploadProblem(file){
  if(!['image/jpeg','image/png','image/webp'].includes(file.type))return 'Choose JPEG, PNG or WebP photos.';
  if(file.size>5*1024*1024)return 'Each photo must be 5 MB or smaller.';
  return '';
}
export function photoPieces(post,index){return post.photos[index]?.pieces||[];}
