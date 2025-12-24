# Структура модулей таблицы растворимости

## Описание модулей

Файл `js/solubility.js` был разделен на 6 логических модулей:

### 1. **solubility-data.js** - Данные таблицы
- `substanceColors` - объект с цветами веществ
- `solubilityData` - данные таблицы (катионы, анионы, правила, исключения)
- `activityData` - данные для ряда активности металлов и неметаллов
- `getSolubility()` - функция получения растворимости

### 2. **solubility-colors.js** - Работа с цветами
- `isColorMode` - флаг режима цветов
- `normalizeFormula()` - нормализация химических формул
- `isColorDark()` - определение темных цветов
- `toggleColorMode()` - переключение режима цветов
- `getColorName()` - конвертация цвета в русское название
- `hexToRgb()` - конвертация HEX в RGB
- `approximateColorByRGB()` - приблизительное определение цвета
- `getUniqueColorsFromTable()` - получение уникальных цветов
- `toggleNonmetalsSeries()` - переключение металлы/неметаллы

### 3. **solubility-table.js** - Рендеринг и подсветка
- `renderSolubilityTable()` - отрисовка таблицы
- `clearTableSelection()` - сброс выделения
- `highlightCrosshair()` - подсветка крестовины
- `highlightColumn()` - подсветка столбца
- `highlightRow()` - подсветка строки
- `enableDragScroll()` - drag-to-scroll для таблицы
- `getCellSubstanceKey()` - получение ключа вещества
- `initActivitySeriesUI()` - инициализация UI ряда активности
- `toggleActivityContainerDisplay()` - показ/скрытие ряда активности
- `renderActivityContent()` - рендер содержимого ряда активности
- `toggleActivitySeries()` - переключение панели рядов активности
- `isMetalsView` - флаг отображения металлов/неметаллов

### 4. **solubility-filters.js** - Фильтрация
- `originalCategoriesHTML` - сохраненные оригинальные категории
- `updateFiltersForSolubility()` - обновление фильтров
- `filterByColor()` - фильтрация по цвету
- `filterBySolubility()` - фильтрация по растворимости
- `resetSolubilityTableDisplay()` - сброс фильтрации
- `restoreElementFilters()` - восстановление фильтров элементов

### 5. **solubility-search.js** - Поиск
- `toggleSolubilitySearch()` - переключение панели поиска
- `clearSolubilitySearch()` - очистка поиска
- `performSolubilitySearch()` - выполнение поиска
- `parseChemicalFormula()` - парсинг химических формул
- `searchInSolubilityTable()` - поиск в таблице
- Автоинициализация обработчиков поиска (IIFE)

### 6. **solubility-modal.js** - Модальное окно
- `toggleSolubility()` - переключение модального окна
- `openSolubility()` - открытие таблицы
- `closeSolubility()` - закрытие таблицы

## Порядок подключения в HTML

**ВАЖНО:** Модули должны подключаться в строго определенном порядке!

```html
<!-- 1. Данные (ПЕРВЫМ!) -->
<script src="js/solubility/solubility-data.js"></script>

<!-- 2. Цвета (использует данные) -->
<script src="js/solubility/solubility-colors.js"></script>

<!-- 3. Таблица (использует данные и цвета) -->
<script src="js/solubility/solubility-table.js"></script>

<!-- 4. Фильтры (использует таблицу и цвета) -->
<script src="js/solubility/solubility-filters.js"></script>

<!-- 5. Поиск (использует таблицу) -->
<script src="js/solubility/solubility-search.js"></script>

<!-- 6. Модальное окно (использует все предыдущие) -->
<script src="js/solubility/solubility-modal.js"></script>
```

## Зависимости между модулями

```
solubility-data.js (независим)
    ↓
solubility-colors.js (использует: normalizeFormula, substanceColors, solubilityData)
    ↓
solubility-table.js (использует: getSolubility, normalizeFormula, substanceColors, isColorMode)
    ↓
solubility-filters.js (использует: getUniqueColorsFromTable, resetSolubilityTableDisplay)
    ↓
solubility-search.js (использует: highlightCrosshair, highlightColumn, highlightRow)
    ↓
solubility-modal.js (использует: renderSolubilityTable, updateFiltersForSolubility, enableDragScroll)
```

## Особенности реализации

1. **НЕ используются ES6 modules** - все функции и переменные глобальные
2. **Порядок загрузки критичен** - каждый модуль зависит от предыдущих
3. **Все комментарии сохранены** из оригинального файла
4. **Функциональность полностью сохранена** - никаких изменений в логике
5. **Самодостаточность модулей** - при условии правильного порядка загрузки

## Внешние зависимости

Модули используют следующие функции из других частей приложения:
- `openAdvancedModal()` - из advanced-modal.js
- `resetTableDisplay()` - из основного скрипта таблицы элементов
- `applyCategoryFilter()` - из фильтров элементов

## Примечания

- Модуль `solubility-search.js` содержит IIFE для автоинициализации обработчиков
- Модуль `solubility-data.js` должен быть загружен первым, т.к. содержит все данные
- Флаги `isColorMode` и `isMetalsView` являются глобальными переменными состояния
