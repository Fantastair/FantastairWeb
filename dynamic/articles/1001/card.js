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

    /**
     * 飞机掠过
     */
    function planeFly() {
        const distance = getPlaneMoveDistance();
        plane.classList.remove('start');
        plane.style.left = `calc(50% + ${distance}px)`;
        plane.style.top = `calc(50% - ${distance}px)`;
    }

    /**
     * 飞机复位
     */
    function planeReset() {
        const distance = getPlaneMoveDistance();
        plane.classList.add('start');
        plane.style.left = `calc(50% - ${distance}px)`;
        plane.style.top = `calc(50% + ${distance}px)`;
    }

    {
        const distance = getPlaneMoveDistance();
        plane.classList.add('start');
        plane.style.left = `calc(50% - ${distance}px)`;
        plane.style.top = `calc(50% + ${distance}px)`;
    }

    // 如果屏幕宽度小于600px则不启用鼠标交互效果
    if (window.innerWidth < 600) {

    }
    else {
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
        card.addEventListener('mouseenter', planeFly);
        
        // 鼠标移出时飞机复位
        card.addEventListener('mouseleave', planeReset);
    }
}