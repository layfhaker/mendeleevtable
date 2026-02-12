// SVG Спрайт иконок (автоматически сгенерирован из icons/*.svg)
const iconsSVG = `
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <symbol id="icon-calc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
            <rect x="8" y="6" width="8" height="4" rx="1"/>
            <circle cx="8" cy="14" r="1" fill="currentColor" stroke="none"/>
            <circle cx="12" cy="14" r="1" fill="currentColor" stroke="none"/>
            <circle cx="16" cy="14" r="1" fill="currentColor" stroke="none"/>
            <circle cx="8" cy="18" r="1" fill="currentColor" stroke="none"/>
            <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none"/>
            <circle cx="16" cy="18" r="1" fill="currentColor" stroke="none"/>
    </symbol>

    <symbol id="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2"/>
            <path d="M12 20v2"/>
            <path d="M4.93 4.93l1.41 1.41"/>
            <path d="M17.66 17.66l1.41 1.41"/>
            <path d="M2 12h2"/>
            <path d="M20 12h2"/>
            <path d="M6.34 17.66l-1.41 1.41"/>
            <path d="M19.07 4.93l-1.41 1.41"/>
    </symbol>

    <symbol id="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </symbol>

    <symbol id="icon-particles" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <circle cx="12" cy="12" r="2.5"/>
            <circle cx="6" cy="6" r="1.5"/>
            <circle cx="18" cy="7" r="2"/>
            <circle cx="17" cy="17" r="1.5"/>
            <circle cx="7" cy="17" r="2"/>
            <circle cx="4" cy="12" r="1"/>
            <circle cx="20" cy="12" r="1"/>
            <circle cx="12" cy="4" r="1"/>
            <circle cx="12" cy="20" r="1.5"/>
    </symbol>

    <symbol id="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
    </symbol>

    <symbol id="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
    </symbol>

    <symbol id="icon-filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </symbol>

    <symbol id="icon-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="7.5"/>
            <path d="M20.5 20.5 16 16"/>
    </symbol>

    <symbol id="icon-palette" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 21a9 9 0 1 1 8.7-11.2 2.8 2.8 0 0 1-2.7 3.5h-1.8a1.9 1.9 0 0 0 0 3.8h.4a2.6 2.6 0 0 1 0 5.2H12z"/>
            <circle cx="7.8" cy="10.4" r="1"/>
            <circle cx="10.7" cy="7.6" r="1"/>
            <circle cx="14.8" cy="7.9" r="1"/>
            <circle cx="16.6" cy="11.6" r="1"/>
    </symbol>

    <symbol id="icon-bolt" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13 2 3 14h8l-1 8 11-12h-8z"/>
    </symbol>

    <symbol id="icon-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="9"/>
            <line x1="12" y1="16" x2="12" y2="11.5"/>
            <circle cx="12" cy="8.2" r="0.9" fill="currentColor" stroke="none"/>
    </symbol>

</svg>
`;

// Вставляем в начало body
document.body.insertAdjacentHTML('afterbegin', iconsSVG);
