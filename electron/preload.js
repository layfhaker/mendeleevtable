/* =========================================
   ELECTRON PRELOAD.JS — Безопасный API для renderer
   ========================================= */

const { contextBridge, ipcRenderer } = require('electron');

// Безопасно передаем API в renderer процесс
contextBridge.exposeInMainWorld('electronAPI', {
    /**
     * Устанавливает текущее состояние таблицы как обои Windows
     * @returns {Promise<{success: boolean, message: string}>}
     */
    setAsWallpaper: async () => {
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

console.log('[Preload] Electron API инициализирован');
