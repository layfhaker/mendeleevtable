// 🎨 NodeMap Canvas - Rendering and Interaction

class NodeMapCanvas {
    constructor(canvas, data) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.data = data;

        // View transform
        this.offsetX = 0;
        this.offsetY = 0;
        this.scale = 1;
        this.minScale = 0.1;
        this.maxScale = 3;

        // Interaction state
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.hoveredNode = null;
        this.selectedNode = null;

        // Visual config
        this.config = {
            nodeMinWidth: 120,
            nodeMaxWidth: 250,
            nodeHeight: 60,
            nodePadding: 8,
            fontSize: 12,
            lineWidth: 2,
            colors: {
                cold: '#6B9BD1',      // Blue
                cool: '#7EC4CF',      // Cyan
                normal: '#82C785',    // Green
                warm: '#F4D03F',      // Yellow
                hot: '#E74C3C',       // Red
                bg: '#2C3E50',
                text: '#ECF0F1',
                textDim: '#95A5A6',
                connection: '#34495E',
                connectionHighlight: '#E67E22',
                selected: '#3498DB'
            },
            icons: {
                entry: '📥',
                leaf: '📤',
                hub: '🔄',
                island: '🏝️',
                normal: '⚡'
            }
        };

        this.setupEventListeners();
        this.resize();
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';

        this.width = rect.width;
        this.height = rect.height;
    }

    setupEventListeners() {
        // Сохраняем ссылки на функции для удаления
        this.handlers = {
            mouseDown: (e) => this.onMouseDown(e),
            mouseMove: (e) => this.onMouseMove(e),
            mouseUp: (e) => this.onMouseUp(e),
            wheel: (e) => this.onWheel(e),
            click: (e) => this.onClick(e),
            touchStart: (e) => this.onTouchStart(e),
            touchMove: (e) => this.onTouchMove(e),
            touchEnd: (e) => this.onTouchEnd(e),
            resize: () => { this.resize(); this.render(); }
        };

        // Mouse events
        this.canvas.addEventListener('mousedown', this.handlers.mouseDown);
        this.canvas.addEventListener('mousemove', this.handlers.mouseMove);
        this.canvas.addEventListener('mouseup', this.handlers.mouseUp);
        this.canvas.addEventListener('wheel', this.handlers.wheel);
        this.canvas.addEventListener('click', this.handlers.click);

        // Touch events
        this.canvas.addEventListener('touchstart', this.handlers.touchStart);
        this.canvas.addEventListener('touchmove', this.handlers.touchMove);
        this.canvas.addEventListener('touchend', this.handlers.touchEnd);

        // Window resize
        window.addEventListener('resize', this.handlers.resize);
    }

    // Transform screen coordinates to world coordinates
    screenToWorld(x, y) {
        return {
            x: (x - this.offsetX) / this.scale,
            y: (y - this.offsetY) / this.scale
        };
    }

    // Transform world coordinates to screen coordinates
    worldToScreen(x, y) {
        return {
            x: x * this.scale + this.offsetX,
            y: y * this.scale + this.offsetY
        };
    }

    // Mouse down handler
    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.isDragging = true;
        this.dragStartX = e.clientX - rect.left - this.offsetX;
        this.dragStartY = e.clientY - rect.top - this.offsetY;
        this.canvas.style.cursor = 'grabbing';
    }

    // Mouse move handler
    onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (this.isDragging) {
            this.offsetX = mouseX - this.dragStartX;
            this.offsetY = mouseY - this.dragStartY;
            this.render();
        } else {
            // Check hover
            const world = this.screenToWorld(mouseX, mouseY);
            const node = this.getNodeAt(world.x, world.y);

            if (node !== this.hoveredNode) {
                this.hoveredNode = node;
                this.canvas.style.cursor = node ? 'pointer' : 'grab';
                this.render();
            }
        }
    }

    // Mouse up handler
    onMouseUp(e) {
        this.isDragging = false;
        this.canvas.style.cursor = this.hoveredNode ? 'pointer' : 'grab';
    }

    // Mouse wheel handler (zoom)
    onWheel(e) {
        e.preventDefault();

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Zoom factor
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * delta));

        if (newScale !== this.scale) {
            // Zoom towards mouse position
            const worldBefore = this.screenToWorld(mouseX, mouseY);

            this.scale = newScale;

            const worldAfter = this.screenToWorld(mouseX, mouseY);

            this.offsetX += (worldAfter.x - worldBefore.x) * this.scale;
            this.offsetY += (worldAfter.y - worldBefore.y) * this.scale;

            this.render();
        }
    }

    // Click handler
    onClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const world = this.screenToWorld(mouseX, mouseY);

        const node = this.getNodeAt(world.x, world.y);

        if (node) {
            this.selectedNode = this.selectedNode === node ? null : node;
            this.render();

            // Dispatch event for external handling
            this.canvas.dispatchEvent(new CustomEvent('nodeSelected', {
                detail: { node: this.selectedNode }
            }));
        }
    }

    // Touch handlers
    onTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.onMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }

    onTouchMove(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        }
        if (e.cancelable) {
            e.preventDefault();
        }
    }

    onTouchEnd(e) {
        this.onMouseUp(e);
    }

    // Find node at position
    getNodeAt(x, y) {
        for (const node of this.data.nodes) {
            if (x >= node.x && x <= node.x + node.width &&
                y >= node.y && y <= node.y + this.config.nodeHeight) {
                return node;
            }
        }
        return null;
    }

    // Center view on specific node
    centerOnNode(node) {
        this.offsetX = this.width / 2 - (node.x + node.width / 2) * this.scale;
        this.offsetY = this.height / 2 - (node.y + this.config.nodeHeight / 2) * this.scale;
        this.render();
    }

    // Fit all nodes in view
    fitToView() {
        if (this.data.nodes.length === 0) return;

        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;

        for (const node of this.data.nodes) {
            minX = Math.min(minX, node.x);
            minY = Math.min(minY, node.y);
            maxX = Math.max(maxX, node.x + node.width);
            maxY = Math.max(maxY, node.y + this.config.nodeHeight);
        }

        const padding = 50;
        const graphWidth = maxX - minX + padding * 2;
        const graphHeight = maxY - minY + padding * 2;

        const scaleX = this.width / graphWidth;
        const scaleY = this.height / graphHeight;
        this.scale = Math.min(scaleX, scaleY, 1);

        this.offsetX = (this.width - (minX + maxX) * this.scale) / 2;
        this.offsetY = (this.height - (minY + maxY) * this.scale) / 2;

        this.render();
    }

    // Main render function
    render() {
        // Clear canvas
        this.ctx.fillStyle = this.config.colors.bg;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Save state
        this.ctx.save();

        // Apply transform
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);

        // Render connections first (so they're behind nodes)
        this.renderConnections();

        // Render nodes
        this.renderNodes();

        // Restore state
        this.ctx.restore();

        // Render UI overlay (always on top)
        this.renderOverlay();
    }

    // Render connections between nodes
    renderConnections() {
        for (const connection of this.data.connections) {
            const isHighlighted = this.selectedNode &&
                (connection.from === this.selectedNode || connection.to === this.selectedNode);

            this.ctx.strokeStyle = isHighlighted ?
                this.config.colors.connectionHighlight :
                this.config.colors.connection;
            this.ctx.lineWidth = isHighlighted ? 3 : 1.5;
            this.ctx.globalAlpha = isHighlighted ? 1 : 0.3;

            const fromX = connection.from.x + connection.from.width / 2;
            const fromY = connection.from.y + this.config.nodeHeight / 2;
            const toX = connection.to.x + connection.to.width / 2;
            const toY = connection.to.y + this.config.nodeHeight / 2;

            // Draw curved bezier line
            this.ctx.beginPath();
            this.ctx.moveTo(fromX, fromY);

            const dx = toX - fromX;
            const dy = toY - fromY;
            const curve = Math.abs(dx) * 0.5;

            this.ctx.bezierCurveTo(
                fromX + curve, fromY,
                toX - curve, toY,
                toX, toY
            );

            this.ctx.stroke();

            // Draw arrow head
            if (isHighlighted) {
                this.drawArrowHead(toX, toY, fromX, fromY);
            }
        }

        this.ctx.globalAlpha = 1;
    }

    // Draw arrow head
    drawArrowHead(toX, toY, fromX, fromY) {
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const arrowSize = 10;

        this.ctx.fillStyle = this.config.colors.connectionHighlight;
        this.ctx.beginPath();
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(
            toX - arrowSize * Math.cos(angle - Math.PI / 6),
            toY - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.lineTo(
            toX - arrowSize * Math.cos(angle + Math.PI / 6),
            toY - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.closePath();
        this.ctx.fill();
    }

    // Render all nodes
    renderNodes() {
        for (const node of this.data.nodes) {
            const isHovered = this.hoveredNode === node;
            const isSelected = this.selectedNode === node;

            this.renderNode(node, isHovered, isSelected);
        }
    }

    // Render single node
    renderNode(node, isHovered, isSelected) {
        const x = node.x;
        const y = node.y;
        const w = node.width;
        const h = this.config.nodeHeight;
        const p = this.config.nodePadding;

        // Draw shadow if hovered/selected
        if (isHovered || isSelected) {
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 4;
        }

        // Draw background
        this.ctx.fillStyle = this.config.colors.bg;
        this.ctx.fillRect(x, y, w, h);

        // Draw border (color based on temperature)
        this.ctx.strokeStyle = isSelected ?
            this.config.colors.selected :
            this.config.colors[node.data.temperature];
        this.ctx.lineWidth = isSelected ? 4 : 2;
        this.ctx.strokeRect(x, y, w, h);

        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;

        // Draw icon
        const icon = this.config.icons[node.data.nodeType] || this.config.icons.normal;
        this.ctx.font = '16px sans-serif';
        this.ctx.fillStyle = this.config.colors.text;
        this.ctx.fillText(icon, x + p, y + 22);

        // Draw function name
        this.ctx.font = `bold ${this.config.fontSize}px monospace`;
        this.ctx.fillStyle = this.config.colors.text;
        const nameX = x + p + 25;
        this.ctx.fillText(this.truncateText(node.data.name, w - 40), nameX, y + 22);

        // Draw metrics
        this.ctx.font = `${this.config.fontSize - 2}px monospace`;
        this.ctx.fillStyle = this.config.colors.textDim;
        const metricsY = y + h - p - 8;

        const callsText = `→${node.data.calls.length}`;
        const calledByText = `←${node.data.calledBy.length}`;
        const linesText = `${node.data.lineCount}L`;

        this.ctx.fillText(`${callsText} ${calledByText}`, x + p, metricsY);
        this.ctx.fillText(linesText, x + w - p - this.ctx.measureText(linesText).width, metricsY);
    }

    // Truncate text to fit width
    truncateText(text, maxWidth) {
        const metrics = this.ctx.measureText(text);
        if (metrics.width <= maxWidth) return text;

        let truncated = text;
        while (this.ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
            truncated = truncated.slice(0, -1);
        }
        return truncated + '...';
    }

    // Render UI overlay
    renderOverlay() {
        // Zoom indicator
        const zoomText = `${Math.round(this.scale * 100)}%`;
        this.ctx.font = '14px sans-serif';
        this.ctx.fillStyle = this.config.colors.textDim;
        this.ctx.fillText(zoomText, this.width - 60, this.height - 20);
    }

    // === Добавить этот метод в конец класса NodeMapCanvas ===
    updateTheme(isDark) {
        if (isDark) {
            this.config.colors.bg = '#2C3E50';
            this.config.colors.text = '#ECF0F1';
            this.config.colors.textDim = '#95A5A6';
            this.config.colors.connection = '#34495E';
        } else {
            this.config.colors.bg = '#ffffff';
            this.config.colors.text = '#333333';
            this.config.colors.textDim = '#666666';
            this.config.colors.connection = '#e0e0e0';
        }
        // Принудительная перерисовка
        this.render();
    }
    // Очистка ресурсов и удаление слушателей
    // Очистка ресурсов
    destroy() {
        if (!this.handlers) return;

        this.canvas.removeEventListener('mousedown', this.handlers.mouseDown);
        this.canvas.removeEventListener('mousemove', this.handlers.mouseMove);
        this.canvas.removeEventListener('mouseup', this.handlers.mouseUp);
        this.canvas.removeEventListener('wheel', this.handlers.wheel);
        this.canvas.removeEventListener('click', this.handlers.click);

        this.canvas.removeEventListener('touchstart', this.handlers.touchStart);
        this.canvas.removeEventListener('touchmove', this.handlers.touchMove);
        this.canvas.removeEventListener('touchend', this.handlers.touchEnd);

        window.removeEventListener('resize', this.handlers.resize);
    }
}
