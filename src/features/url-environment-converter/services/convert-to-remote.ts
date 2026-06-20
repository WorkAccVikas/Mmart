import { UrlConversionError } from "../types/conversion-errors";
import type {
  IConversionResult,
  IToRemoteOptions,
} from "../types/conversion.types";
import { buildPathname } from "../utils/build-pathname";
import { hasValidProtocol } from "../utils/has-valid-protocol";
import { parseQueryParams } from "../utils/parse-query-params";
import { parseSourceUrl } from "../utils/parse-source-url";
import { resolveBasePath } from "../utils/resolve-base-path";

/** http://localhost:PORT/base/rest?q=1  ->  https://domain.com/base/rest?q=1 */
export function convertToRemote({
  url,
  domain,
  protocol = "https",
  base,
  basePathIncluded = true,
  secondBasePath,
}: IToRemoteOptions): IConversionResult {
  const cleanDomain = sanitizeDomain(domain);
  if (!cleanDomain) {
    throw new UrlConversionError(
      'domain is required, e.g. "abc.com" (no protocol).',
      "MISSING_DOMAIN",
    );
  }
  if (!hasValidProtocol(url, "http")) {
    throw new UrlConversionError(
      `Invalid Protocol: You must use http.`,
      "WRONG_PROTOCOL",
    );
  }

  const { parsed, originalBasePath, remainingSegments } = parseSourceUrl(
    url,
    "http",
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
    url: `${protocol}://${cleanDomain}${pathname}${parsed.search}${parsed.hash}`,
    protocol,
    host: cleanDomain,
    basePath,
    originalBasePath,
    pathParams: remainingSegments,
    queryParams,
    hash: parsed.hash || "",
    warning,
  };
}

const sanitizeDomain = (domain: string = ""): string =>
  String(domain)
    .trim()
    .replace(/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//, "") // strip any accidental protocol
    .replace(/\/+$/, ""); // strip trailing slash
