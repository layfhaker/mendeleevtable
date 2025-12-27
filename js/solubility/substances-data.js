// =========================================
// SUBSTANCES-DATA.JS — Детальная информация о веществах
// Аналог elements.js для таблицы растворимости
// =========================================

const substancesData = {
    // Ключ формируется как "Катион-Анион" (например: "Ba2+-SO42-")
    // Гидроксиды (OH⁻) - данные для таблицы растворимости
    // Формат ключей: "Катион-OH-"


        "H+-OH-": {
            name: "Вода",
            formula: "H₂O",
            molarMass: 18.015,
            oxidationStates: {
                "H": 1,
                "O": -2
            },
            compoundType: "Особый случай (продукт нейтрализации H⁺ + OH⁻ → H₂O)",

            solubility: {
                status: "—",
                value: null,
                unit: "г/100 мл",
                temperature: 25,
                ksp: null,
                temperatureDependence: "Вода — универсальный растворитель, не применимо",
                solubilityTable: []
            },

            appearance: {
                precipitateColor: "—",
                crystalColor: "Бесцветные кристаллы (лёд)",
                solutionColor: "Бесцветная жидкость",
                crystalSystem: "Гексагональная (лёд Ih)",
                opticalProperties: "Прозрачная, показатель преломления 1.333",
                realLifeExample: "Основа всех живых организмов, 70% поверхности Земли"
            },

            stability: {
                decomposition: false,
                decompositionConditions: "Электролиз: 2H₂O → 2H₂ + O₂ (при высоком напряжении)",
                airSensitivity: "Стабильна",
                lightSensitivity: "Стабильна",
                characteristicReactions: [
                    "Автоионизация: 2H₂O ⇌ H₃O⁺ + OH⁻ (Kw = 10⁻¹⁴)",
                    "Гидролиз солей слабых кислот и оснований",
                    "Реакция с активными металлами: 2Na + 2H₂O → 2NaOH + H₂↑"
                ],
                analyticalUse: "Универсальный растворитель, стандарт pH = 7"
            },

            applications: [
                "Универсальный растворитель в химии и промышленности",
                "Охлаждение в промышленности и энергетике",
                "Среда для биохимических реакций",
                "Производство пара для турбин"
            ],

            safety: {
                toxicity: "Нетоксична в обычных условиях",
                ldso: "—",
                hazardClass: "—",
                precautions: "Опасность утопления, ожоги паром при T > 100°C",
                environmental: "Основа всех экосистем"
            },

            additionalInfo: {
                mineralName: "Лёд (твёрдая форма)",
                historicalFacts: [
                    "Лавуазье доказал состав воды в 1783 году",
                    "Кавендиш синтезировал воду из водорода и кислорода в 1781 году"
                ],
                interestingFacts: [
                    "Максимальная плотность при 3.98°C (аномалия воды)",
                    "Лёд менее плотный, чем жидкая вода — уникальное свойство",
                    "Высокая теплоёмкость (4.184 Дж/(г·К)) стабилизирует климат"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "IUPAC Gold Book"
            ]
        },

        "NH4+-OH-": {
            name: "Гидроксид аммония",
            formula: "NH₄OH (NH₃·H₂O)",
            molarMass: 35.05,
            oxidationStates: {
                "N": -3,
                "H": 1,
                "O": -2
            },
            compoundType: "Слабое основание (раствор аммиака в воде)",

            solubility: {
                status: "R",
                value: null,
                unit: "г/100 мл",
                temperature: 20,
                ksp: null,
                temperatureDependence: "Растворимость NH₃ уменьшается с температурой (газ)",
                solubilityTable: []
            },

            appearance: {
                precipitateColor: "—",
                crystalColor: "—",
                solutionColor: "Бесцветный раствор с резким запахом",
                crystalSystem: "—",
                opticalProperties: "Прозрачный раствор",
                realLifeExample: "Нашатырный спирт в аптечке, бытовые чистящие средства"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "NH₄OH → NH₃↑ + H₂O (при нагревании, аммиак улетучивается)",
                airSensitivity: "Аммиак испаряется на воздухе",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "Равновесие: NH₃ + H₂O ⇌ NH₄⁺ + OH⁻ (Kb = 1.8×10⁻⁵)",
                    "С кислотами: NH₄OH + HCl → NH₄Cl + H₂O",
                    "Комплекс с Cu²⁺: Cu²⁺ + 4NH₃ → [Cu(NH₃)₄]²⁺ (тёмно-синий)"
                ],
                analyticalUse: "Качественная реакция на Cu²⁺ (тёмно-синий аммиакат)"
            },

            applications: [
                "Производство удобрений (аммиачная селитра)",
                "Бытовые чистящие средства для стёкол",
                "Комплексообразователь в аналитической химии",
                "Холодильные установки (жидкий аммиак)",
                "Нашатырный спирт в медицине"
            ],

            safety: {
                toxicity: "Умеренно токсичен, раздражает дыхательные пути",
                ldso: "350 мг/кг (крысы, перорально)",
                hazardClass: "8 (коррозионное вещество)",
                precautions: "Работать в вытяжном шкафу, избегать вдыхания паров",
                environmental: "Токсичен для водных организмов в высоких концентрациях"
            },

            additionalInfo: {
                mineralName: "—",
                historicalFacts: [
                    "Аммиак получил название от оазиса Аммона в Египте",
                    "Впервые выделен Пристли в 1774 году"
                ],
                interestingFacts: [
                    "Чистый NH₄OH не существует — только раствор NH₃ в воде",
                    "Степень ионизации всего ~0.42% в 1М растворе",
                    "pH 1М раствора ≈ 11.6"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "PubChem (NIH)"
            ]
        },

        "Li+-OH-": {
            name: "Гидроксид лития",
            formula: "LiOH",
            molarMass: 23.95,
            oxidationStates: {
                "Li": 1,
                "O": -2,
                "H": 1
            },
            compoundType: "Сильное основание",

            solubility: {
                status: "R",
                value: 12.8,
                unit: "г/100 мл",
                temperature: 20,
                ksp: null,
                temperatureDependence: "Растворимость слабо увеличивается с температурой",
                solubilityTable: [
                    { temp: 0, value: 12.7 },
                    { temp: 20, value: 12.8 },
                    { temp: 100, value: 17.5 }
                ]
            },

            appearance: {
                precipitateColor: "—",
                crystalColor: "Белые тетрагональные кристаллы",
                solutionColor: "Бесцветный раствор",
                crystalSystem: "Тетрагональная",
                opticalProperties: "Гигроскопичен, поглощает CO₂ из воздуха",
                realLifeExample: "Системы очистки воздуха на подводных лодках"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "2LiOH → Li₂O + H₂O (при 924°C — единственный из щелочных!)",
                airSensitivity: "Гигроскопичен, поглощает CO₂ и влагу",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "С кислотами: LiOH + HCl → LiCl + H₂O",
                    "Поглощение CO₂: 2LiOH + CO₂ → Li₂CO₃ + H₂O",
                    "С жирными кислотами: образует литиевые мыла (смазки)"
                ],
                analyticalUse: "Определение CO₂ в газовых смесях"
            },

            applications: [
                "Очистка воздуха от CO₂ (подводные лодки, космические корабли)",
                "Производство литиевых смазок",
                "Электролит для литий-ионных аккумуляторов",
                "Керамическая промышленность"
            ],

            safety: {
                toxicity: "Коррозионно опасен",
                ldso: "210-280 мг/кг (крысы, перорально)",
                hazardClass: "8 (коррозионное вещество)",
                precautions: "Защита кожи и глаз, избегать вдыхания пыли",
                environmental: "Умеренно опасен для водных организмов"
            },

            additionalInfo: {
                mineralName: "—",
                historicalFacts: [
                    "Литий открыт Арфведсоном в 1817 году",
                    "Название от греч. lithos — камень"
                ],
                interestingFacts: [
                    "Самый слабый из щелочных гидроксидов",
                    "1 г LiOH поглощает 450 см³ CO₂",
                    "По свойствам ближе к Mg(OH)₂, чем к NaOH (диагональное сходство)"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "Greenwood N.N., Earnshaw A. Chemistry of the Elements"
            ]
        },

        "Na+-OH-": {
            name: "Гидроксид натрия",
            formula: "NaOH",
            molarMass: 40.00,
            oxidationStates: {
                "Na": 1,
                "O": -2,
                "H": 1
            },
            compoundType: "Сильное основание",

            solubility: {
                status: "R",
                value: 109,
                unit: "г/100 мл",
                temperature: 20,
                ksp: null,
                temperatureDependence: "Растворимость сильно увеличивается с температурой",
                solubilityTable: [
                    { temp: 0, value: 97 },
                    { temp: 20, value: 109 },
                    { temp: 100, value: 337 }
                ]
            },

            appearance: {
                precipitateColor: "—",
                crystalColor: "Белые гранулы, хлопья или палочки",
                solutionColor: "Бесцветный вязкий раствор",
                crystalSystem: "Орторомбическая",
                opticalProperties: "Очень гигроскопичен, расплывается на воздухе",
                realLifeExample: "Средство для прочистки труб «Крот»"
            },

            stability: {
                decomposition: false,
                decompositionConditions: "Кипит без разложения при 1388°C",
                airSensitivity: "Очень гигроскопичен, поглощает CO₂ (карбонизация)",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "С кислотами: NaOH + HCl → NaCl + H₂O (экзотермическая!)",
                    "С алюминием: 2Al + 6NaOH + 6H₂O → 2Na₃[Al(OH)₆] + 3H₂↑",
                    "Со стеклом: медленно разъедает стекло (образует силикаты)"
                ],
                analyticalUse: "Стандартный титрант для определения кислот"
            },

            applications: [
                "Производство бумаги и целлюлозы (~25% мирового потребления)",
                "Производство мыла и моющих средств",
                "Получение алюминия (процесс Байера)",
                "Нефтепереработка",
                "Пищевая промышленность (E524)"
            ],

            safety: {
                toxicity: "Коррозионно опасен, вызывает тяжёлые ожоги и слепоту",
                ldso: "140-340 мг/кг (крысы, перорально)",
                hazardClass: "8 (коррозионное вещество)",
                precautions: "Защита кожи и глаз обязательна, работать в перчатках",
                environmental: "Изменяет pH водоёмов, опасен для водных организмов"
            },

            additionalInfo: {
                mineralName: "—",
                historicalFacts: [
                    "Известен с древности как «едкий натр»",
                    "Промышленное производство с 1891 года (электролиз)"
                ],
                interestingFacts: [
                    "Мировое производство ~83 млн тонн в год",
                    "Растворение в воде сильно экзотермично",
                    "Хранить только в полиэтиленовой таре (разъедает стекло)"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "Ullmann's Encyclopedia of Industrial Chemistry"
            ]
        },

        "K+-OH-": {
            name: "Гидроксид калия",
            formula: "KOH",
            molarMass: 56.11,
            oxidationStates: {
                "K": 1,
                "O": -2,
                "H": 1
            },
            compoundType: "Сильное основание",

            solubility: {
                status: "R",
                value: 121,
                unit: "г/100 мл",
                temperature: 25,
                ksp: null,
                temperatureDependence: "Растворимость увеличивается с температурой",
                solubilityTable: [
                    { temp: 0, value: 97 },
                    { temp: 25, value: 121 },
                    { temp: 100, value: 178 }
                ]
            },

            appearance: {
                precipitateColor: "—",
                crystalColor: "Белые или желтоватые гранулы",
                solutionColor: "Бесцветный раствор",
                crystalSystem: "Моноклинная",
                opticalProperties: "Очень гигроскопичен",
                realLifeExample: "Электролит в щелочных батарейках"
            },

            stability: {
                decomposition: false,
                decompositionConditions: "Кипит при 1320°C без разложения",
                airSensitivity: "Очень гигроскопичен, поглощает CO₂",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "С кислотами: KOH + HCl → KCl + H₂O",
                    "С жирами: омыление → калийное мыло (мягкое)",
                    "С CO₂: 2KOH + CO₂ → K₂CO₃ + H₂O"
                ],
                analyticalUse: "Титрант для определения кислот, осушитель"
            },

            applications: [
                "Производство мягкого и жидкого мыла",
                "Электролит для NiCd и NiMH аккумуляторов",
                "Производство биодизеля (катализатор)",
                "Осушение органических растворителей",
                "Пищевая промышленность (E525)"
            ],

            safety: {
                toxicity: "Коррозионно опасен",
                ldso: "273 мг/кг (крысы, перорально)",
                hazardClass: "8 (коррозионное вещество)",
                precautions: "Защита кожи и глаз, работать в вытяжке",
                environmental: "Изменяет pH водоёмов"
            },

            additionalInfo: {
                mineralName: "—",
                historicalFacts: [
                    "Известен как «едкое кали» с древности",
                    "Калий открыт Дэви в 1807 году электролизом KOH"
                ],
                interestingFacts: [
                    "Лучше проводит электричество, чем NaOH",
                    "Предпочтителен для аккумуляторов из-за высокой проводимости",
                    "Калийное мыло мягче натриевого"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "Ullmann's Encyclopedia of Industrial Chemistry"
            ]
        },

        "Rb+-OH-": {
            name: "Гидроксид рубидия",
            formula: "RbOH",
            molarMass: 102.48,
            oxidationStates: {
                "Rb": 1,
                "O": -2,
                "H": 1
            },
            compoundType: "Сильное основание",

            solubility: {
                status: "R",
                value: 173,
                unit: "г/100 мл",
                temperature: 30,
                ksp: null,
                temperatureDependence: "Растворимость увеличивается с температурой",
                solubilityTable: [
                    { temp: 15, value: 100 },
                    { temp: 30, value: 173 }
                ]
            },

            appearance: {
                precipitateColor: "—",
                crystalColor: "Серовато-белые кристаллы",
                solutionColor: "Бесцветный раствор (pH > 14)",
                crystalSystem: "Орторомбическая",
                opticalProperties: "Гигроскопичен",
                realLifeExample: "Редко используется из-за высокой стоимости"
            },

            stability: {
                decomposition: false,
                decompositionConditions: "Плавится при 301°C без разложения",
                airSensitivity: "Гигроскопичен, поглощает CO₂",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "С кислотами: RbOH + HCl → RbCl + H₂O",
                    "С CO₂: 2RbOH + CO₂ → Rb₂CO₃ + H₂O"
                ],
                analyticalUse: "Ограниченное применение из-за стоимости"
            },

            applications: [
                "Специальные катализаторы",
                "Пиротехника (фиолетовое пламя)",
                "Научные исследования"
            ],

            safety: {
                toxicity: "Коррозионно опасен",
                ldso: "нет данных",
                hazardClass: "8 (коррозионное вещество)",
                precautions: "Защита кожи и глаз",
                environmental: "Ион Rb⁺ обрабатывается организмом как K⁺"
            },

            additionalInfo: {
                mineralName: "—",
                historicalFacts: [
                    "Рубидий открыт Бунзеном и Кирхгофом в 1861 году"
                ],
                interestingFacts: [
                    "Один из самых дорогих щелочных гидроксидов",
                    "Рубидий даёт фиолетовое пламя"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "Greenwood N.N., Earnshaw A. Chemistry of the Elements"
            ]
        },

        "Cs+-OH-": {
            name: "Гидроксид цезия",
            formula: "CsOH",
            molarMass: 149.91,
            oxidationStates: {
                "Cs": 1,
                "O": -2,
                "H": 1
            },
            compoundType: "Сильное основание (самое сильное из обычных оснований)",

            solubility: {
                status: "R",
                value: 400,
                unit: "г/100 мл",
                temperature: 25,
                ksp: null,
                temperatureDependence: "Самый растворимый из щелочных гидроксидов",
                solubilityTable: [
                    { temp: 15, value: 395 },
                    { temp: 25, value: 400 }
                ]
            },

            appearance: {
                precipitateColor: "—",
                crystalColor: "Бесцветные кристаллы",
                solutionColor: "Бесцветный раствор (pH > 14)",
                crystalSystem: "Орторомбическая",
                opticalProperties: "Очень гигроскопичен, расплывается на воздухе",
                realLifeExample: "Специальные химические производства"
            },

            stability: {
                decomposition: false,
                decompositionConditions: "Плавится при 272°C без разложения",
                airSensitivity: "Чрезвычайно гигроскопичен",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "С кислотами: CsOH + HCl → CsCl + H₂O",
                    "Разъедает стекло: CsOH + SiO₂ → силикат цезия"
                ],
                analyticalUse: "Растворение стеклянных образцов для анализа"
            },

            applications: [
                "Растворение стеклянных образцов",
                "Катализатор для полиуретанов",
                "Научные исследования"
            ],

            safety: {
                toxicity: "Коррозионно опасен",
                ldso: "89 мг/кг (крысы, внутрибрюшинно)",
                hazardClass: "8 (коррозионное вещество)",
                precautions: "Хранить только в полиэтилене, платине или серебре (разъедает стекло!)",
                environmental: "Опасен для водных организмов"
            },

            additionalInfo: {
                mineralName: "—",
                historicalFacts: [
                    "Цезий открыт Бунзеном и Кирхгофом в 1860 году",
                    "Первый элемент, открытый спектроскопически"
                ],
                interestingFacts: [
                    "pKa сопряжённой кислоты = 15.76 — самое сильное обычное основание",
                    "Нельзя хранить в стеклянной посуде!",
                    "Самый растворимый гидроксид (~400 г/100 мл)"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "Greenwood N.N., Earnshaw A. Chemistry of the Elements"
            ]
        },

        "Ag+-OH-": {
            name: "Гидроксид серебра",
            formula: "AgOH → Ag₂O",
            molarMass: 124.87,
            oxidationStates: {
                "Ag": 1,
                "O": -2,
                "H": 1
            },
            compoundType: "Нестабильный гидроксид (мгновенно разлагается)",

            solubility: {
                status: "D",
                value: null,
                unit: "г/100 мл",
                temperature: 20,
                ksp: null,
                temperatureDependence: "Не применимо — сразу разлагается до Ag₂O",
                solubilityTable: []
            },

            appearance: {
                precipitateColor: "Тёмно-коричневый или чёрный (Ag₂O)",
                crystalColor: "—",
                solutionColor: "—",
                crystalSystem: "Кубическая (Ag₂O)",
                opticalProperties: "Ag₂O светочувствителен",
                realLifeExample: "Серебряно-оксидные батарейки (часы, калькуляторы)"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "2AgOH → Ag₂O + H₂O (мгновенно при T > -50°C)",
                airSensitivity: "Ag₂O стабилен на воздухе",
                lightSensitivity: "Ag₂O темнеет на свету (восстановление до Ag)",
                characteristicReactions: [
                    "Попытка осаждения: AgNO₃ + NaOH → [AgOH] → Ag₂O↓ + H₂O",
                    "Растворение в NH₃: Ag₂O + 4NH₃ + H₂O → 2[Ag(NH₃)₂]⁺ + 2OH⁻",
                    "Термическое разложение: 2Ag₂O → 4Ag + O₂ (при ~300°C)"
                ],
                analyticalUse: "Качественная реакция на Ag⁺ — образование тёмного Ag₂O"
            },

            applications: [
                "Серебряно-оксидные батарейки (1.55 В)",
                "Мягкий окислитель в органическом синтезе",
                "Антибактериальные покрытия",
                "Очистка воды"
            ],

            safety: {
                toxicity: "Низкая токсичность",
                ldso: "нет данных",
                hazardClass: "—",
                precautions: "Избегать попадания в глаза",
                environmental: "Серебро токсично для микроорганизмов"
            },

            additionalInfo: {
                mineralName: "—",
                historicalFacts: [
                    "Ag₂O известен с древности",
                    "Чистый AgOH впервые получен в 2005 году фотохимически при 5 K"
                ],
                interestingFacts: [
                    "AgOH существует только при температурах ниже -50°C",
                    "При комнатной температуре мгновенно превращается в Ag₂O",
                    "Ag₂O — полупроводник"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "Cotton F.A., Wilkinson G. Advanced Inorganic Chemistry"
            ]
        },

        "Mg2+-OH-": {
            name: "Гидроксид магния",
            formula: "Mg(OH)₂",
            molarMass: 58.32,
            oxidationStates: {
                "Mg": 2,
                "O": -2,
                "H": 1
            },
            compoundType: "Слабое основание",

            solubility: {
                status: "N",
                value: 0.00122,
                unit: "г/100 мл",
                temperature: 20,
                ksp: 5.61e-12,
                temperatureDependence: "Растворимость слабо увеличивается с температурой",
                solubilityTable: [
                    { temp: 18, value: 0.0009 },
                    { temp: 25, value: 0.0014 },
                    { temp: 100, value: 0.004 }
                ]
            },

            appearance: {
                precipitateColor: "Белый студенистый",
                crystalColor: "Белый порошок",
                solutionColor: "—",
                crystalSystem: "Гексагональная (тригональная)",
                opticalProperties: "Непрозрачный белый",
                realLifeExample: "«Молоко магнезии» — антацид от изжоги"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "Mg(OH)₂ → MgO + H₂O (при 350°C)",
                airSensitivity: "Стабилен на воздухе",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "Осаждение: MgCl₂ + 2NaOH → Mg(OH)₂↓ + 2NaCl",
                    "С кислотами: Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O",
                    "Нейтрализация желудочной кислоты: Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O"
                ],
                analyticalUse: "Белый осадок при добавлении щёлочи к Mg²⁺"
            },

            applications: [
                "Антацид (нейтрализация желудочной кислоты)",
                "Слабительное средство («Молоко магнезии»)",
                "Антипирен (огнезащитная добавка для полимеров)",
                "Нейтрализация кислых сточных вод"
            ],

            safety: {
                toxicity: "Малотоксичен",
                ldso: "8500 мг/кг (крысы, перорально)",
                hazardClass: "—",
                precautions: "Безопасен при обычном использовании",
                environmental: "Малоопасен для окружающей среды"
            },

            additionalInfo: {
                mineralName: "Брусит (brucite)",
                historicalFacts: [
                    "Минерал брусит назван в честь американского минералога А. Брюса",
                    "Используется в медицине с XIX века"
                ],
                interestingFacts: [
                    "pH насыщенного раствора ~10.5",
                    "Разлагается при нагревании без плавления",
                    "Один из самых безопасных антацидов"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "PubChem (NIH)"
            ]
        },

        "Ca2+-OH-": {
            name: "Гидроксид кальция",
            formula: "Ca(OH)₂",
            molarMass: 74.09,
            oxidationStates: {
                "Ca": 2,
                "O": -2,
                "H": 1
            },
            compoundType: "Сильное основание",

            solubility: {
                status: "M",
                value: 0.16,
                unit: "г/100 мл",
                temperature: 20,
                ksp: 5.02e-6,
                temperatureDependence: "Растворимость УМЕНЬШАЕТСЯ при нагревании (ретроградная)!",
                solubilityTable: [
                    { temp: 0, value: 0.189 },
                    { temp: 20, value: 0.16 },
                    { temp: 100, value: 0.066 }
                ]
            },

            appearance: {
                precipitateColor: "Белый",
                crystalColor: "Белый порошок (пушонка)",
                solutionColor: "Бесцветный (известковая вода)",
                crystalSystem: "Тригональная",
                opticalProperties: "Мутнеет на воздухе (поглощает CO₂)",
                realLifeExample: "Побелка стен, строительные растворы"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "Ca(OH)₂ → CaO + H₂O (при 450-512°C)",
                airSensitivity: "Поглощает CO₂ из воздуха (карбонизация)",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "Гашение извести: CaO + H₂O → Ca(OH)₂ (экзотермическая!)",
                    "Проба на CO₂: Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O (помутнение)",
                    "С кислотами: Ca(OH)₂ + 2HCl → CaCl₂ + 2H₂O"
                ],
                analyticalUse: "Известковая вода — качественная реакция на CO₂ (помутнение)"
            },

            applications: [
                "Строительство (известковый раствор, штукатурка)",
                "Известкование кислых почв в сельском хозяйстве",
                "Умягчение воды",
                "Пищевая промышленность (E526)",
                "Стоматология (эндодонтия)"
            ],

            safety: {
                toxicity: "Умеренно токсичен, раздражитель",
                ldso: "7340 мг/кг (крысы, перорально)",
                hazardClass: "—",
                precautions: "Защита глаз и органов дыхания от пыли",
                environmental: "Повышает pH почвы и воды"
            },

            additionalInfo: {
                mineralName: "Портландит (portlandite)",
                historicalFacts: [
                    "Известь использовалась ещё в Древнем Египте",
                    "Римляне применяли известковый раствор в строительстве"
                ],
                interestingFacts: [
                    "Ретроградная растворимость — уникальное свойство",
                    "pH насыщенного раствора = 12.4",
                    "Мировое производство ~125 млн тонн/год"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "Ullmann's Encyclopedia of Industrial Chemistry"
            ]
        },

        "Sr2+-OH-": {
            name: "Гидроксид стронция",
            formula: "Sr(OH)₂",
            molarMass: 121.63,
            oxidationStates: {
                "Sr": 2,
                "O": -2,
                "H": 1
            },
            compoundType: "Сильное основание",

            solubility: {
                status: "M",
                value: 1.77,
                unit: "г/100 мл",
                temperature: 20,
                ksp: 6.4e-3,
                temperatureDependence: "Растворимость сильно увеличивается с температурой",
                solubilityTable: [
                    { temp: 0, value: 0.41 },
                    { temp: 20, value: 1.77 },
                    { temp: 100, value: 21.83 }
                ]
            },

            appearance: {
                precipitateColor: "Белый",
                crystalColor: "Бесцветные призматические кристаллы",
                solutionColor: "Бесцветный раствор",
                crystalSystem: "Тетрагональная (октагидрат)",
                opticalProperties: "Гигроскопичен",
                realLifeExample: "Очистка свекловичного сахара"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "Sr(OH)₂ → SrO + H₂O (при 710°C)",
                airSensitivity: "Гигроскопичен, поглощает CO₂",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "С кислотами: Sr(OH)₂ + 2HCl → SrCl₂ + 2H₂O",
                    "С CO₂: Sr(OH)₂ + CO₂ → SrCO₃↓ + H₂O"
                ],
                analyticalUse: "Определение сульфатов (осаждение SrSO₄)"
            },

            applications: [
                "Очистка свекловичного сахара",
                "Стабилизатор пластмасс",
                "Производство смазочных материалов"
            ],

            safety: {
                toxicity: "Умеренно токсичен",
                ldso: "нет данных",
                hazardClass: "8 (коррозионное вещество)",
                precautions: "Защита кожи и глаз",
                environmental: "Умеренно опасен для водных организмов"
            },

            additionalInfo: {
                mineralName: "—",
                historicalFacts: [
                    "Стронций открыт в 1790 году в Шотландии (деревня Стронциан)"
                ],
                interestingFacts: [
                    "Образует октагидрат Sr(OH)₂·8H₂O",
                    "Промежуточная растворимость между Ca(OH)₂ и Ba(OH)₂"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook"
            ]
        },

        "Ba2+-OH-": {
            name: "Гидроксид бария",
            formula: "Ba(OH)₂",
            molarMass: 171.34,
            oxidationStates: {
                "Ba": 2,
                "O": -2,
                "H": 1
            },
            compoundType: "Сильное основание",

            solubility: {
                status: "R",
                value: 56,
                unit: "г/100 мл",
                temperature: 20,
                ksp: 5.0e-3,
                temperatureDependence: "Растворимость сильно увеличивается с температурой",
                solubilityTable: [
                    { temp: 0, value: 1.67 },
                    { temp: 20, value: 56 },
                    { temp: 80, value: 101.4 }
                ]
            },

            appearance: {
                precipitateColor: "Белый",
                crystalColor: "Белые гранулы или бесцветные кристаллы",
                solutionColor: "Бесцветный раствор (баритовая вода)",
                crystalSystem: "Моноклинная (октагидрат)",
                opticalProperties: "Гигроскопичен",
                realLifeExample: "Лабораторный реактив для титрования"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "Ba(OH)₂ → BaO + H₂O (при 800°C)",
                airSensitivity: "Гигроскопичен, поглощает CO₂",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "С H₂SO₄: Ba(OH)₂ + H₂SO₄ → BaSO₄↓ + 2H₂O",
                    "С CO₂: Ba(OH)₂ + CO₂ → BaCO₃↓ + H₂O",
                    "Эндотермическая реакция: Ba(OH)₂·8H₂O + 2NH₄SCN → Ba(SCN)₂ + 2NH₃ + 10H₂O"
                ],
                analyticalUse: "Титрование слабых кислот (без карбонатной ошибки)"
            },

            applications: [
                "Титрование слабых кислот (без примеси карбонатов)",
                "Катализатор альдольных конденсаций",
                "Демонстрация эндотермических реакций"
            ],

            safety: {
                toxicity: "ТОКСИЧЕН! Растворимые соединения бария ядовиты",
                ldso: "308 мг/кг (крысы, перорально)",
                hazardClass: "6.1 (токсичное вещество)",
                precautions: "Избегать проглатывания! Антидот: Na₂SO₄ или MgSO₄",
                environmental: "Токсичен для водных организмов"
            },

            additionalInfo: {
                mineralName: "—",
                historicalFacts: [
                    "Барий открыт Дэви в 1808 году"
                ],
                interestingFacts: [
                    "Летальная доза для человека — 3-4 г Ba",
                    "Вызывает гипокалиемию и паралич мышц",
                    "Образует октагидрат Ba(OH)₂·8H₂O (т.пл. 78°C)"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "ECHA Registration Dossier"
            ]
        },

        "Zn2+-OH-": {
            name: "Гидроксид цинка",
            formula: "Zn(OH)₂",
            molarMass: 99.42,
            oxidationStates: {
                "Zn": 2,
                "O": -2,
                "H": 1
            },
            compoundType: "Амфотерный гидроксид",

            solubility: {
                status: "N",
                value: 0.0001,
                unit: "г/100 мл",
                temperature: 20,
                ksp: 3.0e-17,
                temperatureDependence: "Практически не растворим в воде",
                solubilityTable: []
            },

            appearance: {
                precipitateColor: "Белый студенистый",
                crystalColor: "Белый порошок",
                solutionColor: "—",
                crystalSystem: "Орторомбическая (ε-форма)",
                opticalProperties: "Аморфный при осаждении",
                realLifeExample: "Каламиновые кремы от раздражения кожи"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "Zn(OH)₂ → ZnO + H₂O (при 125°C)",
                airSensitivity: "Стабилен на воздухе",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "С кислотами: Zn(OH)₂ + 2HCl → ZnCl₂ + 2H₂O",
                    "С избытком щёлочи: Zn(OH)₂ + 2NaOH → Na₂[Zn(OH)₄] (цинкат)",
                    "С аммиаком: Zn(OH)₂ + 4NH₃ → [Zn(NH₃)₄]²⁺ + 2OH⁻"
                ],
                analyticalUse: "Амфотерность — характерное свойство для идентификации Zn²⁺"
            },

            applications: [
                "Производство ZnO для резиновой промышленности",
                "Медицинские кремы и присыпки",
                "Перезаряжаемые цинковые батареи",
                "Пигменты"
            ],

            safety: {
                toxicity: "Низкая токсичность",
                ldso: "нет данных",
                hazardClass: "—",
                precautions: "Избегать вдыхания пыли",
                environmental: "Умеренно токсичен для водных организмов"
            },

            additionalInfo: {
                mineralName: "Вюльфингит, ашоверит, свитит",
                historicalFacts: [
                    "Известен с древности в составе каламина"
                ],
                interestingFacts: [
                    "Классический пример амфотерного гидроксида",
                    "Осаждается при pH 6-8, растворяется при pH < 6 и pH > 9",
                    "Существует несколько полиморфных форм"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "Cotton F.A., Wilkinson G. Advanced Inorganic Chemistry"
            ]
        },

        "Hg2+-OH-": {
            name: "Гидроксид ртути(II)",
            formula: "Hg(OH)₂ → HgO",
            molarMass: 234.61,
            oxidationStates: {
                "Hg": 2,
                "O": -2,
                "H": 1
            },
            compoundType: "Нестабильный гидроксид (мгновенно разлагается)",

            solubility: {
                status: "D",
                value: null,
                unit: "г/100 мл",
                temperature: 20,
                ksp: null,
                temperatureDependence: "Не применимо — сразу разлагается до HgO",
                solubilityTable: []
            },

            appearance: {
                precipitateColor: "Жёлтый или красный (HgO)",
                crystalColor: "Красный (нагревание) или жёлтый (осаждение)",
                solutionColor: "—",
                crystalSystem: "Орторомбическая (HgO)",
                opticalProperties: "HgO светочувствителен",
                realLifeExample: "Исторически — ртутные батарейки (запрещены)"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "Hg(OH)₂ → HgO + H₂O (мгновенно при комнатной температуре)",
                airSensitivity: "HgO стабилен на воздухе",
                lightSensitivity: "HgO темнеет на свету",
                characteristicReactions: [
                    "Попытка осаждения: Hg(NO₃)₂ + 2NaOH → [Hg(OH)₂] → HgO↓ + H₂O",
                    "Разложение HgO: 2HgO → 2Hg + O₂ (при ~500°C, опыт Лавуазье)"
                ],
                analyticalUse: "Образование жёлтого HgO при добавлении щёлочи к Hg²⁺"
            },

            applications: [
                "ЗАПРЕЩЕНЫ из-за токсичности!",
                "Исторически: ртутно-оксидные батарейки, медицина"
            ],

            safety: {
                toxicity: "ВЫСОКОТОКСИЧЕН! Топ-10 опасных химических веществ (ВОЗ)",
                ldso: "18 мг/кг (крысы, перорально, HgCl₂)",
                hazardClass: "6.1 (высокотоксичное вещество)",
                precautions: "ИЗБЕГАТЬ ЛЮБОГО КОНТАКТА! Нейротоксин, кумулятивный яд",
                environmental: "Биоаккумуляция в пищевой цепи, болезнь Минамата"
            },

            additionalInfo: {
                mineralName: "Монтроидит (HgO, красный)",
                historicalFacts: [
                    "Опыт Лавуазье (1774): разложение HgO доказало состав воздуха",
                    "Болезнь Минамата (Япония, 1956) — отравление метилртутью"
                ],
                interestingFacts: [
                    "Hg(OH)₂ существует только при очень низких температурах",
                    "Жёлтый и красный HgO — разные размеры частиц, не полиморфы",
                    "Ртутные соединения накапливаются в мозге и почках"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "WHO Chemicals of Major Public Health Concern",
                "ECHA Registration Dossier"
            ]
        },

        "Pb2+-OH-": {
            name: "Гидроксид свинца(II)",
            formula: "Pb(OH)₂",
            molarMass: 241.21,
            oxidationStates: {
                "Pb": 2,
                "O": -2,
                "H": 1
            },
            compoundType: "Амфотерный гидроксид",

            solubility: {
                status: "N",
                value: 0.0155,
                unit: "г/100 мл",
                temperature: 20,
                ksp: 1.43e-20,
                temperatureDependence: "Практически не растворим в воде",
                solubilityTable: []
            },

            appearance: {
                precipitateColor: "Белый аморфный",
                crystalColor: "Белый порошок",
                solutionColor: "—",
                crystalSystem: "—",
                opticalProperties: "Аморфный",
                realLifeExample: "Промежуточный продукт в свинцовых аккумуляторах"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "Pb(OH)₂ → PbO + H₂O (при нагревании)",
                airSensitivity: "Стабилен на воздухе",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "С кислотами: Pb(OH)₂ + 2HCl → PbCl₂ + 2H₂O",
                    "С избытком щёлочи: Pb(OH)₂ + 2NaOH → Na₂[Pb(OH)₄] (плюмбит)",
                    "Осаждение: Pb(NO₃)₂ + 2NaOH → Pb(OH)₂↓ + 2NaNO₃"
                ],
                analyticalUse: "Амфотерность — характерное свойство для идентификации Pb²⁺"
            },

            applications: [
                "Свинцово-кислотные аккумуляторы (через PbO)",
                "Исторически: свинцовые белила (пигмент) — сейчас запрещены"
            ],

            safety: {
                toxicity: "ТОКСИЧЕН! Кумулятивный яд",
                ldso: "нет данных",
                hazardClass: "6.1 (токсичное вещество)",
                precautions: "Избегать контакта и вдыхания! Поражает нервную систему",
                environmental: "Персистентный загрязнитель, не разлагается"
            },

            additionalInfo: {
                mineralName: "—",
                historicalFacts: [
                    "Свинец использовался с 7000-6500 до н.э.",
                    "Отравление свинцом (сатурнизм) известно с древности"
                ],
                interestingFacts: [
                    "IARC: Группа 2A — вероятный канцероген для человека",
                    "Часто существует как Pb₆O₄(OH)₄ (основной карбонат)",
                    "Амфотерность — ключевое свойство для идентификации"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "IARC Monographs",
                "ECHA Registration Dossier"
            ]
        },

        "Cu2+-OH-": {
            name: "Гидроксид меди(II)",
            formula: "Cu(OH)₂",
            molarMass: 97.57,
            oxidationStates: {
                "Cu": 2,
                "O": -2,
                "H": 1
            },
            compoundType: "Слабое основание",

            solubility: {
                status: "N",
                value: 0.00003,
                unit: "г/100 мл",
                temperature: 20,
                ksp: 2.2e-20,
                temperatureDependence: "Практически не растворим, разлагается при нагревании",
                solubilityTable: []
            },

            appearance: {
                precipitateColor: "Голубой студенистый",
                crystalColor: "Голубой",
                solutionColor: "—",
                crystalSystem: "Орторомбическая",
                opticalProperties: "Характерный голубой цвет",
                realLifeExample: "Бордоская жидкость для защиты растений"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "Cu(OH)₂ → CuO (чёрный) + H₂O (при 80-100°C)",
                airSensitivity: "Медленно поглощает CO₂, зеленеет",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "Осаждение: CuSO₄ + 2NaOH → Cu(OH)₂↓ (голубой) + Na₂SO₄",
                    "С избытком NH₃: Cu(OH)₂ + 4NH₃ → [Cu(NH₃)₄]²⁺ + 2OH⁻ (ТЁМНО-СИНИЙ)",
                    "Нагревание: Cu(OH)₂ → CuO (чёрный) + H₂O"
                ],
                analyticalUse: "Голубой осадок → тёмно-синий аммиакат — качественная реакция на Cu²⁺"
            },

            applications: [
                "Фунгицид (Бордоская жидкость)",
                "Производство вискозы (реактив Швейцера)",
                "Пигменты",
                "Катализаторы"
            ],

            safety: {
                toxicity: "Умеренно токсичен",
                ldso: "489-1350 мг/кг (крысы, перорально)",
                hazardClass: "—",
                precautions: "Избегать попадания в глаза",
                environmental: "Очень токсичен для водных организмов"
            },

            additionalInfo: {
                mineralName: "Сперттиниит (spertiniite)",
                historicalFacts: [
                    "Бордоская жидкость изобретена в 1882 году во Франции"
                ],
                interestingFacts: [
                    "Тёмно-синий аммиакат [Cu(NH₃)₄]²⁺ — классическая качественная реакция",
                    "Слабо амфотерен — растворяется в концентрированных щелочах",
                    "При стоянии на воздухе зеленеет (образуется основной карбонат)"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "Cotton F.A., Wilkinson G. Advanced Inorganic Chemistry"
            ]
        },

        "Fe2+-OH-": {
            name: "Гидроксид железа(II)",
            formula: "Fe(OH)₂",
            molarMass: 89.87,
            oxidationStates: {
                "Fe": 2,
                "O": -2,
                "H": 1
            },
            compoundType: "Слабое основание",

            solubility: {
                status: "N",
                value: 0.00052,
                unit: "г/100 мл",
                temperature: 20,
                ksp: 4.87e-17,
                temperatureDependence: "Практически не растворим в воде",
                solubilityTable: []
            },

            appearance: {
                precipitateColor: "Белый → зелёный → бурый (окисление!)",
                crystalColor: "Белый (свежий), быстро темнеет",
                solutionColor: "—",
                crystalSystem: "Тригональная (структура брусита)",
                opticalProperties: "Быстро темнеет на воздухе",
                realLifeExample: "Демонстрационный эксперимент: окисление Fe(OH)₂"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "Fe(OH)₂ → FeO + H₂O (в инертной атмосфере)",
                airSensitivity: "БЫСТРО ОКИСЛЯЕТСЯ НА ВОЗДУХЕ! Белый → зелёный → бурый",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "Осаждение: FeSO₄ + 2NaOH → Fe(OH)₂↓ (белый) + Na₂SO₄",
                    "Окисление: 4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃ (бурый)",
                    "Реакция Шикорра: 3Fe(OH)₂ → Fe₃O₄ + H₂↑ + 2H₂O (анаэробно)"
                ],
                analyticalUse: "Белый осадок, быстро буреющий на воздухе — качественная реакция на Fe²⁺"
            },

            applications: [
                "Промежуточный продукт в производстве железа",
                "Удаление селенатов из воды",
                "Учебные демонстрации окисления"
            ],

            safety: {
                toxicity: "Низкая токсичность",
                ldso: "нет данных",
                hazardClass: "—",
                precautions: "Работать в инертной атмосфере для получения чистого осадка",
                environmental: "Малоопасен для окружающей среды"
            },

            additionalInfo: {
                mineralName: "Амакинит (редкий минерал)",
                historicalFacts: [
                    "Реакция Шикорра открыта в 1929 году"
                ],
                interestingFacts: [
                    "Классический школьный эксперимент — наблюдение изменения цвета",
                    "Промежуточное состояние — 'green rust' (зелёная ржавчина)",
                    "В присутствии воздуха невозможно получить чистый Fe(OH)₂"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "Cotton F.A., Wilkinson G. Advanced Inorganic Chemistry"
            ]
        },

        "Fe3+-OH-": {
            name: "Гидроксид железа(III)",
            formula: "Fe(OH)₃",
            molarMass: 106.87,
            oxidationStates: {
                "Fe": 3,
                "O": -2,
                "H": 1
            },
            compoundType: "Слабое основание",

            solubility: {
                status: "N",
                value: 0.0000005,
                unit: "г/100 мл",
                temperature: 20,
                ksp: 2.79e-39,
                temperatureDependence: "Практически не растворим",
                solubilityTable: []
            },

            appearance: {
                precipitateColor: "Бурый (ржаво-коричневый) студенистый",
                crystalColor: "Красно-коричневый",
                solutionColor: "—",
                crystalSystem: "—",
                opticalProperties: "Характерный ржавый цвет",
                realLifeExample: "Основной компонент ржавчины"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "2Fe(OH)₃ → Fe₂O₃ + 3H₂O (при нагревании)",
                airSensitivity: "Стабилен на воздухе",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "Осаждение: FeCl₃ + 3NaOH → Fe(OH)₃↓ (бурый) + 3NaCl",
                    "Окисление Fe(OH)₂: 4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃",
                    "С кислотами: Fe(OH)₃ + 3HCl → FeCl₃ + 3H₂O"
                ],
                analyticalUse: "Бурый осадок — характерная реакция на Fe³⁺"
            },

            applications: [
                "Очистка воды (коагулянт)",
                "Удаление мышьяка из воды",
                "Пигменты (Pigment Yellow 42 — охра)",
                "Лечение железодефицитной анемии (полимальтозное железо)"
            ],

            safety: {
                toxicity: "Низкая токсичность",
                ldso: ">10000 мг/кг (крысы, перорально)",
                hazardClass: "—",
                precautions: "Может окрашивать кожу",
                environmental: "Естественный компонент почв"
            },

            additionalInfo: {
                mineralName: "Бернальит (редкий); гётит и лепидокрокит (FeOOH)",
                historicalFacts: [
                    "Охра — один из древнейших пигментов (пещерная живопись)"
                ],
                interestingFacts: [
                    "Истинный Fe(OH)₃ редок; обычно образуется FeOOH (оксигидроксид)",
                    "Гётит (α-FeOOH) — жёлто-коричневый компонент ржавчины",
                    "Один из самых нерастворимых гидроксидов (Ksp ~ 10⁻³⁹)"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "Greenwood N.N., Earnshaw A. Chemistry of the Elements"
            ]
        },

        "Al3+-OH-": {
            name: "Гидроксид алюминия",
            formula: "Al(OH)₃",
            molarMass: 78.00,
            oxidationStates: {
                "Al": 3,
                "O": -2,
                "H": 1
            },
            compoundType: "Амфотерный гидроксид",

            solubility: {
                status: "N",
                value: 0.0001,
                unit: "г/100 мл",
                temperature: 20,
                ksp: 1.9e-33,
                temperatureDependence: "Практически не растворим в воде",
                solubilityTable: []
            },

            appearance: {
                precipitateColor: "Белый студенистый",
                crystalColor: "Белый",
                solutionColor: "—",
                crystalSystem: "Моноклинная (гиббсит)",
                opticalProperties: "Объёмный студенистый осадок",
                realLifeExample: "Антацид «Алмагель», «Маалокс»"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "Al(OH)₃ → AlOOH (180°C) → Al₂O₃ (>600°C)",
                airSensitivity: "Стабилен на воздухе",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "С кислотами: Al(OH)₃ + 3HCl → AlCl₃ + 3H₂O",
                    "С избытком щёлочи: Al(OH)₃ + NaOH → Na[Al(OH)₄] (алюминат)",
                    "Осаждение: AlCl₃ + 3NaOH → Al(OH)₃↓ + 3NaCl"
                ],
                analyticalUse: "Амфотерность — ключевое свойство для идентификации Al³⁺"
            },

            applications: [
                "Антацид (нейтрализация желудочной кислоты)",
                "Антипирен (огнезащита)",
                "Очистка воды (коагулянт)",
                "Производство глинозёма (Al₂O₃) для получения алюминия"
            ],

            safety: {
                toxicity: "Низкая токсичность",
                ldso: ">5000 мг/кг (крысы, перорально)",
                hazardClass: "—",
                precautions: "Безопасен при обычном использовании",
                environmental: "Естественный компонент почв"
            },

            additionalInfo: {
                mineralName: "Гиббсит, байерит, нордстрандит",
                historicalFacts: [
                    "Процесс Байера (1888) — получение Al(OH)₃ из бокситов"
                ],
                interestingFacts: [
                    "Классический пример амфотерного гидроксида",
                    "Осаждается при pH 4-9, растворяется при pH < 4 и pH > 9",
                    "Образует объёмный гель, используемый для очистки воды"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "Cotton F.A., Wilkinson G. Advanced Inorganic Chemistry"
            ]
        },

        "Cr3+-OH-": {
            name: "Гидроксид хрома(III)",
            formula: "Cr(OH)₃",
            molarMass: 103.02,
            oxidationStates: {
                "Cr": 3,
                "O": -2,
                "H": 1
            },
            compoundType: "Амфотерный гидроксид",

            solubility: {
                status: "N",
                value: 0.000001,
                unit: "г/100 мл",
                temperature: 20,
                ksp: 6.3e-31,
                temperatureDependence: "Практически не растворим в воде",
                solubilityTable: []
            },

            appearance: {
                precipitateColor: "Серо-зелёный студенистый",
                crystalColor: "Серо-зелёный",
                solutionColor: "—",
                crystalSystem: "—",
                opticalProperties: "Характерный серо-зелёный цвет",
                realLifeExample: "Дубление кожи (хромовое дубление)"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "2Cr(OH)₃ → Cr₂O₃ (зелёный) + 3H₂O (при 289-450°C)",
                airSensitivity: "Стабилен на воздухе",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "С кислотами: Cr(OH)₃ + 3HCl → CrCl₃ (зелёный) + 3H₂O",
                    "С избытком щёлочи: Cr(OH)₃ + 3NaOH → Na₃[Cr(OH)₆] (хромит, зелёный)",
                    "Осаждение: CrCl₃ + 3NaOH → Cr(OH)₃↓ (серо-зелёный) + 3NaCl"
                ],
                analyticalUse: "Амфотерность и серо-зелёный цвет — идентификация Cr³⁺"
            },

            applications: [
                "Хромовое дубление кожи",
                "Зелёные пигменты (оксид хрома(III))",
                "Катализаторы"
            ],

            safety: {
                toxicity: "Низкая токсичность (Cr³⁺)",
                ldso: ">5000 мг/кг (крысы, перорально)",
                hazardClass: "—",
                precautions: "Cr(III) малотоксичен, в отличие от Cr(VI) — канцероген!",
                environmental: "Cr(III) малоподвижен в почве"
            },

            additionalInfo: {
                mineralName: "Грималдиит (редкий)",
                historicalFacts: [
                    "Хром открыт Вокленом в 1797 году",
                    "Название от греч. chroma — цвет"
                ],
                interestingFacts: [
                    "Минимальная растворимость при pH 7-10",
                    "Растворяется при pH < 4 и pH > 11.5",
                    "Cr(III) — микроэлемент, необходимый для метаболизма глюкозы"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "Cotton F.A., Wilkinson G. Advanced Inorganic Chemistry"
            ]
        },

        "Mn2+-OH-": {
            name: "Гидроксид марганца(II)",
            formula: "Mn(OH)₂",
            molarMass: 88.95,
            oxidationStates: {
                "Mn": 2,
                "O": -2,
                "H": 1
            },
            compoundType: "Слабое основание",

            solubility: {
                status: "N",
                value: 0.0002,
                unit: "г/100 мл",
                temperature: 20,
                ksp: 1.9e-13,
                temperatureDependence: "Практически не растворим в воде",
                solubilityTable: []
            },

            appearance: {
                precipitateColor: "Белый (быстро буреет на воздухе)",
                crystalColor: "Белый или розоватый",
                solutionColor: "—",
                crystalSystem: "Гексагональная (структура брусита)",
                opticalProperties: "Быстро темнеет на воздухе",
                realLifeExample: "Промежуточный продукт в производстве батареек"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "Mn(OH)₂ → MnO + H₂O (при 140-210°C в инертной атмосфере)",
                airSensitivity: "БЫСТРО ОКИСЛЯЕТСЯ НА ВОЗДУХЕ до бурого MnOOH",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "Осаждение: MnSO₄ + 2NaOH → Mn(OH)₂↓ (белый) + Na₂SO₄",
                    "Окисление: 4Mn(OH)₂ + O₂ → 4MnOOH (бурый) + 2H₂O",
                    "С кислотами: Mn(OH)₂ + 2HCl → MnCl₂ + 2H₂O"
                ],
                analyticalUse: "Белый осадок, буреющий на воздухе — реакция на Mn²⁺"
            },

            applications: [
                "Производство аккумуляторов",
                "Катализаторы",
                "Промежуточный продукт в химической промышленности"
            ],

            safety: {
                toxicity: "Умеренно токсичен (нейротоксичность при избытке)",
                ldso: "нет данных",
                hazardClass: "—",
                precautions: "Избегать хронического воздействия (марганцевый паркинсонизм)",
                environmental: "Mn накапливается в почве"
            },

            additionalInfo: {
                mineralName: "Пирохроит (pyrochroite)",
                historicalFacts: [
                    "Марганец открыт Шееле в 1774 году"
                ],
                interestingFacts: [
                    "Подобно Fe(OH)₂, быстро окисляется на воздухе",
                    "Хроническое отравление марганцем вызывает симптомы, похожие на болезнь Паркинсона"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "Greenwood N.N., Earnshaw A. Chemistry of the Elements"
            ]
        },

        "Ni2+-OH-": {
            name: "Гидроксид никеля(II)",
            formula: "Ni(OH)₂",
            molarMass: 92.72,
            oxidationStates: {
                "Ni": 2,
                "O": -2,
                "H": 1
            },
            compoundType: "Слабое основание",

            solubility: {
                status: "N",
                value: 0.00013,
                unit: "г/100 мл",
                temperature: 20,
                ksp: 5.47e-16,
                temperatureDependence: "Практически не растворим в воде",
                solubilityTable: []
            },

            appearance: {
                precipitateColor: "Светло-зелёный студенистый",
                crystalColor: "Зелёный (от светло- до изумрудно-зелёного)",
                solutionColor: "—",
                crystalSystem: "Тригональная (β-Ni(OH)₂)",
                opticalProperties: "Характерный зелёный цвет",
                realLifeExample: "Электроды NiMH аккумуляторов (гибридные автомобили)"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "Ni(OH)₂ → NiO (чёрный) + H₂O (при 230°C)",
                airSensitivity: "Стабилен на воздухе",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "Осаждение: NiCl₂ + 2NaOH → Ni(OH)₂↓ (зелёный) + 2NaCl",
                    "С NH₃: Ni(OH)₂ + 6NH₃ → [Ni(NH₃)₆]²⁺ (синий) + 2OH⁻",
                    "Электрохимия: Ni(OH)₂ + OH⁻ ⇌ NiOOH + H₂O + e⁻"
                ],
                analyticalUse: "Зелёный осадок → синий аммиакат — качественная реакция на Ni²⁺"
            },

            applications: [
                "Электроды NiCd и NiMH аккумуляторов (ОСНОВНОЕ применение)",
                "Суперконденсаторы",
                "Катализаторы"
            ],

            safety: {
                toxicity: "Токсичен, канцероген",
                ldso: "нет данных",
                hazardClass: "—",
                precautions: "Никелевые соединения — канцерогены! Вызывают контактную аллергию",
                environmental: "Токсичен для водных организмов"
            },

            additionalInfo: {
                mineralName: "Теофрастит (theophrastite)",
                historicalFacts: [
                    "NiMH аккумуляторы изобретены в 1967 году",
                    "Широко используются в гибридных автомобилях (Toyota Prius)"
                ],
                interestingFacts: [
                    "Существует две полиморфные формы: α-Ni(OH)₂ и β-Ni(OH)₂",
                    "Ключевой компонент перезаряжаемых батарей",
                    "Никель — один из самых распространённых контактных аллергенов"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "IARC Monographs on the Evaluation of Carcinogenic Risks"
            ]
        },

        "Co2+-OH-": {
            name: "Гидроксид кобальта(II)",
            formula: "Co(OH)₂",
            molarMass: 92.95,
            oxidationStates: {
                "Co": 2,
                "O": -2,
                "H": 1
            },
            compoundType: "Слабое основание (слабо амфотерный)",

            solubility: {
                status: "N",
                value: 0.00032,
                unit: "г/100 мл",
                temperature: 20,
                ksp: 1.0e-15,
                temperatureDependence: "Практически не растворим в воде",
                solubilityTable: []
            },

            appearance: {
                precipitateColor: "Синий (α-форма) или розовый (β-форма)",
                crystalColor: "Розовый (стабильная β-форма)",
                solutionColor: "—",
                crystalSystem: "Тригональная (β-форма)",
                opticalProperties: "Синий осадок → розовый при стоянии",
                realLifeExample: "Электроды кобальтовых аккумуляторов"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "Co(OH)₂ → CoO (чёрный) + H₂O (при 168°C в вакууме)",
                airSensitivity: "Медленно окисляется на воздухе до коричневого CoOOH",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "Осаждение: CoCl₂ + 2NaOH → Co(OH)₂↓ + 2NaCl",
                    "С избытком щёлочи: Co(OH)₂ + 2OH⁻ → [Co(OH)₄]²⁻ (синий, при нагревании)",
                    "Окисление: 4Co(OH)₂ + O₂ → 4CoOOH + 2H₂O"
                ],
                analyticalUse: "Розовый/синий осадок, темнеющий на воздухе — реакция на Co²⁺"
            },

            applications: [
                "Электроды аккумуляторов",
                "Пигменты",
                "Сиккативы (ускорители высыхания красок)",
                "Катализаторы"
            ],

            safety: {
                toxicity: "Умеренно токсичен",
                ldso: "нет данных",
                hazardClass: "—",
                precautions: "Кобальт необходим (витамин B₁₂), но избыток токсичен",
                environmental: "Токсичен для водных организмов"
            },

            additionalInfo: {
                mineralName: "—",
                historicalFacts: [
                    "Кобальт открыт Брандтом в 1735 году"
                ],
                interestingFacts: [
                    "Свежий осадок синий (α-форма), при стоянии розовеет (β-форма)",
                    "Слабо амфотерен — растворяется в концентрированных щелочах",
                    "Кобальт — центральный атом витамина B₁₂"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "Cotton F.A., Wilkinson G. Advanced Inorganic Chemistry"
            ]
        },

        "Sn2+-OH-": {
            name: "Гидроксид олова(II)",
            formula: "Sn(OH)₂",
            molarMass: 152.73,
            oxidationStates: {
                "Sn": 2,
                "O": -2,
                "H": 1
            },
            compoundType: "Амфотерный гидроксид",

            solubility: {
                status: "N",
                value: 0.0001,
                unit: "г/100 мл",
                temperature: 20,
                ksp: 5.45e-27,
                temperatureDependence: "Практически не растворим в воде",
                solubilityTable: []
            },

            appearance: {
                precipitateColor: "Белый аморфный",
                crystalColor: "Белый",
                solutionColor: "—",
                crystalSystem: "—",
                opticalProperties: "Аморфный осадок",
                realLifeExample: "Лужение металлических изделий"
            },

            stability: {
                decomposition: true,
                decompositionConditions: "Sn(OH)₂ → SnO (чёрный) + H₂O (при нагревании)",
                airSensitivity: "Sn(II) легко окисляется до Sn(IV)",
                lightSensitivity: "Стабилен к свету",
                characteristicReactions: [
                    "С кислотами: Sn(OH)₂ + 2HCl → SnCl₂ + 2H₂O",
                    "С избытком щёлочи: Sn(OH)₂ + 2NaOH → Na₂[Sn(OH)₄] (станнит)",
                    "Осаждение: SnCl₂ + 2NaOH → Sn(OH)₂↓ + 2NaCl"
                ],
                analyticalUse: "Амфотерность — характерное свойство для идентификации Sn²⁺"
            },

            applications: [
                "Лужение (покрытие оловом)",
                "Катализаторы",
                "Керамическая промышленность"
            ],

            safety: {
                toxicity: "Низкая токсичность",
                ldso: "нет данных",
                hazardClass: "—",
                precautions: "Относительно безопасен",
                environmental: "Малоопасен для окружающей среды"
            },

            additionalInfo: {
                mineralName: "—",
                historicalFacts: [
                    "Олово известно с бронзового века (~3500 до н.э.)"
                ],
                interestingFacts: [
                    "Часто существует как Sn₆O₄(OH)₄ (кластерная структура)",
                    "Sn(II) — восстановитель, легко окисляется до Sn(IV)",
                    "Амфотерность подобна Pb(OH)₂ и Zn(OH)₂"
                ]
            },

            sources: [
                "CRC Handbook of Chemistry and Physics",
                "NIST Chemistry WebBook",
                "Greenwood N.N., Earnshaw A. Chemistry of the Elements"
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
