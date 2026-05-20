const projects = [
    {
        slug: "FantasV3",
        name: "FantasV3",
        desc: "基于 pygame-ce 的 Python 2D 图形开发框架，提供 UI 树形组件系统、事件捕获/冒泡、渲染命令管道、布局器和关键帧动画。",
        tags: ["Python", "pygame-ce", "Poetry", "pytest"],
        github: "https://github.com/Fantastair/FantasV3",
        release: "https://github.com/Fantastair/FantasV3/releases",
        hasRelease: true,
    },
    {
        slug: "Minesweeper-anti-matter",
        name: "扫雷（反物质版）",
        desc: '在经典扫雷基础上引入「正物质雷」和「反物质雷」，通过正负号推断雷的类型，创新游戏规则。',
        tags: ["Python", "Pygame", "fantas UI"],
        github: "https://github.com/Fantastair/Minesweeper-anti-matter",
        release: "https://github.com/Fantastair/Minesweeper-anti-matter/releases",
        hasRelease: true,
    },
    {
        slug: "Airport-Hegemony",
        name: "机场霸王",
        desc: "双人对战回合制轰炸棋游戏，在 12×12 网格中部署飞机、轮流轰炸对方机场，含 AI 概率推理算法。",
        tags: ["Python", "Pygame"],
        github: "https://github.com/Fantastair/Airport-Hegemony",
        hasRelease: false,
    },
    {
        slug: "PythonEye",
        name: "Python Eye",
        desc: "面向 Python 初学者的可视化代码调试器，基于 pdb 扩展，支持断点、步进、变量追踪和语法高亮。",
        tags: ["Python", "Pygame", "fantas UI"],
        github: "https://github.com/Fantastair/PythonEye",
        hasRelease: false,
    },
    {
        slug: "AutoBingWallpaper",
        name: "AutoBingWallpaper",
        desc: "每日自动下载 Bing 官方 4K 壁纸并设为 Windows 桌面壁纸，运行即退出，无后台常驻，核心仅 58 行。",
        tags: ["Python", "requests", "PyInstaller"],
        github: "https://github.com/Fantastair/AutoBingWallpaper",
        release: "https://github.com/Fantastair/AutoBingWallpaper/releases",
        hasRelease: true,
    },
    {
        slug: "Enigma-machine",
        name: "Enigma 密码机模拟器",
        desc: "桌面端模拟二战德军 Enigma 密码机的加密与解密过程，提供可视化转子操作界面，零外部依赖。",
        tags: ["Python", "Tkinter"],
        github: "https://github.com/Fantastair/Enigma-machine",
        hasRelease: false,
    },
    {
        slug: "Electronic-Piano",
        name: "简易电子琴",
        desc: "基于串口通信的电子琴数字孪生系统，上位机 (pygame) 与下位机 (STM32) 协同实现音乐播放与录音管理。",
        tags: ["C", "STM32", "Python", "Pygame", "fantas UI"],
        github: "https://github.com/Fantastair/Electronic-Piano-Upper",
        release: "https://github.com/Fantastair/Electronic-Piano-Upper/releases",
        hasRelease: true,
        github2: "https://github.com/Fantastair/Simple-Electronic-Keyboard",
        github2Label: "下位机",
    },
    {
        slug: "Serial-Port-Lenses",
        name: "串口透镜 (SPL)",
        desc: "串联在 UART 通信线路上的串口数据窃听/调试工具，含 STM32 硬件、Python 上位机及 3D 打印外壳。",
        tags: ["C", "STM32", "Python", "Pygame", "3D Printing"],
        github: "https://github.com/Fantastair/Serial-Port-Lenses",
        hasRelease: false,
    },
    {
        slug: "EICS",
        name: "电磁轨道检测装置 (EICS)",
        desc: "通过三路感应线圈传感器测量电磁轨道信号，牛顿-拉夫森法实时解算偏转角/偏移距离/高度并可视化。",
        tags: ["C", "STM32", "Python", "Pygame", "fantas UI"],
        github: "https://github.com/Fantastair/EICS",
        hasRelease: false,
    },
    {
        slug: "Library-Management-System",
        name: "图书管理系统",
        desc: "面向图书馆/学校的图书借阅管理系统，三层架构，支持管理员管理图书/读者及读者端自助借还。",
        tags: ["C#", ".NET", "WinForms", "SQL Server"],
        github: "https://github.com/Fantastair/Library-Management-System",
        hasRelease: false,
    },
    {
        slug: "Automated-Warehouse-Simulation",
        name: "智能仓储穿梭车仿真",
        desc: "模拟环形轨道上多辆穿梭车执行仓储出入库任务，纳秒级/毫米级物理仿真精度，0.5×–32× 可调速。",
        tags: ["C++", "SDL3", "CMake"],
        github: "https://github.com/Fantastair/Automated-Warehouse-Simulation",
        hasRelease: false,
    },
    {
        slug: "vingt-et-un-Game",
        name: "vingt-et-un (21点)",
        desc: "经典 21 点纸牌游戏的 C++/SDL3 桌面图形化实现，支持 1–7 名玩家同台对局及 AI 庄家难度分级。",
        tags: ["C++", "SDL3", "CMake"],
        github: "https://github.com/Fantastair/vingt-et-un-Game",
        hasRelease: false,
    },
    {
        slug: "Age-friendly",
        name: "适老网途，净信护航",
        desc: "模拟手机操作系统适老化改造效果，演示老年人模式下的安全防护功能，含诈骗场景模拟。",
        tags: ["Python", "Pygame", "fantas UI"],
        github: "https://github.com/Fantastair/Age-friendly",
        hasRelease: false,
    },
];

// ===== SVG Icons =====
const githubSvg = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>`;
const releaseSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;

// ===== Render =====
const grid = document.getElementById("projects-grid");

projects.forEach((p) => {
    const card = document.createElement("div");
    card.className = "project-card";

    // Image
    const imgWrap = document.createElement("div");
    imgWrap.className = "project-image-wrap";
    const img = document.createElement("img");
    img.src = `assets/images/projects/${p.slug}.webp`;
    img.alt = p.name;
    img.loading = "lazy";
    img.classList.add("not-loaded");
    img.onload = () => img.classList.remove("not-loaded");
    img.onerror = () => {
        img.style.display = "none";
    };
    imgWrap.appendChild(img);

    // Body
    const body = document.createElement("div");
    body.className = "project-body";

    const name = document.createElement("h3");
    name.className = "project-name";
    name.textContent = p.name;

    const desc = document.createElement("p");
    desc.className = "project-desc";
    desc.textContent = p.desc;

    // Tags
    const tags = document.createElement("div");
    tags.className = "project-tags";
    p.tags.forEach((t) => {
        const tag = document.createElement("span");
        tag.className = "project-tag";
        tag.textContent = t;
        tags.appendChild(tag);
    });

    // Links
    const links = document.createElement("div");
    links.className = "project-links";

    const ghLink = document.createElement("a");
    ghLink.className = "project-link";
    ghLink.href = p.github;
    ghLink.target = "_blank";
    ghLink.rel = "noopener noreferrer";
    const ghLabel = p.github2 ? "上位机" : "仓库";
    ghLink.innerHTML = `${githubSvg} ${ghLabel}`;
    links.appendChild(ghLink);

    if (p.github2) {
        const gh2Link = document.createElement("a");
        gh2Link.className = "project-link";
        gh2Link.href = p.github2;
        gh2Link.target = "_blank";
        gh2Link.rel = "noopener noreferrer";
        gh2Link.innerHTML = `${githubSvg} ${p.github2Label || "仓库"}`;
        links.appendChild(gh2Link);
    }

    if (p.hasRelease) {
        const relLink = document.createElement("a");
        relLink.className = "project-link";
        relLink.href = p.release;
        relLink.target = "_blank";
        relLink.rel = "noopener noreferrer";
        relLink.innerHTML = `${releaseSvg} 下载`;
        links.appendChild(relLink);
    }

    body.appendChild(name);
    body.appendChild(desc);
    body.appendChild(tags);
    body.appendChild(links);
    card.appendChild(imgWrap);
    card.appendChild(body);
    grid.appendChild(card);
});

// ===== Particle Network Background =====
(function () {
    const landing = document.getElementById("landing");
    const canvas = document.getElementById("landing-bg");
    if (!landing || !canvas) return;

    const ctx = canvas.getContext("2d");
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 35 : 70;
    const CONNECT_DIST = 150;
    const MOUSE_RADIUS = 130;
    const MAX_SPEED = 0.8;
    const ACCENT = "88, 166, 255";

    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    const RESIZE_DEBOUNCE = 250;

    let resizeTimer = null;
    let w = 0, h = 0;

    function resize() {
        const rect = landing.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        canvas.width = w * devicePixelRatio;
        canvas.height = h * devicePixelRatio;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function wrapOutOfBounds() {
        for (const p of particles) {
            if (p.x < -20) p.x = w + 20;
            if (p.x > w + 20) p.x = -20;
            if (p.y < -20) p.y = h + 20;
            if (p.y > h + 20) p.y = -20;
        }
    }

    function onResize() {
        resize();
        wrapOutOfBounds();
    }

    function createParticles() {
        const rect = landing.getBoundingClientRect();
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * rect.width,
                y: Math.random() * rect.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                r: Math.random() * 1.2 + 1.2,
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);

        // Update & draw connections
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Drift
            p.vx += (Math.random() - 0.5) * 0.03;
            p.vy += (Math.random() - 0.5) * 0.03;
            p.vx *= 0.998;
            p.vy *= 0.998;

            // Mouse attraction
            const mdx = mouse.x - p.x;
            const mdy = mouse.y - p.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < MOUSE_RADIUS && mdist > 0) {
                const force = ((MOUSE_RADIUS - mdist) / MOUSE_RADIUS) * 0.04;
                p.vx += (mdx / mdist) * force;
                p.vy += (mdy / mdist) * force;
            }

            // Clamp speed
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > MAX_SPEED) {
                p.vx = (p.vx / speed) * MAX_SPEED;
                p.vy = (p.vy / speed) * MAX_SPEED;
            }

            p.x += p.vx;
            p.y += p.vy;

            // Wrap
            if (p.x < -20) p.x = w + 20;
            if (p.x > w + 20) p.x = -20;
            if (p.y < -20) p.y = h + 20;
            if (p.y > h + 20) p.y = -20;

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    const alpha = (1 - dist / CONNECT_DIST) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = "rgba(" + ACCENT + "," + alpha.toFixed(3) + ")";
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Draw particles
        for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(" + ACCENT + ", 0.45)";
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();

    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(onResize, RESIZE_DEBOUNCE);
    });

    landing.addEventListener("mousemove", function (e) {
        const rect = landing.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    landing.addEventListener("mouseleave", function () {
        mouse.x = -1000;
        mouse.y = -1000;
    });
})();
