/* =========================================
   ELECTRON PRELOAD.JS — Безопасный API для renderer
   с поддержкой Live Wallpaper
   ========================================= */

const { contextBridge, ipcRenderer } = require('electron');

// Безопасно передаем API в renderer процесс
contextBridge.exposeInMainWorld('electronAPI', {
    /**
     * Устанавливает текущее состояние таблицы как статичные обои Windows
     * @returns {Promise<{success: boolean, message: string}>}
     */
    setAsWallpaper: async () => {
        if (process.platform !== 'win32') {
            return {
                success: false,
                message: 'Установка обоев поддерживается только на Windows'
            };
        }

        try {
            const result = await ipcRenderer.invoke('set-wallpaper');
            return result;
        } catch (error) {
            console.error('[Preload] Ошибка setAsWallpaper:', error);
            return {
                success: false,
                message: 'Ошибка связи с главным процессом'
            };
        }
    },

    /**
     * Включает живые обои
     * @returns {Promise<{success: boolean, message: string}>}
     */
    enableLiveWallpaper: async () => {
        try {
            const result = await ipcRenderer.invoke('enable-live-wallpaper');
            return result;
        } catch (error) {
            console.error('[Preload] Ошибка enableLiveWallpaper:', error);
            return {
                success: false,
                message: 'Ошибка связи с главным процессом'
            };
        }
    },

    /**
     * Отключает живые обои
     * @returns {Promise<{success: boolean, message: string}>}
     */
    disableLiveWallpaper: async () => {
        try {
            const result = await ipcRenderer.invoke('disable-live-wallpaper');
            return result;
        } catch (error) {
            console.error('[Preload] Ошибка disableLiveWallpaper:', error);
            return {
                success: false,
                message: 'Ошибка связи с главным процессом'
            };
        }
    },

    /**
     * Проверяет статус живых обоев
     * @returns {Promise<boolean>}
     */
    isLiveWallpaperActive: async () => {
        try {
            const result = await ipcRenderer.invoke('is-live-wallpaper-active');
            return result;
        } catch (error) {
            console.error('[Preload] Ошибка isLiveWallpaperActive:', error);
            return false;
        }
    },

    /**
     * Включает/отключает автозапуск с Windows
     * @param {boolean} enable
     * @returns {Promise<{success: boolean, message?: string}>}
     */
    setAutostart: async (enable) => {
        try {
            const result = await ipcRenderer.invoke('set-autostart', enable);
            return result;
        } catch (error) {
            console.error('[Preload] Ошибка setAutostart:', error);
            return {
                success: false,
                message: 'Ошибка связи с главным процессом'
            };
        }
    },

    /**
     * Проверяет статус автозапуска
     * @returns {Promise<boolean>}
     */
    isAutostartEnabled: async () => {
        try {
            const result = await ipcRenderer.invoke('is-autostart-enabled');
            return result;
        } catch (error) {
            console.error('[Preload] Ошибка isAutostartEnabled:', error);
            return false;
        }
    },

    /**
     * Получает информацию о приложении
     * @returns {Promise<{name: string, version: string, platform: string}>}
     */
    getAppInfo: async () => {
        try {
            const info = await ipcRenderer.invoke('get-app-info');
            return info;
        } catch (error) {
            console.error('[Preload] Ошибка getAppInfo:', error);
            return null;
        }
    },

    /**
     * Проверяет, запущено ли приложение в Electron
     * @returns {boolean}
     */
    isElectron: () => {
        return true;
    }
});

console.log('[Preload] Electron API инициализирован с поддержкой Live Wallpaper');
