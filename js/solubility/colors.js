// =========================================
// ФУНКЦИИ РАБОТЫ С ЦВЕТАМИ
// =========================================

// Используем глобальную переменную для состояния режима цвета
console.log('Initial check of window.isColorMode at script load:', typeof window.isColorMode, window.isColorMode);

// Проверяем, есть ли сохраненное значение в localStorage
const savedColorMode = localStorage.getItem('solubilityColorMode');
if (savedColorMode !== null) {
    window.isColorMode = savedColorMode === 'true';
    console.log('Loaded window.isColorMode from localStorage:', window.isColorMode);
} else if (typeof window.isColorMode === 'undefined') {
    window.isColorMode = false;
    console.log('Initialized window.isColorMode to false');
} else {
    console.log('window.isColorMode already exists with value:', window.isColorMode);
}
console.log('Final value of window.isColorMode at script load:', window.isColorMode);

// Убедимся, что переменная доступна глобально
window.isColorMode = window.isColorMode || false;
console.log('Ensured window.isColorMode is set to:', window.isColorMode);

// Добавить в глобальную область видимости (например, в начало advanced-modal.js)
function normalizeFormula(formula) {
    return formula
        .replace(/⁺/g, '+')
        .replace(/⁻/g, '-')
        // Надстрочные цифры (для степеней окисления)
        .replace(/⁰/g, '0')
        .replace(/¹/g, '1')
        .replace(/²/g, '2')
        .replace(/³/g, '3')
        .replace(/⁴/g, '4')
        .replace(/⁵/g, '5')
        .replace(/⁶/g, '6')
        .replace(/⁷/g, '7')
        .replace(/⁸/g, '8')
        .replace(/⁹/g, '9')
        // Подстрочные цифры (для индексов)
        .replace(/₀/g, '0')
        .replace(/₁/g, '1')
        .replace(/₂/g, '2')
        .replace(/₃/g, '3')
        .replace(/₄/g, '4')
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
    console.log('toggleColorMode called, current window.isColorMode:', window.isColorMode);
    window.isColorMode = !window.isColorMode;
    console.log('window.isColorMode after toggle:', window.isColorMode);

    // Сохраняем состояние в localStorage
    localStorage.setItem('solubilityColorMode', window.isColorMode);
    console.log('Saved window.isColorMode to localStorage:', window.isColorMode);

    const btn = document.getElementById('color-mode-btn');
    btn.classList.toggle('active', window.isColorMode);
    console.log('Updated button active state');

    // Перерисовываем таблицу
    renderSolubilityTable();
    console.log('Table re-rendered');

    // Обновляем фильтры в зависимости от режима
    if (typeof updateFiltersForSolubility === 'function') {
        console.log('Calling updateFiltersForSolubility');
        updateFiltersForSolubility();
    } else {
        console.error('updateFiltersForSolubility function not found');
    }
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

// Функция для группировки цветов по общим категориям
function getGroupedColorName(color) {
    if (!color) return 'Неизвестный';

    color = color.toLowerCase().trim();

    // Определяем общую категорию цвета
    if (color === 'colorless' || color === 'бесцветный' ||
        color === 'white' || color === 'белый' ||
        color === '#ffffff') {
        return 'Белый/Бесцветный';
    } else if (color === 'black' || color === 'чёрный' ||
               color === '#000000') {
        return 'Чёрный';
    } else if (color === 'red' || color === 'красный' ||
               color === '#ff0000' ||
               color.includes('красн') || color.includes('алый') ||
               color.includes('борд') || color.includes('малин')) {
        return 'Красный';
    } else if (color === 'blue' || color === 'синий' ||
               color === '#0000ff' ||
               color.includes('син') || color.includes('лазур') ||
               color.includes('голуб') || color.includes('бирюз')) {
        return 'Синий/Голубой';
    } else if (color === 'green' || color === 'зелёный' ||
               color === '#00ff00' ||
               color.includes('зелен') || color.includes('салат')) {
        return 'Зелёный';
    } else if (color === 'yellow' || color === 'жёлтый' ||
               color === '#ffff00' ||
               color.includes('желт') || color.includes('золот') ||
               color === 'orange' || color === 'оранжевый' ||
               color === '#ffa500' || color.includes('оранж')) {
        return 'Жёлтый/Оранжевый';
    } else if (color === 'purple' || color === 'фиолетовый' ||
               color === '#800080' || color.includes('фиолет') ||
               color.includes('пурп') || color.includes('лилов') ||
               color.includes('сирен')) {
        return 'Фиолетовый';
    } else if (color === 'pink' || color === 'розовый' ||
               color === '#ffc0cb' || color.includes('розов') ||
               color.includes('мagenta') || color.includes('фукс')) {
        return 'Розовый/Красноватый';
    } else if (color === 'brown' || color === 'коричневый' ||
               color === '#8b4513' || color.includes('коричн') ||
               color.includes('бур') || color.includes('каштан') ||
               color.includes('шоколад') || color.includes('кофейн')) {
        return 'Коричневый/Бурый';
    } else if (color === 'gray' || color === 'grey' || color === 'серый' ||
               color === '#808080' || color.includes('сер')) {
        return 'Серый';
    } else {
        // Если это HEX код, используем приближенное определение
        if (color.startsWith('#')) {
            const rgb = hexToRgb(color);
            if (rgb) {
                return approximateGroupedColorByRGB(rgb);
            }
        }

        // Попробуем определить по названию
        return approximateGroupedColorByName(color);
    }
}

// Приблизительное определение обобщенной категории по RGB
function approximateGroupedColorByRGB(rgb) {
    const { r, g, b } = rgb;

    // Белый/бесцветный
    if (r > 240 && g > 240 && b > 240) return 'Белый/Бесцветный';

    // Чёрный
    if (r < 30 && g < 30 && b < 30) return 'Чёрный';

    // Серый
    if (Math.abs(r - g) < 40 && Math.abs(g - b) < 40 && Math.abs(r - b) < 40) {
        if (r < 100) return 'Чёрный';
        else if (r > 200) return 'Белый/Бесцветный';
        else return 'Серый';
    }

    // Красный
    if (r > g + 50 && r > b + 50) return 'Красный';

    // Синий
    if (b > r + 50 && b > g + 50) return 'Синий/Голубой';

    // Зелёный
    if (g > r + 50 && g > b + 50) return 'Зелёный';

    // Жёлтый (высокие значения r и g, но низкое b)
    if (r > 200 && g > 200 && b < 100) return 'Жёлтый/Оранжевый';

    // Оранжевый (высокое r, среднее g, низкое b)
    if (r > 200 && g > 100 && g < 200 && b < 100) return 'Жёлтый/Оранжевый';

    // Фиолетовый (высокие r и b, низкое g)
    if (r > 100 && b > 100 && g < 100) return 'Фиолетовый';

    // Розовый (высокие r и b, среднее g)
    if (r > 200 && b > 150 && g < 200) return 'Розовый/Красноватый';

    // Коричневый (высокое r, среднее g, низкое b)
    if (r > 100 && g > 50 && b < 100) return 'Коричневый/Бурый';

    return 'Разноцветный';
}

// Приблизительное определение обобщенной категории по названию
function approximateGroupedColorByName(colorName) {
    // Проверяем наличие ключевых слов в названии цвета
    if (colorName.includes('бел') || colorName.includes('бесцв') ||
        colorName.includes('transparent') || colorName.includes('colorless')) {
        return 'Белый/Бесцветный';
    } else if (colorName.includes('чёрн') || colorName.includes('черн') ||
               colorName.includes('black')) {
        return 'Чёрный';
    } else if (colorName.includes('красн') || colorName.includes('алый') ||
               colorName.includes('борд') || colorName.includes('малин') ||
               colorName.includes('red')) {
        return 'Красный';
    } else if (colorName.includes('син') || colorName.includes('лазур') ||
               colorName.includes('голуб') || colorName.includes('бирюз') ||
               colorName.includes('blue')) {
        return 'Синий/Голубой';
    } else if (colorName.includes('зелен') || colorName.includes('салат') ||
               colorName.includes('green')) {
        return 'Зелёный';
    } else if (colorName.includes('желт') || colorName.includes('золот') ||
               colorName.includes('yellow') || colorName.includes('оранж') ||
               colorName.includes('orange')) {
        return 'Жёлтый/Оранжевый';
    } else if (colorName.includes('фиолет') || colorName.includes('пурп') ||
               colorName.includes('лилов') || colorName.includes('сирен') ||
               colorName.includes('purple') || colorName.includes('violet')) {
        return 'Фиолетовый';
    } else if (colorName.includes('розов') || colorName.includes('magenta') ||
               colorName.includes('фукс') || colorName.includes('pink')) {
        return 'Розовый/Красноватый';
    } else if (colorName.includes('коричн') || colorName.includes('бур') ||
               colorName.includes('каштан') || colorName.includes('шоколад') ||
               colorName.includes('кофейн') || colorName.includes('brown')) {
        return 'Коричневый/Бурый';
    } else if (colorName.includes('сер') || colorName.includes('gray') ||
               colorName.includes('grey')) {
        return 'Серый';
    } else {
        return 'Разноцветный';
    }
}

// Улучшенная функция для определения приблизительного цвета по RGB
function approximateColorByRGB(rgb) {
    const { r, g, b } = rgb;

    // Определяем доминирующий цветовой канал
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const delta = maxVal - minVal;

    // Если дельта мала, цвет ближе к оттенкам серого
    if (delta < 30) {
        if (maxVal < 50) return 'Чёрный';
        else if (maxVal < 100) return 'Тёмно-серый';
        else if (maxVal < 180) return 'Серый';
        else return 'Светло-серый';
    }

    // Определяем основной цвет
    if (maxVal === r && r > g && r > b) {
        // Красный доминирует
        if (delta > 100) {
            if (g > b) return 'Коричневый';
            else return 'Красный';
        } else {
            return 'Красный';
        }
    } else if (maxVal === g && g > r && g > b) {
        // Зелёный доминирует
        if (delta > 100) return 'Зелёный';
        else return 'Салатовый';
    } else if (maxVal === b && b > r && b > g) {
        // Синий доминирует
        if (delta > 100) return 'Синий';
        else return 'Голубой';
    }

    // Комбинации
    if (r > 200 && g > 200 && b < 100) return 'Жёлтый';
    if (r > 200 && g > 100 && b < 100) return 'Оранжевый';
    if (r > 150 && b > 150 && g < 100) return 'Фиолетовый';
    if (r > 200 && b > 150 && g < 200) return 'Розовый';

    // Если ничего не подошло, возвращаем общий цвет на основе яркости
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness > 180) return 'Светлый';
    else if (brightness > 100) return 'Нейтральный';
    else return 'Тёмный';
}


function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


// Получить уникальные цвета из текущей таблицы
function getUniqueColorsFromTable() {
    console.log('getUniqueColorsFromTable called');
    const colorMap = new Map(); // groupedColorName -> {name, originalColors[]}

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
                console.log('Found substance color for key:', colorKey, 'color:', substanceColor);

                // Нормализуем цвет с помощью getGroupedColorName для группировки
                const colorName = getGroupedColorName(substanceColor);
                console.log('Grouped color name for', substanceColor, 'is', colorName);

                // Получаем или создаем массив оригинальных цветов для нормализованного имени
                if (!colorMap.has(colorName)) {
                    colorMap.set(colorName, []);
                }

                // Добавляем оригинальный цвет в массив, если его там ещё нет
                const originalColorsArray = colorMap.get(colorName);
                if (!originalColorsArray.includes(substanceColor)) {
                    originalColorsArray.push(substanceColor);
                }
            }
        });
    });

    console.log('Before deduplication, colorMap has', colorMap.size, 'entries');

    // Возвращаем массив объектов {name, originalColors}
    const result = [];
    colorMap.forEach((originalColors, name) => {
        result.push({ name, originalColors });
    });

    // Сортируем по названию
    result.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    console.log('getUniqueColorsFromTable returning:', result);
    console.log('Total unique color names:', result.length);

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
        title.textContent = 'Ряд активности металлов';
        toggleBtn.textContent = 'Переключить на неметаллы';
    }
}
