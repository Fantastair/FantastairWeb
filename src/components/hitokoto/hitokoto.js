/**
 * 一言功能
 */
let hitokotoClicked = false;
let isRefreshing = false;

// 获取一言
async function fetchHitokoto() {
    const hitokotoElement = document.querySelector('#hitokoto_text');
    const hitokotoContent = document.querySelector('.hitokoto-content');
    if (!hitokotoElement || !hitokotoContent) return;

    hitokotoContent.innerText = '茫茫句海，总有一句适合你...';
    hitokotoElement.classList.remove('loaded', 'refreshing');

    try {
        const response = await fetch('https://v1.hitokoto.cn');
        if (!response.ok) throw new Error('网络响应不正常');
        
        const data = await response.json();
        const text = data.hitokoto + (data.from ? ` — ${data.from}` : '');
        
        // 确保动画完成后再更新内容
        await new Promise(resolve => setTimeout(resolve, 300));
        
        hitokotoContent.innerText = text;
        hitokotoElement.classList.add('loaded');
    } catch (error) {
        console.error('获取一言失败:', error);
        hitokotoContent.innerText = '生活不止眼前的苟且，还有诗和远方。';
        hitokotoElement.classList.add('loaded');
    }
}

// 刷新一言
async function refreshHitokoto() {
    const hitokotoElement = document.querySelector('#hitokoto_text');
    
    // 防止重复点击
    if (isRefreshing) return;
    isRefreshing = true;
    
    hitokotoElement.classList.add('refreshing');

    // 只在第一次点击时更改提示文字
    if (!hitokotoClicked) {
        hitokotoElement.setAttribute('data-tooltip', '就是这样👍');
        hitokotoClicked = true;

        setTimeout(() => {
            hitokotoElement.classList.add('tooltip-shown');
        }, 1500);
    }

    try {
        // 等待动画完成
        await new Promise(resolve => setTimeout(resolve, 1000));
        hitokotoElement.classList.remove('refreshing');
        
        await fetchHitokoto();
    } finally {
        isRefreshing = false;
    }
}

// 复制一言内容
function copyHitokoto() {
    const hitokotoContent = document.querySelector('.hitokoto-content');
    const copyBtn = document.querySelector('.hitokoto-copy-btn');
    const copyIcon = copyBtn ? copyBtn.querySelector('i') : null;
    
    if (!hitokotoContent || !copyBtn || !copyIcon) {
        console.error('复制按钮或内容元素未找到');
        return;
    }
    
    const textToCopy = hitokotoContent.innerText;
    
    // 使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                showCopySuccess(copyBtn, copyIcon);
            })
            .catch(err => {
                console.error('复制失败:', err);
                // 降级方案
                fallbackCopyText(textToCopy, copyBtn, copyIcon);
            });
    } else {
        // 降级方案
        fallbackCopyText(textToCopy, copyBtn, copyIcon);
    }
}

// 降级复制方案
function fallbackCopyText(text, copyBtn, copyIcon) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess(copyBtn, copyIcon);
        } else {
            showCopyError(copyBtn, copyIcon);
        }
    } catch (err) {
        console.error('降级复制失败:', err);
        showCopyError(copyBtn, copyIcon);
    }
    
    document.body.removeChild(textArea);
}

// 显示复制成功反馈
function showCopySuccess(copyBtn, copyIcon) {
    // 改变按钮状态
    copyBtn.classList.add('copied');
    
    // 改变图标为勾选
    copyIcon.className = 'fa-solid fa-check';
    
    // 显示成功提示
    let tooltip = document.querySelector('.hitokoto-copy-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'hitokoto-copy-tooltip';
        copyBtn.parentNode.appendChild(tooltip);
    }
    
    tooltip.textContent = '已复制到剪贴板！';
    tooltip.classList.remove('error');
    tooltip.classList.add('show');
    
    // 2秒后恢复按钮状态
    setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyIcon.className = 'fa-regular fa-copy';
        tooltip.classList.remove('show');
    }, 2000);
}

// 显示复制错误反馈
function showCopyError(copyBtn, copyIcon) {
    // 改变图标为叉号
    copyIcon.className = 'fa-solid fa-xmark';
    
    // 显示错误提示
    let tooltip = document.querySelector('.hitokoto-copy-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'hitokoto-copy-tooltip';
        copyBtn.parentNode.appendChild(tooltip);
    }
    
    tooltip.textContent = '复制失败';
    tooltip.classList.add('error', 'show');
    
    setTimeout(() => {
        copyIcon.className = 'fa-regular fa-copy';
        tooltip.classList.remove('show');
    }, 2000);
}

// 初始化复制功能
function initCopyButton() {
    const copyBtn = document.querySelector('.hitokoto-copy-btn');
    if (!copyBtn) {
        console.error('复制按钮未找到');
        return;
    }
    
    // 添加点击事件
    copyBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止事件冒泡到父元素
        copyHitokoto();
    });
    
    // 添加键盘支持
    copyBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            copyHitokoto();
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    fetchHitokoto();
    initCopyButton();
});

// 导出函数供全局使用
window.refreshHitokoto = refreshHitokoto;
window.copyHitokoto = copyHitokoto;