# Blog Images Directory

This directory contains cover images and assets for blog posts.

## Organization

```
public/blog/
├── covers/           # Blog post cover images
├── content/          # Images used within blog posts
└── featured/         # Featured post images
```

## Image Guidelines

### Cover Images

- **Format**: JPG or WebP
- **Size**: 1200x630px (optimal for social sharing)
- **Max file size**: 200KB
- **Naming**: Use kebab-case matching post slug
  - Example: `getting-started-with-astro.jpg`

### Content Images

- **Format**: JPG, PNG, or WebP
- **Size**: Varies (optimize for web)
- **Max file size**: 500KB
- **Naming**: Descriptive kebab-case
  - Example: `astro-architecture-diagram.png`

## Usage in Blog Posts

### Cover Image

```mdx
---
title: "My Blog Post"
image: "/blog/covers/my-blog-post.jpg"
---
```

### Content Images

Images in `public/` are referenced by URL path:

```markdown
![Alt text](/blog/content/screenshot.png)
```

If you need Astro's `Image` component, place the source image under `src/assets/` and import it from there.

## Optimization Tips

1. Use WebP format when possible for better compression
2. Compress images before uploading (use tools like TinyPNG)
3. Use descriptive alt text for accessibility
4. Keep local static images compressed before committing
