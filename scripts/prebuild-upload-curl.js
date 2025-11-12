import * as fs from "fs";
import * as crypto from "crypto";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { execSync } from "child_process";

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

// Generate Cloudinary signature
function generateSignature(params, apiSecret) {
  const sortedParams = Object.keys(params)
    .filter((key) => params[key] !== null && params[key] !== undefined)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(sortedParams + apiSecret).digest("hex");
}

// Check if asset exists by trying to access the public URL
function assetExists(cloudName, publicId) {
  try {
    // Try to access the image URL directly
    const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
    const result = execSync(`curl -s -o /dev/null -w "%{http_code}" "${imageUrl}"`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    const httpCode = result.trim();

    if (httpCode === "200") {
      return true;
    } else if (httpCode === "404") {
      return false;
    }

    console.log(`⚠️  Status ${httpCode} when checking ${publicId}`);
    return false;
  } catch (error) {
    console.log(`⚠️  Could not check if ${publicId} exists (will try to upload)`);
    return false;
  }
}

// Upload to Cloudinary using curl
function uploadToCloudinary(filePath, options, credentials) {
  const { cloudName, apiKey, apiSecret } = credentials;
  const { publicId, folder } = options;

  const timestamp = Math.floor(Date.now() / 1000);

  // Prepare params for signature
  const signatureParams = {
    public_id: publicId,
    timestamp,
  };

  // Only add folder if it's not empty
  if (folder) {
    signatureParams.folder = folder;
  }

  const signature = generateSignature(signatureParams, apiSecret);

  // Build curl command
  const curlParts = [
    "curl",
    "-X POST",
    `"https://api.cloudinary.com/v1_1/${cloudName}/image/upload"`,
    `-F "file=@${filePath}"`,
    `-F "api_key=${apiKey}"`,
    `-F "timestamp=${timestamp}"`,
    `-F "signature=${signature}"`,
    `-F "public_id=${publicId}"`,
  ];

  // Only add folder if it's not empty
  if (folder) {
    curlParts.push(`-F "folder=${folder}"`);
  }

  curlParts.push("-s"); // Silent

  const curlCmd = curlParts.join(" ");

  try {
    const result = execSync(curlCmd, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    const response = JSON.parse(result);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response;
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
}

async function prebuildUpload() {
  console.log("🚀 Pre-build: Uploading images to Cloudinary...\n");

  // Load environment
  const envVars = loadEnv();

  if (
    !envVars.PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !envVars.PUBLIC_CLOUDINARY_API_KEY ||
    !envVars.CLOUDINARY_API_SECRET
  ) {
    console.error("❌ Missing Cloudinary credentials");
    console.log("   Required: PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
    console.log("⚠️  Continuing build without uploading images...\n");
    process.exit(0);
  }

  console.log(`📡 Cloud Name: ${envVars.PUBLIC_CLOUDINARY_CLOUD_NAME}`);
  console.log(`🔑 API Key: ${envVars.PUBLIC_CLOUDINARY_API_KEY.substring(0, 4)}...${envVars.PUBLIC_CLOUDINARY_API_KEY.substring(envVars.PUBLIC_CLOUDINARY_API_KEY.length - 4)}\n`);

  const credentials = {
    cloudName: envVars.PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: envVars.PUBLIC_CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
  };

  const images = [
    {
      path: join(__dirname, "..", "src", "assets", "me-avatar.png"),
      publicId: "portfolio/me-avatar",
      folder: "", // Don't set folder - publicId already includes it
      name: "Avatar",
    },
    {
      path: join(__dirname, "..", "public", "smc.jpg"),
      publicId: "portfolio/smc-cover",
      folder: "", // Don't set folder - publicId already includes it
      name: "Cover Image",
    },
  ];

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const img of images) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`📁 Processing: ${img.name}`);
    console.log(`   Local path: ${img.path}`);
    console.log(`   Cloudinary ID: ${img.publicId}`);

    try {
      // Check if file exists locally
      if (!fs.existsSync(img.path)) {
        console.log(`❌ File not found locally (skipping)`);
        skippedCount++;
        continue;
      }

      const fileSize = fs.statSync(img.path).size;
      console.log(`✅ Local file exists (${(fileSize / 1024).toFixed(2)} KB)`);

      // Check if already uploaded
      console.log(`🔍 Checking if already on Cloudinary...`);
      const exists = assetExists(credentials.cloudName, img.publicId);

      if (exists) {
        console.log(`✅ Already uploaded to Cloudinary (skipping)`);
        console.log(
          `   URL: https://res.cloudinary.com/${credentials.cloudName}/image/upload/${img.publicId}`,
        );
        skippedCount++;
        continue;
      }

      console.log(`📤 Not found on Cloudinary, uploading...`);

      // Upload
      const result = uploadToCloudinary(
        img.path,
        {
          publicId: img.publicId,
          folder: img.folder,
        },
        credentials,
      );

      console.log(`✅ Upload successful!`);
      console.log(`   URL: ${result.secure_url}`);
      console.log(`   Size: ${result.width}x${result.height}`);
      console.log(`   Format: ${result.format}`);
      uploadedCount++;
    } catch (error) {
      console.error(`❌ Failed to upload`);
      console.error(`   Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("📊 Upload Summary:");
  console.log(`   ✅ Uploaded: ${uploadedCount}`);
  console.log(`   ⏭️  Skipped (already exists): ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);

  if (errorCount > 0) {
    console.log("\n⚠️  Some uploads failed, but continuing build...");
    console.log("   Images will fallback to local files if upload failed.");
  } else if (uploadedCount > 0) {
    console.log("\n✨ All new images uploaded to Cloudinary!");
  } else if (skippedCount > 0) {
    console.log("\n✨ All images already on Cloudinary!");
  }

  console.log(`${"=".repeat(60)}\n`);

  // Always exit 0 - don't fail build if upload fails
  process.exit(0);
}

prebuildUpload();
