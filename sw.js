var CACHE='resultado-guimas-v1';
var ASSETS=['./','./index.html','./icone.png'];
self.addEventListener('install',function(e){
 self.skipWaiting();
 e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS).catch(function(){})}));
});
self.addEventListener('activate',function(e){
 e.waitUntil(caches.keys().then(function(ks){
  return Promise.all(ks.map(function(k){if(k!==CACHE)return caches.delete(k)}));
 }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
 var u=e.request.url;
 if(e.request.method!=='GET')return;
 if(u.indexOf('firebaseio.com')>-1||u.indexOf('googleapis.com')>-1||u.indexOf('firebaseapp.com')>-1)return;
 e.respondWith(
  fetch(e.request).then(function(r){
   var cp=r.clone();
   caches.open(CACHE).then(function(c){c.put(e.request,cp).catch(function(){})});
   return r;
  }).catch(function(){return caches.match(e.request).then(function(m){return m||caches.match('./index.html')})})
 );
});