import HorseA from "./features/horse/pages/HorseA.page";
import StickyBottom from "./features/shared/components/sticky/StickyBottom";
import StickyTop from "./features/shared/components/sticky/StickyTop";
import ThemeToggle from "./features/shared/providers/theme/components/ThemeToggle";
import { ThemeProvider } from "./features/shared/providers/theme/ThemeProvider";

function App() {
  return (
    <>
      <ThemeProvider>
        <div className="flex min-h-dvh flex-col">
          {/* Header */}
          <StickyTop>
            <ThemeToggle />
            {/* Header */}
          </StickyTop>

          {/* Main */}
          <main className="flex-1 p-4">
            <HorseA />
          </main>

          {/* Footer */}
          {/* <StickyBottom>
            <ThemeToggle />
          </StickyBottom> */}
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
