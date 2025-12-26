// =========================================
// РЕНДЕРИНГ ТАБЛИЦЫ РАСТВОРИМОСТИ
// =========================================

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

        // Данные строки (НОВАЯ СИСТЕМА - используем getSolubility)
        solubilityData.cations.forEach((cat, colIndex) => {
            const td = document.createElement('td');

            // Получаем растворимость через новую функцию
            const solubility = getSolubility(cat.f, anion.f);

            // Расшифровка символа
            let text = '';
            let className = '';

            switch(solubility) {
                case 'R': text = 'Р'; className = 'type-r'; break;
                case 'N': text = 'Н'; className = 'type-n'; break;
                case 'M': text = 'М'; className = 'type-m'; break;
                case 'D': text = '-'; className = 'type-d'; break;
                case 'O': text = ''; className = 'type-d'; break;
                default: text = '?'; className = '';
            }

            td.innerText = text;
            td.className = className;

            // === РЕЖИМ РЕАЛЬНЫХ ЦВЕТОВ ===
            if (isColorMode) {
                const catKey = normalizeFormula(cat.f);
                const anionKey = normalizeFormula(anion.f);
                const colorKey = `${catKey}-${anionKey}`;

                const chemColor = substanceColors[colorKey];

                // Пропускаем разлагающиеся вещества (D, O)
                if (solubility === 'D' || solubility === 'O') {
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
                else if (solubility === 'R') {
                    // Растворимо, но нет в базе → бесцветный раствор
                    td.classList.add('chem-color-cell', 'colorless-solution', 'light-bg');
                }
                else if (solubility === 'N' || solubility === 'M') {
                    // Нерастворимо/малорастворимо, но нет в базе → белый осадок
                    td.classList.add('chem-color-cell', 'white-precipitate', 'light-bg');
                }
            }

            // === КОНЕЦ РЕЖИМА ЦВЕТОВ ===

            td.dataset.r = rowIndex;
            td.dataset.c = colIndex;

            // Одинарный клик - подсветка ИЛИ продвинутый режим
            td.onclick = (e) => {
                e.stopPropagation();

                // Если включён продвинутый режим — открываем модалку
                if (typeof isAdvancedClickMode !== 'undefined' && isAdvancedClickMode) {
                    const cation = solubilityData.cations[colIndex];
                    const anion = solubilityData.anions[rowIndex];
                    if (cation && anion && typeof openAdvancedModal !== 'undefined') {
                        openAdvancedModal(cation.f, anion.f);
                    }
                    return;
                }

                // Иначе — обычная подсветка крестовиной
                highlightCrosshair(rowIndex, colIndex);
            };

            // Двойной клик - продвинутый режим
            td.ondblclick = (e) => {
                e.stopPropagation();
                const cation = solubilityData.cations[colIndex];
                const anion = solubilityData.anions[rowIndex];
                if (cation && anion && typeof openAdvancedModal !== 'undefined') {
                    openAdvancedModal(cation.f, anion.f);
                }
            };

            // Для мобильных: долгое нажатие (500мс)
            let touchTimer;
            td.addEventListener('touchstart', (e) => {
                touchTimer = setTimeout(() => {
                    const cation = solubilityData.cations[colIndex];
                    const anion = solubilityData.anions[rowIndex];
                    if (cation && anion && typeof openAdvancedModal !== 'undefined') {
                        e.preventDefault();
                        openAdvancedModal(cation.f, anion.f);
                    }
                }, 500);
            });

            td.addEventListener('touchend', () => {
                clearTimeout(touchTimer);
            });

            td.addEventListener('touchmove', () => {
                clearTimeout(touchTimer);
            });

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

// =========================================
// DRAG-TO-SCROLL ДЛЯ ТАБЛИЦЫ
// =========================================
function enableDragScroll(element) {
    let isDown = false;
    let startX, startY, scrollLeft, scrollTop;

    element.addEventListener('mousedown', (e) => {
        // Не мешаем кликам по ячейкам таблицы и заголовкам
        if (e.target.tagName === 'TD' || e.target.tagName === 'TH') return;

        isDown = true;
        element.style.cursor = 'grabbing';
        element.style.userSelect = 'none';

        startX = e.pageX - element.offsetLeft;
        startY = e.pageY - element.offsetTop;
        scrollLeft = element.scrollLeft;
        scrollTop = element.scrollTop;
    });

    element.addEventListener('mouseleave', () => {
        isDown = false;
        element.style.cursor = 'grab';
    });

    element.addEventListener('mouseup', () => {
        isDown = false;
        element.style.cursor = 'grab';
        element.style.userSelect = '';
    });

    element.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();

        const x = e.pageX - element.offsetLeft;
        const y = e.pageY - element.offsetTop;
        const walkX = (x - startX) * 1.5; // Множитель для скорости прокрутки
        const walkY = (y - startY) * 1.5;

        element.scrollLeft = scrollLeft - walkX;
        element.scrollTop = scrollTop - walkY;
    });
}

// Получить ключ вещества для ячейки
function getCellSubstanceKey(rowIndex, colIndex) {
    const anion = solubilityData.anions[rowIndex];
    const cation = solubilityData.cations[colIndex];

    if (!anion || !cation) return '';

    const catKey = normalizeFormula(cation.f);
    const anionKey = normalizeFormula(anion.f);

    return `${catKey}-${anionKey}`;
}

/// =========================================
// РЯД АКТИВНОСТИ (ФИНАЛЬНАЯ ВЕРСИЯ)
// =========================================

let isMetalsView = true;

// Инициализация UI (вызывать внутри openSolubility)
function initActivitySeriesUI() {
    // 1. Находим существующую желтую кнопку в HTML
    const toggleBtn = document.getElementById('activity-mode-btn');
    if (!toggleBtn) return;

    // Сбрасываем старые обработчики (клон элемента)
    const newBtn = toggleBtn.cloneNode(true);
    toggleBtn.parentNode.replaceChild(newBtn, toggleBtn);

    // Вешаем новый клик
    newBtn.onclick = () => {
        newBtn.classList.toggle('active');
        toggleActivityContainerDisplay(newBtn.classList.contains('active'));
    };

    // 2. Создаем контейнер, если его нет
    const modalContent = document.querySelector('.solubility-content');
    let container = document.getElementById('activity-series-container');

    if (!container && modalContent) {
        container = document.createElement('div');
        container.id = 'activity-series-container';
        // Вставляем сразу после шапки
        const header = modalContent.querySelector('.modal-header');
        if (header) {
            header.after(container);
        }
    }

    // Скрываем при открытии таблицы (сбрасываем состояние)
    if (container) container.style.display = 'none';
    if (newBtn) newBtn.classList.remove('active');
}

// Показать/Скрыть
function toggleActivityContainerDisplay(isVisible) {
    const container = document.getElementById('activity-series-container');
    if (!container) return;

    if (isVisible) {
        container.style.display = 'block';
        isMetalsView = true; // Сброс на металлы при открытии
        renderActivityContent();
    } else {
        container.style.display = 'none';
    }
}

// Рендер содержимого
function renderActivityContent() {
    const container = document.getElementById('activity-series-container');
    if (!container) return;

    const titleText = isMetalsView ? "Ряд активности металлов" : "Ряд неметаллов";
    const switchBtnText = isMetalsView ? "К неметаллам →" : "← К металлам";
    const data = isMetalsView ? activityData.metals : activityData.nonMetals;

    // Генерируем элементы
    let itemsHTML = '';
    data.forEach((symbol, idx) => {
        const isHydrogen = (symbol === 'H' && isMetalsView);
        const className = isHydrogen ? 'act-item hydrogen' : 'act-item';

        itemsHTML += `<div class="${className}">${symbol}</div>`;

        // Стрелочка между элементами
        if (idx < data.length - 1) {
            itemsHTML += `<div class="act-arrow">→</div>`;
        }
    });

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="margin:0; font-size: 16px; color: var(--text-color);">${titleText}</h3>
            <button id="activity-switch-btn" style="padding: 6px 12px; cursor: pointer; border: 1px solid #2196F3; background: transparent; color: #2196F3; border-radius: 4px; font-size: 13px;">
                ${switchBtnText}
            </button>
        </div>

        <div class="activity-list-container">
            ${itemsHTML}
        </div>

        <div style="margin-top: 10px; font-size: 12px; color: #888; text-align: center;">
            ${isMetalsView ? "← Активные (восстановители) . . . Пассивные (окислители) →" : "← Сильные окислители . . . Слабые окислители →"}
        </div>
    `;

    // Кнопка переключения типа ряда
    const switchBtn = document.getElementById('activity-switch-btn');
    if (switchBtn) {
        switchBtn.onclick = () => {
            isMetalsView = !isMetalsView;
            renderActivityContent();
        };
    }
}

// Переключение панели рядов активности
function toggleActivitySeries() {
    const panel = document.getElementById('activity-series-panel');
    const btn = document.getElementById('activity-series-btn');

    if (panel && btn) {
        panel.classList.toggle('active');
        btn.classList.toggle('active');
    }
}
