import { useState, useMemo, useCallback } from "react";
import { prompts as allPrompts } from "@/data/prompts";
import { filterPrompts } from "@/lib/search";
import { useStarred } from "@/hooks/useStarred";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { PromptGrid } from "@/components/PromptGrid";
import { PromptModal } from "@/components/PromptModal";
import type { Prompt } from "@/types/prompt";

export function PromptHub() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [starredOnly, setStarredOnly] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const { starred, toggleStarred } = useStarred();

  const handleStarredToggle = useCallback(() => setStarredOnly((v) => !v), []);
  const handleCloseModal = useCallback(() => setSelectedPrompt(null), []);

  const categories = useMemo(
    () => [...new Set(allPrompts.map((p) => p.category))].sort(),
    [],
  );

  const filtered = useMemo(
    () =>
      filterPrompts(allPrompts, {
        query,
        activeCategory,
        starredOnly,
        starred,
      }),
    [query, activeCategory, starredOnly, starred],
  );

  return (
    <div className="min-h-[calc(100vh-68px)] bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between flex-col md:flex-row gap-4">
          <span className="font-bold text-lg tracking-tight">Prompt Hub</span>
          <div className="w-full max-w-sm">
            <SearchBar value={query} onChange={setQuery} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <FilterBar
          categories={categories}
          activeCategory={activeCategory}
          starredOnly={starredOnly}
          onCategoryChange={setActiveCategory}
          onStarredToggle={handleStarredToggle}
        />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filtered.length === allPrompts.length
              ? `${allPrompts.length} prompts`
              : `${filtered.length} of ${allPrompts.length} prompts`}
          </p>
          {(query || activeCategory || starredOnly) && (
            <button
              onClick={() => {
                setQuery("");
                setActiveCategory(null);
                setStarredOnly(false);
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        <PromptGrid
          prompts={filtered}
          starred={starred}
          onToggleStar={toggleStarred}
          onOpen={setSelectedPrompt}
        />
      </main>

      <PromptModal
        prompt={selectedPrompt}
        isStarred={selectedPrompt ? starred.has(selectedPrompt.id) : false}
        onToggleStar={toggleStarred}
        onClose={handleCloseModal}
      />
    </div>
  );
}
