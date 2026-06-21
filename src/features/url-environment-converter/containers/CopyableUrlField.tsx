import { type ChangeEvent } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AppInput } from '@/components/form/ui/input/AppInput';
import { useClipboard } from '@/features/shared/hooks/useClipboard/useClipboard';

function isOpenableUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

interface CopyableUrlFieldProps {
  id: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * A labeled URL input with copy-to-clipboard and open-in-new-tab affordances.
 * Works for both editable source URLs and read-only output URLs.
 */
export function CopyableUrlField({
  id,
  label,
  value,
  onChange,
  readOnly = false,
  placeholder,
  className,
}: CopyableUrlFieldProps) {
  const { isCopied, copy } = useClipboard();
  const canOpen = isOpenableUrl(value);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event.target.value.toLowerCase());
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label
        htmlFor={id}
        className="text-[0.8125rem] font-medium text-muted-foreground"
      >
        {label}
      </Label>

      <div className="relative">
        <AppInput
          id={id}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={onChange ? handleChange : undefined}
          spellCheck={false}
          className={cn(
            'h-10 truncate pr-[5.25rem] font-mono text-[0.8125rem] sm:text-sm',
            readOnly && 'bg-muted/40',
          )}
        />

        <div className="absolute inset-y-0 right-1.5 flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => copy(value)}
                disabled={!value}
                aria-label="Copy URL"
              >
                {isCopied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {isCopied ? 'Copied' : 'Copy URL'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() =>
                  window.open(value, '_blank', 'noopener,noreferrer')
                }
                disabled={!canOpen}
                aria-label="Open URL in new tab"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Open in new tab</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
