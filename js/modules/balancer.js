// =========================================
// MODULE: EQUATION BALANCER
// =========================================
const BALANCER_ANIM_MS = 360;

/**
 * Close balancer panel
 */

window.closeBalancer = function (event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const panel = document.getElementById('balancer-panel');
    if (!panel) return;

    if (panel.classList.contains('active')) {
        if (panel.classList.contains('closing')) return;
        panel.classList.add('closing');
        document.body.classList.remove('balancer-active');
        setTimeout(() => {
            panel.classList.remove('active', 'closing');
        }, BALANCER_ANIM_MS);
    } else {
        panel.classList.remove('active', 'closing');
        document.body.classList.remove('balancer-active');
    }
    if (window.mobileLayout && typeof window.mobileLayout.resetTransform === 'function') {
        window.mobileLayout.resetTransform();
    }

    // Continue with other cleanup immediately (or wait? usually immediate is fine for non-visuals)

    // Restore scroll position if saved
    const savedScrollY = document.body.dataset.savedScrollY;
    if (savedScrollY !== undefined) {
        window.scrollTo({ top: parseInt(savedScrollY), behavior: 'instant' });
        delete document.body.dataset.savedScrollY;
    }

    // Show FAB on mobile
    const fab = document.getElementById('fab-container');
    if (window.innerWidth <= 1024 && fab) {
        fab.style.display = '';
    }

    // Restore scroll-collapse system when balancer is closed
    window.restoreScrollCollapseSystem();

    if (typeof resetFabPosition === 'function') resetFabPosition();
};

/**
 * Check if balancer is active
 */
window.isBalancerActive = function () {
    const panel = document.getElementById('balancer-panel');
    return panel && panel.classList.contains('active');
};

/**
 * Toggle balancer panel
 */
window.toggleBalancer = async function (event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const panel = document.getElementById('balancer-panel');
    const fab = document.getElementById('fab-container');

    if (!panel) return;

    // If open - close
    if (panel.classList.contains('active')) {
        window.closeBalancer(event);
        return;
    }

    // Check for conflicts
    const isElementModalOpen = document.body.classList.contains('modal-open');
    const isSolubilityOpen = document.body.classList.contains('solubility-open');
    const filtersPanel = document.getElementById('filters-panel');
    const isFiltersOpen = filtersPanel && filtersPanel.classList.contains('active');
    const isCalcOpen = document.body.classList.contains('calc-active');

    if (isElementModalOpen || isSolubilityOpen || isFiltersOpen || isCalcOpen) return;

    // Save scroll position
    document.body.dataset.savedScrollY = window.scrollY || window.pageYOffset;

    // On mobile: scroll to top immediately
    if (window.innerWidth <= 1024) {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Open panel
    if (window.innerWidth <= 1024 && fab) {
        fab.classList.remove('active');
    }

    panel.classList.remove('closing');
    panel.classList.add('active');
    document.body.classList.add('balancer-active');
    if (window.mobileLayout && typeof window.mobileLayout.applyTransform === 'function') {
        setTimeout(() => window.mobileLayout.applyTransform(), 50);
    }

    // Disable scroll-collapse system and hide below-table-content
    window.disableScrollCollapseSystem();

    // Position on PC
    if (window.innerWidth > 1024 && typeof positionBalancerPC === 'function') {
        // Use setTimeout with a longer delay to ensure all animations/transitions complete
        setTimeout(positionBalancerPC, 100);
    }

    // Show loader initially
    const resultDiv = document.getElementById('balancer-result');
    if (resultDiv) {
        resultDiv.innerHTML = '<span class="placeholder-text">Введите уравнение для уравнивания</span>';
    }
};

window.performBalance = function () {
    const input = document.getElementById('balancer-input');
    const resultDiv = document.getElementById('balancer-result');
    const errorDiv = document.getElementById('balancer-error');

    if (!input || !resultDiv) return;

    errorDiv.style.display = 'none';
    resultDiv.innerHTML = '<span class="placeholder-text">Вычисляю...</span>';

    setTimeout(() => {
        try {
            const query = input.value;
            if (!query.trim()) throw new Error("Введите уравнение");

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

// Keep backwards compatibility aliases
window.toggleBalancerRealModule = window.toggleBalancer;
window.closeBalancerRealModule = window.closeBalancer;
window.toggleBalancerPanel = window.toggleBalancer;
window.closeBalancerPanel = window.closeBalancer;

window.fillBalance = function (equation) {
    const input = document.getElementById('balancer-input');
    if (input) {
        input.value = equation;
        performBalance();
    }
};

window.performBalance = function () {
    const input = document.getElementById('balancer-input');
    const resultDiv = document.getElementById('balancer-result');
    const errorDiv = document.getElementById('balancer-error');

    if (!input || !resultDiv) return;

    errorDiv.style.display = 'none';
    resultDiv.innerHTML = '<span class="placeholder-text">Вычисляю...</span>';

    setTimeout(() => {
        try {
            const query = input.value;
            if (!query.trim()) throw new Error("Введите уравнение");

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

    console.log('positionBalancerPC called');

    const panel = document.getElementById('balancer-panel');

    // Check if the table is scaled due to scroll-collapse
    const tableContainer = document.querySelector('.periodic-table-container');
    console.log('Table container:', tableContainer);
    console.log('Has scroll-collapsed class:', tableContainer && tableContainer.classList.contains('scroll-collapsed'));

    if (tableContainer && tableContainer.classList.contains('scroll-collapsed')) {
        console.log('Table is collapsed, showing in default position');
        // If table is collapsed, show balancer in default position (bottom-right)
        panel.style.position = 'fixed';
        panel.style.left = 'auto';  // Explicitly reset to avoid CSS conflicts
        panel.style.top = 'auto';   // Explicitly reset to avoid CSS conflicts
        panel.style.right = '20px';
        panel.style.bottom = '20px';
        panel.style.width = '320px';
        panel.style.maxHeight = '400px';
        panel.style.height = 'auto';
        panel.style.zIndex = '1000';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        return;
    }

    // If table is not collapsed, position next to element K
    const elH = document.getElementById('H');
    const elK = document.getElementById('K');
    const elAl = document.getElementById('Al');
    const elMg = document.getElementById('Mg');

    console.log('Elements found:', { elH: !!elH, elK: !!elK, elAl: !!elAl, elMg: !!elMg });

    if (!elH || !elK || !elAl || !panel) {
        console.warn('Required elements not found');
        return;
    }

    const hRect = elH.getBoundingClientRect();
    const kRect = elK.getBoundingClientRect();
    const alRect = elAl.getBoundingClientRect();
    const mgRect = elMg ? elMg.getBoundingClientRect() : null;

    console.log('Element H rectangle:', {
        x: hRect.x, y: hRect.y,
        left: hRect.left, top: hRect.top,
        right: hRect.right, bottom: hRect.bottom,
        width: hRect.width, height: hRect.height
    });

    console.log('Element K rectangle:', {
        x: kRect.x, y: kRect.y,
        left: kRect.left, top: kRect.top,
        right: kRect.right, bottom: kRect.bottom,
        width: kRect.width, height: kRect.height
    });

    console.log('Element Al rectangle:', {
        x: alRect.x, y: alRect.y,
        left: alRect.left, top: alRect.top,
        right: alRect.right, bottom: alRect.bottom,
        width: alRect.width, height: alRect.height
    });

    if (mgRect) {
        console.log('Element Mg rectangle:', {
            x: mgRect.x, y: mgRect.y,
            left: mgRect.left, top: mgRect.top,
            right: mgRect.right, bottom: mgRect.bottom,
            width: mgRect.width, height: mgRect.height
        });
    } else {
        console.log('Element Mg not found, using fallback calculation');
    }

    // Calculate positions based on current view (accounting for any transforms)
    const mgRight = mgRect ? mgRect.right : (hRect.right + 80);
    const alLeft = alRect.left;
    const totalSpace = alLeft - mgRight; // Общее доступное пространство

    // Позиционируем панель в пустом пространстве таблицы:
    // - Слева: после Mg (2-й столбец)
    // - Справа: перед Al (13-й столбец)  
    // - Сверху: на уровне H (1-й ряд)
    // - Снизу: над K (4-й ряд)

    // Равные отступы со всех сторон
    const gap = Math.max(2, Math.round(hRect.width * 0.04));

    // Горизонтальные границы
    const panelLeft = Math.ceil(mgRight + gap);
    const panelRightLimit = Math.floor(alLeft - gap);
    const panelWidth = Math.max(0, panelRightLimit - panelLeft);

    // Вертикальные границы (равные отступы сверху и снизу)
    const extraTop = Math.min(10, Math.max(0, hRect.top - 6));
    let panelTop = hRect.top + gap - extraTop;
    let panelHeight = kRect.top - hRect.top - (gap * 2) + extraTop;
    const availableAbove = Math.max(0, Math.floor(hRect.top - 8));

    // Устанавливаем панель
    panel.style.position = 'fixed';
    panel.style.boxSizing = 'border-box';  // Важно! Ширина включает border
    panel.style.left = panelLeft + 'px';
    panel.style.top = panelTop + 'px';
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    panel.style.width = panelWidth + 'px';
    panel.style.height = panelHeight + 'px';
    panel.style.maxHeight = panelHeight + 'px';
    panel.style.minHeight = '0';  // Отключаем min-height из CSS
    panel.style.zIndex = '1000';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';

    console.log('Panel positioning:', {
        panelTop: panelTop,
        panelLeft: panelLeft,
        panelWidth: panelWidth,
        panelHeight: panelHeight,
        gap: gap
    });

    setTimeout(() => {
        const header = panel.querySelector('.calc-header');
        const content = panel.querySelector('.balancer-content');
        const inputRow = panel.querySelector('.balancer-input-row');
        const result = panel.querySelector('#balancer-result');
        const examples = panel.querySelector('.balancer-examples');

        if (header && content && inputRow && result) {
            const contentStyles = getComputedStyle(content);
            const paddingY = parseFloat(contentStyles.paddingTop) + parseFloat(contentStyles.paddingBottom);
            const gapY = parseFloat(contentStyles.rowGap || contentStyles.gap || 0);
            const minContent = inputRow.offsetHeight + result.offsetHeight + paddingY + gapY + 8;
            const minPanelHeight = header.offsetHeight + minContent + 8;

            if (panelHeight < minPanelHeight) {
                const extraTop = Math.min(availableAbove, Math.ceil(minPanelHeight - panelHeight));
                if (extraTop > 0) {
                    panelHeight += extraTop;
                    panelTop -= extraTop;
                    panel.style.top = panelTop + 'px';
                    panel.style.height = panelHeight + 'px';
                    panel.style.maxHeight = panelHeight + 'px';
                }
            }

            if (examples && examples.style.display === 'none') {
                examples.style.display = '';
            }
        }
    }, 90);

    // Также логируем реальные размеры панели после установки стилей
    setTimeout(() => {
        console.log('Actual panel dimensions after styling:', {
            offsetHeight: panel.offsetHeight,
            clientHeight: panel.clientHeight,
            scrollHeight: panel.scrollHeight,
            computedStyles: {
                height: getComputedStyle(panel).height,
                maxHeight: getComputedStyle(panel).maxHeight
            }
        });

        // Логируем размеры внутренних элементов
        const header = panel.querySelector('.calc-header');
        const inputRow = panel.querySelector('.balancer-input-row');
        const result = panel.querySelector('#balancer-result');
        const examples = panel.querySelector('.balancer-examples');

        if (header) {
            console.log('Header dimensions:', {
                offsetHeight: header.offsetHeight,
                clientHeight: header.clientHeight
            });
        }

        if (inputRow) {
            console.log('Input row dimensions:', {
                offsetHeight: inputRow.offsetHeight,
                clientHeight: inputRow.clientHeight
            });
        }

        if (result) {
            console.log('Result dimensions:', {
                offsetHeight: result.offsetHeight,
                clientHeight: result.clientHeight
            });
        }

        if (examples) {
            console.log('Examples dimensions:', {
                offsetHeight: examples.offsetHeight,
                clientHeight: examples.clientHeight
            });
        }
    }, 100);
}

window.addEventListener('resize', () => {
    const panel = document.getElementById('balancer-panel');
    if (panel && panel.classList.contains('active') && window.innerWidth > 1024) {
        // Use setTimeout with a longer delay to ensure all animations/transitions complete
        setTimeout(positionBalancerPC, 100);
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
    while (stack.length > 1) {
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
