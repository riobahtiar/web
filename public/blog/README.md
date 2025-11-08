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

### Content Images (Astro Image component)
```mdx
import { Image } from "astro:assets";
import diagramImage from "/public/blog/content/diagram.png";

<Image src={diagramImage} alt="Architecture diagram" width={800} height={600} />
```

### Content Images (Markdown)
```markdown
![Alt text](/blog/content/screenshot.png)
```

## Optimization Tips

1. Use WebP format when possible for better compression
2. Compress images before uploading (use tools like TinyPNG)
3. Use descriptive alt text for accessibility
4. Consider using Cloudflare Images for automatic optimization
