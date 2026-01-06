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

        document.querySelectorAll('#categories-section .filter-btn[data-color-name]').forEach(btn => {
            btn.addEventListener('click', () => {
                const originalColors = JSON.parse(decodeURIComponent(btn.dataset.encodedColors));
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    resetSolubilityTableDisplay();
                } else {
                    document.querySelectorAll('#categories-section .filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    filterByColor(originalColors);
                }
            });
        });
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

        document.querySelectorAll('#categories-section .filter-btn[data-solubility]').forEach(btn => {
            btn.addEventListener('click', () => {
                const solubility = btn.dataset.solubility;
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    resetSolubilityTableDisplay();
                } else {
                    document.querySelectorAll('#categories-section .filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    filterBySolubility(solubility);
                }
            });
        });
    }
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
    document.querySelectorAll('#categories-section .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.dataset.filter;
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                resetTableDisplay();
            } else {
                document.querySelectorAll('#categories-section .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyCategoryFilter(filterType);
            }
        });
    });
}



// Экспорт функций в window (на всякий случай)
window.updateFiltersForSolubility = updateFiltersForSolubility;
window.restoreElementFilters = restoreElementFilters;