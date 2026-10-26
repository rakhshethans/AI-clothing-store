// Optional actual-model QA. No annotations are available to the browser or detector.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.THREADLINE_PLAYWRIGHT_MODULE||'playwright');
const contexts=[],unexpectedRequests=[],errors=[];
const root=new URL('../',import.meta.url);
const photo=await fs.readFile(new URL('private-data/recognition-benchmark/2083.jpg',root));
const browser=await chromium.launch({headless:true,...(process.env.THREADLINE_CHROME?{executablePath:process.env.THREADLINE_CHROME}:{})});
const report={date:new Date().toISOString().slice(0,10),scope:'Runtime correctness and metadata independence, not an accuracy benchmark.',fixture:'One real public photograph and a generated uniform control. No expected detections supplied.',paidApiCalls:0};
async function context(isolated=true){
 const c=await browser.newContext({serviceWorkers:'block'});contexts.push(c);
 c.on('request',r=>{const u=new URL(r.url());if((!['data:','blob:'].includes(u.protocol)&&!(u.protocol==='http:'&&u.hostname==='127.0.0.1')&&!/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(r.url()))||r.method()!=='GET')unexpectedRequests.push({url:r.url(),method:r.method()});});
 await c.route('https://**',r=>r.abort());
 // Exercise the supported single-thread path without changing production code.
 if(!isolated)await c.route('http://127.0.0.1:4187/',async r=>{const response=await r.fetch();const headers=response.headers();delete headers['cross-origin-opener-policy'];delete headers['cross-origin-embedder-policy'];await r.fulfill({response,headers});});
 const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:4187/');return p;
}
try{
 const page=await context();
 report.parallel=await page.evaluate(async base64=>{
  const {recogniseLocalPhoto,stopLocalRecognition}=await import('/wardrobe-recognition.js');
  const bytes=Uint8Array.from(atob(base64),v=>v.charCodeAt(0));
  const inputs=[];
  // Same pixels, conflicting names and timestamps. Neither enters the model contract.
  for(const name of ['red-dress.jpg','blue-shoes.jpg']){
   const file=new File([bytes],name,{type:'image/jpeg',lastModified:name.startsWith('red')?0:Date.now()});
   const bitmap=await createImageBitmap(file),c=document.createElement('canvas');
   const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));c.width=Math.round(bitmap.width*scale);c.height=Math.round(bitmap.height*scale);c.getContext('2d').drawImage(bitmap,0,0,c.width,c.height);bitmap.close();inputs.push(c.toDataURL('image/jpeg',.85));
  }
  const flat=document.createElement('canvas');flat.width=flat.height=600;flat.getContext('2d').fillRect(0,0,600,600);
  const started=performance.now();
  const [a,blank,b]=await Promise.all([recogniseLocalPhoto(inputs[0]),recogniseLocalPhoto(flat.toDataURL()),recogniseLocalPhoto(inputs[1])]);
  const result={crossOriginIsolated,hardwareConcurrency:navigator.hardwareConcurrency,equalPixels:inputs[0]===inputs[1],equalDetections:JSON.stringify(a)===JSON.stringify(b),detectedPieces:a.items.length,blankPieces:blank.items.length,milliseconds:Math.round(performance.now()-started),items:a.items};
  stopLocalRecognition();
  // Cancel an active request while another is queued. Both promises must settle.
  const controller=new AbortController();let loading=false;
  const pending=recogniseLocalPhoto(inputs[0],{signal:controller.signal,onProgress(){loading=true;controller.abort();}}).then(()=>false,e=>e.name==='AbortError');
  const queued=recogniseLocalPhoto(flat.toDataURL());
  result.activeCancel=await pending;result.cancelledDuringLoading=loading;result.queuedSurvivesCancel=(await queued).items.length===0;stopLocalRecognition();
  return result;
 },photo.toString('base64'));
 assert.equal(report.parallel.equalPixels,true);assert.equal(report.parallel.equalDetections,true);assert.ok(report.parallel.detectedPieces>0);assert.equal(report.parallel.blankPieces,0);assert.equal(report.parallel.activeCancel,true);assert.equal(report.parallel.queuedSurvivesCancel,true);
 const fallback=await context(false);
 report.singleThreadFallback=await fallback.evaluate(async base64=>{
  const {recogniseLocalPhoto,stopLocalRecognition}=await import('/wardrobe-recognition.js');
  const {recognitionThreadCount}=await import('/wardrobe-recognition-domain.js');
  const bitmap=await createImageBitmap(await(await fetch('data:image/jpeg;base64,'+base64)).blob());const c=document.createElement('canvas');const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));c.width=Math.round(bitmap.width*scale);c.height=Math.round(bitmap.height*scale);c.getContext('2d').drawImage(bitmap,0,0,c.width,c.height);bitmap.close();
  const output=await recogniseLocalPhoto(c.toDataURL('image/jpeg',.85));stopLocalRecognition();
  return {crossOriginIsolated,requestedWasmThreads:recognitionThreadCount({isolated:crossOriginIsolated,sharedMemory:typeof SharedArrayBuffer!=='undefined',cores:navigator.hardwareConcurrency}),items:output.items};
 },photo.toString('base64'));
 assert.equal(report.singleThreadFallback.crossOriginIsolated,false);assert.equal(report.singleThreadFallback.requestedWasmThreads,1);
 // Parallel arithmetic may have tiny float differences; category/box equivalence is checked separately from confidence.
 assert.equal(report.parallel.items.length,report.singleThreadFallback.items.length);
 for(let i=0;i<report.parallel.items.length;i++){
  const a=report.parallel.items[i],b=report.singleThreadFallback.items[i];assert.equal(a.category,b.category);
  for(const key of ['x','y','width','height'])assert.ok(Math.abs(a.box[key]-b.box[key])<.001);
 }
 report.requestsOutsideLocalGet=unexpectedRequests;report.pageErrors=errors;assert.equal(errors.length,0);assert.equal(unexpectedRequests.length,0);report.passed=true;
 await fs.writeFile(new URL('operations/recognition-runtime-qa-'+report.date+'.json',root),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await Promise.all(contexts.map(c=>c.close()));await browser.close();}
