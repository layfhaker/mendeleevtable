// =========================================
// МОДАЛЬНОЕ ОКНО ТАБЛИЦЫ РАСТВОРИМОСТИ
// =========================================

// Объявляем функции глобально для доступа из HTML
if (!window.toggleSolubility) {
    window.toggleSolubility = async function () {
        const modal = document.getElementById('solubility-modal');
        if (modal && (getComputedStyle(modal).display === 'flex' || getComputedStyle(modal).display === 'block')) {
            closeSolubility();
        } else {
            await openSolubility();
        }
    };
}

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

    modal.classList.remove('closing');
    modal.style.display = 'flex';
    document.body.classList.add('solubility-open');

    // 4. Управление интерфейсом
    const fabContainer = document.getElementById('fab-container');
    const themeToggle = document.getElementById('theme-toggle');
    const isMobile = window.innerWidth <= 1024;
    if (fabContainer) fabContainer.style.display = isMobile ? 'none' : '';
    if (themeToggle) themeToggle.style.display = '';

    // Явно восстанавливаем видимость кнопок внутри FAB (если они были скрыты ранее)
    const calcButton = document.querySelector('.fab-option[onclick="toggleCalc()"]');
    const particlesButton = document.querySelector('.fab-option[onclick="toggleParticles()"]');
    if (calcButton) calcButton.style.display = '';
    if (particlesButton) particlesButton.style.display = '';

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

    setupSolubilityPanHints();

    // ПРИНУДИТЕЛЬНАЯ ПРИВЯЗКА СОБЫТИЙ ЗАКРЫТИЯ
    bindCloseEvents();
};

window.closeSolubility = function () {
    const modal = document.getElementById('solubility-modal');
    if (!modal) return;

    // Снимаем флаг сразу, чтобы фильтры элементов не оставались заблокированными
    document.body.classList.remove('solubility-open');

    // Добавляем класс для анимации закрытия
    modal.classList.add('closing');

    // Ждём завершения анимации
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('closing');
    }, 360);

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
    if (typeof hideAdvancedModeHint === 'function') hideAdvancedModeHint(true);

    if (typeof clearTableSelection === 'function') clearTableSelection();

    // Восстанавливаем фильтры элементов (единственный вызов, чтобы избежать дублирования обработчиков)
    if (typeof window.restoreElementFiltersSafe === 'function') {
        window.restoreElementFiltersSafe();
    } else if (typeof restoreElementFilters === 'function') {
        restoreElementFilters();
    }

    // Сбрасываем отображение таблицы элементов
    if (typeof resetTableDisplay === 'function') {
        resetTableDisplay();
    }
};

// Функция для надежной привязки закрытия
function bindCloseEvents() {
    const closeButtons = document.querySelectorAll('.close-solubility');
    closeButtons.forEach(btn => {
        if (btn.dataset.boundClose === '1') return;
        btn.dataset.boundClose = '1';
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeSolubility();
        });
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeSolubility();
        });
    });

    const modal = document.getElementById('solubility-modal');
    if (modal && modal.dataset.boundBackdrop !== '1') {
        modal.dataset.boundBackdrop = '1';
        const onBackdrop = (e) => {
            if (e.target.closest('.modal-content')) return;
            closeSolubility();
        };
        modal.addEventListener('click', onBackdrop);
        modal.addEventListener('pointerdown', onBackdrop, true);
    }
}

// Запускаем привязку событий сразу при загрузке скрипта
bindCloseEvents();
// Глобальный клик по фону (надежнее, чем обработчик на модалке)
if (!window.__solubilityBackdropListener) {
    window.__solubilityBackdropListener = true;
    document.addEventListener('pointerdown', (e) => {
        const modal = document.getElementById('solubility-modal');
        if (!modal) return;
        const isOpen = getComputedStyle(modal).display !== 'none';
        if (!isOpen) return;
        // Не закрываем таблицу, если взаимодействие происходит с другой модалкой (например, advanced).
        const otherModal = e.target.closest('.modal');
        if (otherModal && otherModal.id !== 'solubility-modal') return;
        // Не закрываем модалку при взаимодействии с FAB или панелью фильтров
        if (
            e.target.closest('.fab-container') ||
            e.target.closest('#theme-toggle') ||
            e.target.closest('#filters-panel') ||
            e.target.closest('#solubility-search-panel')
        ) return;
        if (e.target.closest('.modal-content')) return;
        closeSolubility();
    }, true);
}
function setupSolubilityPanHints() {
    const content = document.querySelector('.solubility-content');
    const wrapper = document.querySelector('.solubility-wrapper');
    if (!content || !wrapper) return;

    let hints = wrapper.querySelector('.pan-hints--solubility');
    if (!hints) {
        const existingInContent = content.querySelector('.pan-hints--solubility');
        if (existingInContent) {
            hints = existingInContent;
            wrapper.appendChild(hints);
        } else {
        hints = document.createElement('div');
        hints.className = 'pan-hints pan-hints--solubility';
        hints.innerHTML = `
            <div class="pan-hint pan-hint--left"></div>
            <div class="pan-hint pan-hint--right"></div>
            <div class="pan-hint pan-hint--top"></div>
            <div class="pan-hint pan-hint--bottom"></div>
        `;
        wrapper.appendChild(hints);
        }
    }

    const left = hints.querySelector('.pan-hint--left');
    const right = hints.querySelector('.pan-hint--right');
    const top = hints.querySelector('.pan-hint--top');
    const bottom = hints.querySelector('.pan-hint--bottom');

    const update = () => {
        const maxX = Math.max(0, wrapper.scrollWidth - wrapper.clientWidth);
        const maxY = Math.max(0, wrapper.scrollHeight - wrapper.clientHeight);
        const x = wrapper.scrollLeft;
        const y = wrapper.scrollTop;

        left.classList.toggle('is-visible', x > 2);
        right.classList.toggle('is-visible', x < maxX - 2);
        top.classList.toggle('is-visible', y > 2);
        bottom.classList.toggle('is-visible', y < maxY - 2);
    };

    wrapper.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    if (!sessionStorage.getItem('solubilityPanHintShown')) {
        sessionStorage.setItem('solubilityPanHintShown', '1');
        setTimeout(() => {
            const maxX = Math.max(0, wrapper.scrollWidth - wrapper.clientWidth);
            if (maxX > 0) {
                wrapper.scrollLeft += 10;
                setTimeout(() => {
                    wrapper.scrollLeft -= 10;
                }, 220);
            }
        }, 400);
    }
}
