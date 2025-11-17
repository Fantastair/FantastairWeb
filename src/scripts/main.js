import { loadHighResBackground, updateHeroStyles, initTitleAnimation } from "../components/hero/hero.js";
import { updateNavStyles } from "../components/navigation/navigation.js";
console.log("泥嚎 🚀 --- Fantastair");

loadHighResBackground();    // 加载

// 初始化标题动画
initTitleAnimation(0.3);

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

import "../components/hitokoto/hitokoto.js"
import "../components/contact/contact.js"
