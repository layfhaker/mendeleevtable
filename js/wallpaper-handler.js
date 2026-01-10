/* =========================================
   WALLPAPER-HANDLER.JS — Обработка установки обоев
   ========================================= */

(function() {
    'use strict';

    // Проверяем наличие Electron API
    function isElectronAvailable() {
        return typeof window !== 'undefined' &&
               window.electronAPI &&
               typeof window.electronAPI.setAsWallpaper === 'function';
    }

    // Показываем уведомление
    function showNotification(message, type = 'success') {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `wallpaper-notification wallpaper-notification-${type}`;
        notification.textContent = message;

        // Добавляем стили если их еще нет
        if (!document.getElementById('wallpaper-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'wallpaper-notification-styles';
            style.textContent = `
                .wallpaper-notification {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    padding: 20px 40px;
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    border-radius: 12px;
                    font-size: 18px;
                    z-index: 10000;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    animation: fadeInOut 3s ease-in-out;
                    pointer-events: none;
                }

                .wallpaper-notification-success {
                    border-left: 4px solid #4CAF50;
                }

                .wallpaper-notification-error {
                    border-left: 4px solid #f44336;
                }

                .wallpaper-notification-info {
                    border-left: 4px solid #2196F3;
                }

                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
                    10% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
                }
            `;
            document.head.appendChild(style);
        }

        // Добавляем уведомление в DOM
        document.body.appendChild(notification);

        // Удаляем через 3 секунды
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Главная функция установки обоев
    window.handleSetWallpaper = async function() {
        console.log('[Wallpaper Handler] Попытка установки обоев...');

        // Проверяем доступность Electron API
        if (!isElectronAvailable()) {
            showNotification(
                'Эта функция доступна только в Electron приложении',
                'info'
            );
            console.warn('[Wallpaper Handler] Electron API недоступен');
            return;
        }

        try {
            // Показываем индикатор загрузки
            showNotification('Создание обоев...', 'info');

            // Вызываем Electron API
            const result = await window.electronAPI.setAsWallpaper();

            if (result.success) {
                console.log('[Wallpaper Handler] Успех!', result);
                showNotification('Обои успешно установлены!', 'success');
            } else {
                console.error('[Wallpaper Handler] Ошибка:', result.message);
                showNotification(result.message || 'Не удалось установить обои', 'error');
            }
        } catch (error) {
            console.error('[Wallpaper Handler] Исключение:', error);
            showNotification('Произошла ошибка при установке обоев', 'error');
        }
    };

    // Скрываем кнопку если не Electron
    function initWallpaperButton() {
        const wallpaperOption = document.getElementById('wallpaper-option');

        if (wallpaperOption && !isElectronAvailable()) {
            // Скрываем кнопку в браузере
            wallpaperOption.style.display = 'none';
            console.log('[Wallpaper Handler] Кнопка скрыта (не Electron)');
        } else if (wallpaperOption) {
            console.log('[Wallpaper Handler] Кнопка активна (Electron режим)');
        }
    }

    // Инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWallpaperButton);
    } else {
        initWallpaperButton();
    }

    console.log('[Wallpaper Handler] Модуль загружен');

})();
