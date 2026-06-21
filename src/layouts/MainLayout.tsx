import StickyTop from '@/features/shared/components/sticky/StickyTop';
import ThemeToggle from '@/features/shared/providers/theme/components/ThemeToggle';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <>
      <div className="flex min-h-dvh flex-col">
        {/* Header */}
        <StickyTop>
          <ThemeToggle />
          {/* Header */}
        </StickyTop>

        {/* Main */}
        <main className="flex-1 p-4 grid">
          <Outlet />
        </main>

        {/* Footer */}
        {/* <StickyBottom>
            <ThemeToggle />
          </StickyBottom> */}
      </div>
    </>
  );
}
