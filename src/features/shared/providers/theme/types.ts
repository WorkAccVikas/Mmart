export type TTheme = "light" | "dark" | "system";

export type TResolvedTheme = Exclude<TTheme, "system">;

export interface IThemeContextType {
  theme: TTheme;
  resolvedTheme: TResolvedTheme;
  setTheme: (theme: TTheme) => void;
  toggleTheme: () => void;
}
