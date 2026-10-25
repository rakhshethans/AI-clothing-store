// Optional local assets only: public downloads, no credentials or inference service.
import {mkdir,readFile,writeFile,copyFile,stat,unlink} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {pipeline as streamPipeline} from 'node:stream/promises';
import {Readable} from 'node:stream';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const destination=new URL('public/local-recognition/',root);
const staging=new URL('private-data/recognition-setup/',root);
const revision='b75f4e52949639c3bb0b96546ea4149482f6e7ef';
const integrity='tsTk4zVjImqdqjS8/AOZg2yNLd1z9S5v+7oUPpXaasDRwEDhB+xnglK1k5cad26lL5/ZIaeREgWWy0bs9y9pPA==';
await mkdir(destination,{recursive:true});await mkdir(staging,{recursive:true});
async function download(url,target){
  const response=await fetch(url,{signal:AbortSignal.timeout(240000)});
  if(!response.ok)throw new Error('Download failed: '+response.status+' '+url);
  await streamPipeline(Readable.fromWeb(response.body),createWriteStream(target));
}
let previous={};try{previous=JSON.parse(await readFile(new URL('ready.json',destination),'utf8'));}catch{}
await unlink(new URL('ready.json',destination)).catch(error=>{if(error.code!=='ENOENT')throw error;});
const archive=new URL('runtime.tgz',staging);
try{await stat(archive);}catch{await download('https://registry.npmjs.org/@huggingface/transformers/-/transformers-3.8.1.tgz',archive);}
if(createHash('sha512').update(await readFile(archive)).digest('base64')!==integrity)throw new Error('Runtime integrity mismatch.');
const runtimeFiles=['transformers.min.js','ort-wasm-simd-threaded.jsep.mjs','ort-wasm-simd-threaded.jsep.wasm'];
execFileSync('tar',['-xzf',fileURLToPath(archive),'-C',fileURLToPath(staging),'package/LICENSE',...runtimeFiles.map(f=>'package/dist/'+f)]);
for(const name of runtimeFiles)await copyFile(new URL('package/dist/'+name,staging),new URL(name,destination));
await copyFile(new URL('package/LICENSE',staging),new URL('TRANSFORMERS-LICENSE.txt',destination));
const files=['config.json','preprocessor_config.json','tokenizer.json','tokenizer_config.json','special_tokens_map.json','vocab.json','merges.txt','onnx/model_quantized.onnx'];
const modelRoot=new URL('models/Xenova/owlvit-base-patch32/',destination);
await mkdir(new URL('onnx/',modelRoot),{recursive:true});
for(const file of files){
  const target=new URL(file,modelRoot);
  // Only a previous completed setup can reuse weights; failed downloads retry.
  let reuse=false;try{const bytes=await readFile(target);reuse=previous.sha256?.[file]===createHash('sha256').update(bytes).digest('hex');}catch{}
  if(!reuse){console.log('Downloading local model asset: '+file);await download('https://huggingface.co/Xenova/owlvit-base-patch32/resolve/'+revision+'/'+file,target);}
}
// Keep upstream license available alongside the redistributed weights.
await download('https://www.apache.org/licenses/LICENSE-2.0.txt',new URL('MODEL-LICENSE.txt',destination));
const sha256={};let totalBytes=0;
for(const file of files){const bytes=await readFile(new URL(file,modelRoot));sha256[file]=createHash('sha256').update(bytes).digest('hex');totalBytes+=bytes.length;}
for(const file of runtimeFiles)totalBytes+=(await stat(new URL(file,destination))).size;
await writeFile(new URL('ready.json',destination),JSON.stringify({version:1,runtime:'3.8.1',model:'Xenova/owlvit-base-patch32',revision,totalBytes,sha256},null,2));
console.log('Local recognition assets ready: '+(totalBytes/1024/1024).toFixed(1)+' MiB. No paid service used.');

