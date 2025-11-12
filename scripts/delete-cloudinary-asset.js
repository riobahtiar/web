import { loadEnv, deleteAsset } from "./cloudinary-utils.js";

// Load environment variables and configure Cloudinary
loadEnv();

async function main() {
  const publicId = process.argv[2];

  if (!publicId) {
    console.error("❌ Usage: node delete-cloudinary-asset.js <public_id>");
    console.log("Example: node delete-cloudinary-asset.js portfolio/old-image");
    process.exit(1);
  }

  console.log(`\n⚠️  WARNING: You are about to delete: ${publicId}`);
  console.log("This action cannot be undone!");
  console.log("\nPress Ctrl+C to cancel, or wait 5 seconds to continue...\n");

  // Wait 5 seconds before deleting
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    const result = await deleteAsset(publicId);

    if (result.deleted) {
      console.log("\n✅ Asset deleted successfully!");
    } else {
      console.log(`\n⚠️  Asset not deleted: ${result.reason}`);
    }
  } catch (error) {
    console.error("❌ Error deleting asset:", error.message);
    process.exit(1);
  }
}

main();
