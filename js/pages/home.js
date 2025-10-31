/**
 * @file 首页脚本
 * @description 首页特有的交互和功能
 */

class HomePage {
    constructor() {
        this.heroElement = document.getElementById('hero');
        this.heroBg = document.getElementById('hero-bg');
        this.heroIconWrapper = document.getElementById('hero-icon-wrapper');
        this.heroTitle = document.getElementById('hero-title');
        this.contentElement = document.getElementById('content');
        
        this.config = {
            finalHeight: 60,
            finalTitleTop: 30,
            finalTitleLeft: 15
        };
        
        this.state = {
            navLocked: false,
            navShowed: false,
            ticking: false
        };
        
        this.init();
    }

    /**
     * 初始化首页
     */
    init() {
        this.setupHeroAnimations();
        this.setupColumnInteractions();
        this.setupContactSection();
        this.setupPerformanceOptimizations();
        
        console.log('🏠 首页已初始化');
    }

    /**
     * 设置英雄区域动画
     */
    setupHeroAnimations() {
        if (window.app && window.app.scrollManager) {
            window.app.scrollManager.addListener(this.updateHeroWhileScrolling.bind(this));
        } else {
            window.addEventListener('scroll', Utils.throttle(this.updateHeroWhileScrolling.bind(this), 16));
        }
    }

    /**
     * 滚动时更新英雄区域
     */
    updateHeroWhileScrolling() {
        const scrollY = window.scrollY;
        const rawRatio = scrollY / (window.innerHeight - this.config.finalHeight);
        const ratio = Math.min(rawRatio, 1);

        // 导航锁定逻辑
        this.updateNavLockState(ratio);

        // 控制导航显示/隐藏
        this.updateNavVisibility(ratio);

        // 更新英雄区域样式
        this.updateHeroStyles(ratio);
    }

    /**
     * 更新导航锁定状态
     * @param {number} ratio - 滚动比例
     */
    updateNavLockState(ratio) {
        if (this.state.navLocked && ratio < 1) {
            this.state.navLocked = false;
        }
        if (!this.state.navLocked && ratio === 1) {
            this.state.navLocked = true;
        }
    }

    /**
     * 更新导航可见性
     * @param {number} ratio - 滚动比例
     */
    updateNavVisibility(ratio) {
        if (ratio < 0.2) {
            this.hideNav();
        } else {
            this.showNav();
        }
    }

    /**
     * 显示导航
     */
    showNav() {
        if (this.state.navShowed) return;
        this.state.navShowed = true;
        
        const topNav = document.getElementById('top-nav');
        if (topNav) {
            topNav.classList.add('show');
        }
    }

    /**
     * 隐藏导航
     */
    hideNav() {
        if (!this.state.navShowed) return;
        this.state.navShowed = false;
        
        const topNav = document.getElementById('top-nav');
        if (topNav) {
            topNav.classList.remove('show');
        }
    }

    /**
     * 更新英雄区域样式
     * @param {number} ratio - 滚动比例
     */
    updateHeroStyles(ratio) {
        if (!this.heroElement || !this.heroBg || !this.heroTitle) return;

        // 高度和模糊效果
        this.heroElement.style.height = `${(1 - ratio) * (window.innerHeight - this.config.finalHeight) + this.config.finalHeight}px`;
        this.heroBg.style.filter = `blur(${ratio * 5}px)`;
        this.heroBg.style.transform = `scale(${1 + ratio * 0.2})`;

        // 字体大小响应式调整
        const min = 2.5;
        const ideal = 16 - ratio * 11.2;
        const max = 8;
        this.heroTitle.style.fontSize = `clamp(${min}rem, ${ideal}vmin, ${max}rem)`;

        // 图标位置
        if (this.heroIconWrapper) {
            this.heroIconWrapper.style.top = `${-40 * ratio + (1 - ratio) * 40}vh`;
        }

        // 标题位置变换
        this.updateTitlePosition(ratio);
    }

    /**
     * 更新标题位置
     * @param {number} ratio - 滚动比例
     */
    updateTitlePosition(ratio) {
        const titleLeft = this.config.finalTitleLeft * ratio ** 2 + window.innerWidth * (1 - ratio ** 2) / 2;
        const titleTop = this.config.finalTitleTop * ratio + window.innerHeight * (1 - ratio) * 0.55;
        
        this.heroTitle.style.left = `${titleLeft}px`;
        this.heroTitle.style.top = `${titleTop}px`;
        this.heroTitle.style.transform = `translate(-${50 * (1 - ratio ** 2)}%, -50%)`;
    }

    /**
     * 设置专栏交互
     */
    setupColumnInteractions() {
        this.setupColumnItems();
        this.lazyLoadColumnBackgrounds();
    }

    /**
     * 设置专栏项目交互
     */
    setupColumnItems() {
        const columnItems = document.querySelectorAll('.column-item');
        
        columnItems.forEach(item => {
            // 鼠标点击事件
            item.addEventListener('click', (e) => {
                this.handleColumnItemClick(e, item);
            });
            
            // 键盘可访问性
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleColumnItemClick(e, item);
                }
            });
            
            // 恢复原始状态
            item.addEventListener('transitionend', (e) => {
                if (e.propertyName === 'transform') {
                    item.style.transform = '';
                }
            });
        });
    }

    /**
     * 处理专栏项目点击
     * @param {Event} e - 事件对象
     * @param {Element} item - 专栏项目元素
     */
    handleColumnItemClick(e, item) {
        // 添加点击反馈
        item.style.transform = 'translateY(-2px) scale(0.98)';
        
        setTimeout(() => {
            const href = item.dataset.href;
            if (href) {
                this.navigateToArticle(href);
            }
        }, 150);
    }

    /**
     * 导航到文章
     * @param {string} href - 文章URL
     */
    navigateToArticle(href) {
        // 如果是外部链接，新窗口打开
        if (href.startsWith('https')) {
            window.open(href, '_blank', 'noopener,noreferrer');
        } else {
            // 如果是内部文章链接，当前窗口打开
            window.location.href = href;
        }
    }

    /**
     * 懒加载专栏背景图
     */
    lazyLoadColumnBackgrounds() {
        const columnItems = document.querySelectorAll('.column-bg[data-bg]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bg = entry.target;
                        this.loadColumnBackground(bg);
                        imageObserver.unobserve(bg);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            columnItems.forEach(bg => imageObserver.observe(bg));
        } else {
            // 不支持 IntersectionObserver 的浏览器，直接加载所有图片
            columnItems.forEach(bg => this.loadColumnBackground(bg));
        }
    }

    /**
     * 加载专栏背景图
     * @param {Element} bg - 背景元素
     */
    loadColumnBackground(bg) {
        const imageUrl = bg.getAttribute('data-bg');
        
        Utils.loadImage(imageUrl)
            .then(() => {
                bg.style.backgroundImage = `url('${imageUrl}')`;
                bg.classList.add('loaded');
            })
            .catch(() => {
                console.warn(`❌ 专栏背景图加载失败: ${imageUrl}`);
                bg.style.backgroundImage = `url('assets/images/background_small.webp')`;
                bg.classList.add('loaded');
            });
    }

    /**
     * 设置联系区域
     */
    setupContactSection() {
        // 联系区域的特有交互可以在这里添加
        console.log('📞 联系区域已设置');
    }

    /**
     * 设置性能优化
     */
    setupPerformanceOptimizations() {
        // 预加载关键资源
        this.preloadCriticalResources();
        
        // 设置性能监控
        this.setupPerformanceMonitoring();
    }

    /**
     * 预加载关键资源
     */
    preloadCriticalResources() {
        const criticalResources = [
            'css/column.css',
            'css/hitokoto.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }

    /**
     * 设置性能监控
     */
    setupPerformanceMonitoring() {
        // 监控首次内容绘制 (FCP)
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name === 'first-contentful-paint') {
                        console.log(`🎨 首次内容绘制: ${Math.round(entry.startTime)}ms`);
                    }
                });
            });

            observer.observe({ entryTypes: ['paint'] });
        }

        // 监控最大内容绘制 (LCP)
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    console.log(`📊 最大内容绘制: ${Math.round(entry.startTime)}ms`);
                });
            });

            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    /**
     * 获取页面状态
     * @returns {Object} 页面状态
     */
    getPageState() {
        return {
            navLocked: this.state.navLocked,
            navShowed: this.state.navShowed,
            scrollPosition: window.scrollY
        };
    }

    /**
     * 销毁首页实例
     */
    destroy() {
        if (window.app && window.app.scrollManager) {
            window.app.scrollManager.removeListener(this.updateHeroWhileScrolling.bind(this));
        }
        
        console.log('🔚 首页已销毁');
    }
}

// 控制台欢迎信息
console.log("🎉 泥嚎 🚀 - Fantastair 个人主页已加载");

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.homePage = new HomePage();
});