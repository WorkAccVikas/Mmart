export const sanitizeSegment = (segment: string = ''): string =>
  String(segment)
    .trim()
    .replace(/^\/+|\/+$/g, '');
