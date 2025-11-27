const elements = {
    qrModal: document.getElementById('qr-modal'),
    qrImage: document.getElementById('qr-image'),
    closeButton: document.getElementById('qr-close-button'),
}

export function initQRCode() {
    const qrTriggers = document.querySelectorAll('.qr-trigger');

    // 二维码触发器
    qrTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            showQRCode(trigger.getAttribute('data-qr-path'));
        });
    });

    // 关闭按钮
    elements.closeButton.addEventListener('click', closeQRCode);
}

/**
 * 显示二维码
 * @param {string} path - 二维码图片路径
 */
function showQRCode(path) {
    elements.qrImage.src = path;
    elements.qrModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

/**
 * 关闭二维码模态框
 */
function closeQRCode() {
    setTimeout(() => {
        elements.qrImage.src = '';
    }, 300);
    elements.qrModal.classList.remove('show');
    document.body.style.overflow = '';
}
