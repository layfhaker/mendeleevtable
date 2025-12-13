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

        // Данные элемента
        const symbol = el.dataset.symbol;
        const mainData = elementsData[symbol] || {};
        elementTitle.innerText = `${mainData.name || symbol} (${symbol})`;
        if (window.spawnAtom) {
            window.spawnAtom(mainData.atomicNumber, mainData.period);
        }
        createAllotropeTabs(mainData);

        // Открываем модалку
        modal.style.display = "flex"; // Важно: CSS media query переопределит стиль отображения
        document.body.classList.add('modal-open');

        // Блокируем скролл основной страницы
        document.body.style.overflow = "hidden";

        // !!! ВАЖНОЕ ИЗМЕНЕНИЕ !!!
        // Запускаем разлёт элементов ТОЛЬКО если экран широкий (компьютер)
        if (window.innerWidth > 1024) {
            // Вычисляем координаты для анимации на ПК
            const rect = el.getBoundingClientRect();
            const elementCenterX = rect.left + rect.width / 2;
            const elementCenterY = rect.top + rect.height / 2;
            const screenCenterX = window.innerWidth / 2;
            const screenCenterY = window.innerHeight / 2;

            modal.style.setProperty('--start-x', (elementCenterX - screenCenterX) + 'px');
            modal.style.setProperty('--start-y', (elementCenterY - screenCenterY) + 'px');

            setTimeout(scatterElements, 50);
        }

        modal.classList.remove('closing');
    });
});

// =========================================
// Закрытие модального окна
// =========================================
function closeModal() {
    // Возвращаем элементы только на ПК
    if (window.clearAtom) {
        window.clearAtom();
    }
    if (window.innerWidth > 1024) {
        returnElements();
    }

    modal.classList.add('closing');
    document.body.classList.remove('modal-open');

    // Возвращаем скролл
    document.body.style.overflow = "";

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

// =========================================
// ЛОГИКА МЕНЮ
// =========================================
function toggleMenu() {
    const fab = document.getElementById('fab-container');
    fab.classList.toggle('active');

    // !!! ДОБАВЛЕНО: Закрываем фильтры при нажатии на кнопку меню !!!
    const filtersPanel = document.getElementById('filters-panel');
    if (filtersPanel && filtersPanel.classList.contains('active')) {
        filtersPanel.classList.remove('active');
    }
}

// Управление частицами (добавь эту функцию, если её нет)
let particlesEnabled = true;
function toggleParticles() {
    const canvas = document.getElementById('particles-canvas');
    particlesEnabled = !particlesEnabled;
    canvas.style.display = particlesEnabled ? 'block' : 'none';
}

// =========================================
// ЛОГИКА DRAG & DROP КАЛЬКУЛЯТОРА
// =========================================
const dropZone = document.getElementById('drop-zone');
let calcAtoms = []; // Здесь храним состав формулы: [{symbol: 'H', count: 2, mass: 1}, ...]

// 1. Делаем элементы таблицы перетаскиваемыми
// 1. Делаем элементы таблицы перетаскиваемыми (Desktop + Mobile)
document.querySelectorAll('.element').forEach(el => {
    el.setAttribute('draggable', 'true');

    // Desktop: Drag & Drop
    el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('symbol', el.dataset.symbol);
        el.style.opacity = '0.5';
    });

    el.addEventListener('dragend', () => {
        el.style.opacity = '1';
    });

    // Mobile: Touch events
    let touchData = {
        symbol: null,
        startTime: 0,
        isDragging: false
    };

    el.addEventListener('touchstart', function(e) {
        // Проверяем, открыт ли калькулятор
        const calcPanel = document.getElementById('calc-panel');
        if (!calcPanel.classList.contains('active')) {
            return;
        }

        e.preventDefault(); // Важно! Предотвращает scroll и click

        touchData.symbol = this.dataset.symbol;
        touchData.startTime = Date.now();
        touchData.isDragging = false;
        this.style.opacity = '0.5';
    });

    el.addEventListener('touchmove', function(e) {
        const calcPanel = document.getElementById('calc-panel');
        if (!calcPanel.classList.contains('active') || !touchData.symbol) {
            return;
        }

        e.preventDefault();
        touchData.isDragging = true;

        const touch = e.touches[0];
        const dropZoneEl = document.getElementById('drop-zone');
        const dropZoneRect = dropZoneEl.getBoundingClientRect();

        if (
            touch.clientX >= dropZoneRect.left &&
            touch.clientX <= dropZoneRect.right &&
            touch.clientY >= dropZoneRect.top &&
            touch.clientY <= dropZoneRect.bottom
        ) {
            dropZoneEl.classList.add('drag-over');
        } else {
            dropZoneEl.classList.remove('drag-over');
        }
    });

    el.addEventListener('touchend', function(e) {
        this.style.opacity = '1';

        const calcPanel = document.getElementById('calc-panel');
        const dropZoneEl = document.getElementById('drop-zone');

        if (!calcPanel.classList.contains('active') || !touchData.symbol) {
            touchData.symbol = null;
            return;
        }

        e.preventDefault();

        const touch = e.changedTouches[0];
        const dropZoneRect = dropZoneEl.getBoundingClientRect();

        const isOverDropZone = (
            touch.clientX >= dropZoneRect.left &&
            touch.clientX <= dropZoneRect.right &&
            touch.clientY >= dropZoneRect.top &&
            touch.clientY <= dropZoneRect.bottom
        );

        const tapDuration = Date.now() - touchData.startTime;

        // Добавляем по тапу ИЛИ при drop в зону
        if (isOverDropZone || tapDuration < 400) {
            addAtomToCalculator(touchData.symbol);
        }

        touchData.symbol = null;
        touchData.isDragging = false;
        dropZoneEl.classList.remove('drag-over');
    });
});
// 2. Настройка зоны сброса
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault(); // Разрешаем сброс
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');

    const symbol = e.dataTransfer.getData('symbol');
    if (symbol) {
        addAtomToCalculator(symbol);
    }
});

// 3. Добавление атома в список

function addAtomToCalculator(symbol) {
    // Получаем массу
    let mass = 0;
    if (symbol === 'Cl') {
        mass = 35.5;
    } else {
        // !!! ИСПРАВЛЕНИЕ ЗДЕСЬ !!!
        // Превращаем в строку перед обработкой, так как в базе данных
        // у некоторых элементов масса записана числом, а у других строкой.
        const rawMass = String(elementsData[symbol].atomicMass);

        // Очистка от скобок [294] -> 294 и округление
        mass = Math.round(parseFloat(rawMass.replace('[', '').replace(']', '')));
    }

    // Создаем объект
    const atomObj = {
        id: Date.now(), // Уникальный ID для удаления
        symbol: symbol,
        mass: mass,
        count: 1
    };
    calcAtoms.push(atomObj);

    // Удаляем текст "Перетащите сюда", если это первый элемент
    const placeholder = dropZone.querySelector('.drop-placeholder');
    if (placeholder) placeholder.style.display = 'none';

    // Рисуем UI
    renderAtomUI(atomObj);
    updateTotalMass();
}

// 4. Отрисовка UI элемента в калькуляторе
function renderAtomUI(atomObj) {
    const atomDiv = document.createElement('div');
    atomDiv.className = 'calc-atom';
    atomDiv.dataset.id = atomObj.id;

    // Символ
    const symbolSpan = document.createElement('span');
    symbolSpan.className = 'calc-atom-symbol';
    symbolSpan.innerText = atomObj.symbol;

    // Поле ввода количества (индекс)
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'calc-atom-count';
    input.value = 1;
    input.min = 1;

    // При изменении числа пересчитываем общую массу
    input.onchange = (e) => {
        let val = parseInt(e.target.value);
        if (val < 1) val = 1;
        atomObj.count = val;
        updateTotalMass();
    };

    // Кнопка удаления (крестик)
    const removeBtn = document.createElement('span');
    removeBtn.className = 'calc-atom-remove';
    removeBtn.innerHTML = '&times;';
    removeBtn.onclick = () => {
        // Удаляем из массива
        calcAtoms = calcAtoms.filter(a => a.id !== atomObj.id);
        // Удаляем из HTML
        atomDiv.remove();
        // Возвращаем placeholder, если пусто
        if (calcAtoms.length === 0) {
            const placeholder = dropZone.querySelector('.drop-placeholder');
            if (placeholder) placeholder.style.display = 'block';
        }
        updateTotalMass();
    };

    atomDiv.appendChild(symbolSpan);
    atomDiv.appendChild(input);
    atomDiv.appendChild(removeBtn);
    dropZone.appendChild(atomDiv);
}

// 5. Подсчет общей массы
function updateTotalMass() {
    let total = 0;
    calcAtoms.forEach(atom => {
        total += atom.mass * atom.count;
    });

    // Исправление ошибки плавающей точки (для хлора)
    total = Math.round(total * 100) / 100;

    const resultEl = document.querySelector('#calc-result .mass-value');
    resultEl.innerHTML = `${total} <span class="unit">г/моль</span>`;
}

// 6. Очистка
function clearCalculator() {
    calcAtoms = [];
    // Удаляем все атомы из DOM, кроме placeholder
    const atoms = dropZone.querySelectorAll('.calc-atom');
    atoms.forEach(el => el.remove());

    const placeholder = dropZone.querySelector('.drop-placeholder');
    if (placeholder) placeholder.style.display = 'block';

    updateTotalMass();
}

// Нужно обновить функцию toggleCalc, чтобы она работала с новым ID
function toggleCalc() {
    const calcPanel = document.getElementById('calc-panel');
    const fab = document.getElementById('fab-container');

    // Закрываем FAB меню
    if (fab) fab.classList.remove('active');

    if (calcPanel.classList.contains('active')) {
        calcPanel.classList.remove('active');
        document.body.classList.remove('calc-active'); // Убираем класс
        resetFabPosition();
      } else {
          calcPanel.classList.add('active');
          document.body.classList.add('calc-active');

          // Позиционируем в зависимости от устройства
          if (window.innerWidth > 1024) {
              positionCalculatorPC();
          } else {
              resetCalculatorPosition();
          }
        // Если открыто модальное окно элемента, закрываем его
        if (typeof modal !== 'undefined' && modal.style.display === 'flex') {
            closeModal();
        }
    }
}
// =========================================
// ПОЗИЦИОНИРОВАНИЕ КАЛЬКУЛЯТОРА НА ПК
// =========================================
function positionCalculatorPC() {
    if (window.innerWidth <= 1024) return; // Только для ПК

    const calcPanel = document.getElementById('calc-panel');
    const mg = document.getElementById('Mg'); // Левая граница (колонка 2)
    const al = document.getElementById('Al'); // Правая граница (колонка 13)
    const container = document.querySelector('.container');

    if (!mg || !al || !container || !calcPanel) return;

    const mgRect = mg.getBoundingClientRect();
    const alRect = al.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Левая граница = правый край Mg + небольшой отступ
    const left = mgRect.right + 4;
    // Правая граница = левый край Al - отступ
    const right = alRect.left - 4;
    // Ширина
    const width = right - left;
    // Верх = выше контейнера
    const top = containerRect.top - 20;
    // Высота = 4 строки таблицы
    const rowHeight = mgRect.height + 2; // высота ячейки + gap
    const height = rowHeight * 3.3;

    calcPanel.style.left = left + 'px';
    calcPanel.style.top = top + 'px';
    calcPanel.style.width = width + 'px';
    calcPanel.style.height = height + 'px';
}
function resetCalculatorPosition() {
    const calcPanel = document.getElementById('calc-panel');
    if (!calcPanel) return;

    // Сбрасываем inline-стили, чтобы CSS мог работать
    calcPanel.style.left = '';
    calcPanel.style.top = '';
    calcPanel.style.width = '';
    calcPanel.style.height = '';
}

// Перепозиционирование при ресайзе
window.addEventListener('resize', () => {
    const calcPanel = document.getElementById('calc-panel');

    if (calcPanel && calcPanel.classList.contains('active')) {
        if (window.innerWidth > 1024) {
            positionCalculatorPC();
        } else {
            resetCalculatorPosition();
        }
    } else {
        resetFabPosition();
    }
});

// =========================================
// ЛОГИКА ПОИСКА
// =========================================
let currentSearchTerm = '';

// Выполнить поиск
function performSearch() {
    const input = document.getElementById('element-search');
    const query = input.value.trim();

    if (query.length < 2) {
        alert('Введите минимум 2 символа');
        return;
    }

    currentSearchTerm = query;
    const results = searchElements(query);
    displaySearchResults(results);
}

// Поиск по всем данным элементов
function searchElements(query) {
    const results = [];
    query = query.toLowerCase().trim();

    if (query.length < 2) return results;

    for (const symbol in elementsData) {
        const element = elementsData[symbol];
        const matches = [];

        // Поиск по основным полям
        const searchFields = [
            { key: 'name', label: 'Название' },
            { key: 'facts', label: 'Факты' },
            { key: 'applications', label: 'Применение' },
            { key: 'nameOrigin', label: 'Происхождение названия' },
            { key: 'discoverer', label: 'Первооткрыватель' },
            { key: 'category', label: 'Категория' },
            { key: 'color', label: 'Цвет' },
            { key: 'structure', label: 'Структура' }
        ];

        searchFields.forEach(field => {
            const value = element[field.key];
            if (value && String(value).toLowerCase().includes(query)) {
                matches.push({
                    field: field.label,
                    text: String(value),
                    allotrope: null
                });
            }
        });

        // Поиск по аллотропам
        if (element.allotropes) {
            for (const alloKey in element.allotropes) {
                const allo = element.allotropes[alloKey];
                searchInAllotrope(allo, query, matches, alloKey);
            }
        }

        if (element.extraAllotropes) {
            for (const alloKey in element.extraAllotropes) {
                const allo = element.extraAllotropes[alloKey];
                searchInAllotrope(allo, query, matches, alloKey);
            }
        }

        if (matches.length > 0) {
            results.push({
                symbol: symbol,
                name: element.name,
                matches: matches
            });
        }
    }

    return results;
}

function searchInAllotrope(allo, query, matches, alloKey) {
    const alloFields = ['name', 'alloFacts', 'alloDiscoverer', 'properties', 'structure', 'color'];

    alloFields.forEach(field => {
        const value = allo[field];
        if (value && String(value).toLowerCase().includes(query)) {
            matches.push({
                field: allo.name || alloKey,
                text: String(value),
                allotrope: alloKey
            });
        }
    });
}

// Отображение результатов
function displaySearchResults(results) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = '<div class="search-no-results">Ничего не найдено</div>';
        return;
    }

    results.slice(0, 10).forEach(result => {
        const item = document.createElement('div');
        item.className = 'search-result-item';

        const firstMatch = result.matches[0];
        const contextText = truncateText(firstMatch.text, 50);

        item.innerHTML = `
            <span class="result-symbol">${result.symbol}</span>
            <span class="result-name">${result.name}</span>
            <span class="result-context">${firstMatch.field}: ${contextText}</span>
        `;

        item.onclick = () => openSearchResult(result.symbol, firstMatch.allotrope);
        container.appendChild(item);
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Открытие элемента из результатов поиска
function openSearchResult(symbol, allotropeKey) {
    const elementDiv = document.getElementById(symbol);
    if (!elementDiv) return;

    // Закрываем панель фильтров
    toggleFilters();

    // Симулируем клик по элементу
    elementDiv.click();

    // Если есть аллотроп — переключаемся на него
    if (allotropeKey) {
        setTimeout(() => {
            const alloTab = document.querySelector(`.allotrope-tab[data-allotrope-key="${allotropeKey}"]`);
            if (alloTab) alloTab.click();
        }, 100);
    }

    // Подсвечиваем найденный текст
    setTimeout(() => {
        highlightSearchTerm(currentSearchTerm);
    }, 200);
}

// Подсветка текста в модалке
function highlightSearchTerm(term) {
    if (!term || term.length < 2) return;

    const elementInfo = document.getElementById('element-info');
    if (!elementInfo) return;

    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');

    // Находим все текстовые узлы и подсвечиваем
    const walker = document.createTreeWalker(
        elementInfo,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    const textNodes = [];
    while (walker.nextNode()) {
        if (walker.currentNode.textContent.toLowerCase().includes(term.toLowerCase())) {
            textNodes.push(walker.currentNode);
        }
    }

    textNodes.forEach(node => {
        const span = document.createElement('span');
        span.innerHTML = node.textContent.replace(regex, '<mark class="highlight">$1</mark>');
        node.parentNode.replaceChild(span, node);
    });

    // Скроллим к первому найденному
    const firstHighlight = elementInfo.querySelector('.highlight');
    if (firstHighlight) {
        firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Очистка поиска
function clearSearch() {
    const input = document.getElementById('element-search');
    const results = document.getElementById('search-results');
    const clearBtn = document.querySelector('.search-clear');

    input.value = '';
    results.innerHTML = '';
    currentSearchTerm = '';
    clearBtn.classList.remove('visible');
}

// Инициализация обработчиков поиска
(function initSearch() {
    // Ждём загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupSearch);
    } else {
        setupSearch();
    }

    function setupSearch() {
        const searchInput = document.getElementById('element-search');
        const clearBtn = document.querySelector('.search-clear');

        if (!searchInput) return;

        // Показываем/скрываем кнопку очистки при вводе
        searchInput.addEventListener('input', (e) => {
            if (e.target.value.length > 0) {
                clearBtn.classList.add('visible');
            } else {
                clearBtn.classList.remove('visible');
            }
        });

        // Enter для поиска
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
})();

// =========================================
// ЛОГИКА ФИЛЬТРОВ
// =========================================
function toggleFilters() {
    const panel = document.getElementById('filters-panel');
    const fab = document.getElementById('fab-container');

    if (panel) {
        panel.classList.toggle('active');
    }

    // Если открыли фильтры — закроем само меню FAB, чтобы не мешало
    if (fab && fab.classList.contains('active')) {
        fab.classList.remove('active');
    }
}

function resetFilters() {
    // 1. Сброс поиска
    const searchInput = document.getElementById('element-search');
    if (searchInput) {
        searchInput.value = '';
        // Вызываем событие, чтобы скрылся крестик очистки
        searchInput.dispatchEvent(new Event('input'));
    }
    const searchResults = document.getElementById('search-results');
    if (searchResults) searchResults.innerHTML = '';

    // 2. Сброс кнопок категорий
    document.querySelectorAll('.filter-btn.active').forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Возврат таблицы в исходный вид (показываем все элементы)
    resetTableDisplay();
}

// =========================================
// ЛОГИКА КАТЕГОРИЙ (ФИЛЬТРАЦИЯ)
// =========================================

// 1. Находим все кнопки фильтров и вешаем клик
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const filterType = btn.dataset.filter; // Получаем тип (например, 'alkali-metal')

        // Если кнопка уже активна — значит мы хотим СБРОСИТЬ фильтр
        if (btn.classList.contains('active')) {
            btn.classList.remove('active');
            resetTableDisplay();
            return;
        }

        // Иначе — АКТИВИРУЕМ фильтр
        // Сначала убираем активность со всех остальных кнопок
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        // Делаем активной текущую
        btn.classList.add('active');

        // Применяем фильтрацию
        applyCategoryFilter(filterType);
    });
});

// 2. Функция применения фильтра
function applyCategoryFilter(categoryClass) {
    const allElements = document.querySelectorAll('.element');

    allElements.forEach(el => {
        // Проверяем, есть ли у элемента нужный класс (например, .alkali-metal)
        if (el.classList.contains(categoryClass)) {
            // Это наш клиент — показываем
            el.style.opacity = '1';
            el.style.filter = 'none';
            el.style.pointerEvents = 'auto'; // Можно кликать
            el.style.transform = 'scale(1)';
        } else {
            // Чужой — прячем (делаем полупрозрачным)
            el.style.opacity = '0.1'; // Почти невидимый
            el.style.filter = 'grayscale(100%)'; // Ч/Б
            el.style.pointerEvents = 'none'; // Нельзя кликать
            el.style.transform = 'scale(0.9)'; // Чуть уменьшаем
        }
    });
}

// 3. Функция возврата таблицы в исходный вид
function resetTableDisplay() {
    const allElements = document.querySelectorAll('.element');
    allElements.forEach(el => {
        // Сбрасываем все инлайн-стили, возвращая CSS по умолчанию
        el.style.opacity = '';
        el.style.filter = '';
        el.style.pointerEvents = '';
        el.style.transform = '';
    });
}

// =========================================
// Функция сброса позиции FAB (исправление ошибки)
// =========================================
function resetFabPosition() {
    const fab = document.getElementById('fab-container');
    if (fab) {
        // Очищаем инлайн-стили, возвращая управление CSS
        fab.style.bottom = '';
        fab.style.right = '';
        fab.style.left = '';
        fab.style.top = '';
        fab.style.transform = '';
    }
}
