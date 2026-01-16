// =========================================
// МОДУЛЬ: ЭКСПОРТ ЭЛЕМЕНТА В PDF
// =========================================

/**
 * Получает все соединения элемента из таблицы растворимости
 * @param {string} symbol - Символ химического элемента
 * @returns {Array} Массив объектов с данными о соединениях
 */
function getElementCompounds(symbol) {
    if (!window.solubilityData) {
        console.error('Данные таблицы растворимости не загружены');
        return [];
    }

    const compounds = [];
    const { cations, anions, defaults, exceptions } = window.solubilityData;

    // Нормализация формулы (убираем индексы для поиска)
    const normalizeFormula = (formula) => {
        return formula.replace(/[⁺⁻⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]/g, (match) => {
            const map = {
                '⁺': '+', '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
                '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
                '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
                '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
            };
            return map[match] || match;
        });
    };

    // Функция получения растворимости
    const getSolubility = (cationFormula, anionFormula) => {
        const cationKey = normalizeFormula(cationFormula);
        const anionKey = normalizeFormula(anionFormula);
        const exceptionKey = `${cationKey}-${anionKey}`;

        if (exceptions[exceptionKey] !== undefined) {
            return exceptions[exceptionKey];
        }
        return defaults[anionKey] || "R";
    };

    // Функция получения цвета соединения
    const getCompoundColor = (cationFormula, anionFormula) => {
        const cationKey = normalizeFormula(cationFormula);
        const anionKey = normalizeFormula(anionFormula);
        const key = `${cationKey}-${anionKey}`;

        if (window.substanceColors && window.substanceColors[key]) {
            const color = window.substanceColors[key];
            if (color === 'colorless') return 'Бесцветный раствор';
            if (color === 'white') return 'Белый';
            return color; // Возвращаем hex цвет
        }
        return '—';
    };

    // Функция получения реакции разложения
    const getDecompositionReaction = (cationFormula, anionFormula) => {
        const cationKey = normalizeFormula(cationFormula);
        const anionKey = normalizeFormula(anionFormula);
        const key = `${cationKey}-${anionKey}`;

        if (window.decompositionReactions && window.decompositionReactions[key]) {
            const reaction = window.decompositionReactions[key];
            return {
                equation: reaction.equation || '—',
                description: reaction.description || '—'
            };
        }
        return null;
    };

    // Проверяем, образует ли элемент катион
    cations.forEach(cation => {
        if (cation.f.includes(symbol) || cation.n.includes(symbol)) {
            anions.forEach(anion => {
                const solubility = getSolubility(cation.f, anion.f);
                const color = getCompoundColor(cation.f, anion.f);
                const decomposition = getDecompositionReaction(cation.f, anion.f);

                compounds.push({
                    type: 'cation',
                    cation: cation.f,
                    cationName: cation.n,
                    anion: anion.f,
                    anionName: anion.n,
                    solubility: solubility,
                    color: color,
                    decomposition: decomposition
                });
            });
        }
    });

    // Проверяем, образует ли элемент анион
    anions.forEach(anion => {
        if (anion.f.includes(symbol) || anion.n.includes(symbol)) {
            cations.forEach(cation => {
                const solubility = getSolubility(cation.f, anion.f);
                const color = getCompoundColor(cation.f, anion.f);
                const decomposition = getDecompositionReaction(cation.f, anion.f);

                compounds.push({
                    type: 'anion',
                    cation: cation.f,
                    cationName: cation.n,
                    anion: anion.f,
                    anionName: anion.n,
                    solubility: solubility,
                    color: color,
                    decomposition: decomposition
                });
            });
        }
    });

    return compounds;
}

/**
 * Расшифровка обозначений растворимости
 */
function getSolubilityText(code) {
    const map = {
        'R': 'Растворим',
        'M': 'Малорастворим',
        'N': 'Нерастворим',
        'D': 'Разлагается',
        'O': 'Не существует'
    };
    return map[code] || code;
}

/**
 * Генерирует PDF файл с информацией об элементе
 * @param {Object} elementData - Данные элемента
 */
async function generateElementPDF(elementData) {
    try {
        // Проверяем наличие jsPDF
        if (typeof window.jspdf === 'undefined') {
            alert('Библиотека jsPDF не загружена. Пожалуйста, обновите страницу.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Настройка шрифта для поддержки кириллицы
        doc.setFont('helvetica');

        let yPosition = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;

        // Заголовок
        doc.setFontSize(20);
        doc.setTextColor(33, 150, 243);
        const title = `${elementData.name || elementData.symbol} (${elementData.symbol})`;
        doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 10;

        // Дата генерации
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        const date = new Date().toLocaleDateString('ru-RU');
        doc.text(`Сгенерировано: ${date}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;

        // Базовая информация
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Базовая информация', margin, yPosition);
        yPosition += 7;

        doc.autoTable({
            startY: yPosition,
            head: [['Свойство', 'Значение']],
            body: [
                ['Атомный номер', elementData.atomicNumber || '—'],
                ['Атомная масса', elementData.atomicMass || '—'],
                ['Период', elementData.period || '—'],
                ['Группа', elementData.group || '—'],
                ['Блок', elementData.block || '—'],
                ['Категория', elementData.category || '—'],
                ['Электронная конфигурация', elementData.electronConfig || '—'],
                ['Электроотрицательность', elementData.electronegativity || '—']
            ],
            margin: { left: margin, right: margin },
            styles: { font: 'helvetica', fontSize: 10 },
            headStyles: { fillColor: [33, 150, 243] }
        });

        yPosition = doc.lastAutoTable.finalY + 10;

        // Физические свойства
        doc.setFontSize(14);
        doc.text('Физические свойства', margin, yPosition);
        yPosition += 7;

        doc.autoTable({
            startY: yPosition,
            head: [['Свойство', 'Значение']],
            body: [
                ['Плотность', elementData.density || '—'],
                ['Температура плавления', elementData.meltingPoint || '—'],
                ['Температура кипения', elementData.boilingPoint || '—'],
                ['Состояние (20°C)', elementData.state || '—'],
                ['Цвет', elementData.color || '—']
            ],
            margin: { left: margin, right: margin },
            styles: { font: 'helvetica', fontSize: 10 },
            headStyles: { fillColor: [76, 175, 80] }
        });

        yPosition = doc.lastAutoTable.finalY + 10;

        // История
        doc.setFontSize(14);
        doc.text('История и применение', margin, yPosition);
        yPosition += 7;

        doc.autoTable({
            startY: yPosition,
            head: [['Свойство', 'Значение']],
            body: [
                ['Год открытия', elementData.discoveryYear || '—'],
                ['Первооткрыватель', elementData.discoverer || '—'],
                ['Происхождение названия', elementData.nameOrigin || '—'],
                ['Применение', Array.isArray(elementData.applications)
                    ? elementData.applications.join(', ')
                    : (elementData.applications || '—')]
            ],
            margin: { left: margin, right: margin },
            styles: { font: 'helvetica', fontSize: 10 },
            headStyles: { fillColor: [255, 152, 0] }
        });

        yPosition = doc.lastAutoTable.finalY + 10;

        // Интересные факты
        if (elementData.facts) {
            doc.setFontSize(14);
            doc.text('Интересные факты', margin, yPosition);
            yPosition += 7;

            const factsText = Array.isArray(elementData.facts)
                ? elementData.facts.join(' ')
                : elementData.facts;

            const splitFacts = doc.splitTextToSize(factsText, pageWidth - 2 * margin);
            doc.setFontSize(10);
            doc.text(splitFacts, margin, yPosition);
            yPosition += splitFacts.length * 5 + 10;
        }

        // Соединения из таблицы растворимости
        const compounds = getElementCompounds(elementData.symbol);

        if (compounds.length > 0) {
            // Новая страница для соединений
            doc.addPage();
            yPosition = 20;

            doc.setFontSize(16);
            doc.setTextColor(33, 150, 243);
            doc.text(`Соединения ${elementData.symbol} из таблицы растворимости`, margin, yPosition);
            yPosition += 10;

            // Подготовка данных для таблицы
            const compoundRows = compounds.map(comp => {
                // Формула соединения (упрощенная)
                let formula = '—';
                if (comp.type === 'cation') {
                    formula = `${comp.cation} + ${comp.anion}`;
                } else {
                    formula = `${comp.cation} + ${comp.anion}`;
                }

                // Цвет
                let colorText = comp.color;
                if (colorText && colorText.startsWith('#')) {
                    colorText = 'Цветной';
                }

                // Реакция разложения
                let reaction = '—';
                if (comp.decomposition) {
                    reaction = comp.decomposition.equation;
                }

                return [
                    formula,
                    getSolubilityText(comp.solubility),
                    colorText,
                    reaction
                ];
            });

            doc.autoTable({
                startY: yPosition,
                head: [['Компоненты', 'Растворимость', 'Цвет', 'Реакция']],
                body: compoundRows,
                margin: { left: margin, right: margin },
                styles: {
                    font: 'helvetica',
                    fontSize: 8,
                    cellPadding: 2
                },
                headStyles: {
                    fillColor: [156, 39, 176],
                    fontSize: 9
                },
                columnStyles: {
                    0: { cellWidth: 40 },
                    1: { cellWidth: 35 },
                    2: { cellWidth: 35 },
                    3: { cellWidth: 'auto' }
                }
            });
        }

        // Сохранение PDF
        const fileName = `${elementData.symbol}_${elementData.name || 'element'}.pdf`;
        doc.save(fileName);

    } catch (error) {
        console.error('Ошибка при генерации PDF:', error);
        alert('Произошла ошибка при создании PDF. Проверьте консоль для деталей.');
    }
}

// Делаем функцию глобально доступной
window.generateElementPDF = generateElementPDF;
