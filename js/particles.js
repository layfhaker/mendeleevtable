const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let specificAtomsArray = [];

// Настройки
let particlesCount = window.innerWidth < 768 ? 15 : 80;
let atomsCount = window.innerWidth < 768 ? 10 : 25;
let connectionDistance = 120;
let mouseRadius = 120;
let mouseForce = 0.6;
let interactionMode = 'repel';
let maxVelocity = 1.4;
let damping = 0.98;

let wave = { active: false, x: 0, y: 0, radius: 0, maxRadius: 0, toDark: false, ending: false, endTime: 0 };
let mouse = { x: 0, y: 0, active: false };
let spawnBurstCount = 2;

// Wallpaper mode settings
let wallpaperMode = false;
let fpsCap = 60;
let lastFrameTime = 0;
const frameInterval = 1000 / 60; // Default 60 FPS

// === Инициализация ===
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateInteractionSettings();
    initParticles();
    if (specificAtomsArray.length > 0) {
        const lastAtom = specificAtomsArray[0];
        window.spawnAtom(lastAtom.atomicNumber, lastAtom.period);
    }
});

// === Глобальные функции ===

window.startParticleWave = function(x, y, isToDark) {
    wave.active = true;
    wave.ending = false; // Сбрасываем флаг завершения
    wave.x = x;
    wave.y = y;
    wave.radius = 0;
    wave.toDark = isToDark;
    wave.maxRadius = Math.hypot(canvas.width, canvas.height) + 100;
};

window.spawnAtom = function(atomicNumber, period) {
    setTimeout(() => {
        createSpecificAtoms(atomicNumber, period);
    }, 50);
};

window.clearAtom = function() {
    specificAtomsArray = [];
};

/**
 * Enable/disable wallpaper mode optimizations
 * Reduces FPS to save resources when running as desktop wallpaper
 */
window.setWallpaperMode = function(enabled) {
    wallpaperMode = enabled;

    if (enabled) {
        fpsCap = 30; // Reduce to 30 FPS for wallpaper mode
        console.log('[Particles] Wallpaper mode enabled: FPS capped at 30');
    } else {
        fpsCap = 60;
        console.log('[Particles] Wallpaper mode disabled: FPS restored to 60');
    }
};

// Also expose via particleSystem for compatibility
window.particleSystem = {
    setWallpaperMode: window.setWallpaperMode
};

function updateInteractionSettings() {
    const isMobile = window.innerWidth < 768;
    mouseRadius = isMobile ? 80 : 120;
    mouseForce = isMobile ? 0.35 : 0.6;
}

function updateMousePosition(x, y) {
    mouse.x = x;
    mouse.y = y;
    mouse.active = true;
}

window.addEventListener('mousemove', (event) => {
    updateMousePosition(event.clientX, event.clientY);
});

window.addEventListener('mouseleave', () => {
    mouse.active = false;
});

window.addEventListener('touchmove', (event) => {
    if (!event.touches || event.touches.length === 0) return;
    const touch = event.touches[0];
    updateMousePosition(touch.clientX, touch.clientY);
}, { passive: true });

window.addEventListener('touchend', () => {
    mouse.active = false;
});

function isClickOnUi(target) {
    if (!target) return false;
    return Boolean(target.closest(
        '.element, .modal, .modal-content, .electron-config-content, .advanced-modal-content, ' +
        '.below-table-content, .fab, .fab-option, button, a, input, textarea, select, label'
    ));
}

function spawnParticlesAt(x, y, count) {
    if (specificAtomsArray.length > 0) return;
    const spawnCount = Math.max(1, count || spawnBurstCount);
    for (let i = 0; i < spawnCount; i++) {
        const particle = new Particle(x, y);
        particlesArray.push(particle);
    }
    if (particlesArray.length > particlesCount * 3) {
        particlesArray.splice(0, particlesArray.length - particlesCount * 3);
    }
}

window.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;
    if (isClickOnUi(event.target)) return;
    spawnParticlesAt(event.clientX, event.clientY, spawnBurstCount);
});

function applyMouseInteraction(particle) {
    if (!mouse.active) return;

    const dx = particle.x - mouse.x;
    const dy = particle.y - mouse.y;
    const distanceSq = dx * dx + dy * dy;
    const radiusSq = mouseRadius * mouseRadius;

    if (distanceSq === 0 || distanceSq > radiusSq) return;

    const distance = Math.sqrt(distanceSq);
    const strength = mouseForce * (1 - distance / mouseRadius);
    let forceX = 0;
    let forceY = 0;

    if (interactionMode === 'attract') {
        forceX = (-dx / distance) * strength;
        forceY = (-dy / distance) * strength;
    } else if (interactionMode === 'vortex') {
        forceX = (-dy / distance) * strength;
        forceY = (dx / distance) * strength;
    } else {
        forceX = (dx / distance) * strength;
        forceY = (dy / distance) * strength;
    }

    particle.directionX += forceX;
    particle.directionY += forceY;
}

function createSpecificAtoms(atomicNumber, period) {
    specificAtomsArray = [];

    const modalContent = document.querySelector('.modal-content');
    let spawnArea = { x: 0, y: 0, w: canvas.width, h: canvas.height };

    if (modalContent && window.getComputedStyle(modalContent).display !== 'none' && window.innerWidth > 1024) {
        const rect = modalContent.getBoundingClientRect();
        const spaceLeft = rect.left;
        const spaceRight = canvas.width - rect.right;

        if (spaceRight > spaceLeft) {
            spawnArea = { x: rect.right, y: 0, w: spaceRight, h: canvas.height };
        } else {
            spawnArea = { x: 0, y: 0, w: spaceLeft, h: canvas.height };
        }
    }

    for (let i = 0; i < atomsCount; i++) {
        specificAtomsArray.push(new SpecificAtom(atomicNumber, period, spawnArea));
    }
}

// === Классы ===

// Класс сложного атома (Элемент)
class SpecificAtom {
    constructor(atomicNumber, period, area) {
        this.atomicNumber = parseInt(atomicNumber);
        this.period = parseInt(period);

        // Позиция
        this.x = area.x + Math.random() * area.w;
        this.y = area.y + Math.random() * area.h;
        this.bounds = area;

        // Медленный дрейф
        this.directionX = (Math.random() * 0.3) - 0.15;
        this.directionY = (Math.random() * 0.3) - 0.15;

        this.scale = window.innerWidth < 768 ? 0.8 : 1.3;
        this.baseRadius = 18 * this.scale;
        this.gap = 10 * this.scale;

        // === РАСЧЕТ ЭЛЕКТРОНОВ ПО ОБОЛОЧКАМ ===
        this.shellElectronCounts = [];
        let electronsLeft = this.atomicNumber;

        for (let i = 1; i <= this.period; i++) {
            let capacity = 2 * i * i; // Максимум по формуле 2n²
            let count = 0;

            if (i === this.period) {
                // Последний слой забирает всё, что осталось
                count = electronsLeft;
            } else {
                // Внутренние слои
                count = Math.min(electronsLeft, capacity);

                // Визуальная коррекция для K, Ca и т.д. (правило октета для предпоследнего слоя)
                // Если это предпоследний слой и он может вместить больше 8, но мы не хотим перегружать
                // (обычно предпоследний слой держит 8 перед тем как заполняется следующий s-подуровень)
                if (i === this.period - 1 && capacity > 8) {
                    count = 8;
                }
            }

            // Если вдруг логика дала сбой (transition metals сложнее), берем минимум
            if (count > electronsLeft) count = electronsLeft;

            this.shellElectronCounts.push(count);
            electronsLeft -= count;
        }
    }

    update() {
        if (this.x > this.bounds.x + this.bounds.w || this.x < this.bounds.x) this.directionX = -this.directionX;
        if (this.y > this.bounds.y + this.bounds.h || this.y < this.bounds.y) this.directionY = -this.directionY;
        this.x += this.directionX;
        this.y += this.directionY;
    }

    draw() {
        const nucleusSize = 4 * this.scale;
        ctx.beginPath();
        ctx.arc(this.x, this.y, nucleusSize, 0, Math.PI * 2);

        const isDark = document.body.classList.contains('dark-theme');
        ctx.fillStyle = isDark ? '#ff4081' : '#d32f2f';
        ctx.fill();

        const orbitColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
        const electronColor = isDark ? '#00e5ff' : '#1976D2';

        // Рисуем орбиты
        for (let i = 1; i <= this.period; i++) {
            const radius = this.baseRadius + (i * this.gap);
            const rotationAngle = (Math.PI / this.period) * i + this.x;

            ctx.beginPath();
            ctx.ellipse(this.x, this.y, radius, radius * 0.6, rotationAngle, 0, Math.PI * 2);
            ctx.strokeStyle = orbitColor;
            ctx.lineWidth = 1;
            ctx.stroke();

            // === РИСУЕМ ПРАВИЛЬНОЕ КОЛИЧЕСТВО ЭЛЕКТРОНОВ ===
            // Берем число из заранее рассчитанного массива
            // (i-1 потому что массив с 0, а слои с 1)
            let electrons = this.shellElectronCounts[i - 1] || 0;

            const time = Date.now() * 0.0005;

            for (let e = 0; e < electrons; e++) {
                const offset = (Math.PI * 2 / electrons) * e;
                const angle = (time * (3/i)) + offset;

                let ex = radius * Math.cos(angle);
                let ey = (radius * 0.6) * Math.sin(angle);

                let rotX = ex * Math.cos(rotationAngle) - ey * Math.sin(rotationAngle);
                let rotY = ex * Math.sin(rotationAngle) + ey * Math.cos(rotationAngle);

                ctx.beginPath();
                ctx.arc(this.x + rotX, this.y + rotY, 2 * this.scale, 0, Math.PI * 2);
                ctx.fillStyle = electronColor;
                ctx.fill();
            }
        }
    }
}

// Класс обычной точки (Фон)
class Particle {
    constructor(x, y) {
        this.x = typeof x === 'number' ? x : Math.random() * canvas.width;
        this.y = typeof y === 'number' ? y : Math.random() * canvas.height;
        this.directionX = (Math.random() * 0.4) - 0.2;
        this.directionY = (Math.random() * 0.4) - 0.2;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        applyMouseInteraction(this);

        this.directionX *= damping;
        this.directionY *= damping;

        const speed = Math.hypot(this.directionX, this.directionY);
        if (speed > maxVelocity) {
            const scale = maxVelocity / speed;
            this.directionX *= scale;
            this.directionY *= scale;
        }

        if (speed < 0.05) {
            this.directionX += (Math.random() * 0.04) - 0.02;
            this.directionY += (Math.random() * 0.04) - 0.02;
        }

        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        this.x += this.directionX;
        this.y += this.directionY;
    }

    getColor() {
        const colorLight = 'rgba(0, 0, 0, 0.3)';
        const colorDark = 'rgba(255, 255, 255, 0.5)';

        // Если волна активна, используем цвета волны
        if (wave.active) {
            const dx = this.x - wave.x;
            const dy = this.y - wave.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const insideWave = dist < wave.radius;
            return (wave.toDark === insideWave) ? colorDark : colorLight;
        } else {
            // Если волна закончилась, возвращаем цвет в зависимости от темы
            return document.body.classList.contains('dark-theme') ? colorDark : colorLight;
        }
    }

    // Метод для принудительного обновления цвета
    updateColor() {
        // В данном случае, поскольку цвет зависит от состояния DOM,
        // нам просто нужно перерисовать частицу
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.getColor();
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < particlesCount; i++) {
        particlesArray.push(new Particle());
    }

    // Force redraw after initialization to ensure proper colors
    redrawParticles();
}

function redrawParticles() {
    // Trigger a redraw to ensure particles have correct colors based on theme
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all particles
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
    }

    // Draw connections between particles
    for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
            let dx = particlesArray[i].x - particlesArray[j].x;
            let dy = particlesArray[i].y - particlesArray[j].y;
            let distance = dx*dx + dy*dy;

            if (distance < (connectionDistance * connectionDistance)) {
                ctx.strokeStyle = particlesArray[i].getColor();
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate(currentTime) {
    requestAnimationFrame(animate);

    // FPS limiting for wallpaper mode
    if (wallpaperMode) {
        const targetInterval = 1000 / fpsCap;
        if (currentTime - lastFrameTime < targetInterval) {
            return;
        }
        lastFrameTime = currentTime;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (wave.active) {
        wave.radius += 25;
        if (wave.radius > wave.maxRadius) {
            // Вместо мгновенного отключения волны, начинаем фазу завершения
            wave.ending = true;
            wave.endTime = currentTime + 100; // 100ms для плавного перехода
        }
    }

    // Проверяем, нужно ли завершить волну
    if (wave.ending && currentTime > wave.endTime) {
        wave.active = false;
        wave.ending = false;
    }

    if (specificAtomsArray.length > 0) {
        for (let i = 0; i < specificAtomsArray.length; i++) {
            specificAtomsArray[i].update();
            specificAtomsArray[i].draw();
        }
    } else {
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }

        // Draw connections between particles
        for (let i = 0; i < particlesArray.length; i++) {
            for (let j = i + 1; j < particlesArray.length; j++) {
                let dx = particlesArray[i].x - particlesArray[j].x;
                let dy = particlesArray[i].y - particlesArray[j].y;
                let distance = dx*dx + dy*dy;

                if (distance < (connectionDistance * connectionDistance)) {
                    ctx.strokeStyle = particlesArray[i].getColor();
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
    }
}


// На мобильных устройствах устанавливаем z-index выше, чтобы частицы были видны
if (window.innerWidth <= 1024) {
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
}

// Экспортируем функцию перерисовки частиц для использования в других модулях
window.redrawParticles = redrawParticles;

// Функция для обновления цветов частиц при изменении темы
window.updateParticleColors = function() {
    redrawParticles(); // Перерисовываем с новыми цветами
};

// Экспортируем функцию инициализации частиц для использования в других модулях
window.initParticles = initParticles;

initParticles();
updateInteractionSettings();

// После полной загрузки DOM обновляем цвета частиц
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(updateParticleColors, 100); // Небольшая задержка для завершения инициализации темы
    });
} else {
    setTimeout(updateParticleColors, 100);
}

// Наблюдатель за изменениями класса темы
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            // Классы элемента изменились, возможно, изменилась тема
            if (typeof updateParticleColors === 'function') {
                setTimeout(updateParticleColors, 50);
            }
        }
    });
});

// Начинаем наблюдение за изменениями классов в body
observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
});

animate();
