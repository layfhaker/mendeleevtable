// =========================================
// ЛОГИКА ПОИСКА В ТАБЛИЦЕ РАСТВОРИМОСТИ (мобильная)
// =========================================
function toggleSolubilitySearch() {
    const panel = document.getElementById('solubility-search-panel');
    const btn = document.getElementById('solubility-search-btn');

    if (panel) {
        panel.classList.toggle('active');
        if (btn) btn.classList.toggle('active');

        // Фокус на поле ввода при открытии
        if (panel.classList.contains('active')) {
            const input = document.getElementById('solubility-search-input');
            if (input) {
                setTimeout(() => input.focus(), 100);
            }
        }
    }
}

function clearSolubilitySearch() {
    const input = document.getElementById('solubility-search-input');
    const clearBtn = document.querySelector('.solubility-search-clear');

    if (input) input.value = '';
    if (clearBtn) clearBtn.classList.remove('visible');

    // Сбрасываем выделение в таблице
    clearTableSelection();
}

function performSolubilitySearch() {
    const input = document.getElementById('solubility-search-input');
    if (!input) return;

    const query = input.value.trim();
    if (query.length < 2) {
        return;
    }

    // Используем уже существующую функцию поиска
    const found = searchInSolubilityTable(query);

    if (found) {
        // Закрываем панель поиска после успешного поиска
        toggleSolubilitySearch();
    }
}

// Инициализация обработчиков для поиска в таблице растворимости
(function initSolubilitySearch() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupSolubilitySearch);
    } else {
        setupSolubilitySearch();
    }

    function setupSolubilitySearch() {
        const searchInput = document.getElementById('solubility-search-input');
        const clearBtn = document.querySelector('.solubility-search-clear');

        if (!searchInput) return;

        // Показываем/скрываем кнопку очистки при вводе
        searchInput.addEventListener('input', (e) => {
            if (clearBtn) {
                if (e.target.value.length > 0) {
                    clearBtn.classList.add('visible');
                } else {
                    clearBtn.classList.remove('visible');
                }
            }
        });

        // Enter для поиска
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                performSolubilitySearch();
            }
        });
    }
})();

// =========================================
// ПАРСИНГ И ПОИСК ХИМИЧЕСКИХ ФОРМУЛ
// =========================================

function parseChemicalFormula(query) {
    query = query.toLowerCase().trim();

    // Словарь катионов (формула без заряда → индекс в массиве)
    const cationMap = {
        'h': 0, 'nh4': 1, 'li': 2, 'k': 3, 'na': 4, 'rb': 5, 'cs': 6,
        'ag': 7, 'mg': 8, 'ca': 9, 'sr': 10, 'ba': 11, 'zn': 12,
        'hg': 13, 'pb': 14, 'cu': 15, 'fe': 16, 'al': 18, 'cr': 19,
        'mn': 20, 'ni': 21, 'co': 22, 'sn': 23
    };

    // Словарь анионов (формула без заряда → индекс в массиве)
    // Важно: многоатомные анионы с цифрами должны быть включены
    const anionMap = {
        'oh': 0, 'f': 1, 'cl': 2, 'br': 3, 'i': 4, 's': 5, 'hs': 6,
        'so3': 7, 'so4': 8, 'no3': 9, 'po4': 10, 'co3': 11, 'sio3': 12,
        'cro4': 13, 'ch3coo': 14, 'mno4': 15,
        // Альтернативные написания
        'acetate': 14, 'ac': 14
    };

    let foundCatIndex = -1;
    let foundAnIndex = -1;

    // Паттерны для распознавания формул
    // Пробуем найти известные катионы в начале формулы
    const cationKeys = Object.keys(cationMap).sort((a, b) => b.length - a.length); // Сначала длинные
    const anionKeys = Object.keys(anionMap).sort((a, b) => b.length - a.length);

    // Нормализуем запрос: убираем только скобки и символы зарядов, НО оставляем цифры
    const normalizedWithNumbers = query.replace(/[₂₃₄₅²³⁺⁻\(\)\[\]]/g, '');
    // Версия без цифр - для поиска катионов
    const normalizedNoCatNumbers = query.replace(/[₂₃₄₅²³⁺⁻\(\)\[\]]/g, '');

    // Ищем катион в начале
    for (const cat of cationKeys) {
        if (normalizedWithNumbers.startsWith(cat)) {
            foundCatIndex = cationMap[cat];
            // Пробуем найти анион в оставшейся части (с цифрами!)
            let remainder = normalizedWithNumbers.slice(cat.length);
            // Убираем возможную цифру после катиона (например, Ba3 в Ba3(PO4)2)
            remainder = remainder.replace(/^[0-9]+/, '');

            for (const an of anionKeys) {
                if (remainder === an || remainder.startsWith(an)) {
                    foundAnIndex = anionMap[an];
                    break;
                }
            }
            break;
        }
    }

    // Если не нашли анион, ищем отдельно (с цифрами в названии)
    if (foundAnIndex === -1) {
        for (const an of anionKeys) {
            if (normalizedWithNumbers.includes(an)) {
                foundAnIndex = anionMap[an];
                break;
            }
        }
    }

    return { cationIndex: foundCatIndex, anionIndex: foundAnIndex };
}

// Поиск внутри таблицы растворимости (улучшенная версия)
function searchInSolubilityTable(query) {
    query = query.toLowerCase().trim();

    // Сначала пробуем распарсить как полную формулу (NaCl, BaSO4 и т.д.)
    const parsed = parseChemicalFormula(query);
    let foundRowIndex = parsed.anionIndex;
    let foundColIndex = parsed.cationIndex;

    // Если парсинг формулы не дал результата, ищем по названиям
    if (foundRowIndex === -1) {
        // 1. Ищем АНИОН (строку) по названию
        for (let i = 0; i < solubilityData.anions.length; i++) {
            const a = solubilityData.anions[i];
            const name = a.n.toLowerCase();
            const formula = a.f.toLowerCase().replace('-', '').replace('2', '').replace('3', '').replace('⁻', '').replace('₂', '').replace('₃', '');

            if (query.includes(name) || query.includes(formula)) {
                foundRowIndex = i;
                break;
            }
        }
    }

    if (foundColIndex === -1) {
        // 2. Ищем КАТИОН (столбец) по названию
        for (let i = 0; i < solubilityData.cations.length; i++) {
            const c = solubilityData.cations[i];
            const name = c.n.toLowerCase();
            const formula = c.f.toLowerCase().replace('+', '').replace('2', '').replace('3', '').replace('⁺', '').replace('²', '').replace('₂', '');

            // Ищем вхождение запроса в имя/формулу катиона (а не наоборот!)
            if (name.includes(query) || formula.includes(query)) {
                foundColIndex = i;
                break;
            }
        }
    }

    // 3. Открываем таблицу, если нашли хоть что-то
    if (foundRowIndex !== -1 || foundColIndex !== -1) {
        // Открываем модалку (если закрыта)
        const modal = document.getElementById('solubility-modal');
        if (modal.style.display !== 'flex') {
            openSolubility();
        }

        // Закрываем панель фильтров
        const filtersPanel = document.getElementById('filters-panel');
        if (filtersPanel && filtersPanel.classList.contains('active')) {
            filtersPanel.classList.remove('active');
        }

        // Выделяем найденное
        setTimeout(() => {
            if (foundRowIndex !== -1 && foundColIndex !== -1) {
                // Нашли И катион, И анион → крестовина
                highlightCrosshair(foundRowIndex, foundColIndex);

                const table = document.getElementById('solubility-table');
                const cell = table.rows[foundRowIndex + 1].cells[foundColIndex + 1];
                cell.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            } else if (foundColIndex !== -1) {
                // Нашли ТОЛЬКО катион → подсвечиваем столбец
                highlightColumn(foundColIndex);

                const table = document.getElementById('solubility-table');
                const header = table.rows[0].cells[foundColIndex + 1];
                header.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            } else if (foundRowIndex !== -1) {
                // Нашли ТОЛЬКО анион → подсвечиваем строку
                highlightRow(foundRowIndex);

                const table = document.getElementById('solubility-table');
                const header = table.rows[foundRowIndex + 1].cells[0];
                header.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
            }
        }, 300);

        return true; // Успех
    }

    return false; // Ничего не нашли
}
