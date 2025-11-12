import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const [key, ...valueParts] = line.split("=");
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join("=").replace(/^["']|["']$/g, "");
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: envVars.PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: envVars.PUBLIC_CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});

async function uploadImages() {
  try {
    console.log("🚀 Starting Cloudinary upload...\n");

    // Upload me-avatar.png
    console.log("📸 Uploading me-avatar.png...");
    const avatarResult = await cloudinary.uploader.upload(
      join(__dirname, "..", "src", "assets", "me-avatar.png"),
      {
        public_id: "portfolio/me-avatar",
        folder: "portfolio",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
    );
    console.log("✅ Avatar uploaded:", avatarResult.secure_url);

    // Upload smc.jpg
    console.log("\n📸 Uploading smc.jpg...");
    const smcResult = await cloudinary.uploader.upload(
      join(__dirname, "..", "public", "smc.jpg"),
      {
        public_id: "portfolio/smc-cover",
        folder: "portfolio",
        transformation: [
          { width: 1200, height: 630, crop: "fill" }, // OG image size
          { quality: "auto", fetch_format: "auto" },
        ],
      },
    );
    console.log("✅ Cover image uploaded:", smcResult.secure_url);

    console.log("\n✨ All images uploaded successfully!");
    console.log("\n📋 Image IDs to use in your code:");
    console.log("  - Avatar: portfolio/me-avatar");
    console.log("  - Cover: portfolio/smc-cover");
  } catch (error) {
    console.error("❌ Error uploading images:", error);
    process.exit(1);
  }
}

uploadImages();
