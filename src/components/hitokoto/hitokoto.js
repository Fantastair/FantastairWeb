import { sleep } from '../../scripts/utilities.js';

{
    const hitokotoContainer = document.querySelector('hitokoto');
    try {
        const response = await fetch('./src/components/hitokoto/hitokoto.html');
        const html = await response.text();
        hitokotoContainer.innerHTML = html;
    } catch (error) {
        console.error('加载一言组件失败:', error);
        hitokotoContainer.innerHTML = '一言组件加载失败';
    }
}

let isRefreshing = false;    // 记录是否正在刷新一言
let isClicked = false;       // 记录是否已经刷新过一言

const elements = {
    hitokotoTextBox: document.getElementById('hitokoto-text-box'),
    hitokotoText: document.getElementById('hitokoto-text'),
    hitokotoCopyButton: document.getElementById('hitokoto-copy-button'),
    hitokotoCopyIcon: document.getElementById('hitokoto-copy-icon'),
    hitokotoTip: document.getElementById('hitokoto-tip'),
    hitokotoTipText: document.getElementById('hitokoto-tip-text'),
};

const hitokotoTextSpans = [];
/**
 * 一言文字出现动画
 * @param {string} text 一言内容
 */
async function hitokotoTextAppear(text) {
    const originalText = text.trim();
    console.log("show text: ", originalText);
    // elements.hitokotoText.innerHTML = '';
    originalText.split('').forEach((char, index) => {
        let span;
        if (index < hitokotoTextSpans.length) {
            span = hitokotoTextSpans[index];
        } else {
            span = document.createElement('span');
            span.className = 'hitokoto-char';
            hitokotoTextSpans.push(span);
        }
        span.textContent = char;
        span.setAttribute('delay-index', index);
    });

    hitokotoTextSpans.length = originalText.length;

    hitokotoTextSpans.forEach(span => {
        setTimeout(() => {
            elements.hitokotoText.appendChild(span);
            void elements.hitokotoText.offsetWidth;    // 触发重绘以应用初始样式
            span.style.opacity = '1';
        }, parseInt(span.getAttribute('delay-index')) * HITOKOTO_ANIMATION_DELAYSTEP * 1000);
    });

    await sleep(300 + HITOKOTO_ANIMATION_DELAYSTEP * parseInt(hitokotoTextSpans[hitokotoTextSpans.length - 1].getAttribute('delay-index')) * 1000);
}

/**
 * 一言文字消失动画
 */
async function hitokotoTextDisappear() {
    if (elements.hitokotoText.innerText.trim() === '') return;
    elements.hitokotoText.querySelectorAll('.hitokoto-char').forEach(span => {
        setTimeout(() => {
            span.style.opacity = '0';
            setTimeout(() => {
                span.remove();
            }, 300);
        }, parseInt(span.getAttribute('delay-index')) * HITOKOTO_ANIMATION_DELAYSTEP * 1000);
    });
    // 等待动画结束
    await sleep(300 + HITOKOTO_ANIMATION_DELAYSTEP * parseInt(hitokotoTextSpans[hitokotoTextSpans.length - 1].getAttribute('delay-index')) * 1000);
}

const HITOKOTO_API_URL = 'https://v1.hitokoto.cn';
const HITOKOTO_WAITING_TEXT = '茫茫句海，总有一句适合你...';
/**
 * 刷新一言内容
 */
async function refreshHitokoto() {
    if (isRefreshing) return;
    isRefreshing = true;

    // 请求网络
    const responsePromise = fetch(HITOKOTO_API_URL);
    // 淡出原文本
    await hitokotoTextDisappear();
    // 淡入等待文本
    await hitokotoTextAppear(HITOKOTO_WAITING_TEXT);

    try {
        // 等待网络响应
        const response = await responsePromise;
        // 淡出原文本
        await hitokotoTextDisappear();
        // 解析响应数据
        const { hitokoto: hitokotoText } = await response.json()
        console.log("get  text: ", hitokotoText);
        // 淡入请求得到的文本
        await hitokotoTextAppear(hitokotoText);
    }
    catch (error) {
        console.error('获取一言失败:', error);
        // 显示错误文本
        await hitokotoTextAppear('获取一言失败，请稍后再试。');
    } finally {
        isRefreshing = false;
    }
}

/**
 * 复制一言内容到剪贴板
 */
function copyHitokoto() {
    // 使用现代 Clipboard API
    navigator.clipboard.writeText(elements.hitokotoText.innerText)
    .then(() => {
        elements.hitokotoCopyIcon.classList.remove('fa-regular', 'fa-copy');
        elements.hitokotoCopyIcon.classList.add('fa-solid', 'fa-check');
        elements.hitokotoCopyButton.style.backgroundColor = 'var(--color-jump-green)';
        setTimeout(() => {
            elements.hitokotoCopyIcon.classList.remove('fa-solid', 'fa-check');
            elements.hitokotoCopyIcon.classList.add('fa-regular', 'fa-copy');
            elements.hitokotoCopyButton.style.backgroundColor = '';
        }, 1500);
    })
    .catch(err => {
        console.error('复制失败:', err);
    });
}

const HITOKOTO_ANIMATION_DELAYSTEP = 0.025    // 每个字符动画延迟增量（秒）

/**
 * 初始化一言组件
 */
export function initHitokoto() {
    // 添加点击事件
    elements.hitokotoTextBox.addEventListener('click', (e) => {
        e.stopPropagation();
        refreshHitokoto();
        // 首次点击提示
        if (!isClicked) {
            isClicked = true;
            elements.hitokotoTipText.innerText = '就是这样😘';
            setTimeout(() => {
                elements.hitokotoTip.style.opacity = '0';
            }, 2200);
            setTimeout(() => {
                elements.hitokotoTip.remove()
            }, 3000);
        }
    });
    elements.hitokotoCopyButton.addEventListener('click', (e) => {
        e.stopPropagation();
        copyHitokoto();
    });

    refreshHitokoto();    // 初始加载一言
}

