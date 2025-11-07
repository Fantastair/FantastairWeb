// 控制台欢迎信息
import { elements } from "./global.js";
import { loadHighResBackground } from "./load-highres-bg.js";
import { updateHeroStyles, initTitleAnimation } from "../components/hero/hero.js";
import { updateNavStyles } from "../components/navigation/navigation.js";
console.log("泥嚎 🚀 --- Fantastair");

loadHighResBackground();

// 初始化标题动画
initTitleAnimation();

// // 创建占位元素
// {
//     const spacer = document.createElement('div');
//     spacer.className = 'hero-spacer';
//     spacer.style.height = '100vh';

//     if (elements.column && elements.column.parentNode) {
//         elements.column.parentNode.insertBefore(spacer, elements.column);
//     }
// }

let ticking = false;
/**
 * 滚动事件处理
 */
function handleScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            const ratio = updateHeroStyles();
            updateNavStyles(ratio);
            ticking = false;
        });
        ticking = true;
    }
}
window.addEventListener('scroll', handleScroll);

