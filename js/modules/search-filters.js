// =========================================
// МОДУЛЬ: ПОИСК И ФИЛЬТРЫ
// =========================================

console.log('[SEARCH-FILTERS] Модуль загружен');
console.log('[SEARCH-FILTERS] elementsData доступен:', typeof elementsData !== 'undefined');
console.log('[SEARCH-FILTERS] searchInSolubilityTable доступен:', typeof searchInSolubilityTable !== 'undefined');

// =========================================
// ЛОГИКА ПОИСКА
// =========================================
let currentSearchTerm = '';
let defaultCategoriesHTML = '';

function isSolubilityModalOpen() {
    // Проверяем через класс на body, а не через display модалки,
    // т.к. модалка скрывается с задержкой 360ms (анимация),
    // а класс снимается сразу при закрытии
    return document.body.classList.contains('solubility-open');
}

function captureDefaultCategoriesHTML() {
    const categoriesSection = document.getElementById('categories-section');
    if (!categoriesSection) return;
    if (!defaultCategoriesHTML) {
        defaultCategoriesHTML = categoriesSection.innerHTML;
    }
}

function applyCategoryFilterFromButton(btn, event) {
    if (!btn) return;
    if (event) event.stopPropagation();
    if (isSolubilityModalOpen()) return;

    const filterType = btn.dataset.filter;
    if (!filterType) return;

    if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        resetTableDisplay();
        return;
    }

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyCategoryFilter(filterType);
}

function attachCategoryFilterHandlers() {
    document.querySelectorAll('#categories-section .filter-btn[data-filter]').forEach(btn => {
        btn.onclick = (e) => applyCategoryFilterFromButton(btn, e);
    });
}

window.attachCategoryFilterHandlers = attachCategoryFilterHandlers;
window.applyCategoryFilterFromButton = applyCategoryFilterFromButton;

window.restoreElementFiltersSafe = function () {
    const categoriesSection = document.getElementById('categories-section');
    if (!categoriesSection) return;
    captureDefaultCategoriesHTML();
    if (!defaultCategoriesHTML) return;
    categoriesSection.innerHTML = defaultCategoriesHTML;
    document.querySelectorAll('#categories-section .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
    });
    attachCategoryFilterHandlers();
};

function performSearch() {
    const input = document.getElementById('element-search');
    const query = input.value.trim();

    if (query.length < 1) {
        return;
    }

    // 0. Если открыта таблица растворимости - ищем ТОЛЬКО в ней
    const isSolubilityOpen = isSolubilityModalOpen();

    if (isSolubilityOpen && typeof searchInSolubilityTable === 'function') {
        console.log('[SEARCH] Таблица растворимости открыта, ищем в ней:', query);
        searchInSolubilityTable(query);
        return;
    }

    // 1. Сначала проверяем точное совпадение по символу элемента (Приоритет!)
    // Это предотвращает переключение на таблицу растворимости для запросов типа "H", "Cl" и т.д.
    const symbolMatch = findElementBySymbol(query);
    if (symbolMatch) {
        highlightElementInTable(symbolMatch);

        // Умное закрытие панели фильтров: закрываем только если она перекрывает элемент
        checkOverlapAndCloseFilters(document.getElementById(symbolMatch));

        // Очищаем подсветку через 3 секунды
        setTimeout(() => {
            clearElementHighlight();
        }, 3000);
        return;
    }

    // 2. Затем проверяем таблицу растворимости (если не нашли элемент)
    if (typeof searchInSolubilityTable === 'function') {
        const foundInTable = searchInSolubilityTable(query);
        if (foundInTable) {
            return;
        }
    }

    // 3. Если меньше 3 символов и ничего не нашли выше - выходим
    if (query.length < 3) {
        return;
    }

    // 4. Полнотекстовый поиск по всем данным (для 3+ символов)
    currentSearchTerm = query;
    const results = searchElements(query);
    displaySearchResults(results);
}

// Поиск элемента по символу (регистронезависимый)
function findElementBySymbol(query) {
    // Проверяем, доступны ли данные элементов
    if (typeof elementsData === 'undefined') {
        console.error('[SEARCH-FILTERS] elementsData не загружен!');
        return null;
    }

    const queryUpper = query.toUpperCase();

    // Ищем точное совпадение по символу
    for (const symbol in elementsData) {
        if (symbol.toUpperCase() === queryUpper) {
            return symbol;
        }
    }

    return null;
}

// Функция умного закрытия панели фильтров
function checkOverlapAndCloseFilters(element) {
    const filtersPanel = document.getElementById('filters-panel');
    if (!filtersPanel || !filtersPanel.classList.contains('active') || !element) {
        return;
    }

    const panelRect = filtersPanel.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    // Проверяем пересечение прямоугольников
    const overlap = !(
        elementRect.right < panelRect.left ||
        elementRect.left > panelRect.right ||
        elementRect.bottom < panelRect.top ||
        elementRect.top > panelRect.bottom
    );

    // Закрываем только если есть пересечение
    if (overlap) {
        console.log('[SEARCH] Элемент перекрыт панелью, закрываем фильтры');
        if (!filtersPanel.classList.contains('closing')) {
            filtersPanel.classList.add('closing');
            setTimeout(() => {
                filtersPanel.classList.remove('active', 'closing');
            }, 360);
        }
    } else {
        console.log('[SEARCH] Элемент виден, панель оставляем открытой');
    }
}

// Подсветка элемента в таблице с анимацией
function highlightElementInTable(symbol) {
    console.log('Попытка подсветить элемент:', symbol);
    const elementDiv = document.getElementById(symbol);
    console.log('Найден элемент:', elementDiv);

    if (!elementDiv) {
        console.error('Элемент не найден в DOM:', symbol);
        return;
    }

    // Убираем предыдущую подсветку, если есть
    clearElementHighlight();

    // Добавляем класс подсветки
    elementDiv.classList.add('search-highlight');
    console.log('Класс search-highlight добавлен к элементу:', symbol);
    console.log('Классы элемента:', elementDiv.className);

    // Прокручиваем к элементу
    elementDiv.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
    });
}

// Очистка подсветки элемента
function clearElementHighlight() {
    const highlighted = document.querySelector('.search-highlight');
    if (highlighted) {
        highlighted.classList.remove('search-highlight');
    }
}

function searchElements(query) {
    const results = [];
    query = query.toLowerCase().trim();

    if (query.length < 3) return results;

    // Проверяем, доступны ли данные элементов
    if (typeof elementsData === 'undefined') {
        console.error('[SEARCH-FILTERS] elementsData не загружен!');
        return results;
    }

    for (const symbol in elementsData) {
        const element = elementsData[symbol];
        const matches = [];

        const searchFields = [
            { key: 'name', label: 'Название' },
            { key: 'facts', label: 'Факты' },
            { key: 'applications', label: 'Применение' },
            { key: 'nameOrigin', label: 'Происхождение названия' },
            { key: 'discoverer', label: 'Первооткрыватель' },
            { key: 'category', label: 'Категория' },
            { key: 'color', label: 'Цвет' },
            { key: 'structure', label: 'Структура' }
        ];

        searchFields.forEach(field => {
            const value = element[field.key];
            if (value && String(value).toLowerCase().includes(query)) {
                matches.push({
                    field: field.label,
                    text: String(value),
                    allotrope: null
                });
            }
        });

        if (element.allotropes) {
            for (const alloKey in element.allotropes) {
                const allo = element.allotropes[alloKey];
                searchInAllotrope(allo, query, matches, alloKey);
            }
        }

        if (element.extraAllotropes) {
            for (const alloKey in element.extraAllotropes) {
                const allo = element.extraAllotropes[alloKey];
                searchInAllotrope(allo, query, matches, alloKey);
            }
        }

        if (matches.length > 0) {
            results.push({
                symbol: symbol,
                name: element.name,
                matches: matches
            });
        }
    }

    return results;
}

function searchInAllotrope(allo, query, matches, alloKey) {
    const alloFields = ['name', 'alloFacts', 'alloDiscoverer', 'properties', 'structure', 'color'];

    alloFields.forEach(field => {
        const value = allo[field];
        if (value && String(value).toLowerCase().includes(query)) {
            matches.push({
                field: allo.name || alloKey,
                text: String(value),
                allotrope: alloKey
            });
        }
    });
}

function displaySearchResults(results) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = '<div class="search-no-results">Ничего не найдено</div>';
        return;
    }

    results.slice(0, 10).forEach(result => {
        const item = document.createElement('div');
        item.className = 'search-result-item';

        const firstMatch = result.matches[0];
        const contextText = truncateText(firstMatch.text, 50);

        item.innerHTML = `
            <span class="result-symbol">${result.symbol}</span>
            <span class="result-name">${result.name}</span>
            <span class="result-context">${firstMatch.field}: ${contextText}</span>
        `;

        item.onclick = () => openSearchResult(result.symbol, firstMatch.allotrope);
        container.appendChild(item);
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function openSearchResult(symbol, allotropeKey) {
    const elementDiv = document.getElementById(symbol);
    if (!elementDiv) return;

    toggleFilters();
    elementDiv.click();

    if (allotropeKey) {
        setTimeout(() => {
            const alloTab = document.querySelector(`.allotrope-tab[data-allotrope-key="${allotropeKey}"]`);
            if (alloTab) alloTab.click();
        }, 100);
    }

    setTimeout(() => {
        highlightSearchTerm(currentSearchTerm);
    }, 200);
}

function highlightSearchTerm(term) {
    if (!term || term.length < 2) return;

    const elementInfo = document.getElementById('element-info');
    if (!elementInfo) return;

    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');

    const walker = document.createTreeWalker(
        elementInfo,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    const textNodes = [];
    while (walker.nextNode()) {
        if (walker.currentNode.textContent.toLowerCase().includes(term.toLowerCase())) {
            textNodes.push(walker.currentNode);
        }
    }

    textNodes.forEach(node => {
        const span = document.createElement('span');
        span.innerHTML = node.textContent.replace(regex, '<mark class="highlight">$1</mark>');
        node.parentNode.replaceChild(span, node);
    });

    const firstHighlight = elementInfo.querySelector('.highlight');
    if (firstHighlight) {
        firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function clearSearch() {
    const input = document.getElementById('element-search');
    const results = document.getElementById('search-results');
    const clearBtn = document.querySelector('.search-clear');

    input.value = '';
    results.innerHTML = '';
    currentSearchTerm = '';
    clearBtn.classList.remove('visible');
    clearElementHighlight();
}

(function initSearch() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupSearch);
    } else {
        setupSearch();
    }

    function setupSearch() {
        captureDefaultCategoriesHTML();
        attachCategoryFilterHandlers();
        const searchInput = document.getElementById('element-search');
        const clearBtn = document.querySelector('.search-clear');

        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            if (e.target.value.length > 0) {
                clearBtn.classList.add('visible');
            } else {
                clearBtn.classList.remove('visible');
            }
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
})();

// =========================================
// ЛОГИКА ФИЛЬТРОВ
// =========================================
function toggleFilters() {
    const PANEL_ANIM_MS = 360;
    // Проверяем, открыт ли уравниватель
    const isBalancerOpen = document.body.classList.contains('balancer-active');
    if (isBalancerOpen) return;

    const panel = document.getElementById('filters-panel');
    const fab = document.getElementById('fab-container');

    // Проверяем, открыта ли таблица растворимости
    const isSolubilityOpen = isSolubilityModalOpen();

    if (isSolubilityOpen) {
        // Если открыта таблица растворимости, устанавливаем фильтры для растворимости
        if (typeof updateFiltersForSolubility === 'function') {
            updateFiltersForSolubility();
        }
    } else {
        // В противном случае, восстанавливаем фильтры элементов
        if (typeof window.restoreElementFiltersSafe === 'function') {
            window.restoreElementFiltersSafe();
        } else if (typeof restoreElementFilters === 'function') {
            restoreElementFilters();
        }
    }

    if (panel) {
        if (panel.classList.contains('active')) {
            if (panel.classList.contains('closing')) return;
            panel.classList.add('closing');
            setTimeout(() => {
                panel.classList.remove('active', 'closing');
            }, PANEL_ANIM_MS);
        } else {
            panel.classList.remove('closing');
            panel.classList.add('active');
        }
    }

    // Скрываем FAB только на мобильных устройствах
    if (window.innerWidth <= 1024 && fab && fab.classList.contains('active')) {
        fab.classList.remove('active');
    }
}

function resetFilters() {
    const searchInput = document.getElementById('element-search');
    if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    }
    const searchResults = document.getElementById('search-results');
    if (searchResults) searchResults.innerHTML = '';

    // Проверяем, открыта ли таблица растворимости
    const isSolubilityOpen = isSolubilityModalOpen();

    if (isSolubilityOpen) {
        // Если открыта таблица растворимости, сбрасываем фильтры для неё
        document.querySelectorAll('#categories-section .filter-btn').forEach(btn => {
            btn.classList.remove('active');
            // Сбрасываем стили, установленные для цветовых фильтров
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
        });

        // Вызываем функцию сброса для таблицы растворимости, если она доступна
        if (typeof resetSolubilityTableDisplay === 'function') {
            resetSolubilityTableDisplay();
        } else {
            // Если функция недоступна, пробуем загрузить модуль растворимости
            if (typeof loadSolubility === 'function') {
                loadSolubility().then(() => {
                    if (typeof resetSolubilityTableDisplay === 'function') {
                        resetSolubilityTableDisplay();
                    }
                });
            }
        }
    } else {
        // В противном случае, сбрасываем фильтры для обычных элементов
        document.querySelectorAll('.filter-btn.active').forEach(btn => {
            btn.classList.remove('active');
        });

        resetTableDisplay();
    }
}

// Делегирование кликов для фильтров элементов (устойчиво к замене HTML и мобилкам)
document.addEventListener('click', (event) => {
    const btn = event.target.closest('.filter-btn');
    if (!btn) return;
    // Категории обрабатываются через прямой onclick
    if (btn.dataset.filter) return;
    // Клики по категориям обрабатываются делегированным обработчиком секции
    if (btn.closest('#categories-section')) return;
    const filterType = btn.dataset.filter;
    if (!filterType) return; // игнорируем кнопки растворимости/цветов

    // Если открыта таблица растворимости — не трогаем фильтры элементов
    if (isSolubilityModalOpen()) return;

    if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        resetTableDisplay();
        return;
    }

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    applyCategoryFilter(filterType);
});

function applyCategoryFilter(categoryClass) {
    // Используем более общий селектор для всех элементов с классом element
    const allElements = document.querySelectorAll('.element');

    allElements.forEach(el => {
        if (el.classList.contains(categoryClass)) {
            el.style.opacity = '1';
            el.style.filter = 'none';
            el.style.pointerEvents = 'auto';
            el.style.transform = 'scale(1)';
        } else {
            el.style.opacity = '0.1';
            el.style.filter = 'grayscale(100%)';
            el.style.pointerEvents = 'none';
            el.style.transform = 'scale(0.9)';
        }
    });
}

function resetTableDisplay() {
    // Сбрасываем стили для всех элементов с классом element
    const allElements = document.querySelectorAll('.element');
    allElements.forEach(el => {
        el.style.opacity = '';
        el.style.filter = '';
        el.style.pointerEvents = '';
        el.style.transform = '';
    });
}
