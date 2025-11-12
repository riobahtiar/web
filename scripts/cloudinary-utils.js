import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
function loadEnv() {
  const envPath = join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) {
    console.error("❌ .env file not found. Please create it with your Cloudinary credentials.");
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, "utf-8");
  const envVars = {};
  envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join("=").replace(/^["']|["']$/g, "");
    }
  });

  if (!envVars.PUBLIC_CLOUDINARY_CLOUD_NAME || !envVars.PUBLIC_CLOUDINARY_API_KEY || !envVars.CLOUDINARY_API_SECRET) {
    console.error("❌ Missing Cloudinary credentials in .env file");
    console.error("Required: PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
    process.exit(1);
  }

  cloudinary.config({
    cloud_name: envVars.PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: envVars.PUBLIC_CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET,
  });

  return envVars;
}

// Check if asset exists in Cloudinary
async function assetExists(publicId) {
  try {
    await cloudinary.api.resource(publicId);
    return true;
  } catch (error) {
    if (error.http_code === 404) {
      return false;
    }
    throw error;
  }
}

// Upload or update asset with duplicate prevention
async function uploadAsset(filePath, options = {}) {
  const {
    publicId,
    folder = "",
    transformation = [],
    overwrite = false,
    invalidate = true,
  } = options;

  // Validate file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  // Check if asset already exists
  const exists = await assetExists(publicId);

  if (exists && !overwrite) {
    console.log(`⚠️  Asset already exists: ${publicId} (skipping)`);
    return {
      skipped: true,
      publicId,
      url: cloudinary.url(publicId),
    };
  }

  const action = exists ? "Updating" : "Uploading";
  console.log(`📸 ${action} ${publicId}...`);

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      folder,
      transformation,
      overwrite,
      invalidate, // Invalidate CDN cache on update
      resource_type: "auto",
    });

    console.log(`✅ ${action === "Updating" ? "Updated" : "Uploaded"}: ${result.secure_url}`);

    return {
      success: true,
      publicId,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error(`❌ Error ${action.toLowerCase()} ${publicId}:`, error.message);
    throw error;
  }
}

// Delete asset from Cloudinary
async function deleteAsset(publicId) {
  try {
    const exists = await assetExists(publicId);

    if (!exists) {
      console.log(`⚠️  Asset not found: ${publicId} (already deleted)`);
      return { deleted: false, reason: "not_found" };
    }

    console.log(`🗑️  Deleting ${publicId}...`);
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      console.log(`✅ Deleted: ${publicId}`);
      return { deleted: true, publicId };
    } else {
      console.log(`⚠️  Failed to delete ${publicId}: ${result.result}`);
      return { deleted: false, reason: result.result };
    }
  } catch (error) {
    console.error(`❌ Error deleting ${publicId}:`, error.message);
    throw error;
  }
}

// List all assets in a folder
async function listAssets(folder = "", maxResults = 500) {
  try {
    console.log(`📋 Listing assets in folder: ${folder || "root"}...`);

    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folder,
      max_results: maxResults,
    });

    console.log(`✅ Found ${result.resources.length} assets`);

    return result.resources.map((asset) => ({
      publicId: asset.public_id,
      url: asset.secure_url,
      format: asset.format,
      width: asset.width,
      height: asset.height,
      bytes: asset.bytes,
      createdAt: asset.created_at,
    }));
  } catch (error) {
    console.error(`❌ Error listing assets:`, error.message);
    throw error;
  }
}

// Get asset info
async function getAssetInfo(publicId) {
  try {
    const result = await cloudinary.api.resource(publicId);

    return {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  } catch (error) {
    if (error.http_code === 404) {
      return null;
    }
    throw error;
  }
}

// Sync local assets to Cloudinary with smart updates
async function syncAssets(assetsConfig = []) {
  console.log(`🔄 Starting asset sync...`);

  const results = {
    uploaded: [],
    updated: [],
    skipped: [],
    errors: [],
  };

  for (const asset of assetsConfig) {
    try {
      const { filePath, publicId, ...options } = asset;

      const result = await uploadAsset(filePath, {
        publicId,
        ...options,
      });

      if (result.skipped) {
        results.skipped.push(result);
      } else if (result.success) {
        const exists = await assetExists(publicId);
        if (exists) {
          results.updated.push(result);
        } else {
          results.uploaded.push(result);
        }
      }
    } catch (error) {
      results.errors.push({
        publicId: asset.publicId,
        error: error.message,
      });
    }
  }

  // Summary
  console.log(`\n✨ Sync complete!`);
  console.log(`📊 Summary:`);
  console.log(`  - Uploaded: ${results.uploaded.length}`);
  console.log(`  - Updated: ${results.updated.length}`);
  console.log(`  - Skipped: ${results.skipped.length}`);
  console.log(`  - Errors: ${results.errors.length}`);

  if (results.errors.length > 0) {
    console.log(`\n❌ Errors:`);
    results.errors.forEach((err) => {
      console.log(`  - ${err.publicId}: ${err.error}`);
    });
  }

  return results;
}

// Validate all referenced assets exist
async function validateAssets(publicIds = []) {
  console.log(`🔍 Validating ${publicIds.length} assets...`);

  const results = {
    valid: [],
    missing: [],
  };

  for (const publicId of publicIds) {
    const exists = await assetExists(publicId);

    if (exists) {
      results.valid.push(publicId);
      console.log(`✅ ${publicId}`);
    } else {
      results.missing.push(publicId);
      console.log(`❌ Missing: ${publicId}`);
    }
  }

  console.log(`\n📊 Validation Summary:`);
  console.log(`  - Valid: ${results.valid.length}`);
  console.log(`  - Missing: ${results.missing.length}`);

  if (results.missing.length > 0) {
    console.log(`\n⚠️  Warning: ${results.missing.length} assets are missing!`);
    console.log(`Missing assets:`);
    results.missing.forEach((id) => console.log(`  - ${id}`));
  }

  return results;
}

export {
  loadEnv,
  assetExists,
  uploadAsset,
  deleteAsset,
  listAssets,
  getAssetInfo,
  syncAssets,
  validateAssets,
};
