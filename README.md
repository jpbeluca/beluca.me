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
- **[@astrojs/cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)** — Workers adapter for the on-demand agent endpoint.
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
npm run preview   # build, then serve on the real Workers runtime via wrangler dev
npm run deploy    # build + wrangler deploy
```

Node 20+ recommended (Astro 5 baseline).

## Deployment

Cloudflare Workers (`beluca-me`), configured in `wrangler.jsonc`. The build produces a hybrid output: prerendered HTML served by Workers Static Assets, plus `dist/_worker.js` handling `/api/agent` on demand.

Deploy with `npm run deploy`.

Secrets are **not** in `wrangler.jsonc` — set them once per Worker and they survive every deploy:

```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put SLACK_WEBHOOK_URL
```

Avoid adding them as plain-text *Variables* in the dashboard: `wrangler deploy` replaces the Worker's vars with whatever the config declares, so dashboard-added ones disappear on the next deploy. At runtime both are read from `locals.runtime.env` (`import.meta.env` is frozen at build time and cannot see them).
