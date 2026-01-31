/* =========================================
   ELECTRON MAIN.JS — Главный процесс Electron
   с поддержкой Live Wallpaper и System Tray
   ========================================= */

const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, Notification } = require('electron');

// Disable hardware acceleration to prevent rendering issues in wallpaper mode
app.disableHardwareAcceleration();

const path = require('path');
const fs = require('fs');
const AutoLaunch = require('auto-launch');
let setAsWallpaper = null;

if (process.platform === 'win32') {
    ({ setAsWallpaper } = require('./wallpaper-api'));
}

let attach = async () => {
    throw new Error('Live wallpaper is not available for this platform.');
};
let detach = async () => {};
let reset = () => {};

if (process.platform === 'win32') {
    try {
        ({ attach, detach, reset } = require('electron-as-wallpaper'));
    } catch (error) {
        console.warn('[Wallpaper] electron-as-wallpaper is unavailable:', error.message);
    }
} else if (process.platform === 'linux') {
    try {
        ({ attach, detach, reset } = require('./wallpaper-linux'));
    } catch (error) {
        console.warn('[Wallpaper] Linux wallpaper helper is unavailable:', error.message);
    }
}

let mainWindow;
let tray;
let appRootPath;

function getAppRootCandidates() {
    if (app.isPackaged) {
        const appPath = app.getAppPath();
        const resourcesPath = process.resourcesPath;
        return [
            path.join(appPath, 'app'),
            appPath,
            path.join(resourcesPath, 'app'),
            resourcesPath
        ];
    }

    const devRoot = path.join(__dirname, '../..');
    return [devRoot, path.resolve(devRoot)];
}

function resolveAppRoot() {
    const candidates = getAppRootCandidates();
    for (const candidate of candidates) {
        try {
            const indexPath = path.join(candidate, 'index.html');
            if (fs.existsSync(indexPath)) {
                return { root: candidate, indexPath };
            }
        } catch (error) {
            // Ignore invalid paths and keep searching.
        }
    }

    const fallbackRoot = candidates[0];
    return {
        root: fallbackRoot,
        indexPath: path.join(fallbackRoot, 'index.html'),
        missing: true
    };
}

// Auto-launch configuration
const autoLauncher = new AutoLaunch({
    name: 'Chemical Assistant',
    path: app.getPath('exe')
});

/**
 * Create main window
 */
function createWindow() {
    const resolved = resolveAppRoot();
    appRootPath = resolved.root;

    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false
        },
        backgroundColor: '#f0f0f0',
        title: 'Chemical Assistant',
        icon: path.join(appRootPath, 'img', 'icon-192.png'),
        autoHideMenuBar: true
    });

    if (!resolved.missing) {
        mainWindow.loadFile(resolved.indexPath);
    } else {
        console.error('[Main] index.html not found in any app root candidate:', getAppRootCandidates());
        const errorHtml = `
            <html lang="ru">
                <head>
                    <meta charset="UTF-8" />
                    <title>Chemical Assistant</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; background: #0f172a; color: #e2e8f0; }
                        code { background: #1e293b; padding: 2px 6px; border-radius: 4px; }
                        h1 { margin-top: 0; }
                    </style>
                </head>
                <body>
                    <h1>Не удалось загрузить приложение</h1>
                    <p>Файл <code>index.html</code> не найден в пакете.</p>
                    <p>Проверьте, что сборка включает корневые файлы сайта (index.html, css, js, img).</p>
                </body>
            </html>
        `;
        mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`);
    }

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
        if (!isMainFrame) return;
        console.error('[Main] Failed to load:', { errorCode, errorDescription, validatedURL });
        const errorHtml = `
            <html lang="ru">
                <head>
                    <meta charset="UTF-8" />
                    <title>Chemical Assistant</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; background: #0f172a; color: #e2e8f0; }
                        code { background: #1e293b; padding: 2px 6px; border-radius: 4px; }
                        h1 { margin-top: 0; }
                    </style>
                </head>
                <body>
                    <h1>Ошибка загрузки</h1>
                    <p>Не удалось открыть <code>${validatedURL}</code>.</p>
                    <p>${errorDescription} (код ${errorCode}).</p>
                </body>
            </html>
        `;
        mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`);
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    // ========================================
    // IMPORTANT: Don't quit on close if wallpaper is active
    // ========================================
    mainWindow.on('close', (event) => {
        if (global.isWallpaperActive) {
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
    const iconPath = path.join(appRootPath, 'img', 'icon-192.png');
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
    const isWallpaperActive = global.isWallpaperActive || false;

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
                    try {
                        await attach(mainWindow, {
                            transparent: true,
                            forwardKeyboardInput: true,
                            forwardMouseInput: true,
                        });
                        global.isWallpaperActive = true;
                        showNotification('Success', 'Live wallpaper enabled!');
                    } catch (error) {
                        showNotification('Error', `Failed to enable live wallpaper: ${error.message}`);
                        menuItem.checked = false; // Reset checkbox state
                    }
                } else {
                    try {
                        await detach(mainWindow);
                        global.isWallpaperActive = false;
                        showNotification('Success', 'Live wallpaper disabled.');
                    } catch (error) {
                        showNotification('Error', `Failed to disable live wallpaper: ${error.message}`);
                    }
                }
                updateTrayMenu();
            }
        },
        { type: 'separator' },
        {
            label: 'Exit',
            click: async () => {
                // Cleanup and quit
                if (global.isWallpaperActive) {
                    try {
                        await detach(mainWindow);
                        reset(); // Restore original wallpaper
                    } catch (error) {
                        console.error('Error detaching wallpaper:', error);
                    }
                    global.isWallpaperActive = false;
                }
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
        const iconPath = path.join(appRootPath, 'img', 'icon-192.png');
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
    if (global.isWallpaperActive) {
        // Don't quit
        return;
    } else if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Cleanup before quit
app.on('before-quit', async () => {
    if (global.isWallpaperActive) {
        try {
            await detach(mainWindow);
            reset(); // Restore original wallpaper
        } catch (error) {
            console.error('Error detaching wallpaper on quit:', error);
        }
        global.isWallpaperActive = false;
    }
});

// ========================================
// IPC Handlers
// ========================================

// Static wallpaper (screenshot)
ipcMain.handle('set-wallpaper', async (event) => {
    try {
        if (process.platform !== 'win32' || !setAsWallpaper) {
            return {
                success: false,
                message: 'Установка обоев поддерживается только на Windows'
            };
        }

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
    try {
        await attach(mainWindow, {
            transparent: true,
            forwardKeyboardInput: true,
            forwardMouseInput: true,
        });
        global.isWallpaperActive = true;
        updateTrayMenu();
        return {
            success: true,
            message: 'Live wallpaper enabled!'
        };
    } catch (error) {
        return {
            success: false,
            message: `Failed to enable live wallpaper: ${error.message}`
        };
    }
});

// Live wallpaper - disable
ipcMain.handle('disable-live-wallpaper', async (event) => {
    try {
        await detach(mainWindow);
        global.isWallpaperActive = false;
        updateTrayMenu();
        return {
            success: true,
            message: 'Live wallpaper disabled.'
        };
    } catch (error) {
        return {
            success: false,
            message: `Failed to disable live wallpaper: ${error.message}`
        };
    }
});

// Live wallpaper - check status
ipcMain.handle('is-live-wallpaper-active', () => {
    return global.isWallpaperActive || false;
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
