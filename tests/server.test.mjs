import test from 'node:test';
import assert from 'node:assert/strict';
import {handleRequest} from '../server.mjs';
async function request(url,method='GET'){
  const result={status:200,headers:{},body:''};
  const response={setHeader(k,v){result.headers[k.toLowerCase()]=v;},writeHead(status,headers={}){result.status=status;for(const [k,v] of Object.entries(headers))this.setHeader(k,v);},end(body){result.body=body===undefined?'':String(body);}};
  await handleRequest({url,method},response);return result;
}
test('server handler shell, privacy boundaries, redirects and health without external sockets',async()=>{
    const page=await request('/');assert.equal(page.status,200);assert.equal(page.headers['cross-origin-opener-policy'],'same-origin');assert.equal(page.headers['cross-origin-embedder-policy'],'credentialless');assert.match(page.body,/sample products/i);assert.match(page.headers['content-security-policy'],/connect-src 'self'/);
    const health=JSON.parse((await request('/health')).body);assert.equal(health.products,48);
    assert.equal((await request('/PRODUCT_SPEC.md')).status,404);
    assert.equal((await request('/api/upload','POST')).status,405);
    const redirect=await request('/go/tl-001?url=https://evil.example');assert.equal(redirect.status,302);assert.equal(new URL(redirect.headers.location).hostname,'example.com');
    assert.equal((await request('/go/missing')).status,404);
    assert.equal((await request('/go/tl-036')).status,404);
    assert.equal((await request('/app.js','HEAD')).body,'');
});
