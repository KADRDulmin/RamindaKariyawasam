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
- publishes only the required static files through a compact `dist/` artifact.

A controlled cold-load comparison (1.6 Mbps, 150 ms latency, 4× CPU slowdown) reduced the initial transfer from about 2.35 MB/32 requests to about 365 KB/10 requests. The browser `load` measurement fell from about 13.1 seconds on the old live build to about 1.34 seconds for the optimized build. See [the performance note](docs/PERFORMANCE.md) for scope and methodology.

## Stack

- React 18 with production bundling
- Vanilla CSS and native Web Animations
- esbuild
- Node test runner, Playwright, and axe-core
- GitHub Actions and GitHub Pages

The anniversary invitation under `/srimantha_and_geethanjali_anniversary/` is built into the same deployment with its optimized responsive images, self-hosted fonts, and bundled React application.

## Local development

Requirements: Node.js 22+ and npm.

```bash
npm ci
npm start
```

`npm start` builds the same `dist/` artifact used in production and serves it locally. The source `index.html` is a build template; do not serve the repository root directly.

Useful commands:

```bash
npm run build       # create dist/
npm run preview     # serve an existing dist/
npm run lint        # validate JavaScript and invitation sources
npm run test:unit   # data and invitation unit tests
npm run test:build  # production bundle and artifact budgets
npm run test:e2e    # browser, accessibility, and responsive tests
npm test            # complete build and test sequence
```

## GitHub Pages deployment

The workflow at `.github/workflows/deploy-pages.yml` runs on pushes to `main` and can also be started manually. It uses only GitHub-hosted Actions and the standard GitHub Pages artifact/deployment actions.

In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The workflow installs the lockfile, validates the sources, creates `dist/`, runs unit/build-contract tests, uploads that directory, and deploys it to the `github-pages` environment.

## Main project structure

```text
src/                     portfolio React and browser runtime
scripts/build-site.mjs   complete production/static artifact builder
tests/                   unit, build-contract, accessibility, and E2E tests
srimantha_and_geethanjali_anniversary/
                          invitation source and optimized media
.github/workflows/       free GitHub Pages CI/CD
dist/                    generated deployment artifact (gitignored)
```

## Contact

- GitHub: [KADRDulmin](https://github.com/KADRDulmin)
- LinkedIn: [raminda-dulmin](https://linkedin.com/in/raminda-dulmin/)
- Email: [raminda5575@gmail.com](mailto:raminda5575@gmail.com)
