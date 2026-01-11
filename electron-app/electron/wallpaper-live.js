/**
 * Live Wallpaper Manager
 * Handles creation, activation, and deactivation of wallpaper window
 */

const { BrowserWindow, screen } = require('electron');
const path = require('path');
const win32 = require('./win32-api');

let wallpaperWindow = null;
let isActive = false;

/**
 * Enable live wallpaper
 */
async function enableLiveWallpaper() {
    if (isActive && wallpaperWindow) {
        console.log('[Wallpaper] Already active');
        return {
            success: false,
            message: 'Wallpaper is already enabled'
        };
    }

    try {
        console.log('[Wallpaper] Starting live wallpaper...');

        // Step 1: Find WorkerW window
        console.log('[Wallpaper] Finding WorkerW...');
        const workerW = win32.findWorkerW();

        if (!workerW) {
            throw new Error('Could not find WorkerW window');
        }

        console.log('[Wallpaper] WorkerW found:', workerW);

        // Step 2: Get primary display dimensions (full screen, not work area)
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.size;

        console.log('[Wallpaper] Display size:', width, 'x', height);

        // Step 3: Create wallpaper window (no frame, no rounded corners)
        wallpaperWindow = new BrowserWindow({
            width: width,
            height: height,
            x: 0,
            y: 0,
            frame: false,
            transparent: false,
            skipTaskbar: true,
            resizable: false,
            movable: false,
            minimizable: false,
            maximizable: false,
            closable: false,
            focusable: false,  // Don't steal focus
            alwaysOnBottom: true,
            show: false,
            backgroundColor: '#1a1a1a',
            roundedCorners: false,  // No rounded corners (Windows 11)
            thickFrame: false,      // No thick frame
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js'),
                backgroundThrottling: false // Keep animations running
            }
        });

        // Step 4: Load content
        console.log('[Wallpaper] Loading content...');
        await wallpaperWindow.loadFile(path.join(__dirname, '../../index.html'));

        // Step 5: Inject CSS and JS to optimize for wallpaper mode
        await wallpaperWindow.webContents.executeJavaScript(`
            // Add wallpaper mode class
            document.body.classList.add('wallpaper-mode');

            // DISABLE ALL INTERACTIONS - this is just a wallpaper!
            document.body.style.pointerEvents = 'none';

            // Hide FAB menu and other UI elements
            const fab = document.querySelector('.fab-container');
            if (fab) fab.style.display = 'none';

            // Hide below-table content (download section, etc)
            const belowContent = document.querySelector('.below-table-content');
            if (belowContent) belowContent.style.display = 'none';

            // Hide theme toggle
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) themeToggle.style.display = 'none';

            // Hide filters panel
            const filtersPanel = document.getElementById('filters-panel');
            if (filtersPanel) filtersPanel.style.display = 'none';

            // Hide calc panel
            const calcPanel = document.getElementById('calc-panel');
            if (calcPanel) calcPanel.style.display = 'none';

            // Hide balancer panel
            const balancerPanel = document.getElementById('balancer-panel');
            if (balancerPanel) balancerPanel.style.display = 'none';

            // Hide all modals
            document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');

            // Disable element clicks
            document.querySelectorAll('.element').forEach(el => {
                el.style.pointerEvents = 'none';
                el.onclick = null;
            });

            // Optimize canvas animations for wallpaper
            if (window.particleSystem) {
                window.particleSystem.setWallpaperMode(true);
            }

            console.log('[Wallpaper Mode] Optimizations applied - interactions disabled');
        `);

        // Step 6: Get window handle
        const electronHandle = wallpaperWindow.getNativeWindowHandle();

        // Convert Buffer to integer (Windows HWND)
        let handleValue;
        if (Buffer.isBuffer(electronHandle)) {
            handleValue = electronHandle.readInt32LE(0);
        } else {
            handleValue = electronHandle;
        }

        console.log('[Wallpaper] Electron handle:', handleValue);

        // Step 7: Show window first (before SetParent)
        wallpaperWindow.show();
        wallpaperWindow.setBounds({ x: 0, y: 0, width: width, height: height });

        // Step 8: Set WorkerW as parent (async to not block)
        console.log('[Wallpaper] Setting parent...');
        const setParentResult = win32.setParent(handleValue, workerW);

        if (!setParentResult || setParentResult === 0) {
            console.warn('[Wallpaper] SetParent may have failed, trying to show window anyway');
            // Even if SetParent fails, we'll show the window at the bottom
            wallpaperWindow.setAlwaysOnTop(false);
        }

        isActive = true;

        console.log('[Wallpaper] Live wallpaper enabled successfully!');

        return {
            success: true,
            message: 'Live wallpaper enabled! You can close the main window - it will run in the tray.'
        };

    } catch (error) {
        console.error('[Wallpaper] Error enabling wallpaper:', error);

        // Cleanup on error
        if (wallpaperWindow) {
            wallpaperWindow.destroy();
            wallpaperWindow = null;
        }

        return {
            success: false,
            message: `Error: ${error.message}`
        };
    }
}

/**
 * Disable live wallpaper
 */
function disableLiveWallpaper() {
    if (!isActive) {
        return {
            success: false,
            message: 'Wallpaper is not enabled'
        };
    }

    try {
        console.log('[Wallpaper] Disabling live wallpaper...');

        if (wallpaperWindow) {
            wallpaperWindow.destroy();
            wallpaperWindow = null;
        }

        isActive = false;

        console.log('[Wallpaper] Live wallpaper disabled');

        return {
            success: true,
            message: 'Live wallpaper disabled'
        };

    } catch (error) {
        console.error('[Wallpaper] Error disabling wallpaper:', error);
        return {
            success: false,
            message: `Error: ${error.message}`
        };
    }
}

/**
 * Check if wallpaper is active
 */
function isWallpaperActive() {
    return isActive;
}

/**
 * Cleanup on app quit
 */
function cleanup() {
    if (wallpaperWindow) {
        wallpaperWindow.destroy();
        wallpaperWindow = null;
    }
    isActive = false;
}

module.exports = {
    enableLiveWallpaper,
    disableLiveWallpaper,
    isWallpaperActive,
    cleanup
};
