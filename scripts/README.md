# Scripts

This directory contains Cloudinary asset management scripts. Run them with Bun from the repository root.

## Environment

```bash
PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Commands

```bash
bun run prebuild
bun run cloudinary:upload
bun run cloudinary:list
bun run cloudinary:validate
bun run cloudinary:delete portfolio/old-image
```

## Files

- `prebuild-upload-curl.js`: non-blocking build-time upload used by `bun run build`.
- `upload-to-cloudinary.js`: SDK-based smart sync for managed assets.
- `cloudinary-utils.js`: shared Cloudinary SDK helpers.
- `list-cloudinary-assets.js`: list uploaded assets.
- `validate-cloudinary-assets.js`: verify configured assets exist.
- `delete-cloudinary-asset.js`: delete a Cloudinary asset by public ID.
- `prebuild-upload.js` and `prebuild-upload-fetch.js`: alternate upload implementations kept for reference/testing.

## Managed Assets

| Local file                 | Public ID             |
| -------------------------- | --------------------- |
| `src/assets/me-avatar.png` | `portfolio/me-avatar` |
| `public/smc.jpg`           | `portfolio/smc-cover` |

When adding managed assets, update both `upload-to-cloudinary.js` and `prebuild-upload-curl.js` so manual sync and production builds behave the same.

See [../CLOUDINARY.md](../CLOUDINARY.md) for the full workflow.
