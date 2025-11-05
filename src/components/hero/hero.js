/**
 * 根据滚动比例更新英雄区域样式
 * @param {number} ratio - 滚动比例 (0-1)
 */
export function updateHeroStyles(ratio) {
    const { hero, heroBg, heroIconWrapper, heroTitle } = elements;
    
    // 高度和模糊效果
    hero.style.height = `${(1 - ratio) * (window.innerHeight - CONFIG.finalHeight) + CONFIG.finalHeight}px`;
    heroBg.style.filter = `blur(${ratio * 5}px)`;
    heroBg.style.transform = `scale(${1 + ratio * 0.2})`;

    // 字体大小响应式调整
    const min = 2.5;
    const ideal = 16 - ratio * 11.2;
    const max = 8;
    heroTitle.style.fontSize = `clamp(${min}rem, ${ideal}vmin, ${max}rem)`;

    // 图标位置
    heroIconWrapper.style.top = `${-40 * ratio + (1 - ratio) * 40}vh`;

    // 标题位置变换
    const titleLeft = CONFIG.finalTitleLeft * ratio ** 2 + window.innerWidth * (1 - ratio ** 2) / 2;
    const titleTop = CONFIG.finalTitleTop * ratio + window.innerHeight * (1 - ratio) * 0.55;
    
    heroTitle.style.left = `${titleLeft}px`;
    heroTitle.style.top = `${titleTop}px`;
    heroTitle.style.transform = `translate(-${50 * (1 - ratio ** 2)}%, -50%)`;
}
