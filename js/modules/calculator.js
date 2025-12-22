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
        isDragging: false
    };

    el.addEventListener('touchstart', function(e) {
        const calcPanel = document.getElementById('calc-panel');
        if (!calcPanel.classList.contains('active')) {
            return;
        }

        e.preventDefault();

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

        if (isOverDropZone || tapDuration < 400) {
            addAtomToCalculator(touchData.symbol);
        }

        touchData.symbol = null;
        touchData.isDragging = false;
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
    if (symbol === 'Cl') {
        mass = 35.5;
    } else {
        // Берем массу из elementsData
        const rawMass = String(elementsData[symbol].atomicMass);
        // Парсим массу (теперь точнее для дробных)
        mass = parseFloat(rawMass.replace('[', '').replace(']', ''));
        // Округляем до сотых, если нужно, или оставляем как есть
        if (isNaN(mass)) mass = 0;
    }

    // Проверяем, есть ли уже такой атом в списке
    const existingAtom = calcAtoms.find(a => a.symbol === symbol);

    if (existingAtom) {
        // Если есть — увеличиваем количество
        existingAtom.count = parseFloat((existingAtom.count + 1).toFixed(2));
        // Обновляем UI существующего элемента
        const atomDiv = document.querySelector(`.calc-atom[data-id="${existingAtom.id}"]`);
        if (atomDiv) {
            const input = atomDiv.querySelector('input');
            input.value = existingAtom.count;
        }
        updateTotalMass();
    } else {
        // Если нет — создаем новый
        const atomObj = {
            id: Date.now(),
            symbol: symbol,
            mass: mass,
            count: 1
        };
        calcAtoms.push(atomObj);

        const placeholder = document.querySelector('#drop-zone .drop-placeholder');
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

    // HTML структура: Иконка | Инфо+Контролы | Удалить
    atomDiv.innerHTML = `
        <div class="calc-atom-visual">${atomObj.symbol}</div>
        <div class="calc-info">
            <span class="calc-symbol">${atomObj.symbol}</span>
            <div class="calc-controls">
                <button class="calc-btn-minus" type="button">−</button>
                <input type="number" class="calc-atom-count" value="${atomObj.count}" min="0.1" step="0.1">
                <button class="calc-btn-plus" type="button">+</button>
            </div>
        </div>
        <span class="calc-atom-remove">&times;</span>
    `;

    // --- ОБРАБОТЧИКИ СОБЫТИЙ ---

    // 1. Input (ручной ввод)
    const input = atomDiv.querySelector('input');
    input.onchange = (e) => {
        let val = parseFloat(e.target.value);
        if (isNaN(val) || val < 0.1) val = 0.1;
        // Округляем до 2 знаков
        val = parseFloat(val.toFixed(2));

        atomObj.count = val;
        input.value = val;
        updateTotalMass();
    };

    // 2. Кнопка Минус
    const btnMinus = atomDiv.querySelector('.calc-btn-minus');
    btnMinus.onclick = () => {
        changeQuantity(atomObj, -1, input);
    };

    // 3. Кнопка Плюс
    const btnPlus = atomDiv.querySelector('.calc-btn-plus');
    btnPlus.onclick = () => {
        changeQuantity(atomObj, 1, input);
    };

    // 4. Кнопка Удалить
    const btnRemove = atomDiv.querySelector('.calc-atom-remove');
    btnRemove.onclick = () => {
        calcAtoms = calcAtoms.filter(a => a.id !== atomObj.id);
        atomDiv.remove();
        if (calcAtoms.length === 0) {
            const placeholder = document.querySelector('#drop-zone .drop-placeholder');
            if (placeholder) placeholder.style.display = 'block';
        }
        updateTotalMass();
    };

    dropZone.appendChild(atomDiv);
}

// Подсчет общей массы
function updateTotalMass() {
    let total = 0;
    calcAtoms.forEach(atom => {
        total += atom.mass * atom.count;
    });

    // Округляем итог до сотых
    total = parseFloat(total.toFixed(2));

    const resultEl = document.querySelector('#calc-result .mass-value');
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
    const calcPanel = document.getElementById('calc-panel');
    const fab = document.getElementById('fab-container');

    if (fab) fab.classList.remove('active');

    if (calcPanel.classList.contains('active')) {
        calcPanel.classList.remove('active');
        document.body.classList.remove('calc-active');
        resetFabPosition();
    } else {
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

function changeQuantity(atomObj, change, inputEl) {
    let current = atomObj.count;

    // Если число целое -> шаг 1, если дробное -> шаг 1 (но можно настроить 0.1)
    // Сейчас делаем шаг 1
    let newVal = current + change;

    if (newVal < 0.1) newVal = 0.1;

    // Округляем
    newVal = parseFloat(newVal.toFixed(2));

    atomObj.count = newVal;
    inputEl.value = newVal;
    updateTotalMass();
}
