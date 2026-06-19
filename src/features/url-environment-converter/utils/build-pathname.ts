export const buildPathname = (
  basePath: string,
  remainingSegments: string[],
): string => {
  const segments = [basePath, ...remainingSegments].filter(Boolean);
  return segments.length ? `/${segments.join('/')}` : '/';
};
