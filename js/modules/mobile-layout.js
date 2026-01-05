(function() {
    'use strict';

    function initMobileTable() {
        if (window.innerWidth > 1024) return;

        console.log('🎨 Refining Mobile Layout (Unlocked Transform)...');

        const container = document.querySelector('.container');
        const body = document.body;
        const lanthanides = document.querySelector('.lanthanides');
        const actinides = document.querySelector('.actinides');
        const allElements = document.querySelectorAll('.element');

        // === ДОБАВИТЬ ЭТОТ БЛОК (Создание единой обертки) ===
        let wrapper = document.getElementById('mobile-table-wrapper');
        if (!wrapper && container && lanthanides && actinides) {
            // Создаем обертку
            wrapper = document.createElement('div');
            wrapper.id = 'mobile-table-wrapper';
            
            // Настраиваем стили обертки прямо здесь, чтобы они были приоритетными
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.alignItems = 'center';
            wrapper.style.width = '100%';
            wrapper.style.transformOrigin = 'top center';
            wrapper.style.transition = 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';

            // Вставляем обертку перед основной таблицей
            container.parentNode.insertBefore(wrapper, container);

            // Перемещаем элементы внутрь обертки
            wrapper.appendChild(container);
            wrapper.appendChild(lanthanides);
            wrapper.appendChild(actinides);
        }

        // ==========================================
        // 1. УМНЫЙ РАСЧЕТ РАЗМЕРОВ
        // ==========================================
        const availableHeight = window.innerHeight - 160; 
        
        let calculatedSize = Math.floor(availableHeight / 11);
        if (calculatedSize > 55) calculatedSize = 55;
        if (calculatedSize < 38) calculatedSize = 38;

        const CELL_W = 58;           
        const CELL_H = calculatedSize; 
        const LA_HEIGHT = Math.floor(CELL_H * 0.75);
        
        const GAP = 3;
        
        const FONT_SYM = Math.floor(CELL_H * 0.4) + 'px';
        const FONT_NAME = Math.max(9, Math.floor(CELL_H * 0.18)) + 'px';
        const FONT_NUM = '10px';

        // ==========================================
        // 2. НАСТРОЙКА BODY
        // ==========================================
        body.style.overflowX = 'auto';
        body.style.overflowY = 'hidden'; 
        body.style.padding = '10px 20px'; 
        body.style.alignItems = 'flex-start'; 

        // ==========================================
        // 3. НАСТРОЙКА ГЛАВНОГО КОНТЕЙНЕРА
        // ==========================================
        const tableWidth = (18 * CELL_W) + (17 * GAP);
        
        // ВАЖНО: НЕ трогаем transform/transition — они управляются CSS (calculator.css)
        container.style.cssText = `
            display: grid !important;
            grid-template-columns: repeat(18, ${CELL_W}px) !important;
            grid-template-rows: repeat(7, ${CELL_H}px) !important;
            gap: ${GAP}px !important;
            width: ${tableWidth}px !important;
            min-width: ${tableWidth}px !important;
            margin: 0 auto !important;
            margin-bottom: 10px !important;
        `;

        // ==========================================
        // 4. НАСТРОЙКА ЛАНТАНОИДОВ И АКТИНОИДОВ
        // ==========================================
        const subTableWidth = (15 * CELL_W) + (14 * GAP);
        
        const styleSubTable = (el) => {
            if(!el) return;
            // ВАЖНО: НЕ трогаем transform/transition — они управляются CSS (calculator.css)
            el.style.cssText = `
                display: grid !important;
                grid-template-columns: repeat(15, ${CELL_W}px) !important;
                grid-template-rows: ${LA_HEIGHT}px !important; 
                gap: ${GAP}px !important;
                width: ${subTableWidth}px !important;
                margin-top: 5px !important;
                margin-left: ${(3 * CELL_W) + (3 * GAP)}px !important;
            `;
        };

        styleSubTable(lanthanides);
        styleSubTable(actinides);

        // ==========================================
        // 5. НАСТРОЙКА ЯЧЕЕК
        // ==========================================
        allElements.forEach(el => {
            el.style.position = 'relative';
            el.style.display = 'flex';
            el.style.flexDirection = 'column';
            el.style.boxSizing = 'border-box';
            el.style.border = '1px solid rgba(0,0,0,0.1)';
            el.style.padding = '0';
            el.style.margin = '0';
            el.style.transform = 'none'; // Тут можно оставить, это сброс для самой ячейки

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
                    top: 40% !important; 
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    margin: 0 !important;
                `;
            }

            if (name) {
                name.style.cssText = `
                    font-size: ${FONT_NAME} !important;
                    position: absolute !important;
                    bottom: 2px !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    width: 96% !important;
                    text-align: center !important;
                    line-height: 0.95 !important; 
                    white-space: normal !important; 
                    word-wrap: break-word !important;
                    max-height: 35% !important; 
                    overflow: hidden !important;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                `;
            }

            if (num) {
                num.style.cssText = `
                    font-size: ${FONT_NUM} !important;
                    position: absolute !important;
                    top: 2px !important;
                    left: 3px !important;
                    line-height: 1 !important;
                `;
            }
        });
        
        console.log(`✅ Table resized. Cell H: ${CELL_H}px`);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileTable);
    } else {
        initMobileTable();
    }
    
    window.addEventListener('orientationchange', () => {
        setTimeout(initMobileTable, 300);
    });
    
    window.addEventListener('resize', () => {
         clearTimeout(window.resizeTimer);
         window.resizeTimer = setTimeout(initMobileTable, 200);
    });

})();