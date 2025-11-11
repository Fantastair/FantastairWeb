let isRefreshing = false;    // 记录是否正在刷新一言
let isClicked = true;        // 记录是否已经刷新过一言

const elements = {
    hitokotoTextBox: document.getElementById('hitokoto-text-box'),
    hitokotoText: document.getElementById('hitokoto-text'),
    hitokotoCopyButton: document.getElementById('hitokoto-copy-button'),
    hitokotoCopyIcon: document.getElementById('hitokoto-copy-icon'),
    hitokotoTip: document.getElementById('hitokoto-tip'),
    hitokotoTipText: document.getElementById('hitokoto-tip-text'),
};

/**
 * 刷新一言内容
 */
async function refreshHitokoto() {
    if (isRefreshing) return;
    isRefreshing = true;

    elements.hitokotoText.innerText = '茫茫句海，总有一句适合你...';

    if (!isClicked) {
        isClicked = true;
        elements.hitokotoTipText.innerText = '就是这样😘';
        setTimeout(() => {
            elements.hitokotoTip.remove()
        }, 3000);
    }

    try {
        const response = await fetch('https://v1.hitokoto.cn');
        if (!response.ok) throw new Error('网络异常');
        const { hitokoto: hitokotoText } = await response.json()
        elements.hitokotoText.innerText = hitokotoText;
    } catch (error) {
        console.error('获取一言失败:', error);
        elements.hitokotoText.innerText = '获取一言失败，请稍后再试。';
    } finally {
        isRefreshing = false;
    }
}

/**
 * 复制一言内容到剪贴板
 */
export function copyHitokoto() {
    // 使用现代 Clipboard API
    navigator.clipboard.writeText(elements.hitokotoText.innerText)
    .then(() => {
        elements.hitokotoCopyIcon.classList.remove('fa-regular', 'fa-copy');
        elements.hitokotoCopyIcon.classList.add('fa-solid', 'fa-check');
        setTimeout(() => {
            elements.hitokotoCopyIcon.classList.remove('fa-solid', 'fa-check');
            elements.hitokotoCopyIcon.classList.add('fa-regular', 'fa-copy');
        }, 1500);
    })
    .catch(err => {
        console.error('复制失败:', err);
    });
}

/**
 * 初始化一言组件
 */
function initHitokoto() {
    // 添加点击事件
    elements.hitokotoTextBox.addEventListener('click', (e) => {
        e.stopPropagation();
        refreshHitokoto();
    });
    elements.hitokotoCopyButton.addEventListener('click', (e) => {
        e.stopPropagation();
        copyHitokoto();
    });
    // 初始加载一言
    refreshHitokoto();
}

initHitokoto();       // 初始化一言组件
isClicked = false;    // 重置为未点击状态
