// SVG Спрайт иконок
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

    <symbol id="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
    </symbol>

</svg>
`;

// Вставляем в начало body
document.body.insertAdjacentHTML('afterbegin', iconsSVG);
