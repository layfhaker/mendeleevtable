/**
 * Утилиты для определения типа устройства
 */

// Функция для определения типа устройства
function getDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Проверка на iOS
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    
    // Проверка на iPhone
    const isIPhone = /iPhone/.test(userAgent) && !window.MSStream;
    
    // Проверка на iPad
    const isIPad = /iPad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // Проверка на Android
    const isAndroid = /android/i.test(userAgent);
    
    // Проверка на Windows
    const isWindows = /Win/.test(userAgent);
    
    // Проверка на Mac (не iOS)
    const isMac = /Mac/.test(userAgent) && !isIOS;
    
    // Проверка на Mobile (любое мобильное устройство)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // Проверка на Touch Device
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    return {
        isIOS,
        isIPhone,
        isIPad,
        isAndroid,
        isWindows,
        isMac,
        isMobile,
        isTouchDevice
    };
}

// Функция для добавления классов устройства к body
function addDeviceClassToBody() {
    const device = getDeviceType();
    const body = document.body;
    
    // Удаляем старые классы
    body.classList.remove(
        'device-ios', 
        'device-iphone', 
        'device-ipad', 
        'device-android', 
        'device-windows', 
        'device-mac',
        'device-mobile',
        'device-touch'
    );
    
    // Добавляем новые классы в зависимости от устройства
    if (device.isIOS) body.classList.add('device-ios');
    if (device.isIPhone) body.classList.add('device-iphone');
    if (device.isIPad) body.classList.add('device-ipad');
    if (device.isAndroid) body.classList.add('device-android');
    if (device.isWindows) body.classList.add('device-windows');
    if (device.isMac) body.classList.add('device-mac');
    if (device.isMobile) body.classList.add('device-mobile');
    if (device.isTouchDevice) body.classList.add('device-touch');
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    addDeviceClassToBody();
});

// Экспорт функций для использования в других модулях
window.DeviceUtils = {
    getDeviceType,
    addDeviceClassToBody
};