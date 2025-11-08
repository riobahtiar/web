# Claude Development Guidelines for Astro Rio

This document provides comprehensive guidelines for AI assistants (Claude) and developers working on this project.

## 🎯 Project Overview

**astro-rio** is a production-grade, bilingual portfolio and blog built with Astro 5, deployed on Cloudflare Workers with SSR.

### Key Characteristics

- **Server-Side Rendering (SSR)** - Dynamic routes, no static generation
- **Bilingual** - English (default) and Indonesian (id) support
- **Type-Safe** - Strict TypeScript, Zod-validated content
- **Production-Ready** - Deployed on Cloudflare Workers edge network

## 📋 Development Commands

### Essential Commands

```bash
# Development
npm run dev              # Start dev server (localhost:4321)
npm run build            # Build for production
npm run preview          # Preview production build locally

# Quality Assurance
npx astro check          # TypeScript type checking
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm audit                # Check for security vulnerabilities
```

### Pre-Commit Checklist

Before committing code, always run:

```bash
npx astro check          # ✅ Type check
npm run format           # ✅ Format code
npm run build            # ✅ Ensure build succeeds
npm audit                # ✅ Check security
```

## 💻 Code Style & Standards

### TypeScript

- **Strict Mode**: Always enabled (`extends astro/tsconfigs/strict`)
- **Type Imports**: Use `import type` for type-only imports
- **Explicit Types**: Define return types for functions
- **No `any`**: Use `unknown` or proper types instead

```typescript
// ✅ Good
import type { GetStaticPaths } from "astro";
import { getCollection } from "astro:content";

function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

// ❌ Bad
import { GetStaticPaths } from "astro";
const formatDate = (date: any) => date.toLocaleDateString();
```

### File Naming Conventions

- **Pages**: `kebab-case.astro` (e.g., `about.astro`, `blog-post.astro`)
- **Components**: `PascalCase.astro` or `PascalCase.tsx`
- **Utilities**: `camelCase.ts` (e.g., `formatDate.ts`, `utils.ts`)
- **Content**: `kebab-case.mdx` (e.g., `introduction-to-astro.mdx`)

### Import Organization

Group and order imports as follows:

```typescript
// 1. Type imports
import type { CollectionEntry } from "astro:content";

// 2. External libraries
import { getCollection } from "astro:content";
import { Image } from "astro:assets";

// 3. Internal components
import Layout from "../../layouts/Layout.astro";
import BlogPost from "../components/BlogPost.astro";

// 4. Utilities
import { formatDate } from "@/utils/date";
import { cn } from "@/lib/utils";

// 5. Assets
import profileImage from "../assets/me-avatar.png";
```

### Path Aliases

Always use path aliases for internal imports:

```typescript
// ✅ Good
import { cn } from "@/lib/utils";
import Header from "@/components/Header.astro";

// ❌ Bad
import { cn } from "../../lib/utils";
import Header from "../components/Header.astro";
```

## 🏗️ Architecture Patterns

### SSR Routes (Server-Side Rendering)

**IMPORTANT**: This project uses SSR mode (`output: "server"`). Do NOT use `getStaticPaths()` in dynamic routes.

```astro
---
// ✅ Correct SSR Pattern
import { getCollection } from "astro:content";

// Get params from URL (SSR mode)
const { slug } = Astro.params;

// Fetch data dynamically on each request
const posts = await getCollection("blog-en");
const post = posts.find((p) => p.slug === slug);

if (!post) {
  return Astro.redirect("/404");
}
---

// ❌ WRONG - Don't use this in SSR mode
export const getStaticPaths = async () => {
  // This will cause build warnings in SSR mode
  return [];
};
```

## 🌍 Internationalization (i18n)

### Translation Files

Translations are stored in `src/i18n/`:

```typescript
// src/i18n/en.ts
export const en = {
  nav: {
    home: "Home",
    about: "About",
    contact: "Contact",
  },
  // ... more translations
};

// src/i18n/id.ts
export const id = {
  nav: {
    home: "Beranda",
    about: "Tentang",
    contact: "Kontak",
  },
  // ... more translations
};
```

### Using Translations

```astro
---
import { en } from "../i18n/en";
import { id } from "../i18n/id";

const pathname = Astro.url.pathname;
const lang = pathname.startsWith("/id/") ? "id" : "en";
const i18n = lang === "id" ? id : en;
---

<h1>{i18n.nav.home}</h1>
```

### URL Structure

- **English (default)**: `/about`, `/services`, `/contact`
- **Indonesian**: `/id/about`, `/id/services`, `/id/contact`

## 🎨 Styling Guidelines

### Tailwind CSS

Use Tailwind utility classes:

```astro
<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-primary">Title</h1>
  <p class="mt-4 text-base-content opacity-80">Description</p>
</div>
```

### DaisyUI Components

Leverage DaisyUI for common components:

```astro
<button class="btn btn-primary">Primary Button</button>
<div class="card bg-base-200">
  <div class="card-body">
    <h2 class="card-title">Card Title</h2>
    <p>Card content</p>
  </div>
</div>
```

### Custom Utilities

Use the `cn()` utility for conditional classes:

```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" && "primary-class"
)}>
  Content
</div>
```

## 🔒 Security Best Practices

### Input Validation

Always validate and sanitize user input:

```typescript
// ✅ Good
const page = parseInt(Astro.params.page || "1", 10);
if (isNaN(page) || page < 1) {
  return Astro.redirect("/404");
}

// ❌ Bad
const page = Astro.params.page; // Unvalidated
```

## 🚀 Performance Optimization

### Image Optimization

```astro
---
import { Image } from "astro:assets";
import heroImage from "../assets/hero.jpg";
---

<Image
  src={heroImage}
  alt="Hero image"
  width={1200}
  height={600}
  loading="lazy"
  decoding="async"
/>
```

## 📦 Deployment

### Pre-Deployment Checklist

- [ ] Run `npx astro check` (no errors)
- [ ] Run `npm run build` (succeeds)
- [ ] Run `npm audit` (no critical vulnerabilities)
- [ ] Test preview build locally
- [ ] Update version in package.json

### Deployment Process

```bash
# 1. Build
npm run build

# 2. Deploy to Cloudflare Workers
npx wrangler deploy

# 3. Verify deployment
# Visit https://web.riomyid.workers.dev
```

## ⚠️ Important Notes

### DO

- ✅ Use SSR patterns (Astro.params, dynamic data fetching)
- ✅ Validate all user input
- ✅ Keep dependencies up-to-date
- ✅ Write type-safe code
- ✅ Test both languages
- ✅ Follow naming conventions
- ✅ Use path aliases

### DON'T

- ❌ Use `getStaticPaths()` in SSR mode
- ❌ Commit sensitive data
- ❌ Use `any` type
- ❌ Skip type checking
- ❌ Ignore build warnings
- ❌ Hard-code translations
- ❌ Use relative imports for internal modules

---

For more details, see:
- [README.md](./README.md) - Project overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
