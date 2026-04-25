# Astro Rio

Personal portfolio and bilingual blog for Rio Bahtiar. The app is built with Astro 6, React 19 islands, Tailwind CSS 4, DaisyUI 5, MDX/Markdoc content, and Cloudflare Workers SSR.

## Stack

- Runtime/package manager: Bun 1.3.11, committed `bun.lock`
- Framework: Astro 6 with `output: "server"`
- Deployment: Cloudflare Workers via `@astrojs/cloudflare` 13 and `wrangler.jsonc`
- UI: Astro components, React 19 islands, Radix primitives, shadcn-style components
- Styling: Tailwind CSS 4 Vite plugin, DaisyUI 5, shared CSS variables in `src/assets/global.css`
- Content: Astro content collections in `src/content.config.ts` using `glob()` loaders
- Media: local static assets served via Cloudflare assets and Astro image service (passthrough at runtime)
- i18n: Astro i18n config with English default routes and Indonesian `/id/*` routes

Check [package.json](./package.json) for exact dependency versions.

## Quick Start

Prerequisites:

- Bun 1.3.11 or newer
- Node.js 22.x or newer for tooling compatibility
- Cloudflare account for deploys

```bash
bun install
bun run dev
```

Open `http://localhost:4321`.

## Commands

| Command                        | Description                       |
| ------------------------------ | --------------------------------- |
| `bun run dev`                  | Start the Astro dev server        |
| `bun run typecheck`            | Run `astro check`                 |
| `bun run format`               | Format with Prettier              |
| `bun run format:check`         | Check formatting                  |
| `bun audit --audit-level high` | Check dependency advisories       |
| `bun run build`                | Build the site for production     |
| `bun run build`    | Alias of `bun run build`          |
| `bun run preview`              | Preview the built site locally    |
| `bun run deploy`               | Build and deploy with Wrangler    |
| `bun run cf-typegen`           | Generate Cloudflare binding types |

## Project Structure

```text
.
├── src/
│   ├── assets/              # Global CSS and source assets
│   ├── components/          # Astro and React components
│   ├── content/             # Blog MDX files only
│   │   ├── blog-en/
│   │   └── blog-id/
│   ├── content.config.ts    # Content collections and schemas
│   ├── i18n/                # English/Indonesian copy
│   ├── layouts/             # Shared page/blog layouts
│   ├── lib/                 # Shared library utilities
│   ├── pages/               # File-based routes
│   ├── styles/              # Theme helpers
│   └── utils/               # Date, reading-time, related-post helpers
├── public/                  # Static files served as-is
├── astro.config.mjs         # Astro, Vite, integrations, adapter
├── wrangler.jsonc           # Cloudflare Worker config
├── bun.lock                 # Reproducible Bun lockfile
├── CLAUDE.md                # AI/developer operating guide
└── AGENTS.md                # Symlink to CLAUDE.md
```

## Content

Blog posts live in locale-specific collections:

- English: `src/content/blog-en/<category>/<slug>.mdx`
- Indonesian: `src/content/blog-id/<category>/<slug>.mdx`

Required frontmatter:

```yaml
---
title: "Post title"
description: "SEO description"
created_at: 2026-04-25
modified_at: 2026-04-25
category: "web-development"
tags: ["astro", "cloudflare"]
author:
  name: "Rio Bahtiar"
  image: "/authors/rio-bahtiar.jpg"
  bio: "Full-stack developer"
draft: false
---
```

Astro 6 content entries use `entry.id`; do not rely on legacy `entry.slug`. Render entries with `render(entry)` from `astro:content`.

See [BLOG.md](./BLOG.md) for writing guidance and [ASSETS.md](./ASSETS.md) for image conventions.

## Deployment

Cloudflare configuration is in [wrangler.jsonc](./wrangler.jsonc), not `wrangler.toml`.

```bash
bun run build
bunx wrangler deploy
```

The current Worker target is `https://web.riomyid.workers.dev`.

See [DEPLOYMENT.md](./DEPLOYMENT.md) and [.github/CICD_SETUP.md](./.github/CICD_SETUP.md) for full setup.

## AI Tooling

Read [CLAUDE.md](./CLAUDE.md) before making changes. `AGENTS.md` points to the same file so Codex-style agents and Claude-style agents use identical project guidance.

Core rules for agents:

- Keep Bun as the package manager and preserve `bun.lock`.
- Use SSR route patterns; do not add `getStaticPaths()` to dynamic blog routes.
- Keep content collection definitions in `src/content.config.ts`.
- Validate with `bun run typecheck` and `bun run build` unless production upload parity is required.
- Update docs whenever package manager, deployment config, content schema, routes, or image workflow changes.

## References Checked

- Astro content loader docs: https://docs.astro.build/en/reference/content-loader-reference/
- Astro 6 upgrade docs: https://docs.astro.build/en/guides/upgrade-to/v6/
- Astro Cloudflare adapter docs: https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- Cloudflare Wrangler config docs: https://developers.cloudflare.com/workers/wrangler/configuration/
- Bun lockfile docs: https://bun.sh/docs/pm/lockfile
