// =========================================
// ФУНКЦИИ РАБОТЫ С ЦВЕТАМИ
// =========================================

let isColorMode = false;

// Добавить в глобальную область видимости (например, в начало advanced-modal.js)
function normalizeFormula(formula) {
    return formula
        .replace(/⁺/g, '+')
        .replace(/⁻/g, '-')
        .replace(/⁰/g, '0')
        .replace(/¹/g, '1')
        .replace(/²/g, '2')
        .replace(/³/g, '3')
        .replace(/⁴/g, '4')
        .replace(/₅/g, '5')
        .replace(/₆/g, '6')
        .replace(/₇/g, '7')
        .replace(/₈/g, '8')
        .replace(/₉/g, '9');
}
window.normalizeFormula = normalizeFormula; // Делаем доступной везде

// Определяем, тёмный ли цвет (для выбора цвета текста)
function isColorDark(hexColor) {
    if (!hexColor || hexColor.length < 7) return false;

    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Формула относительной яркости (luminance)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance < 0.5;
}

// Переключение режима цветов
function toggleColorMode() {
    isColorMode = !isColorMode;

    const btn = document.getElementById('color-mode-btn');
    btn.classList.toggle('active', isColorMode);

    // Перерисовываем таблицу
    renderSolubilityTable();

    // Обновляем фильтры в зависимости от режима
    updateFiltersForSolubility();
}

// Функция для конвертации цвета в русское название
function getColorName(color) {
    if (!color) return 'Неизвестный';

    color = color.toLowerCase().trim();

    // Словарь распространённых значений
    const colorNames = {
        'colorless': 'Бесцветный',
        'бесцветный': 'Бесцветный',
        'white': 'Белый',
        'белый': 'Белый',
        'black': 'Чёрный',
        'чёрный': 'Чёрный',
        'красный': 'Красный',
        'синий': 'Синий',
        'зелёный': 'Зелёный',
        'жёлтый': 'Жёлтый',
        'коричневый': 'Коричневый',
        'фиолетовый': 'Фиолетовый',
        'оранжевый': 'Оранжевый',
        'розовый': 'Розовый',
        'голубой': 'Голубой',
        'серый': 'Серый'
    };

    // Проверяем прямое совпадение
    if (colorNames[color]) return colorNames[color];

    // Если это HEX код, конвертируем в название
    if (color.startsWith('#')) {
        // Простое определение по популярным HEX кодам
        const hexMap = {
            '#ffffff': 'Белый',
            '#000000': 'Чёрный',
            '#ff0000': 'Красный',
            '#0000ff': 'Синий',
            '#00ff00': 'Зелёный',
            '#ffff00': 'Жёлтый',
            '#ffa500': 'Оранжевый',
            '#800080': 'Фиолетовый',
            '#ffc0cb': 'Розовый',
            '#808080': 'Серый',
            '#8b4513': 'Коричневый'
        };

        if (hexMap[color]) return hexMap[color];

        // Приблизительное определение цвета
        const rgb = hexToRgb(color);
        if (rgb) {
            return approximateColorByRGB(rgb);
        }
    }

    // Если не смогли определить, возвращаем оригинал с заглавной
    return color.charAt(0).toUpperCase() + color.slice(1);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function approximateColorByRGB(rgb) {
    const { r, g, b } = rgb;

    // Белый/светлые
    if (r > 240 && g > 240 && b > 240) return 'Белый';

    // Чёрный/тёмные
    if (r < 30 && g < 30 && b < 30) return 'Чёрный';

    // Серый
    if (Math.abs(r - g) < 40 && Math.abs(g - b) < 40 && Math.abs(r - b) < 40) {
        return 'Серый';
    }

    // Красный
    if (r > g + 50 && r > b + 50) return 'Красный';

    // Синий
    if (b > r + 50 && b > g + 50) return 'Синий';

    // Зелёный
    if (g > r + 50 && g > b + 50) return 'Зелёный';

    // Жёлтый
    if (r > 200 && g > 200 && b < 100) return 'Жёлтый';

    // Оранжевый
    if (r > 200 && g > 100 && g < 200 && b < 100) return 'Оранжевый';

    // Фиолетовый
    if (r > 100 && b > 100 && g < 100) return 'Фиолетовый';

    // Розовый
    if (r > 200 && b > 150 && g < 200) return 'Розовый';

    // Коричневый
    if (r > 100 && g > 50 && b < 100) return 'Коричневый';

    return 'Разноцветный';
}

// Получить уникальные цвета из текущей таблицы
function getUniqueColorsFromTable() {
    const colorMap = new Map(); // originalColor -> {name, count}

    // Проходим по всем данным напрямую из solubilityData
    solubilityData.anions.forEach((anion, anionIndex) => {
        solubilityData.cations.forEach((cation, cationIndex) => {
            // Пропускаем H⁺ (первый катион)
            if (cationIndex === 0) return;

            const catKey = normalizeFormula(cation.f);
            const anionKey = normalizeFormula(anion.f);
            const colorKey = `${catKey}-${anionKey}`;

            const substanceColor = substanceColors[colorKey];

            if (substanceColor) {
                const colorName = getColorName(substanceColor);

                if (!colorMap.has(colorName)) {
                    colorMap.set(colorName, []);
                }
                colorMap.get(colorName).push(substanceColor);
            }
        });
    });

    // Возвращаем массив объектов {name, originalColors}
    const result = [];
    colorMap.forEach((originalColors, name) => {
        result.push({ name, originalColors });
    });

    // Сортируем по названию
    result.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    return result;
}

// Переключение между металлами и неметаллами
function toggleNonmetalsSeries() {
    const metalsContainer = document.getElementById('metals-series');
    const nonmetalsContainer = document.getElementById('nonmetals-series');
    const title = document.getElementById('activity-title');
    const toggleBtn = document.getElementById('toggle-nonmetals-btn');

    if (!metalsContainer || !nonmetalsContainer || !title || !toggleBtn) return;

    // Переключаем активный контейнер
    if (metalsContainer.classList.contains('active')) {
        // Переход к неметаллам
        metalsContainer.classList.remove('active');
        nonmetalsContainer.classList.add('active');
        title.textContent = 'Ряд активности неметаллов';
        toggleBtn.textContent = 'Переключить на металлы';
    } else {
        // Переход к металлам
        nonmetalsContainer.classList.remove('active');
        metalsContainer.classList.add('active');
        title.textContent = 'Ряд активности металлов (электрохимический)';
        toggleBtn.textContent = 'Переключить на неметаллы';
    }
}
