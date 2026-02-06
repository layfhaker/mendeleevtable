# Полный гайд: Система модалок, анимации и библиотека ModalAnim

---

## Часть 1. Текущая архитектура модалок

### 1.1. Инвентарь: все 7 модалок

| # | Название | DOM-селектор | JS-файл | CSS-файл(ы) | z-index |
|---|----------|-------------|---------|-------------|---------|
| 1 | Элемент | `#modal` | `js/modules/modal.js` | `css/modal.css`, `css/flip-modal.css` | 1000 |
| 2 | Электронная конфигурация | `#electron-config-modal` | `js/modules/electron-config.js` | `css/electron-config.css`, `css/flip-modal.css` | 120000 |
| 3 | Таблица растворимости | `#solubility-modal` | `js/solubility/modal.js` | `css/solubility.css`, `css/flip-modal.css` | 2000 |
| 4 | Продвинутый режим | `#advanced-substance-modal` | `js/solubility/advanced-modal.js` | `css/advanced-modal.css`, `css/flip-modal.css` | 70000 |
| 5 | Калькулятор | `#calc-panel` | `js/modules/calculator.js` | `css/calculator.css` | 60000 |
| 6 | Фильтры | `#filters-panel` | `js/modules/search-filters.js` | `css/filters.css` | 51000 |
| 7 | Уравниватель | `#balancer-panel` | `js/modules/balancer.js` | `css/balancer.css` | 1000 |

### 1.2. Два паттерна управления видимостью

#### Паттерн A — `display: none/flex` (модалки 1–4)

```
Открытие:
  modal.style.display = "flex"
  → CSS @keyframes срабатывает автоматически (animation прописан в стилях)
  → document.body.classList.add('<modal>-open')

Закрытие:
  modal.classList.add('closing')
  → CSS @keyframes переключается на *Close вариант
  → setTimeout(360ms)
  → modal.style.display = "none"
  → modal.classList.remove('closing')
  → document.body.classList.remove('<modal>-open')
```

#### Паттерн B — `.active` класс (панели 5–7)

```
Открытие:
  panel.classList.add('active')
  → CSS @keyframes срабатывает по селектору .panel.active
  → document.body.classList.add('<panel>-active')

Закрытие:
  panel.classList.add('closing')
  → CSS @keyframes переключается на *Close вариант
  → setTimeout(360ms)
  → panel.classList.remove('active', 'closing')
  → document.body.classList.remove('<panel>-active')
```

### 1.3. Подробное описание каждой модалки

---

#### 1. Модалка элемента (`#modal`)

**Файлы:**
- JS: `js/modules/modal.js` — строки 310–401
- CSS: `css/modal.css` — строки 6–467
- CSS: `css/flip-modal.css` — строки 11–32

**Структура DOM:**
```html
<div id="modal" class="modal" style="display: none;">
  <div class="modal-content">
    <button class="pdf-export-icon-btn">...</button>
    <div id="element-title">...</div>
    <div id="allotrope-tabs-placeholder">
      <button class="allotrope-tab active">...</button>
    </div>
    <div id="element-info">
      <div class="groups-container">
        <div class="info-group basic">...</div>
        <div class="info-group physical">...</div>
        <div class="info-group history">...</div>
        <div class="info-group facts">...</div>
      </div>
    </div>
    <button class="close">&times;</button>
  </div>
</div>
```

**Открытие (строки 310–365):**
1. Клик по `.element` в таблице
2. Вычисление позиции элемента для FLIP-анимации
3. Установка CSS-переменных `--start-x`, `--start-y` (строки 357–358)
4. `modal.style.display = "flex"` (строка 331)
5. `document.body.classList.add('modal-open')` (строка 332)
6. На десктопе (>1024px): scatter-эффект — элементы таблицы разлетаются (строки 247–305)

**Закрытие (строки 370–389):**
1. `modal.classList.add('closing')` (строка 379)
2. `document.body.style.overflow = ""` (строка 383)
3. После `setTimeout(360)`:
   - `modal.style.display = "none"` (строка 386)
   - `modal.classList.remove('closing')`
4. Scatter-эффект: элементы возвращаются на место

**Анимации CSS:**
```css
/* css/modal.css:425-445 */
@keyframes modalOpen {
  0%   { opacity: 0; transform: translate(var(--start-x), var(--start-y)) scale(0.1); }
  100% { opacity: 1; transform: translate(0, 0) scale(1); }
}

@keyframes modalClose {
  0%   { opacity: 1; transform: translate(0, 0) scale(1); }
  100% { opacity: 0; transform: translate(var(--start-x), var(--start-y)) scale(0.1); }
}

@keyframes backdropOpen  { 0% { opacity: 0; } 100% { opacity: 1; } }
@keyframes backdropClose { 0% { opacity: 1; } 100% { opacity: 0; } }
```

**Backdrop blur (flip-modal.css:10-23):**
```css
#modal {
  backdrop-filter: blur(0px);
  transition: backdrop-filter var(--flip-backdrop-ms) var(--flip-backdrop-ease);
}
#modal[style*="display: flex"] {
  backdrop-filter: blur(8px);
}
```

**Особенности:**
- FLIP-анимация — модалка "вылетает" из кликнутого элемента таблицы
- Scatter-эффект — другие элементы таблицы разлетаются (только десктоп)
- Коллапсируемые секции `.info-group` с transition: `all 0.3s ease-in-out`

---

#### 2. Электронная конфигурация (`#electron-config-modal`)

**Файлы:**
- JS: `js/modules/electron-config.js`
- CSS: `css/electron-config.css`
- CSS: `css/flip-modal.css` — строки 119–138

**Открытие:**
- Клик по строке "Электронная конфигурация" в модалке элемента
- `modal.style.display = "flex"`
- Анимация `electronConfigOpen`

**Закрытие:**
- Кнопка `#electron-config-close`
- `.closing` → `setTimeout(360)` → `display: none`

**Анимации CSS (flip-modal.css:119-138):**
```css
@keyframes electronConfigOpen {
  0%   { opacity: 0; transform: translateY(-30px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

**Backdrop blur:** 10px (самый сильный — модалка поверх модалки)

**Особенности:**
- z-index: 120000 — выше всех, т.к. открывается поверх модалки элемента
- Содержит визуализацию электронных орбиталей

---

#### 3. Таблица растворимости (`#solubility-modal`)

**Файлы:**
- JS: `js/solubility/modal.js` — строки 1–238
- CSS: `css/solubility.css`
- CSS: `css/flip-modal.css` — строки 66–86

**Открытие (строки 16–110):**
1. `window.openSolubility()` — async функция
2. `modal.classList.remove('closing')`
3. `modal.style.display = 'flex'` (строка 39)
4. `document.body.classList.add('solubility-open')` (строка 40)
5. Ленивая загрузка таблицы (строки 26–31)
6. Инициализация фильтров, drag-scroll, продвинутого режима

**Закрытие (строки 112–154):**
1. `modal.classList.add('closing')` (строка 117)
2. После `setTimeout(360)`:
   - `modal.style.display = 'none'` (строка 121)
   - `document.body.classList.remove('solubility-open')` (строка 123)
3. Сброс панелей и фильтров (строки 139–153)

**Анимации CSS (flip-modal.css:145-165):**
```css
@keyframes slideUpModal {
  0%   { opacity: 0; transform: translateY(40px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes slideDownModal {
  0%   { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(30px) scale(0.96); }
}
```

**Мобилка (flip-modal.css:218-258):**
```css
@keyframes slideUpMobile {
  0%   { opacity: 0; transform: translateY(100%); }
  100% { opacity: 1; transform: translateY(0); }
}
```

**Backdrop blur:** 9px

**Особенности:**
- Содержит вложенные панели: `#solubility-search-panel`, `#activity-series-panel`
- Открывает вложенную модалку — Advanced Mode

---

#### 4. Продвинутый режим (`#advanced-substance-modal`)

**Файлы:**
- JS: `js/solubility/advanced-modal.js` — строки 1–594
- CSS: `css/advanced-modal.css` — строки 1–617
- CSS: `css/flip-modal.css` — строки 92–113

**Открытие (строки 32–37):**
1. `openAdvancedModal(cationFormula, anionFormula)`
2. `advancedModal.classList.remove('closing')` (строка 34)
3. `advancedModal.style.display = 'flex'` (строка 35)
4. `document.body.classList.add('advanced-modal-open')` (строка 36)

**Закрытие (строки 39–49):**
1. `advancedModal.classList.add('closing')` (строка 41)
2. После `setTimeout(360)`:
   - `display = 'none'` (строка 45)
   - Убирает body-класс (строка 47)

**Анимации CSS:**
```css
/* flip-modal.css:167-187 */
@keyframes scaleInModal {
  0%   { opacity: 0; transform: scale(0.85); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes scaleOutModal {
  0%   { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.88); }
}

/* advanced-modal.css:73-82 */
@keyframes slideInModal {
  from { opacity: 0; transform: translateY(-50px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Backdrop blur:** 7px + `backdrop-filter: blur(3px)` на самом элементе

**Особенности:**
- Табы с fade-анимацией
- SVG визуализации (кристаллы, колбы)
- Содержит информацию о разложении веществ

---

#### 5. Калькулятор (`#calc-panel`)

**Файлы:**
- JS: `js/modules/calculator.js` — строки 321–417
- CSS: `css/calculator.css`

**Паттерн:** B (через `.active` класс)

**Открытие (строки 322–362):**
1. `toggleCalc()` — вызывается FAB-кнопкой
2. Вычисление позиции между элементами Mg, Al, H, K (десктоп)
3. `calcPanel.classList.add('active')`
4. `document.body.classList.add('calc-active')`

**Закрытие (строки 337–350):**
1. `calcPanel.classList.add('closing')` (строка 337)
2. `document.body.classList.remove('calc-active')`
3. После `setTimeout(360)`: убирает `active` и `closing`

**Анимации CSS:**
```css
/* Десктоп */
@keyframes calcPanelOpen {
  0%   { opacity: 0; transform: scale(0.985) translateY(12px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes calcPanelClose {
  0%   { opacity: 1; transform: scale(1) translateY(0); }
  100% { opacity: 0; transform: scale(0.985) translateY(12px); }
}

/* Мобилка — bottom sheet */
@keyframes calcSheetOpen {
  0%   { transform: translateY(100%); }
  100% { transform: translateY(0); }
}
@keyframes calcSheetClose {
  0%   { transform: translateY(0); }
  100% { transform: translateY(100%); }
}
```

**Особенности:**
- Drag & drop атомов из таблицы
- Динамическое перепозиционирование при resize
- На мобилке блокирует вертикальный скролл

---

#### 6. Фильтры (`#filters-panel`)

**Файлы:**
- JS: `js/modules/search-filters.js` — строки 366–452
- CSS: `css/filters.css`

**Паттерн:** B (через `.active` класс)

**Открытие (строка 366):**
1. `toggleFilters()` — вызывается FAB-кнопкой
2. `panel.classList.add('active')`
3. Убирает `closing` (строка 398)

**Закрытие (строки 394–396):**
1. `panel.classList.add('closing')`
2. После `setTimeout(360)`: убирает `active` и `closing`

**Анимации CSS:**
```css
@keyframes filtersOpen {
  0%   { opacity: 0; transform: translateY(16px) scale(0.985); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes filtersClose {
  0%   { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(16px) scale(0.985); }
}
```

**Особенности:**
- Содержит поисковую строку с live-результатами
- Кнопки фильтрации по категориям
- Умное закрытие: если перекрывает кликнутый элемент

---

#### 7. Уравниватель (`#balancer-panel`)

**Файлы:**
- JS: `js/modules/balancer.js` — строки 1–120+
- CSS: `css/balancer.css`

**Паттерн:** B (через `.active` класс)

**Открытие (строки 66–120):**
1. `window.toggleBalancer(event)`
2. Сохраняет позицию скролла
3. `panel.classList.add('active')`
4. `document.body.classList.add('balancer-active')`

**Закрытие (строки 10–53):**
1. `panel.classList.add('closing')`
2. `document.body.classList.remove('balancer-active')`
3. После `setTimeout(360)`: убирает `active` и `closing`
4. Восстанавливает позицию скролла (строки 37–41)

**Анимации CSS:**
```css
/* Десктоп */
@keyframes balancerOpen { ... }  /* scale + translateY */
@keyframes balancerClose { ... }

/* Мобилка — bottom sheet */
@keyframes balancerSheetOpen {
  0%   { transform: translateY(100%); }
  100% { transform: translateY(0); }
}
@keyframes balancerSheetClose {
  0%   { transform: translateY(0); }
  100% { transform: translateY(100%); }
}
```

**Особенности:**
- `pointer-events: none` когда неактивен (предотвращает "зомби-хитбокс")
- Восстановление скролла при закрытии

---

### 1.4. Глобальные CSS-переменные

Определены в `css/base.css:24-29`:

```css
:root {
  --flip-move-ms: 360ms;
  --flip-radius-ms: 360ms;
  --flip-backdrop-ms: 260ms;
  --flip-ease: cubic-bezier(0.2, 0.0, 0.0, 1);
  --flip-backdrop-ease: cubic-bezier(0.2, 0.0, 0.0, 1);
}
```

### 1.5. Глобальные отключения анимаций

```css
/* css/modal.css:46-51 — режим обоев */
body.wallpaper-optimized .modal,
body.wallpaper-optimized .modal * {
  animation: none !important;
  transition: none !important;
}

/* css/flip-modal.css:293-310 — системная настройка */
@media (prefers-reduced-motion: reduce) {
  #modal, #solubility-modal, #advanced-substance-modal, #electron-config-modal {
    transition-duration: 0.01ms !important;
    backdrop-filter: none !important;
  }
}
```

### 1.6. Тёмная тема

```css
/* flip-modal.css:260-269 */
.dark-theme #modal,
.dark-theme #solubility-modal,
.dark-theme #advanced-substance-modal,
.dark-theme #electron-config-modal {
  background-color: rgba(0, 0, 0, 0.65);
}
```

### 1.7. Стек z-index (сверху вниз)

```
120000  Электронная конфигурация (#electron-config-modal)
 70000  Продвинутый режим (#advanced-substance-modal)
 60000  Калькулятор (#calc-panel)
 51000  Фильтры (#filters-panel)
  2000  Таблица растворимости (#solubility-modal)
  1000  Модалка элемента (#modal)
  1000  Уравниватель (#balancer-panel) — с pointer-events
```

---

## Часть 2. Проблемы текущей реализации

### 2.1. `display: none` убивает анимации

CSS **не может анимировать** свойство `display`. Когда выполняется `modal.style.display = "flex"`, элемент появляется мгновенно в DOM. Анимация открытия работает только потому, что свойство `animation` прописано в базовых стилях и перезапускается при смене `display` — но это **ненадёжно**.

**Почему ломается:**
- Браузер может объединить смену `display` и первый кадр анимации в один layout pass
- Анимация "проглатывается" — модалка появляется без плавности
- Особенно заметно при повторном открытии (keyframes не перезапускаются)

**Решение:** `requestAnimationFrame` + force reflow (`void element.offsetHeight`) между сменой `display` и добавлением анимационного класса.

### 2.2. `setTimeout(360)` — хрупкая синхронизация

Жёсткий таймаут не гарантирует, что CSS-анимация завершилась:
- При нагрузке на CPU анимация может длиться дольше 360ms
- `setTimeout` с минимальным разрешением 4ms может сработать раньше
- Модалка исчезает (`display: none`) до завершения анимации → дёрганый эффект

**Решение:** Слушать событие `animationend` на анимируемом элементе. Таймаут оставить как fallback (на случай если событие не сработает).

### 2.3. Race condition: быстрый open → close → open

Сценарий:
1. Пользователь кликает — модалка открывается
2. Быстро кликает закрыть — запускается `setTimeout(360)` на скрытие
3. Ещё быстрее кликает открыть снова
4. Модалка показывается (`display: flex`)
5. **Через ~300ms срабатывает `setTimeout` от шага 2** → `display: none`
6. Модалка исчезает "сама по себе"

**Решение:** Конечный автомат состояний + отмена предыдущих операций при смене состояния.

### 2.4. Дублирование кода

Каждая модалка реализует один и тот же цикл вручную: show → animate → wait → hide → cleanup. Это ~30–50 строк повторяющегося кода × 7 модалок = ~250 строк дублирования. Любое изменение в логике анимаций требует правок в 7 местах.

### 2.5. Нет единого управления фокусом и скроллом

- Блокировка скролла: в одних местах `body.style.overflow = "hidden"`, в других — через body-класс
- Нет trap focus (фокус может уйти за модалку при Tab)
- Нет восстановления фокуса при закрытии (кроме уравнивателя, который восстанавливает скролл)

---

## Часть 3. Требования к библиотеке анимаций

### 3.1. Функциональные требования

| # | Требование | Приоритет |
|---|-----------|-----------|
| F1 | Надёжное открытие: гарантированный запуск анимации после `display: flex` | Критический |
| F2 | Надёжное закрытие: `display: none` только после реального `animationend` | Критический |
| F3 | Защита от race condition: отмена предыдущей операции при новой | Критический |
| F4 | Поддержка обоих паттернов: `display` и `.active` класс | Критический |
| F5 | Конфигурируемые пресеты анимаций для каждой модалки | Высокий |
| F6 | Раздельные анимации для desktop и mobile | Высокий |
| F7 | Поддержка `prefers-reduced-motion` — мгновенное open/close | Высокий |
| F8 | Поддержка `wallpaper-optimized` режима | Высокий |
| F9 | Хуки: `beforeOpen`, `onOpen`, `beforeClose`, `onClose` | Высокий |
| F10 | Динамические CSS-переменные перед анимацией (для FLIP) | Высокий |
| F11 | Fallback таймаут если `animationend` не сработает | Средний |
| F12 | Управление скроллом body (блокировка/восстановление) | Средний |
| F13 | Backdrop клик — закрытие | Средний |
| F14 | Escape — закрытие | Средний |

### 3.2. Нефункциональные требования

| # | Требование |
|---|-----------|
| N1 | Нулевые зависимости — чистый vanilla JS |
| N2 | Размер: < 3 КБ minified |
| N3 | Поэтапная миграция: можно переводить по одной модалке |
| N4 | Не ломает существующие CSS @keyframes — переиспользует их |
| N5 | Использует существующие CSS-переменные (`--flip-move-ms`, `--flip-ease`) |
| N6 | Совместимость: Chrome 80+, Firefox 78+, Safari 13+ |

---

## Часть 4. Проект библиотеки ModalAnim

### 4.1. Конечный автомат состояний

```
         open()                    close()
           │                         │
           ▼                         ▼
┌────────────────┐           ┌────────────────┐
│    OPENING     │──────────▶│     OPEN       │
│  (анимация     │  animEnd  │  (стабильное   │
│   открытия)    │           │   состояние)   │
└────────────────┘           └────────────────┘
       ▲                           │
       │                     close()
       │                           │
       │                           ▼
┌────────────────┐           ┌────────────────┐
│    CLOSED      │◀──────────│   CLOSING      │
│  (display:none │  animEnd  │  (анимация     │
│   или !active) │           │   закрытия)    │
└────────────────┘           └────────────────┘
       ▲                           │
       │           open()          │
       └───────────────────────────┘
              (отмена закрытия,
               сразу → OPENING)
```

**Переходы:**
- `CLOSED` → `open()` → `OPENING` → `animationend` → `OPEN`
- `OPEN` → `close()` → `CLOSING` → `animationend` → `CLOSED`
- `CLOSING` → `open()` → отмена закрытия → `OPENING` (без промежуточного CLOSED)
- `OPENING` → `close()` → отмена открытия → `CLOSING`

### 4.2. Пресеты анимаций

6 пресетов покрывают все 7 модалок + мобильные варианты:

```
┌──────────────────┬──────────────────────┬──────────────────────────────────┐
│ Пресет           │ Модалки              │ Описание                         │
├──────────────────┼──────────────────────┼──────────────────────────────────┤
│ flip-scale       │ Элемент              │ Scale от точки клика + translate  │
│ slide-down       │ Электронная конфиг.  │ translateY(-30px) → 0            │
│ slide-up         │ Растворимость        │ translateY(40px) + scale(0.95)   │
│ scale-fade       │ Продвинутый режим    │ scale(0.85) → 1 + opacity        │
│ panel-pop        │ Калькулятор, Фильтры │ scale(0.985) + translateY(12px)  │
│ bottom-sheet     │ Мобилка (3 панели)   │ translateY(100%) → 0             │
└──────────────────┴──────────────────────┴──────────────────────────────────┘
```

Каждый пресет — это просто пара имён CSS @keyframes (open + close). Библиотека не генерирует CSS, а ссылается на существующие `@keyframes`.

### 4.3. API библиотеки

```js
// ═══════════════════════════════════════════════
// РЕГИСТРАЦИЯ
// ═══════════════════════════════════════════════

ModalAnim.register(name, config)

// name: string — уникальное имя модалки
// config: {
//   el:          string | Element,  // селектор или DOM-элемент (backdrop)
//   content:     string | Element,  // селектор анимируемого контента (опц.)
//   mode:        'display' | 'class', // паттерн видимости
//   displayValue: 'flex',           // значение для display (по умолчанию 'flex')
//   activeClass:  'active',         // имя класса для mode:'class'
//   closingClass: 'closing',        // имя класса при закрытии
//
//   bodyClass:   string | null,     // класс на body при открытии
//   lockScroll:  boolean,           // блокировать скролл body
//   closeOnBackdrop: boolean,       // закрытие по клику на фон
//   closeOnEscape:   boolean,       // закрытие по Escape
//
//   animation: {                    // ИЛИ строка-пресет: 'slide-up'
//     desktop: { open: string, close: string },  // имена @keyframes
//     mobile:  { open: string, close: string },  // мобильные @keyframes
//   },
//   mobileBreakpoint: 1024,         // порог переключения desktop/mobile
//
//   // Хуки жизненного цикла
//   beforeOpen(el, context):  void,  // перед показом (CSS vars, подготовка)
//   onOpen(el):               void,  // после завершения анимации открытия
//   beforeClose(el):          void,  // перед запуском анимации закрытия
//   onClose(el):              void,  // после полного скрытия
// }


// ═══════════════════════════════════════════════
// УПРАВЛЕНИЕ
// ═══════════════════════════════════════════════

ModalAnim.open(name, context?)     // открыть (context передаётся в beforeOpen)
ModalAnim.close(name)              // закрыть
ModalAnim.toggle(name, context?)   // переключить
ModalAnim.isOpen(name)             // boolean — открыта ли
ModalAnim.getState(name)           // 'closed' | 'opening' | 'open' | 'closing'


// ═══════════════════════════════════════════════
// УТИЛИТЫ
// ═══════════════════════════════════════════════

ModalAnim.closeAll()               // закрыть все открытые модалки
ModalAnim.destroy(name)            // удалить регистрацию + слушатели
```

### 4.4. Примеры регистрации для каждой модалки

```js
// ─── 1. Модалка элемента ───
ModalAnim.register('element', {
  el: '#modal',
  content: '.modal-content',
  mode: 'display',
  bodyClass: 'modal-open',
  lockScroll: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
  animation: {
    desktop: { open: 'modalOpen', close: 'modalClose' },
    mobile:  { open: 'slideUpMobile', close: 'slideDownMobile' },
  },
  beforeOpen(el, ctx) {
    // FLIP: задать стартовую позицию
    const content = el.querySelector('.modal-content');
    content.style.setProperty('--start-x', ctx.startX + 'px');
    content.style.setProperty('--start-y', ctx.startY + 'px');
  },
  onOpen() {
    // scatter-эффект уже запущен ранее, ничего лишнего
  },
  onClose() {
    document.body.style.overflow = '';
  },
});

// Вызов:
element.addEventListener('click', (e) => {
  const rect = e.target.getBoundingClientRect();
  ModalAnim.open('element', {
    startX: rect.left - window.innerWidth / 2,
    startY: rect.top - window.innerHeight / 2,
  });
});


// ─── 2. Электронная конфигурация ───
ModalAnim.register('electron-config', {
  el: '#electron-config-modal',
  content: '.electron-config-content',
  mode: 'display',
  closeOnBackdrop: true,
  closeOnEscape: true,
  animation: 'slide-down',   // пресет (translateY сверху)
});


// ─── 3. Таблица растворимости ───
ModalAnim.register('solubility', {
  el: '#solubility-modal',
  content: '.solubility-content',
  mode: 'display',
  bodyClass: 'solubility-open',
  lockScroll: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
  animation: {
    desktop: { open: 'slideUpModal', close: 'slideDownModal' },
    mobile:  { open: 'slideUpMobile', close: 'slideDownMobile' },
  },
  beforeClose() {
    // Сброс панелей и фильтров
  },
});


// ─── 4. Продвинутый режим ───
ModalAnim.register('advanced', {
  el: '#advanced-substance-modal',
  content: '.advanced-modal-content',
  mode: 'display',
  bodyClass: 'advanced-modal-open',
  closeOnBackdrop: true,
  closeOnEscape: true,
  animation: {
    desktop: { open: 'scaleInModal', close: 'scaleOutModal' },
    mobile:  { open: 'slideUpMobile', close: 'slideDownMobile' },
  },
});


// ─── 5. Калькулятор ───
ModalAnim.register('calculator', {
  el: '#calc-panel',
  mode: 'class',
  activeClass: 'active',
  bodyClass: 'calc-active',
  lockScroll: false,        // мобилка отдельно
  closeOnEscape: true,
  animation: {
    desktop: { open: 'calcPanelOpen', close: 'calcPanelClose' },
    mobile:  { open: 'calcSheetOpen', close: 'calcSheetClose' },
  },
  beforeOpen(el) {
    // Пересчёт позиции между Mg, Al, H, K
  },
});


// ─── 6. Фильтры ───
ModalAnim.register('filters', {
  el: '#filters-panel',
  mode: 'class',
  activeClass: 'active',
  closeOnEscape: true,
  animation: {
    desktop: { open: 'filtersOpen', close: 'filtersClose' },
  },
});


// ─── 7. Уравниватель ───
ModalAnim.register('balancer', {
  el: '#balancer-panel',
  mode: 'class',
  activeClass: 'active',
  bodyClass: 'balancer-active',
  closeOnEscape: true,
  animation: {
    desktop: { open: 'balancerOpen', close: 'balancerClose' },
    mobile:  { open: 'balancerSheetOpen', close: 'balancerSheetClose' },
  },
  beforeOpen() {
    // Сохранить позицию скролла
  },
  onClose() {
    // Восстановить позицию скролла
  },
});
```

### 4.5. Внутренняя реализация (ядро)

```js
class ModalAnim {
  static #modals = new Map();
  static #reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ═══════════════════════════════════════
  // РЕГИСТРАЦИЯ
  // ═══════════════════════════════════════

  static register(name, config) {
    const el = typeof config.el === 'string'
      ? document.querySelector(config.el)
      : config.el;

    const content = config.content
      ? (typeof config.content === 'string' ? el.querySelector(config.content) : config.content)
      : el;

    const modal = {
      name,
      el,
      content,                                // элемент, на котором слушаем animationend
      mode: config.mode || 'display',
      displayValue: config.displayValue || 'flex',
      activeClass: config.activeClass || 'active',
      closingClass: config.closingClass || 'closing',
      bodyClass: config.bodyClass || null,
      lockScroll: config.lockScroll ?? false,
      closeOnBackdrop: config.closeOnBackdrop ?? false,
      closeOnEscape: config.closeOnEscape ?? false,
      animation: ModalAnim.#resolveAnimation(config.animation),
      mobileBreakpoint: config.mobileBreakpoint || 1024,
      hooks: {
        beforeOpen:  config.beforeOpen  || null,
        onOpen:      config.onOpen      || null,
        beforeClose: config.beforeClose || null,
        onClose:     config.onClose     || null,
      },
      state: 'closed',               // closed | opening | open | closing
      _animCleanup: null,            // функция отмены текущей анимации
      _fallbackTimer: null,          // fallback таймаут
    };

    // Навешиваем backdrop клик
    if (modal.closeOnBackdrop) {
      el.addEventListener('click', (e) => {
        if (e.target === el) ModalAnim.close(name);
      });
    }

    // Escape
    if (modal.closeOnEscape) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.state === 'open') {
          ModalAnim.close(name);
        }
      });
    }

    ModalAnim.#modals.set(name, modal);
  }


  // ═══════════════════════════════════════
  // ОТКРЫТИЕ
  // ═══════════════════════════════════════

  static open(name, context = {}) {
    const m = ModalAnim.#modals.get(name);
    if (!m) throw new Error(`ModalAnim: "${name}" not registered`);

    // Если уже открыта или открывается — ничего не делаем
    if (m.state === 'open' || m.state === 'opening') return;

    // Если закрывается — отменяем закрытие
    if (m.state === 'closing') {
      ModalAnim.#cancelAnimation(m);
    }

    m.state = 'opening';

    // Хук beforeOpen — для CSS vars, позиционирования
    m.hooks.beforeOpen?.(m.el, context);

    // 1. Показываем элемент
    if (m.mode === 'display') {
      m.el.style.display = m.displayValue;
    } else {
      m.el.classList.add(m.activeClass);
    }
    m.el.classList.remove(m.closingClass);

    // Body-класс и блокировка скролла
    if (m.bodyClass) document.body.classList.add(m.bodyClass);
    if (m.lockScroll) document.body.style.overflow = 'hidden';

    // 2. Reduced motion — мгновенно
    if (ModalAnim.#reducedMotion || document.body.classList.contains('wallpaper-optimized')) {
      m.state = 'open';
      m.hooks.onOpen?.(m.el);
      return;
    }

    // 3. Force reflow — КРИТИЧНО
    void m.el.offsetHeight;

    // 4. Применяем анимацию
    const anim = ModalAnim.#getCurrentAnimation(m);
    const target = m.content;
    target.style.animation = 'none';

    requestAnimationFrame(() => {
      target.style.animation = '';
      target.style.animationName = anim.open;

      // 5. Ждём animationend
      ModalAnim.#waitForAnimation(m, () => {
        m.state = 'open';
        m.hooks.onOpen?.(m.el);
      });
    });
  }


  // ═══════════════════════════════════════
  // ЗАКРЫТИЕ
  // ═══════════════════════════════════════

  static close(name) {
    const m = ModalAnim.#modals.get(name);
    if (!m) throw new Error(`ModalAnim: "${name}" not registered`);

    // Если уже закрыта или закрывается — ничего
    if (m.state === 'closed' || m.state === 'closing') return;

    // Если открывается — отменяем открытие
    if (m.state === 'opening') {
      ModalAnim.#cancelAnimation(m);
    }

    m.state = 'closing';

    // Хук beforeClose
    m.hooks.beforeClose?.(m.el);

    // Reduced motion — мгновенно
    if (ModalAnim.#reducedMotion || document.body.classList.contains('wallpaper-optimized')) {
      ModalAnim.#finalizeClose(m);
      return;
    }

    // Добавляем класс closing (переключает CSS на анимацию закрытия)
    m.el.classList.add(m.closingClass);

    // Применяем анимацию закрытия
    const anim = ModalAnim.#getCurrentAnimation(m);
    const target = m.content;
    target.style.animation = 'none';

    requestAnimationFrame(() => {
      target.style.animation = '';
      target.style.animationName = anim.close;

      // Ждём animationend
      ModalAnim.#waitForAnimation(m, () => {
        ModalAnim.#finalizeClose(m);
      });
    });
  }


  // ═══════════════════════════════════════
  // УТИЛИТЫ
  // ═══════════════════════════════════════

  static toggle(name, context = {}) {
    const m = ModalAnim.#modals.get(name);
    if (!m) throw new Error(`ModalAnim: "${name}" not registered`);

    if (m.state === 'closed' || m.state === 'closing') {
      ModalAnim.open(name, context);
    } else {
      ModalAnim.close(name);
    }
  }

  static isOpen(name) {
    const m = ModalAnim.#modals.get(name);
    return m ? (m.state === 'open' || m.state === 'opening') : false;
  }

  static getState(name) {
    return ModalAnim.#modals.get(name)?.state || null;
  }

  static closeAll() {
    for (const [name, m] of ModalAnim.#modals) {
      if (m.state !== 'closed') ModalAnim.close(name);
    }
  }

  static destroy(name) {
    const m = ModalAnim.#modals.get(name);
    if (m) {
      ModalAnim.#cancelAnimation(m);
      ModalAnim.#modals.delete(name);
    }
  }


  // ═══════════════════════════════════════
  // ПРИВАТНЫЕ МЕТОДЫ
  // ═══════════════════════════════════════

  static #finalizeClose(m) {
    // Скрываем элемент
    if (m.mode === 'display') {
      m.el.style.display = 'none';
    } else {
      m.el.classList.remove(m.activeClass);
    }
    m.el.classList.remove(m.closingClass);

    // Снимаем body-класс и скролл
    if (m.bodyClass) document.body.classList.remove(m.bodyClass);
    if (m.lockScroll) document.body.style.overflow = '';

    m.state = 'closed';

    // Хук onClose
    m.hooks.onClose?.(m.el);
  }

  static #waitForAnimation(m, callback) {
    const target = m.content;

    // Одноразовый обработчик animationend
    const onEnd = (e) => {
      if (e.target !== target) return; // игнорируем всплытие от дочерних
      clearTimeout(m._fallbackTimer);
      m._animCleanup = null;
      callback();
    };

    target.addEventListener('animationend', onEnd, { once: true });

    // Fallback — если animationend не сработает (400ms > 360ms анимации)
    m._fallbackTimer = setTimeout(() => {
      target.removeEventListener('animationend', onEnd);
      m._animCleanup = null;
      callback();
    }, 400);

    // Сохраняем функцию отмены
    m._animCleanup = () => {
      target.removeEventListener('animationend', onEnd);
      clearTimeout(m._fallbackTimer);
    };
  }

  static #cancelAnimation(m) {
    if (m._animCleanup) {
      m._animCleanup();
      m._animCleanup = null;
    }
    m.el.classList.remove(m.closingClass);
    m.content.style.animation = '';
  }

  static #getCurrentAnimation(m) {
    const isMobile = window.innerWidth <= m.mobileBreakpoint;
    const anim = m.animation;
    if (isMobile && anim.mobile) return anim.mobile;
    return anim.desktop;
  }

  static #resolveAnimation(anim) {
    if (typeof anim === 'string') {
      return ModalAnim.#PRESETS[anim] || ModalAnim.#PRESETS['scale-fade'];
    }
    return {
      desktop: anim.desktop || { open: '', close: '' },
      mobile:  anim.mobile  || null,
    };
  }

  // Встроенные пресеты (ссылаются на СУЩЕСТВУЮЩИЕ @keyframes)
  static #PRESETS = {
    'flip-scale': {
      desktop: { open: 'modalOpen', close: 'modalClose' },
      mobile:  { open: 'slideUpMobile', close: 'slideDownMobile' },
    },
    'slide-down': {
      desktop: { open: 'electronConfigOpen', close: 'electronConfigClose' },
    },
    'slide-up': {
      desktop: { open: 'slideUpModal', close: 'slideDownModal' },
      mobile:  { open: 'slideUpMobile', close: 'slideDownMobile' },
    },
    'scale-fade': {
      desktop: { open: 'scaleInModal', close: 'scaleOutModal' },
      mobile:  { open: 'slideUpMobile', close: 'slideDownMobile' },
    },
    'panel-pop': {
      desktop: { open: 'calcPanelOpen', close: 'calcPanelClose' },
      mobile:  { open: 'calcSheetOpen', close: 'calcSheetClose' },
    },
    'bottom-sheet': {
      desktop: { open: 'calcSheetOpen', close: 'calcSheetClose' },
      mobile:  { open: 'calcSheetOpen', close: 'calcSheetClose' },
    },
  };
}
```

### 4.6. План миграции

Миграция поэтапная — по одной модалке за раз. Порядок от простой к сложной:

```
Этап 1: Фильтры (#filters-panel)
   Самая простая панель, паттерн B, нет вложенной логики.
   Цель: проверить что библиотека работает.

Этап 2: Уравниватель (#balancer-panel)
   Паттерн B, но есть сохранение/восстановление скролла.
   Цель: проверить хуки beforeOpen/onClose.

Этап 3: Калькулятор (#calc-panel)
   Паттерн B, динамическое позиционирование.
   Цель: проверить beforeOpen с вычислением позиции.

Этап 4: Продвинутый режим (#advanced-substance-modal)
   Паттерн A, вложенные табы.
   Цель: проверить паттерн display + хуки.

Этап 5: Таблица растворимости (#solubility-modal)
   Паттерн A, ленивая загрузка, вложенные панели.
   Цель: проверить async open, вложенные панели.

Этап 6: Электронная конфигурация (#electron-config-modal)
   Паттерн A, модалка-поверх-модалки.
   Цель: проверить стек z-index.

Этап 7: Модалка элемента (#modal)
   Самая сложная: FLIP, scatter, CSS-переменные.
   Цель: проверить beforeOpen с динамическими CSS vars.
```

Для каждого этапа:
1. Добавить `ModalAnim.register(...)` в инициализацию модалки
2. Заменить ручной `open()` на `ModalAnim.open(name, context)`
3. Заменить ручной `close()` на `ModalAnim.close(name)`
4. Удалить старый код (setTimeout, classList.add/remove('closing'), display = ...)
5. Протестировать: нормальное открытие/закрытие, быстрый двойной клик, мобилка, reduced motion

### 4.7. Файловая структура

```
js/
├── lib/
│   └── modal-anim.js          ← библиотека (~2-3 КБ)
├── modules/
│   ├── modal.js                ← заменить ручную логику на ModalAnim.open/close
│   ├── electron-config.js      ← заменить
│   ├── calculator.js           ← заменить
│   ├── search-filters.js       ← заменить
│   └── balancer.js             ← заменить
└── solubility/
    ├── modal.js                ← заменить
    └── advanced-modal.js       ← заменить
```

---

## Часть 5. Карта существующих @keyframes

Все анимации, которые библиотека будет переиспользовать (не создавать):

### Модалка элемента
| Keyframe | Файл | Строки | Описание |
|----------|------|--------|----------|
| `modalOpen` | `css/modal.css` | 425-432 | Scale 0.1→1 от позиции клика |
| `modalClose` | `css/modal.css` | 434-441 | Обратно к позиции клика |
| `backdropOpen` | `css/modal.css` | 449-452 | Opacity 0→1 |
| `backdropClose` | `css/modal.css` | 454-457 | Opacity 1→0 |

### Растворимость
| Keyframe | Файл | Строки | Описание |
|----------|------|--------|----------|
| `slideUpModal` | `css/flip-modal.css` | 145-152 | translateY(40px)→0, scale 0.95→1 |
| `slideDownModal` | `css/flip-modal.css` | 154-161 | Обратно |

### Продвинутый режим
| Keyframe | Файл | Строки | Описание |
|----------|------|--------|----------|
| `scaleInModal` | `css/flip-modal.css` | 167-174 | scale(0.85)→1 |
| `scaleOutModal` | `css/flip-modal.css` | 176-183 | scale(1)→scale(0.88) |
| `slideInModal` | `css/advanced-modal.css` | 73-82 | translateY(-50px)→0 |

### Электронная конфигурация
| Keyframe | Файл | Строки | Описание |
|----------|------|--------|----------|
| `electronConfigOpen` | `css/flip-modal.css` | 119-126 | translateY(-30px)→0 |

### Мобильные (общие)
| Keyframe | Файл | Строки | Описание |
|----------|------|--------|----------|
| `slideUpMobile` | `css/flip-modal.css` | 218-225 | translateY(100%)→0 |
| `slideDownMobile` | `css/flip-modal.css` | 227-234 | translateY(0)→100% |

### Калькулятор
| Keyframe | Файл | Описание |
|----------|------|----------|
| `calcPanelOpen` | `css/calculator.css` | scale(0.985)→1, translateY(12px)→0 |
| `calcPanelClose` | `css/calculator.css` | Обратно |
| `calcSheetOpen` | `css/calculator.css` | translateY(100%)→0 (мобилка) |
| `calcSheetClose` | `css/calculator.css` | Обратно |

### Фильтры
| Keyframe | Файл | Описание |
|----------|------|----------|
| `filtersOpen` | `css/filters.css` | translateY(16px)→0, scale(0.985)→1 |
| `filtersClose` | `css/filters.css` | Обратно |

### Уравниватель
| Keyframe | Файл | Описание |
|----------|------|----------|
| `balancerOpen` | `css/balancer.css` | scale + translateY |
| `balancerClose` | `css/balancer.css` | Обратно |
| `balancerSheetOpen` | `css/balancer.css` | translateY(100%)→0 |
| `balancerSheetClose` | `css/balancer.css` | Обратно |

---

## Часть 6. Чек-лист для тестирования

Для каждой мигрированной модалки проверить:

- [ ] Обычное открытие — анимация плавная, без "прыжка"
- [ ] Обычное закрытие — анимация плавная, элемент скрывается после анимации
- [ ] Быстрый двойной клик (open → close → open) — нет глитчей
- [ ] Быстрый тройной клик — модалка стабильна
- [ ] Закрытие по клику на backdrop
- [ ] Закрытие по Escape
- [ ] Мобильный размер экрана — правильная анимация (bottom-sheet и т.д.)
- [ ] `prefers-reduced-motion` — мгновенное открытие/закрытие без анимации
- [ ] `body.wallpaper-optimized` — мгновенное открытие/закрытие
- [ ] Тёмная тема — backdrop-цвет корректный
- [ ] Скролл body заблокирован при открытой модалке (если `lockScroll: true`)
- [ ] Скролл body восстановлен после закрытия
- [ ] Вложенные модалки (электронная конфигурация поверх элемента) работают
- [ ] Все хуки вызываются в правильном порядке
