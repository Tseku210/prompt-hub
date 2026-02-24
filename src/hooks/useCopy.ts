import { useState, useCallback } from "react";
import { copyToClipboard } from "@/lib/utils";

export function useCopy(duration = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      await copyToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), duration);
    },
    [duration],
  );

  return { copied, copy };
}
