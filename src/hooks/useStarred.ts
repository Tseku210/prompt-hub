import { useState, useCallback } from "react";

const STORAGE_KEY = "prompt-hub:starred";

function loadStarred(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveStarred(ids: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function useStarred() {
  const [starred, setStarred] = useState<Set<string>>(() => loadStarred());

  const toggleStarred = useCallback((id: string) => {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveStarred(next);
      return next;
    });
  }, []);

  return { starred, toggleStarred };
}
