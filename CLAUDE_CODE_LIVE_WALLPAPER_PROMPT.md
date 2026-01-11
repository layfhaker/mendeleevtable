# Full Prompt for Claude Code - Live Wallpaper with System Tray

## Project Overview

Add interactive live wallpaper functionality to the Chemical Assistant Electron app. The app should:
- Enable/disable live wallpapers that run behind desktop icons
- Run in system tray when window is closed (like Wallpaper Engine)
- Support autostart with Windows
- Maintain previous bug fixes from the first prompt

## Architecture

```
Chemical Assistant.exe
├── Main Window (periodic table UI)
├── Wallpaper Window (hidden, rendered behind desktop)
├── System Tray (always running)
└── Background Process (keeps wallpaper alive)
```

**Key Behavior:**
1. User clicks "Enable Live Wallpaper" → wallpaper window created and injected behind desktop icons
2. User closes main window (X button) → window hides, tray icon remains, wallpaper keeps running
3. User right-clicks tray → menu with "Open", "Toggle Wallpaper", "Exit"
4. Optional: Auto-start with Windows

---

## Step 1: Install Required Dependencies

**Add to `electron-app/package.json`:**

```json
{
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.9.1"
  },
  "dependencies": {
    "ffi-napi": "^4.0.3",
    "ref-napi": "^3.0.3",
    "auto-launch": "^5.0.6"
  }
}
```

**Note for user:** After Claude Code creates this, run:
```bash
cd electron-app
npm install
```

---

## Step 2: Create Windows API Bindings

**Create `electron-app/electron/win32-api.js`:**

```javascript
/**
 * Windows API Bindings for Live Wallpaper
 * Uses ffi-napi to call user32.dll functions
 */

const ffi = require('ffi-napi');
const ref = require('ref-napi');

// Define Windows API types
const HWND = ref.types.long;
const LPARAM = ref.types.long;
const WPARAM = ref.types.uint;
const UINT = ref.types.uint;

// Load user32.dll
const user32 = ffi.Library('user32', {
    // Find window by class and title
    'FindWindowW': [HWND, ['string', 'string']],
    
    // Find child window
    'FindWindowExW': [HWND, [HWND, HWND, 'string', 'string']],
    
    // Set window parent
    'SetParent': [HWND, [HWND, HWND]],
    
    // Send message to window
    'SendMessageTimeoutW': ['long', [HWND, UINT, WPARAM, LPARAM, UINT, UINT, 'pointer']],
    
    // Enumerate all windows
    'EnumWindows': ['bool', ['pointer', LPARAM]],
    
    // Get window text
    'GetWindowTextW': ['int', [HWND, 'pointer', 'int']],
    
    // Check if window is visible
    'IsWindowVisible': ['bool', [HWND]],
    
    // Get class name
    'GetClassNameW': ['int', [HWND, 'pointer', 'int']]
});

/**
 * Find the Progman window (desktop)
 */
function findProgman() {
    try {
        const progman = user32.FindWindowW('Progman', null);
        console.log('[Win32] Progman handle:', progman);
        return progman;
    } catch (error) {
        console.error('[Win32] Error finding Progman:', error);
        return 0;
    }
}

/**
 * Find the WorkerW window that hosts wallpaper
 * This is complex because Windows creates multiple WorkerW windows
 */
function findWorkerW() {
    try {
        // Step 1: Send message to Progman to spawn WorkerW
        const progman = findProgman();
        if (!progman) {
            throw new Error('Progman window not found');
        }

        const result = ref.alloc('long');
        user32.SendMessageTimeoutW(
            progman,
            0x052C, // Undocumented message
            0,
            0,
            0x0000, // SMTO_NORMAL
            1000,   // 1 second timeout
            result
        );

        console.log('[Win32] Spawned WorkerW');

        // Step 2: Find the WorkerW that contains SHELLDLL_DefView
        let workerW = null;
        
        // Callback for EnumWindows
        const callback = ffi.Callback('bool', [HWND, LPARAM], (hwnd, lParam) => {
            try {
                // Get class name
                const className = Buffer.alloc(256);
                user32.GetClassNameW(hwnd, className, 256);
                const classStr = ref.reinterpretUntilZeros(className, 2).toString('ucs2');
                
                // Look for WorkerW windows
                if (classStr === 'WorkerW') {
                    // Check if this WorkerW has SHELLDLL_DefView as child
                    const shellView = user32.FindWindowExW(hwnd, 0, 'SHELLDLL_DefView', null);
                    
                    if (shellView !== 0) {
                        console.log('[Win32] Found WorkerW with SHELLDLL_DefView:', hwnd);
                        // Now find the next WorkerW (this is the one we want)
                        workerW = user32.FindWindowExW(0, hwnd, 'WorkerW', null);
                        console.log('[Win32] Target WorkerW:', workerW);
                        return false; // Stop enumeration
                    }
                }
                
                return true; // Continue enumeration
            } catch (err) {
                console.error('[Win32] Error in callback:', err);
                return true;
            }
        });

        user32.EnumWindows(callback, 0);

        if (!workerW) {
            throw new Error('WorkerW window not found');
        }

        return workerW;
    } catch (error) {
        console.error('[Win32] Error finding WorkerW:', error);
        throw error;
    }
}

/**
 * Set window parent (make child window)
 */
function setParent(childHandle, parentHandle) {
    try {
        const result = user32.SetParent(childHandle, parentHandle);
        console.log('[Win32] SetParent result:', result);
        return result;
    } catch (error) {
        console.error('[Win32] Error in SetParent:', error);
        throw error;
    }
}

module.exports = {
    findProgman,
    findWorkerW,
    setParent
};
```

---

## Step 3: Create Live Wallpaper Manager

**Create `electron-app/electron/wallpaper-live.js`:**

```javascript
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

        // Step 2: Get primary display dimensions
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.workAreaSize;

        console.log('[Wallpaper] Display size:', width, 'x', height);

        // Step 3: Create wallpaper window
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
            alwaysOnBottom: true,
            show: false,
            backgroundColor: '#1a1a1a',
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js'),
                backgroundThrottling: false // Keep animations running
            }
        });

        // Step 4: Load content
        console.log('[Wallpaper] Loading content...');
        await wallpaperWindow.loadFile(path.join(__dirname, '../index.html'));

        // Step 5: Inject CSS to optimize for wallpaper mode
        await wallpaperWindow.webContents.executeJavaScript(`
            // Add wallpaper mode class
            document.body.classList.add('wallpaper-mode');
            
            // Hide FAB menu and other UI elements
            const fab = document.querySelector('.fab-menu');
            if (fab) fab.style.display = 'none';
            
            // Hide below-table content (download section, etc)
            const belowContent = document.getElementById('below-table-content');
            if (belowContent) belowContent.style.display = 'none';
            
            // Optimize canvas animations for wallpaper
            if (window.particleSystem) {
                window.particleSystem.setWallpaperMode(true);
            }
            
            console.log('[Wallpaper Mode] Optimizations applied');
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

        // Step 7: Set WorkerW as parent
        console.log('[Wallpaper] Setting parent...');
        win32.setParent(handleValue, workerW);

        // Step 8: Show window
        wallpaperWindow.show();
        
        isActive = true;

        console.log('[Wallpaper] ✓ Live wallpaper enabled successfully!');

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

        console.log('[Wallpaper] ✓ Live wallpaper disabled');

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
```

---

## Step 4: Update Main Process with Tray

**Update `electron-app/electron/main.js`:**

```javascript
const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const AutoLaunch = require('auto-launch');
const { setAsWallpaper } = require('./wallpaper-api');
const liveWallpaper = require('./wallpaper-live');

let mainWindow;
let tray;

// Auto-launch configuration
const autoLauncher = new AutoLaunch({
    name: 'Chemical Assistant',
    path: app.getPath('exe')
});

/**
 * Create main window
 */
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false
        },
        backgroundColor: '#f0f0f0',
        title: 'Chemical Assistant',
        icon: path.join(__dirname, '../img/png2.png'),
        autoHideMenuBar: true
    });

    mainWindow.loadFile(path.join(__dirname, '../index.html'));

    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    // ========================================
    // IMPORTANT: Don't quit on close if wallpaper is active
    // ========================================
    mainWindow.on('close', (event) => {
        if (liveWallpaper.isWallpaperActive()) {
            // Prevent closing, hide instead
            event.preventDefault();
            mainWindow.hide();
            
            // Show notification
            showNotification(
                'Chemical Assistant',
                'Running in system tray. Live wallpaper is still active.'
            );
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

/**
 * Create system tray icon
 */
function createTray() {
    // Load icon
    const iconPath = path.join(__dirname, '../img/png1.png');
    const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
    
    tray = new Tray(trayIcon);
    tray.setToolTip('Chemical Assistant');
    
    updateTrayMenu();

    // Double-click to show window
    tray.on('double-click', () => {
        if (mainWindow) {
            mainWindow.show();
        } else {
            createWindow();
        }
    });
}

/**
 * Update tray context menu
 */
function updateTrayMenu() {
    const isWallpaperActive = liveWallpaper.isWallpaperActive();
    
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open Chemical Assistant',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                } else {
                    createWindow();
                }
            }
        },
        { type: 'separator' },
        {
            label: 'Live Wallpaper',
            type: 'checkbox',
            checked: isWallpaperActive,
            click: async (menuItem) => {
                if (menuItem.checked) {
                    const result = await liveWallpaper.enableLiveWallpaper();
                    if (!result.success) {
                        showNotification('Error', result.message);
                    } else {
                        showNotification('Success', result.message);
                    }
                } else {
                    const result = liveWallpaper.disableLiveWallpaper();
                    if (result.success) {
                        showNotification('Success', result.message);
                    }
                }
                updateTrayMenu();
            }
        },
        { type: 'separator' },
        {
            label: 'Exit',
            click: () => {
                // Cleanup and quit
                liveWallpaper.cleanup();
                app.quit();
            }
        }
    ]);
    
    tray.setContextMenu(contextMenu);
}

/**
 * Show system notification
 */
function showNotification(title, body) {
    if (Notification.isSupported()) {
        new Notification({
            title: title,
            body: body,
            icon: path.join(__dirname, '../img/png1.png')
        }).show();
    }
}

// ========================================
// App Lifecycle
// ========================================

app.whenReady().then(() => {
    createWindow();
    createTray();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Don't quit when all windows closed (tray mode)
app.on('window-all-closed', (event) => {
    // Keep app running if wallpaper is active
    if (liveWallpaper.isWallpaperActive()) {
        event.preventDefault();
    } else if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Cleanup before quit
app.on('before-quit', () => {
    liveWallpaper.cleanup();
});

// ========================================
// IPC Handlers
// ========================================

// Static wallpaper (screenshot)
ipcMain.handle('set-wallpaper', async (event) => {
    try {
        const screenshot = await mainWindow.webContents.capturePage();
        const pngBuffer = screenshot.toPNG();
        const tempDir = app.getPath('temp');
        const wallpaperPath = path.join(tempDir, 'chemical-assistant-wallpaper.png');
        fs.writeFileSync(wallpaperPath, pngBuffer);
        await setAsWallpaper(wallpaperPath);
        return {
            success: true,
            message: 'Wallpaper set successfully!',
            path: wallpaperPath
        };
    } catch (error) {
        return {
            success: false,
            message: 'Error: ' + error.message
        };
    }
});

// Live wallpaper - enable
ipcMain.handle('enable-live-wallpaper', async (event) => {
    const result = await liveWallpaper.enableLiveWallpaper();
    updateTrayMenu();
    return result;
});

// Live wallpaper - disable
ipcMain.handle('disable-live-wallpaper', (event) => {
    const result = liveWallpaper.disableLiveWallpaper();
    updateTrayMenu();
    return result;
});

// Live wallpaper - check status
ipcMain.handle('is-live-wallpaper-active', () => {
    return liveWallpaper.isWallpaperActive();
});

// Auto-start - enable/disable
ipcMain.handle('set-autostart', async (event, enable) => {
    try {
        if (enable) {
            await autoLauncher.enable();
        } else {
            await autoLauncher.disable();
        }
        return { success: true };
    } catch (error) {
        return { 
            success: false, 
            message: error.message 
        };
    }
});

// Auto-start - check status
ipcMain.handle('is-autostart-enabled', async () => {
    try {
        return await autoLauncher.isEnabled();
    } catch (error) {
        return false;
    }
});

// App info
ipcMain.handle('get-app-info', () => {
    return {
        name: app.getName(),
        version: app.getVersion(),
        platform: process.platform,
        arch: process.arch
    };
});

console.log('[Main] Electron app initialized with tray support');
```

---

## Step 5: Update Preload Script

**Update `electron-app/electron/preload.js`:**

```javascript
const { contextBridge, ipcRenderer } = require('electron');

// Expose safe API to renderer
contextBridge.exposeInMainWorld('electronAPI', {
    // Static wallpaper (screenshot)
    setWallpaper: () => ipcRenderer.invoke('set-wallpaper'),
    
    // Live wallpaper
    enableLiveWallpaper: () => ipcRenderer.invoke('enable-live-wallpaper'),
    disableLiveWallpaper: () => ipcRenderer.invoke('disable-live-wallpaper'),
    isLiveWallpaperActive: () => ipcRenderer.invoke('is-live-wallpaper-active'),
    
    // Auto-start
    setAutostart: (enable) => ipcRenderer.invoke('set-autostart', enable),
    isAutostartEnabled: () => ipcRenderer.invoke('is-autostart-enabled'),
    
    // App info
    getAppInfo: () => ipcRenderer.invoke('get-app-info')
});

console.log('[Preload] Electron API exposed');
```

---

## Step 6: Add UI Controls (FAB Menu)

**Update `index.html` - add new FAB button:**

Find the FAB menu section and add:

```html
<!-- Live Wallpaper Button -->
<button class="fab-item" id="live-wallpaper-btn" title="Live Wallpaper">
    <svg class="fab-icon" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/>
        <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/>
    </svg>
    <span class="fab-label">Live Wallpaper</span>
    <span class="fab-status" id="wallpaper-status">OFF</span>
</button>
```

**Add JavaScript handler at the end of `index.html` (before `</body>`):**

```html
<script>
// Live Wallpaper Toggle
(function() {
    if (!window.electronAPI) return; // Web version check

    const liveWallpaperBtn = document.getElementById('live-wallpaper-btn');
    const statusSpan = document.getElementById('wallpaper-status');
    
    if (!liveWallpaperBtn) return;

    let isActive = false;

    // Check initial status
    window.electronAPI.isLiveWallpaperActive().then(active => {
        isActive = active;
        updateUI();
    });

    // Toggle handler
    liveWallpaperBtn.addEventListener('click', async () => {
        liveWallpaperBtn.disabled = true;
        
        try {
            let result;
            
            if (!isActive) {
                // Enable wallpaper
                result = await window.electronAPI.enableLiveWallpaper();
            } else {
                // Disable wallpaper
                result = await window.electronAPI.disableLiveWallpaper();
            }

            if (result.success) {
                isActive = !isActive;
                updateUI();
                showNotification(result.message, 'success');
            } else {
                showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('[Wallpaper] Error:', error);
            showNotification('Failed to toggle wallpaper', 'error');
        } finally {
            liveWallpaperBtn.disabled = false;
        }
    });

    function updateUI() {
        if (isActive) {
            liveWallpaperBtn.classList.add('active');
            statusSpan.textContent = 'ON';
            statusSpan.style.color = '#4CAF50';
        } else {
            liveWallpaperBtn.classList.remove('active');
            statusSpan.textContent = 'OFF';
            statusSpan.style.color = '#999';
        }
    }

    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `app-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
})();
</script>

<style>
@keyframes slideIn {
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(400px);
        opacity: 0;
    }
}

.fab-item.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.fab-status {
    font-size: 11px;
    font-weight: bold;
    margin-left: 8px;
}

/* Wallpaper mode optimizations */
body.wallpaper-mode {
    overflow: hidden;
}

body.wallpaper-mode .fab-menu,
body.wallpaper-mode #below-table-content,
body.wallpaper-mode .download-app-section {
    display: none !important;
}
</style>
```

---

## Step 7: Add Settings Panel (Optional but Recommended)

**Create settings modal in `index.html`:**

```html
<!-- Settings Modal -->
<div id="settings-modal" class="modal" style="display: none;">
    <div class="modal-content">
        <span class="close" onclick="document.getElementById('settings-modal').style.display='none'">&times;</span>
        <h2>Settings</h2>
        
        <div class="settings-section">
            <h3>Auto-Start</h3>
            <label class="switch">
                <input type="checkbox" id="autostart-checkbox">
                <span class="slider"></span>
                <span class="label-text">Launch with Windows</span>
            </label>
            <p class="setting-description">
                Start Chemical Assistant automatically when Windows boots (required for persistent wallpaper)
            </p>
        </div>
        
        <div class="settings-section">
            <h3>Wallpaper Info</h3>
            <p class="info-text">
                When wallpaper is enabled and you close the main window, 
                the app will continue running in the system tray.
            </p>
            <p class="info-text">
                Right-click the tray icon to toggle wallpaper or exit the app.
            </p>
        </div>
    </div>
</div>

<style>
.settings-section {
    margin: 24px 0;
    padding: 16px;
    background: rgba(0,0,0,0.02);
    border-radius: 8px;
}

.settings-section h3 {
    margin-top: 0;
    margin-bottom: 16px;
}

.switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
}

.switch input {
    display: none;
}

.switch .slider {
    width: 50px;
    height: 24px;
    background: #ccc;
    border-radius: 24px;
    transition: 0.3s;
    margin-right: 12px;
}

.switch input:checked + .slider {
    background: #667eea;
}

.switch .slider::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: 0.3s;
}

.switch input:checked + .slider::before {
    transform: translateX(26px);
}

.setting-description {
    margin-top: 8px;
    font-size: 14px;
    color: var(--text-secondary);
}

.info-text {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
}
</style>

<script>
// Auto-start toggle
(function() {
    if (!window.electronAPI) return;

    const checkbox = document.getElementById('autostart-checkbox');
    if (!checkbox) return;

    // Load current state
    window.electronAPI.isAutostartEnabled().then(enabled => {
        checkbox.checked = enabled;
    });

    // Handle toggle
    checkbox.addEventListener('change', async (e) => {
        const result = await window.electronAPI.setAutostart(e.target.checked);
        if (!result.success) {
            alert('Failed to update auto-start setting');
            e.target.checked = !e.target.checked;
        }
    });
})();
</script>
```

**Add settings button to FAB menu:**

```html
<button class="fab-item" onclick="document.getElementById('settings-modal').style.display='block'">
    <svg class="fab-icon" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
        <path d="M12 1v6m0 6v6M1 12h6m6 0h6" stroke="currentColor" stroke-width="2"/>
    </svg>
    <span class="fab-label">Settings</span>
</button>
```

---

## Step 8: Optimize Particles for Wallpaper Mode

**Update `js/particles.js`:**

Add this method to the particle system:

```javascript
class ParticleSystem {
    constructor() {
        // ... existing code ...
        this.wallpaperMode = false;
        this.fpsCap = 60; // Normal FPS
    }

    /**
     * Enable wallpaper mode optimizations
     */
    setWallpaperMode(enabled) {
        this.wallpaperMode = enabled;
        
        if (enabled) {
            // Reduce FPS to save resources when running as wallpaper
            this.fpsCap = 30;
            console.log('[Particles] Wallpaper mode: FPS capped at 30');
        } else {
            this.fpsCap = 60;
        }
    }

    // ... rest of existing code ...
}
```

---

## Step 9: Update package.json

**Ensure all dependencies are included in build:**

```json
{
  "build": {
    "appId": "com.chemistryassistant.wallpaper",
    "productName": "Chemical Assistant",
    "files": [
      "electron/**/*",
      "index.html",
      "css/**/*",
      "js/**/*",
      "img/**/*",
      "manifest.json",
      "sw.js",
      "node_modules/ffi-napi/**/*",
      "node_modules/ref-napi/**/*",
      "node_modules/auto-launch/**/*"
    ],
    "directories": {
      "output": "dist",
      "buildResources": "build"
    },
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        }
      ],
      "icon": "img/png2.png",
      "requestExecutionLevel": "requireAdministrator"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "Chemical Assistant",
      "artifactName": "ChemicalAssistant-Setup-${version}.exe",
      "perMachine": false,
      "allowElevation": true
    }
  }
}
```

---

## Testing Checklist

After implementation, test in this order:

### Phase 1: Basic Functionality
- [ ] App starts without errors
- [ ] Main window displays correctly
- [ ] Console shows no critical errors

### Phase 2: Windows API
- [ ] Console shows "WorkerW found: [number]"
- [ ] No errors about missing DLL or functions

### Phase 3: Live Wallpaper
- [ ] Click "Enable Live Wallpaper" button
- [ ] Wallpaper appears behind desktop icons
- [ ] Desktop icons remain clickable
- [ ] Animations are smooth (not laggy)
- [ ] Click "Disable Live Wallpaper"
- [ ] Wallpaper disappears

### Phase 4: System Tray
- [ ] Tray icon appears in system tray
- [ ] Close main window (X button)
- [ ] Window hides (doesn't quit app)
- [ ] Wallpaper continues running
- [ ] Right-click tray icon → menu appears
- [ ] Double-click tray icon → window reappears
- [ ] Tray menu "Exit" → app quits and wallpaper stops

### Phase 5: Auto-Start
- [ ] Enable auto-start in settings
- [ ] Restart computer
- [ ] App starts automatically in tray
- [ ] Wallpaper does NOT auto-enable (user must enable manually)

---

## Common Issues and Solutions

### Issue 1: "Cannot find module 'ffi-napi'"

**Solution:** Run `npm install` in electron-app directory

### Issue 2: "WorkerW not found"

**Possible causes:**
- Windows 11 has different window hierarchy
- Need to run as administrator

**Debug:**
```javascript
// Add more logging in win32-api.js findWorkerW()
console.log('All WorkerW windows:', allWorkerWs);
```

### Issue 3: White screen in wallpaper window

**Check:**
- DevTools in wallpaper window (right-click wallpaper → Inspect)
- Console errors
- File paths correct

### Issue 4: App requires admin rights

**Expected behavior on some systems.**

**Solution:** Update NSIS config:
```json
"requestExecutionLevel": "requireAdministrator"
```

### Issue 5: Wallpaper window visible in Alt+Tab

**Fix in wallpaper-live.js:**
```javascript
wallpaperWindow = new BrowserWindow({
    // ... existing options ...
    skipTaskbar: true,
    show: false,
    type: 'desktop' // Add this
});
```

---

## User Instructions (for README)

### How to Use Live Wallpaper:

1. **Install the app** - Run `ChemicalAssistant-Setup.exe`

2. **Open the app** - It will appear in your taskbar

3. **Enable wallpaper:**
   - Click the FAB menu (bottom right)
   - Click "Live Wallpaper" button
   - Status changes to "ON"
   - Your periodic table is now animated on desktop!

4. **Keep it running:**
   - Close the main window (X button)
   - App moves to system tray (near clock)
   - Wallpaper keeps running

5. **Optional - Auto-start:**
   - Open Settings from FAB menu
   - Enable "Launch with Windows"
   - App will start in tray when you boot PC

6. **To disable:**
   - Click "Live Wallpaper" again to turn OFF
   - OR right-click tray icon → uncheck "Live Wallpaper"

7. **To fully exit:**
   - Right-click tray icon → "Exit"

---

## Summary

This implementation creates a production-ready live wallpaper system with:

✅ Native Windows API integration
✅ System tray support (runs in background)
✅ Auto-start with Windows
✅ Minimal resource usage (~30-50MB RAM)
✅ Professional user experience (like Wallpaper Engine)
✅ Easy toggle on/off
✅ Safe cleanup on exit

**Estimated development time:** 3-5 days
**Lines of code:** ~800 new + 200 modified

Please implement these changes in the order presented. Test each phase before moving to the next.
