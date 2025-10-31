class TemplateLoader {
    constructor() {
        this.articleData = null;
        this.init();
    }

    async init() {
        // 从 URL 参数获取文章 ID
        const articleId = this.getArticleIdFromURL();

        if (articleId) {
            await this.loadArticle(articleId);
            this.renderArticle();
            this.updatePageMetadata();
        } else {
            this.redirectTo404();
        }
    }

    getArticleIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('article');
    }

    async loadArticle(articleId) {
        try {
            const response = await fetch(`articles/${articleId}.html`);
            if (!response.ok) {
                throw new Error('文章不存在');
            }

            const html = await response.text();
            this.articleData = this.parseArticleHTML(html);
        } catch (error) {
            console.error('加载文章失败:', error);
            this.redirectTo404();
        }
    }

    parseArticleHTML(html) {
        // 创建临时 DOM 元素来解析 HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // 提取文章数据 - 适配新的模板结构
        return {
            title: tempDiv.querySelector('[data-field="title"]')?.textContent || '未命名文章',
            date: tempDiv.querySelector('[data-field="date"]')?.textContent || '',
            tags: Array.from(tempDiv.querySelectorAll('[data-field="tags"] [data-tag]')).map(tag => tag.textContent),
            content: tempDiv.querySelector('[data-field="content"]')?.innerHTML || '<p>文章内容为空</p>',
            // 新增：背景图片（如果有）
            background: tempDiv.querySelector('[data-field="background"]')?.textContent || ''
        };
    }

    renderArticle() {
        if (!this.articleData) return;

        // 更新文章标题
        const titleElement = document.querySelector('.article-title[data-field="title"]');
        if (titleElement) {
            titleElement.textContent = this.articleData.title;
        }

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

        // 更新内容
        const contentElement = document.querySelector('.article-content[data-field="content"]');
        if (contentElement) {
            contentElement.innerHTML = this.articleData.content;

            // 处理内容中的代码块和图片
            this.processContentElements(contentElement);
        }

        // 设置自定义背景（如果有）
        if (this.articleData.background) {
            this.setCustomBackground(this.articleData.background);
        }
    }

    /**
     * 处理内容中的特殊元素
     */
    processContentElements(contentElement) {
        // 为代码块添加语言标识
        const codeBlocks = contentElement.querySelectorAll('pre code');
        codeBlocks.forEach((block, index) => {
            const language = this.detectCodeLanguage(block.textContent);
            if (language) {
                block.setAttribute('data-language', language);
            }

            // 添加行号
            this.addLineNumbers(block);
        });

        // 为表格添加响应式包装
        const tables = contentElement.querySelectorAll('table');
        tables.forEach(table => {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });

        // 为图片添加加载动画
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
     * 检测代码语言
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
     * 为代码块添加行号
     */
    addLineNumbers(codeBlock) {
        const lines = codeBlock.textContent.split('\n');
        if (lines.length > 1) {
            const lineNumbers = document.createElement('div');
            lineNumbers.className = 'line-numbers';
            lineNumbers.innerHTML = lines.map((_, i) => `<span>${i + 1}</span>`).join('\n');

            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            codeBlock.parentNode.insertBefore(wrapper, codeBlock);
            wrapper.appendChild(lineNumbers);
            wrapper.appendChild(codeBlock);
        }
    }

    /**
     * 设置自定义背景图片
     */
    setCustomBackground(backgroundUrl) {
        const heroBg = document.getElementById('article-hero-bg');
        if (heroBg && backgroundUrl) {
            // 加载自定义背景
            const customBg = new Image();
            customBg.onload = () => {
                heroBg.style.backgroundImage = `url('${backgroundUrl}')`;
                heroBg.classList.add('loaded');
            };
            customBg.src = backgroundUrl;
        }
    }

    /**
     * 更新页面元数据
     */
    updatePageMetadata() {
        if (!this.articleData) return;

        // 更新页面标题
        document.title = `${this.articleData.title} - Fantastair`;

        // 更新 Open Graph 元数据（用于社交媒体分享）
        this.updateOpenGraphMetadata();
    }

    /**
     * 更新 Open Graph 元数据
     */
    updateOpenGraphMetadata() {
        // 动态创建 meta 标签
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
     * 获取文章描述（用于元数据）
     */
    getArticleDescription() {
        if (!this.articleData.content) return 'Fantastair 的专栏文章';

        // 从内容中提取前 150 个字符作为描述
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.articleData.content;
        const text = tempDiv.textContent || '';
        return text.substring(0, 150) + (text.length > 150 ? '...' : '');
    }

    /**
     * 重定向到 404 页面
     */
    redirectTo404() {
        window.location.href = '404.html';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new TemplateLoader();
});