# Build-Time Cloudinary Upload

## Overview

Images are automatically uploaded to Cloudinary during the build process, ensuring your production site always uses CDN-optimized images.

## Workflow

```
Local Development → Build Time Upload → Production
      ↓                    ↓                 ↓
  Local files      Cloudinary API      CDN delivery
```

### Development
```bash
npm run dev
```
- Images served from local folders
- No Cloudinary uploads
- Fast local development

### Build & Deploy
```bash
npm run build
```
This runs:
1. **Prebuild**: Upload images to Cloudinary (if not exist)
2. **Build**: Astro build process
3. **Result**: Production site with CDN images

## Build Process Details

### Step 1: Prebuild Upload

```bash
npm run prebuild
```

**What it does:**
1. ✅ Loads Cloudinary credentials from `.env`
2. ✅ Checks each image:
   - File exists locally?
   - Already on Cloudinary?
3. ✅ Uploads only new images
4. ✅ Shows detailed logs

**Example Output:**
```
🚀 Pre-build: Uploading images to Cloudinary...

📡 Cloud Name: dzeklj6tr
🔑 API Key: 7735...1646

============================================================
📁 Processing: Avatar
   Local path: /home/user/web/src/assets/me-avatar.png
   Cloudinary ID: portfolio/me-avatar
✅ Local file exists (451.49 KB)
🔍 Checking if already on Cloudinary...
✅ Already uploaded to Cloudinary (skipping)
   URL: https://res.cloudinary.com/dzeklj6tr/image/upload/portfolio/me-avatar

============================================================
📊 Upload Summary:
   ✅ Uploaded: 0
   ⏭️  Skipped (already exists): 2
   ❌ Errors: 0

✨ All images already on Cloudinary!
```

### Step 2: Astro Build

After prebuild, Astro builds normally and uses Cloudinary URLs.

## Commands

### Standard Build (with upload)
```bash
npm run build
```
- Uploads images (if needed)
- Builds Astro site
- **Use this for production**

### Skip Upload (faster for testing)
```bash
npm run build:skip-upload
```
- Skips image upload
- Only builds Astro site
- Use when images are already uploaded

### Manual Upload
```bash
npm run prebuild
```
- Only uploads images
- Doesn't build
- Useful for testing upload

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build (includes image upload)
        env:
          PUBLIC_CLOUDINARY_CLOUD_NAME: ${{ secrets.CLOUDINARY_CLOUD_NAME }}
          PUBLIC_CLOUDINARY_API_KEY: ${{ secrets.CLOUDINARY_API_KEY }}
          CLOUDINARY_API_SECRET: ${{ secrets.CLOUDINARY_API_SECRET }}
        run: npm run build

      - name: Deploy to Cloudflare
        run: npx wrangler deploy
```

### Cloudflare Pages

In Cloudflare Pages settings:

**Build command:**
```bash
npm run build
```

**Environment variables:**
- `PUBLIC_CLOUDINARY_CLOUD_NAME`
- `PUBLIC_CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Configuration

### Environment Variables

Create `.env` file:
```bash
PUBLIC_CLOUDINARY_CLOUD_NAME="dzeklj6tr"
PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**For CI/CD:** Set these as secrets in your deployment platform.

### Add New Images

Edit `scripts/prebuild-upload-curl.js`:

```javascript
const images = [
  // Existing images
  {
    path: join(__dirname, "..", "src", "assets", "me-avatar.png"),
    publicId: "portfolio/me-avatar",
    folder: "",
    name: "Avatar",
  },

  // Add new image
  {
    path: join(__dirname, "..", "src", "assets", "new-image.jpg"),
    publicId: "portfolio/new-image",
    folder: "",
    name: "New Image",
  },
];
```

## Features

### 1. Duplicate Prevention
- ✅ Checks if image exists before upload
- ✅ Skips already uploaded images
- ✅ Only uploads new or changed images
- ✅ Saves bandwidth and time

### 2. Detailed Logging
Each image shows:
- ✅ Local file path and size
- ✅ Cloudinary public ID
- ✅ Check status (exists/not found)
- ✅ Upload progress
- ✅ Final URL and dimensions
- ✅ Summary statistics

### 3. Error Handling
- ✅ Continues build even if upload fails
- ✅ Detailed error messages
- ✅ Graceful degradation
- ✅ Never fails the build

### 4. Smart Upload
- ✅ Uses curl (reliable in all environments)
- ✅ Works behind proxies
- ✅ Handles network issues
- ✅ Retries on failure (built into curl)

## Troubleshooting

### Images not uploading

**Check credentials:**
```bash
# Test upload manually
npm run prebuild
```

**Expected output:**
- ✅ Shows cloud name and API key
- ✅ Checks each image
- ✅ Uploads or skips

### Build fails

**Skip upload to test:**
```bash
npm run build:skip-upload
```

If this works, the issue is with Cloudinary credentials.

### Images uploaded to wrong path

Check the `publicId` in script matches what's used in code:
- Script: `publicId: "portfolio/me-avatar"`
- Code: `src="portfolio/me-avatar"`

## Performance

### First Build
- Uploads all images (~2-5 seconds per image)
- Total: ~10-20 seconds for typical site

### Subsequent Builds
- Checks all images (~1 second per image)
- Skips uploaded images
- Total: ~2-5 seconds

### File Sizes
- Avatar: 451 KB → CDN optimized
- Cover: 25 KB → CDN optimized
- Build output: No image files (CDN only)

## Best Practices

### 1. Always Use npm run build
Don't use `astro build` directly. Use:
```bash
npm run build  # Includes image upload
```

### 2. Set Environment Variables in CI/CD
Never commit credentials. Use:
- GitHub Actions: Repository secrets
- Cloudflare Pages: Environment variables
- Vercel/Netlify: Environment variables

### 3. Test Locally First
Before pushing:
```bash
npm run prebuild  # Test upload
npm run build     # Test full build
```

### 4. Monitor Cloudinary Usage
Check your Cloudinary dashboard:
- Storage used
- Bandwidth used
- Transformations used

## FAQ

### Q: Do I need to upload manually?
**A:** No! The build process handles it automatically.

### Q: What if upload fails?
**A:** Build continues. Images fallback to local files.

### Q: Can I skip upload during development?
**A:** Yes! Use `npm run dev` or `npm run build:skip-upload`

### Q: How do I update an image?
**A:** Replace the local file and run `npm run build`. Same filename = automatic replacement.

### Q: What if I want to force re-upload?
**A:** Delete from Cloudinary dashboard, then run `npm run build`.

## Summary

✅ **Automatic**: Images upload during build
✅ **Smart**: Only uploads new images
✅ **Fast**: Duplicate prevention
✅ **Reliable**: Error handling
✅ **CI/CD Ready**: Works everywhere
✅ **Detailed Logs**: Know what's happening

---

**Next Steps:**
1. Run `npm run build` locally to test
2. Push to your repository
3. CI/CD will handle the rest!
