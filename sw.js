// Service worker mínimo: solo existe para que el navegador reconozca la
// web como "instalable" (uno de los requisitos de Chrome/Android). No
// cachea nada ni cambia cómo se cargan las páginas o las fotos.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // Sin respondWith: deja pasar la petición tal cual, como si no
  // existiera el service worker.
});
