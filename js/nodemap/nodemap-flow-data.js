// 🗺️ User Flow Data - Карта пользовательских сценариев
// Описывает путь пользователя по сайту в виде блок-схемы

window.UserFlowData = {

    nodes: [
        // ═══════════ ENTRY ═══════════
        {
            id: 'start',
            type: 'terminal',
            title: 'Пользователь заходит на сайт',
            icon: '🌐',
            level: 0
        },

        // ═══════════ ЗАГРУЗКА ═══════════
        {
            id: 'loading',
            type: 'process',
            title: 'Загрузка модулей',
            subtitle: 'scrypt.js',
            icon: '⚙️',
            level: 1
        },
        {
            id: 'render-table',
            type: 'process',
            title: 'Генерация таблицы',
            icon: '🧪',
            level: 2
        },

        // ═══════════ ГЛАВНЫЙ ВЫБОР ═══════════
        {
            id: 'main-choice',
            type: 'decision',
            title: 'Действие пользователя',
            icon: '🤔',
            level: 3
        },

        // ═══════════ ДЕЙСТВИЯ ═══════════
        {
            id: 'click-element',
            type: 'process',
            title: 'Клик на элемент',
            icon: '👆',
            level: 4
        },
        {
            id: 'open-fab',
            type: 'process',
            title: 'Открыть FAB',
            icon: '📱',
            level: 4
        },
        {
            id: 'change-theme',
            type: 'process',
            title: 'Сменить тему',
            icon: '🌓',
            level: 4
        },
        {
            id: 'press-dot',
            type: 'process',
            title: 'Нажать . (точка)',
            icon: '⌨️',
            level: 4
        },
        {
            id: 'search',
            type: 'input',
            title: 'Поиск элемента',
            icon: '🔍',
            level: 4
        },
        {
            id: 'press-esc',
            type: 'process',
            title: 'Нажать Esc',
            icon: '⎋',
            level: 4
        },

        // ═══════════ РЕЗУЛЬТАТЫ ═══════════
        {
            id: 'element-modal',
            type: 'modal',
            title: 'Модалка элемента',
            subtitle: '3D + свойства',
            icon: '🔬',
            level: 5
        },
        {
            id: 'fab-choice',
            type: 'decision',
            title: 'Выбор в FAB',
            icon: '📋',
            level: 5
        },
        {
            id: 'theme-wave',
            type: 'process',
            title: 'Волна + тема',
            icon: '🌊',
            level: 5
        },
        {
            id: 'nodemap-modal',
            type: 'modal',
            title: 'Node Map',
            icon: '🗺️',
            level: 5
        },
        {
            id: 'search-result',
            type: 'process',
            title: 'Подсветка + скролл',
            icon: '✨',
            level: 5
        },
        {
            id: 'close-modal',
            type: 'process',
            title: 'Закрыть модалку',
            icon: '❌',
            level: 5
        },

        // ═══════════ FAB ПУНКТЫ ═══════════
        {
            id: 'calculator',
            type: 'modal',
            title: 'Калькулятор массы',
            icon: '🔢',
            level: 6
        },
        {
            id: 'solubility',
            type: 'modal',
            title: 'Таблица растворимости',
            icon: '🧫',
            level: 6
        },
        {
            id: 'atom-3d',
            type: 'modal',
            title: '3D модель атома',
            icon: '⚛️',
            level: 6
        },
        {
            id: 'more-options',
            type: 'decision',
            title: 'Ещё опции...',
            icon: '📑',
            level: 6
        }
    ],

    connections: [
        // Линейный путь
        { from: 'start', to: 'loading' },
        { from: 'loading', to: 'render-table' },
        { from: 'render-table', to: 'main-choice' },

        // Разветвление главного выбора
        { from: 'main-choice', to: 'click-element', label: 'Клик' },
        { from: 'main-choice', to: 'open-fab', label: 'FAB' },
        { from: 'main-choice', to: 'change-theme', label: 'Тема' },
        { from: 'main-choice', to: 'press-dot', label: '.' },
        { from: 'main-choice', to: 'search', label: 'Поиск' },
        { from: 'main-choice', to: 'press-esc', label: 'Esc' },

        // Результаты действий
        { from: 'click-element', to: 'element-modal' },
        { from: 'open-fab', to: 'fab-choice' },
        { from: 'change-theme', to: 'theme-wave' },
        { from: 'press-dot', to: 'nodemap-modal' },
        { from: 'search', to: 'search-result' },
        { from: 'press-esc', to: 'close-modal' },

        // FAB подменю
        { from: 'fab-choice', to: 'calculator', label: 'Масса' },
        { from: 'fab-choice', to: 'solubility', label: 'Растворимость' },
        { from: 'fab-choice', to: 'atom-3d', label: '3D' },
        { from: 'fab-choice', to: 'more-options', label: '...' },

        // Возврат (пунктирные линии)
        { from: 'element-modal', to: 'main-choice', type: 'return' },
        { from: 'theme-wave', to: 'main-choice', type: 'return' },
        { from: 'search-result', to: 'main-choice', type: 'return' },
        { from: 'nodemap-modal', to: 'main-choice', type: 'return' },
        { from: 'calculator', to: 'main-choice', type: 'return' },
        { from: 'solubility', to: 'main-choice', type: 'return' },
        { from: 'atom-3d', to: 'main-choice', type: 'return' },
        { from: 'close-modal', to: 'main-choice', type: 'return' }
    ]
};
