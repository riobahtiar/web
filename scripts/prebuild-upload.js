import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import https from "https";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
function loadEnv() {
  const envPath = join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) {
    console.log("⚠️  .env file not found, trying environment variables...");
    return {
      PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
      PUBLIC_CLOUDINARY_API_KEY: process.env.PUBLIC_CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    };
  }

  const envContent = fs.readFileSync(envPath, "utf-8");
  const envVars = {};
  envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join("=").replace(/^["']|["']$/g, "");
    }
  });

  return envVars;
}

// Configure Cloudinary with proxy support
function configureCloudinary(envVars) {
  if (
    !envVars.PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !envVars.PUBLIC_CLOUDINARY_API_KEY ||
    !envVars.CLOUDINARY_API_SECRET
  ) {
    console.error("❌ Missing Cloudinary credentials");
    console.log("Required: PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
    process.exit(1);
  }

  // Configure with proxy support
  const config = {
    cloud_name: envVars.PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: envVars.PUBLIC_CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET,
  };

  // Add proxy if available (for CI/CD environments)
  if (process.env.https_proxy || process.env.HTTPS_PROXY) {
    const proxyUrl = process.env.https_proxy || process.env.HTTPS_PROXY;
    console.log(`🌐 Using proxy: ${proxyUrl}`);
    config.api_proxy = proxyUrl;
  }

  cloudinary.config(config);
}

// Check if asset exists (with retries)
async function assetExists(publicId, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await cloudinary.api.resource(publicId);
      return true;
    } catch (error) {
      if (error.http_code === 404 || error.error?.http_code === 404) {
        return false;
      }
      if (i < retries - 1) {
        console.log(`⚠️  Retry ${i + 1}/${retries} for checking ${publicId}...`);
        await new Promise((resolve) => setTimeout(resolve, 2000 * (i + 1)));
      } else {
        throw error;
      }
    }
  }
  return false;
}

// Upload with retries
async function uploadWithRetry(filePath, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await cloudinary.uploader.upload(filePath, options);
      return result;
    } catch (error) {
      console.error(`❌ Upload attempt ${i + 1}/${retries} failed:`, error.message);
      if (i < retries - 1) {
        const waitTime = 2000 * (i + 1);
        console.log(`⏳ Waiting ${waitTime / 1000}s before retry...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      } else {
        throw error;
      }
    }
  }
}

async function prebuildUpload() {
  console.log("🚀 Pre-build: Uploading images to Cloudinary...\n");

  // Load environment
  const envVars = loadEnv();
  configureCloudinary(envVars);

  const images = [
    {
      path: join(__dirname, "..", "src", "assets", "me-avatar.png"),
      publicId: "portfolio/me-avatar",
      folder: "portfolio",
      transformation: "w_400,h_400,c_fill,g_face",
      name: "Avatar",
    },
    {
      path: join(__dirname, "..", "public", "smc.jpg"),
      publicId: "portfolio/smc-cover",
      folder: "portfolio",
      transformation: "w_1200,h_630,c_fill",
      name: "Cover Image",
    },
  ];

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const img of images) {
    try {
      // Check if file exists
      if (!fs.existsSync(img.path)) {
        console.log(`⚠️  ${img.name}: File not found at ${img.path} (skipping)`);
        skippedCount++;
        continue;
      }

      // Check if already uploaded
      console.log(`🔍 ${img.name}: Checking if exists...`);
      const exists = await assetExists(img.publicId);

      if (exists) {
        console.log(`✅ ${img.name}: Already uploaded (skipping)`);
        skippedCount++;
        continue;
      }

      // Upload
      console.log(`📤 ${img.name}: Uploading...`);
      const result = await uploadWithRetry(img.path, {
        public_id: img.publicId,
        folder: img.folder,
        transformation: img.transformation,
        overwrite: false,
        resource_type: "auto",
      });

      console.log(`✅ ${img.name}: Uploaded successfully`);
      console.log(`   URL: ${result.secure_url}`);
      uploadedCount++;
    } catch (error) {
      console.error(`❌ ${img.name}: Failed to upload`);
      console.error(`   Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log("\n📊 Upload Summary:");
  console.log(`   ✅ Uploaded: ${uploadedCount}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);

  if (errorCount > 0) {
    console.log("\n⚠️  Some uploads failed, but continuing build...");
    console.log("   Images will be served from local files if upload failed.");
  } else {
    console.log("\n✨ All images ready on Cloudinary!");
  }

  // Don't fail the build if uploads fail - graceful degradation
  process.exit(0);
}

prebuildUpload();
