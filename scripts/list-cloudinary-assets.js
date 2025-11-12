import { loadEnv, listAssets } from "./cloudinary-utils.js";

// Load environment variables and configure Cloudinary
loadEnv();

async function main() {
  const folder = process.argv[2] || ""; // Get folder from command line or use root

  console.log(`\n🔍 Listing assets${folder ? ` in folder: ${folder}` : ""}...\n`);

  try {
    const assets = await listAssets(folder);

    if (assets.length === 0) {
      console.log("📭 No assets found.");
      return;
    }

    console.log("\n📋 Assets:\n");
    assets.forEach((asset, index) => {
      console.log(`${index + 1}. ${asset.publicId}`);
      console.log(`   URL: ${asset.url}`);
      console.log(`   Format: ${asset.format}`);
      console.log(`   Dimensions: ${asset.width}x${asset.height}`);
      console.log(`   Size: ${(asset.bytes / 1024).toFixed(2)} KB`);
      console.log(`   Created: ${new Date(asset.createdAt).toLocaleString()}`);
      console.log("");
    });

    console.log(`\n✅ Total: ${assets.length} assets`);
  } catch (error) {
    console.error("❌ Error listing assets:", error.message);
    process.exit(1);
  }
}

main();
