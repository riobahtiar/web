# Cloudinary Upload Script

This script uploads your local images to Cloudinary for optimized delivery.

## Prerequisites

1. **Cloudinary Account:** Sign up at [cloudinary.com](https://cloudinary.com)
2. **Environment Variables:** Set up your `.env` file in the project root

## Setup

1. **Create `.env` file** in the project root:

```bash
PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

2. **Get your credentials:**
   - Log in to [Cloudinary Dashboard](https://cloudinary.com/console)
   - Find "Account Details" on the dashboard
   - Copy Cloud Name, API Key, and API Secret

## Usage

### Upload All Images

```bash
npm run cloudinary:upload
```

This will upload:

- `src/assets/me-avatar.png` → `portfolio/me-avatar`
- `public/smc.jpg` → `portfolio/smc-cover`

### Verify Upload

After running the script, you should see:

```
🚀 Starting Cloudinary upload...

📸 Uploading me-avatar.png...
✅ Avatar uploaded: https://res.cloudinary.com/...

📸 Uploading smc.jpg...
✅ Cover image uploaded: https://res.cloudinary.com/...

✨ All images uploaded successfully!

📋 Image IDs to use in your code:
  - Avatar: portfolio/me-avatar
  - Cover: portfolio/smc-cover
```

## Customizing the Script

To upload additional images, edit `upload-to-cloudinary.js`:

```javascript
// Add more uploads
const result = await cloudinary.uploader.upload("path/to/your/image.jpg", {
  public_id: "folder/image-name",
  folder: "folder",
  transformation: [
    { width: 1200, height: 630, crop: "fill" },
    { quality: "auto", fetch_format: "auto" },
  ],
});
```

## Image Transformations

The script includes automatic optimizations:

- **Avatar:** 400×400px, cropped to face, auto format
- **Cover:** 1200×630px (OG image size), auto format
- **Quality:** Automatic optimization
- **Format:** Auto (WebP/AVIF for modern browsers)

## Troubleshooting

### "Invalid credentials" Error

- Check your `.env` file for typos
- Ensure no extra spaces or quotes around values
- Verify credentials in Cloudinary dashboard

### "File not found" Error

- Verify the file paths in the script
- Check that files exist in `src/assets/` or `public/`

### "Module not found: cloudinary"

```bash
npm install cloudinary --save-dev
```

## Manual Upload Alternative

If the script doesn't work, you can upload manually:

1. Go to [Cloudinary Media Library](https://cloudinary.com/console/media_library)
2. Click "Upload"
3. Upload your images
4. Organize in folders: `portfolio/`, `blog/`, etc.
5. Note the Public ID for each image

## Next Steps

After uploading images:

1. ✅ Images are now on Cloudinary CDN
2. ✅ Your code already uses Cloudinary URLs
3. ✅ Build and deploy: `npm run build`

For more details, see [CLOUDINARY.md](../CLOUDINARY.md)
