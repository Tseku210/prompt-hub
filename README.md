# Prompt Hub

A personal library for browsing, searching, and starring AI prompts. Built with Astro and deployed to Cloudflare. This project is built mostly by Sonnet 4.6 model. Also, one of the many experimental projects that I'm building to learn Claude Code.

## Features

- **Search** — fuzzy search across all prompts via Fuse.js
- **Filter by category** — narrow prompts by tag
- **Star prompts** — bookmark favorites, persisted in localStorage
- **Modal view** — expand a prompt to read and copy the full text

## Stack

- [Astro 5](https://astro.build) — static site framework with file-based routing
- [React 19](https://react.dev) — interactive island components
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling
- [shadcn/ui](https://ui.shadcn.com) — accessible UI primitives
- [Fuse.js](https://fusejs.io) — client-side fuzzy search
- [Cloudflare Workers](https://workers.cloudflare.com) — edge deployment

## Getting Started

```sh
pnpm install
pnpm dev        # http://localhost:4321
```

## Commands

```sh
pnpm build        # Build to ./dist/
pnpm preview      # Preview production build locally
pnpm astro check  # TypeScript check for .astro files
pnpm deploy       # Build + deploy to Cloudflare Workers
```

## Adding Prompts

Prompts live in `src/data/prompts.ts`. Each entry follows the `Prompt` type defined in `src/types/prompt.ts`.
