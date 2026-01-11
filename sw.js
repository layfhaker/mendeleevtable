// =========================================
// SERVICE WORKER v10 - Complete Caching
// =========================================

const CACHE_NAME = 'chem-assistant-v10';

// === CRITICAL FILES (cached on install) ===
const PRECACHE_ASSETS = [
    './',
    './index.html',
    './manifest.json',

    // CSS - Loader (must be first)
    './css/loader.css',

    // CSS - Core
    './css/style.css',
    './css/base.css',
    './css/table.css',
    './css/theme.css',
    './css/modal.css',
    './css/fab.css',
    './css/footer.css',

    // CSS - Features
    './css/calculator.css',
    './css/filters.css',
    './css/solubility.css',
    './css/balancer.css',
    './css/nodemap.css',
    './css/scroll-collapse.css',
    './css/advanced-modal.css',

    // JS - Loader (must be first)
    './js/loader.js',

    // JS - Core
    './js/scrypt.js',
    './js/elements.js',
    './js/icons.js',
    './js/particles.js',
    './js/utils.js',
    './js/download-link-updater.js',

    // JS - Modules
    './js/modules/mobile-layout.js',
    './js/modules/modal.js',
    './js/modules/theme.js',
    './js/modules/search-filters.js',
    './js/modules/ui.js',
    './js/modules/calculator.js',
    './js/modules/balancer.js',

    // JS - Solubility
    './js/solubility/data.js',
    './js/solubility/colors.js',
    './js/solubility/solubility-table.js',
    './js/solubility/filters.js',
    './js/solubility/search.js',
    './js/solubility/modal.js',
    './js/solubility/advanced-modal.js',

    // JS - Nodemap
    './js/nodemap/nodemap-parser.js',
    './js/nodemap/nodemap-layout.js',
    './js/nodemap/nodemap-canvas.js',
    './js/nodemap/nodemap-flow-data.js',
    './js/nodemap/nodemap-flow-layout.js',
    './js/nodemap/nodemap-flow-canvas.js',
    './js/nodemap/nodemap-modal.js',
    './js/nodemap/nodemap-init.js',

    // Images
    './img/icon-192.png',
    './img/icon-512.png',
    './img/favicon.png'
];

// === RUNTIME CACHE PATTERNS ===
const RUNTIME_CACHE_PATTERNS = [
    /\/img\/.+\.(png|jpg|svg|webp)$/,
    /\/js\/wallpaper-handler\.js$/,
    /\/js\/scroll-collapse\.js$/
];

// === INSTALL ===
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker v10...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching critical files');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((error) => {
                console.error('[SW] Cache failed:', error);
            })
    );
});

// === ACTIVATE ===
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker v10');
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => {
                        console.log('[SW] Deleting old cache:', key);
                        return caches.delete(key);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// === FETCH ===
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip chrome-extension and other protocols
    if (!request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(request)
            .then((cached) => {
                // Strategy: Stale-While-Revalidate

                if (cached) {
                    // Return from cache immediately
                    // Update in background for next time
                    fetch(request).then((response) => {
                        if (response && response.ok) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, response);
                            });
                        }
                    }).catch(() => {
                        // Offline - do nothing, already returned cache
                    });

                    return cached;
                }

                // Not in cache - fetch from network
                return fetch(request).then((response) => {
                    // Check if should cache this resource
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
                    // Offline and not in cache - return fallback for HTML
                    if (request.headers.get('Accept')?.includes('text/html')) {
                        return caches.match('./index.html');
                    }

                    // For other resources return error
                    return new Response('Offline', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
            })
    );
});

// === MESSAGE HANDLER ===
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

console.log('[SW] Service Worker v10 loaded');
