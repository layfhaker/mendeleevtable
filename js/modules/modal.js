// =========================================
// МОДУЛЬ: МОДАЛЬНОЕ ОКНО
// С поддержкой FLIP-анимаций
// =========================================

// =========================================
// Функция сворачивания/разворачивания секций
// =========================================
function toggleSection(groupName) {
    const section = document.querySelector(`.info-group.${groupName}`);
    const content = document.querySelector(`.info-group.${groupName} .group-content`);
    const title = document.querySelector(`.info-group.${groupName} .group-title`);

    if (!content || !section || !title) return;

    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        section.classList.remove('collapsed');
        title.innerHTML = title.innerHTML.replace('▼', '▶ ');
    }
    else {
        content.classList.add('collapsed');
        section.classList.add('collapsed');
        title.innerHTML = title.innerHTML.replace('▶ ', '▼ ');
    }
}

// =========================================
// Глобальные переменные
// =========================================
const modal = document.getElementById("modal");
const closeBtn = document.getElementsByClassName("close")[0];
const elementInfo = document.getElementById("element-info");
const elementTitle = document.getElementById("element-title");
const tabsPlaceholder = document.getElementById("allotrope-tabs-placeholder");

let lastClickedElement = null;
let extraAllotropesExpanded = false; // Флаг: показаны ли дополнительные аллотропы

// =========================================
// Рендеринг содержимого модального окна
// =========================================
function renderModalContent(data) {
    // Сохраняем данные текущего элемента для экспорта в PDF
    window.currentElementData = data;

    // 1. ЗАПОМИНАЕМ ТЕКУЩЕЕ СОСТОЯНИЕ (какие секции свернуты)
    const currentStates = {};
    document.querySelectorAll('.info-group').forEach(group => {
        const type = group.classList[1];
        if (type) {
            currentStates[type] = group.classList.contains('collapsed');
        }

    });

    // Формируем HTML для физических свойств
    let physicalContentHTML = `
        <p><strong>Плотность:</strong> ${data.density || '—'}</p>
        <p><strong>Температура плавления:</strong> ${data.meltingPoint || '—'}</p>
        <p><strong>Температура кипения:</strong> ${data.boilingPoint || '—'}</p>
        <p><strong>Состояние (20°C):</strong> ${data.state || '—'}</p>
        <p><strong>Цвет:</strong> ${data.color || '—'}</p>
    `;

    if (data.structure) physicalContentHTML += `<p class="allo-specific"><strong>Структура:</strong> ${data.structure}</p>`;
    if (data.hardness) physicalContentHTML += `<p class="allo-specific"><strong>Твёрдость:</strong> ${data.hardness}</p>`;
    if (data.conductivity) physicalContentHTML += `<p class="allo-specific"><strong>Проводимость:</strong> ${data.conductivity}</p>`;
    if (data.properties) physicalContentHTML += `<p class="allo-specific"><strong>Свойства:</strong> ${data.properties}</p>`;

    // Обработка applications и facts (могут быть массивами или строками)
    const applicationsText = Array.isArray(data.applications)
        ? data.applications.join(', ')
        : (data.applications || '—');

    const factsText = Array.isArray(data.facts)
        ? data.facts.join(' ')
        : (data.facts || '—');

    const previewConfig = typeof window.getElectronConfigPreview === 'function'
        ? window.getElectronConfigPreview(data)
        : (data.electronConfigShort || data.electronConfig || '-');
    const electronConfigRow = `<p class="electron-config-row electron-config-trigger" data-electron-config="true" tabindex="0" role="button" title="Открыть электронную конфигурацию">
            <strong>Электронная конфигурация:</strong>
            <span class="electron-config-value">${previewConfig}</span>
            <span class="electron-config-action">Открыть</span>
        </p>`;

    // Рендерим HTML
    elementInfo.innerHTML = `
        <div class="groups-container">
            <section class="info-group basic">
                <h3 class="group-title" onclick="toggleSection('basic')">▶ Базовая информация</h3>
                <div class="group-content">
                    <p><strong>Номер:</strong> ${data.atomicNumber || '—'}</p>
                    <p><strong>Масса:</strong> ${data.atomicMass || '—'}</p>
                    <p><strong>Период:</strong> ${data.period || '—'}</p>
                    <p><strong>Группа:</strong> ${data.group || '—'}</p>
                    <p><strong>Блок:</strong> ${data.block || '—'}</p>
                    <p><strong>Категория:</strong> ${data.category || '—'}</p>
                    ${electronConfigRow}
                    <p><strong>Электроотрицательность:</strong> ${data.electronegativity || '—'}</p>
                </div>
            </section>
            <section class="info-group physical">
                <h3 class="group-title" onclick="toggleSection('physical')">▶ Физические свойства</h3>
                <div class="group-content">
                    ${physicalContentHTML}
                </div>
            </section>
            <section class="info-group history">
                <h3 class="group-title" onclick="toggleSection('history')">▶ История и практика</h3>
                <div class="group-content">
                    <p><strong>Год открытия элемента:</strong> ${data.discoveryYear || '—'}</p>
                    <p><strong>Кто открыл элемент:</strong> ${data.discoverer || '—'}</p>
                    ${data.alloDiscoveryYear ? `<p><strong>Год открытия формы:</strong> ${data.alloDiscoveryYear}</p>` : ''}
                    ${data.alloDiscoverer ? `<p><strong>Кто открыл форму:</strong> ${data.alloDiscoverer}</p>` : ''}
                    <p><strong>Происхождение названия:</strong> ${data.nameOrigin || '—'}</p>
                    <p><strong>Области применения:</strong> ${applicationsText}</p>
                </div>
            </section>
            <section class="info-group facts">
                <h3 class="group-title" onclick="toggleSection('facts')">▶ Интересные факты</h3>
                <div class="group-content">
                    <p>${factsText}</p>
                    ${data.alloFacts ? `<p><strong>Об этой форме:</strong> ${data.alloFacts}</p>` : ''}
                </div>
            </section>
                </div>
            </section>
        </div>
    `;

    // 2. ВОССТАНАВЛИВАЕМ СОСТОЯНИЕ
    Object.keys(currentStates).forEach(type => {
        if (currentStates[type] === true) {
            const section = document.querySelector(`.info-group.${type}`);
            const content = document.querySelector(`.info-group.${type} .group-content`);
            const title = document.querySelector(`.info-group.${type} .group-title`);

            if (section && content && title) {
                section.classList.add('collapsed');
                content.classList.add('collapsed');
                title.innerHTML = title.innerHTML.replace('▶ ', '▼ ');
            }
        }
    });
}

// =========================================
// Функция создания табов аллотропов
// =========================================
function createAllotropeTabs(mainData) {
    tabsPlaceholder.innerHTML = '';
    extraAllotropesExpanded = false;

    const hasMainAllotropes = mainData.allotropes && Object.keys(mainData.allotropes).length > 0;
    const hasExtraAllotropes = mainData.extraAllotropes && Object.keys(mainData.extraAllotropes).length > 0;

    // Если нет аллотропов вообще — просто рендерим основные данные
    if (!hasMainAllotropes) {
        renderModalContent(mainData);
        return;
    }

    const allotropeKeys = Object.keys(mainData.allotropes);

    // Если только один аллотроп и нет дополнительных — не показываем табы
    if (allotropeKeys.length === 1 && !hasExtraAllotropes) {
        const mergedData = { ...mainData, ...mainData.allotropes[allotropeKeys[0]] };
        renderModalContent(mergedData);
        return;
    }

    // Создаём табы для основных аллотропов
    allotropeKeys.forEach((key, index) => {
        const btn = document.createElement('button');
        btn.className = 'allotrope-tab';
        btn.innerText = mainData.allotropes[key].name;
        btn.dataset.allotropeKey = key;
        btn.dataset.isExtra = 'false';

        btn.onclick = () => {
            document.querySelectorAll('.allotrope-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const mergedData = { ...mainData, ...mainData.allotropes[key] };
            renderModalContent(mergedData);
        };

        tabsPlaceholder.appendChild(btn);

        // Активируем первый таб по умолчанию
        if (index === 0) {
            btn.click();
        }
    });

    // Если есть дополнительные аллотропы — добавляем кнопку "+ Ещё"
    if (hasExtraAllotropes) {
        const moreBtn = document.createElement('button');
        moreBtn.className = 'allotrope-tab more-btn';
        moreBtn.innerText = '+ Ещё';
        moreBtn.title = 'Показать дополнительные аллотропы';

        moreBtn.onclick = () => {
            if (extraAllotropesExpanded) {
                // Скрываем дополнительные табы
                document.querySelectorAll('.allotrope-tab[data-is-extra="true"]').forEach(tab => {
                    tab.remove();
                });
                moreBtn.innerText = '+ Ещё';
                moreBtn.classList.remove('expanded');
                extraAllotropesExpanded = false;
            } else {
                // Показываем дополнительные табы
                const extraKeys = Object.keys(mainData.extraAllotropes);
                extraKeys.forEach(key => {
                    const btn = document.createElement('button');
                    btn.className = 'allotrope-tab extra-tab';
                    btn.innerText = mainData.extraAllotropes[key].name;
                    btn.dataset.allotropeKey = key;
                    btn.dataset.isExtra = 'true';

                    btn.onclick = () => {
                        document.querySelectorAll('.allotrope-tab').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        const mergedData = { ...mainData, ...mainData.extraAllotropes[key] };
                        renderModalContent(mergedData);
                    };

                    // Вставляем перед кнопкой "Ещё"
                    tabsPlaceholder.insertBefore(btn, moreBtn);
                });

                moreBtn.innerText = '− Скрыть';
                moreBtn.classList.add('expanded');
                extraAllotropesExpanded = true;
            }
        };

        tabsPlaceholder.appendChild(moreBtn);
    }
}

// =========================================
// Анимация разлёта элементов
// =========================================
function scatterElements() {
    const modalRect = document.querySelector('.modal-content').getBoundingClientRect();
    const modalCenterX = modalRect.left + modalRect.width / 2;
    const modalCenterY = modalRect.top + modalRect.height / 2;

    document.body.classList.add('elements-scattered');
    document.body.classList.remove('elements-returning');

    const elements = document.querySelectorAll('.element');

    elements.forEach(el => {
        el.style.setProperty('transition', 'transform 0.5s cubic-bezier(0.5, 0.9, 0.5, 1.0)', 'important');
        if (!el.style.transform) {
            el.style.transform = 'translate(0, 0)';
        }
    });

    requestAnimationFrame(() => {
        elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const elCenterX = rect.left + rect.width / 2;
        const elCenterY = rect.top + rect.height / 2;

        let dirX = elCenterX - modalCenterX;
        let dirY = elCenterY - modalCenterY;

        const distance = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
        dirX = dirX / distance;
        dirY = dirY / distance;

        const randomOffset = 100 + Math.random() * 100;

        const moveX = dirX * randomOffset + (Math.random() - 0.5) * 50;
        const moveY = dirY * randomOffset + (Math.random() - 0.5) * 50;

        el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

function returnElements() {
    document.body.classList.remove('elements-scattered');
    document.body.classList.add('elements-returning');

    const elements = document.querySelectorAll('.element');
    elements.forEach(el => {
        el.style.setProperty('transition', 'transform 0.3s cubic-bezier(0.4, 0.05, 0.8, 1.0)', 'important');
        el.style.transform = 'translate(0, 0)';
    });

    setTimeout(() => {
        document.body.classList.remove('elements-returning');
        elements.forEach(el => {
            el.style.removeProperty('transform');
            el.style.removeProperty('transition');
        });
    }, 320);
}

// =========================================
// Обработчики кликов по элементам
// =========================================
document.querySelectorAll('.element').forEach(el => {
    el.addEventListener('click', () => {
        // Проверяем, открыт ли другой полноэкранный UI/панель.
        if (
            document.body.classList.contains('calc-active') ||
            document.body.classList.contains('balancer-active') ||
            document.body.classList.contains('modal-open') ||
            document.body.classList.contains('reactions-open') ||
            document.body.classList.contains('solubility-open')
        ) {
            return;
        }
        lastClickedElement = el;

        // Данные элемента
        const symbol = el.dataset.symbol;
        const mainData = elementsData[symbol] || {};
        if (!mainData.symbol) {
            mainData.symbol = symbol;
        }
        elementTitle.innerText = `${mainData.name || symbol} (${symbol})`;
        if (window.spawnAtom) {
            window.spawnAtom(mainData.atomicNumber, mainData.period);
        }
        createAllotropeTabs(mainData);

        const fab = document.getElementById('fab-container');
        if (fab && fab.classList.contains('active')) {
            fab.classList.remove('active');
        }

        // Открываем модалку
        modal.style.display = "flex";
        document.body.classList.add('modal-open');

        // Закрываем панель фильтров при открытии модалки элемента
        const filtersPanel = document.getElementById('filters-panel');
        if (filtersPanel && filtersPanel.classList.contains('active')) {
            if (!filtersPanel.classList.contains('closing')) {
                filtersPanel.classList.add('closing');
                setTimeout(() => {
                    filtersPanel.classList.remove('active', 'closing');
                }, 360);
            }
        }

        // Блокируем скролл основной страницы
        document.body.style.overflow = "hidden";

        // Запускаем разлёт элементов ТОЛЬКО если экран широкий (компьютер)
        if (window.innerWidth > 1024) {
            // Вычисляем координаты для CSS-анимации
            const rect = el.getBoundingClientRect();
            const elementCenterX = rect.left + rect.width / 2;
            const elementCenterY = rect.top + rect.height / 2;
            const screenCenterX = window.innerWidth / 2;
            const screenCenterY = window.innerHeight / 2;

            modal.style.setProperty('--start-x', (elementCenterX - screenCenterX) + 'px');
            modal.style.setProperty('--start-y', (elementCenterY - screenCenterY) + 'px');

            setTimeout(scatterElements, 50);
        }

        modal.classList.remove('closing');
    });
});

// =========================================
// Закрытие модального окна
// =========================================
function closeModal() {
    // Возвращаем элементы только на ПК
    if (window.clearAtom) {
        window.clearAtom();
    }
    if (window.innerWidth > 1024) {
        returnElements();
    }

    modal.classList.add('closing');
    document.body.classList.remove('modal-open');

    // Возвращаем скролл
    document.body.style.overflow = "";

    setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove('closing');
    }, 360);
}

// Экспортируем для использования в других модулях
window.closeModal = closeModal;

closeBtn.onclick = closeModal;

window.addEventListener('click', function (event) {
    if (event.target === modal) {
        closeModal();
    }
});
