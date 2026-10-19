import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {handleRequest} from '../server.mjs';
async function pwaRequest(url){const r={status:200,headers:{},body:Buffer.alloc(0)};await handleRequest({url,method:'GET'},{setHeader(k,v){r.headers[k.toLowerCase()]=v;},writeHead(s,h={}){r.status=s;for(const [k,v]of Object.entries(h))this.setHeader(k,v);},end(b){r.body=b===undefined?Buffer.alloc(0):Buffer.from(b);}});return r;}
test('manifest and install icons are served with correct types and dimensions',async()=>{
 const response=await pwaRequest('/manifest.webmanifest');assert.equal(response.status,200);assert.equal(response.headers['content-type'],'application/manifest+json');const manifest=JSON.parse(response.body);assert.equal(manifest.display,'standalone');assert.equal(manifest.start_url,'/#discover');
 for(const size of [192,512]){const icon=await pwaRequest('/assets/icon-'+size+'.png');assert.equal(icon.headers['content-type'],'image/png');assert.equal(icon.body.readUInt32BE(16),size);assert.equal(icon.body.readUInt32BE(20),size);}
});
test('offline worker precaches existing app assets and ignores retailer links and non-GET requests',async()=>{
 const handlers={};const cached=[];const deleted=[];const cache={addAll:async paths=>{for(const p of paths){assert.equal((await pwaRequest(p)).status,200,p);cached.push(p);}},put:async()=>{}};
 const context={self:{location:{origin:'https://threadline.test'},addEventListener(name,handler){handlers[name]=handler;}},URL,Response,fetch:async()=>{throw Error('offline');},caches:{open:async()=>cache,keys:async()=>['threadline-social-v2','threadline-old','unrelated-cache'],delete:async key=>{deleted.push(key);},match:async request=>(typeof request==='string'?request:request.url)==='/'?new Response('offline shell'):undefined}};
 vm.runInNewContext(await readFile(new URL('../public/sw.js',import.meta.url),'utf8'),context);
 let pending;handlers.install({waitUntil(p){pending=p;}});await pending;assert.ok(cached.includes('/social.js'));assert.ok(cached.includes('/assets/feed-editorial.webp'));assert.ok(!cached.some(p=>/https:|\/go\//.test(p)));
 handlers.activate({waitUntil(p){pending=p;}});await pending;assert.deepEqual(deleted,['threadline-old']);
 let intercepted=false;for(const request of [{url:'https://example.com/item',method:'GET'},{url:'https://threadline.test/api/upload',method:'POST'}])handlers.fetch({request,respondWith(){intercepted=true;}});assert.equal(intercepted,false);
 let result;handlers.fetch({request:{url:'https://threadline.test/index.html',method:'GET',mode:'navigate'},respondWith(p){result=p;},waitUntil(){}});assert.equal(await (await result).text(),'offline shell');
});
