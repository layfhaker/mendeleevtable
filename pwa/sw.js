const CACHE_NAME = 'mendeleev-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './data.json',
  './css/style.css',
  './css/base.css',
  './css/table.css',
  './css/modal.css',
  './css/theme.css',
  './css/fab.css',
  './css/calculator.css',
  './css/filters.css',
  './js/scrypt.js',
  './js/elements.js',
  './js/particles.js',
  './js/icons.js',
  './img/png1.png',
  './img/png2.png'
];

// Установка: кэшируем файлы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Активация: чистим старый кэш
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    })
  );
});

// Работа: отдаем файлы из кэша (оффлайн), если нет интернета
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
