/**
 * @file 网站核心功能
 * @description 初始化网站基础功能和管理核心状态
 */

class CoreApp {
    constructor() {
        this.scrollManager = new ScrollManager();
        this.isInitialized = false;
        this.init();
    }

    /**
     * 初始化核心功能
     */
    init() {
        if (this.isInitialized) return;

        this.setupImageLoading();
        this.setupAccessibility();
        this.setupThemeListener();
        this.setupErrorHandling();
        this.scrollManager.init();
        
        this.isInitialized = true;
        console.log('🚀 Fantastair - 核心功能已初始化');
    }

    /**
     * 设置图片加载优化
     */
    setupImageLoading() {
        // 预加载关键图片
        this.preloadCriticalImages();
        
        // 设置图片懒加载
        this.setupLazyLoading();
    }

    /**
     * 预加载关键图片
     */
    preloadCriticalImages() {
        const criticalImages = [
            '../assets/images/background.webp',
            '../assets/images/icon.ico'
        ];

        criticalImages.forEach(src => {
            Utils.loadImage(src).catch(() => {
                console.warn(`图片加载失败: ${src}`);
            });
        });
    }

    /**
     * 设置图片懒加载
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadLazyImage(img);
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * 加载懒加载图片
     * @param {HTMLImageElement} img - 图片元素
     */
    loadLazyImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        Utils.loadImage(src)
            .then(() => {
                img.src = src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
            })
            .catch(() => {
                console.warn(`懒加载图片失败: ${src}`);
            });
    }

    /**
     * 设置无障碍支持
     */
    setupAccessibility() {
        this.addSkipLink();
        this.setupKeyboardNavigation();
        this.enhanceFocusManagement();
    }

    /**
     * 添加跳过导航链接
     */
    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link sr-only';
        skipLink.textContent = '跳转到主要内容';
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
                this.scrollManager.scrollTo(mainContent);
            }
        });
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    /**
     * 设置键盘导航
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC键关闭所有模态框
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // Tab键管理焦点
            if (e.key === 'Tab') {
                this.manageFocus(e);
            }
        });
    }

    /**
     * 增强焦点管理
     */
    enhanceFocusManagement() {
        // 为可交互元素添加焦点样式
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        document.querySelectorAll(focusableElements).forEach(el => {
            el.addEventListener('focus', () => el.classList.add('focused'));
            el.addEventListener('blur', () => el.classList.remove('focused'));
        });
    }

    /**
     * 管理焦点
     * @param {KeyboardEvent} e - 键盘事件
     */
    manageFocus(e) {
        const modal = document.querySelector('.modal[style*="display: block"]');
        if (modal) {
            this.trapFocus(modal, e);
        }
    }

    /**
     * 陷阱焦点在模态框内
     * @param {Element} modal - 模态框元素
     * @param {KeyboardEvent} e - 键盘事件
     */
    trapFocus(modal, e) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    /**
     * 设置主题监听
     */
    setupThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleThemeChange = (e) => {
            const theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            console.log(`🎨 主题已切换为: ${theme}模式`);
        };

        // 初始设置
        handleThemeChange(mediaQuery);
        
        // 监听变化
        mediaQuery.addEventListener('change', handleThemeChange);
    }

    /**
     * 设置错误处理
     */
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('🚨 全局错误:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('🚨 未处理的Promise拒绝:', e.reason);
        });
    }

    /**
     * 关闭所有模态框
     */
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        });
        
        // 恢复body滚动
        document.body.style.overflow = '';
    }

    /**
     * 显示加载状态
     * @param {boolean} show - 是否显示
     */
    showLoading(show = true) {
        if (show) {
            // 显示加载指示器
        } else {
            // 隐藏加载指示器
        }
    }

    /**
     * 销毁实例
     */
    destroy() {
        this.scrollManager.listeners.clear();
        this.isInitialized = false;
        console.log('🔚 Fantastair - 核心功能已销毁');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CoreApp();
});

// 页面卸载前清理
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.destroy();
    }
});