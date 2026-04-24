# Asset Management

This repo uses two asset paths:

- `public/` for static files served directly by Astro/Cloudflare assets
- Cloudinary for optimized CDN delivery of selected portfolio and content images

Cloudinary is the current primary image CDN workflow. Cloudflare Images is not configured as the primary pipeline in this repo.

## Static Directory Structure

```text
public/
├── blog/
│   ├── covers/       # Blog cover images
│   ├── content/      # Inline blog images
│   └── featured/     # Featured blog images
├── authors/          # Author profile images
├── smc.jpg           # Portfolio cover source used by upload scripts
└── site.webmanifest
```

## Source Assets

```text
src/assets/
├── global.css        # Tailwind CSS 4, DaisyUI, and design tokens
├── me-avatar.png     # Avatar source used by upload scripts
├── logo-dark.svg
├── logo-light.svg
└── background.svg
```

## Blog Covers

Recommended:

- Size: 1200 x 630
- Format: JPG or WebP
- Max size: about 200 KB when stored locally
- Naming: match the post slug, e.g. `getting-started-with-astro.jpg`
- Location: `public/blog/covers/`

Frontmatter:

```yaml
image: "/blog/covers/getting-started-with-astro.jpg"
```

## Blog Content Images

Recommended:

- Width: 800-1200px for regular content
- Format: JPG, PNG, WebP, or SVG where appropriate
- Max size: about 500 KB when stored locally
- Naming: descriptive kebab-case
- Location: `public/blog/content/`

Markdown:

```md
![Astro architecture diagram](/blog/content/astro-architecture-diagram.png)
```

## Author Images

Recommended:

- Size: 400 x 400
- Format: JPG, PNG, or WebP
- Max size: about 100 KB
- Naming: lowercase/kebab-case author name
- Location: `public/authors/`

Frontmatter:

```yaml
author:
  name: "Rio Bahtiar"
  image: "/authors/rio-bahtiar.jpg"
  bio: "Full-stack developer"
```

## Cloudinary Workflow

Configured script sources:

| Local file                 | Cloudinary public ID  |
| -------------------------- | --------------------- |
| `src/assets/me-avatar.png` | `portfolio/me-avatar` |
| `public/smc.jpg`           | `portfolio/smc-cover` |

Commands:

```bash
bun run cloudinary:upload
bun run cloudinary:list
bun run cloudinary:validate
bun run cloudinary:delete portfolio/old-image
```

Production builds run:

```bash
bun run prebuild
```

`prebuild` uses `scripts/prebuild-upload-curl.js`, checks whether configured assets already exist, uploads missing assets, and exits successfully even when credentials are absent so unrelated builds can continue.

## Environment Variables

Required for upload operations:

```bash
PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

Store them in `.env` locally and in CI/deployment secrets for production parity.

## Optimization Guidelines

- Prefer Cloudinary `f_auto`/`q_auto` transformations for remote image URLs.
- Compress local static images before committing.
- Use WebP for photos when broad compatibility is acceptable.
- Keep SVGs for logos and simple vector graphics.
- Always provide meaningful alt text.
- Add explicit dimensions in components to avoid layout shift.
- Use `loading="eager"` only for likely LCP images; keep other images lazy.

## Troubleshooting

### Static image does not load

- Confirm the path starts with `/`.
- Confirm the file exists under `public/`.
- Check filename case exactly.
- Avoid spaces in filenames.

### Cloudinary image does not load

- Verify the public ID in the Cloudinary dashboard.
- Check `PUBLIC_CLOUDINARY_CLOUD_NAME`.
- Run `bun run cloudinary:validate`.
- Confirm transformations are valid for the asset type.

### Build should not upload images

Use:

```bash
bun run build:skip-upload
```

### New upload source is needed

Update both scripts if the image should be managed by the standard workflow:

- `scripts/upload-to-cloudinary.js`
- `scripts/prebuild-upload-curl.js`

Then update this document and [CLOUDINARY.md](./CLOUDINARY.md).
