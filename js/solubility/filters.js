// =========================================
// ФИЛЬТРЫ ТАБЛИЦЫ РАСТВОРИМОСТИ
// =========================================

let originalCategoriesHTML = ''; // Сохраняем оригинальные категории

// =========================================
// ИСПРАВЛЕННЫЕ ФИЛЬТРЫ (V2)
// =========================================

function updateFiltersForSolubility() {
    const categoriesSection = document.getElementById('categories-section');
    if (!categoriesSection) return;

    // Сохраняем оригинал, если еще не сохранен
    if (!originalCategoriesHTML) {
        originalCategoriesHTML = categoriesSection.innerHTML;
    }

    if (isColorMode) {
        const uniqueColors = getUniqueColorsFromTable();
        let buttonsHTML = '';

        uniqueColors.forEach(colorObj => {
            // Кодируем массив в строку, безопасную для HTML
            const safeColors = encodeURIComponent(JSON.stringify(colorObj.originalColors));
            // Внимание: атрибут data-encoded-colors
            buttonsHTML += `<button class="filter-btn" data-color-name="${colorObj.name}" data-encoded-colors="${safeColors}">${colorObj.name}</button>`;
        });

        categoriesSection.innerHTML = `
            <h4>Цвета веществ</h4>
            <div class="filter-buttons">
                ${buttonsHTML}
            </div>
        `;

        // Навешиваем обработчики
        document.querySelectorAll('#categories-section .filter-btn[data-color-name]').forEach(btn => {
            btn.addEventListener('click', () => {
                // ИСПРАВЛЕНИЕ ЗДЕСЬ: используем encodedColors (camelCase), а не encoded-colors
                const originalColors = JSON.parse(decodeURIComponent(btn.dataset.encodedColors));

                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    resetSolubilityTableDisplay();
                    return;
                }

                document.querySelectorAll('#categories-section .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterByColor(originalColors);
            });
        });
    } else {
        // Стандартные фильтры растворимости
        categoriesSection.innerHTML = `
            <h4>Растворимость</h4>
            <div class="filter-buttons">
                <button class="filter-btn" data-solubility="Р">Растворимые (Р)</button>
                <button class="filter-btn" data-solubility="М">Малорастворимые (М)</button>
                <button class="filter-btn" data-solubility="Н">Нерастворимые (Н)</button>
                <button class="filter-btn" data-solubility="-">Не существует (-)</button>
            </div>
        `;

        document.querySelectorAll('#categories-section .filter-btn[data-solubility]').forEach(btn => {
            btn.addEventListener('click', () => {
                const solubility = btn.dataset.solubility;
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    resetSolubilityTableDisplay();
                    return;
                }
                document.querySelectorAll('#categories-section .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterBySolubility(solubility);
            });
        });
    }
}

// Фильтрация по цвету (ИСПРАВЛЕННАЯ ВЕРСИЯ)
function filterByColor(targetColors) {
    const table = document.getElementById('solubility-table');
    if (!table) return;

    // Приводим целевые цвета к нижнему регистру для сравнения
    const targetColorsLower = targetColors.map(c => c.toLowerCase().trim());
    const rows = table.querySelectorAll('tr');

    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Пропускаем шапку таблицы

        // ВАЖНО: Используем .children, чтобы учитывать и <th> (заголовок ряда), и <td>
        // Это сохранит правильную нумерацию индексов (0 - заголовок, 1 - H+, 2 - NH4+ и т.д.)
        const cells = row.children;

        // Начинаем с i = 1, так как i = 0 это заголовок ряда (Анион)
        for (let i = 1; i < cells.length; i++) {
            const cell = cells[i];

            // Индекс катиона в массиве данных
            // i=1 (это H+) соответствует cations[0]
            const cationIndex = i - 1;

            // Индекс аниона
            // rowIndex=1 (первый ряд) соответствует anions[0]
            const anionIndex = rowIndex - 1;

            // 1. Определяем свойства вещества
            const anion = solubilityData.anions[anionIndex];
            const cation = solubilityData.cations[cationIndex];

            // Защита от ошибок индексации
            if (!anion || !cation) continue;

            const solubility = getSolubility(cation.f, anion.f);

            // Ключ для поиска цвета в базе
            const substanceKey = `${normalizeFormula(cation.f)}-${normalizeFormula(anion.f)}`;
            const dbColor = substanceColors[substanceKey];

            // 2. Определяем ЭФФЕКТИВНЫЙ цвет (тот, что видит глаз)
            let effectiveColor = null;

            if (dbColor) {
                effectiveColor = dbColor;
            } else {
                // Логика по умолчанию
                if (solubility === 'R') {
                    effectiveColor = 'colorless'; // Растворимые -> Бесцветные
                } else if (solubility === 'M' || solubility === 'N') {
                    effectiveColor = 'white';     // Осадки -> Белые
                }
                // D/O пропускаем (оставляем null)
            }

            // 3. Проверка совпадения
            let isMatch = false;

            if (effectiveColor) {
                const effLower = effectiveColor.toLowerCase().trim();

                // Проверяем точное совпадение
                if (targetColorsLower.includes(effLower)) {
                    isMatch = true;
                }
                // Доп. проверка для HEX (на всякий случай)
                else if (effLower.startsWith('#')) {
                    // Если в фильтре выбран цвет (например, '#ffffff'), а effectiveColor тоже hex
                    if (targetColorsLower.some(tc => tc === effLower)) {
                        isMatch = true;
                    }
                }
            }

            // 4. Применяем стиль
            if (isMatch) {
                cell.style.opacity = '1';
                cell.style.filter = 'none';
            } else {
                cell.style.opacity = '0.05';
                cell.style.filter = 'grayscale(100%)';
            }
        }
    });
}

function restoreElementFilters() {
    const categoriesSection = document.getElementById('categories-section');
    if (!categoriesSection || !originalCategoriesHTML) return;

    categoriesSection.innerHTML = originalCategoriesHTML;

    // Переинициализируем обработчики фильтров элементов
    document.querySelectorAll('#categories-section .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.dataset.filter;

            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                resetTableDisplay();
                return;
            }

            document.querySelectorAll('#categories-section .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            applyCategoryFilter(filterType);
        });
    });
}

// Фильтрация ячеек таблицы по растворимости

function filterBySolubility(solubility) {
    const table = document.getElementById('solubility-table');
    if (!table) return;

    const rows = table.querySelectorAll('tr');

    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Пропускаем шапку таблицы (катионы)

        // Используем row.children чтобы получить ВСЕ ячейки (включая <th> заголовков)
        const cells = row.children;

        // Начинаем с i = 1, чтобы пропустить заголовок строки (i = 0 это <th> с названием аниона)
        for (let i = 1; i < cells.length; i++) {
            const cell = cells[i];

            if (cell.textContent.trim() === solubility) {
                cell.style.opacity = '1';
                cell.style.filter = 'none';
            } else {
                cell.style.opacity = '0.1';
                cell.style.filter = 'grayscale(100%)';
            }
        }
    });
}

// Сброс фильтрации таблицы растворимости
function resetSolubilityTableDisplay() {
    const table = document.getElementById('solubility-table');
    if (!table) return;

    const cells = table.querySelectorAll('td');
    cells.forEach(cell => {
        cell.style.opacity = '';
        cell.style.filter = '';
    });
}
