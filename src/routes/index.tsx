import { Route, Routes } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { lazy } from 'react';

// const HorseA = lazy(() => import('@/features/horse/pages/HorseA.page'));
const Temp = lazy(() => import('@/temp'));
const UrlEnvironmentConverterPage = lazy(
  () =>
    import('@/features/url-environment-converter/pages/url-environment-converter.page'),
);

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* <Route index element={<HorseA />} /> */}
        <Route index element={<UrlEnvironmentConverterPage />} />

        <Route path="temp" element={<Temp />} />

        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
