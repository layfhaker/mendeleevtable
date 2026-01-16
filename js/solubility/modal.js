// =========================================
// МОДАЛЬНОЕ ОКНО ТАБЛИЦЫ РАСТВОРИМОСТИ
// =========================================

// Объявляем функции глобально для доступа из HTML
window.toggleSolubility = async function () {
    const modal = document.getElementById('solubility-modal');
    // Проверяем, открыто ли окно
    if (modal && (getComputedStyle(modal).display === 'flex' || getComputedStyle(modal).display === 'block')) {
        closeSolubility();
    } else {
        await openSolubility();
    }
};

window.openSolubility = async function () {
    // 1. Загрузка модуля растворимости, если он еще не загружен
    if (window.loadSolubility) {
        await window.loadSolubility();
    }

    const modal = document.getElementById('solubility-modal');
    if (!modal) return;

    // 2. Генерация таблицы, если контейнер пуст
    const table = document.getElementById('solubility-table');
    if (table && table.innerHTML.trim() === "") {
        if (typeof renderSolubilityTable === 'function') {
            renderSolubilityTable();
        }
    }

    // 3. Открытие окна

    // 3. Открытие окна
    // ... animation removed for simplicity reversion ...

    modal.style.display = 'flex';
    document.body.classList.add('solubility-open');

    // 4. Управление интерфейсом (АДАПТИВНОЕ)
    const fabContainer = document.getElementById('fab-container');
    const themeToggle = document.getElementById('theme-toggle');

    if (window.innerWidth <= 1024) {
        // МОБИЛЬНЫЕ: Скрываем всё лишнее, чтобы освободить место
        if (fabContainer) fabContainer.style.display = 'none';
        if (themeToggle) themeToggle.style.display = 'none';
    } else {
        // ПК: Убеждаемся, что всё видно (на случай, если было скрыто ранее)
        if (fabContainer) fabContainer.style.display = '';
        if (themeToggle) themeToggle.style.display = '';

        // Явно восстанавливаем видимость кнопок внутри FAB (если они были скрыты)
        const calcButton = document.querySelector('.fab-option[onclick="toggleCalc()"]');
        const particlesButton = document.querySelector('.fab-option[onclick="toggleParticles()"]');
        if (calcButton) calcButton.style.display = '';
        if (particlesButton) particlesButton.style.display = '';
    }

    // 5. Инициализация подмодулей (продвинутый режим, ряд активности, поиск)
    if (typeof initAdvancedModeButton === 'function') initAdvancedModeButton();
    if (typeof initActivitySeriesUI === 'function') initActivitySeriesUI();
    if (typeof updateFiltersForSolubility === 'function') {
        console.log('openSolubility: Calling filter initialization, window.isColorMode:', window.isColorMode);
        // Используем лоадер для инициализации фильтров
        if (typeof window.initializeSolubilityFilters === 'function') {
            console.log('Using initializeSolubilityFilters');
            window.initializeSolubilityFilters();
        } else {
            console.log('Directly calling updateFiltersForSolubility');
            updateFiltersForSolubility();
        }
    } else {
        console.log('updateFiltersForSolubility function is not available');
    }

    // Дополнительно вызываем обновление фильтров, чтобы убедиться, что они установлены правильно
    setTimeout(() => {
        if (typeof updateFiltersForSolubility === 'function') {
            console.log('openSolubility: Second call to updateFiltersForSolubility after delay, window.isColorMode:', window.isColorMode);
            updateFiltersForSolubility();
        }
    }, 200);

    // 6. Инициализация перетаскивания (Drag Scroll)
    const wrapper = document.querySelector('.solubility-wrapper');
    if (wrapper) {
        if (!wrapper.dataset.dragScrollEnabled && typeof enableDragScroll === 'function') {
            enableDragScroll(wrapper);
            wrapper.dataset.dragScrollEnabled = 'true';
        }
        // Горизонтальный скролл колесиком мыши + Ctrl
        if (!wrapper.dataset.ctrlScrollEnabled) {
            wrapper.addEventListener('wheel', (e) => {
                if (e.ctrlKey) {
                    e.preventDefault();
                    wrapper.scrollLeft += e.deltaY;
                }
            }, { passive: false });
            wrapper.dataset.ctrlScrollEnabled = 'true';
        }
    }

    // ПРИНУДИТЕЛЬНАЯ ПРИВЯЗКА СОБЫТИЙ ЗАКРЫТИЯ
    bindCloseEvents();
};

window.closeSolubility = function () {
    const modal = document.getElementById('solubility-modal');
    if (!modal) return;

    modal.style.display = 'none';
    document.body.classList.remove('solubility-open');

    // Восстанавливаем интерфейс (сбрасываем стили скрытия)
    const fabContainer = document.getElementById('fab-container');
    const themeToggle = document.getElementById('theme-toggle');
    if (fabContainer) fabContainer.style.display = '';
    if (themeToggle) themeToggle.style.display = '';

    // Восстанавливаем кнопки FAB (калькулятор и частицы)
    const calcButton = document.querySelector('.fab-option[onclick="toggleCalc()"]');
    const particlesButton = document.querySelector('.fab-option[onclick="toggleParticles()"]');
    if (calcButton) calcButton.style.display = '';
    if (particlesButton) particlesButton.style.display = '';

    // Сбрасываем состояния поиска и фильтров
    const searchPanel = document.getElementById('solubility-search-panel');
    if (searchPanel) searchPanel.classList.remove('active');

    const searchBtn = document.getElementById('solubility-search-btn');
    if (searchBtn) searchBtn.classList.remove('active');

    if (typeof clearTableSelection === 'function') clearTableSelection();
    if (typeof restoreElementFilters === 'function') {
        restoreElementFilters();

        // Also reset the main table display to ensure filters are properly cleared
        if (typeof resetTableDisplay === 'function') {
            resetTableDisplay();
        }
    }
};

// Функция для надежной привязки закрытия
function bindCloseEvents() {
    const closeButtons = document.querySelectorAll('.close-solubility');
    closeButtons.forEach(btn => {
        btn.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            closeSolubility();
        };
        // Добавляем поддержку тач-событий для мобильных
        btn.ontouchstart = function (e) {
            e.preventDefault();
            e.stopPropagation();
            closeSolubility();
        };
    });

    const modal = document.getElementById('solubility-modal');
    if (modal) {
        modal.onclick = function (e) {
            if (e.target === modal) {
                closeSolubility();
            }
        };
    }
}

// Запускаем привязку событий сразу при загрузке скрипта
bindCloseEvents();