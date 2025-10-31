/**
 * @file 二维码模块
 * @description 管理二维码模态框的显示和交互
 */

class QRCodeModal {
    constructor() {
        this.modal = document.getElementById('qr-modal');
        this.qrImage = document.getElementById('qr-image');
        this.caption = document.getElementById('caption');
        this.closeButton = document.querySelector('.close-btn');
        
        this.isOpen = false;
        this.currentType = null;
        
        this.init();
    }

    /**
     * 初始化二维码模块
     */
    init() {
        this.setupEventListeners();
        this.setupQRCodeTriggers();
        
        console.log('📱 二维码模块已初始化');
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 关闭按钮
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.close();
            });
        }

        // 点击模态框外部关闭
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    /**
     * 设置二维码触发器
     */
    setupQRCodeTriggers() {
        const triggers = document.querySelectorAll('.qr-trigger');
        
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const qrType = trigger.dataset.qrType;
                this.show(qrType);
            });

            // 键盘支持
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const qrType = trigger.dataset.qrType;
                    this.show(qrType);
                }
            });
        });
    }

    /**
     * 显示二维码模态框
     * @param {string} type - 二维码类型
     */
    show(type) {
        if (!this.modal || !this.qrImage) return;

        const qrConfig = this.getQRConfig(type);
        if (!qrConfig) {
            console.warn(`⚠️ 未知的二维码类型: ${type}`);
            return;
        }

        // 设置二维码内容
        this.qrImage.src = qrConfig.image;
        this.qrImage.alt = qrConfig.alt;
        
        if (this.caption) {
            this.caption.textContent = qrConfig.caption;
        }

        // 显示模态框
        this.modal.style.display = 'block';
        this.modal.setAttribute('aria-hidden', 'false');
        this.currentType = type;
        this.isOpen = true;

        // 禁用body滚动
        document.body.style.overflow = 'hidden';

        // 聚焦关闭按钮
        if (this.closeButton) {
            this.closeButton.focus();
        }

        console.log(`📱 显示${qrConfig.caption}`);
    }

    /**
     * 关闭二维码模态框
     */
    close() {
        if (!this.modal || !this.isOpen) return;

        this.modal.style.display = 'none';
        this.modal.setAttribute('aria-hidden', 'true');
        this.isOpen = false;
        this.currentType = null;

        // 恢复body滚动
        document.body.style.overflow = '';

        console.log('📱 二维码模态框已关闭');
    }

    /**
     * 获取二维码配置
     * @param {string} type - 二维码类型
     * @returns {Object|null} 二维码配置
     */
    getQRConfig(type) {
        const configs = {
            qq: {
                image: '/assets/images/qq_card.webp',
                alt: 'QQ二维码',
                caption: 'QQ 二维码'
            },
            wechat: {
                image: '/assets/images/wx_card.webp',
                alt: '微信二维码',
                caption: '微信二维码'
            }
        };

        return configs[type] || null;
    }

    /**
     * 检查是否支持指定类型的二维码
     * @param {string} type - 二维码类型
     * @returns {boolean} 是否支持
     */
    supportsType(type) {
        return !!this.getQRConfig(type);
    }

    /**
     * 获取支持的二维码类型列表
     * @returns {string[]} 支持的二维码类型数组
     */
    getSupportedTypes() {
        return Object.keys(this.getQRConfig('qq') ? { qq: 1, wechat: 1 } : {});
    }

    /**
     * 获取当前显示的二维码类型
     * @returns {string|null} 当前二维码类型
     */
    getCurrentType() {
        return this.currentType;
    }

    /**
     * 检查模态框是否打开
     * @returns {boolean} 是否打开
     */
    isModalOpen() {
        return this.isOpen;
    }

    /**
     * 添加自定义二维码类型
     * @param {string} type - 二维码类型
     * @param {Object} config - 二维码配置
     */
    addCustomType(type, config) {
        if (!config.image || !config.alt || !config.caption) {
            console.error('❌ 二维码配置不完整，必须包含 image、alt 和 caption 属性');
            return;
        }

        const configs = this.getQRConfig('qq') ? 
            { qq: this.getQRConfig('qq'), wechat: this.getQRConfig('wechat') } : {};
        
        configs[type] = config;
        
        // 更新触发器
        this.updateTriggers();
    }

    /**
     * 更新二维码触发器
     */
    updateTriggers() {
        // 可以在这里动态更新页面上的二维码触发器
        console.log('🔄 更新二维码触发器');
    }

    /**
     * 预加载二维码图片
     */
    preloadImages() {
        const configs = this.getQRConfig('qq') ? 
            [this.getQRConfig('qq'), this.getQRConfig('wechat')] : [];
        
        configs.forEach(config => {
            if (config && config.image) {
                Utils.loadImage(config.image).catch(() => {
                    console.warn(`⚠️ 二维码图片预加载失败: ${config.image}`);
                });
            }
        });
    }

    /**
     * 销毁二维码模块
     */
    destroy() {
        this.close();
        
        if (this.closeButton) {
            this.closeButton.removeEventListener('click', this.close);
        }
        
        if (this.modal) {
            this.modal.removeEventListener('click', this.handleOutsideClick);
        }
        
        console.log('🔚 二维码模块已销毁');
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    window.qrCodeModal = new QRCodeModal();
    
    // 预加载二维码图片
    setTimeout(() => {
        window.qrCodeModal.preloadImages();
    }, 1000);
});