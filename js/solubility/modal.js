// =========================================
// МОДАЛЬНОЕ ОКНО ТАБЛИЦЫ РАСТВОРИМОСТИ
// =========================================

// Переключение таблицы растворимости (toggle)
// =========================================
// МОДАЛЬНОЕ ОКНО ТАБЛИЦЫ РАСТВОРИМОСТИ
// =========================================

async function toggleSolubility() {
    const modal = document.getElementById('solubility-modal');
    if (modal.style.display === 'flex') {
        closeSolubility();
    } else {
        await openSolubility();
    }
}

async function openSolubility() {
    // Загружаем модуль растворимости если ещё не загружен
    if (window.loadSolubility) {
        await window.loadSolubility();
    }

    const modal = document.getElementById('solubility-modal');

    // Генерируем таблицу только если она пустая
    if(document.getElementById('solubility-table').innerHTML === "") {
        if (typeof renderSolubilityTable === 'function') {
            renderSolubilityTable();
        }
    }

    modal.style.display = 'flex';

    // Инициализируем кнопку продвинутого режима
    if (typeof initAdvancedModeButton === 'function') {
        initAdvancedModeButton();
    }

    // Инициализация ряда активности
    if (typeof initActivitySeriesUI === 'function') {
        initActivitySeriesUI();
    }

    if (window.initSolubilityDrag) {
        window.initSolubilityDrag();
    }

    document.body.classList.add('solubility-open');

    // --- ИСПРАВЛЕНИЕ №1: Скрываем кнопки мгновенно ---
    const fabContainer = document.getElementById('fab-container');
    const themeToggle = document.getElementById('theme-toggle'); // Кнопка темы

    if (fabContainer) fabContainer.style.display = 'none'; // <--- ДОБАВИТЬ ЭТО
    if (themeToggle) themeToggle.style.display = 'none';   // <--- ДОБАВИТЬ ЭТО
    // -------------------------------------------------

    const calcButton = document.querySelector('.fab-option[onclick="toggleCalc()"]');
    const particlesButton = document.querySelector('.fab-option[onclick="toggleParticles()"]');
    if (calcButton) calcButton.style.display = 'none';
    if (particlesButton) particlesButton.style.display = 'none';

    updateFiltersForSolubility();

    const wrapper = document.querySelector('.solubility-wrapper');
    if (wrapper && !wrapper.dataset.dragScrollEnabled) {
        enableDragScroll(wrapper);
        wrapper.dataset.dragScrollEnabled = 'true';
    }

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
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.warn("Элемент 'solubility-modal' не найден в HTML!");
    }

    document.body.classList.remove('solubility-open');

    // --- ИСПРАВЛЕНИЕ №2: Возвращаем кнопки ---
    const fabContainer = document.getElementById('fab-container');
    const themeToggle = document.getElementById('theme-toggle');

    if (fabContainer) fabContainer.style.display = ''; // <--- ДОБАВИТЬ ЭТО (сброс стиля вернет их на место)
    if (themeToggle) themeToggle.style.display = '';   // <--- ДОБАВИТЬ ЭТО
    // -----------------------------------------

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

    restoreElementFilters();
}