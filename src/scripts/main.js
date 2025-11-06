// 控制台欢迎信息
import { loadHighResBackground } from "./load-highres-bg.js";
import { updateHeroStyles } from "../components/hero/hero.js";
console.log("泥嚎 🚀 --- Fantastair");

loadHighResBackground();

let ticking = false;
/**
 * 滚动事件处理
 */
function handleScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateHeroStyles();
            ticking = false;
        });
        ticking = true;
    }
}
window.addEventListener('scroll', handleScroll);

