# Performance Notes

Current stack: Astro 6 SSR on Cloudflare Workers, React 19 islands, Tailwind CSS 4, Cloudinary image delivery, and Cloudflare static asset serving.

## Current Optimizations

- Astro SSR runs at the Cloudflare edge.
- Static assets are served through the `ASSETS` binding configured in `wrangler.jsonc`.
- React server rendering uses `react-dom/server.edge` in production.
- Tailwind CSS 4 is compiled through `@tailwindcss/vite`.
- Shiki code highlighting uses configured light/dark themes with wrapping enabled.
- Cloudinary delivers selected images with automatic quality and format transformations.
- The Cloudflare adapter uses `imageService: { build: "compile", runtime: "passthrough" }` to avoid runtime image processing in Workers.
- Blog related posts and reading time are computed server-side from content collection entries.

## Image Strategy

Primary image CDN: Cloudinary.

Managed assets:

- `src/assets/me-avatar.png` -> `portfolio/me-avatar`
- `public/smc.jpg` -> `portfolio/smc-cover`

Recommended Cloudinary transformations:

- `f_auto` for modern formats such as WebP/AVIF where supported
- `q_auto` for adaptive compression
- Explicit width/height to reserve layout space
- `loading="eager"` only for LCP candidates
- `loading="lazy"` for below-fold images

Static blog images under `public/blog/` should be compressed before commit.

## Worker Compatibility

Keep these settings unless a tested platform migration changes them:

```js
adapter: cloudflare({
  imageService: { build: "compile", runtime: "passthrough" },
});
```

```jsonc
"compatibility_flags": ["nodejs_compat_v2"]
```

```js
alias: import.meta.env.PROD
  ? { "react-dom/server": "react-dom/server.edge" }
  : undefined;
```

## Validation

Fast local performance sanity check:

```bash
bun run typecheck
bun run build:skip-upload
bun run preview
```

Production-parity build:

```bash
bun run build
```

Manual checks:

- Use Chrome DevTools mobile viewport.
- Test slow network throttling for image-heavy pages.
- Verify `/`, `/blog`, `/id/`, and `/id/blog`.
- Run Lighthouse against a preview or deployed Worker.

## Targets

| Metric     | Target                                                         |
| ---------- | -------------------------------------------------------------- |
| LCP        | Under 2.5s on representative mobile network                    |
| CLS        | Under 0.1                                                      |
| INP        | Under 200ms                                                    |
| Initial JS | Keep React islands isolated and intentional                    |
| Images     | Use appropriately sized Cloudinary or compressed static assets |

## Improvement Backlog

- Add responsive `sizes` and width variants for any remaining image-heavy components.
- Audit React islands for unnecessary hydration.
- Keep Cloudinary asset validation in deployment checks when image references change.
- Re-run Lighthouse after dependency or adapter upgrades.
