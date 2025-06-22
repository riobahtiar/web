# Claude Guidelines for astro-rio

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npx astro check` - Run type checking

## Code Style
- Use TypeScript with strict mode (extends astro/tsconfigs/strict)
- React components use `.tsx` extension with JSX format
- Astro components use `.astro` extension
- Content uses `.mdx` for markdown with components

## Imports
- Use path aliases: `@/components`, `@/lib/utils`, etc.
- Group imports by external libraries first, then internal modules

## Naming & Structure
- React components: PascalCase
- Functions/utilities: camelCase 
- Files: kebab-case for pages, PascalCase for components
- Use CSS-in-JS with Tailwind (via clsx/tailwind-merge utilities)

## i18n Support
- Content in both English (en) and Indonesian (id)
- Default locale is "en" (non-prefixed paths)
- Indonesian content uses "/id" path prefix