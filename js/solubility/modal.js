// =========================================
// МОДАЛЬНОЕ ОКНО ТАБЛИЦЫ РАСТВОРИМОСТИ
// =========================================

// Переключение таблицы растворимости (toggle)
// =========================================
// МОДАЛЬНОЕ ОКНО ТАБЛИЦЫ РАСТВОРИМОСТИ
// =========================================

async function toggleSolubility() {
    const modal = document.getElementById('solubility-modal');
    if (modal.style.display === 'flex') {
        closeSolubility();
    } else {
        await openSolubility();
    }
}

async function openSolubility() {
    // Загружаем модуль растворимости если ещё не загружен
    if (window.loadSolubility) {
        await window.loadSolubility();
    }

    const modal = document.getElementById('solubility-modal');

    // Генерируем таблицу только если она пустая
    if(document.getElementById('solubility-table').innerHTML === "") {
        if (typeof renderSolubilityTable === 'function') {
            renderSolubilityTable();
        }
    }

    modal.style.display = 'flex';

    // #region agent log
    const modalRect = modal.getBoundingClientRect();
    const content = document.querySelector('.solubility-content');
    const contentRect = content ? content.getBoundingClientRect() : null;
    const isMobile = window.innerWidth <= 1024;
    fetch('http://127.0.0.1:7242/ingest/62ca497c-fdce-4d75-9803-1df85cc7de10',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'modal.js:34',message:'openSolubility - modal dimensions',data:{isMobile,windowWidth:window.innerWidth,windowHeight:window.innerHeight,modalWidth:modalRect.width,modalHeight:modalRect.height,contentWidth:contentRect?.width,contentHeight:contentRect?.height},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    // Инициализируем кнопку продвинутого режима
    if (typeof initAdvancedModeButton === 'function') {
        initAdvancedModeButton();
    }

    // Инициализация ряда активности
    if (typeof initActivitySeriesUI === 'function') {
        initActivitySeriesUI();
    }

    if (window.initSolubilityDrag) {
        window.initSolubilityDrag();
    }

    document.body.classList.add('solubility-open');

    // --- ИСПРАВЛЕНИЕ №1: Скрываем кнопки мгновенно ---
    const fabContainer = document.getElementById('fab-container');
    const themeToggle = document.getElementById('theme-toggle'); // Кнопка темы

    if (fabContainer) fabContainer.style.display = 'none'; // <--- ДОБАВИТЬ ЭТО
    if (themeToggle) themeToggle.style.display = 'none';   // <--- ДОБАВИТЬ ЭТО
    // -------------------------------------------------

    const calcButton = document.querySelector('.fab-option[onclick="toggleCalc()"]');
    const particlesButton = document.querySelector('.fab-option[onclick="toggleParticles()"]');
    if (calcButton) calcButton.style.display = 'none';
    if (particlesButton) particlesButton.style.display = 'none';

    updateFiltersForSolubility();

    const wrapper = document.querySelector('.solubility-wrapper');
    if (wrapper && !wrapper.dataset.dragScrollEnabled) {
        enableDragScroll(wrapper);
        wrapper.dataset.dragScrollEnabled = 'true';
    }

    // #region agent log
    const buttons = document.querySelectorAll('.modal-header-controls button, .close-solubility');
    const buttonSizes = Array.from(buttons).map(btn => {
        const rect = btn.getBoundingClientRect();
        return {tag:btn.tagName,width:rect.width,height:rect.height,id:btn.id || btn.className};
    });
    const stickyHeaders = document.querySelectorAll('#solubility-table thead th, #solubility-table tbody th');
    const stickyInfo = Array.from(stickyHeaders).slice(0, 3).map(th => {
        const rect = th.getBoundingClientRect();
        const styles = window.getComputedStyle(th);
        return {position:styles.position,top:styles.top,left:styles.left,zIndex:styles.zIndex,visible:rect.width > 0 && rect.height > 0};
    });
    fetch('http://127.0.0.1:7242/ingest/62ca497c-fdce-4d75-9803-1df85cc7de10',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'modal.js:75',message:'button sizes and sticky headers check',data:{buttonSizes,stickyInfo,isMobile:window.innerWidth <= 1024},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C,E'})}).catch(()=>{});
    // #endregion

    if (wrapper && !wrapper.dataset.ctrlScrollEnabled) {
        wrapper.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                wrapper.scrollLeft += e.deltaY;
            }
        }, { passive: false });
        wrapper.dataset.ctrlScrollEnabled = 'true';
    }
}

function closeSolubility() {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/62ca497c-fdce-4d75-9803-1df85cc7de10',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'modal.js:84',message:'closeSolubility called',data:{isMobile:window.innerWidth <= 1024,hasTouchSupport:'ontouchstart' in window},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    const modal = document.getElementById('solubility-modal');
    if (modal) {
        modal.style.display = 'none';
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/62ca497c-fdce-4d75-9803-1df85cc7de10',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'modal.js:87',message:'modal closed',data:{display:modal.style.display},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
    } else {
        console.warn("Элемент 'solubility-modal' не найден в HTML!");
    }

    document.body.classList.remove('solubility-open');

    // --- ИСПРАВЛЕНИЕ №2: Возвращаем кнопки ---
    const fabContainer = document.getElementById('fab-container');
    const themeToggle = document.getElementById('theme-toggle');

    if (fabContainer) fabContainer.style.display = ''; // <--- ДОБАВИТЬ ЭТО (сброс стиля вернет их на место)
    if (themeToggle) themeToggle.style.display = '';   // <--- ДОБАВИТЬ ЭТО
    // -----------------------------------------

    // Закрываем панель поиска если открыта
    const searchPanel = document.getElementById('solubility-search-panel');
    if (searchPanel) searchPanel.classList.remove('active');
    const searchBtn = document.getElementById('solubility-search-btn');
    if (searchBtn) searchBtn.classList.remove('active');

    // Если есть функция очистки выделения
    if (typeof clearTableSelection === 'function') {
        clearTableSelection();
    }

    // Возвращаем кнопки калькулятора и частиц в FAB меню
    const calcButton = document.querySelector('.fab-option[onclick="toggleCalc()"]');
    const particlesButton = document.querySelector('.fab-option[onclick="toggleParticles()"]');
    if (calcButton) calcButton.style.display = '';
    if (particlesButton) particlesButton.style.display = '';

    restoreElementFilters();
}

// Закрытие модального окна при клике вне его области
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('solubility-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/62ca497c-fdce-4d75-9803-1df85cc7de10',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'modal.js:click-outside',message:'modal click event',data:{targetId:e.target.id,targetClass:e.target.className,isModal:e.target === modal,isMobile:window.innerWidth <= 1024},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
            if (e.target === modal) {
                closeSolubility();
            }
        });
    }
});