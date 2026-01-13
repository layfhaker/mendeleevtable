// =========================================
// ФИЛЬТРЫ ТАБЛИЦЫ РАСТВОРИМОСТИ
// =========================================

var originalCategoriesHTML = ''; 

function updateFiltersForSolubility() {
    const categoriesSection = document.getElementById('categories-section');
    if (!categoriesSection) return;

    if (!originalCategoriesHTML) {
        originalCategoriesHTML = categoriesSection.innerHTML;
    }

    if (window.isColorMode) {
        const uniqueColors = getUniqueColorsFromTable();
        let buttonsHTML = '';
        uniqueColors.forEach(colorObj => {
            const safeColors = encodeURIComponent(JSON.stringify(colorObj.originalColors));
            buttonsHTML += `<button class="filter-btn" data-color-name="${colorObj.name}" data-encoded-colors="${safeColors}">${colorObj.name}</button>`;
        });

        categoriesSection.innerHTML = `
            <h4>Цвета веществ</h4>
            <div class="filter-buttons">${buttonsHTML}</div>
        `;
    } else {
        categoriesSection.innerHTML = `
            <h4>Растворимость</h4>
            <div class="filter-buttons">
                <button class="filter-btn" data-solubility="Р">Растворимые (Р)</button>
                <button class="filter-btn" data-solubility="М">Малорастворимые (М)</button>
                <button class="filter-btn" data-solubility="Н">Нерастворимые (Н)</button>
                <button class="filter-btn" data-solubility="-">Не существует (-)</button>
            </div>
        `;
    }

    // Обработчики событий устанавливаются на уровне документа и не требуют повторной установки
    // после обновления содержимого
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
                const effLower = effectiveColor.toLowerCase().trim();
                if (targetColorsLower.includes(effLower)) isMatch = true;
                else if (effLower.startsWith('#') && targetColorsLower.some(tc => tc === effLower)) isMatch = true;
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

function restoreElementFilters() {
    const categoriesSection = document.getElementById('categories-section');
    if (!categoriesSection || !originalCategoriesHTML) return;
    categoriesSection.innerHTML = originalCategoriesHTML;

    // Reattach event handlers to the restored buttons
    document.querySelectorAll('#categories-section .filter-btn').forEach(btn => {
        // Check if handler is already attached
        if (!btn.dataset.handlerAttached) {
            btn.addEventListener('click', function() {
                const filterType = this.dataset.filter;

                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    resetTableDisplay();
                    // Also reset solubility table display if needed
                    if (typeof resetSolubilityTableDisplay === 'function') {
                        resetSolubilityTableDisplay();
                    }
                } else {
                    document.querySelectorAll('#categories-section .filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    applyCategoryFilter(filterType);
                }
            });

            // Mark that handler is attached
            btn.dataset.handlerAttached = 'true';
        }
    });
}



// Используем MutationObserver для отслеживания изменений в DOM и установки обработчиков
function setupFilterEventHandlers() {
    // Функция для присоединения обработчика к конкретной кнопке
    function attachHandlerToButton(button) {
        // Проверяем, не установлен ли уже обработчик
        if (button.dataset.handlerAttached === 'true') {
            return;
        }

        button.addEventListener('click', function() {
            console.log('Filter button clicked:', this);

            // Handle color filter buttons
            if (this.hasAttribute('data-encoded-colors')) {
                console.log('Color filter clicked:', this.dataset.colorName);
                const originalColors = JSON.parse(decodeURIComponent(this.dataset.encodedColors));

                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    resetSolubilityTableDisplay();
                } else {
                    document.querySelectorAll('#categories-section .filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    filterByColor(originalColors);
                }
            }
            // Handle solubility filter buttons
            else if (this.hasAttribute('data-solubility')) {
                console.log('Solubility filter clicked:', this.dataset.solubility);
                const solubility = this.dataset.solubility;

                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    resetSolubilityTableDisplay();
                } else {
                    document.querySelectorAll('#categories-section .filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    filterBySolubility(solubility);
                }
            }
        });

        // Помечаем, что обработчик уже установлен
        button.dataset.handlerAttached = 'true';
    }

    // Наблюдатель за изменениями в DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Проверяем, были ли добавлены новые узлы
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // ELEMENT_NODE
                    // Проверяем, является ли добавленный узел кнопкой фильтра или содержит такие кнопки
                    if (node.classList && node.classList.contains('filter-btn')) {
                        attachHandlerToButton(node);
                    } else if (node.querySelectorAll) {
                        const filterButtons = node.querySelectorAll('.filter-btn');
                        filterButtons.forEach(attachHandlerToButton);
                    }
                }
            });
        });
    });

    // Начинаем наблюдение за изменениями в #categories-section
    const targetNode = document.getElementById('categories-section');
    if (targetNode) {
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }

    // Также устанавливаем обработчики для уже существующих кнопок
    setTimeout(() => {
        const existingButtons = document.querySelectorAll('#categories-section .filter-btn');
        existingButtons.forEach(attachHandlerToButton);
    }, 100);
}

// Инициализируем обработчики при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFilterEventHandlers);
} else {
    setupFilterEventHandlers();
}

// Экспорт функций в window (на всякий случай)
window.updateFiltersForSolubility = updateFiltersForSolubility;
window.restoreElementFilters = restoreElementFilters;