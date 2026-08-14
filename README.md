# Raminda Kariyawasam — Full-Stack Software Engineer

An evidence-led portfolio for AI-enabled university platforms, optimization systems, secure enterprise applications, and production infrastructure.

Live site: [www.ramindak.com](https://www.ramindak.com/)

## Performance architecture

The site remains a static GitHub Pages deployment. Next.js was evaluated, but GitHub Pages cannot run request-time SSR or other Node.js server features; Next.js would have to use `output: "export"`. For this single-page portfolio, a production React bundle gives the useful performance benefits without adding a framework layer that cannot provide SSR on the selected host.

The production build now:

- bundles and minifies React, JSX, and application code with esbuild;
- uses React's production runtime instead of Babel and development UMD builds in the browser;
- removes unused Three.js and prevents Spline from loading on the home page;
- self-hosts the five portfolio fonts with `font-display: swap`;
- delays Google Tag Manager, Google Analytics, and Microsoft Clarity until after initial load;
- uses one pointer listener plus per-drag pointer capture instead of dozens of global drag listeners;
- stops animation loops while idle or hidden and uses native Web Animations for scroll effects;
- extracts and hashes CSS/JavaScript for browser caching;
- publishes the same optimized static files through both `dist/` and the repository root.

A controlled cold-load comparison (1.6 Mbps, 150 ms latency, 4× CPU slowdown) reduced the initial transfer from about 2.35 MB/32 requests to about 365 KB/10 requests. The browser `load` measurement fell from about 13.1 seconds on the old live build to about 1.34 seconds for the optimized build. See [the performance note](docs/PERFORMANCE.md) for scope and methodology.

## Stack

- React 18 with production bundling
- Vanilla CSS and native Web Animations
- esbuild
- Node test runner, Playwright, and axe-core
- Branch-based GitHub Pages

The anniversary invitation under `/srimantha_and_geethanjali_anniversary/` is built into the same deployment with its optimized responsive images, self-hosted fonts, and bundled React application.

## Local development

Requirements: Node.js 22+ and npm.

```bash
npm ci
npm start
```

`npm start` builds the production artifact, synchronizes the browser-ready entry files to the repository root, and serves `dist/` locally. The editable HTML templates live under `src/`; root `index.html` and `404.html` are generated files.

Useful commands:

```bash
npm run build       # create dist/ and synchronize the GitHub Pages root
npm run preview     # serve an existing dist/
npm run lint        # validate JavaScript and invitation sources
npm run test:unit   # data and invitation unit tests
npm run test:build  # production bundle and artifact budgets
npm run test:e2e    # browser, accessibility, and responsive tests
npm test            # complete build and test sequence
```

## GitHub Pages deployment

There is no custom CI/CD workflow and no Vercel deployment. GitHub Pages publishes the committed production files directly from `main`.

Configure the repository once under **Settings → Pages → Build and deployment**:

- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/(root)`

Before pushing a source change, run `npm run build` and commit the generated root `index.html`, `404.html`, `.nojekyll`, `assets/portfolio-*`, and `assets/fonts/` changes together with the source changes. A normal push to `main` then triggers GitHub's built-in `pages build and deployment` process. No custom Actions runner or GitHub App token is used by this repository.

## Main project structure

```text
src/                     React runtime and editable HTML templates
index.html, 404.html     generated production entry files published by Pages
assets/portfolio-*       generated production JavaScript and CSS
scripts/build-site.mjs   builds dist/ and synchronizes the published root
tests/                   unit, build-contract, accessibility, and E2E tests
srimantha_and_geethanjali_anniversary/
                          invitation source and optimized media
dist/                    generated deployment artifact (gitignored)
```

## Contact

- GitHub: [KADRDulmin](https://github.com/KADRDulmin)
- LinkedIn: [raminda-dulmin](https://linkedin.com/in/raminda-dulmin/)
- Email: [raminda5575@gmail.com](mailto:raminda5575@gmail.com)
