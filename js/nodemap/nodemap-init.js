// 🚀 NodeMap Initialization

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('🗺️ NodeMap initialized');

        // Add keyboard shortcut (.)
        document.addEventListener('keydown', function(e) {
            // Check if '.' key is pressed
            // And not inside an input/textarea
            const isInputField = e.target.tagName === 'INPUT' ||
                                 e.target.tagName === 'TEXTAREA' ||
                                 e.target.isContentEditable;

            if (e.key === '.' && !isInputField && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                openNodeMap();
            }
        });

        // Also add to window for manual access
        window.openNodeMap = openNodeMap;

        console.log('💡 Press "." to open Function Dependency Map');
    }
})();
