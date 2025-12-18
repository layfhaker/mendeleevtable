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

    // --- НОВОЕ: Сначала пробуем найти вещество в таблице растворимости ---
    const foundInTable = searchInSolubilityTable(query);
    if (foundInTable) {
        return; // Если нашли вещество, останавливаем поиск элементов
    }
    // ---------------------------------------------------------------------

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

// Парсинг полной химической формулы для поиска в таблице растворимости
function parseChemicalFormula(query) {
    query = query.toLowerCase().trim();

    // Словарь катионов (формула без заряда → индекс в массиве)
    const cationMap = {
        'h': 0, 'nh4': 1, 'li': 2, 'k': 3, 'na': 4, 'rb': 5, 'cs': 6,
        'ag': 7, 'mg': 8, 'ca': 9, 'sr': 10, 'ba': 11, 'zn': 12,
        'hg': 13, 'pb': 14, 'cu': 15, 'fe': 16, 'al': 18, 'cr': 19,
        'mn': 20, 'ni': 21, 'co': 22, 'sn': 23
    };

    // Словарь анионов (формула без заряда → индекс в массиве)
    const anionMap = {
        'oh': 0, 'f': 1, 'cl': 2, 'br': 3, 'i': 4, 's': 5, 'hs': 6,
        'so3': 7, 'so4': 8, 'no3': 9, 'po4': 10, 'co3': 11, 'sio3': 12,
        'cro4': 13, 'ch3coo': 14, 'mno4': 15,
        // Альтернативные написания
        'acetate': 14, 'ac': 14
    };

    let foundCatIndex = -1;
    let foundAnIndex = -1;

    // Паттерны для распознавания формул
    // Пробуем найти известные катионы в начале формулы
    const cationKeys = Object.keys(cationMap).sort((a, b) => b.length - a.length); // Сначала длинные
    const anionKeys = Object.keys(anionMap).sort((a, b) => b.length - a.length);

    // Нормализуем запрос: убираем цифры-индексы и скобки
    const normalized = query.replace(/[₂₃₄₅²³⁺⁻\(\)\[\]]/g, '').replace(/[0-9]/g, '');

    // Ищем катион в начале
    for (const cat of cationKeys) {
        if (normalized.startsWith(cat)) {
            foundCatIndex = cationMap[cat];
            // Пробуем найти анион в оставшейся части
            const remainder = normalized.slice(cat.length);
            for (const an of anionKeys) {
                if (remainder === an || remainder.startsWith(an)) {
                    foundAnIndex = anionMap[an];
                    break;
                }
            }
            break;
        }
    }

    // Если не нашли как полную формулу, ищем анион отдельно
    if (foundAnIndex === -1) {
        for (const an of anionKeys) {
            if (normalized.includes(an) || query.includes(an)) {
                foundAnIndex = anionMap[an];
                break;
            }
        }
    }

    return { cationIndex: foundCatIndex, anionIndex: foundAnIndex };
}

// Поиск внутри таблицы растворимости (улучшенная версия)
function searchInSolubilityTable(query) {
    query = query.toLowerCase().trim();

    // Сначала пробуем распарсить как полную формулу (NaCl, BaSO4 и т.д.)
    const parsed = parseChemicalFormula(query);
    let foundRowIndex = parsed.anionIndex;
    let foundColIndex = parsed.cationIndex;

    // Если парсинг формулы не дал результата, ищем по названиям
    if (foundRowIndex === -1) {
        // 1. Ищем АНИОН (строку) по названию
        for (let i = 0; i < solubilityData.anions.length; i++) {
            const a = solubilityData.anions[i];
            const name = a.n.toLowerCase();
            const formula = a.f.toLowerCase().replace('-', '').replace('2', '').replace('3', '').replace('⁻', '').replace('₂', '').replace('₃', '');

            if (query.includes(name) || query.includes(formula)) {
                foundRowIndex = i;
                break;
            }
        }
    }

    if (foundColIndex === -1) {
        // 2. Ищем КАТИОН (столбец) по названию
        for (let i = 0; i < solubilityData.cations.length; i++) {
            const c = solubilityData.cations[i];
            const name = c.n.toLowerCase();
            const formula = c.f.toLowerCase().replace('+', '').replace('2', '').replace('3', '').replace('⁺', '').replace('²', '').replace('₂', '');

            // Ищем вхождение имени катиона (или корня) в запрос
            if (query.includes(name) || query.includes(name.slice(0, -1)) || query.includes(formula)) {
                foundColIndex = i;
                break;
            }
        }
    }

    // 3. Открываем таблицу, если нашли хоть что-то
    if (foundRowIndex !== -1 || foundColIndex !== -1) {
        // Открываем модалку (если закрыта)
        const modal = document.getElementById('solubility-modal');
        if (modal.style.display !== 'flex') {
            openSolubility();
        }

        // Закрываем панель фильтров
        const filtersPanel = document.getElementById('filters-panel');
        if (filtersPanel && filtersPanel.classList.contains('active')) {
            filtersPanel.classList.remove('active');
        }

        // Выделяем найденное
        setTimeout(() => {
            if (foundRowIndex !== -1 && foundColIndex !== -1) {
                // Нашли И катион, И анион → крестовина
                highlightCrosshair(foundRowIndex, foundColIndex);

                const table = document.getElementById('solubility-table');
                const cell = table.rows[foundRowIndex + 1].cells[foundColIndex + 1];
                cell.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            } else if (foundColIndex !== -1) {
                // Нашли ТОЛЬКО катион → подсвечиваем столбец
                highlightColumn(foundColIndex);

                const table = document.getElementById('solubility-table');
                const header = table.rows[0].cells[foundColIndex + 1];
                header.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            } else if (foundRowIndex !== -1) {
                // Нашли ТОЛЬКО анион → подсвечиваем строку
                highlightRow(foundRowIndex);

                const table = document.getElementById('solubility-table');
                const header = table.rows[foundRowIndex + 1].cells[0];
                header.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
            }
        }, 300);

        return true; // Успех
    }

    return false; // Ничего не нашли
}

// =========================================
// ПОЛНАЯ ТАБЛИЦА РАСТВОРИМОСТИ
// =========================================
// =========================================
// РЕАЛЬНЫЕ ЦВЕТА ВЕЩЕСТВ
// =========================================
let isColorMode = false;

const substanceColors = {
    // =============================================
    // БЕЛЫЕ ОСАДКИ (white)
    // =============================================
    // Галогениды
    "Ag+-Cl-": "white",           // AgCl - белый творожистый
    "Pb2+-Cl-": "white",          // PbCl₂ - белый
    "Pb2+-Br-": "white",          // PbBr₂ - белый
    "Hg2+-Cl-": "white",          // Hg₂Cl₂ - белый (каломель)

    // Сульфаты
    "Ba2+-SO42-": "white",        // BaSO₄ - белый (барит)
    "Pb2+-SO42-": "white",        // PbSO₄ - белый
    "Ca2+-SO42-": "white",        // CaSO₄ - белый (гипс)
    "Sr2+-SO42-": "white",        // SrSO₄ - белый
    "Ag+-SO42-": "white",         // Ag₂SO₄ - белый

    // Карбонаты
    "Ca2+-CO32-": "white",        // CaCO₃ - белый (мел, мрамор)
    "Ba2+-CO32-": "white",        // BaCO₃ - белый
    "Mg2+-CO32-": "white",        // MgCO₃ - белый
    "Sr2+-CO32-": "white",        // SrCO₃ - белый
    "Pb2+-CO32-": "white",        // PbCO₃ - белый
    "Zn2+-CO32-": "white",        // ZnCO₃ - белый

    // Фосфаты
    "Ca2+-PO43-": "white",        // Ca₃(PO₄)₂ - белый
    "Ba2+-PO43-": "white",        // Ba₃(PO₄)₂ - белый
    "Mg2+-PO43-": "white",        // Mg₃(PO₄)₂ - белый
    "Zn2+-PO43-": "white",        // Zn₃(PO₄)₂ - белый
    "Pb2+-PO43-": "white",        // Pb₃(PO₄)₂ - белый
    "Al3+-PO43-": "white",        // AlPO₄ - белый

    // Силикаты
    "Ca2+-SiO32-": "white",       // CaSiO₃ - белый
    "Ba2+-SiO32-": "white",       // BaSiO₃ - белый
    "Mg2+-SiO32-": "white",       // MgSiO₃ - белый
    "Zn2+-SiO32-": "white",       // ZnSiO₃ - белый

    // Сульфиты
    "Ca2+-SO32-": "white",        // CaSO₃ - белый
    "Ba2+-SO32-": "white",        // BaSO₃ - белый
    "Pb2+-SO32-": "white",        // PbSO₃ - белый

    // Гидроксиды белые
    "Al3+-OH-": "white",          // Al(OH)₃ - белый студенистый
    "Zn2+-OH-": "white",          // Zn(OH)₂ - белый
    "Mg2+-OH-": "white",          // Mg(OH)₂ - белый
    "Ca2+-OH-": "white",          // Ca(OH)₂ - белый (известь)
    "Ba2+-OH-": "white",          // Ba(OH)₂ - белый
    "Sn2+-OH-": "white",          // Sn(OH)₂ - белый

    // Сульфид цинка
    "Zn2+-S2-": "white",          // ZnS - белый

    // Фториды
    "Ca2+-F-": "white",           // CaF₂ - белый (флюорит)
    "Ba2+-F-": "white",           // BaF₂ - белый
    "Mg2+-F-": "white",           // MgF₂ - белый
    "Sr2+-F-": "white",           // SrF₂ - белый
    "Pb2+-F-": "white",           // PbF₂ - белый

    // =============================================
    // БЕСЦВЕТНЫЕ РАСТВОРЫ (colorless)
    // =============================================
    // Нитраты (все растворимы и бесцветны, кроме окрашенных катионов)
    "Na+-NO3-": "colorless",
    "K+-NO3-": "colorless",
    "Ca2+-NO3-": "colorless",
    "Ba2+-NO3-": "colorless",
    "Mg2+-NO3-": "colorless",
    "Zn2+-NO3-": "colorless",
    "Pb2+-NO3-": "colorless",
    "Al3+-NO3-": "colorless",
    "Ag+-NO3-": "colorless",

    // Хлориды растворимые
    "Na+-Cl-": "colorless",
    "K+-Cl-": "colorless",
    "Ca2+-Cl-": "colorless",
    "Ba2+-Cl-": "colorless",
    "Mg2+-Cl-": "colorless",
    "Zn2+-Cl-": "colorless",
    "Al3+-Cl-": "colorless",

    // Сульфаты растворимые
    "Na+-SO42-": "colorless",
    "K+-SO42-": "colorless",
    "Mg2+-SO42-": "colorless",
    "Zn2+-SO42-": "colorless",
    "Al3+-SO42-": "colorless",

    // Ацетаты
    "Na+-CH3COO-": "colorless",
    "K+-CH3COO-": "colorless",
    "Ca2+-CH3COO-": "colorless",
    "Ba2+-CH3COO-": "colorless",
    "Mg2+-CH3COO-": "colorless",
    "Zn2+-CH3COO-": "colorless",
    "Pb2+-CH3COO-": "colorless",
    "Al3+-CH3COO-": "colorless",

    // =============================================
    // ЖЁЛТЫЕ И ОРАНЖЕВЫЕ
    // =============================================
    "Ag+-Br-": "#fffacd",         // AgBr - бледно-жёлтый
    "Ag+-I-": "#ffd700",          // AgI - жёлтый
    "Pb2+-I-": "#ffd700",         // PbI₂ - золотисто-жёлтый ("золотой дождь")
    "Ag+-PO43-": "#ffff00",       // Ag₃PO₄ - жёлтый
    "Cd2+-S2-": "#ffa500",        // CdS - оранжево-жёлтый

    // Хроматы
    "Ba2+-CrO42-": "#ffff00",     // BaCrO₄ - жёлтый
    "Pb2+-CrO42-": "#ffa500",     // PbCrO₄ - оранжево-жёлтый
    "Sr2+-CrO42-": "#ffff00",     // SrCrO₄ - жёлтый
    "Ca2+-CrO42-": "#ffff00",     // CaCrO₄ - жёлтый
    "Ag+-CrO42-": "#8b0000",      // Ag₂CrO₄ - кирпично-красный

    // Соли железа(III)
    "Fe3+-Cl-": "#daa520",        // FeCl₃ - жёлто-коричневый
    "Fe3+-SO42-": "#daa520",      // Fe₂(SO₄)₃ - желтоватый
    "Fe3+-NO3-": "#d2b48c",       // Fe(NO₃)₃ - бледно-жёлтый

    // =============================================
    // ГОЛУБЫЕ И СИНИЕ
    // =============================================
    "Cu2+-OH-": "#87ceeb",        // Cu(OH)₂ - голубой
    "Cu2+-SO42-": "#87ceeb",      // CuSO₄ - голубой
    "Cu2+-NO3-": "#87ceeb",       // Cu(NO₃)₂ - голубой
    "Cu2+-Cl-": "#48d1cc",        // CuCl₂ - сине-зелёный
    "Cu2+-CO32-": "#40e0d0",      // CuCO₃ - бирюзовый (малахит)

    // =============================================
    // ЗЕЛЁНЫЕ
    // =============================================
    "Fe2+-OH-": "#90ee90",        // Fe(OH)₂ - зеленовато-белый
    "Ni2+-OH-": "#90ee90",        // Ni(OH)₂ - светло-зелёный
    "Ni2+-SO42-": "#90ee90",      // NiSO₄ - зелёный
    "Ni2+-Cl-": "#90ee90",        // NiCl₂ - зелёный
    "Ni2+-NO3-": "#90ee90",       // Ni(NO₃)₂ - зелёный
    "Cr3+-OH-": "#7fffd4",        // Cr(OH)₃ - серо-зелёный
    "Cr3+-Cl-": "#9370db",        // CrCl₃ - фиолетово-зелёный

    // =============================================
    // БУРЫЕ И КОРИЧНЕВЫЕ
    // =============================================
    "Fe3+-OH-": "#8b4513",        // Fe(OH)₃ - бурый
    "Sn2+-S2-": "#8b4513",        // SnS - коричневый

    // =============================================
    // РОЗОВЫЕ
    // =============================================
    "Co2+-OH-": "#ff69b4",        // Co(OH)₂ - розовый
    "Co2+-Cl-": "#ff69b4",        // CoCl₂ - розовый
    "Co2+-NO3-": "#ff69b4",       // Co(NO₃)₂ - розовый
    "Co2+-SO42-": "#ff69b4",      // CoSO₄ - розовый
    "Mn2+-OH-": "#ffe4e1",        // Mn(OH)₂ - бледно-розовый
    "Mn2+-SO42-": "#ffb6c1",      // MnSO₄ - бледно-розовый

    // =============================================
    // ФИОЛЕТОВЫЕ
    // =============================================
    "K+-MnO4-": "#8b008b",        // KMnO₄ - тёмно-фиолетовый
    "Na+-MnO4-": "#8b008b",       // NaMnO₄ - тёмно-фиолетовый
    "Cr3+-SO42-": "#9370db",      // Cr₂(SO₄)₃ - фиолетовый

    // =============================================
    // ЧЁРНЫЕ
    // =============================================
    "Ag+-S2-": "#000000",         // Ag₂S - чёрный
    "Pb2+-S2-": "#000000",        // PbS - чёрный (галенит)
    "Cu2+-S2-": "#000000",        // CuS - чёрный
    "Fe2+-S2-": "#000000",        // FeS - чёрный
    "Ni2+-S2-": "#000000",        // NiS - чёрный
    "Co2+-S2-": "#000000",        // CoS - чёрный
    "Hg2+-S2-": "#000000",        // HgS - чёрный (или красный киноварь)

    // =============================================
    // ДОПОЛНИТЕЛЬНЫЕ ЦВЕТНЫЕ СОЛИ
    // =============================================
    // Медь — голубые
    "Cu2+-CH3COO-": "#87ceeb",    // Cu(CH₃COO)₂ - голубой
    "Cu2+-PO43-": "#87ceeb",      // Cu₃(PO₄)₂ - голубой

    // Никель — зелёные
    "Ni2+-CO32-": "#90ee90",      // NiCO₃ - зелёный
    "Ni2+-PO43-": "#90ee90",      // Ni₃(PO₄)₂ - зелёный
    "Ni2+-CH3COO-": "#90ee90",    // Ni(CH₃COO)₂ - зелёный

    // Кобальт — розовые
    "Co2+-CO32-": "#ff69b4",      // CoCO₃ - розовый
    "Co2+-PO43-": "#ff69b4",      // Co₃(PO₄)₂ - розовый
    "Co2+-CH3COO-": "#ff69b4",    // Co(CH₃COO)₂ - розовый

    // Хром — зелёные/фиолетовые
    "Cr3+-NO3-": "#9370db",       // Cr(NO₃)₃ - фиолетовый
    "Cr3+-CH3COO-": "#7fffd4",    // Cr(CH₃COO)₃ - зелёный

    // Железо(II) — бледно-зелёные
    "Fe2+-SO42-": "#98fb98",      // FeSO₄ - бледно-зелёный
    "Fe2+-Cl-": "#98fb98",        // FeCl₂ - бледно-зелёный
    "Fe2+-NO3-": "#98fb98",       // Fe(NO₃)₂ - бледно-зелёный

    // Марганец — бледно-розовые (только растворимые!)
    "Mn2+-Cl-": "#ffb6c1",        // MnCl₂ - бледно-розовый
    "Mn2+-NO3-": "#ffb6c1",       // Mn(NO₃)₂ - бледно-розовый
    "Mn2+-CH3COO-": "#ffb6c1",    // Mn(CH₃COO)₂ - бледно-розовый
};

// Нормализация формулы: "Ag⁺" → "Ag+", "SO₄²⁻" → "SO42-"
function normalizeFormula(formula) {
    return formula
        .replace(/⁺/g, '+')
        .replace(/⁻/g, '-')
        .replace(/²/g, '2')
        .replace(/³/g, '3')
        .replace(/⁴/g, '4')
        .replace(/₂/g, '2')
        .replace(/₃/g, '3')
        .replace(/₄/g, '4')
        .replace(/₅/g, '5');
}

// Определяем, тёмный ли цвет (для выбора цвета текста)
function isColorDark(hexColor) {
    if (!hexColor || hexColor.length < 7) return false;

    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Формула относительной яркости (luminance)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance < 0.5;
}

// Переключение режима цветов
function toggleColorMode() {
    isColorMode = !isColorMode;

    const btn = document.getElementById('color-mode-btn');
    btn.classList.toggle('active', isColorMode);

    // Перерисовываем таблицу
    renderSolubilityTable();
}

const solubilityData = {
    // 24 Катиона (Полный набор)
    // Обновленные данные катионов с именами для поиска
    cations: [
        { f: "H⁺", n: "Водород" },
        { f: "NH₄⁺", n: "Аммоний" },
        { f: "Li⁺", n: "Литий" },
        { f: "K⁺", n: "Калий" },
        { f: "Na⁺", n: "Натрий" },
        { f: "Rb⁺", n: "Рубидий" },
        { f: "Cs⁺", n: "Цезий" },
        { f: "Ag⁺", n: "Серебро" },
        { f: "Mg²⁺", n: "Магний" },
        { f: "Ca²⁺", n: "Кальций" },
        { f: "Sr²⁺", n: "Стронций" },
        { f: "Ba²⁺", n: "Барий" },
        { f: "Zn²⁺", n: "Цинк" },
        { f: "Hg²⁺", n: "Ртуть" },
        { f: "Pb²⁺", n: "Свинец" },
        { f: "Cu²⁺", n: "Медь" },
        { f: "Fe²⁺", n: "Железо(II)" },
        { f: "Fe³⁺", n: "Железо(III)" },
        { f: "Al³⁺", n: "Алюминий" },
        { f: "Cr³⁺", n: "Хром" },
        { f: "Mn²⁺", n: "Марганец" },
        { f: "Ni²⁺", n: "Никель" },
        { f: "Co²⁺", n: "Кобальт" },
        { f: "Sn²⁺", n: "Олово" }
    ],

    // 17 Анионов
    anions: [
        { f: "OH⁻", n: "Гидроксид" },
        { f: "F⁻",  n: "Фторид" },
        { f: "Cl⁻", n: "Хлорид" },
        { f: "Br⁻", n: "Бромид" },
        { f: "I⁻",  n: "Иодид" },
        { f: "S²⁻", n: "Сульфид" },
        { f: "HS⁻", n: "Гидросульфид" }, // Редкость!
        { f: "SO₃²⁻", n: "Сульфит" },
        { f: "SO₄²⁻", n: "Сульфат" },
        { f: "NO₃⁻", n: "Нитрат" },
        { f: "PO₄³⁻", n: "Фосфат" },
        { f: "CO₃²⁻", n: "Карбонат" },
        { f: "SiO₃²⁻", n: "Силикат" },
        { f: "CrO₄²⁻", n: "Хромат" }, // Красивые желтые
        { f: "CH₃COO⁻", n: "Ацетат" }, // Органика
        { f: "MnO₄⁻", n: "Перманганат" } // Фиолетовый
    ],

    // ДАННЫЕ (Строка = один Анион для всех Катионов по порядку)
    // R=Раств, N=Нераств, M=Мало, D=Разлагается, O=Нет
    rows: [
        "ORRRRRR-MMMRNN-NNNNNNNNN", // OH
        "RRRRMMRRMMNNR-RNNRNRRNRR", // F
        "RRRRRRRNRRRRRRMMRRRRRRRR", // Cl
        "RRRRRRRNRRRRRRMMRRRRRRRR", // Br
        "RRRRRRRNRRRRRRNN-R-RRRRR", // I
        "RRRRRRRNRRRDNNNNNN-DDNNN", // S
        "RRRRRRR-RRRRRN-NNN-DDNNN", // HS (примерно как S, но кислые соли часто раств.)
        "RRRRRRRNRMNNMNNNNN-DDNNN", // SO3
        "RRRRRRRMNNNNRRNRRRRRRRRR", // SO4
        "RRRRRRRRRRRRRRRRRRRRRRRR", // NO3 (Все растворимы!)
        "RRRRRRRNNNNNNNNNNNNNNNNN", // PO4
        "RRRRRRRNNNNNNN-NNN-DDNNN", // CO3
        "NRRRRRRNNNNNNN-NNN-DDNNN", // SiO3
        "RRRRRRRNNNMNRN-NNN-N-NNN", // CrO4
        "RRRRRRRMZRMRRRRRRRRRRRRR", // CH3COO (Z - это серебро малораств)
        "RRRRRRRMRRRRRRRRRRRRRRRR"  // MnO4
    ]
};

// Функция отрисовки (Вызывать 1 раз при старте или открытии)
function renderSolubilityTable() {
    const table = document.getElementById('solubility-table');
    if (!table) return;
    table.innerHTML = '';

    // 1. HEADER (Катионы)
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Пустой угол (кнопка сброса выделения)
    const corner = document.createElement('th');
    corner.innerText = "×";
    corner.style.cursor = "pointer";
    corner.onclick = clearTableSelection;
    corner.title = "Сбросить выделение";
    headerRow.appendChild(corner);

    // Цикл по катионам (ЗАГОЛОВКИ)
    solubilityData.cations.forEach((cat, colIndex) => {
        const th = document.createElement('th');
        th.innerHTML = cat.f;
        th.title = cat.n;
        th.dataset.col = colIndex;
        th.onclick = () => highlightColumn(colIndex);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 2. BODY (Анионы + Данные)
    const tbody = document.createElement('tbody');

    solubilityData.anions.forEach((anion, rowIndex) => {
        const tr = document.createElement('tr');

        // Заголовок ряда (Анион)
        const th = document.createElement('th');
        th.innerHTML = `${anion.f}<br><span style="font-size:0.7em; font-weight:normal">${anion.n}</span>`;
        th.dataset.row = rowIndex;
        // Клик по аниону -> выделяет весь ряд
        th.onclick = () => highlightRow(rowIndex);
        tr.appendChild(th);

        // Данные строки (из строки символов)
        const dataString = solubilityData.rows[rowIndex] || ""; // Защита если строка короче

        solubilityData.cations.forEach((cat, colIndex) => {
            const td = document.createElement('td');
            const char = dataString[colIndex] || "?";

            // Расшифровка символа
            let text = char;
            let className = '';

            switch(char) {
                case 'R': text = 'Р'; className = 'type-r'; break;
                case 'N': text = 'Н'; className = 'type-n'; break;
                case 'M': text = 'М'; className = 'type-m'; break;
                case 'D': text = '-'; className = 'type-d'; break;
                case 'O': text = ''; className = 'type-d'; break;
                case 'Z': text = 'М'; className = 'type-m'; break;
                default: text = '?';
            }

            td.innerText = text;
            td.className = className;

            // === РЕЖИМ РЕАЛЬНЫХ ЦВЕТОВ ===
            // === РЕЖИМ РЕАЛЬНЫХ ЦВЕТОВ ===
            // === РЕЖИМ РЕАЛЬНЫХ ЦВЕТОВ ===
            if (isColorMode) {
                const catKey = normalizeFormula(cat.f);
                const anionKey = normalizeFormula(anion.f);
                const colorKey = `${catKey}-${anionKey}`;

                const chemColor = substanceColors[colorKey];

                // Пропускаем разлагающиеся вещества (D, -, ?)
                if (char === 'D' || char === 'O' || char === '-') {
                    // Не красим — оставляем серым
                }
                else if (chemColor) {
                    // Есть конкретный цвет в базе
                    td.classList.add('chem-color-cell');

                    if (chemColor === "white") {
                        td.classList.add('white-precipitate', 'light-bg');
                    } else if (chemColor === "colorless") {
                        td.classList.add('colorless-solution', 'light-bg');
                    } else {
                        td.style.backgroundColor = chemColor;
                        if (isColorDark(chemColor)) {
                            td.classList.add('dark-bg');
                        } else {
                            td.classList.add('light-bg');
                        }
                    }
                }
                else if (char === 'R') {
                    // Растворимо, но нет в базе → бесцветный раствор
                    td.classList.add('chem-color-cell', 'colorless-solution', 'light-bg');
                }
                else if (char === 'N' || char === 'M') {
                    // Нерастворимо/малорастворимо, но нет в базе → белый осадок
                    td.classList.add('chem-color-cell', 'white-precipitate', 'light-bg');
                }
            }

            // === КОНЕЦ РЕЖИМА ЦВЕТОВ ===

            td.dataset.r = rowIndex;
            td.dataset.c = colIndex;

            td.onclick = (e) => {
                e.stopPropagation();
                highlightCrosshair(rowIndex, colIndex);
            };

            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
}

// =========================================
// ЛОГИКА ПОДСВЕТКИ (КРЕСТОВИНА)
// =========================================

function clearTableSelection() {
    // Удаляем все классы активности
    document.querySelectorAll('.active-row, .active-col, .focused-cell, .active-header')
        .forEach(el => {
            el.classList.remove('active-row', 'active-col', 'focused-cell', 'active-header');
        });
}
// Выделение крестовины (клик по ячейке)
function highlightCrosshair(rIdx, cIdx) {
    const table = document.getElementById('solubility-table');
    const targetCell = table.rows[rIdx + 1].cells[cIdx + 1];

    // ПРОВЕРКА: Если эта ячейка уже активна — сбрасываем всё
    if (targetCell.classList.contains('focused-cell')) {
        clearTableSelection();
        return;
    }

    // Иначе — сначала чистим старое, потом выделяем новое
    clearTableSelection();

    // 1. Подсвечиваем заголовки
    const rowHeader = table.rows[rIdx + 1].cells[0];
    const colHeader = table.rows[0].cells[cIdx + 1];

    rowHeader.classList.add('active-header');
    colHeader.classList.add('active-header');

    // 2. Подсвечиваем ячейку
    targetCell.classList.add('focused-cell');

    // 3. Красим ряд
    const rowCells = table.rows[rIdx + 1].cells;
    for (let i = 1; i < rowCells.length; i++) {
        rowCells[i].classList.add('active-row');
    }

    // 4. Красим столбец
    for (let i = 1; i < table.rows.length; i++) {
        const cell = table.rows[i].cells[cIdx + 1];
        if (cell) cell.classList.add('active-col');
    }
}

// Выделение столбца (клик по катиону)
function highlightColumn(cIdx) {
    const table = document.getElementById('solubility-table');
    const header = table.rows[0].cells[cIdx + 1];

    // ПРОВЕРКА ТОГГЛА
    if (header.classList.contains('active-header')) {
        clearTableSelection();
        return;
    }

    clearTableSelection();

    header.classList.add('active-header');
    for (let i = 1; i < table.rows.length; i++) {
        const cell = table.rows[i].cells[cIdx + 1];
        if (cell) cell.classList.add('active-col');
    }
}

// Выделение строки (клик по аниону)
function highlightRow(rIdx) {
    const table = document.getElementById('solubility-table');
    const header = table.rows[rIdx + 1].cells[0];

    // ПРОВЕРКА ТОГГЛА
    if (header.classList.contains('active-header')) {
        clearTableSelection();
        return;
    }

    clearTableSelection();

    header.classList.add('active-header');
    const rowCells = table.rows[rIdx + 1].cells;
    for (let i = 1; i < rowCells.length; i++) {
        rowCells[i].classList.add('active-row');
    }
}
// Вызов функции открытия (не забудь добавить в FAB)
function openSolubility() {
    const modal = document.getElementById('solubility-modal');
    // Генерируем таблицу только если она пустая (оптимизация)
    if(document.getElementById('solubility-table').innerHTML === "") {
        renderSolubilityTable();
    }
    modal.style.display = 'flex';
}

function closeSolubility() {
    const modal = document.getElementById('solubility-modal');
    // Проверка: существует ли модальное окно?
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.warn("Элемент 'solubility-modal' не найден в HTML!");
    }

    // Если есть функция очистки выделения
    if (typeof clearTableSelection === 'function') {
        clearTableSelection();
    }
}
