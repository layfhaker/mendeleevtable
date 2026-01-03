// 🖼️ NodeMap Modal - UI and Controls

class NodeMapModal {
    constructor() {
        this.parser = null;
        this.layout = null;
        this.canvas = null;
        this.analyzed = null;
        this.layoutData = null;

        this.createModal();
        this.setupEventListeners();
    }

    // Create modal HTML
    createModal() {
        const modal = document.createElement('div');
        modal.id = 'nodemap-modal';
        modal.className = 'nodemap-modal';
        modal.innerHTML = `
            <div class="nodemap-overlay"></div>
            <div class="nodemap-container">
                <div class="nodemap-header">
                    <div class="nodemap-title">
                        <span class="nodemap-icon">🗺️</span>
                        <h2>Function Dependency Map</h2>
                    </div>
                    <div class="nodemap-stats">
                        <span id="nodemap-stats-functions">0 functions</span>
                        <span id="nodemap-stats-connections">0 connections</span>
                        <span id="nodemap-stats-clusters">0 clusters</span>
                    </div>
                    <button class="nodemap-close" title="Close (Esc)">&times;</button>
                </div>

                <div class="nodemap-toolbar">
                    <div class="nodemap-search">
                        <input type="text" id="nodemap-search" placeholder="🔍 Search functions..." />
                        <button id="nodemap-clear-search" title="Clear search">&times;</button>
                    </div>

                    <div class="nodemap-filters">
                        <button id="nodemap-filter-entry" class="nodemap-filter" title="Entry points">
                            📥 Entry <span class="count">0</span>
                        </button>
                        <button id="nodemap-filter-hub" class="nodemap-filter" title="Hub functions">
                            🔄 Hubs <span class="count">0</span>
                        </button>
                        <button id="nodemap-filter-leaf" class="nodemap-filter" title="Leaf functions">
                            📤 Leaves <span class="count">0</span>
                        </button>
                        <button id="nodemap-filter-island" class="nodemap-filter" title="Isolated functions">
                            🏝️ Islands <span class="count">0</span>
                        </button>
                    </div>

                    <div class="nodemap-actions">
                        <button id="nodemap-fit-view" title="Fit to view">⊡</button>
                        <button id="nodemap-reset-zoom" title="Reset zoom">100%</button>
                        <button id="nodemap-refresh" title="Refresh analysis">🔄</button>
                    </div>
                </div>

                <div class="nodemap-content">
                    <canvas id="nodemap-canvas"></canvas>

                    <div class="nodemap-sidebar">
                        <div class="nodemap-legend">
                            <h3>Legend</h3>
                            <div class="legend-item">
                                <span class="legend-color" style="background: #6B9BD1;"></span>
                                <span>Cold (0-1 calls)</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color" style="background: #82C785;"></span>
                                <span>Normal (2-5 calls)</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color" style="background: #F4D03F;"></span>
                                <span>Warm (6-10 calls)</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color" style="background: #E74C3C;"></span>
                                <span>Hot (>10 calls)</span>
                            </div>
                        </div>

                        <div class="nodemap-info" id="nodemap-info">
                            <h3>Node Info</h3>
                            <p class="nodemap-info-empty">Click on a node to see details</p>
                        </div>

                        <div class="nodemap-warnings" id="nodemap-warnings"></div>
                    </div>
                </div>

                <div class="nodemap-footer">
                    <div class="nodemap-help">
                        <span>💡 Drag to pan • Scroll to zoom • Click node for details</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Setup event listeners
    setupEventListeners() {
        // Close button
        document.querySelector('.nodemap-close').addEventListener('click', () => this.close());

        // Overlay click
        document.querySelector('.nodemap-overlay').addEventListener('click', () => this.close());

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });

        // Search
        const searchInput = document.getElementById('nodemap-search');
        searchInput.addEventListener('input', (e) => this.onSearch(e.target.value));

        document.getElementById('nodemap-clear-search').addEventListener('click', () => {
            searchInput.value = '';
            this.onSearch('');
        });

        // Filters
        document.getElementById('nodemap-filter-entry').addEventListener('click', () => this.filterByType('entry'));
        document.getElementById('nodemap-filter-hub').addEventListener('click', () => this.filterByType('hub'));
        document.getElementById('nodemap-filter-leaf').addEventListener('click', () => this.filterByType('leaf'));
        document.getElementById('nodemap-filter-island').addEventListener('click', () => this.filterByType('island'));

        // Actions
        document.getElementById('nodemap-fit-view').addEventListener('click', () => this.fitToView());
        document.getElementById('nodemap-reset-zoom').addEventListener('click', () => this.resetZoom());
        document.getElementById('nodemap-refresh').addEventListener('click', () => this.refresh());

        // Canvas events
        const canvasElement = document.getElementById('nodemap-canvas');
        canvasElement.addEventListener('nodeSelected', (e) => this.onNodeSelected(e.detail.node));
    }

    // Open modal
    open() {
        console.log('🗺️ Opening Node Map...');

        // Show modal
        document.getElementById('nodemap-modal').classList.add('active');

        // Run analysis
        this.runAnalysis();
    }

    // Close modal
    close() {
        document.getElementById('nodemap-modal').classList.remove('active');
    }

    // Check if modal is open
    isOpen() {
        return document.getElementById('nodemap-modal').classList.contains('active');
    }

    // Run analysis
    runAnalysis() {
        try {
            // Parse project
            this.parser = new NodeMapParser();
            this.analyzed = this.parser.analyzeProject();

            // Calculate layout
            this.layout = new NodeMapLayout(this.analyzed);
            this.layoutData = this.layout.calculate();

            // Create canvas
            const canvasElement = document.getElementById('nodemap-canvas');
            this.canvas = new NodeMapCanvas(canvasElement, this.layoutData);

            // Update UI
            this.updateStats();
            this.updateFilters();
            this.checkWarnings();

            // Fit to view
            this.canvas.fitToView();

        } catch (error) {
            console.error('Error running analysis:', error);
            this.showError(error.message);
        }
    }

    // Update statistics
    updateStats() {
        const stats = this.parser.getStatistics(this.analyzed);

        document.getElementById('nodemap-stats-functions').textContent =
            `${stats.totalFunctions} functions`;
        document.getElementById('nodemap-stats-connections').textContent =
            `${stats.totalConnections} connections`;

        const clusters = this.layout.findClusters();
        document.getElementById('nodemap-stats-clusters').textContent =
            `${clusters.length} clusters`;
    }

    // Update filter counts
    updateFilters() {
        const counts = {
            entry: 0,
            hub: 0,
            leaf: 0,
            island: 0
        };

        for (const data of Object.values(this.analyzed)) {
            if (counts.hasOwnProperty(data.nodeType)) {
                counts[data.nodeType]++;
            }
        }

        document.querySelector('#nodemap-filter-entry .count').textContent = counts.entry;
        document.querySelector('#nodemap-filter-hub .count').textContent = counts.hub;
        document.querySelector('#nodemap-filter-leaf .count').textContent = counts.leaf;
        document.querySelector('#nodemap-filter-island .count').textContent = counts.island;
    }

    // Check for warnings
    checkWarnings() {
        const stats = this.parser.getStatistics(this.analyzed);
        const warnings = [];

        // Dead code
        if (stats.deadCode.length > 0) {
            warnings.push({
                type: 'warning',
                icon: '⚠️',
                title: 'Dead Code',
                message: `${stats.deadCode.length} unused functions found`,
                details: stats.deadCode.join(', ')
            });
        }

        // Circular dependencies
        if (stats.circularDeps.length > 0) {
            warnings.push({
                type: 'error',
                icon: '🔄',
                title: 'Circular Dependencies',
                message: `${stats.circularDeps.length} circular dependency chains found`,
                details: stats.circularDeps.map(c => c.join(' → ')).join('\n')
            });
        }

        // High complexity
        const highComplexity = Object.values(this.analyzed)
            .filter(d => d.complexity > 20)
            .map(d => `${d.name} (${d.complexity})`);

        if (highComplexity.length > 0) {
            warnings.push({
                type: 'info',
                icon: '📊',
                title: 'High Complexity',
                message: `${highComplexity.length} functions with complexity > 20`,
                details: highComplexity.join(', ')
            });
        }

        this.renderWarnings(warnings);
    }

    // Render warnings
    renderWarnings(warnings) {
        const container = document.getElementById('nodemap-warnings');

        if (warnings.length === 0) {
            container.innerHTML = '';
            return;
        }

        const html = warnings.map(w => `
            <div class="nodemap-warning ${w.type}">
                <div class="warning-header">
                    <span class="warning-icon">${w.icon}</span>
                    <strong>${w.title}</strong>
                </div>
                <p>${w.message}</p>
                ${w.details ? `<details><summary>Show details</summary><pre>${w.details}</pre></details>` : ''}
            </div>
        `).join('');

        container.innerHTML = `<h3>Warnings</h3>${html}`;
    }

    // Search handler
    onSearch(query) {
        if (!this.canvas) return;

        query = query.toLowerCase().trim();

        if (!query) {
            // Clear highlight
            this.canvas.selectedNode = null;
            this.canvas.render();
            return;
        }

        // Find matching node
        const matchingNode = this.layoutData.nodes.find(n =>
            n.data.name.toLowerCase().includes(query)
        );

        if (matchingNode) {
            this.canvas.selectedNode = matchingNode;
            this.canvas.centerOnNode(matchingNode);
            this.showNodeInfo(matchingNode);
        }
    }

    // Filter by node type
    filterByType(type) {
        if (!this.canvas) return;

        const matchingNodes = this.layoutData.nodes.filter(n => n.data.nodeType === type);

        if (matchingNodes.length > 0) {
            // Highlight first matching node
            const node = matchingNodes[0];
            this.canvas.selectedNode = node;
            this.canvas.centerOnNode(node);
            this.showNodeInfo(node);
        }
    }

    // Node selected handler
    onNodeSelected(node) {
        if (node) {
            this.showNodeInfo(node);
        } else {
            this.clearNodeInfo();
        }
    }

    // Show node info
    showNodeInfo(node) {
        const info = document.getElementById('nodemap-info');
        const data = node.data;

        const html = `
            <h3>${data.name}</h3>
            <div class="info-section">
                <div class="info-item">
                    <span class="info-label">Type:</span>
                    <span>${data.nodeType}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Temperature:</span>
                    <span style="color: ${this.canvas.config.colors[data.temperature]}">${data.temperature}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Lines:</span>
                    <span>${data.lineCount}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Complexity:</span>
                    <span>${data.complexity}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Parameters:</span>
                    <span>${data.params.length > 0 ? data.params.join(', ') : 'none'}</span>
                </div>
            </div>

            <div class="info-section">
                <h4>Calls (${data.calls.length})</h4>
                ${data.calls.length > 0 ? `
                    <ul class="info-list">
                        ${data.calls.map(fn => `<li>${fn}</li>`).join('')}
                    </ul>
                ` : '<p class="info-empty">No calls</p>'}
            </div>

            <div class="info-section">
                <h4>Called by (${data.calledBy.length})</h4>
                ${data.calledBy.length > 0 ? `
                    <ul class="info-list">
                        ${data.calledBy.map(fn => `<li>${fn}</li>`).join('')}
                    </ul>
                ` : '<p class="info-empty">Not called</p>'}
            </div>

            ${data.hasAsync ? '<div class="info-badge">⚡ Async</div>' : ''}
            ${data.hasEvents ? '<div class="info-badge">📡 Events</div>' : ''}
        `;

        info.innerHTML = html;
    }

    // Clear node info
    clearNodeInfo() {
        const info = document.getElementById('nodemap-info');
        info.innerHTML = `
            <h3>Node Info</h3>
            <p class="nodemap-info-empty">Click on a node to see details</p>
        `;
    }

    // Fit to view
    fitToView() {
        if (this.canvas) {
            this.canvas.fitToView();
        }
    }

    // Reset zoom
    resetZoom() {
        if (this.canvas) {
            this.canvas.scale = 1;
            this.canvas.offsetX = this.canvas.width / 2;
            this.canvas.offsetY = this.canvas.height / 2;
            this.canvas.render();
        }
    }

    // Refresh analysis
    refresh() {
        this.runAnalysis();
    }

    // Show error
    showError(message) {
        const container = document.getElementById('nodemap-warnings');
        container.innerHTML = `
            <div class="nodemap-warning error">
                <div class="warning-header">
                    <span class="warning-icon">❌</span>
                    <strong>Error</strong>
                </div>
                <p>${message}</p>
            </div>
        `;
    }
    // ... внутри класса NodeMapModal ...

        // === Добавить этот метод в класс NodeMapModal ===
        updateTheme(isDark) {
            if (this.canvas) {
                this.canvas.updateTheme(isDark);
            }
        }
    } // <-- Конец класса

    // ... существующий код (let nodeMapModalInstance ...) ...

    // === Добавить в самый конец файла (глобально) ===
    function updateNodeMapTheme(isDark) {
        if (nodeMapModalInstance) {
            nodeMapModalInstance.updateTheme(isDark);
        }
    }


// Global instance
let nodeMapModalInstance = null;

// Open function (called by '.' key)
function openNodeMap() {
    if (!nodeMapModalInstance) {
        nodeMapModalInstance = new NodeMapModal();
    }
    nodeMapModalInstance.open();
}
