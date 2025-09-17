console.log("泥嚎 🚀");

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
    console.log("系统主题已切换为：", e.matches ? "深色" : "浅色");
});

const hero = document.getElementById('hero');
const heroBg = document.getElementById('hero-bg');
const heroIconWrapper = document.getElementById('hero-icon-wrapper');
const heroTitle = document.getElementById('hero-title');
const content = document.getElementById('content');

const finalHeight = 60;
const finalTitleTop = finalHeight / 2;
const finalTitleLeft = finalHeight / 4;

let navLocked = false;

function updateHeroWhileScrolling() {
    const scrollY = window.scrollY;
    const rawRatio = scrollY / (window.innerHeight - finalHeight);
    const ratio = Math.min(rawRatio, 1);

    if (navLocked && ratio < 1) {
        navLocked = false;
    }
    if (navLocked) return;
    if (!navLocked && ratio === 1) {
        navLocked = true;
    }

    hero.style.height = `${(1 - ratio) * (window.innerHeight - finalHeight) + finalHeight}px`;
    heroBg.style.filter = `blur(${ratio * 5}px)`;
    heroBg.style.transform = `scale(${1 + ratio * 0.2})`;

    const min = 2.5;
    const ideal = 16 - ratio * 11.2;
    const max = 8;
    heroTitle.style.fontSize = `clamp(${min}rem, ${ideal}vmin, ${max}rem)`;

    heroIconWrapper.style.top = `${-40 * ratio + (1 - ratio) * 40}vh`;

    heroTitle.style.left = `${finalTitleLeft * ratio ** 2 + window.innerWidth * (1 - ratio ** 2) / 2}px`;
    heroTitle.style.top = `${finalTitleTop * ratio + window.innerHeight * (1 - ratio) * 0.55}px`;
    heroTitle.style.transform = `translate(-${50 * (1 - ratio ** 2)}%, -50%)`;
}

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateHeroWhileScrolling();
            ticking = false;
        });
        ticking = true;
    }
});
