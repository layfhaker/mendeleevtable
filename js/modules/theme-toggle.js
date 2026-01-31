// =========================================
// THEME-TOGGLE.JS — Illustrated theme switch
// =========================================

(function () {
    'use strict';

    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const setState = (isDark) => {
        toggle.classList.toggle('checked', isDark);
        toggle.setAttribute('aria-checked', isDark ? 'true' : 'false');
    };

    const getCurrentTheme = () => {
        if (typeof window.__themeTarget === 'string') {
            return window.__themeTarget;
        }
        return document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    };

    const getNextTheme = () => (getCurrentTheme() === 'dark' ? 'light' : 'dark');

    const handleToggle = () => {
        const nextTheme = getNextTheme();
        setState(nextTheme === 'dark');
        if (typeof toggleTheme === 'function') {
            toggleTheme();
        }
    };

    toggle.addEventListener('click', (event) => {
        if (event.button && event.button !== 0) return;
        handleToggle();
    });

    toggle.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            handleToggle();
        }
    });

    const observer = new MutationObserver(() => {
        setState(document.body.classList.contains('dark-theme'));
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });

    setState(document.body.classList.contains('dark-theme'));
})();
