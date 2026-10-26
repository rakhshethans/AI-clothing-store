// Optional developer benchmark. Requires Playwright; downloads/inference are local/free.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {evaluatePhoto,summariseRecognition} from './recognition-evaluation.mjs';
const {chromium}=await import(process.env.THREADLINE_PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url),data=new URL('private-data/recognition-benchmark/',root);
const manifest=JSON.parse(await fs.readFile(new URL('manifest.json',data),'utf8'));
const launch={headless:true};if(process.env.THREADLINE_CHROME)launch.executablePath=process.env.THREADLINE_CHROME;
const browser=await chromium.launch(launch);
const context=await browser.newContext({viewport:{width:390,height:844}});
const remoteAttempts=[],postRequests=[],errors=[];
context.on('request',r=>{if(r.method()!=='GET')postRequests.push({url:r.url(),method:r.method()});});
await context.route('**/*',route=>{const url=new URL(route.request().url());if(url.hostname==='127.0.0.1'||url.protocol==='data:')return route.continue();remoteAttempts.push(url.origin);return route.abort();});
const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
const runDate=new Date().toISOString().slice(0,10);
const rows=[],predictions=[];
const subjectCrop=process.argv.includes('--subject-crop');
try{
 await page.goto('http://127.0.0.1:4187/#wardrobe');await page.waitForSelector('#wd-open-import');
 const status=await page.evaluate(()=>fetch('/api/wardrobe/local-status').then(r=>r.json()));if(!status.enabled)throw Error('Install local model assets first.');
 for(const photo of manifest.photos){
  const image='data:image/jpeg;base64,'+(await fs.readFile(new URL(photo.file,data))).toString('base64');
  const boxes=photo.expected.map(p=>p.box);
  const crop=subjectCrop?{x:Math.max(0,Math.min(...boxes.map(b=>b.x))-.03),y:Math.max(0,Math.min(...boxes.map(b=>b.y))-.03),right:Math.min(1,Math.max(...boxes.map(b=>b.x+b.width))+.03),bottom:Math.min(1,Math.max(...boxes.map(b=>b.y+b.height))+.03)}:{x:0,y:0,right:1,bottom:1};
  const result=await page.evaluate(async({image,crop})=>{
   const bitmap=await createImageBitmap(await(await fetch(image)).blob());const canvas=document.createElement('canvas');
   const w=(crop.right-crop.x)*bitmap.width,h=(crop.bottom-crop.y)*bitmap.height,scale=Math.min(1,1600/Math.max(w,h));canvas.width=Math.round(w*scale);canvas.height=Math.round(h*scale);canvas.getContext('2d').drawImage(bitmap,crop.x*bitmap.width,crop.y*bitmap.height,w,h,0,0,canvas.width,canvas.height);bitmap.close();
   const {recogniseLocalPhoto}=await import('/wardrobe-recognition.js');const began=performance.now();const detected=await recogniseLocalPhoto(canvas.toDataURL('image/jpeg',.85));
   return {items:detected.items,milliseconds:performance.now()-began};
  },{image,crop});
  const expected=photo.expected.map(p=>({...p,box:{x:(p.box.x-crop.x)/(crop.right-crop.x),y:(p.box.y-crop.y)/(crop.bottom-crop.y),width:p.box.width/(crop.right-crop.x),height:p.box.height/(crop.bottom-crop.y)}}));
  const metrics=evaluatePhoto(expected,result.items);
  rows.push({id:photo.id,row:photo.row,milliseconds:Math.round(result.milliseconds),...metrics});predictions.push({id:photo.id,items:result.items});
  console.log(JSON.stringify({completed:rows.length,total:manifest.photos.length,id:photo.id,tp:metrics.truePositives,fp:metrics.falsePositives,fn:metrics.falseNegatives,milliseconds:Math.round(result.milliseconds)}));
  await fs.writeFile(new URL(subjectCrop?'subject-crop-predictions.json':'predictions.json',data),JSON.stringify(predictions,null,2));
 }
 const blank=await page.evaluate(async()=>{const c=document.createElement('canvas');c.width=c.height=600;c.getContext('2d').fillStyle='white';c.getContext('2d').fillRect(0,0,600,600);return(await(await import('/wardrobe-recognition.js')).recogniseLocalPhoto(c.toDataURL('image/jpeg'))).items.length;});
 await page.evaluate(async()=>{(await import('/wardrobe-recognition.js')).stopLocalRecognition();});
 const warm=rows.slice(1).map(r=>r.milliseconds).sort((a,b)=>a-b);
 const report={date:runDate,dataset:manifest.dataset,revision:manifest.revision,selection:manifest.selection,scope:manifest.scope,preprocessing:subjectCrop?'Annotation-guided target-outfit crop with 3% margin. Diagnostic oracle crop, not automatic subject selection.':'Full original image, resized/re-encoded using the import policy.',
  environment:'Headless desktop Chrome, Windows, WASM CPU, viewport 390x844. This is NOT physical iPhone performance.',
  policy:{confidenceThreshold:.1,nmsIoU:.65,matchIoU:.5,noTuningOnThisSample:true},summary:summariseRecognition(rows),
  multiGarmentPhotos:summariseRecognition(rows.filter(r=>r.expected>=2)),coldMilliseconds:rows[0].milliseconds,warmMedianMilliseconds:warm[Math.floor(warm.length/2)],warmP95Milliseconds:warm[Math.ceil(warm.length*.95)-1],
  blankDetections:blank,modelAssetBytes:status.totalBytes,postRequests,pageErrors:errors,blockedExternalOrigins:[...new Set(remoteAttempts)],paidApiCalls:0,physicalIPhoneTested:false,
  limitations:['Real worn-outfit images; flat-lay piles and user phone photos are untested.','Only supported garment categories scored. Dataset garment-part annotations are excluded.','Broad app categories scored, not fine-grained clothing subtypes.','Annotation/box differences can count as errors; raw fixtures remain private.','Dataset annotations focus on the main outfit. Some unmatched predictions are real spectator/background clothes, so precision is target-outfit agreement, not all-visible-clothing accuracy.','No calibrated confidence, colour/fit/weight accuracy, or human correction-time measurement.'],perPhoto:rows};
 await fs.writeFile(new URL(subjectCrop?'operations/recognition-real-photo-crop-qa-'+runDate+'.json':'operations/recognition-real-photo-qa-'+runDate+'.json',root),JSON.stringify(report,null,2)+'\n');
 console.log('SUMMARY '+JSON.stringify(report.summary));
}finally{await browser.close();}
