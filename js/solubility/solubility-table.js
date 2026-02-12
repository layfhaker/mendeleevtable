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

            switch (solubility) {
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
            if (window.isColorMode) {
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
                    // Растворимо, но нет в базе → пробуем анионные цвета (MnO4-, CrO4(2-), Cr2O7(2-))
                    if (anionKey === 'MnO4-') {
                        td.classList.add('chem-color-cell', 'light-bg');
                        td.style.backgroundColor = '#8b008b';
                    } else if (anionKey === 'CrO42-') {
                        td.classList.add('chem-color-cell', 'light-bg');
                        td.style.backgroundColor = '#ffff00';
                    } else if (anionKey === 'Cr2O72-') {
                        td.classList.add('chem-color-cell', 'light-bg');
                        td.style.backgroundColor = '#ff8c00';
                    } else {
                        // Растворимо, но нет в базе → бесцветный раствор
                        td.classList.add('chem-color-cell', 'colorless-solution', 'light-bg');
                    }
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
            let touchHandled = false;

            td.addEventListener('touchstart', (e) => {
                touchHandled = false;
                touchTimer = setTimeout(() => {
                    const cation = solubilityData.cations[colIndex];
                    const anion = solubilityData.anions[rowIndex];
                    if (cation && anion && typeof openAdvancedModal !== 'undefined') {
                        touchHandled = true;
                        openAdvancedModal(cation.f, anion.f);
                    }
                }, 500);
            }, { passive: true }); // Passive: true для улучшения производительности скролла

            td.addEventListener('touchend', () => {
                clearTimeout(touchTimer);
            }, { passive: true });

            td.addEventListener('touchmove', () => {
                clearTimeout(touchTimer);
            }, { passive: true });

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
    let isTouch = false;

    // #region agent log
    // fetch('http://127.0.0.1:7242/ingest/62ca497c-fdce-4d75-9803-1df85cc7de10',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'solubility-table.js:266',message:'enableDragScroll called',data:{hasTouchSupport:'ontouchstart' in window,elementTag:element.tagName},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    // Mouse events (Desktop)
    element.addEventListener('mousedown', (e) => {
        // #region agent log
        // fetch('http://127.0.0.1:7242/ingest/62ca497c-fdce-4d75-9803-1df85cc7de10',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'solubility-table.js:270',message:'mousedown event',data:{targetTag:e.target.tagName,isTouch:false},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        // Не мешаем кликам по ячейкам таблицы и заголовкам
        if (e.target.tagName === 'TD' || e.target.tagName === 'TH') return;

        isDown = true;
        isTouch = false;
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
        if (!isDown || isTouch) return;
        e.preventDefault();

        const x = e.pageX - element.offsetLeft;
        const y = e.pageY - element.offsetTop;
        const walkX = (x - startX) * 1.5; // Множитель для скорости прокрутки
        const walkY = (y - startY) * 1.5;

        element.scrollLeft = scrollLeft - walkX;
        element.scrollTop = scrollTop - walkY;
    });

    // Touch events (Mobile) - ИСПРАВЛЕНИЕ
    element.addEventListener('touchstart', (e) => {
        // #region agent log
        // fetch('http://127.0.0.1:7242/ingest/62ca497c-fdce-4d75-9803-1df85cc7de10',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'solubility-table.js:touchstart',message:'touchstart event',data:{touchCount:e.touches.length,targetTag:e.target.tagName},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        // Не мешаем кликам по ячейкам таблицы и заголовкам
        if (e.target.tagName === 'TD' || e.target.tagName === 'TH') return;

        if (e.touches.length === 1) {
            const touch = e.touches[0];
            isDown = true;
            isTouch = true;
            element.style.userSelect = 'none';

            const rect = element.getBoundingClientRect();
            startX = touch.clientX - rect.left;
            startY = touch.clientY - rect.top;
            scrollLeft = element.scrollLeft;
            scrollTop = element.scrollTop;
        }
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
        if (!isDown || !isTouch) return;
        if (e.touches.length === 1) {
            if (e.cancelable) {
                e.preventDefault();
            }
            const touch = e.touches[0];
            const rect = element.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            const walkX = (x - startX) * 1.5;
            const walkY = (y - startY) * 1.5;

            element.scrollLeft = scrollLeft - walkX;
            element.scrollTop = scrollTop - walkY;
        }
    }, { passive: false });

    element.addEventListener('touchend', () => {
        // #region agent log
        // fetch('http://127.0.0.1:7242/ingest/62ca497c-fdce-4d75-9803-1df85cc7de10',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'solubility-table.js:touchend',message:'touchend event',data:{isDown},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        isDown = false;
        isTouch = false;
        element.style.userSelect = '';
    }, { passive: true });
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

// ... (весь код выше, до строки "// РЯД АКТИВНОСТИ ...", оставляем без изменений)

// =========================================
// РЯД АКТИВНОСТИ (ФИНАЛЬНАЯ ВЕРСИЯ)
// =========================================

var isMetalsView = true;

// 1. Функция отрисовки карточек
window.renderActivitySeries = function () {
    const container = document.getElementById('activity-series-panel');
    if (!container) return;

    // Данные элементов
    const metals = ["Li", "Rb", "K", "Ba", "Sr", "Ca", "Na", "Mg", "Al", "Mn", "Zn", "Cr", "Fe", "Cd", "Co", "Ni", "Sn", "Pb", "H", "Sb", "Bi", "Cu", "Hg", "Ag", "Pt", "Au"];
    const nonMetals = ["F", "O", "N", "Cl", "Br", "I", "S", "C", "P", "Si"];

    // Выбираем список
    const currentList = isMetalsView ? metals : nonMetals;

    // Тексты
    const titleText = isMetalsView
        ? "Ряд активности металлов"
        : "Ряд активности неметаллов";

    const btnText = isMetalsView
        ? "Переключить на неметаллы"
        : "Переключить на металлы";

    const noteText = isMetalsView
        ? "← Активность (восстановители) . . . Пассивность (окислители) →"
        : "← Сильные окислители . . . Слабые окислители →";

    // Генерируем HTML карточек
    let cardsHTML = '';
    currentList.forEach((symbol, idx) => {
        const isHydrogen = (symbol === 'H' && isMetalsView);
        const className = isHydrogen ? 'act-item hydrogen' : 'act-item';

        // Клик открывает модалку элемента
        cardsHTML += `<div class="${className}" onclick="if(window.openElementModal) window.openElementModal('${symbol}')">${symbol}</div>`;

        // Стрелочка
        if (idx < currentList.length - 1) {
            cardsHTML += `<div class="act-arrow">→</div>`;
        }
    });

    // Вставляем в панель
    container.innerHTML = `
        <div class="activity-content-wrapper">
            <div class="activity-header">
                <h4>${titleText}</h4>
                <button id="toggle-series-type-btn" class="toggle-series-btn">
                    ${btnText}
                </button>
            </div>

            <div class="series-container active" style="display: flex;">
                ${cardsHTML}
            </div>

            <p class="activity-note">${noteText}</p>
        </div>
    `;

    // Вешаем обработчик на внутреннюю кнопку переключения
    const switchBtn = document.getElementById('toggle-series-type-btn');
    if (switchBtn) {
        switchBtn.onclick = function () {
            isMetalsView = !isMetalsView;
            window.renderActivitySeries(); // Просто перерисовываем
        };
    }
};

// 2. Главная функция переключения шторки (CSS animation approach)
window.toggleActivitySeries = function () {
    const btn = document.getElementById('activity-mode-btn');
    const panel = document.getElementById('activity-series-panel');

    if (!btn || !panel) return;

    // Инициализация контента при первом клике
    if (!panel.querySelector('.activity-content-wrapper')) {
        window.renderActivitySeries();
    }

    // Просто переключаем класс - CSS делает анимацию
    const isOpening = !panel.classList.contains('active');

    if (isOpening) {
        btn.classList.add('active');
        panel.classList.add('active');
    } else {
        btn.classList.remove('active');
        panel.classList.remove('active');
    }
};


// 3. Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function () {
    const panel = document.getElementById('activity-series-panel');
    if (panel) {
        // Убираем класс active, чтобы панель была скрыта при старте
        panel.classList.remove('active');
    }
});
