// Optional developer benchmark. Requires Playwright; downloads/inference are local/free.
import fs from 'node:fs/promises';
import {localRecognitionPolicy as policy} from '../public/recognition-config.js';
import {evaluatePhoto,summariseRecognition} from './recognition-evaluation.mjs';
const {chromium}=await import(process.env.THREADLINE_PLAYWRIGHT_MODULE||'playwright');
if(process.argv.includes('--subject-crop'))throw Error('Annotation-guided inference is not supported. Benchmark the full image only.');
const holdout=process.argv.includes('--holdout');
const runTag=process.argv.find(v=>v.startsWith('--run-tag='))?.slice(10)||'';
if(runTag&&!/^[a-z0-9-]{1,32}$/.test(runTag))throw Error('Invalid run tag.');
const root=new URL('../',import.meta.url),data=new URL(holdout?'private-data/recognition-holdout/':'private-data/recognition-benchmark/',root);
const manifest=JSON.parse(await fs.readFile(new URL('manifest.json',data),'utf8'));
const launch={headless:true};if(process.env.THREADLINE_CHROME)launch.executablePath=process.env.THREADLINE_CHROME;
const browser=await chromium.launch(launch);
const context=await browser.newContext({viewport:{width:390,height:844}});
const remoteAttempts=[],postRequests=[],errors=[];
context.on('request',r=>{if(r.method()!=='GET')postRequests.push({url:r.url(),method:r.method()});});
await context.route('**/*',route=>{const url=new URL(route.request().url());if(url.hostname==='127.0.0.1'||url.protocol==='data:')return route.continue();remoteAttempts.push(url.origin);return route.abort();});
const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
const runDate=new Date().toISOString().slice(0,10);
const tag=policy.engine+(runTag?'-'+runTag:'')+(holdout?'-validation':'-development');
let runtime;
const rows=[],predictions=[];
process.on('SIGINT',async()=>{await browser.close();process.exit(130);});
try{
 await page.goto('http://127.0.0.1:4187/#wardrobe');await page.waitForSelector('#wd-open-import');
 const status=await page.evaluate(()=>fetch('/api/wardrobe/local-status').then(r=>r.json()));if(!status.enabled)throw Error('Install local model assets first.');
 runtime=await page.evaluate(async()=>({crossOriginIsolated,hardwareConcurrency:navigator.hardwareConcurrency,requestedWasmThreads:(await import('/wardrobe-recognition-domain.js')).recognitionThreadCount({isolated:crossOriginIsolated,sharedMemory:typeof SharedArrayBuffer!=='undefined',cores:navigator.hardwareConcurrency})}));
 for(const photo of manifest.photos){
  const image='data:image/jpeg;base64,'+(await fs.readFile(new URL(photo.file,data))).toString('base64');
  const result=await page.evaluate(async image=>{
   const bitmap=await createImageBitmap(await(await fetch(image)).blob());const canvas=document.createElement('canvas');
   const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
   const {recogniseLocalPhoto}=await import('/wardrobe-recognition.js');const began=performance.now();const detected=await recogniseLocalPhoto(canvas.toDataURL('image/jpeg',.85));
   return {items:detected.items,milliseconds:performance.now()-began};
  },image);
  // Reference annotations are used only after inference, inside the evaluator.
  const expected=photo.expected;
  const metrics=evaluatePhoto(expected,result.items);
  rows.push({id:photo.id,row:photo.row,milliseconds:Math.round(result.milliseconds),...metrics});predictions.push({id:photo.id,items:result.items});
  console.log(JSON.stringify({completed:rows.length,total:manifest.photos.length,id:photo.id,tp:metrics.truePositives,fp:metrics.falsePositives,fn:metrics.falseNegatives,milliseconds:Math.round(result.milliseconds)}));
  await fs.writeFile(new URL(tag+'-predictions.json',data),JSON.stringify(predictions,null,2));
 }
 const blank=await page.evaluate(async()=>{const c=document.createElement('canvas');c.width=c.height=600;c.getContext('2d').fillStyle='white';c.getContext('2d').fillRect(0,0,600,600);return(await(await import('/wardrobe-recognition.js')).recogniseLocalPhoto(c.toDataURL('image/jpeg'))).items.length;});
 await page.evaluate(async()=>{(await import('/wardrobe-recognition.js')).stopLocalRecognition();});
 const warm=rows.slice(1).map(r=>r.milliseconds).sort((a,b)=>a-b);
 const report={date:runDate,dataset:manifest.dataset,revision:manifest.revision,selection:manifest.selection,scope:manifest.scope,preprocessing:'Full original image, resized/re-encoded using the import policy.',
  environment:'Headless desktop Chrome, Windows, WASM CPU, viewport 390x844. This is NOT physical iPhone performance.',runtime,
  model:policy.sourceModel,sourceRevision:policy.revision,engine:policy.engine,sampleRole:holdout?'reserved validation':'development',policy:{confidenceThreshold:policy.threshold,nmsIoU:policy.nmsIoU,matchIoU:.5,minimumCropEdge:.01,noTuningOnThisSample:holdout},summary:summariseRecognition(rows),
  multiGarmentPhotos:summariseRecognition(rows.filter(r=>r.expected>=2)),coldMilliseconds:rows[0].milliseconds,warmMedianMilliseconds:warm[Math.floor(warm.length/2)],warmP95Milliseconds:warm[Math.ceil(warm.length*.95)-1],
  blankDetections:blank,modelAssetBytes:status.totalBytes,postRequests,pageErrors:errors,blockedExternalOrigins:[...new Set(remoteAttempts)],paidApiCalls:0,physicalIPhoneTested:false,
  limitations:['Real worn-outfit images; flat-lay piles and user phone photos are untested.','The source model was trained with Fashionpedia; upstream split independence has not been audited. Reserved validation here means no tuning on these rows in this project.','Only supported garment categories scored. Dataset garment-part annotations are excluded.','Broad app categories scored, not fine-grained clothing subtypes.','Annotation/box differences can count as errors; raw fixtures remain private.','Dataset annotations focus on the main outfit. Some unmatched predictions are real spectator/background clothes, so precision is target-outfit agreement, not all-visible-clothing accuracy.','No calibrated confidence, colour/fit/weight accuracy, or human correction-time measurement.'],perPhoto:rows};
 await fs.writeFile(new URL('operations/recognition-'+tag+'-'+runDate+'.json',root),JSON.stringify(report,null,2)+'\n');
 console.log('SUMMARY '+JSON.stringify(report.summary));
}finally{await browser.close();}
