# Blog Assets Management Guide

This document explains how to manage and organize assets for your blog.

## Directory Structure

```
public/
├── blog/
│   ├── covers/          # Post cover images (1200x630px)
│   ├── content/         # Images used in post content
│   ├── featured/        # Featured post banners
│   └── README.md        # Blog assets guide
├── authors/
│   ├── rio-bahtiar.jpg  # Author profile images (400x400px)
│   └── README.md        # Authors guide
└── ...
```

## Asset Types

### 1. Cover Images
**Purpose**: Social sharing, blog listing thumbnails
**Location**: `/public/blog/covers/`
**Specs**:
- Dimensions: 1200x630px (16:9 ratio)
- Format: JPG or WebP
- Max size: 200KB
- Naming: `post-slug.jpg`

**Usage**:
```mdx
---
title: "Getting Started with Astro"
image: "/blog/covers/getting-started-with-astro.jpg"
---
```

### 2. Content Images
**Purpose**: Inline images within blog posts
**Location**: `/public/blog/content/`
**Specs**:
- Dimensions: Varies
- Format: JPG, PNG, WebP, SVG
- Max size: 500KB
- Naming: Descriptive kebab-case

**Usage (Markdown)**:
```markdown
![Architecture diagram](/blog/content/astro-architecture.png)
```

**Usage (Astro Image)**:
```astro
---
import { Image } from "astro:assets";
import diagram from "../../public/blog/content/diagram.png";
---

<Image src={diagram} alt="Diagram" width={800} height={600} />
```

### 3. Author Images
**Purpose**: Author profile pictures
**Location**: `/public/authors/`
**Specs**:
- Dimensions: 400x400px (square)
- Format: JPG, PNG, or WebP
- Max size: 100KB
- Naming: `author-name.jpg`

**Usage**:
```mdx
---
author:
  name: "Rio Bahtiar"
  image: "/authors/rio-bahtiar.jpg"
  bio: "Full-stack developer"
---
```

## Best Practices

### Image Optimization

1. **Compress Before Upload**
   - Use tools: TinyPNG, ImageOptim, or Squoosh
   - Target: 70-80% quality for JPG
   - Use WebP when supported

2. **Responsive Images**
   ```astro
   <Image
     src={coverImage}
     alt="Cover"
     widths={[400, 800, 1200]}
     sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
   />
   ```

3. **Lazy Loading**
   ```astro
   <Image src={image} alt="Alt text" loading="lazy" />
   ```

### Naming Conventions

- Use **kebab-case**: `my-blog-post-image.jpg`
- Be **descriptive**: `astro-build-output.png` not `img1.png`
- Match **post slugs** for covers: `post-slug.jpg`
- Use **author names** for profiles: `rio-bahtiar.jpg`

### Accessibility

Always provide meaningful alt text:

```markdown
<!-- Bad -->
![Image](/blog/content/screenshot.png)

<!-- Good -->
![Astro dev server running in terminal](/blog/content/astro-dev-server.png)
```

## Cloudflare Images Integration

This project uses Cloudflare Images binding. To use:

### 1. Upload via Wrangler
```bash
npx wrangler r2 object put blog-bucket/covers/image.jpg --file ./image.jpg
```

### 2. Use in Posts
```mdx
---
image: "https://imagedelivery.net/YOUR_ACCOUNT/image-id/public"
---
```

### 3. Automatic Optimization
Cloudflare Images automatically:
- Converts to WebP
- Resizes based on viewport
- Serves from CDN
- Caches globally

## Workflow

### Adding a New Blog Post with Images

1. **Create Post**:
   ```bash
   # Create MDX file
   touch src/content/blog-en/category/my-post.mdx
   ```

2. **Add Cover Image**:
   ```bash
   # Optimize and add cover
   cp ~/Downloads/cover.jpg public/blog/covers/my-post.jpg
   ```

3. **Add Content Images**:
   ```bash
   # Add any inline images
   cp ~/Downloads/*.png public/blog/content/
   ```

4. **Reference in Frontmatter**:
   ```mdx
   ---
   title: "My Post"
   image: "/blog/covers/my-post.jpg"
   ---

   Your content here...

   ![Description](/blog/content/image.png)
   ```

5. **Verify**:
   ```bash
   npm run dev
   # Check http://localhost:4321/blog/category/my-post
   ```

## Troubleshooting

### Image Not Loading

**Check**:
1. Path is correct (starts with `/`)
2. File exists in `public/` directory
3. File extension matches (case-sensitive)
4. No spaces in filename

**Example**:
```mdx
<!-- Wrong -->
image: "blog/covers/my-post.jpg"
image: "/Blog/Covers/my-post.JPG"

<!-- Correct -->
image: "/blog/covers/my-post.jpg"
```

### Image Too Large

**Solutions**:
1. Compress with online tool (TinyPNG)
2. Convert to WebP format
3. Reduce dimensions
4. Use Cloudflare Images for automatic optimization

### Broken Social Sharing

**Check Open Graph Meta Tags**:
```html
<meta property="og:image" content="https://yourdomain.com/blog/covers/post.jpg" />
```

**Requirements**:
- Use absolute URL
- Image must be 1200x630px (minimum 600x315px)
- File size under 8MB
- Accessible via HTTPS

## Tools & Resources

### Image Optimization
- [TinyPNG](https://tinypng.com) - PNG/JPG compression
- [Squoosh](https://squoosh.app) - Google's image optimizer
- [ImageOptim](https://imageoptim.com) - Mac app for compression

### Image Creation
- [Canva](https://canva.com) - Design cover images
- [Figma](https://figma.com) - Professional design tool
- [Unsplash](https://unsplash.com) - Free stock photos

### Testing
- [Facebook Debugger](https://developers.facebook.com/tools/debug/) - Test OG images
- [Twitter Card Validator](https://cards-dev.twitter.com/validator) - Test Twitter cards

## Quick Reference

| Asset Type | Location | Size | Format | Max Size |
|-----------|----------|------|--------|----------|
| Cover | `/blog/covers/` | 1200x630 | JPG/WebP | 200KB |
| Content | `/blog/content/` | Varies | JPG/PNG/WebP | 500KB |
| Author | `/authors/` | 400x400 | JPG/WebP | 100KB |

---

For more details, see:
- `/public/blog/README.md` - Blog assets guide
- `/public/authors/README.md` - Authors guide
- [Astro Assets Docs](https://docs.astro.build/en/guides/images/)
