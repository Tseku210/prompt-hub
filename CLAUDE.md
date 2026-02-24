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

Astro 5 project using the default "basics" template. Package manager: pnpm.

- `src/pages/` — File-based routing. Each `.astro` file becomes a route.
- `src/layouts/` — Shared HTML shell components (e.g. `Layout.astro` provides `<html>`, `<head>`, `<body>`).
- `src/components/` — Reusable UI components included in pages.
- `src/assets/` — Static assets imported directly in `.astro` files (processed by Astro's asset pipeline).
- `public/` — Static files served as-is (not processed).

TypeScript is configured in strict mode via `tsconfig.json` extending `astro/tsconfigs/strict`. Path alias `@/*` maps to `src/*`.

## Integrations & UI Stack

- **React** — via `@astrojs/react`. Use `.tsx` for interactive components.
- **Tailwind CSS v4** — loaded as a Vite plugin (`@tailwindcss/vite`). No `tailwind.config.*` file; configuration lives in `src/styles/global.css` via `@theme inline`.
- **shadcn/ui** — component library. Add components with `pnpm dlx shadcn add <component>`. Components land in `src/components/ui/`.
- **Icons** — `lucide-react` and `@hugeicons/react` are both available.
- **Font** — Raleway variable font (`@fontsource-variable/raleway`), set as `--font-sans` in the theme.

`src/styles/global.css` is the single CSS entry point, imported by `Layout.astro`. It imports Tailwind, `tw-animate-css`, shadcn's base styles, and the font, and defines the full design token set (CSS custom properties for light/dark themes).
