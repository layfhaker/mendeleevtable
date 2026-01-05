// =========================================
// SERVICE WORKER v7 - Оптимизированное кэширование
// =========================================

const CACHE_NAME = 'chem-assistant-v8';

// === КРИТИЧЕСКИЕ ФАЙЛЫ (кэшируем при установке) ===
const PRECACHE_ASSETS = [
    '../',
    '../index.html',
    '../css/style.css',
    '../css/base.css',
    '../css/table.css',
    '../css/theme.css',
    '../js/scrypt.js',
    '../js/elements.js',
    '../js/icons.js',
    '../js/particles.js'
];

// === ФАЙЛЫ ДЛЯ RUNTIME КЭШИРОВАНИЯ (загружаются по требованию) ===
const RUNTIME_CACHE_PATTERNS = [
    /\/css\/(modal|fab|calculator|filters)\.css$/,
    /\/css\/(solubility|advanced-modal)\.css$/,
    /\/js\/modules\/.+\.js$/,
    /\/js\/solubility\/.+\.js$/,
    /\/pwa\/manifest\.json$/,
    /\/img\/.+\.(png|jpg|svg)$/
];

// === УСТАНОВКА (install) ===
self.addEventListener('install', (event) => {
    console.log('[SW] Установка Service Worker v7...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Кэширование критических файлов');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => self.skipWaiting()) // Активируем сразу
    );
});

// === АКТИВАЦИЯ (activate) ===
self.addEventListener('activate', (event) => {
    console.log('[SW] Активация Service Worker v7');
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => {
                        console.log('[SW] Удаление старого кэша:', key);
                        return caches.delete(key);
                    })
            );
        }).then(() => self.clients.claim()) // Управляем всеми клиентами
    );
});

// === FETCH (запросы) ===
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Пропускаем не-GET запросы
    if (request.method !== 'GET') return;

    // Игнорируем chrome-extension и другие протоколы
    if (!request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(request)
            .then((cached) => {
                // Стратегия: Cache First с фоновым обновлением (Stale-While-Revalidate)

                if (cached) {
                    // Возвращаем из кэша немедленно
                    // Но обновляем в фоне для следующего раза
                    fetch(request).then((response) => {
                        if (response && response.ok) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, response);
                            });
                        }
                    }).catch(() => {
                        // Офлайн - ничего не делаем, уже вернули кэш
                    });

                    return cached;
                }

                // Нет в кэше - загружаем из сети
                return fetch(request).then((response) => {
                    // Проверяем, нужно ли кэшировать этот ресурс
                    if (response && response.ok) {
                        const shouldCache = RUNTIME_CACHE_PATTERNS.some(pattern =>
                            pattern.test(request.url)
                        );

                        if (shouldCache) {
                            const clone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, clone);
                            });
                        }
                    }

                    return response;
                }).catch(() => {
                    // Офлайн и нет в кэше - возвращаем fallback для HTML
                    if (request.headers.get('Accept').includes('text/html')) {
                        return caches.match('./index.html');
                    }

                    // Для остальных ресурсов возвращаем ошибку
                    return new Response('Офлайн', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
            })
    );
});

// === СООБЩЕНИЯ (для отладки) ===
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CACHE_STATS') {
        caches.open(CACHE_NAME).then((cache) => {
            cache.keys().then((keys) => {
                event.ports[0].postMessage({
                    cacheSize: keys.length,
                    cacheNames: keys.map(k => k.url)
                });
            });
        });
    }
});

console.log('[SW] Service Worker v7 загружен');
