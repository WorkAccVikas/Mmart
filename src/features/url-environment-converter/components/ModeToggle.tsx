import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ConversionMode } from "../types/url-converter";

interface ModeOption {
  value: ConversionMode;
  from: string;
  to: string;
}

const MODE_OPTIONS: ModeOption[] = [
  { value: "toLocalhost", from: "https", to: "localhost" },
  { value: "toRemote", from: "localhost", to: "https" },
];

interface ModeToggleProps {
  mode: ConversionMode;
  onChange: (mode: ConversionMode) => void;
}

/**
 * Segmented control for picking conversion direction. The arrow direction
 * is the single visual cue for "which way is this going", so it stays put
 * left-to-right and only the active segment changes weight.
 */
export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Conversion direction"
      className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1"
    >
      {MODE_OPTIONS.map((option) => {
        const isActive = option.value === mode;
        return (
          <button
            key={option.value}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[0.8125rem] font-medium transition-all sm:text-sm",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="truncate">{option.from}</span>
            <ArrowRight
              className={cn(
                "h-3.5 w-3.5 shrink-0 transition-colors",
                isActive ? "text-indigo-600" : "text-muted-foreground/60",
              )}
            />
            <span className="truncate">{option.to}</span>
          </button>
        );
      })}
    </div>
  );
}
