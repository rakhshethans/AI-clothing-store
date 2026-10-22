import test from 'node:test';
import assert from 'node:assert/strict';
import {recognitionConfig,recogniseGarments,createWardrobeApi} from '../wardrobe-api.mjs';
const env={AI_GATEWAY_API_KEY:'test-only-credential',AI_GATEWAY_MODEL:'test/vision'};
test('no-spend policy disables recognition even when provider credentials exist',async()=>{
 let calls=0;assert.equal(recognitionConfig(env).enabled,false);
 await assert.rejects(recogniseGarments('data:image/jpeg;base64,/9j/2Q==',{env,fetcher:async()=>{calls++;throw Error('Must not call provider');}}),e=>e.status===503&&/charges/.test(e.message));assert.equal(calls,0);
});
async function call(path,method='GET'){
 let read=false;const req={method,async *[Symbol.asyncIterator](){read=true;throw Error('Body must not be read');}};
 const result={};await createWardrobeApi({env})(req,{writeHead(status,headers){result.status=status;result.headers=headers;},end(body){result.body=JSON.parse(body);}},new URL('https://threadline.test'+path));return {...result,read};
}
test('status advertises no-spend mode without disclosing credentials',async()=>{const r=await call('/api/wardrobe/status');assert.equal(r.status,200);assert.deepEqual(r.body,{enabled:false,reason:'no-spend'});assert.equal(r.headers['Cache-Control'],'no-store');assert.ok(!JSON.stringify(r).includes(env.AI_GATEWAY_API_KEY));});
test('recognition refuses a photo before reading its body or making a request',async()=>{const r=await call('/api/wardrobe/recognise','POST');assert.equal(r.status,503);assert.equal(r.read,false);assert.equal(r.body.reason,'no-spend');assert.match(r.body.error,/manually/);});
test('unsupported API methods cannot enable recognition',async()=>{for(const method of ['GET','PUT','DELETE','HEAD'])assert.equal((await call('/api/wardrobe/recognise',method)).status,405);});
