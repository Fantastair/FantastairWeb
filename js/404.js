// 控制台信息
console.log("404 页面已加载 - Fantastair");

// DOM 元素
const elements = {
    errorBg: document.getElementById('error-bg'),
};

// 初始化函数
function init() {
    loadHighResBackground();
    addKeyboardNavigation();
    console.log("404页面初始化完成");
}

// 加载高清背景图片
function loadHighResBackground() {
    const highResImage = new Image();
    highResImage.src = 'assets/images/background.webp';
    highResImage.onload = () => {
        elements.errorBg.classList.add('loaded');
        console.log("高清背景图片加载完成");
    };
    highResImage.onerror = () => {
        console.warn("高清背景图片加载失败，使用默认图片");
    };
}

// 添加键盘导航支持
function addKeyboardNavigation() {
    // 按下回车键返回首页
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            window.location.href = 'index.html';
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);