import type { TQueryParams } from "../types/conversion.types";

export function applyQueryParams(url: string, params: TQueryParams): string {
  try {
    const parsed = new URL(url);

    parsed.search = "";

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          parsed.searchParams.append(key, item);
        });
      } else {
        parsed.searchParams.set(key, value);
      }
    });

    return parsed.toString();
  } catch {
    return url;
  }
}
