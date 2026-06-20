import { useCallback, useEffect, useRef, useState } from "react";

interface IUseClipboardResult {
  isCopied: boolean;
  copy: (text: string) => Promise<void>;
}

/**
 * Copies text to the clipboard and exposes a transient "copied" state
 * so callers can swap an icon/label without owning timer logic themselves.
 */
export function useClipboard(resetDelayMs = 1500): IUseClipboardResult {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(
    async (text: string) => {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsCopied(false), resetDelayMs);
      } catch {
        setIsCopied(false);
      }
    },
    [resetDelayMs],
  );

  return { isCopied, copy };
}
