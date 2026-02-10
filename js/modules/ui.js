// =========================================
// МОДУЛЬ: UI (МЕНЮ И ПРОЧЕЕ)
// =========================================

function toggleMenu() {
    const fab = document.getElementById('fab-container');
    fab.classList.toggle('active');

    const filtersPanel = document.getElementById('filters-panel');
    if (filtersPanel && filtersPanel.classList.contains('active')) {
        if (filtersPanel.classList.contains('closing')) return;
        filtersPanel.classList.add('closing');
        setTimeout(() => {
            filtersPanel.classList.remove('active', 'closing');
        }, 360);
    }
}

let particlesEnabled = true;
function toggleParticles() {
    const canvas = document.getElementById('particles-canvas');
    particlesEnabled = !particlesEnabled;

    if (canvas) {
        canvas.style.display = particlesEnabled ? 'block' : 'none';
    }

    updateParticlesToggleUI();
}

function updateParticlesToggleUI() {
    const particlesBtn = document.querySelector('.fab-option[onclick="toggleParticles()"] .fab-btn');
    const statusBadge = document.getElementById('particles-status');

    if (particlesBtn) {
        particlesBtn.classList.toggle('active', particlesEnabled);
    }
    if (statusBadge) {
        statusBadge.textContent = particlesEnabled ? 'ON' : 'OFF';
        statusBadge.classList.toggle('active', particlesEnabled);
    }
}

function resetFabPosition() {
    const fab = document.getElementById('fab-container');
    if (fab) {
        fab.style.bottom = '';
        fab.style.right = '';
        fab.style.left = '';
        fab.style.top = '';
        fab.style.transform = '';
    }
}

// =========================================
// Drag & Drop Scrolling
// =========================================
function initDragScroll(selector) {
    const slider = document.querySelector(selector);
    if (!slider) return;

    let isDown = false;
    let startX, startY;
    let scrollLeft, scrollTop;

    slider.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.closest('.element')) return;
        isDown = true;
        slider.classList.add('active');
        document.body.classList.add('grabbing');
        startX = e.pageX - slider.offsetLeft;
        startY = e.pageY - slider.offsetTop;
        scrollLeft = slider.scrollLeft;
        scrollTop = slider.scrollTop;
    });

    const stopDrag = () => {
        isDown = false;
        slider.classList.remove('active');
        document.body.classList.remove('grabbing');
    };

    slider.addEventListener('mouseleave', stopDrag);
    slider.addEventListener('mouseup', stopDrag);

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const y = e.pageY - slider.offsetTop;
        const walkX = (x - startX) * 1.5;
        const walkY = (y - startY) * 1.5;
        slider.scrollLeft = scrollLeft - walkX;
        slider.scrollTop = scrollTop - walkY;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Скролл для всей страницы
    let isWindowDown = false;
    let winStartX, winStartY, winScrollLeft, winScrollTop;

    window.addEventListener('mousedown', (e) => {
        if (e.target.closest('.modal') || e.target.closest('.filters-panel') || e.target.closest('.calc-panel') || e.target.closest('.fab-container')) return;
        isWindowDown = true;
        document.body.classList.add('grabbing');
        winStartX = e.pageX;
        winStartY = e.pageY;
        winScrollLeft = window.scrollX;
        winScrollTop = window.scrollY;
    });

    window.addEventListener('mouseup', () => {
        isWindowDown = false;
        document.body.classList.remove('grabbing');
    });

    window.addEventListener('mousemove', (e) => {
        if (!isWindowDown) return;
        e.preventDefault();
        const x = e.pageX;
        const y = e.pageY;
        window.scrollTo(winScrollLeft - (x - winStartX) * 1.5, winScrollTop - (y - winStartY) * 1.5);
    });

    initPanHints();
    updateParticlesToggleUI();
});

window.initSolubilityDrag = function() {
    initDragScroll('.solubility-wrapper');
};

// =========================================
// Панорамные подсказки (градиенты + микро-сдвиг)
// =========================================
function initPanHints() {
    const tableContainer = document.querySelector('.periodic-table-container');
    if (tableContainer) {
        const hints = buildPanHints(tableContainer, 'table');

        const update = () => {
            const maxX = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
            const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            const locked = document.body.classList.contains('scroll-locked');
            const x = window.scrollX;
            const y = window.scrollY;

            setHintVisible(hints.left, locked && x > 2);
            setHintVisible(hints.right, locked && x < maxX - 2);
            setHintVisible(hints.top, locked && y > 2);
            setHintVisible(hints.bottom, locked && y < maxY - 2);
        };

        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();

        // Микро-анимация 1 раз за сессию
        if (!sessionStorage.getItem('tablePanHintShown')) {
            sessionStorage.setItem('tablePanHintShown', '1');
            setTimeout(() => {
                const maxX = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
                if (maxX > 0) {
                    window.scrollBy({ left: 10, behavior: 'smooth' });
                    setTimeout(() => {
                        window.scrollBy({ left: -10, behavior: 'smooth' });
                    }, 220);
                }
            }, 450);
        }
    }
}

function buildPanHints(container, prefix) {
    const hints = document.createElement('div');
    hints.className = `pan-hints pan-hints--${prefix}`;

    const left = document.createElement('div');
    left.className = 'pan-hint pan-hint--left';
    const right = document.createElement('div');
    right.className = 'pan-hint pan-hint--right';
    const top = document.createElement('div');
    top.className = 'pan-hint pan-hint--top';
    const bottom = document.createElement('div');
    bottom.className = 'pan-hint pan-hint--bottom';

    hints.appendChild(left);
    hints.appendChild(right);
    hints.appendChild(top);
    hints.appendChild(bottom);
    container.appendChild(hints);

    return { left, right, top, bottom };
}

function setHintVisible(el, visible) {
    if (!el) return;
    el.classList.toggle('is-visible', Boolean(visible));
}

// =========================================
// ОБЕРТКИ ДЛЯ ЛЕНИВОЙ ЗАГРУЗКИ (FIX)
// =========================================

// 1. Калькулятор
window.toggleCalc = async function(event) {
    const PANEL_ANIM_MS = 360;
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const panel = document.getElementById('calc-panel');
    const fab = document.getElementById('fab-container');
    const themeToggle = document.getElementById('theme-toggle');

    // Закрытие всегда доступно, даже если одновременно активировались другие состояния UI.
    if (panel && panel.classList.contains('active')) {
        if (panel.classList.contains('closing')) return;
        panel.classList.add('closing');
        document.body.classList.remove('calc-active');
        if (themeToggle) themeToggle.style.display = '';
        resetFabPosition();
        if (window.mobileLayout && typeof window.mobileLayout.resetTransform === 'function') {
            window.mobileLayout.resetTransform();
        }

        setTimeout(() => {
            panel.classList.remove('active', 'closing');
            if (window.innerWidth <= 1024 && fab) {
                fab.classList.add('active');
            }
        }, PANEL_ANIM_MS);
        return;
    }

    const isElementModalOpen = document.body.classList.contains('modal-open');
    const isBalancerOpen = document.body.classList.contains('balancer-active');
    const isSolubilityOpen = document.body.classList.contains('solubility-open');
    const isReactionsOpen = document.body.classList.contains('reactions-open');
    const filtersPanel = document.getElementById('filters-panel');
    const isFiltersOpen = filtersPanel && filtersPanel.classList.contains('active');

    if (isElementModalOpen || isSolubilityOpen || isFiltersOpen || isBalancerOpen || isReactionsOpen) {
        return;
    }

    // Загружаем модуль если ещё не загружен
    if (window.loadCalculator) await window.loadCalculator();

    const loadedPanel = document.getElementById('calc-panel');
    if (!loadedPanel) return;

    // Открываем
    if (window.innerWidth <= 1024 && fab) {
        fab.classList.remove('active');
        if (themeToggle) themeToggle.style.display = 'none';
    } else if (themeToggle) {
        themeToggle.style.display = '';
    }
    loadedPanel.classList.remove('closing');
    loadedPanel.classList.add('active');
    document.body.classList.add('calc-active');
    if (window.mobileLayout && typeof window.mobileLayout.applyTransform === 'function') {
        setTimeout(() => window.mobileLayout.applyTransform(), 50);
    }

    // Позиционируем на ПК
    if (window.innerWidth > 1024 && typeof positionCalculatorPC === 'function') {
        positionCalculatorPC();
    }
};

// 2. Растворимость (То, чего не хватало!)
window.toggleSolubility = async function() {
    const isElementModalOpen = document.body.classList.contains('modal-open');
    if (isElementModalOpen) return;
    // Проверяем, открыт ли уравниватель
    const isBalancerOpen = document.body.classList.contains('balancer-active');
    if (isBalancerOpen) return;

    // ШАГ 1: Проверяем состояние
    const modal = document.getElementById('solubility-modal');
    const isCurrentlyVisible = modal ? (getComputedStyle(modal).display !== 'none') : false;
    // Если модалки нет или она скрыта -> значит мы ОТКРЫВАЕМ
    const isOpening = !modal || !isCurrentlyVisible;

    // Проверяем, мобильное ли это устройство (как в mobile-layout.js)
    const isMobile = window.innerWidth <= 1024;

    // ШАГ 2: Грузим скрипт
    if (window.loadSolubility) await window.loadSolubility();

    // ШАГ 3: Логика открытия/закрытия
    if (modal) {
        if (!isCurrentlyVisible) {
            // Открываем
            if (typeof openSolubility === 'function') {
                await openSolubility();
            } else {
                modal.style.display = 'flex';
                document.body.classList.add('solubility-open');
                if (isMobile) {
                    const fab = document.getElementById('fab-container');
                    if (fab) fab.style.display = 'none';
                }
            }

            // Если мы на ПК (isMobile === false), кнопки скрывать не нужно,
            // но на всякий случай убедимся, что они видны (если вдруг остались скрыты с прошлого раза)
            if (!isMobile) {
                const fab = document.getElementById('fab-container');
                const themeBtn = document.getElementById('theme-toggle');
                if (fab) fab.style.display = '';
                if (themeBtn) themeBtn.style.display = '';
            }

            if (typeof renderSolubilityTable === 'function' && document.getElementById('solubility-table').innerHTML === "") {
                renderSolubilityTable();
            }
            if (window.initSolubilityDrag) {
                window.initSolubilityDrag();
            }
        } else {
            // Закрываем
            if (typeof closeSolubility === 'function') {
                closeSolubility();
                // Доп. страховка: если тело/фильтры не восстановились
                document.body.classList.remove('solubility-open');
                if (typeof restoreElementFilters === 'function') {
                    restoreElementFilters();
                }
                if (typeof window.restoreElementFiltersSafe === 'function') {
                    window.restoreElementFiltersSafe();
                }
                if (typeof resetTableDisplay === 'function') {
                    resetTableDisplay();
                }
            } else {
                modal.classList.add('closing');
                setTimeout(() => {
                    modal.style.display = 'none';
                    modal.classList.remove('closing');
                    document.body.classList.remove('solubility-open');
                }, 360);

                // Возвращаем кнопки (на случай если модуль не прогрузился)
                const fab = document.getElementById('fab-container');
                const themeBtn = document.getElementById('theme-toggle');
                if (fab) fab.style.display = '';
                if (themeBtn) themeBtn.style.display = '';
            }
        }
    }
};

// 3. Реакции (большая модалка)
window.toggleReactionsModal = function(event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const modal = document.getElementById('reactions-modal');
    if (!modal) return;
    bindReactionsBackdrop();

    const isCurrentlyVisible = getComputedStyle(modal).display !== 'none';
    const isMobile = window.innerWidth <= 1024;

    // Закрытие всегда должно работать, даже если параллельно открыт другой UI.
    if (isCurrentlyVisible) {
        if (modal.classList.contains('closing')) return;
        modal.classList.add('closing');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('closing');
            document.body.classList.remove('reactions-open');
            document.documentElement.classList.remove('reactions-open');
            const savedScroll = parseInt(document.body.dataset.reactionsScroll || '0', 10);
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            delete document.body.dataset.reactionsScroll;
            window.scrollTo(0, isNaN(savedScroll) ? 0 : savedScroll);

            const fab = document.getElementById('fab-container');
            const themeBtn = document.getElementById('theme-toggle');
            if (fab) fab.style.display = '';
            if (themeBtn) themeBtn.style.display = '';
        }, 360);
        return;
    }

    const isElementModalOpen = document.body.classList.contains('modal-open');
    const isCalcOpen = document.body.classList.contains('calc-active');
    const isBalancerOpen = document.body.classList.contains('balancer-active');
    const isSolubilityOpen = document.body.classList.contains('solubility-open');
    const filtersPanel = document.getElementById('filters-panel');
    const isFiltersOpen = filtersPanel && filtersPanel.classList.contains('active');

    if (isElementModalOpen || isCalcOpen || isBalancerOpen || isSolubilityOpen || isFiltersOpen) {
        return;
    }

    modal.style.display = 'flex';
    const scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.dataset.reactionsScroll = String(scrollY);
    document.body.classList.add('reactions-open');
    document.documentElement.classList.add('reactions-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    const fab = document.getElementById('fab-container');
    const themeBtn = document.getElementById('theme-toggle');

    // На мобильных скрываем FAB и кнопку темы
    if (isMobile) {
        if (fab) fab.style.display = 'none';
        if (themeBtn) themeBtn.style.display = 'none';
    }
};

function initUI() {
    // Пустая заглушка, если нужна будет доп. логика
}

window.initUI = initUI;

function bindReactionsBackdrop() {
    const modal = document.getElementById('reactions-modal');
    if (!modal || modal.dataset.boundBackdrop === '1') return;
    modal.dataset.boundBackdrop = '1';
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            window.toggleReactionsModal(event);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    bindReactionsBackdrop();
});
// Блокировка вертикального скролла на мобильных
function lockVerticalScroll() {
    if (window.innerWidth <= 1024) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
  }
  
  // Разблокировка скролла
  function unlockVerticalScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }
  
// Блокировка ТОЛЬКО вертикального скролла на мобильных
let startY = 0;
let isVerticalScroll = false;

document.body.addEventListener('touchstart', (e) => {
  startY = e.touches[0].clientY;
  isVerticalScroll = false;
}, { passive: true });

document.body.addEventListener('touchmove', (e) => {
  if (window.innerWidth > 1024) return;

  const currentY = e.touches[0].clientY;
  const diffY = Math.abs(currentY - startY);

  // Если вертикальное движение больше горизонтального - блокируем
  if (diffY > 10 && !isVerticalScroll) {
    isVerticalScroll = true;

    // Проверяем, можно ли предотвратить действие по умолчанию
    if (e.cancelable) {
      e.preventDefault();
    }
    return;
  }

  // Разрешаем горизонтальный скролл
  if (!isVerticalScroll) {
    return;
  }
}, { passive: false });

// === ОБРАБОТКА ИЗМЕНЕНИЯ ОРИЕНТАЦИИ ===
function handleOrientationChange() {
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Перезагрузка адаптивных стилей для мобильных в горизонтальном режиме
      setTimeout(() => {
        if (typeof window.mobileLayout?.init === 'function') {
          window.mobileLayout.init();
        }
        
        // Адаптация позиций панелей
        if (document.body.classList.contains('balancer-active') && 
            typeof positionBalancerPC === 'function') {
          positionBalancerPC();
        }
        
        if (document.body.classList.contains('calc-active') && 
            typeof positionCalculatorPC === 'function') {
          positionCalculatorPC();
        }
      }, 300);
    }
  }
  
  // Добавление слушателя событий
  window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('resize', handleOrientationChange);
  
  // Инициализация при загрузке
  document.addEventListener('DOMContentLoaded', () => {
    handleOrientationChange();
  });
