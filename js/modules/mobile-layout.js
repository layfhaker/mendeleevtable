(function() {
    'use strict';

    function initMobileTable() {
        // Проверяем, мобилка ли это
        if (window.innerWidth > 1024) return;

        console.log('🎨 Refining Mobile Layout (Colors, Size, Wrap)...');

        const container = document.querySelector('.container');
        const body = document.body;
        const lanthanides = document.querySelector('.lanthanides');
        const actinides = document.querySelector('.actinides');
        const allElements = document.querySelectorAll('.element');

        // ==========================================
        // 1. УМНЫЙ РАСЧЕТ РАЗМЕРОВ (Чтобы влезло по высоте)
        // ==========================================
        // Нам нужно уместить примерно 10 рядов (7 таблица + отступ + 2 нижних)
        // Оставляем место под верхнюю панель и нижнюю кнопку (~160px запаса)
        const availableHeight = window.innerHeight - 160; 
        
        // Вычисляем оптимальную высоту ячейки, но не больше 55px и не меньше 35px
        let calculatedSize = Math.floor(availableHeight / 11);
        if (calculatedSize > 55) calculatedSize = 55;
        if (calculatedSize < 38) calculatedSize = 38;

        const CELL_W = 58;           // Ширина фиксированная (удобно для пальца)
        const CELL_H = calculatedSize; // Высота динамическая
        const LA_HEIGHT = Math.floor(CELL_H * 0.75); // Сплюснутые лантаноиды (75% от высоты)
        
        const GAP = 3;
        
        // Размеры шрифтов относительно высоты клетки
        const FONT_SYM = Math.floor(CELL_H * 0.4) + 'px'; // Символ
        const FONT_NAME = Math.max(9, Math.floor(CELL_H * 0.18)) + 'px'; // Имя (мин 9px)
        const FONT_NUM = '10px';

        // ==========================================
        // 2. НАСТРОЙКА BODY
        // ==========================================
        body.style.overflowX = 'auto';
        body.style.overflowY = 'hidden'; // Вертикальный скролл убираем, должно влезать
        body.style.padding = '10px 20px'; // Чуть меньше отступы
        body.style.alignItems = 'flex-start'; // Прижимаем к верху (под отступом)

        // ==========================================
        // 3. НАСТРОЙКА ГЛАВНОГО КОНТЕЙНЕРА
        // ==========================================
        const tableWidth = (18 * CELL_W) + (17 * GAP);
        
        container.style.cssText = `
            display: grid !important;
            grid-template-columns: repeat(18, ${CELL_W}px) !important;
            grid-template-rows: repeat(7, ${CELL_H}px) !important;
            gap: ${GAP}px !important;
            width: ${tableWidth}px !important;
            min-width: ${tableWidth}px !important;
            margin: 0 auto !important;
            transform: none !important;
            margin-bottom: 10px !important; /* Отступ до нижних блоков */
        `;

        // ==========================================
        // 4. НАСТРОЙКА ЛАНТАНОИДОВ И АКТИНОИДОВ (СПЛЮСНУТЫЕ)
        // ==========================================
        const subTableWidth = (15 * CELL_W) + (14 * GAP);
        
        const styleSubTable = (el) => {
            if(!el) return;
            el.style.cssText = `
                display: grid !important;
                grid-template-columns: repeat(15, ${CELL_W}px) !important;
                grid-template-rows: ${LA_HEIGHT}px !important; /* Сплюснутая высота */
                gap: ${GAP}px !important;
                width: ${subTableWidth}px !important;
                margin-top: 5px !important;
                /* Сдвиг вправо, чтобы начинались примерно с 4-й группы */
                margin-left: ${(3 * CELL_W) + (3 * GAP)}px !important; 
                transform: none !important;
            `;
        };

        styleSubTable(lanthanides);
        styleSubTable(actinides);

        // ==========================================
        // 5. НАСТРОЙКА ЯЧЕЕК (ЦВЕТА И ТЕКСТ)
        // ==========================================
        allElements.forEach(el => {
            // ВАЖНО: Мы НЕ задаем background-color здесь, чтобы CSS классы работали!
            el.style.position = 'relative';
            el.style.display = 'flex';
            el.style.flexDirection = 'column';
            el.style.boxSizing = 'border-box';
            el.style.border = '1px solid rgba(0,0,0,0.1)';
            el.style.padding = '0';
            el.style.margin = '0';
            el.style.transform = 'none';
            // Возвращаем размеры, если это не спец-блок
            if (el.parentElement.classList.contains('lanthanides') || el.parentElement.classList.contains('actinides')) {
                 el.style.height = LA_HEIGHT + 'px';
            } else {
                 el.style.height = CELL_H + 'px';
            }
            el.style.width = CELL_W + 'px';

            const symbol = el.querySelector('.symbol');
            const name = el.querySelector('.name');
            const num = el.querySelector('.atomic-number');

            if (symbol) {
                symbol.style.cssText = `
                    font-size: ${FONT_SYM} !important;
                    font-weight: bold !important;
                    line-height: 1 !important;
                    position: absolute !important;
                    top: 40% !important; /* Чуть выше центра */
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    margin: 0 !important;
                    color: #333; /* Делаем текст темным для контраста, если фон светлый */
                `;
            }

            if (name) {
                // Логика переноса текста
                name.style.cssText = `
                    font-size: ${FONT_NAME} !important;
                    position: absolute !important;
                    bottom: 2px !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    width: 96% !important;
                    text-align: center !important;
                    line-height: 0.95 !important; /* Плотный интервал */
                    
                    /* РАЗРЕШАЕМ ПЕРЕНОС */
                    white-space: normal !important; 
                    word-wrap: break-word !important;
                    
                    /* Ограничиваем высоту, чтобы не лезло на символ */
                    max-height: 35% !important; 
                    overflow: hidden !important;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    color: #000;
                `;
            }

            if (num) {
                num.style.cssText = `
                    font-size: ${FONT_NUM} !important;
                    position: absolute !important;
                    top: 2px !important;
                    left: 3px !important;
                    line-height: 1 !important;
                    color: #555;
                `;
            }
        });
        
        console.log(`✅ Table resized. Cell H: ${CELL_H}px, L/A H: ${LA_HEIGHT}px`);
    }

    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileTable);
    } else {
        initMobileTable();
    }
    
    // Пересчет при повороте
    window.addEventListener('orientationchange', () => {
        setTimeout(initMobileTable, 300);
    });
    
    // Пересчет при ресайзе (на случай появления/скрытия панели браузера)
    window.addEventListener('resize', () => {
         // Делаем debounce, чтобы не мелькало
         clearTimeout(window.resizeTimer);
         window.resizeTimer = setTimeout(initMobileTable, 200);
    });

})();