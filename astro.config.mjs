// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://prompts.tseku.dev",
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },
  adapter: cloudflare(),
  experimental: {
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: "JetBrains Mono",
        cssVariable: "--font-jetbrains",
      },
    ],
  },
});
