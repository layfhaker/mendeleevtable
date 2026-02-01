// =========================================
// APP RUNTIME (moved out of index.html and scrypt.js)
// =========================================

// Fallback for preload CSS in Chrome
(function () {
    var links = document.querySelectorAll('link[rel="preload"][as="style"]');
    links.forEach(function (link) {
        if (link.rel !== 'stylesheet') {
            link.rel = 'stylesheet';
        }
    });
})();

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW зарегистрирован!', reg))
            .catch(err => console.log('Ошибка SW:', err));
    });
}

// Live Wallpaper & Settings Script (Electron only)
(function () {
    if (!window.electronAPI) {
        console.log('[Live Wallpaper] Not running in Electron, features disabled');
        return;
    }

    console.log('[Live Wallpaper] Electron detected, initializing...');

    const liveWallpaperOption = document.getElementById('live-wallpaper-option');
    const settingsOption = document.getElementById('settings-option');
    const statusSpan = document.getElementById('wallpaper-status');
    const liveWallpaperBtn = document.getElementById('live-wallpaper-btn');

    if (liveWallpaperOption) liveWallpaperOption.style.display = 'flex';
    if (settingsOption) settingsOption.style.display = 'flex';

    let isWallpaperActive = false;

    window.electronAPI.isLiveWallpaperActive().then(active => {
        isWallpaperActive = active;
        updateWallpaperUI();
    });

    window.toggleLiveWallpaper = async function () {
        if (liveWallpaperBtn) liveWallpaperBtn.disabled = true;

        try {
            let result;

            if (!isWallpaperActive) {
                result = await window.electronAPI.enableLiveWallpaper();
            } else {
                result = await window.electronAPI.disableLiveWallpaper();
            }

            if (result.success) {
                isWallpaperActive = !isWallpaperActive;
                updateWallpaperUI();
                showAppNotification(result.message, 'success');
            } else {
                showAppNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('[Wallpaper] Error:', error);
            showAppNotification('Не удалось переключить обои', 'error');
        } finally {
            if (liveWallpaperBtn) liveWallpaperBtn.disabled = false;
        }
    };

    function updateWallpaperUI() {
        if (statusSpan) {
            if (isWallpaperActive) {
                statusSpan.textContent = 'ON';
                statusSpan.classList.add('active');
            } else {
                statusSpan.textContent = 'OFF';
                statusSpan.classList.remove('active');
            }
        }
        if (liveWallpaperBtn) {
            if (isWallpaperActive) {
                liveWallpaperBtn.classList.add('active');
            } else {
                liveWallpaperBtn.classList.remove('active');
            }
        }
        applyWallpaperOptimizations(isWallpaperActive);
    }

    function applyWallpaperOptimizations(enabled) {
        if (document.body) {
            document.body.classList.toggle('wallpaper-optimized', enabled);
        }
        if (typeof window.setWallpaperMode === 'function') {
            window.setWallpaperMode(enabled);
        }
    }

    window.openSettingsModal = function () {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.style.display = 'block';
            loadSettingsState();
        }
    };

    window.closeSettingsModal = function () {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    };

    async function loadSettingsState() {
        const autostartCheckbox = document.getElementById('autostart-checkbox');
        if (autostartCheckbox && window.electronAPI.isAutostartEnabled) {
            const enabled = await window.electronAPI.isAutostartEnabled();
            autostartCheckbox.checked = enabled;
        }

        const appInfoText = document.getElementById('app-info-text');
        if (appInfoText && window.electronAPI.getAppInfo) {
            const info = await window.electronAPI.getAppInfo();
            if (info) {
                appInfoText.textContent = `${info.name} v${info.version} (${info.platform} ${info.arch})`;
            }
        }
    }

    const autostartCheckbox = document.getElementById('autostart-checkbox');
    if (autostartCheckbox) {
        autostartCheckbox.addEventListener('change', async (e) => {
            const result = await window.electronAPI.setAutostart(e.target.checked);
            if (!result.success) {
                showAppNotification('Не удалось изменить настройку автозапуска', 'error');
                e.target.checked = !e.target.checked;
            } else {
                showAppNotification(
                    e.target.checked ? 'Автозапуск включён' : 'Автозапуск отключён',
                    'success'
                );
            }
        });
    }

    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                closeSettingsModal();
            }
        });
    }

    function showAppNotification(message, type) {
        const existing = document.querySelectorAll('.app-notification');
        existing.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `app-notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    console.log('[Live Wallpaper] Initialized successfully');
})();

// === Lazy modules ===
const lazyModules = {
    solubility: [
        'js/solubility/data.js',
        'js/solubility/colors.js',
        'js/solubility/solubility-table.js',
        'js/solubility/filters.js',
        'js/solubility/search.js',
        'js/solubility/modal.js',
        'js/solubility/advanced-modal.js'
    ],
    calculator: [
        'js/modules/calculator.js'
    ],
    balancer: [
        'js/modules/balancer.js'
    ]
};

let solubilityLoaded = false;
let calculatorLoaded = false;
let isBalancerLoading = false;

async function loadSolubility() {
    if (solubilityLoaded) return;
    try {
        if (!window.loadScripts) throw new Error('loadScripts is not available');
        await window.loadScripts(lazyModules.solubility);
        solubilityLoaded = true;
        if (typeof renderSolubilityTable === 'function') renderSolubilityTable();
    } catch (error) {
        console.error('Ошибка загрузки растворимости:', error);
    }
}

async function loadCalculator() {
    if (calculatorLoaded) return;
    try {
        if (!window.loadScripts) throw new Error('loadScripts is not available');
        await window.loadScripts(lazyModules.calculator);
        calculatorLoaded = true;
        if (typeof initCalculator === 'function') initCalculator();
    } catch (error) {
        console.error('Ошибка загрузки калькулятора:', error);
    }
}

window.closeBalancerPanel = function (event) {
    if (typeof window.closeBalancer === 'function') {
        window.closeBalancer(event);
    }
};

window.toggleBalancerPanel = async function (event) {
    if (window.loadBalancer) await window.loadBalancer();
    if (typeof window.toggleBalancer === 'function') {
        window.toggleBalancer(event);
    }
};

window.loadBalancer = async function () {
    if (window.balancerLoaded) return;
    if (isBalancerLoading) return;
    isBalancerLoading = true;

    try {
        if (!window.loadScripts) throw new Error('loadScripts is not available');
        await window.loadScripts(lazyModules.balancer);
        window.balancerLoaded = true;
    } catch (error) {
        console.error('Ошибка загрузки балансера:', error);
    } finally {
        isBalancerLoading = false;
    }
};

window.loadSolubility = loadSolubility;
window.loadCalculator = loadCalculator;

function initApp() {
    if (typeof initTheme === 'function') initTheme();
    if (typeof initModal === 'function') initModal();
    if (typeof initElectronConfig === 'function') initElectronConfig();
    if (typeof initSearch === 'function') initSearch();
    if (typeof initUI === 'function') initUI();

    console.log('Приложение загружено');

    if (window.ChemLoader) {
        window.ChemLoader.hide();
    }
}

initApp();
console.log('72 версия');
