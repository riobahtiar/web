# Contributing

This repository is Bun-first and deploys to Cloudflare Workers. Keep code, docs, and CI aligned with that stack.

## Setup

Prerequisites:

- Bun 1.3.11 or newer
- Node.js 22.x or newer
- Git

```bash
git clone https://github.com/riobahtiar/web.git
cd web
bun install
bun run dev
```

## Development Workflow

1. Create a focused branch.
2. Inspect existing patterns before editing.
3. Make the smallest coherent change.
4. Update docs when behavior, commands, config, routes, content schema, or deployment changes.
5. Validate locally before opening a PR.

```bash
bun run typecheck
bun run format:check
bun run build
```

For deployment-related changes, also run:

```bash
bun audit --audit-level high
bun run build
```

## Code Guidelines

- Follow [CLAUDE.md](./CLAUDE.md); it is the canonical developer and AI-agent guide.
- Use TypeScript strict mode and avoid `any`.
- Use `import type` for type-only imports.
- Prefer internal aliases such as `@/components`, `@/utils`, and `@/lib`.
- Preserve Astro SSR patterns for dynamic routes.
- Use `entry.id` and `render(entry)` for Astro 6 content entries.
- Keep i18n text in `src/i18n/en.ts` and `src/i18n/id.ts` when shared UI copy is involved.
- Preserve the existing Tailwind CSS 4 and DaisyUI token system in `src/assets/global.css`.

## Package Management

- Use Bun commands.
- Commit `bun.lock`.
- Do not add `package-lock.json`.
- Use `bun install --frozen-lockfile` in clean environments.

## Commit Messages

Use Conventional Commits:

```text
feat(blog): add related post scoring
fix(rss): use Astro 6 entry ids
docs: sync deployment guide with wrangler jsonc
chore(ci): migrate workflows to bun
```

Common types:

- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation only
- `style`: formatting only
- `refactor`: internal change without behavior change
- `perf`: performance improvement
- `test`: tests or validation updates
- `chore`: maintenance

## Pull Request Requirements

- `bun run typecheck` passes.
- `bun run format:check` passes or formatting changes are included.
- `bun run build` passes for normal changes.
- `bun run build` passes for deployment, adapter, or config changes.
- Docs are updated for changed commands, config, content schema, routes, or deployment behavior.
- Both English and Indonesian routes are considered for user-facing changes.
- No secrets or credentials are committed.

## Internationalization

When adding user-facing copy:

- Add English text to `src/i18n/en.ts`.
- Add Indonesian text to `src/i18n/id.ts`.
- Keep both objects structurally aligned.
- Avoid hard-coded shared UI strings unless the component is locale-specific.

Route conventions:

- English: `/about`, `/services`, `/contact`, `/blog/...`
- Indonesian: `/id/about`, `/id/services`, `/id/contact`, `/id/blog/...`

## Blog Content

Blog files live in locale-specific folders:

- `src/content/blog-en/<category>/<slug>.mdx`
- `src/content/blog-id/<category>/<slug>.mdx`

Content schema is defined in `src/content.config.ts`. If frontmatter changes, update [BLOG.md](./BLOG.md), examples, and any route logic that depends on the schema.

## Documentation

Update docs when changing:

- Bun/package scripts or lockfile behavior
- Astro, React, Tailwind, DaisyUI, Cloudflare, or Wrangler setup
- `wrangler.jsonc` bindings or compatibility flags
- `src/content.config.ts` schema/loaders
- Blog route structure or i18n route structure
- CI workflows

Primary docs:

- [README.md](./README.md): overview and quick start
- [CLAUDE.md](./CLAUDE.md): developer and AI-agent rules
- [DEPLOYMENT.md](./DEPLOYMENT.md): Cloudflare deployment
- [BLOG.md](./BLOG.md): content authoring
- [ASSETS.md](./ASSETS.md): static/blog asset conventions

## Security

- Never commit API keys, Cloudflare tokens, or account IDs that are not already intentional resource IDs.
- Store deploy credentials as GitHub Actions secrets or local environment variables.
- Run `bun audit --audit-level high` before deployment changes.
- Report security issues privately rather than through public issues.
