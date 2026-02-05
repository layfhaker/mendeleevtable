// =========================================
// РњРћР”РЈР›Р¬: Р­РљРЎРџРћР Рў Р­Р›Р•РњР•РќРўРђ Р’ PDF Р LATEX
// =========================================

/**
 * РќРѕСЂРјР°Р»РёР·Р°С†РёСЏ С„РѕСЂРјСѓР»С‹ (СѓР±РёСЂР°РµРј РёРЅРґРµРєСЃС‹ РґР»СЏ РїРѕРёСЃРєР°)
 */
function normalizeFormula(formula) {
    return formula.replace(/[вЃєвЃ»вЃ°В№ВІВівЃґвЃµвЃ¶вЃ·вЃёвЃ№в‚Ђв‚Ѓв‚‚в‚ѓв‚„в‚…в‚†в‚‡в‚€в‚‰]/g, (match) => {
        const map = {
            'вЃє': '+', 'вЃ»': '-', 'вЃ°': '0', 'В№': '1', 'ВІ': '2', 'Ві': '3', 'вЃґ': '4',
            'вЃµ': '5', 'вЃ¶': '6', 'вЃ·': '7', 'вЃё': '8', 'вЃ№': '9',
            'в‚Ђ': '0', 'в‚Ѓ': '1', 'в‚‚': '2', 'в‚ѓ': '3', 'в‚„': '4',
            'в‚…': '5', 'в‚†': '6', 'в‚‡': '7', 'в‚€': '8', 'в‚‰': '9'
        };
        return map[match] || match;
    });
}

function getElementCompounds(symbol) {
    if (!window.solubilityData) {
        console.error('Р”Р°РЅРЅС‹Рµ С‚Р°Р±Р»РёС†С‹ СЂР°СЃС‚РІРѕСЂРёРјРѕСЃС‚Рё РЅРµ Р·Р°РіСЂСѓР¶РµРЅС‹');
        return [];
    }

    const compounds = [];
    const { cations, anions, defaults, exceptions } = window.solubilityData;

    const getSolubility = (cationFormula, anionFormula) => {
        const cationKey = normalizeFormula(cationFormula);
        const anionKey = normalizeFormula(anionFormula);
        const exceptionKey = `${cationKey}-${anionKey}`;
        return exceptions[exceptionKey] !== undefined ? exceptions[exceptionKey] : (defaults[anionKey] || "R");
    };

    const getCompoundColor = (cationFormula, anionFormula, solubility) => {
        const cationKey = normalizeFormula(cationFormula);
        const anionKey = normalizeFormula(anionFormula);
        const key = cationKey + '-' + anionKey;
        const colorDb = (typeof substanceColors !== 'undefined' ? substanceColors : window.substanceColors);
        if (colorDb && colorDb[key]) {
            const color = colorDb[key];
            if (color === 'colorless') return '\u0411\u0435\u0441\u0446\u0432\u0435\u0442\u043d\u044b\u0439 \u0440\u0430\u0441\u0442\u0432\u043e\u0440';
            if (color === 'white') return '\u0411\u0435\u043b\u044b\u0439';
            return color;
        }
        if (solubility === 'R') {
            if (anionKey === 'MnO4-') return '#8b008b';
            if (anionKey === 'CrO42-') return '#ffff00';
            if (anionKey === 'Cr2O72-') return '#ff8c00';
            return '\u0411\u0435\u0441\u0446\u0432\u0435\u0442\u043d\u044b\u0439 \u0440\u0430\u0441\u0442\u0432\u043e\u0440';
        }
        return '\u2014';
    };

    const getDecompositionReaction = (cationFormula, anionFormula) => {
        const cationKey = normalizeFormula(cationFormula);
        const anionKey = normalizeFormula(anionFormula);
        const key = `${cationKey}-${anionKey}`;
        if (window.decompositionReactions && window.decompositionReactions[key]) {
            return {
                equation: window.decompositionReactions[key].equation || 'вЂ”',
                description: window.decompositionReactions[key].description || 'вЂ”'
            };
        }
        return null;
    };

    cations.forEach(cation => {
        if (cation.f.includes(symbol) || cation.n.includes(symbol)) {
            anions.forEach(anion => {
                compounds.push({
                    type: 'cation',
                    cation: cation.f,
                    anion: anion.f,
                    solubility: getSolubility(cation.f, anion.f),
                    color: null,
                    decomposition: getDecompositionReaction(cation.f, anion.f)
                });
            });
        }
    });

    anions.forEach(anion => {
        if (anion.f.includes(symbol) || anion.n.includes(symbol)) {
            cations.forEach(cation => {
                compounds.push({
                    type: 'anion',
                    cation: cation.f,
                    anion: anion.f,
                    solubility: getSolubility(cation.f, anion.f),
                    color: null,
                    decomposition: getDecompositionReaction(cation.f, anion.f)
                });
            });
        }
    });

    compounds.forEach((compound) => {
        compound.color = getCompoundColor(compound.cation, compound.anion, compound.solubility);
    });

    return compounds;
}

/**
 * Р РµРЅРґРµСЂРёС‚ С„РѕСЂРјСѓР»Сѓ РІ РєСЂР°СЃРёРІС‹Р№ HTML СЃ РїРѕРјРѕС‰СЊСЋ KaTeX
 */
function renderFormula(formula) {
    if (!formula) return 'вЂ”';
    try {
        return katex.renderToString(`\\ce{${formula}}`, {
            throwOnError: false,
            trust: true
        });
    } catch (e) {
        return formula;
    }
}

function safeValue(value, fallback = 'вЂ”') {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'number' && Number.isNaN(value)) return fallback;
    if (typeof value === 'string' && value.trim().toLowerCase() === 'null') return fallback;
    const str = String(value).trim();
    return str.length === 0 ? fallback : str;
}

function toSuperscript(text) {
    const map = {
        '0': 'вЃ°', '1': 'В№', '2': 'ВІ', '3': 'Ві', '4': 'вЃґ',
        '5': 'вЃµ', '6': 'вЃ¶', '7': 'вЃ·', '8': 'вЃё', '9': 'вЃ№'
    };
    return String(text).split('').map(ch => map[ch] || ch).join('');
}

function formatElectronConfigForPDF(config) {
    if (!config) return 'вЂ”';
    let str = String(config);
    str = str.replace(/<sup>(\d+)<\/sup>/gi, (_, digits) => toSuperscript(digits));
    str = str.replace(/<[^>]*>/g, '');
    return safeValue(str, 'вЂ”');
}

function getCategoryLabel(data) {
    const category = (data && data.category) ? String(data.category) : '';
    if (category) return category;
    return 'вЂ”';
}

/**
 * Р“РµРЅРµСЂРёСЂСѓРµС‚ HTML СЃРµРєС†РёСЋ РґР»СЏ Р°Р»Р»РѕС‚СЂРѕРїРѕРІ
 */
function generateAllotropesHTML(data) {
    if (!data.allotropes && !data.extraAllotropes) return '';

    const allAllotropes = [
        ...Object.values(data.allotropes || {}),
        ...Object.values(data.extraAllotropes || {})
    ];

    if (allAllotropes.length === 0) return '';

    return `
        <div class="pdf-section">
            <h2 class="pdf-subtitle" style="color: #D36A8E;">РђР»Р»РѕС‚СЂРѕРїРЅС‹Рµ РјРѕРґРёС„РёРєР°С†РёРё</h2>
            <table class="pdf-table">
                <thead>
                        <tr style="background-color: #D36A8E;">
                        <th>РќР°Р·РІР°РЅРёРµ</th>
                        <th>РЎРІРѕР№СЃС‚РІР°</th>
                        <th>РЎС‚СЂСѓРєС‚СѓСЂР°</th>
                    </tr>
                </thead>
                <tbody>
                    ${allAllotropes.map((allo, i) => `
                        <tr class="${i % 2 === 0 ? 'even' : 'odd'}">
                            <td>
                                <strong>${allo.name}</strong><br>
                                <span style="font-size: smaller; color: #666;">${allo.alloDiscoveryYear || ''}</span>
                            </td>
                            <td>
                                ${allo.density ? `<div>ПЃ: ${allo.density}</div>` : ''}
                                ${allo.meltingPoint ? `<div>Tв‚: ${allo.meltingPoint}</div>` : ''}
                                ${allo.color ? `<div>${allo.color}</div>` : ''}
                            </td>
                            <td>
                                ${allo.structure || 'вЂ”'}<br>
                                <span style="font-size: smaller; font-style: italic;">${allo.alloFacts || ''}</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Р“РµРЅРµСЂРёСЂСѓРµС‚ HTML С€Р°Р±Р»РѕРЅ РґР»СЏ СЌРєСЃРїРѕСЂС‚Р°
 */
function generatePDFTemplate(data, compounds) {
    const solubilityText = { 'R': 'Р Р°СЃС‚РІРѕСЂРёРј', 'M': 'РњР°Р»РѕСЂР°СЃС‚РІРѕСЂРёРј', 'N': 'РќРµСЂР°СЃС‚РІРѕСЂРёРј', 'D': 'Р Р°Р·Р»Р°РіР°РµС‚СЃСЏ', 'O': 'РќРµ СЃСѓС‰РµСЃС‚РІСѓРµС‚' };
    const elementName = safeValue(data.name || data.symbol);
    const elementSymbol = safeValue(data.symbol);
    const elementNumber = safeValue(data.atomicNumber);
    const elementCategory = getCategoryLabel(data);
    const periodValue = safeValue(data.period);
    const groupValue = safeValue(data.group, data && data.category && /Р°РєС‚РёРЅРѕРёРґ/i.test(data.category) ? 'Р°РєС‚РёРЅРѕРёРґС‹' : 'вЂ”');
    const electronConfigText = formatElectronConfigForPDF(data.electronConfigFull || data.electronConfig);

    const colorNameToHex = {
    "\u0431\u0435\u043b\u044b\u0439": "#ffffff",
    "\u0431\u0435\u0441\u0446\u0432\u0435\u0442\u043d\u044b\u0439": "#f0f8ff",
    "\u0447\u0451\u0440\u043d\u044b\u0439": "#000000",
    "\u043a\u0440\u0430\u0441\u043d\u044b\u0439": "#ff0000",
    "\u0441\u0438\u043d\u0438\u0439": "#1e88e5",
    "\u0433\u043e\u043b\u0443\u0431\u043e\u0439": "#81d4fa",
    "\u0437\u0435\u043b\u0451\u043d\u044b\u0439": "#43a047",
    "\u0437\u0435\u043b\u0435\u043d\u044b\u0439": "#43a047",
    "\u0436\u0451\u043b\u0442\u044b\u0439": "#fdd835",
    "\u0436\u0435\u043b\u0442\u044b\u0439": "#fdd835",
    "\u043e\u0440\u0430\u043d\u0436\u0435\u0432\u044b\u0439": "#fb8c00",
    "\u0444\u0438\u043e\u043b\u0435\u0442\u043e\u0432\u044b\u0439": "#8e24aa",
    "\u0440\u043e\u0437\u043e\u0432\u044b\u0439": "#ec407a",
    "\u0431\u0443\u0440\u044b\u0439": "#8d6e63",
    "\u043a\u043e\u0440\u0438\u0447\u043d\u0435\u0432\u044b\u0439": "#8d6e63",
    "\u043a\u0440\u0435\u043c\u043e\u0432\u044b\u0439": "#fffdd0",
    "\u0431\u043b\u0435\u0434\u043d\u043e-\u0436\u0451\u043b\u0442\u044b\u0439": "#fff9b0",
    "\u0441\u0438\u043d\u0435-\u0437\u0435\u043b\u0451\u043d\u044b\u0439": "#48d1cc"
};

const hexToColorName = Object.keys(colorNameToHex).reduce((acc, name) => {
    acc[colorNameToHex[name].toLowerCase()] = name;
    return acc;
}, {});

const normalizeColorValue = (value) => {
    if (!value) return null;
    if (typeof value === 'object' && value.color) value = value.color;
    if (typeof value !== 'string') return null;
    const raw = value.trim();
    if (!raw) return null;
    const lower = raw.toLowerCase();
    if (lower === 'colorless' || lower === '\u0431\u0435\u0441\u0446\u0432\u0435\u0442\u043d\u044b\u0439 \u0440\u0430\u0441\u0442\u0432\u043e\u0440' || lower === '\u0431\u0435\u0441\u0446\u0432\u0435\u0442\u043d\u044b\u0439') return '#f0f8ff';
    if (lower === 'white' || lower === '\u0431\u0435\u043b\u044b\u0439') return '#ffffff';
    if (lower.startsWith('#')) return lower;
    if (lower.startsWith('rgb')) return lower;
    return colorNameToHex[lower] || null;
};

const hexToRgb = (hex) => {
    const value = hex.replace('#', '').trim();
    if (value.length === 3) {
        const r = parseInt(value[0] + value[0], 16);
        const g = parseInt(value[1] + value[1], 16);
        const b = parseInt(value[2] + value[2], 16);
        return { r, g, b };
    }
    if (value.length === 6) {
        const r = parseInt(value.slice(0, 2), 16);
        const g = parseInt(value.slice(2, 4), 16);
        const b = parseInt(value.slice(4, 6), 16);
        return { r, g, b };
    }
    return null;
};

const approximateColorNameFromHex = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return '\u0426\u0432\u0435\u0442\u043d\u043e\u0439';
    const { r, g, b } = rgb;
    if (r > 235 && g > 235 && b > 235) return '\u0411\u0435\u043b\u044b\u0439';
    if (r < 40 && g < 40 && b < 40) return '\u0427\u0451\u0440\u043d\u044b\u0439';
    if (r > 200 && g > 200 && b < 120) return '\u0416\u0451\u043b\u0442\u044b\u0439';
    if (r > 200 && g > 120 && b < 80) return '\u041e\u0440\u0430\u043d\u0436\u0435\u0432\u044b\u0439';
    if (r > 160 && g < 90 && b < 90) return '\u041a\u0440\u0430\u0441\u043d\u044b\u0439';
    if (b > 150 && r < 100 && g < 120) return '\u0421\u0438\u043d\u0438\u0439';
    if (g > 150 && r < 120 && b < 120) return '\u0417\u0435\u043b\u0451\u043d\u044b\u0439';
    if (r > 150 && b > 150 && g < 120) return '\u0424\u0438\u043e\u043b\u0435\u0442\u043e\u0432\u044b\u0439';
    return '\u0426\u0432\u0435\u0442\u043d\u043e\u0439';
};

const describeColorValue = (value) => {
    if (!value) return '\u2014';
    if (typeof value === 'string') {
        const raw = value.trim();
        if (!raw) return '\u2014';
        const lower = raw.toLowerCase();
        if (lower === 'colorless') return '\u0411\u0435\u0441\u0446\u0432\u0435\u0442\u043d\u044b\u0439 \u0440\u0430\u0441\u0442\u0432\u043e\u0440';
        if (lower === 'white') return '\u0411\u0435\u043b\u044b\u0439';
        if (lower.startsWith('#')) {
            const mapped = hexToColorName[lower];
            if (mapped) {
                return mapped.charAt(0).toUpperCase() + mapped.slice(1);
            }
            return approximateColorNameFromHex(lower);
        }
        if (lower.startsWith('rgb')) return '\u0426\u0432\u0435\u0442\u043d\u043e\u0439';
    }
    return safeValue(value);
};

const renderColorSwatch = (value) => {
        const hex = normalizeColorValue(value);
        const label = describeColorValue(value);
        if (!hex) return label;
        const border = (hex === '#ffffff' || hex === '#f0f8ff') ? 'border:1px solid #ccc;' : '';
        return `<span style="display:inline-flex;align-items:center;gap:6px;">
            <span style="width:10px;height:10px;border-radius:50%;background:${hex};${border}"></span>
            <span>${label}</span>
        </span>`;
    };

    let compoundsHTML = '';
    if (compounds.length > 0) {
        compoundsHTML = `
            <div class="pdf-section">
                <h2 class="pdf-subtitle" style="color: #7E57C2;">РЎРѕРµРґРёРЅРµРЅРёСЏ РёР· С‚Р°Р±Р»РёС†С‹ СЂР°СЃС‚РІРѕСЂРёРјРѕСЃС‚Рё</h2>
                <table class="pdf-table compounds-table">
                    <thead>
                        <tr style="background-color: #7E57C2;">
                            <th>Р¤РѕСЂРјСѓР»Р°</th>
                            <th>Р Р°СЃС‚РІРѕСЂРёРјРѕСЃС‚СЊ</th>
                            <th>Р¦РІРµС‚</th>
                            <th>Р РµР°РєС†РёСЏ</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${compounds.map((c, i) => `
                            <tr class="${i % 2 === 0 ? 'even' : 'odd'}">
                                <td>${renderFormula(c.cation)} + ${renderFormula(c.anion)}</td>
                                <td>${solubilityText[c.solubility] || c.solubility}</td>
                                <td>${renderColorSwatch(c.color)}</td>
                                <td>${c.decomposition ? renderFormula(c.decomposition.equation) : 'вЂ”'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    return `
        <div class="pdf-container">
            <div class="pdf-hero">
                <div class="pdf-hero-symbol">${elementSymbol}</div>
                <div class="pdf-hero-meta">
                    <h1 class="pdf-title">${elementName} (${elementSymbol})</h1>
                    <div class="pdf-hero-row">
                        <span class="pdf-hero-badge">в„– ${elementNumber}</span>
                        <span class="pdf-hero-type">${elementCategory}</span>
                    </div>
                </div>
            </div>
            <p class="pdf-meta">РЎРіРµРЅРµСЂРёСЂРѕРІР°РЅРѕ: ${new Date().toLocaleDateString('ru-RU')}</p>

            <div class="pdf-section">
                <h2 class="pdf-subtitle" style="color: #4A90E2;">Р‘Р°Р·РѕРІР°СЏ РёРЅС„РѕСЂРјР°С†РёСЏ</h2>
                <table class="pdf-table">
                    <thead><tr style="background-color: #4A90E2;"><th>РЎРІРѕР№СЃС‚РІРѕ</th><th>Р—РЅР°С‡РµРЅРёРµ</th></tr></thead>
                    <tbody>
                        <tr><td>РђС‚РѕРјРЅС‹Р№ РЅРѕРјРµСЂ</td><td>${elementNumber}</td></tr>
                        <tr><td>РђС‚РѕРјРЅР°СЏ РјР°СЃСЃР°</td><td>${safeValue(data.atomicMass)}</td></tr>
                        <tr><td>РџРµСЂРёРѕРґ/Р“СЂСѓРїРїР°</td><td>${periodValue} / ${groupValue}</td></tr>
                        <tr><td>Р­Р»РµРєС‚СЂРѕРЅРЅР°СЏ РєРѕРЅС„РёРіСѓСЂР°С†РёСЏ</td><td>${electronConfigText}</td></tr>
                        <tr><td>Р­Р»РµРєС‚СЂРѕРѕС‚СЂРёС†Р°С‚РµР»СЊРЅРѕСЃС‚СЊ</td><td>${safeValue(data.electronegativity)}</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="pdf-section">
                <h2 class="pdf-subtitle" style="color: #4C9A74;">Р¤РёР·РёС‡РµСЃРєРёРµ СЃРІРѕР№СЃС‚РІР°</h2>
                <table class="pdf-table">
                    <thead><tr style="background-color: #4C9A74;"><th>РЎРІРѕР№СЃС‚РІРѕ</th><th>Р—РЅР°С‡РµРЅРёРµ</th></tr></thead>
                    <tbody>
                        <tr><td>РџР»РѕС‚РЅРѕСЃС‚СЊ</td><td>${safeValue(data.density)}</td></tr>
                        <tr><td>РўРµРјРїРµСЂР°С‚СѓСЂР° РїР»Р°РІР»РµРЅРёСЏ</td><td>${safeValue(data.meltingPoint)}</td></tr>
                        <tr><td>РўРµРјРїРµСЂР°С‚СѓСЂР° РєРёРїРµРЅРёСЏ</td><td>${safeValue(data.boilingPoint)}</td></tr>
                        <tr><td>РЎРѕСЃС‚РѕСЏРЅРёРµ (20В°C)</td><td>${safeValue(data.state)}</td></tr>
                        <tr><td>Р¦РІРµС‚</td><td>${safeValue(data.color)}</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="pdf-section">
                <h2 class="pdf-subtitle" style="color: #C98A3A;">РСЃС‚РѕСЂРёСЏ Рё С„Р°РєС‚С‹</h2>
                <div class="pdf-text-block">
                    <p><strong>РћС‚РєСЂС‹С‚РёРµ:</strong> ${safeValue(data.discoveryYear)} (${safeValue(data.discoverer)})</p>
                    <p><strong>РџСЂРѕРёСЃС…РѕР¶РґРµРЅРёРµ РЅР°Р·РІР°РЅРёСЏ:</strong> ${safeValue(data.nameOrigin)}</p>
                    ${data.facts ? `<p><strong>Р¤Р°РєС‚С‹:</strong> ${Array.isArray(data.facts) ? data.facts.join(' ') : data.facts}</p>` : ''}
                </div>
            </div>

            ${generateAllotropesHTML(data)}


            ${compoundsHTML}
            
            <style>
                .pdf-container { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
                .pdf-hero { display: flex; align-items: center; gap: 16px; }
                .pdf-hero-symbol { font-size: 46px; font-weight: bold; color: #2B5C91; border: 2px solid #2B5C91; border-radius: 12px; padding: 6px 12px; min-width: 72px; text-align: center; }
                .pdf-hero-meta { flex: 1; }
                .pdf-hero-row { display: flex; gap: 10px; align-items: center; margin-top: 6px; }
                .pdf-hero-badge { display: inline-block; padding: 3px 8px; border-radius: 10px; background: #e9f0f8; color: #2B5C91; font-size: 12px; font-weight: 600; }
                .pdf-hero-type { color: #555; font-size: 12px; }
                .pdf-title { text-align: left; color: #2B5C91; border-bottom: 2px solid #2B5C91; padding-bottom: 6px; margin: 0; }
                .pdf-meta { text-align: center; color: #666; font-size: 10px; margin-bottom: 30px; }
                .pdf-subtitle { font-size: 16px; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                .pdf-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
                .pdf-table th { color: white; padding: 8px; text-align: left; }
                .pdf-table td { padding: 8px; border-bottom: 1px solid #eee; }
                .pdf-table tr.even { background-color: #f9f9f9; }
                .katex { font-size: 1.1em; }
            </style>
        </div>
    `;
}

/**
 * Р“Р›РђР’РќРђРЇ Р¤РЈРќРљР¦РРЇ: Р­РєСЃРїРѕСЂС‚ РІ PDF (Client-side)
 */
async function exportElementToPDF(elementData) {
    try {
        // РџРѕРєР°Р·С‹РІР°РµРј РіР»РѕР±Р°Р»СЊРЅС‹Р№ Р»РѕР°РґРµСЂ
        if (window.ChemLoader && window.ChemLoader.show) {
            window.ChemLoader.show();
        }

        const button = document.querySelector('.pdf-export-icon-btn');
        if (button) {
            button.classList.add('loading');
        }

        // Р“Р°СЂР°РЅС‚РёСЂСѓРµРј Р·Р°РіСЂСѓР·РєСѓ РґР°РЅРЅС‹С… СЂР°СЃС‚РІРѕСЂРёРјРѕСЃС‚Рё РґР»СЏ СЃРїРёСЃРєР° СЃРѕРµРґРёРЅРµРЅРёР№
        if (typeof window.loadSolubility === 'function') {
            try {
                await window.loadSolubility();
            } catch (e) {
                console.warn('РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РґР°РЅРЅС‹Рµ СЂР°СЃС‚РІРѕСЂРёРјРѕСЃС‚Рё РґР»СЏ PDF:', e);
            }
        }

        const compounds = getElementCompounds(elementData.symbol);
        const htmlContent = generatePDFTemplate(elementData, compounds);

        // РЎРѕР·РґР°РµРј РІСЂРµРјРµРЅРЅС‹Р№ РєРѕРЅС‚РµР№РЅРµСЂ
        const container = document.createElement('div');
        container.innerHTML = htmlContent;
        document.body.appendChild(container);

        // РћРїС†РёРё РґР»СЏ html2pdf
        const opt = {
            margin: 10,
            filename: `${elementData.symbol}_${elementData.name}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Р“РµРЅРµСЂР°С†РёСЏ
        await html2pdf().set(opt).from(container).save();

        // РћС‡РёСЃС‚РєР°
        document.body.removeChild(container);

        // Р’РѕСЃСЃС‚Р°РЅРѕРІР»РµРЅРёРµ РєРЅРѕРїРєРё
        // Р’РѕСЃСЃС‚Р°РЅРѕРІР»РµРЅРёРµ РєРЅРѕРїРєРё
        if (button) {
            button.classList.remove('loading');
        }

        if (document.querySelector('.pdf-export-icon-btn')) {
            document.querySelector('.pdf-export-icon-btn').classList.remove('loading');
        }
    } finally {
        // РЎРєСЂС‹РІР°РµРј РіР»РѕР±Р°Р»СЊРЅС‹Р№ Р»РѕР°РґРµСЂ
        if (window.ChemLoader && window.ChemLoader.hide) {
            window.ChemLoader.hide();
        }
    }
}

// РЎРѕС…СЂР°РЅСЏРµРј СЃРѕРІРјРµСЃС‚РёРјРѕСЃС‚СЊ РёРјРµРЅ
window.exportElementToLaTeX = exportElementToPDF; // РўРµРїРµСЂСЊ СЌС‚Рѕ PDF СЌРєСЃРїРѕСЂС‚
window.generateElementPDF = exportElementToPDF;

