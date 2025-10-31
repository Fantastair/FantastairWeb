/**
 * @file 一言模块
 * @description 管理一言内容的获取、显示和交互
 */

class Hitokoto {
    constructor() {
        this.container = document.getElementById('hitokoto');
        this.textElement = document.getElementById('hitokoto_text');
        this.contentElement = document.querySelector('.hitokoto-content');
        this.copyButton = document.querySelector('.hitokoto-copy-btn');
        
        this.isInitialized = false;
        this.isRefreshing = false;
        this.hasBeenClicked = false;
        
        this.init();
    }

    /**
     * 初始化一言模块
     */
    init() {
        if (!this.textElement || !this.contentElement) {
            console.warn('⚠️ 一言元素未找到，模块初始化失败');
            return;
        }

        this.setupEventListeners();
        this.fetchHitokoto();
        this.isInitialized = true;
        
        console.log('💭 一言模块已初始化');
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 点击刷新一言
        this.textElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.refreshHitokoto();
        });

        // 复制按钮事件
        if (this.copyButton) {
            this.copyButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyHitokoto();
            });

            // 键盘支持
            this.copyButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.copyHitokoto();
                }
            });
        }

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' && e.ctrlKey) {
                e.preventDefault();
                this.refreshHitokoto();
            }
        });
    }

    /**
     * 获取一言内容
     * @returns {Promise<string>} 一言内容
     */
    async fetchHitokoto() {
        if (!this.contentElement) return;

        // 显示加载状态
        this.contentElement.textContent = '茫茫句海，总有一句适合你...';
        this.textElement.classList.remove('loaded', 'refreshing');

        try {
            const response = await fetch('https://v1.hitokoto.cn');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const hitokotoText = data.hitokoto;
            const fromText = data.from ? ` — ${data.from}` : '';
            const fullText = hitokotoText + fromText;

            // 添加动画延迟
            await this.delay(300);

            this.contentElement.textContent = fullText;
            this.textElement.classList.add('loaded');

            // 更新元数据
            this.updateMetadata(data);

            return fullText;
            
        } catch (error) {
            console.error('❌ 获取一言失败:', error);
            return this.handleFetchError();
        }
    }

    /**
     * 处理获取错误
     * @returns {string} 默认文本
     */
    handleFetchError() {
        const fallbackTexts = [
            '生活不止眼前的苟且，还有诗和远方。',
            '星光不问赶路人，时光不负有心人。',
            '保持热爱，奔赴山海。',
            '简单的生活，何尝不是一场华丽的冒险。'
        ];
        
        const randomText = fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)];
        this.contentElement.textContent = randomText;
        this.textElement.classList.add('loaded');
        
        return randomText;
    }

    /**
     * 刷新一言
     */
    async refreshHitokoto() {
        // 防止重复点击
        if (this.isRefreshing) return;
        
        this.isRefreshing = true;
        this.textElement.classList.add('refreshing');

        // 第一次点击时更新提示
        if (!this.hasBeenClicked) {
            this.updateTooltip();
            this.hasBeenClicked = true;
        }

        try {
            // 等待动画完成
            await this.delay(800);
            this.textElement.classList.remove('refreshing');
            
            await this.fetchHitokoto();
            
        } finally {
            this.isRefreshing = false;
        }
    }

    /**
     * 更新工具提示
     */
    updateTooltip() {
        this.textElement.setAttribute('data-tooltip', '就是这样 👍');
        
        setTimeout(() => {
            this.textElement.classList.add('tooltip-shown');
        }, 1500);
    }

    /**
     * 复制一言内容
     */
    async copyHitokoto() {
        if (!this.contentElement) return;

        const textToCopy = this.contentElement.textContent;
        
        try {
            const success = await Utils.copyToClipboard(textToCopy);
            
            if (success) {
                this.showCopySuccess();
            } else {
                this.showCopyError();
            }
            
        } catch (error) {
            console.error('❌ 复制失败:', error);
            this.showCopyError();
        }
    }

    /**
     * 显示复制成功反馈
     */
    showCopySuccess() {
        if (!this.copyButton) return;

        const originalIcon = this.copyButton.innerHTML;
        
        // 更新按钮状态
        this.copyButton.classList.add('copied');
        this.copyButton.innerHTML = '<i class="fa-solid fa-check"></i>';
        
        // 显示成功提示
        this.showTooltip('已复制到剪贴板！', 'success');
        
        // 2秒后恢复
        setTimeout(() => {
            this.copyButton.classList.remove('copied');
            this.copyButton.innerHTML = originalIcon;
        }, 2000);
    }

    /**
     * 显示复制错误反馈
     */
    showCopyError() {
        if (!this.copyButton) return;

        const originalIcon = this.copyButton.innerHTML;
        
        this.copyButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        this.showTooltip('复制失败', 'error');
        
        setTimeout(() => {
            this.copyButton.innerHTML = originalIcon;
        }, 2000);
    }

    /**
     * 显示工具提示
     * @param {string} message - 提示消息
     * @param {string} type - 提示类型
     */
    showTooltip(message, type = 'info') {
        // 移除现有提示
        const existingTooltip = document.querySelector('.hitokoto-copy-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        // 创建新提示
        const tooltip = document.createElement('div');
        tooltip.className = `hitokoto-copy-tooltip ${type}`;
        tooltip.textContent = message;
        
        if (this.copyButton) {
            this.copyButton.parentNode.appendChild(tooltip);
        }

        // 显示动画
        requestAnimationFrame(() => {
            tooltip.classList.add('show');
        });

        // 自动隐藏
        setTimeout(() => {
            tooltip.classList.remove('show');
            setTimeout(() => tooltip.remove(), 300);
        }, 2000);
    }

    /**
     * 更新元数据
     * @param {Object} data - 一言数据
     */
    updateMetadata(data) {
        // 可以在这里更新页面标题或其他元数据
        if (data.from) {
            this.textElement.setAttribute('aria-label', `一言：${data.hitokoto}，出自：${data.from}`);
        }
    }

    /**
     * 延迟函数
     * @param {number} ms - 延迟时间(毫秒)
     * @returns {Promise} Promise对象
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 获取当前一言文本
     * @returns {string} 当前一言文本
     */
    getCurrentText() {
        return this.contentElement ? this.contentElement.textContent : '';
    }

    /**
     * 设置自定义一言
     * @param {string} text - 自定义文本
     */
    setCustomHitokoto(text) {
        if (!this.contentElement) return;
        
        this.contentElement.textContent = text;
        this.textElement.classList.add('loaded');
    }

    /**
     * 销毁一言模块
     */
    destroy() {
        if (this.textElement) {
            this.textElement.removeEventListener('click', this.refreshHitokoto);
        }
        
        if (this.copyButton) {
            this.copyButton.removeEventListener('click', this.copyHitokoto);
        }
        
        this.isInitialized = false;
        console.log('🔚 一言模块已销毁');
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    window.hitokoto = new Hitokoto();
});

// 全局函数（保持向后兼容）
window.refreshHitokoto = function() {
    if (window.hitokoto) {
        window.hitokoto.refreshHitokoto();
    }
};

window.copyHitokoto = function() {
    if (window.hitokoto) {
        window.hitokoto.copyHitokoto();
    }
};