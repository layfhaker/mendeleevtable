// =========================================
// MAIN LOADER FILE - OPTIMIZED LOADING
// v2.2 - loader only
// =========================================

// === CRITICAL SCRIPTS (load immediately) ===
const criticalScripts = [
    'js/icons.js',
    'js/elements.js',
    'js/utils.js',
    'js/modules/mobile-layout.js'
];

// === CORE SCRIPTS (after DOMContentLoaded) ===
const coreScripts = [
    'js/particles.js',
    'js/modules/modal.js',
    'js/modules/electron-config.js',
    'js/modules/theme.js',
    'js/modules/theme-toggle.js',
    'js/modules/search-filters.js',
    'js/modules/ui.js',
    'js/reactions-db.js',
    'js/modules/reactions.js',
    'js/scroll-collapse.js',
    'js/wallpaper-handler.js',
    // Nodemap
    'js/nodemap/nodemap-parser.js',
    'js/nodemap/nodemap-layout.js',
    'js/nodemap/nodemap-canvas.js',
    'js/nodemap/nodemap-flow-data.js',
    'js/nodemap/nodemap-flow-layout.js',
    'js/nodemap/nodemap-flow-canvas.js',
    'js/nodemap/nodemap-modal.js',
    'js/nodemap/nodemap-init.js',
    // Extras
    'js/fab-animation.js'
];

// Runtime logic (must load even if some core scripts fail)
const coreAlways = [
    'js/modules/app-runtime.js'
];

// Optional external libraries (do not block the app)
const optionalScripts = [
    'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
    'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/mhchem.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

// Core scripts that depend on optional libs
const coreAfterOptional = [
    'js/modules/latex-export.js'
];

// Loading progress
let totalScripts = 0;
let loadedScripts = 0;

function updateProgress(percent) {
    if (window.ChemLoader) {
        window.ChemLoader.updateProgress(percent);
        if (percent >= 100) {
            setTimeout(() => {
                window.ChemLoader.hide();
            }, 500);
        }
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            loadedScripts++;
            updateProgress((loadedScripts / totalScripts) * 100);
            resolve();
        };
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
    });
}

async function loadScripts(scripts) {
    for (const src of scripts) {
        await loadScript(src);
    }
}

function loadScriptSafe(src) {
    return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            loadedScripts++;
            updateProgress((loadedScripts / totalScripts) * 100);
            resolve();
        };
        script.onerror = () => {
            console.warn(`Optional script failed to load: ${src}`);
            loadedScripts++;
            updateProgress((loadedScripts / totalScripts) * 100);
            resolve();
        };
        document.head.appendChild(script);
    });
}

async function loadScriptsSafe(scripts) {
    for (const src of scripts) {
        await loadScriptSafe(src);
    }
}

window.loadScript = loadScript;
window.loadScripts = loadScripts;

async function init() {
    try {
        totalScripts = criticalScripts.length + coreScripts.length + coreAlways.length + optionalScripts.length + coreAfterOptional.length;
        loadedScripts = 0;

        await loadScriptsSafe(criticalScripts);

        const runCore = async () => {
            await loadScriptsSafe(coreScripts);
            await loadScriptsSafe(coreAlways);
            await loadScriptsSafe(optionalScripts);
            await loadScriptsSafe(coreAfterOptional);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runCore);
        } else {
            await runCore();
        }
    } catch (error) {
        console.error('Loader error:', error);
        updateProgress(100);
    }
}

init();
