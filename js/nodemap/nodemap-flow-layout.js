// 📐 User Flow Layout - Hierarchical positioning
// Размещает ноды блок-схемы по уровням с автоматическим центрированием

class UserFlowLayout {
    constructor(data) {
        this.data = data;
        this.nodeMap = new Map();

        this.config = {
            levelHeight: 120,      // Расстояние между уровнями
            nodeSpacing: 180,      // Расстояние между нодами
            nodeWidth: 150,
            nodeHeight: 60,
            padding: 80
        };
    }

    calculate() {
        // 1. Группировка по уровням
        const levels = this.groupByLevels();

        // 2. Расчёт позиций
        const positions = this.calculatePositions(levels);

        // 3. Подготовка нод с позициями
        const nodes = this.data.nodes.map(node => ({
            ...node,
            x: positions[node.id].x,
            y: positions[node.id].y,
            width: this.config.nodeWidth,
            height: this.config.nodeHeight
        }));

        // 4. Подготовка связей
        const nodeById = new Map(nodes.map(n => [n.id, n]));
        const connections = this.data.connections
            .map(conn => ({
                ...conn,
                fromNode: nodeById.get(conn.from),
                toNode: nodeById.get(conn.to)
            }))
            .filter(conn => conn.fromNode && conn.toNode);

        return { nodes, connections };
    }

    groupByLevels() {
        const levels = {};

        for (const node of this.data.nodes) {
            const level = node.level || 0;
            if (!levels[level]) levels[level] = [];
            levels[level].push(node);
        }

        return levels;
    }

    calculatePositions(levels) {
        const positions = {};

        // Найти максимальную ширину
        let maxNodesInLevel = 0;
        for (const nodes of Object.values(levels)) {
            maxNodesInLevel = Math.max(maxNodesInLevel, nodes.length);
        }

        const totalWidth = maxNodesInLevel * this.config.nodeSpacing;

        // Расположить каждый уровень
        for (const [level, nodes] of Object.entries(levels)) {
            const levelY = this.config.padding + parseInt(level) * this.config.levelHeight;
            const levelWidth = nodes.length * this.config.nodeSpacing;
            const startX = (totalWidth - levelWidth) / 2 + this.config.nodeSpacing / 2;

            nodes.forEach((node, index) => {
                positions[node.id] = {
                    x: startX + index * this.config.nodeSpacing,
                    y: levelY
                };
            });
        }

        return positions;
    }

    getBounds() {
        const levels = this.groupByLevels();
        const levelCount = Object.keys(levels).length;
        let maxNodesInLevel = 0;

        for (const nodes of Object.values(levels)) {
            maxNodesInLevel = Math.max(maxNodesInLevel, nodes.length);
        }

        return {
            width: maxNodesInLevel * this.config.nodeSpacing + this.config.padding * 2,
            height: levelCount * this.config.levelHeight + this.config.padding * 2
        };
    }
}
