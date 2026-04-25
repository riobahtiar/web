# Blog Writing Guide

This guide covers writing and publishing MDX posts for the Astro Rio bilingual blog.

## Content Locations

- English posts: `src/content/blog-en/<category>/<slug>.mdx`
- Indonesian posts: `src/content/blog-id/<category>/<slug>.mdx`
- Templates: `src/content/blog-en/tutorial/_template.mdx` and `src/content/blog-id/tutorial/_template.mdx`

Files beginning with `_` are ignored by the collection loader.

## Frontmatter

The schema is defined in [src/content.config.ts](./src/content.config.ts).

```yaml
---
title: "Your Post Title"
description: "A concise description for SEO and social sharing"
created_at: 2026-04-25
modified_at: 2026-04-25
image: "/blog/covers/my-post-cover.jpg"
category: "web-development"
tags: ["astro", "typescript", "cloudflare"]
author:
  name: "Rio Bahtiar"
  image: "/authors/rio-bahtiar.jpg"
  bio: "Full-stack Developer"
draft: false
---
```

Fields:

| Field         | Required | Notes                                     |
| ------------- | -------- | ----------------------------------------- |
| `title`       | Yes      | Keep clear and specific.                  |
| `description` | Yes      | Used for summaries and meta descriptions. |
| `created_at`  | Yes      | Use `YYYY-MM-DD`.                         |
| `modified_at` | Yes      | Update when content materially changes.   |
| `image`       | No       | Strongly recommended for social previews. |
| `category`    | Yes      | Should match the category folder.         |
| `tags`        | Yes      | Use lowercase, consistent tags.           |
| `author`      | Yes      | Requires `name`, `image`, and `bio`.      |
| `draft`       | No       | Defaults to `false`.                      |

## URL Rules

URLs are generated from locale, category, and filename:

- `src/content/blog-en/web-development/getting-started.mdx` -> `/blog/web-development/getting-started`
- `src/content/blog-id/pengembangan-web/memulai.mdx` -> `/id/blog/pengembangan-web/memulai`

Astro 6 loader-backed entries use `entry.id`, not legacy `entry.slug`. Keep filenames and category folders in kebab-case.

## Local Authoring Flow

```bash
bun run dev
bun run typecheck
bun run build
```

Use the browser to verify:

- Post route renders.
- Category and tag pages include the post.
- Related posts render correctly.
- Table of contents anchors work.
- RSS includes the post at `/rss.xml` or `/id/rss.xml`.

## MDX Components

Import components at the top of the MDX body after frontmatter.

### Callout

```mdx
import Callout from "@/components/blog/Callout.astro";

<Callout type="info" title="Note">
  This is an informational callout.
</Callout>
```

Supported `type` values: `info`, `warning`, `error`, `success`, `tip`.

### Banner

```mdx
import Banner from "@/components/blog/Banner.astro";

<Banner type="gradient" icon="tabler:rocket">
  **Announcement:** New content is available.
</Banner>
```

Supported `type` values: `default`, `gradient`, `bordered`.

### CTA

```mdx
import CTA from "@/components/blog/CTA.astro";

<CTA
  title="Ready to build?"
  description="Start your next Astro project with a production-ready setup."
  buttonText="Contact Rio"
  buttonLink="/contact"
  variant="primary"
  align="center"
/>
```

Supported `variant` values: `primary`, `secondary`, `accent`.

### Steps

```mdx
import Steps from "@/components/blog/Steps.astro";

<Steps>
<div class="step">

### Step 1: Install

Run `bun install`.

</div>
<div class="step">

### Step 2: Develop

Run `bun run dev`.

</div>
</Steps>
```

### Quote

```mdx
import Quote from "@/components/blog/Quote.astro";

<Quote author="Grace Hopper" role="Computer scientist">
  The most dangerous phrase is, "We've always done it this way."
</Quote>
```

### Accordion

```mdx
import Accordion from "@/components/blog/Accordion.astro";

<Accordion title="What is Astro?" open>
  Astro is a web framework optimized for content-driven sites.
</Accordion>
```

### Image Grid

```mdx
import ImageGrid from "@/components/blog/ImageGrid.astro";

<ImageGrid columns={3} gap="md" caption="Project screenshots">
  ![Screenshot 1](/blog/content/screenshot-1.jpg) ![Screenshot
  2](/blog/content/screenshot-2.jpg) ![Screenshot
  3](/blog/content/screenshot-3.jpg)
</ImageGrid>
```

### Tabs

```mdx
import {
  CodeTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/blog/BlogTabs.tsx";

<CodeTabs defaultValue="bun">
  <TabsList>
    <TabsTrigger value="bun">Bun</TabsTrigger>
    <TabsTrigger value="astro">Astro</TabsTrigger>
  </TabsList>
  <TabsContent value="bun">

Run `bun run dev`.

  </TabsContent>
  <TabsContent value="astro">

Run `astro dev`.

  </TabsContent>
</CodeTabs>
```

### YouTube

```mdx
import YouTubeEmbed from "@/components/blog/YouTubeEmbed.astro";

<YouTubeEmbed videoId="dQw4w9WgXcQ" title="Tutorial video" />
```

### Tweet

```mdx
import Tweet from "@/components/blog/Tweet.astro";

<Tweet tweetId="123456789" />
```

## Images

Cover images:

- Recommended size: 1200 x 630
- Location for local static files: `public/blog/covers/`
- Frontmatter path: `/blog/covers/<slug>.jpg`

Content images:

- Recommended width: 800-1200px
- Location: `public/blog/content/`
- Markdown path: `/blog/content/<image>.jpg`

Author images:

- Recommended size: 400 x 400
- Location: `public/authors/`
- Frontmatter path: `/authors/<author>.jpg`

Images are served from local sources (`public/` for static files and `src/assets/` for imported assets). See [ASSETS.md](./ASSETS.md).

## SEO Checklist

- Title is specific and under roughly 60 characters.
- Description explains the article clearly.
- `created_at` and `modified_at` are accurate.
- Cover image is present for important posts.
- Tags are consistent with existing posts.
- Headings follow a logical `h2`/`h3` hierarchy.
- Code blocks include a language.
- Images have meaningful alt text.

## Publishing Checklist

- Content reviewed for accuracy.
- Links and code examples tested.
- Both desktop and mobile layout checked.
- `bun run typecheck` passes.
- `bun run build` passes.
- Production posts have `draft: false`.

## Automatic Features

- Reading time is calculated from entry body text.
- Related posts are scored by shared tags, category, and recency.
- Table of contents is generated from headings returned by `render(entry)`.
- RSS feeds are generated for English and Indonesian routes.
- Open Graph and Twitter metadata are generated from frontmatter.
