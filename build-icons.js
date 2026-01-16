const fs = require('fs');
const path = require('path');

// Директории
const iconsDir = path.join(__dirname, 'icons');
const outputFile = path.join(__dirname, 'js', 'icons.js');

// Список всех иконок
const iconFiles = [
    'icon-calc',
    'icon-sun',
    'icon-moon',
    'icon-particles',
    'icon-menu',
    'icon-close',
    'icon-filter',
    'icon-search',
    'icon-palette',
    'icon-bolt',
    'icon-info'
];

// Начало спрайта
let spriteContent = `// SVG Спрайт иконок (автоматически сгенерирован из icons/*.svg)\nconst iconsSVG = \`\n<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\n`;

// Читаем каждый SVG файл и конвертируем в symbol
iconFiles.forEach(iconName => {
    const filePath = path.join(iconsDir, `${iconName}.svg`);

    if (!fs.existsSync(filePath)) {
        console.error(`Файл ${iconName}.svg не найден!`);
        return;
    }

    const svgContent = fs.readFileSync(filePath, 'utf8');

    // Извлекаем содержимое между тегами <svg> и </svg>
    const svgMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
    if (!svgMatch) {
        console.error(`Неверный формат SVG в ${iconName}.svg`);
        return;
    }

    // Извлекаем атрибуты из тега <svg>
    const svgTagMatch = svgContent.match(/<svg([^>]*)>/);
    const svgAttributes = svgTagMatch ? svgTagMatch[1] : '';

    // Извлекаем нужные атрибуты
    const viewBox = (svgAttributes.match(/viewBox="([^"]*)"/) || [])[1] || '0 0 24 24';
    const fill = (svgAttributes.match(/fill="([^"]*)"/) || [])[1];
    const stroke = (svgAttributes.match(/stroke="([^"]*)"/) || [])[1];
    const strokeWidth = (svgAttributes.match(/stroke-width="([^"]*)"/) || [])[1];
    const strokeLinecap = (svgAttributes.match(/stroke-linecap="([^"]*)"/) || [])[1];
    const strokeLinejoin = (svgAttributes.match(/stroke-linejoin="([^"]*)"/) || [])[1];

    // Формируем symbol
    let symbolTag = `    <symbol id="${iconName}" viewBox="${viewBox}"`;
    if (fill) symbolTag += ` fill="${fill}"`;
    if (stroke) symbolTag += ` stroke="${stroke}"`;
    if (strokeWidth) symbolTag += ` stroke-width="${strokeWidth}"`;
    if (strokeLinecap) symbolTag += ` stroke-linecap="${strokeLinecap}"`;
    if (strokeLinejoin) symbolTag += ` stroke-linejoin="${strokeLinejoin}"`;
    symbolTag += `>\n`;

    // Добавляем содержимое SVG
    const innerContent = svgMatch[1].trim().split('\n').map(line => `        ${line}`).join('\n');
    symbolTag += innerContent + '\n';
    symbolTag += `    </symbol>\n`;

    spriteContent += symbolTag;
    spriteContent += '\n';

    console.log(`✓ Обработан ${iconName}.svg`);
});

// Завершаем спрайт
spriteContent += `</svg>\n\`;\n\n`;
spriteContent += `// Вставляем в начало body\n`;
spriteContent += `document.body.insertAdjacentHTML('afterbegin', iconsSVG);\n`;

// Записываем результат
fs.writeFileSync(outputFile, spriteContent, 'utf8');
console.log(`\n✓ Спрайт успешно сгенерирован: ${outputFile}`);
