import { memo } from "react";
import { PromptCard } from "@/components/PromptCard";
import type { Prompt } from "@/types/prompt";

interface PromptGridProps {
  prompts: Prompt[];
  starred: Set<string>;
  onToggleStar: (id: string) => void;
  onOpen: (prompt: Prompt) => void;
}

export const PromptGrid = memo(function PromptGrid({ prompts, starred, onToggleStar, onOpen }: PromptGridProps) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4 opacity-20">◈</div>
        <p className="text-muted-foreground text-sm">No prompts match your filters.</p>
        <p className="text-muted-foreground/60 text-xs mt-1">Try adjusting your search or clearing filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          isStarred={starred.has(prompt.id)}
          onToggleStar={onToggleStar}
          onClick={onOpen}
        />
      ))}
    </div>
  );
});
