import test from 'node:test';
import assert from 'node:assert/strict';
import {retailerLink,createGarment,createLocalProfile,uploadProblem,photoPieces} from '../public/social-domain.js';
test('poster links must be public HTTPS destinations, without embedded credentials',()=>{
  assert.equal(retailerLink(' https://example.com/item?q=linen '),'https://example.com/item?q=linen');
  for(const value of ['javascript:alert(1)','http://example.com','https://user:password@example.com','https://localhost/test','https://192.168.1.1/item','https://10.0.0.1/','https://[::1]/'])assert.throws(()=>retailerLink(value));
});
test('manual garment prices are optional integer pence, and alternative labels survive',()=>{
  const piece=createGarment({name:' Linen shirt ',retailer:' Example ',url:'https://example.com/item',price:'24.99',kind:'similar'});
  assert.equal(piece.price,2499);assert.equal(piece.kind,'similar');assert.equal(piece.name,'Linen shirt');
  assert.equal(createGarment({...piece,price:''}).price,null);
  assert.throws(()=>createGarment({...piece,price:'-1'}));assert.throws(()=>createGarment({...piece,name:''}));
});
test('profile handles have bounded, normalised characters rather than HTML or spaces',()=>{
  assert.deepEqual(createLocalProfile(' Alex ','@Alex.Edit'),{name:'Alex',handle:'alex.edit'});
  for(const handle of ['a','name with spaces','<script>','a'.repeat(25)])assert.throws(()=>createLocalProfile('Alex',handle));
});
test('photo-specific tags never leak between frames, including an untagged frame',()=>{
  const post={photos:[{pieces:[{name:'Shirt'}]},{pieces:[]},{pieces:[{name:'Jacket'}]}]};
  assert.deepEqual(photoPieces(post,0),[{name:'Shirt'}]);assert.deepEqual(photoPieces(post,1),[]);assert.deepEqual(photoPieces(post,2),[{name:'Jacket'}]);assert.deepEqual(photoPieces(post,9),[]);
});
test('photo file checks reject unsupported types and oversize images',()=>{
  assert.equal(uploadProblem({type:'image/jpeg',size:5*1024*1024}),'');
  assert.match(uploadProblem({type:'image/svg+xml',size:12}),/JPEG/);
  assert.match(uploadProblem({type:'image/png',size:5*1024*1024+1}),/5 MB/);
});
