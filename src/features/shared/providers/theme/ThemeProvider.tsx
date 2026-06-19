import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ThemeContext } from "./ThemeContext";
import { DARK_MEDIA_QUERY, STORAGE_KEY } from "./constants";
import {
  applyTheme,
  getSystemTheme,
  isValidTheme,
  resolveTheme,
} from "./theme.utils";

import type { TResolvedTheme, TTheme } from "./types";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: TTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<TTheme>(defaultTheme);

  const [resolvedTheme, setResolvedTheme] = useState<TResolvedTheme>(() =>
    resolveTheme(defaultTheme),
  );

  const setTheme = useCallback((newTheme: TTheme) => {
    localStorage.setItem(STORAGE_KEY, newTheme);

    setThemeState(newTheme);
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY);

    if (isValidTheme(storedTheme)) {
      setThemeState(storedTheme);
    }
  }, []);

  useEffect(() => {
    const actualTheme = resolveTheme(theme);

    setResolvedTheme(actualTheme);

    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia(DARK_MEDIA_QUERY);

    const handleChange = () => {
      if (theme !== "system") {
        return;
      }

      const nextTheme = getSystemTheme();

      setResolvedTheme(nextTheme);

      applyTheme("system");
    };

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, [theme]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !isValidTheme(event.newValue)) {
        return;
      }

      setThemeState(event.newValue);
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const currentTheme = theme === "system" ? resolvedTheme : theme;

    setTheme(currentTheme === "dark" ? "light" : "dark");
  }, [theme, resolvedTheme, setTheme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
