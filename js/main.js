// 控制台欢迎信息
console.log("泥嚎 🚀 - Fantastair 个人主页已加载");

// 全局常量定义
const CONFIG = {
    finalHeight: 60,
    finalTitleTop: 30, // finalHeight / 2
    finalTitleLeft: 15 // finalHeight / 4
};

// DOM 元素缓存
const elements = {
    hero: document.getElementById('hero'),
    heroBg: document.getElementById('hero-bg'),
    heroIconWrapper: document.getElementById('hero-icon-wrapper'),
    heroTitle: document.getElementById('hero-title'),
    content: document.getElementById('content'),
    topNav: document.getElementById('top-nav'),
    homeLink: document.getElementById('home-link'),
    qrModal: document.getElementById('qr-modal'),
    qrImage: document.getElementById('qr-image'),
    caption: document.getElementById('caption'),
    closeBtn: document.querySelector('.close-btn')
};

// 状态管理
const state = {
    navLocked: false,
    navShowed: false,
    ticking: false
};

/**
 * 初始化函数 - 页面加载完成后执行
 */
function init() {
    loadHighResBackground();
    setupEventListeners();
    setupThemeListener();
    console.log("页面初始化完成");
}

/**
 * 加载高清背景图片
 */
function loadHighResBackground() {
    const highResImage = new Image();
    highResImage.src = '../assets/images/background.webp';
    highResImage.onload = () => {
        elements.heroBg.classList.add('loaded');
        console.log("高清背景图片加载完成");
    };
    highResImage.onerror = () => {
        console.warn("高清背景图片加载失败，使用默认图片");
    };
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 滚动事件
    window.addEventListener('scroll', handleScroll);
    
    // 首页链接平滑滚动
    elements.homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 二维码功能
    setupQRCodeModal();
    
    // 专栏项目点击事件
    setupColumnItems();
}

/**
 * 设置主题切换监听
 */
function setupThemeListener() {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        console.log("系统主题已切换为：", e.matches ? "深色" : "浅色");
    });
}

/**
 * 滚动事件处理
 */
function handleScroll() {
    if (!state.ticking) {
        requestAnimationFrame(() => {
            updateHeroWhileScrolling();
            state.ticking = false;
        });
        state.ticking = true;
    }
}

/**
 * 滚动时更新英雄区域效果
 */
function updateHeroWhileScrolling() {
    const scrollY = window.scrollY;
    const rawRatio = scrollY / (window.innerHeight - CONFIG.finalHeight);
    const ratio = Math.min(rawRatio, 1);

    // 导航锁定逻辑
    if (state.navLocked && ratio < 1) {
        state.navLocked = false;
    }
    if (!state.navLocked && ratio === 1) {
        state.navLocked = true;
    }

    // 控制导航显示/隐藏
    if (ratio < 0.2) {
        hideNav();
    } else {
        showNav();
    }

    // 更新英雄区域样式
    updateHeroStyles(ratio);
}

/**
 * 显示导航栏
 */
function showNav() {
    if (state.navShowed) return;
    state.navShowed = true;
    elements.topNav.classList.add('show');
}

/**
 * 隐藏导航栏
 */
function hideNav() {
    if (!state.navShowed) return;
    state.navShowed = false;
    elements.topNav.classList.remove('show');
}

/**
 * 根据滚动比例更新英雄区域样式
 * @param {number} ratio - 滚动比例 (0-1)
 */
function updateHeroStyles(ratio) {
    const { hero, heroBg, heroIconWrapper, heroTitle } = elements;
    
    // 高度和模糊效果
    hero.style.height = `${(1 - ratio) * (window.innerHeight - CONFIG.finalHeight) + CONFIG.finalHeight}px`;
    heroBg.style.filter = `blur(${ratio * 5}px)`;
    heroBg.style.transform = `scale(${1 + ratio * 0.2})`;

    // 字体大小响应式调整
    const min = 2.5;
    const ideal = 16 - ratio * 11.2;
    const max = 8;
    heroTitle.style.fontSize = `clamp(${min}rem, ${ideal}vmin, ${max}rem)`;

    // 图标位置
    heroIconWrapper.style.top = `${-40 * ratio + (1 - ratio) * 40}vh`;

    // 标题位置变换
    const titleLeft = CONFIG.finalTitleLeft * ratio ** 2 + window.innerWidth * (1 - ratio ** 2) / 2;
    const titleTop = CONFIG.finalTitleTop * ratio + window.innerHeight * (1 - ratio) * 0.55;
    
    heroTitle.style.left = `${titleLeft}px`;
    heroTitle.style.top = `${titleTop}px`;
    heroTitle.style.transform = `translate(-${50 * (1 - ratio ** 2)}%, -50%)`;
}

/**
 * 设置二维码模态框功能
 */
function setupQRCodeModal() {
    const qrTriggers = document.querySelectorAll('.qr-trigger');
    
    // 二维码触发器
    qrTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const qrType = trigger.dataset.qrType;
            showQRCode(qrType);
        });
    });
    
    // 关闭按钮
    elements.closeBtn.addEventListener('click', closeQRCode);
    
    // 点击模态框外部关闭
    elements.qrModal.addEventListener('click', (e) => {
        if (e.target === elements.qrModal) {
            closeQRCode();
        }
    });
    
    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.qrModal.style.display === 'block') {
            closeQRCode();
        }
    });
}

/**
 * 显示二维码
 * @param {string} type - 二维码类型 ('qq' 或 'wechat')
 */
function showQRCode(type) {
    const qrImages = {
        qq: '/assets/images/qq_card.webp',
        wechat: '/assets/images/wx_card.webp'
    };
    
    const captions = {
        qq: 'QQ 二维码',
        wechat: '微信二维码'
    };
    
    if (qrImages[type]) {
        elements.qrImage.src = qrImages[type];
        elements.qrImage.alt = captions[type];
        elements.caption.textContent = captions[type];
        elements.qrModal.style.display = 'block';
        elements.qrModal.setAttribute('aria-hidden', 'false');
        
        console.log(`显示${captions[type]}`);
    }
}

/**
 * 关闭二维码模态框
 */
function closeQRCode() {
    elements.qrModal.style.display = 'none';
    elements.qrModal.setAttribute('aria-hidden', 'true');
}

/**
 * 设置专栏项目交互 - 优化版
 */
function setupColumnItems() {
    const columnItems = document.querySelectorAll('.column-item');
    
    columnItems.forEach(item => {
        // 鼠标点击事件
        item.addEventListener('click', (e) => {
            // 添加点击反馈
            item.style.transform = 'translateY(-2px) scale(0.98)';
            
            setTimeout(() => {
                const href = item.dataset.href;
                if (href) {
                    // 如果是外部链接，新窗口打开
                    if (href.startsWith('https')) {
                        window.open(href, '_blank', 'noopener,noreferrer');
                    } else {
                        // 如果是内部文章链接，当前窗口打开
                        window.location.href = href;
                    }
                }
            }, 150);
        });
        
        // 键盘可访问性
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.style.transform = 'translateY(-2px) scale(0.98)';
                
                setTimeout(() => {
                    const href = item.dataset.href;
                    if (href) {
                        if (href.startsWith('https')) {
                            window.open(href, '_blank', 'noopener,noreferrer');
                        } else {
                            window.location.href = href;
                        }
                    }
                }, 150);
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

// ===== 专栏背景图懒加载优化 =====
function lazyLoadColumnBackgrounds() {
    const columnItems = document.querySelectorAll('.column-bg[data-bg]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bg = entry.target;
                    const imageUrl = bg.getAttribute('data-bg');
                    
                    // 预加载图片
                    const img = new Image();
                    img.onload = () => {
                        bg.style.backgroundImage = `url('${imageUrl}')`;
                        bg.classList.add('loaded');
                    };
                    img.onerror = () => {
                        console.warn(`Failed to load image: ${imageUrl}`);
                        // 可以设置一个默认的背景图
                        bg.style.backgroundImage = `url('assets/images/background_small.webp')`;
                        bg.classList.add('loaded');
                    };
                    img.src = imageUrl;
                    
                    observer.unobserve(bg);
                }
            });
        }, {
            rootMargin: '50px' // 提前100px开始加载，提升用户体验
        });

        columnItems.forEach(bg => imageObserver.observe(bg));
    } else {
        // 不支持 IntersectionObserver 的浏览器，直接加载所有图片
        columnItems.forEach(bg => {
            const imageUrl = bg.getAttribute('data-bg');
            const img = new Image();
            img.onload = () => {
                bg.style.backgroundImage = `url('${imageUrl}')`;
                bg.classList.add('loaded');
            };
            img.onerror = () => {
                bg.style.backgroundImage = `url('assets/images/default-bg.webp')`;
                bg.classList.add('loaded');
            };
            img.src = imageUrl;
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupColumnItems();
    lazyLoadColumnBackgrounds();
});
