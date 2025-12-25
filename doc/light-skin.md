# 墨点背景生成逻辑

该文档描述了项目中用于生成“墨点”风格背景的核心逻辑。

## 1. 核心数据结构

背景颜色由导入的图片中提取5种主色组成的调色板决定，默认调色板是从一个预定义的颜色库 `colorLibrary` 中选取的。

```javascript
// 颜色库 (部分示例)
const colorLibrary = [
    [238, 238, 238],
    [0, 173, 181],
    [57, 62, 70],
    // ... 更多 RGB 颜色数组
];

// 当前使用的调色板 (5种颜色)
let currentInkPalette = colorLibrary.slice(0, 5);
```

## 2. 颜色处理工具

为了确保背景明亮，使用了 HSL 转换来提亮颜色。

```javascript
// RGB 转 HSL
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) { h = s = 0; } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

// HSL 转 RGB
function hslToRgb(h, s, l) {
    var r, g, b;
    if (s == 0) { r = g = b = l; } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// 提亮颜色逻辑
function brightenInkColor(rgb) {
    const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    // 限制亮度在 0.45 到 0.82 之间，并增加饱和度
    const newL = Math.max(0.45, Math.min(0.82, l));
    const newS = Math.min(1, s * 1.25);
    return hslToRgb(h, newS, newL);
}
```

## 3. 随机调色板生成

从颜色库中随机抽取不重复的颜色组成调色板。

```javascript
function pickRandomInkPalette(count = 5) {
    const palette = [];
    const used = new Set();
    while (palette.length < count && used.size < colorLibrary.length) {
        const idx = Math.floor(Math.random() * colorLibrary.length);
        if (used.has(idx)) continue;
        used.add(idx);
        palette.push(colorLibrary[idx]);
    }
    return palette;
}
```

## 4. 背景渲染逻辑 (核心)

`renderInkBackground` 函数负责生成 CSS `radial-gradient` 字符串并应用到背景层。它包含两层效果：
1.  **主墨点 (Main Drops)**: 较小、较清晰的圆点。
2.  **雾化层 (Haze Layers)**: 较大、较淡的圆点，用于融合。

```javascript
function renderInkBackground(palette, options = {}) {
    const { alreadyBright = false } = options;

    // 确定使用的调色板，并根据需要提亮
    const basePalette = (palette && palette.length) ? palette : currentInkPalette;
    const brightPalette = alreadyBright ? basePalette : basePalette.map(brightenInkColor);
    currentInkPalette = brightPalette;

    // 如果关闭了模糊背景开关，则不渲染 (依赖外部 toggleBlurBg 变量)
    // if (!toggleBlurBg.checked) return; 

    const gradients = [];
    const mainDrops = 22; // 墨点数量
    const hazeLayers = 5; // 雾化层数量

    // 生成主墨点
    for (let i = 0; i < mainDrops; i++) {
        const color = brightPalette[i % brightPalette.length];
        const posX = Math.floor(Math.random() * 100); // 0-100%
        const posY = Math.floor(Math.random() * 100); // 0-100%
        const size = Math.floor(Math.random() * 24) + 32; // 大小 32-55%
        const opacity = (Math.random() * 0.1 + 0.14).toFixed(2); // 透明度 0.14-0.24
        
        gradients.push(
            `radial-gradient(circle at ${posX}% ${posY}%, rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity}) 0%, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0) ${size}%)`
        );
    }

    // 生成雾化层
    for (let i = 0; i < hazeLayers; i++) {
        const color = brightPalette[i % brightPalette.length];
        const posX = Math.floor(Math.random() * 100);
        const posY = Math.floor(Math.random() * 100);
        const size = Math.floor(Math.random() * 45) + 75; // 大小 75-120%
        const opacity = (Math.random() * 0.06 + 0.05).toFixed(2); // 透明度 0.05-0.11
        
        gradients.push(
            `radial-gradient(circle at ${posX}% ${posY}%, rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity}) 0%, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0) ${size}%)`
        );
    }

    // 应用样式到 DOM 元素 (bgLayer)
    // bgLayer.style.backgroundColor = '#ffffff';
    // bgLayer.style.backgroundImage = gradients.join(', ');
    // bgLayer.style.backgroundSize = '100% 100%';
}
```

## 5. 刷新控制

提供两个功能：仅刷新位置（保持颜色）和刷新颜色（根据导入的图片生成新调色板或重新随机选择colorLibrary中的颜色）。

```javascript
// 刷新位置 (使用当前调色板重新生成梯度)
function refreshInkPositions() {
    renderInkBackground(currentInkPalette, { alreadyBright: true });
}

// 刷新颜色 (选取新调色板并生成)
function refreshInkColors() {
    const randomPalette = pickRandomInkPalette(5);
    renderInkBackground(randomPalette);
}
```
