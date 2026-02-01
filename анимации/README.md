# FlipModalAnimator

Interruptible FLIP/shared-element modal transition controller (headless).

Библиотека решает одну задачу:  
**модалка разворачивается из кнопки и сворачивается обратно** — с возможностью
мгновенно прерывать анимацию и ретаргетить источник без ожиданий и «хвостов».

---

## Ключевые свойства

- FLIP / shared-element переходы
- Полная interruptibility (на любом кадре)
- Retarget (переключение источника на лету)
- Headless: без HTML и CSS, работает с переданным DOM
- Подходит для Vanilla / React / Vue / любого фреймворка
- Без таймеров, без ожиданий окончания анимаций

---

## Минимальные требования к DOM

Внутри одного контейнера:

- container — фиксированный контейнер (экран)
- overlay — полноэкранный элемент (shared element)
- backdrop — фон под overlay
- sources — элементы-источники (кнопки)

```html
<div class="screen">
  <button id="btn-uran">уран</button>
  <button id="btn-pluton">плутон</button>

  <div id="backdrop"></div>

  <div id="overlay">
    <div id="content">
      <div id="title"></div>
      <button id="close">Закрыть</button>
    </div>
  </div>
</div>
```

---

## Обязательный CSS

```css
.screen {
  position: relative;
  overflow: hidden;
}

#overlay {
  position: absolute;
  inset: 0;
  display: none;
  transform-origin: top left;
  will-change: transform, border-radius;
}

#backdrop {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
}
```

### Рекомендуемый blur (без WAAPI)

```css
#backdrop {
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  transition:
    backdrop-filter 420ms cubic-bezier(0.2,0,0,1),
    -webkit-backdrop-filter 420ms cubic-bezier(0.2,0,0,1);
}
```

---

## Подключение

Файл библиотеки: `flip-modal-animator.js`

Импорт как ES-модуль:

```js
import { FlipModalAnimator } from "./flip-modal-animator.js";
```

Инициализация:

```js
const animator = new FlipModalAnimator({
  containerEl,
  overlayEl,
  backdropEl,
  contentEl,        // опционально
  sources: { uran, pluton },
  onActiveChange,   // смена темы / контента
  timing,
  visual,
});
```

---

## API

### Методы

- `openFrom(key)`
- `close()`
- `toggleFrom(key)`
- `retarget(key)`
- `getState()`

### options.timing

| поле | описание |
|----|----|
| moveMs | длительность transform |
| radiusMs | длительность скругления |
| backdropMs | длительность backdrop |
| ease | easing для transform |
| backdropEase | easing для backdrop |

### options.visual

| поле | описание |
|----|----|
| closedRadius | радиус кнопки |
| blurPx | величина blur |
| animateBackdropFilter | WAAPI blur (не рекомендуется на Android) |
| useCommitStyles | фиксировать кадр при прерывании |

---

## Поведение

- Повторные клики не ломают состояние
- Переключение источника не вызывает пауз
- Overlay никогда не размонтируется в середине анимации
- Backdrop и overlay всегда синхронизированы

---

## Что это за тип библиотеки

- Headless animation library
- Low-level animation controller
- FLIP / shared-element transition engine

Это **не компонент**, **не плагин**, **не фреймворк**.

---

## Лицензия

Добавь нужную (MIT / Apache-2.0 / Private).
