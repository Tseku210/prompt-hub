import { memo } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  categories: string[];
  activeCategory: string | null;
  starredOnly: boolean;
  onCategoryChange: (cat: string | null) => void;
  onStarredToggle: () => void;
}

export const FilterBar = memo(function FilterBar({
  categories,
  activeCategory,
  starredOnly,
  onCategoryChange,
  onStarredToggle,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mr-1">
        Category
      </span>
      <button
        onClick={() => onCategoryChange(null)}
        className={cn(
          "px-3 py-1 rounded-full text-xs font-medium transition-colors border",
          activeCategory === null
            ? "bg-primary text-primary-foreground border-primary"
            : "border-border text-muted-foreground hover:text-foreground hover:border-input"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(activeCategory === cat ? null : cat)}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium transition-colors border",
            activeCategory === cat
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:text-foreground hover:border-input"
          )}
        >
          {cat}
        </button>
      ))}
      <button
        onClick={onStarredToggle}
        className={cn(
          "ml-auto px-3 py-1 rounded-full text-xs font-medium transition-colors border flex items-center gap-1.5",
          starredOnly
            ? "bg-primary text-primary-foreground border-primary"
            : "border-border text-muted-foreground hover:text-foreground hover:border-input"
        )}
      >
        <Star className="size-3" fill={starredOnly ? "currentColor" : "none"} />
        Starred
      </button>
    </div>
  );
});
