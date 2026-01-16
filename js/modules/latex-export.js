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

    const getCompoundColor = (cationFormula, anionFormula) => {
        const cationKey = normalizeFormula(cationFormula);
        const anionKey = normalizeFormula(anionFormula);
        const key = `${cationKey}-${anionKey}`;
        if (window.substanceColors && window.substanceColors[key]) {
            const color = window.substanceColors[key];
            if (color === 'colorless') return 'Бесцветный раствор';
            if (color === 'white') return 'Белый';
            return color;
        }
        return '—';
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
                    color: getCompoundColor(cation.f, anion.f),
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
                    color: getCompoundColor(cation.f, anion.f),
                    decomposition: getDecompositionReaction(cation.f, anion.f)
                });
            });
        }
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
            <h2 class="pdf-subtitle" style="color: #E91E63;">Аллотропные модификации</h2>
            <table class="pdf-table">
                <thead>
                    <tr style="background-color: #E91E63;">
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
function generatePDFTemplate(data, compounds) {
    const solubilityText = { 'R': 'Растворим', 'M': 'Малорастворим', 'N': 'Нерастворим', 'D': 'Разлагается', 'O': 'Не существует' };

    let compoundsHTML = '';
    if (compounds.length > 0) {
        compoundsHTML = `
            <div class="pdf-section">
                <h2 class="pdf-subtitle" style="color: #9c27b0;">Соединения из таблицы растворимости</h2>
                <table class="pdf-table compounds-table">
                    <thead>
                        <tr style="background-color: #9c27b0;">
                            <th>Формула</th>
                            <th>Растворимость</th>
                            <th>Цвет</th>
                            <th>Реакция</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${compounds.map((c, i) => `
                            <tr class="${i % 2 === 0 ? 'even' : 'odd'}">
                                <td>${renderFormula(c.cation)} + ${renderFormula(c.anion)}</td>
                                <td>${solubilityText[c.solubility] || c.solubility}</td>
                                <td>${c.color.startsWith('#') ? `<span style="color:${c.color}">●</span> Цветной` : c.color}</td>
                                <td>${c.decomposition ? renderFormula(c.decomposition.equation) : '—'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    return `
        <div class="pdf-container">
            <h1 class="pdf-title">${data.name || data.symbol} (${data.symbol})</h1>
            <p class="pdf-meta">Сгенерировано: ${new Date().toLocaleDateString('ru-RU')}</p>

            <div class="pdf-section">
                <h2 class="pdf-subtitle" style="color: #2196F3;">Базовая информация</h2>
                <table class="pdf-table">
                    <thead><tr style="background-color: #2196F3;"><th>Свойство</th><th>Значение</th></tr></thead>
                    <tbody>
                        <tr><td>Атомный номер</td><td>${data.atomicNumber}</td></tr>
                        <tr><td>Атомная масса</td><td>${data.atomicMass}</td></tr>
                        <tr><td>Период/Группа</td><td>${data.period} / ${data.group}</td></tr>
                        <tr><td>Электронная конфигурация</td><td>${renderFormula(data.electronConfig)}</td></tr>
                        <tr><td>Электроотрицательность</td><td>${data.electronegativity}</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="pdf-section">
                <h2 class="pdf-subtitle" style="color: #4CAF50;">Физические свойства</h2>
                <table class="pdf-table">
                    <thead><tr style="background-color: #4CAF50;"><th>Свойство</th><th>Значение</th></tr></thead>
                    <tbody>
                        <tr><td>Плотность</td><td>${data.density || '—'}</td></tr>
                        <tr><td>Температура плавления</td><td>${data.meltingPoint || '—'}</td></tr>
                        <tr><td>Температура кипения</td><td>${data.boilingPoint || '—'}</td></tr>
                        <tr><td>Состояние (20°C)</td><td>${data.state || '—'}</td></tr>
                        <tr><td>Цвет</td><td>${data.color || '—'}</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="pdf-section">
                <h2 class="pdf-subtitle" style="color: #FF9800;">История и факты</h2>
                <div class="pdf-text-block">
                    <p><strong>Открытие:</strong> ${data.discoveryYear || '—'} (${data.discoverer || '—'})</p>
                    <p><strong>Происхождение названия:</strong> ${data.nameOrigin || '—'}</p>
                    ${data.facts ? `<p><strong>Факты:</strong> ${Array.isArray(data.facts) ? data.facts.join(' ') : data.facts}</p>` : ''}
                </div>
            </div>

            ${generateAllotropesHTML(data)}


            ${compoundsHTML}
            
            <style>
                .pdf-container { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
                .pdf-title { text-align: center; color: #2196F3; border-bottom: 2px solid #2196F3; padding-bottom: 10px; }
                .pdf-meta { text-align: center; color: #666; font-size: 10px; margin-bottom: 30px; }
                .pdf-subtitle { font-size: 16px; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                .pdf-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
                .pdf-table th { color: white; padding: 8px; text-align: left; }
                .pdf-table td { padding: 8px; border-bottom: 1px solid #eee; }
                .pdf-table tr.even { background-color: #f9f9f9; }
                .katex { font-size: 1.1em; }
            </style>
        </div>
    `;
}

/**
 * ГЛАВНАЯ ФУНКЦИЯ: Экспорт в PDF (Client-side)
 */
async function exportElementToPDF(elementData) {
    try {
        // Показываем глобальный лоадер
        if (window.ChemLoader && window.ChemLoader.show) {
            window.ChemLoader.show();
        }

        const button = document.querySelector('.pdf-export-icon-btn');
        if (button) {
            button.classList.add('loading');
        }

        const compounds = getElementCompounds(elementData.symbol);
        const htmlContent = generatePDFTemplate(elementData, compounds);

        // Создаем временный контейнер
        const container = document.createElement('div');
        container.innerHTML = htmlContent;
        document.body.appendChild(container);

        // Опции для html2pdf
        const opt = {
            margin: 10,
            filename: `${elementData.symbol}_${elementData.name}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Генерация
        await html2pdf().set(opt).from(container).save();

        // Очистка
        document.body.removeChild(container);

        // Восстановление кнопки
        // Восстановление кнопки
        if (button) {
            button.classList.remove('loading');
        }

        if (document.querySelector('.pdf-export-icon-btn')) {
            document.querySelector('.pdf-export-icon-btn').classList.remove('loading');
        }
    } finally {
        // Скрываем глобальный лоадер
        if (window.ChemLoader && window.ChemLoader.hide) {
            window.ChemLoader.hide();
        }
    }
}

// Сохраняем совместимость имен
window.exportElementToLaTeX = exportElementToPDF; // Теперь это PDF экспорт
window.generateElementPDF = exportElementToPDF;
