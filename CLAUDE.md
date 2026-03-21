# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
pnpm dev        # Start dev server at localhost:4321
pnpm build      # Build production site to ./dist/
pnpm preview    # Preview production build locally
pnpm astro check  # Type-check .astro files
```

No test runner or linter is configured yet.

## Architecture

Astro 6 project deployed on Cloudflare via `@astrojs/cloudflare` adapter. Package manager: pnpm.

- `src/pages/` — File-based routing. Each `.astro` file becomes a route. API routes go in `src/pages/api/`.
- `src/layouts/` — Shared HTML shell components (e.g. `Layout.astro` provides `<html>`, `<head>`, `<body>`).
- `src/components/` — Reusable UI components included in pages.
- `src/content/prompts/` — Content Collection: individual `.md` files with YAML frontmatter (title, description, category, variables) and prompt text as the body.
- `src/content.config.ts` — Content Collection schema definition using Zod.
- `src/assets/` — Static assets imported directly in `.astro` files (processed by Astro's asset pipeline).
- `public/` — Static files served as-is (not processed).
- `scripts/` — CLI utilities (e.g. `add-prompt.sh`).

TypeScript is configured in strict mode via `tsconfig.json` extending `astro/tsconfigs/strict`. Path alias `@/*` maps to `src/*`.

## Integrations & UI Stack

- **React** — via `@astrojs/react`. Use `.tsx` for interactive components.
- **Tailwind CSS v4** — loaded as a Vite plugin (`@tailwindcss/vite`). No `tailwind.config.*` file; configuration lives in `src/styles/global.css` via `@theme inline`.
- **shadcn/ui** — component library. Add components with `pnpm dlx shadcn add <component>`. Components land in `src/components/ui/`.
- **Icons** — `lucide-react` and `@hugeicons/react` are both available.
- **Font** — JetBrains Mono via Astro's built-in font provider (`fontProviders.fontsource()`), set as `--font-jetbrains` in the theme.

`src/styles/global.css` is the single CSS entry point, imported by `Layout.astro`. It imports Tailwind, `tw-animate-css`, shadcn's base styles, and the font, and defines the full design token set (CSS custom properties for light/dark themes).

## Content Collections

Prompts are stored as individual markdown files in `src/content/prompts/`. Schema is defined in `src/content.config.ts` using the Content Layer API (`glob` loader + Zod).

- Add a new prompt: `pnpm add-prompt` (interactive CLI)
- Query prompts server-side: `getCollection("prompts")` / `getEntry("prompts", id)` from `astro:content`
- Prompt bodies are lazy-loaded via `/api/prompts/[id]` to keep the client bundle small
