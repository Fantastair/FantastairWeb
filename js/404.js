/**
 * Fantastair 404页面 - 交互功能
 * 包含背景加载、一言功能等
 */

// 控制台信息
console.log("404 页面已加载 - Fantastair");

// DOM 元素
const elements = {
    errorBg: document.getElementById('error-bg'),
    hitokotoText: document.getElementById('hitokoto_text')
};

/**
 * 初始化函数
 */
function init() {
    loadHighResBackground();
    fetchHitokoto();
    addKeyboardNavigation();
    console.log("404页面初始化完成");
}

/**
 * 加载高清背景图片
 */
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

/**
 * 获取一言
 */
function fetchHitokoto() {
    if (!elements.hitokotoText) return;
    
    elements.hitokotoText.innerText = '加载中...';
    elements.hitokotoText.classList.remove('loaded', 'refreshing');
    
    fetch('https://v1.hitokoto.cn')
        .then(response => {
            if (!response.ok) throw new Error('网络响应不正常');
            return response.json();
        })
        .then(data => {
            const text = data.hitokoto + (data.from ? ` — ${data.from}` : '');
            elements.hitokotoText.innerText = text;
            elements.hitokotoText.classList.add('loaded');
        })
        .catch(error => {
            console.error('获取一言失败:', error);
            elements.hitokotoText.innerText = '迷路并不可怕，可怕的是失去了寻找方向的勇气。';
            elements.hitokotoText.classList.add('loaded');
        });
}

/**
 * 刷新一言
 */
function refreshHitokoto() {
    elements.hitokotoText.classList.add('refreshing');
    setTimeout(() => {
        fetchHitokoto();
    }, 300);
}

/**
 * 添加键盘导航支持
 */
function addKeyboardNavigation() {
    // 按下回车键返回首页
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            window.location.href = 'index.html';
        }
    });
}

/**
 * 页面可见性变化时刷新一言
 */
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        console.log("页面重新可见，刷新一言");
    }
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 导出函数供全局使用
window.refreshHitokoto = refreshHitokoto;