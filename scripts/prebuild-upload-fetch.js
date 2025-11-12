import * as fs from "fs";
import * as crypto from "crypto";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import FormData from "form-data";

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

// Check if asset exists
async function assetExists(cloudName, publicId, apiKey, apiSecret) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignature({ public_id: publicId, timestamp }, apiSecret);

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload/${publicId.replace(/\//g, ":")}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
      },
    });

    if (response.status === 404) {
      return false;
    }

    if (response.ok) {
      return true;
    }

    console.log(`⚠️  Status ${response.status} when checking ${publicId}`);
    return false;
  } catch (error) {
    console.log(`⚠️  Could not check if ${publicId} exists (assuming not): ${error.message}`);
    return false;
  }
}

// Upload to Cloudinary using fetch
async function uploadToCloudinary(filePath, options, credentials) {
  const { cloudName, apiKey, apiSecret } = credentials;
  const { publicId, folder, transformation } = options;

  const timestamp = Math.floor(Date.now() / 1000);

  // Prepare params for signature (unsigned upload params)
  const signatureParams = {
    folder,
    public_id: publicId,
    timestamp,
  };

  if (transformation) {
    signatureParams.transformation = transformation;
  }

  const signature = generateSignature(signatureParams, apiSecret);

  // Create form data
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("signature", signature);
  form.append("public_id", publicId);
  form.append("folder", folder);

  if (transformation) {
    form.append("transformation", transformation);
  }

  // Upload
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: form,
    headers: form.getHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed (${response.status}): ${errorText}`);
  }

  return await response.json();
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
    console.log("⚠️  Continuing build without uploading images...");
    process.exit(0);
  }

  const credentials = {
    cloudName: envVars.PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: envVars.PUBLIC_CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
  };

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
      const exists = await assetExists(
        credentials.cloudName,
        img.publicId,
        credentials.apiKey,
        credentials.apiSecret,
      );

      if (exists) {
        console.log(`✅ ${img.name}: Already uploaded (skipping)`);
        skippedCount++;
        continue;
      }

      // Upload
      console.log(`📤 ${img.name}: Uploading...`);
      const result = await uploadToCloudinary(
        img.path,
        {
          publicId: img.publicId,
          folder: img.folder,
          transformation: img.transformation,
        },
        credentials,
      );

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
  } else if (uploadedCount > 0 || skippedCount > 0) {
    console.log("\n✨ All images ready on Cloudinary!");
  }

  // Always exit 0 - don't fail build if upload fails
  process.exit(0);
}

prebuildUpload();
