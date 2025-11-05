/**
 * 加载高清背景图片
 * @param {HTMLElement} bgElement - 需要应用高清背景的元素
 */
export function loadHighResBackground(bgElement) {
    const highResImage = new Image();
    highResImage.src = '../../assets/images/background.webp';
    highResImage.onload = () => {
        bgElement.classList.add('bgloaded');
        console.log("高清背景图片加载完成");
    };
    highResImage.onerror = () => {
        console.warn("高清背景图片加载失败，使用默认图片");
    };
}
