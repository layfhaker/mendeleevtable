// =========================================
// МОДУЛЬ: ТЁМНАЯ ТЕМА
// =========================================

let currentThemeTarget = null;
let backgroundCircle = null;

function toggleTheme() {
    const btn = document.querySelector('#theme-toggle');
    const elements = document.querySelectorAll('.element');

    // Определяем куда переключаемся
    let targetTheme;
    if (currentThemeTarget !== null) {
        targetTheme = currentThemeTarget === 'dark' ? 'light' : 'dark';
    } else {
        targetTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
    }

    currentThemeTarget = targetTheme;
    const toLight = targetTheme === 'light';

    // Анимация кнопки
    btn.classList.remove('spin');
    void btn.offsetWidth;
    btn.classList.add('spin');
    setTimeout(() => btn.classList.remove('spin'), 400);

    // Позиция кнопки (центр волны)
    const btnRect = btn.getBoundingClientRect();
    const originX = btnRect.left + btnRect.width / 2;
    const originY = btnRect.top + btnRect.height / 2;

    if (window.startParticleWave) window.startParticleWave(originX, originY, targetTheme === 'dark');

    // Создаём круг — начинает с 0
    const circle = document.createElement('div');
    circle.className = 'theme-wave-circle';
    circle.style.left = originX + 'px';
    circle.style.top = originY + 'px';
    circle.style.width = '0px';
    circle.style.height = '0px';
    circle.style.backgroundColor = toLight ? '#f0f0f0' : '#1a1a2e';
    document.body.appendChild(circle);

    // Цвета
    const lightColors = {
        'alkali-metal': '#ff9999',
        'alkaline-earth-metal': '#ffcc99',
        'transition-metal': '#ffff99',
        'post-transition-metal': '#ccff99',
        'metalloid': '#99ffcc',
        'nonmetal': '#99ffff',
        'halogen': '#99ccff',
        'noble-gas': '#cc99ff',
        'lanthanide': '#ff99cc',
        'actinide': '#ff99ff',
        'unknown': '#cccccc'
    };

    const darkColors = {
        'alkali-metal': '#8b3a3a',
        'alkaline-earth-metal': '#8b6914',
        'transition-metal': '#7a7a2e',
        'post-transition-metal': '#4a7a2e',
        'metalloid': '#2e7a5c',
        'nonmetal': '#2e6a7a',
        'halogen': '#2e4a7a',
        'noble-gas': '#5c2e7a',
        'lanthanide': '#7a2e5c',
        'actinide': '#7a2e7a',
        'unknown': '#4a4a4a'
    };

    const waveDuration = 800;
    const targetColors = toLight ? lightColors : darkColors;
    const targetTextColor = toLight ? '#000' : '#eee';
    const targetNameColor = toLight ? '#333' : '#ccc';
    const targetBorder = toLight ? '#ccc' : '#444';

    // Максимальный диаметр — гарантированно покрывает весь экран
    const maxDiameter = 2 * Math.hypot(window.innerWidth, window.innerHeight) + 200;

    // Подготавливаем данные элементов
    const elementsData = [];
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const elX = rect.left + rect.width / 2;
        const elY = rect.top + rect.height / 2;
        const distance = Math.hypot(elX - originX, elY - originY);

        let category = 'unknown';
        for (const cat of Object.keys(targetColors)) {
            if (el.classList.contains(cat)) {
                category = cat;
                break;
            }
        }

        elementsData.push({ el, distance, category, switched: false });
    });

    const thisTarget = targetTheme;
    const thisCircle = circle;
    const startTime = performance.now();

    // ease-out
    function easeOut(t) {
        return 1 - Math.pow(1 - t, 2);
    }

    // Анимация — круг и элементы вместе
    function animate() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / waveDuration, 1);
        const easedProgress = easeOut(progress);

        // Текущий диаметр и радиус
        const currentDiameter = easedProgress * maxDiameter;
        const currentRadius = currentDiameter / 2;

        // Обновляем размер круга
        thisCircle.style.width = currentDiameter + 'px';
        thisCircle.style.height = currentDiameter + 'px';

        // Обновляем элементы
        elementsData.forEach(data => {
            if (data.distance <= currentRadius && !data.switched) {
                data.switched = true;
                data.el.style.transition = 'none';
                data.el.style.backgroundColor = targetColors[data.category];
                data.el.style.borderColor = targetBorder;
                data.el.style.color = targetTextColor;

                const nameEl = data.el.querySelector('.name');
                if (nameEl) {
                    nameEl.style.color = targetNameColor;
                }
            }
        });

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            finalize();
        }
    }

    function finalize() {
        if (currentThemeTarget !== thisTarget) {
            // Была запущена новая волна — оставляем круг, не удаляем
            return;
        }

        // Удаляем старый фоновый круг
        if (backgroundCircle) {
            backgroundCircle.remove();
        }

        // Этот круг становится фоном — устанавливаем финальный размер
        thisCircle.style.width = maxDiameter + 'px';
        thisCircle.style.height = maxDiameter + 'px';
        backgroundCircle = thisCircle;

        // Обновляем класс body
        if (toLight) {
            document.body.classList.remove('dark-theme');
        } else {
            document.body.classList.add('dark-theme');
        }

        // Очищаем inline стили элементов
        elements.forEach(el => {
            el.style.backgroundColor = '';
            el.style.borderColor = '';
            el.style.color = '';
            el.style.transition = '';

            const nameEl = el.querySelector('.name');
            if (nameEl) nameEl.style.color = '';
        });

        localStorage.setItem('theme', toLight ? 'light' : 'dark');

        currentThemeTarget = null;
    }

    requestAnimationFrame(animate);

    if (typeof updateNodeMapTheme === 'function') {
        updateNodeMapTheme(isDark);
    }
}

// Загрузка сохранённой темы
(function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');

        // Создаём фоновый круг
        const circle = document.createElement('div');
        circle.className = 'theme-wave-circle';
        circle.style.left = '50%';
        circle.style.top = '50%';
        circle.style.backgroundColor = '#1a1a2e';
        circle.style.width = '400vmax';
        circle.style.height = '400vmax';
        document.body.appendChild(circle);
        backgroundCircle = circle;
    }
})();
