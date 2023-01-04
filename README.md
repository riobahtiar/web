# Rio Web Workspace

Public repos for my sites. This project uses [TURBOREPO](https://turborepo.org) as monorepo build system and [pnpm](https://pnpm.io) as a package manager. It includes the following packages/apps:

### Apps and Packages

- `@apps/astro-riomyid`: My Personal Blog build using [Astro.js](https://astro.build/)
- `@apps/nuxt3-links`: LinkTree Style Web Apps using [Nuxt.js 3](https://v3.nuxtjs.org/)
- `@apps/next-pesantren`: Web Directory for Pesantren In Indonesia using [Next.js](https://nextjs.org)
- `@packages/react/ui`: a stub React component library shared by both `@apps/astro-blog` and `@apps/next-explore` applications
- `@packages/vue@3/ui`: a stub Vue 3 component library shared to `@apps/next3-links` applications
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This repo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Install

To install all depedency, run the following command:
```
pnpm install
```

### Build

To build all apps and packages, run the following command:

```
pnpm run build
```

### Develop

To develop all apps and packages, run the following command:

```
pnpm run dev
```

###
Thank you

[Rio Bahtiar](https://rio.my.id?ref=github-web-repo/)
