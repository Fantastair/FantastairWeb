const elements = {
    hero:            document.getElementById('hero'),
    heroBg:          document.getElementById('hero-bg'),
    heroIconWrapper: document.getElementById('hero-icon-wrapper'),
    heroTitle:       document.getElementById('hero-title'),
    heroSpacer:      document.getElementById('hero-spacer'),
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
        ratio = Math.min(window.scrollY / (window.innerHeight - finalHeight), 1);
    }

    if (ratio === last_ratio) return ratio;    // 避免重复计算
    if (ratio === 1 && last_ratio !== 1) {     // 锁定最终状态
        elements.hero.style.willChange = 'auto';
        elements.heroBg.style.willChange = 'auto';
        elements.heroIconWrapper.style.willChange = 'auto';
        elements.heroTitle.style.willChange = 'auto';
    } else if (ratio < 1 && last_ratio === 1) {     // 解锁最终状态
        elements.hero.style.willChange = '';
        elements.heroBg.style.willChange = '';
        elements.heroIconWrapper.style.willChange = '';
        elements.heroTitle.style.willChange = '';
    }
    last_ratio = ratio;

    // 区域高度变换
    elements.hero.style.height = `${(1 - ratio) * (window.innerHeight - finalHeight) + finalHeight}px`;
    
    // 图标位置变换
    elements.heroIconWrapper.style.top = `${-iconWrapperTop * ratio + (1 - ratio) * iconWrapperTop}dvh`;

    // 主标题变换
    elements.heroTitle.style.fontSize = `clamp(2.5rem, ${16 - ratio * 11.2}vmin, 8rem)`;
    elements.heroTitle.style.left = `${finalTitleLeft * ratio ** 2 + window.innerWidth * (1 - ratio ** 2) / 2}px`;
    elements.heroTitle.style.top = `${finalTitleTop * ratio + window.innerHeight * (1 - ratio) * heroTitleTop}px`;
    elements.heroTitle.style.transform = `translate(-${50 * (1 - ratio ** 2)}%, -50%)`;

    // 背景图片变换
    elements.heroBg.style.top = `${-ratio / 2 * (window.innerHeight - finalHeight)}px`;
    elements.heroBg.style.filter = `blur(${ratio * 5}px)`;
    elements.heroBg.style.transform = `scale(${1 + ratio * 0.2})`;
    if (ratio > 0.5) {
        elements.heroBg.style.opacity = `${2 - ratio * 2}`;
        if (ratio == 1 && elements.heroBg.style.display != 'hidden') {
            elements.heroBg.style.display = 'none';
        } else if (ratio < 1 && elements.heroBg.style.display != 'block') {
            elements.heroBg.style.display = 'block';
        }
    }
    else if (ratio <= 0.5 && elements.heroBg.style.opacity !== '') {
        elements.heroBg.style.opacity = '';
    }

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

        // 自动计算并设置动画延时
        span.style.animationDelay = `${index * delayStep}s`;

        elements.heroTitle.appendChild(span);
    });
}
