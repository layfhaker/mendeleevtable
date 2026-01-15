// =========================================
// МОДУЛЬ: КАЛЬКУЛЯТОР МОЛЯРНОЙ МАССЫ
// =========================================

const dropZone = document.getElementById('drop-zone');
let calcAtoms = []; // Здесь храним состав формулы: [{symbol: 'H', count: 2, mass: 1}, ...]

// Делаем элементы таблицы перетаскиваемыми (Desktop + Mobile)
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
        startX: 0,
        startY: 0,
        isScrolling: false
    };

    // Порог движения для определения скролла (в пикселях)
    const SCROLL_THRESHOLD = 10;

    el.addEventListener('touchstart', function(e) {
        const calcPanel = document.getElementById('calc-panel');
        if (!calcPanel.classList.contains('active')) {
            return;
        }

        const touch = e.touches[0];
        touchData.symbol = this.dataset.symbol;
        touchData.startTime = Date.now();
        touchData.startX = touch.clientX;
        touchData.startY = touch.clientY;
        touchData.isScrolling = false;
        
        this.style.opacity = '0.5';
    });

    el.addEventListener('touchmove', function(e) {
        const calcPanel = document.getElementById('calc-panel');
        if (!calcPanel.classList.contains('active') || !touchData.symbol) {
            return;
        }

        const touch = e.touches[0];
        
        // Проверяем, сдвинулся ли палец достаточно для скролла
        const deltaX = Math.abs(touch.clientX - touchData.startX);
        const deltaY = Math.abs(touch.clientY - touchData.startY);
        
        if (deltaX > SCROLL_THRESHOLD || deltaY > SCROLL_THRESHOLD) {
            touchData.isScrolling = true;
            // Возвращаем нормальную прозрачность если это скролл
            this.style.opacity = '1';
        }

        // Подсветка drop-zone только если это не скролл
        if (!touchData.isScrolling) {
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

        // Если это был скролл — не добавляем элемент
        if (touchData.isScrolling) {
            touchData.symbol = null;
            touchData.isScrolling = false;
            dropZoneEl.classList.remove('drag-over');
            return;
        }

        const touch = e.changedTouches[0];
        const dropZoneRect = dropZoneEl.getBoundingClientRect();

        const isOverDropZone = (
            touch.clientX >= dropZoneRect.left &&
            touch.clientX <= dropZoneRect.right &&
            touch.clientY >= dropZoneRect.top &&
            touch.clientY <= dropZoneRect.bottom
        );

        const tapDuration = Date.now() - touchData.startTime;

        // Добавляем только если:
        // 1. Палец над drop-zone, ИЛИ
        // 2. Короткий тап (<400мс) БЕЗ движения
        if (isOverDropZone || tapDuration < 400) {
            addAtomToCalculator(touchData.symbol);
        }

        touchData.symbol = null;
        touchData.isScrolling = false;
        dropZoneEl.classList.remove('drag-over');
    });
});

// Настройка зоны сброса
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
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

// Добавление атома в список
function addAtomToCalculator(symbol) {
    let mass = 0;

    // 1. ОКРУГЛЕНИЕ МАСС (кроме хлора)
    if (symbol === 'Cl') {
        mass = 35.5;
    } else {
        const element = elementsData[symbol];
        if (element && element.atomicMass) {
            const rawMass = String(element.atomicMass);
            // Убираем скобки и округляем до целого
            mass = Math.round(parseFloat(rawMass.replace('[', '').replace(']', '')));
        }
    }

    const existingAtom = calcAtoms.find(a => a.symbol === symbol);

    if (existingAtom) {
        // Если атом есть, увеличиваем на 1 (целое число)
        changeQuantity(existingAtom, 1);
    } else {
        const atomObj = {
            id: Date.now(),
            symbol: symbol,
            mass: mass,
            count: 1 // По умолчанию 1
        };
        calcAtoms.push(atomObj);

        const placeholder = document.querySelector('.drop-placeholder');
        if (placeholder) placeholder.style.display = 'none';

        renderAtomUI(atomObj);
        updateTotalMass();
    }
}

// Отрисовка UI элемента в калькуляторе
function renderAtomUI(atomObj) {
    const dropZone = document.getElementById('drop-zone');
    const atomDiv = document.createElement('div');
    atomDiv.className = 'calc-atom';
    atomDiv.dataset.id = atomObj.id;

    // Упрощенная верстка: Символ | Кнопка-Инпут-Кнопка | Крестик
    atomDiv.innerHTML = `
        <span class="calc-atom-symbol">${atomObj.symbol}</span>
        <div class="calc-controls">
            <button class="calc-btn-minus" type="button">−</button>
            <input type="number" class="calc-atom-count" value="${atomObj.count}" min="0.1" step="any">
            <button class="calc-btn-plus" type="button">+</button>
        </div>
        <span class="calc-atom-remove">&times;</span>
    `;

    dropZone.appendChild(atomDiv);

    // --- ОБРАБОТЧИКИ ---

    const input = atomDiv.querySelector('input');

    // 1. Ручной ввод (разрешаем дробные, минимум 0.1)
    input.onchange = (e) => {
        let val = parseFloat(e.target.value);
        // Если ввели некорректное значение или < 0.1, сбрасываем на 1
        if (isNaN(val) || val < 0.1) val = 1;

        atomObj.count = val;
        input.value = val;
        updateTotalMass();
    };

    // 2. Кнопка Минус (СТРОГО ЦЕЛЫЕ, МИНИМУМ 1)
    atomDiv.querySelector('.calc-btn-minus').onclick = () => {
        let current = atomObj.count;
        let newVal;

        // Если текущее число дробное, округляем вниз
        // Если целое — отнимаем 1
        if (Math.floor(current) === current) {
            newVal = current - 1;
        } else {
            newVal = Math.floor(current);
        }

        // Минимум 1
        if (newVal < 1) newVal = 1;

        atomObj.count = newVal;
        input.value = newVal;
        updateTotalMass();
    };

    // 3. Кнопка Плюс (СТРОГО ЦЕЛЫЕ)
    atomDiv.querySelector('.calc-btn-plus').onclick = () => {
        let current = atomObj.count;
        let newVal;

        // Если дробное, округляем вверх
        // Если целое — прибавляем 1
        if (Math.floor(current) === current) {
            newVal = current + 1;
        } else {
            newVal = Math.ceil(current);
        }

        atomObj.count = newVal;
        input.value = newVal;
        updateTotalMass();
    };

    // 4. Удаление
    atomDiv.querySelector('.calc-atom-remove').onclick = () => {
        calcAtoms = calcAtoms.filter(a => a.id !== atomObj.id);
        atomDiv.remove();
        if (calcAtoms.length === 0) {
            const placeholder = document.querySelector('.drop-placeholder');
            if (placeholder) placeholder.style.display = 'flex';
        }
        updateTotalMass();
    };
}

// Вспомогательная функция для обновления массы при добавлении дубликата
function changeQuantity(atomObj, change) {
    // Тут просто +1 к существующему (целые числа)
    let newVal = atomObj.count + change;
    // На всякий случай проверка минимума
    if (newVal < 1) newVal = 1;

    atomObj.count = newVal;

    // Обновляем инпут в DOM
    const atomDiv = document.querySelector(`.calc-atom[data-id="${atomObj.id}"]`);
    if (atomDiv) {
        const input = atomDiv.querySelector('input');
        input.value = newVal;
    }

    updateTotalMass();
}

// Подсчет общей массы
function updateTotalMass() {
    let total = 0;
    calcAtoms.forEach(atom => {
        total += atom.mass * atom.count;
    });

    // Округляем итог до сотых (на случай дробных коэффициентов)
    total = parseFloat(total.toFixed(2));

    const resultEl = document.querySelector('.mass-value');
    if (resultEl) {
        resultEl.innerHTML = `${total} <span class="unit">г/моль</span>`;
    }
}

// Очистка
function clearCalculator() {
    calcAtoms = [];
    const atoms = dropZone.querySelectorAll('.calc-atom');
    atoms.forEach(el => el.remove());

    const placeholder = dropZone.querySelector('.drop-placeholder');
    if (placeholder) placeholder.style.display = 'block';

    updateTotalMass();
}

// Переключение калькулятора
function toggleCalc() {
    const isSolubilityOpen = document.body.classList.contains('solubility-open');
    const filtersPanel = document.getElementById('filters-panel');
    const isFiltersOpen = filtersPanel && filtersPanel.classList.contains('active');

    if (isSolubilityOpen || isFiltersOpen) {
        return;
    }
    const calcPanel = document.getElementById('calc-panel');
    const fab = document.getElementById('fab-container');

    if (calcPanel.classList.contains('active')) {
        // При закрытии калькулятора не закрываем FAB меню
        calcPanel.classList.remove('active');
        document.body.classList.remove('calc-active');
        resetFabPosition();
    } else {
        // При открытии калькулятора скрываем FAB меню только на мобильных устройствах
        if (window.innerWidth <= 1024 && fab) {
            fab.classList.remove('active');
        }
        calcPanel.classList.add('active');
        document.body.classList.add('calc-active');

        if (window.innerWidth > 1024) {
            positionCalculatorPC();
        } else {
            resetCalculatorPosition();
        }
        if (typeof modal !== 'undefined' && modal.style.display === 'flex') {
            closeModal();
        }
    }
}

// Позиционирование калькулятора на ПК
function positionCalculatorPC() {
    if (window.innerWidth <= 1024) return;

    const calcPanel = document.getElementById('calc-panel');
    const mg = document.getElementById('Mg');
    const al = document.getElementById('Al');
    const container = document.querySelector('.container');

    if (!mg || !al || !container || !calcPanel) return;

    const mgRect = mg.getBoundingClientRect();
    const alRect = al.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const left = mgRect.right + 4;
    const right = alRect.left - 4;
    const width = right - left;
    const top = containerRect.top - 20;
    const rowHeight = mgRect.height + 2;
    const height = rowHeight * 3.3;

    calcPanel.style.left = left + 'px';
    calcPanel.style.top = top + 'px';
    calcPanel.style.width = width + 'px';
    calcPanel.style.height = height + 'px';
}

function resetCalculatorPosition() {
    const calcPanel = document.getElementById('calc-panel');
    if (!calcPanel) return;

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
