import { UrlConversionError } from '../types/conversion-errors';
import type {
  IResolveBasePathArgs,
  IResolvedBasePath,
} from '../types/conversion.types';
import { sanitizeSegment } from './sanitize-segment';

/**
 * Decides the final base path to use, given the basePathIncluded flag.
 * Never throws for a mismatched `expectedBase` — that's surfaced as a
 * non-fatal warning since the actual URL is the source of truth.
 */
export const resolveBasePath = ({
  originalBasePath,
  basePathIncluded,
  secondBasePath,
  expectedBase,
}: IResolveBasePathArgs): IResolvedBasePath => {
  if (basePathIncluded) {
    const cleanExpected = sanitizeSegment(expectedBase);
    const warning =
      cleanExpected &&
      originalBasePath &&
      cleanExpected.toLowerCase() !== originalBasePath.toLowerCase()
        ? `Expected base "${cleanExpected}" but the URL's first path segment is "${originalBasePath}". Using "${originalBasePath}".`
        : null;
    return { basePath: originalBasePath, warning };
  }

  const cleanSecond = sanitizeSegment(secondBasePath);
  if (!cleanSecond) {
    throw new UrlConversionError(
      'secondBasePath is required when basePathIncluded is false.',
      'MISSING_SECOND_BASE_PATH',
    );
  }
  return { basePath: cleanSecond, warning: null };
};
