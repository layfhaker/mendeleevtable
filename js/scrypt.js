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
    'js/bad-apple.js',
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
    'js/modules/latex-export.js?v=2026-02-14-5'
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

const BAD_APPLE_PHRASE = 'badapple';
const BAD_APPLE_CONTEXT_PERIODIC = 'periodic';
const BAD_APPLE_CONTEXT_SOLUBILITY = 'solubility';
let badAppleTypedBuffer = '';
let badApplePlayerInstance = null;
let badApplePlayerContext = BAD_APPLE_CONTEXT_PERIODIC;
let badAppleHotkeyAttached = false;
let badAppleSolubilityScaleState = null;

function getBadAppleAudioElement() {
    return (
        document.querySelector('[data-bad-apple-audio]') ||
        document.querySelector('#bad-apple-audio') ||
        document.querySelector('audio[data-track="bad-apple"]')
    );
}

function resolveBadApplePayload(context) {
    if (context === BAD_APPLE_CONTEXT_SOLUBILITY) {
        if (window.BAD_APPLE_PAYLOAD_SOLUBILITY) {
            return window.BAD_APPLE_PAYLOAD_SOLUBILITY;
        }
        if (window.BAD_APPLE_PAYLOAD) {
            return window.BAD_APPLE_PAYLOAD;
        }
    } else if (window.BAD_APPLE_PAYLOAD) {
        return window.BAD_APPLE_PAYLOAD;
    }

    if (window.BadApplePlayer && typeof window.BadApplePlayer.createDemoPayload === 'function') {
        const dimensions = context === BAD_APPLE_CONTEXT_SOLUBILITY
            ? { width: 24, height: 22 }
            : { width: 18, height: 10 };
        return window.BadApplePlayer.createDemoPayload({
            ...dimensions,
            fps: 12,
            durationSeconds: 8
        });
    }

    return null;
}

function isSolubilityModalVisible() {
    const modal = document.getElementById('solubility-modal');
    if (!modal) {
        return false;
    }
    return getComputedStyle(modal).display !== 'none';
}

function restoreInlineStyle(element, styleValue) {
    if (!element) {
        return;
    }
    if (styleValue === null || styleValue === undefined) {
        element.removeAttribute('style');
        return;
    }
    element.setAttribute('style', styleValue);
}

function clearBadAppleSolubilityScale() {
    if (!badAppleSolubilityScaleState) {
        return;
    }
    restoreInlineStyle(badAppleSolubilityScaleState.wrapper, badAppleSolubilityScaleState.wrapperStyle);
    restoreInlineStyle(badAppleSolubilityScaleState.table, badAppleSolubilityScaleState.tableStyle);
    badAppleSolubilityScaleState = null;
}

function fitSolubilityTableToViewport() {
    const modal = document.getElementById('solubility-modal');
    const wrapper = modal ? modal.querySelector('.solubility-wrapper') : null;
    const table = document.getElementById('solubility-table');

    if (!modal || !wrapper || !table || getComputedStyle(modal).display === 'none') {
        return false;
    }

    if (table.querySelectorAll('tbody td').length === 0 && typeof window.renderSolubilityTable === 'function') {
        window.renderSolubilityTable();
    }

    const tableWidth = table.scrollWidth;
    const tableHeight = table.scrollHeight;
    const availableWidth = wrapper.clientWidth;
    const availableHeight = wrapper.clientHeight;

    if (tableWidth <= 0 || tableHeight <= 0 || availableWidth <= 0 || availableHeight <= 0) {
        return false;
    }

    const scale = Math.min(1, availableWidth / tableWidth, availableHeight / tableHeight);
    const safeScale = Math.max(0.2, scale);

    clearBadAppleSolubilityScale();
    badAppleSolubilityScaleState = {
        wrapper,
        table,
        wrapperStyle: wrapper.getAttribute('style'),
        tableStyle: table.getAttribute('style')
    };

    wrapper.style.overflow = 'hidden';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'flex-start';
    wrapper.style.justifyContent = 'flex-start';
    wrapper.scrollLeft = 0;
    wrapper.scrollTop = 0;

    table.style.transformOrigin = 'top left';
    table.style.transform = `scale(${safeScale})`;
    table.style.willChange = 'transform';

    return true;
}

function buildSampleIndices(total, target) {
    if (total <= 0 || target <= 0) {
        return [];
    }
    if (target === 1) {
        return [Math.floor((total - 1) / 2)];
    }
    const indices = [];
    for (let index = 0; index < target; index += 1) {
        const ratio = index / (target - 1);
        indices.push(Math.round(ratio * (total - 1)));
    }
    return indices;
}

function buildSolubilityGridMap(width, height) {
    const table = document.getElementById('solubility-table');
    if (!table) {
        return null;
    }

    if (table.querySelectorAll('tbody td').length === 0 && typeof window.renderSolubilityTable === 'function') {
        window.renderSolubilityTable();
    }

    const rowNodes = Array.from(table.querySelectorAll('tbody tr'));
    if (!rowNodes.length) {
        return null;
    }

    const cellRows = rowNodes.map((row) => Array.from(row.querySelectorAll('td')));
    const rowCount = cellRows.length;
    const colCount = cellRows.reduce((max, row) => Math.max(max, row.length), 0);

    if (!rowCount || !colCount) {
        return null;
    }

    const rowIndices = buildSampleIndices(rowCount, height);
    const colIndices = buildSampleIndices(colCount, width);

    return rowIndices.map((rowIdx) => {
        const sourceRow = cellRows[rowIdx] || [];
        const lastCell = sourceRow[sourceRow.length - 1] || null;
        return colIndices.map((colIdx) => sourceRow[colIdx] || lastCell);
    });
}

function ensureBadApplePlayer(options) {
    const opts = options || {};
    const requestedContext = opts.context || BAD_APPLE_CONTEXT_PERIODIC;
    const forceRecreate = Boolean(opts.forceRecreate);

    if (typeof window.BadApplePlayer !== 'function') {
        return null;
    }

    const payload = resolveBadApplePayload(requestedContext);
    if (!payload) {
        return null;
    }

    const normalizedPayload = window.BadApplePlayer.normalizePayload(payload);
    const width = normalizedPayload.width;
    const height = normalizedPayload.height;

    let context = requestedContext;
    let gridMap = window.PERIODIC_SELECTOR_GRID_18X10;

    if (requestedContext === BAD_APPLE_CONTEXT_SOLUBILITY) {
        const solubilityGridMap = buildSolubilityGridMap(width, height);
        if (solubilityGridMap) {
            gridMap = solubilityGridMap;
        } else {
            console.warn('Bad Apple solubility mode is unavailable: no solubility cells found.');
            return null;
        }
    }

    const canReuse = badApplePlayerInstance &&
        badApplePlayerContext === context &&
        !forceRecreate;

    if (canReuse) {
        return badApplePlayerInstance;
    }

    if (badApplePlayerInstance) {
        badApplePlayerInstance.stop({ restore: true, reset: true });
        badApplePlayerInstance = null;
    }

    badApplePlayerInstance = new window.BadApplePlayer({
        payload: normalizedPayload,
        gridMap,
        audio: getBadAppleAudioElement(),
        onColor: '#111111',
        offColor: '#f5f5f5',
        onFinish: () => {
            clearBadAppleSolubilityScale();
        }
    });
    badApplePlayerContext = context;

    return badApplePlayerInstance;
}

function startBadApplePlayback(options) {
    const opts = options || {};
    const preferSolubility = Boolean(opts.preferSolubility);
    const shouldUseSolubility = preferSolubility || isSolubilityModalVisible();
    const context = shouldUseSolubility
        ? BAD_APPLE_CONTEXT_SOLUBILITY
        : BAD_APPLE_CONTEXT_PERIODIC;

    clearBadAppleSolubilityScale();
    if (context === BAD_APPLE_CONTEXT_SOLUBILITY) {
        fitSolubilityTableToViewport();
    }

    const player = ensureBadApplePlayer({
        context,
        forceRecreate: context === BAD_APPLE_CONTEXT_SOLUBILITY
    });
    if (!player) {
        console.warn('BadApplePlayer is not ready.');
        clearBadAppleSolubilityScale();
        return;
    }

    player.stop({ restore: true, reset: true });
    player.play({ restart: true });
}

function stopBadApplePlayback() {
    if (!badApplePlayerInstance) {
        clearBadAppleSolubilityScale();
        return;
    }
    badApplePlayerInstance.stop({ restore: true, reset: true });
    clearBadAppleSolubilityScale();
}

function isTypingContext(target) {
    if (!target || typeof target !== 'object') {
        return false;
    }
    if (target.isContentEditable) {
        return true;
    }
    const tagName = String(target.tagName || '').toUpperCase();
    return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT';
}

function handleBadAppleKeydown(event) {
    if (event.key === 'Escape') {
        stopBadApplePlayback();
        badAppleTypedBuffer = '';
        return;
    }

    if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
    }

    const target = event.target;
    const isSolubilitySearchInput = target && target.id === 'solubility-search-input';
    const key = String(event.key || '').toLowerCase();

    if (isSolubilitySearchInput) {
        if (!/^[a-z]$/.test(key)) {
            badAppleTypedBuffer = '';
            return;
        }

        badAppleTypedBuffer = (badAppleTypedBuffer + key).slice(-BAD_APPLE_PHRASE.length);
        if (badAppleTypedBuffer === BAD_APPLE_PHRASE) {
            badAppleTypedBuffer = '';
            event.preventDefault();
            target.value = '';
            target.dispatchEvent(new Event('input', { bubbles: true }));
            startBadApplePlayback({ preferSolubility: true });
        }
        return;
    }

    if (isTypingContext(event.target)) {
        return;
    }

    if (!/^[a-z]$/.test(key)) {
        badAppleTypedBuffer = '';
        return;
    }

    badAppleTypedBuffer = (badAppleTypedBuffer + key).slice(-BAD_APPLE_PHRASE.length);
    if (badAppleTypedBuffer === BAD_APPLE_PHRASE) {
        badAppleTypedBuffer = '';
        startBadApplePlayback({ preferSolubility: isSolubilityModalVisible() });
    }
}

function initBadAppleHotkey() {
    if (badAppleHotkeyAttached) {
        return;
    }
    document.addEventListener('keydown', handleBadAppleKeydown);
    badAppleHotkeyAttached = true;
    window.startBadApple = startBadApplePlayback;
    window.stopBadApple = stopBadApplePlayback;
}

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

initBadAppleHotkey();
init();
