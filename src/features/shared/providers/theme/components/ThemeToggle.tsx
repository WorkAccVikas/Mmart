import { Button } from "@/components/ui/button";
import { useTheme } from "../useTheme";
import { Moon, Sun } from "lucide-react";

function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  const ThemeIcon = resolvedTheme === "dark" ? Sun : Moon;

  return (
    <div className="flex gap-2 justify-end py-2">
      {/* <Button onClick={toggleTheme}>Toggle ({resolvedTheme})</Button> */}
      <Button onClick={toggleTheme} size="icon">
        <ThemeIcon className="size-4" />
      </Button>

      {/* <Button variant="outline" onClick={() => setTheme("light")}>
        Light
      </Button>

      <Button variant="outline" onClick={() => setTheme("dark")}>
        Dark
      </Button>

      <Button variant="outline" onClick={() => setTheme("system")}>
        System
      </Button>

      <span>{theme}</span> */}
    </div>
  );
}

export default ThemeToggle;
