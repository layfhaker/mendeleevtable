// =========================================
// MODULE: REACTIONS MODE (DATABASE LOOKUP)
// =========================================
(function () {
    const DB_URL = 'data/reactions-db.json';
    const MAX_SUGGESTIONS = 5;

    const subDigitsMap = {
        '\u2080': '0', '\u2081': '1', '\u2082': '2', '\u2083': '3', '\u2084': '4',
        '\u2085': '5', '\u2086': '6', '\u2087': '7', '\u2088': '8', '\u2089': '9'
    };

    let dbLoaded = false;
    let dbError = null;
    let reactionsIndex = null;
    let ionMaps = null;
    let dataMaps = null;
    let ruleMap = null;

    function buildIonMaps(data) {
        if (!data || !Array.isArray(data.ions)) return null;
        const cations = new Map();
        const anions = new Map();

        const stripCharge = (ionStr, charge) => {
            if (!ionStr) return null;
            let compact = ionStr.replace(/\s+/g, '');
            const magnitude = Math.abs(Number(charge)) || 0;
            if (magnitude === 0) return compact;
            if (magnitude === 1) {
                return compact.replace(/[+-]$/, '');
            }
            const tail = String(magnitude);
            if (compact.endsWith(`${tail}+`) || compact.endsWith(`${tail}-`)) {
                return compact.slice(0, -(tail.length + 1));
            }
            if (compact.endsWith(`+${tail}`) || compact.endsWith(`-${tail}`)) {
                return compact.slice(0, -(tail.length + 1));
            }
            return compact;
        };

        const parseIon = (ionStr, charge) => {
            if (!ionStr) return null;
            const numericCharge = Number(charge);
            if (Number.isFinite(numericCharge) && numericCharge !== 0) {
                const formula = stripCharge(ionStr, numericCharge);
                if (!formula) return null;
                return { formula, charge: numericCharge };
            }
            const compact = ionStr.replace(/\s+/g, '');
            const match = compact.match(/^(.+?)(\d*)([+-])$/);
            if (!match) return null;
            const formula = match[1];
            const magnitude = match[2] ? parseInt(match[2], 10) : 1;
            const sign = match[3] === '-' ? -1 : 1;
            return { formula, charge: sign * magnitude };
        };

        data.ions.forEach((ion) => {
            const parsed = parseIon(ion.ion, ion.charge);
            if (!parsed) return;
            if (ion.type === 'cation') {
                if (!cations.has(parsed.formula)) cations.set(parsed.formula, []);
                cations.get(parsed.formula).push(parsed.charge);
            } else if (ion.type === 'anion') {
                if (!anions.has(parsed.formula)) anions.set(parsed.formula, []);
                anions.get(parsed.formula).push(parsed.charge);
            }
        });

        return { cations, anions };
    }

    function normalizeDigits(str) {
        return str.replace(/[\u2080-\u2089]/g, (m) => subDigitsMap[m] || m);
    }

    function stripLeadingCoeff(token) {
        return token.replace(/^\s*\d+([.,]\d+)?\s*/, '');
    }

    function stripTrailingCondition(token) {
        // Remove trailing condition like (разб), (конц), (t°), (aq), (s), etc.
        let out = token;
        while (/\([^)]+\)$/.test(out)) {
            const match = out.match(/\(([^)]+)\)$/);
            if (!match) break;
            const inner = match[1];
            // Only strip if it is a condition at the end (no trailing digits after ')')
            // and contains letters/symbols typical for conditions.
            if (/[A-Za-zА-Яа-я°.%]/.test(inner)) {
                out = out.replace(/\([^)]+\)$/, '');
                continue;
            }
            break;
        }
        return out;
    }

    function normalizeToken(token, opts) {
        if (!token) return '';
        let out = normalizeDigits(token);
        out = out.replace(/\s+/g, '');
        out = stripLeadingCoeff(out);
        if (opts && opts.stripConditions) {
            out = stripTrailingCondition(out);
        }
        return out;
    }

    function splitReactants(input) {
        if (!input) return [];
        let text = normalizeDigits(input);
        const parts = text.split(/=|->|\u2192|\u21cc/);
        const left = parts[0] || '';
        return left
            .split(/[+,;]/)
            .map((t) => t.trim())
            .filter(Boolean);
    }

    function buildKey(tokens, opts) {
        const normalized = tokens
            .map((t) => normalizeToken(t, opts))
            .filter(Boolean)
            .sort();
        return normalized.join('|');
    }

    function buildIndex(examples) {
        const strict = new Map();
        const relaxed = new Map();
        const entries = [];

        examples.forEach((example) => {
            const reactants = splitReactants(example.reactants || '');
            const strictKey = buildKey(reactants, { stripConditions: false });
            const relaxedKey = buildKey(reactants, { stripConditions: true });
            const strictTokens = reactants
                .map((t) => normalizeToken(t, { stripConditions: false }))
                .filter(Boolean);
            const relaxedTokens = reactants
                .map((t) => normalizeToken(t, { stripConditions: true }))
                .filter(Boolean);

            const entry = {
                example,
                strictKey,
                relaxedKey,
                strictTokens,
                relaxedTokens
            };

            if (strictKey) {
                if (!strict.has(strictKey)) strict.set(strictKey, []);
                strict.get(strictKey).push(example);
            }
            if (relaxedKey) {
                if (!relaxed.has(relaxedKey)) relaxed.set(relaxedKey, []);
                relaxed.get(relaxedKey).push(example);
            }

            entries.push(entry);
        });

        return { strict, relaxed, entries };
    }

    function getIonCharge(formula, type, prefer) {
        if (!ionMaps) return null;
        const map = type === 'anion' ? ionMaps.anions : ionMaps.cations;
        const list = map.get(formula);
        if (!list || list.length === 0) return null;
        if (prefer === 'max') return Math.max(...list);
        return Math.min(...list);
    }

    function buildDataMaps(data) {
        if (!data) return null;
        const classMap = new Map();
        const oxideSubclassMap = new Map();
        const acidOxideMap = new Map();
        const oxideToAcidMap = new Map();
        const metalOxideMap = new Map();
        const metalToOxideMap = new Map();
        const metalToHydroxideMap = new Map();
        const elementMap = new Map();
        const activityMap = new Map();
        const solubilityMap = new Map();
        const solubilityCations = [];
        const solubilityAnions = [];

        (data.substances || []).forEach((item) => {
            if (!item.formula) return;
            classMap.set(item.formula, { class: item.type, info: item });
        });

        (data.substance_classes || []).forEach((item) => {
            if (!item.formula) return;
            classMap.set(item.formula, { class: item.class, subclass: item.subclass, info: item });
            if (item.class === 'oxide' && item.subclass) {
                oxideSubclassMap.set(item.formula, item.subclass);
            }
        });

        (data.acid_oxide_pairs || []).forEach((pair) => {
            if (pair.oxide && pair.acid) {
                acidOxideMap.set(pair.acid, pair.oxide);
                oxideToAcidMap.set(pair.oxide, pair.acid);
            }
        });

        (data.metal_oxide_pairs || []).forEach((pair) => {
            if (!pair.oxide) return;
            const metalInfo = { metal: pair.metal, hydroxide: pair.hydroxide, oxide: pair.oxide };
            metalOxideMap.set(pair.oxide, metalInfo);
            if (pair.metal) {
                const metalSymbol = pair.metal.replace(/\(.*\)$/, '');
                metalToOxideMap.set(metalSymbol, pair.oxide);
                if (pair.hydroxide) metalToHydroxideMap.set(metalSymbol, pair.hydroxide);
            }
        });

        (data.elements || []).forEach((el) => {
            if (!el.symbol) return;
            elementMap.set(el.symbol, el);
        });

        (data.activity_series || []).forEach((entry) => {
            if (entry.element) activityMap.set(entry.element, entry.rank);
        });

        if (data.solubility_table) {
            solubilityCations.push(...(data.solubility_table.cations || []));
            solubilityAnions.push(...Object.keys(data.solubility_table.anions || {}));
            const cationIndex = new Map();
            solubilityCations.forEach((c, i) => cationIndex.set(c.replace(/\s+/g, ''), i));
            Object.entries(data.solubility_table.anions || {}).forEach(([anion, row]) => {
                const anionKey = anion.replace(/\s+/g, '');
                row.forEach((cell, idx) => {
                    const cation = solubilityCations[idx]?.replace(/\s+/g, '');
                    if (!cation) return;
                    solubilityMap.set(`${cation}|${anionKey}`, cell);
                });
            });
        }

        return {
            classMap,
            oxideSubclassMap,
            acidOxideMap,
            oxideToAcidMap,
            metalOxideMap,
            metalToOxideMap,
            metalToHydroxideMap,
            elementMap,
            activityMap,
            solubilityMap,
            solubilityCations,
            solubilityAnions
        };
    }

    function gcd(a, b) {
        let x = Math.abs(a);
        let y = Math.abs(b);
        while (y) {
            const t = y;
            y = x % y;
            x = t;
        }
        return x || 1;
    }

    function lcm(a, b) {
        return Math.abs(a * b) / gcd(a, b);
    }

    function parseAcid(formula) {
        if (!formula || formula === 'H2O') return null;
        if (!/^H/.test(formula)) return null;
        const match = formula.match(/^H(\d*)(.+)$/);
        if (!match) return null;
        const hCount = match[1] ? parseInt(match[1], 10) : 1;
        const anionFormula = match[2];
        return { hCount, anionFormula };
    }

    function parseBase(formula) {
        if (!formula) return null;
        const matchBracket = formula.match(/^(.+?)\((OH)\)(\d*)$/);
        if (matchBracket) {
            return {
                cationFormula: matchBracket[1],
                ohCount: matchBracket[3] ? parseInt(matchBracket[3], 10) : 1
            };
        }
        const matchPlain = formula.match(/^(.+?)OH$/);
        if (matchPlain) {
            return { cationFormula: matchPlain[1], ohCount: 1 };
        }
        return null;
    }

    function isPolyatomic(formula) {
        return !/^[A-Z][a-z]?\d*$/.test(formula);
    }

    function buildSaltFormula(cationFormula, cationCharge, anionFormula, anionCharge) {
        const a = Math.abs(cationCharge);
        const b = Math.abs(anionCharge);
        const g = gcd(a, b);
        const cationSub = b / g;
        const anionSub = a / g;

        const cationPart = cationSub > 1 ? `${cationFormula}${cationSub}` : cationFormula;
        const anionCore = isPolyatomic(anionFormula) && anionSub > 1
            ? `(${anionFormula})${anionSub}`
            : (anionSub > 1 ? `${anionFormula}${anionSub}` : anionFormula);

        return `${cationPart}${anionCore}`;
    }

    function normalizeIonKey(ion) {
        return ion.replace(/\s+/g, '');
    }

    function getSolubility(cationFormula, cationCharge, anionFormula, anionCharge) {
        if (!dataMaps || !dataMaps.solubilityMap) return null;
        const cationKey = normalizeIonKey(`${cationFormula}${Math.abs(cationCharge)}+`.replace('1+', '+'));
        const altCationKey = normalizeIonKey(`${cationFormula}+`);
        const anionKey = normalizeIonKey(`${anionFormula}${Math.abs(anionCharge)}-`.replace('1-', '-'));
        const altAnionKey = normalizeIonKey(`${anionFormula}-`);
        return dataMaps.solubilityMap.get(`${cationKey}|${anionKey}`)
            || dataMaps.solubilityMap.get(`${cationKey}|${altAnionKey}`)
            || dataMaps.solubilityMap.get(`${altCationKey}|${anionKey}`)
            || dataMaps.solubilityMap.get(`${altCationKey}|${altAnionKey}`)
            || null;
    }

    function isInsoluble(sol) {
        return sol === 'IS' || sol === 'SS' || sol === 'D';
    }

    function detectSalt(formula) {
        if (!ionMaps) return null;
        const normalized = normalizeToken(formula, { stripConditions: true });
        const anionKeys = Array.from(ionMaps.anions.keys()).sort((a, b) => b.length - a.length);
        for (const anion of anionKeys) {
            const anionPattern = new RegExp(`^(.*)(${anion})$`);
            const match = normalized.match(anionPattern);
            if (match) {
                const cationFormula = match[1];
                if (!cationFormula) continue;
                const cationCharge = getIonCharge(cationFormula, 'cation', 'min');
                const anionCharge = getIonCharge(anion, 'anion', 'min');
                if (!cationCharge || !anionCharge) continue;
                return { cationFormula, anionFormula: anion, cationCharge, anionCharge };
            }
            const complexMatch = normalized.match(new RegExp(`^(.*)\\(${anion}\\)(\\d+)$`));
            if (complexMatch) {
                const cationFormula = complexMatch[1];
                const cationCharge = getIonCharge(cationFormula, 'cation', 'min');
                const anionCharge = getIonCharge(anion, 'anion', 'min');
                if (!cationCharge || !anionCharge) continue;
                return { cationFormula, anionFormula: anion, cationCharge, anionCharge };
            }
        }
        return null;
    }

    function isWeakAcid(acidFormula) {
        const acidClass = dataMaps?.classMap.get(acidFormula);
        return /weak/i.test(String(acidClass?.subclass || ''));
    }

    function isWeakBase(baseFormula) {
        const baseClass = dataMaps?.classMap.get(baseFormula);
        return /weak/i.test(String(baseClass?.subclass || ''));
    }

    function isGasProduct(acidFormula) {
        return ['H2CO3', 'H2SO3', 'H2S', 'NH4OH'].includes(acidFormula);
    }

    function formatCoeff(n) {
        return n > 1 ? `${n} ` : '';
    }

    function parseFormulaCounts(formula) {
        const clean = formula.replace(/\s+/g, '');
        const elements = {};
        let i = 0;
        const len = clean.length;
        const stack = [{}];

        while (i < len) {
            const char = clean[i];
            if (char === '(' || char === '[') {
                stack.push({});
                i++;
            } else if (char === ')' || char === ']') {
                const top = stack.pop();
                i++;
                let numStr = '';
                while (i < len && /\d/.test(clean[i])) {
                    numStr += clean[i];
                    i++;
                }
                const mult = numStr ? parseInt(numStr, 10) : 1;
                const parent = stack[stack.length - 1];
                Object.keys(top).forEach((el) => {
                    parent[el] = (parent[el] || 0) + top[el] * mult;
                });
            } else if (/[A-Z]/.test(char)) {
                let name = char;
                i++;
                if (i < len && /[a-z]/.test(clean[i])) {
                    name += clean[i];
                    i++;
                }
                let numStr = '';
                while (i < len && /\d/.test(clean[i])) {
                    numStr += clean[i];
                    i++;
                }
                const count = numStr ? parseInt(numStr, 10) : 1;
                const current = stack[stack.length - 1];
                current[name] = (current[name] || 0) + count;
            } else {
                i++;
            }
        }
        while (stack.length > 1) {
            const top = stack.pop();
            const parent = stack[stack.length - 1];
            Object.keys(top).forEach((el) => {
                parent[el] = (parent[el] || 0) + top[el];
            });
        }
        return stack[0];
    }

    function classifyFormula(formula) {
        if (!formula || !dataMaps) return { kind: 'unknown' };
        if (formula === 'H2O') return { kind: 'water' };

        const classInfo = dataMaps.classMap.get(formula);
        if (classInfo) {
            if (classInfo.class === 'oxide') {
                return { kind: 'oxide', subclass: classInfo.subclass || dataMaps.oxideSubclassMap.get(formula) };
            }
            return { kind: classInfo.class, subclass: classInfo.subclass };
        }

        if (parseAcid(formula)) return { kind: 'acid' };
        if (parseBase(formula)) return { kind: 'base' };

        if (dataMaps.elementMap.has(formula)) {
            const el = dataMaps.elementMap.get(formula);
            if (el.is_metal) return { kind: 'metal' };
            if (el.is_nonmetal) return { kind: 'nonmetal' };
            return { kind: 'element' };
        }

        if (/^(F|Cl|Br|I)2$/.test(formula)) return { kind: 'halogen' };

        return { kind: 'unknown' };
    }

    function findHalideSalt(formula) {
        if (!ionMaps) return null;
        const halides = ['F', 'Cl', 'Br', 'I'];
        for (const hal of halides) {
            const anion = `${hal}-`;
            if (!ionMaps.anions.has(hal)) {
                // anion formulas in map are like Cl, Br, I
            }
            const suffixMatch = formula.match(new RegExp(`^(.+?)${hal}(\\d*)$`));
            if (suffixMatch) {
                const cationFormula = suffixMatch[1];
                const cationCharge = getIonCharge(cationFormula, 'cation', 'min');
                if (!cationCharge) continue;
                return { cationFormula, cationCharge, anionFormula: hal, anionCharge: -1 };
            }
        }
        return null;
    }

    function extractCondition(token) {
        const raw = token.toLowerCase();
        if (raw.includes('конц')) return 'conc';
        if (raw.includes('разб')) return 'dilute';
        if (raw.includes('оч.разб') || raw.includes('оченьразб') || raw.includes('оч.')) return 'very-dilute';
        return null;
    }

    function hasKeyword(raw, words) {
        const text = String(raw || '').toLowerCase();
        return words.some((w) => text.includes(w));
    }

    function getMetalChargePreferMax(metal) {
        return getIonCharge(metal, 'cation', 'max') || getIonCharge(metal, 'cation', 'min');
    }

    function ruleNeutralization(tokens) {
        if (!ionMaps) return null;
        if (tokens.length !== 2) return null;

        const first = normalizeToken(tokens[0], { stripConditions: true });
        const second = normalizeToken(tokens[1], { stripConditions: true });

        const tryPair = (acidStr, baseStr) => {
            const acid = parseAcid(acidStr);
            const base = parseBase(baseStr);
            if (!acid || !base) return null;

            const anionCharge = getIonCharge(acid.anionFormula, 'anion', 'min');
            const cationCharge = getIonCharge(base.cationFormula, 'cation', 'min');
            if (!anionCharge || !cationCharge) return null;

            const salt = buildSaltFormula(base.cationFormula, cationCharge, acid.anionFormula, anionCharge);
            const l = lcm(acid.hCount, base.ohCount);
            const acidCoeff = l / acid.hCount;
            const baseCoeff = l / base.ohCount;
            const waterCoeff = l;

            const left = `${formatCoeff(acidCoeff)}${acidStr} + ${formatCoeff(baseCoeff)}${baseStr}`;
            const right = `${salt} + ${formatCoeff(waterCoeff)}H2O`;
            return `${left} \u2192 ${right}`;
        };

        return tryPair(first, second) || tryPair(second, first);
    }

    function ruleBasicOxideWater(tokens) {
        if (!dataMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const first = classifyFormula(a);
        const second = classifyFormula(b);
        const tryPair = (oxideStr, otherStr) => {
            if (classifyFormula(oxideStr).kind !== 'oxide') return null;
            if (classifyFormula(otherStr).kind !== 'water') return null;
            const oxideInfo = dataMaps.metalOxideMap.get(oxideStr);
            if (!oxideInfo || !oxideInfo.hydroxide) return null;
            const hydroxideClass = dataMaps.classMap.get(oxideInfo.hydroxide);
            const subclass = hydroxideClass?.subclass || '';
            if (!/strong/i.test(String(subclass))) return null;
            return `${oxideStr} + H2O \u2192 ${oxideInfo.hydroxide}`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleAcidicOxideWater(tokens) {
        if (!dataMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (oxideStr, otherStr) => {
            const info = classifyFormula(oxideStr);
            if (info.kind !== 'oxide') return null;
            if (classifyFormula(otherStr).kind !== 'water') return null;
            if (oxideStr === 'SiO2') return null;
            const acid = dataMaps.oxideToAcidMap.get(oxideStr);
            if (!acid) return null;
            return `${oxideStr} + H2O \u2192 ${acid}`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleBasicOxideAcid(tokens) {
        if (!dataMaps || !ionMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (oxideStr, acidStr) => {
            const info = classifyFormula(oxideStr);
            if (info.kind !== 'oxide') return null;
            const acid = parseAcid(acidStr);
            if (!acid) return null;
            const oxideInfo = dataMaps.metalOxideMap.get(oxideStr);
            if (!oxideInfo) return null;
            const metalSymbol = oxideInfo.metal ? oxideInfo.metal.replace(/\(.*\)$/, '') : null;
            if (!metalSymbol) return null;
            const cationCharge = getIonCharge(metalSymbol, 'cation', 'min');
            const anionCharge = getIonCharge(acid.anionFormula, 'anion', 'min');
            if (!cationCharge || !anionCharge) return null;
            const salt = buildSaltFormula(metalSymbol, cationCharge, acid.anionFormula, anionCharge);
            return `${oxideStr} + ${acidStr} \u2192 ${salt} + H2O`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleAcidicOxideBase(tokens) {
        if (!dataMaps || !ionMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (oxideStr, baseStr) => {
            const info = classifyFormula(oxideStr);
            if (info.kind !== 'oxide') return null;
            const base = parseBase(baseStr);
            if (!base) return null;
            const baseClass = dataMaps.classMap.get(baseStr);
            const baseSubclass = baseClass?.subclass || '';
            if (!/strong/i.test(String(baseSubclass))) return null;
            const acid = dataMaps.oxideToAcidMap.get(oxideStr);
            if (!acid) return null;
            const acidParsed = parseAcid(acid);
            if (!acidParsed) return null;
            const cationCharge = getIonCharge(base.cationFormula, 'cation', 'min');
            const anionCharge = getIonCharge(acidParsed.anionFormula, 'anion', 'min');
            if (!cationCharge || !anionCharge) return null;
            const salt = buildSaltFormula(base.cationFormula, cationCharge, acidParsed.anionFormula, anionCharge);
            return `${oxideStr} + ${baseStr} \u2192 ${salt} + H2O`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleBasicOxideAcidicOxide(tokens) {
        if (!dataMaps || !ionMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (basicOxide, acidicOxide) => {
            const info = classifyFormula(basicOxide);
            if (info.kind !== 'oxide') return null;
            const acid = dataMaps.oxideToAcidMap.get(acidicOxide);
            if (!acid) return null;
            const oxideInfo = dataMaps.metalOxideMap.get(basicOxide);
            if (!oxideInfo) return null;
            const metalSymbol = oxideInfo.metal ? oxideInfo.metal.replace(/\(.*\)$/, '') : null;
            if (!metalSymbol) return null;
            const acidParsed = parseAcid(acid);
            if (!acidParsed) return null;
            const cationCharge = getIonCharge(metalSymbol, 'cation', 'min');
            const anionCharge = getIonCharge(acidParsed.anionFormula, 'anion', 'min');
            if (!cationCharge || !anionCharge) return null;
            const salt = buildSaltFormula(metalSymbol, cationCharge, acidParsed.anionFormula, anionCharge);
            return `${basicOxide} + ${acidicOxide} \u2192 ${salt}`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleAmphotericAcid(tokens) {
        if (!dataMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (amphStr, acidStr) => {
            const info = classifyFormula(amphStr);
            if (info.kind !== 'oxide' && info.kind !== 'base') return null;
            if (!info.subclass || !String(info.subclass).includes('amphoteric')) return null;
            if (!parseAcid(acidStr)) return null;
            return ruleBasicOxideAcid([amphStr, acidStr]) || ruleNeutralization([amphStr, acidStr]);
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleAmphotericBase(tokens) {
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const alkalis = ['NaOH', 'KOH'];
        const amphMap = {
            'Al(OH)3': { coeff: 1, complex: '[Al(OH)4]' },
            'Zn(OH)2': { coeff: 2, complex: '[Zn(OH)4]' },
            'Be(OH)2': { coeff: 2, complex: '[Be(OH)4]' },
            'Cr(OH)3': { coeff: 1, complex: '[Cr(OH)4]' },
            'Sn(OH)2': { coeff: 2, complex: '[Sn(OH)4]' },
            'Pb(OH)2': { coeff: 2, complex: '[Pb(OH)4]' },
            'Al2O3': { coeff: 2, complex: '[Al(OH)4]', needsWater: 3 },
            'ZnO': { coeff: 2, complex: '[Zn(OH)4]', needsWater: 1 },
            'BeO': { coeff: 2, complex: '[Be(OH)4]', needsWater: 1 },
            'Cr2O3': { coeff: 2, complex: '[Cr(OH)4]', needsWater: 3 },
            'SnO': { coeff: 2, complex: '[Sn(OH)4]', needsWater: 1 },
            'PbO': { coeff: 2, complex: '[Pb(OH)4]', needsWater: 1 }
        };

        const tryPair = (amphStr, baseStr) => {
            if (!alkalis.includes(baseStr)) return null;
            const cfg = amphMap[amphStr];
            if (!cfg) return null;
            const cation = baseStr.replace('OH', '');
            const complexSalt = `${cfg.coeff > 1 ? cfg.coeff : ''}${cation}${cfg.complex}`;
            const baseCoeff = cfg.coeff;
            const waterPart = cfg.needsWater ? ` + ${cfg.needsWater}H2O` : '';
            return `${amphStr} + ${baseCoeff} ${baseStr}${waterPart} \u2192 ${complexSalt}`;
        };

        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleMetalWater(tokens) {
        if (!dataMaps || !ionMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (metalStr, waterStr) => {
            if (classifyFormula(metalStr).kind !== 'metal') return null;
            if (classifyFormula(waterStr).kind !== 'water') return null;
            const hydroxide = dataMaps.metalToHydroxideMap.get(metalStr);
            if (!hydroxide) return null;
            const charge = getIonCharge(metalStr, 'cation', 'min');
            if (!charge) return null;
            if (charge === 1) {
                return `2${metalStr} + 2H2O \u2192 2${hydroxide} + H2\u2191`;
            }
            if (charge === 2) {
                return `${metalStr} + 2H2O \u2192 ${hydroxide} + H2\u2191`;
            }
            return `${metalStr} + H2O \u2192 ${hydroxide} + H2\u2191`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleMetalOxygen(tokens) {
        if (!dataMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (metalStr, oxygenStr) => {
            if (classifyFormula(metalStr).kind !== 'metal') return null;
            if (oxygenStr !== 'O2') return null;
            const oxide = dataMaps.metalToOxideMap.get(metalStr);
            if (!oxide) return null;
            const counts = parseFormulaCounts(oxide);
            const metalCount = counts[metalStr] || 1;
            const oxygenCount = counts.O || 1;
            const l = lcm(oxygenCount, 2);
            const oxideCoeff = l / oxygenCount;
            const o2Coeff = l / 2;
            const metalCoeff = metalCount * oxideCoeff;
            const left = `${formatCoeff(metalCoeff)}${metalStr} + ${formatCoeff(o2Coeff)}O2`;
            const right = `${formatCoeff(oxideCoeff)}${oxide}`;
            return `${left} \u2192 ${right}`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleNonmetalOxygen(tokens) {
        if (!dataMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (nonmetalStr, oxygenStr) => {
            if (classifyFormula(nonmetalStr).kind !== 'nonmetal') return null;
            if (oxygenStr !== 'O2') return null;
            // Pick first matching oxide from acid_oxide_pairs
            let oxide = null;
            for (const pair of dataMaps.oxideToAcidMap.entries()) {
                const [ox] = pair;
                const counts = parseFormulaCounts(ox);
                if (counts[nonmetalStr]) {
                    oxide = ox;
                    break;
                }
            }
            if (!oxide) return null;
            const counts = parseFormulaCounts(oxide);
            const elemCount = counts[nonmetalStr] || 1;
            const oxygenCount = counts.O || 1;
            const l = lcm(oxygenCount, 2);
            const oxideCoeff = l / oxygenCount;
            const o2Coeff = l / 2;
            const elemCoeff = elemCount * oxideCoeff;
            const left = `${formatCoeff(elemCoeff)}${nonmetalStr} + ${formatCoeff(o2Coeff)}O2`;
            const right = `${formatCoeff(oxideCoeff)}${oxide}`;
            return `${left} \u2192 ${right}`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleHalogenDisplacement(tokens) {
        if (!ionMaps) return null;
        if (tokens.length !== 2) return null;
        const order = ['F2', 'Cl2', 'Br2', 'I2'];
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (halogen, salt) => {
            if (!order.includes(halogen)) return null;
            const saltInfo = findHalideSalt(salt);
            if (!saltInfo) return null;
            const saltHal = `${saltInfo.anionFormula}2`;
            const canDisplace = order.indexOf(halogen) < order.indexOf(saltHal);
            if (!canDisplace) return null;
            const newSalt = buildSaltFormula(saltInfo.cationFormula, saltInfo.cationCharge, halogen.replace('2', ''), -1);
            const saltCoeff = Math.abs(saltInfo.cationCharge) === 1 ? 2 : 1;
            const leftSalt = `${formatCoeff(saltCoeff)}${salt}`;
            const rightSalt = `${formatCoeff(saltCoeff)}${newSalt}`;
            return `${halogen} + ${leftSalt} \u2192 ${rightSalt} + ${saltHal}`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleMetalAcid(tokens) {
        if (!dataMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (metalStr, acidStr) => {
            if (classifyFormula(metalStr).kind !== 'metal') return null;
            const acid = parseAcid(acidStr);
            if (!acid) return null;
            const acidInfo = dataMaps.classMap.get(acidStr);
            if (acidInfo && acidInfo.info && acidInfo.info.is_oxidizer) return null;
            const metalRank = dataMaps.activityMap.get(metalStr);
            const hRank = dataMaps.activityMap.get('H');
            if (metalRank && hRank && metalRank > hRank) return null;
            const cationCharge = getIonCharge(metalStr, 'cation', 'min');
            const anionCharge = getIonCharge(acid.anionFormula, 'anion', 'min');
            if (!cationCharge || !anionCharge) return null;
            const salt = buildSaltFormula(metalStr, cationCharge, acid.anionFormula, anionCharge);
            return `${metalStr} + ${acidStr} \u2192 ${salt} + H2\u2191`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleMetalHNO3(tokens, rawInput) {
        if (!dataMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (metalStr, acidStr) => {
            if (classifyFormula(metalStr).kind !== 'metal') return null;
            if (!/HNO3/i.test(acidStr)) return null;

            const isConc = hasKeyword(rawInput, ['конц']);
            const isVeryDilute = hasKeyword(rawInput, ['оч.разб', 'оченьразб', 'оч.']);
            const isDilute = hasKeyword(rawInput, ['разб']) || !isConc;

            if (isConc) {
                // R03
                if (['Au', 'Pt'].includes(metalStr)) return null;
                if (['Fe', 'Al', 'Cr'].includes(metalStr) && !hasKeyword(rawInput, ['t', 'нагрев'])) return null;
                const cationCharge = getMetalChargePreferMax(metalStr);
                const nitrate = buildSaltFormula(metalStr, cationCharge, 'NO3', -1);
                return `${metalStr} + HNO3(конц) \u2192 ${nitrate} + NO2\u2191 + H2O`;
            }

            // R02 (dilute)
            if (['Au', 'Pt'].includes(metalStr)) return null;
            const metalRank = dataMaps.activityMap.get(metalStr) || 999;
            const isActive = metalRank <= (dataMaps.activityMap.get('Al') || 7);
            const cationCharge = getMetalChargePreferMax(metalStr);
            const nitrate = buildSaltFormula(metalStr, cationCharge, 'NO3', -1);
            if (isVeryDilute && isActive) {
                return `${metalStr} + HNO3(оч.разб) \u2192 ${nitrate} + NH4NO3 + H2O`;
            }
            return `${metalStr} + HNO3(разб) \u2192 ${nitrate} + NO\u2191 + H2O`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleMetalH2SO4Conc(tokens, rawInput) {
        if (!dataMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (metalStr, acidStr) => {
            if (classifyFormula(metalStr).kind !== 'metal') return null;
            if (!/H2SO4/i.test(acidStr) || !hasKeyword(rawInput, ['конц'])) return null;
            if (['Au', 'Pt'].includes(metalStr)) return null;
            if (['Fe', 'Al', 'Cr'].includes(metalStr) && !hasKeyword(rawInput, ['t', 'нагрев'])) return null;
            const metalRank = dataMaps.activityMap.get(metalStr) || 999;
            const isActive = metalRank <= (dataMaps.activityMap.get('Zn') || 9);
            const cationCharge = getMetalChargePreferMax(metalStr);
            const sulfate = buildSaltFormula(metalStr, cationCharge, 'SO4', -2);
            if (isActive) {
                return `${metalStr} + H2SO4(конц) \u2192 ${sulfate} + H2S\u2191 + H2O`;
            }
            return `${metalStr} + H2SO4(конц) \u2192 ${sulfate} + SO2\u2191 + H2O`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleAmphotericFusion(tokens, rawInput) {
        if (tokens.length !== 2) return null;
        if (!hasKeyword(rawInput, ['сплав', 'сплавл'])) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (amphStr, baseStr) => {
            if (!['NaOH', 'KOH'].includes(baseStr)) return null;
            const map = {
                'Al2O3': 'NaAlO2',
                'ZnO': 'Na2ZnO2',
                'Al(OH)3': 'NaAlO2',
                'Cr2O3': 'NaCrO2'
            };
            if (!map[amphStr]) return null;
            const salt = baseStr.startsWith('K') ? map[amphStr].replace(/^Na/, 'K') : map[amphStr];
            return `${amphStr} + ${baseStr} \u2192 ${salt} + H2O`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleDecompositionNitrates(tokens, rawInput) {
        if (tokens.length !== 1) return null;
        const saltStr = normalizeToken(tokens[0], { stripConditions: true });
        if (!saltStr.includes('NO3')) return null;
        if (!hasKeyword(rawInput, ['t', 'нагрев'])) return null;
        if (saltStr === 'NH4NO3') return 'NH4NO3 \u2192 N2O\u2191 + 2H2O';
        const salt = detectSalt(saltStr);
        if (!salt) return null;
        const cation = salt.cationFormula;
        if (['Na', 'K', 'Rb', 'Cs'].includes(cation)) {
            const nitrite = buildSaltFormula(cation, getIonCharge(cation, 'cation', 'min'), 'NO2', -1);
            return `${saltStr} \u2192 ${nitrite} + O2\u2191`;
        }
        if (['Ag', 'Hg'].includes(cation)) {
            return `${saltStr} \u2192 ${cation} + NO2\u2191 + O2\u2191`;
        }
        const oxide = dataMaps.metalToOxideMap.get(cation);
        if (oxide) {
            return `${saltStr} \u2192 ${oxide} + NO2\u2191 + O2\u2191`;
        }
        return null;
    }

    function ruleDecompositionCarbonates(tokens, rawInput) {
        if (tokens.length !== 1) return null;
        const saltStr = normalizeToken(tokens[0], { stripConditions: true });
        if (!saltStr.includes('CO3')) return null;
        if (!hasKeyword(rawInput, ['t', 'нагрев'])) return null;
        if (saltStr.includes('HCO3')) {
            const salt = detectSalt(saltStr);
            if (!salt) return null;
            const carbonate = buildSaltFormula(salt.cationFormula, salt.cationCharge, 'CO3', -2);
            return `${saltStr} \u2192 ${carbonate} + CO2\u2191 + H2O`;
        }
        const salt = detectSalt(saltStr);
        if (!salt) return null;
        if (['Na', 'K', 'Rb', 'Cs'].includes(salt.cationFormula)) return null;
        const oxide = dataMaps.metalToOxideMap.get(salt.cationFormula);
        if (oxide) {
            return `${saltStr} \u2192 ${oxide} + CO2\u2191`;
        }
        return null;
    }

    function ruleDecompositionHydroxides(tokens, rawInput) {
        if (tokens.length !== 1) return null;
        const baseStr = normalizeToken(tokens[0], { stripConditions: true });
        if (!baseStr.includes('OH')) return null;
        if (!hasKeyword(rawInput, ['t', 'нагрев'])) return null;
        const baseClass = dataMaps.classMap.get(baseStr);
        const subclass = String(baseClass?.subclass || '');
        if (/strong/i.test(subclass)) return null;
        const base = parseBase(baseStr);
        if (!base) return null;
        const oxide = dataMaps.metalToOxideMap.get(base.cationFormula);
        if (oxide) return `${baseStr} \u2192 ${oxide} + H2O`;
        return null;
    }

    function ruleHydrolysis(tokens) {
        if (!dataMaps) return null;
        if (tokens.length !== 1) return null;
        const saltStr = normalizeToken(tokens[0], { stripConditions: true });
        const salt = detectSalt(saltStr);
        if (!salt) return null;
        const acid = `H${Math.abs(salt.anionCharge)}${salt.anionFormula}`;
        const base = buildSaltFormula(salt.cationFormula, salt.cationCharge, 'OH', -1);
        if (isWeakAcid(acid) || isWeakBase(base)) {
            return `${saltStr} + H2O \u21cc ${acid} + ${base}`;
        }
        return null;
    }

    function ruleAcidSaltBase(tokens) {
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (acidSalt, baseStr) => {
            if (!parseBase(baseStr)) return null;
            if (!/HCO3|HSO4|HSO3|H2PO4/.test(acidSalt)) return null;
            const salt = detectSalt(acidSalt);
            if (!salt) return null;
            const targetAnion = acidSalt.includes('HCO3') ? 'CO3' :
                acidSalt.includes('HSO4') ? 'SO4' :
                acidSalt.includes('HSO3') ? 'SO3' : 'PO4';
            const newSalt = buildSaltFormula(salt.cationFormula, salt.cationCharge, targetAnion, getIonCharge(targetAnion, 'anion', 'min'));
            return `${acidSalt} + ${baseStr} \u2192 ${newSalt} + H2O`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleSaltAcidSalt(tokens) {
        if (tokens.length < 2 || tokens.length > 3) return null;
        const joined = normalizeRawInput(tokens.join('+'));
        if (joined.includes('Na2CO3') && joined.includes('CO2') && joined.includes('H2O')) {
            return 'Na2CO3 + CO2 + H2O \u2192 2NaHCO3';
        }
        if (joined.includes('Na2SO4') && joined.includes('H2SO4')) {
            return 'Na2SO4 + H2SO4 \u2192 2NaHSO4';
        }
        if (joined.includes('Na3PO4') && joined.includes('H3PO4')) {
            return 'Na3PO4 + H3PO4 \u2192 3NaH2PO4';
        }
        return null;
    }

    function ruleKMnO4(tokens) {
        const joined = normalizeRawInput(tokens.join('+'));
        if (joined.includes('KMnO4') && joined.includes('Na2SO3') && joined.includes('H2SO4')) {
            return '2KMnO4 + 5Na2SO3 + 3H2SO4 \u2192 2MnSO4 + 5Na2SO4 + K2SO4 + 3H2O';
        }
        if (joined.includes('KMnO4') && joined.includes('Na2SO3') && joined.includes('H2O')) {
            return '2KMnO4 + 3Na2SO3 + H2O \u2192 2MnO2\u2193 + 3Na2SO4 + 2KOH';
        }
        return null;
    }

    function ruleK2Cr2O7(tokens) {
        const joined = normalizeRawInput(tokens.join('+'));
        if (joined.includes('K2Cr2O7') && joined.includes('H2S') && joined.includes('H2SO4')) {
            return 'K2Cr2O7 + 3H2S + 4H2SO4 \u2192 Cr2(SO4)3 + 3S\u2193 + K2SO4 + 7H2O';
        }
        if (joined.includes('K2Cr2O7') && joined.includes('FeSO4') && joined.includes('H2SO4')) {
            return 'K2Cr2O7 + 6FeSO4 + 7H2SO4 \u2192 Cr2(SO4)3 + 3Fe2(SO4)3 + K2SO4 + 7H2O';
        }
        return null;
    }

    function ruleElectrolysis(tokens, rawInput) {
        if (!hasKeyword(rawInput, ['элект', 'электролиз'])) return null;
        const joined = normalizeRawInput(tokens.join('+'));
        if (joined.includes('NaCl') && hasKeyword(rawInput, ['раствор'])) {
            return '2NaCl + 2H2O \u2192 2NaOH + H2\u2191 + Cl2\u2191';
        }
        if (joined.includes('NaCl')) {
            return '2NaCl \u2192 2Na + Cl2\u2191';
        }
        if (joined.includes('Al2O3')) {
            return '2Al2O3 \u2192 4Al + 3O2\u2191';
        }
        if (joined.includes('NaOH')) {
            return '4NaOH \u2192 4Na + O2\u2191 + 2H2O';
        }
        if (joined.includes('MgCl2')) {
            return 'MgCl2 \u2192 Mg + Cl2\u2191';
        }
        if (joined.includes('CuSO4')) {
            return '2CuSO4 + 2H2O \u2192 2Cu + O2\u2191 + 2H2SO4';
        }
        if (joined.includes('H2O')) {
            return '2H2O \u2192 2H2\u2191 + O2\u2191';
        }
        return null;
    }

    function ruleDehydration(tokens) {
        const joined = normalizeRawInput(tokens.join('+'));
        if (joined.includes('C12H22O11') && joined.includes('H2SO4')) {
            return 'C12H22O11 + H2SO4(конц) \u2192 12C + 11H2O';
        }
        if (joined.includes('CuSO4') && joined.includes('5H2O') && joined.includes('H2SO4')) {
            return 'CuSO4\u00b75H2O + H2SO4(конц) \u2192 CuSO4 + H2SO4\u00b75H2O';
        }
        return null;
    }

    function ruleAquaRegia(tokens) {
        const joined = normalizeRawInput(tokens.join('+'));
        if (joined.includes('Au') && joined.includes('HNO3') && joined.includes('HCl')) {
            return 'Au + HNO3 + 4HCl \u2192 H[AuCl4] + NO\u2191 + 2H2O';
        }
        return null;
    }

    function ruleSilicicAcid(tokens) {
        const joined = normalizeRawInput(tokens.join('+'));
        if (joined.includes('Na2SiO3') && joined.includes('HCl')) {
            return 'Na2SiO3 + 2HCl \u2192 2NaCl + H2SiO3\u2193';
        }
        return null;
    }

    function ruleUnstableAcids(tokens) {
        if (tokens.length !== 1) return null;
        const acid = normalizeToken(tokens[0], { stripConditions: true });
        if (acid === 'H2CO3') return 'H2CO3 \u2192 CO2\u2191 + H2O';
        if (acid === 'H2SO3') return 'H2SO3 \u2192 SO2\u2191 + H2O';
        if (acid === 'H2SiO3') return 'H2SiO3 \u2192 SiO2 + H2O';
        return null;
    }

    function ruleSaltAcid(tokens) {
        if (!dataMaps || !ionMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (saltStr, acidStr) => {
            const salt = detectSalt(saltStr);
            const acid = parseAcid(acidStr);
            if (!salt || !acid) return null;
            const newSalt = buildSaltFormula(salt.cationFormula, salt.cationCharge, acid.anionFormula, getIonCharge(acid.anionFormula, 'anion', 'min'));
            const newAcid = `H${acid.hCount > 1 ? acid.hCount : ''}${salt.anionFormula}`;
            const newSaltSol = getSolubility(salt.cationFormula, salt.cationCharge, acid.anionFormula, getIonCharge(acid.anionFormula, 'anion', 'min'));
            const newAcidWeak = isWeakAcid(newAcid) || isGasProduct(newAcid);
            if (isInsoluble(newSaltSol) || newAcidWeak) {
                const gasPart = isGasProduct(newAcid)
                    ? ` + ${newAcid === 'H2CO3' ? 'CO2↑ + H2O' : newAcid === 'H2SO3' ? 'SO2↑ + H2O' : newAcid === 'H2S' ? 'H2S↑' : 'NH3↑ + H2O'}`
                    : ` + ${newAcid}`;
                return `${saltStr} + ${acidStr} \u2192 ${newSalt}${gasPart}`;
            }
            return null;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleSaltBase(tokens) {
        if (!dataMaps || !ionMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (saltStr, baseStr) => {
            const salt = detectSalt(saltStr);
            const base = parseBase(baseStr);
            if (!salt || !base) return null;
            const anionCharge = salt.anionCharge;
            const cationCharge = salt.cationCharge;
            const baseCationCharge = getIonCharge(base.cationFormula, 'cation', 'min');
            const newSalt = buildSaltFormula(base.cationFormula, baseCationCharge, salt.anionFormula, anionCharge);
            const newBase = buildSaltFormula(salt.cationFormula, cationCharge, 'OH', -1);
            const newSaltSol = getSolubility(base.cationFormula, baseCationCharge, salt.anionFormula, anionCharge);
            const newBaseWeak = isWeakBase(newBase) || isInsoluble(getSolubility(salt.cationFormula, cationCharge, 'OH', -1));
            if (isInsoluble(newSaltSol) || newBaseWeak || newBase === 'NH4OH') {
                const basePart = newBase === 'NH4OH' ? 'NH3↑ + H2O' : newBase;
                return `${saltStr} + ${baseStr} \u2192 ${newSalt} + ${basePart}`;
            }
            return null;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleSaltSalt(tokens) {
        if (!dataMaps || !ionMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (saltStr1, saltStr2) => {
            const s1 = detectSalt(saltStr1);
            const s2 = detectSalt(saltStr2);
            if (!s1 || !s2) return null;
            const newSalt1 = buildSaltFormula(s1.cationFormula, s1.cationCharge, s2.anionFormula, s2.anionCharge);
            const newSalt2 = buildSaltFormula(s2.cationFormula, s2.cationCharge, s1.anionFormula, s1.anionCharge);
            const sol1 = getSolubility(s1.cationFormula, s1.cationCharge, s2.anionFormula, s2.anionCharge);
            const sol2 = getSolubility(s2.cationFormula, s2.cationCharge, s1.anionFormula, s1.anionCharge);
            if (isInsoluble(sol1) || isInsoluble(sol2)) {
                return `${saltStr1} + ${saltStr2} \u2192 ${newSalt1} + ${newSalt2}`;
            }
            return null;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleMetalSalt(tokens) {
        if (!dataMaps || !ionMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (metalStr, saltStr) => {
            if (classifyFormula(metalStr).kind !== 'metal') return null;
            const salt = detectSalt(saltStr);
            if (!salt) return null;
            const metalRank = dataMaps.activityMap.get(metalStr);
            const saltMetalRank = dataMaps.activityMap.get(salt.cationFormula);
            if (!metalRank || !saltMetalRank) return null;
            if (metalRank >= saltMetalRank) return null;
            const newSalt = buildSaltFormula(metalStr, getIonCharge(metalStr, 'cation', 'min'), salt.anionFormula, salt.anionCharge);
            return `${metalStr} + ${saltStr} \u2192 ${newSalt} + ${salt.cationFormula}\u2193`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function applyRules(tokens, rawTokens) {
        const handlers = [
            { id: 'R30', fn: (t, r) => ruleElectrolysis(t, r), status: 'Подставлено по правилу электролиза.' },
            { id: 'R31', fn: (t, r) => ruleElectrolysis(t, r), status: 'Подставлено по правилу электролиза.' },
            { id: 'R32', fn: ruleDehydration, status: 'Подставлено по правилу водоотнимающих реакций.' },
            { id: 'R33', fn: ruleAquaRegia, status: 'Подставлено по правилу царской водки.' },
            { id: 'R34', fn: ruleSilicicAcid, status: 'Подставлено по правилу получения кремниевой кислоты.' },
            { id: 'R35', fn: ruleUnstableAcids, status: 'Подставлено по правилу разложения нестойких кислот.' },
            { id: 'R28', fn: ruleKMnO4, status: 'Подставлено по правилу для KMnO4.' },
            { id: 'R29', fn: ruleK2Cr2O7, status: 'Подставлено по правилу для K2Cr2O7.' },
            { id: 'R20', fn: (t, r) => ruleDecompositionNitrates(t, r), status: 'Подставлено по правилу разложения нитратов.' },
            { id: 'R21', fn: (t, r) => ruleDecompositionCarbonates(t, r), status: 'Подставлено по правилу разложения карбонатов.' },
            { id: 'R22', fn: (t, r) => ruleDecompositionHydroxides(t, r), status: 'Подставлено по правилу разложения гидроксидов.' },
            { id: 'R23', fn: ruleHydrolysis, status: 'Подставлено по правилу гидролиза.' },
            { id: 'R26', fn: ruleAcidSaltBase, status: 'Подставлено по правилу: кислая соль + щёлочь.' },
            { id: 'R27', fn: ruleSaltAcidSalt, status: 'Подставлено по правилу: средняя соль + кислота.' },
            { id: 'R14', fn: ruleNeutralization, status: 'Подставлено по правилу нейтрализации.' },
            { id: 'R11', fn: ruleBasicOxideWater, status: 'Подставлено по правилу образования щёлочи.' },
            { id: 'R13', fn: ruleAcidicOxideWater, status: 'Подставлено по правилу образования кислоты.' },
            { id: 'R10', fn: ruleBasicOxideAcid, status: 'Подставлено по правилу: оксид + кислота.' },
            { id: 'R12', fn: ruleAcidicOxideBase, status: 'Подставлено по правилу: кислотный оксид + щёлочь.' },
            { id: 'R09', fn: ruleBasicOxideAcidicOxide, status: 'Подставлено по правилу: оксид + оксид.' },
            { id: 'R15', fn: ruleAmphotericAcid, status: 'Подставлено по правилу: амфотерное + кислота.' },
            { id: 'R16', fn: ruleAmphotericBase, status: 'Подставлено по правилу: амфотерное + щёлочь.' },
            { id: 'R17', fn: (t, r) => ruleAmphotericFusion(t, r), status: 'Подставлено по правилу: амфотерное + щёлочь (сплавление).' },
            { id: 'R18', fn: ruleMetalWater, status: 'Подставлено по правилу: металл + вода.' },
            { id: 'R19', fn: ruleMetalOxygen, status: 'Подставлено по правилу: металл + O2.' },
            { id: 'R25', fn: ruleNonmetalOxygen, status: 'Подставлено по правилу: неметалл + O2.' },
            { id: 'R24', fn: ruleHalogenDisplacement, status: 'Подставлено по правилу: галогены.' },
            { id: 'R02', fn: (t, r) => ruleMetalHNO3(t, r), status: 'Подставлено по правилу: металл + HNO3 (разб.).' },
            { id: 'R03', fn: (t, r) => ruleMetalHNO3(t, r), status: 'Подставлено по правилу: металл + HNO3 (конц.).' },
            { id: 'R04', fn: (t, r) => ruleMetalH2SO4Conc(t, r), status: 'Подставлено по правилу: металл + H2SO4 (конц.).' },
            { id: 'R01', fn: ruleMetalAcid, status: 'Подставлено по правилу: металл + кислота.' },
            { id: 'R05', fn: ruleSaltAcid, status: 'Подставлено по правилу: соль + кислота.' },
            { id: 'R06', fn: ruleSaltBase, status: 'Подставлено по правилу: соль + щёлочь.' },
            { id: 'R07', fn: ruleSaltSalt, status: 'Подставлено по правилу: соль + соль.' },
            { id: 'R08', fn: ruleMetalSalt, status: 'Подставлено по правилу: металл + соль.' }
        ];

        for (const handler of handlers) {
            const result = handler.fn(tokens, rawTokens);
            if (result) {
                return { equation: result, status: handler.status };
            }
        }

        return null;
    }

    function normalizeRawInput(raw) {
        return normalizeDigits(String(raw || '')).replace(/\s+/g, '');
    }

    function splitAlternatives(str) {
        return str.split('/').map((s) => s.trim()).filter(Boolean);
    }

    function patternMatchesInput(pattern, rawInput) {
        if (!pattern) return false;
        const raw = normalizeRawInput(rawInput);
        const parts = pattern.split('+').map((s) => s.trim()).filter(Boolean);
        if (!parts.length) return false;
        return parts.every((part) => {
            const variants = splitAlternatives(part);
            return variants.some((v) => raw.includes(normalizeRawInput(v)));
        });
    }

    function detectCandidateRule(tokens, rawInput) {
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const acidA = parseAcid(a);
        const acidB = parseAcid(b);
        const metalA = classifyFormula(a).kind === 'metal';
        const metalB = classifyFormula(b).kind === 'metal';
        const acid = acidA ? a : (acidB ? b : null);
        const metal = metalA ? a : (metalB ? b : null);
        const saltA = detectSalt(a);
        const saltB = detectSalt(b);
        const baseA = parseBase(a);
        const baseB = parseBase(b);
        if (saltA && acidB || saltB && acidA) return 'R05';
        if (saltA && baseB || saltB && baseA) return 'R06';
        if (saltA && saltB) return 'R07';
        if ((metalA && saltB) || (metalB && saltA)) return 'R08';
        if (!acid || !metal) return null;

        if (/HNO3/i.test(acid)) {
            if (/конц/i.test(rawInput)) return 'R03';
            return 'R02';
        }
        if (/H2SO4/i.test(acid) && /конц/i.test(rawInput)) {
            return 'R04';
        }
        return 'R01';
    }

    function detectNoReaction(tokens, rawInput) {
        if (!dataMaps) return null;
        const candidateRule = detectCandidateRule(tokens, rawInput);

        if (candidateRule && Array.isArray(window.REACTIONS_DB?.rule_exceptions)) {
            for (const ex of window.REACTIONS_DB.rule_exceptions) {
                if (ex.rule_id && candidateRule && ex.rule_id !== candidateRule) continue;
                if (ex.forbidden_pattern && patternMatchesInput(ex.forbidden_pattern, rawInput)) {
                    return { reason: ex.reason || ex.description || 'Реакция не идёт' };
                }
                if (Array.isArray(ex.forbidden_substances)) {
                    const normTokens = tokens.map((t) => normalizeToken(t, { stripConditions: true }));
                    const hit = ex.forbidden_substances.some((s) => normTokens.includes(normalizeToken(s, { stripConditions: true })));
                    if (hit) {
                        return { reason: ex.reason || ex.description || 'Реакция не идёт' };
                    }
                }
            }
        }

        // Generic: metal after H with non-oxidizing acid
        if (candidateRule === 'R01') {
            const a = normalizeToken(tokens[0], { stripConditions: true });
            const b = normalizeToken(tokens[1], { stripConditions: true });
            const acid = parseAcid(a) ? a : (parseAcid(b) ? b : null);
            const metal = classifyFormula(a).kind === 'metal' ? a : (classifyFormula(b).kind === 'metal' ? b : null);
            if (acid && metal) {
                const metalRank = dataMaps.activityMap.get(metal);
                const hRank = dataMaps.activityMap.get('H');
                const acidInfo = dataMaps.classMap.get(acid)?.info;
                if (metalRank && hRank && metalRank > hRank && !(acidInfo && acidInfo.is_oxidizer)) {
                    return { reason: 'Металл стоит после H в ряду активности — не вытесняет H2 из кислот' };
                }
            }
        }

        // Basic oxide + water that does not react (weak/insoluble hydroxide)
        if (tokens.length === 2) {
            const a = normalizeToken(tokens[0], { stripConditions: true });
            const b = normalizeToken(tokens[1], { stripConditions: true });
            const tryPair = (oxideStr, waterStr) => {
                if (classifyFormula(oxideStr).kind !== 'oxide') return null;
                if (classifyFormula(waterStr).kind !== 'water') return null;
                const oxideInfo = dataMaps.metalOxideMap.get(oxideStr);
                if (!oxideInfo || !oxideInfo.hydroxide) return { reason: 'Оксид не реагирует с водой.' };
                const hydroxideClass = dataMaps.classMap.get(oxideInfo.hydroxide);
                const subclass = hydroxideClass?.subclass || '';
                if (!/strong/i.test(String(subclass))) {
                    return { reason: 'Основный оксид не реагирует с водой (основание слабое/нерастворимое).' };
                }
                return null;
            };
            const res = tryPair(a, b) || tryPair(b, a);
            if (res) return res;
        }

        // Acidic oxide + water that does not react (SiO2)
        if (tokens.length === 2) {
            const a = normalizeToken(tokens[0], { stripConditions: true });
            const b = normalizeToken(tokens[1], { stripConditions: true });
            const tryPair = (oxideStr, waterStr) => {
                if (classifyFormula(oxideStr).kind !== 'oxide') return null;
                if (classifyFormula(waterStr).kind !== 'water') return null;
                if (oxideStr === 'SiO2') {
                    return { reason: 'Образующаяся H2SiO3 нерастворима — реакция в воде не идёт.' };
                }
                return null;
            };
            const res = tryPair(a, b) || tryPair(b, a);
            if (res) return res;
        }

        // Acidic oxide + weak/insoluble base does not react (needs strong alkali)
        if (tokens.length === 2) {
            const a = normalizeToken(tokens[0], { stripConditions: true });
            const b = normalizeToken(tokens[1], { stripConditions: true });
            const tryPair = (oxideStr, baseStr) => {
                const info = classifyFormula(oxideStr);
                if (info.kind !== 'oxide') return null;
                if (!parseBase(baseStr)) return null;
                const baseClass = dataMaps.classMap.get(baseStr);
                const baseSubclass = baseClass?.subclass || '';
                if (/strong/i.test(String(baseSubclass))) return null;
                return { reason: 'Кислотный оксид реагирует только со щёлочами (сильными основаниями).' };
            };
            const res = tryPair(a, b) || tryPair(b, a);
            if (res) return res;
        }

        // Weak acid + weak basic oxide -> no reaction
        if (tokens.length === 2) {
            const a = normalizeToken(tokens[0], { stripConditions: true });
            const b = normalizeToken(tokens[1], { stripConditions: true });
            const tryPair = (acidStr, oxideStr) => {
                if (!parseAcid(acidStr)) return null;
                const oxideInfo = classifyFormula(oxideStr);
                if (oxideInfo.kind !== 'oxide') return null;
                const acidClass = dataMaps.classMap.get(acidStr);
                const acidSubclass = String(acidClass?.subclass || '');
                if (!/weak/i.test(acidSubclass)) return null;
                if (!/basic/i.test(String(oxideInfo.subclass || ''))) return null;
                const oxidePair = dataMaps.metalOxideMap.get(oxideStr);
                const hydroxide = oxidePair?.hydroxide;
                const hydroxideClass = hydroxide ? dataMaps.classMap.get(hydroxide) : null;
                const hydroxideSubclass = String(hydroxideClass?.subclass || '');
                if (/strong/i.test(hydroxideSubclass)) return null;
                return { reason: 'Слабая кислота и слабый основный оксид не реагируют.' };
            };
            const res = tryPair(a, b) || tryPair(b, a);
            if (res) return res;
        }

        // Salt + acid/base/salt: no driving force
        if (tokens.length === 2) {
            const a = normalizeToken(tokens[0], { stripConditions: true });
            const b = normalizeToken(tokens[1], { stripConditions: true });
            const saltA = detectSalt(a);
            const saltB = detectSalt(b);
            const acidA = parseAcid(a);
            const acidB = parseAcid(b);
            const baseA = parseBase(a);
            const baseB = parseBase(b);

            if ((saltA && acidB) || (saltB && acidA)) {
                const salt = saltA || saltB;
                const acid = acidB ? b : a;
                const acidParsed = parseAcid(acid);
                const newSaltSol = getSolubility(salt.cationFormula, salt.cationCharge, acidParsed.anionFormula, getIonCharge(acidParsed.anionFormula, 'anion', 'min'));
                const newAcid = `H${acidParsed.hCount > 1 ? acidParsed.hCount : ''}${salt.anionFormula}`;
                if (!isInsoluble(newSaltSol) && !isWeakAcid(newAcid) && !isGasProduct(newAcid)) {
                    return { reason: 'Нет осадка/газа/слабого электролита — реакция обмена не идёт.' };
                }
            }

            if ((saltA && baseB) || (saltB && baseA)) {
                const salt = saltA || saltB;
                const base = baseB ? b : a;
                const baseParsed = parseBase(base);
                const newSaltSol = getSolubility(baseParsed.cationFormula, getIonCharge(baseParsed.cationFormula, 'cation', 'min'), salt.anionFormula, salt.anionCharge);
                const newBase = buildSaltFormula(salt.cationFormula, salt.cationCharge, 'OH', -1);
                if (!isInsoluble(newSaltSol) && !isWeakBase(newBase) && newBase !== 'NH4OH') {
                    return { reason: 'Нет осадка/газа/слабого электролита — реакция обмена не идёт.' };
                }
            }

            if (saltA && saltB) {
                const sol1 = getSolubility(saltA.cationFormula, saltA.cationCharge, saltB.anionFormula, saltB.anionCharge);
                const sol2 = getSolubility(saltB.cationFormula, saltB.cationCharge, saltA.anionFormula, saltA.anionCharge);
                if (!isInsoluble(sol1) && !isInsoluble(sol2)) {
                    return { reason: 'Осадок/газ/слабый электролит не образуются — реакция не идёт.' };
                }
            }
        }

        // Metal + salt: metal not active enough
        if (tokens.length === 2) {
            const a = normalizeToken(tokens[0], { stripConditions: true });
            const b = normalizeToken(tokens[1], { stripConditions: true });
            const metal = classifyFormula(a).kind === 'metal' ? a : (classifyFormula(b).kind === 'metal' ? b : null);
            const salt = detectSalt(a) ? a : (detectSalt(b) ? b : null);
            if (metal && salt) {
                const saltInfo = detectSalt(salt);
                const metalRank = dataMaps.activityMap.get(metal);
                const saltMetalRank = dataMaps.activityMap.get(saltInfo.cationFormula);
                if (metalRank && saltMetalRank && metalRank >= saltMetalRank) {
                    return { reason: 'Металл менее активен, чем металл в соли — вытеснение не идёт.' };
                }
            }
        }

        return null;
    }

    function parseExampleReactants(exampleStr) {
        if (!exampleStr) return [];
        const left = exampleStr.split(/\u2192|->|=|⇌/)[0] || '';
        return left
            .split('+')
            .map((t) => normalizeToken(t, { stripConditions: true }))
            .filter(Boolean);
    }

    function ruleHintFromExamples(tokens) {
        if (!ruleMap) return null;
        const normalized = tokens
            .map((t) => normalizeToken(t, { stripConditions: true }))
            .filter(Boolean);
        if (!normalized.length) return null;

        for (const rule of ruleMap.values()) {
            if (!Array.isArray(rule.examples)) continue;
            for (const example of rule.examples) {
                const exTokens = parseExampleReactants(example);
                if (!exTokens.length) continue;
                const exSet = new Set(exTokens);
                const allMatch = normalized.every((tok) => exSet.has(tok));
                if (allMatch) {
                    const hint = `По правилу ${rule.rule_id}: ${rule.products_pattern}\nПример: ${example}`;
                    return { equation: hint, status: `Подсказка по правилу ${rule.rule_id}.` };
                }
            }
        }
        return null;
    }

    async function loadReactionsDB() {
        try {
            const res = await fetch(DB_URL, { cache: 'force-cache' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const examples = data.reaction_examples || [];
            reactionsIndex = buildIndex(examples);
            ionMaps = buildIonMaps(data);
            dataMaps = buildDataMaps(data);
            ruleMap = new Map((data.reaction_rules || []).map((r) => [r.rule_id, r]));
            if (!window.REACTIONS_DB) {
                window.REACTIONS_DB = data;
            }
            dbLoaded = true;
        } catch (err) {
            if (window.REACTIONS_DB && window.REACTIONS_DB.reaction_examples) {
                reactionsIndex = buildIndex(window.REACTIONS_DB.reaction_examples || []);
                ionMaps = buildIonMaps(window.REACTIONS_DB);
                dataMaps = buildDataMaps(window.REACTIONS_DB);
                ruleMap = new Map((window.REACTIONS_DB.reaction_rules || []).map((r) => [r.rule_id, r]));
                dbLoaded = true;
                dbError = null;
                return;
            }
            dbError = err;
            dbLoaded = false;
        }
    }

    function findMatches(tokens) {
        if (!reactionsIndex) return [];
        const strictKey = buildKey(tokens, { stripConditions: false });
        let matches = strictKey ? (reactionsIndex.strict.get(strictKey) || []) : [];
        if (matches.length > 0) return matches;

        const relaxedKey = buildKey(tokens, { stripConditions: true });
        matches = relaxedKey ? (reactionsIndex.relaxed.get(relaxedKey) || []) : [];
        return matches;
    }

    function findSuggestions(tokens) {
        if (!reactionsIndex || tokens.length === 0) return [];
        const relaxedTokens = tokens
            .map((t) => normalizeToken(t, { stripConditions: true }))
            .filter(Boolean);
        if (relaxedTokens.length === 0) return [];
        const tokenSet = new Set(relaxedTokens);
        const suggestions = [];

        for (const entry of reactionsIndex.entries) {
            const entrySet = new Set(entry.relaxedTokens);
            let allMatch = true;
            for (const tok of tokenSet) {
                if (!entrySet.has(tok)) {
                    allMatch = false;
                    break;
                }
            }
            if (allMatch) {
                suggestions.push(entry.example);
                if (suggestions.length >= MAX_SUGGESTIONS) break;
            }
        }
        return suggestions;
    }

    function renderOutput(outputEl, statusEl, tokens, rawInput) {
        if (!outputEl) return;
        if (!tokens.length) {
            outputEl.value = '';
            if (statusEl) {
                statusEl.textContent = 'Введите реагенты — продукты подставятся автоматически.';
            }
            return;
        }
        if (dbError) {
            outputEl.value = 'Не удалось загрузить базу реакций.';
            if (statusEl) {
                statusEl.textContent = 'Ошибка загрузки базы реакций.';
            }
            return;
        }
        if (!dbLoaded) {
            outputEl.value = 'База реакций загружается...';
            if (statusEl) {
                statusEl.textContent = 'База реакций загружается...';
            }
            return;
        }

        const ruleHit = applyRules(tokens, tokens);
        if (ruleHit) {
            outputEl.value = ruleHit.equation;
            if (statusEl) {
                statusEl.textContent = ruleHit.status || 'Подставлено по правилу.';
            }
            return;
        }

        const noRx = detectNoReaction(tokens, rawInput || '');
        const reactantsText = tokens.map((t) => normalizeToken(t, { stripConditions: false })).join(' + ');
        if (noRx) {
            outputEl.value = `${reactantsText} \u21cf\nПричина: ${noRx.reason}`;
            if (statusEl) {
                statusEl.textContent = 'Реакция не идёт.';
            }
            return;
        }

        outputEl.value = 'Реакция не найдена по правилам. Проверьте формулы или укажите условия (разб./конц./t°).';
        if (statusEl) {
            statusEl.textContent = 'Реакция не найдена по правилам.';
        }
    }

    function debounce(fn, ms) {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), ms);
        };
    }

    function initReactionsUI() {
        const inputEl = document.getElementById('reactions-input');
        const outputEl = document.getElementById('reactions-output');
        const statusEl = document.getElementById('reactions-status');
        const goBtn = document.getElementById('reactions-go');
        if (!inputEl || !outputEl) return;

        const update = () => {
            const raw = inputEl.value || '';
            const tokens = splitReactants(raw);
            renderOutput(outputEl, statusEl, tokens, raw);
        };

        const debouncedUpdate = debounce(update, 200);
        inputEl.addEventListener('input', debouncedUpdate);
        inputEl.addEventListener('change', update);
        inputEl.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                update();
            }
        });

        if (goBtn) {
            goBtn.addEventListener('click', update);
        }

        const chips = document.querySelectorAll('.reactions-chips button');
        chips.forEach((btn) => {
            btn.addEventListener('click', () => {
                const text = (btn.textContent || '').trim();
                if (text) {
                    inputEl.value = text;
                    update();
                }
            });
        });

        update();
    }

    function bootstrap() {
        initReactionsUI();
        loadReactionsDB();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
})();
