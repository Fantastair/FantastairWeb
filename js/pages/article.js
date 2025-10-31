/**
 * @file 文章页脚本
 * @description 文章页特有的交互和功能
 */

class ArticlePage {
    constructor() {
        this.heroBg = document.getElementById('article-hero-bg');
        this.heroContent = document.getElementById('article-hero-content');
        this.articleContent = document.querySelector('.article-content');
        
        this.init();
    }

    /**
     * 初始化文章页
     */
    init() {
        this.setupScrollEffects();
        this.setupContentEnhancements();
        this.setupInteractiveElements();
        
        console.log('📄 文章页已初始化');
    }

    /**
     * 设置滚动效果
     */
    setupScrollEffects() {
        let ticking = false;

        const updateHeroOnScroll = () => {
            const scrollY = window.scrollY;
            const hero = document.getElementById('article-hero');
            const heroBg = this.heroBg;

            if (!hero || !heroBg) return;

            const heroHeight = hero.offsetHeight;
            const scrollRatio = Math.min(scrollY / heroHeight, 1);

            // 背景模糊和缩放效果
            heroBg.style.filter = `blur(${scrollRatio * 3}px)`;
            heroBg.style.transform = `scale(${1 + scrollRatio * 0.1})`;

            // 内容淡出效果
            if (this.heroContent) {
                this.heroContent.style.opacity = `${1 - scrollRatio * 0.8}`;
                this.heroContent.style.transform = `translateY(${scrollRatio * 50}px)`;
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
        }, { passive: true });
    }

    /**
     * 设置内容增强
     */
    setupContentEnhancements() {
        if (!this.articleContent) return;

        this.enhanceCodeBlocks();
        this.enhanceImages();
        this.enhanceTables();
        this.addHeadingAnchors();
    }

    /**
     * 增强代码块
     */
    enhanceCodeBlocks() {
        const codeBlocks = this.articleContent.querySelectorAll('pre code');
        
        codeBlocks.forEach((block, index) => {
            // 添加语言标识
            const language = this.detectCodeLanguage(block.textContent);
            if (language) {
                block.setAttribute('data-language', language);
            }

            // 添加复制按钮
            this.addCopyButtonToCodeBlock(block, index);
        });
    }

    /**
     * 检测代码语言
     * @param {string} code - 代码内容
     * @returns {string|null} 检测到的语言
     */
    detectCodeLanguage(code) {
        const patterns = {
            python: /(def |class |import |from |print\(|\.py$)/,
            javascript: /(function|const |let |var |=>|\.js$)/,
            html: /(<html|<!DOCTYPE|<\/?[a-z][\s\S]*>)/i,
            css: /(\.|#)[a-z]|@media|margin|padding|color:/i,
            bash: /(#!\/bin\/bash|echo |cd |ls |mkdir )/
        };

        for (const [lang, pattern] of Object.entries(patterns)) {
            if (pattern.test(code)) {
                return lang;
            }
        }
        return null;
    }

    /**
     * 为代码块添加复制按钮
     * @param {Element} codeBlock - 代码块元素
     * @param {number} index - 代码块索引
     */
    addCopyButtonToCodeBlock(codeBlock, index) {
        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-btn';
        copyButton.innerHTML = '<i class="fa-regular fa-copy"></i>';
        copyButton.setAttribute('aria-label', '复制代码');
        copyButton.setAttribute('title', '复制代码');
        
        // 插入复制按钮
        const pre = codeBlock.closest('pre');
        if (pre) {
            pre.style.position = 'relative';
            pre.appendChild(copyButton);
        }

        // 添加点击事件
        copyButton.addEventListener('click', async () => {
            const text = codeBlock.textContent;
            const success = await Utils.copyToClipboard(text);
            
            if (success) {
                this.showCopyFeedback(copyButton, true);
            } else {
                this.showCopyFeedback(copyButton, false);
            }
        });
    }

    /**
     * 显示复制反馈
     * @param {Element} button - 复制按钮
     * @param {boolean} success - 是否成功
     */
    showCopyFeedback(button, success) {
        const originalHTML = button.innerHTML;
        
        if (success) {
            button.innerHTML = '<i class="fa-solid fa-check"></i>';
            button.classList.add('copied');
        } else {
            button.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            button.classList.add('error');
        }

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('copied', 'error');
        }, 2000);
    }

    /**
     * 增强图片显示
     */
    enhanceImages() {
        const images = this.articleContent.querySelectorAll('img');
        
        images.forEach(img => {
            // 添加加载动画
            img.loading = 'lazy';
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';

            // 添加点击放大功能
            img.addEventListener('click', () => {
                this.zoomImage(img);
            });
        });
    }

    /**
     * 增强表格显示
     */
    enhanceTables() {
        const tables = this.articleContent.querySelectorAll('table');
        
        tables.forEach(table => {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
    }

    /**
     * 添加标题锚点
     */
    addHeadingAnchors() {
        const headings = this.articleContent.querySelectorAll('h2, h3, h4');
        
        headings.forEach(heading => {
            const id = heading.id || this.generateHeadingId(heading);
            heading.id = id;
            
            const anchor = document.createElement('a');
            anchor.href = `#${id}`;
            anchor.className = 'heading-anchor';
            anchor.innerHTML = '<i class="fa-solid fa-link"></i>';
            anchor.setAttribute('aria-label', '章节链接');
            
            heading.appendChild(anchor);
        });
    }

    /**
     * 生成标题ID
     * @param {Element} heading - 标题元素
     * @returns {string} 生成的ID
     */
    generateHeadingId(heading) {
        return heading.textContent
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    /**
     * 设置交互元素
     */
    setupInteractiveElements() {
        this.setupImageZoom();
    }

    /**
     * 设置图片放大功能
     */
    setupImageZoom() {
        // 点击图片放大已经在 enhanceImages 中处理
    }

    /**
     * 图片放大查看
     * @param {HTMLImageElement} img - 图片元素
     */
    zoomImage(img) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'image-zoom-modal';
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
            z-index: var(--z-index-modal);
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
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
    }

    /**
     * 销毁文章页实例
     */
    destroy() {
        console.log('🔚 文章页已销毁');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.articlePage = new ArticlePage();
});