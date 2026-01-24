(function() {
    'use strict';

    const CONFIG = {
        TOP_MARGIN: 20,
        BOTTOM_GAP: 15,
        MIN_SCALE: 0.4,
        MAX_SCALE: 1.0,
        BODY_PADDING: 10,
        DEBUG: false
    };

    let state = {
        wrapperCreated: false,
        originalHeight: null
    };

    function isMobile() {
        return window.innerWidth <= 1024;
    }

    function getAbsoluteTop(element) {
        let top = 0;
        let el = element;
        while (el) {
            top += el.offsetTop;
            el = el.offsetParent;
        }
        return top;
    }

    function ensureWrapper() {
        if (!isMobile()) return null;
        
        let wrapper = document.getElementById('mobile-table-wrapper');
        if (wrapper) {
            state.wrapperCreated = true;
            return wrapper;
        }
        
        const container = document.querySelector('.container');
        const lanthanides = document.querySelector('.lanthanides');
        const actinides = document.querySelector('.actinides');
        
        if (!container) return null;
        
        wrapper = document.createElement('div');
        wrapper.id = 'mobile-table-wrapper';
        
        // ВАЖНО:
        // 1. align-self: center — даем контейнеру центрироваться родителем.
        // 2. transform-origin: top left — масштабируем от левого края.
        wrapper.style.cssText = `
            width: max-content; 
            min-width: 100%; 
            margin: 0; 
            align-self: center; 
            box-sizing: border-box; 
            transform-origin: top left; 
            will-change: transform; 
            backface-visibility: hidden;
        `;
        
        const parent = container.parentNode;
        parent.insertBefore(wrapper, container);
        
        wrapper.appendChild(container);
        if (lanthanides) wrapper.appendChild(lanthanides);
        if (actinides) wrapper.appendChild(actinides);
        
        state.wrapperCreated = true;
        return wrapper;
    }

    function applyTableStyles() {
        if (!isMobile()) return;
        
        
        const container = document.querySelector('.container');
        const lanthanides = document.querySelector('.lanthanides');
        const actinides = document.querySelector('.actinides');
        const allElements = document.querySelectorAll('.element');

        const availableHeight = window.innerHeight - 160; 
        let CELL_H = Math.floor(availableHeight / 11);
        CELL_H = Math.min(55, Math.max(38, CELL_H));

        const CELL_W = 58;
        const LA_HEIGHT = Math.floor(CELL_H * 0.75);
        const GAP = 3;
        
        const FONT_SYM = Math.floor(CELL_H * 0.4) + 'px';
        const FONT_NAME = Math.max(9, Math.floor(CELL_H * 0.18)) + 'px';
        const FONT_NUM = '10px';

        const tableWidth = (18 * CELL_W) + (17 * GAP);
        
        if (container) {
            container.style.cssText = `
                display: grid !important;
                grid-template-columns: repeat(18, ${CELL_W}px) !important;
                grid-template-rows: repeat(7, ${CELL_H}px) !important;
                gap: ${GAP}px !important;
                width: ${tableWidth}px !important;
                min-width: ${tableWidth}px !important;
                margin: 0 !important;
                margin-left: 0 !important;
                margin-bottom: 10px !important;
            `;
        }

        const subTableWidth = (15 * CELL_W) + (14 * GAP);
        
        [lanthanides, actinides].forEach(el => {
            if (!el) return;
            el.style.cssText = `
                display: grid !important;
                grid-template-columns: repeat(15, ${CELL_W}px) !important;
                grid-template-rows: ${LA_HEIGHT}px !important; 
                gap: ${GAP}px !important;
                width: ${subTableWidth}px !important;
                margin-top: 5px !important;
                margin-left: ${(3 * CELL_W) + (3 * GAP)}px !important;
            `;
        });

        allElements.forEach(el => {
            const isLaOrAc = el.parentElement?.classList.contains('lanthanides') || 
                             el.parentElement?.classList.contains('actinides');
            
            el.style.cssText = `
                position: relative !important;
                display: flex !important;
                flex-direction: column !important;
                box-sizing: border-box !important;
                border: 1px solid rgba(0,0,0,0.1) !important;
                padding: 0 !important;
                margin: 0 !important;
                width: ${CELL_W}px !important;
                height: ${isLaOrAc ? LA_HEIGHT : CELL_H}px !important;
            `;

            const symbol = el.querySelector('.symbol');
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

            const name = el.querySelector('.name');
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
                `;
            }

            const num = el.querySelector('.atomic-number');
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
    }

    function applyCalcActiveTransform() {
        if (!isMobile()) return;

        const wrapper = document.getElementById('mobile-table-wrapper');

        // ИЗМЕНЕНИЕ: Ищем ЛЮБУЮ активную панель (калькулятор или уравнитель)
        let activePanel = document.querySelector('.calc-panel.active, .balancer-panel.active');
        if (!activePanel) {
            if (document.body.classList.contains('calc-active')) {
                activePanel = document.getElementById('calc-panel');
            } else if (document.body.classList.contains('balancer-active')) {
                activePanel = document.getElementById('balancer-panel');
            }
        }

        // Если нет враппера или нет активной панели — выходим
        if (!wrapper || !activePanel) return;

        const wrapperHeight = wrapper.offsetHeight || state.originalHeight || 1;
        state.originalHeight = wrapperHeight;

        // Берем полную ширину контента для расчетов
        const wrapperWidth = wrapper.scrollWidth;

        // ИЗМЕНЕНИЕ: Считаем высоту именно той панели, которая сейчас открыта
        const panelHeight = activePanel.offsetHeight || (window.innerHeight * 0.25);

        // Масштаб
        const availableHeight = window.innerHeight - panelHeight - CONFIG.TOP_MARGIN - CONFIG.BOTTOM_GAP;
        let scale = availableHeight / wrapperHeight;
        scale = Math.max(CONFIG.MIN_SCALE, Math.min(CONFIG.MAX_SCALE, scale));

        // Вертикаль (плавная)
        const naturalTopDocument = getAbsoluteTop(wrapper);
        const currentScroll = window.scrollY;
        const naturalTopViewport = naturalTopDocument - currentScroll;
        const translateY = CONFIG.TOP_MARGIN - naturalTopViewport;

        // Горизонталь (умное центрирование)
        const scaledWidth = wrapperWidth * scale;
        const windowWidth = window.innerWidth;
        let translateX = 0;

        if (scaledWidth < windowWidth) {
            translateX = (windowWidth - scaledWidth) / 2;
        }

        wrapper.style.transition = 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
        wrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    function resetTransform() {
        const wrapper = document.getElementById('mobile-table-wrapper');
        if (wrapper) {
            wrapper.style.transition = 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
            wrapper.style.transform = 'none';
        }
    }

    function init() {
        if (!isMobile()) return;

        ensureWrapper();
        applyTableStyles();
        
        requestAnimationFrame(() => {
            if (document.body.classList.contains('calc-active') || document.body.classList.contains('balancer-active')) {
                applyCalcActiveTransform();
            }
        });
    }

    // После строки с инициализацией (function init() {)
if (isMobile()) {
    centerTableVertically();
}
  
  // После существующих функций добавить:
function centerTableVertically() {
    if (!isMobile()) return;

    if (document.body.classList.contains('calc-active') || document.body.classList.contains('balancer-active')) {
        applyCalcActiveTransform();
        return;
    }
    
    const wrapper = document.getElementById('mobile-table-wrapper');
    if (!wrapper) return;
    
    const container = document.querySelector('.periodic-table-container');
    if (!container) return;
    
    const wrapperHeight = wrapper.offsetHeight || 1;
    const viewportHeight = window.innerHeight;
    
    const availableSpace = viewportHeight - (CONFIG.TOP_MARGIN + CONFIG.BOTTOM_GAP);
    const scale = Math.min(1.0, availableSpace / wrapperHeight);
    
    wrapper.style.transition = 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
    container.style.transition = 'height 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
    
    const translateY = (viewportHeight - wrapperHeight * scale) / 2;
    wrapper.style.transform = `translateY(${translateY}px) scale(${scale})`;
}
  
  // Найти обработчик resize и заменить:
window.addEventListener('resize', () => {
    if (isMobile()) {
        applyTableStyles();
        centerTableVertically();
    }
});
  
  // Добавить инициализацию после DOMContentLoaded:
document.addEventListener('DOMContentLoaded', () => {
    if (isMobile()) {
        centerTableVertically();
    }
});

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.attributeName === 'class') {
                const isCalcActive = document.body.classList.contains('calc-active');
                const isBalancerActive = document.body.classList.contains('balancer-active');
                const isActive = isCalcActive || isBalancerActive;

                if (isActive) {
                    applyCalcActiveTransform();
                    setTimeout(applyCalcActiveTransform, 300);
                } else {
                    resetTransform();
                }
            }
        }
    });
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        });
    } else {
        init();
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            state.originalHeight = null;
            init();
        }, 200);
    });

    window.mobileLayout = { init, applyTransform: applyCalcActiveTransform, resetTransform };

    // Добавить после применения стилей таблицы:
    if (isMobile()) {
        document.body.style.overflowY = 'hidden';
        document.body.classList.add('scroll-locked');
    }
})();
