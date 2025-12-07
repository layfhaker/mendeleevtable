// =========================================
// Функция сворачивания/разворачивания секций
// =========================================
function toggleSection(groupName) {
    const section = document.querySelector(`.info-group.${groupName}`);
    const content = document.querySelector(`.info-group.${groupName} .group-content`);
    const title = document.querySelector(`.info-group.${groupName} .group-title`);

    if (!content || !section || !title) return;

    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        section.classList.remove('collapsed');
        title.innerHTML = title.innerHTML.replace('▼', '▶ ');
    }
    else {
        content.classList.add('collapsed');
        section.classList.add('collapsed');
        title.innerHTML = title.innerHTML.replace('▶ ', '▼ ');
    }
}

// =========================================
// Глобальные переменные
// =========================================
const modal = document.getElementById("modal");
const closeBtn = document.getElementsByClassName("close")[0];
const elementInfo = document.getElementById("element-info");
const elementTitle = document.getElementById("element-title");
const tabsPlaceholder = document.getElementById("allotrope-tabs-placeholder");

let lastClickedElement = null;
let extraAllotropesExpanded = false; // Флаг: показаны ли дополнительные аллотропы

// =========================================
// Рендеринг содержимого модального окна
// =========================================
function renderModalContent(data) {
    // 1. ЗАПОМИНАЕМ ТЕКУЩЕЕ СОСТОЯНИЕ (какие секции свернуты)
    const currentStates = {};
    document.querySelectorAll('.info-group').forEach(group => {
        const type = group.classList[1];
        if (type) {
            currentStates[type] = group.classList.contains('collapsed');
        }

    });

    // Формируем HTML для физических свойств
    let physicalContentHTML = `
        <p><strong>Плотность:</strong> ${data.density || '—'}</p>
        <p><strong>Температура плавления:</strong> ${data.meltingPoint || '—'}</p>
        <p><strong>Температура кипения:</strong> ${data.boilingPoint || '—'}</p>
        <p><strong>Состояние (20°C):</strong> ${data.state || '—'}</p>
        <p><strong>Цвет:</strong> ${data.color || '—'}</p>
    `;

    if (data.structure) physicalContentHTML += `<p class="allo-specific"><strong>Структура:</strong> ${data.structure}</p>`;
    if (data.hardness) physicalContentHTML += `<p class="allo-specific"><strong>Твёрдость:</strong> ${data.hardness}</p>`;
    if (data.conductivity) physicalContentHTML += `<p class="allo-specific"><strong>Проводимость:</strong> ${data.conductivity}</p>`;
    if (data.properties) physicalContentHTML += `<p class="allo-specific"><strong>Свойства:</strong> ${data.properties}</p>`;

    // Обработка applications и facts (могут быть массивами или строками)
    const applicationsText = Array.isArray(data.applications)
        ? data.applications.join(', ')
        : (data.applications || '—');

    const factsText = Array.isArray(data.facts)
        ? data.facts.join(' ')
        : (data.facts || '—');

    // Рендерим HTML
    elementInfo.innerHTML = `
        <div class="groups-container">
            <section class="info-group basic">
                <h3 class="group-title" onclick="toggleSection('basic')">▶ Базовая информация</h3>
                <div class="group-content">
                    <p><strong>Номер:</strong> ${data.atomicNumber || '—'}</p>
                    <p><strong>Масса:</strong> ${data.atomicMass || '—'}</p>
                    <p><strong>Период:</strong> ${data.period || '—'}</p>
                    <p><strong>Группа:</strong> ${data.group || '—'}</p>
                    <p><strong>Блок:</strong> ${data.block || '—'}</p>
                    <p><strong>Категория:</strong> ${data.category || '—'}</p>
                    <p><strong>Электронная конфигурация:</strong> ${data.electronConfig || '—'}</p>
                    <p><strong>Электроотрицательность:</strong> ${data.electronegativity || '—'}</p>
                </div>
            </section>
            <section class="info-group physical">
                <h3 class="group-title" onclick="toggleSection('physical')">▶ Физические свойства</h3>
                <div class="group-content">
                    ${physicalContentHTML}
                </div>
            </section>
            <section class="info-group history">
                <h3 class="group-title" onclick="toggleSection('history')">▶ История и практика</h3>
                <div class="group-content">
                    <p><strong>Год открытия элемента:</strong> ${data.discoveryYear || '—'}</p>
                    <p><strong>Кто открыл элемент:</strong> ${data.discoverer || '—'}</p>
                    ${data.alloDiscoveryYear ? `<p><strong>Год открытия формы:</strong> ${data.alloDiscoveryYear}</p>` : ''}
                    ${data.alloDiscoverer ? `<p><strong>Кто открыл форму:</strong> ${data.alloDiscoverer}</p>` : ''}
                    <p><strong>Происхождение названия:</strong> ${data.nameOrigin || '—'}</p>
                    <p><strong>Области применения:</strong> ${applicationsText}</p>
                </div>
            </section>
            <section class="info-group facts">
                <h3 class="group-title" onclick="toggleSection('facts')">▶ Интересные факты</h3>
                <div class="group-content">
                    <p>${factsText}</p>
                    ${data.alloFacts ? `<p><strong>Об этой форме:</strong> ${data.alloFacts}</p>` : ''}
                </div>
            </section>
        </div>
    `;

    // 2. ВОССТАНАВЛИВАЕМ СОСТОЯНИЕ
    Object.keys(currentStates).forEach(type => {
        if (currentStates[type] === true) {
            const section = document.querySelector(`.info-group.${type}`);
            const content = document.querySelector(`.info-group.${type} .group-content`);
            const title = document.querySelector(`.info-group.${type} .group-title`);

            if (section && content && title) {
                section.classList.add('collapsed');
                content.classList.add('collapsed');
                title.innerHTML = title.innerHTML.replace('▶ ', '▼ ');
            }
        }
    });
}

// =========================================
// Функция создания табов аллотропов
// =========================================
function createAllotropeTabs(mainData) {
    tabsPlaceholder.innerHTML = '';
    extraAllotropesExpanded = false;

    const hasMainAllotropes = mainData.allotropes && Object.keys(mainData.allotropes).length > 0;
    const hasExtraAllotropes = mainData.extraAllotropes && Object.keys(mainData.extraAllotropes).length > 0;

    // Если нет аллотропов вообще — просто рендерим основные данные
    if (!hasMainAllotropes) {
        renderModalContent(mainData);
        return;
    }

    const allotropeKeys = Object.keys(mainData.allotropes);

    // Если только один аллотроп и нет дополнительных — не показываем табы
    if (allotropeKeys.length === 1 && !hasExtraAllotropes) {
        const mergedData = { ...mainData, ...mainData.allotropes[allotropeKeys[0]] };
        renderModalContent(mergedData);
        return;
    }

    // Создаём табы для основных аллотропов
    allotropeKeys.forEach((key, index) => {
        const btn = document.createElement('button');
        btn.className = 'allotrope-tab';
        btn.innerText = mainData.allotropes[key].name;
        btn.dataset.allotropeKey = key;
        btn.dataset.isExtra = 'false';

        btn.onclick = () => {
            document.querySelectorAll('.allotrope-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const mergedData = { ...mainData, ...mainData.allotropes[key] };
            renderModalContent(mergedData);
        };

        tabsPlaceholder.appendChild(btn);

        // Активируем первый таб по умолчанию
        if (index === 0) {
            btn.click();
        }
    });

    // Если есть дополнительные аллотропы — добавляем кнопку "+ Ещё"
    if (hasExtraAllotropes) {
        const moreBtn = document.createElement('button');
        moreBtn.className = 'allotrope-tab more-btn';
        moreBtn.innerText = '+ Ещё';
        moreBtn.title = 'Показать дополнительные аллотропы';

        moreBtn.onclick = () => {
            if (extraAllotropesExpanded) {
                // Скрываем дополнительные табы
                document.querySelectorAll('.allotrope-tab[data-is-extra="true"]').forEach(tab => {
                    tab.remove();
                });
                moreBtn.innerText = '+ Ещё';
                moreBtn.classList.remove('expanded');
                extraAllotropesExpanded = false;
            } else {
                // Показываем дополнительные табы
                const extraKeys = Object.keys(mainData.extraAllotropes);
                extraKeys.forEach(key => {
                    const btn = document.createElement('button');
                    btn.className = 'allotrope-tab extra-tab';
                    btn.innerText = mainData.extraAllotropes[key].name;
                    btn.dataset.allotropeKey = key;
                    btn.dataset.isExtra = 'true';

                    btn.onclick = () => {
                        document.querySelectorAll('.allotrope-tab').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        const mergedData = { ...mainData, ...mainData.extraAllotropes[key] };
                        renderModalContent(mergedData);
                    };

                    // Вставляем перед кнопкой "Ещё"
                    tabsPlaceholder.insertBefore(btn, moreBtn);
                });

                moreBtn.innerText = '− Скрыть';
                moreBtn.classList.add('expanded');
                extraAllotropesExpanded = true;
            }
        };

        tabsPlaceholder.appendChild(moreBtn);
    }
}

// =========================================
// Анимация разлёта элементов
// =========================================
function scatterElements() {
    const modalRect = document.querySelector('.modal-content').getBoundingClientRect();
    const modalCenterX = modalRect.left + modalRect.width / 2;
    const modalCenterY = modalRect.top + modalRect.height / 2;

    document.body.classList.add('elements-scattered');
    document.body.classList.remove('elements-returning');

    document.querySelectorAll('.element').forEach(el => {
        const rect = el.getBoundingClientRect();
        const elCenterX = rect.left + rect.width / 2;
        const elCenterY = rect.top + rect.height / 2;

        let dirX = elCenterX - modalCenterX;
        let dirY = elCenterY - modalCenterY;

        const distance = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
        dirX = dirX / distance;
        dirY = dirY / distance;

        const randomOffset = 100 + Math.random() * 100;

        const moveX = dirX * randomOffset + (Math.random() - 0.5) * 50;
        const moveY = dirY * randomOffset + (Math.random() - 0.5) * 50;

        el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
}

function returnElements() {
    document.body.classList.remove('elements-scattered');
    document.body.classList.add('elements-returning');

    document.querySelectorAll('.element').forEach(el => {
        el.style.transform = 'translate(0, 0)';
    });

    setTimeout(() => {
        document.body.classList.remove('elements-returning');
    }, 300);
}

// =========================================
// Обработчики кликов по элементам
// =========================================
document.querySelectorAll('.element').forEach(el => {
    el.addEventListener('click', () => {
        lastClickedElement = el;

        // Вычисляем позицию элемента относительно центра экрана
        const rect = el.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;

        const offsetX = elementCenterX - screenCenterX;
        const offsetY = elementCenterY - screenCenterY;

        // Устанавливаем CSS переменные для анимации
        modal.style.setProperty('--start-x', offsetX + 'px');
        modal.style.setProperty('--start-y', offsetY + 'px');

        const symbol = el.dataset.symbol;
        const mainData = elementsData[symbol] || {};

        elementTitle.innerText = `${mainData.name || symbol} (${symbol})`;

        // Создаём табы аллотропов (включая кнопку "+ Ещё" если нужно)
        createAllotropeTabs(mainData);

        modal.style.display = "flex";
        setTimeout(scatterElements, 50);
        modal.classList.remove('closing');
    });
});

// =========================================
// Закрытие модального окна
// =========================================
function closeModal() {
    returnElements();
    modal.classList.add('closing');
    setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove('closing');
    }, 300);
}

closeBtn.onclick = closeModal;

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
};
// =========================================
// Тёмная тема
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

        btn.textContent = toLight ? '🌙' : '☀️';
        localStorage.setItem('theme', toLight ? 'light' : 'dark');

        currentThemeTarget = null;
    }

    requestAnimationFrame(animate);
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

        document.querySelector('#theme-toggle').textContent = '☀️';
    }
})();
