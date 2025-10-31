/**
 * @file 文章管理模块
 * @description 管理文章的加载、解析和显示
 */

class ArticleManager {
    constructor() {
        this.articleData = null;
        this.currentArticleId = null;
        this.init();
    }

    /**
     * 初始化文章管理
     */
    init() {
        console.log('📚 文章管理模块已初始化');
    }

    /**
     * 从URL参数获取文章ID
     * @returns {string|null} 文章ID
     */
    getArticleIdFromURL() {
        return Utils.getUrlParam('article');
    }

    /**
     * 加载文章
     * @param {string} articleId - 文章ID
     * @returns {Promise<Object>} 文章数据
     */
    async loadArticle(articleId) {
        try {
            const response = await fetch(`articles/${articleId}.html`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            this.articleData = this.parseArticleHTML(html);
            this.currentArticleId = articleId;
            
            return this.articleData;
            
        } catch (error) {
            console.error('❌ 加载文章失败:', error);
            throw error;
        }
    }

    /**
     * 解析文章HTML
     * @param {string} html - HTML内容
     * @returns {Object} 解析后的文章数据
     */
    parseArticleHTML(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        return {
            title: tempDiv.querySelector('[data-field="title"]')?.textContent || '未命名文章',
            date: tempDiv.querySelector('[data-field="date"]')?.textContent || '',
            tags: Array.from(tempDiv.querySelectorAll('[data-field="tags"] [data-tag]')).map(tag => tag.textContent),
            content: tempDiv.querySelector('[data-field="content"]')?.innerHTML || '<p>文章内容为空</p>',
            background: tempDiv.querySelector('[data-field="background"]')?.textContent || ''
        };
    }

    /**
     * 渲染文章
     */
    renderArticle() {
        if (!this.articleData) return;

        this.updateTitle();
        this.updateMetadata();
        this.updateContent();
        this.updateBackground();
    }

    /**
     * 更新标题
     */
    updateTitle() {
        const titleElement = document.querySelector('.article-title[data-field="title"]');
        if (titleElement) {
            titleElement.textContent = this.articleData.title;
        }

        // 更新页面标题
        document.title = `${this.articleData.title} - Fantastair`;
    }

    /**
     * 更新元数据
     */
    updateMetadata() {
        // 更新日期
        const dateElement = document.querySelector('.article-date[data-field="date"]');
        if (dateElement) {
            dateElement.textContent = this.articleData.date;
        }

        // 更新标签
        const tagsContainer = document.querySelector('.article-tags[data-field="tags"]');
        if (tagsContainer && this.articleData.tags.length > 0) {
            tagsContainer.innerHTML = this.articleData.tags.map(tag =>
                `<span class="article-tag">${tag}</span>`
            ).join('');
        }
    }

    /**
     * 更新内容
     */
    updateContent() {
        const contentElement = document.querySelector('.article-content[data-field="content"]');
        if (contentElement) {
            Utils.safeSetHTML(contentElement, this.articleData.content);
            
            // 处理内容中的特殊元素
            this.processContentElements(contentElement);
        }
    }

    /**
     * 更新背景
     */
    updateBackground() {
        if (this.articleData.background) {
            this.setCustomBackground(this.articleData.background);
        }
    }

    /**
     * 处理内容中的特殊元素
     * @param {Element} contentElement - 内容元素
     */
    processContentElements(contentElement) {
        this.enhanceCodeBlocks(contentElement);
        this.enhanceTables(contentElement);
        this.enhanceImages(contentElement);
    }

    /**
     * 增强代码块
     * @param {Element} contentElement - 内容元素
     */
    enhanceCodeBlocks(contentElement) {
        const codeBlocks = contentElement.querySelectorAll('pre code');
        
        codeBlocks.forEach((block) => {
            // 检测代码语言
            const language = this.detectCodeLanguage(block.textContent);
            if (language) {
                block.setAttribute('data-language', language);
            }
        });
    }

    /**
     * 检测代码语言
     * @param {string} code - 代码内容
     * @returns {string|null} 语言类型
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
     * 增强表格
     * @param {Element} contentElement - 内容元素
     */
    enhanceTables(contentElement) {
        const tables = contentElement.querySelectorAll('table');
        
        tables.forEach(table => {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
    }

    /**
     * 增强图片
     * @param {Element} contentElement - 内容元素
     */
    enhanceImages(contentElement) {
        const images = contentElement.querySelectorAll('img');
        
        images.forEach(img => {
            img.loading = 'lazy';
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        });
    }

    /**
     * 设置自定义背景
     * @param {string} backgroundUrl - 背景图片URL
     */
    setCustomBackground(backgroundUrl) {
        const heroBg = document.getElementById('article-hero-bg');
        if (heroBg && backgroundUrl) {
            Utils.loadImage(backgroundUrl)
                .then(() => {
                    heroBg.style.backgroundImage = `url('${backgroundUrl}')`;
                    heroBg.classList.add('loaded');
                })
                .catch(() => {
                    console.warn(`❌ 自定义背景加载失败: ${backgroundUrl}`);
                });
        }
    }

    /**
     * 更新Open Graph元数据
     */
    updateOpenGraphMetadata() {
        if (!this.articleData) return;

        const metaTags = {
            'og:title': this.articleData.title,
            'og:type': 'article',
            'og:url': window.location.href,
            'og:description': this.getArticleDescription(),
            'twitter:card': 'summary',
            'twitter:title': this.articleData.title,
            'twitter:description': this.getArticleDescription()
        };

        Object.entries(metaTags).forEach(([property, content]) => {
            let meta = document.querySelector(`meta[property="${property}"]`) ||
                       document.querySelector(`meta[name="${property}"]`);

            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(property.startsWith('og:') ? 'property' : 'name', property);
                document.head.appendChild(meta);
            }

            meta.setAttribute('content', content);
        });
    }

    /**
     * 获取文章描述
     * @returns {string} 文章描述
     */
    getArticleDescription() {
        if (!this.articleData.content) return 'Fantastair 的专栏文章';

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.articleData.content;
        const text = tempDiv.textContent || '';
        return text.substring(0, 150) + (text.length > 150 ? '...' : '');
    }

    /**
     * 获取当前文章数据
     * @returns {Object|null} 文章数据
     */
    getCurrentArticleData() {
        return this.articleData;
    }

    /**
     * 获取当前文章ID
     * @returns {string|null} 文章ID
     */
    getCurrentArticleId() {
        return this.currentArticleId;
    }

    /**
     * 重定向到404页面
     */
    redirectTo404() {
        window.location.href = '404.html';
    }

    /**
     * 销毁文章管理实例
     */
    destroy() {
        this.articleData = null;
        this.currentArticleId = null;
        console.log('🔚 文章管理模块已销毁');
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    window.articleManager = new ArticleManager();
});