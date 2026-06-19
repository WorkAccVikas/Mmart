import { UrlConversionError } from '../types/conversion-errors';
import type {
  IConversionResult,
  IToLocalhostOptions,
} from '../types/conversion.types';
import { buildPathname } from '../utils/build-pathname';
import { parseQueryParams } from '../utils/parse-query-params';
import { parseSourceUrl } from '../utils/parse-source-url';
import { resolveBasePath } from '../utils/resolve-base-path';
import { isValidPort } from '../utils/validate-port';

/** https://domain.com/base/rest?q=1  ->  http://localhost:PORT/base/rest?q=1 */
export function convertToLocalhost({
  url,
  port,
  base,
  basePathIncluded = true,
  secondBasePath,
}: IToLocalhostOptions): IConversionResult {
  if (!isValidPort(port)) {
    throw new UrlConversionError(
      `Invalid port: "${port}". Must be an integer between 1 and 65535.`,
      'INVALID_PORT',
    );
  }

  const { parsed, originalBasePath, remainingSegments } = parseSourceUrl(
    url,
    'https',
  );

  const { basePath, warning } = resolveBasePath({
    originalBasePath,
    basePathIncluded,
    secondBasePath,
    expectedBase: base,
  });

  const pathname = buildPathname(basePath, remainingSegments);
  const queryParams = parseQueryParams(parsed.searchParams);

  return {
    url: `http://localhost:${port}${pathname}${parsed.search}${parsed.hash}`,
    protocol: 'http',
    host: `localhost:${port}`,
    port: Number(port),
    basePath,
    originalBasePath,
    pathParams: remainingSegments,
    queryParams,
    hash: parsed.hash || '',
    warning,
  };
}
