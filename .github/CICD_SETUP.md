# CI/CD Setup

GitHub Actions build and deploy the Astro Rio Cloudflare Worker with Bun.

## Workflows

- `deploy.yml`: builds and deploys pushes to `main`, plus manual dispatch.
- `preview.yml`: validates pull requests with typecheck and build.
- `quality-check.yml`: runs formatting check, Astro typecheck, audit, and build.

## Runtime

Workflows use:

- Node.js 22
- `oven-sh/setup-bun@v2`
- Bun 1.3.11
- `bun install --frozen-lockfile`

Do not switch workflows back to `npm ci`; this repo uses `bun.lock` and no `package-lock.json`.

## Required Secrets

### `CLOUDFLARE_API_TOKEN`

Cloudflare API token with permissions to deploy Workers.

Minimum typical permissions:

- Account > Workers Scripts > Edit
- Account > Account Settings > Read
- Zone > Workers Routes > Edit, only if custom routes are used

### `CLOUDFLARE_ACCOUNT_ID`

Cloudflare account ID used by `cloudflare/wrangler-action`.

## Optional Cloudinary Secrets

Set these if CI should perform production-parity image uploads during `bun run build`:

- `PUBLIC_CLOUDINARY_CLOUD_NAME`
- `PUBLIC_CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

If they are absent, the prebuild upload step logs a warning and the build continues.

## Local CI Parity

```bash
bun install --frozen-lockfile
bun run format:check
bun run typecheck
bun audit --audit-level high
bun run build
```

For faster non-deployment validation:

```bash
bun run typecheck
bun run build
```

## Deployment Target

Production Worker:

- https://web.riomyid.workers.dev

Cloudflare configuration:

- [wrangler.jsonc](../wrangler.jsonc)

## Custom Domain

If a custom domain is added, update `wrangler.jsonc` with routes according to Cloudflare Workers routing docs, then ensure `CLOUDFLARE_API_TOKEN` has the required zone permissions.

## Troubleshooting

### CI fails during install

Confirm the workflow uses:

```yaml
- uses: oven-sh/setup-bun@v2
- run: bun install --frozen-lockfile
```

### Build works locally but not in CI

- Check Bun version.
- Check Node.js version.
- Verify Cloudinary env vars if the change depends on uploaded assets.
- Reproduce locally with `bun install --frozen-lockfile`.

### Deploy fails with invalid API token

- Verify `CLOUDFLARE_API_TOKEN` exists.
- Confirm token scopes.
- Confirm the token has not expired.

### Deploy fails with account errors

- Verify `CLOUDFLARE_ACCOUNT_ID`.
- Confirm the Worker belongs to that account.

### Type errors

Run:

```bash
bun run typecheck
```

Astro content collection errors often mean `src/content.config.ts` or frontmatter is out of sync.

## References

- Cloudflare Wrangler action: https://github.com/cloudflare/wrangler-action
- Cloudflare Wrangler config: https://developers.cloudflare.com/workers/wrangler/configuration/
- Bun GitHub Actions setup: https://bun.sh/guides/runtime/cicd
