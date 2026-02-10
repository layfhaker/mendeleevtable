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
    const fallbackIonCharges = {
        'H': 1, 'Li': 1, 'Na': 1, 'K': 1, 'Rb': 1, 'Cs': 1, 'NH4': 1, 'Ag': 1,
        'Mg': 2, 'Ca': 2, 'Sr': 2, 'Ba': 2, 'Zn': 2, 'Cu': 2, 'Pb': 2, 'Fe': 2, 'Sn': 2, 'Be': 2,
        'Al': 3, 'Cr': 3,
        'F': -1, 'Cl': -1, 'Br': -1, 'I': -1, 'OH': -1, 'NO3': -1, 'NO2': -1, 'HCO3': -1, 'HSO4': -1, 'HSO3': -1, 'H2PO4': -1, 'ClO4': -1,
        'SO4': -2, 'SO3': -2, 'CO3': -2, 'S': -2, 'SiO3': -2, 'CrO4': -2,
        'PO4': -3
    };

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
            out = out.replace(/\([^)]+\)$/, '');
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
            .split(/[+;]/)
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
        if (ionMaps) {
            const map = type === 'anion' ? ionMaps.anions : ionMaps.cations;
            const list = map.get(formula);
            if (list && list.length > 0) {
                if (prefer === 'max') return Math.max(...list);
                return Math.min(...list);
            }
        }
        const fallback = fallbackIonCharges[formula];
        if (!fallback) return null;
        if (type === 'anion' && fallback < 0) return fallback;
        if (type === 'cation' && fallback > 0) return fallback;
        return null;
    }

    function parseRomanNumeral(raw) {
        const map = { I: 1, V: 5, X: 10 };
        const text = String(raw || '').trim().toUpperCase();
        if (!/^[IVX]+$/.test(text)) return null;
        let total = 0;
        for (let i = 0; i < text.length; i++) {
            const cur = map[text[i]] || 0;
            const next = map[text[i + 1]] || 0;
            total += cur < next ? -cur : cur;
        }
        return total > 0 ? total : null;
    }

    function parseOxidationStateFromLabel(label) {
        const match = String(label || '').match(/\(([^)]+)\)\s*$/);
        if (!match) return null;
        const token = match[1].trim();
        if (/^\d+$/.test(token)) {
            const n = parseInt(token, 10);
            return n > 0 ? n : null;
        }
        return parseRomanNumeral(token);
    }

    function mergeSubclassTags(prev, next) {
        const list = [];
        String(prev || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .forEach((s) => list.push(s));
        String(next || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .forEach((s) => {
                if (!list.includes(s)) list.push(s);
            });
        return list.join(', ');
    }

    function inferCationChargeFromOxide(oxideFormula, metalSymbol) {
        const counts = parseFormulaCounts(oxideFormula);
        const mCount = counts[metalSymbol] || 0;
        const oCount = counts.O || 0;
        if (!mCount || !oCount) return null;
        const charge = (2 * oCount) / mCount;
        return Number.isInteger(charge) && charge > 0 ? charge : null;
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
        const metalToOxideByChargeMap = new Map();
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
            const prev = classMap.get(item.formula);
            const subclass = prev && prev.class === item.class
                ? mergeSubclassTags(prev.subclass, item.subclass)
                : item.subclass;
            classMap.set(item.formula, { class: item.class, subclass, info: item });
            if (item.class === 'oxide' && subclass) {
                oxideSubclassMap.set(item.formula, subclass);
            }
        });

        (data.acid_oxide_pairs || []).forEach((pair) => {
            if (pair.oxide && pair.acid) {
                const acids = splitAlternatives(pair.acid);
                if (!acids.length) return;
                acids.forEach((acid) => acidOxideMap.set(acid, pair.oxide));
                oxideToAcidMap.set(pair.oxide, acids[0]);
            }
        });

        (data.metal_oxide_pairs || []).forEach((pair) => {
            if (!pair.oxide) return;
            const metalInfo = { metal: pair.metal, hydroxide: pair.hydroxide, oxide: pair.oxide };
            metalOxideMap.set(pair.oxide, metalInfo);
            if (pair.metal) {
                const metalSymbol = pair.metal.replace(/\(.*\)$/, '');
                if (!metalToOxideMap.has(metalSymbol)) {
                    metalToOxideMap.set(metalSymbol, pair.oxide);
                }
                if (pair.hydroxide && !metalToHydroxideMap.has(metalSymbol)) {
                    metalToHydroxideMap.set(metalSymbol, pair.hydroxide);
                }

                const explicitCharge = parseOxidationStateFromLabel(pair.metal);
                const inferredCharge = explicitCharge || inferCationChargeFromOxide(pair.oxide, metalSymbol) || getIonCharge(metalSymbol, 'cation', 'min');
                if (inferredCharge) {
                    metalToOxideByChargeMap.set(`${metalSymbol}|${inferredCharge}`, pair.oxide);
                }
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
            metalToOxideByChargeMap,
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
        const normalized = splitAlternatives(String(formula))[0] || String(formula);
        if (!/^H/.test(normalized)) return null;
        const match = normalized.match(/^H(\d*)(.+)$/);
        if (!match) return null;
        const hCount = match[1] ? parseInt(match[1], 10) : 1;
        const anionFormula = match[2];
        if (/^\d+$/.test(anionFormula)) return null;
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

    function escapeRegExp(text) {
        return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

    function resolveCationCandidates(cationPart) {
        const compact = String(cationPart || '').trim();
        if (!compact) return [];
        const candidates = [];
        const noTailIndex = compact.replace(/\d+$/, '');
        if (noTailIndex && noTailIndex !== compact) candidates.push(noTailIndex);
        candidates.push(compact);
        return [...new Set(candidates)];
    }

    function detectSalt(formula) {
        const normalized = normalizeToken(formula, { stripConditions: true });
        const anionKeys = Array.from(new Set([
            ...(ionMaps ? Array.from(ionMaps.anions.keys()) : []),
            'H2PO4', 'HSO4', 'HSO3', 'HCO3', 'PO4', 'SO4', 'SO3', 'CO3', 'NO3', 'NO2', 'ClO4', 'SiO3', 'Cl', 'Br', 'I', 'F', 'S'
        ])).sort((a, b) => b.length - a.length);
        for (const anion of anionKeys) {
            const safeAnion = escapeRegExp(anion);
            const anionPattern = new RegExp(`^(.*)(${safeAnion})(\\d*)$`);
            const match = normalized.match(anionPattern);
            if (match) {
                const catPart = match[1];
                const anionSub = match[3] ? parseInt(match[3], 10) : 1;
                if (!catPart) continue;
                const anionCharge = getIonCharge(anion, 'anion', 'min');
                if (!anionCharge) continue;
                const cationCandidates = resolveCationCandidates(catPart);
                for (const cationFormula of cationCandidates) {
                    let cationCharge = getIonCharge(cationFormula, 'cation', 'min');
                    const safeCation = escapeRegExp(cationFormula);
                    const catSubMatch = String(catPart).match(new RegExp(`^${safeCation}(\\d*)$`));
                    const cationSub = catSubMatch && catSubMatch[1] ? parseInt(catSubMatch[1], 10) : 1;
                    const inferredCharge = (Math.abs(anionCharge) * anionSub) / cationSub;
                    if ((!cationCharge || ['Fe', 'Cr', 'Cu', 'Sn', 'Pb', 'Mn', 'Co', 'Ni'].includes(cationFormula)) && Number.isInteger(inferredCharge) && inferredCharge > 0) {
                        cationCharge = inferredCharge;
                    }
                    if (!cationCharge) continue;
                    return { cationFormula, anionFormula: anion, cationCharge, anionCharge };
                }
            }
            const complexMatch = normalized.match(new RegExp(`^(.*)\\(${safeAnion}\\)(\\d*)$`));
            if (complexMatch) {
                const catPart = complexMatch[1];
                const anionSub = complexMatch[2] ? parseInt(complexMatch[2], 10) : 1;
                if (!catPart) continue;
                const anionCharge = getIonCharge(anion, 'anion', 'min');
                if (!anionCharge) continue;
                const cationCandidates = resolveCationCandidates(catPart);
                for (const cationFormula of cationCandidates) {
                    let cationCharge = getIonCharge(cationFormula, 'cation', 'min');
                    const safeCation = escapeRegExp(cationFormula);
                    const catSubMatch = String(catPart).match(new RegExp(`^${safeCation}(\\d*)$`));
                    const cationSub = catSubMatch && catSubMatch[1] ? parseInt(catSubMatch[1], 10) : 1;
                    const inferredCharge = (Math.abs(anionCharge) * anionSub) / cationSub;
                    if ((!cationCharge || ['Fe', 'Cr', 'Cu', 'Sn', 'Pb', 'Mn', 'Co', 'Ni'].includes(cationFormula)) && Number.isInteger(inferredCharge) && inferredCharge > 0) {
                        cationCharge = inferredCharge;
                    }
                    if (!cationCharge) continue;
                    return { cationFormula, anionFormula: anion, cationCharge, anionCharge };
                }
            }
        }
        return null;
    }

    function isSaltLikeFormula(formula) {
        if (!formula) return false;
        if (parseAcid(formula) || parseBase(formula) || formula === 'H2O') return false;
        if (classifyFormula(formula).kind === 'metal') return false;
        return !!detectSalt(formula);
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

    function buildAcidFormula(anionFormula, anionCharge) {
        const hCount = Math.abs(Number(anionCharge) || 1);
        return `H${hCount > 1 ? hCount : ''}${anionFormula}`;
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
        const diatomic = formula.match(/^([A-Z][a-z]?)2$/);
        if (diatomic && dataMaps.elementMap.has(diatomic[1])) {
            const el = dataMaps.elementMap.get(diatomic[1]);
            if (el.is_nonmetal) return { kind: 'nonmetal' };
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

    function hasAllReactants(tokens, required) {
        const set = new Set((tokens || []).map((t) => normalizeToken(t, { stripConditions: true })));
        return required.every((r) => set.has(r));
    }

    function hasHeatingCondition(raw) {
        const text = String(raw || '').toLowerCase();
        return /(нагрев|t°|темп|°c|\bt\b|heat|hot)/.test(text);
    }

    function hasConditionHint(raw) {
        const text = String(raw || '').toLowerCase();
        return /(конц|разб|оч\.|изб|недост|дефиц|сплав|нагрев|холод|пар|кат|раствор|расплав|горяч|электрол|электр|conc|dilut|excess|deficit|limited|heat|steam|catalyst|electrolysis|electro|solution|molten|melt|fusion|splav|spalv)/.test(text);
    }

    function hasExcessOn(raw, species) {
        const rawText = String(raw || '').toLowerCase();
        const text = normalizeRawInput(raw).toLowerCase();
        const key = species ? normalizeRawInput(species).toLowerCase() : '';
        if (!/(изб|excess)/.test(rawText) && !text.includes('изб') && !text.includes('excess')) return false;
        if (!key) return true;

        const escapedSpecies = String(species || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&').toLowerCase();
        if (escapedSpecies) {
            const taggedPattern = new RegExp(`${escapedSpecies}\\([^)]*(изб|excess)`);
            if (taggedPattern.test(rawText)) return true;
        }

        return text.includes(`изб${key}`)
            || text.includes(`excess${key}`)
            || text.includes(`${key}изб`)
            || text.includes(`${key}excess`);
    }

    function hasDeficitCondition(raw) {
        return hasKeyword(raw, ['недост', 'дефиц', 'limited', 'deficit']);
    }

    function isLikelyOrganicAcid(formula) {
        const f = String(formula || '');
        const counts = parseFormulaCounts(f);
        if (!counts.C) return false;
        const inorganicCarbonAcids = new Set(['H2CO3', 'H2SiO3', 'HCN']);
        return !inorganicCarbonAcids.has(f);
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
            if (isLikelyOrganicAcid(acidStr)) return null;
            const acid = parseAcid(acidStr);
            const base = parseBase(baseStr);
            if (!acid || !base) return null;

            const anionCharge = getIonCharge(acid.anionFormula, 'anion', 'min');
            const cationCharge = getIonCharge(base.cationFormula, 'cation', 'min') || base.ohCount;
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
        const inferChargeFromOxide = (oxideStr, metal) => {
            const counts = parseFormulaCounts(oxideStr);
            const mCount = counts[metal] || 0;
            const oCount = counts.O || 0;
            if (!mCount || !oCount) return null;
            const charge = (2 * oCount) / mCount;
            return Number.isInteger(charge) && charge > 0 ? charge : null;
        };
        const tryPair = (oxideStr, acidStr) => {
            const info = classifyFormula(oxideStr);
            if (info.kind !== 'oxide') return null;
            if (isLikelyOrganicAcid(acidStr)) return null;
            const acid = parseAcid(acidStr);
            if (!acid) return null;
            const oxideInfo = dataMaps.metalOxideMap.get(oxideStr);
            if (!oxideInfo) return null;
            const metalSymbol = oxideInfo.metal ? oxideInfo.metal.replace(/\(.*\)$/, '') : null;
            if (!metalSymbol) return null;
            const cationCharge = inferChargeFromOxide(oxideStr, metalSymbol) || getMetalChargePreferMax(metalSymbol);
            const anionCharge = getIonCharge(acid.anionFormula, 'anion', 'min');
            if (!cationCharge || !anionCharge) return null;
            const salt = buildSaltFormula(metalSymbol, cationCharge, acid.anionFormula, anionCharge);
            return `${oxideStr} + ${acidStr} \u2192 ${salt} + H2O`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleAcidicOxideBase(tokens, rawInput) {
        if (!dataMaps || !ionMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (oxideStr, baseStr) => {
            const info = classifyFormula(oxideStr);
            if (info.kind !== 'oxide') return null;
            const base = parseBase(baseStr);
            if (!base) return null;
            if (oxideStr === 'SiO2' && !hasKeyword(rawInput, ['сплав', 'сплавл', 'расплав', 'melt', 'molten', 'fusion', 'splav', 'spalv']) && !hasHeatingCondition(rawInput)) {
                return null;
            }
            if (oxideStr === 'CO2' && ['NaOH', 'KOH'].includes(baseStr) && hasKeyword(rawInput, ['изб', 'excess'])) {
                const c = baseStr.startsWith('K') ? 'K' : 'Na';
                return `CO2 + ${baseStr} → ${c}HCO3`;
            }
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

    function ruleAmphotericBase(tokens, rawInput) {
        if (hasKeyword(rawInput, ['сплав', 'сплавл', 'расплав', 'melt', 'molten', 'fusion', 'splav', 'spalv'])) return null;
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
            const cationPart = cfg.coeff > 1 ? `${cation}${cfg.coeff}` : cation;
            const complexSalt = `${cationPart}${cfg.complex}`;
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

    function ruleMetalOxygen(tokens, rawInput) {
        if (!dataMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (metalStr, oxygenStr) => {
            if (classifyFormula(metalStr).kind !== 'metal') return null;
            if (oxygenStr !== 'O2') return null;
            if (metalStr === 'Fe') return '3Fe + 2O2 \u2192 Fe3O4';
            const oxygenDeficit = hasKeyword(rawInput, ['недост', 'дефиц', 'огранич', 'малоo2', 'deficit', 'limited']);
            if (metalStr === 'Li') return '4Li + O2 \u2192 2Li2O';
            if (metalStr === 'Na') {
                return oxygenDeficit ? '4Na + O2 \u2192 2Na2O' : '2Na + O2 \u2192 Na2O2';
            }
            if (metalStr === 'K') {
                return oxygenDeficit ? '4K + O2 \u2192 2K2O' : '2K + O2 \u2192 2KO2';
            }
            if (metalStr === 'Rb' || metalStr === 'Cs') {
                return oxygenDeficit ? `4${metalStr} + O2 \u2192 2${metalStr}2O` : `${metalStr} + O2 \u2192 ${metalStr}O2`;
            }
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

    function ruleNonmetalOxygen(tokens, rawInput) {
        if (!dataMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (nonmetalStr, oxygenStr) => {
            if (oxygenStr !== 'O2') return null;
            if (nonmetalStr === 'H2') return '2H2 + O2 → 2H2O';
            if (nonmetalStr === 'N2') return 'N2 + O2 → 2NO';
            if (classifyFormula(nonmetalStr).kind !== 'nonmetal') return null;
            if (nonmetalStr === 'C' && hasKeyword(rawInput, ['недост', 'дефиц'])) {
                return '2C + O2 → 2CO';
            }
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

    function ruleSpecialCombination(tokens) {
        if (hasAllReactants(tokens, ['Na', 'Cl2'])) return '2Na + Cl2 → 2NaCl';
        if (hasAllReactants(tokens, ['Fe', 'Cl2'])) return '2Fe + 3Cl2 → 2FeCl3';
        if (hasAllReactants(tokens, ['CH4', 'O2'])) return 'CH4 + 2O2 → CO2 + 2H2O';
        return null;
    }

    function ruleMetalAcid(tokens, rawInput) {
        if (!dataMaps) return null;
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (metalStr, acidStr) => {
            if (classifyFormula(metalStr).kind !== 'metal') return null;
            if (isLikelyOrganicAcid(acidStr)) return null;
            const acid = parseAcid(acidStr);
            if (!acid) return null;
            const acidInfo = dataMaps.classMap.get(acidStr);
            if (/HNO3/i.test(acidStr)) return null;
            if (/H2SO4/i.test(acidStr) && hasKeyword(rawInput, ['конц'])) return null;
            if (acidInfo && acidInfo.info && acidInfo.info.is_oxidizer) return null;
            const metalRank = dataMaps.activityMap.get(metalStr);
            const hRank = dataMaps.activityMap.get('H');
            if (metalRank && hRank && metalRank > hRank) return null;
            const cationCharge = getIonCharge(metalStr, 'cation', 'min');
            const anionCharge = getIonCharge(acid.anionFormula, 'anion', 'min');
            if (!cationCharge || !anionCharge) return null;
            const salt = buildSaltFormula(metalStr, cationCharge, acid.anionFormula, anionCharge);

            const g = gcd(Math.abs(cationCharge), Math.abs(anionCharge));
            const saltCationSub = Math.abs(anionCharge) / g;
            const saltAnionSub = Math.abs(cationCharge) / g;
            const saltCoeff = (saltAnionSub * acid.hCount) % 2 === 0 ? 1 : 2;
            const metalCoeff = saltCoeff * saltCationSub;
            const acidCoeff = saltCoeff * saltAnionSub;
            const h2Coeff = (acidCoeff * acid.hCount) / 2;

            return `${formatCoeff(metalCoeff)}${metalStr} + ${formatCoeff(acidCoeff)}${acidStr} \u2192 ${formatCoeff(saltCoeff)}${salt} + ${formatCoeff(h2Coeff)}H2\u2191`;
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
                if (['Fe', 'Al', 'Cr'].includes(metalStr) && hasKeyword(rawInput, ['холод'])) return null;
                const cationCharge = getMetalChargePreferMax(metalStr);
                const nitrate = buildSaltFormula(metalStr, cationCharge, 'NO3', -1);
                if (hasKeyword(rawInput, ['оченьконц', 'дым']) && ['Zn', 'Mg', 'Al'].includes(metalStr)) {
                    return `${metalStr} + HNO3(конц) \u2192 ${nitrate} + N2O\u2191 + H2O`;
                }
                return `${metalStr} + HNO3(конц) \u2192 ${nitrate} + NO2\u2191 + H2O`;
            }

            // R02 (dilute)
            if (['Au', 'Pt'].includes(metalStr)) return null;
            const metalRank = dataMaps.activityMap.get(metalStr) || 999;
            const isActive = metalRank <= (dataMaps.activityMap.get('Al') || 7);
            const cationCharge = getMetalChargePreferMax(metalStr);
            const nitrate = buildSaltFormula(metalStr, cationCharge, 'NO3', -1);
            if (isVeryDilute && isActive) {
                const n = cationCharge;
                const aCoeff = 8 / gcd(8, n);
                const bCoeff = (5 * aCoeff * n) / 4;
                const dCoeff = (aCoeff * n) / 8;
                const eCoeff = (3 * aCoeff * n) / 8;
                return `${formatCoeff(aCoeff)}${metalStr} + ${formatCoeff(bCoeff)}HNO3(оч.разб) \u2192 ${formatCoeff(aCoeff)}${nitrate} + ${formatCoeff(dCoeff)}NH4NO3 + ${formatCoeff(eCoeff)}H2O`;
            }
            if (hasKeyword(rawInput, ['слаб', 'умерен']) && isActive) {
                return `${metalStr} + HNO3(разб) \u2192 ${nitrate} + N2O\u2191 + H2O`;
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
            if (['Fe', 'Al', 'Cr'].includes(metalStr) && hasKeyword(rawInput, ['холод'])) return null;
            const metalRank = dataMaps.activityMap.get(metalStr) || 999;
            const isVeryActive = metalRank <= (dataMaps.activityMap.get('Mg') || 7);
            const cationCharge = getMetalChargePreferMax(metalStr);
            const sulfate = buildSaltFormula(metalStr, cationCharge, 'SO4', -2);
            if (hasKeyword(rawInput, ['s\u2193', 'сера', 'редк']) && ['Zn', 'Mg'].includes(metalStr)) {
                return `${metalStr} + H2SO4(конц) \u2192 ${sulfate} + S\u2193 + H2O`;
            }
            if (isVeryActive) {
                return `${metalStr} + H2SO4(конц) \u2192 ${sulfate} + H2S\u2191 + H2O`;
            }
            return `${metalStr} + H2SO4(конц) \u2192 ${sulfate} + SO2\u2191 + H2O`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleAmphotericFusion(tokens, rawInput) {
        if (tokens.length !== 2) return null;
        if (!hasKeyword(rawInput, ['сплав', 'сплавл', 'расплав', 'melt', 'molten', 'fusion', 'splav', 'spalv'])) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (amphStr, baseStr) => {
            if (!['NaOH', 'KOH'].includes(baseStr)) return null;
            const map = {
                'Al2O3': 'NaAlO2',
                'ZnO': 'Na2ZnO2',
                'Zn(OH)2': 'Na2ZnO2',
                'BeO': 'Na2BeO2',
                'Be(OH)2': 'Na2BeO2',
                'Al(OH)3': 'NaAlO2',
                'Cr2O3': 'NaCrO2',
                'PbO': 'Na2PbO2',
                'Pb(OH)2': 'Na2PbO2',
                'SnO': 'Na2SnO2',
                'Sn(OH)2': 'Na2SnO2'
            };
            if (!map[amphStr]) return null;
            const salt = baseStr.startsWith('K') ? map[amphStr].replace(/^Na/, 'K') : map[amphStr];
            return `${amphStr} + ${baseStr} \u2192 ${salt} + H2O`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleAmphotericInAlkali(tokens, rawInput) {
        if (hasKeyword(rawInput, ['сплав', 'сплавл', 'расплав', 'melt', 'molten', 'fusion', 'splav', 'spalv'])) return null;
        const joined = normalizeRawInput(tokens.join('+'));
        const hasNaOH = joined.includes('NaOH');
        const hasKOH = joined.includes('KOH');
        if (!hasNaOH && !hasKOH) return null;
        const alkali = hasKOH ? 'KOH' : 'NaOH';
        const aluminate = hasKOH ? 'K[Al(OH)4]' : 'Na[Al(OH)4]';
        const zincate = hasKOH ? 'K2[Zn(OH)4]' : 'Na2[Zn(OH)4]';

        if (joined.includes('Al2O3') && joined.includes('H2O')) {
            return `Al2O3 + 2${alkali} + 3H2O \u2192 2${aluminate}`;
        }
        if (joined.includes('ZnO') && joined.includes('H2O')) {
            return `ZnO + 2${alkali} + H2O \u2192 ${zincate}`;
        }
        if (joined.includes('Al(OH)3')) {
            return `Al(OH)3 + ${alkali} \u2192 ${aluminate}`;
        }
        if (joined.includes('Zn(OH)2')) {
            return `Zn(OH)2 + 2${alkali} \u2192 ${zincate}`;
        }
        if (joined.includes('Al') && joined.includes('H2O')) {
            return `2Al + 2${alkali} + 6H2O \u2192 2${aluminate} + 3H2\u2191`;
        }
        if (joined.includes('Zn') && joined.includes('H2O')) {
            return `Zn + 2${alkali} + 2H2O \u2192 ${zincate} + H2\u2191`;
        }
        return null;
    }

    function ruleMetalSteam(tokens, rawInput) {
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (metal, water) => {
            if (classifyFormula(metal).kind !== 'metal') return null;
            if (water !== 'H2O') return null;
            if (metal === 'Fe') return '3Fe + 4H2O \u2192 Fe3O4 + 4H2\u2191';
            if (metal === 'Zn') return 'Zn + H2O \u2192 ZnO + H2\u2191';
            if (metal === 'Mg') return 'Mg + H2O \u2192 MgO + H2\u2191';
            if (metal === 'Al') return '2Al + 3H2O \u2192 Al2O3 + 3H2\u2191';
            return null;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleHalogenAlkaliDisproportionation(tokens, rawInput) {
        if (tokens.length !== 2) return null;
        const a = normalizeToken(tokens[0], { stripConditions: true });
        const b = normalizeToken(tokens[1], { stripConditions: true });
        const tryPair = (halogen, alkali) => {
            if (!['Cl2', 'Br2', 'I2'].includes(halogen)) return null;
            if (!['NaOH', 'KOH'].includes(alkali)) return null;
            const m = alkali.startsWith('K') ? 'K' : 'Na';
            const normalizedRaw = normalizeRawInput(rawInput);
            const isHot = hasHeatingCondition(rawInput)
                || hasKeyword(rawInput, ['горяч', 'гор.'])
                || ((normalizedRaw.includes('3Cl2') || normalizedRaw.includes(`3${halogen}`))
                    && (normalizedRaw.includes('6NaOH') || normalizedRaw.includes('6KOH')));
            if (isHot) {
                return `3${halogen} + 6${alkali} \u2192 5${m}${halogen.replace('2', '')} + ${m}${halogen.replace('2', '')}O3 + 3H2O`;
            }
            return `${halogen} + 2${alkali} \u2192 ${m}${halogen.replace('2', '')} + ${m}${halogen.replace('2', '')}O + H2O`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleDecompositionNitrates(tokens, rawInput) {
        if (tokens.length !== 1) return null;
        const saltStr = normalizeToken(tokens[0], { stripConditions: true });
        if (!saltStr.includes('NO3')) return null;
        if (saltStr === 'NH4NO3') {
            if (hasKeyword(rawInput, ['сильн', 'оченьсильн', 'взрыв', 'strongheat'])) {
                return '2NH4NO3 \u2192 2N2\u2191 + O2\u2191 + 4H2O';
            }
            return 'NH4NO3 \u2192 N2O\u2191 + 2H2O';
        }
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
        const oxide = dataMaps.metalToOxideByChargeMap.get(`${cation}|${salt.cationCharge}`)
            || dataMaps.metalToOxideMap.get(cation);
        if (oxide) {
            return `${saltStr} \u2192 ${oxide} + NO2\u2191 + O2\u2191`;
        }
        return null;
    }

    function ruleDecompositionCarbonates(tokens, rawInput) {
        if (tokens.length !== 1) return null;
        const saltStr = normalizeToken(tokens[0], { stripConditions: true });
        if (!saltStr.includes('CO3')) return null;
        if (saltStr.includes('HCO3')) {
            const salt = detectSalt(saltStr);
            if (!salt) return null;
            const carbonate = buildSaltFormula(salt.cationFormula, salt.cationCharge, 'CO3', -2);
            return `${saltStr} \u2192 ${carbonate} + CO2\u2191 + H2O`;
        }
        const salt = detectSalt(saltStr);
        if (!salt) return null;
        if (['Na', 'K', 'Rb', 'Cs'].includes(salt.cationFormula)) return null;
        if (saltStr === 'FeCO3') return 'FeCO3 → FeO + CO2↑';
        const oxide = dataMaps.metalToOxideByChargeMap.get(`${salt.cationFormula}|${salt.cationCharge}`)
            || dataMaps.metalToOxideMap.get(salt.cationFormula);
        if (oxide) {
            return `${saltStr} \u2192 ${oxide} + CO2\u2191`;
        }
        return null;
    }

    function ruleDecompositionHydroxides(tokens, rawInput) {
        if (tokens.length !== 1) return null;
        const baseStr = normalizeToken(tokens[0], { stripConditions: true });
        if (!baseStr.includes('OH')) return null;
        const baseClass = dataMaps.classMap.get(baseStr);
        const subclass = String(baseClass?.subclass || '');
        if (/strong/i.test(subclass)) return null;
        const base = parseBase(baseStr);
        if (!base) return null;
        if (baseStr === 'Fe(OH)2') return 'Fe(OH)2 → FeO + H2O';
        const oxide = dataMaps.metalToOxideByChargeMap.get(`${base.cationFormula}|${base.ohCount}`)
            || dataMaps.metalToOxideMap.get(base.cationFormula);
        if (oxide) return `${baseStr} \u2192 ${oxide} + H2O`;
        return null;
    }

    function ruleHydrolysis(tokens) {
        if (!dataMaps) return null;
        if (tokens.length === 3 && hasAllReactants(tokens, ['Al2(SO4)3', 'Na2CO3', 'H2O'])) {
            return 'Al2(SO4)3 + 3Na2CO3 + 3H2O → 2Al(OH)3↓ + 3CO2↑ + 3Na2SO4';
        }
        if (tokens.length < 1 || tokens.length > 2) return null;
        const first = normalizeToken(tokens[0], { stripConditions: true });
        const second = tokens[1] ? normalizeToken(tokens[1], { stripConditions: true }) : '';
        const saltStr = first === 'H2O' ? second : first;
        const hasWater = first === 'H2O' || second === 'H2O' || tokens.length === 1;
        if (parseAcid(saltStr) || parseBase(saltStr) || saltStr === 'H2O') return null;
        const salt = detectSalt(saltStr);
        if (!salt || !hasWater) return null;
        if (saltStr === 'FeCl3') return 'FeCl3 + H2O ⇌ FeOHCl2 + HCl';
        if (saltStr === 'NH4Cl') return 'NH4Cl + H2O ⇌ NH3·H2O + HCl';
        if (saltStr === 'K2S') return 'K2S + H2O ⇌ KHS + KOH';
        if (saltStr === 'Al2S3') return 'Al2S3 + 6H2O → 2Al(OH)3↓ + 3H2S↑';

        const strongAcidAnions = new Set(['Cl', 'Br', 'I', 'NO3', 'ClO4']);
        const strongBaseCations = new Set(['Li', 'Na', 'K', 'Rb', 'Cs', 'Ca', 'Sr', 'Ba']);
        const acid = buildAcidFormula(salt.anionFormula, salt.anionCharge);
        const base = buildSaltFormula(salt.cationFormula, salt.cationCharge, 'OH', -1);

        const weakAcid = !strongAcidAnions.has(salt.anionFormula) && (isWeakAcid(acid) || ['CO3', 'S', 'SO3', 'SiO3', 'PO4'].includes(salt.anionFormula));
        const weakBase = !strongBaseCations.has(salt.cationFormula) && (isWeakBase(base) || ['NH4', 'Al', 'Fe', 'Zn', 'Cu', 'Cr'].includes(salt.cationFormula));

        if (weakAcid && weakBase) {
            return `${saltStr} + 2H2O \u21cc ${acid} + ${base}`;
        }
        if (weakAcid) {
            if (Math.abs(salt.anionCharge) <= 1) return null;
            const acidSalt = buildSaltFormula(salt.cationFormula, salt.cationCharge, `H${salt.anionFormula}`, salt.anionCharge + 1);
            const hydroxide = buildSaltFormula(salt.cationFormula, salt.cationCharge, 'OH', -1);
            return `${saltStr} + H2O \u21cc ${acidSalt} + ${hydroxide}`;
        }
        if (weakBase) {
            const basicSalt = buildSaltFormula(`H`, 1, salt.anionFormula, salt.anionCharge);
            return `${saltStr} + H2O \u21cc ${base} + ${basicSalt}`;
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
            const anionCharge = getIonCharge(targetAnion, 'anion', 'min');
            if (!anionCharge) return null;
            const newSalt = buildSaltFormula(salt.cationFormula, salt.cationCharge, targetAnion, anionCharge);
            return `${acidSalt} + ${baseStr} \u2192 ${newSalt} + H2O`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function ruleSaltAcidSalt(tokens) {
        if (tokens.length < 2 || tokens.length > 3) return null;
        const joined = normalizeRawInput(tokens.join('+'));
        if (joined.includes('Na2SO3') && joined.includes('SO2') && joined.includes('H2O')) {
            return 'Na2SO3 + SO2 + H2O → 2NaHSO3';
        }
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
        if (hasAllReactants(tokens, ['KMnO4', 'Na2SO3', 'H2SO4'])) {
            return '2KMnO4 + 5Na2SO3 + 3H2SO4 \u2192 2MnSO4 + 5Na2SO4 + K2SO4 + 3H2O';
        }
        if (hasAllReactants(tokens, ['KMnO4', 'FeSO4', 'H2SO4'])) {
            return '2KMnO4 + 10FeSO4 + 8H2SO4 \u2192 K2SO4 + 2MnSO4 + 5Fe2(SO4)3 + 8H2O';
        }
        if (hasAllReactants(tokens, ['KMnO4', 'KI', 'H2SO4'])) {
            return '2KMnO4 + 10KI + 8H2SO4 \u2192 2MnSO4 + 5I2 + 6K2SO4 + 8H2O';
        }
        if (hasAllReactants(tokens, ['KMnO4', 'H2O2', 'H2SO4'])) {
            return '2KMnO4 + 5H2O2 + 3H2SO4 \u2192 2MnSO4 + 5O2\u2191 + K2SO4 + 8H2O';
        }
        if (hasAllReactants(tokens, ['KMnO4', 'Na2SO3', 'H2O'])) {
            return '2KMnO4 + 3Na2SO3 + H2O \u2192 2MnO2\u2193 + 3Na2SO4 + 2KOH';
        }
        if (hasAllReactants(tokens, ['KMnO4', 'Na2SO3', 'KOH'])) {
            return '2KMnO4 + Na2SO3 + 2KOH \u2192 2K2MnO4 + Na2SO4 + H2O';
        }
        return null;
    }

    function ruleK2Cr2O7(tokens) {
        const rawJoined = normalizeRawInput(tokens.join('+'));
        if (rawJoined.includes('CrO4') && rawJoined.includes('H')) {
            return '2CrO4²⁻ + 2H⁺ ⇌ Cr2O7²⁻ + H2O';
        }
        if (hasAllReactants(tokens, ['K2Cr2O7', 'H2S', 'H2SO4'])) {
            return 'K2Cr2O7 + 3H2S + 4H2SO4 \u2192 Cr2(SO4)3 + 3S\u2193 + K2SO4 + 7H2O';
        }
        if (hasAllReactants(tokens, ['K2Cr2O7', 'Na2SO3', 'H2SO4'])) {
            return 'K2Cr2O7 + 3Na2SO3 + 4H2SO4 \u2192 Cr2(SO4)3 + 3Na2SO4 + K2SO4 + 4H2O';
        }
        if (hasAllReactants(tokens, ['K2Cr2O7', 'KI', 'H2SO4'])) {
            return 'K2Cr2O7 + 6KI + 7H2SO4 \u2192 Cr2(SO4)3 + 3I2 + 4K2SO4 + 7H2O';
        }
        if (hasAllReactants(tokens, ['K2Cr2O7', 'H2O2', 'H2SO4'])) {
            return 'K2Cr2O7 + 3H2O2 + 4H2SO4 \u2192 Cr2(SO4)3 + K2SO4 + 7H2O + 3O2\u2191';
        }
        if (hasAllReactants(tokens, ['K2Cr2O7', 'SnCl2', 'HCl'])) {
            return 'K2Cr2O7 + 3SnCl2 + 14HCl \u2192 2CrCl3 + 3SnCl4 + 2KCl + 7H2O';
        }
        return null;
    }

    function ruleK2Cr2O7FeSO4(tokens) {
        if (hasAllReactants(tokens, ['K2Cr2O7', 'FeSO4', 'H2SO4'])) {
            return 'K2Cr2O7 + 6FeSO4 + 7H2SO4 \u2192 Cr2(SO4)3 + 3Fe2(SO4)3 + K2SO4 + 7H2O';
        }
        return null;
    }

    function inferElectrolysisMode(tokens, rawInput) {
        const isMelt = hasKeyword(rawInput, ['расплав', 'molten', 'melt']);
        const isAq = hasKeyword(rawInput, ['раствор', 'р-р', 'рра', 'aq', 'водн', 'solution']) || hasAllReactants(tokens, ['H2O']);
        if (isMelt) return 'melt';
        if (isAq) return 'aq';
        return 'aq';
    }

    function buildMoltenHydroxideElectrolysis(baseFormula) {
        const base = parseBase(baseFormula);
        if (!base) return null;
        const n = base.ohCount || 1;
        const a = 4;
        const metalCoeff = a;
        const oxygenCoeff = (a * n) / 4;
        const waterCoeff = (a * n) / 2;
        const g = gcd(gcd(metalCoeff, oxygenCoeff), waterCoeff);
        const leftCoeff = a / g;
        const mCoeff = metalCoeff / g;
        const oCoeff = oxygenCoeff / g;
        const wCoeff = waterCoeff / g;
        return `${formatCoeff(leftCoeff)}${baseFormula} \u2192 ${formatCoeff(mCoeff)}${base.cationFormula} + ${formatCoeff(oCoeff)}O2\u2191 + ${formatCoeff(wCoeff)}H2O`;
    }

    function classifyElectroAnion(anionFormula) {
        if (['Cl', 'Br', 'I'].includes(anionFormula)) return 'halide';
        if (anionFormula === 'F') return 'fluoride';
        if (anionFormula === 'S') return 'sulfide';
        if (anionFormula === 'OH') return 'hydroxide';
        return 'oxygen';
    }

    function inferAqCathodeProduct(cationFormula) {
        if (cationFormula === 'H' || cationFormula === 'NH4') return 'H2';
        const rankAl = dataMaps?.activityMap?.get('Al');
        const rank = dataMaps?.activityMap?.get(cationFormula);
        if (rankAl && rank && rank > rankAl) return cationFormula;
        return 'H2';
    }

    function ruleElectrolysis(tokens, rawInput) {
        if (!hasKeyword(rawInput, ['элект', 'электролиз', 'electrolysis', 'electro'])) return null;
        const normalizedTokens = (tokens || []).map((t) => normalizeToken(t, { stripConditions: true }));
        const joined = normalizeRawInput(normalizedTokens.join('+'));
        const mode = inferElectrolysisMode(normalizedTokens, rawInput);
        const electrolyte = normalizedTokens.find((t) => t && t !== 'H2O') || 'H2O';

        if (electrolyte === 'H2O') {
            return '2H2O \u2192 2H2\u2191 + O2\u2191';
        }

        if (mode === 'aq') {
            if (electrolyte === 'NaCl') return '2NaCl + 2H2O \u2192 2NaOH + H2\u2191 + Cl2\u2191';
            if (electrolyte === 'AgNO3') return '4AgNO3 + 2H2O \u2192 4Ag + O2\u2191 + 4HNO3';
            if (electrolyte === 'KBr') return '2KBr + 2H2O \u2192 2KOH + H2\u2191 + Br2\u2191';
            if (electrolyte === 'CuSO4') return '2CuSO4 + 2H2O \u2192 2Cu + O2\u2191 + 2H2SO4';
            if (electrolyte === 'Cu(NO3)2') return '2Cu(NO3)2 + 2H2O \u2192 2Cu + O2\u2191 + 4HNO3';
            if (electrolyte === 'FeCl2') return 'FeCl2 \u2192 Fe + Cl2\u2191';
            if (electrolyte === 'NiBr2') return 'NiBr2 \u2192 Ni + Br2\u2191';

            const salt = detectSalt(electrolyte);
            if (!salt) {
                const base = parseBase(electrolyte);
                if (base || parseAcid(electrolyte)) {
                    return '2H2O \u2192 2H2\u2191 + O2\u2191';
                }
                return null;
            }

            const cation = salt.cationFormula;
            const anion = salt.anionFormula;
            const anionClass = classifyElectroAnion(anion);
            const cathodeProduct = inferAqCathodeProduct(cation);
            const cathodeIsMetal = cathodeProduct !== 'H2';
            const anodeIsOxidizableAnion = anionClass === 'halide' || anionClass === 'sulfide';
            const anodeProduct = anionClass === 'halide' ? `${anion}2`
                : anionClass === 'sulfide' ? 'S'
                    : 'O2';

            if (anodeIsOxidizableAnion && cathodeIsMetal) {
                return `${electrolyte} \u2192 ${cathodeProduct} + ${anodeProduct}\u2191`.replace('S↑', 'S↓');
            }

            if (anodeIsOxidizableAnion && !cathodeIsMetal) {
                const hydroxide = buildSaltFormula(cation, salt.cationCharge, 'OH', -1);
                const anodeTail = anionClass === 'sulfide' ? 'S↓' : `${anion}2\u2191`;
                return `${electrolyte} + H2O \u2192 ${hydroxide} + H2\u2191 + ${anodeTail}`;
            }

            if (!anodeIsOxidizableAnion && cathodeIsMetal) {
                const acid = buildAcidFormula(anion, salt.anionCharge);
                return `${electrolyte} + H2O \u2192 ${cathodeProduct} + O2\u2191 + ${acid}`;
            }

            // Active cation + oxygen-containing anion / fluoride: water is discharged on both electrodes.
            return '2H2O \u2192 2H2\u2191 + O2\u2191';
        }

        // Molten electrolysis
        if (electrolyte === 'Al2O3') return '2Al2O3 \u2192 4Al + 3O2\u2191';
        if (electrolyte === 'NaOH' || electrolyte === 'KOH' || parseBase(electrolyte)) {
            return buildMoltenHydroxideElectrolysis(electrolyte);
        }

        const meltSalt = detectSalt(electrolyte);
        if (meltSalt) {
            const anionClass = classifyElectroAnion(meltSalt.anionFormula);
            if (anionClass === 'halide' || anionClass === 'fluoride') {
                return `${electrolyte} \u2192 ${meltSalt.cationFormula} + ${meltSalt.anionFormula}2\u2191`;
            }
            if (anionClass === 'sulfide') {
                return `${electrolyte} \u2192 ${meltSalt.cationFormula} + S\u2193`;
            }
            if (meltSalt.anionFormula === 'NO3') {
                return `${electrolyte} \u2192 ${meltSalt.cationFormula} + NO2\u2191 + O2\u2191`;
            }
            if (meltSalt.anionFormula === 'SO4') {
                return `${electrolyte} \u2192 ${meltSalt.cationFormula} + SO3\u2191 + O2\u2191`;
            }
            if (meltSalt.anionFormula === 'CO3') {
                return `${electrolyte} \u2192 ${meltSalt.cationFormula} + CO2\u2191 + O2\u2191`;
            }
            if (anionClass === 'oxygen' || anionClass === 'hydroxide') {
                return `${electrolyte} \u2192 ${meltSalt.cationFormula} + O2\u2191`;
            }
        }

        if (joined.includes('H2O')) return '2H2O \u2192 2H2\u2191 + O2\u2191';
        return null;
    }

    function ruleConcH2SO4WithHalogenHydrides(tokens, rawInput) {
        const joined = normalizeRawInput(tokens.join('+'));
        if (!joined.includes('H2SO4')) return null;
        if (joined.includes('HBr')) {
            return 'H2SO4(конц) + 2HBr \u2192 SO2\u2191 + Br2 + 2H2O';
        }
        if (joined.includes('HI')) {
            return 'H2SO4(конц) + 8HI \u2192 H2S\u2191 + 4I2 + 4H2O';
        }
        return null;
    }

    function ruleThermite(tokens, rawInput) {
        const joined = normalizeRawInput(tokens.join('+'));
        if (joined.includes('Fe2O3') && joined.includes('Al')) {
            return 'Fe2O3 + 2Al \u2192 Al2O3 + 2Fe';
        }
        if (joined.includes('Cr2O3') && joined.includes('Al')) {
            return 'Cr2O3 + 2Al \u2192 Al2O3 + 2Cr';
        }
        return null;
    }

    function rulePeroxideSuperoxide(tokens) {
        const joined = normalizeRawInput(tokens.join('+'));
        if (joined.includes('Na2O2') && joined.includes('H2O')) {
            return '2Na2O2 + 2H2O \u2192 4NaOH + O2\u2191';
        }
        if (joined.includes('Na2O2') && joined.includes('CO2')) {
            return '2Na2O2 + 2CO2 \u2192 2Na2CO3 + O2\u2191';
        }
        if (joined.includes('KO2') && joined.includes('H2O')) {
            return '4KO2 + 2H2O \u2192 4KOH + 3O2\u2191';
        }
        if (joined.includes('KO2') && joined.includes('CO2')) {
            return '4KO2 + 2CO2 \u2192 2K2CO3 + 3O2\u2191';
        }
        return null;
    }

    function ruleComplexFormation(tokens, rawInput) {
        const joined = normalizeRawInput(tokens.join('+'));
        if (joined.includes('Cu(OH)2') && joined.includes('NH3')) {
            return 'Cu(OH)2 + 4NH3 \u2192 [Cu(NH3)4](OH)2';
        }
        if (joined.includes('AgCl') && joined.includes('NH3')) {
            return 'AgCl + 2NH3 \u2192 [Ag(NH3)2]Cl';
        }
        return null;
    }

    function ruleAmmoniaAndNOx(tokens, rawInput) {
        if (tokens.length === 1) {
            const single = normalizeToken(tokens[0], { stripConditions: true });
            if (single === 'N2O4') return 'N2O4 \u21cc 2NO2';
        }
        if (hasAllReactants(tokens, ['NH3', 'O2'])) {
            if (hasKeyword(rawInput, ['безкат', 'без кат'])) {
                return '4NH3 + 3O2 \u2192 2N2 + 6H2O';
            }
            return '4NH3 + 5O2 \u2192 4NO + 6H2O';
        }
        if (hasAllReactants(tokens, ['NO', 'O2'])) {
            return '2NO + O2 \u2192 2NO2';
        }
        if (hasAllReactants(tokens, ['NO2', 'H2O'])) {
            return '2NO2 + H2O \u2192 HNO2 + HNO3';
        }
        return null;
    }

    function ruleSOxOxidation(tokens, rawInput) {
        if (hasAllReactants(tokens, ['SO2', 'O2'])) {
            if (hasKeyword(rawInput, ['кат', 'v2o5', 't', 'нагрев'])) {
                return '2SO2 + O2 \u21cc 2SO3';
            }
            return '2SO2 + O2 \u2192 2SO3';
        }
        if (hasAllReactants(tokens, ['SO2', 'NaOH'])) {
            if (hasExcessOn(rawInput, 'SO2')) return 'SO2 + NaOH \u2192 NaHSO3';
            if (hasExcessOn(rawInput, 'NaOH')) return 'SO2 + 2NaOH \u2192 Na2SO3 + H2O';
            return 'SO2 + 2NaOH \u2192 Na2SO3 + H2O';
        }
        if (hasAllReactants(tokens, ['SO2', 'KOH'])) {
            if (hasExcessOn(rawInput, 'SO2')) return 'SO2 + KOH \u2192 KHSO3';
            if (hasExcessOn(rawInput, 'KOH')) return 'SO2 + 2KOH \u2192 K2SO3 + H2O';
            return 'SO2 + 2KOH \u2192 K2SO3 + H2O';
        }
        if (hasAllReactants(tokens, ['SO2', 'H2S'])) {
            return 'SO2 + 2H2S \u2192 3S\u2193 + 2H2O';
        }
        if (hasAllReactants(tokens, ['SO2', 'Br2', 'H2O'])) {
            return 'SO2 + Br2 + 2H2O \u2192 H2SO4 + 2HBr';
        }
        return null;
    }

    function ruleHalogenHalideAq(tokens) {
        if (hasAllReactants(tokens, ['Cl2', 'KBr'])) return 'Cl2 + 2KBr \u2192 2KCl + Br2';
        if (hasAllReactants(tokens, ['Cl2', 'KI'])) return 'Cl2 + 2KI \u2192 2KCl + I2';
        if (hasAllReactants(tokens, ['Br2', 'KI'])) return 'Br2 + 2KI \u2192 2KBr + I2';
        return null;
    }

    function ruleAmmoniaWithAcids(tokens) {
        if (hasAllReactants(tokens, ['NH3', 'HCl'])) return 'NH3 + HCl \u2192 NH4Cl';
        if (hasAllReactants(tokens, ['NH3', 'HNO3'])) return 'NH3 + HNO3 \u2192 NH4NO3';
        if (hasAllReactants(tokens, ['NH3', 'H2SO4'])) return '2NH3 + H2SO4 \u2192 (NH4)2SO4';
        if (hasAllReactants(tokens, ['NH3', 'CO2', 'H2O'])) return 'NH3 + CO2 + H2O \u2192 NH4HCO3';
        return null;
    }

    function ruleQualitativeRedox(tokens) {
        if (hasAllReactants(tokens, ['FeCl2', 'KMnO4', 'H2SO4'])) {
            return '2KMnO4 + 10FeCl2 + 18H2SO4 \u2192 K2SO4 + 2MnSO4 + 5Fe2(SO4)3 + 20HCl + 8H2O';
        }
        if (hasAllReactants(tokens, ['KI', 'KIO3', 'H2SO4'])) {
            return '5KI + KIO3 + 3H2SO4 \u2192 3I2 + 3K2SO4 + 3H2O';
        }
        return null;
    }

    function ruleHydrogenPeroxide(tokens, rawInput) {
        if (tokens.length === 1 && normalizeToken(tokens[0], { stripConditions: true }) === 'H2O2') {
            return '2H2O2 \u2192 2H2O + O2\u2191';
        }
        if (hasAllReactants(tokens, ['H2O2', 'KI']) || hasAllReactants(tokens, ['H2O2', 'MnO2'])) {
            return '2H2O2 \u2192 2H2O + O2\u2191';
        }
        return null;
    }

    function ruleCarbidesNitridesPhosphidesHydrolysis(tokens) {
        if (!hasAllReactants(tokens, ['H2O'])) return null;
        if (hasAllReactants(tokens, ['CaC2', 'H2O'])) return 'CaC2 + 2H2O \u2192 C2H2\u2191 + Ca(OH)2';
        if (hasAllReactants(tokens, ['AlN', 'H2O'])) return 'AlN + 3H2O \u2192 Al(OH)3 + NH3\u2191';
        if (hasAllReactants(tokens, ['Mg3N2', 'H2O'])) return 'Mg3N2 + 6H2O \u2192 3Mg(OH)2 + 2NH3\u2191';
        if (hasAllReactants(tokens, ['Ca3P2', 'H2O'])) return 'Ca3P2 + 6H2O \u2192 3Ca(OH)2 + 2PH3\u2191';
        if (hasAllReactants(tokens, ['Al4C3', 'H2O'])) return 'Al4C3 + 12H2O \u2192 4Al(OH)3 + 3CH4\u2191';
        return null;
    }

    function ruleNO2Alkali(tokens) {
        if (hasAllReactants(tokens, ['NO2', 'NaOH'])) return '2NO2 + 2NaOH \u2192 NaNO2 + NaNO3 + H2O';
        if (hasAllReactants(tokens, ['NO2', 'KOH'])) return '2NO2 + 2KOH \u2192 KNO2 + KNO3 + H2O';
        return null;
    }

    function ruleHalogenWater(tokens) {
        if (tokens.length !== 2) return null;
        if (hasAllReactants(tokens, ['Cl2', 'H2O'])) return 'Cl2 + H2O \u21cc HCl + HClO';
        if (hasAllReactants(tokens, ['Br2', 'H2O'])) return 'Br2 + H2O \u21cc HBr + HBrO';
        if (hasAllReactants(tokens, ['F2', 'H2O'])) return '2F2 + 2H2O \u2192 4HF + O2\u2191';
        return null;
    }

    function ruleThermalOxidizerDecomposition(tokens, rawInput) {
        if (tokens.length === 1) {
            const single = normalizeToken(tokens[0], { stripConditions: true });
            if (single === 'KClO3') return '2KClO3 \u2192 2KCl + 3O2\u2191';
            if (single === 'KMnO4') return '2KMnO4 \u2192 K2MnO4 + MnO2 + O2\u2191';
            if (single === 'NH4NO2') return 'NH4NO2 \u2192 N2\u2191 + 2H2O';
            if (single === 'FeSO4') return '2FeSO4 \u2192 Fe2O3 + SO2\u2191 + SO3\u2191';
            if (single === 'KNO2') return '2KNO2 \u2192 K2O + NO\u2191 + NO2\u2191';
            return null;
        }
        if (tokens.length === 2 && hasAllReactants(tokens, ['KClO3', 'MnO2'])) {
            if (hasKeyword(rawInput, ['кат', 'catalyst', 'mnо2']) || hasHeatingCondition(rawInput)) {
                return '2KClO3 \u2192 2KCl + 3O2\u2191';
            }
        }
        return null;
    }

    function ruleReductionByCO(tokens, rawInput) {
        if (hasAllReactants(tokens, ['Fe2O3', 'CO'])) return 'Fe2O3 + 3CO \u2192 2Fe + 3CO2';
        if (hasAllReactants(tokens, ['CuO', 'CO'])) return 'CuO + CO \u2192 Cu + CO2';
        if (hasAllReactants(tokens, ['PbO', 'CO'])) return 'PbO + CO \u2192 Pb + CO2';
        return null;
    }

    function ruleReductionByCarbon(tokens, rawInput) {
        if (hasAllReactants(tokens, ['Fe2O3', 'C'])) return '2Fe2O3 + 3C \u2192 4Fe + 3CO2';
        if (hasAllReactants(tokens, ['ZnO', 'C'])) return 'ZnO + C \u2192 Zn + CO';
        if (hasAllReactants(tokens, ['CuO', 'C'])) return '2CuO + C \u2192 2Cu + CO2';
        return null;
    }

    function ruleDehydration(tokens) {
        const joined = normalizeRawInput(tokens.join('+'));
        if (joined.includes('C12H22O11') && joined.includes('H2SO4')) {
            return 'C12H22O11 + H2SO4(конц) \u2192 12C + 11H2O + H2SO4(конц)';
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
        if (joined.includes('Pt') && joined.includes('HNO3') && joined.includes('HCl')) {
            return '3Pt + 4HNO3 + 18HCl \u2192 3H2[PtCl6] + 4NO\u2191 + 8H2O';
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
        if (acid === 'HNO2') return '2HNO2 \u2192 NO\u2191 + NO2\u2191 + H2O';
        if (acid === 'H2SiO3') return 'H2SiO3 \u2192 SiO2 + H2O';
        return null;
    }

    function ruleSiliconSpecific(tokens, rawInput) {
        const hotFusion = hasKeyword(rawInput, ['сплав', 'сплавл', 'расплав', 'melt', 'molten', 'fusion', 'splav', 'spalv']) || hasHeatingCondition(rawInput);
        if (hasAllReactants(tokens, ['SiO2', 'NaOH'])) {
            if (!hotFusion) return null;
            return 'SiO2 + 2NaOH \u2192 Na2SiO3 + H2O';
        }
        if (hasAllReactants(tokens, ['SiO2', 'KOH'])) {
            if (!hotFusion) return null;
            return 'SiO2 + 2KOH \u2192 K2SiO3 + H2O';
        }
        if (hasAllReactants(tokens, ['SiO2', 'Na2CO3'])) {
            if (!hotFusion) return null;
            return 'SiO2 + Na2CO3 \u2192 Na2SiO3 + CO2\u2191';
        }
        if (hasAllReactants(tokens, ['SiO2', 'CaO'])) {
            if (!hotFusion) return null;
            return 'SiO2 + CaO \u2192 CaSiO3';
        }
        if (hasAllReactants(tokens, ['SiO2', 'HF'])) {
            return 'SiO2 + 4HF \u2192 SiF4\u2191 + 2H2O';
        }
        if (hasAllReactants(tokens, ['Si', 'NaOH', 'H2O'])) {
            return 'Si + 2NaOH + H2O \u2192 Na2SiO3 + 2H2\u2191';
        }
        if (hasAllReactants(tokens, ['Si', 'KOH', 'H2O'])) {
            return 'Si + 2KOH + H2O \u2192 K2SiO3 + 2H2\u2191';
        }
        if (hasAllReactants(tokens, ['Na2SiO3', 'CO2', 'H2O'])) {
            return 'Na2SiO3 + CO2 + H2O \u2192 Na2CO3 + H2SiO3\u2193';
        }
        return null;
    }

    function rulePhosphorusSpecific(tokens, rawInput) {
        if (hasAllReactants(tokens, ['P', 'O2'])) {
            if (hasDeficitCondition(rawInput)) return '4P + 3O2 \u2192 2P2O3';
            return '4P + 5O2 \u2192 2P2O5';
        }
        if (hasAllReactants(tokens, ['P', 'Cl2'])) {
            if (hasExcessOn(rawInput, 'Cl2')) return '2P + 5Cl2 \u2192 2PCl5';
            if (hasDeficitCondition(rawInput)) return '2P + 3Cl2 \u2192 2PCl3';
            return '2P + 3Cl2 \u2192 2PCl3';
        }
        if (hasAllReactants(tokens, ['P', 'Ca'])) return '3Ca + 2P \u2192 Ca3P2';
        if (hasAllReactants(tokens, ['P', 'Na'])) return '3Na + P \u2192 Na3P';
        if (hasAllReactants(tokens, ['PCl3', 'H2O'])) return 'PCl3 + 3H2O \u2192 H3PO3 + 3HCl';
        if (hasAllReactants(tokens, ['PCl5', 'H2O'])) return 'PCl5 + 4H2O \u2192 H3PO4 + 5HCl';
        return null;
    }

    function ruleCarbonSpecific(tokens, rawInput) {
        if (hasAllReactants(tokens, ['C', 'H2O'])) {
            if (hasKeyword(rawInput, ['пар', 'steam']) || hasHeatingCondition(rawInput)) {
                return 'C + H2O \u2192 CO + H2\u2191';
            }
            return null;
        }
        if (hasAllReactants(tokens, ['CO2', 'C'])) {
            if (hasHeatingCondition(rawInput) || hasKeyword(rawInput, ['t', 'нагрев', 'кокс'])) {
                return 'CO2 + C \u2192 2CO';
            }
            return null;
        }
        if (hasAllReactants(tokens, ['CO2', 'Mg'])) {
            return '2Mg + CO2 \u2192 2MgO + C';
        }
        if (hasAllReactants(tokens, ['CO', 'NaOH'])) {
            if (hasKeyword(rawInput, ['конц', 'давл', 'pressure', 'highp'])) {
                return 'CO + NaOH \u2192 HCOONa';
            }
            return null;
        }
        if (hasAllReactants(tokens, ['CO', 'KOH'])) {
            if (hasKeyword(rawInput, ['конц', 'давл', 'pressure', 'highp'])) {
                return 'CO + KOH \u2192 HCOOK';
            }
            return null;
        }
        return null;
    }

    function ruleSulfidesSpecific(tokens, rawInput) {
        if (tokens.length !== 2) return null;
        if (hasAllReactants(tokens, ['FeS2', 'O2'])) {
            return '4FeS2 + 11O2 \u2192 2Fe2O3 + 8SO2\u2191';
        }
        if (hasAllReactants(tokens, ['CuS', 'HNO3'])) {
            return '3CuS + 8HNO3 \u2192 3Cu(NO3)2 + 3S\u2193 + 2NO\u2191 + 4H2O';
        }
        if (hasAllReactants(tokens, ['PbS', 'HNO3'])) {
            return '3PbS + 8HNO3 \u2192 3Pb(NO3)2 + 3S\u2193 + 2NO\u2191 + 4H2O';
        }
        return null;
    }

    function ruleIodineStarch(tokens, rawInput) {
        if (tokens.length !== 2) return null;
        const normalized = tokens.map((t) => normalizeToken(t, { stripConditions: true }).toLowerCase());
        const hasIodine = normalized.includes('i2');
        const hasStarch = normalized.some((t) =>
            t === 'starch'
            || t.includes('крахмал')
            || t.includes('krakhmal')
            || t.includes('krahmal')
        );
        if (!hasIodine || !hasStarch) return null;
        return 'I2 + starch \u2192 I2·starch (синий комплекс)';
    }

    function ruleAmmoniaReducing(tokens, rawInput) {
        if (hasAllReactants(tokens, ['NH3', 'CuO'])) {
            return '2NH3 + 3CuO \u2192 3Cu + N2\u2191 + 3H2O';
        }
        return null;
    }

    function ruleHalogenLabPreparation(tokens, rawInput) {
        if (tokens.length !== 2) return null;
        if (hasAllReactants(tokens, ['HCl', 'MnO2'])) {
            if (!hasHeatingCondition(rawInput) && !hasKeyword(rawInput, ['конц', 'conc'])) return null;
            return 'MnO2 + 4HCl \u2192 MnCl2 + Cl2\u2191 + 2H2O';
        }
        return null;
    }

    function ruleComplexQualitative(tokens, rawInput) {
        if (hasAllReactants(tokens, ['FeCl3', 'KSCN'])) return 'FeCl3 + 3KSCN \u2192 Fe(SCN)3 + 3KCl';
        if (hasAllReactants(tokens, ['FeCl3', 'K4[Fe(CN)6]'])) return 'FeCl3 + K4[Fe(CN)6] \u2192 KFe[Fe(CN)6]\u2193 + 3KCl';
        if (hasAllReactants(tokens, ['FeCl2', 'K3[Fe(CN)6]'])) return 'FeCl2 + K3[Fe(CN)6] \u2192 KFe[Fe(CN)6]\u2193 + 2KCl';
        if (hasAllReactants(tokens, ['AgNO3', 'NH3'])) return 'AgNO3 + 2NH3 \u2192 [Ag(NH3)2]NO3';
        if (hasAllReactants(tokens, ['Zn(OH)2', 'NH3'])) return 'Zn(OH)2 + 4NH3 \u2192 [Zn(NH3)4](OH)2';
        return null;
    }

    function ruleAmphotericSaltExcessAlkali(tokens, rawInput) {
        if (!(hasKeyword(rawInput, ['изб', 'excess']) || hasExcessOn(rawInput))) return null;
        if (hasAllReactants(tokens, ['AlCl3', 'NaOH'])) return 'AlCl3 + 4NaOH \u2192 Na[Al(OH)4] + 3NaCl';
        if (hasAllReactants(tokens, ['AlCl3', 'KOH'])) return 'AlCl3 + 4KOH \u2192 K[Al(OH)4] + 3KCl';
        return null;
    }

    function ruleAmmoniumDecomposition(tokens, rawInput) {
        if (tokens.length !== 1) return null;
        const single = normalizeToken(tokens[0], { stripConditions: true });
        if (single === 'NH4Cl') return 'NH4Cl \u2192 NH3\u2191 + HCl\u2191';
        if (single === 'NH4HCO3') return 'NH4HCO3 \u2192 NH3\u2191 + CO2\u2191 + H2O';
        if (single === '(NH4)2Cr2O7') return '(NH4)2Cr2O7 \u2192 Cr2O3 + N2\u2191 + 4H2O';
        return null;
    }

    function ruleReductionByHydrogen(tokens, rawInput) {
        if (tokens.length !== 2) return null;
        if (hasAllReactants(tokens, ['Fe2O3', 'H2'])) return 'Fe2O3 + 3H2 \u2192 2Fe + 3H2O';
        if (hasAllReactants(tokens, ['CuO', 'H2'])) return 'CuO + H2 \u2192 Cu + H2O';
        if (hasAllReactants(tokens, ['WO3', 'H2'])) return 'WO3 + 3H2 \u2192 W + 3H2O';
        return null;
    }

    function ruleMetalNonmetalSynthesis(tokens, rawInput) {
        if (tokens.length !== 2) return null;
        if (hasAllReactants(tokens, ['Fe', 'S'])) return 'Fe + S \u2192 FeS';
        if (hasAllReactants(tokens, ['Cu', 'S'])) return 'Cu + S \u2192 CuS';
        if (hasAllReactants(tokens, ['Na', 'S'])) return '2Na + S \u2192 Na2S';
        if (hasAllReactants(tokens, ['Ca', 'N2'])) return '3Ca + N2 \u2192 Ca3N2';
        if (hasAllReactants(tokens, ['Mg', 'N2'])) return '3Mg + N2 \u2192 Mg3N2';
        if (hasAllReactants(tokens, ['Li', 'N2'])) return '6Li + N2 \u2192 2Li3N';
        return null;
    }

    function ruleNonmetalNonmetalSynthesis(tokens, rawInput) {
        if (tokens.length !== 2) return null;
        if (hasAllReactants(tokens, ['H2', 'Cl2'])) return 'H2 + Cl2 \u2192 2HCl';
        if (hasAllReactants(tokens, ['H2', 'S'])) return 'H2 + S \u2192 H2S';
        if (hasAllReactants(tokens, ['N2', 'H2'])) return 'N2 + 3H2 \u21cc 2NH3';
        return null;
    }

    function ruleFe2ToFe3Oxidation(tokens, rawInput) {
        if (hasAllReactants(tokens, ['Fe(OH)2', 'O2', 'H2O'])) {
            return '4Fe(OH)2 + O2 + 2H2O \u2192 4Fe(OH)3';
        }
        if (hasAllReactants(tokens, ['FeCl2', 'Cl2'])) {
            return '2FeCl2 + Cl2 \u2192 2FeCl3';
        }
        return null;
    }

    function ruleLimewaterCO2(tokens, rawInput) {
        if (!hasAllReactants(tokens, ['Ca(OH)2', 'CO2'])) return null;
        if (hasKeyword(rawInput, ['изб', 'excess'])) {
            return 'Ca(OH)2 + 2CO2 \u2192 Ca(HCO3)2';
        }
        return 'Ca(OH)2 + CO2 \u2192 CaCO3\u2193 + H2O';
    }

    function ruleLabAcidGeneration(tokens, rawInput) {
        if (!hasKeyword(rawInput, ['конц', 'conc'])) return null;
        if (hasAllReactants(tokens, ['H2SO4', 'NaCl'])) {
            return 'NaCl + H2SO4(конц) \u2192 NaHSO4 + HCl\u2191';
        }
        if (hasAllReactants(tokens, ['H2SO4', 'NaNO3'])) {
            return 'NaNO3 + H2SO4(конц) \u2192 NaHSO4 + HNO3\u2191';
        }
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
            const newAcid = buildAcidFormula(salt.anionFormula, salt.anionCharge);
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
                const product1 = isInsoluble(sol1) ? `${newSalt1}\u2193` : newSalt1;
                const product2 = isInsoluble(sol2) ? `${newSalt2}\u2193` : newSalt2;
                return `${saltStr1} + ${saltStr2} \u2192 ${product1} + ${product2}`;
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
            if (!isSaltLikeFormula(saltStr)) return null;
            const salt = detectSalt(saltStr);
            if (!salt) return null;
            const metalRank = dataMaps.activityMap.get(metalStr);
            const saltMetalRank = dataMaps.activityMap.get(salt.cationFormula);
            if (!metalRank || !saltMetalRank) return null;
            if (metalRank >= saltMetalRank) return null;
            const newSalt = buildSaltFormula(metalStr, getIonCharge(metalStr, 'cation', 'min'), salt.anionFormula, salt.anionCharge);
            return `${metalStr} + ${saltStr} \u2192 ${newSalt} + ${salt.cationFormula}`;
        };
        return tryPair(a, b) || tryPair(b, a);
    }

    function parseEquationCompound(token) {
        const trimmed = String(token || '').trim();
        const match = trimmed.match(/^(\d+)\s*(.+)$/);
        if (match) {
            return { formula: match[2].trim() };
        }
        return { formula: trimmed };
    }

    function stripPhaseMarkers(formula) {
        return String(formula || '').replace(/[↑↓]/g, '');
    }

    function buildBalanceMatrix(reactants, products) {
        const all = [...reactants, ...products];
        const signs = all.map((_, idx) => (idx < reactants.length ? 1 : -1));
        const elementSet = new Set();
        const countsList = all.map((cmp) => {
            const counts = parseFormulaCounts(stripPhaseMarkers(cmp.formula));
            Object.keys(counts).forEach((el) => elementSet.add(el));
            return counts;
        });
        const elements = Array.from(elementSet);
        if (!elements.length) return null;
        return elements.map((el) => all.map((_, idx) => (countsList[idx][el] || 0) * signs[idx]));
    }

    function solveCoefficientsBruteforce(matrix, termsCount, maxCoeff = 12) {
        const coeffs = new Array(termsCount).fill(1);
        while (true) {
            let valid = true;
            for (let r = 0; r < matrix.length; r++) {
                let sum = 0;
                for (let c = 0; c < termsCount; c++) {
                    sum += matrix[r][c] * coeffs[c];
                }
                if (sum !== 0) {
                    valid = false;
                    break;
                }
            }
            if (valid) return coeffs;

            let i = 0;
            while (i < termsCount) {
                coeffs[i]++;
                if (coeffs[i] <= maxCoeff) break;
                coeffs[i] = 1;
                i++;
            }
            if (i === termsCount) return null;
        }
    }

    function formatBalancedSide(compounds, coeffs, offset) {
        return compounds.map((cmp, idx) => {
            const coeff = coeffs[offset + idx];
            return `${coeff > 1 ? coeff : ''}${cmp.formula}`;
        }).join(' + ');
    }

    function autoBalanceRuleEquation(equation) {
        if (!equation || /\n/.test(equation)) return equation;
        const parts = String(equation).split(/→|->|=/);
        if (parts.length !== 2) return equation;
        const reactants = parts[0].split('+').map(parseEquationCompound).filter((x) => x.formula);
        const products = parts[1].split('+').map(parseEquationCompound).filter((x) => x.formula);
        const termsCount = reactants.length + products.length;
        if (!reactants.length || !products.length || termsCount > 6) return equation;

        const matrix = buildBalanceMatrix(reactants, products);
        if (!matrix) return equation;
        const coeffs = solveCoefficientsBruteforce(matrix, termsCount);
        if (!coeffs) return equation;

        const left = formatBalancedSide(reactants, coeffs, 0);
        const right = formatBalancedSide(products, coeffs, reactants.length);
        return `${left} → ${right}`;
    }

    function isGasProductFormula(formula) {
        const clean = stripPhaseMarkers(String(formula || ''));
        const gasSet = new Set([
            'H2', 'O2', 'N2', 'Cl2', 'Br2', 'I2', 'F2',
            'CO2', 'CO', 'SO2', 'SO3', 'NO', 'NO2', 'N2O',
            'NH3', 'H2S', 'PH3', 'CH4', 'C2H2',
            'HCl', 'HBr', 'HI', 'HNO3'
        ]);
        return gasSet.has(clean);
    }

    function isPrecipitateFormula(formula) {
        const clean = stripPhaseMarkers(String(formula || ''));
        const knownPrecipitates = new Set([
            'AgCl', 'AgBr', 'AgI', 'BaSO4', 'PbSO4',
            'CaCO3', 'MgCO3', 'BaCO3',
            'Cu(OH)2', 'Fe(OH)2', 'Fe(OH)3', 'Al(OH)3', 'Zn(OH)2', 'Mg(OH)2',
            'H2SiO3', 'S'
        ]);
        if (knownPrecipitates.has(clean)) return true;

        const salt = detectSalt(clean);
        if (salt) {
            const sol = getSolubility(salt.cationFormula, salt.cationCharge, salt.anionFormula, salt.anionCharge);
            if (isInsoluble(sol)) return true;
        }

        const base = parseBase(clean);
        if (base) {
            const cationCharge = base.ohCount || getIonCharge(base.cationFormula, 'cation', 'min');
            const sol = getSolubility(base.cationFormula, cationCharge, 'OH', -1);
            if (isInsoluble(sol)) return true;
        }

        return false;
    }

    function annotateProductPhases(equation) {
        if (!equation || /\n/.test(equation)) return equation;
        const text = String(equation);
        const arrowMatch = text.match(/(→|->|=|⇌)/);
        if (!arrowMatch) return equation;
        const arrow = arrowMatch[1];
        const parts = text.split(/→|->|=|⇌/);
        if (parts.length !== 2) return equation;
        const left = parts[0].trim();
        const productTerms = parts[1]
            .split('+')
            .map((x) => x.trim())
            .filter(Boolean)
            .map((term) => {
                const m = term.match(/^(\d+)\s*(.+)$/);
                const coeff = m ? `${m[1]}` : '';
                const formulaRaw = m ? m[2].trim() : term;
                const formula = stripPhaseMarkers(formulaRaw);
                if (/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/.test(formula)) return `${coeff}${formulaRaw}`;
                if (isGasProductFormula(formula)) return `${coeff}${formula}↑`;
                if (isPrecipitateFormula(formula)) return `${coeff}${formula}↓`;
                return `${coeff}${formula}`;
            });
        return `${left} ${arrow} ${productTerms.join(' + ')}`;
    }

    function isEquationBalanced(equation) {
        if (!equation || /\n/.test(equation)) return false;
        const parts = String(equation).split(/→|->|=|⇌/);
        if (parts.length !== 2) return false;
        const reactants = parts[0].split('+').map((x) => String(x).trim()).filter(Boolean);
        const products = parts[1].split('+').map((x) => String(x).trim()).filter(Boolean);
        if (!reactants.length || !products.length) return false;
        const left = {};
        const right = {};
        const addCounts = (acc, formula, coeff) => {
            const counts = parseFormulaCounts(stripPhaseMarkers(formula));
            Object.keys(counts).forEach((el) => {
                acc[el] = (acc[el] || 0) + counts[el] * coeff;
            });
        };
        reactants.forEach((term) => {
            const m = String(term).match(/^(\d+)\s*(.+)$/);
            const coeff = m ? parseInt(m[1], 10) : 1;
            const f = m ? m[2] : term;
            addCounts(left, f, coeff);
        });
        products.forEach((term) => {
            const m = String(term).match(/^(\d+)\s*(.+)$/);
            const coeff = m ? parseInt(m[1], 10) : 1;
            const f = m ? m[2] : term;
            addCounts(right, f, coeff);
        });
        const elements = new Set([...Object.keys(left), ...Object.keys(right)]);
        for (const el of elements) {
            if ((left[el] || 0) !== (right[el] || 0)) return false;
        }
        return true;
    }

    function postProcessRuleEquation(equation, ruleId) {
        const balanced = autoBalanceRuleEquation(equation);
        return annotateProductPhases(balanced);
    }

    function applyRules(tokens, rawTokens) {
        const handlers = [
            { id: 'R00', fn: ruleSpecialCombination, status: 'Подставлено по специальному шаблону реакции.' },
            { id: 'R78', fn: (t, r) => ruleIodineStarch(t, r), status: 'Подставлено по качественной реакции I2 с крахмалом.' },
            { id: 'R77', fn: (t, r) => ruleSulfidesSpecific(t, r), status: 'Подставлено по специальному правилу химии сульфидов.' },
            { id: 'R76', fn: (t, r) => rulePhosphorusSpecific(t, r), status: 'Подставлено по специальному правилу химии фосфора.' },
            { id: 'R75', fn: (t, r) => ruleCarbonSpecific(t, r), status: 'Подставлено по специальному правилу химии углерода.' },
            { id: 'R74', fn: (t, r) => ruleHalogenLabPreparation(t, r), status: 'Подставлено по лабораторному способу получения хлора.' },
            { id: 'R73', fn: (t, r) => ruleAmmoniaReducing(t, r), status: 'Подставлено по правилу восстановительных свойств аммиака.' },
            { id: 'R72', fn: (t, r) => ruleComplexQualitative(t, r), status: 'Подставлено по правилу качественных/комплексных реакций.' },
            { id: 'R71', fn: (t, r) => ruleAmphotericSaltExcessAlkali(t, r), status: 'Подставлено по правилу растворения амфотерного гидроксида в избытке щёлочи.' },
            { id: 'R68', fn: (t, r) => ruleSiliconSpecific(t, r), status: 'Подставлено по специальному правилу химии кремния.' },
            { id: 'R67', fn: (t, r) => ruleAmmoniumDecomposition(t, r), status: 'Подставлено по правилу разложения солей аммония.' },
            { id: 'R66', fn: (t, r) => ruleReductionByHydrogen(t, r), status: 'Подставлено по правилу восстановления оксидов водородом.' },
            { id: 'R65', fn: (t, r) => ruleMetalNonmetalSynthesis(t, r), status: 'Подставлено по правилу: металл + неметалл.' },
            { id: 'R64', fn: (t, r) => ruleNonmetalNonmetalSynthesis(t, r), status: 'Подставлено по правилу: неметалл + неметалл.' },
            { id: 'R63', fn: (t, r) => ruleFe2ToFe3Oxidation(t, r), status: 'Подставлено по правилу окисления Fe²⁺ до Fe³⁺.' },
            { id: 'R62', fn: (t, r) => ruleLimewaterCO2(t, r), status: 'Подставлено по качественной реакции с CO2 и Ca(OH)2.' },
            { id: 'R61', fn: (t, r) => ruleLabAcidGeneration(t, r), status: 'Подставлено по лабораторному способу получения летучих кислот.' },
            { id: 'R59', fn: (t, r) => ruleReductionByCarbon(t, r), status: 'Подставлено по правилу восстановления углеродом.' },
            { id: 'R58', fn: (t, r) => ruleReductionByCO(t, r), status: 'Подставлено по правилу восстановления CO.' },
            { id: 'R57', fn: (t, r) => ruleThermalOxidizerDecomposition(t, r), status: 'Подставлено по правилу термолиза окислителей.' },
            { id: 'R56', fn: ruleHalogenWater, status: 'Подставлено по правилу взаимодействия галогена с водой.' },
            { id: 'R55', fn: ruleNO2Alkali, status: 'Подставлено по правилу NO2 + щёлочь (диспропорционирование).' },
            { id: 'R53', fn: ruleCarbidesNitridesPhosphidesHydrolysis, status: 'Подставлено по правилу гидролиза карбидов/нитридов/фосфидов.' },
            { id: 'R52', fn: (t, r) => ruleHydrogenPeroxide(t, r), status: 'Подставлено по правилу диспропорционирования H2O2.' },
            { id: 'R51', fn: ruleQualitativeRedox, status: 'Подставлено по качественной ОВР-реакции.' },
            { id: 'R50', fn: ruleAmmoniaWithAcids, status: 'Подставлено по правилу: NH3 + кислоты.' },
            { id: 'R49', fn: ruleHalogenHalideAq, status: 'Подставлено по правилу вытеснения галогенов из галогенидов.' },
            { id: 'R48', fn: (t, r) => ruleSOxOxidation(t, r), status: 'Подставлено по правилу превращений SO2/SO3.' },
            { id: 'R47', fn: (t, r) => ruleAmmoniaAndNOx(t, r), status: 'Подставлено по правилу NH3/NOx.' },
            { id: 'R45', fn: (t, r) => ruleComplexFormation(t, r), status: 'Подставлено по правилу комплексообразования.' },
            { id: 'R44', fn: rulePeroxideSuperoxide, status: 'Подставлено по правилу для пероксидов/супероксидов.' },
            { id: 'R43', fn: (t, r) => ruleThermite(t, r), status: 'Подставлено по правилу металлотермии.' },
            { id: 'R42', fn: (t, r) => ruleConcH2SO4WithHalogenHydrides(t, r), status: 'Подставлено по правилу: конц. H2SO4 + HBr/HI.' },
            { id: 'R41', fn: (t, r) => ruleHalogenAlkaliDisproportionation(t, r), status: 'Подставлено по правилу диспропорционирования галогенов.' },
            { id: 'R40', fn: (t, r) => ruleMetalSteam(t, r), status: 'Подставлено по правилу: металл + водяной пар.' },
            { id: 'R39', fn: (t, r) => ruleAmphotericInAlkali(t, r), status: 'Подставлено по правилу амфотерных соединений в щёлочи.' },
            { id: 'R30', fn: (t, r) => ruleElectrolysis(t, r), status: 'Подставлено по правилу электролиза.' },
            { id: 'R31', fn: (t, r) => ruleElectrolysis(t, r), status: 'Подставлено по правилу электролиза.' },
            { id: 'R32', fn: ruleDehydration, status: 'Подставлено по правилу водоотнимающих реакций.' },
            { id: 'R33', fn: ruleAquaRegia, status: 'Подставлено по правилу царской водки.' },
            { id: 'R34', fn: ruleSilicicAcid, status: 'Подставлено по правилу получения кремниевой кислоты.' },
            { id: 'R35', fn: ruleUnstableAcids, status: 'Подставлено по правилу разложения нестойких кислот.' },
            { id: 'R36', fn: ruleKMnO4, status: 'Подставлено по правилу ОВР с KMnO4 (кислая/нейтр. среда).' },
            { id: 'R37', fn: ruleK2Cr2O7FeSO4, status: 'Подставлено по правилу для K2Cr2O7 + FeSO4.' },
            { id: 'R38', fn: ruleK2Cr2O7, status: 'Подставлено по правилу ОВР с K2Cr2O7.' },
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
            { id: 'R12', fn: (t, r) => ruleAcidicOxideBase(t, r), status: 'Подставлено по правилу: кислотный оксид + щёлочь.' },
            { id: 'R09', fn: ruleBasicOxideAcidicOxide, status: 'Подставлено по правилу: оксид + оксид.' },
            { id: 'R15', fn: ruleAmphotericAcid, status: 'Подставлено по правилу: амфотерное + кислота.' },
            { id: 'R16', fn: (t, r) => ruleAmphotericBase(t, r), status: 'Подставлено по правилу: амфотерное + щёлочь.' },
            { id: 'R17', fn: (t, r) => ruleAmphotericFusion(t, r), status: 'Подставлено по правилу: амфотерное + щёлочь (сплавление).' },
            { id: 'R18', fn: ruleMetalWater, status: 'Подставлено по правилу: металл + вода.' },
            { id: 'R19', fn: ruleMetalOxygen, status: 'Подставлено по правилу: металл + O2.' },
            { id: 'R25', fn: (t, r) => ruleNonmetalOxygen(t, r), status: 'Подставлено по правилу: неметалл + O2.' },
            { id: 'R99', fn: ruleSpecialCombination, status: 'Подставлено по специальному правилу соединения/горения.' },
            { id: 'R24', fn: ruleHalogenDisplacement, status: 'Подставлено по правилу: галогены.' },
            { id: 'R02', fn: (t, r) => ruleMetalHNO3(t, r), status: 'Подставлено по правилу: металл + HNO3 (разб.).' },
            { id: 'R03', fn: (t, r) => ruleMetalHNO3(t, r), status: 'Подставлено по правилу: металл + HNO3 (конц.).' },
            { id: 'R04', fn: (t, r) => ruleMetalH2SO4Conc(t, r), status: 'Подставлено по правилу: металл + H2SO4 (конц.).' },
            { id: 'R01', fn: (t, r) => ruleMetalAcid(t, r), status: 'Подставлено по правилу: металл + кислота.' },
            { id: 'R05', fn: ruleSaltAcid, status: 'Подставлено по правилу: соль + кислота.' },
            { id: 'R06', fn: ruleSaltBase, status: 'Подставлено по правилу: соль + щёлочь.' },
            { id: 'R07', fn: ruleSaltSalt, status: 'Подставлено по правилу: соль + соль.' },
            { id: 'R08', fn: ruleMetalSalt, status: 'Подставлено по правилу: металл + соль.' }
        ];

        for (const handler of handlers) {
            const result = handler.fn(tokens, rawTokens);
            if (result) {
                const processedEquation = postProcessRuleEquation(result, handler.id);
                if (!isEquationBalanced(processedEquation) && !/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/.test(processedEquation)) {
                    continue;
                }
                return { equation: processedEquation, status: handler.status };
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
        const saltA = isSaltLikeFormula(a);
        const saltB = isSaltLikeFormula(b);
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

        if (Array.isArray(window.REACTIONS_DB?.rule_exceptions)) {
            for (const ex of window.REACTIONS_DB.rule_exceptions) {
                if (ex.rule_id && (!candidateRule || ex.rule_id !== candidateRule)) continue;
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

        // Passivation in concentrated oxidizing acids (cold)
        if (tokens.length === 2) {
            const a = normalizeToken(tokens[0], { stripConditions: true });
            const b = normalizeToken(tokens[1], { stripConditions: true });
            const metal = classifyFormula(a).kind === 'metal' ? a : (classifyFormula(b).kind === 'metal' ? b : null);
            const acid = parseAcid(a) ? a : (parseAcid(b) ? b : null);
            if (metal && acid && ['Fe', 'Al', 'Cr'].includes(metal) && hasKeyword(rawInput, ['холод'])) {
                if (/HNO3/i.test(acid) && hasKeyword(rawInput, ['конц'])) {
                    return { reason: 'Пассивирование Fe/Al/Cr в холодной концентрированной HNO3.' };
                }
                if (/H2SO4/i.test(acid) && hasKeyword(rawInput, ['конц'])) {
                    return { reason: 'Пассивирование Fe/Al/Cr в холодной концентрированной H2SO4.' };
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
                const newAcid = buildAcidFormula(salt.anionFormula, salt.anionCharge);
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
            const salt = isSaltLikeFormula(a) ? a : (isSaltLikeFormula(b) ? b : null);
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
        if (window.REACTIONS_DB && window.REACTIONS_DB.reaction_examples) {
            reactionsIndex = buildIndex(window.REACTIONS_DB.reaction_examples || []);
            ionMaps = buildIonMaps(window.REACTIONS_DB);
            dataMaps = buildDataMaps(window.REACTIONS_DB);
            ruleMap = new Map((window.REACTIONS_DB.reaction_rules || []).map((r) => [r.rule_id, r]));
            dbLoaded = true;
            dbError = null;
            return;
        }

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

    function formatExampleEquation(example) {
        if (!example) return '';
        if (example.equation) return String(example.equation);
        if (example.reactants && example.products) {
            return `${example.reactants} → ${example.products}`;
        }
        return '';
    }

    function isCorruptedDbText(text) {
        const t = String(text || '');
        if (!t) return false;
        if (/\?{2,}/.test(t)) return true;
        if (/\s\?\s/.test(t)) return true;
        if (/[A-Za-zА-Яа-я0-9\])]\?(?=\s|$|\+|\))/u.test(t)) return true;
        return false;
    }

    function pickBestExampleMatch(matches) {
        for (const example of (matches || [])) {
            const equation = formatExampleEquation(example);
            if (!equation) continue;
            if (isCorruptedDbText(equation)) continue;
            return { example, equation };
        }
        return null;
    }

    function appendFusionVariantIfRelevant(equation, statusText, tokens, rawInput) {
        const raw = rawInput || '';
        if (!equation) return { equation: '', status: statusText || '' };
        if (hasConditionHint(raw)) return { equation, status: statusText };
        if (hasKeyword(equation, ['сплав', 'сплавл', 'расплав', 'melt', 'molten', 'fusion', 'splav', 'spalv'])) {
            return { equation, status: statusText };
        }

        const fusionVariantRaw = ruleAmphotericFusion(tokens, 'расплав');
        if (!fusionVariantRaw) return { equation, status: statusText };

        const fusionVariant = postProcessRuleEquation(fusionVariantRaw, 'R17');
        if (!fusionVariant || fusionVariant === equation) {
            return { equation, status: statusText };
        }

        const mergedEquation = `${equation}\n(расплав): ${fusionVariant}`;
        const mergedStatus = statusText
            ? `${statusText} Добавлен вариант для расплава.`
            : 'Подставлено по правилу. Добавлен вариант для расплава.';
        return { equation: mergedEquation, status: mergedStatus };
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

        if (hasKeyword(rawInput || '', ['элект', 'электролиз', 'electrolysis', 'electro'])) {
            const electroRuleHit = applyRules(tokens, rawInput || '');
            if (electroRuleHit) {
                outputEl.value = electroRuleHit.equation;
                if (statusEl) {
                    statusEl.textContent = electroRuleHit.status || 'Подставлено по правилу.';
                }
                return;
            }
        }

        if (hasKeyword(rawInput || '', ['сплав', 'сплавл', 'расплав', 'melt', 'molten', 'fusion', 'splav', 'spalv'])) {
            const fusionRuleHit = applyRules(tokens, rawInput || '');
            if (fusionRuleHit) {
                outputEl.value = fusionRuleHit.equation;
                if (statusEl) {
                    statusEl.textContent = fusionRuleHit.status || 'Подставлено по правилу.';
                }
                return;
            }
        }

        const strictKey = buildKey(tokens, { stripConditions: false });
        const strictMatches = strictKey ? (reactionsIndex.strict.get(strictKey) || []) : [];
        const strictBest = pickBestExampleMatch(strictMatches);
        if (strictBest) {
            const bestMatch = strictBest.example;
            const statusText = bestMatch.notes && !isCorruptedDbText(bestMatch.notes)
                ? `Найдено в базе: ${bestMatch.notes}`
                : 'Найдено точное совпадение в базе реакций.';
            const withFusion = appendFusionVariantIfRelevant(strictBest.equation, statusText, tokens, rawInput);
            outputEl.value = withFusion.equation;
            if (statusEl) {
                statusEl.textContent = withFusion.status;
            }
            return;
        }

        if (hasConditionHint(rawInput || '')) {
            const conditionedRuleHit = applyRules(tokens, rawInput || '');
            if (conditionedRuleHit) {
                outputEl.value = conditionedRuleHit.equation;
                if (statusEl) {
                    statusEl.textContent = conditionedRuleHit.status || 'Подставлено по правилу.';
                }
                return;
            }
        }

        const relaxedKey = buildKey(tokens, { stripConditions: true });
        const relaxedMatches = relaxedKey ? (reactionsIndex.relaxed.get(relaxedKey) || []) : [];
        const relaxedBest = pickBestExampleMatch(relaxedMatches);
        if (relaxedBest) {
            const bestMatch = relaxedBest.example;
            const statusText = bestMatch.notes && !isCorruptedDbText(bestMatch.notes)
                ? `Найдено в базе: ${bestMatch.notes}`
                : 'Найдено совпадение в базе реакций.';
            const withFusion = appendFusionVariantIfRelevant(relaxedBest.equation, statusText, tokens, rawInput);
            outputEl.value = withFusion.equation;
            if (statusEl) {
                statusEl.textContent = withFusion.status;
            }
            return;
        }

        const ruleHit = applyRules(tokens, rawInput || '');
        if (ruleHit) {
            const withFusion = appendFusionVariantIfRelevant(ruleHit.equation, ruleHit.status || 'Подставлено по правилу.', tokens, rawInput);
            outputEl.value = withFusion.equation;
            if (statusEl) {
                statusEl.textContent = withFusion.status;
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

        const suggestions = findSuggestions(tokens);
        if (suggestions.length > 0) {
            const suggestionLines = suggestions
                .map((example, idx) => `${idx + 1}. ${formatExampleEquation(example) || (example.reactants || '')}`)
                .join('\n');
            outputEl.value = `Точной реакции не найдено. Похожие примеры:\n${suggestionLines}`;
            if (statusEl) {
                statusEl.textContent = 'Показаны похожие примеры из базы реакций.';
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
