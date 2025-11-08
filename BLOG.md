# Blog Writing Guide

Complete guide for writing and publishing blog posts on astro-rio.

## Table of Contents

- [Quick Start](#quick-start)
- [Blog Post Structure](#blog-post-structure)
- [Frontmatter Configuration](#frontmatter-configuration)
- [MDX Components](#mdx-components)
- [Code Snippets](#code-snippets)
- [Images and Media](#images-and-media)
- [SEO Best Practices](#seo-best-practices)
- [Publishing Checklist](#publishing-checklist)

## Quick Start

### Creating a New Blog Post

1. Navigate to the appropriate content directory:

   - English: `src/content/blog-en/`
   - Indonesian: `src/content/blog-id/`

2. Create a new `.mdx` file under a category folder:

   ```
   src/content/blog-en/tutorial/my-awesome-post.mdx
   ```

3. Add the required frontmatter (see below)

4. Write your content using Markdown and MDX components

5. Save and test locally with `npm run dev`

## Blog Post Structure

### File Organization

```
src/content/
├── blog-en/              # English posts
│   ├── tutorial/         # Category: Tutorials
│   │   └── post.mdx
│   ├── webdev/           # Category: Web Development
│   │   └── post.mdx
│   └── programming/      # Category: Programming
│       └── post.mdx
└── blog-id/              # Indonesian posts
    ├── tutorial/
    ├── webdev/
    └── programming/
```

### Frontmatter Configuration

Every blog post must include frontmatter at the top:

```yaml
---
title: "Your Awesome Blog Post Title"
description: "A compelling 150-160 character description for SEO and social sharing"
created_at: 2025-01-15
modified_at: 2025-01-15
image: "/blog/covers/my-post-cover.jpg" # Optional, but highly recommended
category: "tutorial" # Must match folder name
tags: ["astro", "typescript", "webdev"] # Array of relevant tags
author:
  name: "Rio Bahtiar"
  image: "/authors/rio.jpg"
  bio: "Full-stack Developer"
---
```

#### Frontmatter Fields

| Field         | Required | Type   | Description                               |
| ------------- | -------- | ------ | ----------------------------------------- |
| `title`       | ✅       | string | Post title (50-60 chars recommended)      |
| `description` | ✅       | string | Meta description (150-160 chars)          |
| `created_at`  | ✅       | Date   | Publication date (YYYY-MM-DD)             |
| `modified_at` | ✅       | Date   | Last update date                          |
| `image`       | ⚠️       | string | Cover image path (1200x630px recommended) |
| `category`    | ✅       | string | Category folder name                      |
| `tags`        | ✅       | array  | 3-5 relevant tags                         |
| `author`      | ✅       | object | Author information                        |

## MDX Components

### Callout Boxes

Display important information, warnings, tips, etc.

```mdx
import Callout from "@/components/blog/Callout.astro";

<Callout type="info" title="Did you know?">
  This is an informational callout.
</Callout>

<Callout type="warning">This is a warning without a custom title.</Callout>

<Callout type="error" title="Error!">
  Something went wrong!
</Callout>

<Callout type="success">Great job! You did it correctly.</Callout>

<Callout type="tip" title="Pro Tip">
  Here's a helpful tip to improve your workflow.
</Callout>
```

**Types**: `info`, `warning`, `error`, `success`, `tip`

### Banners

Eye-catching announcement or promotional sections.

```mdx
import Banner from "@/components/blog/Banner.astro";

<Banner type="default" icon="tabler:rocket">
  **New Feature Alert!** Check out our latest update.
</Banner>

<Banner type="gradient" dismissible>
  This banner can be dismissed by the user.
</Banner>

<Banner type="bordered">Simple bordered banner for announcements.</Banner>
```

**Types**: `default`, `gradient`, `bordered`
**Props**: `icon`, `dismissible`

### Call-to-Action (CTA)

Convert readers with compelling CTAs.

```mdx
import CTA from "@/components/blog/CTA.astro";

<CTA
  title="Ready to learn more?"
  description="Check out our comprehensive course on Astro development."
  buttonText="Enroll Now"
  buttonLink="/courses/astro"
  variant="primary"
  icon="tabler:school"
  align="center"
/>
```

**Variants**: `primary`, `secondary`, `accent`
**Align**: `left`, `center`, `right`

### Steps / Tutorials

Perfect for step-by-step guides.

```mdx
import Steps from "@/components/blog/Steps.astro";

<Steps>
<div class="step">
### Step 1: Install Dependencies

Run the following command:
\`\`\`bash
npm install
\`\`\`

</div>

<div class="step">
### Step 2: Configure Settings

Update your configuration file...

</div>

<div class="step">
### Step 3: Run the Application

Start the dev server with \`npm run dev\`

</div>
</Steps>
```

**Variants**: `default`, `horizontal`

### Quote Blocks

Beautiful quotes with attribution.

```mdx
import Quote from "@/components/blog/Quote.astro";

<Quote
  author="Linus Torvalds"
  role="Creator of Linux"
  avatar="/authors/linus.jpg"
>
  Talk is cheap. Show me the code.
</Quote>
```

### Accordions

Collapsible content sections.

```mdx
import Accordion from "@/components/blog/Accordion.astro";

<Accordion title="What is Astro?" open>
  Astro is a modern static site generator that allows you to build faster
  websites with less client-side JavaScript.
</Accordion>

<Accordion title="How do I get started?">
  Simply install Astro with \`npm create astro@latest\`
</Accordion>
```

### Image Grid

Multi-image layouts.

```mdx
import ImageGrid from "@/components/blog/ImageGrid.astro";

<ImageGrid columns={3} gap="md" caption="Project Screenshots">
  ![Screenshot 1](/blog/images/screen1.jpg) ![Screenshot
  2](/blog/images/screen2.jpg) ![Screenshot 3](/blog/images/screen3.jpg)
</ImageGrid>
```

**Columns**: `2`, `3`, `4`
**Gap**: `sm`, `md`, `lg`

### Tabs

Organize content in tabs.

```mdx
import {
  CodeTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/blog/BlogTabs.tsx";

<CodeTabs defaultValue="js">
  <TabsList>
    <TabsTrigger value="js">JavaScript</TabsTrigger>
    <TabsTrigger value="ts">TypeScript</TabsTrigger>
  </TabsList>
  <TabsContent value="js">
    \`\`\`javascript const greeting = "Hello, World!"; \`\`\`
  </TabsContent>
  <TabsContent value="ts">
    \`\`\`typescript const greeting: string = "Hello, World!"; \`\`\`
  </TabsContent>
</CodeTabs>
```

### YouTube Embed

Embed YouTube videos.

```mdx
import YouTubeEmbed from "@/components/blog/YouTubeEmbed.astro";

<YouTubeEmbed videoId="dQw4w9WgXcQ" title="My Tutorial Video" />
```

### Tweet Embed

Embed tweets.

```mdx
import Tweet from "@/components/blog/Tweet.astro";

<Tweet tweetId="123456789" />
```

## Code Snippets

### Syntax Highlighting

Code blocks are automatically highlighted with Shiki.

\`\`\`typescript
// TypeScript example
interface User {
name: string;
age: number;
}

const user: User = {
name: "Rio",
age: 25
};
\`\`\`

### Supported Languages

- JavaScript / TypeScript
- Python
- Rust
- Go
- HTML / CSS
- Bash / Shell
- And many more!

### Inline Code

Use backticks for inline code: \`const foo = "bar"\`

## Images and Media

### Cover Images

**Recommended size**: 1200 x 630 pixels
**Format**: JPG or PNG
**Location**: `/public/blog/covers/`

```yaml
image: "/blog/covers/my-post.jpg"
```

### Content Images

Place images in `/public/blog/images/`:

```markdown
![Alt text](/blog/images/diagram.png)
```

### Author Images

**Recommended size**: 400 x 400 pixels
**Format**: JPG or PNG
**Location**: `/public/authors/`

```yaml
author:
  image: "/authors/rio.jpg"
```

See [ASSETS.md](./ASSETS.md) for complete asset management guide.

## SEO Best Practices

### Title Optimization

- Keep titles under 60 characters
- Include primary keyword near the beginning
- Make it compelling and click-worthy
- Use title case

**Good**: "Building Fast Websites with Astro 5 - Complete Guide"
**Bad**: "astro tutorial"

### Description Optimization

- 150-160 characters for optimal display
- Include primary and secondary keywords naturally
- Write for humans, not search engines
- Include a call-to-action

**Good**: "Learn how to build lightning-fast websites with Astro 5. This comprehensive guide covers installation, configuration, and best practices. Start building today!"

### Tags

- Use 3-5 relevant tags
- Mix broad and specific tags
- Use lowercase, kebab-case
- Be consistent across posts

**Good**: `["astro", "webdev", "performance", "ssg"]`
**Bad**: `["Astro", "WebDev", "web dev", "Website Development"]`

### URL Structure

URLs are automatically generated from:

- Category (folder name)
- Filename

Example: `tutorial/my-awesome-post.mdx` → `/blog/tutorial/my-awesome-post`

Keep filenames:

- Short and descriptive
- Lowercase with hyphens
- Keyword-rich

## Publishing Checklist

Before publishing a blog post:

- [ ] **Content Quality**

  - [ ] No spelling or grammar errors
  - [ ] All links work correctly
  - [ ] Images load properly
  - [ ] Code examples are tested

- [ ] **Frontmatter**

  - [ ] Title is compelling and under 60 chars
  - [ ] Description is 150-160 chars
  - [ ] Dates are correct
  - [ ] Cover image is 1200x630px
  - [ ] Tags are relevant (3-5 tags)
  - [ ] Author info is complete

- [ ] **SEO**

  - [ ] Title includes primary keyword
  - [ ] Description includes keywords naturally
  - [ ] Cover image has descriptive filename
  - [ ] Alt text on all images

- [ ] **Content Structure**

  - [ ] Clear H2/H3 heading hierarchy
  - [ ] Table of contents will be auto-generated
  - [ ] Paragraphs are concise (3-5 sentences)
  - [ ] Code blocks have language specified

- [ ] **Local Testing**

  - [ ] Run `npm run dev`
  - [ ] View post at `http://localhost:4321/blog/[category]/[slug]`
  - [ ] Check reading time
  - [ ] Verify related posts
  - [ ] Test table of contents
  - [ ] Check mobile responsiveness

- [ ] **Build Test**
  - [ ] Run `npm run build`
  - [ ] No TypeScript errors
  - [ ] No build warnings
  - [ ] Preview with `npm run preview`

## Advanced Features

### Reading Time

Automatically calculated and displayed based on average reading speed (200 words/minute).

### Related Posts

Automatically shown at the bottom of each post based on:

- Shared tags
- Same category
- Recent publication date

### Table of Contents

Auto-generated from H2 and H3 headings with:

- Smooth scroll navigation
- Active section highlighting (scroll spy)
- Sticky sidebar on desktop

### RSS Feed

Automatically generated at:

- English: `/rss.xml`
- Indonesian: `/id/rss.xml`

### Social Sharing

OpenGraph and Twitter Card meta tags automatically generated for:

- Rich previews on social media
- Proper article attribution
- Cover image display

## Examples

Check these example posts:

- English: `src/content/blog-en/tutorial/example.mdx`
- Indonesian: `src/content/blog-id/tutorial/example.mdx`

## Need Help?

- Read [CLAUDE.md](./CLAUDE.md) for development guidelines
- Check [ASSETS.md](./ASSETS.md) for asset management
- Review existing posts for examples
- Run `npx astro check` for type errors

---

**Happy Writing! 🚀**
