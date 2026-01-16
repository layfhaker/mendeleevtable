// =========================================
// LOADER.JS — Анимация загрузки с химическими формулами
// =========================================

(function () {
    'use strict';

    // === БАЗА ФОРМУЛ ===
    // Из таблицы растворимости + известные вещества
    const chemicalFormulas = [
        // Кислоты
        { formula: 'H₂SO₄', name: 'Серная кислота' },
        { formula: 'HNO₃', name: 'Азотная кислота' },
        { formula: 'HCl', name: 'Соляная кислота' },
        { formula: 'H₃PO₄', name: 'Фосфорная кислота' },
        { formula: 'H₂CO₃', name: 'Угольная кислота' },
        { formula: 'CH₃COOH', name: 'Уксусная кислота' },
        { formula: 'HF', name: 'Плавиковая кислота' },
        { formula: 'HBr', name: 'Бромоводородная' },
        { formula: 'H₂S', name: 'Сероводород' },
        { formula: 'HCN', name: 'Синильная кислота' },

        // Основания
        { formula: 'NaOH', name: 'Едкий натр' },
        { formula: 'KOH', name: 'Едкое кали' },
        { formula: 'Ca(OH)₂', name: 'Гашёная известь' },
        { formula: 'Ba(OH)₂', name: 'Баритовая вода' },
        { formula: 'Al(OH)₃', name: 'Гидроксид алюминия' },
        { formula: 'Fe(OH)₃', name: 'Ржавчина' },
        { formula: 'Cu(OH)₂', name: 'Гидроксид меди' },
        { formula: 'Mg(OH)₂', name: 'Молоко магнезии' },
        { formula: 'Zn(OH)₂', name: 'Гидроксид цинка' },
        { formula: 'NH₄OH', name: 'Нашатырный спирт' },

        // Соли — хлориды
        { formula: 'NaCl', name: 'Поваренная соль' },
        { formula: 'KCl', name: 'Хлорид калия' },
        { formula: 'CaCl₂', name: 'Хлорид кальция' },
        { formula: 'MgCl₂', name: 'Бишофит' },
        { formula: 'FeCl₃', name: 'Хлорид железа' },
        { formula: 'AlCl₃', name: 'Хлорид алюминия' },
        { formula: 'ZnCl₂', name: 'Хлорид цинка' },
        { formula: 'AgCl', name: 'Хлорид серебра' },
        { formula: 'NH₄Cl', name: 'Нашатырь' },

        // Соли — сульфаты
        { formula: 'CuSO₄', name: 'Медный купорос' },
        { formula: 'FeSO₄', name: 'Железный купорос' },
        { formula: 'ZnSO₄', name: 'Цинковый купорос' },
        { formula: 'MgSO₄', name: 'Английская соль' },
        { formula: 'BaSO₄', name: 'Барит' },
        { formula: 'CaSO₄', name: 'Гипс' },
        { formula: 'Na₂SO₄', name: 'Глауберова соль' },
        { formula: 'K₂SO₄', name: 'Сульфат калия' },
        { formula: 'Al₂(SO₄)₃', name: 'Сульфат алюминия' },

        // Соли — нитраты
        { formula: 'KNO₃', name: 'Калийная селитра' },
        { formula: 'NaNO₃', name: 'Чилийская селитра' },
        { formula: 'AgNO₃', name: 'Ляпис' },
        { formula: 'Ca(NO₃)₂', name: 'Кальциевая селитра' },
        { formula: 'Pb(NO₃)₂', name: 'Нитрат свинца' },
        { formula: 'Cu(NO₃)₂', name: 'Нитрат меди' },
        { formula: 'Fe(NO₃)₃', name: 'Нитрат железа' },
        { formula: 'NH₃NO₃', name: 'Аммиачная селитра' },

        // Соли — карбонаты
        { formula: 'CaCO₃', name: 'Мел' },
        { formula: 'Na₂CO₃', name: 'Кальцинированная сода' },
        { formula: 'NaHCO₃', name: 'Пищевая сода' },
        { formula: 'K₂CO₃', name: 'Поташ' },
        { formula: 'MgCO₃', name: 'Магнезит' },
        { formula: 'BaCO₃', name: 'Витерит' },
        { formula: 'PbCO₃', name: 'Церуссит' },
        { formula: 'ZnCO₃', name: 'Смитсонит' },

        // Соли — другие
        { formula: 'KMnO₄', name: 'Марганцовка' },
        { formula: 'K₂Cr₂O₇', name: 'Хромпик' },
        { formula: 'K₂CrO₄', name: 'Хромат калия' },
        { formula: 'Na₂S', name: 'Сульфид натрия' },
        { formula: 'FeS', name: 'Пирит' },
        { formula: 'CuS', name: 'Ковеллин' },
        { formula: 'PbS', name: 'Галенит' },
        { formula: 'ZnS', name: 'Сфалерит' },
        { formula: 'Ag₂S', name: 'Аргентит' },
        { formula: 'Na₃PO₄', name: 'Фосфат натрия' },
        { formula: 'Ca₃(PO₄)₂', name: 'Фосфорит' },

        // Оксиды
        { formula: 'H₂O', name: 'Вода' },
        { formula: 'CO₂', name: 'Углекислый газ' },
        { formula: 'SO₂', name: 'Сернистый газ' },
        { formula: 'SO₃', name: 'Серный ангидрид' },
        { formula: 'NO₂', name: 'Бурый газ' },
        { formula: 'N₂O', name: 'Веселящий газ' },
        { formula: 'CO', name: 'Угарный газ' },
        { formula: 'Fe₂O₃', name: 'Гематит' },
        { formula: 'Fe₃O₄', name: 'Магнетит' },
        { formula: 'Al₂O₃', name: 'Корунд' },
        { formula: 'SiO₂', name: 'Кварц' },
        { formula: 'CaO', name: 'Негашёная известь' },
        { formula: 'MgO', name: 'Жжёная магнезия' },
        { formula: 'ZnO', name: 'Цинковые белила' },
        { formula: 'CuO', name: 'Оксид меди' },
        { formula: 'TiO₂', name: 'Титановые белила' },

        // Органика
        { formula: 'C₂H₅OH', name: 'Этиловый спирт' },
        { formula: 'CH₃OH', name: 'Метиловый спирт' },
        { formula: 'C₆H₁₂O₆', name: 'Глюкоза' },
        { formula: 'C₁₂H₂₂O₁₁', name: 'Сахароза' },
        { formula: 'CH₄', name: 'Метан' },
        { formula: 'C₂H₆', name: 'Этан' },
        { formula: 'C₃H₈', name: 'Пропан' },
        { formula: 'C₂H₄', name: 'Этилен' },
        { formula: 'C₂H₂', name: 'Ацетилен' },
        { formula: 'C₆H₆', name: 'Бензол' },
        { formula: 'C₆H₅OH', name: 'Фенол' },
        { formula: 'HCHO', name: 'Формальдегид' },
        { formula: 'CH₃CHO', name: 'Ацетальдегид' },
        { formula: '(CH₃)₂CO', name: 'Ацетон' },

        // Газы
        { formula: 'NH₃', name: 'Аммиак' },
        { formula: 'Cl₂', name: 'Хлор' },
        { formula: 'O₃', name: 'Озон' },
        { formula: 'H₂', name: 'Водород' },
        { formula: 'O₂', name: 'Кислород' },
        { formula: 'N₂', name: 'Азот' },
    ];

    // === ПЕРЕМЕННЫЕ ===
    let currentFormulaIndex = 0;
    let formulaInterval = null;
    let progressValue = 0;
    let isLoaderActive = true;

    // === СОЗДАНИЕ HTML СТРУКТУРЫ ===
    function createLoaderHTML() {
        const loader = document.createElement('div');
        loader.id = 'loading-screen';

        loader.innerHTML = `
            <!-- Частицы фона -->
            <div class="loader-particles" id="loader-particles"></div>
            
            <!-- Формула -->
            <div class="formula-container">
                <div class="loader-orbits">
                    <div class="orbit-ring orbit-ring-1"><div class="orbit-dot"></div></div>
                    <div class="orbit-ring orbit-ring-2"><div class="orbit-dot"></div></div>
                    <div class="orbit-ring orbit-ring-3"><div class="orbit-dot"></div></div>
                </div>
                
                <div class="formula-box">
                    <div class="formula-text formula-typing" id="formula-display"></div>
                </div>
                <div class="formula-name" id="formula-name"></div>
            </div>
            
            <!-- Прогресс -->
            <div class="loader-progress-section">
                <div class="loader-progress-bar">
                    <div class="loader-progress-fill" id="loader-progress-fill"></div>
                </div>
                <div class="loader-progress-text">Загрузка модулей</div>
                <div class="loader-progress-percent" id="loader-progress-percent">0%</div>
            </div>
        `;

        document.body.insertBefore(loader, document.body.firstChild);

        // Создаём частицы
        createParticles();

        // Показываем первую формулу
        showRandomFormula();

        // Запускаем смену формул
        startFormulaRotation();
    }

    // === СОЗДАНИЕ ЧАСТИЦ ===
    function createParticles() {
        const container = document.getElementById('loader-particles');
        if (!container) return;

        const particleCount = window.innerWidth < 600 ? 15 : 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'loader-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';
            particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
            container.appendChild(particle);
        }
    }

    // === ПОКАЗАТЬ СЛУЧАЙНУЮ ФОРМУЛУ ===
    function showRandomFormula() {
        const formulaEl = document.getElementById('formula-display');
        const nameEl = document.getElementById('formula-name');

        if (!formulaEl || !nameEl) return;

        // Выбираем случайную формулу
        const randomIndex = Math.floor(Math.random() * chemicalFormulas.length);
        const compound = chemicalFormulas[randomIndex];

        // Сбрасываем анимацию
        formulaEl.style.animation = 'none';
        nameEl.style.animation = 'none';

        // Форсируем reflow
        void formulaEl.offsetWidth;
        void nameEl.offsetWidth;

        // Устанавливаем формулу
        formulaEl.textContent = compound.formula;
        nameEl.textContent = compound.name;

        // Вычисляем длительность печати (50мс на символ)
        const charCount = compound.formula.length;
        const typingDuration = Math.max(0.8, charCount * 0.08);

        // Устанавливаем CSS переменные
        formulaEl.style.setProperty('--chars', charCount);
        formulaEl.style.setProperty('--typing-duration', typingDuration + 's');

        // Запускаем анимации
        formulaEl.style.animation = `
            loader-typing ${typingDuration}s steps(${charCount}, end) forwards,
            loader-blink 0.7s step-end infinite,
            gradient-shift 3s linear infinite
        `;
        nameEl.style.animation = `loader-fade-in 0.5s ease-out ${typingDuration * 0.7}s forwards`;
    }

    // === РОТАЦИЯ ФОРМУЛ ===
    function startFormulaRotation() {
        formulaInterval = setInterval(() => {
            if (isLoaderActive) {
                showRandomFormula();
            }
        }, 3000);
    }

    // === ОБНОВЛЕНИЕ ПРОГРЕССА ===
    function updateProgress(percent) {
        const fill = document.getElementById('loader-progress-fill');
        const text = document.getElementById('loader-progress-percent');

        progressValue = Math.min(100, Math.max(0, percent));

        if (fill) fill.style.width = progressValue + '%';
        if (text) text.textContent = Math.round(progressValue) + '%';
    }

    // === СКРЫТИЕ ЛОАДЕРА ===
    function hideLoader() {
        isLoaderActive = false;

        if (formulaInterval) {
            clearInterval(formulaInterval);
            formulaInterval = null;
        }

        const loader = document.getElementById('loading-screen');
        if (!loader) return;

        // Устанавливаем 100%
        updateProgress(100);

        // Анимация исчезновения
        setTimeout(() => {
            loader.classList.add('fade-out');

            setTimeout(() => {
                loader.classList.add('hidden');
                // Можно удалить элемент для экономии памяти
                // loader.remove();
            }, 500);
        }, 300);
    }

    // === СИСТЕМА ИНИЦИАЛИЗАЦИИ МОДУЛЕЙ ===
    const modulesQueue = [];
    let initializedModules = 0;
    let totalModules = 0;

    // Функция для регистрации модуля
    function registerModule(name, initFunction) {
        modulesQueue.push({ name, initFunction });
        totalModules++;
        updateProgress(0); // Обновляем прогресс
    }

    // Функция для инициализации модулей
    function showLoader() {
        const loader = document.getElementById('loading-screen');
        if (!loader) return;

        loader.classList.remove('hidden', 'fade-out');
        loader.style.display = 'flex'; // Гарантируем отображение
        isLoaderActive = true;

        // Сбрасываем прогресс
        updateProgress(0);
        const progressText = document.querySelector('.loader-progress-text');
        if (progressText) progressText.textContent = 'Генерация...';

        // Запускаем анимацию, если она остановлена
        if (!formulaInterval) {
            showRandomFormula();
            startFormulaRotation();
        }
    }

    async function initializeModules() {
        if (modulesQueue.length === 0) {
            // Если нет зарегистрированных модулей, просто скрываем лоадер
            setTimeout(hideLoader, 500);
            return;
        }

        for (const module of modulesQueue) {
            try {
                console.log(`Initializing module: ${module.name}`);
                await module.initFunction();
                initializedModules++;

                // Обновляем прогресс
                const progress = (initializedModules / totalModules) * 100;
                updateProgress(progress);

                console.log(`${module.name} initialized successfully`);
            } catch (error) {
                console.error(`Error initializing module ${module.name}:`, error);
            }
        }

        // Скрываем лоадер после инициализации всех модулей
        setTimeout(hideLoader, 500);
    }

    // === ЭКСПОРТ ФУНКЦИЙ ===
    window.ChemLoader = {
        updateProgress: updateProgress,
        hide: hideLoader,
        show: showLoader,
        showFormula: showRandomFormula,
        registerModule: registerModule,
        initializeModules: initializeModules
    };

    // === ИНИЦИАЛИЗАЦИЯ ===
    // Создаём лоадер сразу при загрузке скрипта
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createLoaderHTML);
    } else {
        createLoaderHTML();
    }

})();
