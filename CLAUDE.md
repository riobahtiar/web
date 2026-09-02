# AI Development Guide for Astro Rio

This file is the canonical operating guide for AI assistants and developers. `AGENTS.md` should remain a symlink to this file so Claude, Codex, and other agent tooling read the same instructions.

## Project Snapshot

`astro-rio` is a production portfolio and bilingual blog.

- Astro 7 SSR app deployed to Cloudflare Workers
- Bun-first project with committed `bun.lock`
- React 19 islands for interactive UI
- Tailwind CSS 4 plus DaisyUI 5 and shadcn-style React components
- Astro content collections in `src/content.config.ts`
- MDX enabled
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

### Dev server

Astro 7 runs `astro dev` as a **background daemon** that outlives the terminal.
Manage it with `astro dev status`, `astro dev logs`, and `astro dev stop`;
errors after startup go to the log, not the terminal you launched from.

Vite's dependency cache lives in the shared `node_modules/.vite`. Deleting it,
or letting a second dev server rewrite it, while a server is live invalidates
module URLs that have already been served and produces:

```
The file does not exist at ".../node_modules/.vite/deps_ssr/<mod>.js?v=<hash>"
```

It means a stale optimizer cache, not a broken dependency. Recover with
`bun run dev:clean`, which stops any running daemon before clearing the cache.
Always `astro dev stop` before removing `node_modules/.vite`.

Also note `bun run build` writes to `dist/`, so stop any `wrangler dev`
serving that directory first or the build fails on a locked file.

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

### Astro 7 Content Collections

- Collection config belongs in `src/content.config.ts`.
- Use `glob()` from `astro/loaders`.
- Import `z` from `astro/zod`, not from `astro:content`.
- Use `entry.id` for route identity; legacy `entry.slug` is not the current API for loader-backed collections.
- Use `render(entry)` from `astro:content`; do not use `entry.render()`.
- `entry.body` may be undefined, so reading-time helpers should receive `entry.body ?? ""`.

### Astro 7 Rendering Constraints

- `compressHTML` defaults to `"jsx"`. Whitespace that spans a newline
  _between two expressions or elements_ is deleted, not collapsed. Write
  `{count}{" "}` when a space must survive; prose that merely wraps is fine.
- The Rust compiler rejects unclosed tags and no longer auto-corrects invalid
  HTML nesting. Both are build errors, not warnings.
- Markdown and MDX are rendered by Sätteri, Astro's native pipeline. There are
  no remark/rehype plugins in this project, and `@astrojs/markdown-remark` is
  not installed. Adding a unified plugin means installing that package and
  setting `markdown.processor` explicitly.
- `markdown.shikiConfig` still applies under Sätteri.

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
- TypeScript stays on 6.x. `@astrojs/check` peers on `^5.0.0 || ^6.0.0`, so
  TypeScript 7 would break `bun run typecheck`.
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

- Tailwind CSS 4 is configured in CSS through `@import`, `@plugin`, `@theme`
  and `@utility`, not through a traditional Tailwind config.
- All design tokens live in `src/assets/global.css`. Use the semantic classes
  (`bg-background`, `bg-surface`, `text-foreground`, `text-muted-foreground`,
  `border-border`, `text-accent`) rather than raw Tailwind palette colors.
- Two accent roles, and they are not interchangeable:
  - `--accent` is for text and lines, retuned per theme so it always passes AA.
    In light mode it is deliberately darker than the brand mint.
  - `--accent-solid` is for fills and keeps the brand mint in both themes.
    Text on it must be `--accent-on-solid`.
- Dark is the primary theme. `<html>` ships `data-theme="dark" class="dark"`,
  and the inline script in `Layout.astro` resolves the real theme in `<head>`
  before first paint. Never move that script out of the head.
- Theme-dependent visuals should key off `[data-theme]` in CSS rather than a
  script, so they are correct on the very first frame.
- Structure comes from the hairline grid, not shadows: `.frame` bounds the
  content column with vertical rules, and `Section` draws the divider between
  sections. Cards are defined by a 1px border, not elevation.
- `.eyebrow` is the small uppercase mono label used above headings.
- Fonts are self-hosted through Astro's `fonts` config (Inter, JetBrains Mono).
  Adding a family requires both an entry in `astro.config.mjs` **and** a
  `<Font cssVariable="..." />` in the `Layout.astro` head, or the CSS variable
  is undefined and the stack silently falls back to system fonts.
- Do not add remote image CDNs for logos or icons; use `astro-icon` or local
  assets.
- Primitives live in `src/components/ui/` (`Button`, `Card`, `Badge`,
  `Section`). Prefer them over ad-hoc markup. Radix/shadcn React components are
  only for genuine interactivity, so static pages stay island-free.
- DaisyUI is being retired. It is still installed and bridged onto the tokens
  purely so unconverted pages keep rendering; do not write new DaisyUI markup
  (`btn`, `card`, `badge`, `navbar`, `base-*`).
- Preserve the existing visual system unless the task explicitly asks for a
  redesign.

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
image: "/smc.jpg"
category: "web-development"
tags: ["astro", "cloudflare"]
author:
  name: "Rio Bahtiar"
  image: "/authors/rio-bahtiar.png"
  bio: "Full-stack developer"
draft: false
```

`image` is optional in the schema but strongly recommended for social previews.

## Islands and React

React islands are for genuine interactivity only, and there are currently none
on any rendered page. `BlogSearch` is a plain `.astro` component with a small
inline script: the post list is server-rendered and filtering is a `hidden`
toggle over `data-haystack` attributes.

Keep it that way unless an island truly earns its place. A React island here
had two costs:

- Astro server-renders islands, so React runs in the SSR pipeline. In dev, SSR
  externalises CJS `node_modules`, so an island importing `react` resolved to
  the raw CJS build while `react-dom/server` came from Vite's optimized bundle.
  Two copies of React means a null hook dispatcher and "Invalid hook call" on
  the first request after a cold cache, which rendered the blog with no posts.
- Every post passed to the island was serialized into the HTML. Dropping it
  took `/blog` from 268KB to 31KB.

`@astrojs/react` stays registered for MDX components (`CodeTabs`, `CodeBlock`).
The SSR `optimizeDeps.noDiscovery` and `resolve.noExternal` settings in
`astro.config.mjs` exist to keep React on one instance if an island is ever
rendered again; do not remove them.

## Blog Data Access

Read posts through `@/utils/posts`, never `getCollection` directly:

- `getPublishedPosts(collection)` filters drafts and sorts newest-first. Drafts
  stay visible under `astro dev` and are dropped from production builds, so any
  new listing, feed, or detail route must go through it.
- `getPostSlug(post)` strips the leading `<category>/` the glob loader keeps in
  `entry.id`.
- `getCategoryCounts(posts)` builds the sidebar counts.
- `paginatePosts(posts, page, baseUrl)` slices a page and builds prev/next URLs.

Blog route shape, per locale (`/blog` and `/id/blog`):

- `index.astro` — page 1, canonical
- `page/[page].astro` — pages 2+; page 1 and out-of-range redirect to the index
- `[category].astro` — one category; unknown categories redirect to the index
- `[category]/[slug].astro` — a post
- `tag/[tag].astro` — one tag

Do not add a `[...page].astro` rest route under `blog/`: it collides with
`[category].astro`, which silently wins and renders page numbers as categories.

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
- Astro 7 upgrade guide: https://docs.astro.build/en/guides/upgrade-to/v7/
- Astro Cloudflare adapter: https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- Cloudflare Wrangler config: https://developers.cloudflare.com/workers/wrangler/configuration/
- Bun lockfile: https://bun.sh/docs/pm/lockfile
