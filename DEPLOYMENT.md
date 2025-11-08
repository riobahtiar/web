# Deployment Guide for Astro Rio

## Overview

This project is an Astro SSR application configured for deployment to Cloudflare Workers.

## Prerequisites

1. **Cloudflare Account** - Sign up at https://cloudflare.com
2. **Wrangler CLI** - Already installed as dev dependency
3. **Node.js** - Version 22.x or higher

## Deployment Steps

### 1. Authenticate with Cloudflare

```bash
npx wrangler login
```

This will open a browser window to authorize wrangler with your Cloudflare account.

### 2. Create KV Namespace for Sessions

The @astrojs/cloudflare adapter requires a KV namespace for session storage.

```bash
npx wrangler kv namespace create SESSION
```

You'll get output like:
```
⛅️ wrangler 4.46.0
-------------------
🌀 Creating namespace with title "web-SESSION"
✨ Success!
Add the following to your configuration file:
[[kv_namespaces]]
binding = "SESSION"
id = "abc123def456..."
```

### 3. Update wrangler.toml

Copy the `id` from the previous step and update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "SESSION"
id = "abc123def456..."  # Replace with your actual ID
```

### 4. Build the Project

```bash
npm run build
```

This creates the `dist/` directory with:
- `dist/_worker.js/` - Server-side worker code
- Static assets in `dist/` root

### 5. Deploy to Cloudflare Workers

```bash
npx wrangler deploy
```

Your site will be deployed to: `https://web.riomyid.workers.dev`

## Cloudflare Pages Alternative

If you prefer Cloudflare Pages instead of Workers:

### Setup

1. Go to Cloudflare Dashboard → Pages
2. Connect your GitHub repository
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`

### Environment Variables (if needed)

In Cloudflare Pages dashboard:
- Settings → Environment Variables
- Add any required variables

### KV Namespace Binding (Pages)

In Cloudflare Pages dashboard:
1. Settings → Functions
2. KV namespace bindings
3. Add binding:
   - Variable name: `SESSION`
   - KV namespace: Select your created namespace

## Configuration Files

### wrangler.toml

Current configuration for Cloudflare Workers:

```toml
name = "web"
compatibility_date = "2025-06-22"
main = "dist/_worker.js"
compatibility_flags = ["nodejs_compat_v2"]

[[kv_namespaces]]
binding = "SESSION"
id = "YOUR_KV_NAMESPACE_ID"  # Update this!

[observability.logs]
enabled = true

[images]
binding = "IMAGES"
```

### astro.config.mjs

The project uses `@astrojs/cloudflare` adapter with SSR mode:

```javascript
export default defineConfig({
  site: "https://web.riomyid.workers.dev",
  output: "server",  // SSR mode
  adapter: cloudflare({
    imageService: "cloudflare",
    platformProxy: {
      enabled: true,
    },
  }),
});
```

## Troubleshooting

### Error: "Invalid binding `SESSION`"

**Solution**: Create the KV namespace and update wrangler.toml with the correct ID.

### Error: "Uploading a Pages _worker.js directory as an asset"

**Solution**: This error has been fixed by removing the `[assets]` section from wrangler.toml. Astro handles static assets through the worker itself.

### Build Warnings

These warnings are normal and don't affect deployment:

- **Node.js module externalization** - Vite automatically externalizes Node modules for Workers
- **DaisyUI @property warning** - Harmless CSS optimization warning

### Security Vulnerabilities

Run `npm audit fix` to automatically fix known vulnerabilities:

```bash
npm audit fix
```

## Development vs Production

### Development

```bash
npm run dev
```

Runs on http://localhost:4321

### Preview Production Build

```bash
npm run build
npm run preview
```

### Type Checking

```bash
npx astro check
```

## Deployment Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] Build completes successfully (`npm run build`)
- [ ] No security vulnerabilities (`npm audit`)
- [ ] KV namespace created and configured
- [ ] Environment variables set (if any)
- [ ] wrangler.toml updated with correct IDs
- [ ] Git changes committed and pushed

## Continuous Deployment

### Using GitHub Actions (optional)

You can set up automatic deployments on push:

1. Add secrets to GitHub repo:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

2. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

### Using Cloudflare Pages (automatic)

Connect your GitHub repository to Cloudflare Pages for automatic deployments on every push.

## Support

- Astro Documentation: https://docs.astro.build
- Cloudflare Workers: https://developers.cloudflare.com/workers
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler

## License

See LICENSE file for details.
