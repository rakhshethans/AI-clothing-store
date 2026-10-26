import {stat,readFile} from 'node:fs/promises';
import {localRecognitionPolicy as policy} from './public/recognition-config.js';
const root=new URL('./public/local-recognition/',import.meta.url);
export const localRecognitionFiles=new Set(['transformers.min.js','ort-wasm-simd-threaded.jsep.mjs','ort-wasm-simd-threaded.jsep.wasm','TRANSFORMERS-LICENSE.txt','MODEL-LICENSE.txt',...['config.json','preprocessor_config.json','onnx/model_quantized.onnx','export.json'].map(f=>'models/'+policy.modelId+'/'+f)]);
export async function localRecognitionStatus(){
 try{
  const manifest=JSON.parse((await readFile(new URL('ready.json',root),'utf8')).replace(/^\uFEFF/,''));
  if(manifest.version!==policy.version||manifest.engine!==policy.engine||manifest.runtime!=='3.8.1'||manifest.model!==policy.modelId||manifest.revision!==policy.revision||manifest.sourceSHA256!==policy.sourceSHA256)throw Error('Incomplete setup');
  for(const file of localRecognitionFiles){const size=(await stat(new URL(file,root))).size;if(!size||size!==manifest.sizes?.[file])throw Error('Missing or incomplete file');}
  return {enabled:true,mode:'local-experimental',engine:policy.engine,totalBytes:manifest.totalBytes};
 }catch{return {enabled:false,mode:'local-experimental',reason:'assets-missing-or-outdated'};}
}
