const APP_CACHE='threadline-social-v3';
const APP_FILES=['/','/index.html','/styles.css','/explore.css','/sable.css','/editorial.js','/app.js','/catalog.js','/domain.js','/media.js','/motion.js','/social.js','/social-domain.js','/pwa.js','/assets/editorial.webp','/assets/feed-editorial.webp','/assets/geist-variable.woff2','/assets/icon-192.png','/assets/icon-512.png','/manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil(caches.open(APP_CACHE).then(cache=>cache.addAll(APP_FILES))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('threadline-')&&k!==APP_CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin||!APP_FILES.includes(url.pathname))return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();event.waitUntil(caches.open(APP_CACHE).then(cache=>cache.put(event.request,copy)));}
    return response;
  }).catch(async()=>{
    const cached=await caches.match(event.request);if(cached)return cached;
    if(event.request.mode==='navigate')return await caches.match('/');
    return new Response('Unavailable offline',{status:503});
  }));
});
