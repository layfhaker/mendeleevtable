// =========================================
// МОДУЛЬ: UI (МЕНЮ И ПРОЧЕЕ)
// =========================================

function toggleMenu() {
    const fab = document.getElementById('fab-container');
    fab.classList.toggle('active');

    const filtersPanel = document.getElementById('filters-panel');
    if (filtersPanel && filtersPanel.classList.contains('active')) {
        filtersPanel.classList.remove('active');
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
});

window.initSolubilityDrag = function() {
    initDragScroll('.solubility-wrapper');
};

// =========================================
// ОБЕРТКИ ДЛЯ ЛЕНИВОЙ ЗАГРУЗКИ (FIX)
// =========================================

// 1. Калькулятор
window.toggleCalc = async function() {
    const isSolubilityOpen = document.body.classList.contains('solubility-open');
    const filtersPanel = document.getElementById('filters-panel');
    const isFiltersOpen = filtersPanel && filtersPanel.classList.contains('active');

    if (isSolubilityOpen || isFiltersOpen) {
        return;
    }
    // Загружаем модуль если ещё не загружен
    if (window.loadCalculator) await window.loadCalculator();
    
    const panel = document.getElementById('calc-panel');
    const fab = document.getElementById('fab-container');
    
    if (!panel) return;
    
    // Переключаем состояние
    if (panel.classList.contains('active')) {
        // Закрываем
        panel.classList.remove('active');
        document.body.classList.remove('calc-active');
        resetFabPosition();
    } else {
        // Открываем
        if (fab) fab.classList.remove('active');
        panel.classList.add('active');
        document.body.classList.add('calc-active');
        
        // Позиционируем на ПК
        if (window.innerWidth > 1024 && typeof positionCalculatorPC === 'function') {
            positionCalculatorPC();
        }
    }
};

// 2. Растворимость (То, чего не хватало!)
window.toggleSolubility = async function() {
    // ШАГ 1: Проверяем состояние
    const modal = document.getElementById('solubility-modal');
    // Если модалки нет или она скрыта -> значит мы ОТКРЫВАЕМ
    const isOpening = !modal || modal.style.display === 'none' || modal.style.display === '';
    
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
        const currentlyVisible = modal.style.display === 'block' || modal.style.display === 'flex';
        
        if (!currentlyVisible) {
            // Открываем
            modal.style.display = 'flex'; 
            document.body.classList.add('solubility-open');
            
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
                modal.style.display = 'none';
                document.body.classList.remove('solubility-open');
                
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

// В ui.js добавьте:

// Добавьте это в конец ui.js

window.toggleBalancer = async function() {
    // Проверка конфликтов
    const isSolubilityOpen = document.body.classList.contains('solubility-open');
    const filtersPanel = document.getElementById('filters-panel');
    const isFiltersOpen = filtersPanel && filtersPanel.classList.contains('active');

    if (isSolubilityOpen || isFiltersOpen) return;

    if (window.loadBalancer) await window.loadBalancer();
    
    // После загрузки скрипта, он переопределит эту функцию (если так написано в модуле).
    // Но в моем коде выше (шаг 3) я уже написал toggleBalancer внутри модуля.
    // JS заменит эту функцию на функцию из модуля.
    // Чтобы первый клик сработал, нам нужно вызвать "новую" функцию вручную.
    
    // НО! Чтобы не усложнять, давайте в модуле balancer.js назовем функцию
    // toggleBalancerPanel, а здесь будем её вызывать.
    
    if (typeof window.toggleBalancerPanel === 'function') {
        window.toggleBalancerPanel();
    }
};
