# Модуль таблицы растворимости


<!-- DOC_SYNC_START -->
> Doc sync: `2026-02-24`
> Full technical audit references:
> - [`COMMIT_HISTORY_FULL.md`](../../md/COMMIT_HISTORY_FULL.md)
> - [`FUNCTION_INDEX_FULL.md`](../../md/FUNCTION_INDEX_FULL.md)
> - [`LANGUAGE_STACK_FULL.md`](../../md/LANGUAGE_STACK_FULL.md)
<!-- DOC_SYNC_END -->
Этот модуль содержит функционал продвинутого режима для таблицы растворимости.

## Структура файлов

### `substances-data.js`
База данных с детальной информацией о веществах (аналог `elements.js` для основной таблицы).

**Структура данных:**
```javascript
{
    "Катион-Анион": {
        // 1. Химическая информация
        name: "Название вещества",
        formula: "Формула",
        molarMass: number,
        oxidationStates: {},
        compoundType: "Тип соединения",

        // 2. Растворимость
        solubility: {
            status: "R/N/M/D",
            value: number,
            ksp: number,
            temperatureDependence: string,
            solubilityTable: []
        },

        // 3. Внешний вид
        appearance: {
            precipitateColor: string,
            crystalColor: string,
            realLifeExample: string
        },

        // 4. Стабильность
        stability: {
            decomposition: boolean,
            characteristicReactions: [],
            analyticalUse: string
        },

        // 5. Применение
        applications: [],
        safety: {},

        // 6. Дополнительно
        additionalInfo: {},
        sources: []
    }
}
```

### `advanced-modal.js`
Логика модального окна продвинутого режима.

**Основные функции:**
- `openAdvancedModal(cationFormula, anionFormula)` - открыть окно
- `closeAdvancedModal()` - закрыть окно
- `switchAdvancedTab(tabName)` - переключение вкладок
- `copyFormula(formula)` - копирование формулы

## Использование

### Открытие модального окна
- **Десктоп:** Двойной клик по ячейке таблицы
- **Мобильные:** Долгое нажатие (500 мс) на ячейку

### Интеграции
- Данные таблицы используются в LaTeX-экспорте (`js/modules/latex-export.js`).

### Добавление данных о новом веществе

1. Определите ключ: `normalizeFormula(катион)-normalizeFormula(анион)`
   - Например: `"Ba2+-SO42-"` для BaSO₄

2. Добавьте объект в `substances-data.js`:
```javascript
"Ba2+-SO42-": {
    name: "Сульфат бария",
    formula: "BaSO₄",
    // ... остальные поля
}
```

3. Заполните все разделы (см. примеры в файле)

## Вкладки модального окна

1. **Химия** - формула, молярная масса, степени окисления
2. **Растворимость** - точные данные, Ksp, зависимость от температуры
3. **Внешний вид** - цвета, кристаллическая система
4. **Реакции** - стабильность, характерные реакции
5. **Применение** - использование, безопасность, интересные факты

## Стили

Стили находятся в `css/advanced-modal.css`:
- Адаптивный дизайн (десктоп + мобильные)
- Поддержка темной темы
- Вкладочная навигация
- Анимации

## TODO

- [ ] Добавить данные для всех веществ из таблицы (528 комбинаций)
- [ ] Добавить графики растворимости vs температура
- [ ] Экспорт данных в PDF/JSON
- [ ] Режим сравнения веществ
- [ ] Поиск по веществам
- [ ] Оптимизация отображения на мобильных устройствах (размеры кнопок и иконок)

## Источники данных

Рекомендуемые источники для заполнения:
- CRC Handbook of Chemistry and Physics
- NIST Chemistry WebBook
- Справочник химика (Никольский Б.П.)
- Лурье Ю.Ю. "Справочник по аналитической химии"
