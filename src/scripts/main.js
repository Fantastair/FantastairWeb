// 控制台欢迎信息
import { loadHighResBackground } from "./load-highres-bg.js";
import { updateHeroStyles } from "../components/hero/hero.js";
console.log("泥嚎 🚀 --- Fantastair");

// DOM 元素缓存
const elements = {
    hero: document.getElementById('hero'),
    // heroIconWrapper: document.getElementById('hero-icon-wrapper'),
    // heroTitle: document.getElementById('hero-title'),
    // content: document.getElementById('content'),
    // topNav: document.getElementById('top-nav'),
    // homeLink: document.getElementById('home-link'),
    // qrModal: document.getElementById('qr-modal'),
    // qrImage: document.getElementById('qr-image'),
    // caption: document.getElementById('caption'),
    // closeBtn: document.querySelector('.close-btn')
};

loadHighResBackground();

/**
 * 滚动时更新英雄区域效果
 */
function updateWhileScrolling() {
    const scrollY = window.scrollY;
    const rawRatio = scrollY / (window.innerHeight - CONFIG.finalHeight);
    const ratio = Math.min(rawRatio, 1);

    // 更新英雄区域样式
    updateHeroStyles(ratio);
}

let ticking = false;
/**
 * 滚动事件处理
 */
function handleScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateWhileScrolling();
            ticking = false;
        });
        ticking = true;
    }
}
window.addEventListener('scroll', handleScroll);

