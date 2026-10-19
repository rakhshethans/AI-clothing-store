import test from 'node:test';
import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {recogniseGarments,createWardrobeApi} from '../wardrobe-api.mjs';
const env={AI_GATEWAY_API_KEY:'test-only-credential',AI_GATEWAY_MODEL:'test/vision'};
const photo='data:image/jpeg;base64,/9j/2Q==';
const detected={name:'Blue shirt',category:'top',colour:'blue',pattern:'solid',fit:'regular',formality:2,warmth:0,confidence:.8,box:{x:0,y:0,width:.5,height:1}};
const success=()=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify({items:[detected,{...detected,name:'Trousers',category:'bottom',box:{x:.5,y:0,width:.5,height:1}}]})}}]}));
test('real provider adapter sends one photo and receives separate validated garments, without a live call',async()=>{
 let calls=0;const result=await recogniseGarments(photo,{env,fetcher:async(url,init)=>{calls++;assert.equal(url,'https://ai-gateway.vercel.sh/v1/chat/completions');const payload=JSON.parse(init.body);assert.equal(payload.model,'test/vision');assert.equal(payload.messages[1].content[1].image_url.url,photo);assert.equal(payload.response_format.type,'json_schema');return success();}});assert.equal(calls,1);assert.equal(result.items.length,2);
});
test('provider is not called when unconfigured, malformed or returning failures',async()=>{
 let called=false;const fetcher=async()=>{called=true;return success();};await assert.rejects(recogniseGarments(photo,{env:{},fetcher}),/not connected/);await assert.rejects(recogniseGarments('https://private-host/photo',{env,fetcher}),/valid JPEG/);assert.equal(called,false);
 await assert.rejects(recogniseGarments(photo,{env,fetcher:async()=>new Response('secret provider details',{status:401})}),e=>e.status===502&&!e.message.includes('secret'));
 await assert.rejects(recogniseGarments(photo,{env,fetcher:async()=>new Response(JSON.stringify({choices:[{finish_reason:'length',message:{content:'{}'}}]}))}),/incomplete/);
 await assert.rejects(recogniseGarments(photo,{env,fetcher:async()=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:'{"items":[{}]}'}}]}))}),/unusable/);
});
async function request(api,body,headers={}){const req=Readable.from([JSON.stringify(body)]);req.method='POST';req.headers={'content-type':'application/json','x-threadline-intent':'wardrobe',host:'threadline.test',origin:'https://threadline.test',...headers};const result={};await api(req,{writeHead(status,h){result.status=status;result.headers=h;},end(text){result.body=JSON.parse(text);}},new URL('https://threadline.test/api/wardrobe/recognise'));return result;}
test('recognition requires consent and same-origin intent, caps calls and never caches images',async()=>{
 let calls=0;const api=createWardrobeApi({env,fetcher:async()=>{calls++;return success();}});
 assert.equal((await request(api,{image:photo,consent:false})).status,400);assert.equal((await request(api,{image:photo,consent:true},{origin:'https://evil.example'})).status,403);assert.equal((await request(api,{image:photo,consent:true},{origin:'null'})).status,403);assert.equal(calls,0);
 for(let i=0;i<30;i++){const r=await request(api,{image:photo,consent:true});assert.equal(r.status,200);assert.equal(r.headers['Cache-Control'],'no-store');}assert.equal((await request(api,{image:photo,consent:true})).status,429);assert.equal(calls,30);
});
test('oversized and malformed requests fail without provider calls; empty detection is valid',async()=>{
 let called=false;const api=createWardrobeApi({env,fetcher:async()=>{called=true;return success();}});assert.equal((await request(api,{image:'x'.repeat(3200000),consent:true})).status,413);assert.equal(called,false);
 const empty=await recogniseGarments(photo,{env,fetcher:async()=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:'{"items":[]}'}}]}))});assert.deepEqual(empty.items,[]);
});
