// =========================================
// ГЛАВНЫЙ ФАЙЛ - ЗАГРУЗКА ВСЕХ МОДУЛЕЙ
// =========================================

// Функция для динамической загрузки скриптов
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Загружаем все модули последовательно
(async function() {
    try {
        // Загружаем базовые модули
        await loadScript('js/icons.js');
        await loadScript('js/elements.js');

        // Загружаем модули таблицы растворимости
        await loadScript('js/solubility/data.js');
        await loadScript('js/solubility/colors.js');
        await loadScript('js/solubility/solubility-table.js');
        await loadScript('js/solubility/filters.js');
        await loadScript('js/solubility/search.js');
        await loadScript('js/solubility/modal.js');

        // Загружаем модули функционала
        await loadScript('js/modules/modal.js');
        await loadScript('js/modules/theme.js');
        await loadScript('js/modules/calculator.js');
        await loadScript('js/modules/search-filters.js');
        await loadScript('js/modules/ui.js');

        // Последним загружаем particles (для анимаций)
        await loadScript('js/particles.js');

        console.log('Все модули загружены успешно');
    } catch (error) {
        console.error('Ошибка загрузки модулей:', error);
    }
})();
