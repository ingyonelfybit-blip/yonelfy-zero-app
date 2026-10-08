// YONELFY ZERO · service worker propio (la app abre sin internet).
// tools/publish_pwa.py reemplaza __ZERO_VERSION__ y ["./", ".last_build_id", "assets/AssetManifest.bin", "assets/AssetManifest.bin.json", "assets/FontManifest.json", "assets/NOTICES", "assets/assets/brand/logo-horizontal-dark.svg", "assets/assets/brand/logo-horizontal-light.svg", "assets/assets/brand/symbol-dark.svg", "assets/assets/brand/symbol-light.svg", "assets/assets/fonts/HankenGrotesk-400.ttf", "assets/assets/fonts/HankenGrotesk-500.ttf", "assets/assets/fonts/HankenGrotesk-600.ttf", "assets/assets/fonts/HankenGrotesk-700.ttf", "assets/assets/fonts/InstrumentSans-Bold.ttf", "assets/assets/fonts/InstrumentSans-Regular.ttf", "assets/assets/fonts/InstrumentSans-SemiBold.ttf", "assets/assets/fonts/Lexend-300.ttf", "assets/assets/fonts/Lexend-400.ttf", "assets/assets/fonts/Lexend-500.ttf", "assets/assets/fonts/Lexend-600.ttf", "assets/assets/fonts/Phosphor-Fill.ttf", "assets/assets/fonts/Phosphor-Regular.ttf", "assets/assets/fonts/Roboto-Bold.ttf", "assets/assets/fonts/Roboto-Regular.ttf", "assets/assets/legal/catalog.json", "assets/fonts/MaterialIcons-Regular.otf", "assets/fonts/fallback/Roboto-Regular.ttf", "assets/packages/cupertino_icons/assets/CupertinoIcons.ttf", "assets/shaders/ink_sparkle.frag", "assets/shaders/stretch_effect.frag", "canvaskit/canvaskit.js", "canvaskit/canvaskit.js.symbols", "canvaskit/canvaskit.wasm", "canvaskit/chromium/canvaskit.js", "canvaskit/chromium/canvaskit.js.symbols", "canvaskit/chromium/canvaskit.wasm", "canvaskit/skwasm.js", "canvaskit/skwasm.js.symbols", "canvaskit/skwasm.wasm", "canvaskit/skwasm_heavy.js", "canvaskit/skwasm_heavy.js.symbols", "canvaskit/skwasm_heavy.wasm", "canvaskit/webparagraph/canvaskit.js", "canvaskit/webparagraph/canvaskit.js.symbols", "canvaskit/webparagraph/canvaskit.wasm", "canvaskit/wimp.js", "canvaskit/wimp.js.symbols", "canvaskit/wimp.wasm", "favicon.png", "favicon.svg", "flutter.js", "flutter_bootstrap.js", "icons/Icon-192.png", "icons/Icon-512.png", "icons/Icon-maskable-192.png", "icons/Icon-maskable-512.png", "icons/apple-touch-icon.png", "index.html", "main.dart.js", "manifest.json", "version.json"] con la versión publicada y su lista de
// archivos. Reglas:
// * Solo archivos de la propia app (mismo origen). Las llamadas al servidor de datos NUNCA pasan por aquí:
//   las consultas sin conexión las resuelve la app con su copia por usuario y las escrituras fallan con aviso.
// * Navegación: primero la red (versión nueva al publicar); sin red, la app guardada.
// * La consola de plataforma (/plataforma/) no se guarda: exige conexión y verificación en dos pasos.
'use strict';

const VERSION = "8a3e1d68a896d329";
const FILES = ["./", ".last_build_id", "assets/AssetManifest.bin", "assets/AssetManifest.bin.json", "assets/FontManifest.json", "assets/NOTICES", "assets/assets/brand/logo-horizontal-dark.svg", "assets/assets/brand/logo-horizontal-light.svg", "assets/assets/brand/symbol-dark.svg", "assets/assets/brand/symbol-light.svg", "assets/assets/fonts/HankenGrotesk-400.ttf", "assets/assets/fonts/HankenGrotesk-500.ttf", "assets/assets/fonts/HankenGrotesk-600.ttf", "assets/assets/fonts/HankenGrotesk-700.ttf", "assets/assets/fonts/InstrumentSans-Bold.ttf", "assets/assets/fonts/InstrumentSans-Regular.ttf", "assets/assets/fonts/InstrumentSans-SemiBold.ttf", "assets/assets/fonts/Lexend-300.ttf", "assets/assets/fonts/Lexend-400.ttf", "assets/assets/fonts/Lexend-500.ttf", "assets/assets/fonts/Lexend-600.ttf", "assets/assets/fonts/Phosphor-Fill.ttf", "assets/assets/fonts/Phosphor-Regular.ttf", "assets/assets/fonts/Roboto-Bold.ttf", "assets/assets/fonts/Roboto-Regular.ttf", "assets/assets/legal/catalog.json", "assets/fonts/MaterialIcons-Regular.otf", "assets/fonts/fallback/Roboto-Regular.ttf", "assets/packages/cupertino_icons/assets/CupertinoIcons.ttf", "assets/shaders/ink_sparkle.frag", "assets/shaders/stretch_effect.frag", "canvaskit/canvaskit.js", "canvaskit/canvaskit.js.symbols", "canvaskit/canvaskit.wasm", "canvaskit/chromium/canvaskit.js", "canvaskit/chromium/canvaskit.js.symbols", "canvaskit/chromium/canvaskit.wasm", "canvaskit/skwasm.js", "canvaskit/skwasm.js.symbols", "canvaskit/skwasm.wasm", "canvaskit/skwasm_heavy.js", "canvaskit/skwasm_heavy.js.symbols", "canvaskit/skwasm_heavy.wasm", "canvaskit/webparagraph/canvaskit.js", "canvaskit/webparagraph/canvaskit.js.symbols", "canvaskit/webparagraph/canvaskit.wasm", "canvaskit/wimp.js", "canvaskit/wimp.js.symbols", "canvaskit/wimp.wasm", "favicon.png", "favicon.svg", "flutter.js", "flutter_bootstrap.js", "icons/Icon-192.png", "icons/Icon-512.png", "icons/Icon-maskable-192.png", "icons/Icon-maskable-512.png", "icons/apple-touch-icon.png", "index.html", "main.dart.js", "manifest.json", "version.json"];
const CACHE = 'zero-app-' + VERSION;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(FILES.map((f) => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('zero-app-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function isApp(url) {
  const scope = new URL(self.registration.scope);
  return url.origin === scope.origin && url.pathname.startsWith(scope.pathname) &&
    !url.pathname.startsWith(scope.pathname + 'plataforma/');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (!isApp(url)) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('index.html', copy));
          return res;
        })
        .catch(() => caches.match('index.html', { ignoreSearch: true })),
    );
    return;
  }

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    })),
  );
});
