// 控制台欢迎信息
import { loadHighResBackground, updateHeroStyles, initTitleAnimation } from "../components/hero/hero.js";
import { updateNavStyles } from "../components/navigation/navigation.js";
import "../components/hitokoto/hitokoto.js"
console.log("泥嚎 🚀 --- Fantastair");

loadHighResBackground();    // 加载

// 初始化标题动画
initTitleAnimation();

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

