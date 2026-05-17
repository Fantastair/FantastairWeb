# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Fantastair's personal portfolio website ([fantastair.cn](https://fantastair.cn)) — a static single-page site with no build step. Vanilla HTML/CSS/JS using an ES module for project data.

## Development

```bash
python -m http.server 8000     # or npx serve .
```

Open `http://localhost:8000` or open `index.html` directly in a browser.

## Architecture

```
index.html                     # Single page: hero, project grid, footer
src/styles/main.css            # All styles with responsive breakpoints
src/scripts/projects.js        # Project data array + DOM rendering (ES module)
assets/images/icon.webp        # Site avatar / favicon
assets/images/projects/*.webp  # Project screenshots (user-managed)
projects/*.md                  # Detailed project writeups (reference, not rendered)
```

- **`index.html`** — static hero, empty `<div id="projects-grid">`, footer. All project cards are injected at page load by `projects.js`.
- **`projects.js`** — contains an array of 13 project objects (`slug`, `name`, `desc`, `tags`, `github`, `release`, `hasRelease`) and a render loop that creates DOM elements. Add or edit projects in this file.
- **CSS** — CSS custom properties for the dark color scheme. Grid layout: 3 columns (≥900px) → 2 columns (600–900px) → 1 column (<600px). Project cards have a 16:9 image area at the top. Images use lazy loading with a placeholder gradient background; if an image fails to load it's hidden and the placeholder shows through.
- **Project images** — place screenshots at `assets/images/projects/<slug>.webp`. The `<slug>` field in `projects.js` determines the filename. Cards gracefully degrade if the image is missing.

## Deployment

Push to `master` → GitHub Actions (`.github/workflows/deploy.yml`) minifies HTML/CSS/JS/JSON, subsets fonts, runs zopfli, then rsyncs to VPS.

Push to `deploy-test` → skips minification, raw rsync for server-side testing.

Secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_TARGET_DIR`.
