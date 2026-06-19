import type { TResolvedTheme, TTheme } from "./types";
import { DARK_MEDIA_QUERY } from "./constants";

export function getSystemTheme(): TResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia(DARK_MEDIA_QUERY).matches ? "dark" : "light";
}

export function resolveTheme(theme: TTheme): TResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

export function applyTheme(theme: TTheme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;

  const actualTheme = resolveTheme(theme);

  root.classList.remove("light", "dark");
  root.classList.add(actualTheme);

  root.style.colorScheme = actualTheme;
}

export function isValidTheme(value: string | null): value is TTheme {
  return value === "light" || value === "dark" || value === "system";
}
