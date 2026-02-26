import { memo } from "react";
import { Star, Copy, Check } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCopy } from "@/hooks/useCopy";
import type { Prompt } from "@/types/prompt";

interface PromptCardProps {
  prompt: Prompt;
  isStarred: boolean;
  onToggleStar: (id: string) => void;
  onClick: (prompt: Prompt) => void;
}

export const PromptCard = memo(function PromptCard({
  prompt,
  isStarred,
  onToggleStar,
  onClick,
}: PromptCardProps) {
  const { copied, copy } = useCopy();

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    await copy(prompt.prompt);
  }

  return (
    <Card>
      <CardHeader className="">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="text-xs mb-2">
              {prompt.category}
            </Badge>
            <h3 className="font-semibold text-foreground text-base leading-snug">
              {prompt.title}
            </h3>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(prompt.id);
            }}
            className={cn(
              "p-1.5 rounded-md transition-colors shrink-0",
              isStarred
                ? "text-foreground"
                : "text-muted-foreground/40 hover:text-muted-foreground",
            )}
            aria-label={isStarred ? "Unstar prompt" : "Star prompt"}
          >
            <Star
              className="size-4"
              fill={isStarred ? "currentColor" : "none"}
              strokeWidth={isStarred ? 0 : 1.5}
            />
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {prompt.description}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="gap-2 transition-colors"
          onClick={handleCopy}
        >
          <span className="relative size-4 shrink-0">
            <Copy
              className={cn(
                "absolute inset-0 size-4 transition-all duration-200",
                copied ? "opacity-0 scale-75" : "opacity-100 scale-100",
              )}
            />
            <Check
              className={cn(
                "absolute inset-0 size-4 transition-all duration-200",
                copied ? "opacity-100 scale-100" : "opacity-0 scale-75",
              )}
            />
          </span>
        </Button>
        <Button className="flex-1" onClick={() => onClick(prompt)}>
          Use
        </Button>
      </CardFooter>
    </Card>
  );
});
