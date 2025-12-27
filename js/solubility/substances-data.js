// =========================================
// SUBSTANCES-DATA.JS — Детальная информация о веществах
// Аналог elements.js для таблицы растворимости
// =========================================

const substancesData = {
    // Ключ формируется как "Катион-Анион" (например: "Ba2+-SO42-")

    // =============================================
    // ЧАСТЬ I. ГИДРОКСИДЫ (OH⁻)
    // =============================================

    "H+-OH-": {
        name: "Вода",
        formula: "H₂O",
        molarMass: 18.02,
        oxidationStates: { "H": +1, "O": -2 },
        compoundType: "Оксид водорода / Амфолит",
        solubility: {
            status: "—",
            value: null,
            ksp: null,
            note: "Особый случай — сама является растворителем"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Бесцветная",
            solutionColor: "Бесцветная",
            crystalSystem: "Гексагональная (лёд)"
        },
        stability: {
            decomposition: false,
            lightSensitivity: "Нет",
            characteristicReactions: [
                "H₂O ⇌ H⁺ + OH⁻ (автопротолиз, Kw = 10⁻¹⁴)",
                "Электролиз: 2H₂O → 2H₂ + O₂"
            ]
        },
        applications: ["Универсальный растворитель", "Основа жизни", "Теплоноситель"],
        safety: { toxicity: "Нетоксична", hazardClass: "Безопасна" }
    },

    "NH4+-OH-": {
        name: "Гидроксид аммония (Аммиачная вода)",
        formula: "NH₄OH (NH₃·H₂O)",
        molarMass: 35.04,
        oxidationStates: { "N": -3, "H": +1, "O": -2 },
        compoundType: "Слабое основание",
        solubility: {
            status: "R",
            value: 35,
            unit: "% (насыщ.)",
            ksp: null,
            note: "Существует только в растворе: NH₃ + H₂O ⇌ NH₄⁺ + OH⁻",
            kb: 1.8e-5
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "—",
            solutionColor: "Бесцветный с резким запахом"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "При нагревании выделяется NH₃",
            characteristicReactions: [
                "NH₄OH + HCl → NH₄Cl + H₂O",
                "Cu²⁺ + 4NH₃ → [Cu(NH₃)₄]²⁺ (тёмно-синий)"
            ]
        },
        applications: ["Чистящие средства", "Производство удобрений", "Аналитическая химия"],
        safety: { toxicity: "Раздражает дыхательные пути", hazardClass: "Едкое" }
    },

    "Li+-OH-": {
        name: "Гидроксид лития",
        formula: "LiOH",
        molarMass: 23.95,
        oxidationStates: { "Li": +1, "O": -2, "H": +1 },
        compoundType: "Сильное основание",
        solubility: {
            status: "R",
            value: 12.8,
            unit: "г/100 мл",
            temperature: 20,
            ksp: null
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Поглощает CO₂ из воздуха",
            characteristicReactions: [
                "2LiOH + CO₂ → Li₂CO₃ + H₂O (поглотитель CO₂)"
            ]
        },
        applications: ["Поглотитель CO₂ в подводных лодках и космических кораблях", "Литиевые смазки", "Электролит батарей"],
        safety: { toxicity: "Едкий", ldso: "~210 мг/кг (крысы)" }
    },

    "K+-OH-": {
        name: "Гидроксид калия (Едкое кали)",
        formula: "KOH",
        molarMass: 56.11,
        oxidationStates: { "K": +1, "O": -2, "H": +1 },
        compoundType: "Сильное основание",
        solubility: {
            status: "R",
            value: 121,
            unit: "г/100 мл",
            temperature: 25,
            ksp: null
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Белые кристаллы",
            solutionColor: "Бесцветный",
            crystalSystem: "Моноклинная"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Гигроскопичен, поглощает CO₂",
            meltingPoint: "410°C",
            boilingPoint: "1327°C"
        },
        applications: ["Щелочные батареи", "Производство мягкого мыла", "Биодизель", "Электролиты"],
        safety: { toxicity: "Едкий", ldso: "~1230 мг/кг (крысы)", hazardClass: "Вызывает химические ожоги" }
    },

    "Na+-OH-": {
        name: "Гидроксид натрия (Едкий натр)",
        formula: "NaOH",
        molarMass: 39.997,
        oxidationStates: { "Na": +1, "O": -2, "H": +1 },
        compoundType: "Сильное основание",
        solubility: {
            status: "R",
            value: 110,
            unit: "г/100 мл",
            temperature: 20,
            ksp: null,
            note: "Растворение экзотермично"
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Белые кристаллы",
            solutionColor: "Бесцветный",
            crystalSystem: "Орторомбическая",
            density: 2.13
        },
        stability: {
            decomposition: false,
            airSensitivity: "Сильно гигроскопичен",
            meltingPoint: "318°C",
            boilingPoint: "1388°C",
            characteristicReactions: [
                "NaOH + HCl → NaCl + H₂O",
                "2NaOH + CO₂ → Na₂CO₃ + H₂O",
                "NaOH + Al + 3H₂O → Na[Al(OH)₄] + 1.5H₂"
            ]
        },
        applications: ["Производство мыла", "Целлюлозно-бумажная промышленность", "Очистка труб", "Нефтепереработка"],
        safety: { toxicity: "Едкий", ldso: "240-400 мг/кг (крысы)", hazardClass: "Вызывает тяжёлые химические ожоги" }
    },

    "Rb+-OH-": {
        name: "Гидроксид рубидия",
        formula: "RbOH",
        molarMass: 102.48,
        oxidationStates: { "Rb": +1, "O": -2, "H": +1 },
        compoundType: "Сильное основание",
        solubility: {
            status: "R",
            value: 180,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Бесцветный/белый",
            solutionColor: "Бесцветный"
        },
        stability: { decomposition: false, airSensitivity: "Сильно гигроскопичен" },
        applications: ["Специальные электролиты", "Научные исследования"],
        safety: { toxicity: "Едкий", hazardClass: "Вызывает ожоги" }
    },

    "Cs+-OH-": {
        name: "Гидроксид цезия",
        formula: "CsOH",
        molarMass: 149.91,
        oxidationStates: { "Cs": +1, "O": -2, "H": +1 },
        compoundType: "Сильное основание (сильнейшая щёлочь)",
        solubility: {
            status: "R",
            value: 300,
            unit: "г/100 мл",
            temperature: 20,
            note: "Самая растворимая щёлочь"
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Желтоватый (гигроскопичен)",
            solutionColor: "Бесцветный"
        },
        stability: { decomposition: false, airSensitivity: "Крайне гигроскопичен, расплывается на воздухе" },
        applications: ["Топливные элементы", "Катализаторы", "Научные исследования"],
        safety: { toxicity: "Сильно едкий", hazardClass: "Опаснее NaOH и KOH" }
    },

    "Ag+-OH-": {
        name: "Гидроксид серебра → Оксид серебра",
        formula: "AgOH → Ag₂O",
        molarMass: null,
        oxidationStates: { "Ag": +1, "O": -2 },
        compoundType: "Нестабильное основание",
        solubility: {
            status: "D",
            value: null,
            ksp: 2e-8,
            note: "Мгновенно разлагается: 2AgOH → Ag₂O + H₂O"
        },
        appearance: {
            precipitateColor: "Коричнево-чёрный (Ag₂O)",
            crystalColor: "Коричневый/чёрный",
            solutionColor: "—"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "Разлагается мгновенно при образовании",
            characteristicReactions: [
                "AgNO₃ + NaOH → AgOH↓ → Ag₂O↓ + H₂O",
                "Ag₂O + 2HNO₃ → 2AgNO₃ + H₂O"
            ]
        },
        applications: ["Реактив в органическом синтезе (реакция серебряного зеркала)"],
        safety: { toxicity: "Малотоксичен" }
    },

    "Mg2+-OH-": {
        name: "Гидроксид магния",
        formula: "Mg(OH)₂",
        molarMass: 58.32,
        oxidationStates: { "Mg": +2, "O": -2, "H": +1 },
        compoundType: "Слабое основание",
        solubility: {
            status: "N",
            value: 0.0009,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 5.6e-12
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Белый",
            solutionColor: "—",
            mineralName: "Брусит"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "Mg(OH)₂ →(350°C) MgO + H₂O",
            characteristicReactions: [
                "Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O"
            ]
        },
        applications: ["Антацид (Маалокс, Алмагель)", "Антипирен", "Очистка сточных вод", "Слабительное"],
        safety: { toxicity: "Нетоксичен", hazardClass: "Безопасен для приёма внутрь" }
    },

    "Ca2+-OH-": {
        name: "Гидроксид кальция (Гашёная известь)",
        formula: "Ca(OH)₂",
        molarMass: 74.09,
        oxidationStates: { "Ca": +2, "O": -2, "H": +1 },
        compoundType: "Сильное основание (малорастворимое)",
        solubility: {
            status: "M",
            value: 0.17,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 5.02e-6,
            temperatureDependence: "ИНВЕРСНАЯ зависимость — растворимость падает с ростом T!",
            solubilityTable: [
                { temp: 0, value: 0.185 },
                { temp: 20, value: 0.17 },
                { temp: 100, value: 0.077 }
            ]
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Белый порошок",
            solutionColor: "Мутный (известковая вода)",
            mineralName: "Портландит",
            crystalSystem: "Гексагональная"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "Ca(OH)₂ →(512°C) CaO + H₂O",
            characteristicReactions: [
                "Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O (помутнение известковой воды!)",
                "Ca(OH)₂ + 2HCl → CaCl₂ + 2H₂O"
            ],
            analyticalUse: "Качественная реакция на CO₂ (помутнение)"
        },
        applications: ["Строительство (гашёная известь)", "Очистка воды", "Сахарная промышленность", "Стоматология", "Побелка"],
        safety: { toxicity: "Едкий при контакте с влажной кожей", hazardClass: "Раздражает глаза и кожу" }
    },

    "Sr2+-OH-": {
        name: "Гидроксид стронция",
        formula: "Sr(OH)₂",
        molarMass: 121.63,
        oxidationStates: { "Sr": +2, "O": -2, "H": +1 },
        compoundType: "Сильное основание",
        solubility: {
            status: "M",
            value: 2.1,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 6.4e-3
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Бесцветный/белый",
            solutionColor: "Бесцветный"
        },
        stability: { decomposition: false, airSensitivity: "Поглощает CO₂" },
        applications: ["Производство сахара (очистка)", "Стабилизатор пластмасс"],
        safety: { toxicity: "Едкий", hazardClass: "Раздражает кожу и глаза" }
    },

    "Ba2+-OH-": {
        name: "Гидроксид бария (Баритовая вода)",
        formula: "Ba(OH)₂",
        molarMass: 171.34,
        oxidationStates: { "Ba": +2, "O": -2, "H": +1 },
        compoundType: "Сильное основание",
        solubility: {
            status: "R",
            value: 5.6,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 5.0e-3
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Бесцветные кристаллы",
            solutionColor: "Бесцветный (баритовая вода)"
        },
        stability: {
            decomposition: false,
            characteristicReactions: [
                "Ba(OH)₂ + CO₂ → BaCO₃↓ + H₂O (качественная реакция на CO₂)",
                "Ba(OH)₂ + H₂SO₄ → BaSO₄↓ + 2H₂O"
            ]
        },
        applications: ["Титрование слабых кислот", "Производство смазок", "Очистка сахара"],
        safety: { toxicity: "ТОКСИЧЕН (растворимая соль бария)", ldso: "~227 мг/кг (крысы)", hazardClass: "Опасен при проглатывании" }
    },

    "Zn2+-OH-": {
        name: "Гидроксид цинка",
        formula: "Zn(OH)₂",
        molarMass: 99.42,
        oxidationStates: { "Zn": +2, "O": -2, "H": +1 },
        compoundType: "АМФОТЕРНЫЙ гидроксид",
        solubility: {
            status: "N",
            value: 0,
            ksp: 3e-17
        },
        appearance: {
            precipitateColor: "Белый студенистый",
            crystalColor: "Белый",
            solutionColor: "—"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "Zn(OH)₂ →(125°C) ZnO + H₂O",
            characteristicReactions: [
                "Zn(OH)₂ + 2HCl → ZnCl₂ + 2H₂O (реакция с кислотой)",
                "Zn(OH)₂ + 2NaOH → Na₂[Zn(OH)₄] (реакция со щёлочью — АМФОТЕРНОСТЬ!)"
            ],
            analyticalUse: "Демонстрация амфотерности"
        },
        applications: ["Хирургические повязки", "Производство ZnO", "Адсорбент"],
        safety: { toxicity: "Малотоксичен" }
    },

    "Hg2+-OH-": {
        name: "Гидроксид ртути(II) → Оксид ртути",
        formula: "Hg(OH)₂ → HgO",
        molarMass: null,
        oxidationStates: { "Hg": +2, "O": -2 },
        compoundType: "Нестабильное основание",
        solubility: {
            status: "D",
            ksp: 1e-26,
            note: "Мгновенно разлагается: Hg(OH)₂ → HgO + H₂O"
        },
        appearance: {
            precipitateColor: "Жёлтый или красный (HgO)",
            crystalColor: "Жёлтый/красный",
            solutionColor: "—"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "Разлагается мгновенно",
            characteristicReactions: [
                "HgCl₂ + 2NaOH → HgO↓ + 2NaCl + H₂O"
            ]
        },
        applications: ["Реактив (редко, токсичен)"],
        safety: { toxicity: "КРАЙНЕ ТОКСИЧЕН", hazardClass: "Опасен для здоровья и окружающей среды" }
    },

    "Pb2+-OH-": {
        name: "Гидроксид свинца(II)",
        formula: "Pb(OH)₂",
        molarMass: 241.21,
        oxidationStates: { "Pb": +2, "O": -2, "H": +1 },
        compoundType: "АМФОТЕРНЫЙ гидроксид",
        solubility: {
            status: "N",
            value: 0,
            ksp: 1.4e-20
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Белый",
            solutionColor: "—"
        },
        stability: {
            characteristicReactions: [
                "Pb(OH)₂ + 2HNO₃ → Pb(NO₃)₂ + 2H₂O",
                "Pb(OH)₂ + 2NaOH → Na₂[Pb(OH)₄] (плюмбит натрия — АМФОТЕРНОСТЬ)"
            ]
        },
        applications: ["Промежуточный продукт"],
        safety: { toxicity: "ТОКСИЧЕН (соединение свинца)", hazardClass: "Канцероген" }
    },

    "Cu2+-OH-": {
        name: "Гидроксид меди(II)",
        formula: "Cu(OH)₂",
        molarMass: 97.56,
        oxidationStates: { "Cu": +2, "O": -2, "H": +1 },
        compoundType: "Слабое основание",
        solubility: {
            status: "N",
            value: 0,
            ksp: 2.2e-20
        },
        appearance: {
            precipitateColor: "ГОЛУБОЙ (характерный!)",
            crystalColor: "Голубой",
            solutionColor: "—"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "Cu(OH)₂ →(нагрев) CuO (чёрный) + H₂O",
            characteristicReactions: [
                "CuSO₄ + 2NaOH → Cu(OH)₂↓ (голубой) + Na₂SO₄",
                "Cu(OH)₂ + 4NH₃ → [Cu(NH₃)₄](OH)₂ (тёмно-синий раствор)"
            ],
            analyticalUse: "Качественная реакция на Cu²⁺ (голубой осадок)"
        },
        applications: ["Фунгицид (бордоская жидкость)", "Пигмент", "Получение CuO"],
        safety: { toxicity: "Умеренно токсичен" }
    },

    "Fe2+-OH-": {
        name: "Гидроксид железа(II)",
        formula: "Fe(OH)₂",
        molarMass: 89.86,
        oxidationStates: { "Fe": +2, "O": -2, "H": +1 },
        compoundType: "Слабое основание",
        solubility: {
            status: "N",
            value: 0,
            ksp: 8e-16
        },
        appearance: {
            precipitateColor: "Белый → быстро зеленеет → буреет",
            crystalColor: "Белый (чистый)",
            solutionColor: "—"
        },
        stability: {
            decomposition: true,
            airSensitivity: "Быстро окисляется на воздухе!",
            characteristicReactions: [
                "FeSO₄ + 2NaOH → Fe(OH)₂↓ (белый) + Na₂SO₄",
                "4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃ (окисление на воздухе)"
            ],
            analyticalUse: "Изменение цвета демонстрирует окисление Fe²⁺ → Fe³⁺"
        },
        applications: ["Промежуточный продукт", "Очистка воды"],
        safety: { toxicity: "Малотоксичен" }
    },

    "Fe3+-OH-": {
        name: "Гидроксид железа(III)",
        formula: "Fe(OH)₃",
        molarMass: 106.87,
        oxidationStates: { "Fe": +3, "O": -2, "H": +1 },
        compoundType: "Слабое основание",
        solubility: {
            status: "N",
            value: 0,
            ksp: 4e-38,
            note: "Одно из самых нерастворимых соединений!"
        },
        appearance: {
            precipitateColor: "КРАСНО-КОРИЧНЕВЫЙ (характерный!)",
            crystalColor: "Красно-коричневый",
            solutionColor: "—"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "2Fe(OH)₃ →(нагрев) Fe₂O₃ + 3H₂O",
            characteristicReactions: [
                "FeCl₃ + 3NaOH → Fe(OH)₃↓ (красно-коричневый) + 3NaCl"
            ],
            analyticalUse: "Качественная реакция на Fe³⁺ (красно-коричневый осадок)"
        },
        applications: ["Коагулянт для очистки воды", "Получение пигментов (охра)"],
        safety: { toxicity: "Малотоксичен" }
    },

    "Al3+-OH-": {
        name: "Гидроксид алюминия",
        formula: "Al(OH)₃",
        molarMass: 78.00,
        oxidationStates: { "Al": +3, "O": -2, "H": +1 },
        compoundType: "АМФОТЕРНЫЙ гидроксид",
        solubility: {
            status: "N",
            value: 0,
            ksp: 1.8e-33
        },
        appearance: {
            precipitateColor: "Белый студенистый",
            crystalColor: "Белый",
            solutionColor: "—",
            mineralName: "Гиббсит, байерит"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "2Al(OH)₃ →(нагрев) Al₂O₃ + 3H₂O",
            characteristicReactions: [
                "Al(OH)₃ + 3HCl → AlCl₃ + 3H₂O (реакция с кислотой)",
                "Al(OH)₃ + NaOH → Na[Al(OH)₄] (реакция со щёлочью — АМФОТЕРНОСТЬ!)"
            ],
            analyticalUse: "Классический пример амфотерности"
        },
        applications: ["Антацид (Альмагель)", "Антипирен", "Адсорбент", "Производство алюминия"],
        safety: { toxicity: "Нетоксичен", hazardClass: "Безопасен" }
    },

    "Cr3+-OH-": {
        name: "Гидроксид хрома(III)",
        formula: "Cr(OH)₃",
        molarMass: 103.02,
        oxidationStates: { "Cr": +3, "O": -2, "H": +1 },
        compoundType: "АМФОТЕРНЫЙ гидроксид",
        solubility: {
            status: "N",
            value: 0,
            ksp: 6.3e-31
        },
        appearance: {
            precipitateColor: "ЗЕЛЁНЫЙ (серо-зелёный)",
            crystalColor: "Зелёный",
            solutionColor: "—"
        },
        stability: {
            characteristicReactions: [
                "Cr(OH)₃ + 3HCl → CrCl₃ + 3H₂O",
                "Cr(OH)₃ + 3NaOH → Na₃[Cr(OH)₆] (хромит — АМФОТЕРНОСТЬ)"
            ],
            analyticalUse: "Зелёный осадок — признак Cr³⁺"
        },
        applications: ["Пигмент (зелёный оксид хрома)", "Дубление кожи"],
        safety: { toxicity: "Малотоксичен (в отличие от Cr⁶⁺)" }
    },

    "Mn2+-OH-": {
        name: "Гидроксид марганца(II)",
        formula: "Mn(OH)₂",
        molarMass: 88.95,
        oxidationStates: { "Mn": +2, "O": -2, "H": +1 },
        compoundType: "Слабое основание",
        solubility: {
            status: "N",
            value: 0,
            ksp: 1.6e-13
        },
        appearance: {
            precipitateColor: "Белый → быстро буреет",
            crystalColor: "Белый/розоватый",
            solutionColor: "—"
        },
        stability: {
            airSensitivity: "Быстро окисляется на воздухе до MnO(OH) (коричневый)",
            characteristicReactions: [
                "MnSO₄ + 2NaOH → Mn(OH)₂↓ (белый) + Na₂SO₄",
                "2Mn(OH)₂ + O₂ → 2MnO(OH)₂ (побурение)"
            ]
        },
        applications: ["Промежуточный продукт"],
        safety: { toxicity: "Малотоксичен" }
    },

    "Ni2+-OH-": {
        name: "Гидроксид никеля(II)",
        formula: "Ni(OH)₂",
        molarMass: 92.71,
        oxidationStates: { "Ni": +2, "O": -2, "H": +1 },
        compoundType: "Слабое основание",
        solubility: {
            status: "N",
            value: 0,
            ksp: 5.5e-16
        },
        appearance: {
            precipitateColor: "СВЕТЛО-ЗЕЛЁНЫЙ",
            crystalColor: "Зелёный",
            solutionColor: "—"
        },
        stability: {
            characteristicReactions: [
                "NiSO₄ + 2NaOH → Ni(OH)₂↓ (зелёный) + Na₂SO₄",
                "Ni(OH)₂ + 6NH₃ → [Ni(NH₃)₆](OH)₂ (синий раствор)"
            ],
            analyticalUse: "Зелёный осадок — признак Ni²⁺"
        },
        applications: ["Никель-кадмиевые и никель-металлогидридные аккумуляторы", "Катализаторы"],
        safety: { toxicity: "Токсичен, канцероген", hazardClass: "Группа 1 IARC" }
    },

    "Co2+-OH-": {
        name: "Гидроксид кобальта(II)",
        formula: "Co(OH)₂",
        molarMass: 92.95,
        oxidationStates: { "Co": +2, "O": -2, "H": +1 },
        compoundType: "Слабое основание",
        solubility: {
            status: "N",
            value: 0,
            ksp: 5.9e-15
        },
        appearance: {
            precipitateColor: "РОЗОВЫЙ или СИНИЙ (в зависимости от формы)",
            crystalColor: "Розовый (α-форма), синий (β-форма)",
            solutionColor: "—"
        },
        stability: {
            airSensitivity: "Медленно окисляется до CoOOH (коричневый)",
            characteristicReactions: [
                "CoSO₄ + 2NaOH → Co(OH)₂↓ (розовый/синий) + Na₂SO₄",
                "Co(OH)₂ + 6NH₃ → [Co(NH₃)₆](OH)₂"
            ],
            analyticalUse: "Розовый осадок — признак Co²⁺"
        },
        applications: ["Катализаторы", "Пигменты", "Аккумуляторы"],
        safety: { toxicity: "Токсичен", ldso: "~320 мг/кг (крысы)" }
    },

    "Sn2+-OH-": {
        name: "Гидроксид олова(II)",
        formula: "Sn(OH)₂",
        molarMass: 152.73,
        oxidationStates: { "Sn": +2, "O": -2, "H": +1 },
        compoundType: "АМФОТЕРНЫЙ гидроксид",
        solubility: {
            status: "N",
            value: 0,
            ksp: 1.4e-28
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Белый",
            solutionColor: "—"
        },
        stability: {
            airSensitivity: "Легко окисляется до Sn(OH)₄",
            characteristicReactions: [
                "Sn(OH)₂ + 2HCl → SnCl₂ + 2H₂O",
                "Sn(OH)₂ + 2NaOH → Na₂[Sn(OH)₄] (станнит — АМФОТЕРНОСТЬ)"
            ]
        },
        applications: ["Восстановитель", "Производство солей олова"],
        safety: { toxicity: "Умеренно токсичен" }
    },

    // =============================================
    // ЧАСТЬ II. ФТОРИДЫ (F⁻)
    // =============================================

    "H+-F-": {
        name: "Фтороводород (Плавиковая кислота)",
        formula: "HF",
        molarMass: 20.01,
        oxidationStates: { "H": +1, "F": -1 },
        compoundType: "СЛАБАЯ кислота (pKa ≈ 3.2) — АНОМАЛИЯ!",
        solubility: {
            status: "R",
            value: "неограниченно",
            note: "Смешивается с водой в любых соотношениях. Образует ион HF₂⁻ в концентрированных растворах"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Бесцветная жидкость/газ",
            solutionColor: "Бесцветный",
            meltingPoint: "-83°C",
            boilingPoint: "19.5°C"
        },
        stability: {
            decomposition: false,
            characteristicReactions: [
                "SiO₂ + 4HF → SiF₄ + 2H₂O (травление стекла!)",
                "CaF₂ + H₂SO₄ → CaSO₄ + 2HF (получение HF)"
            ],
            analyticalUse: "Травит стекло — хранят в пластиковой/тефлоновой посуде"
        },
        applications: ["Травление стекла и кремния", "Производство фторполимеров (тефлон)", "Получение криолита Na₃AlF₆", "Нефтепереработка"],
        safety: {
            toxicity: "⚠️ КРАЙНЕ ОПАСЕН!",
            ldso: "17.4 мг/кг (крысы, в/в)",
            hazardClass: "Проникает через кожу, связывает Ca²⁺ и Mg²⁺",
            precautions: "Вызывает гипокальциемию, аритмию, смерть. Антидот — глюконат кальция"
        }
    },

    "NH4+-F-": {
        name: "Фторид аммония",
        formula: "NH₄F",
        molarMass: 37.04,
        oxidationStates: { "N": -3, "H": +1, "F": -1 },
        compoundType: "Кислая соль (слабого основания и слабой кислоты)",
        solubility: {
            status: "R",
            value: 100,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белые кристаллы",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "При нагревании: NH₄F → NH₃ + HF",
            airSensitivity: "Гигроскопичен"
        },
        applications: ["Травление стекла", "Консервант древесины", "Антисептик"],
        safety: { toxicity: "Токсичен (фторид)", hazardClass: "Раздражает кожу и глаза" }
    },

    "Li+-F-": {
        name: "Фторид лития",
        formula: "LiF",
        molarMass: 25.94,
        oxidationStates: { "Li": +1, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "M",
            value: 0.27,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 3.8e-3,
            note: "АНОМАЛИЯ: единственный малорастворимый фторид щелочного металла!"
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Белый/бесцветный",
            solutionColor: "Бесцветный",
            crystalSystem: "Кубическая (NaCl-тип)"
        },
        stability: {
            decomposition: false,
            meltingPoint: "848°C",
            boilingPoint: "1673°C",
            note: "Очень высокая энергия решётки — причина низкой растворимости"
        },
        applications: ["Оптика (УФ и ИК-окна)", "Флюсы в металлургии", "Электролит для получения F₂", "Ядерная промышленность"],
        safety: { toxicity: "Токсичен", ldso: "143 мг/кг (крысы)" }
    },

    "K+-F-": {
        name: "Фторид калия",
        formula: "KF",
        molarMass: 58.10,
        oxidationStates: { "K": +1, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 95,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белые кристаллы",
            solutionColor: "Бесцветный",
            crystalSystem: "Кубическая"
        },
        stability: {
            decomposition: false,
            meltingPoint: "858°C",
            airSensitivity: "Гигроскопичен"
        },
        applications: ["Фторирующий агент в органическом синтезе", "Травление стекла", "Консервант древесины"],
        safety: { toxicity: "Токсичен", ldso: "245 мг/кг (крысы)" }
    },

    "Na+-F-": {
        name: "Фторид натрия",
        formula: "NaF",
        molarMass: 41.99,
        oxidationStates: { "Na": +1, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 4.0,
            unit: "г/100 мл",
            temperature: 20,
            note: "Растворимость ниже, чем у NaCl!"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый порошок",
            solutionColor: "Бесцветный",
            crystalSystem: "Кубическая (NaCl-тип)",
            mineralName: "Виллиомит"
        },
        stability: {
            decomposition: false,
            meltingPoint: "993°C"
        },
        applications: ["Фторирование питьевой воды (профилактика кариеса)", "Зубные пасты", "Инсектициды", "Флюсы"],
        safety: {
            toxicity: "Токсичен в больших дозах",
            ldso: "52 мг/кг (крысы)",
            hazardClass: "Безопасен в малых концентрациях (1 ppm в воде)"
        }
    },

    "Rb+-F-": {
        name: "Фторид рубидия",
        formula: "RbF",
        molarMass: 104.47,
        oxidationStates: { "Rb": +1, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 300,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: { decomposition: false, meltingPoint: "795°C" },
        applications: ["Специальная оптика", "Научные исследования"],
        safety: { toxicity: "Токсичен (фторид)" }
    },

    "Cs+-F-": {
        name: "Фторид цезия",
        formula: "CsF",
        molarMass: 151.90,
        oxidationStates: { "Cs": +1, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 367,
            unit: "г/100 мл",
            temperature: 20,
            note: "Один из самых растворимых фторидов"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: false,
            meltingPoint: "682°C",
            airSensitivity: "Очень гигроскопичен"
        },
        applications: ["Фторирующий агент в органическом синтезе", "Катализатор"],
        safety: { toxicity: "Токсичен" }
    },

    "Ag+-F-": {
        name: "Фторид серебра",
        formula: "AgF",
        molarMass: 126.87,
        oxidationStates: { "Ag": +1, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 180,
            unit: "г/100 мл",
            temperature: 20,
            note: "⚡ АНОМАЛИЯ! AgF РАСТВОРИМ — в отличие от AgCl, AgBr, AgI!"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Жёлтый (темнеет на свету)",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: false,
            lightSensitivity: "Темнеет на свету",
            note: "F⁻ — жёсткое основание, плохо связывается с мягкой кислотой Ag⁺ (HSAB-теория)"
        },
        applications: ["Фторирующий агент в органическом синтезе", "Лечение кариеса (серебряный диамин фторид)", "Антибактериальные препараты"],
        safety: { toxicity: "Токсичен (и серебро, и фторид)", hazardClass: "Едкий" }
    },

    "Mg2+-F-": {
        name: "Фторид магния",
        formula: "MgF₂",
        molarMass: 62.30,
        oxidationStates: { "Mg": +2, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "N",
            value: 0.008,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 3.7e-8
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Бесцветный/белый",
            solutionColor: "—",
            mineralName: "Селлаит",
            crystalSystem: "Тетрагональная (рутил-тип)"
        },
        stability: {
            decomposition: false,
            meltingPoint: "1263°C"
        },
        applications: ["Оптика (линзы, призмы — прозрачен для УФ)", "Антибликовые покрытия", "Керамика"],
        safety: { toxicity: "Малотоксичен" }
    },

    "Ca2+-F-": {
        name: "Фторид кальция (Флюорит)",
        formula: "CaF₂",
        molarMass: 78.07,
        oxidationStates: { "Ca": +2, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "N",
            value: 0.0016,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 3.9e-11
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Бесцветный, фиолетовый, зелёный, жёлтый (примеси)",
            solutionColor: "—",
            mineralName: "ФЛЮОРИТ (плавиковый шпат)",
            crystalSystem: "Кубическая (флюоритовая структура — прототип!)"
        },
        stability: {
            decomposition: false,
            meltingPoint: "1418°C",
            characteristicReactions: [
                "CaF₂ + H₂SO₄ →(нагрев) CaSO₄ + 2HF↑ (получение HF)"
            ]
        },
        applications: [
            "Оптика (ИК и УФ-линзы, объективы микроскопов)",
            "Сырьё для производства HF",
            "Флюсы в металлургии",
            "Термолюминесцентная дозиметрия"
        ],
        safety: { toxicity: "Практически нетоксичен" },
        additionalInfo: {
            interestingFacts: [
                "Флюорит дал название явлению ФЛУОРЕСЦЕНЦИИ!",
                "Минерал известен с древности",
                "Прозрачен от УФ (125 нм) до ИК (9 мкм)"
            ]
        }
    },

    "Sr2+-F-": {
        name: "Фторид стронция",
        formula: "SrF₂",
        molarMass: 125.62,
        oxidationStates: { "Sr": +2, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "N",
            value: 0.012,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 2.0e-10
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Бесцветный/белый",
            solutionColor: "—",
            crystalSystem: "Кубическая (флюорит-тип)"
        },
        stability: { decomposition: false, meltingPoint: "1477°C" },
        applications: ["Оптика", "Зубные пасты (укрепление эмали)", "Керамика"],
        safety: { toxicity: "Малотоксичен" }
    },

    "Ba2+-F-": {
        name: "Фторид бария",
        formula: "BaF₂",
        molarMass: 175.32,
        oxidationStates: { "Ba": +2, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "M",
            value: 0.12,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 1.0e-6
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Бесцветный/белый",
            solutionColor: "—",
            crystalSystem: "Кубическая (флюорит-тип)"
        },
        stability: { decomposition: false, meltingPoint: "1368°C" },
        applications: ["Оптика (ИК-окна, прозрачен до 15 мкм)", "Сцинтилляторы", "Эмали"],
        safety: { toxicity: "Токсичен (растворимый барий)", ldso: "250 мг/кг (крысы)" }
    },

    "Zn2+-F-": {
        name: "Фторид цинка",
        formula: "ZnF₂",
        molarMass: 103.39,
        oxidationStates: { "Zn": +2, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "M",
            value: 1.5,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Белый",
            solutionColor: "Бесцветный",
            crystalSystem: "Тетрагональная (рутил-тип)"
        },
        stability: { decomposition: false, meltingPoint: "872°C" },
        applications: ["Производство фосфоресцирующих материалов", "Керамика", "Консервант древесины"],
        safety: { toxicity: "Токсичен", ldso: "200 мг/кг (крысы)" }
    },

    "Hg2+-F-": {
        name: "Фторид ртути(II)",
        formula: "HgF₂",
        molarMass: 238.59,
        oxidationStates: { "Hg": +2, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "—",
            note: "Гидролизуется водой: HgF₂ + H₂O → HgO + 2HF"
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Белый",
            solutionColor: "—",
            crystalSystem: "Кубическая (флюорит-тип)"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "Гидролизуется водой",
            airSensitivity: "Реагирует с влагой воздуха"
        },
        applications: ["Фторирующий агент (редко, токсичен)"],
        safety: { toxicity: "⚠️ КРАЙНЕ ТОКСИЧЕН", hazardClass: "Ртуть + фторид — двойная опасность" }
    },

    "Pb2+-F-": {
        name: "Фторид свинца(II)",
        formula: "PbF₂",
        molarMass: 245.20,
        oxidationStates: { "Pb": +2, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "M",
            value: 0.06,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 2.7e-8
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Белый/бесцветный",
            solutionColor: "—",
            crystalSystem: "Орторомбическая или кубическая"
        },
        stability: { decomposition: false, meltingPoint: "855°C" },
        applications: ["Оптика (ИК-материалы)", "Электролит в батареях"],
        safety: { toxicity: "ТОКСИЧЕН (свинец)", hazardClass: "Канцероген" }
    },

    "Cu2+-F-": {
        name: "Фторид меди(II)",
        formula: "CuF₂",
        molarMass: 101.54,
        oxidationStates: { "Cu": +2, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "M",
            value: 0.075,
            unit: "г/100 мл",
            temperature: 20,
            note: "Слабо растворим"
        },
        appearance: {
            precipitateColor: "Голубовато-белый",
            crystalColor: "Голубой/белый",
            solutionColor: "Голубой (слабо)",
            crystalSystem: "Моноклинная"
        },
        stability: { decomposition: false, meltingPoint: "836°C" },
        applications: ["Фторирование органических соединений", "Катализатор"],
        safety: { toxicity: "Токсичен" }
    },

    "Fe2+-F-": {
        name: "Фторид железа(II)",
        formula: "FeF₂",
        molarMass: 93.84,
        oxidationStates: { "Fe": +2, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "M",
            value: "слабо",
            ksp: 2.4e-6
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Белый/бесцветный",
            solutionColor: "—",
            crystalSystem: "Тетрагональная (рутил-тип)"
        },
        stability: {
            decomposition: false,
            meltingPoint: "1000°C",
            airSensitivity: "Устойчив на воздухе"
        },
        applications: ["Керамика", "Катализаторы"],
        safety: { toxicity: "Умеренно токсичен" }
    },

    "Fe3+-F-": {
        name: "Фторид железа(III)",
        formula: "FeF₃",
        molarMass: 112.84,
        oxidationStates: { "Fe": +3, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "M",
            value: "слабо",
            note: "Слабо растворим в воде"
        },
        appearance: {
            precipitateColor: "Белый/розоватый",
            crystalColor: "Светло-зелёный/белый",
            solutionColor: "—",
            crystalSystem: "Ромбоэдрическая"
        },
        stability: { decomposition: false, meltingPoint: "1000°C (разл.)" },
        applications: ["Катализатор в органическом синтезе", "Керамика"],
        safety: { toxicity: "Токсичен" }
    },

    "Al3+-F-": {
        name: "Фторид алюминия",
        formula: "AlF₃",
        molarMass: 83.98,
        oxidationStates: { "Al": +3, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "M",
            value: 0.5,
            unit: "г/100 мл",
            temperature: 20,
            note: "Слабо растворим"
        },
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Белый",
            solutionColor: "—",
            crystalSystem: "Ромбоэдрическая"
        },
        stability: {
            decomposition: false,
            meltingPoint: "1291°C (возг.)",
            note: "Сублимирует при нагревании"
        },
        applications: [
            "Производство алюминия (добавка к криолиту)",
            "Катализатор в нефтехимии",
            "Керамика",
            "Производство эмалей"
        ],
        safety: { toxicity: "Умеренно токсичен", ldso: "~100 мг/кг (крысы)" }
    },

    "Cr3+-F-": {
        name: "Фторид хрома(III)",
        formula: "CrF₃",
        molarMass: 109.00,
        oxidationStates: { "Cr": +3, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "N",
            value: 0,
            note: "Практически нерастворим"
        },
        appearance: {
            precipitateColor: "Зелёный",
            crystalColor: "Зелёный",
            solutionColor: "—"
        },
        stability: { decomposition: false, meltingPoint: "1100°C" },
        applications: ["Текстильная промышленность (протрава)", "Керамика"],
        safety: { toxicity: "Умеренно токсичен (Cr³⁺ менее опасен, чем Cr⁶⁺)" }
    },

    "Mn2+-F-": {
        name: "Фторид марганца(II)",
        formula: "MnF₂",
        molarMass: 92.93,
        oxidationStates: { "Mn": +2, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "M",
            value: 1.06,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "Розовый",
            crystalColor: "Розовый/красноватый",
            solutionColor: "Бледно-розовый",
            crystalSystem: "Тетрагональная (рутил-тип)"
        },
        stability: { decomposition: false, meltingPoint: "856°C" },
        applications: ["Оптика", "Лазеры", "Магнитные материалы"],
        safety: { toxicity: "Умеренно токсичен" }
    },

    "Ni2+-F-": {
        name: "Фторид никеля(II)",
        formula: "NiF₂",
        molarMass: 96.69,
        oxidationStates: { "Ni": +2, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "M",
            value: 2.5,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "Жёлто-зелёный",
            crystalColor: "Жёлтый/зелёный",
            solutionColor: "Зелёный",
            crystalSystem: "Тетрагональная (рутил-тип)"
        },
        stability: { decomposition: false, meltingPoint: "1474°C" },
        applications: ["Катализатор фторирования", "Керамика"],
        safety: { toxicity: "Токсичен, канцероген", hazardClass: "Группа 1 IARC (никель)" }
    },

    "Co2+-F-": {
        name: "Фторид кобальта(II)",
        formula: "CoF₂",
        molarMass: 96.93,
        oxidationStates: { "Co": +2, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "M",
            value: 1.4,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "Розовый",
            crystalColor: "Розовый/красный",
            solutionColor: "Розовый",
            crystalSystem: "Тетрагональная (рутил-тип)"
        },
        stability: { decomposition: false, meltingPoint: "1217°C" },
        applications: ["Катализатор", "Керамика", "Пигменты"],
        safety: { toxicity: "Токсичен", ldso: "~150 мг/кг (крысы)" }
    },

    "Sn2+-F-": {
        name: "Фторид олова(II)",
        formula: "SnF₂",
        molarMass: 156.69,
        oxidationStates: { "Sn": +2, "F": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 30,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный",
            crystalSystem: "Моноклинная"
        },
        stability: {
            decomposition: false,
            meltingPoint: "213°C",
            airSensitivity: "Окисляется на воздухе до Sn⁴⁺"
        },
        applications: [
            "Зубные пасты (противокариесный агент) — более эффективен, чем NaF",
            "Стоматология",
            "Электролиты"
        ],
        safety: { toxicity: "Малотоксичен в малых дозах", hazardClass: "Безопасен в зубных пастах" }
    },

    // =============================================
    // ЧАСТЬ III. ХЛОРИДЫ (Cl⁻)
    // =============================================

    "H+-Cl-": {
        name: "Хлороводород (Соляная кислота)",
        formula: "HCl",
        molarMass: 36.46,
        oxidationStates: { "H": +1, "Cl": -1 },
        compoundType: "СИЛЬНАЯ одноосновная кислота (pKa = −7.1)",
        solubility: {
            status: "R",
            value: "507 объёмов газа в 1 объёме воды (0°C)",
            note: "Концентрированная: 35-38%, плотность 1.19 г/см³. Азеотроп: 20.4% HCl, Т.кип. = 108.6°C"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Бесцветный газ с резким запахом",
            solutionColor: "Бесцветный",
            meltingPoint: "-114°C",
            boilingPoint: "-85°C"
        },
        stability: {
            decomposition: false,
            characteristicReactions: [
                "HCl + NaOH → NaCl + H₂O",
                "2HCl + Zn → ZnCl₂ + H₂↑",
                "HCl + AgNO₃ → AgCl↓ + HNO₃ (КАЧЕСТВЕННАЯ РЕАКЦИЯ!)"
            ],
            analyticalUse: "Ag⁺ + Cl⁻ → AgCl↓ (белый творожистый осадок)"
        },
        applications: ["Травление металлов", "Производство хлоридов", "Желудочный сок (0.5%)", "Гидрометаллургия", "Пищевая промышленность (E507)"],
        safety: {
            toxicity: "Едкий",
            hazardClass: "Вызывает ожоги. Пары раздражают дыхательные пути"
        }
    },

    "NH4+-Cl-": {
        name: "Хлорид аммония (Нашатырь)",
        formula: "NH₄Cl",
        molarMass: 53.49,
        oxidationStates: { "N": -3, "H": +1, "Cl": -1 },
        compoundType: "Кислая соль (слабого основания и сильной кислоты)",
        solubility: {
            status: "R",
            value: 37.2,
            unit: "г/100 мл",
            temperature: 20,
            temperatureDependence: "Сильно возрастает: 77 г/100 мл при 100°C"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белые кристаллы",
            solutionColor: "Бесцветный",
            crystalSystem: "Кубическая (CsCl-тип)"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "При нагревании возгоняется: NH₄Cl ⇌ NH₃ + HCl (обратимо!)",
            characteristicReactions: [
                "NH₄Cl + NaOH → NaCl + NH₃↑ + H₂O (обнаружение NH₄⁺)"
            ]
        },
        applications: ["Флюс для пайки", "Удобрение", "Электролит в батарейках", "Медицина (отхаркивающее)", "Пищевая добавка E510"],
        safety: { toxicity: "Малотоксичен", ldso: "1650 мг/кг (крысы)" },
        additionalInfo: {
            mineralName: "Нашатырь",
            interestingFacts: ["Известен с древности", "Возгоняется без плавления"]
        }
    },

    "Li+-Cl-": {
        name: "Хлорид лития",
        formula: "LiCl",
        molarMass: 42.39,
        oxidationStates: { "Li": +1, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 84.5,
            unit: "г/100 мл",
            temperature: 20,
            note: "Один из самых растворимых хлоридов!"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белые кристаллы",
            solutionColor: "Бесцветный",
            crystalSystem: "Кубическая (NaCl-тип)"
        },
        stability: {
            decomposition: false,
            meltingPoint: "610°C",
            airSensitivity: "Очень гигроскопичен"
        },
        applications: ["Осушитель воздуха (кондиционеры)", "Флюс для пайки алюминия", "Электролит", "Лечение биполярного расстройства"],
        safety: { toxicity: "Умеренно токсичен", ldso: "526 мг/кг (крысы)" }
    },

    "K+-Cl-": {
        name: "Хлорид калия (Сильвин)",
        formula: "KCl",
        molarMass: 74.55,
        oxidationStates: { "K": +1, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 34.0,
            unit: "г/100 мл",
            temperature: 20,
            temperatureDependence: "56.7 г/100 мл при 100°C"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый/бесцветный (примеси дают розовый, красный)",
            solutionColor: "Бесцветный",
            crystalSystem: "Кубическая (NaCl-тип)",
            mineralName: "Сильвин"
        },
        stability: { decomposition: false, meltingPoint: "770°C" },
        applications: [
            "Калийные удобрения (основной источник)",
            "Заменитель соли (диетическое питание)",
            "Медицина (препараты калия)",
            "Электролит"
        ],
        safety: { toxicity: "Малотоксичен", ldso: "2500 мг/кг (крысы)" },
        additionalInfo: {
            interestingFacts: ["Горит фиолетовым пламенем (качественная реакция на K⁺)"]
        }
    },

    "Na+-Cl-": {
        name: "Хлорид натрия (Поваренная соль)",
        formula: "NaCl",
        molarMass: 58.44,
        oxidationStates: { "Na": +1, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 35.9,
            unit: "г/100 мл",
            temperature: 20,
            temperatureDependence: "38.1 г/100 мл при 80°C — СЛАБАЯ зависимость от температуры!"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Бесцветный/белый",
            solutionColor: "Бесцветный",
            crystalSystem: "Кубическая (NaCl-тип — ПРОТОТИП структуры!)",
            mineralName: "ГАЛИТ (каменная соль)"
        },
        stability: { decomposition: false, meltingPoint: "801°C", boilingPoint: "1413°C" },
        applications: [
            "Пищевая промышленность (приправа, консервант)",
            "Производство NaOH и Cl₂ (электролиз)",
            "Противогололёдный реагент",
            "Физиологический раствор (0.9%)"
        ],
        safety: { toxicity: "Малотоксичен", ldso: "3000 мг/кг (крысы)" },
        additionalInfo: {
            interestingFacts: [
                "Мировой океан содержит 4×10¹⁵ тонн NaCl",
                "Горит жёлтым пламенем (качественная реакция на Na⁺)",
                "Известен с древности, использовался как валюта (слово 'salary' от 'sal' — соль)"
            ]
        }
    },

    "Rb+-Cl-": {
        name: "Хлорид рубидия",
        formula: "RbCl",
        molarMass: 120.92,
        oxidationStates: { "Rb": +1, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 91,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный",
            crystalSystem: "Кубическая (NaCl-тип)"
        },
        stability: { decomposition: false, meltingPoint: "718°C" },
        applications: ["Научные исследования", "Специальная оптика"],
        safety: { toxicity: "Малотоксичен" }
    },

    "Cs+-Cl-": {
        name: "Хлорид цезия",
        formula: "CsCl",
        molarMass: 168.36,
        oxidationStates: { "Cs": +1, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 186,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Бесцветный",
            solutionColor: "Бесцветный",
            crystalSystem: "Кубическая (CsCl-тип — ПРОТОТИП структуры!)"
        },
        stability: { decomposition: false, meltingPoint: "645°C" },
        applications: [
            "Градиентное центрифугирование ДНК (молекулярная биология)",
            "Радиотерапия (изотоп Cs-137)",
            "Специальная оптика"
        ],
        safety: { toxicity: "Малотоксичен (стабильный Cs)" },
        additionalInfo: {
            interestingFacts: ["Структура CsCl — один из базовых типов кристаллических решёток"]
        }
    },

    "Ag+-Cl-": {
        name: "Хлорид серебра",
        formula: "AgCl",
        molarMass: 143.32,
        oxidationStates: { "Ag": +1, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "N",
            value: 0.0019,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 1.77e-10,
            note: "Растворим в NH₃, Na₂S₂O₃, KCN (комплексообразование)"
        },
        appearance: {
            precipitateColor: "⚪ БЕЛЫЙ творожистый",
            crystalColor: "Белый (темнеет на свету!)",
            solutionColor: "—",
            crystalSystem: "Кубическая (NaCl-тип)",
            mineralName: "Хлораргирит (кераргирит)"
        },
        stability: {
            decomposition: false,
            lightSensitivity: "⚠️ ТЕМНЕЕТ НА СВЕТУ! (серый → фиолетовый → чёрный)",
            characteristicReactions: [
                "2AgCl →(свет) 2Ag + Cl₂ (фотолиз — основа фотографии)",
                "AgCl + 2NH₃ → [Ag(NH₃)₂]Cl (растворение в аммиаке)"
            ],
            analyticalUse: "КАЧЕСТВЕННАЯ РЕАКЦИЯ на Cl⁻: белый осадок, растворимый в NH₃"
        },
        applications: [
            "Фотоэмульсии (классическая фотография)",
            "Хлорсеребряный электрод сравнения",
            "ИК-оптика",
            "Антибактериальные материалы"
        ],
        safety: { toxicity: "Малотоксичен (нерастворим)" },
        additionalInfo: {
            interestingFacts: [
                "Основа классической фотографии (XIX-XX век)",
                "Фотохромные линзы содержат AgCl"
            ]
        }
    },

    "Mg2+-Cl-": {
        name: "Хлорид магния",
        formula: "MgCl₂",
        molarMass: 95.21,
        oxidationStates: { "Mg": +2, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 54.6,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый/бесцветный",
            solutionColor: "Бесцветный",
            mineralName: "Бишофит (MgCl₂·6H₂O)"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "MgCl₂·6H₂O при нагревании гидролизуется: → MgO + 2HCl",
            airSensitivity: "Очень гигроскопичен"
        },
        applications: [
            "Противогололёдный реагент (менее коррозионный, чем NaCl)",
            "Производство магния (электролиз расплава)",
            "Пищевая добавка E511",
            "Тофу (коагулянт)"
        ],
        safety: { toxicity: "Малотоксичен", ldso: "2800 мг/кг (крысы)" }
    },

    "Ca2+-Cl-": {
        name: "Хлорид кальция",
        formula: "CaCl₂",
        molarMass: 110.98,
        oxidationStates: { "Ca": +2, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 74.5,
            unit: "г/100 мл",
            temperature: 20,
            note: "⚡ Растворение СИЛЬНО ЭКЗОТЕРМИЧНО! 30% раствор замерзает при −48°C"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный",
            mineralName: "Антарктицит (очень редкий, озеро Дон-Жуан, Антарктида)"
        },
        stability: {
            decomposition: false,
            airSensitivity: "⚠️ СИЛЬНО ГИГРОСКОПИЧЕН — главное свойство!"
        },
        applications: [
            "Осушитель газов (хлоркальциевые трубки)",
            "Противогололёдный реагент",
            "Ускоритель схватывания бетона",
            "Пищевая добавка E509",
            "Охлаждающие смеси"
        ],
        safety: { toxicity: "Малотоксичен", ldso: "1000 мг/кг (крысы)" },
        additionalInfo: {
            interestingFacts: [
                "Нельзя осушать спирты, амины, кетоны, кислоты (образует комплексы)!",
                "Озеро Дон-Жуан — самый солёный водоём на Земле (40% CaCl₂)"
            ]
        }
    },

    "Sr2+-Cl-": {
        name: "Хлорид стронция",
        formula: "SrCl₂",
        molarMass: 158.53,
        oxidationStates: { "Sr": +2, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 53.8,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: { decomposition: false, meltingPoint: "874°C" },
        applications: [
            "Пиротехника (КРАСНЫЙ цвет пламени!)",
            "Зубные пасты для чувствительных зубов",
            "Производство стронциевых соединений"
        ],
        safety: { toxicity: "Умеренно токсичен", ldso: "2250 мг/кг (крысы)" }
    },

    "Ba2+-Cl-": {
        name: "Хлорид бария",
        formula: "BaCl₂",
        molarMass: 208.23,
        oxidationStates: { "Ba": +2, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 35.8,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: false,
            characteristicReactions: [
                "BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl (КАЧЕСТВЕННАЯ РЕАКЦИЯ на SO₄²⁻!)",
                "BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl"
            ],
            analyticalUse: "Реагент для обнаружения сульфат-ионов"
        },
        applications: ["Реактив для обнаружения SO₄²⁻", "Закалка стали", "Производство пигментов"],
        safety: {
            toxicity: "⚠️ ТОКСИЧЕН!",
            ldso: "118 мг/кг (крысы)",
            hazardClass: "Растворимые соли бария ядовиты!"
        }
    },

    "Zn2+-Cl-": {
        name: "Хлорид цинка",
        formula: "ZnCl₂",
        molarMass: 136.30,
        oxidationStates: { "Zn": +2, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 432,
            unit: "г/100 мл",
            temperature: 20,
            note: "Один из САМЫХ растворимых хлоридов!"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Очень гигроскопичен",
            note: "Кислота Льюиса"
        },
        applications: [
            "Флюс для пайки",
            "Катализатор (органический синтез)",
            "Дезодоранты",
            "Консервант древесины",
            "Сухие батарейки"
        ],
        safety: { toxicity: "Токсичен, едкий", ldso: "350 мг/кг (крысы)" }
    },

    "Hg2+-Cl-": {
        name: "Хлорид ртути(II) (Сулема)",
        formula: "HgCl₂",
        molarMass: 271.50,
        oxidationStates: { "Hg": +2, "Cl": -1 },
        compoundType: "Средняя соль (ковалентная)",
        solubility: {
            status: "R",
            value: 7.4,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный",
            crystalSystem: "Орторомбическая"
        },
        stability: {
            decomposition: false,
            meltingPoint: "276°C",
            characteristicReactions: [
                "HgCl₂ + 2KI → HgI₂↓ + 2KCl (красный осадок)",
                "HgCl₂ + SnCl₂ → Hg₂Cl₂↓ → Hg (восстановление)"
            ]
        },
        applications: ["Консервант древесины (исторически)", "Дезинфектант (исторически)", "Реактив Несслера"],
        safety: {
            toxicity: "⚠️ КРАЙНЕ ТОКСИЧЕН!",
            ldso: "1 мг/кг (крысы) — один из самых ядовитых хлоридов!",
            hazardClass: "Смертельная доза для человека: 0.2-0.4 г"
        },
        additionalInfo: {
            historicalFacts: ["Название 'сулема' от лат. sublimatum (возогнанное)"]
        }
    },

    "Hg2+-Hg2+-Cl-": {
        name: "Хлорид ртути(I) (Каломель)",
        formula: "Hg₂Cl₂",
        molarMass: 472.09,
        oxidationStates: { "Hg": +1, "Cl": -1 },
        compoundType: "Средняя соль (содержит связь Hg-Hg)",
        solubility: {
            status: "N",
            value: 0.00034,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 1.3e-18
        },
        appearance: {
            precipitateColor: "⚪ БЕЛЫЙ",
            crystalColor: "Белый",
            solutionColor: "—",
            mineralName: "Каломель"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "На свету и при нагревании: Hg₂Cl₂ → HgCl₂ + Hg",
            lightSensitivity: "Темнеет на свету"
        },
        applications: [
            "Каломельный электрод сравнения (исторически)",
            "Слабительное (исторически, токсично!)"
        ],
        safety: {
            toxicity: "Токсичен",
            ldso: "210 мг/кг (крысы)",
            hazardClass: "Менее токсичен, чем HgCl₂, но всё равно опасен"
        }
    },

    "Pb2+-Cl-": {
        name: "Хлорид свинца(II)",
        formula: "PbCl₂",
        molarMass: 278.11,
        oxidationStates: { "Pb": +2, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "M",
            value: 0.98,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 1.7e-5,
            temperatureDependence: "⚡ 3.3 г/100 мл при 100°C — сильно возрастает!"
        },
        appearance: {
            precipitateColor: "⚪ БЕЛЫЙ",
            crystalColor: "Белый",
            solutionColor: "—",
            mineralName: "Коттунит",
            crystalSystem: "Орторомбическая"
        },
        stability: {
            decomposition: false,
            meltingPoint: "501°C",
            analyticalUse: "Белый осадок, растворимый в горячей воде (отличие от AgCl)"
        },
        applications: ["Пигменты", "Производство свинцовых соединений"],
        safety: {
            toxicity: "⚠️ ТОКСИЧЕН (свинец)",
            hazardClass: "Канцероген. Накапливается в организме"
        }
    },

    "Cu2+-Cl-": {
        name: "Хлорид меди(II)",
        formula: "CuCl₂",
        molarMass: 134.45,
        oxidationStates: { "Cu": +2, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 77,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "🟤 Жёлто-коричневый (безводный)",
            hydrateColor: "🔵 Голубовато-зелёный (CuCl₂·2H₂O)",
            solutionColor: "🔵 Голубой (разб.) / 🟢 Зелёный (конц.)"
        },
        stability: {
            decomposition: false,
            meltingPoint: "498°C",
            characteristicReactions: [
                "CuCl₂ + Fe → FeCl₂ + Cu (вытеснение)",
                "CuCl₂ + 2NaOH → Cu(OH)₂↓ + 2NaCl"
            ]
        },
        applications: [
            "Катализатор (хлорирование)",
            "Травление печатных плат",
            "Пиротехника (синий/зелёный цвет)",
            "Фунгицид"
        ],
        safety: { toxicity: "Токсичен", ldso: "140 мг/кг (крысы)" }
    },

    "Fe2+-Cl-": {
        name: "Хлорид железа(II)",
        formula: "FeCl₂",
        molarMass: 126.75,
        oxidationStates: { "Fe": +2, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 64,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый/серовато-зелёный (безводный)",
            hydrateColor: "🟢 Зеленовато-голубой (FeCl₂·4H₂O)",
            solutionColor: "Бледно-зелёный"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Окисляется на воздухе до FeCl₃"
        },
        applications: ["Восстановитель", "Очистка сточных вод", "Производство красителей"],
        safety: { toxicity: "Умеренно токсичен" }
    },

    "Fe3+-Cl-": {
        name: "Хлорид железа(III)",
        formula: "FeCl₃",
        molarMass: 162.21,
        oxidationStates: { "Fe": +3, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 91.9,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "🟤 Красно-коричневый/чёрный (безводный)",
            hydrateColor: "🟡 Жёлтый (FeCl₃·6H₂O)",
            solutionColor: "🟡 Жёлто-коричневый"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Гигроскопичен",
            characteristicReactions: [
                "FeCl₃ + 3KSCN → Fe(SCN)₃ + 3KCl (КАЧЕСТВЕННАЯ РЕАКЦИЯ! Кроваво-красный цвет)",
                "FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl (бурый осадок)"
            ],
            analyticalUse: "Реагент на фенолы (фиолетовое окрашивание)"
        },
        applications: [
            "Травление печатных плат",
            "Коагулянт для очистки воды",
            "Катализатор",
            "Получение других солей железа"
        ],
        safety: { toxicity: "Умеренно токсичен, едкий" }
    },

    "Al3+-Cl-": {
        name: "Хлорид алюминия",
        formula: "AlCl₃",
        molarMass: 133.34,
        oxidationStates: { "Al": +3, "Cl": -1 },
        compoundType: "Средняя соль (сильная кислота Льюиса)",
        solubility: {
            status: "R",
            value: 44.4,
            unit: "г/100 мл",
            temperature: 20,
            note: "Бурно реагирует с водой с выделением HCl!"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый/желтоватый (безводный — димер Al₂Cl₆)",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Дымит на воздухе (гидролиз влагой)",
            note: "Сублимирует при 180°C"
        },
        applications: [
            "Катализатор Фриделя-Крафтса (алкилирование, ацилирование)",
            "Производство алюминия",
            "Антиперспиранты",
            "Нефтепереработка"
        ],
        safety: { toxicity: "Едкий", hazardClass: "Раздражает кожу и дыхательные пути" }
    },

    "Cr3+-Cl-": {
        name: "Хлорид хрома(III)",
        formula: "CrCl₃",
        molarMass: 158.36,
        oxidationStates: { "Cr": +3, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: "растворим",
            note: "Безводный практически не растворяется; гидрат хорошо растворим"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "🟣 Фиолетовый (безводный)",
            hydrateColor: "🟢 Зелёный (CrCl₃·6H₂O)",
            solutionColor: "🟢 Зелёный или 🟣 фиолетовый (зависит от гидратации)"
        },
        stability: {
            decomposition: false,
            note: "Существует в нескольких гидратных формах с разным цветом"
        },
        applications: ["Хромирование", "Текстильная промышленность (протрава)", "Катализатор"],
        safety: { toxicity: "Умеренно токсичен (Cr³⁺ менее опасен, чем Cr⁶⁺)" }
    },

    "Mn2+-Cl-": {
        name: "Хлорид марганца(II)",
        formula: "MnCl₂",
        molarMass: 125.84,
        oxidationStates: { "Mn": +2, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 72.3,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "🩷 Розовый (MnCl₂·4H₂O)",
            solutionColor: "Бледно-розовый"
        },
        stability: { decomposition: false, meltingPoint: "654°C" },
        applications: ["Производство сухих батареек", "Катализатор", "Пищевая добавка (микроэлемент)"],
        safety: { toxicity: "Умеренно токсичен", ldso: "275 мг/кг (крысы)" }
    },

    "Ni2+-Cl-": {
        name: "Хлорид никеля(II)",
        formula: "NiCl₂",
        molarMass: 129.60,
        oxidationStates: { "Ni": +2, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 59.5,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "🟡 Золотисто-жёлтый (безводный)",
            hydrateColor: "🟢 Зелёный (NiCl₂·6H₂O)",
            solutionColor: "🟢 Зелёный"
        },
        stability: { decomposition: false, meltingPoint: "1001°C" },
        applications: ["Никелирование", "Катализатор гидрирования", "Производство никелевых соединений"],
        safety: {
            toxicity: "⚠️ ТОКСИЧЕН, КАНЦЕРОГЕН",
            ldso: "105 мг/кг (крысы)",
            hazardClass: "Группа 1 IARC (канцероген для человека)"
        }
    },

    "Co2+-Cl-": {
        name: "Хлорид кобальта(II)",
        formula: "CoCl₂",
        molarMass: 129.84,
        oxidationStates: { "Co": +2, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 53,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "🔵 ГОЛУБОЙ (безводный)",
            hydrateColor: "🩷 РОЗОВЫЙ (CoCl₂·6H₂O)",
            solutionColor: "🩷 Розовый (разб.) / 🔵 Синий (конц.)",
            note: "⚡ ТЕРМОХРОМНЫЙ! Меняет цвет при нагревании"
        },
        stability: {
            decomposition: false,
            note: "CoCl₂·6H₂O (розовый) ⇌ CoCl₂ (голубой) — индикатор влажности!"
        },
        applications: [
            "Индикатор влажности (силикагель с CoCl₂)",
            "Симпатические чернила",
            "Катализатор",
            "Электролит для кобальтирования"
        ],
        safety: {
            toxicity: "⚠️ ТОКСИЧЕН",
            ldso: "80-690 мг/кг (крысы)",
            hazardClass: "Возможно канцерогенен (группа 2B IARC)"
        },
        additionalInfo: {
            interestingFacts: [
                "Бумага, пропитанная CoCl₂: голубая (сухо) ↔ розовая (влажно)",
                "Симпатические чернила: написанное невидимо, при нагревании проявляется синим"
            ]
        }
    },

    "Sn2+-Cl-": {
        name: "Хлорид олова(II)",
        formula: "SnCl₂",
        molarMass: 189.60,
        oxidationStates: { "Sn": +2, "Cl": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: "хорошо растворим",
            note: "Гидролизуется в воде с образованием основных солей"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный (в кислой среде)"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Окисляется на воздухе до Sn⁴⁺",
            characteristicReactions: [
                "SnCl₂ + HgCl₂ → Hg₂Cl₂↓ → Hg (восстановление ртути)",
                "SnCl₂ — сильный восстановитель!"
            ]
        },
        applications: [
            "Восстановитель в органическом синтезе",
            "Лужение (покрытие оловом)",
            "Текстильная промышленность (протрава)",
            "Производство зеркал"
        ],
        safety: { toxicity: "Умеренно токсичен" }
    },

    // =============================================
    // ЧАСТЬ IV. БРОМИДЫ (Br⁻)
    // =============================================

    "H+-Br-": {
        name: "Бромоводород (Бромистоводородная кислота)",
        formula: "HBr",
        molarMass: 80.91,
        oxidationStates: { "H": +1, "Br": -1 },
        compoundType: "СИЛЬНАЯ кислота (pKa ≈ −9), сильнее HCl!",
        solubility: {
            status: "R",
            value: "∞ (неограниченно смешивается)",
            note: "Азеотроп: 47.6% HBr, Т.кип. = 124.3°C"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Бесцветный газ с резким запахом",
            solutionColor: "Бесцветный",
            meltingPoint: "-87°C",
            boilingPoint: "-67°C"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Дымит на воздухе",
            characteristicReactions: [
                "HBr + AgNO₃ → AgBr↓ + HNO₃ (бледно-жёлтый осадок)"
            ]
        },
        applications: ["Органический синтез (присоединение к алкенам)", "Получение бромидов", "Катализатор"],
        safety: {
            toxicity: "Едкий, токсичен",
            lc50: "2858 ppm/ч (крысы, ингаляция)",
            hazardClass: "Вызывает ожоги. Раздражает дыхательные пути"
        }
    },

    "NH4+-Br-": {
        name: "Бромид аммония",
        formula: "NH₄Br",
        molarMass: 97.94,
        oxidationStates: { "N": -3, "H": +1, "Br": -1 },
        compoundType: "Кислая соль",
        solubility: {
            status: "R",
            value: 78.3,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый/бесцветный",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "При нагревании возгоняется: NH₄Br ⇌ NH₃ + HBr"
        },
        applications: ["Фотография", "Фармацевтика (седативное, исторически)", "Огнезащитные составы"],
        safety: { toxicity: "Умеренно токсичен" }
    },

    "Li+-Br-": {
        name: "Бромид лития",
        formula: "LiBr",
        molarMass: 86.85,
        oxidationStates: { "Li": +1, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 177,
            unit: "г/100 мл",
            temperature: 20,
            note: "Один из самых растворимых бромидов!"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Очень гигроскопичен"
        },
        applications: [
            "Абсорбционные холодильные машины (раствор LiBr — рабочее тело)",
            "Осушитель воздуха",
            "Органический синтез"
        ],
        safety: { toxicity: "Умеренно токсичен" }
    },

    "K+-Br-": {
        name: "Бромид калия",
        formula: "KBr",
        molarMass: 119.00,
        oxidationStates: { "K": +1, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 65,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый/бесцветный",
            solutionColor: "Бесцветный",
            crystalSystem: "Кубическая (NaCl-тип)"
        },
        stability: { decomposition: false, meltingPoint: "734°C" },
        applications: [
            "ИК-спектроскопия (прозрачен для ИК: 0.25–25 мкм)",
            "Ветеринария (противосудорожное для собак)",
            "Фотография",
            "Исторически: седативное средство, лечение эпилепсии"
        ],
        safety: {
            toxicity: "Малотоксичен",
            ldso: "3120 мг/кг (крысы)",
            note: "При передозировке — бромизм (T½ в крови: ~12 дней)"
        },
        additionalInfo: {
            historicalFacts: [
                "1857 г.: сэр Чарльз Локок открыл противосудорожные свойства",
                "Первое эффективное средство от эпилепсии!",
                "В США запрещён как лекарство с 1975 г."
            ]
        }
    },

    "Na+-Br-": {
        name: "Бромид натрия",
        formula: "NaBr",
        molarMass: 102.89,
        oxidationStates: { "Na": +1, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 94.3,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: { decomposition: false, meltingPoint: "747°C" },
        applications: [
            "Фотография",
            "Нефтедобыча (буровые растворы)",
            "Фармацевтика (седативное, исторически)",
            "Производство бромсодержащих соединений"
        ],
        safety: { toxicity: "Малотоксичен", ldso: "3500 мг/кг (крысы)" }
    },

    "Rb+-Br-": {
        name: "Бромид рубидия",
        formula: "RbBr",
        molarMass: 165.37,
        oxidationStates: { "Rb": +1, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 110,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: { decomposition: false },
        applications: ["Специальная оптика", "Научные исследования"],
        safety: { toxicity: "Малотоксичен" }
    },

    "Cs+-Br-": {
        name: "Бромид цезия",
        formula: "CsBr",
        molarMass: 212.81,
        oxidationStates: { "Cs": +1, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 122.6,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный",
            crystalSystem: "Кубическая (CsCl-тип)"
        },
        stability: { decomposition: false, meltingPoint: "636°C" },
        applications: ["Сцинтилляционные детекторы", "ИК-оптика", "Рентгеновская оптика"],
        safety: { toxicity: "Малотоксичен" }
    },

    "Ag+-Br-": {
        name: "Бромид серебра",
        formula: "AgBr",
        molarMass: 187.77,
        oxidationStates: { "Ag": +1, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "N",
            value: 0.00014,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 5.0e-13,
            note: "Растворим в NH₃, Na₂S₂O₃ (хуже, чем AgCl)"
        },
        appearance: {
            precipitateColor: "🟡 БЛЕДНО-ЖЁЛТЫЙ (кремовый)",
            crystalColor: "Бледно-жёлтый (темнеет на свету!)",
            solutionColor: "—",
            mineralName: "Бромаргирит"
        },
        stability: {
            decomposition: false,
            lightSensitivity: "⚠️ ОЧЕНЬ ФОТОЧУВСТВИТЕЛЕН! Темнеет до серо-фиолетового",
            characteristicReactions: [
                "AgBr →(свет) Ag + ½Br₂ (основа латентного изображения в фотографии)",
                "AgBr + 2NH₃ → [Ag(NH₃)₂]Br (частичное растворение)"
            ],
            analyticalUse: "КАЧЕСТВЕННАЯ РЕАКЦИЯ на Br⁻: бледно-жёлтый осадок, плохо растворим в NH₃"
        },
        applications: [
            "Фотоплёнка и фотобумага (ОСНОВНОЙ светочувствительный компонент!)",
            "Фотохромные линзы",
            "Голография"
        ],
        safety: { toxicity: "Малотоксичен (нерастворим)" },
        additionalInfo: {
            interestingFacts: [
                "Наиболее фоточувствительный галогенид серебра — основа классической фотографии",
                "Квантовый выход фотолиза ~0.5"
            ]
        }
    },

    "Mg2+-Br-": {
        name: "Бромид магния",
        formula: "MgBr₂",
        molarMass: 184.11,
        oxidationStates: { "Mg": +2, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 101.5,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Гигроскопичен"
        },
        applications: ["Органический синтез (реактив Гриньяра)", "Седативные препараты (исторически)"],
        safety: { toxicity: "Малотоксичен" }
    },

    "Ca2+-Br-": {
        name: "Бромид кальция",
        formula: "CaBr₂",
        molarMass: 199.89,
        oxidationStates: { "Ca": +2, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 143,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Гигроскопичен"
        },
        applications: ["Буровые растворы (нефтедобыча)", "Пищевая промышленность", "Фотография"],
        safety: { toxicity: "Малотоксичен" }
    },

    "Sr2+-Br-": {
        name: "Бромид стронция",
        formula: "SrBr₂",
        molarMass: 247.43,
        oxidationStates: { "Sr": +2, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 107,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: { decomposition: false },
        applications: ["Фармацевтика", "Производство стронциевых соединений"],
        safety: { toxicity: "Умеренно токсичен" }
    },

    "Ba2+-Br-": {
        name: "Бромид бария",
        formula: "BaBr₂",
        molarMass: 297.14,
        oxidationStates: { "Ba": +2, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 104,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: { decomposition: false, meltingPoint: "857°C" },
        applications: ["Производство бромида", "Фотография", "Химические реактивы"],
        safety: {
            toxicity: "⚠️ ТОКСИЧЕН",
            hazardClass: "Растворимые соли бария ядовиты!"
        }
    },

    "Zn2+-Br-": {
        name: "Бромид цинка",
        formula: "ZnBr₂",
        molarMass: 225.22,
        oxidationStates: { "Zn": +2, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 447,
            unit: "г/100 мл",
            temperature: 20,
            note: "Очень хорошо растворим!"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Гигроскопичен"
        },
        applications: ["Органический синтез (кислота Льюиса)", "Фотография", "Буровые растворы"],
        safety: { toxicity: "Токсичен, едкий" }
    },

    "Hg2+-Br-": {
        name: "Бромид ртути(II)",
        formula: "HgBr₂",
        molarMass: 360.41,
        oxidationStates: { "Hg": +2, "Br": -1 },
        compoundType: "Средняя соль (ковалентная)",
        solubility: {
            status: "M",
            value: 0.61,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "⚪ БЕЛЫЙ",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: { decomposition: false, meltingPoint: "236°C" },
        applications: ["Аналитическая химия", "Фотография (исторически)"],
        safety: {
            toxicity: "⚠️ ОЧЕНЬ ТОКСИЧЕН",
            hazardClass: "Соли ртути крайне опасны!"
        }
    },

    "Hg2+-Hg2+-Br-": {
        name: "Бромид ртути(I)",
        formula: "Hg₂Br₂",
        molarMass: 560.99,
        oxidationStates: { "Hg": +1, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "N",
            value: 0.000004,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 6e-23
        },
        appearance: {
            precipitateColor: "⚪ БЕЛЫЙ",
            crystalColor: "Белый/желтоватый",
            solutionColor: "—"
        },
        stability: {
            decomposition: true,
            lightSensitivity: "Разлагается на свету"
        },
        applications: ["Аналитическая химия"],
        safety: { toxicity: "⚠️ ТОКСИЧЕН" }
    },

    "Pb2+-Br-": {
        name: "Бромид свинца(II)",
        formula: "PbBr₂",
        molarMass: 367.01,
        oxidationStates: { "Pb": +2, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "M",
            value: 0.84,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 6.6e-6,
            temperatureDependence: "Значительно возрастает при нагревании"
        },
        appearance: {
            precipitateColor: "⚪ БЕЛЫЙ",
            crystalColor: "Белый",
            solutionColor: "—"
        },
        stability: { decomposition: false, meltingPoint: "371°C" },
        applications: ["Фотодетекторы", "Перовскитные солнечные батареи"],
        safety: {
            toxicity: "⚠️ ТОКСИЧЕН (свинец)",
            hazardClass: "Канцероген"
        }
    },

    "Cu2+-Br-": {
        name: "Бромид меди(II)",
        formula: "CuBr₂",
        molarMass: 223.35,
        oxidationStates: { "Cu": +2, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: "хорошо растворим"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Чёрный (безводный)",
            solutionColor: "🟤 Коричневый / 🟢 зелёный"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "При нагревании: 2CuBr₂ → 2CuBr + Br₂"
        },
        applications: ["Органический синтез (бромирование)", "Фотография"],
        safety: { toxicity: "Токсичен" }
    },

    "Fe2+-Br-": {
        name: "Бромид железа(II)",
        formula: "FeBr₂",
        molarMass: 215.65,
        oxidationStates: { "Fe": +2, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: "хорошо растворим"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Жёлто-коричневый",
            solutionColor: "Зеленоватый"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Окисляется на воздухе"
        },
        applications: ["Органический синтез", "Катализатор"],
        safety: { toxicity: "Умеренно токсичен" }
    },

    "Fe3+-Br-": {
        name: "Бромид железа(III)",
        formula: "FeBr₃",
        molarMass: 295.56,
        oxidationStates: { "Fe": +3, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: "хорошо растворим"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Красно-коричневый/тёмно-красный",
            solutionColor: "Красно-коричневый"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "Менее устойчив, чем FeCl₃; разлагается при нагревании"
        },
        applications: ["Катализатор бромирования (реакция Фриделя-Крафтса)", "Органический синтез"],
        safety: { toxicity: "Токсичен, едкий" }
    },

    "Al3+-Br-": {
        name: "Бромид алюминия",
        formula: "AlBr₃",
        molarMass: 266.69,
        oxidationStates: { "Al": +3, "Br": -1 },
        compoundType: "Средняя соль (сильная кислота Льюиса)",
        solubility: {
            status: "R",
            value: "реагирует с водой!",
            note: "Бурно гидролизуется с выделением HBr"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый/желтоватый (димер Al₂Br₆)",
            solutionColor: "—"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Дымит на воздухе (гидролиз)",
            meltingPoint: "97.5°C"
        },
        applications: ["Катализатор Фриделя-Крафтса (алкилирование, бромирование)", "Органический синтез"],
        safety: { toxicity: "Едкий, коррозионный" }
    },

    "Cr3+-Br-": {
        name: "Бромид хрома(III)",
        formula: "CrBr₃",
        molarMass: 291.71,
        oxidationStates: { "Cr": +3, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: "растворим"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Тёмно-зелёный/чёрный",
            solutionColor: "Зелёный"
        },
        stability: { decomposition: false },
        applications: ["Катализатор", "Получение хромовых соединений"],
        safety: { toxicity: "Умеренно токсичен" }
    },

    "Mn2+-Br-": {
        name: "Бромид марганца(II)",
        formula: "MnBr₂",
        molarMass: 214.75,
        oxidationStates: { "Mn": +2, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: "хорошо растворим"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Розовый",
            solutionColor: "Бледно-розовый"
        },
        stability: { decomposition: false },
        applications: ["Катализатор", "Органический синтез"],
        safety: { toxicity: "Умеренно токсичен" }
    },

    "Ni2+-Br-": {
        name: "Бромид никеля(II)",
        formula: "NiBr₂",
        molarMass: 218.50,
        oxidationStates: { "Ni": +2, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: "хорошо растворим"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Жёлтый (безводный)",
            hydrateColor: "🟢 Зелёный (гидрат)",
            solutionColor: "🟢 Зелёный"
        },
        stability: { decomposition: false },
        applications: ["Катализатор", "Органический синтез"],
        safety: {
            toxicity: "⚠️ ТОКСИЧЕН, КАНЦЕРОГЕН",
            hazardClass: "Соединения никеля канцерогенны"
        }
    },

    "Co2+-Br-": {
        name: "Бромид кобальта(II)",
        formula: "CoBr₂",
        molarMass: 218.74,
        oxidationStates: { "Co": +2, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: "хорошо растворим"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "🟢 Зелёный (безводный)",
            hydrateColor: "🔴 Красно-фиолетовый (гидрат)",
            solutionColor: "🔴 Красный / 🔵 синий (конц.)"
        },
        stability: { decomposition: false },
        applications: ["Катализатор", "Индикатор влажности"],
        safety: { toxicity: "⚠️ ТОКСИЧЕН" }
    },

    "Sn2+-Br-": {
        name: "Бромид олова(II)",
        formula: "SnBr₂",
        molarMass: 278.52,
        oxidationStates: { "Sn": +2, "Br": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: "хорошо растворим"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Жёлтый",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Окисляется на воздухе"
        },
        applications: ["Восстановитель", "Органический синтез"],
        safety: { toxicity: "Умеренно токсичен" }
    },

    // =============================================
    // ЧАСТЬ V. ИОДИДЫ (I⁻)
    // =============================================

    "H+-I-": {
        name: "Иодоводород (Иодистоводородная кислота)",
        formula: "HI",
        molarMass: 127.91,
        oxidationStates: { "H": +1, "I": -1 },
        compoundType: "САМАЯ СИЛЬНАЯ галогеноводородная кислота (pKa ≈ −10)",
        solubility: {
            status: "R",
            value: "∞ (неограниченно смешивается)",
            note: "Азеотроп: 57% HI, Т.кип. = 127°C"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Бесцветный газ (желтеет на свету)",
            solutionColor: "Бесцветный → жёлтый (окисление)",
            meltingPoint: "-51°C",
            boilingPoint: "-35°C"
        },
        stability: {
            decomposition: true,
            lightSensitivity: "Разлагается на свету с выделением I₂",
            characteristicReactions: [
                "2HI →(свет) H₂ + I₂",
                "HI + AgNO₃ → AgI↓ + HNO₃ (жёлтый осадок)"
            ]
        },
        applications: ["Органический синтез", "Восстановитель", "Получение иодидов"],
        safety: {
            toxicity: "Едкий, токсичен",
            hazardClass: "Вызывает ожоги. Раздражает дыхательные пути"
        },
        additionalInfo: {
            interestingFacts: ["HI — сильный восстановитель (I⁻ легко окисляется до I₂)"]
        }
    },

    "NH4+-I-": {
        name: "Иодид аммония",
        formula: "NH₄I",
        molarMass: 144.94,
        oxidationStates: { "N": -3, "H": +1, "I": -1 },
        compoundType: "Кислая соль",
        solubility: {
            status: "R",
            value: 177,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый (желтеет на свету)",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "При нагревании возгоняется: NH₄I ⇌ NH₃ + HI",
            lightSensitivity: "Желтеет на свету (выделение I₂)"
        },
        applications: ["Фотография", "Фармацевтика", "Йодные добавки"],
        safety: { toxicity: "Умеренно токсичен" }
    },

    "Li+-I-": {
        name: "Иодид лития",
        formula: "LiI",
        molarMass: 133.85,
        oxidationStates: { "Li": +1, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 165,
            unit: "г/100 мл",
            temperature: 20,
            note: "Один из САМЫХ растворимых иодидов!"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Очень гигроскопичен, желтеет на воздухе"
        },
        applications: [
            "Твердотельные электролиты (литий-иодные батареи)",
            "Органический синтез",
            "Осушитель"
        ],
        safety: { toxicity: "Умеренно токсичен" }
    },

    "K+-I-": {
        name: "Иодид калия",
        formula: "KI",
        molarMass: 166.00,
        oxidationStates: { "K": +1, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 148,
            unit: "г/100 мл",
            temperature: 20,
            temperatureDependence: "240 г/100 мл в горячей воде"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый/бесцветный",
            solutionColor: "Бесцветный",
            crystalSystem: "Кубическая (NaCl-тип)"
        },
        stability: {
            decomposition: false,
            lightSensitivity: "Желтеет на свету",
            meltingPoint: "681°C"
        },
        applications: [
            "⚠️ ЗАЩИТА ЩИТОВИДНОЙ ЖЕЛЕЗЫ при радиационных авариях (препарат ВОЗ!)",
            "Йодирование поваренной соли",
            "Лечение гипертиреоза",
            "Отхаркивающее средство",
            "Фотография",
            "Аналитическая химия (раствор Люголя)"
        ],
        safety: {
            toxicity: "Малотоксичен",
            ldso: "2500 мг/кг (крысы)",
            note: "При передозировке — йодизм"
        },
        additionalInfo: {
            interestingFacts: [
                "Основное лекарство для защиты от радиоактивного йода (¹³¹I)",
                "Входит в раствор Люголя (KI + I₂)",
                "Растворяет йод: I₂ + I⁻ → I₃⁻ (трииодид)"
            ]
        }
    },

    "Na+-I-": {
        name: "Иодид натрия",
        formula: "NaI",
        molarMass: 149.89,
        oxidationStates: { "Na": +1, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 179.3,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Гигроскопичен, желтеет (окисление I⁻)",
            meltingPoint: "661°C"
        },
        applications: [
            "Сцинтилляционные детекторы NaI(Tl) — обнаружение γ-излучения",
            "Йодные добавки",
            "Фотография",
            "Органический синтез"
        ],
        safety: { toxicity: "Малотоксичен" },
        additionalInfo: {
            interestingFacts: ["NaI(Tl) — один из лучших сцинтилляторов для γ-спектрометрии"]
        }
    },

    "Rb+-I-": {
        name: "Иодид рубидия",
        formula: "RbI",
        molarMass: 212.37,
        oxidationStates: { "Rb": +1, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 152,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: { decomposition: false },
        applications: ["ИК-оптика", "Научные исследования"],
        safety: { toxicity: "Малотоксичен" }
    },

    "Cs+-I-": {
        name: "Иодид цезия",
        formula: "CsI",
        molarMass: 259.81,
        oxidationStates: { "Cs": +1, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 44,
            unit: "г/100 мл",
            temperature: 20,
            note: "Менее растворим, чем другие иодиды щелочных металлов"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный",
            crystalSystem: "Кубическая (CsCl-тип)"
        },
        stability: { decomposition: false, meltingPoint: "621°C" },
        applications: [
            "Сцинтилляционные детекторы CsI(Tl), CsI(Na)",
            "ИК-оптика (прозрачен до 60 мкм!)",
            "Рентгеновские детекторы"
        ],
        safety: { toxicity: "Малотоксичен" }
    },

    "Ag+-I-": {
        name: "Иодид серебра",
        formula: "AgI",
        molarMass: 234.77,
        oxidationStates: { "Ag": +1, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "N",
            value: 0.00003,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 8.3e-17,
            note: "⚠️ САМЫЙ НЕРАСТВОРИМЫЙ галогенид серебра! НЕ растворяется в NH₃!"
        },
        appearance: {
            precipitateColor: "🟡 ЯРКО-ЖЁЛТЫЙ",
            crystalColor: "Жёлтый",
            solutionColor: "—",
            mineralName: "Иодаргирит"
        },
        stability: {
            decomposition: false,
            lightSensitivity: "Темнеет на свету (медленнее, чем AgBr)",
            characteristicReactions: [
                "Ag⁺ + I⁻ → AgI↓ (ярко-жёлтый осадок)",
                "AgI НЕ растворяется в NH₃ (в отличие от AgCl и AgBr!)"
            ],
            analyticalUse: "КАЧЕСТВЕННАЯ РЕАКЦИЯ на I⁻: ярко-жёлтый осадок, НЕ растворим в NH₃"
        },
        applications: [
            "☁️ ЗАСЕВ ОБЛАКОВ для вызывания дождя (~11 000 кг/год мировое потребление!)",
            "Антисептические повязки",
            "Фотография"
        ],
        safety: { toxicity: "Малотоксичен (нерастворим)" },
        additionalInfo: {
            interestingFacts: [
                "β-AgI структура подобна льду → идеален для нуклеации кристаллов льда",
                "Используется для искусственного вызывания осадков с 1940-х годов",
                "Порядок растворимости: AgF >> AgCl > AgBr >> AgI"
            ]
        }
    },

    "Mg2+-I-": {
        name: "Иодид магния",
        formula: "MgI₂",
        molarMass: 278.11,
        oxidationStates: { "Mg": +2, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 148,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Гигроскопичен"
        },
        applications: ["Органический синтез", "Реактив Гриньяра"],
        safety: { toxicity: "Малотоксичен" }
    },

    "Ca2+-I-": {
        name: "Иодид кальция",
        formula: "CaI₂",
        molarMass: 293.89,
        oxidationStates: { "Ca": +2, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 209,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый/желтоватый",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Гигроскопичен, желтеет"
        },
        applications: ["Фотография", "Фармацевтика"],
        safety: { toxicity: "Малотоксичен" }
    },

    "Sr2+-I-": {
        name: "Иодид стронция",
        formula: "SrI₂",
        molarMass: 341.43,
        oxidationStates: { "Sr": +2, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 178,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: { decomposition: false },
        applications: ["Сцинтилляционные детекторы SrI₂(Eu)", "Фармацевтика"],
        safety: { toxicity: "Умеренно токсичен" }
    },

    "Ba2+-I-": {
        name: "Иодид бария",
        formula: "BaI₂",
        molarMass: 391.14,
        oxidationStates: { "Ba": +2, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 221,
            unit: "г/100 мл",
            temperature: 20
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: { decomposition: false, meltingPoint: "711°C" },
        applications: ["Получение других иодидов", "Химические реактивы"],
        safety: {
            toxicity: "⚠️ ТОКСИЧЕН",
            hazardClass: "Растворимые соли бария ядовиты!"
        }
    },

    "Zn2+-I-": {
        name: "Иодид цинка",
        formula: "ZnI₂",
        molarMass: 319.22,
        oxidationStates: { "Zn": +2, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: 450,
            unit: "г/100 мл",
            temperature: 20,
            note: "Очень хорошо растворим!"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый",
            solutionColor: "Бесцветный"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Гигроскопичен"
        },
        applications: ["Рентгеноконтрастное вещество (концентрированные растворы)", "Органический синтез"],
        safety: { toxicity: "Токсичен" }
    },

    "Hg2+-I-": {
        name: "Иодид ртути(II)",
        formula: "HgI₂",
        molarMass: 454.40,
        oxidationStates: { "Hg": +2, "I": -1 },
        compoundType: "Средняя соль (ковалентная)",
        solubility: {
            status: "N",
            value: 0.006,
            unit: "г/100 мл",
            temperature: 20,
            note: "Растворим в избытке KI: HgI₂ + 2KI → K₂[HgI₄]"
        },
        appearance: {
            precipitateColor: "🔴 ЯРКО-КРАСНЫЙ (α-форма)",
            crystalColor: "КРАСНЫЙ (α) ↔ ЖЁЛТЫЙ (β)",
            solutionColor: "—"
        },
        stability: {
            decomposition: false,
            thermochromism: "⚠️ ТЕРМОХРОМНЫЙ! Красный ↔ Жёлтый при 127°C (обратимо!)",
            characteristicReactions: [
                "HgI₂ + 2KI → K₂[HgI₄] (тетраиодомеркурат — реактив Несслера)",
                "Реактив Несслера + NH₃ → жёлто-коричневый осадок (качественная реакция на NH₃)"
            ]
        },
        applications: [
            "Реактив Несслера (обнаружение аммиака)",
            "Полупроводники",
            "Детекторы γ-излучения"
        ],
        safety: {
            toxicity: "⚠️ ОЧЕНЬ ТОКСИЧЕН",
            hazardClass: "Соли ртути крайне опасны!"
        },
        additionalInfo: {
            interestingFacts: [
                "Классический пример термохромизма — демонстрационный эксперимент",
                "α-HgI₂ (красный, тетрагональный) ↔ β-HgI₂ (жёлтый, орторомбический)"
            ]
        }
    },

    "Hg2+-Hg2+-I-": {
        name: "Иодид ртути(I)",
        formula: "Hg₂I₂",
        molarMass: 654.99,
        oxidationStates: { "Hg": +1, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "N",
            value: "практически не растворим",
            ksp: 5.2e-29,
            note: "Один из самых нерастворимых иодидов!"
        },
        appearance: {
            precipitateColor: "🟡 ЖЁЛТО-ЗЕЛЁНЫЙ",
            crystalColor: "Жёлто-зелёный/жёлтый",
            solutionColor: "—"
        },
        stability: {
            decomposition: true,
            lightSensitivity: "Разлагается на свету",
            characteristicReactions: [
                "Hg₂I₂ →(свет) Hg + HgI₂"
            ]
        },
        applications: ["Аналитическая химия"],
        safety: { toxicity: "⚠️ ТОКСИЧЕН" }
    },

    "Pb2+-I-": {
        name: "Иодид свинца(II) (ЗОЛОТОЙ ДОЖДЬ)",
        formula: "PbI₂",
        molarMass: 461.01,
        oxidationStates: { "Pb": +2, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "M",
            value: 0.076,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 7.9e-9,
            temperatureDependence: "0.41 г/100 мл при 100°C — значительно возрастает!"
        },
        appearance: {
            precipitateColor: "🟡✨ ЗОЛОТИСТО-ЖЁЛТЫЕ КРИСТАЛЛЫ (очень красиво!)",
            crystalColor: "Ярко-жёлтый/золотистый → оранжевый при нагревании",
            solutionColor: "—"
        },
        stability: {
            decomposition: false,
            meltingPoint: "402°C",
            characteristicReactions: [
                "Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃ (ЗОЛОТОЙ ДОЖДЬ — эффектный эксперимент!)"
            ],
            analyticalUse: "Демонстрационный эксперимент «Золотой дождь» — кристаллизация из горячего раствора"
        },
        applications: [
            "☀️ ПЕРОВСКИТНЫЕ СОЛНЕЧНЫЕ БАТАРЕИ (CH₃NH₃PbI₃ — революция в фотовольтаике!)",
            "Детекторы рентгеновского и γ-излучения",
            "Демонстрационные эксперименты",
            "Пигмент (исторически)"
        ],
        safety: {
            toxicity: "⚠️ ТОКСИЧЕН (свинец)",
            hazardClass: "Канцероген группы 2A IARC"
        },
        additionalInfo: {
            interestingFacts: [
                "Эксперимент «Золотой дождь»: горячий раствор при охлаждении даёт красивые золотые чешуйки",
                "Перовскит CH₃NH₃PbI₃ достиг КПД >25% в солнечных батареях",
                "Одно из самых красивых неорганических соединений!"
            ]
        }
    },

    "Cu+-I-": {
        name: "Иодид меди(I)",
        formula: "CuI",
        molarMass: 190.45,
        oxidationStates: { "Cu": +1, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "N",
            value: 0.00042,
            unit: "г/100 мл",
            temperature: 20,
            ksp: 1.27e-12
        },
        appearance: {
            precipitateColor: "⚪ БЕЛЫЙ",
            crystalColor: "Белый/бежевый",
            solutionColor: "—"
        },
        stability: {
            decomposition: false,
            lightSensitivity: "Желтеет на свету",
            characteristicReactions: [
                "2Cu²⁺ + 4I⁻ → 2CuI↓ + I₂ (Cu²⁺ окисляет I⁻!)",
                "CuI₂ НЕ СУЩЕСТВУЕТ — Cu²⁺ восстанавливается до Cu⁺"
            ],
            analyticalUse: "Реакция используется для иодометрического определения Cu²⁺"
        },
        applications: [
            "Катализатор органического синтеза (реакции Ульмана)",
            "Засев облаков (вместе с AgI)",
            "Термостабильные электроды"
        ],
        safety: { toxicity: "Умеренно токсичен" },
        additionalInfo: {
            interestingFacts: [
                "CuI₂ термодинамически нестабилен — Cu²⁺ окисляет I⁻ до I₂",
                "Используется для количественного определения меди иодометрическим методом"
            ]
        }
    },

    "Fe2+-I-": {
        name: "Иодид железа(II)",
        formula: "FeI₂",
        molarMass: 309.65,
        oxidationStates: { "Fe": +2, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: "хорошо растворим"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Серо-фиолетовый/чёрный",
            solutionColor: "Зеленоватый"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Окисляется на воздухе"
        },
        applications: ["Катализатор", "Органический синтез"],
        safety: { toxicity: "Умеренно токсичен" }
    },

    "Fe3+-I-": {
        name: "Иодид железа(III)",
        formula: "FeI₃",
        molarMass: 436.56,
        oxidationStates: { "Fe": +3, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "D",
            note: "⚠️ ТЕРМОДИНАМИЧЕСКИ НЕСТАБИЛЕН — разлагается!"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Чёрный (если получен)",
            solutionColor: "—"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂ (Fe³⁺ окисляет I⁻!)",
            characteristicReactions: [
                "FeI₃ → FeI₂ + ½I₂ (мгновенно)"
            ]
        },
        applications: ["Не применяется — слишком нестабилен"],
        safety: { toxicity: "—" },
        additionalInfo: {
            interestingFacts: [
                "FeI₃ НЕ СУЩЕСТВУЕТ как стабильное соединение!",
                "Причина: E°(Fe³⁺/Fe²⁺) = +0.77 В > E°(I₂/I⁻) = +0.54 В",
                "Аналогичная ситуация с CuI₂"
            ]
        }
    },

    "Al3+-I-": {
        name: "Иодид алюминия",
        formula: "AlI₃",
        molarMass: 407.70,
        oxidationStates: { "Al": +3, "I": -1 },
        compoundType: "Средняя соль (сильная кислота Льюиса)",
        solubility: {
            status: "R",
            note: "Бурно реагирует с водой (гидролиз)!"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Белый/желтоватый (димер Al₂I₆)",
            solutionColor: "—"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Дымит на воздухе (гидролиз)",
            meltingPoint: "188°C"
        },
        applications: ["Катализатор Фриделя-Крафтса", "Органический синтез"],
        safety: { toxicity: "Едкий, коррозионный" }
    },

    "Cr3+-I-": {
        name: "Иодид хрома(III)",
        formula: "CrI₃",
        molarMass: 432.71,
        oxidationStates: { "Cr": +3, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "D",
            note: "Разлагается в воде"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Чёрный",
            solutionColor: "—"
        },
        stability: {
            decomposition: true,
            decompositionConditions: "Гидролизуется в воде"
        },
        applications: ["Специальные применения", "Магнитные материалы"],
        safety: { toxicity: "Умеренно токсичен" }
    },

    "Mn2+-I-": {
        name: "Иодид марганца(II)",
        formula: "MnI₂",
        molarMass: 308.75,
        oxidationStates: { "Mn": +2, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: "хорошо растворим"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Розовый/белый",
            solutionColor: "Бледно-розовый"
        },
        stability: { decomposition: false },
        applications: ["Катализатор", "Органический синтез"],
        safety: { toxicity: "Умеренно токсичен" }
    },

    "Ni2+-I-": {
        name: "Иодид никеля(II)",
        formula: "NiI₂",
        molarMass: 312.50,
        oxidationStates: { "Ni": +2, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: "хорошо растворим"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Чёрный (безводный)",
            hydrateColor: "🟢 Зелёный/голубовато-зелёный (гидрат)",
            solutionColor: "🟢 Зелёный"
        },
        stability: { decomposition: false },
        applications: ["Катализатор", "Органический синтез"],
        safety: {
            toxicity: "⚠️ ТОКСИЧЕН, КАНЦЕРОГЕН",
            hazardClass: "Соединения никеля канцерогенны"
        }
    },

    "Co2+-I-": {
        name: "Иодид кобальта(II)",
        formula: "CoI₂",
        molarMass: 312.74,
        oxidationStates: { "Co": +2, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "R",
            value: "хорошо растворим"
        },
        appearance: {
            precipitateColor: "—",
            crystalColor: "Чёрный (α-форма) / Жёлтый (β-форма)",
            hydrateColor: "🔴 Красный (гидрат)",
            solutionColor: "🔴 Розово-красный"
        },
        stability: { decomposition: false },
        applications: ["Катализатор", "Индикатор влажности"],
        safety: { toxicity: "⚠️ ТОКСИЧЕН" }
    },

    "Sn2+-I-": {
        name: "Иодид олова(II)",
        formula: "SnI₂",
        molarMass: 372.52,
        oxidationStates: { "Sn": +2, "I": -1 },
        compoundType: "Средняя соль",
        solubility: {
            status: "M",
            value: "слаборастворим",
            note: "Растворим в концентрированной HI"
        },
        appearance: {
            precipitateColor: "🟠 КРАСНО-ОРАНЖЕВЫЙ",
            crystalColor: "Красно-оранжевый/жёлтый",
            solutionColor: "—"
        },
        stability: {
            decomposition: false,
            airSensitivity: "Окисляется на воздухе"
        },
        applications: [
            "Перовскитные солнечные батареи (CsSnI₃ — безсвинцовая альтернатива!)",
            "Органический синтез"
        ],
        safety: { toxicity: "Умеренно токсичен" },
        additionalInfo: {
            interestingFacts: [
                "CsSnI₃ — перспективный безсвинцовый перовскит для солнечных батарей"
            ]
        }
    },
    "Ba2+-SO42-": {
        // 1. ХИМИЧЕСКАЯ ИНФОРМАЦИЯ
        name: "Сульфат бария",
        formula: "BaSO₄",
        molarMass: 233.38, // г/моль
        oxidationStates: {
            "Ba": +2,
            "S": +6,
            "O": -2
        },
        compoundType: "Средняя соль",

        // 2. РАСТВОРИМОСТЬ — ТОЧНЫЕ ДАННЫЕ
        solubility: {
            status: "N", // Нерастворим
            value: 0.0002448, // г/100 мл H₂O при 20°C
            unit: "г/100 мл",
            temperature: 20, // °C
            ksp: 1.1e-10, // Константа растворимости
            temperatureDependence: "Растворимость практически не зависит от температуры",
            // Таблица растворимости при разных температурах (опционально)
            solubilityTable: [
                { temp: 0, value: 0.000115 },
                { temp: 20, value: 0.0002448 },
                { temp: 100, value: 0.000413 }
            ]
        },

        // 3. ЦВЕТ И ВНЕШНИЙ ВИД
        appearance: {
            precipitateColor: "Белый",
            crystalColor: "Бесцветный / белый",
            solutionColor: "—", // Не образует раствор
            crystalSystem: "Ромбическая",
            opticalProperties: "Непрозрачный тяжёлый порошок",
            realLifeExample: "Баритовая каша для рентгена желудка"
        },

        // 4. СТАБИЛЬНОСТЬ И РЕАКЦИОННАЯ СПОСОБНОСТЬ
        stability: {
            decomposition: false,
            decompositionConditions: null,
            airSensitivity: "Стабилен на воздухе",
            lightSensitivity: "Не чувствителен к свету",
            characteristicReactions: [
                "Не растворяется даже в концентрированных кислотах (HCl, HNO₃)",
                "Не реагирует со щелочами",
                "Не восстанавливается углеродом при обычных условиях"
            ],
            analyticalUse: "Качественная реакция на Ba²⁺ и SO₄²⁻ (белый осадок)"
        },

        // 5. ПРАКТИЧЕСКОЕ ПРИМЕНЕНИЕ И БЕЗОПАСНОСТЬ
        applications: [
            "Рентгеноконтрастное вещество в медицине (баритовая каша)",
            "Белый пигмент (литопон, баритовые белила)",
            "Утяжелитель буровых растворов в нефтедобыче",
            "Наполнитель в бумаге, пластмассах, резине",
            "Защита от рентгеновского и гамма-излучения"
        ],

        safety: {
            toxicity: "Нетоксичен (в отличие от растворимых солей бария)",
            ldso: null, // Для нерастворимого вещества не критично
            hazardClass: "Безопасен при проглатывании (не всасывается в ЖКТ)",
            precautions: "Избегать вдыхания пыли",
            environmental: "Экологически безопасен, встречается в природе (минерал барит)"
        },

        // 6. ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ
        additionalInfo: {
            mineralName: "Барит (BaSO₄ в природе)",
            historicalFacts: [
                "Открыт в 1774 году Карлом Шееле",
                "Название от греч. βαρύς (barys) — тяжёлый (плотность 4.5 г/см³)"
            ],
            interestingFacts: [
                "Самый тяжёлый из распространённых нерастворимых сульфатов",
                "Используется в медицине с 1910-х годов",
                "Барит составляет ~0.05% массы земной коры"
            ]
        },

        // 7. ИСТОЧНИКИ ДАННЫХ
        sources: [
            "CRC Handbook of Chemistry and Physics (102nd Edition)",
            "NIST Chemistry WebBook",
            "Справочник химика (Никольский Б.П.)"
        ]
    },

    // Пример второго вещества (для демонстрации)
    "Ag+-Cl-": {
        name: "Хлорид серебра",
        formula: "AgCl",
        molarMass: 143.32,
        oxidationStates: {
            "Ag": +1,
            "Cl": -1
        },
        compoundType: "Средняя соль",

        solubility: {
            status: "N",
            value: 0.00019, // г/100 мл при 20°C
            unit: "г/100 мл",
            temperature: 20,
            ksp: 1.77e-10,
            temperatureDependence: "Растворимость слабо увеличивается с температурой",
            solubilityTable: [
                { temp: 0, value: 0.000089 },
                { temp: 25, value: 0.00019 },
                { temp: 100, value: 0.00215 }
            ]
        },

        appearance: {
            precipitateColor: "Белый творожистый",
            crystalColor: "Белый / бесцветный",
            solutionColor: "—",
            crystalSystem: "Кубическая (NaCl-типа)",
            opticalProperties: "Светочувствительный, темнеет на свету",
            realLifeExample: "Основа фотоплёнки и фотобумаги (до цифровой эры)"
        },

        stability: {
            decomposition: true,
            decompositionConditions: "Разлагается на свету: 2AgCl → 2Ag + Cl₂",
            airSensitivity: "Стабилен на воздухе в темноте",
            lightSensitivity: "Чувствителен к свету (фотохимическое разложение)",
            characteristicReactions: [
                "Растворяется в концентрированном NH₃: AgCl + 2NH₃ → [Ag(NH₃)₂]Cl",
                "Растворяется в растворе тиосульфата натрия",
                "Темнеет на свету с выделением металлического серебра"
            ],
            analyticalUse: "Качественная реакция на Cl⁻ и Ag⁺ (белый творожистый осадок)"
        },

        applications: [
            "Фотография (фотопленка, фотобумага)",
            "Серебряно-цинковые батарейки",
            "Антибактериальные покрытия",
            "Электроды сравнения (хлорсеребряный электрод)",
            "Производство зеркал и посеребрение"
        ],

        safety: {
            toxicity: "Малотоксичен (нерастворим)",
            ldso: ">5000 мг/кг (крысы, перорально)",
            hazardClass: "4 класс (малоопасные вещества)",
            precautions: "Избегать попадания в глаза",
            environmental: "Не накапливается в организме из-за низкой растворимости"
        },

        additionalInfo: {
            mineralName: "Кераргирит (роговое серебро)",
            historicalFacts: [
                "Использовался в фотографии с 1839 года (дагерротипия)",
                "Открыт в древности (встречается в природе)"
            ],
            interestingFacts: [
                "Фоточувствительность открыта Иоганном Шульце в 1727 году",
                "Основа аналоговой фотографии более 150 лет",
                "AgCl прозрачен для инфракрасного излучения (используется в ИК-оптике)"
            ]
        },

        sources: [
            "CRC Handbook of Chemistry and Physics",
            "NIST Chemistry WebBook",
            "Cotton F.A., Wilkinson G. Advanced Inorganic Chemistry"
        ]
    }
};

// Экспортируем для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = substancesData;
}
