console.log("泥嚎 🚀");

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
    console.log("系统主题已切换为：", e.matches ? "深色" : "浅色");
});

const hero = document.getElementById('hero');
const heroBg = document.getElementById('hero-bg');
const heroIconWrapper = document.getElementById('hero-icon-wrapper');
const heroTitle = document.getElementById('hero-title');
const content = document.getElementById('content');
const topNav = document.getElementById('top-nav');

const finalHeight = 60;
const finalTitleTop = finalHeight / 2;
const finalTitleLeft = finalHeight / 4;

let navLocked = false;
let navShowed = false;

function showNav() {
    if (navShowed) return;
    navShowed = true;
    topNav.classList.add('show');
}

function hideNav() {
    if (!navShowed) return;
    navShowed = false;
    topNav.classList.remove('show');
}

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

    if (ratio < 0.2) {
        hideNav();
    } else {
        showNav();
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

document.getElementById('home-link').addEventListener('click', function(e) {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 二维码弹出层处理
const modal = document.getElementById("qr-modal");
const modalImg = document.getElementById("qr-image");
const captionText = document.getElementById("caption");

// QQ
document.getElementById("show-qq-qr").onclick = function() {
  modal.style.display = "block";
  modalImg.src = "/assets/images/qq_card.jpg";
}

// 微信
document.getElementById("show-wechat-qr").onclick = function() {
  modal.style.display = "block";
  modalImg.src = "/assets/images/wx_card.jpg";
}

// 获取 <span> 元素，设置关闭按钮
const span = document.getElementsByClassName("close-btn")[0];

// 点击 <span> (x), 关闭模态框
span.onclick = function() { 
  modal.style.display = "none";
}

// 点击模态框外部, 关闭模态框
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
