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
    particlesEnabled = !particlesEnabled;
    canvas.style.display = particlesEnabled ? 'block' : 'none';
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
// UI.JS — Drag & Drop Scrolling
// =========================================

function initDragScroll(selector) {
    const slider = document.querySelector(selector);
    if (!slider) return;

    let isDown = false;
    let startX, startY;
    let scrollLeft, scrollTop;

    slider.addEventListener('mousedown', (e) => {
        // Игнорируем клики по интерактивным элементам (кнопки, инпуты)
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.closest('.element')) {
            return;
        }

        isDown = true;
        slider.classList.add('active'); // Можно добавить стиль для класса active
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

        const walkX = (x - startX) * 1.5; // Скорость прокрутки
        const walkY = (y - startY) * 1.5;

        slider.scrollLeft = scrollLeft - walkX;
        slider.scrollTop = scrollTop - walkY;
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Включаем драг для body (Главная таблица)
    // В base.css у body стоит overflow: auto, значит скроллим document.documentElement или body
    const mainContainer = document.documentElement; // Или body, зависит от браузера, но вешаем события на window/body

    // Реализация для всего окна (Таблица Менделеева)
    let isWindowDown = false;
    let winStartX, winStartY, winScrollLeft, winScrollTop;

    window.addEventListener('mousedown', (e) => {
        // Не срабатываем на модалках
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
        const walkX = (x - winStartX) * 1.5;
        const walkY = (y - winStartY) * 1.5;
        window.scrollTo(winScrollLeft - walkX, winScrollTop - walkY);
    });
});

// Экспортируем функцию для вызова при открытии модалки растворимости
window.initSolubilityDrag = function() {
    initDragScroll('.solubility-wrapper');
};
