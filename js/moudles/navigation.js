/**
 * @file 导航模块
 * @description 管理顶部导航和页面导航功能
 */

class Navigation {
    constructor() {
        this.navElement = document.getElementById('top-nav');
        this.navItems = document.querySelectorAll('.nav-item');
        this.homeLink = document.getElementById('home-link');
        this.isNavVisible = false;
        this.init();
    }

    /**
     * 初始化导航
     */
    init() {
        this.setupScrollBehavior();
        this.setupClickHandlers();
        this.setupKeyboardNavigation();
        this.setupResponsiveBehavior();
        
        console.log('🧭 导航模块已初始化');
    }

    /**
     * 设置滚动行为
     */
    setupScrollBehavior() {
        if (window.app && window.app.scrollManager) {
            window.app.scrollManager.addListener(this.handleScroll.bind(this));
        } else {
            window.addEventListener('scroll', Utils.throttle(this.handleScroll.bind(this), 100));
        }
    }

    /**
     * 处理滚动事件
     * @param {number} scrollY - 滚动位置
     */
    handleScroll(scrollY = window.scrollY) {
        const heroHeight = window.innerHeight;
        const scrollRatio = Math.min(scrollY / (heroHeight - 60), 1);
        
        // 控制导航显示/隐藏
        if (scrollRatio > 0.2) {
            this.showNav();
        } else {
            this.hideNav();
        }

        // 更新导航样式
        this.updateNavStyle(scrollRatio);
    }

    /**
     * 显示导航
     */
    showNav() {
        if (this.isNavVisible) return;
        
        this.navElement.classList.add('show');
        this.isNavVisible = true;
    }

    /**
     * 隐藏导航
     */
    hideNav() {
        if (!this.isNavVisible) return;
        
        this.navElement.classList.remove('show');
        this.isNavVisible = false;
    }

    /**
     * 更新导航样式
     * @param {number} ratio - 滚动比例
     */
    updateNavStyle(ratio) {
        // 可以根据滚动比例调整导航透明度等样式
        const opacity = Math.min(ratio * 1.5, 1);
        this.navElement.style.opacity = opacity;
    }

    /**
     * 设置点击处理器
     */
    setupClickHandlers() {
        // 首页链接平滑滚动
        if (this.homeLink) {
            this.homeLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }

        // 导航项点击处理
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleNavClick(e, item);
            });
        });
    }

    /**
     * 处理导航点击
     * @param {Event} e - 点击事件
     * @param {Element} item - 导航项元素
     */
    handleNavClick(e, item) {
        const href = item.getAttribute('href');
        
        // 如果是锚点链接，平滑滚动
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                this.scrollToElement(targetElement);
            }
        }
    }

    /**
     * 设置键盘导航
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // 只在导航可见时处理键盘事件
            if (!this.isNavVisible) return;

            switch(e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    this.focusNextNavItem();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.focusPrevNavItem();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.focusFirstNavItem();
                    break;
                case 'End':
                    e.preventDefault();
                    this.focusLastNavItem();
                    break;
            }
        });
    }

    /**
     * 聚焦下一个导航项
     */
    focusNextNavItem() {
        const focusedIndex = Array.from(this.navItems).findIndex(item => 
            item === document.activeElement
        );
        const nextIndex = (focusedIndex + 1) % this.navItems.length;
        this.navItems[nextIndex].focus();
    }

    /**
     * 聚焦上一个导航项
     */
    focusPrevNavItem() {
        const focusedIndex = Array.from(this.navItems).findIndex(item => 
            item === document.activeElement
        );
        const prevIndex = (focusedIndex - 1 + this.navItems.length) % this.navItems.length;
        this.navItems[prevIndex].focus();
    }

    /**
     * 聚焦第一个导航项
     */
    focusFirstNavItem() {
        this.navItems[0].focus();
    }

    /**
     * 聚焦最后一个导航项
     */
    focusLastNavItem() {
        this.navItems[this.navItems.length - 1].focus();
    }

    /**
     * 设置响应式行为
     */
    setupResponsiveBehavior() {
        // 监听窗口大小变化
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));
    }

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        const isMobile = window.innerWidth < 768;
        
        // 根据屏幕大小调整导航行为
        if (isMobile) {
            this.navElement.classList.add('nav--mobile');
        } else {
            this.navElement.classList.remove('nav--mobile');
        }
    }

    /**
     * 滚动到顶部
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * 滚动到元素
     * @param {Element} element - 目标元素
     */
    scrollToElement(element) {
        const offset = 80; // 导航栏高度偏移
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * 获取当前活动导航项
     * @returns {Element|null} 活动导航项
     */
    getActiveNavItem() {
        const currentHash = window.location.hash;
        return document.querySelector(`.nav-item[href="${currentHash}"]`);
    }

    /**
     * 设置活动导航项
     * @param {string} sectionId - 区域ID
     */
    setActiveNavItem(sectionId) {
        // 移除所有活动状态
        this.navItems.forEach(item => item.classList.remove('nav-item--active'));
        
        // 设置新的活动状态
        const activeItem = document.querySelector(`.nav-item[href="#${sectionId}"]`);
        if (activeItem) {
            activeItem.classList.add('nav-item--active');
        }
    }

    /**
     * 销毁导航模块
     */
    destroy() {
        if (window.app && window.app.scrollManager) {
            window.app.scrollManager.removeListener(this.handleScroll.bind(this));
        }
        
        this.navItems.forEach(item => {
            item.removeEventListener('click', this.handleNavClick);
        });
        
        console.log('🔚 导航模块已销毁');
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new Navigation();
});