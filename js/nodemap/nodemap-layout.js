

class NodeMapLayout {
    constructor(analyzed) {
        this.analyzed = analyzed;
        this.nodes = [];
        this.connections = [];

        // Layout parameters
        this.config = {
            springLength: 150,
            springStrength: 0.05,
            repulsionStrength: 5000,
            damping: 0.85,
            centeringStrength: 0.01,
            iterations: 300,
            minNodeWidth: 120,
            maxNodeWidth: 250,
            nodeHeight: 60,
            spacing: 50
        };
    }

    // Main layout function
    calculate() {
        console.log('📐 Calculating layout...');

        this.createNodes();
        this.createConnections();
        this.initializePositions();
        this.runSimulation();

        console.log(`✅ Layout complete: ${this.nodes.length} nodes, ${this.connections.length} connections`);

        return {
            nodes: this.nodes,
            connections: this.connections
        };
    }

    // Create node objects
    createNodes() {
        this.nodes = [];

        for (const [name, data] of Object.entries(this.analyzed)) {
            const width = this.calculateNodeWidth(data);

            this.nodes.push({
                id: name,
                data: data,
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                width: width,
                height: this.config.nodeHeight
            });
        }
    }

    // Calculate node width based on name length and importance
    calculateNodeWidth(data) {
        const baseWidth = Math.min(
            this.config.maxNodeWidth,
            Math.max(
                this.config.minNodeWidth,
                data.name.length * 8 + 40
            )
        );

        // Make important nodes (hubs) slightly wider
        const importanceFactor = data.nodeType === 'hub' ? 1.1 : 1;

        return baseWidth * importanceFactor;
    }

    // Create connection objects
    createConnections() {
        this.connections = [];
        const nodeMap = new Map(this.nodes.map(n => [n.id, n]));

        for (const node of this.nodes) {
            for (const targetName of node.data.calls) {
                const targetNode = nodeMap.get(targetName);
                if (targetNode) {
                    this.connections.push({
                        from: node,
                        to: targetNode
                    });
                }
            }
        }
    }

    // Initialize node positions
    initializePositions() {
        const strategy = this.detectLayoutStrategy();

        switch (strategy) {
            case 'hierarchical':
                this.hierarchicalLayout();
                break;
            case 'circular':
                this.circularLayout();
                break;
            default:
                this.randomLayout();
        }
    }

    // Detect best layout strategy
    detectLayoutStrategy() {
        // Check if graph is hierarchical (DAG-like)
        const hasLayers = this.hasLayeredStructure();
        if (hasLayers) return 'hierarchical';

        // Check if graph is small and disconnected
        if (this.nodes.length < 20) return 'circular';

        return 'random';
    }

    // Check if graph has layered structure
    hasLayeredStructure() {
        // Count entry points and leaves
        let entryPoints = 0;
        let leaves = 0;

        for (const node of this.nodes) {
            if (node.data.nodeType === 'entry') entryPoints++;
            if (node.data.nodeType === 'leaf') leaves++;
        }

        // If we have clear entry points and leaves, it's hierarchical
        return entryPoints > 0 && leaves > 0;
    }

    // Hierarchical layout (layer-based)
    hierarchicalLayout() {
        const layers = this.calculateLayers();
        const layerWidth = 800;
        const layerHeight = 150;

        let y = 0;
        for (const layer of layers) {
            const totalWidth = layer.length * layerWidth;
            let x = -totalWidth / 2;

            for (const node of layer) {
                node.x = x + layerWidth / 2;
                node.y = y;
                x += layerWidth / layer.length;
            }

            y += layerHeight;
        }
    }

    // Calculate layers using topological sort
    calculateLayers() {
        const layers = [];
        const visited = new Set();
        const nodeMap = new Map(this.nodes.map(n => [n.id, n]));

        // Find nodes with no incoming edges (entry points)
        const entryNodes = this.nodes.filter(n => n.data.calledBy.length === 0);

        if (entryNodes.length === 0) {
            // No entry points, fall back to all nodes in first layer
            return [this.nodes];
        }

        // BFS to assign layers
        let currentLayer = [...entryNodes];

        while (currentLayer.length > 0) {
            layers.push([...currentLayer]);
            const nextLayer = [];

            for (const node of currentLayer) {
                visited.add(node.id);

                // Add children to next layer
                for (const childName of node.data.calls) {
                    const childNode = nodeMap.get(childName);
                    if (childNode && !visited.has(childName)) {
                        // Check if all parents are visited
                        const allParentsVisited = childNode.data.calledBy.every(p => visited.has(p));
                        if (allParentsVisited && !nextLayer.includes(childNode)) {
                            nextLayer.push(childNode);
                        }
                    }
                }
            }

            currentLayer = nextLayer;
        }

        // Add any remaining nodes (islands or circular deps)
        const remainingNodes = this.nodes.filter(n => !visited.has(n.id));
        if (remainingNodes.length > 0) {
            layers.push(remainingNodes);
        }

        return layers;
    }

    // Circular layout
    circularLayout() {
        const radius = 300;
        const angleStep = (2 * Math.PI) / this.nodes.length;

        for (let i = 0; i < this.nodes.length; i++) {
            const angle = i * angleStep;
            this.nodes[i].x = Math.cos(angle) * radius;
            this.nodes[i].y = Math.sin(angle) * radius;
        }
    }

    // Random layout
    randomLayout() {
        const spread = 500;

        for (const node of this.nodes) {
            node.x = (Math.random() - 0.5) * spread;
            node.y = (Math.random() - 0.5) * spread;
        }
    }

    // Run force-directed simulation
    runSimulation() {
        for (let i = 0; i < this.config.iterations; i++) {
            // Calculate forces
            this.applyRepulsion();
            this.applyAttraction();
            this.applyCentering();

            // Update positions
            this.updatePositions();

            // Cool down (reduce movement over time)
            const coolingFactor = 1 - (i / this.config.iterations);
            this.config.damping = 0.85 + coolingFactor * 0.1;
        }

        // Final adjustment to prevent overlaps
        this.preventOverlaps();
    }

    // Apply repulsion force (nodes push each other away)
    applyRepulsion() {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const nodeA = this.nodes[i];
                const nodeB = this.nodes[j];

                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < 0.01) continue;

                const dist = Math.sqrt(distSq);
                const force = this.config.repulsionStrength / distSq;

                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;

                nodeA.vx -= fx;
                nodeA.vy -= fy;
                nodeB.vx += fx;
                nodeB.vy += fy;
            }
        }
    }

    // Apply attraction force (connected nodes pull together)
    applyAttraction() {
        for (const connection of this.connections) {
            const dx = connection.to.x - connection.from.x;
            const dy = connection.to.y - connection.from.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 0.01) continue;

            const force = (dist - this.config.springLength) * this.config.springStrength;

            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            connection.from.vx += fx;
            connection.from.vy += fy;
            connection.to.vx -= fx;
            connection.to.vy -= fy;
        }
    }

    // Apply centering force (pull towards center)
    applyCentering() {
        for (const node of this.nodes) {
            node.vx -= node.x * this.config.centeringStrength;
            node.vy -= node.y * this.config.centeringStrength;
        }
    }

    // Update node positions
    updatePositions() {
        for (const node of this.nodes) {
            node.vx *= this.config.damping;
            node.vy *= this.config.damping;

            node.x += node.vx;
            node.y += node.vy;
        }
    }

    // Prevent node overlaps
    preventOverlaps() {
        const iterations = 10;
        const minDistance = 20;

        for (let iter = 0; iter < iterations; iter++) {
            for (let i = 0; i < this.nodes.length; i++) {
                for (let j = i + 1; j < this.nodes.length; j++) {
                    const nodeA = this.nodes[i];
                    const nodeB = this.nodes[j];

                    const dx = nodeB.x - nodeA.x;
                    const dy = nodeB.y - nodeA.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    const minDist = (nodeA.width + nodeB.width) / 2 + minDistance;

                    if (dist < minDist && dist > 0) {
                        const push = (minDist - dist) / 2;
                        const nx = dx / dist;
                        const ny = dy / dist;

                        nodeA.x -= nx * push;
                        nodeA.y -= ny * push;
                        nodeB.x += nx * push;
                        nodeB.y += ny * push;
                    }
                }
            }
        }
    }

    // Group nodes by clusters (connected components)
    findClusters() {
        const clusters = [];
        const visited = new Set();

        const dfs = (node, cluster) => {
            if (visited.has(node.id)) return;
            visited.add(node.id);
            cluster.push(node);

            // Visit connected nodes
            for (const targetName of node.data.calls) {
                const targetNode = this.nodes.find(n => n.id === targetName);
                if (targetNode) dfs(targetNode, cluster);
            }

            for (const sourceName of node.data.calledBy) {
                const sourceNode = this.nodes.find(n => n.id === sourceName);
                if (sourceNode) dfs(sourceNode, cluster);
            }
        };

        for (const node of this.nodes) {
            if (!visited.has(node.id)) {
                const cluster = [];
                dfs(node, cluster);
                clusters.push(cluster);
            }
        }

        return clusters;
    }
}
