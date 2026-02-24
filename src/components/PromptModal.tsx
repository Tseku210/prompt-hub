import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Copy, Check, Star, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCopy } from "@/hooks/useCopy";
import type { Prompt } from "@/types/prompt";

interface PromptModalProps {
  prompt: Prompt | null;
  isStarred: boolean;
  onToggleStar: (id: string) => void;
  onClose: () => void;
}

type Segment =
  | { type: "text"; value: string }
  | { type: "variable"; name: string };

function parseTemplate(template: string): Segment[] {
  const segments: Segment[] = [];
  const regex = /\{\{(\w+)\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        value: template.slice(lastIndex, match.index),
      });
    }
    segments.push({ type: "variable", name: match[1] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < template.length) {
    segments.push({ type: "text", value: template.slice(lastIndex) });
  }
  return segments;
}

function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => values[key] ?? `{{${key}}}`,
  );
}

interface VariableInputProps {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
}

const VariableInput = memo(function VariableInput({
  name,
  value,
  onChange,
}: VariableInputProps) {
  const placeholder = `{{${name}}}`;

  // Stable ref — runs once on mount to set initial height, never re-runs
  const refCallback = useCallback((el: HTMLTextAreaElement | null) => {
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  return (
    <textarea
      ref={refCallback}
      rows={1}
      value={value}
      onChange={(e) => {
        onChange(name, e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
      }}
      placeholder={placeholder}
      className="font-mono bg-transparent border-b border-muted-foreground outline-none focus:border-foreground text-foreground placeholder:text-muted-foreground/70 px-0 resize-none overflow-hidden inline-block"
      style={{
        width: `${Math.max(value.length, placeholder.length) + 1}ch`,
        maxWidth: "100%",
        verticalAlign: "baseline",
      }}
    />
  );
});

export function PromptModal({
  prompt,
  isStarred,
  onToggleStar,
  onClose,
}: PromptModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const { copied, copy } = useCopy();

  useEffect(() => {
    if (prompt) {
      const initial: Record<string, string> = {};
      for (const v of prompt.variables) {
        initial[v.name] = "";
      }
      setValues(initial);
    }
  }, [prompt?.id]);

  // Only re-parse when the prompt changes, not on every keystroke
  const segments = useMemo(
    () => (prompt ? parseTemplate(prompt.prompt) : []),
    [prompt?.id],
  );

  // Stable handler — setValues identity is guaranteed stable by React
  const handleVariableChange = useCallback((name: string, val: string) => {
    setValues((prev) => ({ ...prev, [name]: val }));
  }, []);

  // Lazy — only compute the filled string when the user actually copies
  async function handleCopy() {
    if (!prompt) return;
    await copy(fillTemplate(prompt.prompt, values));
  }

  return (
    <Dialog open={!!prompt} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[90vh] flex flex-col max-w-5xl w-full gap-0 p-0"
        showCloseButton={false}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {prompt && (
                <Badge variant="secondary" className="text-xs mb-2">
                  {prompt.category}
                </Badge>
              )}
              <DialogTitle className="text-xl font-semibold leading-snug">
                {prompt?.title}
              </DialogTitle>
              {prompt?.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {prompt.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {prompt && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleStar(prompt.id)}
                  className={cn(
                    "size-8",
                    isStarred ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <Star
                    className="size-4"
                    fill={isStarred ? "currentColor" : "none"}
                    strokeWidth={isStarred ? 0 : 1.5}
                  />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="size-8 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Preview
            </p>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={handleCopy}
              className="transition-colors relative"
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
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <pre className="text-sm font-mono text-foreground whitespace-pre-wrap wrap-break-word leading-relaxed">
              {segments.map((segment, i) => {
                if (segment.type === "text") {
                  return <span key={i}>{segment.value}</span>;
                }
                return (
                  <VariableInput
                    key={`${segment.name}-${i}`}
                    name={segment.name}
                    value={values[segment.name] ?? ""}
                    onChange={handleVariableChange}
                  />
                );
              })}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
