import { loadEnv, validateAssets } from "./cloudinary-utils.js";

// Load environment variables and configure Cloudinary
loadEnv();

async function main() {
  console.log("\n🔍 Validating assets used in the project...\n");

  // List of all Cloudinary asset IDs referenced in the codebase
  const referencedAssets = [
    "portfolio/me-avatar", // Welcome.astro
    "portfolio/smc-cover", // about.astro, id/about.astro, Layout.astro
    // Add more asset IDs as you use them in your project
  ];

  try {
    const results = await validateAssets(referencedAssets);

    if (results.missing.length > 0) {
      console.log("\n⚠️  Action Required:");
      console.log("Please upload the missing assets to Cloudinary:");
      console.log("  npm run cloudinary:upload\n");
      process.exit(1);
    } else {
      console.log("\n✅ All referenced assets are available on Cloudinary!");
    }
  } catch (error) {
    console.error("❌ Error validating assets:", error.message);
    process.exit(1);
  }
}

main();
