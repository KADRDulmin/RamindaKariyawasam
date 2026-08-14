# Performance and hosting decision

## Decision

Keep GitHub Pages and ship a compiled static React site.

GitHub Pages publishes static files. Next.js can target it through a static export, but server-dependent features—including request-time SSR, cookies, Server Actions, ISR, redirects/rewrites, and the default image optimizer—are unavailable in export mode. Because this portfolio has one data-static home page, migrating it to Next.js would not unlock the SSR benefit while it remains on GitHub Pages.

References:

- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Next.js static exports and unsupported server features](https://nextjs.org/docs/app/guides/static-exports)

## Root causes found

The previous home page downloaded React's development UMD builds, Babel Standalone, Anime.js, unused Three.js, and the Spline web component from third-party origins. Six JSX files were fetched and compiled in every visitor's browser. Five external font families and three analytics bootstraps also competed with first render.

At runtime, each draggable note installed its own global `pointermove` listener. With the project catalogue rendered, a single pointer event fanned out across dozens of handlers. The custom cursor also kept a `requestAnimationFrame` loop alive while the pointer was idle.

## Changes

- Production React/JSX bundle generated at build time.
- CSS and JS minified, content-hashed, and cacheable.
- Fonts copied from locked Fontsource packages and served from the same origin.
- Analytics delayed until 2.5 seconds after `load`, then scheduled during idle time.
- Spline loaded only on 404 pages, during idle time, and skipped for reduced-motion or data-saver users.
- Unused Three.js and browser Babel removed from production output.
- Per-card global drag listeners replaced with pointer capture on the active card.
- Cursor rendering is event-driven and stops once it reaches the pointer.
- Ink trails and section reveals use compositor-friendly CSS/native Web Animations.
- Off-screen project-card rendering uses `content-visibility: auto`.
- Photo rotation pauses in background tabs; subsequent portraits preload during idle time.
- The Pages artifact excludes raw anniversary source photographs and development sources.

## Measurement

Measured on 14 August 2026 with headless Chrome, disabled browser cache, 150 ms network latency, 1.6 Mbps download throughput, and 4× CPU slowdown. The “before” target was the then-current live GitHub Pages site; the “after” target was the locally served production `dist/` artifact under the same DevTools throttling. Local hosting omits public DNS/TLS/CDN variability, so the results are directional rather than a claimed field metric.

| Metric | Before | Optimized |
| --- | ---: | ---: |
| Browser `load` | 13.10 s | 1.34 s |
| Hero visible | 16.03 s | 1.93 s |
| Encoded transfer observed | 2,354 KB | 365 KB |
| Requests observed | 32 | 10 |
| Long tasks in measurement window | 16 | 1 |

Current build budgets are enforced in `tests/site-build.test.mjs`: portfolio JavaScript must stay below 350 KB uncompressed and CSS below 70 KB uncompressed. The current output is approximately 229 KB JavaScript and 26 KB CSS before HTTP compression.

## Deployment

`.github/workflows/deploy-pages.yml` builds and validates the project on `main`, uploads only `dist/`, and deploys with GitHub's official Pages actions. The source repository can remain a normal development project while GitHub Pages receives only static production files.
