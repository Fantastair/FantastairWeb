/**
 * @file 404页面脚本
 * @description 404页面的交互和功能
 */

class NotFoundPage {
    constructor() {
        this.errorBg = document.getElementById('error-bg');
        this.homeButton = document.getElementById('home-button');
        
        this.init();
    }

    /**
     * 初始化404页面
     */
    init() {
        this.setupBackgroundImage();
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        
        console.log('❓ 404页面已初始化');
    }

    /**
     * 设置背景图片
     */
    setupBackgroundImage() {
        if (this.errorBg) {
            Utils.loadImage('../assets/images/background.webp')
                .then(() => {
                    this.errorBg.classList.add('loaded');
                })
                .catch(() => {
                    console.warn('❌ 404页面背景图片加载失败');
                });
        }
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 首页按钮点击事件
        if (this.homeButton) {
            this.homeButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateHome();
            });
        }

        // 背景点击返回首页（可选）
        this.setupBackgroundClick();
    }

    /**
     * 设置键盘导航
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // 按下回车键返回首页
            if (e.key === 'Enter') {
                this.navigateHome();
            }
            
            // 按下ESC键返回首页
            if (e.key === 'Escape') {
                this.navigateHome();
            }
            
            // 数字键1快速返回首页
            if (e.key === '1') {
                this.navigateHome();
            }
        });
    }

    /**
     * 设置背景点击事件（可选）
     */
    setupBackgroundClick() {
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.addEventListener('click', (e) => {
                // 如果点击的是背景而不是内容区域
                if (e.target === errorContainer) {
                    this.navigateHome();
                }
            });
        }
    }

    /**
     * 导航回首页
     */
    navigateHome() {
        // 添加离开动画
        document.body.style.opacity = '0.7';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 300);
    }

    /**
     * 显示随机安慰消息
     */
    showRandomComfortMessage() {
        const messages = [
            '别担心，迷路也是旅程的一部分。',
            '有时候，走错路也能发现美丽的风景。',
            '即使迷路了，星星依然会指引你方向。',
            '每个探险家都曾经迷路过。',
            '这不是终点，而是新的起点。'
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // 可以在这里显示随机消息
        console.log(`💫 ${randomMessage}`);
    }

    /**
     * 获取页面访问信息
     * @returns {Object} 访问信息
     */
    getVisitInfo() {
        return {
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
    }

    /**
     * 记录404访问
     */
    log404Visit() {
        const visitInfo = this.getVisitInfo();
        console.group('🚨 404访问记录');
        console.log('来源:', visitInfo.referrer || '直接访问');
        console.log('时间:', new Date(visitInfo.timestamp).toLocaleString());
        console.log('用户代理:', visitInfo.userAgent);
        console.groupEnd();
    }

    /**
     * 销毁404页面实例
     */
    destroy() {
        if (this.homeButton) {
            this.homeButton.removeEventListener('click', this.navigateHome);
        }
        
        console.log('🔚 404页面已销毁');
    }
}

// 控制台信息
console.log("❓ 404 页面已加载 - Fantastair");

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.notFoundPage = new NotFoundPage();
    
    // 记录404访问
    window.notFoundPage.log404Visit();
    
    // 显示随机安慰消息
    window.notFoundPage.showRandomComfortMessage();
});