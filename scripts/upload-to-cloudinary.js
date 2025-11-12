import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { loadEnv, syncAssets } from "./cloudinary-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables and configure Cloudinary
loadEnv();

async function uploadImages() {
  try {
    console.log("🚀 Starting Cloudinary upload with smart sync...\n");

    // Define assets to upload with duplicate prevention
    const assets = [
      {
        filePath: join(__dirname, "..", "src", "assets", "me-avatar.png"),
        publicId: "portfolio/me-avatar",
        folder: "portfolio",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
        overwrite: false, // Don't overwrite existing assets by default
      },
      {
        filePath: join(__dirname, "..", "public", "smc.jpg"),
        publicId: "portfolio/smc-cover",
        folder: "portfolio",
        transformation: [
          { width: 1200, height: 630, crop: "fill" }, // OG image size
          { quality: "auto", fetch_format: "auto" },
        ],
        overwrite: false,
      },
    ];

    // Sync assets with duplicate prevention
    const results = await syncAssets(assets);

    if (results.errors.length === 0) {
      console.log("\n📋 Image IDs to use in your code:");
      console.log("  - Avatar: portfolio/me-avatar");
      console.log("  - Cover: portfolio/smc-cover");
      console.log("\n💡 Tip: Set overwrite: true to force update existing images");
    } else {
      console.error("\n⚠️  Some uploads failed. Check the errors above.");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error uploading images:", error.message);
    process.exit(1);
  }
}

uploadImages();
