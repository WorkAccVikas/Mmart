import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./features/shared/providers/theme/ThemeProvider";
import AppRoutes from "./routes";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  return (
    <>
      <ThemeProvider>
        <TooltipProvider delayDuration={150}>
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
