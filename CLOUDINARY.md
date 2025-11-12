# Cloudinary Image Management Guide

This guide explains how to manage images and assets using Cloudinary in your Astro project.

## Table of Contents

- [Overview](#overview)
- [Setup & Configuration](#setup--configuration)
- [Uploading Images](#uploading-images)
- [Using Images in Components](#using-images-in-components)
- [Using Images in Blog Posts](#using-images-in-blog-posts)
- [Image Optimization Best Practices](#image-optimization-best-practices)
- [Managing Assets (CRUD)](#managing-assets-crud)
- [Troubleshooting](#troubleshooting)

## Overview

We use Cloudinary as our CDN for all images and media assets. Benefits include:

- ✅ **Automatic optimization** - Images are automatically converted to WebP/AVIF
- ✅ **Responsive images** - Proper sizing for different devices
- ✅ **Fast delivery** - Global CDN ensures fast loading times
- ✅ **Transformations** - Resize, crop, and apply effects on-the-fly
- ✅ **Reduced bundle size** - Images are served from CDN, not bundled

## Setup & Configuration

### Environment Variables

1. **For Development:** Create a `.env` file in the project root:

```bash
PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

2. **For Production (Cloudflare):** Set these environment variables in your Cloudflare Workers dashboard:
   - Go to Workers & Pages → Your project → Settings → Environment Variables
   - Add the three variables above

### Get Your Credentials

1. Log in to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Find your credentials on the dashboard home page
3. Copy the Cloud Name, API Key, and API Secret

## Uploading Images

### Method 1: Using the Upload Script (Recommended for Initial Setup)

1. **Fill in your `.env` file** with your Cloudinary credentials

2. **Add your images** to the appropriate folders:

   - `src/assets/` - For component images (avatars, logos, etc.)
   - `public/` - For static assets

3. **Run the upload script:**

```bash
npm run cloudinary:upload
```

This will upload:

- Profile avatar → `portfolio/me-avatar`
- Cover image → `portfolio/smc-cover`

### Method 2: Manual Upload via Cloudinary Dashboard

1. Go to [Cloudinary Media Library](https://cloudinary.com/console/media_library)
2. Click "Upload" button
3. Select your images
4. **Organize in folders:**

   - `portfolio/` - Personal/portfolio images
   - `blog/` - Blog post images
   - `projects/` - Project screenshots

5. **Note the Public ID** (e.g., `portfolio/me-avatar`)

### Method 3: Upload via CLI (Advanced)

```bash
# Install Cloudinary CLI
npm install -g cloudinary-cli

# Configure
cloudinary config:set cloud_name=your-cloud-name api_key=your-api-key api_secret=your-api-secret

# Upload
cloudinary upload src/assets/my-image.jpg -public_id portfolio/my-image
```

## Using Images in Components

### Basic Usage with CldImage

```astro
---
import { CldImage } from "astro-cloudinary";
---

<CldImage
  src="portfolio/me-avatar"
  alt="Profile picture"
  width={400}
  height={400}
  crop="fill"
  gravity="face"
  format="auto"
  quality="auto"
/>
```

### Component Props Explained

| Prop      | Description               | Example                        |
| --------- | ------------------------- | ------------------------------ |
| `src`     | Public ID from Cloudinary | `"portfolio/me-avatar"`        |
| `width`   | Image width in pixels     | `400`                          |
| `height`  | Image height in pixels    | `400`                          |
| `crop`    | Crop mode                 | `"fill"`, `"fit"`, `"scale"`   |
| `gravity` | Focus area                | `"face"`, `"center"`, `"auto"` |
| `format`  | Output format             | `"auto"` (WebP/AVIF)           |
| `quality` | Quality level             | `"auto"`, `80`, `90`           |
| `loading` | Loading strategy          | `"lazy"`, `"eager"`            |

### Advanced Transformations

```astro
<!-- Circular avatar with border -->
<CldImage
  src="portfolio/me-avatar"
  width={200}
  height={200}
  crop="fill"
  gravity="face"
  radius="max"
  border="5px_solid_rgb:3b82f6"
  format="auto"
  quality="auto"
/>

<!-- Background removal -->
<CldImage
  src="portfolio/product"
  width={800}
  height={600}
  removeBackground
  format="png"
  quality="auto"
/>
```

## Using Images in Blog Posts

### Option 1: Direct URLs in Markdown

In your `.mdx` blog posts, use Cloudinary URLs directly:

```mdx
---
title: "My Blog Post"
image: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_1200,h_630,c_fill,f_auto,q_auto/blog/my-post-cover"
---

## My Post

![Article Image](https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_800,h_600,c_fill,f_auto,q_auto/blog/article-image)
```

### Option 2: Using CldImage in MDX

```mdx
---
title: "My Blog Post"
---

import { CldImage } from "astro-cloudinary";

<CldImage
  src="blog/article-image"
  width={800}
  height={600}
  alt="Article illustration"
  crop="fill"
  format="auto"
  quality="auto"
/>
```

### Option 3: Create a Reusable Component

Create `src/components/blog/BlogImage.astro`:

```astro
---
interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

import { CldImage } from "astro-cloudinary";

const { src, alt, width = 800, height = 600 } = Astro.props;
---

<figure class="my-8">
  <CldImage
    src={src}
    alt={alt}
    width={width}
    height={height}
    crop="fill"
    format="auto"
    quality="auto"
    loading="lazy"
    class="rounded-lg shadow-lg"
  />
  {
    alt && (
      <figcaption class="mt-2 text-center text-sm text-gray-600">
        {alt}
      </figcaption>
    )
  }
</figure>
```

Then use it in your MDX:

```mdx
import BlogImage from "../../components/blog/BlogImage.astro";

<BlogImage src="blog/my-image" alt="My amazing image" />
```

## Image Optimization Best Practices

### Recommended Sizes

| Use Case          | Width     | Height    | Crop   | Quality |
| ----------------- | --------- | --------- | ------ | ------- |
| Avatar            | 200-400px | 200-400px | `fill` | `auto`  |
| Blog Cover (OG)   | 1200px    | 630px     | `fill` | `auto`  |
| Blog Content      | 800px     | 600px     | `fill` | `auto`  |
| Gallery Thumbnail | 400px     | 300px     | `fill` | `auto`  |
| Full Width Image  | 1920px    | 1080px    | `fit`  | `auto`  |

### Format Selection

- **Always use `format="auto"`** - Cloudinary automatically serves WebP/AVIF to supported browsers
- For transparency: Use `format="png"` only when needed
- For logos: Use inline SVG components (see existing logo components)

### Quality Settings

- **Use `quality="auto"`** for most cases - Cloudinary optimizes automatically
- For high-quality photos: `quality={90}`
- For thumbnails: `quality={80}`

### Loading Strategy

- **Hero images**: `loading="eager"`
- **Below the fold**: `loading="lazy"` (default)

## Managing Assets (CRUD)

### Create (Upload)

**Via Dashboard:**

1. Go to Cloudinary Media Library
2. Click "Upload"
3. Select files or drag & drop
4. Set folder (e.g., `blog/`, `portfolio/`)
5. Click "Upload"

**Via Script:**

```bash
npm run cloudinary:upload
```

**Via Code:**

```javascript
// scripts/upload-custom.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.uploader.upload("path/to/image.jpg", {
  public_id: "blog/my-new-image",
  folder: "blog",
  transformation: [
    { width: 1200, height: 630, crop: "fill" },
    { quality: "auto", fetch_format: "auto" },
  ],
});
```

### Read (View/List)

**Via Dashboard:**

- Go to Media Library
- Browse folders
- Search by name/tag

**Via Code:**

```javascript
// List all images in a folder
const result = await cloudinary.api.resources({
  type: "upload",
  prefix: "blog/",
  max_results: 100,
});
```

### Update (Replace/Transform)

**Replace Image:**

1. Go to Media Library
2. Find the image
3. Click "Replace"
4. Upload new file (keeps same Public ID)

**Update Transformations:**
Images are transformed on-the-fly via URL. No update needed.

### Delete

**Via Dashboard:**

1. Go to Media Library
2. Select image(s)
3. Click "Delete"

**Via Code:**

```javascript
await cloudinary.uploader.destroy("blog/old-image");
```

## Folder Structure

Organize your Cloudinary assets in folders:

```
portfolio/
  ├── me-avatar          # Profile picture
  ├── smc-cover          # About page cover
  └── ...

blog/
  ├── post-slug-1/
  │   ├── cover          # Blog post cover image
  │   ├── image-1        # Content images
  │   └── image-2
  └── post-slug-2/
      └── ...

projects/
  ├── project-1-screenshot
  ├── project-2-demo
  └── ...
```

## For Content Creators

### Quick Start: Adding Images to Blog Posts

1. **Upload your image:**

   - Go to [Cloudinary Media Library](https://cloudinary.com/console/media_library)
   - Click "Upload"
   - Put it in the `blog/` folder
   - Give it a clear name (e.g., `my-post-cover`)

2. **Get the Public ID:**

   - After upload, note the path shown (e.g., `blog/my-post-cover`)

3. **Add to your blog post:**

   **For cover image (frontmatter):**

   ```mdx
   ---
   title: "My Post"
   image: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_1200,h_630,c_fill,f_auto,q_auto/blog/my-post-cover"
   ---
   ```

   **For content images:**

   ```mdx
   ![Description](https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_800,c_fill,f_auto,q_auto/blog/my-image)
   ```

4. **Replace `YOUR_CLOUD_NAME`** with your actual cloud name from `.env`

### Image Size Guidelines for Blog Posts

- **Cover images (OG):** 1200×630px (16:9 ratio)
- **Content images:** 800-1200px wide
- **Small images/icons:** 200-400px

## Troubleshooting

### Images Not Loading

1. **Check environment variables:**

   ```bash
   echo $PUBLIC_CLOUDINARY_CLOUD_NAME
   ```

2. **Verify Public ID:**

   - Check exact path in Cloudinary Media Library
   - Public ID is case-sensitive

3. **Check browser console:**
   - Look for 404 errors
   - Verify the generated URL is correct

### Build Errors

**Error: "Cloudinary environment variables not set"**

- Ensure `.env` file exists and has correct values
- For Cloudflare, check environment variables in dashboard

**Error: "Cannot find module 'astro-cloudinary'"**

```bash
npm install astro-cloudinary
```

### Upload Script Errors

**Error: "Invalid credentials"**

- Double-check `.env` file
- Ensure no extra spaces or quotes in values

**Error: "File not found"**

- Verify file paths in upload script
- Check that files exist in the specified locations

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [astro-cloudinary Package](https://astro-cloudinary.dev/)
- [Cloudinary Transformations](https://cloudinary.com/documentation/image_transformations)
- [Cloudinary Media Library](https://cloudinary.com/console/media_library)

## Need Help?

- Check the [Cloudinary Community](https://community.cloudinary.com/)
- Review [Astro Cloudinary Examples](https://github.com/cloudinary-community/astro-cloudinary)
- Ask in the project's issue tracker

---

**Last Updated:** November 2025
