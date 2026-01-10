# AI_CONTEXT.md — Контекст проекта для AI-ассистента

> **Версия:** 0.6.5  
> **Обновлено:** Январь 2026  
> **Назначение:** Быстрое погружение AI в проект без повторных объяснений

---

## 🎯 О проекте

**Химический Ассистент** — интерактивная таблица Менделеева для школьной олимпиады по химии/информатике.

**Ключевые особенности:**
- Работает локально через `file://` протокол
- Никаких сборщиков, фреймворков, серверов
- Модульная динамическая загрузка через `scrypt.js`
- PWA с оффлайн-режимом
- Полностью на русском языке
- **NodeMap** — визуализация архитектуры кода

---

## 🛠 Технические ограничения (КРИТИЧНО!)

### ❌ ЗАПРЕЩЕНО:
```javascript
// ES6 модули — CORS ошибка на file://
import { something } from './module.js';  // ❌ НЕЛЬЗЯ
export const data = {};                    // ❌ НЕЛЬЗЯ

// Fetch локальных файлов — CORS ошибка
fetch('./data.json')  // ❌ НЕЛЬЗЯ на file://

// Динамический import
import('./module.js')  // ❌ НЕЛЬЗЯ
```

### ✅ РАЗРЕШЕНО:
```javascript
// Глобальные переменные (window)
const elementsData = { H: {...}, He: {...} };

// IIFE для изоляции
(function() {
    // код модуля
})();

// Динамическая загрузка скриптов (как в scrypt.js)
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Данные встроены в JS файлы
const solubilityData = { cations: [...], anions: [...], rows: [...] };
```

---

## 📁 Структура проекта

```
mendeleevtable/
├── index.html              # Точка входа, вся HTML-разметка
├── pwa/
│   ├── manifest.json       # PWA манифест
│   └── sw.js               # Service Worker для оффлайна
│
├── css/                    # Стили (модульная система)
│   ├── style.css           # Главный файл (только @import)
│   ├── base.css            # Body, canvas, базовые стили
│   ├── table.css           # Сетка периодической таблицы
│   ├── modal.css           # Модальное окно элемента
│   ├── theme.css           # Тёмная тема, волновая анимация
│   ├── fab.css             # FAB-меню (плавающая кнопка)
│   ├── calculator.css      # Калькулятор молярной массы
│   ├── filters.css         # Панель фильтров и поиска
│   ├── solubility.css      # Таблица растворимости
│   ├── advanced-modal.css  # Продвинутая модалка веществ
│   └── nodemap.css         # NodeMap визуализация
│
├── js/
│   ├── scrypt.js           # 🚀 Модульный загрузчик (entry point)
│   ├── icons.js            # SVG-спрайт иконок
│   ├── elements.js         # База данных 40 элементов
│   ├── particles.js        # Canvas: анимация фона + 3D атомы
│   │
│   ├── modules/            # 📦 Основные модули
│   │   ├── modal.js        # Модальное окно элемента
│   │   ├── theme.js        # Тёмная тема + волновая анимация
│   │   ├── calculator.js   # Калькулятор молярной массы
│   │   ├── search-filters.js # Поиск и фильтры элементов
│   │   ├── ui.js           # FAB-меню и UI-функции
│   │   └── mobile-layout.js # Мобильная адаптация
│   │
│   ├── solubility/         # 🧪 Таблица растворимости
│   │   ├── data.js         # Данные: катионы, анионы, матрица
│   │   ├── colors.js       # 100+ цветов веществ
│   │   ├── solubility-table.js # Рендеринг таблицы
│   │   ├── filters.js      # Фильтрация и выделение
│   │   ├── search.js       # Поиск веществ
│   │   ├── modal.js        # Открытие/закрытие модалки
│   │   ├── advanced-modal.js # Продвинутая модалка
│   │   └── substances-data.js # База данных о веществах
│   │
│   └── nodemap/            # 🗺️ Визуализация архитектуры
│       ├── nodemap-init.js # Инициализация
│       ├── nodemap-parser.js # Парсер функций из window
│       ├── nodemap-layout.js # Force-directed layout
│       ├── nodemap-canvas.js # Canvas рендеринг графа
│       ├── nodemap-modal.js  # UI модального окна
│       ├── nodemap-flow-data.js # Анализ потока данных
│       ├── nodemap-flow-layout.js # Layout для flow-диаграмм
│       └── nodemap-flow-canvas.js # Рендеринг flow-диаграмм
│
└── img/
    ├── favicon.png
    ├── png1.png            # PWA icon 192x192
    └── png2.png            # PWA icon 512x512
```

**Итого:** 11 CSS файлов, 24 JS файла

---

## 🔑 Ключевые структуры данных

### 1. elementsData (js/elements.js)
```javascript
const elementsData = {
    "H": {
        atomicNumber: "1",
        name: "Водород",
        atomicMass: "1.008",
        period: "1",
        group: "1",
        block: "s",
        category: "Неметалл",
        electronConfig: "1s<sup>1</sup>",
        electronegativity: "2.20",
        density: "0.00008988 г/см³",
        meltingPoint: "−259.14 °C",
        boilingPoint: "−252.87 °C",
        state: "Газ",
        color: "Бесцветный",
        discoveryYear: "1766",
        discoverer: "Генри Кавендиш",
        nameOrigin: "От греч. hydro (вода) + genes (рождающий)",
        applications: "...",
        facts: "...",
        // Опционально для элементов с аллотропами:
        allotropes: { 
            graphite: {...}, 
            diamond: {...} 
        },
        extraAllotropes: { 
            fullerene: {...} 
        }
    },
    // ... ещё 39 элементов (до Zr)
};
```

### 2. solubilityData (js/solubility/data.js)
```javascript
const solubilityData = {
    cations: [
        { f: "H⁺", n: "Водород" },
        { f: "NH₄⁺", n: "Аммоний" },
        // ... 24 катиона
    ],
    anions: [
        { f: "OH⁻", n: "Гидроксид" },
        { f: "F⁻", n: "Фторид" },
        // ... 16 анионов
    ],
    rows: [
        "ORRRRRR-MMMRNN-NNNNNNNNN", // OH (O=особый, R=раств, M=мало, N=нет)
        "RRRRMMRRMMNNR-RNNRNRRNRR", // F
        // ... 16 строк (по одной на анион)
        // D = разлагается водой
    ]
};
```

### 3. substanceColors (js/solubility/colors.js)
```javascript
const substanceColors = {
    // Гидроксиды
    "Cu(OH)₂": { color: "#7EC8E3", name: "Голубой осадок" },
    "Fe(OH)₃": { color: "#8B4513", name: "Бурый осадок" },
    "Fe(OH)₂": { color: "#228B22", name: "Зеленоватый осадок" },
    
    // Сульфиды (чёрные)
    "CuS": { color: "#1a1a1a", name: "Чёрный осадок" },
    "PbS": { color: "#1a1a1a", name: "Чёрный осадок" },
    "FeS": { color: "#1a1a1a", name: "Чёрный осадок" },
    
    // Иодиды (жёлтые)
    "AgI": { color: "#FFD700", name: "Жёлтый осадок" },
    "PbI₂": { color: "#FFD700", name: "Золотисто-жёлтый осадок" },
    
    // Хроматы (жёлтые)
    "BaCrO₄": { color: "#FFD700", name: "Жёлтый осадок" },
    "PbCrO₄": { color: "#FFA500", name: "Оранжево-жёлтый осадок" },
    
    // Растворы (цветные ионы)
    "CuSO₄": { color: "#87CEEB", name: "Голубой раствор" },
    "CoCl₂": { color: "#FF69B4", name: "Розовый раствор" },
    "NiCl₂": { color: "#90EE90", name: "Зелёный раствор" },
    "KMnO₄": { color: "#8B008B", name: "Фиолетовый раствор" },
    
    // ... 100+ веществ с реалистичными цветами
};
```


---

## 🎨 CSS-классы категорий элементов

```css
/* Светлая тема */
.alkali-metal { background-color: #ff9999; }
.alkaline-earth-metal { background-color: #ffcc99; }
.transition-metal { background-color: #ffff99; }
.post-transition-metal { background-color: #ccff99; }
.metalloid { background-color: #99ffcc; }
.nonmetal { background-color: #99ffff; }
.halogen { background-color: #99ccff; }
.noble-gas { background-color: #cc99ff; }
.lanthanide { background-color: #ff99cc; }
.actinide { background-color: #ff99ff; }

/* Тёмная тема — добавить body.dark-theme перед селектором */
body.dark-theme .alkali-metal { background-color: #8b3a3a; }
// ... и т.д.
```

---

## 🔧 Ключевые функции

### Модульный загрузчик (js/scrypt.js)
```javascript
// Динамическая загрузка модулей
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Последовательная загрузка модулей
async function initApp() {
    await loadScript('js/icons.js');
    await loadScript('js/elements.js');
    await loadScript('js/modules/theme.js');
    // ... и т.д.
}
```

### Периодическая таблица (js/modules/modal.js)
```javascript
// Открытие модального окна элемента
function openElementModal(symbol) { ... }

// Рендеринг содержимого с аллотропами
function renderModalContent(data) { ... }

// Создание табов аллотропов
function createAllotropeTabs(mainData) { ... }
```

### Тема (js/modules/theme.js)
```javascript
// Переключение темы с волновой анимацией
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Волна запускается от кнопки
    createThemeWave(event.clientX, event.clientY);
}

// Волновая анимация
function createThemeWave(x, y) { ... }
```

### Калькулятор (js/modules/calculator.js)
```javascript
// Добавление атома в калькулятор
function addAtomToCalculator(symbol, fromDrop = false) { ... }

// Пересчёт массы
function updateTotalMass() { ... }

// Drag & Drop поддержка
elementCell.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', symbol);
});
```

### Таблица растворимости (js/solubility/*.js)
```javascript
// Рендеринг таблицы 24×16
function renderSolubilityTable() { ... }

// Выделение крестовиной
function highlightCrosshair(rowIdx, colIdx) { ... }

// Переключение реалистичных цветов
function toggleRealisticColors() {
    isRealisticColors = !isRealisticColors;
    renderSolubilityTable();
}

// Поиск вещества (интегрирован с главным поиском)
function searchInSolubilityTable(query) { ... }

// Продвинутая модалка (двойной клик / долгое нажатие)
function openAdvancedModal(cationFormula, anionFormula) {
    const key = normalizeFormula(cationFormula) + '-' + normalizeFormula(anionFormula);
    const substance = substancesData[key];
    // Рендер 5 вкладок с информацией
}
```

### Поиск и фильтры (js/modules/search-filters.js)
```javascript
// Поиск по всем данным элементов
function searchElements(query) { ... }

// Фильтрация по категории
function applyCategoryFilter(categoryClass) { ... }

// Химический парсер (распознаёт формулы)
function parseChemicalFormula(query) {
    // "BaSO4" → { cation: "Ba2+", anion: "SO42-" }
    // "хлорид натрия" → { cation: "Na+", anion: "Cl-" }
}
```

### NodeMap (js/nodemap/*.js) — НОВОЕ!
```javascript
// Инициализация (клавиша '.')
function initNodeMap() {
    window.addEventListener('keydown', (e) => {
        if (e.key === '.') {
            if (!nodemapOpen) openNodeMap();
            else closeNodeMap();
        }
    });
}

// Парсинг всех функций из window
function parseFunctions() {
    const functions = [];
    for (let key in window) {
        if (typeof window[key] === 'function') {
            const func = window[key];
            const code = func.toString();
            // Анализ кода функции
            functions.push({
                name: key,
                calls: extractFunctionCalls(code),
                lines: code.split('\n').length,
                complexity: calculateComplexity(code),
                params: extractParameters(code)
            });
        }
    }
    return functions;
}

// Force-directed layout
function calculateLayout(nodes, edges) {
    // Алгоритм размещения нод на плоскости
    // Учитывает силы притяжения и отталкивания
}

// Рендеринг на Canvas
function renderGraph(ctx, nodes, edges) {
    // Отрисовка графа с цветовой кодировкой
}

// Поиск и фильтры
function searchFunction(query) { ... }
function filterByType(type) { ... } // 'hub', 'entry', 'leaf', 'island'
```

### Определение устройств (js/utils.js) — НОВОЕ!
```javascript
// Функция для определения типа устройства
function getDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Проверка на iOS
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

    // Проверка на iPhone
    const isIPhone = /iPhone/.test(userAgent) && !window.MSStream;

    // Проверка на iPad
    const isIPad = /iPad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // Проверка на Android
    const isAndroid = /android/i.test(userAgent);

    // Проверка на Windows
    const isWindows = /Win/.test(userAgent);

    // Проверка на Mac (не iOS)
    const isMac = /Mac/.test(userAgent) && !isIOS;

    // Проверка на Mobile (любое мобильное устройство)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    // Проверка на Touch Device
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    return {
        isIOS,
        isIPhone,
        isIPad,
        isAndroid,
        isWindows,
        isMac,
        isMobile,
        isTouchDevice
    };
}

// Функция для добавления классов устройства к body
function addDeviceClassToBody() {
    const device = getDeviceType();
    const body = document.body;

    // Удаляем старые классы
    body.classList.remove(
        'device-ios',
        'device-iphone',
        'device-ipad',
        'device-android',
        'device-windows',
        'device-mac',
        'device-mobile',
        'device-touch'
    );

    // Добавляем новые классы в зависимости от устройства
    if (device.isIOS) body.classList.add('device-ios');
    if (device.isIPhone) body.classList.add('device-iphone');
    if (device.isIPad) body.classList.add('device-ipad');
    if (device.isAndroid) body.classList.add('device-android');
    if (device.isWindows) body.classList.add('device-windows');
    if (device.isMac) body.classList.add('device-mac');
    if (device.isMobile) body.classList.add('device-mobile');
    if (device.isTouchDevice) body.classList.add('device-touch');
}
```

---

## 📱 Адаптивность

```css
/* Брейкпоинты */
@media (max-width: 1024px) { 
    /* Планшеты и мобильные */ 
}

@media (max-width: 768px) and (orientation: landscape) { 
    /* Горизонтальная ориентация */ 
}

@media (max-width: 480px) { 
    /* Маленькие телефоны */ 
}

/* Safe Area для iOS (вырез экрана) */
.modal-content {
    padding-top: max(20px, env(safe-area-inset-top));
    padding-bottom: max(20px, env(safe-area-inset-bottom));
    padding-left: max(20px, env(safe-area-inset-left));
    padding-right: max(20px, env(safe-area-inset-right));
}
```

**Ключевые адаптации:**
- Таблица: горизонтальный скролл на мобильных
- Модальное окно: полноэкранное снизу (bottom sheet)
- FAB-меню: горизонтальное расположение слева
- Калькулятор: нижняя панель на всю ширину
- **Таблица растворимости:** полноэкранный режим с учётом safe-area
- **NodeMap:** адаптивный UI, touch-события
- **Определение устройств:** автоматическое добавление классов устройств к body для адаптивных стилей
- **Адаптация интерфейса:** специфичные стили для iPhone и Android устройств

---

## 🚀 Возможности v0.6.5

### Реализовано:
- ✅ Интерактивная таблица 118 элементов
- ✅ Детальная информация по 100 элементам (H–Zr)
- ✅ Система аллотропов (основные + дополнительные)
- ✅ Тёмная тема с волновой анимацией
- ✅ 3D модели атомов на Canvas
- ✅ Калькулятор молярной массы (Drag & Drop)
- ✅ Поиск по всем данным элементов
- ✅ Фильтры по категориям
- ✅ Таблица растворимости 24×16 (384 соединения)
- ✅ Sticky headers в таблице растворимости
- ✅ Выделение крестовиной (строка + столбец)
- ✅ Режим реалистичных цветов (100+ веществ)
- ✅ Умный поиск веществ (интеграция с таблицей)
- ✅ **Продвинутая модалка** — детальная информация о веществах
- ✅ **substances-data.js** — структурированная база данных
- ✅ **NodeMap** — визуализация архитектуры кода
- ✅ **Мобильная оптимизация** — safe-area, bounce, hidden scrollbars
- ✅ PWA (оффлайн-режим)
- ✅ **Определение устройств** — автоматическое определение типа устройства для адаптивных стилей
- ✅ **Адаптация интерфейса** — оптимизированные размеры элементов для iPhone и Android


---

## 📝 Правила для AI

### При добавлении кода:
1. **Никаких import/export** — только глобальные переменные
2. **Данные встраивать в JS** — не использовать fetch для JSON
3. **Учитывать file:// протокол** — никаких серверных API
4. **Проверять оба режима** — светлая и тёмная тема
5. **Следовать модульной структуре** — новый функционал в отдельные файлы
6. **Добавлять файлы в scrypt.js** — для динамической загрузки
7. **Обновлять sw.js** — добавлять новые файлы в кэш PWA

### При исправлении багов:
1. **Хирургические правки** — только изменённые строки
2. **Указывать файл и место** — функция/селектор/строка
3. **Не переписывать файлы целиком** — они большие
4. **Тестировать на мобильных** — адаптивность критична

### При работе с данными:
1. **elementsData** — добавлять элементы последовательно
2. **substanceColors** — реалистичные hex-цвета
3. **substancesData** — полная структура (6 разделов)
4. **solubilityData.rows** — проверять на 24 символа

### Формат ответа:
```
В файле `js/modules/calculator.js`, функция `updateTotalMass()`:

// Было:
total = Math.round(total * 100) / 100;

// Стало:
total = Math.round(total * 1000) / 1000;

Причина: Увеличена точность до 3 знаков после запятой.
```

---

## 🔗 Ссылки

- **GitHub:** https://github.com/layfhaker/mendeleevtable
- **GitHub Pages:** https://layfhaker.github.io/mendeleevtable/
- **Документация:**
  - [README.md](README.md) — общая информация
  - [TODO.md](TODO.md) — задачи и планы
  - [NODEMAP_GUIDE.md](NODEMAP_GUIDE.md) — руководство по NodeMap
  - [js/nodemap/README.md](js/nodemap/README.md) — техническая документация NodeMap
  - [js/solubility/README.md](js/solubility/README.md) — модуль растворимости
  - [js/solubility/MODULES_STRUCTURE.md](js/solubility/MODULES_STRUCTURE.md) — структура модулей

---

## 🎯 Быстрые факты

- **Язык:** Русский
- **Технологии:** HTML5, CSS3, Vanilla JavaScript
- **Размер:** ~150 КБ
- **Функций:** 200+
- **Строк кода:** 6000+
- **CSS файлов:** 11
- **JS модулей:** 24
- **Последнее обновление:** Январь 2026

---

*Проект для школьной олимпиады по химии/информатике*
