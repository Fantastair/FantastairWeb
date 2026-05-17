# Fantastair

个人作品集网站 — [fantastair.cn](https://fantastair.cn)

纯静态单页面，无构建步骤。HTML/CSS/JS 原生开发，项目数据通过 ES module 注入。

## 本地开发

```bash
python -m http.server 8000
# 或
npx serve .
```

浏览器打开 `http://localhost:8000`，或直接打开 `index.html`。

## 项目结构

```
index.html                     # 单页面：Hero、项目卡片、页脚
robots.txt                     # 搜索引擎爬取指引
sitemap.xml                    # 站点地图
src/styles/main.css            # 样式与响应式断点
src/scripts/projects.js        # 项目数据与 DOM 渲染（ES module）
assets/images/icon.webp        # 网站头像 / favicon
assets/images/projects/*.webp  # 项目截图
projects/*.md                  # 项目详情（参考用，不参与渲染）
.github/workflows/deploy.yml   # 自动部署 CI
```

## 部署

推送至 `master` 分支 → GitHub Actions 自动压缩并同步至 VPS（增量传输，仅同步变更文件）。

## License

[MIT](LICENSE)
