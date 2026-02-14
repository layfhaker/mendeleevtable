// =========================================
// ELECTRON-CONFIG.JS - Electron configuration modal
// =========================================

const electronConfigModal = document.getElementById('electron-config-modal');
const electronConfigClose = document.getElementById('electron-config-close');
const electronConfigHeading = document.getElementById('electron-config-heading');
const electronConfigSubtitle = document.getElementById('electron-config-subtitle');
const electronConfigSymbol = document.getElementById('electron-config-symbol');
const electronConfigNumber = document.getElementById('electron-config-number');
const electronConfigCharge = document.getElementById('electron-config-charge');
const electronConfigMass = document.getElementById('electron-config-mass');
const electronConfigShells = document.getElementById('electron-config-shells');
const electronConfigOrbitals = document.getElementById('electron-config-orbitals');
const electronConfigValence = document.getElementById('electron-config-valence');
const electronConfigShort = document.getElementById('electron-config-short');
const electronConfigFull = document.getElementById('electron-config-full');
const electronConfigOuterShell = document.getElementById('electron-config-outer-shell');
const electronConfigValenceElectrons = document.getElementById('electron-config-valence-electrons');
const ELECTRON_CONFIG_ANIM_MS = 360;

const orbitalCapacityMap = {
    s: 1,
    p: 3,
    d: 5,
    f: 7
};

const nobleGasConfigs = {
    He: '1s2',
    Ne: '1s2 2s2 2p6',
    Ar: '1s2 2s2 2p6 3s2 3p6',
    Kr: '1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6',
    Xe: '1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6',
    Rn: '1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6 6s2 4f14 5d10 6p6',
    Og: '1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6 6s2 4f14 5d10 6p6 7s2 5f14 6d10 7p6'
};

const nobleGasAtomicNumbers = [
    { symbol: 'He', atomicNumber: 2 },
    { symbol: 'Ne', atomicNumber: 10 },
    { symbol: 'Ar', atomicNumber: 18 },
    { symbol: 'Kr', atomicNumber: 36 },
    { symbol: 'Xe', atomicNumber: 54 },
    { symbol: 'Rn', atomicNumber: 86 },
    { symbol: 'Og', atomicNumber: 118 }
];

const aufbauOrder = [
    { n: 1, l: 's', cap: 2 },
    { n: 2, l: 's', cap: 2 },
    { n: 2, l: 'p', cap: 6 },
    { n: 3, l: 's', cap: 2 },
    { n: 3, l: 'p', cap: 6 },
    { n: 4, l: 's', cap: 2 },
    { n: 3, l: 'd', cap: 10 },
    { n: 4, l: 'p', cap: 6 },
    { n: 5, l: 's', cap: 2 },
    { n: 4, l: 'd', cap: 10 },
    { n: 5, l: 'p', cap: 6 },
    { n: 6, l: 's', cap: 2 },
    { n: 4, l: 'f', cap: 14 },
    { n: 5, l: 'd', cap: 10 },
    { n: 6, l: 'p', cap: 6 },
    { n: 7, l: 's', cap: 2 },
    { n: 5, l: 'f', cap: 14 },
    { n: 6, l: 'd', cap: 10 },
    { n: 7, l: 'p', cap: 6 }
];

const exceptionConfigs = {
    24: { from: { n: 4, l: 's', delta: -1 }, to: { n: 3, l: 'd', delta: 1 } },
    29: { from: { n: 4, l: 's', delta: -1 }, to: { n: 3, l: 'd', delta: 1 } },
    41: { from: { n: 5, l: 's', delta: -1 }, to: { n: 4, l: 'd', delta: 1 } },
    42: { from: { n: 5, l: 's', delta: -1 }, to: { n: 4, l: 'd', delta: 1 } },
    44: { from: { n: 5, l: 's', delta: -1 }, to: { n: 4, l: 'd', delta: 1 } },
    45: { from: { n: 5, l: 's', delta: -1 }, to: { n: 4, l: 'd', delta: 1 } },
    46: { from: { n: 5, l: 's', delta: -2 }, to: { n: 4, l: 'd', delta: 2 } },
    47: { from: { n: 5, l: 's', delta: -1 }, to: { n: 4, l: 'd', delta: 1 } },
    57: { from: { n: 5, l: 'd', delta: -1 }, to: { n: 4, l: 'f', delta: 1 } },
    64: { from: { n: 6, l: 's', delta: -1 }, to: { n: 5, l: 'd', delta: 1 } },
    78: { from: { n: 6, l: 's', delta: -1 }, to: { n: 5, l: 'd', delta: 1 } },
    79: { from: { n: 6, l: 's', delta: -1 }, to: { n: 5, l: 'd', delta: 1 } }
};

function normalizeConfigString(config) {
    if (!config) return '';

    let normalized = String(config)
        .replace(/&nbsp;/g, ' ')
        .replace(/<sup>(\d+)<\/sup>/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();

    normalized = normalized.replace(/[¹²³⁴⁵⁶⁷⁸⁹⁰]/g, (match) => {
        const map = {
            '⁰': '0',
            '¹': '1',
            '²': '2',
            '³': '3',
            '⁴': '4',
            '⁵': '5',
            '⁶': '6',
            '⁷': '7',
            '⁸': '8',
            '⁹': '9'
        };
        return map[match] || match;
    });

    return normalized;
}

function formatConfig(orbitals) {
    if (!Array.isArray(orbitals) || orbitals.length === 0) return '-';
    return orbitals.map(item => `${item.n}${item.l}<sup>${item.electrons}</sup>`).join(' ');
}

function applyExceptionConfig(orbitals, atomicNumber) {
    const adjustment = exceptionConfigs[atomicNumber];
    if (!adjustment) return orbitals;

    const updated = orbitals.map(item => ({ ...item }));
    const from = updated.find(item => item.n === adjustment.from.n && item.l === adjustment.from.l);
    const to = updated.find(item => item.n === adjustment.to.n && item.l === adjustment.to.l);

    if (!from || !to) return orbitals;

    from.electrons = Math.max(0, from.electrons + adjustment.from.delta);
    to.electrons = Math.max(0, to.electrons + adjustment.to.delta);

    return updated;
}

function buildOrbitalsFromAtomicNumber(atomicNumber) {
    let remaining = atomicNumber;
    const orbitals = [];

    for (const entry of aufbauOrder) {
        if (remaining <= 0) break;
        const electrons = Math.min(remaining, entry.cap);
        orbitals.push({ n: entry.n, l: entry.l, electrons });
        remaining -= electrons;
    }

    return applyExceptionConfig(orbitals, atomicNumber);
}

function buildShellDistribution(orbitals) {
    const shellMap = {};
    orbitals.forEach(item => {
        shellMap[item.n] = (shellMap[item.n] || 0) + item.electrons;
    });

    return Object.keys(shellMap)
        .map(key => Number(key))
        .sort((a, b) => a - b)
        .map(key => shellMap[key]);
}

function buildShortConfig(orbitals, atomicNumber) {
    let remainingOrbitals = orbitals.map(item => ({ ...item }));
    let nobleGas = null;

    for (const item of nobleGasAtomicNumbers) {
        if (item.atomicNumber <= atomicNumber) {
            nobleGas = item;
        }
    }

    if (nobleGas) {
        let remaining = nobleGas.atomicNumber;
        const trimmed = [];

        for (const orbital of remainingOrbitals) {
            if (remaining <= 0) {
                trimmed.push({ ...orbital });
                continue;
            }
            if (remaining >= orbital.electrons) {
                remaining -= orbital.electrons;
            } else {
                trimmed.push({ ...orbital, electrons: orbital.electrons - remaining });
                remaining = 0;
            }
        }

        remainingOrbitals = trimmed;
    }

    const suffix = formatConfig(remainingOrbitals);
    if (!nobleGas || suffix === '-') return formatConfig(orbitals);
    return `[${nobleGas.symbol}] ${suffix}`;
}

function expandNobleGasConfig(config) {
    const normalized = normalizeConfigString(config);
    if (!normalized) return '';

    return normalized.replace(/\[([A-Za-z]{1,2})\]/g, (match, symbol) => {
        return nobleGasConfigs[symbol] || match;
    });
}

function parseElectronConfig(config) {
    const expanded = expandNobleGasConfig(config);
    if (!expanded) {
        return { orbitals: [], shellDistribution: [] };
    }

    const orbitals = [];
    const shellMap = {};
    const regex = /(\d+)([spdf])(\d+)/g;
    let match;

    while ((match = regex.exec(expanded)) !== null) {
        const n = Number(match[1]);
        const l = match[2];
        const electrons = Number(match[3]);
        orbitals.push({ n, l, electrons });
        shellMap[n] = (shellMap[n] || 0) + electrons;
    }

    const shellDistribution = Object.keys(shellMap)
        .map(key => Number(key))
        .sort((a, b) => a - b)
        .map(key => shellMap[key]);

    return { orbitals, shellDistribution };
}

function buildDerivedConfig(data) {
    const configSource = data.electronConfigFull || data.electronConfig || '';
    const parsed = parseElectronConfig(configSource);
    let orbitals = Array.isArray(data.orbitals) && data.orbitals.length > 0
        ? data.orbitals
        : parsed.orbitals;

    if ((!orbitals || orbitals.length === 0) && data.atomicNumber) {
        orbitals = buildOrbitalsFromAtomicNumber(Number(data.atomicNumber));
    }

    const shellDistribution = Array.isArray(data.shellDistribution) && data.shellDistribution.length > 0
        ? data.shellDistribution
        : buildShellDistribution(orbitals);

    const fullConfig = data.electronConfigFull || formatConfig(orbitals) || data.electronConfig || '-';
    const shortConfig = data.electronConfigShort || data.electronConfig || buildShortConfig(orbitals, Number(data.atomicNumber));

    return {
        orbitals,
        shellDistribution,
        fullConfig,
        shortConfig
    };
}

function getOuterShellInfo(shellDistribution) {
    if (!Array.isArray(shellDistribution) || shellDistribution.length === 0) {
        return { count: '-', level: 0 };
    }
    const level = shellDistribution.length;
    const count = shellDistribution[level - 1];
    return { count, level };
}

function getValenceElectrons(data, derived) {
    const block = data.block;
    const orbitals = derived.orbitals;
    if (!block || !Array.isArray(orbitals) || orbitals.length === 0) return '-';

    const maxN = Math.max(...orbitals.map(o => o.n));

    if (block === 's' || block === 'p') {
        // Валентные = электроны на внешнем уровне
        return orbitals
            .filter(o => o.n === maxN)
            .reduce((sum, o) => sum + o.electrons, 0);
    }

    if (block === 'd') {
        // Внешние s + незавершённые d предпоследнего уровня
        const outerS = orbitals
            .filter(o => o.n === maxN && o.l === 's')
            .reduce((sum, o) => sum + o.electrons, 0);
        const innerD = orbitals
            .filter(o => o.n === maxN - 1 && o.l === 'd')
            .reduce((sum, o) => sum + o.electrons, 0);
        return outerS + innerD;
    }

    if (block === 'f') {
        // Внешние s + незавершённые f
        const outerS = orbitals
            .filter(o => o.n === maxN && o.l === 's')
            .reduce((sum, o) => sum + o.electrons, 0);
        const innerF = orbitals
            .filter(o => o.l === 'f')
            .reduce((sum, o) => sum + o.electrons, 0);
        return outerS + innerF;
    }

    return '-';
}

function buildShells(shellDistribution) {
    if (!Array.isArray(shellDistribution) || shellDistribution.length === 0) {
        return '-';
    }

    return shellDistribution.map((count, index) =>
        `<div class="shell-level">
            <span class="shell-number">${index + 1}</span>
            <span class="shell-electrons">${count}e⁻</span>
        </div>`
    ).join('');
}

function getOrbitalCapacity(type) {
    return orbitalCapacityMap[type] || 0;
}

function splitElectrons(electrons, capacity) {
    const boxes = Array.from({ length: capacity }, () => 0);
    if (electrons <= 0 || capacity === 0) return boxes;

    const firstPass = Math.min(electrons, capacity);
    for (let i = 0; i < firstPass; i += 1) {
        boxes[i] = 1;
    }

    let remaining = electrons - firstPass;
    let index = 0;
    while (remaining > 0 && capacity > 0) {
        boxes[index] += 1;
        remaining -= 1;
        index = (index + 1) % capacity;
    }

    return boxes;
}

function renderOrbitalRow(orbital, index) {
    const capacity = getOrbitalCapacity(orbital.l);
    const boxes = splitElectrons(orbital.electrons, capacity);
    const label = `${orbital.n}${orbital.l}<sup>${orbital.electrons}</sup>`;

    const boxesMarkup = boxes.map(count => {
        const arrows = [
            count >= 1 ? '<span class="orbital-arrow up">&uarr;</span>' : '',
            count === 2 ? '<span class="orbital-arrow down">&darr;</span>' : ''
        ].join('');
        const filledClass = count > 0 ? ' filled' : '';
        return `<div class="orbital-box${filledClass}">${arrows}</div>`;
    }).join('');

    return `
        <div class="orbital-row" style="--step-index:${index}">
            <div class="orbital-label">${label}</div>
            <div class="orbital-boxes">${boxesMarkup}</div>
        </div>
    `;
}

function renderOrbitals(orbitals) {
    if (!Array.isArray(orbitals) || orbitals.length === 0) {
        return '<div class="electron-config-empty">Нет данных по орбиталям для этого элемента.</div>';
    }

    return orbitals.map((orbital, index) => renderOrbitalRow(orbital, index)).join('');
}

function renderElectronConfigModal(data) {
    if (!data) return;

    const derived = buildDerivedConfig(data);
    const symbol = data.symbol || '';
    const title = data.name ? `Строение атома ${data.name}` : 'Строение атома';
    const subtitle = data.name ? `${data.name}${symbol ? ` (${symbol})` : ''}` : symbol;

    if (electronConfigHeading) electronConfigHeading.textContent = title;
    if (electronConfigSubtitle) electronConfigSubtitle.textContent = subtitle;
    if (electronConfigSymbol) electronConfigSymbol.textContent = symbol;
    if (electronConfigNumber) electronConfigNumber.textContent = data.atomicNumber || '-';
    if (electronConfigCharge) electronConfigCharge.textContent = data.atomicNumber ? `+${data.atomicNumber}` : '';
    if (electronConfigMass) electronConfigMass.textContent = data.atomicMass ? `${data.atomicMass}` : '';

    if (electronConfigShells) {
        electronConfigShells.innerHTML = buildShells(derived.shellDistribution);
    }

    if (electronConfigOrbitals) {
        electronConfigOrbitals.innerHTML = renderOrbitals(derived.orbitals);
    }

    if (electronConfigValence) {
        electronConfigValence.textContent = data.valenceStates || '-';
    }

    const outerInfo = getOuterShellInfo(derived.shellDistribution);
    if (electronConfigOuterShell) {
        electronConfigOuterShell.textContent = outerInfo.count !== '-'
            ? `${outerInfo.count}  (${outerInfo.level}-й уровень)`
            : '-';
    }

    const valElectrons = getValenceElectrons(data, derived);
    if (electronConfigValenceElectrons) {
        electronConfigValenceElectrons.textContent = valElectrons;
    }

    if (electronConfigShort) {
        electronConfigShort.innerHTML = derived.shortConfig || '-';
    }

    if (electronConfigFull) {
        electronConfigFull.innerHTML = derived.fullConfig || '-';
    }
}

function openElectronConfigModal(data) {
    if (!electronConfigModal) return;
    renderElectronConfigModal(data);
    electronConfigModal.classList.remove('closing');
    electronConfigModal.style.display = 'flex';
    electronConfigModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('electron-config-open');
}

function closeElectronConfigModal() {
    if (!electronConfigModal) return;
    electronConfigModal.classList.add('closing');
    electronConfigModal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
        electronConfigModal.style.display = 'none';
        electronConfigModal.classList.remove('closing');
        document.body.classList.remove('electron-config-open');
    }, ELECTRON_CONFIG_ANIM_MS);
}

function initElectronConfig() {
    const elementInfo = document.getElementById('element-info');
    const content = document.querySelector('.electron-config-content');

    if (elementInfo) {
        elementInfo.addEventListener('click', (event) => {
            const trigger = event.target.closest('.electron-config-trigger');
            if (!trigger) return;
            if (!window.currentElementData) return;
            openElectronConfigModal(window.currentElementData);
        });

        elementInfo.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            const trigger = event.target.closest('.electron-config-trigger');
            if (!trigger) return;
            event.preventDefault();
            if (!window.currentElementData) return;
            openElectronConfigModal(window.currentElementData);
        });
    }

    if (electronConfigClose) {
        electronConfigClose.addEventListener('click', closeElectronConfigModal);
    }

    if (electronConfigModal) {
        electronConfigModal.addEventListener('click', (event) => {
            if (event.target === electronConfigModal) {
                closeElectronConfigModal();
            }
        });
    }

    if (content) {
        const handleScroll = () => {
            content.classList.toggle('compact-header', content.scrollTop > 16);
        };
        content.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        if (electronConfigModal && electronConfigModal.style.display === 'flex') {
            closeElectronConfigModal();
        }
    });
}

window.openElectronConfigModal = openElectronConfigModal;
window.closeElectronConfigModal = closeElectronConfigModal;
window.initElectronConfig = initElectronConfig;
window.getElectronConfigPreview = function (data) {
    if (!data) return '-';
    return buildDerivedConfig(data).shortConfig || '-';
};
