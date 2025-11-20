class ArticlePage {
    constructor() {
        this.init();
    }

    init() {
        this.loadHighResBackground();
        this.setupScrollEffects();
        this.setupInteractions();
        console.log("文章页初始化完成");
    }

    /**
     * 加载高清背景图片
     */
    loadHighResBackground() {
        const heroBg = document.getElementById('article-hero-bg');
        if (!heroBg) return;

        const highResImage = new Image();
        highResImage.src = '../assets/images/background.webp';
        highResImage.onload = () => {
            heroBg.classList.add('loaded');
            console.log("文章页高清背景图片加载完成");
        };
        highResImage.onerror = () => {
            console.warn("文章页高清背景图片加载失败，使用默认图片");
        };
    }

    /**
     * 设置滚动效果
     */
    setupScrollEffects() {
        let ticking = false;

        const updateHeroOnScroll = () => {
            const scrollY = window.scrollY;
            const hero = document.getElementById('article-hero');
            const heroBg = document.getElementById('article-hero-bg');

            if (!hero || !heroBg) return;

            const heroHeight = hero.offsetHeight;
            const scrollRatio = Math.min(scrollY / heroHeight, 1);

            // 背景模糊和缩放效果
            heroBg.style.filter = `blur(${scrollRatio * 3}px)`;
            heroBg.style.transform = `scale(${1 + scrollRatio * 0.1})`;

            // 内容淡出效果
            const content = document.getElementById('article-hero-content');
            if (content) {
                content.style.opacity = `${1 - scrollRatio * 0.8}`;
                content.style.transform = `translateY(${scrollRatio * 50}px)`;
            }
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateHeroOnScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /**
     * 设置交互效果
     */
    setupInteractions() {
        // 代码块复制功能
        this.setupCodeCopy();

        // 图片点击放大
        this.setupImageZoom();
    }

    /**
     * 设置代码块复制功能
     */
    setupCodeCopy() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('pre code') || e.target.closest('pre code')) {
                const codeBlock = e.target.closest('pre');
                if (codeBlock) {
                    this.copyCodeToClipboard(codeBlock);
                }
            }
        });
    }

    /**
     * 复制代码到剪贴板
     */
    async copyCodeToClipboard(codeBlock) {
        try {
            const text = codeBlock.textContent;
            await navigator.clipboard.writeText(text);

            // 显示复制成功提示
            this.showCopySuccess(codeBlock);
        } catch (err) {
            console.error('复制失败:', err);
        }
    }

    /**
     * 显示复制成功提示
     */
    showCopySuccess(codeBlock) {
        const originalText = codeBlock.textContent;
        codeBlock.textContent = '已复制到剪贴板！';
        codeBlock.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';

        setTimeout(() => {
            codeBlock.textContent = originalText;
            codeBlock.style.backgroundColor = '';
        }, 1500);
    }

    /**
     * 设置图片点击放大
     */
    setupImageZoom() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.article-content img')) {
                this.zoomImage(e.target);
            }
        });
    }

    /**
     * 图片放大查看
     */
    zoomImage(img) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            cursor: zoom-out;
        `;

        const modalImg = document.createElement('img');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 10px;
        `;

        modal.appendChild(modalImg);
        document.body.appendChild(modal);

        // 点击关闭
        modal.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // ESC键关闭
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ArticlePage();
});