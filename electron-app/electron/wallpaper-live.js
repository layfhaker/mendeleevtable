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

        // Step 1: skipped (logic moved to setupWallpaperMode)


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
            backgroundColor: '#000000', // Restore black or default background
            roundedCorners: false,      // No rounded corners (Windows 11)
            thickFrame: false,          // No thick frame
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

        // Step 4.5: Capture Desktop Screenshot for 'Ghost Icons' visual
        const userDataPath = require('electron').app.getPath('userData');
        const screenshotPath = path.join(userDataPath, 'desktop_bg.png');
        console.log('[Wallpaper] Capturing desktop state for visual icons...');
        const captureSuccess = await win32.getDesktopScreenshot(screenshotPath);

        // Step 5: Inject CSS and JS to optimize for wallpaper mode
        const bgStyle = captureSuccess
            ? `body { 
                background-image: url("file://${screenshotPath.replace(/\\/g, '/')}") !important;
                background-size: ${width}px ${height}px !important;
                background-position: top left !important;
                background-repeat: no-repeat !important;
                background-attachment: fixed !important;
            }`
            : `body { background-color: #000000 !important; }`;

        await wallpaperWindow.webContents.executeJavaScript(`
            // Add wallpaper mode class
            document.body.classList.add('wallpaper-mode');

            // Apply Ghost Icons or Black background
            const style = document.createElement('style');
            style.textContent = \`${bgStyle}
                .below-table-content, .fab-container, #theme-toggle, #filters-panel, #calc-panel, #balancer-panel { display: none !important; }
                .element { pointer-events: none !important; }
            \`;
            document.head.appendChild(style);

            // DISABLE ALL INTERACTIONS
            document.body.style.pointerEvents = 'none';

            console.log('[Wallpaper Mode] Visual simulation applied');
        `);

        // Step 6: Get window handle
        const electronHandle = wallpaperWindow.getNativeWindowHandle();

        // Convert Buffer to integer/string (Windows HWND)
        let handleValue;
        if (Buffer.isBuffer(electronHandle)) {
            if (electronHandle.length === 8) {
                // 64-bit Handle
                handleValue = electronHandle.readBigInt64LE(0).toString();
            } else {
                // 32-bit Handle
                handleValue = electronHandle.readInt32LE(0).toString();
            }
        } else {
            handleValue = electronHandle.toString();
        }

        console.log('[Wallpaper] Electron handle:', handleValue);

        // Step 6: Show window and enable click-through FIRST (ensure window is ready)
        // Note: showing before SetParent might cause a brief flash, but it's more reliable for visibility
        wallpaperWindow.show();
        wallpaperWindow.setBounds({ x: 0, y: 0, width: width, height: height });

        // CRITICAL: Make window transparent to mouse events so users can click desktop icons
        wallpaperWindow.setIgnoreMouseEvents(true, { forward: true });

        // Step 7/8/9: Consolidated Wallpaper Setup (Attach to WorkerW/Progman)
        console.log('[Wallpaper] Attaching to Desktop Layer (Consolidated)...');
        const attachResult = await win32.attachToWallpaper(handleValue, width, height);

        if (attachResult !== null) {
            console.log('[Wallpaper] Attach Success! Parent handle:', attachResult);
            isActive = true;
        } else {
            console.error('[Wallpaper] Attach Failed!');
            // Try to show window anyway as a fallback
            wallpaperWindow.setAlwaysOnTop(false);
            wallpaperWindow.show();
        }

        // Final desktop refresh
        win32.refreshDesktop();

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
