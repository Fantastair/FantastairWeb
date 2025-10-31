/**
 * @file 通用工具函数库
 * @description 提供项目中常用的工具函数
 */

class Utils {
    /**
     * 防抖函数 - 防止函数频繁调用
     * @param {Function} func - 要防抖的函数
     * @param {number} wait - 等待时间(毫秒)
     * @param {boolean} immediate - 是否立即执行
     * @returns {Function} 防抖后的函数
     */
    static debounce(func, wait = 100, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    /**
     * 节流函数 - 控制函数执行频率
     * @param {Function} func - 要节流的函数
     * @param {number} limit - 时间限制(毫秒)
     * @returns {Function} 节流后的函数
     */
    static throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * 复制文本到剪贴板
     * @param {string} text - 要复制的文本
     * @returns {Promise<boolean>} 是否复制成功
     */
    static async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // 降级方案
                return this.fallbackCopyText(text);
            }
        } catch (err) {
            console.error('复制失败:', err);
            return false;
        }
    }

    /**
     * 降级复制方案
     * @param {string} text - 要复制的文本
     * @returns {boolean} 是否复制成功
     */
    static fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.cssText = 'position:fixed;opacity:0;top:-9999px;left:-9999px;';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }

    /**
     * 加载图片
     * @param {string} src - 图片URL
     * @returns {Promise<HTMLImageElement>} 图片元素
     */
    static loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    /**
     * 检测用户是否偏好减少动画
     * @returns {boolean} 是否偏好减少动画
     */
    static getPrefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * 检测用户是否偏好深色模式
     * @returns {boolean} 是否偏好深色模式
     */
    static getPrefersDarkMode() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    /**
     * 获取URL参数
     * @param {string} name - 参数名
     * @returns {string|null} 参数值
     */
    static getUrlParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    /**
     * 格式化日期
     * @param {Date|string} date - 日期
     * @returns {string} 格式化后的日期
     */
    static formatDate(date) {
        return new Date(date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * 安全设置innerHTML
     * @param {Element} element - DOM元素
     * @param {string} html - HTML字符串
     */
    static safeSetHTML(element, html) {
        element.innerHTML = '';
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        element.appendChild(template.content);
    }
}

/**
 * 滚动管理器
 * @class 管理页面滚动相关功能
 */
class ScrollManager {
    constructor() {
        this.ticking = false;
        this.listeners = new Set();
        this.init();
    }

    /**
     * 初始化滚动管理器
     */
    init() {
        this.setupScrollListener();
    }

    /**
     * 设置滚动监听
     */
    setupScrollListener() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.notifyListeners();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
    }

    /**
     * 添加滚动监听器
     * @param {Function} callback - 回调函数
     */
    addListener(callback) {
        this.listeners.add(callback);
    }

    /**
     * 移除滚动监听器
     * @param {Function} callback - 回调函数
     */
    removeListener(callback) {
        this.listeners.delete(callback);
    }

    /**
     * 通知所有监听器
     */
    notifyListeners() {
        const scrollY = window.scrollY;
        this.listeners.forEach(callback => callback(scrollY));
    }

    /**
     * 滚动到元素
     * @param {string|Element} target - 目标元素或选择器
     * @param {Object} options - 滚动选项
     */
    scrollTo(target, options = {}) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;

        const { behavior = 'smooth', block = 'start', inline = 'nearest' } = options;
        element.scrollIntoView({ behavior, block, inline });
    }
}

// 导出工具类
window.Utils = Utils;
window.ScrollManager = ScrollManager;