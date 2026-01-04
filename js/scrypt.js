// =========================================
// ГЛАВНЫЙ ФАЙЛ - ОПТИМИЗИРОВАННАЯ ЗАГРУЗКА
// v2.1 - Исправлена интеграция Nodemap и обертки
// =========================================

// === КРИТИЧЕСКИЕ СКРИПТЫ (загружаются сразу) ===
const criticalScripts = [
    'js/icons.js',
    'js/elements.js',
    'js/particles.js',
    'js/modules/mobile-layout.js',
];

// === ОСНОВНЫЕ СКРИПТЫ (после DOMContentLoaded) ===
// Сюда переносим nodemap, чтобы они грузились строго после ядра
const coreScripts = [
    'js/modules/modal.js',
    'js/modules/theme.js',
    'js/modules/search-filters.js',
    'js/modules/ui.js',
    // Интегрируем Nodemap в общий поток:
    'js/nodemap/nodemap-parser.js',
    'js/nodemap/nodemap-layout.js',
    'js/nodemap/nodemap-canvas.js',
    'js/nodemap/nodemap-flow-data.js',
    'js/nodemap/nodemap-flow-layout.js',
    'js/nodemap/nodemap-flow-canvas.js',
    'js/nodemap/nodemap-modal.js',
    'js/nodemap/nodemap-init.js'
];

// === ОТЛОЖЕННЫЕ МОДУЛИ (загружаются по требованию) ===
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
    ]
};

// Флаги загрузки
let solubilityLoaded = false;
let calculatorLoaded = false;

// Прогресс загрузки
let totalScripts = 0;
let loadedScripts = 0;

// === УТИЛИТЫ ЗАГРУЗКИ ===
function updateProgress(percent) {
    const bar = document.getElementById('loading-progress');
    if (bar) {
        bar.style.width = percent + '%';
        if (percent >= 100) {
            setTimeout(() => {
                const container = document.getElementById('loading-bar');
                if (container) container.style.display = 'none';
            }, 300);
        }
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        // Проверяем, не загружен ли уже
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            loadedScripts++;
            updateProgress((loadedScripts / totalScripts) * 100);
            resolve();
        };
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
    });
}

async function loadScripts(scripts) {
    for (const src of scripts) {
        await loadScript(src);
    }
}

// === ИНИЦИАЛИЗАЦИЯ ===
async function init() {
    try {
        totalScripts = criticalScripts.length + coreScripts.length;
        loadedScripts = 0;

        // 1. Критические
        await loadScripts(criticalScripts);

        // 2. Основные (включая UI и Nodemap)
        const runCore = async () => {
            await loadScripts(coreScripts);
            initApp();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runCore);
        } else {
            await runCore();
        }
    } catch (error) {
        console.error('❌ Ошибка загрузки модулей:', error);
        updateProgress(100);
    }
}

function initApp() {
    if (typeof initTheme === 'function') initTheme();
    if (typeof initModal === 'function') initModal();
    if (typeof initSearch === 'function') initSearch();
    if (typeof initUI === 'function') initUI();
    // Nodemap инициализируется сам внутри nodemap-init.js, но теперь он точно загружен

    console.log('✅ Приложение загружено');
}

// === ЛЕНИВАЯ ЗАГРУЗКА ===
async function loadSolubility() {
    if (solubilityLoaded) return;
    console.log('⏳ Загрузка модуля растворимости...');
    try {
        await loadScripts(lazyModules.solubility);
        solubilityLoaded = true;
        if (typeof renderSolubilityTable === 'function') renderSolubilityTable();
    } catch (error) {
        console.error('❌ Ошибка загрузки растворимости:', error);
    }
}

async function loadCalculator() {
    if (calculatorLoaded) return;
    console.log('⏳ Загрузка калькулятора...');
    try {
        await loadScripts(lazyModules.calculator);
        calculatorLoaded = true;
        if (typeof initCalculator === 'function') initCalculator();
    } catch (error) {
        console.error('❌ Ошибка загрузки калькулятора:', error);
    }
}

window.loadSolubility = loadSolubility;
window.loadCalculator = loadCalculator;

init();
