// =========================================
// INIT.JS — Централизованная инициализация всех модулей
// =========================================

// Ждем, пока DOM будет полностью загружен
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Starting application initialization...');

    // Регистрируем все модули для инициализации
    if (window.ChemLoader) {
        // Регистрация модуля скроллколапса
        window.ChemLoader.registerModule('Scroll Collapse', async function() {
            await new Promise(resolve => setTimeout(resolve, 150));
            // Пытаемся вызвать init() если она существует в scroll-collapse.js
            if (typeof init === 'function') {
                init();
            }
            console.log('Scroll collapse module initialized');
        });

        // Регистрация других модулей приложения
        // Добавьте другие модули по мере необходимости

        // Запускаем инициализацию всех зарегистрированных модулей
        console.log('Starting modules initialization...');
        await window.ChemLoader.initializeModules();
        console.log('All modules initialized');
    } else {
        console.warn('ChemLoader not available, initializing modules directly...');
        // Если лоадер недоступен, инициализируем модули напрямую
        if (typeof init === 'function') {
            setTimeout(init, 150);
        }
    }
});

// Также добавим возможность ручной инициализации
window.manualInit = async function() {
    if (window.ChemLoader) {
        await window.ChemLoader.initializeModules();
    }
};

// Функция для показа лоадера при работе с модулями
window.showLoadingForModule = function(moduleName, action) {
    return new Promise(async (resolve) => {
        if (window.ChemLoader) {
            // Показываем лоадер с сообщением
            window.ChemLoader.updateProgress(0);

            // Выполняем действие
            const result = await action();

            // Через некоторое время скрываем лоадер
            setTimeout(() => {
                if (window.ChemLoader) {
                    window.ChemLoader.hide();
                }
                resolve(result);
            }, 500);
        } else {
            // Если лоадер недоступен, просто выполняем действие
            const result = await action();
            resolve(result);
        }
    });
};

// Функция для инициализации фильтров с показом лоадера
window.initializeSolubilityFilters = function() {
    return window.showLoadingForModule('Solubility Filters', async () => {
        // Небольшая задержка для уверенности, что DOM готов
        await new Promise(resolve => setTimeout(resolve, 100));
        // Инициализация фильтров
        if (typeof updateFiltersForSolubility === 'function') {
            updateFiltersForSolubility();
            console.log('Solubility filters module initialized');
        }
        return true;
    });
};