const elements = {
    hero:            document.getElementById('hero'),
    heroBg:          document.getElementById('hero-bg'),
    heroIconWrapper: document.getElementById('hero-icon-wrapper'),
    heroTitle:       document.getElementById('hero-title'),
};

/**
 * 加载高清背景图片
 */
export function loadHighResBackground() {
    const highResImage = new Image();
    highResImage.src = '../../assets/images/background.webp';
    highResImage.onload = () => {
        elements.heroBg.classList.add('bgloaded');
    };
}

const finalHeight = 60;       // 最终高度
const finalTitleTop = 30;     // 最终标题顶部位置
const finalTitleLeft = 15;    // 最终标题左侧位置

const iconWrapperTop = parseInt(window.getComputedStyle(elements.heroIconWrapper).getPropertyValue('--top').trim(), 10);
const heroTitleTop = parseInt(window.getComputedStyle(elements.heroTitle).getPropertyValue('--top').trim(), 10) / 100;

let last_ratio = 0;    // 上一次的滚动比例

/**
 * 根据滚动比例更新英雄区域样式
 * @param {number} ratio - 滚动比例
 */
export function updateHeroStyles(ratio = null) {
    if (ratio === null) {
        const scrollY = window.scrollY;
        const rawRatio = scrollY / (window.innerHeight - finalHeight);
        ratio = Math.min(rawRatio, 1);
    }

    if (ratio === last_ratio) return ratio;    // 避免重复计算
    last_ratio = ratio;

    // 高度和模糊效果
    elements.hero.style.height = `${(1 - ratio) * (window.innerHeight - finalHeight) + finalHeight}px`;
    elements.heroBg.style.filter = `blur(${ratio * 5}px)`;
    elements.heroBg.style.transform = `scale(${1 + ratio * 0.2})`;

    // 字体大小调整
    const min = 2.5;
    const ideal = 16 - ratio * 11.2;
    const max = 8;
    elements.heroTitle.style.fontSize = `clamp(${min}rem, ${ideal}vmin, ${max}rem)`;

    // 图标位置变换
    elements.heroIconWrapper.style.top = `${-iconWrapperTop * ratio + (1 - ratio) * iconWrapperTop}vh`;

    // 标题位置变换
    const titleLeft = finalTitleLeft * ratio ** 2 + window.innerWidth * (1 - ratio ** 2) / 2;
    const titleTop = finalTitleTop * ratio + window.innerHeight * (1 - ratio) * heroTitleTop;
    elements.heroTitle.style.left = `${titleLeft}px`;
    elements.heroTitle.style.top = `${titleTop}px`;
    elements.heroTitle.style.transform = `translate(-${50 * (1 - ratio ** 2)}%, -50%)`;

    return ratio;
}

/**
 * 初始化标题字母动画
 * @param {number} delayStep - 每个字母之间的延时间隔（秒）
 */
export function initTitleAnimation(delayStep = 0.2) {
    // 获取原始文本内容
    const originalText = elements.heroTitle.textContent.trim();

    // 清空容器
    elements.heroTitle.innerHTML = '';

    // 将每个字符拆分成独立的 span 元素
    originalText.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'hero-letter';
        span.textContent = char;
        
        // 设置 data-char 属性，供 CSS 伪元素使用
        span.setAttribute('data-char', char);
        
        // 自动计算并设置动画延时
        const delay = index * delayStep;
        span.style.animationDelay = `${delay}s`;
        
        elements.heroTitle.appendChild(span);
    });
}
