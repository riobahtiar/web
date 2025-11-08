# Author Images Directory

This directory contains profile images for blog post authors.

## Image Guidelines

### Profile Images
- **Format**: JPG, PNG, or WebP
- **Size**: 400x400px (square)
- **Max file size**: 100KB
- **Naming**: Use lowercase author name or ID
  - Example: `rio-bahtiar.jpg`

## Usage in Blog Posts

### Frontmatter Configuration
```mdx
---
title: "My Blog Post"
author:
  name: "Rio Bahtiar"
  image: "/authors/rio-bahtiar.jpg"
  bio: "Full-stack developer passionate about web technologies"
---
```

## Default Authors

Create default author profiles that can be referenced across multiple posts.

### Example: `/src/data/authors.ts`
```typescript
export const authors = {
  "rio-bahtiar": {
    name: "Rio Bahtiar",
    image: "/authors/rio-bahtiar.jpg",
    bio: "Full-stack developer passionate about web technologies",
    social: {
      twitter: "https://twitter.com/riobahtiar",
      github: "https://github.com/riobahtiar",
    }
  }
};
```

## Tips

1. Use professional, high-quality headshots
2. Consistent image dimensions (400x400px)
3. Optimize images before uploading
4. Consider using a transparent or solid background
5. Keep file sizes under 100KB
