// =========================================
// МОДАЛЬНОЕ ОКНО ТАБЛИЦЫ РАСТВОРИМОСТИ
// =========================================

// Переключение таблицы растворимости (toggle)
function toggleSolubility() {
    const modal = document.getElementById('solubility-modal');
    if (modal.style.display === 'flex') {
        closeSolubility();
    } else {
        openSolubility();
    }
}

// Вызов функции открытия (не забудь добавить в FAB)
function openSolubility() {

    const modal = document.getElementById('solubility-modal');
    // Генерируем таблицу только если она пустая (оптимизация)
    if(document.getElementById('solubility-table').innerHTML === "") {
        renderSolubilityTable();
    }
    modal.style.display = 'flex';
    initActivitySeriesUI();
    if (window.initSolubilityDrag) {
        window.initSolubilityDrag();
    }

    // Добавляем класс для скрытия FAB и кнопки темы на мобильных
    document.body.classList.add('solubility-open');

    // Закрываем FAB меню если открыто
    const fab = document.getElementById('fab-container');
    if (fab) fab.classList.remove('active');

    // Скрываем кнопки калькулятора и частиц в FAB меню
    const calcButton = document.querySelector('.fab-option[onclick="toggleCalc()"]');
    const particlesButton = document.querySelector('.fab-option[onclick="toggleParticles()"]');
    if (calcButton) calcButton.style.display = 'none';
    if (particlesButton) particlesButton.style.display = 'none';

    // Обновляем фильтры для таблицы растворимости
    updateFiltersForSolubility();

    // Включаем drag-to-scroll для таблицы
    const wrapper = document.querySelector('.solubility-wrapper');
    if (wrapper && !wrapper.dataset.dragScrollEnabled) {
        enableDragScroll(wrapper);
        wrapper.dataset.dragScrollEnabled = 'true';
    }

    // Включаем Ctrl+колесико для горизонтального скролла
    if (wrapper && !wrapper.dataset.ctrlScrollEnabled) {
        wrapper.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                wrapper.scrollLeft += e.deltaY;
            }
        }, { passive: false });
        wrapper.dataset.ctrlScrollEnabled = 'true';
    }
}

function closeSolubility() {
    const modal = document.getElementById('solubility-modal');
    // Проверка: существует ли модальное окно?
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.warn("Элемент 'solubility-modal' не найден в HTML!");
    }

    // Убираем класс для показа FAB и кнопки темы на мобильных
    document.body.classList.remove('solubility-open');

    // Закрываем панель поиска если открыта
    const searchPanel = document.getElementById('solubility-search-panel');
    if (searchPanel) searchPanel.classList.remove('active');
    const searchBtn = document.getElementById('solubility-search-btn');
    if (searchBtn) searchBtn.classList.remove('active');

    // Если есть функция очистки выделения
    if (typeof clearTableSelection === 'function') {
        clearTableSelection();
    }

    // Возвращаем кнопки калькулятора и частиц в FAB меню
    const calcButton = document.querySelector('.fab-option[onclick="toggleCalc()"]');
    const particlesButton = document.querySelector('.fab-option[onclick="toggleParticles()"]');
    if (calcButton) calcButton.style.display = '';
    if (particlesButton) particlesButton.style.display = '';

    // Восстанавливаем обычные фильтры элементов
    restoreElementFilters();
}
