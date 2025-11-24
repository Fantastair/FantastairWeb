{
    const card = document.getElementById('column-card-1001');
    const plane = document.getElementById('plane-1001');
    const crossX = document.getElementById('cross-x-1001');
    const crossY = document.getElementById('cross-y-1001');

    /**
     * @returns {number} 飞机移动的距离
     */
    function getPlaneMoveDistance() {
        return (card.getClientRects()[0].height + plane.getClientRects()[0].height) / 2;        
    }
    function getCardHeight() {
        return card.getClientRects()[0].height;        
    }
    function getPlaneHeight() {
        return plane.getClientRects()[0].height;        
    }

    {
        const distance = getPlaneMoveDistance();
        plane.classList.add('start');
        plane.style.left = `calc(50% - ${distance}px)`;
        plane.style.top = `calc(50% + ${distance}px)`;
    }

    let size = parseFloat(getComputedStyle(crossX).getPropertyValue('--size'));
    // 移动十字到鼠标光标位置
    let ticking = false;
    card.addEventListener('mousemove', (e) => {
        if (ticking) return;
        requestAnimationFrame(() => {
            const scale = parseFloat(getComputedStyle(card).getPropertyValue('--scale'));
            const rect = card.getBoundingClientRect();
            const x = (e.clientY - rect.top) / scale - size / 2;
            const y = (e.clientX - rect.left) / scale - size / 2;
            crossX.style.top = `${x}px`;
            crossY.style.left = `${y}px`;
            ticking = false;
        });
        ticking = true;
    });

    // 鼠标移入时飞机掠过
    card.addEventListener('mouseenter', () => {
        const distance = getPlaneMoveDistance();
        plane.classList.remove('start');
        plane.style.left = `calc(50% + ${distance}px)`;
        plane.style.top = `calc(50% - ${distance}px)`;
    });
    
    // 鼠标移出时飞机复位
    card.addEventListener('mouseleave', () => {
        const distance = getPlaneMoveDistance();
        plane.classList.add('start');
        plane.style.left = `calc(50% - ${distance}px)`;
        plane.style.top = `calc(50% + ${distance}px)`;
    });
}