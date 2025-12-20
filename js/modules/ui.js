// =========================================
// МОДУЛЬ: UI (МЕНЮ И ПРОЧЕЕ)
// =========================================

function toggleMenu() {
    const fab = document.getElementById('fab-container');
    fab.classList.toggle('active');

    const filtersPanel = document.getElementById('filters-panel');
    if (filtersPanel && filtersPanel.classList.contains('active')) {
        filtersPanel.classList.remove('active');
    }
}

let particlesEnabled = true;
function toggleParticles() {
    const canvas = document.getElementById('particles-canvas');
    particlesEnabled = !particlesEnabled;
    canvas.style.display = particlesEnabled ? 'block' : 'none';
}

function resetFabPosition() {
    const fab = document.getElementById('fab-container');
    if (fab) {
        fab.style.bottom = '';
        fab.style.right = '';
        fab.style.left = '';
        fab.style.top = '';
        fab.style.transform = '';
    }
}
