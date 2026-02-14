// =========================================
// МОДУЛЬ: ЭКСПОРТ ЭЛЕМЕНТА В PDF И LATEX
// =========================================

/**
 * Нормализация формулы (убираем индексы для поиска)
 */
function normalizeFormula(formula) {
    return formula.replace(/[⁺⁻⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]/g, (match) => {
        const map = {
            '⁺': '+', '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
            '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
            '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
            '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
        };
        return map[match] || match;
    });
}

function getElementCompounds(symbol) {
    if (!window.solubilityData) {
        console.error('Данные таблицы растворимости не загружены');
        return [];
    }

    const compounds = [];
    const { cations, anions, defaults, exceptions } = window.solubilityData;

    const getSolubility = (cationFormula, anionFormula) => {
        const cationKey = normalizeFormula(cationFormula);
        const anionKey = normalizeFormula(anionFormula);
        const exceptionKey = `${cationKey}-${anionKey}`;
        return exceptions[exceptionKey] !== undefined ? exceptions[exceptionKey] : (defaults[anionKey] || "R");
    };

    const getCompoundColor = (cationFormula, anionFormula, solubility) => {
        const cationKey = normalizeFormula(cationFormula);
        const anionKey = normalizeFormula(anionFormula);
        const key = cationKey + '-' + anionKey;
        const colorDb = (typeof substanceColors !== 'undefined' ? substanceColors : window.substanceColors);
        if (colorDb && colorDb[key]) {
            const color = colorDb[key];
            if (color === 'colorless') return '\u0411\u0435\u0441\u0446\u0432\u0435\u0442\u043d\u044b\u0439 \u0440\u0430\u0441\u0442\u0432\u043e\u0440';
            if (color === 'white') return '\u0411\u0435\u043b\u044b\u0439';
            return color;
        }
        if (solubility === 'R') {
            if (anionKey === 'MnO4-') return '#8b008b';
            if (anionKey === 'CrO42-') return '#ffff00';
            if (anionKey === 'Cr2O72-') return '#ff8c00';
            return '\u0411\u0435\u0441\u0446\u0432\u0435\u0442\u043d\u044b\u0439 \u0440\u0430\u0441\u0442\u0432\u043e\u0440';
        }
        return '\u2014';
    };

    const getDecompositionReaction = (cationFormula, anionFormula) => {
        const cationKey = normalizeFormula(cationFormula);
        const anionKey = normalizeFormula(anionFormula);
        const key = `${cationKey}-${anionKey}`;
        if (window.decompositionReactions && window.decompositionReactions[key]) {
            return {
                equation: window.decompositionReactions[key].equation || '—',
                description: window.decompositionReactions[key].description || '—'
            };
        }
        return null;
    };

    cations.forEach(cation => {
        if (cation.f.includes(symbol) || cation.n.includes(symbol)) {
            anions.forEach(anion => {
                compounds.push({
                    type: 'cation',
                    cation: cation.f,
                    anion: anion.f,
                    solubility: getSolubility(cation.f, anion.f),
                    color: null,
                    decomposition: getDecompositionReaction(cation.f, anion.f)
                });
            });
        }
    });

    anions.forEach(anion => {
        if (anion.f.includes(symbol) || anion.n.includes(symbol)) {
            cations.forEach(cation => {
                compounds.push({
                    type: 'anion',
                    cation: cation.f,
                    anion: anion.f,
                    solubility: getSolubility(cation.f, anion.f),
                    color: null,
                    decomposition: getDecompositionReaction(cation.f, anion.f)
                });
            });
        }
    });

    compounds.forEach((compound) => {
        compound.color = getCompoundColor(compound.cation, compound.anion, compound.solubility);
    });

    return compounds;
}

/**
 * Рендерит формулу в красивый HTML с помощью KaTeX
 */
function renderFormula(formula) {
    if (!formula) return '—';
    try {
        return katex.renderToString(`\\ce{${formula}}`, {
            throwOnError: false,
            trust: true
        });
    } catch (e) {
        return formula;
    }
}

function safeValue(value, fallback = '—') {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'number' && Number.isNaN(value)) return fallback;
    if (typeof value === 'string' && value.trim().toLowerCase() === 'null') return fallback;
    const str = String(value).trim();
    return str.length === 0 ? fallback : str;
}

function toSuperscript(text) {
    const map = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };
    return String(text).split('').map(ch => map[ch] || ch).join('');
}

function formatElectronConfigForPDF(config) {
    if (!config) return '—';
    let str = String(config);
    str = str.replace(/<sup>(\d+)<\/sup>/gi, (_, digits) => toSuperscript(digits));
    str = str.replace(/<[^>]*>/g, '');
    return safeValue(str, '—');
}

function getCategoryLabel(data) {
    const category = (data && data.category) ? String(data.category) : '';
    if (category) return category;
    return '—';
}

/**
 * Генерирует HTML секцию для аллотропов
 */
function generateAllotropesHTML(data) {
    if (!data.allotropes && !data.extraAllotropes) return '';

    const allAllotropes = [
        ...Object.values(data.allotropes || {}),
        ...Object.values(data.extraAllotropes || {})
    ];

    if (allAllotropes.length === 0) return '';

    return `
        <div class="pdf-section">
            <h2 class="pdf-subtitle" style="color: #D36A8E;">Аллотропные модификации</h2>
            <table class="pdf-table">
                <thead>
                        <tr style="background-color: #D36A8E;">
                        <th>Название</th>
                        <th>Свойства</th>
                        <th>Структура</th>
                    </tr>
                </thead>
                <tbody>
                    ${allAllotropes.map((allo, i) => `
                        <tr class="${i % 2 === 0 ? 'even' : 'odd'}">
                            <td>
                                <strong>${allo.name}</strong><br>
                                <span style="font-size: smaller; color: #666;">${allo.alloDiscoveryYear || ''}</span>
                            </td>
                            <td>
                                ${allo.density ? `<div>ρ: ${allo.density}</div>` : ''}
                                ${allo.meltingPoint ? `<div>Tₘ: ${allo.meltingPoint}</div>` : ''}
                                ${allo.color ? `<div>${allo.color}</div>` : ''}
                            </td>
                            <td>
                                ${allo.structure || '—'}<br>
                                <span style="font-size: smaller; font-style: italic;">${allo.alloFacts || ''}</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Генерирует HTML шаблон для экспорта
 */
function generatePDFTemplate(data, compounds, options = {}) {
    const solubilityText = { 'R': 'Растворим', 'M': 'Малорастворим', 'N': 'Нерастворим', 'D': 'Разлагается', 'O': 'Не существует' };
    const totalCompounds = Number(options.compoundsTotal) || compounds.length;
    const shownCompounds = Number(options.compoundsShown) || compounds.length;
    const isCompoundsTrimmed = totalCompounds > shownCompounds;
    const elementName = safeValue(data.name || data.symbol);
    const elementSymbol = safeValue(data.symbol);
    const elementNumber = safeValue(data.atomicNumber);
    const elementCategory = getCategoryLabel(data);
    const periodValue = safeValue(data.period);
    const groupValue = safeValue(data.group, data && data.category && /актиноид/i.test(data.category) ? 'актиноиды' : '—');
    const electronConfigText = formatElectronConfigForPDF(data.electronConfigFull || data.electronConfig);

    const colorNameToHex = {
    "\u0431\u0435\u043b\u044b\u0439": "#ffffff",
    "\u0431\u0435\u0441\u0446\u0432\u0435\u0442\u043d\u044b\u0439": "#f0f8ff",
    "\u0447\u0451\u0440\u043d\u044b\u0439": "#000000",
    "\u043a\u0440\u0430\u0441\u043d\u044b\u0439": "#ff0000",
    "\u0441\u0438\u043d\u0438\u0439": "#1e88e5",
    "\u0433\u043e\u043b\u0443\u0431\u043e\u0439": "#81d4fa",
    "\u0437\u0435\u043b\u0451\u043d\u044b\u0439": "#43a047",
    "\u0437\u0435\u043b\u0435\u043d\u044b\u0439": "#43a047",
    "\u0436\u0451\u043b\u0442\u044b\u0439": "#fdd835",
    "\u0436\u0435\u043b\u0442\u044b\u0439": "#fdd835",
    "\u043e\u0440\u0430\u043d\u0436\u0435\u0432\u044b\u0439": "#fb8c00",
    "\u0444\u0438\u043e\u043b\u0435\u0442\u043e\u0432\u044b\u0439": "#8e24aa",
    "\u0440\u043e\u0437\u043e\u0432\u044b\u0439": "#ec407a",
    "\u0431\u0443\u0440\u044b\u0439": "#8d6e63",
    "\u043a\u043e\u0440\u0438\u0447\u043d\u0435\u0432\u044b\u0439": "#8d6e63",
    "\u043a\u0440\u0435\u043c\u043e\u0432\u044b\u0439": "#fffdd0",
    "\u0431\u043b\u0435\u0434\u043d\u043e-\u0436\u0451\u043b\u0442\u044b\u0439": "#fff9b0",
    "\u0441\u0438\u043d\u0435-\u0437\u0435\u043b\u0451\u043d\u044b\u0439": "#48d1cc"
};

const hexToColorName = Object.keys(colorNameToHex).reduce((acc, name) => {
    acc[colorNameToHex[name].toLowerCase()] = name;
    return acc;
}, {});

const normalizeColorValue = (value) => {
    if (!value) return null;
    if (typeof value === 'object' && value.color) value = value.color;
    if (typeof value !== 'string') return null;
    const raw = value.trim();
    if (!raw) return null;
    const lower = raw.toLowerCase();
    if (lower === 'colorless' || lower === '\u0431\u0435\u0441\u0446\u0432\u0435\u0442\u043d\u044b\u0439 \u0440\u0430\u0441\u0442\u0432\u043e\u0440' || lower === '\u0431\u0435\u0441\u0446\u0432\u0435\u0442\u043d\u044b\u0439') return '#f0f8ff';
    if (lower === 'white' || lower === '\u0431\u0435\u043b\u044b\u0439') return '#ffffff';
    if (lower.startsWith('#')) return lower;
    if (lower.startsWith('rgb')) return lower;
    return colorNameToHex[lower] || null;
};

const hexToRgb = (hex) => {
    const value = hex.replace('#', '').trim();
    if (value.length === 3) {
        const r = parseInt(value[0] + value[0], 16);
        const g = parseInt(value[1] + value[1], 16);
        const b = parseInt(value[2] + value[2], 16);
        return { r, g, b };
    }
    if (value.length === 6) {
        const r = parseInt(value.slice(0, 2), 16);
        const g = parseInt(value.slice(2, 4), 16);
        const b = parseInt(value.slice(4, 6), 16);
        return { r, g, b };
    }
    return null;
};

const approximateColorNameFromHex = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return '\u0426\u0432\u0435\u0442\u043d\u043e\u0439';
    const { r, g, b } = rgb;
    if (r > 235 && g > 235 && b > 235) return '\u0411\u0435\u043b\u044b\u0439';
    if (r < 40 && g < 40 && b < 40) return '\u0427\u0451\u0440\u043d\u044b\u0439';
    if (r > 200 && g > 200 && b < 120) return '\u0416\u0451\u043b\u0442\u044b\u0439';
    if (r > 200 && g > 120 && b < 80) return '\u041e\u0440\u0430\u043d\u0436\u0435\u0432\u044b\u0439';
    if (r > 160 && g < 90 && b < 90) return '\u041a\u0440\u0430\u0441\u043d\u044b\u0439';
    if (b > 150 && r < 100 && g < 120) return '\u0421\u0438\u043d\u0438\u0439';
    if (g > 150 && r < 120 && b < 120) return '\u0417\u0435\u043b\u0451\u043d\u044b\u0439';
    if (r > 150 && b > 150 && g < 120) return '\u0424\u0438\u043e\u043b\u0435\u0442\u043e\u0432\u044b\u0439';
    return '\u0426\u0432\u0435\u0442\u043d\u043e\u0439';
};

const describeColorValue = (value) => {
    if (!value) return '\u2014';
    if (typeof value === 'string') {
        const raw = value.trim();
        if (!raw) return '\u2014';
        const lower = raw.toLowerCase();
        if (lower === 'colorless') return '\u0411\u0435\u0441\u0446\u0432\u0435\u0442\u043d\u044b\u0439 \u0440\u0430\u0441\u0442\u0432\u043e\u0440';
        if (lower === 'white') return '\u0411\u0435\u043b\u044b\u0439';
        if (lower.startsWith('#')) {
            const mapped = hexToColorName[lower];
            if (mapped) {
                return mapped.charAt(0).toUpperCase() + mapped.slice(1);
            }
            return approximateColorNameFromHex(lower);
        }
        if (lower.startsWith('rgb')) return '\u0426\u0432\u0435\u0442\u043d\u043e\u0439';
    }
    return safeValue(value);
};

const renderColorSwatch = (value) => {
        const hex = normalizeColorValue(value);
        const label = describeColorValue(value);
        if (!hex) return label;
        const border = (hex === '#ffffff' || hex === '#f0f8ff') ? 'border:1px solid #ccc;' : '';
        return `<span style="display:inline-flex;align-items:center;gap:6px;">
            <span style="width:10px;height:10px;border-radius:50%;background:${hex};${border}"></span>
            <span>${label}</span>
        </span>`;
    };

    let compoundsHTML = '';
    if (compounds.length > 0) {
        compoundsHTML = `
            <div class="pdf-section">
                <h2 class="pdf-subtitle" style="color: #7E57C2;">Соединения из таблицы растворимости</h2>
                <table class="pdf-table compounds-table">
                    <colgroup>
                        <col style="width: 32%;">
                        <col style="width: 25%;">
                        <col style="width: 29%;">
                        <col style="width: 14%;">
                    </colgroup>
                    <thead>
                        <tr style="background-color: #7E57C2;">
                            <th>Формула</th>
                            <th>Растворимость</th>
                            <th>Цвет</th>
                            <th>Реакция</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${compounds.map((c, i) => `
                            <tr class="pdf-row ${i % 2 === 0 ? 'even' : 'odd'}">
                                <td>${renderFormula(c.cation)} + ${renderFormula(c.anion)}</td>
                                <td>${solubilityText[c.solubility] || c.solubility}</td>
                                <td>${renderColorSwatch(c.color)}</td>
                                <td>${c.decomposition ? renderFormula(c.decomposition.equation) : '—'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ${isCompoundsTrimmed ? `<p class="pdf-note">Показаны первые ${shownCompounds} соединений из ${totalCompounds} для стабильной генерации PDF.</p>` : ''}
            </div>
        `;
    }

    return `
        <div class="pdf-container">
            <div class="pdf-hero">
                <h1 class="pdf-title">${elementName} (${elementSymbol})</h1>
                <p class="pdf-hero-line">№ ${elementNumber} • ${elementCategory}</p>
            </div>
            <p class="pdf-meta">Сгенерировано: ${new Date().toLocaleDateString('ru-RU')}</p>

            <div class="pdf-section">
                <h2 class="pdf-subtitle" style="color: #4A90E2;">Базовая информация</h2>
                <table class="pdf-table">
                    <thead><tr style="background-color: #4A90E2;"><th>Свойство</th><th>Значение</th></tr></thead>
                    <tbody>
                        <tr><td>Атомный номер</td><td>${elementNumber}</td></tr>
                        <tr><td>Атомная масса</td><td>${safeValue(data.atomicMass)}</td></tr>
                        <tr><td>Период/Группа</td><td>${periodValue} / ${groupValue}</td></tr>
                        <tr><td>Электронная конфигурация</td><td>${electronConfigText}</td></tr>
                        <tr><td>Электроотрицательность</td><td>${safeValue(data.electronegativity)}</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="pdf-section">
                <h2 class="pdf-subtitle" style="color: #4C9A74;">Физические свойства</h2>
                <table class="pdf-table">
                    <thead><tr style="background-color: #4C9A74;"><th>Свойство</th><th>Значение</th></tr></thead>
                    <tbody>
                        <tr><td>Плотность</td><td>${safeValue(data.density)}</td></tr>
                        <tr><td>Температура плавления</td><td>${safeValue(data.meltingPoint)}</td></tr>
                        <tr><td>Температура кипения</td><td>${safeValue(data.boilingPoint)}</td></tr>
                        <tr><td>Состояние (20°C)</td><td>${safeValue(data.state)}</td></tr>
                        <tr><td>Цвет</td><td>${safeValue(data.color)}</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="pdf-section">
                <h2 class="pdf-subtitle" style="color: #C98A3A;">История и факты</h2>
                <div class="pdf-text-block">
                    <p><strong>Открытие:</strong> ${safeValue(data.discoveryYear)} (${safeValue(data.discoverer)})</p>
                    <p><strong>Происхождение названия:</strong> ${safeValue(data.nameOrigin)}</p>
                    ${data.facts ? `<p><strong>Факты:</strong> ${Array.isArray(data.facts) ? data.facts.join(' ') : data.facts}</p>` : ''}
                </div>
            </div>

            ${generateAllotropesHTML(data)}


            ${compoundsHTML}
            
            <style>
                .pdf-container {
                    font-family: "Noto Sans", "DejaVu Sans", "Segoe UI", "Arial Unicode MS", Arial, sans-serif;
                    padding: 20px;
                    color: #333;
                    -webkit-font-smoothing: antialiased;
                    text-rendering: optimizeLegibility;
                }
                .pdf-container, .pdf-container * { box-sizing: border-box; }
                .pdf-hero { margin-bottom: 6px; }
                .pdf-title { text-align: left; color: #2B5C91; border-bottom: 2px solid #2B5C91; padding-bottom: 6px; margin: 0; }
                .pdf-hero-line { margin: 8px 0 0; color: #555; font-size: 12px; }
                .pdf-meta { text-align: center; color: #666; font-size: 10px; margin-bottom: 30px; }
                .pdf-subtitle { font-size: 16px; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                .pdf-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
                .pdf-table th { color: white; padding: 8px; text-align: left; }
                .pdf-table td { padding: 8px; border-bottom: 1px solid #eee; }
                .pdf-table tr.even { background-color: #f9f9f9; }
                .compounds-table { table-layout: fixed; width: 100%; font-size: 11px; }
                .compounds-table th, .compounds-table td {
                    white-space: normal;
                    overflow-wrap: anywhere;
                    word-break: break-word;
                    vertical-align: top;
                }
                .compounds-table thead { display: table-header-group; }
                .compounds-table tbody { display: table-row-group; }
                .compounds-table tr { break-inside: avoid; page-break-inside: avoid; }
                .compounds-table th:nth-child(4), .compounds-table td:nth-child(4) { text-align: center; }
                .pdf-section { break-inside: avoid-page; page-break-inside: avoid; }
                .katex { font-size: 1.1em; }
                .pdf-note { margin-top: 8px; color: #666; font-size: 11px; }
            </style>
        </div>
    `;
}

/**
 * ГЛАВНАЯ ФУНКЦИЯ: Экспорт в PDF (Client-side)
 */
const PDF_MAX_COMPOUNDS = 180;
const PDF_LIB_CANDIDATES = [
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js',
    'https://unpkg.com/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js'
];

function hasHtml2PdfSupport() {
    return typeof window.html2pdf === 'function';
}

function hasCanvasPdfSupport() {
    return typeof window.html2canvas === 'function' && !!(window.jspdf && window.jspdf.jsPDF);
}

function loadScriptWithTimeout(src, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.crossOrigin = 'anonymous';

        let settled = false;
        const finish = (err) => {
            if (settled) return;
            settled = true;
            clearTimeout(timerId);
            if (err) reject(err);
            else resolve();
        };

        const timerId = setTimeout(() => {
            finish(new Error(`Timeout loading ${src}`));
        }, timeoutMs);

        script.onload = () => finish(null);
        script.onerror = () => finish(new Error(`Failed to load ${src}`));
        (document.head || document.documentElement).appendChild(script);
    });
}

async function ensurePdfLibrariesLoaded() {
    if (hasHtml2PdfSupport() || hasCanvasPdfSupport()) {
        return;
    }

    for (const src of PDF_LIB_CANDIDATES) {
        try {
            await loadScriptWithTimeout(src);
        } catch (error) {
            console.warn('[PDF export] library load failed:', src, error);
        }

        if (hasHtml2PdfSupport() || hasCanvasPdfSupport()) {
            return;
        }
    }

    throw new Error('PDF libraries are not loaded (html2pdf/html2canvas/jsPDF)');
}

/**
 * Экспорт элемента в PDF (client-side)
 */
async function exportElementToPDF(elementData) {
    let button = null;
    let container = null;
    try {
        if (window.ChemLoader && window.ChemLoader.show) {
            window.ChemLoader.show();
        }

        button = document.querySelector('.pdf-export-icon-btn');
        if (button) {
            button.classList.add('loading');
        }

        if (!elementData || !elementData.symbol) {
            throw new Error('Element data is missing');
        }

        if (typeof window.loadSolubility === 'function') {
            try {
                await window.loadSolubility();
            } catch (error) {
                console.warn('[PDF export] failed to load solubility data:', error);
            }
        }

        await ensurePdfLibrariesLoaded();

        const allCompounds = getElementCompounds(elementData.symbol);
        const compounds = allCompounds.slice(0, PDF_MAX_COMPOUNDS);
        const htmlContent = generatePDFTemplate(elementData, compounds, {
            compoundsTotal: allCompounds.length,
            compoundsShown: compounds.length
        });

        container = document.createElement('div');
        container.innerHTML = htmlContent;
        container.style.position = 'fixed';
        container.style.left = '0';
        container.style.top = '0';
        container.style.width = '794px';
        container.style.minHeight = '1123px';
        container.style.backgroundColor = '#ffffff';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '-2147483647';
        container.style.boxSizing = 'border-box';
        container.setAttribute('aria-hidden', 'true');
        document.body.appendChild(container);

        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        await new Promise((resolve) => setTimeout(resolve, 60));
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        const safeName = String(elementData.name || 'element')
            .replace(/[\\/:*?"<>|]+/g, '_')
            .trim();
        const fileName = `${elementData.symbol}_${safeName}.pdf`;
        const targetNode = container.firstElementChild || container;
        const renderWidth = 760;

        targetNode.style.width = `${renderWidth}px`;
        targetNode.style.boxSizing = 'border-box';

        let exported = false;

        if (hasHtml2PdfSupport()) {
            try {
                await window.html2pdf().set({
                    margin: [8, 8, 8, 8],
                    filename: fileName,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: {
                        scale: 1.15,
                        useCORS: true,
                        backgroundColor: '#ffffff',
                        scrollX: 0,
                        scrollY: 0,
                        x: 0,
                        y: 0,
                        windowWidth: renderWidth
                    },
                    jsPDF: {
                        unit: 'mm',
                        format: 'a4',
                        orientation: 'portrait',
                        putOnlyUsedFonts: true,
                        compress: true
                    },
                    pagebreak: {
                        mode: ['css', 'legacy'],
                        avoid: ['tr', '.pdf-row', '.pdf-no-break']
                    }
                }).from(targetNode).save();
                exported = true;
            } catch (error) {
                console.warn('[PDF export] html2pdf failed, trying html2canvas/jsPDF fallback:', error);
            }
        }

        if (!exported && hasCanvasPdfSupport()) {
            const canvas = await window.html2canvas(targetNode, {
                scale: 1.15,
                useCORS: true,
                backgroundColor: '#ffffff',
                scrollX: 0,
                scrollY: 0,
                x: 0,
                y: 0,
                windowWidth: renderWidth,
                windowHeight: Math.max(targetNode.scrollHeight || 1123, 1123)
            });

            if (!canvas || !canvas.width || !canvas.height) {
                throw new Error('Canvas render failed');
            }

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                putOnlyUsedFonts: true,
                compress: true
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imageWidth = pageWidth;
            const imageHeight = (canvas.height * imageWidth) / canvas.width;
            const imageData = canvas.toDataURL('image/jpeg', 0.98);

            pdf.addImage(imageData, 'JPEG', 0, 0, imageWidth, imageHeight, undefined, 'FAST');
            let renderedHeight = pageHeight;
            while (renderedHeight < imageHeight) {
                pdf.addPage();
                pdf.addImage(imageData, 'JPEG', 0, -renderedHeight, imageWidth, imageHeight, undefined, 'FAST');
                renderedHeight += pageHeight;
            }

            pdf.save(fileName);
            exported = true;
        }

        if (!exported) {
            throw new Error('PDF libraries are not loaded (html2pdf/html2canvas/jsPDF)');
        }
    } catch (error) {
        console.error('Ошибка при генерации PDF:', error);
        alert('Не удалось создать PDF. Открой консоль и пришли текст ошибки.');
    } finally {
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }

        if (button) {
            button.classList.remove('loading');
        }
        const activeBtn = document.querySelector('.pdf-export-icon-btn');
        if (activeBtn) {
            activeBtn.classList.remove('loading');
        }

        if (window.ChemLoader && window.ChemLoader.hide) {
            window.ChemLoader.hide();
        }
    }
}

// ��������� ������������� ����
window.exportElementToLaTeX = exportElementToPDF;
window.generateElementPDF = exportElementToPDF;
