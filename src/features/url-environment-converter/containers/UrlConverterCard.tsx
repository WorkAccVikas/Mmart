import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUrlEnvironmentConverter } from "../hooks/useUrlEnvironmentConverter";
import { useConverterFormState } from "../hooks/useConverterFormState";
import { ModeToggle } from "../components/ModeToggle";
import { CopyableUrlField } from "./CopyableUrlField";
import { ConverterOptionsForm } from "../forms/ConverterOptionsForm";
import { ResultPanel } from "../components/ResultPanel";
import { useState } from "react";
import { Settings2 } from "lucide-react";
import { QueryParamsDialog } from "./QueryParamsDialog";
import type { TQueryParams } from "../types/conversion.types";

/**
 * Composition root for the URL environment converter.
 * Form state lives in useConverterFormState, conversion logic lives in
 * useUrlEnvironmentConverter — this component just wires the two together
 * and lays out the pieces.
 */
export function UrlConverterCard() {
  const { toLocalhost, toRemote, result, error, handleChangeQueryParams } =
    useUrlEnvironmentConverter();
  const form = useConverterFormState();

  const [isQueryParamsDialogOpen, setIsQueryParamsDialogOpen] = useState(false);

  const hasQueryParams = Boolean(
    result && Object.keys(result.queryParams).length > 0,
  );

  function handleConvert() {
    if (form.mode === "toLocalhost") {
      toLocalhost({
        url: form.url,
        port: form.port,
        base: form.base,
        basePathIncluded: form.basePathIncluded,
        secondBasePath: form.secondBasePath,
      });
    } else {
      toRemote({
        url: form.url,
        domain: form.domain,
        base: form.base,
        basePathIncluded: form.basePathIncluded,
        secondBasePath: form.secondBasePath,
      });
    }
  }

  function OnConfirm(params: TQueryParams) {
    handleChangeQueryParams(params);
    setIsQueryParamsDialogOpen(false);
  }

  return (
    <Card className="mx-auto w-full max-w-xl border-border/60 shadow-sm">
      <CardHeader className="gap-1.5">
        <CardTitle className="text-[clamp(1.125rem,1rem+0.6vw,1.375rem)] font-semibold tracking-tight">
          URL environment converter
        </CardTitle>
        <CardDescription className="text-[0.8125rem] sm:text-sm">
          Swap a URL between your local dev server and the deployed domain.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <ModeToggle mode={form.mode} onChange={form.setMode} />

        <CopyableUrlField
          id="source-url"
          label={
            form.mode === "toLocalhost"
              ? "Source URL (https)"
              : "Source URL (localhost)"
          }
          value={form.url}
          onChange={form.setUrl}
          placeholder="https://abc.com/motor/quotes"
        />

        <ConverterOptionsForm
          mode={form.mode}
          base={form.base}
          onBaseChange={form.setBase}
          port={form.port}
          onPortChange={form.setPort}
          domain={form.domain}
          onDomainChange={form.setDomain}
          basePathIncluded={form.basePathIncluded}
          onBasePathIncludedChange={form.setBasePathIncluded}
          secondBasePath={form.secondBasePath}
          onSecondBasePathChange={form.setSecondBasePath}
        />

        {/* <Button
          type="button"
          onClick={handleConvert}
          className="h-10 w-full bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Convert
        </Button> */}

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleConvert}
            className="h-10 flex-1 bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Convert
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0"
            disabled={!hasQueryParams}
            onClick={() => setIsQueryParamsDialogOpen(true)}
            aria-label="Edit query params"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>

        {(result || error) && (
          <>
            <Separator />
            <ResultPanel result={result} error={error} />
          </>
        )}

        <QueryParamsDialog
          open={isQueryParamsDialogOpen}
          onOpenChange={setIsQueryParamsDialogOpen}
          queryParams={result?.queryParams ?? {}}
          onConfirm={OnConfirm}
        />
      </CardContent>
    </Card>
  );
}
