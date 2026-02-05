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
    if (canvas) {
        particlesEnabled = !particlesEnabled;
        canvas.style.display = particlesEnabled ? 'block' : 'none';
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
window.toggleCalc = async function() {
    const PANEL_ANIM_MS = 360;
    // Проверяем, открыт ли уравниватель
    const isBalancerOpen = document.body.classList.contains('balancer-active');
    const isSolubilityOpen = document.body.classList.contains('solubility-open');
    const filtersPanel = document.getElementById('filters-panel');
    const isFiltersOpen = filtersPanel && filtersPanel.classList.contains('active');

    if (isSolubilityOpen || isFiltersOpen || isBalancerOpen) {
        return;
    }
    // Загружаем модуль если ещё не загружен
    if (window.loadCalculator) await window.loadCalculator();

    const panel = document.getElementById('calc-panel');
    const fab = document.getElementById('fab-container');
    const wasFabActive = fab && fab.classList.contains('active'); // Сохраняем состояние FAB перед изменениями

    if (!panel) return;

    // Переключаем состояние
    if (panel.classList.contains('active')) {
        // Закрываем
        if (panel.classList.contains('closing')) return;
        panel.classList.add('closing');
        document.body.classList.remove('calc-active');
        resetFabPosition();
        if (window.mobileLayout && typeof window.mobileLayout.resetTransform === 'function') {
            window.mobileLayout.resetTransform();
        }

        // Восстанавливаем состояние FAB если оно было активно до открытия калькулятора
        if (wasFabActive && fab && window.innerWidth > 1024) {
            fab.classList.add('active');
        }

        setTimeout(() => {
            panel.classList.remove('active', 'closing');
        }, PANEL_ANIM_MS);
    } else {
        // Открываем
        // Не скрываем FAB на ПК, только на мобильных
        if (window.innerWidth <= 1024 && fab) {
            fab.classList.remove('active');
        }
        panel.classList.remove('closing');
        panel.classList.add('active');
        document.body.classList.add('calc-active');
        if (window.mobileLayout && typeof window.mobileLayout.applyTransform === 'function') {
            setTimeout(() => window.mobileLayout.applyTransform(), 50);
        }

        // Позиционируем на ПК
        if (window.innerWidth > 1024 && typeof positionCalculatorPC === 'function') {
            positionCalculatorPC();
        }
    }
};

// 2. Растворимость (То, чего не хватало!)
window.toggleSolubility = async function() {
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

    // ШАГ 2: Если открываем И это мобилка -> СРАЗУ прячем лишний UI
    if (isOpening && isMobile) {
        const fab = document.getElementById('fab-container');
        const themeBtn = document.getElementById('theme-toggle');

        if (fab) fab.style.display = 'none';
        if (themeBtn) themeBtn.style.display = 'none';
    }

    // ШАГ 3: Грузим скрипт
    if (window.loadSolubility) await window.loadSolubility();

    // ШАГ 4: Логика открытия/закрытия
    if (modal) {
        if (!isCurrentlyVisible) {
            // Открываем
            if (typeof openSolubility === 'function') {
                await openSolubility();
            } else {
                modal.style.display = 'flex';
                document.body.classList.add('solubility-open');
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

function initUI() {
    // Пустая заглушка, если нужна будет доп. логика
}

window.initUI = initUI;

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
