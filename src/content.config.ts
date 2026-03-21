import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const prompts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/prompts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    variables: z
      .array(
        z.object({
          name: z.string(),
          label: z.string(),
          placeholder: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

export const collections = { prompts };
