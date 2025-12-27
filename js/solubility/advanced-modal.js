// =========================================
// ADVANCED-MODAL.JS — Модальное окно продвинутого режима
// Показывает детальную информацию о веществе
// =========================================
// Добавить в глобальную область видимости (например, в начало advanced-modal.js)
function normalizeFormula(formula) {
    return formula
        .replace(/⁺/g, '+')
        .replace(/⁻/g, '-')
        .replace(/⁰/g, '0')
        .replace(/¹/g, '1')
        .replace(/²/g, '2')
        .replace(/³/g, '3')
        .replace(/⁴/g, '4')
        .replace(/₅/g, '5')
        .replace(/₆/g, '6')
        .replace(/₇/g, '7')
        .replace(/₈/g, '8')
        .replace(/₉/g, '9');
}
window.normalizeFormula = normalizeFormula; // Делаем доступной везде
// Режим продвинутого просмотра (одинарный клик = модалка)
// ДЕЛАЕМ ПЕРЕМЕННУЮ ГЛОБАЛЬНОЙ (через window)
window.isAdvancedClickMode = false;

function initAdvancedModeButton() {
    const btn = document.getElementById('advanced-mode-info-btn');
    if (!btn) return;

    // --- ДОБАВИТЬ ЭТОТ БЛОК ---
    // Синхронизируем вид кнопки с текущим состоянием переменной
    btn.classList.toggle('active', window.isAdvancedClickMode);
    btn.title = window.isAdvancedClickMode
            ? '✅ Режим включён — кликните на ячейку для информации'
            : '💡 Включить режим просмотра информации';
    // ---------------------------

    btn.onclick = () => {
        window.isAdvancedClickMode = !window.isAdvancedClickMode;
        btn.classList.toggle('active', window.isAdvancedClickMode);
        // ... обновление title ...
    };
}

// ... остальной код (функции openAdvancedModal и так глобальны, их трогать не обязательно, но можно тоже добавить window.)

// Глобальные переменные
const advancedModal = document.getElementById('advanced-substance-modal');
const advancedModalContent = document.getElementById('advanced-substance-content');
let currentSubstanceKey = null;

// Открытие модального окна с информацией о веществе
function openAdvancedModal(cationFormula, anionFormula) {
    // Формируем ключ для поиска в базе данных
    const substanceKey = `${normalizeFormula(cationFormula)}-${normalizeFormula(anionFormula)}`;
    currentSubstanceKey = substanceKey;

    // Получаем данные из substances-data.js
    const substanceData = substancesData[substanceKey];

    if (!substanceData) {
        // Если данных нет, показываем заглушку
        renderNoDataPlaceholder(cationFormula, anionFormula);
    } else {
        // Рендерим полную информацию
        renderAdvancedContent(substanceData, cationFormula, anionFormula);
    }

    // Показываем модальное окно
    advancedModal.style.display = 'flex';
    document.body.classList.add('advanced-modal-open');
}

// Закрытие модального окна
function closeAdvancedModal() {
    advancedModal.style.display = 'none';
    document.body.classList.remove('advanced-modal-open');
    currentSubstanceKey = null;
}

// Рендеринг содержимого модального окна (Безопасная версия)
function renderAdvancedContent(data, cation, anion) {
    // Вспомогательная функция для проверки массивов
    const hasArray = (arr) => Array.isArray(arr) && arr.length > 0;

    // Безопасное получение свойств (если свойства нет, вернёт пустую строку или прочерк)
    const getVal = (val, fallback = '—') => val ? val : fallback;

    const html = `
        <div class="advanced-header">
            <div class="advanced-title-group">
                <h2>${data.formula || `${cation}${anion}`}</h2>
                <p class="substance-name">${data.name || 'Название не указано'}</p>
                <span class="compound-type">${getVal(data.compoundType)}</span>
            </div>
            <button class="copy-formula-btn" onclick="copyFormula('${data.formula || ''}')" title="Копировать формулу">
                📋
            </button>
        </div>

        <div class="advanced-tabs">
            <button class="tab-btn active" onclick="switchAdvancedTab('chemistry')">Химия</button>
            <button class="tab-btn" onclick="switchAdvancedTab('solubility')">Растворимость</button>
            <button class="tab-btn" onclick="switchAdvancedTab('appearance')">Внешний вид</button>
            <button class="tab-btn" onclick="switchAdvancedTab('reactions')">Реакции</button>
            <button class="tab-btn" onclick="switchAdvancedTab('applications')">Применение</button>
        </div>

        <div class="advanced-content">
            <div id="tab-chemistry" class="tab-content active">
                <h3>Химическая информация</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">Формула:</span>
                        <span class="value">${data.formula || '—'}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Молярная масса:</span>
                        <span class="value">${getVal(data.molarMass)} г/моль</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Тип соединения:</span>
                        <span class="value">${getVal(data.compoundType)}</span>
                    </div>
                </div>

                <h4>Степени окисления</h4>
                <div class="oxidation-states">
                    ${data.oxidationStates ? Object.entries(data.oxidationStates).map(([elem, state]) =>
                        `<span class="oxidation-badge">${elem}: ${state > 0 ? '+' : ''}${state}</span>`
                    ).join('') : '—'}
                </div>
            </div>

            <div id="tab-solubility" class="tab-content">
                <h3>Растворимость</h3>
                <div class="solubility-status ${data.solubility?.status || ''}">
                    ${(data.solubility?.status === 'R' ? 'Растворимо' :
                      data.solubility?.status === 'N' ? 'Нерастворимо' :
                      data.solubility?.status === 'M' ? 'Малорастворимо' :
                      data.solubility?.status === 'D' ? 'Разлагается' : 'Нет данных')}
                </div>

                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">Растворимость:</span>
                        <span class="value">${getVal(data.solubility?.value)} ${getVal(data.solubility?.unit, '')} ${data.solubility?.temperature ? `(${data.solubility.temperature}°C)` : ''}</span>
                    </div>
                    ${data.solubility?.ksp ? `
                        <div class="info-item">
                            <span class="label">K<sub>sp</sub>:</span>
                            <span class="value">${data.solubility.ksp.toExponential(2)}</span>
                        </div>
                    ` : ''}
                </div>

                ${data.solubility?.temperatureDependence ? `
                    <p class="temp-dependence"><strong>Зависимость от температуры:</strong> ${data.solubility.temperatureDependence}</p>
                ` : ''}

                ${hasArray(data.solubility?.solubilityTable) ? `
                    <h4>Растворимость при разных температурах</h4>
                    <table class="solubility-table-data">
                        <thead>
                            <tr>
                                <th>Температура, °C</th>
                                <th>Растворимость, г/100 мл</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.solubility.solubilityTable.map(row => `
                                <tr>
                                    <td>${row.temp}</td>
                                    <td>${row.value}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : ''}
            </div>

            <div id="tab-appearance" class="tab-content">
                <h3>Цвет и внешний вид</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">Цвет осадка:</span>
                        <span class="value">${getVal(data.appearance?.precipitateColor)}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Цвет кристаллов:</span>
                        <span class="value">${getVal(data.appearance?.crystalColor)}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Кристаллическая система:</span>
                        <span class="value">${getVal(data.appearance?.crystalSystem)}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Оптические свойства:</span>
                        <span class="value">${getVal(data.appearance?.opticalProperties)}</span>
                    </div>
                </div>

                ${data.appearance?.realLifeExample ? `
                    <div class="real-life-example">
                        <strong>💡 Пример из жизни:</strong> ${data.appearance.realLifeExample}
                    </div>
                ` : ''}
            </div>

            <div id="tab-reactions" class="tab-content">
                <h3>Стабильность и реакции</h3>

                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">Разложение:</span>
                        <span class="value">${data.stability?.decomposition ? 'Да' : 'Нет'}</span>
                    </div>
                    ${data.stability?.decompositionConditions ? `
                        <div class="info-item full-width">
                            <span class="label">Условия:</span>
                            <span class="value">${data.stability.decompositionConditions}</span>
                        </div>
                    ` : ''}
                    <div class="info-item">
                        <span class="label">Устойчивость на воздухе:</span>
                        <span class="value">${getVal(data.stability?.airSensitivity)}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Светочувствительность:</span>
                        <span class="value">${getVal(data.stability?.lightSensitivity)}</span>
                    </div>
                </div>

                ${hasArray(data.stability?.characteristicReactions) ? `
                    <h4>Характерные реакции</h4>
                    <ul class="reactions-list">
                        ${data.stability.characteristicReactions.map(reaction =>
                            `<li>${reaction}</li>`
                        ).join('')}
                    </ul>
                ` : ''}

                ${data.stability?.analyticalUse ? `
                    <div class="analytical-use">
                        <strong>⚗️ Аналитическое применение:</strong> ${data.stability.analyticalUse}
                    </div>
                ` : ''}
            </div>

            <div id="tab-applications" class="tab-content">
                <h3>Применение</h3>
                ${hasArray(data.applications) ? `
                    <ul class="applications-list">
                        ${data.applications.map(app => `<li>${app}</li>`).join('')}
                    </ul>
                ` : '<p>Информация о применении отсутствует.</p>'}

                <h3>Безопасность</h3>
                <div class="safety-info">
                    <div class="safety-item">
                        <span class="label">Токсичность:</span>
                        <span class="value">${getVal(data.safety?.toxicity)}</span>
                    </div>
                    ${data.safety?.ldso ? `
                        <div class="safety-item">
                            <span class="label">LD₅₀:</span>
                            <span class="value">${data.safety.ldso}</span>
                        </div>
                    ` : ''}
                    <div class="safety-item">
                        <span class="label">Класс опасности:</span>
                        <span class="value">${getVal(data.safety?.hazardClass)}</span>
                    </div>
                    <div class="safety-item">
                        <span class="label">Меры предосторожности:</span>
                        <span class="value">${getVal(data.safety?.precautions)}</span>
                    </div>
                    <div class="safety-item">
                        <span class="label">Экология:</span>
                        <span class="value">${getVal(data.safety?.environmental)}</span>
                    </div>
                </div>

                ${hasArray(data.additionalInfo?.interestingFacts) ? `
                    <h3>Интересные факты</h3>
                    <ul class="facts-list">
                        ${data.additionalInfo.interestingFacts.map(fact => `<li>${fact}</li>`).join('')}
                    </ul>
                ` : ''}

                ${hasArray(data.sources) ? `
                    <div class="sources">
                        <strong>📚 Источники:</strong>
                        <ul>
                            ${data.sources.map(source => `<li>${source}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    advancedModalContent.innerHTML = html;
}

// Заглушка при отсутствии данных
function renderNoDataPlaceholder(cation, anion) {
    advancedModalContent.innerHTML = `
        <div class="no-data-placeholder">
            <h2>Данные пока отсутствуют</h2>
            <p>Детальная информация о веществе <strong>${cation} + ${anion}</strong> будет добавлена позже.</p>
            <p class="help-text">Вы можете помочь проекту, предоставив информацию через GitHub.</p>
        </div>
    `;
}

// Переключение вкладок
function switchAdvancedTab(tabName) {
    // Убираем активный класс со всех вкладок и контента
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Добавляем активный класс к выбранной вкладке
    event.target.classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

// Копирование формулы в буфер обмена
function copyFormula(formula) {
    navigator.clipboard.writeText(formula).then(() => {
        // Показываем уведомление
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 1000);
    });
}

// Закрытие модального окна при клике вне его
window.addEventListener('click', (event) => {
    if (event.target === advancedModal) {
        closeAdvancedModal();
    }
});
