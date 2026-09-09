# AGENTS.md

Guidance for AI assistants working on [wllnr.nl](https://www.wllnr.nl).

## Project

Personal static site for Jeroen Wellner. Eleventy builds Markdown + Nunjucks into `build/`. CSS (Sass) and JS (Rollup) are compiled in `eleventy.config.js` and **inlined** into HTML in production.

Deploy: tag `v*` → GitHub Actions builds a Docker/nginx image → Flux on `beast` rolls it out. Image: `ghcr.io/jwellner/website/website:<tag>`.

## Commands

```bash
yarn install
yarn start          # http://localhost:3000
yarn build          # output → build/
```

Node `>=18`. Package manager is **yarn** (keep `yarn.lock` in sync; Docker uses `yarn install --frozen-lockfile`).

## Layout

| Path | Role |
|------|------|
| `src/content/` | Pages (Markdown + front matter). Home uses `layout: home.njk`. |
| `src/content/_data/site.json` | Site-wide metadata (`site.*` in templates). |
| `layouts/` | Nunjucks layouts (`layout.njk`, `home.njk`, `page.njk`). |
| `src/js/` | Terminal UI. Entry: `main.js` → Rollup bundle. |
| `src/scss/` | Styles. Entry: `index.scss`. |
| `public/assets/` | Static assets (passthrough). |
| `eleventy.config.js` | Build: Sass, Rollup, inline CSS/JS, HTML minify. |
| `Dockerfile` / `docker/default.conf` | nginx image serving `build/`. |

## Conventions

- Prefer small, focused changes. Match existing style (4-space JS, 2-space SCSS/JSON).
- Terminal commands live in `src/js/modules/commands.js`; help text in `help.js`. Keep them in sync.
- User-controlled strings rendered via `terminal.output()` must go through `escapeHtml()` (`src/js/modules/escapeHtml.js`). Trusted static HTML (links, `<u>`, resume markup) is fine as raw HTML.
- Do not reintroduce document-level click/keyup handlers that steal focus; listeners stay on the terminal element.
- Site copy/SEO: update `site.json` and page front matter rather than hardcoding in layouts when possible.
- Home page body comes from `src/content/index.md` via `{{ content | safe }}` in `home.njk`.

## Out of scope unless asked

- Force-push / rewriting deploy tags
- Adding a JS framework or replacing Eleventy
- Expanding the fake filesystem into a real CMS
