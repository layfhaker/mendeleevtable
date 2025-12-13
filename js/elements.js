const elementsData = {
  "H": {
      atomicNumber: "1",
      name: "Водород",
      atomicMass: "1.008",
      period: "1",
      group: "1",
      block: "s",
      category: "Неметалл",
      electronConfig: "1s<sup>1</sup>",
      electronegativity: "2.20",
      density: "0.00008988 г/см³",
      meltingPoint: "−259.14 °C",
      boilingPoint: "−252.87 °C",
      state: "Газ",
      color: "Бесцветный",
      discoveryYear: "1766",
      discoverer: "Генри Кавендиш",
      nameOrigin: "От греч. ὕδωρ (вода) + γεννάω (рождаю) — «рождающий воду»",
      applications: "Производство аммиака, нефтепереработка, топливные элементы, ракетное топливо, сварка, воздушные шары",
      facts: "Самый лёгкий и самый распространённый элемент во Вселенной (около 75% всей барионной массы). Имеет три изотопа с собственными названиями: протий, дейтерий и тритий."
  },

  "He": {
      atomicNumber: "2",
      name: "Гелий",
      atomicMass: "4.0026",
      period: "1",
      group: "18",
      block: "s",
      category: "Благородный газ",
      electronConfig: "1s<sup>2</sup>",
      electronegativity: "—",
      density: "0.0001785 г/см³",
      meltingPoint: "−272.20 °C (при 2.5 МПа)",
      boilingPoint: "−268.93 °C",
      state: "Газ",
      color: "Бесцветный",
      discoveryYear: "1868 (спектр), 1895 (выделен)",
      discoverer: "Жюль Жансен, Норман Локьер (спектр); Уильям Рамзай (выделение)",
      nameOrigin: "От греч. ἥλιος (helios) — «солнце», т.к. был обнаружен в спектре Солнца",
      applications: "Криогеника, охлаждение МРТ-сканеров, защитная атмосфера для сварки, воздушные шары и дирижабли, дыхательные смеси для водолазов",
      facts: "Имеет самую низкую температуру кипения среди всех элементов. Второй по распространённости элемент во Вселенной (около 24% массы). При охлаждении ниже 2.17 K становится сверхтекучим."
  },

  "Li": {
      atomicNumber: "3",
      name: "Литий",
      atomicMass: "6.94",
      period: "2",
      group: "1",
      block: "s",
      category: "Щелочной металл",
      electronConfig: "[He] 2s<sup>1</sup>",
      electronegativity: "0.98",
      density: "0.534 г/см³",
      meltingPoint: "180.50 °C",
      boilingPoint: "1342 °C",
      state: "Твёрдое",
      color: "Серебристо-белый",
      discoveryYear: "1817",
      discoverer: "Юхан Август Арфведсон",
      nameOrigin: "От греч. λίθος (lithos) — «камень»",
      applications: "Литий-ионные аккумуляторы, керамика и стекло, смазки, лекарства (стабилизатор настроения при биполярном расстройстве), ядерная энергетика",
      facts: "Самый лёгкий металл и наименее плотный твёрдый элемент. Может плавать на воде. Литий-6 используется в термоядерном оружии."
  },

  "Be": {
      atomicNumber: "4",
      name: "Бериллий",
      atomicMass: "9.0122",
      period: "2",
      group: "2",
      block: "s",
      category: "Щелочноземельный металл",
      electronConfig: "[He] 2s<sup>2</sup>",
      electronegativity: "1.57",
      density: "1.85 г/см³",
      meltingPoint: "1287 °C",
      boilingPoint: "2469 °C",
      state: "Твёрдое",
      color: "Стально-серый",
      discoveryYear: "1798 (открыт), 1828 (выделен)",
      discoverer: "Луи Воклен (открытие); Фридрих Вёлер, Антуан Бюсси (выделение)",
      nameOrigin: "От минерала берилл (греч. βήρυλλος)",
      applications: "Окна для рентгеновских трубок, аэрокосмическая промышленность, сплав бериллиевая бронза (пружины, инструменты без искр), ядерные реакторы (замедлитель нейтронов)",
      facts: "Прозрачен для рентгеновского излучения. Токсичен — вдыхание пыли вызывает бериллиоз. Драгоценные камни изумруд и аквамарин — это разновидности берилла."
  },

  "B": {
      atomicNumber: "5",
      name: "Бор",
      atomicMass: "10.81",
      period: "2",
      group: "13",
      block: "p",
      category: "Металлоид",
      electronConfig: "[He] 2s<sup>2</sup> 2p<sup>1</sup>",
      electronegativity: "2.04",
      density: "2.34 г/см³ (β-ромбоэдрический)",
      meltingPoint: "2076 °C",
      boilingPoint: "3927 °C",
      state: "Твёрдое",
      color: "Чёрный (кристаллический), коричневый (аморфный)",
      discoveryYear: "1808",
      discoverer: "Жозеф Гей-Люссак, Луи Тенар; Гемфри Дэви",
      nameOrigin: "От араб. بورق (бурак) через минерал бура",
      applications: "Стекловолокно, боросиликатное стекло (Pyrex), отбеливатели (перборат натрия), полупроводники, нитрид бора (абразив, аналог алмаза)",
      facts: "Имеет несколько аллотропов. Кристаллический бор — один из самых твёрдых материалов (9.3 по шкале Мооса). Нитрид бора имеет структуры, аналогичные графиту и алмазу.",
      allotropes: {
          amorphous: {
              name: "Аморфный бор",
              density: "1.73 г/см³",
              color: "Коричневый порошок",
              structure: "Аморфная",
              alloDiscoveryYear: "1808",
              alloDiscoverer: "Гей-Люссак, Тенар, Дэви",
              alloFacts: "Первая полученная форма бора, чистота ~50%"
          },
          betaRhombohedral: {
              name: "β-ромбоэдрический",
              density: "2.34 г/см³",
              color: "Чёрный",
              structure: "Ромбоэдрическая (106-атомная ячейка)",
              hardness: "9.3 по шкале Мооса",
              properties: "Основная стабильная форма",
              alloDiscoveryYear: "1909",
              alloDiscoverer: "Вайнтрауб",
              alloFacts: "Первая чистая кристаллическая форма бора"
          }
      },
      extraAllotropes: {
          alphaRhombohedral: {
              name: "α-ромбоэдрический",
              density: "2.46 г/см³",
              color: "Чёрный",
              structure: "Ромбоэдрическая (12-атомная ячейка)",
              properties: "Менее стабильный, образуется при низких температурах",
              alloDiscoveryYear: "1943",
              alloDiscoverer: "Лаубенгайер и др.",
              alloFacts: "Образуется при осаждении из газовой фазы при низких температурах"
          },
          tetragonal: {
              name: "Тетрагональный",
              density: "2.36 г/см³",
              color: "Тёмно-серый",
              structure: "Тетрагональная",
              properties: "Синтезируется при высоком давлении",
              alloDiscoveryYear: "1960-е",
              alloDiscoverer: "Несколько групп",
              alloFacts: "Синтезируется при давлении >10 ГПа"
          }
      }
  },

  "C": {
      atomicNumber: "6",
      name: "Углерод",
      atomicMass: "12.011",
      period: "2",
      group: "14",
      block: "p",
      category: "Неметалл",
      electronConfig: "[He] 2s<sup>2</sup> 2p<sup>2</sup>",
      electronegativity: "2.55",
      density: "2.267 г/см³ (графит)",
      meltingPoint: "Сублимирует при ~3825 °C",
      boilingPoint: "~3900 °C (сублимация)",
      state: "Твёрдое",
      color: "Чёрный (графит)",
      discoveryYear: "Известен с древности",
      discoverer: "Известен с древности",
      nameOrigin: "От лат. carbo — «уголь»",
      applications: "Сталь и чугун, алмазы, графит (карандаши, смазки, электроды), углеродное волокно, активированный уголь, графен",
      facts: "Основа всей органической химии и жизни. Четвёртый по распространённости элемент во Вселенной. При атмосферном давлении не плавится, а сублимирует.",
      // Основные аллотропы (показываются сразу)
      allotropes: {
          graphite: {
              name: "Графит",
              density: "2.267 г/см³",
              meltingPoint: "Сублимирует при ~3825 °C",
              color: "Чёрный с металлическим блеском",
              structure: "Слоистая гексагональная (sp²)",
              hardness: "1–2 по шкале Мооса",
              conductivity: "Проводник (в плоскости слоёв)",
              alloDiscoveryYear: "Известен с древности",
              alloDiscoverer: "Древние цивилизации",
              alloFacts: "Название от греч. grapho (пишу). Лавуазье доказал связь с алмазом в 1772"
          },
          diamond: {
              name: "Алмаз",
              density: "3.515 г/см³",
              meltingPoint: "~3550 °C (при высоком давлении)",
              color: "Бесцветный, прозрачный",
              structure: "Кубическая тетраэдрическая (sp³)",
              hardness: "10 по шкале Мооса",
              conductivity: "Изолятор, отличный теплопроводник",
              alloDiscoveryYear: "Известен с древности",
              alloDiscoverer: "Древняя Индия (~4 век до н.э.)",
              alloFacts: "Название от греч. adamas (непобедимый). Самый твёрдый природный материал"
          },
          graphene: {
              name: "Графен",
              density: "~0.77 мг/м² (2D)",
              color: "Прозрачный (поглощает 2.3% света)",
              structure: "Двумерная гексагональная решётка (sp²)",
              hardness: "Самый прочный известный материал",
              conductivity: "Отличный проводник",
              alloDiscoveryYear: "2004",
              alloDiscoverer: "Андрей Гейм, Константин Новосёлов",
              alloFacts: "Нобелевская премия 2010. Прочнее стали в 200 раз при толщине в 1 атом."
          },
          fullerene: {
              name: "Фуллерены (C₆₀, C₇₀)",
              density: "1.65 г/см³",
              meltingPoint: "Сублимирует при ~280 °C",
              color: "Чёрный/тёмно-коричневый",
              structure: "Молекулярная (сферы и эллипсы, sp²)",
              properties: "C₆₀ — усечённый икосаэдр, C₇₀ — эллипсоид",
              alloDiscoveryYear: "1985",
              alloDiscoverer: "Крото, Смолли, Кёрл",
              alloFacts: "Нобелевская премия 1996. Назван в честь архитектора Бакминстера Фуллера"
          }
      },
      extraAllotropes: {
          nanotube: {
              name: "Углеродные нанотрубки",
              density: "1.3–1.4 г/см³",
              color: "Чёрный",
              structure: "Цилиндрическая (свёрнутый графен, sp²)",
              properties: "Прочность в 100 раз выше стали, проводник или полупроводник",
              alloDiscoveryYear: "1991",
              alloDiscoverer: "Сумио Иидзима",
              alloFacts: "Теплопроводность выше алмаза. Потенциал для космического лифта"
          },
          lonsdaleite: {
              name: "Лонсдейлит",
              density: "3.52 г/см³",
              color: "Жёлто-коричневый",
              structure: "Гексагональная (sp³)",
              hardness: "Теоретически твёрже алмаза",
              properties: "Образуется при ударах метеоритов",
              alloDiscoveryYear: "1967",
              alloDiscoverer: "Банди, Каспер",
              alloFacts: "Назван в честь кристаллографа Кэтлин Лонсдейл. Найден в метеорите Каньон Дьябло"
          },
          amorphous: {
              name: "Аморфный углерод",
              density: "1.8–2.1 г/см³",
              color: "Чёрный",
              structure: "Неупорядоченная (смесь sp² и sp³)",
              properties: "Сажа, активированный уголь, древесный уголь",
              alloDiscoveryYear: "Известен с древности",
              alloDiscoverer: "Древние цивилизации",
              alloFacts: "Древесный уголь использовался с каменного века для рисунков и выплавки металлов"
          }
      }
  },

  "N": {
      atomicNumber: "7",
      name: "Азот",
      atomicMass: "14.007",
      period: "2",
      group: "15",
      block: "p",
      category: "Неметалл",
      electronConfig: "[He] 2s<sup>2</sup> 2p<sup>3</sup>",
      electronegativity: "3.04",
      density: "0.001251 г/см³",
      meltingPoint: "−210.00 °C",
      boilingPoint: "−195.79 °C",
      state: "Газ",
      color: "Бесцветный",
      discoveryYear: "1772",
      discoverer: "Даниэль Резерфорд",
      nameOrigin: "От греч. νίτρον (nitron — селитра) + γεννάω (рождаю)",
      applications: "Производство аммиака и удобрений, криогеника, инертная атмосфера, взрывчатые вещества, пищевая промышленность (упаковка)",
      facts: "Составляет 78% атмосферы Земли. Тройная связь N≡N — одна из самых прочных химических связей. Жидкий азот кипит при −196 °C и широко используется для охлаждения."
  },

  "O": {
      atomicNumber: "8",
      name: "Кислород",
      atomicMass: "15.999",
      period: "2",
      group: "16",
      block: "p",
      category: "Неметалл",
      electronConfig: "[He] 2s<sup>2</sup> 2p<sup>4</sup>",
      electronegativity: "3.44",
      density: "0.001429 г/см³ (O₂)",
      meltingPoint: "−218.79 °C",
      boilingPoint: "−182.96 °C",
      state: "Газ",
      color: "Бесцветный (O₂), бледно-голубой (O₃)",
      discoveryYear: "1774",
      discoverer: "Карл Шееле, Джозеф Пристли; элементарность доказана Антуаном Лавуазье",
      nameOrigin: "От греч. ὀξύς (oxys — кислый) + γεννάω (рождаю) — «рождающий кислоты»",
      applications: "Дыхание и медицина, металлургия (выплавка стали), сварка и резка, ракетное топливо, очистка воды",
      facts: "Самый распространённый элемент в земной коре (~46% по массе). Необходим для дыхания большинства организмов. Озоновый слой защищает Землю от УФ-излучения.",
      allotropes: {
          dioxygen: {
              name: "Дикислород (O₂)",
              density: "0.001429 г/см³",
              meltingPoint: "−218.79 °C",
              boilingPoint: "−182.96 °C",
              color: "Бесцветный газ, бледно-голубая жидкость",
              structure: "Двухатомная молекула",
              properties: "Парамагнитен, необходим для дыхания",
              alloDiscoveryYear: "1774",
              alloDiscoverer: "Шееле, Пристли; элементарность — Лавуазье",
              alloFacts: "21% атмосферы Земли. Необходим для дыхания и горения"
          },
          ozone: {
              name: "Озон (O₃)",
              density: "0.00214 г/см³",
              meltingPoint: "−192.2 °C",
              boilingPoint: "−112 °C",
              color: "Бледно-голубой газ",
              structure: "Трёхатомная молекула (угловая)",
              properties: "Сильный окислитель, озоновый слой",
              alloDiscoveryYear: "1839",
              alloDiscoverer: "Кристиан Шёнбейн",
              alloFacts: "Название от греч. ozein (пахнуть). Озоновый слой защищает от УФ"
          }
      },
      extraAllotropes: {
          tetraoxygen: {
              name: "Тетракислород (O₄)",
              color: "Бесцветный",
              structure: "Четырёхатомная молекула",
              properties: "Метастабильная форма при высоком давлении",
              alloDiscoveryYear: "2001",
              alloDiscoverer: "Качарич и др.",
              alloFacts: "Метастабильная молекула, существует доли секунды"
          },
          redOxygen: {
              name: "Красный кислород (O₈)",
              color: "Красный",
              structure: "Октамерные кластеры",
              properties: "Фаза при экстремальном давлении (>10 ГПа)",
              alloDiscoveryYear: "1979",
              alloDiscoverer: "Группа под давлением",
              alloFacts: "Образуется при давлении >10 ГПа, красный цвет из-за изменения электронной структуры"
          }
      }
  },

  "F": {
      atomicNumber: "9",
      name: "Фтор",
      atomicMass: "18.998",
      period: "2",
      group: "17",
      block: "p",
      category: "Галоген",
      electronConfig: "[He] 2s<sup>2</sup> 2p<sup>5</sup>",
      electronegativity: "3.98",
      density: "0.001696 г/см³",
      meltingPoint: "−219.67 °C",
      boilingPoint: "−188.11 °C",
      state: "Газ",
      color: "Бледно-жёлтый",
      discoveryYear: "1886 (выделен)",
      discoverer: "Анри Муассан",
      nameOrigin: "От лат. fluere — «течь» (из-за использования флюорита как флюса)",
      applications: "Фторирование воды, тефлон (ПТФЭ), фреоны (хладагенты), фторсодержащие лекарства, обогащение урана (UF₆)",
      facts: "Самый электроотрицательный элемент. Самый реактивный неметалл — реагирует почти со всеми веществами. Многие исследователи погибли или получили травмы при попытках его выделить."
  },

  "Ne": {
      atomicNumber: "10",
      name: "Неон",
      atomicMass: "20.180",
      period: "2",
      group: "18",
      block: "p",
      category: "Благородный газ",
      electronConfig: "[He] 2s<sup>2</sup> 2p<sup>6</sup>",
      electronegativity: "—",
      density: "0.0009002 г/см³",
      meltingPoint: "−248.59 °C",
      boilingPoint: "−246.08 °C",
      state: "Газ",
      color: "Бесцветный (светится красно-оранжевым в разряде)",
      discoveryYear: "1898",
      discoverer: "Уильям Рамзай, Моррис Трэверс",
      nameOrigin: "От греч. νέος (neos) — «новый»",
      applications: "Неоновые вывески и лампы, гелий-неоновые лазеры, криогеника, индикаторы высокого напряжения",
      facts: "Единственный благородный газ, для которого не получено ни одного стабильного соединения. Пятый по распространённости элемент во Вселенной. Неоновые лампы были изобретены в 1910 году."
  },

  // 11 - Натрий (Sodium)
  "Na": {
      atomicNumber: 11,
      symbol: "Na",
      name: "Натрий",
      atomicMass: 22.990,
      period: 3,
      group: 1,
      block: "s",
      category: "Щелочной металл",
      electronConfig: "[Ne] 3s<sup>1</sup>",
      electronegativity: 0.93,
      density: "0.968 г/см³",
      meltingPoint: "97.79 °C",
      boilingPoint: "882.94 °C",
      state: "Твёрдое",
      color: "Серебристо-белый",
      discoveryYear: "1807",
      discoverer: "Гемфри Дэви",
      nameOrigin: "От латинского natrium (сода), символ Na — от Neo-Latin natrium",
      applications: "Натриевые лампы, производство соединений натрия, теплоносители в ядерных реакторах, восстановитель в металлургии",
      facts: "Шестой по распространённости элемент в земной коре. Мягкий металл — легко режется ножом. В пламени горит характерным жёлтым цветом."
  },

  // 12 - Магний (Magnesium)
  "Mg": {
      atomicNumber: 12,
      symbol: "Mg",
      name: "Магний",
      atomicMass: 24.305,
      period: 3,
      group: 2,
      block: "s",
      category: "Щёлочноземельный металл",
      electronConfig: "[Ne] 3s<sup>2</sup>",
      electronegativity: 1.31,
      density: "1.738 г/см³",
      meltingPoint: "650 °C",
      boilingPoint: "1090 °C",
      state: "Твёрдое",
      color: "Серебристо-серый",
      discoveryYear: "1755 (обнаружен), 1808 (выделен)",
      discoverer: "Джозеф Блэк (обнаружил), Гемфри Дэви (выделил)",
      nameOrigin: "От Магнезии — района в Греции",
      applications: "Лёгкие сплавы (авиация, автомобили), пиротехника (яркое белое пламя), медицина (антациды, слабительные)",
      facts: "Восьмой по распространённости элемент в земной коре. Горит ослепительно-белым пламенем. Необходим для работы более 300 ферментов."
  },

  // 13 - Алюминий (Aluminium)
  "Al": {
      atomicNumber: 13,
      symbol: "Al",
      name: "Алюминий",
      atomicMass: 26.982,
      period: 3,
      group: 13,
      block: "p",
      category: "Постпереходный металл",
      electronConfig: "[Ne] 3s<sup>2</sup> 3p<sup>1</sup>",
      electronegativity: 1.61,
      density: "2.70 г/см³",
      meltingPoint: "660.32 °C",
      boilingPoint: "2519 °C",
      state: "Твёрдое",
      color: "Серебристо-белый",
      discoveryYear: "1825",
      discoverer: "Ханс Кристиан Эрстед",
      nameOrigin: "От латинского alumen (квасцы)",
      applications: "Авиация и автомобили, упаковка (фольга, банки), строительство, электропроводка",
      facts: "Самый распространённый металл в земной коре. Плотность в три раза меньше стали. В 1854 году стоил дороже золота."
  },

  // 14 - Кремний (Silicon)
  "Si": {
      atomicNumber: 14,
      symbol: "Si",
      name: "Кремний",
      atomicMass: 28.085,
      period: 3,
      group: 14,
      block: "p",
      category: "Металлоид",
      electronConfig: "[Ne] 3s<sup>2</sup> 3p<sup>2</sup>",
      electronegativity: 1.90,
      density: "2.329 г/см³",
      meltingPoint: "1414 °C",
      boilingPoint: "3265 °C",
      state: "Твёрдое",
      color: "Серый с голубоватым отливом",
      discoveryYear: "1824",
      discoverer: "Йёнс Якоб Берцелиус",
      nameOrigin: "От латинского silex (кремень)",
      applications: "Полупроводниковая электроника, солнечные батареи, силиконы, стекло и керамика",
      facts: "Второй по распространённости элемент в земной коре (~28%). Основа современной электроники («Кремниевая долина»).",
      allotropes: {
          crystalline: {
              name: "Кристаллический",
              density: "2.329 г/см³",
              color: "Серый с металлическим блеском",
              structure: "Алмазоподобная кубическая решётка",
              properties: "Полупроводник, основа микроэлектроники",
              alloDiscoveryYear: "1854",
              alloDiscoverer: "Анри Сент-Клер Девиль",
              alloFacts: "Первый кристаллический кремний. Основа всей современной электроники"
          },
          amorphous: {
              name: "Аморфный",
              density: "1.8–2.3 г/см³",
              color: "Коричневый/тёмно-серый",
              structure: "Неупорядоченная тетраэдрическая сетка",
              properties: "Тонкоплёночные солнечные батареи, ЖК-дисплеи",
              alloDiscoveryYear: "1824",
              alloDiscoverer: "Йёнс Якоб Берцелиус",
              alloFacts: "Первая полученная форма кремния — коричневый порошок"
          }
      },
      extraAllotropes: {
          siIII: {
              name: "Si-III (BC8)",
              density: "2.55 г/см³",
              color: "Серый",
              structure: "Кубическая (BC8)",
              properties: "Металлическая фаза, образуется при давлении >11 ГПа",
              alloDiscoveryYear: "1963",
              alloDiscoverer: "Джеймисон и др.",
              alloFacts: "Сверхпроводник при температуре ниже 7 K"
          },
          siXII: {
              name: "Si-XII (R8)",
              density: "2.53 г/см³",
              color: "Серый",
              structure: "Ромбоэдрическая (R8)",
              properties: "Полуметаллическая фаза при декомпрессии",
              alloDiscoveryYear: "1994",
              alloDiscoverer: "Кавамура и др.",
              alloFacts: "Образуется при медленном снятии давления с Si-II"
          }
      }
  },

  // 15 - Фосфор (Phosphorus)
  "P": {
      atomicNumber: 15,
      symbol: "P",
      name: "Фосфор",
      atomicMass: 30.974,
      period: 3,
      group: 15,
      block: "p",
      category: "Неметалл",
      electronConfig: "[Ne] 3s<sup>2</sup> 3p<sup>3</sup>",
      electronegativity: 2.19,
      density: "1.823 г/см³",
      meltingPoint: "44.15 °C",
      boilingPoint: "280.5 °C",
      state: "Твёрдое",
      color: "Белый/красный/чёрный",
      discoveryYear: "1669",
      discoverer: "Хенниг Бранд",
      nameOrigin: "От греческого Φωσφόρος (светоносец)",
      applications: "Удобрения (фосфаты), спички (красный фосфор), моющие средства, пестициды",
      facts: "Первый элемент, открытый научным путём. Получен Брандом при перегонке мочи. Необходим для ДНК, РНК, АТФ.",
      allotropes: {
          white: {
              name: "Белый фосфор",
              density: "1.823 г/см³",
              meltingPoint: "44.15 °C",
              boilingPoint: "280.5 °C",
              color: "Восковидный белый/жёлтый",
              structure: "Молекулярная (тетраэдры P₄)",
              properties: "Пирофорный, токсичный, светится в темноте",
              alloDiscoveryYear: "1669",
              alloDiscoverer: "Хенниг Бранд",
              alloFacts: "Первый элемент, открытый научным путём. Получен из мочи. Светится в темноте"

          },
          red: {
              name: "Красный фосфор",
              density: "2.27 г/см³",
              meltingPoint: "~590 °C (возгонка)",
              color: "Тёмно-красный",
              structure: "Полимерная аморфная",
              properties: "Стабильный, нетоксичный, используется в спичках",
              alloDiscoveryYear: "1845",
              alloDiscoverer: "Антон фон Шрёттер",
              alloFacts: "Безопасная замена белого фосфора в спичках"
          },
          black: {
              name: "Чёрный фосфор",
              density: "2.69 г/см³",
              color: "Чёрный",
              structure: "Слоистая орторомбическая",
              properties: "Наиболее стабильный, полупроводник (аналог графена)",
              alloDiscoveryYear: "1914",
              alloDiscoverer: "Перси Бриджмен",
              alloFacts: "Нобелевка Бриджмену (1946) за физику высоких давлений. Называют «фосфореном» по аналогии с графеном"

          }
      },
      extraAllotropes: {
          violet: {
              name: "Фиолетовый (Гиттторфа)",
              density: "2.36 г/см³",
              meltingPoint: "~620 °C",
              color: "Фиолетовый/пурпурный",
              structure: "Моноклинная кристаллическая",
              properties: "Игольчатые кристаллы, открыт в 1865",
              alloDiscoveryYear: "1865",
              alloDiscoverer: "Иоганн Вильгельм Гитторф",
              alloFacts: "Иногда считают кристаллической формой красного фосфора"
          },
          diphosphorus: {
              name: "Дифосфор (P₂)",
              color: "Бесцветный газ",
              structure: "Двухатомная молекула (P≡P)",
              properties: "Существует при высокой температуре (>1200°C)",
              alloDiscoveryYear: "~1900",
              alloDiscoverer: "Спектроскопические исследования",
              alloFacts: "Тройная связь P≡P, аналог N₂, но менее стабилен"
          }
      }
  },

  // 16 - Сера (Sulfur)
  "S": {
      atomicNumber: 16,
      symbol: "S",
      name: "Сера",
      atomicMass: 32.06,
      period: 3,
      group: 16,
      block: "p",
      category: "Неметалл",
      electronConfig: "[Ne] 3s<sup>2</sup> 3p<sup>4</sup>",
      electronegativity: 2.58,
      density: "2.067 г/см³",
      meltingPoint: "115.21 °C",
      boilingPoint: "444.6 °C",
      state: "Твёрдое",
      color: "Ярко-жёлтый",
      discoveryYear: "Известна с древности",
      discoverer: "Известна с древности (Лавуазье, 1777)",
      nameOrigin: "От санскритского sulvere и латинского sulphurium",
      applications: "Производство серной кислоты, вулканизация резины, удобрения, фунгициды, порох",
      facts: "Известна как «горючий камень» с библейских времён. Десятый по распространённости элемент во Вселенной. Горит синим пламенем.",
      allotropes: {
          orthorhombic: {
              name: "α-сера (ромбическая)",
              density: "2.07 г/см³",
              meltingPoint: "112.8 °C",
              color: "Жёлтые кристаллы",
              structure: "Кольца S₈",
              properties: "Стабильна ниже 95.6°C",
              alloDiscoveryYear: "Известна с древности",
              alloDiscoverer: "Древние цивилизации",
              alloFacts: "Самая стабильная форма при комнатной температуре. «Горящий камень» библейских текстов"
          },
          monoclinic: {
              name: "β-сера (моноклинная)",
              density: "1.96 г/см³",
              meltingPoint: "119.6 °C",
              color: "Игольчатые жёлтые кристаллы",
              structure: "Кольца S₈",
              properties: "Стабильна от 95.6°C до плавления",
              alloDiscoveryYear: "1823",
              alloDiscoverer: "Эйльхард Мичерлих",
              alloFacts: "Открытие полиморфизма — одно вещество, разные кристаллические формы"
          }
      },
      extraAllotropes: {
          gamma: {
              name: "γ-сера",
              density: "2.19 г/см³",
              color: "Жёлтый",
              structure: "Кольца S₈ (моноклинная)",
              properties: "Пластичная модификация",
              alloDiscoveryYear: "1891",
              alloDiscoverer: "Энгель",
              alloFacts: "Также называется «перламутровая сера» или сера Энгеля"
          },
          plastic: {
              name: "Пластическая сера",
              density: "~2.0 г/см³",
              color: "Жёлто-коричневый",
              structure: "Полимерные цепи",
              properties: "Аморфная, резиноподобная, образуется при быстром охлаждении",
              alloDiscoveryYear: "XIX век",
              alloDiscoverer: "Различные исследователи",
              alloFacts: "Образуется при выливании расплавленной серы в холодную воду"
          },
          diatomic: {
              name: "Дисера (S₂)",
              color: "Синий газ",
              structure: "Двухатомная молекула",
              properties: "Газообразная форма при T > 700°C (аналог O₂)",
              alloDiscoveryYear: "1926",
              alloDiscoverer: "Спектроскопические исследования",
              alloFacts: "Придаёт синий цвет пламени горящей серы"
          },
          rings: {
              name: "Кольцевые формы (S₆, S₇, S₁₂)",
              color: "Жёлтый",
              structure: "Кольца различного размера",
              properties: "Присутствуют в расплаве и растворах",
              alloDiscoveryYear: "1960–1980-е",
              alloDiscoverer: "Различные группы",
              alloFacts: "S₆ — оранжевый, S₇ — жёлтый, S₁₂ — бледно-жёлтый"
          }
      }
  },

  // 17 - Хлор (Chlorine)
  "Cl": {
      atomicNumber: 17,
      symbol: "Cl",
      name: "Хлор",
      atomicMass: 35.45,
      period: 3,
      group: 17,
      block: "p",
      category: "Галоген",
      electronConfig: "[Ne] 3s<sup>2</sup> 3p<sup>5</sup>",
      electronegativity: 3.16,
      density: "0.003214 г/см³",
      meltingPoint: "−101.5 °C",
      boilingPoint: "−34.04 °C",
      state: "Газ",
      color: "Жёлто-зелёный",
      discoveryYear: "1774",
      discoverer: "Карл Вильгельм Шееле",
      nameOrigin: "От греческого χλωρός — бледно-зелёный",
      applications: "Дезинфекция воды, производство ПВХ, отбеливатели, соляная кислота",
      facts: "Третья по величине электроотрицательность. Высшее сродство к электрону. Использовался как боевой газ в WWI."
  },

  // 18 - Аргон (Argon)
  "Ar": {
      atomicNumber: 18,
      symbol: "Ar",
      name: "Аргон",
      atomicMass: 39.948,
      period: 3,
      group: 18,
      block: "p",
      category: "Благородный газ",
      electronConfig: "[Ne] 3s<sup>2</sup> 3p<sup>6</sup>",
      electronegativity: "—",
      density: "0.001784 г/см³",
      meltingPoint: "−189.34 °C",
      boilingPoint: "−185.85 °C",
      state: "Газ",
      color: "Бесцветный",
      discoveryYear: "1894",
      discoverer: "Лорд Рэлей и Уильям Рамзай",
      nameOrigin: "От греческого ἀργός — ленивый, неактивный",
      applications: "Защитный газ при сварке, лампы накаливания, аргоновые лазеры, консервация документов",
      facts: "Третий по распространённости газ в атмосфере (0.934%). Самый распространённый благородный газ на Земле."
  },

  // 19 - Калий (Potassium)
  "K": {
      atomicNumber: 19,
      symbol: "K",
      name: "Калий",
      atomicMass: 39.098,
      period: 4,
      group: 1,
      block: "s",
      category: "Щелочной металл",
      electronConfig: "[Ar] 4s<sup>1</sup>",
      electronegativity: 0.82,
      density: "0.862 г/см³",
      meltingPoint: "63.5 °C",
      boilingPoint: "759 °C",
      state: "Твёрдое",
      color: "Серебристо-белый",
      discoveryYear: "1807",
      discoverer: "Гемфри Дэви",
      nameOrigin: "От слова potash; символ K — от латинского kalium",
      applications: "Удобрения (95% производства), стекло, мыловарение, пиротехника",
      facts: "Второй по лёгкости металл. Бурно реагирует с водой. Горит лиловым пламенем. Жизненно важен для клеток."
  },

  // 20 - Кальций (Calcium)
  "Ca": {
      atomicNumber: 20,
      symbol: "Ca",
      name: "Кальций",
      atomicMass: 40.078,
      period: 4,
      group: 2,
      block: "s",
      category: "Щёлочноземельный металл",
      electronConfig: "[Ar] 4s<sup>2</sup>",
      electronegativity: 1.00,
      density: "1.55 г/см³",
      meltingPoint: "842 °C",
      boilingPoint: "1484 °C",
      state: "Твёрдое",
      color: "Серебристо-жёлтый",
      discoveryYear: "1808",
      discoverer: "Гемфри Дэви",
      nameOrigin: "От латинского calx (известь)",
      applications: "Цемент и известь, металлургия, аккумуляторы, пищевые добавки, медицина",
      facts: "Пятый по распространённости элемент в земной коре. Самый распространённый металл в организме человека. Необходим для костей и зубов."
  }

};
