import { elements } from '../../scripts/global.js';

let last_ratio = 0;    // 上一次的滚动比例

/**
 * 根据滚动比例更新导航栏样式
 * @param {number} ratio - 滚动比例
 */
export function updateNavStyles(ratio = null) {
    if (ratio === null) {
        const scrollY = window.scrollY;
        const rawRatio = scrollY / (window.innerHeight - 60);
        ratio = Math.min(rawRatio, 1);
    }
    if (ratio === last_ratio) return ratio;  // 比例未变化，直接返回
    last_ratio = ratio;

    if (ratio >= 0.2) {
        showNav();
    } else {
        hideNav();
    }
    return ratio;
}

let navShowed = false;  // 导航栏当前是否显示

/**
 * 显示导航栏
 */
function showNav() {
    if (navShowed) return;
    navShowed = true;
    elements.topNav.classList.add('show');

    console.log("显示导航栏");
}

/**
 * 隐藏导航栏
 */
function hideNav() {
    if (!navShowed) return;
    navShowed = false;
    elements.topNav.classList.remove('show');

    console.log("隐藏导航栏");
}
