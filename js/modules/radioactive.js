// Radioactive Easter Egg Module - Pro Shard-Based Disintegration

document.addEventListener('DOMContentLoaded', () => {
    const uraniumAtomicNumber = 92; // U

    const timeoutMap = new Map();
    const activationTime = 2000; // 2 seconds
    let decayInterval;

    const elements = document.querySelectorAll('.element');

    elements.forEach(element => {
        const atomicNumberSpan = element.querySelector('.atomic-number');
        if (!atomicNumberSpan) return;
        const atomicNumber = parseInt(atomicNumberSpan.textContent);

        if (atomicNumber === uraniumAtomicNumber) {
            element.addEventListener('mouseenter', () => startRadioactiveTimer(element));
            element.addEventListener('mouseleave', () => stopRadioactiveTimer(element));
            element.addEventListener('touchstart', () => startRadioactiveTimer(element), { passive: true });
            element.addEventListener('touchend', () => stopRadioactiveTimer(element));
            element.addEventListener('touchcancel', () => stopRadioactiveTimer(element));
        }
    });

    function startRadioactiveTimer(element) {
        if (timeoutMap.has(element)) clearTimeout(timeoutMap.get(element));
        const timeoutId = setTimeout(() => triggerRadioactiveEffect(), activationTime);
        timeoutMap.set(element, timeoutId);
    }

    function stopRadioactiveTimer(element) {
        if (timeoutMap.has(element)) {
            clearTimeout(timeoutMap.get(element));
            timeoutMap.delete(element);
        }
        removeRadioactiveEffect();
    }

    function triggerRadioactiveEffect() {
        if (document.body.classList.contains('radioactive-mode')) return;
        document.body.classList.add('radioactive-mode');
        if (!decayInterval) startDecaySpread();
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    }

    function removeRadioactiveEffect() {
        document.body.classList.remove('radioactive-mode');
        stopDecaySpread();
    }

    function startDecaySpread() {
        if (decayInterval) clearInterval(decayInterval);
        const allElements = Array.from(document.querySelectorAll('.element'));

        decayInterval = setInterval(() => {
            const healthyElements = allElements.filter(el =>
                !el.classList.contains('radioactive-decay') &&
                el.style.visibility !== 'hidden'
            );

            if (healthyElements.length === 0) {
                clearInterval(decayInterval);
                return;
            }

            const victim = healthyElements[Math.floor(Math.random() * healthyElements.length)];
            victim.classList.add('radioactive-decay');
            crumbleToShards(victim);
        }, 120);
    }

    function stopDecaySpread() {
        if (decayInterval) {
            clearInterval(decayInterval);
            decayInterval = null;
        }

        // Heal all elements smoothly
        document.querySelectorAll('.element.radioactive-decay').forEach(el => {
            el.classList.remove('radioactive-decay');

            // Restore visual state
            el.style.color = '';
            el.style.backgroundColor = '';
            el.style.borderColor = '';
            el.style.boxShadow = '';

            // Restore children
            el.querySelectorAll('*').forEach(child => {
                child.style.opacity = '';
            });

            el.style.transition = 'all 1.5s ease-out';

            setTimeout(() => {
                el.style.transition = '';
            }, 1500);
        });
    }

    // ==========================================
    // PRO DISINTEGRATION: Fragment Cloning
    // ==========================================

    function crumbleToShards(element) {
        const rect = element.getBoundingClientRect();

        // Capture appearance BEFORE hiding
        const computed = window.getComputedStyle(element);
        const appearance = {
            backgroundColor: computed.backgroundColor,
            borderColor: computed.borderColor,
            color: computed.color,
            fontSize: computed.fontSize,
            fontFamily: computed.fontFamily,
            padding: computed.padding,
            borderRadius: computed.borderRadius
        };

        // Hide the original element content but KEEP it alive for hover
        element.style.backgroundColor = 'transparent';
        element.style.borderColor = 'transparent';
        element.style.boxShadow = 'none';
        element.style.color = 'transparent';
        element.querySelectorAll('*').forEach(child => child.style.opacity = '0');

        // Create shards (3x3 grid)
        const rows = 3;
        const cols = 3;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                createShard(element, rect, r, c, rows, cols, appearance);
            }
        }
    }

    function createShard(original, rect, r, c, rows, cols, appearance) {
        const shard = document.createElement('div');
        shard.className = original.className;
        shard.classList.remove('radioactive-decay');
        shard.classList.add('radioactive-shard');
        shard.innerHTML = original.innerHTML;

        // Use the CAPTURED appearance
        shard.style.backgroundColor = appearance.backgroundColor;
        shard.style.borderColor = appearance.borderColor;
        shard.style.color = appearance.color;
        shard.style.fontSize = appearance.fontSize;
        shard.style.fontFamily = appearance.fontFamily;
        shard.style.padding = appearance.padding;
        shard.style.borderRadius = appearance.borderRadius;

        shard.style.display = 'flex';
        shard.style.flexDirection = 'column';
        shard.style.alignItems = 'center';
        shard.style.justifyContent = 'center';

        // Position exactly on top of the original
        shard.style.width = rect.width + 'px';
        shard.style.height = rect.height + 'px';
        shard.style.left = rect.left + 'px';
        shard.style.top = rect.top + 'px';

        // SLICE: clip-path to only show one part of the element
        // We add some randomness to the slice to make it "jagged"
        const xStart = (c / cols) * 100;
        const xEnd = ((c + 1) / cols) * 100;
        const yStart = (r / rows) * 100;
        const yEnd = ((r + 1) / rows) * 100;

        // Create jagged corners
        const p1 = `${xStart + rand(-5, 5)}% ${yStart + rand(-5, 5)}%`;
        const p2 = `${xEnd + rand(-5, 5)}% ${yStart + rand(-5, 5)}%`;
        const p3 = `${xEnd + rand(-5, 5)}% ${yEnd + rand(-5, 5)}%`;
        const p4 = `${xStart + rand(-5, 5)}% ${yEnd + rand(-5, 5)}%`;

        shard.style.clipPath = `polygon(${p1}, ${p2}, ${p3}, ${p4})`;
        shard.style.webkitClipPath = shard.style.clipPath;

        document.body.appendChild(shard);

        // Physics variables
        const duration = 800 + Math.random() * 1200;
        const delay = Math.random() * 400; // Pieces don't all fall at once
        const tx = (Math.random() - 0.5) * 150; // horizontal drift
        const ty = window.innerHeight * 0.5 + Math.random() * 200; // fall distance
        const rot = (Math.random() - 0.5) * 500; // spin

        // Animating using Web Animations API (high performance)
        const anim = shard.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg)`, opacity: 0 }
        ], {
            duration: duration,
            delay: delay,
            easing: 'cubic-bezier(0.5, 0, 1, 1)', // Gravity-like acceleration
            fill: 'forwards'
        });

        anim.onfinish = () => {
            shard.remove();
        };
    }

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }
});
