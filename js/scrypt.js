// =========================================
// ГЛАВНЫЙ ФАЙЛ - ОПТИМИЗИРОВАННАЯ ЗАГРУЗКА
// v2.0 - Ленивая загрузка модулей
// =========================================

// === КРИТИЧЕСКИЕ СКРИПТЫ (загружаются сразу) ===
const criticalScripts = [
    'js/icons.js',
    'js/elements.js',
    'js/particles.js'
];

// === ОСНОВНЫЕ СКРИПТЫ (после DOMContentLoaded) ===
const coreScripts = [
    'js/modules/modal.js',
    'js/modules/theme.js',
    'js/modules/search-filters.js',
    'js/modules/ui.js'
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
        // Считаем общее количество скриптов для прогресса
        totalScripts = criticalScripts.length + coreScripts.length;
        loadedScripts = 0;

        // 1. Критические скрипты — загружаем сразу
        await loadScripts(criticalScripts);

        // 2. Основные скрипты — после DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', async () => {
                await loadScripts(coreScripts);
                initApp();
            });
        } else {
            await loadScripts(coreScripts);
            initApp();
        }
    } catch (error) {
        console.error('❌ Ошибка загрузки модулей:', error);
        // Скрываем прогресс-бар даже при ошибке
        updateProgress(100);
    }
}

function initApp() {
    // Инициализация основного функционала
    if (typeof initTheme === 'function') initTheme();
    if (typeof initModal === 'function') initModal();
    if (typeof initSearch === 'function') initSearch();
    if (typeof initUI === 'function') initUI();

    console.log('✅ Приложение загружено');
}

// === ЛЕНИВАЯ ЗАГРУЗКА ПО ТРЕБОВАНИЮ ===
async function loadSolubility() {
    if (solubilityLoaded) return;

    console.log('⏳ Загрузка модуля растворимости...');
    const startTime = performance.now();

    try {
        await loadScripts(lazyModules.solubility);
        solubilityLoaded = true;

        // Инициализация после загрузки
        if (typeof renderSolubilityTable === 'function') {
            renderSolubilityTable();
        }

        console.log(`✅ Растворимость загружена за ${(performance.now() - startTime).toFixed(0)}мс`);
    } catch (error) {
        console.error('❌ Ошибка загрузки растворимости:', error);
    }
}

async function loadCalculator() {
    if (calculatorLoaded) return;

    console.log('⏳ Загрузка калькулятора...');
    const startTime = performance.now();

    try {
        await loadScripts(lazyModules.calculator);
        calculatorLoaded = true;

        if (typeof initCalculator === 'function') {
            initCalculator();
        }

        console.log(`✅ Калькулятор загружен за ${(performance.now() - startTime).toFixed(0)}мс`);
    } catch (error) {
        console.error('❌ Ошибка загрузки калькулятора:', error);
    }
}

// Делаем функции глобальными для доступа из HTML
window.loadSolubility = loadSolubility;
window.loadCalculator = loadCalculator;

// Старт приложения
init();
