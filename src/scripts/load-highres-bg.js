import { elements } from './global.js';

/**
 * 加载高清背景图片
 */
export function loadHighResBackground() {
    const highResImage = new Image();
    highResImage.src = '../../assets/images/background.webp';
    highResImage.onload = () => {
        elements.heroBg.classList.add('bgloaded');
        console.log("高清背景图片加载完成");
    };
    highResImage.onerror = () => {
        console.warn("高清背景图片加载失败，使用默认图片");
    };
}
