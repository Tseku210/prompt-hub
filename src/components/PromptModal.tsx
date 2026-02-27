import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Copy, Check, Star, X, RotateCcw } from "lucide-react";
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

  function handleReset() {
    if (!prompt) return;
    const initial: Record<string, string> = {};
    for (const v of prompt.variables) {
      initial[v.name] = "";
    }
    setValues(initial);
  }

  const hasValues = Object.values(values).some((v) => v.length > 0);

  function getFilledPrompt() {
    if (!prompt) return "";
    return fillTemplate(prompt.prompt, values);
  }

  function openInProvider(baseUrl: string) {
    const text = getFilledPrompt();
    window.open(`${baseUrl}${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <Dialog open={!!prompt} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[90vh] flex flex-col gap-0 p-0"
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
                <p className="text-xs text-muted-foreground mt-1">
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
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => openInProvider("https://chatgpt.com/?prompt=")}
                title="Open in ChatGPT"
                className="size-9"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
                </svg>
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => openInProvider("https://claude.ai/new?q=")}
                title="Open in Claude"
                className="size-9"
              >
                <svg
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
                </svg>
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
                className="size-9 transition-colors relative"
                title="Copy to clipboard"
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
              <div></div>
              <Button
                size="icon"
                variant="outline"
                onClick={handleReset}
                className="size-9"
                title="Reset variables"
                disabled={!hasValues}
              >
                <RotateCcw className="size-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <pre className="text-xs font-mono text-foreground whitespace-pre-wrap wrap-break-word leading-relaxed">
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
