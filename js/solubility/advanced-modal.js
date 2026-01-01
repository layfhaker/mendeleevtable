// =========================================
// ADVANCED-MODAL.JS — Упрощённое модальное окно
// Версия 2.0: Автогенерация + SVG визуализация
// =========================================

// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
window.isAdvancedClickMode = false;
const advancedModal = document.getElementById('advanced-substance-modal');
const advancedModalContent = document.getElementById('advanced-substance-content');

// === ИНИЦИАЛИЗАЦИЯ ===
function initAdvancedModeButton() {
    const btn = document.getElementById('advanced-mode-info-btn');
    if (!btn) return;

    // Синхронизируем вид кнопки с текущим состоянием
    btn.classList.toggle('active', window.isAdvancedClickMode);
    btn.title = window.isAdvancedClickMode
        ? '✅ Режим включён — кликните на ячейку для информации'
        : '💡 Включить режим просмотра информации';

    btn.onclick = () => {
        window.isAdvancedClickMode = !window.isAdvancedClickMode;
        btn.classList.toggle('active', window.isAdvancedClickMode);
        btn.title = window.isAdvancedClickMode
            ? '✅ Режим включён — кликните на ячейку для информации'
            : '💡 Включить режим просмотра информации';
    };
}

// === ОТКРЫТИЕ/ЗАКРЫТИЕ ===
function openAdvancedModal(cationFormula, anionFormula) {
    renderAdvancedContent(cationFormula, anionFormula);
    advancedModal.style.display = 'flex';
    document.body.classList.add('advanced-modal-open');
}

function closeAdvancedModal() {
    advancedModal.style.display = 'none';
    document.body.classList.remove('advanced-modal-open');
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

    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return `rgb(${R},${G},${B})`;
}

function darkenColor(hex, percent) {
    if (!hex || hex === 'colorless') return 'rgb(200,200,200)';
    if (hex === 'white') return 'rgb(220,220,220)';

    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return `rgb(${R},${G},${B})`;
}

function generateCrystalSVG(color, size = 120) {
    const fillColor = color || '#ffffff';
    const strokeColor = darkenColor(fillColor, 30);

    return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100">
        <defs>
            <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${lightenColor(fillColor, 20)}" />
                <stop offset="50%" style="stop-color:${fillColor}" />
                <stop offset="100%" style="stop-color:${strokeColor}" />
            </linearGradient>
        </defs>
        <!-- Кристаллическая форма (октаэдр сбоку) -->
        <polygon
            points="50,5 90,35 90,65 50,95 10,65 10,35"
            fill="url(#crystalGrad)"
            stroke="${strokeColor}"
            stroke-width="2"
        />
        <!-- Грани для объёма -->
        <line x1="50" y1="5" x2="50" y2="95" stroke="${strokeColor}" stroke-width="1" opacity="0.5"/>
        <line x1="10" y1="35" x2="90" y2="65" stroke="${strokeColor}" stroke-width="1" opacity="0.3"/>
        <line x1="10" y1="65" x2="90" y2="35" stroke="${strokeColor}" stroke-width="1" opacity="0.3"/>
        <!-- Блик -->
        <ellipse cx="35" cy="30" rx="10" ry="5" fill="white" opacity="0.4"/>
    </svg>`;
}

function generateFlaskSVG(color, solubility, size = 120) {
    const fillColor = color || '#87CEEB';

    const opacity = solubility === 'Р' || solubility === 'R' ? 0.6 : 0.3;
    const hasParticles = solubility === 'М' || solubility === 'M';

    let particles = '';
    if (hasParticles) {
        particles = `
            <circle cx="35" cy="80" r="2" fill="${fillColor}" opacity="0.8"/>
            <circle cx="50" cy="85" r="1.5" fill="${fillColor}" opacity="0.9"/>
            <circle cx="60" cy="82" r="2" fill="${fillColor}" opacity="0.7"/>
            <circle cx="45" cy="88" r="1" fill="${fillColor}" opacity="0.8"/>
        `;
    }

    return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100">
        <defs>
            <clipPath id="flaskClip">
                <path d="M35,35 L35,15 L40,10 L60,10 L65,15 L65,35 L80,70 Q85,90 50,95 Q15,90 20,70 Z"/>
            </clipPath>
        </defs>

        <!-- Колба (контур) -->
        <path
            d="M35,35 L35,15 L40,10 L60,10 L65,15 L65,35 L80,70 Q85,90 50,95 Q15,90 20,70 Z"
            fill="none"
            stroke="#666"
            stroke-width="2"
        />

        <!-- Раствор -->
        <path
            d="M36,50 L36,35 L64,35 L64,50 L78,70 Q83,88 50,93 Q17,88 22,70 Z"
            fill="${fillColor}"
            opacity="${opacity}"
            clip-path="url(#flaskClip)"
        />

        <!-- Блик на колбе -->
        <path
            d="M25,60 Q20,50 30,40"
            fill="none"
            stroke="white"
            stroke-width="3"
            opacity="0.5"
            stroke-linecap="round"
        />

        <!-- Частицы осадка (для малорастворимых) -->
        ${particles}

        <!-- Пробка -->
        <rect x="38" y="5" width="24" height="8" rx="2" fill="#8B4513"/>
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
        <div class="advanced-content">
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

    const displayColor = color || '#ffffff';

    let content = '<div class="appearance-container">';

    // Для нерастворимых — только кристалл
    if (solubility.symbol === 'Н' || solubility.symbol === 'N') {
        content += `
            <div class="visual-item">
                <h4>Твёрдое вещество</h4>
                ${generateCrystalSVG(displayColor, 150)}
                <p class="visual-caption">Кристаллы / Осадок</p>
            </div>
        `;
    } else {
        // Для растворимых и малорастворимых — кристалл + колба
        content += `
            <div class="visual-item">
                <h4>Твёрдое вещество</h4>
                ${generateCrystalSVG(displayColor, 120)}
                <p class="visual-caption">Кристаллы</p>
            </div>
            <div class="visual-item">
                <h4>Раствор</h4>
                ${generateFlaskSVG(displayColor, solubility.symbol, 120)}
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
