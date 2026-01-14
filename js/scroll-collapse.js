/* =========================================
   SCROLL-COLLAPSE.JS — Логика виртуального скролла
   ========================================= */

(function() {
    'use strict';

    // Конфигурация
    const CONFIG = {
        THRESHOLD_DESKTOP: 300,  // Порог для десктопа (px)
        THRESHOLD_MOBILE: 200,   // Порог для мобильных (px)
        MIN_SCALE_DESKTOP: 0.6,  // Минимальный масштаб на десктопе
        MIN_SCALE_MOBILE: 0.5,   // Минимальный масштаб на мобильных
        MAX_SCALE: 1.0,          // Максимальный масштаб
    };

    // Состояние
    let virtualScrollY = 0;
    let isScrollUnlocked = false;
    let rafId = null;

    // Элементы DOM
    const tableContainer = document.querySelector('.periodic-table-container');
    const body = document.body;

    // Определение мобильного устройства
    function isMobile() {
        return window.innerWidth < 768;
    }

    // Получение текущего порога
    function getThreshold() {
        return isMobile() ? CONFIG.THRESHOLD_MOBILE : CONFIG.THRESHOLD_DESKTOP;
    }

    // Получение минимального масштаба
    function getMinScale() {
        return isMobile() ? CONFIG.MIN_SCALE_MOBILE : CONFIG.MIN_SCALE_DESKTOP;
    }

    // Обработка виртуального скролла
    function handleVirtualScroll(deltaY) {
        // Если любой из активных элементов открыт, не обрабатываем скролл
        if (document.body.classList.contains('balancer-active') ||
            document.body.classList.contains('solubility-open') ||
            document.body.classList.contains('calc-active') ||
            (document.getElementById('filters-panel') && document.getElementById('filters-panel').classList.contains('active'))) {
            return;
        }

        if (isScrollUnlocked) return; // Если скролл разблокирован, не обрабатываем

        virtualScrollY += deltaY;
        virtualScrollY = Math.max(0, virtualScrollY); // Не даем уйти в минус

        const threshold = getThreshold();

        console.log('[Scroll-Collapse] Virtual scroll:', {
            virtualScrollY,
            threshold,
            willUnlock: virtualScrollY >= threshold
        });

        if (virtualScrollY >= threshold) {
            console.log('[Scroll-Collapse] 🔓 Разблокировка скролла!');
            unlockScroll();
        } else {
            updateTableScale();
        }
    }

    // Обновление масштаба таблицы
    function updateTableScale() {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
            const threshold = getThreshold();
            const minScale = getMinScale();
            const progress = Math.min(virtualScrollY / threshold, 1);
            const scale = CONFIG.MAX_SCALE - (progress * (CONFIG.MAX_SCALE - minScale));

            console.log('[Scroll-Collapse] Update scale:', {
                progress: (progress * 100).toFixed(1) + '%',
                scale: scale.toFixed(2)
            });

            tableContainer.style.transform = `scale(${scale})`;
            rafId = null;
        });
    }

    // Разблокировка реального скролла
    function unlockScroll() {
        if (isScrollUnlocked) return;

        isScrollUnlocked = true;
        body.classList.remove('scroll-locked');
        body.classList.add('scroll-unlocked');
        tableContainer.classList.add('scroll-collapsed');

        const minScale = getMinScale();
        tableContainer.style.transform = `scale(${minScale})`;
    }

    // Блокировка скролла (возврат к начальному состоянию)
    function lockScroll() {
        if (!isScrollUnlocked) return;

        isScrollUnlocked = false;
        virtualScrollY = 0;
        body.classList.remove('scroll-unlocked');
        body.classList.add('scroll-locked');
        tableContainer.classList.remove('scroll-collapsed');
        tableContainer.style.transform = 'scale(1)';

        // Прокручиваем страницу наверх
        window.scrollTo(0, 0);
    }

    // Обработка колесика мыши (для десктопа)
    function handleWheel(event) {
        // Если любой из активных элементов открыт, не обрабатываем скролл
        if (document.body.classList.contains('balancer-active') ||
            document.body.classList.contains('solubility-open') ||
            document.body.classList.contains('calc-active') ||
            (document.getElementById('filters-panel') && document.getElementById('filters-panel').classList.contains('active'))) {
            return;
        }

        console.log('[Scroll-Collapse] Wheel event:', {
            deltaY: event.deltaY,
            virtualScrollY,
            threshold: getThreshold(),
            isScrollUnlocked
        });

        if (!isScrollUnlocked && virtualScrollY < getThreshold()) {
            event.preventDefault();
            handleVirtualScroll(event.deltaY);
        }
    }

    // Обработка тач-событий (для мобильных)
    let touchStartY = 0;
    let lastTouchY = 0;

    function handleTouchStart(event) {
        // Если любой из активных элементов открыт, не обрабатываем тач-события
        if (document.body.classList.contains('balancer-active') ||
            document.body.classList.contains('solubility-open') ||
            document.body.classList.contains('calc-active') ||
            (document.getElementById('filters-panel') && document.getElementById('filters-panel').classList.contains('active'))) {
            return;
        }

        if (!isScrollUnlocked) {
            touchStartY = event.touches[0].clientY;
            lastTouchY = touchStartY;
        }
    }

    function handleTouchMove(event) {
        // Если любой из активных элементов открыт, не обрабатываем тач-события
        if (document.body.classList.contains('balancer-active') ||
            document.body.classList.contains('solubility-open') ||
            document.body.classList.contains('calc-active') ||
            (document.getElementById('filters-panel') && document.getElementById('filters-panel').classList.contains('active'))) {
            return;
        }

        if (!isScrollUnlocked && virtualScrollY < getThreshold()) {
            const currentY = event.touches[0].clientY;
            const deltaY = lastTouchY - currentY; // Инвертируем для правильного направления
            lastTouchY = currentY;

            if (deltaY > 0) { // Свайп вверх
                // Проверяем, можно ли предотвратить действие по умолчанию
                if (event.cancelable) {
                    event.preventDefault();
                }
                handleVirtualScroll(deltaY * 2); // Умножаем для более быстрой реакции
            }
        }
    }

    // Обработка реального скролла страницы
    function handlePageScroll() {
        // Если любой из активных элементов открыт, не блокируем скролл
        if (document.body.classList.contains('balancer-active') ||
            document.body.classList.contains('solubility-open') ||
            document.body.classList.contains('calc-active') ||
            (document.getElementById('filters-panel') && document.getElementById('filters-panel').classList.contains('active'))) {
            return;
        }

        if (isScrollUnlocked && window.scrollY === 0) {
            // Если пользователь прокрутил в самый верх, блокируем скролл
            lockScroll();
        }
    }

    // Инициализация
    function init() {
        console.log('[Scroll-Collapse] Начало инициализации...');

        // Check if the device is Mobile (width <= 1024px) OR if running in Electron (check existence of window.electronAPI)
        if (window.innerWidth <= 1024 || window.electronAPI) {
            console.log('[Scroll-Collapse] Mobile or Electron detected - disabling scroll collapse and hiding footer');

            // Force the page to stay locked (overflow: hidden on body)
            document.body.style.overflow = 'hidden';

            // Ensure .below-table-content is hidden (display: none)
            const belowTableContent = document.querySelector('.below-table-content');
            if (belowTableContent) {
                belowTableContent.style.display = 'none';
            }

            // Return early - don't initialize scroll logic
            return;
        }

        if (!tableContainer) {
            console.error('[Scroll-Collapse] Контейнер .periodic-table-container не найден!');
            console.log('[Scroll-Collapse] Доступные элементы:', document.body.children);
            return;
        }

        console.log('[Scroll-Collapse] Контейнер найден:', tableContainer);

        // Устанавливаем начальное состояние
        body.classList.add('scroll-locked');
        console.log('[Scroll-Collapse] Класс scroll-locked добавлен');

        // Обработчики событий
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('scroll', handlePageScroll, { passive: true });

        console.log('[Scroll-Collapse] Event listeners добавлены');

        // Обработка изменения размера окна
        window.addEventListener('resize', () => {
            if (!isScrollUnlocked) {
                updateTableScale();
            }
        });

        console.log('[Scroll-Collapse] ✅ Система инициализирована успешно!');
        console.log('[Scroll-Collapse] Порог:', getThreshold(), 'px');
        console.log('[Scroll-Collapse] Мин. масштаб:', getMinScale());
    }

    // Запуск при загрузке DOM
    if (document.readyState === 'loading') {
        console.log('[Scroll-Collapse] Ожидание DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', init);
    } else {
        console.log('[Scroll-Collapse] DOM уже загружен, запуск init()');
        init();
    }

    // Функции для отключения и включения системы скроллколапса
    // Они доступны глобально, чтобы другие модули могли их использовать
    window.disableScrollCollapseSystem = function() {
        // Disable scroll-collapse functionality
        const tableContainer = document.querySelector('.periodic-table-container');
        if (tableContainer) {
            tableContainer.classList.add('scroll-locked'); // Add class to prevent scaling
        }

        // Hide below-table-content
        const belowTableContent = document.querySelector('.below-table-content');
        if (belowTableContent) {
            belowTableContent.style.display = 'none';
        }

        // Prevent scroll-collapse event listeners from working
        const scrollCollapseListeners = document.body.getAttribute('data-scroll-collapse-disabled');
        if (!scrollCollapseListeners) {
            document.body.setAttribute('data-scroll-collapse-disabled', 'true');
        }
    };

    window.restoreScrollCollapseSystem = function() {
        // Re-enable scroll-collapse functionality
        const tableContainer = document.querySelector('.periodic-table-container');
        if (tableContainer) {
            tableContainer.classList.remove('scroll-locked'); // Remove class that prevented scaling
        }

        // Show below-table-content if appropriate
        const belowTableContent = document.querySelector('.below-table-content');
        if (belowTableContent) {
            // Only show if scroll-collapse is unlocked (depends on your implementation)
            // For now, we'll restore the default behavior
            belowTableContent.style.display = '';
        }

        // Allow scroll-collapse event listeners to work again
        document.body.removeAttribute('data-scroll-collapse-disabled');
    };
})();

