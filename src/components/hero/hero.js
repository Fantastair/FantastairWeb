import { elements } from '../../scripts/global.js';

const finalHeight = 60;
const finalTitleTop = 30;
const finalTitleLeft = 15;

const iconWrapperTop = parseInt(window.getComputedStyle(elements.heroIconWrapper).getPropertyValue('--top').trim(), 10);
const heroTitleTop = parseInt(window.getComputedStyle(elements.heroTitle).getPropertyValue('--top').trim(), 10) / 100;

/**
 * 根据滚动比例更新英雄区域样式
 */
export function updateHeroStyles() {
    const scrollY = window.scrollY;
    const rawRatio = scrollY / (window.innerHeight - finalHeight);
    const ratio = Math.min(rawRatio, 1);

    // 高度和模糊效果
    elements.hero.style.height = `${(1 - ratio) * (window.innerHeight - finalHeight) + finalHeight}px`;
    elements.heroBg.style.filter = `blur(${ratio * 5}px)`;
    elements.heroBg.style.transform = `scale(${1 + ratio * 0.2})`;

    // 字体大小响应式调整
    const min = 2.5;
    const ideal = 16 - ratio * 11.2;
    const max = 8;
    elements.heroTitle.style.fontSize = `clamp(${min}rem, ${ideal}vmin, ${max}rem)`;

    // 图标位置
    elements.heroIconWrapper.style.top = `${-iconWrapperTop * ratio + (1 - ratio) * iconWrapperTop}vh`;

    // 标题位置变换
    const titleLeft = finalTitleLeft * ratio ** 2 + window.innerWidth * (1 - ratio ** 2) / 2;
    const titleTop = finalTitleTop * ratio + window.innerHeight * (1 - ratio) * heroTitleTop;

    elements.heroTitle.style.left = `${titleLeft}px`;
    elements.heroTitle.style.top = `${titleTop}px`;
    elements.heroTitle.style.transform = `translate(-${50 * (1 - ratio ** 2)}%, -50%)`;
}
