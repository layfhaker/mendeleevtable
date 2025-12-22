// =========================================
// ТАБЛИЦА РАСТВОРИМОСТИ
// =========================================

// =========================================
// РЕАЛЬНЫЕ ЦВЕТА ВЕЩЕСТВ
// =========================================
let isColorMode = false;

const substanceColors = {
    // =============================================
    // БЕЛЫЕ ОСАДКИ (white)
    // =============================================
    // Галогениды
    "Ag+-Cl-": "white",           // AgCl - белый творожистый
    "Pb2+-Cl-": "white",          // PbCl₂ - белый
    "Pb2+-Br-": "white",          // PbBr₂ - белый
    "Hg2+-Cl-": "white",          // Hg₂Cl₂ - белый (каломель)

    // Сульфаты
    "Ba2+-SO42-": "white",        // BaSO₄ - белый (барит)
    "Pb2+-SO42-": "white",        // PbSO₄ - белый
    "Ca2+-SO42-": "white",        // CaSO₄ - белый (гипс)
    "Sr2+-SO42-": "white",        // SrSO₄ - белый
    "Ag+-SO42-": "white",         // Ag₂SO₄ - белый

    // Карбонаты
    "Ca2+-CO32-": "white",        // CaCO₃ - белый (мел, мрамор)
    "Ba2+-CO32-": "white",        // BaCO₃ - белый
    "Mg2+-CO32-": "white",        // MgCO₃ - белый
    "Sr2+-CO32-": "white",        // SrCO₃ - белый
    "Pb2+-CO32-": "white",        // PbCO₃ - белый
    "Zn2+-CO32-": "white",        // ZnCO₃ - белый

    // Фосфаты
    "Ca2+-PO43-": "white",        // Ca₃(PO₄)₂ - белый
    "Ba2+-PO43-": "white",        // Ba₃(PO₄)₂ - белый
    "Mg2+-PO43-": "white",        // Mg₃(PO₄)₂ - белый
    "Zn2+-PO43-": "white",        // Zn₃(PO₄)₂ - белый
    "Pb2+-PO43-": "white",        // Pb₃(PO₄)₂ - белый
    "Al3+-PO43-": "white",        // AlPO₄ - белый

    // Силикаты
    "Ca2+-SiO32-": "white",       // CaSiO₃ - белый
    "Ba2+-SiO32-": "white",       // BaSiO₃ - белый
    "Mg2+-SiO32-": "white",       // MgSiO₃ - белый
    "Zn2+-SiO32-": "white",       // ZnSiO₃ - белый

    // Сульфиты
    "Ca2+-SO32-": "white",        // CaSO₃ - белый
    "Ba2+-SO32-": "white",        // BaSO₃ - белый
    "Pb2+-SO32-": "white",        // PbSO₃ - белый

    // Гидроксиды белые
    "Al3+-OH-": "white",          // Al(OH)₃ - белый студенистый
    "Zn2+-OH-": "white",          // Zn(OH)₂ - белый
    "Mg2+-OH-": "white",          // Mg(OH)₂ - белый
    "Ca2+-OH-": "white",          // Ca(OH)₂ - белый (известь)
    "Ba2+-OH-": "white",          // Ba(OH)₂ - белый
    "Sn2+-OH-": "white",          // Sn(OH)₂ - белый

    // Сульфид цинка
    "Zn2+-S2-": "white",          // ZnS - белый

    // Фториды
    "Ca2+-F-": "white",           // CaF₂ - белый (флюорит)
    "Ba2+-F-": "white",           // BaF₂ - белый
    "Mg2+-F-": "white",           // MgF₂ - белый
    "Sr2+-F-": "white",           // SrF₂ - белый
    "Pb2+-F-": "white",           // PbF₂ - белый

    // =============================================
    // БЕСЦВЕТНЫЕ РАСТВОРЫ (colorless)
    // =============================================
    // Нитраты (все растворимы и бесцветны, кроме окрашенных катионов)
    "Na+-NO3-": "colorless",
    "K+-NO3-": "colorless",
    "Ca2+-NO3-": "colorless",
    "Ba2+-NO3-": "colorless",
    "Mg2+-NO3-": "colorless",
    "Zn2+-NO3-": "colorless",
    "Pb2+-NO3-": "colorless",
    "Al3+-NO3-": "colorless",
    "Ag+-NO3-": "colorless",

    // Хлориды растворимые
    "Na+-Cl-": "colorless",
    "K+-Cl-": "colorless",
    "Ca2+-Cl-": "colorless",
    "Ba2+-Cl-": "colorless",
    "Mg2+-Cl-": "colorless",
    "Zn2+-Cl-": "colorless",
    "Al3+-Cl-": "colorless",

    // Сульфаты растворимые
    "Na+-SO42-": "colorless",
    "K+-SO42-": "colorless",
    "Mg2+-SO42-": "colorless",
    "Zn2+-SO42-": "colorless",
    "Al3+-SO42-": "colorless",

    // Ацетаты
    "Na+-CH3COO-": "colorless",
    "K+-CH3COO-": "colorless",
    "Ca2+-CH3COO-": "colorless",
    "Ba2+-CH3COO-": "colorless",
    "Mg2+-CH3COO-": "colorless",
    "Zn2+-CH3COO-": "colorless",
    "Pb2+-CH3COO-": "colorless",
    "Al3+-CH3COO-": "colorless",

    // =============================================
    // ЖЁЛТЫЕ И ОРАНЖЕВЫЕ
    // =============================================
    "Ag+-Br-": "#fffacd",         // AgBr - бледно-жёлтый
    "Ag+-I-": "#ffd700",          // AgI - жёлтый
    "Pb2+-I-": "#ffd700",         // PbI₂ - золотисто-жёлтый ("золотой дождь")
    "Hg2+-I-": "#ff4500",         // HgI₂ - красный (алый)
    "Ag+-PO43-": "#ffff00",       // Ag₃PO₄ - жёлтый
    "Cd2+-S2-": "#ffa500",        // CdS - оранжево-жёлтый

    // Хроматы
    "Ba2+-CrO42-": "#ffff00",     // BaCrO₄ - жёлтый
    "Pb2+-CrO42-": "#ffa500",     // PbCrO₄ - оранжево-жёлтый
    "Sr2+-CrO42-": "#ffff00",     // SrCrO₄ - жёлтый
    "Ca2+-CrO42-": "#ffff00",     // CaCrO₄ - жёлтый
    "Ag+-CrO42-": "#8b0000",      // Ag₂CrO₄ - кирпично-красный

    // Дихроматы (оранжевые растворы/осадки)
    "K+-Cr2O72-": "#ff8c00",      // K₂Cr₂O₇ - оранжевый раствор
    "Na+-Cr2O72-": "#ff8c00",     // Na₂Cr₂O₇ - оранжевый раствор
    "NH4+-Cr2O72-": "#ff8c00",    // (NH₄)₂Cr₂O₇ - оранжевый раствор
    "Ag+-Cr2O72-": "#dc143c",     // Ag₂Cr₂O₇ - малорастворимый красный
    "Pb2+-Cr2O72-": "#ff4500",    // PbCr₂O₇ - малорастворимый оранжево-красный

    // Соли железа(III)
    "Fe3+-Cl-": "#daa520",        // FeCl₃ - жёлто-коричневый
    "Fe3+-SO42-": "#daa520",      // Fe₂(SO₄)₃ - желтоватый
    "Fe3+-NO3-": "#d2b48c",       // Fe(NO₃)₃ - бледно-жёлтый

    // =============================================
    // ГОЛУБЫЕ И СИНИЕ
    // =============================================
    "Cu2+-OH-": "#87ceeb",        // Cu(OH)₂ - голубой
    "Cu2+-SO42-": "#87ceeb",      // CuSO₄ - голубой
    "Cu2+-NO3-": "#87ceeb",       // Cu(NO₃)₂ - голубой
    "Cu2+-Cl-": "#48d1cc",        // CuCl₂ - сине-зелёный
    "Cu2+-CO32-": "#228b22",      // CuCO₃ - зелёный (малахит)

    // =============================================
    // ЗЕЛЁНЫЕ
    // =============================================
    "Fe2+-OH-": "#90ee90",        // Fe(OH)₂ - светло-зелёный (темнеет на воздухе)
    "Ni2+-OH-": "#90ee90",        // Ni(OH)₂ - светло-зелёный
    "Ni2+-SO42-": "#90ee90",      // NiSO₄ - зелёный
    "Ni2+-Cl-": "#90ee90",        // NiCl₂ - зелёный
    "Ni2+-NO3-": "#90ee90",       // Ni(NO₃)₂ - зелёный
    "Cr3+-OH-": "#7fffd4",        // Cr(OH)₃ - серо-зелёный
    "Cr3+-Cl-": "#228b22",        // CrCl₃·6H₂O - тёмно-зелёный (гидрат)

    // =============================================
    // БУРЫЕ И КОРИЧНЕВЫЕ
    // =============================================
    "Fe3+-OH-": "#8b4513",        // Fe(OH)₃ - бурый
    "Sn2+-S2-": "#8b4513",        // SnS - коричневый

    // =============================================
    // РОЗОВЫЕ
    // =============================================
    "Co2+-OH-": "#ff69b4",        // Co(OH)₂ - розовый
    "Co2+-Cl-": "#ff69b4",        // CoCl₂ - розовый
    "Co2+-NO3-": "#ff69b4",       // Co(NO₃)₂ - розовый
    "Co2+-SO42-": "#ff69b4",      // CoSO₄ - розовый
    "Mn2+-SO42-": "#ffb6c1",      // MnSO₄ - бледно-розовый

    // =============================================
    // ФИОЛЕТОВЫЕ
    // =============================================
    "K+-MnO4-": "#8b008b",        // KMnO₄ - тёмно-фиолетовый
    "Na+-MnO4-": "#8b008b",       // NaMnO₄ - тёмно-фиолетовый
    "Cr3+-SO42-": "#228b22",      // Cr₂(SO₄)₃ - зелёный (практический цвет)

    // =============================================
    // ЧЁРНЫЕ
    // =============================================
    "Ag+-S2-": "#000000",         // Ag₂S - чёрный
    "Pb2+-S2-": "#000000",        // PbS - чёрный (галенит)
    "Cu2+-S2-": "#000000",        // CuS - чёрный
    "Fe2+-S2-": "#000000",        // FeS - чёрный
    "Ni2+-S2-": "#000000",        // NiS - чёрный
    "Co2+-S2-": "#000000",        // CoS - чёрный
    "Hg2+-S2-": "#000000",        // HgS - чёрный (или красный киноварь)

    // =============================================
    // ДОПОЛНИТЕЛЬНЫЕ ЦВЕТНЫЕ СОЛИ
    // =============================================
    // Медь — голубые
    "Cu2+-CH3COO-": "#87ceeb",    // Cu(CH₃COO)₂ - голубой
    "Cu2+-PO43-": "#87ceeb",      // Cu₃(PO₄)₂ - голубой

    // Никель — зелёные
    "Ni2+-CO32-": "#90ee90",      // NiCO₃ - зелёный
    "Ni2+-PO43-": "#90ee90",      // Ni₃(PO₄)₂ - зелёный
    "Ni2+-CH3COO-": "#90ee90",    // Ni(CH₃COO)₂ - зелёный

    // Кобальт — розовые
    "Co2+-CO32-": "#ff69b4",      // CoCO₃ - розовый
    "Co2+-PO43-": "#ff69b4",      // Co₃(PO₄)₂ - розовый
    "Co2+-CH3COO-": "#ff69b4",    // Co(CH₃COO)₂ - розовый

    // Хром — зелёные (практический цвет)
    "Cr3+-NO3-": "#228b22",       // Cr(NO₃)₃ - зелёный (практический цвет)
    "Cr3+-CH3COO-": "#228b22",    // Cr(CH₃COO)₃ - зелёный

    // Железо(II) — бледно-зелёные
    "Fe2+-SO42-": "#98fb98",      // FeSO₄ - бледно-зелёный
    "Fe2+-Cl-": "#98fb98",        // FeCl₂ - бледно-зелёный
    "Fe2+-NO3-": "#98fb98",       // Fe(NO₃)₂ - бледно-зелёный
    "Fe2+-CO32-": "#778899",      // FeCO₃ - серо-зелёный

    // Марганец — бледно-розовые (только растворимые!)
    "Mn2+-Cl-": "#ffb6c1",        // MnCl₂ - бледно-розовый
    "Mn2+-NO3-": "#ffb6c1",       // Mn(NO₃)₂ - бледно-розовый
    "Mn2+-CH3COO-": "#ffb6c1",    // Mn(CH₃COO)₂ - бледно-розовый
};

// Нормализация формулы: "Ag⁺" → "Ag+", "SO₄²⁻" → "SO42-"
function normalizeFormula(formula) {
    return formula
        .replace(/⁺/g, '+')
        .replace(/⁻/g, '-')
        .replace(/²/g, '2')
        .replace(/³/g, '3')
        .replace(/⁴/g, '4')
        .replace(/₂/g, '2')
        .replace(/₃/g, '3')
        .replace(/₄/g, '4')
        .replace(/₅/g, '5');
}

// Определяем, тёмный ли цвет (для выбора цвета текста)
function isColorDark(hexColor) {
    if (!hexColor || hexColor.length < 7) return false;

    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Формула относительной яркости (luminance)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance < 0.5;
}

// Переключение режима цветов
function toggleColorMode() {
    isColorMode = !isColorMode;

    const btn = document.getElementById('color-mode-btn');
    btn.classList.toggle('active', isColorMode);

    // Перерисовываем таблицу
    renderSolubilityTable();

    // Обновляем фильтры в зависимости от режима
    updateFiltersForSolubility();
}

// Переключение панели рядов активности
function toggleActivitySeries() {
    const panel = document.getElementById('activity-series-panel');
    const btn = document.getElementById('activity-series-btn');

    if (panel && btn) {
        panel.classList.toggle('active');
        btn.classList.toggle('active');
    }
}

const solubilityData = {
    // 24 Катиона (Полный набор)
    cations: [
        { f: "H⁺", n: "Водород" },
        { f: "NH₄⁺", n: "Аммоний" },
        { f: "Li⁺", n: "Литий" },
        { f: "K⁺", n: "Калий" },
        { f: "Na⁺", n: "Натрий" },
        { f: "Rb⁺", n: "Рубидий" },
        { f: "Cs⁺", n: "Цезий" },
        { f: "Ag⁺", n: "Серебро" },
        { f: "Mg²⁺", n: "Магний" },
        { f: "Ca²⁺", n: "Кальций" },
        { f: "Sr²⁺", n: "Стронций" },
        { f: "Ba²⁺", n: "Барий" },
        { f: "Zn²⁺", n: "Цинк" },
        { f: "Hg²⁺", n: "Ртуть" },
        { f: "Pb²⁺", n: "Свинец" },
        { f: "Cu²⁺", n: "Медь" },
        { f: "Fe²⁺", n: "Железо(II)" },
        { f: "Fe³⁺", n: "Железо(III)" },
        { f: "Al³⁺", n: "Алюминий" },
        { f: "Cr³⁺", n: "Хром" },
        { f: "Mn²⁺", n: "Марганец" },
        { f: "Ni²⁺", n: "Никель" },
        { f: "Co²⁺", n: "Кобальт" },
        { f: "Sn²⁺", n: "Олово" }
    ],

    // 22 Анионов (расширено)
    anions: [
        { f: "OH⁻", n: "Гидроксид" },
        { f: "F⁻",  n: "Фторид" },
        { f: "Cl⁻", n: "Хлорид" },
        { f: "Br⁻", n: "Бромид" },
        { f: "I⁻",  n: "Иодид" },
        { f: "S²⁻", n: "Сульфид" },
        { f: "HS⁻", n: "Гидросульфид" },
        { f: "SO₃²⁻", n: "Сульфит" },
        { f: "SO₄²⁻", n: "Сульфат" },
        { f: "NO₃⁻", n: "Нитрат" },
        { f: "PO₄³⁻", n: "Фосфат" },
        { f: "CO₃²⁻", n: "Карбонат" },
        { f: "SiO₃²⁻", n: "Силикат" },
        { f: "CrO₄²⁻", n: "Хромат" },
        { f: "Cr₂O₇²⁻", n: "Дихромат" },
        { f: "AlO₂⁻", n: "Алюминат" },
        { f: "ZnO₂²⁻", n: "Цинкат" },
        { f: "PbO₂²⁻", n: "Плюмбат" },
        { f: "CrO₂⁻", n: "Хромит" },
        { f: "SnO₃²⁻", n: "Станнат" },
        { f: "CH₃COO⁻", n: "Ацетат" },
        { f: "MnO₄⁻", n: "Перманганат" }
    ],

    // ПРАВИЛА ПО УМОЛЧАНИЮ (по Лурье)
    defaults: {
        "OH-": "N",      // Гидроксиды нерастворимы
        "F-": "R",       // Фториды растворимы
        "Cl-": "R",      // Хлориды растворимы
        "Br-": "R",      // Бромиды растворимы
        "I-": "R",       // Йодиды растворимы
        "S2-": "N",      // Сульфиды нерастворимы
        "HS-": "R",      // Гидросульфиды растворимы
        "SO32-": "R",    // Сульфиты растворимы
        "SO42-": "R",    // Сульфаты растворимы
        "NO3-": "R",     // Нитраты все растворимы
        "PO43-": "N",    // Фосфаты нерастворимы
        "CO32-": "N",    // Карбонаты нерастворимы
        "SiO32-": "N",   // Силикаты нерастворимы
        "CrO42-": "R",   // Хроматы растворимы
        "Cr2O72-": "R",  // Дихроматы растворимы
        "AlO2-": "R",    // Алюминаты растворимы (в щелочах)
        "ZnO22-": "R",   // Цинкаты растворимы (в щелочах)
        "PbO22-": "R",   // Плюмбаты растворимы (в щелочах)
        "CrO2-": "R",    // Хромиты растворимы (в щелочах)
        "SnO32-": "R",   // Станнаты растворимы (в щелочах)
        "CH3COO-": "R",  // Ацетаты растворимы
        "MnO4-": "R"     // Перманганаты растворимы
    },

    // ИСКЛЮЧЕНИЯ (только отклонения от правил по умолчанию)
    // Источник: Лурье Ю.Ю. "Справочник по аналитической химии"
    exceptions: {
        // === ГИДРОКСИДЫ (по умолчанию N) ===
        "H+-OH-": "O",         // Не существует (вода)
        "NH4+-OH-": "R",       // Растворим
        "Li+-OH-": "R",        // Растворим
        "K+-OH-": "R",         // Растворим
        "Na+-OH-": "R",        // Растворим
        "Rb+-OH-": "R",        // Растворим
        "Cs+-OH-": "R",        // Растворим
        "Ca2+-OH-": "M",       // Малорастворим (известковая вода)
        "Sr2+-OH-": "M",       // Малорастворим
        "Ba2+-OH-": "R",       // РАСТВОРИМ (важно!)
        "Ag+-OH-": "D",        // Разлагается → Ag2O

        // === ФТОРИДЫ (по умолчанию R) ===
        "Mg2+-F-": "N",        // Нерастворим
        "Ca2+-F-": "N",        // Нерастворим (флюорит)
        "Sr2+-F-": "M",        // Малорастворим
        "Ba2+-F-": "M",        // Малорастворим
        "Pb2+-F-": "N",        // Нерастворим
        "Ag+-F-": "M",         // Малорастворим

        // === ХЛОРИДЫ (по умолчанию R) ===
        "Ag+-Cl-": "N",        // Нерастворим
        "Pb2+-Cl-": "M",       // Малорастворим
        "Hg2+-Cl-": "N",       // Hg2Cl2 нерастворим

        // === БРОМИДЫ (по умолчанию R) ===
        "Ag+-Br-": "N",        // Нерастворим
        "Pb2+-Br-": "M",       // Малорастворим
        "Hg2+-Br-": "N",       // Нерастворим

        // === ЙОДИДЫ (по умолчанию R) ===
        "Ag+-I-": "N",         // Нерастворим
        "Pb2+-I-": "N",        // Нерастворим (золотой дождь)
        "Hg2+-I-": "N",        // Нерастворим (красный HgI2)
        "Cu2+-I-": "D",        // Разлагается: 2Cu2+ + 4I- → 2CuI↓ + I2

        // === СУЛЬФИДЫ (по умолчанию N) ===
        "H+-S2-": "R",         // H2S растворим
        "NH4+-S2-": "R",       // Растворим
        "Li+-S2-": "R",        // Растворим
        "K+-S2-": "R",         // Растворим
        "Na+-S2-": "R",        // Растворим
        "Rb+-S2-": "R",        // Растворим
        "Cs+-S2-": "R",        // Растворим
        "Mg2+-S2-": "D",       // Гидролиз
        "Ca2+-S2-": "D",       // Гидролиз
        "Sr2+-S2-": "D",       // Гидролиз
        "Ba2+-S2-": "D",       // Гидролиз
        "Al3+-S2-": "D",       // Гидролиз
        "Cr3+-S2-": "D",       // Гидролиз
        "Fe3+-S2-": "D",       // Гидролиз

        // === ГИДРОСУЛЬФИДЫ (по умолчанию R) ===
        "Ag+-HS-": "N",        // Нерастворим
        "Hg2+-HS-": "N",       // Нерастворим
        "Pb2+-HS-": "N",       // Нерастворим
        "Cu2+-HS-": "N",       // Нерастворим
        "Fe3+-HS-": "D",       // Гидролиз
        "Al3+-HS-": "D",       // Гидролиз
        "Cr3+-HS-": "D",       // Гидролиз
        "Sn2+-HS-": "D",       // Гидролиз

        // === СУЛЬФИТЫ (по умолчанию R) ===
        "Ag+-SO32-": "M",      // Малорастворим
        "Mg2+-SO32-": "M",     // Малорастворим
        "Ca2+-SO32-": "M",     // Малорастворим
        "Sr2+-SO32-": "N",     // Нерастворим
        "Ba2+-SO32-": "N",     // Нерастворим
        "Pb2+-SO32-": "N",     // Нерастворим
        "Al3+-SO32-": "D",     // Гидролиз
        "Cr3+-SO32-": "D",     // Гидролиз
        "Fe3+-SO32-": "D",     // Гидролиз

        // === СУЛЬФАТЫ (по умолчанию R) ===
        "Ca2+-SO42-": "M",     // Малорастворим (гипс)
        "Sr2+-SO42-": "N",     // Нерастворим
        "Ba2+-SO42-": "N",     // Нерастворим (барит)
        "Pb2+-SO42-": "N",     // Нерастворим
        "Ag+-SO42-": "M",      // Малорастворим
        "Hg2+-SO42-": "M",     // Малорастворим

        // === ФОСФАТЫ (по умолчанию N) ===
        "H+-PO43-": "R",       // Растворим
        "NH4+-PO43-": "R",     // Растворим
        "Li+-PO43-": "R",      // Растворим
        "K+-PO43-": "R",       // Растворим
        "Na+-PO43-": "R",      // Растворим
        "Rb+-PO43-": "R",      // Растворим
        "Cs+-PO43-": "R",      // Растворим
        "Ag+-PO43-": "N",      // Нерастворим (жёлтый осадок)

        // === КАРБОНАТЫ (по умолчанию N) ===
        "H+-CO32-": "D",       // Разлагается (H2CO3 → CO2 + H2O)
        "NH4+-CO32-": "R",     // Растворим
        "Li+-CO32-": "R",      // Растворим
        "K+-CO32-": "R",       // Растворим
        "Na+-CO32-": "R",      // Растворим
        "Rb+-CO32-": "R",      // Растворим
        "Cs+-CO32-": "R",      // Растворим
        "Al3+-CO32-": "D",     // Гидролиз
        "Cr3+-CO32-": "D",     // Гидролиз
        "Fe3+-CO32-": "D",     // Гидролиз
        "Fe2+-CO32-": "N",     // Нерастворим (серо-зелёный осадок)

        // === СИЛИКАТЫ (по умолчанию N) ===
        "H+-SiO32-": "N",      // H2SiO3 нерастворим (гель кремниевой кислоты)
        "NH4+-SiO32-": "R",    // Растворим
        "Li+-SiO32-": "R",     // Растворим
        "K+-SiO32-": "R",      // Растворим (жидкое стекло)
        "Na+-SiO32-": "R",     // Растворим (жидкое стекло)
        "Rb+-SiO32-": "R",     // Растворим
        "Cs+-SiO32-": "R",     // Растворим
        "Al3+-SiO32-": "D",    // Гидролиз
        "Cr3+-SiO32-": "D",    // Гидролиз
        "Fe3+-SiO32-": "D",    // Гидролиз

        // === ХРОМАТЫ (по умолчанию R) ===
        "Ag+-CrO42-": "N",     // Нерастворим (кирпично-красный)
        "Pb2+-CrO42-": "N",    // Нерастворим (оранжево-жёлтый)
        "Ba2+-CrO42-": "N",    // Нерастворим (жёлтый)
        "Sr2+-CrO42-": "M",    // Малорастворим
        "Ca2+-CrO42-": "M",    // Малорастворим
        "Hg2+-CrO42-": "N",    // Нерастворим

        // === АЦЕТАТЫ (по умолчанию R) ===
        "Ag+-CH3COO-": "M",    // Малорастворим

        // === ПЕРМАНГАНАТЫ (все растворимы, исключений нет) ===

        // === ДИХРОМАТЫ (по умолчанию R) ===
        "Ag+-Cr2O72-": "M",    // Малорастворим (красный)
        "Pb2+-Cr2O72-": "M",   // Малорастворим (оранжевый)
        "Ba2+-Cr2O72-": "M",   // Малорастворим

        // === АЛЮМИНАТЫ (по умолчанию R — растворимы в щелочах) ===
        // Большинство катионов не образуют алюминаты, только щелочные металлы растворимы
        "H+-AlO2-": "D",       // Не существует (разложение)
        "Mg2+-AlO2-": "N",     // Нерастворим
        "Ca2+-AlO2-": "N",     // Нерастворим
        "Sr2+-AlO2-": "N",     // Нерастворим
        "Ba2+-AlO2-": "N",     // Нерастворим
        "Zn2+-AlO2-": "N",     // Нерастворим
        "Al3+-AlO2-": "D",     // Не существует
        "Fe2+-AlO2-": "N",     // Нерастворим
        "Fe3+-AlO2-": "N",     // Нерастворим
        "Cu2+-AlO2-": "N",     // Нерастворим
        "Ag+-AlO2-": "N",      // Нерастворим
        "Pb2+-AlO2-": "N",     // Нерастворим
        "Hg2+-AlO2-": "N",     // Нерастворим
        "Cr3+-AlO2-": "N",     // Нерастворим
        "Mn2+-AlO2-": "N",     // Нерастворим
        "Ni2+-AlO2-": "N",     // Нерастворим
        "Co2+-AlO2-": "N",     // Нерастворим
        "Sn2+-AlO2-": "N",     // Нерастворим

        // === ЦИНКАТЫ (по умолчанию R — растворимы в щелочах) ===
        "H+-ZnO22-": "D",      // Не существует (разложение)
        "Mg2+-ZnO22-": "N",    // Нерастворим
        "Ca2+-ZnO22-": "N",    // Нерастворим
        "Sr2+-ZnO22-": "N",    // Нерастворим
        "Ba2+-ZnO22-": "N",    // Нерастворим
        "Zn2+-ZnO22-": "D",    // Не существует
        "Al3+-ZnO22-": "N",    // Нерастворим
        "Fe2+-ZnO22-": "N",    // Нерастворим
        "Fe3+-ZnO22-": "N",    // Нерастворим
        "Cu2+-ZnO22-": "N",    // Нерастворим
        "Ag+-ZnO22-": "N",     // Нерастворим
        "Pb2+-ZnO22-": "N",    // Нерастворим
        "Hg2+-ZnO22-": "N",    // Нерастворим
        "Cr3+-ZnO22-": "N",    // Нерастворим
        "Mn2+-ZnO22-": "N",    // Нерастворим
        "Ni2+-ZnO22-": "N",    // Нерастворим
        "Co2+-ZnO22-": "N",    // Нерастворим
        "Sn2+-ZnO22-": "N",    // Нерастворим

        // === ПЛЮМБАТЫ (по умолчанию R — растворимы в щелочах) ===
        "H+-PbO22-": "D",      // Не существует (разложение)
        "Mg2+-PbO22-": "N",    // Нерастворим
        "Ca2+-PbO22-": "N",    // Нерастворим
        "Sr2+-PbO22-": "N",    // Нерастворим
        "Ba2+-PbO22-": "N",    // Нерастворим
        "Zn2+-PbO22-": "N",    // Нерастворим
        "Al3+-PbO22-": "N",    // Нерастворим
        "Fe2+-PbO22-": "N",    // Нерастворим
        "Fe3+-PbO22-": "N",    // Нерастворим
        "Cu2+-PbO22-": "N",    // Нерастворим
        "Ag+-PbO22-": "N",     // Нерастворим
        "Pb2+-PbO22-": "D",    // Не существует
        "Hg2+-PbO22-": "N",    // Нерастворим
        "Cr3+-PbO22-": "N",    // Нерастворим
        "Mn2+-PbO22-": "N",    // Нерастворим
        "Ni2+-PbO22-": "N",    // Нерастворим
        "Co2+-PbO22-": "N",    // Нерастворим
        "Sn2+-PbO22-": "N",    // Нерастворим

        // === ХРОМИТЫ (по умолчанию R — растворимы в щелочах) ===
        "H+-CrO2-": "D",       // Не существует (разложение)
        "Mg2+-CrO2-": "N",     // Нерастворим
        "Ca2+-CrO2-": "N",     // Нерастворим
        "Sr2+-CrO2-": "N",     // Нерастворим
        "Ba2+-CrO2-": "N",     // Нерастворим
        "Zn2+-CrO2-": "N",     // Нерастворим
        "Al3+-CrO2-": "N",     // Нерастворим
        "Fe2+-CrO2-": "N",     // Нерастворим
        "Fe3+-CrO2-": "N",     // Нерастворим
        "Cu2+-CrO2-": "N",     // Нерастворим
        "Ag+-CrO2-": "N",      // Нерастворим
        "Pb2+-CrO2-": "N",     // Нерастворим
        "Hg2+-CrO2-": "N",     // Нерастворим
        "Cr3+-CrO2-": "D",     // Не существует
        "Mn2+-CrO2-": "N",     // Нерастворим
        "Ni2+-CrO2-": "N",     // Нерастворим
        "Co2+-CrO2-": "N",     // Нерастворим
        "Sn2+-CrO2-": "N",     // Нерастворим

        // === СТАННАТЫ (по умолчанию R — растворимы в щелочах) ===
        "H+-SnO32-": "D",      // Не существует (разложение)
        "Mg2+-SnO32-": "N",    // Нерастворим
        "Ca2+-SnO32-": "N",    // Нерастворим
        "Sr2+-SnO32-": "N",    // Нерастворим
        "Ba2+-SnO32-": "N",    // Нерастворим
        "Zn2+-SnO32-": "N",    // Нерастворим
        "Al3+-SnO32-": "N",    // Нерастворим
        "Fe2+-SnO32-": "N",    // Нерастворим
        "Fe3+-SnO32-": "N",    // Нерастворим
        "Cu2+-SnO32-": "N",    // Нерастворим
        "Ag+-SnO32-": "N",     // Нерастворим
        "Pb2+-SnO32-": "N",    // Нерастворим
        "Hg2+-SnO32-": "N",    // Нерастворим
        "Cr3+-SnO32-": "N",    // Нерастворим
        "Mn2+-SnO32-": "N",    // Нерастворим
        "Ni2+-SnO32-": "N",    // Нерастворим
        "Co2+-SnO32-": "N",    // Нерастворим
        "Sn2+-SnO32-": "D"     // Не существует
    }
};

// Функция получения растворимости
function getSolubility(cationFormula, anionFormula) {
    // Нормализуем формулы для ключа
    const cationKey = normalizeFormula(cationFormula);
    const anionKey = normalizeFormula(anionFormula);
    const exceptionKey = `${cationKey}-${anionKey}`;

    // Сначала проверяем исключения
    if (solubilityData.exceptions[exceptionKey] !== undefined) {
        return solubilityData.exceptions[exceptionKey];
    }

    // Иначе возвращаем правило по умолчанию
    return solubilityData.defaults[anionKey] || "R";
}

// Функция отрисовки (Вызывать 1 раз при старте или открытии)
function renderSolubilityTable() {
    const table = document.getElementById('solubility-table');
    if (!table) return;
    table.innerHTML = '';

    // 1. HEADER (Катионы)
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Пустой угол (кнопка сброса выделения)
    const corner = document.createElement('th');
    corner.innerText = "×";
    corner.style.cursor = "pointer";
    corner.onclick = clearTableSelection;
    corner.title = "Сбросить выделение";
    headerRow.appendChild(corner);

    // Цикл по катионам (ЗАГОЛОВКИ)
    solubilityData.cations.forEach((cat, colIndex) => {
        const th = document.createElement('th');
        th.innerHTML = cat.f;
        th.title = cat.n;
        th.dataset.col = colIndex;
        th.onclick = () => highlightColumn(colIndex);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 2. BODY (Анионы + Данные)
    const tbody = document.createElement('tbody');

    solubilityData.anions.forEach((anion, rowIndex) => {
        const tr = document.createElement('tr');

        // Заголовок ряда (Анион)
        const th = document.createElement('th');
        th.innerHTML = `${anion.f}<br><span style="font-size:0.7em; font-weight:normal">${anion.n}</span>`;
        th.dataset.row = rowIndex;
        // Клик по аниону -> выделяет весь ряд
        th.onclick = () => highlightRow(rowIndex);
        tr.appendChild(th);

        // Данные строки (НОВАЯ СИСТЕМА - используем getSolubility)
        solubilityData.cations.forEach((cat, colIndex) => {
            const td = document.createElement('td');

            // Получаем растворимость через новую функцию
            const solubility = getSolubility(cat.f, anion.f);

            // Расшифровка символа
            let text = '';
            let className = '';

            switch(solubility) {
                case 'R': text = 'Р'; className = 'type-r'; break;
                case 'N': text = 'Н'; className = 'type-n'; break;
                case 'M': text = 'М'; className = 'type-m'; break;
                case 'D': text = '-'; className = 'type-d'; break;
                case 'O': text = ''; className = 'type-d'; break;
                default: text = '?'; className = '';
            }

            td.innerText = text;
            td.className = className;

            // === РЕЖИМ РЕАЛЬНЫХ ЦВЕТОВ ===
            if (isColorMode) {
                const catKey = normalizeFormula(cat.f);
                const anionKey = normalizeFormula(anion.f);
                const colorKey = `${catKey}-${anionKey}`;

                const chemColor = substanceColors[colorKey];

                // Пропускаем разлагающиеся вещества (D, O)
                if (solubility === 'D' || solubility === 'O') {
                    // Не красим — оставляем серым
                }
                else if (chemColor) {
                    // Есть конкретный цвет в базе
                    td.classList.add('chem-color-cell');

                    if (chemColor === "white") {
                        td.classList.add('white-precipitate', 'light-bg');
                    } else if (chemColor === "colorless") {
                        td.classList.add('colorless-solution', 'light-bg');
                    } else {
                        td.style.backgroundColor = chemColor;
                        if (isColorDark(chemColor)) {
                            td.classList.add('dark-bg');
                        } else {
                            td.classList.add('light-bg');
                        }
                    }
                }
                else if (solubility === 'R') {
                    // Растворимо, но нет в базе → бесцветный раствор
                    td.classList.add('chem-color-cell', 'colorless-solution', 'light-bg');
                }
                else if (solubility === 'N' || solubility === 'M') {
                    // Нерастворимо/малорастворимо, но нет в базе → белый осадок
                    td.classList.add('chem-color-cell', 'white-precipitate', 'light-bg');
                }
            }

            // === КОНЕЦ РЕЖИМА ЦВЕТОВ ===

            td.dataset.r = rowIndex;
            td.dataset.c = colIndex;

            td.onclick = (e) => {
                e.stopPropagation();
                highlightCrosshair(rowIndex, colIndex);
            };

            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
}

// =========================================
// ЛОГИКА ПОДСВЕТКИ (КРЕСТОВИНА)
// =========================================

function clearTableSelection() {
    // Удаляем все классы активности
    document.querySelectorAll('.active-row, .active-col, .focused-cell, .active-header')
        .forEach(el => {
            el.classList.remove('active-row', 'active-col', 'focused-cell', 'active-header');
        });
}
// Выделение крестовины (клик по ячейке)
function highlightCrosshair(rIdx, cIdx) {
    const table = document.getElementById('solubility-table');
    const targetCell = table.rows[rIdx + 1].cells[cIdx + 1];

    // ПРОВЕРКА: Если эта ячейка уже активна — сбрасываем всё
    if (targetCell.classList.contains('focused-cell')) {
        clearTableSelection();
        return;
    }

    // Иначе — сначала чистим старое, потом выделяем новое
    clearTableSelection();

    // 1. Подсвечиваем заголовки
    const rowHeader = table.rows[rIdx + 1].cells[0];
    const colHeader = table.rows[0].cells[cIdx + 1];

    rowHeader.classList.add('active-header');
    colHeader.classList.add('active-header');

    // 2. Подсвечиваем ячейку
    targetCell.classList.add('focused-cell');

    // 3. Красим ряд
    const rowCells = table.rows[rIdx + 1].cells;
    for (let i = 1; i < rowCells.length; i++) {
        rowCells[i].classList.add('active-row');
    }

    // 4. Красим столбец
    for (let i = 1; i < table.rows.length; i++) {
        const cell = table.rows[i].cells[cIdx + 1];
        if (cell) cell.classList.add('active-col');
    }
}

// Выделение столбца (клик по катиону)
function highlightColumn(cIdx) {
    const table = document.getElementById('solubility-table');
    const header = table.rows[0].cells[cIdx + 1];

    // ПРОВЕРКА ТОГГЛА
    if (header.classList.contains('active-header')) {
        clearTableSelection();
        return;
    }

    clearTableSelection();

    header.classList.add('active-header');
    for (let i = 1; i < table.rows.length; i++) {
        const cell = table.rows[i].cells[cIdx + 1];
        if (cell) cell.classList.add('active-col');
    }
}

// Выделение строки (клик по аниону)
function highlightRow(rIdx) {
    const table = document.getElementById('solubility-table');
    const header = table.rows[rIdx + 1].cells[0];

    // ПРОВЕРКА ТОГГЛА
    if (header.classList.contains('active-header')) {
        clearTableSelection();
        return;
    }

    clearTableSelection();

    header.classList.add('active-header');
    const rowCells = table.rows[rIdx + 1].cells;
    for (let i = 1; i < rowCells.length; i++) {
        rowCells[i].classList.add('active-row');
    }
}
// Переключение таблицы растворимости (toggle)
function toggleSolubility() {
    const modal = document.getElementById('solubility-modal');
    if (modal.style.display === 'flex') {
        closeSolubility();
    } else {
        openSolubility();
    }
}

// Вызов функции открытия (не забудь добавить в FAB)
function openSolubility() {
    const modal = document.getElementById('solubility-modal');
    // Генерируем таблицу только если она пустая (оптимизация)
    if(document.getElementById('solubility-table').innerHTML === "") {
        renderSolubilityTable();
    }
    modal.style.display = 'flex';

    // Добавляем класс для скрытия FAB и кнопки темы на мобильных
    document.body.classList.add('solubility-open');

    // Закрываем FAB меню если открыто
    const fab = document.getElementById('fab-container');
    if (fab) fab.classList.remove('active');

    // Скрываем кнопки калькулятора и частиц в FAB меню
    const calcButton = document.querySelector('.fab-option[onclick="toggleCalc()"]');
    const particlesButton = document.querySelector('.fab-option[onclick="toggleParticles()"]');
    if (calcButton) calcButton.style.display = 'none';
    if (particlesButton) particlesButton.style.display = 'none';

    // Обновляем фильтры для таблицы растворимости
    updateFiltersForSolubility();

    // Включаем drag-to-scroll для таблицы
    const wrapper = document.querySelector('.solubility-wrapper');
    if (wrapper && !wrapper.dataset.dragScrollEnabled) {
        enableDragScroll(wrapper);
        wrapper.dataset.dragScrollEnabled = 'true';
    }
}

function closeSolubility() {
    const modal = document.getElementById('solubility-modal');
    // Проверка: существует ли модальное окно?
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.warn("Элемент 'solubility-modal' не найден в HTML!");
    }

    // Убираем класс для показа FAB и кнопки темы на мобильных
    document.body.classList.remove('solubility-open');

    // Закрываем панель поиска если открыта
    const searchPanel = document.getElementById('solubility-search-panel');
    if (searchPanel) searchPanel.classList.remove('active');
    const searchBtn = document.getElementById('solubility-search-btn');
    if (searchBtn) searchBtn.classList.remove('active');

    // Если есть функция очистки выделения
    if (typeof clearTableSelection === 'function') {
        clearTableSelection();
    }

    // Возвращаем кнопки калькулятора и частиц в FAB меню
    const calcButton = document.querySelector('.fab-option[onclick="toggleCalc()"]');
    const particlesButton = document.querySelector('.fab-option[onclick="toggleParticles()"]');
    if (calcButton) calcButton.style.display = '';
    if (particlesButton) particlesButton.style.display = '';

    // Восстанавливаем обычные фильтры элементов
    restoreElementFilters();
}

// =========================================
// ЛОГИКА ПОИСКА В ТАБЛИЦЕ РАСТВОРИМОСТИ (мобильная)
// =========================================
function toggleSolubilitySearch() {
    const panel = document.getElementById('solubility-search-panel');
    const btn = document.getElementById('solubility-search-btn');

    if (panel) {
        panel.classList.toggle('active');
        if (btn) btn.classList.toggle('active');

        // Фокус на поле ввода при открытии
        if (panel.classList.contains('active')) {
            const input = document.getElementById('solubility-search-input');
            if (input) {
                setTimeout(() => input.focus(), 100);
            }
        }
    }
}

function clearSolubilitySearch() {
    const input = document.getElementById('solubility-search-input');
    const clearBtn = document.querySelector('.solubility-search-clear');

    if (input) input.value = '';
    if (clearBtn) clearBtn.classList.remove('visible');

    // Сбрасываем выделение в таблице
    clearTableSelection();
}

function performSolubilitySearch() {
    const input = document.getElementById('solubility-search-input');
    if (!input) return;

    const query = input.value.trim();
    if (query.length < 2) {
        return;
    }

    // Используем уже существующую функцию поиска
    const found = searchInSolubilityTable(query);

    if (found) {
        // Закрываем панель поиска после успешного поиска
        toggleSolubilitySearch();
    }
}

// Инициализация обработчиков для поиска в таблице растворимости
(function initSolubilitySearch() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupSolubilitySearch);
    } else {
        setupSolubilitySearch();
    }

    function setupSolubilitySearch() {
        const searchInput = document.getElementById('solubility-search-input');
        const clearBtn = document.querySelector('.solubility-search-clear');

        if (!searchInput) return;

        // Показываем/скрываем кнопку очистки при вводе
        searchInput.addEventListener('input', (e) => {
            if (clearBtn) {
                if (e.target.value.length > 0) {
                    clearBtn.classList.add('visible');
                } else {
                    clearBtn.classList.remove('visible');
                }
            }
        });

        // Enter для поиска
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                performSolubilitySearch();
            }
        });
    }
})();

// =========================================
// ПАРСИНГ И ПОИСК ХИМИЧЕСКИХ ФОРМУЛ
// =========================================

function parseChemicalFormula(query) {
    query = query.toLowerCase().trim();

    // Словарь катионов (формула без заряда → индекс в массиве)
    const cationMap = {
        'h': 0, 'nh4': 1, 'li': 2, 'k': 3, 'na': 4, 'rb': 5, 'cs': 6,
        'ag': 7, 'mg': 8, 'ca': 9, 'sr': 10, 'ba': 11, 'zn': 12,
        'hg': 13, 'pb': 14, 'cu': 15, 'fe': 16, 'al': 18, 'cr': 19,
        'mn': 20, 'ni': 21, 'co': 22, 'sn': 23
    };

    // Словарь анионов (формула без заряда → индекс в массиве)
    // Важно: многоатомные анионы с цифрами должны быть включены
    const anionMap = {
        'oh': 0, 'f': 1, 'cl': 2, 'br': 3, 'i': 4, 's': 5, 'hs': 6,
        'so3': 7, 'so4': 8, 'no3': 9, 'po4': 10, 'co3': 11, 'sio3': 12,
        'cro4': 13, 'ch3coo': 14, 'mno4': 15,
        // Альтернативные написания
        'acetate': 14, 'ac': 14
    };

    let foundCatIndex = -1;
    let foundAnIndex = -1;

    // Паттерны для распознавания формул
    // Пробуем найти известные катионы в начале формулы
    const cationKeys = Object.keys(cationMap).sort((a, b) => b.length - a.length); // Сначала длинные
    const anionKeys = Object.keys(anionMap).sort((a, b) => b.length - a.length);

    // Нормализуем запрос: убираем только скобки и символы зарядов, НО оставляем цифры
    const normalizedWithNumbers = query.replace(/[₂₃₄₅²³⁺⁻\(\)\[\]]/g, '');
    // Версия без цифр - для поиска катионов
    const normalizedNoCatNumbers = query.replace(/[₂₃₄₅²³⁺⁻\(\)\[\]]/g, '');

    // Ищем катион в начале
    for (const cat of cationKeys) {
        if (normalizedWithNumbers.startsWith(cat)) {
            foundCatIndex = cationMap[cat];
            // Пробуем найти анион в оставшейся части (с цифрами!)
            let remainder = normalizedWithNumbers.slice(cat.length);
            // Убираем возможную цифру после катиона (например, Ba3 в Ba3(PO4)2)
            remainder = remainder.replace(/^[0-9]+/, '');

            for (const an of anionKeys) {
                if (remainder === an || remainder.startsWith(an)) {
                    foundAnIndex = anionMap[an];
                    break;
                }
            }
            break;
        }
    }

    // Если не нашли анион, ищем отдельно (с цифрами в названии)
    if (foundAnIndex === -1) {
        for (const an of anionKeys) {
            if (normalizedWithNumbers.includes(an)) {
                foundAnIndex = anionMap[an];
                break;
            }
        }
    }

    return { cationIndex: foundCatIndex, anionIndex: foundAnIndex };
}

// Поиск внутри таблицы растворимости (улучшенная версия)
function searchInSolubilityTable(query) {
    query = query.toLowerCase().trim();

    // Сначала пробуем распарсить как полную формулу (NaCl, BaSO4 и т.д.)
    const parsed = parseChemicalFormula(query);
    let foundRowIndex = parsed.anionIndex;
    let foundColIndex = parsed.cationIndex;

    // Если парсинг формулы не дал результата, ищем по названиям
    if (foundRowIndex === -1) {
        // 1. Ищем АНИОН (строку) по названию
        for (let i = 0; i < solubilityData.anions.length; i++) {
            const a = solubilityData.anions[i];
            const name = a.n.toLowerCase();
            const formula = a.f.toLowerCase().replace('-', '').replace('2', '').replace('3', '').replace('⁻', '').replace('₂', '').replace('₃', '');

            if (query.includes(name) || query.includes(formula)) {
                foundRowIndex = i;
                break;
            }
        }
    }

    if (foundColIndex === -1) {
        // 2. Ищем КАТИОН (столбец) по названию
        for (let i = 0; i < solubilityData.cations.length; i++) {
            const c = solubilityData.cations[i];
            const name = c.n.toLowerCase();
            const formula = c.f.toLowerCase().replace('+', '').replace('2', '').replace('3', '').replace('⁺', '').replace('²', '').replace('₂', '');

            // Ищем вхождение имени катиона (или корня) в запрос
            if (query.includes(name) || query.includes(name.slice(0, -1)) || query.includes(formula)) {
                foundColIndex = i;
                break;
            }
        }
    }

    // 3. Открываем таблицу, если нашли хоть что-то
    if (foundRowIndex !== -1 || foundColIndex !== -1) {
        // Открываем модалку (если закрыта)
        const modal = document.getElementById('solubility-modal');
        if (modal.style.display !== 'flex') {
            openSolubility();
        }

        // Закрываем панель фильтров
        const filtersPanel = document.getElementById('filters-panel');
        if (filtersPanel && filtersPanel.classList.contains('active')) {
            filtersPanel.classList.remove('active');
        }

        // Выделяем найденное
        setTimeout(() => {
            if (foundRowIndex !== -1 && foundColIndex !== -1) {
                // Нашли И катион, И анион → крестовина
                highlightCrosshair(foundRowIndex, foundColIndex);

                const table = document.getElementById('solubility-table');
                const cell = table.rows[foundRowIndex + 1].cells[foundColIndex + 1];
                cell.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            } else if (foundColIndex !== -1) {
                // Нашли ТОЛЬКО катион → подсвечиваем столбец
                highlightColumn(foundColIndex);

                const table = document.getElementById('solubility-table');
                const header = table.rows[0].cells[foundColIndex + 1];
                header.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            } else if (foundRowIndex !== -1) {
                // Нашли ТОЛЬКО анион → подсвечиваем строку
                highlightRow(foundRowIndex);

                const table = document.getElementById('solubility-table');
                const header = table.rows[foundRowIndex + 1].cells[0];
                header.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
            }
        }, 300);

        return true; // Успех
    }

    return false; // Ничего не нашли
}

// =========================================
// ЗАМЕНА ФИЛЬТРОВ ДЛЯ ТАБЛИЦЫ РАСТВОРИМОСТИ
// =========================================

let originalCategoriesHTML = ''; // Сохраняем оригинальные категории

function updateFiltersForSolubility() {
    const categoriesSection = document.getElementById('categories-section');
    if (!categoriesSection) return;

    // Сохраняем оригинальные категории при первом вызове
    if (!originalCategoriesHTML) {
        originalCategoriesHTML = categoriesSection.innerHTML;
    }

    // Проверяем режим цветов
    if (isColorMode) {
        // Получаем уникальные цвета из таблицы
        const uniqueColors = getUniqueColorsFromTable();

        // Генерируем кнопки для каждого цвета
        let buttonsHTML = '';
        uniqueColors.forEach(colorObj => {
            // Сохраняем originalColors как JSON в data-атрибуте
            const originalColorsJSON = JSON.stringify(colorObj.originalColors);
            buttonsHTML += `<button class="filter-btn" data-color-name="${colorObj.name}" data-original-colors='${originalColorsJSON}'>${colorObj.name}</button>`;
        });

        // Фильтры по цветам
        categoriesSection.innerHTML = `
            <h4>Цвета веществ</h4>
            <div class="filter-buttons">
                ${buttonsHTML}
            </div>
        `;

        // Добавляем обработчики для фильтров цветов
        document.querySelectorAll('#categories-section .filter-btn[data-color-name]').forEach(btn => {
            btn.addEventListener('click', () => {
                const colorName = btn.dataset.colorName;
                const originalColors = JSON.parse(btn.dataset.originalColors);

                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    resetSolubilityTableDisplay();
                    return;
                }

                document.querySelectorAll('#categories-section .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterByColor(originalColors);
            });
        });
    } else {
        // Фильтры по растворимости
        categoriesSection.innerHTML = `
            <h4>Растворимость</h4>
            <div class="filter-buttons">
                <button class="filter-btn" data-solubility="Р">Растворимые (Р)</button>
                <button class="filter-btn" data-solubility="М">Малорастворимые (М)</button>
                <button class="filter-btn" data-solubility="Н">Нерастворимые (Н)</button>
                <button class="filter-btn" data-solubility="-">Не существует (-)</button>
            </div>
        `;

        // Добавляем обработчики для фильтров растворимости
        document.querySelectorAll('#categories-section .filter-btn[data-solubility]').forEach(btn => {
            btn.addEventListener('click', () => {
                const solubility = btn.dataset.solubility;

                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    resetSolubilityTableDisplay();
                    return;
                }

                document.querySelectorAll('#categories-section .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterBySolubility(solubility);
            });
        });
    }
}

function restoreElementFilters() {
    const categoriesSection = document.getElementById('categories-section');
    if (!categoriesSection || !originalCategoriesHTML) return;

    categoriesSection.innerHTML = originalCategoriesHTML;

    // Переинициализируем обработчики фильтров элементов
    document.querySelectorAll('#categories-section .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.dataset.filter;

            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                resetTableDisplay();
                return;
            }

            document.querySelectorAll('#categories-section .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            applyCategoryFilter(filterType);
        });
    });
}

// Фильтрация ячеек таблицы по растворимости
function filterBySolubility(solubility) {
    const table = document.getElementById('solubility-table');
    if (!table) return;

    const rows = table.querySelectorAll('tr');

    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Пропускаем заголовок

        const cells = row.querySelectorAll('td');
        cells.forEach((cell, cellIndex) => {
            if (cellIndex === 0) return; // Пропускаем первый столбец (заголовки)

            // Первый столбец катиона (H⁺) всегда виден (cellIndex === 1)
            if (cellIndex === 1) {
                cell.style.opacity = '1';
                cell.style.filter = 'none';
            } else if (cell.textContent.trim() === solubility) {
                cell.style.opacity = '1';
                cell.style.filter = 'none';
            } else {
                cell.style.opacity = '0.1';
                cell.style.filter = 'grayscale(100%)';
            }
        });
    });
}

// Функция для конвертации цвета в русское название
function getColorName(color) {
    if (!color) return 'Неизвестный';

    color = color.toLowerCase().trim();

    // Словарь распространённых значений
    const colorNames = {
        'colorless': 'Бесцветный',
        'бесцветный': 'Бесцветный',
        'white': 'Белый',
        'белый': 'Белый',
        'black': 'Чёрный',
        'чёрный': 'Чёрный',
        'красный': 'Красный',
        'синий': 'Синий',
        'зелёный': 'Зелёный',
        'жёлтый': 'Жёлтый',
        'коричневый': 'Коричневый',
        'фиолетовый': 'Фиолетовый',
        'оранжевый': 'Оранжевый',
        'розовый': 'Розовый',
        'голубой': 'Голубой',
        'серый': 'Серый'
    };

    // Проверяем прямое совпадение
    if (colorNames[color]) return colorNames[color];

    // Если это HEX код, конвертируем в название
    if (color.startsWith('#')) {
        // Простое определение по популярным HEX кодам
        const hexMap = {
            '#ffffff': 'Белый',
            '#000000': 'Чёрный',
            '#ff0000': 'Красный',
            '#0000ff': 'Синий',
            '#00ff00': 'Зелёный',
            '#ffff00': 'Жёлтый',
            '#ffa500': 'Оранжевый',
            '#800080': 'Фиолетовый',
            '#ffc0cb': 'Розовый',
            '#808080': 'Серый',
            '#8b4513': 'Коричневый'
        };

        if (hexMap[color]) return hexMap[color];

        // Приблизительное определение цвета
        const rgb = hexToRgb(color);
        if (rgb) {
            return approximateColorByRGB(rgb);
        }
    }

    // Если не смогли определить, возвращаем оригинал с заглавной
    return color.charAt(0).toUpperCase() + color.slice(1);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function approximateColorByRGB(rgb) {
    const { r, g, b } = rgb;

    // Белый/светлые
    if (r > 240 && g > 240 && b > 240) return 'Белый';

    // Чёрный/тёмные
    if (r < 30 && g < 30 && b < 30) return 'Чёрный';

    // Серый
    if (Math.abs(r - g) < 40 && Math.abs(g - b) < 40 && Math.abs(r - b) < 40) {
        return 'Серый';
    }

    // Красный
    if (r > g + 50 && r > b + 50) return 'Красный';

    // Синий
    if (b > r + 50 && b > g + 50) return 'Синий';

    // Зелёный
    if (g > r + 50 && g > b + 50) return 'Зелёный';

    // Жёлтый
    if (r > 200 && g > 200 && b < 100) return 'Жёлтый';

    // Оранжевый
    if (r > 200 && g > 100 && g < 200 && b < 100) return 'Оранжевый';

    // Фиолетовый
    if (r > 100 && b > 100 && g < 100) return 'Фиолетовый';

    // Розовый
    if (r > 200 && b > 150 && g < 200) return 'Розовый';

    // Коричневый
    if (r > 100 && g > 50 && b < 100) return 'Коричневый';

    return 'Разноцветный';
}

// Получить уникальные цвета из текущей таблицы
function getUniqueColorsFromTable() {
    const colorMap = new Map(); // originalColor -> {name, count}

    // Проходим по всем данным напрямую из solubilityData
    solubilityData.anions.forEach((anion, anionIndex) => {
        solubilityData.cations.forEach((cation, cationIndex) => {
            // Пропускаем H⁺ (первый катион)
            if (cationIndex === 0) return;

            const catKey = normalizeFormula(cation.f);
            const anionKey = normalizeFormula(anion.f);
            const colorKey = `${catKey}-${anionKey}`;

            const substanceColor = substanceColors[colorKey];

            if (substanceColor) {
                const colorName = getColorName(substanceColor);

                if (!colorMap.has(colorName)) {
                    colorMap.set(colorName, []);
                }
                colorMap.get(colorName).push(substanceColor);
            }
        });
    });

    // Возвращаем массив объектов {name, originalColors}
    const result = [];
    colorMap.forEach((originalColors, name) => {
        result.push({ name, originalColors });
    });

    // Сортируем по названию
    result.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    return result;
}

// Фильтрация ячеек таблицы по цвету
function filterByColor(originalColors) {
    const table = document.getElementById('solubility-table');
    if (!table) return;

    const rows = table.querySelectorAll('tr');

    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Пропускаем заголовок

        const cells = row.querySelectorAll('td');
        cells.forEach((cell, cellIndex) => {
            if (cellIndex === 0) return; // Пропускаем первый столбец (заголовки анионов)

            // Первый столбец катиона (H⁺) всегда виден
            if (cellIndex === 1) {
                cell.style.opacity = '1';
                cell.style.filter = 'none';
                return;
            }

            const substanceKey = getCellSubstanceKey(rowIndex - 1, cellIndex - 1);
            const substanceColor = substanceColors[substanceKey];

            // Проверяем, входит ли цвет вещества в список выбранных цветов
            if (substanceColor && originalColors.includes(substanceColor)) {
                cell.style.opacity = '1';
                cell.style.filter = 'none';
            } else {
                cell.style.opacity = '0.1';
                cell.style.filter = 'grayscale(100%)';
            }
        });
    });
}

// Сброс фильтрации таблицы растворимости
function resetSolubilityTableDisplay() {
    const table = document.getElementById('solubility-table');
    if (!table) return;

    const cells = table.querySelectorAll('td');
    cells.forEach(cell => {
        cell.style.opacity = '';
        cell.style.filter = '';
    });
}

// Получить ключ вещества для ячейки
function getCellSubstanceKey(rowIndex, colIndex) {
    const anion = solubilityData.anions[rowIndex];
    const cation = solubilityData.cations[colIndex];

    if (!anion || !cation) return '';

    const catKey = normalizeFormula(cation.f);
    const anionKey = normalizeFormula(anion.f);

    return `${catKey}-${anionKey}`;
}

// =========================================
// DRAG-TO-SCROLL ДЛЯ ТАБЛИЦЫ
// =========================================
function enableDragScroll(element) {
    let isDown = false;
    let startX, startY, scrollLeft, scrollTop;

    element.addEventListener('mousedown', (e) => {
        // Не мешаем кликам по ячейкам таблицы и заголовкам
        if (e.target.tagName === 'TD' || e.target.tagName === 'TH') return;

        isDown = true;
        element.style.cursor = 'grabbing';
        element.style.userSelect = 'none';

        startX = e.pageX - element.offsetLeft;
        startY = e.pageY - element.offsetTop;
        scrollLeft = element.scrollLeft;
        scrollTop = element.scrollTop;
    });

    element.addEventListener('mouseleave', () => {
        isDown = false;
        element.style.cursor = 'grab';
    });

    element.addEventListener('mouseup', () => {
        isDown = false;
        element.style.cursor = 'grab';
        element.style.userSelect = '';
    });

    element.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();

        const x = e.pageX - element.offsetLeft;
        const y = e.pageY - element.offsetTop;
        const walkX = (x - startX) * 1.5; // Множитель для скорости прокрутки
        const walkY = (y - startY) * 1.5;

        element.scrollLeft = scrollLeft - walkX;
        element.scrollTop = scrollTop - walkY;
    });
}
