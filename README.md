# Astro Rio - Personal Portfolio & Blog

A modern, bilingual (English/Indonesian) portfolio and blog website built with Astro 5, deployed on Cloudflare Workers with SSR.

## 🌟 Features

- **Server-Side Rendering (SSR)** - Dynamic content delivery via Cloudflare Workers
- **Bilingual Support** - Full internationalization (English & Indonesian)
- **Type-Safe Content** - Zod-validated content collections
- **Modern Stack** - Astro 5 + React 19 + TypeScript
- **Styling** - Tailwind CSS 4 + DaisyUI + ShadCN UI components
- **SEO Optimized** - Comprehensive meta tags, sitemap, hreflang
- **Performance** - Edge deployment, image optimization, Partytown analytics
- **Blog System** - MDX-powered blog with categories, tags, and pagination

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x or higher
- npm 10.x or higher
- Cloudflare account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/riobahtiar/web.git
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see your site.

## 📁 Project Structure

```
├── public/               # Static assets (favicons, images)
├── src/
│   ├── assets/          # Source assets (images, global CSS)
│   ├── components/      # Astro & React components
│   │   └── ui/         # ShadCN-style React components
│   ├── content/         # Content collections
│   │   ├── blog-en/    # English blog posts
│   │   └── blog-id/    # Indonesian blog posts
│   ├── i18n/           # Translation files
│   │   ├── en.ts       # English translations
│   │   ├── id.ts       # Indonesian translations
│   │   ├── technology.ts
│   │   └── clients.ts
│   ├── layouts/        # Page layouts
│   │   ├── Layout.astro
│   │   ├── BlogPost.astro
│   │   └── BlogIndex.astro
│   ├── lib/            # Shared utilities
│   ├── pages/          # File-based routing
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── services.astro
│   │   ├── contact.astro
│   │   ├── blog/       # English blog routes
│   │   └── id/         # Indonesian pages
│   ├── styles/         # Style configurations
│   └── utils/          # Utility functions
├── astro.config.mjs    # Astro configuration
├── wrangler.toml       # Cloudflare Workers config
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies & scripts
```

## 🛠️ Development

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build for production to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npx astro check` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

### Development Workflow

1. **Start the dev server**: `npm run dev`
2. **Make changes**: Edit files in `src/`
3. **Check types**: `npx astro check`
4. **Format code**: `npm run format`
5. **Build**: `npm run build`
6. **Preview**: `npm run preview`

### Adding Content

#### Blog Posts

Create new MDX files in `src/content/blog-en/` or `src/content/blog-id/`:

```mdx
---
title: "Your Post Title"
description: "Post description"
created_at: 2025-11-08
modified_at: 2025-11-08
category: "web-development"
tags: ["astro", "typescript"]
author:
  name: "Rio Bahtiar"
  image: "/author.jpg"
  bio: "Full-stack developer"
draft: false
---

Your content here...
```

#### Pages

Add new routes in `src/pages/` for English and `src/pages/id/` for Indonesian.

## 🎨 Tech Stack

### Core

- **Framework**: [Astro](https://astro.build) 5.15.4
- **UI Library**: [React](https://react.dev) 19.2.0
- **Language**: [TypeScript](https://www.typescriptlang.org) (strict mode)
- **Runtime**: Cloudflare Workers (Node.js compat v2)

### Styling

- **CSS Framework**: [Tailwind CSS](https://tailwindcss.com) 4.1.17
- **Component Library**: [DaisyUI](https://daisyui.com) 5.4.7
- **UI Components**: [Radix UI](https://www.radix-ui.com) primitives
- **Icons**: [Lucide React](https://lucide.dev) + Iconify (Tabler)
- **Utilities**: `clsx`, `tailwind-merge`, `class-variance-authority`

### Content

- **Format**: MDX & Markdoc
- **Validation**: Zod schemas
- **Collections**: Type-safe content collections

### Features

- **SEO**: Auto-generated sitemap
- **Analytics**: Google Analytics (via Partytown)
- **Images**: Cloudflare Images integration
- **i18n**: Custom pathname-based routing

### Deployment

- **Platform**: Cloudflare Workers
- **Adapter**: `@astrojs/cloudflare` 12.6.10
- **CLI**: Wrangler 4.46.0
- **Storage**: Cloudflare KV (sessions)

## 🌍 Internationalization

The site supports English (default) and Indonesian:

- **English**: `/about`, `/services`, `/contact`
- **Indonesian**: `/id/about`, `/id/services`, `/id/contact`

Translations are managed in `src/i18n/`:
- `en.ts` - English translations
- `id.ts` - Indonesian translations

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

### Quick Deploy

```bash
# Ensure KV namespace is created and configured in wrangler.toml
npm run build
npx wrangler deploy
```

Site will be live at: `https://web.riomyid.workers.dev`

### Environment Variables

No environment variables required for basic deployment. All configuration is in:
- `astro.config.mjs` - Astro settings
- `wrangler.toml` - Cloudflare Workers settings

## 📊 Project Stats

- **Build Time**: ~6-7 seconds
- **Bundle Size**: ~195 KB (client)
- **Languages**: 2 (English, Indonesian)
- **Routes**: 20+ pages
- **Type Safety**: 100% TypeScript

## 🔧 Configuration

### Key Files

- **`astro.config.mjs`** - Astro and integration settings
- **`wrangler.toml`** - Cloudflare Workers configuration
- **`tsconfig.json`** - TypeScript compiler options
- **`components.json`** - ShadCN UI configuration
- **`.prettierrc.mjs`** - Code formatting rules

### Customization

1. **Site URL**: Update `site` in `astro.config.mjs`
2. **Branding**: Replace logos in `src/assets/`
3. **Colors**: Modify theme in `src/assets/global.css`
4. **Content**: Edit translations in `src/i18n/`

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## 📄 License

This project is proprietary. All rights reserved.

## 🔗 Links

- **Live Site**: https://web.riomyid.workers.dev
- **GitHub**: https://github.com/riobahtiar/web
- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📧 Contact

Rio Bahtiar - [Contact Page](https://web.riomyid.workers.dev/contact)

---

Built with ❤️ using [Astro](https://astro.build) and deployed on [Cloudflare Workers](https://workers.cloudflare.com)
