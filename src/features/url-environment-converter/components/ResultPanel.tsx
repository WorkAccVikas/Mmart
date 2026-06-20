import { AlertTriangle, CircleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { IConversionError } from "../types/url-converter";
import { CopyableUrlField } from "../containers/CopyableUrlField";
import type { IConversionResult } from "../types/conversion.types";

interface ResultPanelProps {
  result: IConversionResult | null;
  error: IConversionError | null;
}

function ParamList({
  params,
}: {
  params: IConversionResult["queryParams"] | IConversionResult["pathParams"];
}) {
  const entries = Object.entries(params);

  if (entries.length === 0) {
    return <span className="text-sm text-muted-foreground/70">None</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {entries.map(([key, value]) => (
        <Badge
          key={key}
          variant="secondary"
          className="rounded-md font-mono text-[0.75rem] font-normal"
        >
          {key}
          <span className="text-muted-foreground">=</span>
          {value}
        </Badge>
      ))}
    </div>
  );
}

/**
 * Renders either the conversion error, or the successful result:
 * output URL, base path and both param groups.
 */
export function ResultPanel({ result, error }: ResultPanelProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <CircleAlert className="h-4 w-4" />
        <AlertTitle>Conversion failed</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!result) return null;

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-muted/30 p-4">
      <CopyableUrlField
        id="result-url"
        label="Output URL"
        value={result.url}
        readOnly
      />

      <Separator />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="text-[0.8125rem] font-medium text-muted-foreground">
            Base path
          </span>
          <span className="font-mono text-sm">
            {result.basePath || "(none)"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[0.8125rem] font-medium text-muted-foreground">
            Path params
          </span>
          <ParamList params={result.pathParams} />
        </div>
        <div className="col-span-full flex flex-col gap-1">
          <span className="text-[0.8125rem] font-medium text-muted-foreground">
            Query params
          </span>
          <ParamList params={result.queryParams} />
        </div>
      </div>

      {result.warning && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{result.warning}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
