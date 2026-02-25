import { memo } from "react";
import { Star } from "lucide-react";
import { Toggle } from "./ui/toggle";

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
    <div className="flex flex-col justify-center items-center gap-2">
      <h2 className="text-sm text-muted-foreground">Categories</h2>
      <div className="flex flex-wrap gap-2 items-center">
        <Toggle
          size="lg"
          variant="outline"
          onPressedChange={() => onCategoryChange(null)}
          pressed={activeCategory === null}
        >
          All
        </Toggle>
        {categories.map((cat) => (
          <Toggle
            size="lg"
            variant="outline"
            key={cat}
            onPressedChange={() =>
              onCategoryChange(activeCategory === cat ? null : cat)
            }
            pressed={activeCategory === cat}
          >
            {cat}
          </Toggle>
        ))}
        <Toggle
          size="lg"
          variant="outline"
          onPressedChange={onStarredToggle}
          pressed={starredOnly}
        >
          <Star
            className="size-3"
            fill={starredOnly ? "currentColor" : "none"}
          />
          Starred
        </Toggle>
      </div>
    </div>
  );
});
