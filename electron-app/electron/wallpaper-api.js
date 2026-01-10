/* =========================================
   ELECTRON WALLPAPER-API.JS — Windows API для установки обоев
   ========================================= */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Устанавливает изображение как обои рабочего стола Windows
 * @param {string} imagePath - Абсолютный путь к изображению
 * @returns {Promise<void>}
 */
async function setAsWallpaper(imagePath) {
    return new Promise((resolve, reject) => {
        // Проверяем существование файла
        if (!fs.existsSync(imagePath)) {
            return reject(new Error(`Файл не найден: ${imagePath}`));
        }

        // Проверяем платформу
        if (process.platform !== 'win32') {
            return reject(new Error('Установка обоев поддерживается только на Windows'));
        }

        // Нормализуем путь для PowerShell (обратные слеши)
        const normalizedPath = path.resolve(imagePath).replace(/\\/g, '\\\\');

        // PowerShell команда для установки обоев
        const psCommand = `
            $setwallpapersrc = @"
using System.Runtime.InteropServices;
public class Wallpaper {
    public const int SetDesktopWallpaper = 20;
    public const int UpdateIniFile = 0x01;
    public const int SendWinIniChange = 0x02;
    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    private static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
    public static void SetWallpaper(string path) {
        SystemParametersInfo(SetDesktopWallpaper, 0, path, UpdateIniFile | SendWinIniChange);
    }
}
"@
            Add-Type -TypeDefinition $setwallpapersrc
            [Wallpaper]::SetWallpaper("${normalizedPath}")
        `;

        // Альтернативный метод через реестр (более надежный)
        const registryCommand = `
            Set-ItemProperty -path 'HKCU:\\Control Panel\\Desktop' -name Wallpaper -value "${normalizedPath}"
            Set-ItemProperty -path 'HKCU:\\Control Panel\\Desktop' -name WallpaperStyle -value '10'
            Set-ItemProperty -path 'HKCU:\\Control Panel\\Desktop' -name TileWallpaper -value '0'
            rundll32.exe user32.dll, UpdatePerUserSystemParameters, 0, $false
        `;

        // Используем реестровый метод (более стабильный)
        const command = `powershell -Command "${registryCommand.replace(/"/g, '\\"').replace(/\n/g, '; ')}"`;

        console.log('[Wallpaper API] Выполняется команда установки обоев...');

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('[Wallpaper API] Ошибка выполнения:', error);
                console.error('[Wallpaper API] stderr:', stderr);
                return reject(new Error(`Не удалось установить обои: ${error.message}`));
            }

            console.log('[Wallpaper API] Обои успешно установлены!');
            if (stdout) console.log('[Wallpaper API] stdout:', stdout);

            resolve();
        });
    });
}

/**
 * Альтернативный метод через SystemParametersInfo (более прямой подход)
 * @param {string} imagePath - Абсолютный путь к изображению
 * @returns {Promise<void>}
 */
async function setAsWallpaperDirect(imagePath) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(imagePath)) {
            return reject(new Error(`Файл не найден: ${imagePath}`));
        }

        if (process.platform !== 'win32') {
            return reject(new Error('Поддерживается только Windows'));
        }

        const normalizedPath = path.resolve(imagePath);

        // Используем C# код через PowerShell для прямого вызова Windows API
        const psScript = `
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class WallpaperHelper {
    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
}
"@
[WallpaperHelper]::SystemParametersInfo(0x0014, 0, "${normalizedPath.replace(/\\/g, '\\\\')}", 0x0003)
        `;

        const command = `powershell -NoProfile -ExecutionPolicy Bypass -Command "${psScript.replace(/"/g, '\\"').replace(/\n/g, '; ')}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('[Wallpaper API Direct] Ошибка:', error);
                return reject(error);
            }
            console.log('[Wallpaper API Direct] Успех!');
            resolve();
        });
    });
}

module.exports = {
    setAsWallpaper,
    setAsWallpaperDirect
};
