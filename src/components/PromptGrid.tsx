import { memo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PromptCard } from "@/components/PromptCard";
import type { Prompt } from "@/types/prompt";

interface PromptGridProps {
  prompts: Prompt[];
  starred: Set<string>;
  onToggleStar: (id: string) => void;
  onOpen: (prompt: Prompt) => void;
}

export const PromptGrid = memo(function PromptGrid({
  prompts,
  starred,
  onToggleStar,
  onOpen,
}: PromptGridProps) {
  if (prompts.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-24 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-5xl mb-4 opacity-20">◈</div>
        <p className="text-muted-foreground text-sm">
          No prompts match your filters.
        </p>
        <p className="text-muted-foreground/60 text-xs mt-1">
          Try adjusting your search or clearing filters.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence mode="popLayout">
        {prompts.map((prompt) => (
          <motion.div
            key={prompt.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <PromptCard
              prompt={prompt}
              isStarred={starred.has(prompt.id)}
              onToggleStar={onToggleStar}
              onClick={onOpen}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});
