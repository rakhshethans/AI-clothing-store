import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('standalone export has embedded assets and syntactically coherent application code',async()=>{
  const html=await readFile(new URL('../Threadline.html',import.meta.url),'utf8');
  assert.ok(html.includes('<style>'));assert.ok(!html.includes('src="/app.js"'));assert.ok(!html.includes('href="/styles.css"'));
  const code=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];assert.ok(code);assert.ok(!/^import /m.test(code));
  assert.doesNotThrow(()=>new Function(code.replace(/^export /gm,'')));
  assert.match(code,/location.protocol==='file:'/);
});
