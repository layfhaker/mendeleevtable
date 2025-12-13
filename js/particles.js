const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let specificAtomsArray = [];

// Настройки
let particlesCount = window.innerWidth < 768 ? 15 : 80;
let atomsCount = window.innerWidth < 768 ? 6 : 15;
let connectionDistance = 120;

let wave = { active: false, x: 0, y: 0, radius: 0, maxRadius: 0, toDark: false };

// === Инициализация ===
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
    if (specificAtomsArray.length > 0) {
        const lastAtom = specificAtomsArray[0];
        window.spawnAtom(lastAtom.atomicNumber, lastAtom.period);
    }
});

// === Глобальные функции ===

window.startParticleWave = function(x, y, isToDark) {
    wave.active = true;
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

        this.scale = window.innerWidth < 768 ? 0.6 : 1;
        this.baseRadius = 15 * this.scale;
        this.gap = 8 * this.scale;

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
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.directionX = (Math.random() * 0.4) - 0.2;
        this.directionY = (Math.random() * 0.4) - 0.2;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        this.x += this.directionX;
        this.y += this.directionY;
    }

    getColor() {
        const colorLight = 'rgba(0, 0, 0, 0.3)';
        const colorDark = 'rgba(255, 255, 255, 0.5)';
        if (!wave.active) return document.body.classList.contains('dark-theme') ? colorDark : colorLight;

        const dx = this.x - wave.x;
        const dy = this.y - wave.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const insideWave = dist < wave.radius;
        return (wave.toDark === insideWave) ? colorDark : colorLight;
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
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (wave.active) {
        wave.radius += 25;
        if (wave.radius > wave.maxRadius) wave.active = false;
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
            connectParticles(i);
        }
    }
}

function connectParticles(i) {
    for (let j = i; j < particlesArray.length; j++) {
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

initParticles();
animate();
