以下是该工具中**深色动态模糊背景**的实现逻辑说明：

# 动态模糊背景实现逻辑

该背景效果旨在模仿 Apple Music 的沉浸式播放界面，通过将专辑封面进行高斯模糊和放大处理，作为整个页面的环境背景。

## 1. HTML 结构设计

背景由两层叠加的 `div` 组成，位于主内容容器的最底层：

```html
<!-- Main Preview Area -->
<div class="flex-1 relative overflow-hidden bg-black ...">

    <!-- Layer 1: 动态背景层 (显示模糊后的封面) -->
    <div id="dynamicBg"
        class="absolute inset-0 z-0 transition-all duration-1000 ease-in-out opacity-60 scale-110 blur-3xl bg-cover bg-center">
    </div>

    <!-- Layer 2: 遮罩层 (进一步模糊和压暗，确保前景文字可读) -->
    <div class="absolute inset-0 z-0 bg-black/40 backdrop-blur-3xl"></div>

    <!-- Content Wrapper (前景内容) -->
    <div class="relative z-10 ...">
        <!-- ... -->
    </div>
</div>
```

## 2. CSS 样式解析 (Tailwind CSS)

核心样式类及其作用如下：

| 类名 | 作用 | 原理 |
| :--- | :--- | :--- |
| `absolute inset-0` | 绝对定位铺满 | 让背景层充满整个父容器。 |
| `z-0` | 层级控制 | 确保背景位于内容 (`z-10`) 之下。 |
| `blur-3xl` | **高斯模糊** | 提供极强的模糊效果，使图片细节消失，只保留色块。 |
| `scale-110` | **放大处理** | 将背景放大 110%，防止因模糊处理导致边缘出现白边或透明区域。 |
| `opacity-60` | 透明度 | 降低图片不透明度，使其与底部的黑色背景融合，避免过于刺眼。 |
| `bg-cover bg-center` | 图片适配 | 确保图片始终覆盖整个区域且居中显示。 |
| `transition-all duration-1000` | **平滑过渡** | 当切换歌曲封面时，背景会用 1 秒的时间平滑渐变，而不是生硬切换。 |
| `bg-black/40` (Layer 2) | 黑色遮罩 | 在模糊背景上覆盖一层 40% 透明度的黑色，增加对比度。 |
| `backdrop-blur-3xl` (Layer 2) | 背景模糊 | 再次对下层元素进行模糊，使光影效果更加柔和均匀。 |

## 3. JavaScript 交互逻辑

通过监听文件上传事件，动态修改 DOM 元素的内联样式来实现背景切换。

```javascript
// 获取 DOM 元素
const coverInput = document.getElementById('coverInput');
const dynamicBg = document.getElementById('dynamicBg');

// 监听封面上传
coverInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // 1. 将上传的文件转换为浏览器可访问的 Blob URL
        const url = URL.createObjectURL(file);
        
        // 2. 设置为背景层的背景图片
        // CSS 的 transition 属性会自动处理切换时的渐变动画
        dynamicBg.style.backgroundImage = `url(${url})`;
    }
});
```

## 总结

整个流程如下：
1.  用户上传图片。
2.  JS 生成图片 URL 并赋值给 `#dynamicBg`。
3.  CSS 滤镜 (`blur`) 将图片模糊化。
4.  CSS 变换 (`scale`) 放大图片消除边缘。
5.  CSS 过渡 (`transition`) 确保切换时的视觉流畅性。
6.  上层遮罩 (`bg-black/40`) 确保前景文字清晰可见。