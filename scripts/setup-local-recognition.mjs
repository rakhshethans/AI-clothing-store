// Explicit optional setup: public model/software downloads and local CPU conversion only.
import {mkdir,readFile,writeFile,copyFile,stat,unlink} from 'node:fs/promises';
import {createWriteStream,existsSync} from 'node:fs';
import {pipeline as streamPipeline} from 'node:stream/promises';
import {Readable} from 'node:stream';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {localRecognitionPolicy as policy} from '../public/recognition-config.js';
const root=new URL('../',import.meta.url),destination=new URL('public/local-recognition/',root),staging=new URL('private-data/recognition-setup/',root),source=new URL('private-data/fashion-detr/',root);
const integrity='tsTk4zVjImqdqjS8/AOZg2yNLd1z9S5v+7oUPpXaasDRwEDhB+xnglK1k5cad26lL5/ZIaeREgWWy0bs9y9pPA==';
const runtimeFiles=['transformers.min.js','ort-wasm-simd-threaded.jsep.mjs','ort-wasm-simd-threaded.jsep.wasm'];
const modelFiles=['config.json','preprocessor_config.json','onnx/model_quantized.onnx','export.json'].map(f=>'models/'+policy.modelId+'/'+f);
const files=[...runtimeFiles,...modelFiles,'TRANSFORMERS-LICENSE.txt','MODEL-LICENSE.txt'];
for(const folder of [destination,staging,source,new URL('private-data/recognition-temp/',root)])await mkdir(folder,{recursive:true});
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
let previous={};try{previous=JSON.parse((await readFile(new URL('ready.json',destination),'utf8')).replace(/^\uFEFF/,''));}catch{}
if(previous.version===policy.version&&previous.engine===policy.engine&&previous.runtime==='3.8.1'){
 let complete=true;for(const file of files){try{if(digest(await readFile(new URL(file,destination)))!==previous.sha256?.[file])complete=false;}catch{complete=false;}}
 if(complete){console.log('Clothing recognition is already installed and verified.');process.exit(0);}
}
await unlink(new URL('ready.json',destination)).catch(error=>{if(error.code!=='ENOENT')throw error;});
async function download(url,target){const response=await fetch(url,{signal:AbortSignal.timeout(240000)});if(!response.ok)throw Error('Download failed: '+response.status+' '+url);await streamPipeline(Readable.fromWeb(response.body),createWriteStream(target));}
const archive=new URL('runtime.tgz',staging);try{await stat(archive);}catch{await download('https://registry.npmjs.org/@huggingface/transformers/-/transformers-3.8.1.tgz',archive);}
if(createHash('sha512').update(await readFile(archive)).digest('base64')!==integrity)throw Error('Runtime integrity mismatch.');
execFileSync('tar',['-xzf',fileURLToPath(archive),'-C',fileURLToPath(staging),'package/LICENSE',...runtimeFiles.map(f=>'package/dist/'+f)]);
for(const file of runtimeFiles)await copyFile(new URL('package/dist/'+file,staging),new URL(file,destination));
await copyFile(new URL('package/LICENSE',staging),new URL('TRANSFORMERS-LICENSE.txt',destination));
await copyFile(new URL('scripts/licenses/fashion-detector-MIT.txt',root),new URL('MODEL-LICENSE.txt',destination));
for(const file of ['config.json','preprocessor_config.json','model.safetensors']){
 let reuse=false;try{const bytes=await readFile(new URL(file,source));reuse=file==='model.safetensors'&&digest(bytes)===policy.sourceSHA256;}catch{}
 if(!reuse){console.log('Downloading pinned clothing checkpoint: '+file);await download('https://huggingface.co/'+policy.sourceModel+'/resolve/'+policy.revision+'/'+file,new URL(file,source));}
}
if(digest(await readFile(new URL('model.safetensors',source)))!==policy.sourceSHA256)throw Error('Source model integrity mismatch.');
const bundled=path.resolve(path.dirname(process.execPath),'..','..','python',process.platform==='win32'?'python.exe':'bin/python3');
const python=process.env.THREADLINE_PYTHON||(existsSync(bundled)?bundled:process.platform==='win32'?null:'python3');
if(!python)throw Error('Set THREADLINE_PYTHON to a Python 3.11 or 3.12 executable for this optional one-time conversion.');
const dependencyPath=fileURLToPath(new URL('private-data/recognition-python/',root));
const temp=fileURLToPath(new URL('private-data/recognition-temp/',root));
const env={...process.env,PYTHONPATH:dependencyPath+(process.env.PYTHONPATH?path.delimiter+process.env.PYTHONPATH:''),TEMP:temp,TMP:temp,HF_HOME:fileURLToPath(new URL('cache/',source)),HF_HUB_OFFLINE:'1',TRANSFORMERS_OFFLINE:'1'};
const run=args=>execFileSync(python,args,{cwd:fileURLToPath(root),env,stdio:'inherit',timeout:900000});
run(['-c',"import sys; assert sys.version_info[:2] in [(3,11),(3,12)], 'Use Python 3.11 or 3.12 for the pinned conversion tools.'"]);
let installed=false;
try{execFileSync(python,['-c',"import torch,torchvision,transformers,onnx,onnxruntime,timm; assert torch.__version__.startswith('2.6.0') and torchvision.__version__.startswith('0.21.0') and transformers.__version__=='4.46.3' and onnx.__version__=='1.17.0' and onnxruntime.__version__=='1.20.1' and timm.__version__=='1.0.12'"],{env,stdio:'pipe',timeout:60000});installed=true;}catch{}
if(!installed){
 console.log('Installing free conversion libraries into private-data only. Global Python packages are not changed.');
 run(['-m','pip','install','--disable-pip-version-check','--no-cache-dir','--upgrade','--target',dependencyPath,'torch==2.6.0','torchvision==0.21.0',...(process.platform==='darwin'?[]:['--index-url','https://download.pytorch.org/whl/cpu'])]);
 run(['-m','pip','install','--disable-pip-version-check','--no-cache-dir','--upgrade','--target',dependencyPath,'transformers==4.46.3','onnx==1.17.0','onnxruntime==1.20.1','numpy==1.26.4','timm==1.0.12','sympy==1.13.1']);
}
run(['scripts/export-local-recognition.py']);
const sha256={},sizes={};let totalBytes=0;
for(const file of files){const bytes=await readFile(new URL(file,destination));sha256[file]=digest(bytes);sizes[file]=bytes.length;totalBytes+=bytes.length;}
await writeFile(new URL('ready.json',destination),JSON.stringify({version:policy.version,engine:policy.engine,runtime:'3.8.1',model:policy.modelId,revision:policy.revision,sourceSHA256:policy.sourceSHA256,totalBytes,sha256,sizes},null,2));
console.log('Clothing recognition ready: '+(totalBytes/1024/1024).toFixed(1)+' MiB of browser assets. Inference stays on the device; no paid service is used.');
