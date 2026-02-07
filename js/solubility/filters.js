// =========================================
// ФИЛЬТРЫ ТАБЛИЦЫ РАСТВОРИМОСТИ
// =========================================

var originalCategoriesHTML = ''; 

function updateFiltersForSolubility() {
    console.log('updateFiltersForSolubility called, window.isColorMode:', window.isColorMode);

    const categoriesSection = document.getElementById('categories-section');
    if (!categoriesSection) {
        console.log('categories-section not found');
        return;
    }

    if (!originalCategoriesHTML) {
        originalCategoriesHTML = categoriesSection.innerHTML;
        console.log('Stored originalCategoriesHTML:', originalCategoriesHTML);
    }

    console.log('Current window.isColorMode value:', window.isColorMode);

    if (window.isColorMode) {
        console.log('Entering color mode branch');
        const uniqueColors = getUniqueColorsFromTable();
        console.log('Unique colors found:', uniqueColors);

        let buttonsHTML = '';
        uniqueColors.forEach(colorObj => {
            const safeColors = encodeURIComponent(JSON.stringify(colorObj.originalColors));
            buttonsHTML += `<button class="filter-btn" data-color-name="${colorObj.name}" data-encoded-colors="${safeColors}">${colorObj.name}</button>`;
        });

        categoriesSection.innerHTML = `
            <h4>Цвета веществ</h4>
            <div class="filter-buttons">${buttonsHTML}</div>
        `;
        console.log('Set color mode filters with', uniqueColors.length, 'unique colors');
    } else {
        console.log('Entering solubility mode branch');
        categoriesSection.innerHTML = `
            <h4>Растворимость</h4>
            <div class="filter-buttons">
                <button class="filter-btn" data-solubility="Р">Растворимые (Р)</button>
                <button class="filter-btn" data-solubility="М">Малорастворимые (М)</button>
                <button class="filter-btn" data-solubility="Н">Нерастворимые (Н)</button>
                <button class="filter-btn" data-solubility="-">Не существует (-)</button>
            </div>
        `;
        console.log('Set solubility mode filters');
    }

    // Обработчики событий устанавливаются на уровне документа и не требуют повторной установки
    // после обновления содержимого

    // После обновления содержимого нужно заново установить обработчики для всех кнопок
    setupFilterEventHandlers();
}

function filterByColor(targetColors) {
    const table = document.getElementById('solubility-table');
    if (!table) return;
    const targetColorsLower = targetColors.map(c => c.toLowerCase().trim());
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return;
        const cells = row.children;
        for (let i = 1; i < cells.length; i++) {
            const cell = cells[i];
            const cationIndex = i - 1;
            const anionIndex = rowIndex - 1;
            const anion = solubilityData.anions[anionIndex];
            const cation = solubilityData.cations[cationIndex];
            if (!anion || !cation) continue;

            const solubility = getSolubility(cation.f, anion.f);
            const substanceKey = `${normalizeFormula(cation.f)}-${normalizeFormula(anion.f)}`;
            const dbColor = substanceColors[substanceKey];

            let effectiveColor = null;
            if (dbColor) effectiveColor = dbColor.color || dbColor;
            else if (solubility === 'R') effectiveColor = 'colorless';
            else if (solubility === 'M' || solubility === 'N') effectiveColor = 'white';

            let isMatch = false;
            if (effectiveColor) {
                // Определяем группу цвета для сравнения
                const groupedColor = getGroupedColorName(effectiveColor).toLowerCase().trim();

                if (targetColorsLower.includes(groupedColor)) isMatch = true;
                else {
                    // Проверяем также оригинальный цвет
                    const effLower = effectiveColor.toLowerCase().trim();
                    if (targetColorsLower.includes(effLower)) isMatch = true;
                    else if (effLower.startsWith('#') && targetColorsLower.some(tc => tc === effLower)) isMatch = true;
                }
            }

            if (isMatch) { cell.style.opacity = '1'; cell.style.filter = 'none'; }
            else { cell.style.opacity = '0.05'; cell.style.filter = 'grayscale(100%)'; }
        }
    });
}

function filterBySolubility(solubility) {
    const table = document.getElementById('solubility-table');
    if (!table) return;
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return;
        const cells = row.children;
        for (let i = 1; i < cells.length; i++) {
            const cell = cells[i];
            if (cell.textContent.trim() === solubility) { cell.style.opacity = '1'; cell.style.filter = 'none'; }
            else { cell.style.opacity = '0.1'; cell.style.filter = 'grayscale(100%)'; }
        }
    });
}

function resetSolubilityTableDisplay() {
    const table = document.getElementById('solubility-table');
    if (!table) return;
    const cells = table.querySelectorAll('td');
    cells.forEach(cell => {
        cell.style.opacity = '';
        cell.style.filter = '';
    });
}

// Экспортируем функцию в глобальную область
window.resetSolubilityTableDisplay = resetSolubilityTableDisplay;

function restoreElementFilters() {
    const categoriesSection = document.getElementById('categories-section');
    if (!categoriesSection || !originalCategoriesHTML) return;
    categoriesSection.innerHTML = originalCategoriesHTML;

    // Сбрасываем active-состояние у восстановленных кнопок
    document.querySelectorAll('#categories-section .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
    });

    // Переподключаем обработчики через единую функцию из search-filters.js
    if (typeof window.attachCategoryFilterHandlers === 'function') {
        window.attachCategoryFilterHandlers();
    }
}



// Глобальная переменная для хранения observer
let filterObserver = null;

// Функция для присоединения обработчика к конкретной кнопке
function attachHandlerToButton(button) {
    console.log('Attaching handler to button:', button);
    // Проверяем, не установлен ли уже обработчик
    if (button.dataset.handlerAttached === 'true') {
        console.log('Handler already attached to button:', button);
        return;
    }

    button.addEventListener('click', function() {
        console.log('Filter button clicked:', this);
        console.log('Current window.isColorMode:', window.isColorMode);

        // Handle color filter buttons
        if (this.hasAttribute('data-encoded-colors')) {
            console.log('Color filter clicked:', this.dataset.colorName);
            const originalColors = JSON.parse(decodeURIComponent(this.dataset.encodedColors));
            console.log('Original colors:', originalColors);

            if (this.classList.contains('active')) {
                console.log('Removing active class and resetting display');
                this.classList.remove('active');
                // Remove inline styles when deactivating
                this.style.background = '';
                this.style.borderColor = '';
                this.style.color = '';
                resetSolubilityTableDisplay();
            } else {
                console.log('Setting active class and applying color filter');
                document.querySelectorAll('#categories-section .filter-btn').forEach(b => {
                    b.classList.remove('active');
                    // Reset inline styles for other buttons
                    b.style.background = '';
                    b.style.borderColor = '';
                    b.style.color = '';
                });

                // Apply the color of the filter to the button
                if (originalColors && originalColors.length > 0) {
                    let color = originalColors[0]; // Use the first color

                    // Convert named colors to HEX if needed
                    if (typeof color === 'string' && !color.startsWith('#') && !color.startsWith('rgb')) {
                        // Map common color names to HEX values
                        const colorMap = {
                            'Белый': '#FFFFFF',
                            'Бесцветный': '#F0F8FF', // AliceBlue as a light transparent substitute
                            'Чёрный': '#000000',
                            'Красный': '#FF0000',
                            'Синий': '#0000FF',
                            'Зелёный': '#008000',
                            'Жёлтый': '#FFFF00',
                            'Оранжевый': '#FFA500',
                            'Фиолетовый': '#800080',
                            'Розовый': '#FFC0CB',
                            'Голубой': '#00BFFF',
                            'Серый': '#808080',
                            'Коричневый': '#A52A2A'
                        };

                        if (colorMap[color]) {
                            color = colorMap[color];
                        } else {
                            // If we don't have a mapping, use a default color
                            color = '#2196F3'; // Default blue color
                        }
                    }

                    this.style.background = color;
                    this.style.borderColor = color;

                    // Determine if the color is light or dark to adjust text color
                    if (isColorDarkForFilters(color)) {
                        this.style.color = '#ffffff';
                    } else {
                        this.style.color = '#000000';
                    }
                }

                this.classList.add('active');
                filterByColor(originalColors);
            }
        }
        // Handle solubility filter buttons
        else if (this.hasAttribute('data-solubility')) {
            console.log('Solubility filter clicked:', this.dataset.solubility);
            const solubility = this.dataset.solubility;

            if (this.classList.contains('active')) {
                console.log('Removing active class and resetting solubility display');
                this.classList.remove('active');
                resetSolubilityTableDisplay();
            } else {
                console.log('Setting active class and applying solubility filter:', solubility);
                document.querySelectorAll('#categories-section .filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filterBySolubility(solubility);
            }
        }
    });

    // Помечаем, что обработчик уже установлен
    button.dataset.handlerAttached = 'true';
    console.log('Handler attached to button and marked as attached');
}

// Используем MutationObserver для отслеживания изменений в DOM и установки обработчиков
function setupFilterEventHandlers() {
    console.log('setupFilterEventHandlers called');

    // Останавливаем предыдущий observer, если он существует
    if (filterObserver) {
        filterObserver.disconnect();
        console.log('Disconnected previous observer');
    }

    // Наблюдатель за изменениями в DOM
    filterObserver = new MutationObserver(function(mutations) {
        console.log('MutationObserver triggered with', mutations.length, 'mutations');
        mutations.forEach(function(mutation) {
            // Проверяем, были ли добавлены новые узлы
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // ELEMENT_NODE
                    console.log('Processing added node:', node);
                    // Проверяем, является ли добавленный узел кнопкой фильтра или содержит такие кнопки
                    if (node.classList && node.classList.contains('filter-btn')) {
                        console.log('Found filter-btn element, attaching handler');
                        attachHandlerToButton(node);
                    } else if (node.querySelectorAll) {
                        const filterButtons = node.querySelectorAll('.filter-btn');
                        console.log('Found', filterButtons.length, 'filter buttons in added node');
                        filterButtons.forEach(attachHandlerToButton);
                    }
                }
            });
        });
    });

    // Начинаем наблюдение за изменениями в #categories-section
    const targetNode = document.getElementById('categories-section');
    if (targetNode) {
        console.log('Starting observer on categories-section');
        filterObserver.observe(targetNode, {
            childList: true,
            subtree: true
        });
    } else {
        console.log('Could not find categories-section element');
    }

    // Также устанавливаем обработчики для уже существующих кнопок
    setTimeout(() => {
        const existingButtons = document.querySelectorAll('#categories-section .filter-btn');
        console.log('Setting up handlers for', existingButtons.length, 'existing buttons');
        existingButtons.forEach(attachHandlerToButton);
    }, 100);
}

// Инициализируем обработчики при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFilterEventHandlers);
} else {
    setupFilterEventHandlers();
}

// Функция для определения, является ли цвет темным (локальная версия для фильтров)
function isColorDarkForFilters(color) {
    // Удалить пробелы и преобразовать в нижний регистр
    color = color.replace(/\s/g, '').toLowerCase();

    // Если цвет в формате RGB
    if (color.indexOf('rgb') === 0) {
        // Извлекаем значения RGB
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            const r = parseInt(match[1], 10);
            const g = parseInt(match[2], 10);
            const b = parseInt(match[3], 10);

            // Вычисляем яркость по формуле
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness < 128;
        }
    }
    // Если цвет в формате HEX
    else if (color.charAt(0) === '#') {
        const hex = color.substring(1);

        // Преобразуем 3-значный HEX в 6-значный
        const shorthandRegex = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i;
        const fullHex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        const r = parseInt(fullHex.substr(0, 2), 16);
        const g = parseInt(fullHex.substr(2, 2), 16);
        const b = parseInt(fullHex.substr(4, 2), 16);

        // Вычисляем яркость по формуле
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness < 128;
    }
    // Если это название цвета, преобразуем его в HEX и повторим проверку
    else {
        // Map common color names to HEX values for brightness calculation
        const colorMap = {
            'white': '#FFFFFF',
            'colorless': '#F0F8FF', // AliceBlue as a light transparent substitute
            'black': '#000000',
            'red': '#FF0000',
            'blue': '#0000FF',
            'green': '#008000',
            'yellow': '#FFFF00',
            'orange': '#FFA500',
            'purple': '#800080',
            'pink': '#FFC0CB',
            'cyan': '#00BFFF',
            'gray': '#808080',
            'brown': '#A52A2A',
            'белый': '#FFFFFF',
            'бесцветный': '#F0F8FF',
            'чёрный': '#000000',
            'красный': '#FF0000',
            'синий': '#0000FF',
            'зелёный': '#008000',
            'жёлтый': '#FFFF00',
            'оранжевый': '#FFA500',
            'фиолетовый': '#800080',
            'розовый': '#FFC0CB',
            'голубой': '#00BFFF',
            'серый': '#808080',
            'коричневый': '#A52A2A'
        };

        if (colorMap[color]) {
            const hexColor = colorMap[color];
            return isColorDarkForFilters(hexColor); // Recursive call with HEX value
        }
    }

    // Для других форматов (например, неизвестные названия цветов) будем считать, что цвет не темный
    return false;
}

// Экспорт функций в window (на всякий случай)
window.updateFiltersForSolubility = updateFiltersForSolubility;
window.restoreElementFilters = restoreElementFilters;
