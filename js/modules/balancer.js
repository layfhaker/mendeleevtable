// =========================================
// МОДУЛЬ: УРАВНИТЕЛЬ РЕАКЦИЙ
// =========================================

// --- UI ЛОГИКА ---

window.closeBalancerRealModule = function(event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const panel = document.getElementById('balancer-panel');
    const fab = document.getElementById('fab-container');
    if (!panel) return;

    panel.classList.remove('active');
    document.body.classList.remove('balancer-active');

    // Восстанавливаем позицию скролла, если она была сохранена
    const savedScrollY = document.body.dataset.savedScrollY;
    if (savedScrollY !== undefined) {
        window.scrollTo({ top: savedScrollY, behavior: 'instant' });
        delete document.body.dataset.savedScrollY;
    }

    // Возвращаем FAB на мобильных устройствах
    if (window.innerWidth <= 1024 && fab) {
        fab.style.display = '';
    }

    if (typeof resetFabPosition === 'function') resetFabPosition();
};

// Функция для проверки, открыт ли уравниватель
window.isBalancerActive = function() {
    const panel = document.getElementById('balancer-panel');
    return panel && panel.classList.contains('active');
};

window.toggleBalancerRealModule = async function(event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const panel = document.getElementById('balancer-panel');
    const fab = document.getElementById('fab-container');

    if (!panel) return;

    // Если открыто - закрываем
    if (panel.classList.contains('active')) {
        closeBalancerRealModule(event);
        return;
    }

    // Сохраняем текущую позицию скролла
    const savedScrollY = window.scrollY || window.pageYOffset;

    // Проверяем конфликты перед открытием
    const isSolubilityOpen = document.body.classList.contains('solubility-open');
    const filtersPanel = document.getElementById('filters-panel');
    const isFiltersOpen = filtersPanel && filtersPanel.classList.contains('active');

    if (isSolubilityOpen || isFiltersOpen) return;

    // Закрываем калькулятор если открыт
    const calcPanel = document.getElementById('calc-panel');
    if (calcPanel && calcPanel.classList.contains('active')) {
        if (typeof toggleCalc === 'function') toggleCalc();
    }

    // На мобильных: скроллим вверх СРАЗУ, до всех других действий
    if (window.innerWidth <= 1024) {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Закрываем таблицу растворимости на мобильных
    if (window.innerWidth <= 1024) {
        const solubilityModal = document.getElementById('solubility-modal');
        if (solubilityModal && solubilityModal.classList.contains('show')) {
            if (typeof closeSolubility === 'function') closeSolubility();
        }
    }

    // Открываем панель
    // Не скрываем FAB на ПК, только на мобильных
    if (window.innerWidth <= 1024 && fab) {
        fab.classList.remove('active');
    }
    panel.classList.add('active');
    document.body.classList.add('balancer-active');

    // Позиционирование на ПК
    if (window.innerWidth > 1024) {
         positionBalancerPC();
    }

    // Сохраняем позицию скролла в dataset для восстановления при закрытии
    document.body.dataset.savedScrollY = savedScrollY;
};

window.fillBalance = function(equation) {
    const input = document.getElementById('balancer-input');
    if(input) {
        input.value = equation;
        performBalance();
    }
};

window.performBalance = function() {
    const input = document.getElementById('balancer-input');
    const resultDiv = document.getElementById('balancer-result');
    const errorDiv = document.getElementById('balancer-error');

    if (!input || !resultDiv) return;

    errorDiv.style.display = 'none';
    resultDiv.innerHTML = '<span class="placeholder-text">Вычисляю...</span>';

    setTimeout(() => {
        try {
            const query = input.value;
            if(!query.trim()) throw new Error("Введите уравнение");

            const balanced = balanceEquation(query);

            const formatted = formatChemicalHTML(balanced);
            resultDiv.innerHTML = formatted;

        } catch (e) {
            resultDiv.innerHTML = '';
            errorDiv.textContent = e.message.replace(/^Error:\s*/, '');
            errorDiv.style.display = 'block';
        }
    }, 50);
};

function positionBalancerPC() {
    if (window.innerWidth <= 1024) return;

    const panel = document.getElementById('balancer-panel');
    const elH = document.getElementById('H');
    const elK = document.getElementById('K');
    const elAl = document.getElementById('Al');
    const elMg = document.getElementById('Mg');

    if (!elH || !elK || !elAl || !panel) return;

    const minGapFromTop = 40;

    const hRect = elH.getBoundingClientRect();
    const kRect = elK.getBoundingClientRect();
    const alRect = elAl.getBoundingClientRect();

    const mgRight = elMg ? elMg.getBoundingClientRect().right : (hRect.right + 80);
    const left = mgRight + 6;
    const width = alRect.left - left - 6;

    // Позиционируем под элементом K, чтобы не налезать на 4-й ряд
    const rowHeight = hRect.height || 60;
    let targetTop = kRect.bottom + window.scrollY + 10; // 10px отступ от K

    // Ограничиваем максимальную высоту
    const maxPanelHeight = 250; // Максимальная высота панели
    const availableHeight = window.innerHeight - (kRect.bottom + 20);

    panel.style.position = 'absolute';
    panel.style.left = left + 'px';
    panel.style.top = targetTop + 'px';
    panel.style.width = width + 'px';
    panel.style.maxHeight = Math.min(maxPanelHeight, availableHeight) + 'px';
    panel.style.height = 'auto';
    panel.style.zIndex = '1000';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
}

window.addEventListener('resize', () => {
    const panel = document.getElementById('balancer-panel');
    if (panel && panel.classList.contains('active') && window.innerWidth > 1024) {
        positionBalancerPC();
    }
});


// --- МАТЕМАТИЧЕСКОЕ ЯДРО (БЕЗ ИЗМЕНЕНИЙ) ---

function balanceEquation(formulaStr) {
    formulaStr = normalizeInput(formulaStr);

    const parts = formulaStr.split(/=|->|→/);
    if (parts.length !== 2) throw new Error("Используйте знак '=' или '->'");

    const reactants = parseSide(parts[0]);
    const products = parseSide(parts[1]);

    if (reactants.length === 0 || products.length === 0) throw new Error("Проверьте формулу");

    const allCompounds = [...reactants, ...products];
    const allElements = new Set();

    allCompounds.forEach(comp => {
        Object.keys(comp.elements).forEach(el => allElements.add(el));
    });

    const elemsList = Array.from(allElements);
    if (elemsList.length === 0) throw new Error("Элементы не найдены");

    const matrix = [];
    elemsList.forEach(el => {
        const row = [];
        reactants.forEach(comp => row.push(comp.elements[el] || 0));
        products.forEach(comp => row.push(-(comp.elements[el] || 0)));
        matrix.push(row);
    });

    const coeffs = bruteForceSolver(matrix, allCompounds.length);
    if (!coeffs) throw new Error("Не удалось уравнять. Проверьте индексы.");

    let resultStr = "";

    for (let i = 0; i < reactants.length; i++) {
        const c = coeffs[i];
        resultStr += (i > 0 ? " + " : "") + (c > 1 ? `<span class='coeff'>${c}</span>` : "") + reactants[i].original;
    }

    resultStr += " = ";

    for (let i = 0; i < products.length; i++) {
        const c = coeffs[reactants.length + i];
        resultStr += (i > 0 ? " + " : "") + (c > 1 ? `<span class='coeff'>${c}</span>` : "") + products[i].original;
    }

    return resultStr;
}

function normalizeInput(str) {
    const map = {
        'А': 'A', 'а': 'a', 'В': 'B', 'С': 'C', 'с': 'c',
        'Е': 'E', 'е': 'e', 'Н': 'H', 'К': 'K', 'к': 'k',
        'М': 'M', 'м': 'm', 'О': 'O', 'о': 'o', '0': 'O',
        'Р': 'P', 'р': 'p', 'Т': 'T', 'т': 't', 'Х': 'X', 'х': 'x', 'У': 'Y', 'у': 'y'
    };
    return str.split('').map(char => map[char] || char).join('');
}

function parseSide(sideStr) {
    if (!sideStr) return [];
    return sideStr.split("+").map(s => {
        s = s.trim();
        if (!s) return null;
        return { original: s, elements: parseFormula(s) };
    }).filter(item => item !== null);
}

function parseFormula(formula) {
    formula = formula.replace(/\s+/g, '');
    const elements = {};
    let i = 0;
    const len = formula.length;
    const stack = [{}];

    while (i < len) {
        const char = formula[i];
        if (char === '(' || char === '[') {
            stack.push({});
            i++;
        }
        else if (char === ')' || char === ']') {
            if (stack.length > 1) {
                const top = stack.pop();
                i++;
                let numStr = "";
                while (i < len && /\d/.test(formula[i])) {
                    numStr += formula[i];
                    i++;
                }
                const multiplier = numStr ? parseInt(numStr) : 1;
                const parent = stack[stack.length - 1];
                for (let el in top) {
                    parent[el] = (parent[el] || 0) + top[el] * multiplier;
                }
            } else { i++; }
        }
        else if (/[A-Z]/.test(char)) {
            let name = char;
            i++;
            if (i < len && /[a-z]/.test(formula[i])) {
                name += formula[i];
                i++;
            }
            let numStr = "";
            while (i < len && /\d/.test(formula[i])) {
                numStr += formula[i];
                i++;
            }
            const count = numStr ? parseInt(numStr) : 1;
            const current = stack[stack.length - 1];
            current[name] = (current[name] || 0) + count;
        }
        else { i++; }
    }
    while(stack.length > 1) {
        const top = stack.pop();
        const parent = stack[stack.length - 1];
        for (let el in top) parent[el] = (parent[el] || 0) + top[el];
    }
    return stack[0];
}

function bruteForceSolver(matrix, n) {
    const MAX_COEFF = 15;
    const coeffs = new Array(n).fill(1);
    while (true) {
        let valid = true;
        for (let r = 0; r < matrix.length; r++) {
            let sum = 0;
            for (let c = 0; c < n; c++) {
                sum += matrix[r][c] * coeffs[c];
            }
            if (sum !== 0) { valid = false; break; }
        }
        if (valid) return coeffs;
        let i = 0;
        while (i < n) {
            coeffs[i]++;
            if (coeffs[i] <= MAX_COEFF) break;
            else { coeffs[i] = 1; i++; }
        }
        if (i === n) return null;
    }
}

function formatChemicalHTML(str) {
    return str.replace(/([a-zA-Z\)\]])(\d+)/g, '$1<sub>$2</sub>');
}
