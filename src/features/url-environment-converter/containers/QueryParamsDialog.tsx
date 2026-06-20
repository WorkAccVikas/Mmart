import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { TQueryParams } from "../types/conversion.types";

interface QueryParamRow {
  id: string;
  key: string;
  value: string;
}

function toRows(params: TQueryParams): QueryParamRow[] {
  return Object.entries(params).map(([key, value], index) => ({
    id: `${index}-${key}`,
    key,
    value: Array.isArray(value) ? value.join(",") : value,
  }));
}

function createRowId(): string {
  return Math.random().toString(36).slice(2);
}

interface QueryParamsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queryParams: TQueryParams;
  //   onConfirm: (params: TQueryParams) => void;
  onConfirm: (params: TQueryParams) => void;
}

/**
 * CRUD list scoped to the query params on the current result: add, edit,
 * remove rows, then Confirm hands the final map back to the caller.
 */
export function QueryParamsDialog({
  open,
  onOpenChange,
  queryParams,
  onConfirm,
}: QueryParamsDialogProps) {
  const [rows, setRows] = useState<QueryParamRow[]>(() => toRows(queryParams));

  // Re-sync rows from the latest queryParams every time the dialog opens.
  useEffect(() => {
    if (open) setRows(toRows(queryParams));
  }, [open, queryParams]);

  function addRow() {
    setRows((prev) => [...prev, { id: createRowId(), key: "", value: "" }]);
  }

  function updateRow(id: string, field: "key" | "value", value: string) {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  function handleConfirm() {
    const params = rows.reduce<TQueryParams>((acc, row) => {
      const key = row.key.trim();
      if (key) acc[key] = row.value;
      return acc;
    }, {});
    onConfirm(params);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit query params</DialogTitle>
          <DialogDescription>
            Add, edit, or remove params, then confirm to apply them to the
            output URL.
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-72 flex-col gap-2 overflow-y-auto py-1">
          {rows.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No query params yet.
            </p>
          )}

          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-2">
              <Input
                value={row.key}
                onChange={(e) => updateRow(row.id, "key", e.target.value)}
                placeholder="key"
                className="h-9 flex-1 font-mono text-sm"
              />
              <Input
                value={row.value}
                onChange={(e) => updateRow(row.id, "value", e.target.value)}
                placeholder="value"
                className="h-9 flex-1 font-mono text-sm"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeRow(row.id)}
                aria-label="Remove param"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          className="w-fit"
        >
          <Plus className="h-3.5 w-3.5" />
          Add param
        </Button>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
