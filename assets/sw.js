const CACHE_NAME = "V1";
// const CACHE_NAME = "V2";
const STATIC_CACHE_URLS = ["assets/icons/logo-180.png", "css/style.css", "scripts.js", "index.html", "apropos.html", "etudiants.html", "assets/images/gallery/Grace.jpg", "assets/images/gallery/Praise.png", "assets/images/gallery/Ando.jpg", "assets/images/gallery/mama.jpg", "assets/images/gallery/Dylan.jpg"];

self.addEventListener("install", event => {
    console.log("Service Worker installing.");
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE_URLS))
    );
});

self.addEventListener("activate", event => {
    console.log("Service Worker activating.");
});

self.addEventListener("fetch", event => {
    if (event.request.url.includes("/api/")) {
      // réponse aux requêtes API, stratégie Cache Update Refresh
      event.respondWith(caches.match(event.request));
      event.waitUntil(update(event.request).then(refresh)); //TODO: refresh
    } else {
      // réponse aux requêtes de fichiers statiques, stratégie Cache-First
    }
});

function refresh(response) {
  return response
    .json() // lit et parse la réponse JSON
    .then(jsonResponse => {
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          // signaler et envoyer au client les nouvelles données
          client.postMessage(
            JSON.stringify({
              type: response.url,
              data: jsonResponse.data
            })
          );
        });
      });
      return jsonResponse.data; // résout la promesse avec les nouvelles données
    });
}

const delay = ms => _ => new Promise(resolve => setTimeout(() => resolve(_), ms))

function update(request) {
  return fetch(request.url).then(
    response =>
      cache(request, response) // on peut mettre en cache la réponse
        .then(() => response) // résout la promesse avec l'objet Response
  );
}



function cache(request, response) {
    if (response.type === "error" || response.type === "opaque") {
      return Promise.resolve(); // do not put in cache network errors
    }
  
    return caches
      .open(CACHE_NAME)
      .then(cache => cache.put(request, response.clone()));
}

self.addEventListener("activate", event => {
  // delete any unexpected caches
  event.waitUntil(
    caches
      .keys()
      .then(keys => keys.filter(key => key !== CACHE_NAME))
      .then(keys =>
        Promise.all(
          keys.map(key => {
            console.log(`Deleting cache ${key}`);
            return caches.delete(key);
          })
        )
      )
  );
});

