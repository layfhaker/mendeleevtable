/* =========================================
   ELECTRON MAIN.JS — Главный процесс Electron
   ========================================= */

const { app, BrowserWindow, ipcMain, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const { setAsWallpaper } = require('./wallpaper-api');

let mainWindow;

// Создание главного окна
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
        title: 'Chemical Assistant Wallpaper',
        icon: path.join(__dirname, '../img/icon-192.png'),
        autoHideMenuBar: true
    });

    // Загружаем index.html
    mainWindow.loadFile(path.join(__dirname, '../index.html'));

    // Открываем DevTools в режиме разработки
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    // Обработка закрытия окна
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Инициализация приложения
app.whenReady().then(() => {
    createWindow();

    // Для macOS: восстанавливаем окно при активации
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Закрытие приложения (кроме macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// =========================================
// IPC Handlers — Обработчики сообщений от renderer
// =========================================

// Обработка установки обоев
ipcMain.handle('set-wallpaper', async (event) => {
    try {
        // Создаем скриншот текущего окна
        const screenshot = await mainWindow.webContents.capturePage();

        // Конвертируем в PNG
        const pngBuffer = screenshot.toPNG();

        // Сохраняем во временную директорию
        const tempDir = app.getPath('temp');
        const wallpaperPath = path.join(tempDir, 'chemical-assistant-wallpaper.png');

        // Сохраняем файл
        fs.writeFileSync(wallpaperPath, pngBuffer);

        console.log('[Main] Скриншот сохранен:', wallpaperPath);

        // Устанавливаем как обои через Windows API
        await setAsWallpaper(wallpaperPath);

        return {
            success: true,
            message: 'Обои успешно установлены!',
            path: wallpaperPath
        };
    } catch (error) {
        console.error('[Main] Ошибка установки обоев:', error);
        return {
            success: false,
            message: 'Ошибка: ' + error.message
        };
    }
});

// Получение информации о версии
ipcMain.handle('get-app-info', () => {
    return {
        name: app.getName(),
        version: app.getVersion(),
        platform: process.platform,
        arch: process.arch
    };
});

console.log('[Main] Electron приложение инициализировано');
