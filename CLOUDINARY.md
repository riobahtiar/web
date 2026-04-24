# Cloudinary Image Workflow

Cloudinary is used for optimized CDN image delivery. The repo keeps source images locally and provides scripts for uploading, listing, validating, and deleting Cloudinary assets.

## Environment

Create `.env` locally when running upload/list/validate/delete commands:

```bash
PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

Use GitHub Actions secrets or Cloudflare environment variables for CI/deployment environments.

## Commands

```bash
bun run cloudinary:upload
bun run cloudinary:list
bun run cloudinary:validate
bun run cloudinary:delete portfolio/old-image
bun run prebuild
```

`bun run build` runs `bun run prebuild` before `astro build`.

## Managed Assets

The current upload scripts manage:

| Name        | Local path                 | Public ID             | Transform                                 |
| ----------- | -------------------------- | --------------------- | ----------------------------------------- |
| Avatar      | `src/assets/me-avatar.png` | `portfolio/me-avatar` | 400 x 400 face crop, auto quality/format  |
| Cover image | `public/smc.jpg`           | `portfolio/smc-cover` | 1200 x 630 fill crop, auto quality/format |

To add another managed asset, update:

- `scripts/upload-to-cloudinary.js` for SDK-based smart sync
- `scripts/prebuild-upload-curl.js` for build-time upload
- `scripts/validate-cloudinary-assets.js` if validation should cover it
- This document and [ASSETS.md](./ASSETS.md)

## Build-Time Upload

`scripts/prebuild-upload-curl.js` is intentionally curl-based for CI portability.

Behavior:

- Reads `.env` or process environment.
- Checks whether each configured asset exists in Cloudinary.
- Uploads only missing assets.
- Logs upload/skipped/error counts.
- Exits with code 0 even if credentials are missing or an upload fails.

This keeps normal builds from failing on image-upload issues, but production parity still requires valid Cloudinary credentials.

## Manual Upload

You can upload assets through the Cloudinary dashboard:

1. Open the Media Library.
2. Upload the image.
3. Place it in a folder such as `portfolio/`, `blog/`, or `projects/`.
4. Record the public ID.
5. Reference it in code or content using a transformed URL.

Example transformed URL:

```text
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_1200,h_630,c_fill,f_auto,q_auto/blog/my-post-cover
```

## Astro Component Usage

```astro
---
import { CldImage } from "astro-cloudinary";
---

<CldImage
  src="portfolio/me-avatar"
  alt="Rio Bahtiar"
  width={400}
  height={400}
  crop="fill"
  gravity="face"
  format="auto"
  quality="auto"
/>
```

## MDX Usage

Direct URL in frontmatter:

```yaml
image: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_1200,h_630,c_fill,f_auto,q_auto/blog/my-post-cover"
```

Direct URL in Markdown:

```md
![Dashboard screenshot](https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_1000,c_fit,f_auto,q_auto/blog/dashboard-screenshot)
```

Component usage in MDX:

```mdx
import { CldImage } from "astro-cloudinary";

<CldImage
  src="blog/dashboard-screenshot"
  alt="Dashboard screenshot"
  width={1000}
  height={625}
  format="auto"
  quality="auto"
/>
```

## Recommended Transformations

| Use case          | Width     | Height   | Crop   | Quality | Format |
| ----------------- | --------- | -------- | ------ | ------- | ------ |
| Avatar            | 200-400   | 200-400  | `fill` | `auto`  | `auto` |
| Blog cover        | 1200      | 630      | `fill` | `auto`  | `auto` |
| Blog content      | 800-1200  | variable | `fit`  | `auto`  | `auto` |
| Gallery thumbnail | 400       | 300      | `fill` | `auto`  | `auto` |
| Full-width image  | 1600-1920 | variable | `fit`  | `auto`  | `auto` |

Use PNG only when transparency is required. Keep SVG logos as SVGs.

## Asset Maintenance

List assets:

```bash
bun run cloudinary:list
bun run cloudinary:list portfolio
```

Validate configured assets:

```bash
bun run cloudinary:validate
```

Delete an asset:

```bash
bun run cloudinary:delete portfolio/old-image
```

Deletion is permanent. The delete script has a countdown, but still verify the public ID before running it.

## Troubleshooting

### Invalid credentials

- Check `.env` names exactly.
- Confirm values in the Cloudinary dashboard.
- Ensure CI secrets are available to the workflow.

### Asset already exists

The default scripts skip existing assets. To force replacement, set `overwrite: true` in `scripts/upload-to-cloudinary.js` for the specific asset, run upload, then restore the safer default if needed.

### Build logs say credentials are missing

Either set credentials or use:

```bash
bun run build:skip-upload
```

### Asset path is duplicated

If `folder` is set and `publicId` already includes the folder, Cloudinary paths can be duplicated. Current scripts use `publicId` values such as `portfolio/me-avatar`; keep folder handling consistent when adding assets.
