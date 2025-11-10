let isRefreshing = false;       // 记录是否正在刷新一言

const elements = {
    hitokotoText: document.getElementById('hitokoto-text'),
    hitokotoContent: document.getElementById('hitokoto-content'),
    hitokotoCopyBtn: document.getElementById('hitokoto-copy-btn'),
};

/**
 * 刷新一言内容
 */
async function refreshHitokoto() {
    if (isRefreshing) return;
    isRefreshing = true;

    elements.hitokotoContent.innerText = '茫茫句海，总有一句适合你...';

    try {
        const response = await fetch('https://v1.hitokoto.cn');
        if (!response.ok) throw new Error('网络异常');
        const { hitokoto: hitokotoText } = await response.json()
        elements.hitokotoContent.innerText = hitokotoText
    } catch (error) {
        console.error('获取一言失败:', error);
        elements.hitokotoContent.innerText = '获取一言失败，请稍后再试。';
    } finally {
        isRefreshing = false;
    }
}

/**
 * 复制一言内容到剪贴板
 */
export function copyHitokoto() {
    // 使用现代 Clipboard API
    navigator.clipboard.writeText(hitokotoContent.innerText)
    .catch(err => {
        console.error('复制失败:', err);
    });
}

/**
 * 初始化一言组件
 */
function initHitokoto() {
    // 添加点击事件
    elements.hitokotoText.addEventListener('click', (e) => {
        e.stopPropagation();
        refreshHitokoto();
    });
    elements.hitokotoCopyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyHitokoto();
    });
    // 初始加载一言
    refreshHitokoto();
}

initHitokoto();    // 初始化一言组件
