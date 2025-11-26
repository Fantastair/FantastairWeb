{
    // 加载页码组件
    const responsePromise = fetch('./src/components/column/column_pager.html');
    const columnPager = document.querySelector('column-pager');
    const response = await responsePromise;
    const html = await response.text();
    columnPager.innerHTML = html;
}

const elements = {
    columnPagerFirst: document.getElementById('column-pager-first'),
    columnPagerPrev: document.getElementById('column-pager-prev'),
    columnPagerNext: document.getElementById('column-pager-next'),
    columnPagerLast: document.getElementById('column-pager-last'),
    columnPagerJumpInput: document.getElementById('column-pager-jump-input'),
    columnPagerJumpButton: document.getElementById('column-pager-jump-button'),
}

const pagerNumbers = Object.values({
    number1: document.getElementById('column-pager-number1'),
    number2: document.getElementById('column-pager-number2'),
    number3: document.getElementById('column-pager-number3'),
    number4: document.getElementById('column-pager-number4'),
    number5: document.getElementById('column-pager-number5'),
    number6: document.getElementById('column-pager-number6'),
    number7: document.getElementById('column-pager-number7'),
});
const pagerEllipsis1 = document.getElementById('column-pager-ellipsis1');
const pagerEllipsis2 = document.getElementById('column-pager-ellipsis2');
const columnContent = document.getElementById('column-content');

let articles_content;
{
    const response = await fetch('./dynamic/articles/content.json')
    articles_content = await response.json();
}

/**
 * 动态加载 CSS
 * @param {string} url
 */
function loadCSS(url) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`CSS load failed: ${url}`));
        document.head.appendChild(link);
    });
}

const cardDict = {};
/**
 * 加载文章卡片
 * @param {number} start 
 * @param {number} end 
*/
async function loadArticlesCard(start, end) {
    columnContent.innerHTML = '';
    for (let i = start; i <= end && i < articles_content.count; i++) {
        if (cardDict[articles_content.articles[i].id]) {
            columnContent.appendChild(cardDict[articles_content.articles[i].id]);
            continue;
        }
        if (articles_content.articles[i].entryHtml === 'default') {
            const response = await fetch(`./dynamic/articles/default.html`);
            const html = await response.text();
            let customizedHtml = html.replace('<span class="column-card-title"></span>', `<span class="column-card-title">${articles_content.articles[i].title}</span>`);
            customizedHtml = customizedHtml.replace('<span class="column-card-subtitle"></span>', `<span class="column-card-subtitle">${articles_content.articles[i].subtitle}</span>`);
            const node = document.createRange().createContextualFragment(customizedHtml).firstChild;
            columnContent.appendChild(node);
            cardDict[articles_content.articles[i].id] = node;
        } else {
            const response = await fetch(`./dynamic/articles/${articles_content.articles[i].id}/card.html`);
            const html = await response.text();
            const node = document.createRange().createContextualFragment(html).firstChild;
            columnContent.appendChild(node);
            cardDict[articles_content.articles[i].id] = node;
        }
        if (articles_content.articles[i].entryCss) {
            loadCSS(`./dynamic/articles/${articles_content.articles[i].id}/card.css`);
        }
        if (articles_content.articles[i].entryJs) {
            import(`../../../dynamic/articles/${articles_content.articles[i].id}/card.js`);
        }
    }
}

let currentNumberIndex = 0;    // 当前页码索引
const maxPageNumber = Math.ceil(articles_content.count / articles_content.pageCount);       // 最大页码数
pagerNumbers[pagerNumbers.length - 1].innerText = maxPageNumber.toString();

// 监听点击事件
pagerNumbers.forEach((element) => {
    element.addEventListener('click', () => {
        if (!element.classList.contains('current')) {
            updatePager(parseInt(element.innerText));
        }
    });
});

// 监听首页点击
elements.columnPagerFirst.addEventListener('click', () => {
    updatePager(1);
});

// 监听下一页点击
elements.columnPagerPrev.addEventListener('click', () => {
    if (parseInt(pagerNumbers[currentNumberIndex].innerText) > 1) {
        updatePager(parseInt(pagerNumbers[currentNumberIndex].innerText) - 1);
    }
});

// 监听上一页点击
elements.columnPagerNext.addEventListener('click', () => {
    if (parseInt(pagerNumbers[currentNumberIndex].innerText) < maxPageNumber) {
        updatePager(parseInt(pagerNumbers[currentNumberIndex].innerText) + 1);
    }
});

// 监听尾页点击
elements.columnPagerLast.addEventListener('click', () => {
    updatePager(maxPageNumber);
});

// 监听跳转按钮点击
elements.columnPagerJumpButton.addEventListener('click', () => {
    const jumpPageNumber = Number(elements.columnPagerJumpInput.value);
    if (isNaN(jumpPageNumber) || jumpPageNumber < 1 || jumpPageNumber > maxPageNumber || !Number.isInteger(jumpPageNumber)) {
        elements.columnPagerJumpInput.style.animation = 'jump_error 0.3s ease';
        setTimeout(() => {
            elements.columnPagerJumpInput.style.animation = '';
        }, 300);
        return;
    }
    if (jumpPageNumber !== parseInt(pagerNumbers[currentNumberIndex].innerText)) {
        updatePager(jumpPageNumber);
        elements.columnPagerJumpInput.style.animation = 'jump_success 0.5s ease';
        setTimeout(() => {
            elements.columnPagerJumpInput.style.animation = '';
        }, 500);
    }
});

// 监听Enter跳转
elements.columnPagerJumpInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        elements.columnPagerJumpButton.click();
    }
});

if (maxPageNumber <= 7) {
    setPagerDisplay(0, maxPageNumber - 1, false, false);
}

/**
 * 更新页码显示
 * @param {number} pageNumber - 要更新到的页码
 */
function updatePager(pageNumber) {
    loadArticlesCard((pageNumber - 1) * articles_content.pageCount, pageNumber * articles_content.pageCount - 1);
    if (maxPageNumber <= 7) {
        if (currentNumberIndex != pageNumber - 1) {
            pagerNumbers[currentNumberIndex].classList.remove('current');
            pagerNumbers[pageNumber - 1].classList.add('current');
            currentNumberIndex = pageNumber - 1;
        }
    }
    else {
        if (1 <= pageNumber && pageNumber <= 4) {
            setPagerDisplay(1, 6, false, true);
            setPagerNumber(3);
            if (currentNumberIndex != pageNumber) {
                pagerNumbers[currentNumberIndex].classList.remove('current');
                pagerNumbers[pageNumber].classList.add('current');
                currentNumberIndex = pageNumber;
            }
        }
        else if (maxPageNumber - 3 <= pageNumber && pageNumber <= maxPageNumber) {
            setPagerDisplay(0, 5, true, false);
            setPagerNumber(maxPageNumber - 2);
            const adjustedIndex = pageNumber - (maxPageNumber - 5);
            if (currentNumberIndex != adjustedIndex) {
                pagerNumbers[currentNumberIndex].classList.remove('current');
                pagerNumbers[adjustedIndex].classList.add('current');
                currentNumberIndex = adjustedIndex;
            }
        }
        else {
            setPagerDisplay(0, 6, true, true);
            setPagerNumber(pageNumber);
            if (currentNumberIndex != 3) {
                pagerNumbers[currentNumberIndex].classList.remove('current');
                pagerNumbers[3].classList.add('current');
                currentNumberIndex = 3;
            }
        }
    }
}

/**
 * 设置页码的显示与否
 * @param {number} start - 开始页码索引，0或1
 * @param {number} end - 结束页码索引，5或6
 * @param {boolean} e1 - 是否显示省略号1
 * @param {boolean} e2 - 是否显示省略号2
 */
function setPagerDisplay(start, end, e1, e2) {
    // 更新页码元素
    pagerNumbers.forEach((element, index) => {
        element.style.display = (index >= start && index <= end) ? '' : 'none';
    });
    // 省略号显示/隐藏
    pagerEllipsis1.style.display = e1 ? '' : 'none';
    pagerEllipsis2.style.display = e2 ? '' : 'none';
}

/**
 * 设置显示的页码数字
 * @param {number} centerNumber - 中心数字
 */
function setPagerNumber(centerNumber) {
    pagerNumbers[1].innerText = (centerNumber - 2).toString();
    pagerNumbers[2].innerText = (centerNumber - 1).toString();
    pagerNumbers[3].innerText = centerNumber.toString();
    pagerNumbers[4].innerText = (centerNumber + 1).toString();
    pagerNumbers[5].innerText = (centerNumber + 2).toString();
}

updatePager(1);
