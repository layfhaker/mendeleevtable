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
    if (window.loadCalculator) await window.loadCalculator();
    // Ищем оригинальную функцию в глобальной области, так как модуль уже загружен
    // (функция toggleCalc внутри модуля calculator.js должна быть объявлена глобально)
    // Трюк: мы перезаписали window.toggleCalc этой функцией-оберткой.
    // Нам нужно вызвать функцию ИЗ МОДУЛЯ, которая скорее всего тоже называется toggleCalc или showCalculator.
    // Если в модуле calculator.js функция называется toggleCalc, она могла не переопределить эту обертку.

    // ВАЖНО: В calculator.js лучше переименовать главную функцию в `showCalculator` или подобное,
    // либо тут искать элемент по ID и менять класс.
    // Но оставим как есть, рассчитывая, что `calculator.js` просто управляет #calc-panel

    const panel = document.getElementById('calc-panel');
    if (panel) panel.classList.toggle('active');
};

// 2. Растворимость (То, чего не хватало!)
window.toggleSolubility = async function() {
    // Сначала грузим модуль
    if (window.loadSolubility) await window.loadSolubility();

    // После загрузки модуль solubility/modal.js должен был определить свои функции.
    // Обычно там есть toggleSolubility, но мы заняли это имя оберткой.
    // Поэтому просто открываем модалку вручную, если функция недоступна,
    // ИЛИ (лучший вариант) модуль должен использовать другое имя, например openSolubilityModal.

    const modal = document.getElementById('solubility-modal');
    if (modal) {
        modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
        // Инициализируем скролл если открыли
        if (modal.style.display === 'block' && window.initSolubilityDrag) {
            window.initSolubilityDrag();
        }
    }
};

function initUI() {
    // Пустая заглушка, если нужна будет доп. логика
}

window.initUI = initUI;
