# AI Development Guide for Astro Rio

This file is the canonical operating guide for AI assistants and developers. `AGENTS.md` should remain a symlink to this file so Claude, Codex, and other agent tooling read the same instructions.

## Project Snapshot

`astro-rio` is a production portfolio and bilingual blog.

- Astro 6 SSR app deployed to Cloudflare Workers
- Bun-first project with committed `bun.lock`
- React 19 islands for interactive UI
- Tailwind CSS 4 plus DaisyUI 5 and shadcn-style React components
- Astro content collections in `src/content.config.ts`
- MDX and Markdoc enabled
- Local image workflow served via Cloudflare assets and Astro's image service (passthrough at runtime)
- English default routes and Indonesian `/id/*` routes

## Required Context Before Editing

Before changing code, inspect the relevant files and current git state:

```bash
git status --short
rg --files
```

Do not overwrite user changes. If a file has unrelated dirty changes, work around them or ask before touching the conflicting section.

## Commands

Use Bun, not npm, for this repository.

```bash
bun install
bun run dev
bun run typecheck
bun run format
bun run format:check
bun audit --audit-level high
bun run build
bun run build
bun run preview
bun run deploy
bun run cf-typegen
```

Recommended fast validation while developing:

```bash
bun run typecheck
bun run build
```

Recommended production-parity validation:

```bash
bun audit --audit-level high
bun run build
```

## Package Management

- Keep `packageManager` aligned with the installed Bun version.
- Commit `bun.lock`; do not reintroduce `package-lock.json`.
- Use `bun add`, `bun remove`, and `bun install --frozen-lockfile` in CI.
- Avoid `npm ci`, `npm install`, and `npx` in project docs and workflows unless explicitly documenting an external one-off command.
- Bun does not run arbitrary dependency lifecycle scripts by default; add required native build packages to `trustedDependencies`.

## Architecture Rules

### Astro SSR

The app uses `output: "server"`. Dynamic routes should resolve content at request time.

```astro
---
import { getCollection, render } from "astro:content";

const { category, slug } = Astro.params;
const posts = await getCollection("blog-en");
const post = posts.find((entry) => {
  const entrySlug = entry.id.startsWith(`${entry.data.category}/`)
    ? entry.id.slice(entry.data.category.length + 1)
    : entry.id;

  return entry.data.category === category && entrySlug === slug;
});

if (!post) return Astro.redirect("/404");

const { Content, headings } = await render(post);
---
```

Do not add `getStaticPaths()` to SSR dynamic routes unless the route is intentionally changed to prerendered output and docs are updated.

### Astro 6 Content Collections

- Collection config belongs in `src/content.config.ts`.
- Use `glob()` from `astro/loaders`.
- Import `z` from `astro/zod`, not from `astro:content`.
- Use `entry.id` for route identity; legacy `entry.slug` is not the current API for loader-backed collections.
- Use `render(entry)` from `astro:content`; do not use `entry.render()`.
- `entry.body` may be undefined, so reading-time helpers should receive `entry.body ?? ""`.

### Cloudflare Workers

- Cloudflare config belongs in `wrangler.jsonc`.
- `main` should remain `@astrojs/cloudflare/entrypoints/server`.
- Keep `compatibility_flags: ["nodejs_compat_v2"]` while React 19 server rendering and current dependencies need Node compatibility.
- The Cloudflare adapter image mode is `imageService: { build: "compile", runtime: "passthrough" }`.
- Static assets are configured through the `assets` block in `wrangler.jsonc`.
- Use `bun run cf-typegen` after binding changes.

### React on Cloudflare

Keep the production Vite alias:

```js
resolve: {
  alias: import.meta.env.PROD
    ? { "react-dom/server": "react-dom/server.edge" }
    : undefined,
}
```

This avoids server-rendering paths that require `MessageChannel` from `node:worker_threads`.

## Code Style

- TypeScript strict mode is enabled via `astro/tsconfigs/strict`.
- Use `import type` for type-only imports.
- Prefer `unknown` and precise types over `any`.
- Use path alias imports for internal modules when practical: `@/components`, `@/utils`, `@/lib`.
- Keep Astro components in `PascalCase.astro`, React components in `PascalCase.tsx`, utilities in `camelCase.ts`, content in `kebab-case.mdx`.
- Keep comments rare and only explain non-obvious behavior or platform constraints.

Import order:

```ts
import type { CollectionEntry } from "astro:content";

import { getCollection } from "astro:content";

import BlogPost from "@/layouts/BlogPost.astro";
import { cn } from "@/lib/utils";
```

## Styling Rules

- Tailwind CSS 4 is configured in CSS through `@import`, `@plugin`, and `@theme`, not through a traditional Tailwind config.
- Shared tokens live in `src/assets/global.css`.
- DaisyUI themes are disabled and mapped through CSS variables.
- shadcn-style components use `components.json` aliases.
- Preserve the existing visual system unless the task explicitly asks for a redesign.

## Internationalization

- English routes are unprefixed: `/about`, `/blog/...`.
- Indonesian routes are prefixed: `/id/about`, `/id/blog/...`.
- Keep `src/i18n/en.ts` and `src/i18n/id.ts` structurally aligned.
- Do not hard-code user-facing strings in shared components when translations already exist.
- Test both locales for route or content changes.

## Blog Content Rules

Content lives under:

- `src/content/blog-en/<category>/<slug>.mdx`
- `src/content/blog-id/<category>/<slug>.mdx`

Required frontmatter is enforced in `src/content.config.ts`:

```yaml
title: "Post title"
description: "Post description"
created_at: 2026-04-25
modified_at: 2026-04-25
image: "/blog/covers/example.jpg"
category: "web-development"
tags: ["astro", "cloudflare"]
author:
  name: "Rio Bahtiar"
  image: "/authors/rio-bahtiar.jpg"
  bio: "Full-stack developer"
draft: false
```

`image` is optional in the schema but strongly recommended for social previews.

## Image Workflow

- Static assets live under `public/` (e.g. `public/smc.jpg` for the OG/cover image) and are served as-is by Cloudflare assets.
- Source assets under `src/assets/` (e.g. `src/assets/me-avatar.png`) are imported into components and processed by Astro's image service.
- The Cloudflare adapter uses `imageService: { build: "compile", runtime: "passthrough" }`; prefer plain `<img>` tags or imported `ImageMetadata`. Do not introduce remote image CDNs without updating this guide.

## Documentation Rules

Update docs in the same change when any of these change:

- Package manager, lockfile, or command names
- Astro major version, content collection API, or render API
- Cloudflare adapter or Wrangler config file format
- Deployment target, bindings, or compatibility flags
- Content schema or blog route shape
- Image upload/delivery workflow
- CI workflow setup

Prefer major-version descriptions in prose and exact versions only where they come directly from `package.json`.

## AI Tooling Expectations

- Read this file first and treat it as project-local policy.
- Prefer `rg` and `rg --files` for exploration.
- Use official docs when checking modern Astro, Cloudflare, Bun, React, or Tailwind behavior.
- Keep changes small and focused unless the user asks for a broad modernization.
- If docs and code disagree, make the code the source of truth and update docs.
- If a migration creates CI breakage, fix the workflow instead of documenting a broken state.
- Leave `.claude/settings.local.json` as a local tool permission file; do not depend on it for project behavior.

## Pre-Commit Checklist

```bash
bun run typecheck
bun run format:check
bun run build
```

For production/deployment changes, also run:

```bash
bun audit --audit-level high
bun run build
```

## Reference Links

- Astro content loaders: https://docs.astro.build/en/reference/content-loader-reference/
- Astro 6 upgrade guide: https://docs.astro.build/en/guides/upgrade-to/v6/
- Astro Cloudflare adapter: https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- Cloudflare Wrangler config: https://developers.cloudflare.com/workers/wrangler/configuration/
- Bun lockfile: https://bun.sh/docs/pm/lockfile
