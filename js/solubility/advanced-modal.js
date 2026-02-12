// =========================================
// ADVANCED-MODAL.JS — Упрощённое модальное окно
// Версия 2.0: Автогенерация + SVG визуализация
// =========================================

// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
window.isAdvancedClickMode = false;
const advancedModal = document.getElementById('advanced-substance-modal');
const advancedModalContent = document.getElementById('advanced-substance-content');
const ADVANCED_MODE_HINT_TEXT = 'нажмите на вещество для подробной информации';
const ADVANCED_MODE_HINT_HIDE_DELAY_MS = 3200;
let advancedModeHintTimerId = null;

function ensureAdvancedModeHint() {
    const container = document.querySelector('#solubility-modal .solubility-content');
    if (!container) return null;

    let hint = container.querySelector('.advanced-mode-hint');
    if (!hint) {
        hint = document.createElement('div');
        hint.className = 'advanced-mode-hint';
        hint.setAttribute('role', 'status');
        hint.setAttribute('aria-live', 'polite');
        hint.textContent = ADVANCED_MODE_HINT_TEXT;
        container.appendChild(hint);
    }

    return hint;
}

function hideAdvancedModeHint(immediate = false) {
    if (advancedModeHintTimerId) {
        clearTimeout(advancedModeHintTimerId);
        advancedModeHintTimerId = null;
    }

    const hint = document.querySelector('#solubility-modal .advanced-mode-hint');
    if (!hint) return;

    hint.classList.remove('is-visible');
    if (immediate) {
        hint.style.transition = 'none';
        hint.offsetHeight;
        hint.style.removeProperty('transition');
    }
}

function showAdvancedModeHint() {
    const hint = ensureAdvancedModeHint();
    if (!hint) return;

    hideAdvancedModeHint();

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            hint.classList.add('is-visible');
        });
    });

    advancedModeHintTimerId = setTimeout(() => {
        hint.classList.remove('is-visible');
        advancedModeHintTimerId = null;
    }, ADVANCED_MODE_HINT_HIDE_DELAY_MS);
}

// === ИНИЦИАЛИЗАЦИЯ ===
function initAdvancedModeButton() {
    const btn = document.getElementById('advanced-mode-info-btn');
    if (!btn) return;

    const activeTitle = '\u0420\u0435\u0436\u0438\u043c \u0432\u043a\u043b\u044e\u0447\u0451\u043d \u2014 \u043a\u043b\u0438\u043a\u043d\u0438\u0442\u0435 \u043d\u0430 \u044f\u0447\u0435\u0439\u043a\u0443 \u0434\u043b\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0438';
    const inactiveTitle = '\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0440\u0435\u0436\u0438\u043c \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u0430 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0438';

    const syncButtonState = () => {
        btn.classList.toggle('active', window.isAdvancedClickMode);
        btn.title = window.isAdvancedClickMode ? activeTitle : inactiveTitle;
    };

    syncButtonState();
    if (!window.isAdvancedClickMode) {
        hideAdvancedModeHint(true);
    }

    btn.onclick = () => {
        window.isAdvancedClickMode = !window.isAdvancedClickMode;
        syncButtonState();

        if (window.isAdvancedClickMode) {
            showAdvancedModeHint();
        } else {
            hideAdvancedModeHint();
        }
    };
}

// === ОТКРЫТИЕ/ЗАКРЫТИЕ ===
function openAdvancedModal(cationFormula, anionFormula) {
    renderAdvancedContent(cationFormula, anionFormula);
    advancedModal.classList.remove('closing');
    advancedModal.style.display = 'flex';
    document.body.classList.add('advanced-modal-open');
}

function closeAdvancedModal() {
    // Добавляем класс для анимации закрытия
    advancedModal.classList.add('closing');

    // Ждём завершения анимации
    setTimeout(() => {
        advancedModal.style.display = 'none';
        advancedModal.classList.remove('closing');
        document.body.classList.remove('advanced-modal-open');
    }, 360);
}

// === ГЕНЕРАЦИЯ ДАННЫХ ===

// Атомные массы элементов
const atomicMasses = {
    H: 1.008, Li: 6.941, Na: 22.990, K: 39.098, Rb: 85.468, Cs: 132.905,
    Be: 9.012, Mg: 24.305, Ca: 40.078, Sr: 87.62, Ba: 137.327,
    Al: 26.982, Ga: 69.723, In: 114.818, Tl: 204.383,
    C: 12.011, N: 14.007, O: 15.999, S: 32.065, P: 30.974, Si: 28.086,
    F: 18.998, Cl: 35.453, Br: 79.904, I: 126.904,
    Fe: 55.845, Cu: 63.546, Zn: 65.38, Ag: 107.868, Au: 196.967,
    Pb: 207.2, Hg: 200.592, Sn: 118.71, Cr: 51.996, Mn: 54.938,
    Co: 58.933, Ni: 58.693, Cd: 112.411
};

// Названия анионов в родительном падеже
const anionNames = {
    "OH-": { name: "гидроксид", gender: "m" },
    "F-": { name: "фторид", gender: "m" },
    "Cl-": { name: "хлорид", gender: "m" },
    "Br-": { name: "бромид", gender: "m" },
    "I-": { name: "иодид", gender: "m" },
    "S2-": { name: "сульфид", gender: "m" },
    "HS-": { name: "гидросульфид", gender: "m" },
    "SO32-": { name: "сульфит", gender: "m" },
    "SO42-": { name: "сульфат", gender: "m" },
    "NO3-": { name: "нитрат", gender: "m" },
    "PO43-": { name: "фосфат", gender: "m" },
    "CO32-": { name: "карбонат", gender: "m" },
    "SiO32-": { name: "силикат", gender: "m" },
    "CrO42-": { name: "хромат", gender: "m" },
    "Cr2O72-": { name: "дихромат", gender: "m" },
    "AlO2-": { name: "алюминат", gender: "m" },
    "ZnO22-": { name: "цинкат", gender: "m" },
    "PbO22-": { name: "плюмбат", gender: "m" },
    "CrO2-": { name: "хромит", gender: "m" },
    "SnO32-": { name: "станнат", gender: "m" },
    "CH3COO-": { name: "ацетат", gender: "m" },
    "MnO4-": { name: "перманганат", gender: "m" }
};

// Названия катионов в родительном падеже
const cationNames = {
    "H+": { name: "водорода", base: "водород" },
    "Li+": { name: "лития", base: "литий" },
    "Na+": { name: "натрия", base: "натрий" },
    "K+": { name: "калия", base: "калий" },
    "Rb+": { name: "рубидия", base: "рубидий" },
    "Cs+": { name: "цезия", base: "цезий" },
    "NH4+": { name: "аммония", base: "аммоний" },
    "Ca2+": { name: "кальция", base: "кальций" },
    "Mg2+": { name: "магния", base: "магний" },
    "Sr2+": { name: "стронция", base: "стронций" },
    "Ba2+": { name: "бария", base: "барий" },
    "Fe2+": { name: "железа(II)", base: "железо" },
    "Fe3+": { name: "железа(III)", base: "железо" },
    "Cu2+": { name: "меди(II)", base: "медь" },
    "Zn2+": { name: "цинка", base: "цинк" },
    "Al3+": { name: "алюминия", base: "алюминий" },
    "Ag+": { name: "серебра", base: "серебро" },
    "Pb2+": { name: "свинца(II)", base: "свинец" },
    "Hg2+": { name: "ртути(II)", base: "ртуть" },
    "Cr3+": { name: "хрома(III)", base: "хром" },
    "Mn2+": { name: "марганца(II)", base: "марганец" },
    "Ni2+": { name: "никеля(II)", base: "никель" },
    "Co2+": { name: "кобальта(II)", base: "кобальт" },
    "Sn2+": { name: "олова(II)", base: "олово" }
};

// Генерация формулы вещества
function generateFormula(cationFormula, anionFormula) {
    // Извлекаем заряды
    const cationCharge = Math.abs(parseInt(cationFormula.match(/(\d+)\+/)?.[1] || '1'));
    const anionCharge = Math.abs(parseInt(anionFormula.match(/(\d+)\-/)?.[1] || '1'));

    // Находим НОК для индексов
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const lcm = (cationCharge * anionCharge) / gcd(cationCharge, anionCharge);

    const cationIndex = lcm / cationCharge;
    const anionIndex = lcm / anionCharge;

    // Убираем заряды и извлекаем символы
    const cation = cationFormula.replace(/[⁺⁻⁰¹²³⁴⁵⁶⁷⁸⁹]/g, '').replace(/[\+\-\d]/g, '');
    const anion = anionFormula.replace(/[⁺⁻⁰¹²³⁴⁵⁶⁷⁸⁹]/g, '').replace(/[\+\-\d]/g, '');

    // Формируем формулу
    let formula = cation;
    if (cationIndex > 1) formula += '₀₁₂₃₄₅₆₇₈₉'[cationIndex] || cationIndex;

    // Анион в скобках, если содержит несколько атомов
    if (anion.length > 1 && anionIndex > 1) {
        formula += `(${anion})`;
        formula += '₀₁₂₃₄₅₆₇₈₉'[anionIndex] || anionIndex;
    } else {
        formula += anion;
        if (anionIndex > 1) formula += '₀₁₂₃₄₅₆₇₈₉'[anionIndex] || anionIndex;
    }

    return formula;
}

// Генерация названия вещества
function generateSubstanceName(cationFormula, anionFormula) {
    const cationKey = normalizeFormula(cationFormula);
    const anionKey = normalizeFormula(anionFormula);

    const cation = cationNames[cationKey];
    const anion = anionNames[anionKey];

    if (!cation || !anion) {
        return null;
    }

    // Особый случай: вода
    if (cationKey === 'H+' && anionKey === 'OH-') {
        return "Вода";
    }

    // Стандартное название: "Хлорид натрия"
    return `${capitalize(anion.name)} ${cation.name}`;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Расчёт молярной массы
function calculateMolarMass(formula) {
    // Убираем подстрочные индексы → обычные цифры
    const normalized = formula
        .replace(/₀/g, '0').replace(/₁/g, '1').replace(/₂/g, '2')
        .replace(/₃/g, '3').replace(/₄/g, '4').replace(/₅/g, '5')
        .replace(/₆/g, '6').replace(/₇/g, '7').replace(/₈/g, '8')
        .replace(/₉/g, '9')
        .replace(/[()]/g, ''); // Убираем скобки для упрощения

    let mass = 0;
    const regex = /([A-Z][a-z]?)(\d*)/g;
    let match;

    while ((match = regex.exec(normalized)) !== null) {
        const element = match[1];
        const count = match[2] ? parseInt(match[2]) : 1;

        if (atomicMasses[element]) {
            mass += atomicMasses[element] * count;
        }
    }

    return mass.toFixed(2);
}

// Получение информации о растворимости
function getSolubilityInfo(cationFormula, anionFormula) {
    const solubility = getSolubility(cationFormula, anionFormula);

    const descriptions = {
        'Р': 'Растворимо',
        'М': 'Малорастворимо',
        'Н': 'Нерастворимо',
        '—': 'Разлагается водой или не существует',
        'R': 'Растворимо',
        'N': 'Нерастворимо',
        'M': 'Малорастворимо',
        'D': 'Разлагается водой или не существует',
        'O': 'Особый случай'
    };

    return {
        symbol: solubility,
        description: descriptions[solubility] || 'Нет данных'
    };
}

// Получение цвета вещества
function getSubstanceColor(cationFormula, anionFormula) {
    const key = `${normalizeFormula(cationFormula)}-${normalizeFormula(anionFormula)}`;
    return substanceColors[key] || null;
}

// === SVG ГЕНЕРАТОРЫ ===

function lightenColor(hex, percent) {
    if (!hex || hex === 'colorless') return 'rgb(255,255,255)';
    if (hex === 'white') return 'rgb(255,255,255)';

    // Поддержка rgb() формата
    if (hex.startsWith('rgb')) {
        const match = hex.match(/(\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            const R = Math.min(255, parseInt(match[1]) + Math.round(2.55 * percent));
            const G = Math.min(255, parseInt(match[2]) + Math.round(2.55 * percent));
            const B = Math.min(255, parseInt(match[3]) + Math.round(2.55 * percent));
            return `rgb(${R},${G},${B})`;
        }
    }

    // HEX формат
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

function darkenColor(hex, percent) {
    if (!hex || hex === 'colorless') return 'rgb(200,200,200)';
    if (hex === 'white') return 'rgb(220,220,220)';

    // Поддержка rgb() формата
    if (hex.startsWith('rgb')) {
        const match = hex.match(/(\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            const R = Math.max(0, parseInt(match[1]) - Math.round(2.55 * percent));
            const G = Math.max(0, parseInt(match[2]) - Math.round(2.55 * percent));
            const B = Math.max(0, parseInt(match[3]) - Math.round(2.55 * percent));
            return `rgb(${R},${G},${B})`;
        }
    }

    // HEX формат
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

function generateCrystalSVG(color, size = 120) {
    // Цвет слитка
    const fillColor = color || '#ffffff';

    // Вычисляем оттенки для 3D-эффекта
    const topColor = lightenColor(fillColor, 25);      // Верхняя грань (светлая)
    const frontColor = fillColor;                       // Передняя грань (основной)
    const rightColor = darkenColor(fillColor, 20);     // Правая грань (тёмная)
    const strokeColor = darkenColor(fillColor, 40);    // Обводка

    return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100">
        <defs>
            <!-- Градиент для верхней грани -->
            <linearGradient id="topGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${lightenColor(topColor, 10)}" />
                <stop offset="100%" style="stop-color:${topColor}" />
            </linearGradient>
            <!-- Градиент для передней грани -->
            <linearGradient id="frontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:${lightenColor(frontColor, 5)}" />
                <stop offset="100%" style="stop-color:${darkenColor(frontColor, 10)}" />
            </linearGradient>
        </defs>

        <!-- MINECRAFT-STYLE INGOT (слиток) -->

        <!-- Верхняя грань (трапеция) -->
        <polygon
            points="20,30 45,20 80,30 55,40"
            fill="url(#topGrad)"
            stroke="${strokeColor}"
            stroke-width="1.5"
        />

        <!-- Передняя грань (параллелограмм) -->
        <polygon
            points="20,30 55,40 55,75 20,65"
            fill="url(#frontGrad)"
            stroke="${strokeColor}"
            stroke-width="1.5"
        />

        <!-- Правая грань (параллелограмм) -->
        <polygon
            points="55,40 80,30 80,65 55,75"
            fill="${rightColor}"
            stroke="${strokeColor}"
            stroke-width="1.5"
        />

        <!-- Блик на верхней грани -->
        <polygon
            points="25,31 42,23 52,28 35,36"
            fill="white"
            opacity="0.3"
        />

        <!-- Блик на передней грани -->
        <rect x="24" y="35" width="8" height="20" rx="2" fill="white" opacity="0.15"/>
    </svg>`;
}

function isTransparentAppearanceColor(color) {
    if (!color) return false;

    const normalizedColor = String(color).trim().toLowerCase();
    return normalizedColor === 'colorless' ||
        normalizedColor === 'transparent' ||
        normalizedColor === 'rgba(0,0,0,0)' ||
        normalizedColor === 'rgba(0, 0, 0, 0)' ||
        normalizedColor.includes('\u0431\u0435\u0441\u0446\u0432\u0435\u0442') ||
        normalizedColor.includes('\u043f\u0440\u043e\u0437\u0440\u0430\u0447');
}

function generateFlaskSVG(color, solubility, size = 120, forceTransparent = false) {
    // Определяем цвет раствора
    let solutionColor;
    let solutionOpacity;
    const isTransparentColor = forceTransparent ||
        isTransparentAppearanceColor(color) ||
        color === '#ffffff' ||
        color === '#FFFFFF' ||
        color === 'white';

    if (!color || isTransparentColor) {
        // Transparent/colorless solutions are shown as light gray glass
        solutionColor = '#dce2e9';
        solutionOpacity = 0.42;
    } else {
        // Цветной раствор — используем цвет вещества
        solutionColor = color;
        solutionOpacity = 0.5;
    }

    // Для малорастворимых — добавляем муть
    if (solubility === 'М' || solubility === 'M') {
        solutionOpacity = 0.25; // Более прозрачный, но с осадком внизу
    }

    const particleColor = isTransparentColor ? '#c5ced8' : (color || '#888');

    // Частицы осадка для малорастворимых
    const particles = (solubility === 'М' || solubility === 'M') ? `
        <circle cx="35" cy="82" r="3" fill="${particleColor}" opacity="0.7"/>
        <circle cx="50" cy="85" r="2" fill="${particleColor}" opacity="0.8"/>
        <circle cx="62" cy="83" r="2.5" fill="${particleColor}" opacity="0.6"/>
        <circle cx="42" cy="86" r="1.5" fill="${particleColor}" opacity="0.9"/>
    ` : '';

    const transparentLiquidEffects = isTransparentColor ? `
        <path
            d="M31,52 Q50,46 69,52"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            stroke-width="2"
            stroke-linecap="round"
        />
        <ellipse cx="50" cy="70" rx="20" ry="8" fill="rgba(255,255,255,0.2)"/>
    ` : '';

    return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100">
        <!-- Колба (контур) -->
        <path
            d="M38,32 L38,12 L42,8 L58,8 L62,12 L62,32 L78,68 Q82,88 50,92 Q18,88 22,68 Z"
            fill="rgba(240,248,255,0.3)"
            stroke="#666"
            stroke-width="2"
        />

        <!-- Раствор (жидкость) -->
        <path
            d="M39,45 L39,32 L61,32 L61,45 L76,68 Q80,86 50,90 Q20,86 24,68 Z"
            fill="${solutionColor}"
            opacity="${solutionOpacity}"
        />

        ${transparentLiquidEffects}

        <!-- Блик на стекле -->
        <path
            d="M26,55 Q22,45 32,38"
            fill="none"
            stroke="white"
            stroke-width="3"
            opacity="0.6"
            stroke-linecap="round"
        />

        <!-- Уровень жидкости (мениск) -->
        <ellipse cx="50" cy="45" rx="22" ry="3" fill="${solutionColor}" opacity="${solutionOpacity + 0.1}"/>

        <!-- Частицы осадка (для малорастворимых) -->
        ${particles}

        <!-- Пробка -->
        <rect x="40" y="3" width="20" height="8" rx="2" fill="#CD853F"/>
        <rect x="40" y="3" width="20" height="3" rx="1" fill="#DEB887"/>
    </svg>`;
}

// === РЕНДЕРИНГ ===

function renderAdvancedContent(cationFormula, anionFormula) {
    const formula = generateFormula(cationFormula, anionFormula);
    const name = generateSubstanceName(cationFormula, anionFormula) || formula;
    const mass = calculateMolarMass(formula);
    const solubility = getSolubilityInfo(cationFormula, anionFormula);
    const color = getSubstanceColor(cationFormula, anionFormula);

    const decompositionKey = `${normalizeFormula(cationFormula)}-${normalizeFormula(anionFormula)}`;
    const decomposition = window.decompositionReactions?.[decompositionKey];
    const noDecompositionClass = decomposition ? '' : ' no-decomposition';

    advancedModalContent.innerHTML = `
        <!-- Заголовок -->
        <div class="advanced-header">
            <div class="advanced-title-group">
                <h2>${formula}</h2>
                <p class="substance-name">${name}</p>
            </div>
        </div>

        <!-- Вкладки -->
        <div class="advanced-tabs">
            <button class="tab-btn active" onclick="switchAdvancedTab('info')">📊 Информация</button>
            <button class="tab-btn" onclick="switchAdvancedTab('appearance')">🎨 Внешний вид</button>
        </div>

        <!-- Контент вкладок -->
        <div class="advanced-content${noDecompositionClass}">
            <div id="tab-info" class="tab-pane active">
                ${renderInfoTab(formula, name, mass, solubility, color, decomposition)}
            </div>
            <div id="tab-appearance" class="tab-pane" style="display:none;">
                ${renderAppearanceTab(color, solubility, decomposition)}
            </div>
        </div>
    `;
}

function renderInfoTab(formula, name, mass, solubility, color, decomposition) {
    const colorName = color ? getColorName(color) : 'неизвестен';

    return `
        <h3>Основная информация</h3>
        <div class="info-grid">
            <div class="info-item">
                <span class="label">Формула:</span>
                <span class="value">${formula}</span>
            </div>
            <div class="info-item">
                <span class="label">Название:</span>
                <span class="value">${name}</span>
            </div>
            <div class="info-item">
                <span class="label">Молярная масса:</span>
                <span class="value">${mass} г/моль</span>
            </div>
            <div class="info-item">
                <span class="label">Растворимость:</span>
                <span class="value solubility-badge solubility-${solubility.symbol}">
                    ${solubility.symbol} — ${solubility.description}
                </span>
            </div>
            ${color ? `
                <div class="info-item">
                    <span class="label">Цвет:</span>
                    <span class="value">${colorName}</span>
                </div>
            ` : ''}
        </div>

        ${decomposition ? `
            <h3>Реакция разложения</h3>
            <div class="decomposition-section">
                <div class="reaction-equation">${decomposition.equation}</div>
                <p class="reaction-description">${decomposition.description}</p>
            </div>
        ` : ''}
    `;
}

function renderAppearanceTab(color, solubility, decomposition) {
    // Если вещество разлагается (— или D)
    if (solubility.symbol === '—' || solubility.symbol === 'D') {
        return `
            <div class="decomposition-notice">
                <h3>⚠️ Вещество неустойчиво</h3>
                <p>Данное вещество разлагается водой или не существует в обычных условиях.</p>
                ${decomposition ? `
                    <div class="decomposition-info">
                        <strong>Реакция:</strong> ${decomposition.equation}<br>
                        <strong>Описание:</strong> ${decomposition.description}
                    </div>
                ` : ''}
            </div>
        `;
    }

    const isTransparentColor = isTransparentAppearanceColor(color);
    const displayColor = isTransparentColor ? '#d6dce3' : (color || '#ffffff');
    const appearanceContainerClass = isTransparentColor
        ? 'appearance-container appearance-container-transparent'
        : 'appearance-container';
    const visualItemClass = isTransparentColor
        ? 'visual-item visual-item-transparent'
        : 'visual-item';

    let content = `<div class="${appearanceContainerClass}">`;

    // Для нерастворимых — только кристалл
    if (solubility.symbol === 'Н' || solubility.symbol === 'N') {
        content += `
            <div class="${visualItemClass}">
                <h4>Твёрдое вещество</h4>
                ${generateCrystalSVG(displayColor, 150)}
                <p class="visual-caption">Кристаллы / Осадок</p>
            </div>
        `;
    } else {
        // Для растворимых и малорастворимых — кристалл + колба
        content += `
            <div class="${visualItemClass}">
                <h4>Твёрдое вещество</h4>
                ${generateCrystalSVG(displayColor, 120)}
                <p class="visual-caption">Кристаллы</p>
            </div>
            <div class="${visualItemClass}">
                <h4>Раствор</h4>
                ${generateFlaskSVG(displayColor, solubility.symbol, 120, isTransparentColor)}
                <p class="visual-caption">${solubility.description}</p>
            </div>
        `;
    }

    content += '</div>';
    return content;
}

function getColorName(colorHex) {
    const colorNames = {
        'white': 'Белый',
        'colorless': 'Бесцветный',
        '#ffffff': 'Белый',
        '#fffacd': 'Бледно-жёлтый',
        '#ffd700': 'Золотисто-жёлтый',
        '#ff4500': 'Красный',
        '#ffff00': 'Жёлтый',
        '#ffa500': 'Оранжевый',
        '#8b0000': 'Тёмно-красный',
        '#ff8c00': 'Оранжевый',
        '#dc143c': 'Малиновый',
        '#cd853f': 'Жёлто-бурый',
        '#87ceeb': 'Голубой',
        '#48d1cc': 'Сине-зелёный',
        '#228b22': 'Зелёный',
        '#90ee90': 'Светло-зелёный',
        '#7fffd4': 'Серо-зелёный',
        '#8b4513': 'Бурый',
        '#ff69b4': 'Розовый',
        '#ffb6c1': 'Бледно-розовый',
        '#8b008b': 'Фиолетовый',
        '#000000': 'Чёрный',
        '#98fb98': 'Бледно-зелёный',
        '#778899': 'Серо-зелёный'
    };

    return colorNames[colorHex] || colorHex;
}

function switchAdvancedTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.style.display = 'none');

    event.target.classList.add('active');
    document.getElementById(`tab-${tabName}`).style.display = 'block';
}

// Закрытие модального окна при клике вне его
window.addEventListener('click', (event) => {
    if (event.target === advancedModal) {
        closeAdvancedModal();
    }
});

// Инициализация при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdvancedModeButton);
} else {
    initAdvancedModeButton();
}

