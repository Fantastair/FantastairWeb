import { loadHighResBackground, updateHeroStyles, initTitleAnimation } from "../components/hero/hero.js";
import { updateNavStyles } from "../components/navigation/navigation.js";
import { initHitokoto } from "../components/hitokoto/hitokoto.js"
import { updatePager } from "../components/column/column.js"
import { initContact } from "../components/contact/contact.js"
import { initQRCode } from "../components/QRCode/QRCode.js"

console.log("泥嚎 🚀 --- Fantastair");

document.documentElement.style.setProperty('--vw', `${window.innerWidth}px`);
document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);

loadHighResBackground();    // 加载高清背景图
initTitleAnimation(0.3);    // 初始化标题动画
{
    // 滚动事件处理
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const ratio = updateHeroStyles();
                updateNavStyles(ratio);
                ticking = false;
            });
            ticking = true;
        }
    });
}
initHitokoto();    // 初始化一言组件
updatePager(1);    // 显示第一页
initContact();     // 初始化联系组件
initQRCode();      // 初始化二维码组件
