# beluca.me

Personal site and portfolio of **John Beluca** — Senior Solutions Architect focused on AI/LLM systems and AWS cloud architecture. Production source for [https://beluca.me](https://beluca.me).

The site is a single-page experience (hero, background, writing, projects, capabilities, experience, contact) plus a writing section with long-form posts in MDX and an interactive chat agent that answers questions about John's work.

## Stack

- **[Astro 5](https://astro.build)** — static-first with selective on-demand rendering. Most pages prerender at build time; only `/api/agent` opts into SSR (`export const prerender = false`).
- **[React 19](https://react.dev)** — used for the interactive `Chat` island (`src/components/Chat.tsx`). The rest of the UI is `.astro`.
- **MDX** via `@astrojs/mdx` — long-form posts under `src/content/blog/*.mdx`, typed through Astro's content collections (`src/content/config.ts`).
- **TypeScript** — strict, project-wide.
- **[Satori](https://github.com/vercel/satori)** + **[@resvg/resvg-js](https://github.com/yisibl/resvg-js)** — dynamic Open Graph image generation at `/og.png` (`src/pages/og.png.ts`, `src/lib/og.tsx`).
- **[@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** — auto-generated sitemap.
- **[@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/)** — standalone Node adapter for the on-demand agent endpoint.
- **Geist** + **Geist Mono** (Google Fonts) — typography.

## Project layout

```
src/
  components/    UI (Hero, Projects, Experience, Chat island, …)
  content/blog/  MDX writing
  data/          Static profile data (single source of truth for bio/projects)
  layouts/       BaseLayout with SEO + OG metadata
  lib/           OG image template
  pages/
    index.astro       Single-page portfolio
    writing/          Blog index + dynamic [...slug] route
    api/agent.ts      POST /api/agent — chat backend (SSR)
    og.png.ts         Dynamic OG image
  styles/        Global CSS
public/          Static assets (favicon, avatar, robots.txt)
```

All bio, experience, projects, and skills data lives in `src/data/profile.ts` — edit there to update the site.

## Chat agent

`POST /api/agent` accepts `{ "question": string }` and returns `{ "answer": string }`. The current implementation uses keyword-routed canned answers backed by the `profile` data so the chat works end-to-end without an API key. The endpoint is wired to be swapped for an Anthropic Messages API call (see the `TODO` block in `src/pages/api/agent.ts`); when that lands, set `ANTHROPIC_API_KEY` and add per-IP rate limiting.

## Scripts

```bash
npm install
npm run dev       # astro dev — http://localhost:4321
npm run build     # production build to ./dist (static + SSR entry)
npm run preview   # serve the built site locally
```

Node 20+ recommended (Astro 5 / `@astrojs/node` 9 baseline).

## Deployment

The build produces a hybrid output: prerendered HTML for the portfolio and writing, plus a Node entry that serves `/api/agent`. Any Node-compatible host works — set the start command to run the standalone server emitted under `dist/server/`.
