import Fuse from "fuse.js";
import type { Prompt } from "@/types/prompt";

export interface Filters {
  query: string;
  activeCategory: string | null;
  starredOnly: boolean;
  starred: Set<string>;
}

export function filterPrompts(prompts: Prompt[], filters: Filters): Prompt[] {
  const { query, activeCategory, starredOnly, starred } = filters;

  let results = prompts;

  if (starredOnly) {
    results = results.filter((p) => starred.has(p.id));
  }

  if (activeCategory) {
    results = results.filter((p) => p.category === activeCategory);
  }

  if (query.trim()) {
    const fuse = new Fuse(results, {
      keys: [
        { name: "title", weight: 4 },
        { name: "description", weight: 2 },
        { name: "category", weight: 1 },
        { name: "prompt", weight: 1 },
      ],
      threshold: 0.4,
      includeScore: true,
    });
    results = fuse.search(query).map((r) => r.item);
  }

  return results;
}
