# Build-Time Cloudinary Upload

`bun run build` runs a prebuild step that syncs configured local images to Cloudinary before Astro builds the Worker bundle.

## Flow

```text
Local source image
  -> bun run prebuild
  -> Cloudinary check/upload
  -> astro build
  -> Cloudflare Workers deploy
```

## Commands

```bash
bun run prebuild
bun run build
bun run build:skip-upload
```

- `bun run prebuild`: run only the Cloudinary sync.
- `bun run build`: sync images, then run `astro build`.
- `bun run build:skip-upload`: run `astro build` only.

## Environment Variables

Required for uploads:

```bash
PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

The prebuild script reads `.env` first, then process environment variables.

## Current Managed Images

| Local path                 | Public ID             | Purpose               |
| -------------------------- | --------------------- | --------------------- |
| `src/assets/me-avatar.png` | `portfolio/me-avatar` | Profile avatar        |
| `public/smc.jpg`           | `portfolio/smc-cover` | Portfolio cover image |

## Script Behavior

`scripts/prebuild-upload-curl.js`:

- Uses `curl` through Node/Bun `execSync`.
- Signs Cloudinary upload requests with `CLOUDINARY_API_SECRET`.
- Checks existing assets by requesting their Cloudinary delivery URL.
- Uploads only missing assets.
- Logs detailed status for each asset.
- Always exits with code 0 so image sync problems do not block unrelated builds.

If credentials are missing, the script logs the missing values and continues without uploading.

## CI Usage

GitHub Actions should use Bun:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: "22"

- uses: oven-sh/setup-bun@v2
  with:
    bun-version: "1.3.11"

- run: bun install --frozen-lockfile
- run: bun run build
  env:
    PUBLIC_CLOUDINARY_CLOUD_NAME: ${{ secrets.PUBLIC_CLOUDINARY_CLOUD_NAME }}
    PUBLIC_CLOUDINARY_API_KEY: ${{ secrets.PUBLIC_CLOUDINARY_API_KEY }}
    CLOUDINARY_API_SECRET: ${{ secrets.CLOUDINARY_API_SECRET }}
```

Cloudinary secrets are optional for build success but required for upload parity.

## When to Skip Upload

Use `bun run build:skip-upload` when:

- You are validating TypeScript, routes, or layout changes.
- Cloudinary credentials are unavailable.
- Images are already uploaded and the change is unrelated to assets.

Use `bun run build` when:

- Preparing a production deployment.
- Adding or changing managed source images.
- Testing CI/deployment parity.

## Adding Managed Images

1. Add the local source image.
2. Add an entry to `scripts/prebuild-upload-curl.js`.
3. Add an equivalent entry to `scripts/upload-to-cloudinary.js`.
4. Update validation if needed.
5. Update [ASSETS.md](./ASSETS.md) and [CLOUDINARY.md](./CLOUDINARY.md).
6. Run:

```bash
bun run prebuild
bun run build:skip-upload
```

## Troubleshooting

### Upload fails but build continues

This is expected. The prebuild script is non-blocking by design. Check credentials and rerun `bun run prebuild`.

### Asset is not replaced

The scripts skip existing assets by default. Delete the Cloudinary asset or temporarily enable overwrite in the SDK upload script.

### File not found

Check the local path in both upload scripts. Paths are resolved relative to the repository root through the `scripts/` directory.

### Wrong Cloudinary folder

Current `prebuild` entries use public IDs that already include `portfolio/`, with an empty `folder`. Keep this pattern unless deliberately changing all references.
