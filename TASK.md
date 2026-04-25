# Task: Remove Cloudinary, Fix i18n, Review & Create PR

## Context

This is the `astro-rio` project (Astro 6 SSR, Cloudflare Workers, Bun, React 19, Tailwind 4). Branch: `refactor-phase-2`. Target PR: `riobahtiar/web` on GitHub.

## 1. Remove Cloudinary Integration

Cloudinary is currently used in these files:

- `src/components/Welcome.astro` - uses `CldImage` from `astro-cloudinary`
- `src/layouts/Layout.astro` - uses Cloudinary URL for OG image (`portfolio/smc-cover`)
- `src/pages/about.astro` - uses `CldImage` and Cloudinary OG image
- `src/pages/id/about.astro` - uses `CldImage` and Cloudinary OG image
- `package.json` - has `astro-cloudinary` and `cloudinary` deps + scripts

**Replacement strategy:**

- The images ALREADY exist locally:
  - `public/smc.jpg` replaces `portfolio/smc-cover`
  - `src/assets/me-avatar.png` replaces `portfolio/me-avatar`
- Remove `astro-cloudinary` and `cloudinary` from `package.json` dependencies AND scripts
- Replace `<CldImage />` with standard `<img>` tags (Cloudflare Workers passthrough image mode works best with simple img tags)
- Update OG image meta tags to use `/smc.jpg` (local path)
- Delete Cloudinary-related scripts in `scripts/` folder:
  - `scripts/upload-to-cloudinary.js`
  - `scripts/list-cloudinary-assets.js`
  - `scripts/validate-cloudinary-assets.js`
  - `scripts/delete-cloudinary-asset.js`
- Remove Cloudinary env vars references from code (`PUBLIC_CLOUDINARY_CLOUD_NAME`)
- Run `bun install` after package.json changes
- Run `bun run typecheck` and `bun run build` to verify

## 2. Check i18n (English & Indonesian)

- Compare `src/i18n/en.ts` and `src/i18n/id.ts` structurally
- Ensure both have the same keys and nested structure
- Check that `src/i18n/id.ts` has complete translations (no missing keys vs en.ts)
- Check that all pages have both `/` and `/id/` versions where appropriate
- Check that navigation links, meta tags, and OG tags use proper i18n
- Verify blog content collections (`src/content/blog-en/` and `src/content/blog-id/`) have matching structure

## 3. Review & Validate All Changes

After making changes:

```bash
bun run typecheck
bun run format:check
bun run build
```

Fix any issues found. Do NOT proceed to PR if build fails.

## 4. Create PR

Once everything passes:

1. Commit all changes with a clear message: `refactor: remove Cloudinary, use local images, fix i18n alignment`
2. Push the `refactor-phase-2` branch to origin
3. Create a GitHub PR using `gh pr create` with:
   - Title: `refactor: remove Cloudinary dependency, use local assets, fix i18n`
   - Body describing: (a) Cloudinary removal rationale, (b) i18n fixes, (c) testing done

## IMPORTANT RULES

- Use Bun exclusively (no npm)
- Follow the project's AGENTS.md style guide
- Do NOT change visual design or styling unless broken
- Do NOT remove any actual content, only the Cloudinary integration
- If you encounter any decision that changes project architecture, STOP and ask
- Auto-approve tool permissions when prompted (this is authorized)

## DECISION CHECKPOINTS (stop and ask if these come up)

- Switching image pipeline to Cloudflare Images instead of local
- Changing i18n routing strategy
- Modifying content collection schemas
- Adding new dependencies
