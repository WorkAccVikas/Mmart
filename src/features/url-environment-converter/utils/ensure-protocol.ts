import { UrlConversionError } from '../types/conversion-errors';

/** Accepts URLs that are missing a protocol (e.g. "abc.com/path") or protocol-relative ("//abc.com/path") */
export const ensureProtocol = (
  rawUrl: string,
  fallbackProtocol: 'http' | 'https',
): string => {
  const trimmed = String(rawUrl ?? '').trim();
  if (!trimmed) {
    throw new UrlConversionError('A source URL is required.', 'MISSING_URL');
  }
  if (trimmed.startsWith('//')) return `${fallbackProtocol}:${trimmed}`;
  if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)) {
    return `${fallbackProtocol}://${trimmed}`;
  }
  return trimmed;
};
