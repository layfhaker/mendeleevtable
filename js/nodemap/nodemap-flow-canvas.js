// 🎨 User Flow Canvas - Flowchart rendering
// Отрисовка блок-схемы с разными фигурами (овалы, ромбы, шестиугольники)

class UserFlowCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.data = null;

        // Transform
        this.offsetX = 0;
        this.offsetY = 0;
        this.scale = 1;

        // Interaction
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.hoveredNode = null;
        this.selectedNode = null;

        // Стили фигур
        this.styles = {
            terminal: {
                fill: '#238636',
                stroke: '#2ea043',
                shape: 'oval'
            },
            process: {
                fill: '#1f6feb',
                stroke: '#388bfd',
                shape: 'rect'
            },
            decision: {
                fill: '#9e6a03',
                stroke: '#d29922',
                shape: 'diamond'
            },
            modal: {
                fill: '#8957e5',
                stroke: '#a371f7',
                shape: 'hexagon'
            },
            input: {
                fill: '#bd561d',
                stroke: '#db6d28',
                shape: 'parallelogram'
            }
        };

        this.setupEvents();
    }

    setData(data) {
        this.data = data;
        this.render();
    }

    setupEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e));

        // Touch
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.canvas.addEventListener('touchend', () => this.onMouseUp());
    }

    // ══════════ РЕНДЕРИНГ ══════════

    render() {
        if (!this.data) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);

        // Фон
        this.ctx.fillStyle = '#0d1117';
        this.ctx.fillRect(0, 0, rect.width, rect.height);

        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);

        // Сначала связи
        this.renderConnections();

        // Потом ноды
        this.renderNodes();

        this.ctx.restore();
    }

    renderConnections() {
        for (const conn of this.data.connections) {
            const from = conn.fromNode;
            const to = conn.toNode;
            const isReturn = conn.type === 'return';

            // Стиль линии
            this.ctx.strokeStyle = isReturn ? '#484f58' : '#8b949e';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash(isReturn ? [6, 4] : []);

            this.ctx.beginPath();

            if (isReturn) {
                // Возвратные линии — обходим справа
                const fromX = from.x + from.width / 2;
                const fromY = from.y;
                const toX = to.x + to.width / 2;
                const toY = to.y + to.height / 2;

                // Отступ вправо (чем ниже нода — тем дальше отступ)
                const rightOffset = 80 + (from.level || 0) * 30;

                this.ctx.moveTo(fromX, fromY);
                this.ctx.lineTo(fromX, fromY - 15);           // Вверх немного
                this.ctx.lineTo(fromX + rightOffset, fromY - 15); // Вправо
                this.ctx.lineTo(fromX + rightOffset, toY);    // Вверх до уровня цели
                this.ctx.lineTo(toX + to.width / 2 + 10, toY); // К ноде

            } else {
                // Обычные линии — строго вертикально + горизонтально
                const fromX = from.x;
                const fromY = from.y + from.height / 2;
                const toX = to.x;
                const toY = to.y - to.height / 2;

                // Средняя точка по Y
                const midY = fromY + (toY - fromY) / 2;

                this.ctx.moveTo(fromX, fromY);
                this.ctx.lineTo(fromX, midY);    // Вниз до середины
                this.ctx.lineTo(toX, midY);      // Горизонтально к цели
                this.ctx.lineTo(toX, toY);       // Вниз к ноде
            }

            this.ctx.stroke();

            // Стрелка (только для обычных связей)
            if (!isReturn) {
                this.drawArrow(to.x, to.y - to.height / 2, 'down');
            }

            // Label на линии
            if (conn.label && !isReturn) {
                const fromX = from.x;
                const fromY = from.y + from.height / 2;
                const toX = to.x;
                const toY = to.y - to.height / 2;
                const midY = fromY + (toY - fromY) / 2;

                // Позиция label — на горизонтальном участке
                const labelX = (fromX + toX) / 2;
                const labelY = midY - 6;

                // Фон для текста
                this.ctx.font = '10px system-ui';
                const textWidth = this.ctx.measureText(conn.label).width;
                this.ctx.fillStyle = '#0d1117';
                this.ctx.fillRect(labelX - textWidth / 2 - 4, labelY - 8, textWidth + 8, 14);

                // Текст
                this.ctx.fillStyle = '#8b949e';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(conn.label, labelX, labelY);
            }
        }

        this.ctx.setLineDash([]);
    }

    drawArrow(x, y, direction = 'down') {
        const size = 6;
        this.ctx.fillStyle = '#8b949e';
        this.ctx.beginPath();

        if (direction === 'down') {
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x - size, y - size * 1.5);
            this.ctx.lineTo(x + size, y - size * 1.5);
        } else if (direction === 'left') {
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + size * 1.5, y - size);
            this.ctx.lineTo(x + size * 1.5, y + size);
        }

        this.ctx.closePath();
        this.ctx.fill();
    }

    renderNodes() {
        for (const node of this.data.nodes) {
            this.renderNode(node);
        }
    }

    renderNode(node) {
        const style = this.styles[node.type] || this.styles.process;
        const x = node.x - node.width / 2;
        const y = node.y - node.height / 2;
        const w = node.width;
        const h = node.height;

        const isHovered = this.hoveredNode === node;
        const isSelected = this.selectedNode === node;

        // Тень при hover
        if (isHovered || isSelected) {
            this.ctx.shadowColor = style.stroke;
            this.ctx.shadowBlur = 15;
        }

        // Рисуем фигуру
        this.ctx.fillStyle = style.fill;
        this.ctx.strokeStyle = isSelected ? '#ffffff' : style.stroke;
        this.ctx.lineWidth = isSelected ? 3 : 2;

        this.drawShape(style.shape, x, y, w, h);

        this.ctx.shadowBlur = 0;

        // Иконка
        this.ctx.font = '18px system-ui';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.icon || '●', node.x - w/3, node.y);

        // Заголовок
        this.ctx.font = 'bold 12px system-ui';
        this.ctx.fillText(this.truncate(node.title, 15), node.x + 10, node.y - 5);

        // Подзаголовок
        if (node.subtitle) {
            this.ctx.font = '10px system-ui';
            this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
            this.ctx.fillText(node.subtitle, node.x + 10, node.y + 10);
        }
    }

    drawShape(shape, x, y, w, h) {
        this.ctx.beginPath();

        switch (shape) {
            case 'oval':
                this.ctx.ellipse(x + w/2, y + h/2, w/2, h/2, 0, 0, Math.PI * 2);
                break;

            case 'diamond':
                this.ctx.moveTo(x + w/2, y);
                this.ctx.lineTo(x + w, y + h/2);
                this.ctx.lineTo(x + w/2, y + h);
                this.ctx.lineTo(x, y + h/2);
                this.ctx.closePath();
                break;

            case 'hexagon':
                const inset = 15;
                this.ctx.moveTo(x + inset, y);
                this.ctx.lineTo(x + w - inset, y);
                this.ctx.lineTo(x + w, y + h/2);
                this.ctx.lineTo(x + w - inset, y + h);
                this.ctx.lineTo(x + inset, y + h);
                this.ctx.lineTo(x, y + h/2);
                this.ctx.closePath();
                break;

            case 'parallelogram':
                const skew = 15;
                this.ctx.moveTo(x + skew, y);
                this.ctx.lineTo(x + w, y);
                this.ctx.lineTo(x + w - skew, y + h);
                this.ctx.lineTo(x, y + h);
                this.ctx.closePath();
                break;

            default: // rect
                const r = 8;
                this.ctx.roundRect(x, y, w, h, r);
        }

        this.ctx.fill();
        this.ctx.stroke();
    }

    truncate(text, maxLen) {
        return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
    }

    // ══════════ СОБЫТИЯ ══════════

    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.isDragging = true;
        this.dragStartX = e.clientX - rect.left - this.offsetX;
        this.dragStartY = e.clientY - rect.top - this.offsetY;
        this.canvas.style.cursor = 'grabbing';
    }

    onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        if (this.isDragging) {
            this.offsetX = mx - this.dragStartX;
            this.offsetY = my - this.dragStartY;
            this.render();
        }
    }

    onMouseUp() {
        this.isDragging = false;
        this.canvas.style.cursor = 'grab';
    }

    onWheel(e) {
        e.preventDefault();

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Позиция мыши в мировых координатах ДО зума
        const worldX = (mouseX - this.offsetX) / this.scale;
        const worldY = (mouseY - this.offsetY) / this.scale;

        // Изменяем масштаб
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.2, Math.min(3, this.scale * delta));

        // Корректируем offset чтобы точка под курсором осталась на месте
        this.offsetX = mouseX - worldX * newScale;
        this.offsetY = mouseY - worldY * newScale;
        this.scale = newScale;

        this.render();
    }

    onTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.onMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }

    onTouchMove(e) {
        if (e.cancelable) {
            e.preventDefault();
        }
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }

    // ══════════ УПРАВЛЕНИЕ ══════════

    fitToView() {
        if (!this.data || !this.data.nodes.length) return;

        const rect = this.canvas.getBoundingClientRect();
        const layout = new UserFlowLayout(window.UserFlowData);
        const bounds = layout.getBounds();

        const scaleX = rect.width / bounds.width;
        const scaleY = rect.height / bounds.height;
        this.scale = Math.min(scaleX, scaleY, 1) * 0.9;

        this.offsetX = (rect.width - bounds.width * this.scale) / 2;
        this.offsetY = (rect.height - bounds.height * this.scale) / 2 + 50;

        this.render();
    }
}
