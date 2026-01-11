/* =========================================
   ELECTRON MAIN.JS — Главный процесс Electron
   с поддержкой Live Wallpaper и System Tray
   ========================================= */

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
        icon: path.join(__dirname, '../img/icon-192.png'),
        autoHideMenuBar: true
    });

    mainWindow.loadFile(path.join(__dirname, '../../index.html'));

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
    const iconPath = path.join(__dirname, '../img/icon-192.png');
    let trayIcon;

    try {
        trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
    } catch (error) {
        console.error('[Tray] Error loading icon:', error);
        // Create a simple fallback icon
        trayIcon = nativeImage.createEmpty();
    }

    tray = new Tray(trayIcon);
    tray.setToolTip('Chemical Assistant');

    updateTrayMenu();

    // Double-click to show window
    tray.on('double-click', () => {
        if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
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
        const iconPath = path.join(__dirname, '../img/icon-192.png');
        new Notification({
            title: title,
            body: body,
            icon: iconPath
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
        // Don't quit
        return;
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
