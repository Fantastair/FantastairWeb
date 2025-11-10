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