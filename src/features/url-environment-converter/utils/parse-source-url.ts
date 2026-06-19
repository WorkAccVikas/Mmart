import { UrlConversionError } from '../types/conversion-errors';
import type { IParsedSource } from '../types/conversion.types';
import { ensureProtocol } from './ensure-protocol';

export const parseSourceUrl = (
  rawUrl: string,
  fallbackProtocol: 'http' | 'https',
): IParsedSource => {
  let parsed: URL;
  try {
    parsed = new URL(ensureProtocol(rawUrl, fallbackProtocol));
  } catch {
    throw new UrlConversionError(`Invalid URL: "${rawUrl}".`, 'INVALID_URL');
  }
  const segments = splitPath(parsed.pathname);
  const [originalBasePath = '', ...remainingSegments] = segments;
  return { parsed, originalBasePath, remainingSegments };
};

const splitPath = (pathname: string = ''): string[] =>
  pathname.split('/').filter(Boolean);
