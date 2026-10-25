import {stat,readFile} from 'node:fs/promises';
const root=new URL('./public/local-recognition/',import.meta.url);
export const localRecognitionFiles=new Set(['transformers.min.js','ort-wasm-simd-threaded.jsep.mjs','ort-wasm-simd-threaded.jsep.wasm','TRANSFORMERS-LICENSE.txt','MODEL-LICENSE.txt',...['config.json','preprocessor_config.json','tokenizer.json','tokenizer_config.json','special_tokens_map.json','vocab.json','merges.txt','onnx/model_quantized.onnx'].map(f=>'models/Xenova/owlvit-base-patch32/'+f)]);
export async function localRecognitionStatus(){
 try{
  const manifest=JSON.parse(await readFile(new URL('ready.json',root),'utf8'));
  if(manifest.version!==1||manifest.runtime!=='3.8.1'||manifest.revision!=='b75f4e52949639c3bb0b96546ea4149482f6e7ef')throw Error('Incomplete setup');
  for(const file of localRecognitionFiles)if((await stat(new URL(file,root))).size===0)throw Error('Missing file');
  return {enabled:true,mode:'local-experimental',totalBytes:manifest.totalBytes};
 }catch{return {enabled:false,mode:'local-experimental',reason:'assets-missing'};}
}
