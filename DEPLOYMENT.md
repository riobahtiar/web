# Deployment Guide

This project deploys an Astro 6 SSR application to Cloudflare Workers with Wrangler JSONC configuration.

## Prerequisites

- Bun 1.3.11 or newer
- Node.js 22.x or newer
- Cloudflare account
- Wrangler access through the local dependency

## Configuration Files

- [astro.config.mjs](./astro.config.mjs): Astro integrations, SSR mode, Cloudflare adapter, React edge alias, Tailwind Vite plugin
- [wrangler.jsonc](./wrangler.jsonc): Worker entrypoint, assets binding, KV binding, compatibility flags, observability
- [package.json](./package.json): Bun scripts and dependency versions
- [bun.lock](./bun.lock): reproducible dependency lockfile

Cloudflare config is `wrangler.jsonc`; do not reintroduce `wrangler.toml`.

## Current Cloudflare Setup

`wrangler.jsonc` currently defines:

```jsonc
{
  "name": "web",
  "main": "@astrojs/cloudflare/entrypoints/server",
  "compatibility_date": "2026-04-17",
  "compatibility_flags": ["nodejs_compat_v2"],
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS",
  },
  "kv_namespaces": [
    {
      "binding": "SESSION",
      "id": "ab185a6610c74aa7bf7eaacfec22891f",
    },
  ],
}
```

The Astro adapter uses:

```js
adapter: cloudflare({
  imageService: { build: "compile", runtime: "passthrough" },
});
```

This matches the current Cloudflare adapter API for build-time image compilation and safe SSR passthrough at runtime.

## First-Time Setup

Authenticate Wrangler:

```bash
bunx wrangler login
```

Create a KV namespace only if the configured `SESSION` namespace does not exist in your Cloudflare account:

```bash
bunx wrangler kv namespace create SESSION
```

Copy the generated ID into `wrangler.jsonc` under `kv_namespaces`.

If bindings change, regenerate Cloudflare types:

```bash
bun run cf-typegen
```

## Build

Production build:

```bash
bun run build
```

This runs `astro build`.

## Deploy

```bash
bun run deploy
```

Equivalent manual flow:

```bash
bun run build
bunx wrangler deploy
```

Production URL:

- https://web.riomyid.workers.dev

## CI/CD

GitHub Actions use Bun and Node 22:

- `oven-sh/setup-bun@v2`
- `bun install --frozen-lockfile`
- `bun run typecheck`
- `bun run build`
- `cloudflare/wrangler-action@v3`

Required repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Local Preview

```bash
bun run build
bun run preview
```

Open the preview URL printed by Astro.

## Deployment Checklist

- `bun install --frozen-lockfile` succeeds
- `bun run typecheck` has zero errors
- `bun run format:check` passes or formatting is intentionally updated
- `bun audit --audit-level high` reviewed
- `bun run build` succeeds for deployment changes
- `wrangler.jsonc` has the correct KV namespace IDs and compatibility date
- Both `/` and `/id/` route families have been checked for routing/content changes
- RSS feeds work at `/rss.xml` and `/id/rss.xml`

## Troubleshooting

### `npm ci` fails in CI

This repo no longer has `package-lock.json`. Use Bun:

```bash
bun install --frozen-lockfile
```

### `SESSION` binding is missing

Create or bind the KV namespace and update `wrangler.jsonc`.

### React SSR fails on Workers

Confirm `astro.config.mjs` still aliases production `react-dom/server` to `react-dom/server.edge`.

### Asset serving fails

Confirm `wrangler.jsonc` keeps:

```jsonc
"assets": {
  "directory": "./dist",
  "binding": "ASSETS"
}
```

### Content collection warnings after Astro upgrades

Confirm collections are defined in `src/content.config.ts`, use `glob()` loaders, and code references `entry.id` rather than legacy `entry.slug`.

## References

- Astro Cloudflare adapter: https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- Astro 6 upgrade guide: https://docs.astro.build/en/guides/upgrade-to/v6/
- Cloudflare Wrangler configuration: https://developers.cloudflare.com/workers/wrangler/configuration/
- Bun install and lockfile: https://bun.com/docs/cli/install
