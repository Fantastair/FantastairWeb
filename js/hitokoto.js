
/**
 * 一言功能
 */
// 获取一言
function fetchHitokoto() {
    const hitokotoElement = document.querySelector('#hitokoto_text');
    if (!hitokotoElement) return;

    hitokotoElement.innerText = '茫茫句海，总有一句适合你...';
    hitokotoElement.classList.remove('loaded', 'refreshing');

    fetch('https://v1.hitokoto.cn')
        .then(response => {
            if (!response.ok) throw new Error('网络响应不正常');
            return response.json();
        })
        .then(data => {
            const text = data.hitokoto + (data.from ? ` — ${data.from}` : '');
            hitokotoElement.innerText = text;
            hitokotoElement.classList.add('loaded');
        })
        .catch(error => {
            console.error('获取一言失败:', error);
            hitokotoElement.innerText = '生活不止眼前的苟且，还有诗和远方。';
            hitokotoElement.classList.add('loaded');
        });
}

// 标记是否已经点击过一言
let hitokotoClicked = false;

// 刷新一言
function refreshHitokoto() {
    const hitokotoElement = document.querySelector('#hitokoto_text');
    hitokotoElement.classList.add('refreshing');

    // 只在第一次点击时更改提示文字
    if (!hitokotoClicked) {
        hitokotoElement.setAttribute('data-tooltip', '就是这样👍');
        hitokotoClicked = true;

        // 添加 class 来禁用后续的悬浮提示
        setTimeout(() => {
            hitokotoElement.classList.add('tooltip-shown');
        }, 1500); // 显示"就是这样👍"1.5秒后禁用
    }

    setTimeout(() => {
        fetchHitokoto();
    }, 300);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    fetchHitokoto(); // 初始加载一言
});

// 导出函数供全局使用（如果需要）
window.refreshHitokoto = refreshHitokoto;
