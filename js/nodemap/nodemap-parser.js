// 🧠 NodeMap Parser - Automatic Function Dependency Analysis

class NodeMapParser {
    constructor() {
        this.nativeFunctions = new Set([
            'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
            'console', 'alert', 'confirm', 'prompt',
            'parseInt', 'parseFloat', 'isNaN', 'isFinite',
            'encodeURI', 'decodeURI', 'encodeURIComponent', 'decodeURIComponent',
            'eval', 'Object', 'Array', 'String', 'Number', 'Boolean',
            'Date', 'Math', 'JSON', 'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet',
            'fetch', 'XMLHttpRequest', 'addEventListener', 'removeEventListener',
            'requestAnimationFrame', 'cancelAnimationFrame'
        ]);

        this.domMethods = new Set([
            'getElementById', 'querySelector', 'querySelectorAll',
            'getElementsByClassName', 'getElementsByTagName',
            'createElement', 'createTextNode', 'appendChild', 'removeChild',
            'setAttribute', 'getAttribute', 'classList', 'style',
            'addEventListener', 'removeEventListener', 'dispatchEvent'
        ]);
    }

    // Main analysis function
    analyzeProject() {
        console.log('🔍 Starting project analysis...');
        const functions = this.findGlobalFunctions();
        const analyzed = this.analyzeDependencies(functions);
        this.buildReverseLinks(analyzed);
        this.calculateMetrics(analyzed);

        console.log(`✅ Found ${Object.keys(analyzed).length} functions with ${this.countConnections(analyzed)} connections`);
        return analyzed;
    }

    // Find all global functions
    findGlobalFunctions() {
        const functions = {};
        const seen = new Set();

        // Scan window object
        for (const key of Object.keys(window)) {
            if (seen.has(key)) continue;
            seen.add(key);

            const value = window[key];

            // Check if it's a function and not native
            if (typeof value === 'function' && !this.isNativeFunction(key, value)) {
                functions[key] = value;
            }
        }

        // Also check for object methods (like window.Module.method)
        for (const key of Object.keys(window)) {
            const value = window[key];
            if (value && typeof value === 'object' && !value.nodeType) {
                for (const methodKey of Object.keys(value)) {
                    if (typeof value[methodKey] === 'function' &&
                        !this.isNativeFunction(methodKey, value[methodKey])) {
                        const fullName = `${key}.${methodKey}`;
                        if (!seen.has(fullName)) {
                            functions[fullName] = value[methodKey];
                            seen.add(fullName);
                        }
                    }
                }
            }
        }

        return functions;
    }

    // Check if function is native/built-in
    isNativeFunction(name, fn) {
        if (this.nativeFunctions.has(name)) return true;
        if (this.domMethods.has(name)) return true;

        try {
            const source = fn.toString();
            if (source.includes('[native code]')) return true;
            // Filter out very short functions (likely getters/setters)
            if (source.length < 20) return true;
        } catch (e) {
            return true;
        }

        return false;
    }

    // Analyze function dependencies
    analyzeDependencies(functions) {
        const analyzed = {};
        const functionNames = Object.keys(functions);

        for (const [name, fn] of Object.entries(functions)) {
            const source = fn.toString();

            analyzed[name] = {
                name: name,
                source: source,
                calls: this.extractFunctionCalls(source, functionNames),
                calledBy: [],
                params: this.extractParams(source),
                lineCount: source.split('\n').length,
                complexity: this.calculateComplexity(source),
                hasAsync: source.includes('async ') || source.includes('await '),
                hasEvents: this.hasEventListeners(source)
            };
        }

        return analyzed;
    }

    // Extract function calls using smart regex
    extractFunctionCalls(source, availableFunctions) {
        const calls = new Set();

        // Patterns to match function calls
        const patterns = [
            // Direct calls: functionName(
            /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
            // Object methods: obj.method(
            /\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
            // Callbacks: addEventListener('click', handler)
            /addEventListener\s*\(\s*['"][^'"]*['"]\s*,\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\)/g
        ];

        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(source)) !== null) {
                const fnName = match[1];

                // Check if it's one of our tracked functions
                if (availableFunctions.includes(fnName)) {
                    calls.add(fnName);
                }

                // Check for Module.method format
                for (const availableName of availableFunctions) {
                    if (availableName.includes('.') && availableName.endsWith('.' + fnName)) {
                        calls.add(availableName);
                    }
                }
            }
        }

        // Remove self-references (recursion is ok but we'll mark it separately)
        const functionName = this.getFunctionName(source);
        calls.delete(functionName);

        return Array.from(calls);
    }

    // Extract function parameters
    extractParams(source) {
        const match = source.match(/function\s*\w*\s*\(([^)]*)\)|^\s*\(([^)]*)\)\s*=>/);
        if (!match) return [];

        const params = (match[1] || match[2] || '').trim();
        if (!params) return [];

        return params.split(',').map(p => p.trim()).filter(p => p);
    }

    // Get function name from source
    getFunctionName(source) {
        const match = source.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
        return match ? match[1] : null;
    }

    // Calculate cyclomatic complexity (simplified)
    calculateComplexity(source) {
        let complexity = 1; // Base complexity

        // Count decision points
        const patterns = [
            /\bif\s*\(/g,
            /\belse\s+if\s*\(/g,
            /\bfor\s*\(/g,
            /\bwhile\s*\(/g,
            /\bcase\s+/g,
            /\bcatch\s*\(/g,
            /&&/g,
            /\|\|/g,
            /\?/g
        ];

        for (const pattern of patterns) {
            const matches = source.match(pattern);
            if (matches) complexity += matches.length;
        }

        return complexity;
    }

    // Check if function has event listeners
    hasEventListeners(source) {
        return /addEventListener|on[A-Z][a-zA-Z]*\s*=/.test(source);
    }

    // Build reverse links (who calls this function)
    buildReverseLinks(analyzed) {
        for (const [name, data] of Object.entries(analyzed)) {
            for (const calledFn of data.calls) {
                if (analyzed[calledFn]) {
                    analyzed[calledFn].calledBy.push(name);
                }
            }
        }
    }

    // Calculate metrics for visualization
    calculateMetrics(analyzed) {
        for (const data of Object.values(analyzed)) {
            // Calculate "temperature" (how often it's called)
            data.temperature = this.getTemperature(data.calledBy.length);

            // Classify node type
            data.nodeType = this.classifyNode(data);

            // Calculate importance score
            data.importance = data.calls.length + data.calledBy.length * 2;
        }
    }

    // Get temperature category
    getTemperature(callCount) {
        if (callCount === 0) return 'cold';
        if (callCount <= 2) return 'cool';
        if (callCount <= 5) return 'normal';
        if (callCount <= 10) return 'warm';
        return 'hot';
    }

    // Classify node type
    classifyNode(data) {
        const isEntry = data.calledBy.length === 0 && data.calls.length > 0;
        const isLeaf = data.calls.length === 0 && data.calledBy.length > 0;
        const isHub = data.calls.length > 3 && data.calledBy.length > 3;
        const isIsland = data.calls.length === 0 && data.calledBy.length === 0;

        if (isIsland) return 'island';
        if (isEntry) return 'entry';
        if (isHub) return 'hub';
        if (isLeaf) return 'leaf';
        return 'normal';
    }

    // Count total connections
    countConnections(analyzed) {
        let total = 0;
        for (const data of Object.values(analyzed)) {
            total += data.calls.length;
        }
        return total;
    }

    // Find circular dependencies
    findCircularDependencies(analyzed) {
        const circles = [];
        const visited = new Set();
        const recursionStack = new Set();

        const dfs = (node, path = []) => {
            if (recursionStack.has(node)) {
                // Found a cycle
                const cycleStart = path.indexOf(node);
                if (cycleStart !== -1) {
                    circles.push(path.slice(cycleStart).concat(node));
                }
                return;
            }

            if (visited.has(node)) return;

            visited.add(node);
            recursionStack.add(node);
            path.push(node);

            const nodeData = analyzed[node];
            if (nodeData) {
                for (const calledFn of nodeData.calls) {
                    dfs(calledFn, [...path]);
                }
            }

            recursionStack.delete(node);
        };

        for (const name of Object.keys(analyzed)) {
            if (!visited.has(name)) {
                dfs(name);
            }
        }

        return circles;
    }

    // Find dead code (unused functions)
    findDeadCode(analyzed) {
        return Object.values(analyzed)
            .filter(data => data.calledBy.length === 0 && data.nodeType !== 'entry')
            .map(data => data.name);
    }

    // Get statistics
    getStatistics(analyzed) {
        const stats = {
            totalFunctions: Object.keys(analyzed).length,
            totalConnections: this.countConnections(analyzed),
            entryPoints: 0,
            hubs: 0,
            leaves: 0,
            islands: 0,
            avgComplexity: 0,
            avgLineCount: 0,
            circularDeps: this.findCircularDependencies(analyzed),
            deadCode: this.findDeadCode(analyzed)
        };

        let totalComplexity = 0;
        let totalLines = 0;

        for (const data of Object.values(analyzed)) {
            switch (data.nodeType) {
                case 'entry': stats.entryPoints++; break;
                case 'hub': stats.hubs++; break;
                case 'leaf': stats.leaves++; break;
                case 'island': stats.islands++; break;
            }
            totalComplexity += data.complexity;
            totalLines += data.lineCount;
        }

        stats.avgComplexity = Math.round(totalComplexity / stats.totalFunctions);
        stats.avgLineCount = Math.round(totalLines / stats.totalFunctions);

        return stats;
    }
}
