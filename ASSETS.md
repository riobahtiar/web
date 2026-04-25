# Asset Management

This repo serves all images directly from local sources:

- `public/` for static files served directly by Astro/Cloudflare assets
- `src/assets/` for assets imported through Astro components

The Cloudflare adapter uses `imageService: { build: "compile", runtime: "passthrough" }`, so transformed images are produced at build time and served as static assets at runtime.

## Static Directory Structure

```text
public/
├── blog/
│   ├── covers/       # Blog cover images
│   ├── content/      # Inline blog images
│   └── featured/     # Featured blog images
├── authors/          # Author profile images
├── smc.jpg           # Portfolio cover used in OG tags and the about page
└── site.webmanifest
```

## Source Assets

```text
src/assets/
├── global.css        # Tailwind CSS 4, DaisyUI, and design tokens
├── me-avatar.png     # Avatar imported by Welcome.astro
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

## Optimization Guidelines

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
