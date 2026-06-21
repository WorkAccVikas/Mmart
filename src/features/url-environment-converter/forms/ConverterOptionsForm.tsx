import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AppInput } from '@/components/form/ui/input/AppInput';
import type { ConversionMode } from '../types/url-converter';

interface ConverterOptionsFormProps {
  mode: ConversionMode;
  base: string;
  onBaseChange: (value: string) => void;
  port: string;
  onPortChange: (value: string) => void;
  domain: string;
  onDomainChange: (value: string) => void;
  basePathIncluded: boolean;
  onBasePathIncludedChange: (value: boolean) => void;
  secondBasePath: string;
  onSecondBasePathChange: (value: string) => void;
}

/**
 * Pure form layer for converter options. Holds no state of its own —
 * everything is lifted to the parent so this stays easy to test and reuse.
 */
export function ConverterOptionsForm({
  mode,
  base,
  onBaseChange,
  port,
  onPortChange,
  domain,
  onDomainChange,
  basePathIncluded,
  onBasePathIncludedChange,
  secondBasePath,
  onSecondBasePathChange,
}: ConverterOptionsFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="base"
            className="text-[0.8125rem] font-medium text-muted-foreground"
          >
            Base path{' '}
            <span className="text-muted-foreground/70">(optional)</span>
          </Label>
          <AppInput
            id="base"
            value={base}
            onChange={(e) => onBaseChange(e.target.value.toLowerCase())}
            placeholder="motor"
            className="h-10 font-mono text-sm"
          />
        </div>

        {mode === 'toLocalhost' ? (
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="port"
              className="text-[0.8125rem] font-medium text-muted-foreground"
            >
              Port <span className="text-muted-foreground/70">(required)</span>
            </Label>
            <AppInput
              id="port"
              value={port}
              onChange={(e) => onPortChange(e.target.value.toLowerCase())}
              placeholder="5173"
              inputMode="numeric"
              className="h-10 font-mono text-sm"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="domain"
              className="text-[0.8125rem] font-medium text-muted-foreground"
            >
              Domain{' '}
              <span className="text-muted-foreground/70">
                (required, no protocol)
              </span>
            </Label>
            <AppInput
              id="domain"
              value={domain}
              onChange={(e) => onDomainChange(e.target.value.toLowerCase())}
              placeholder="abc.com"
              className="h-10 font-mono text-sm"
            />
          </div>
        )}
      </div>

      {base && (
        <div className="flex flex-wrap items-center gap-3">
          <Label
            htmlFor="basePathIncluded"
            className="flex items-center gap-2 text-sm font-normal text-foreground"
          >
            <Checkbox
              id="basePathIncluded"
              checked={basePathIncluded}
              onCheckedChange={(checked) =>
                onBasePathIncludedChange(checked === true)
              }
            />
            Base path included
          </Label>

          {!basePathIncluded && (
            <AppInput
              value={secondBasePath}
              onChange={(e) =>
                onSecondBasePathChange(e.target.value.toLowerCase())
              }
              placeholder="2nd base path"
              className="h-9 min-w-[10rem] flex-1 font-mono text-sm"
            />
          )}
        </div>
      )}
    </div>
  );
}
