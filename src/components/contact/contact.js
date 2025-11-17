import { sleep } from '../../scripts/utilities.js';

const contactItems = document.querySelectorAll('.contact-item');

contactItems.forEach(item => {
    const elements = {
        contactBox: item.querySelector('.contact-box'),
        contactIcon: item.querySelector('.contact-icon'),
        contactIconShadow: item.querySelector('.contact-icon-shadow'),
    }

    item.addEventListener('mousemove', (event) => {
        // 计算鼠标偏移
        const rect = item.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - rect.width / 2;
        const offsetY = event.clientY - rect.top - rect.height / 2;
        // 旋转组件
        elements.contactBox.style.transform = `perspective(30rem) rotateX(${45 - offsetY / 10}deg) rotateY(${offsetX / 10}deg)`;
        elements.contactBox.style.boxShadow = `${offsetX / 20}px ${8 + offsetY / 20}px 16px color-mix(in srgb, var(--color-bg-blue) 40%, transparent)`;
        elements.contactIcon.style.transform = `perspective(30rem) rotateX(${-offsetY / 10}deg) rotateZ(${offsetX / 14}deg) translateX(${offsetX / 10}px) translateY(${offsetY / 20}px)`;
        elements.contactIconShadow.style.transform = `perspective(30rem) rotateX(${-offsetY / 10}deg) rotateZ(${offsetX / 10}deg) translateX(${offsetX / 5}px) translateY(${offsetY / 10}px)`;
    });

    item.addEventListener('mouseleave', () => {
        // 重置旋转
        elements.contactBox.style.transform = '';
        elements.contactBox.style.boxShadow = '';
        elements.contactIcon.style.transform = '';
        elements.contactIconShadow.style.transform = '';
    });
});
