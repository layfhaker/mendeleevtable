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
        if (isScrollUnlocked) return; // Если скролл разблокирован, не обрабатываем

        virtualScrollY += deltaY;
        virtualScrollY = Math.max(0, virtualScrollY); // Не даем уйти в минус

        const threshold = getThreshold();

        if (virtualScrollY >= threshold) {
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
        if (!isScrollUnlocked && virtualScrollY < getThreshold()) {
            event.preventDefault();
            handleVirtualScroll(event.deltaY);
        }
    }

    // Обработка тач-событий (для мобильных)
    let touchStartY = 0;
    let lastTouchY = 0;

    function handleTouchStart(event) {
        if (!isScrollUnlocked) {
            touchStartY = event.touches[0].clientY;
            lastTouchY = touchStartY;
        }
    }

    function handleTouchMove(event) {
        if (!isScrollUnlocked && virtualScrollY < getThreshold()) {
            const currentY = event.touches[0].clientY;
            const deltaY = lastTouchY - currentY; // Инвертируем для правильного направления
            lastTouchY = currentY;

            if (deltaY > 0) { // Свайп вверх
                event.preventDefault();
                handleVirtualScroll(deltaY * 2); // Умножаем для более быстрой реакции
            }
        }
    }

    // Обработка реального скролла страницы
    function handlePageScroll() {
        if (isScrollUnlocked && window.scrollY === 0) {
            // Если пользователь прокрутил в самый верх, блокируем скролл
            lockScroll();
        }
    }

    // Инициализация
    function init() {
        if (!tableContainer) {
            console.error('[Scroll-Collapse] Контейнер .periodic-table-container не найден!');
            return;
        }

        // Устанавливаем начальное состояние
        body.classList.add('scroll-locked');

        // Обработчики событий
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('scroll', handlePageScroll, { passive: true });

        // Обработка изменения размера окна
        window.addEventListener('resize', () => {
            if (!isScrollUnlocked) {
                updateTableScale();
            }
        });

        console.log('[Scroll-Collapse] Система инициализирована');
    }

    // Запуск при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
