(function () {
    'use strict';

    const PERIODIC_SYMBOL_GRID_18X10 = [
        ['H', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'He'],
        ['Li', 'Be', null, null, null, null, null, null, null, null, null, null, 'B', 'C', 'N', 'O', 'F', 'Ne'],
        ['Na', 'Mg', null, null, null, null, null, null, null, null, null, null, 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'],
        ['K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'],
        ['Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe'],
        ['Cs', 'Ba', null, 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn'],
        ['Fr', 'Ra', null, 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', null],
        [null, null, 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', null]
    ];

    function toSelector(symbol) {
        return '#' + symbol + ',[data-symbol="' + symbol + '"]';
    }

    const PERIODIC_SELECTOR_GRID_18X10 = PERIODIC_SYMBOL_GRID_18X10.map((row) => {
        return row.map((symbol) => (symbol ? toSelector(symbol) : null));
    });

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function rgbToCss(rgb) {
        return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
    }

    function blendRgb(fromRgb, toRgb, alpha) {
        const a = clamp(alpha, 0, 1);
        return [
            Math.round(fromRgb[0] + (toRgb[0] - fromRgb[0]) * a),
            Math.round(fromRgb[1] + (toRgb[1] - fromRgb[1]) * a),
            Math.round(fromRgb[2] + (toRgb[2] - fromRgb[2]) * a)
        ];
    }

    function parseColor(color) {
        if (typeof color !== 'string') {
            return [0, 0, 0];
        }

        const raw = color.trim();
        const hex = raw.match(/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/);
        if (hex) {
            const value = hex[1];
            if (value.length === 3) {
                return [
                    parseInt(value[0] + value[0], 16),
                    parseInt(value[1] + value[1], 16),
                    parseInt(value[2] + value[2], 16)
                ];
            }
            return [
                parseInt(value.slice(0, 2), 16),
                parseInt(value.slice(2, 4), 16),
                parseInt(value.slice(4, 6), 16)
            ];
        }

        const rgb = raw.match(/^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/i);
        if (rgb) {
            return [
                clamp(Number(rgb[1]), 0, 255),
                clamp(Number(rgb[2]), 0, 255),
                clamp(Number(rgb[3]), 0, 255)
            ];
        }

        if (typeof document !== 'undefined' && document.body) {
            const temp = document.createElement('span');
            temp.style.color = raw;
            temp.style.display = 'none';
            document.body.appendChild(temp);
            const computed = window.getComputedStyle(temp).color;
            document.body.removeChild(temp);
            return parseColor(computed);
        }

        return [0, 0, 0];
    }

    class BadApplePlayer {
        constructor(options) {
            const config = options || {};
            const normalizedPayload = BadApplePlayer.normalizePayload(
                config.payload || BadApplePlayer.createDemoPayload()
            );

            this.root = config.root || document;
            this.gridMap = config.gridMap || PERIODIC_SELECTOR_GRID_18X10;
            this.syncAudio = config.syncAudio !== false;
            this.audio = this._resolveAudio(config.audio || null);
            this.onFinish = typeof config.onFinish === 'function' ? config.onFinish : null;

            this.onRgb = parseColor(config.onColor || '#111111');
            this.offRgb = parseColor(config.offColor || '#f3f3f3');

            this.payload = normalizedPayload;
            this.width = normalizedPayload.width;
            this.height = normalizedPayload.height;
            this.fps = normalizedPayload.fps;
            this.encoding = normalizedPayload.encoding;
            this.frames = normalizedPayload.frames;
            this.frameCount = this.frames.length;

            this.isPlaying = false;
            this.currentFrame = 0;
            this._lastRenderedFrame = -1;
            this._startTimeMs = null;
            this._rafId = null;
            this._tickBound = this._tick.bind(this);

            this._cells = this._resolveGridCells(this.gridMap);
            this._originalStyleAttr = new Map();
            this._rememberOriginalStyles();
        }

        static normalizePayload(payloadInput) {
            let payload = payloadInput;
            if (typeof payloadInput === 'string') {
                payload = JSON.parse(payloadInput);
            }

            if (!payload || typeof payload !== 'object') {
                throw new Error('BadApplePlayer payload must be an object or JSON string.');
            }

            const width = Math.max(1, Number(payload.width) || 18);
            const height = Math.max(1, Number(payload.height) || 10);
            const fps = Math.max(1, Number(payload.fps) || 12);
            const encoding = String(payload.encoding || 'hex-bitset-v1').toLowerCase();
            const frames = Array.isArray(payload.frames) ? payload.frames.slice() : [];

            if (encoding !== 'hex-bitset-v1' && encoding !== 'hex-nibbles-v1') {
                throw new Error('Unsupported payload encoding: ' + encoding);
            }

            const expectedLength = encoding === 'hex-bitset-v1'
                ? Math.ceil((width * height) / 4)
                : width * height;

            const normalizedFrames = frames.map((frame) => {
                const cleaned = String(frame || '')
                    .toLowerCase()
                    .replace(/[^0-9a-f]/g, '');

                if (cleaned.length >= expectedLength) {
                    return cleaned.slice(0, expectedLength);
                }
                return cleaned + '0'.repeat(expectedLength - cleaned.length);
            });

            return {
                width,
                height,
                fps,
                encoding,
                frames: normalizedFrames
            };
        }

        static _bitsToHex(bits) {
            let result = '';
            for (let index = 0; index < bits.length; index += 4) {
                const b0 = bits[index] ? 1 : 0;
                const b1 = bits[index + 1] ? 1 : 0;
                const b2 = bits[index + 2] ? 1 : 0;
                const b3 = bits[index + 3] ? 1 : 0;
                result += ((b0 << 3) | (b1 << 2) | (b2 << 1) | b3).toString(16);
            }
            return result;
        }

        static createDemoPayload(options) {
            const config = options || {};
            const width = Math.max(1, Number(config.width) || 18);
            const height = Math.max(1, Number(config.height) || 10);
            const fps = Math.max(1, Number(config.fps) || 12);
            const durationSeconds = Math.max(1, Number(config.durationSeconds) || 8);
            const frameCount = Math.max(1, Math.floor(fps * durationSeconds));
            const frames = [];

            for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
                const bits = new Array(width * height).fill(0);
                const t = frameIndex / frameCount;
                const cx = Math.sin(t * 6) * 0.45;
                const cy = Math.cos(t * 5) * 0.25;

                for (let row = 0; row < height; row += 1) {
                    for (let col = 0; col < width; col += 1) {
                        const nx = (col / Math.max(1, width - 1)) * 2 - 1;
                        const ny = (row / Math.max(1, height - 1)) * 2 - 1;
                        const distance = Math.sqrt((nx - cx) * (nx - cx) + (ny - cy) * (ny - cy));
                        const ring = distance > 0.28 && distance < 0.48;
                        const wave = Math.sin(nx * 4 + t * 12) + Math.cos(ny * 3 - t * 9);
                        const sweep = Math.abs(col - ((frameIndex * 2) % width)) <= 0;
                        const on = ring || wave > 0.85 || sweep;
                        bits[row * width + col] = on ? 1 : 0;
                    }
                }

                frames.push(BadApplePlayer._bitsToHex(bits));
            }

            return {
                encoding: 'hex-bitset-v1',
                width,
                height,
                fps,
                frames
            };
        }

        setPayload(payloadInput, options) {
            const config = options || {};
            const normalizedPayload = BadApplePlayer.normalizePayload(payloadInput);
            this.stop({ restore: true, reset: false });

            this.payload = normalizedPayload;
            this.width = normalizedPayload.width;
            this.height = normalizedPayload.height;
            this.fps = normalizedPayload.fps;
            this.encoding = normalizedPayload.encoding;
            this.frames = normalizedPayload.frames;
            this.frameCount = this.frames.length;

            if (config.reset !== false) {
                this.currentFrame = 0;
                this._lastRenderedFrame = -1;
            }
        }

        play(options) {
            const config = options || {};
            if (this.frameCount === 0) {
                return;
            }

            if (config.restart) {
                this.currentFrame = 0;
                this._lastRenderedFrame = -1;
            }

            if (this.currentFrame >= this.frameCount) {
                this.currentFrame = 0;
                this._lastRenderedFrame = -1;
            }

            if (this.isPlaying) {
                return;
            }

            this.isPlaying = true;
            this._startTimeMs = performance.now() - (this.currentFrame * 1000) / this.fps;

            if (this.audio && this.syncAudio) {
                try {
                    const targetTime = this.currentFrame / this.fps;
                    if (Math.abs(this.audio.currentTime - targetTime) > 0.12) {
                        this.audio.currentTime = targetTime;
                    }
                    const playPromise = this.audio.play();
                    if (playPromise && typeof playPromise.catch === 'function') {
                        playPromise.catch(() => {});
                    }
                } catch (error) {
                    // Ignore autoplay restrictions.
                }
            }

            this._rafId = requestAnimationFrame(this._tickBound);
        }

        pause(options) {
            const config = options || {};
            if (!this.isPlaying) {
                return;
            }
            this.isPlaying = false;

            if (this._rafId !== null) {
                cancelAnimationFrame(this._rafId);
                this._rafId = null;
            }

            if (config.pauseAudio !== false && this.audio && !this.audio.paused) {
                this.audio.pause();
            }
        }

        stop(options) {
            const config = options || {};
            this.pause({ pauseAudio: config.pauseAudio });

            if (config.restore !== false) {
                this.restoreOriginalStyles();
            }

            if (config.reset !== false) {
                this.currentFrame = 0;
                this._lastRenderedFrame = -1;
                this._startTimeMs = null;
                if (this.audio && config.pauseAudio !== false) {
                    try {
                        this.audio.currentTime = 0;
                    } catch (error) {
                        // Ignore out-of-range seek issues.
                    }
                }
            }
        }

        seekFrame(frameIndex, options) {
            const config = options || {};
            const clampedFrame = clamp(
                Math.floor(Number(frameIndex) || 0),
                0,
                Math.max(0, this.frameCount - 1)
            );

            this.currentFrame = clampedFrame;
            this._lastRenderedFrame = -1;
            this._startTimeMs = performance.now() - (clampedFrame * 1000) / this.fps;

            if (config.syncAudio !== false && this.audio) {
                try {
                    this.audio.currentTime = clampedFrame / this.fps;
                } catch (error) {
                    // Ignore out-of-range seek issues.
                }
            }

            if (config.render !== false) {
                this.renderFrame(clampedFrame);
                this._lastRenderedFrame = clampedFrame;
            }
        }

        renderFrame(frameIndex) {
            if (frameIndex < 0 || frameIndex >= this.frameCount) {
                return;
            }

            const frameData = this.frames[frameIndex];
            const totalPixels = this.width * this.height;

            for (let pixelIndex = 0; pixelIndex < totalPixels; pixelIndex += 1) {
                const row = Math.floor(pixelIndex / this.width);
                const col = pixelIndex % this.width;
                const cell = this._cells[row] && this._cells[row][col];
                if (!cell) {
                    continue;
                }

                const level = this._readPixelLevel(frameData, pixelIndex);
                const rgb = blendRgb(this.offRgb, this.onRgb, level);
                const color = rgbToCss(rgb);
                cell.style.transition = 'none';
                cell.style.backgroundColor = color;
                cell.style.color = color;
                cell.style.boxShadow = 'none';
            }
        }

        restoreOriginalStyles() {
            this._originalStyleAttr.forEach((styleValue, cell) => {
                if (styleValue === null) {
                    cell.removeAttribute('style');
                } else {
                    cell.setAttribute('style', styleValue);
                }
            });
        }

        _tick(timestampMs) {
            if (!this.isPlaying) {
                return;
            }

            let frameIndex;
            if (this.audio && this.syncAudio && !this.audio.paused && !this.audio.ended) {
                frameIndex = Math.floor(this.audio.currentTime * this.fps);
            } else {
                frameIndex = Math.floor((timestampMs - this._startTimeMs) / (1000 / this.fps));
            }

            if (frameIndex >= this.frameCount || (this.audio && this.syncAudio && this.audio.ended)) {
                this.stop({ restore: true, reset: true, pauseAudio: false });
                if (this.onFinish) {
                    this.onFinish();
                }
                return;
            }

            if (frameIndex !== this._lastRenderedFrame && frameIndex >= 0) {
                this.renderFrame(frameIndex);
                this._lastRenderedFrame = frameIndex;
                this.currentFrame = frameIndex + 1;
            }

            this._rafId = requestAnimationFrame(this._tickBound);
        }

        _readPixelLevel(frameData, pixelIndex) {
            if (this.encoding === 'hex-nibbles-v1') {
                const nibble = parseInt(frameData[pixelIndex] || '0', 16);
                return clamp(nibble / 15, 0, 1);
            }

            const charIndex = Math.floor(pixelIndex / 4);
            const bitOffset = 3 - (pixelIndex % 4);
            const nibble = parseInt(frameData[charIndex] || '0', 16);
            const bit = (nibble >> bitOffset) & 1;
            return bit;
        }

        _resolveAudio(audioInput) {
            if (!audioInput) {
                return null;
            }
            if (typeof audioInput === 'string') {
                return this.root.querySelector(audioInput);
            }
            if (typeof audioInput.play === 'function') {
                return audioInput;
            }
            return null;
        }

        _resolveGridCells(gridMap) {
            const rows = [];
            for (let row = 0; row < this.height; row += 1) {
                const rowDef = Array.isArray(gridMap[row]) ? gridMap[row] : [];
                const resolvedRow = [];
                for (let col = 0; col < this.width; col += 1) {
                    resolvedRow.push(this._resolveCell(rowDef[col]));
                }
                rows.push(resolvedRow);
            }
            return rows;
        }

        _resolveCell(cellDef) {
            if (!cellDef) {
                return null;
            }

            if (cellDef.nodeType === 1) {
                return cellDef;
            }

            if (Array.isArray(cellDef)) {
                for (const candidate of cellDef) {
                    const resolved = this._resolveCell(candidate);
                    if (resolved) {
                        return resolved;
                    }
                }
                return null;
            }

            if (typeof cellDef === 'string') {
                return this.root.querySelector(cellDef);
            }

            if (typeof cellDef === 'object' && cellDef.selector) {
                return this.root.querySelector(String(cellDef.selector));
            }

            if (typeof cellDef === 'object' && cellDef.element && cellDef.element.nodeType === 1) {
                return cellDef.element;
            }

            return null;
        }

        _rememberOriginalStyles() {
            const visited = new Set();
            for (const row of this._cells) {
                for (const cell of row) {
                    if (!cell || visited.has(cell)) {
                        continue;
                    }
                    visited.add(cell);
                    this._originalStyleAttr.set(cell, cell.getAttribute('style'));
                }
            }
        }
    }

    window.BadApplePlayer = BadApplePlayer;
    window.PERIODIC_SYMBOL_GRID_18X10 = PERIODIC_SYMBOL_GRID_18X10;
    window.PERIODIC_SELECTOR_GRID_18X10 = PERIODIC_SELECTOR_GRID_18X10;
})();
