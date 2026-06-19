import { useCallback, useState } from 'react';

/* ----------------------------------------------------------------------- *
 * useUrlEnvironmentConverter
 * ----------------------------------------------------------------------- *
 * Converts URLs between a production/remote origin (https://domain.com)
 * and a local dev origin (http://localhost:PORT), remapping the first
 * path segment ("base path") if needed, and returning parsed path + query
 * params alongside the rebuilt URL.
 *
 *   toLocalhost({ url, port, base, basePathIncluded, secondBasePath })
 *   toRemote({ url, domain, protocol, base, basePathIncluded, secondBasePath })
 *
 * basePathIncluded:
 *   true  -> keep whatever the first path segment of the source URL is
 *   false -> replace the first path segment with `secondBasePath`
 *            (secondBasePath becomes required in this case)
 * ----------------------------------------------------------------------- */

export type ConversionErrorCode =
  | 'MISSING_URL'
  | 'INVALID_URL'
  | 'INVALID_PORT'
  | 'MISSING_DOMAIN'
  | 'INVALID_PROTOCOL'
  | 'MISSING_SECOND_BASE_PATH';

export class UrlConversionError extends Error {
  code: ConversionErrorCode;

  constructor(message: string, code: ConversionErrorCode) {
    super(message);
    this.name = 'UrlConversionError';
    this.code = code;
  }
}

export type QueryParams = Record<string, string | string[]>;

export interface ConversionResult {
  /** Fully rebuilt URL string */
  url: string;
  protocol: 'http' | 'https';
  /** host[:port] */
  host: string;
  /** Present only for toLocalhost results */
  port?: number;
  /** The base path actually used in the output URL */
  basePath: string;
  /** The first path segment found on the *source* URL, before remapping */
  originalBasePath: string;
  /** Remaining path segments after the base path */
  pathParams: string[];
  queryParams: QueryParams;
  hash: string;
  /** Non-fatal notice, e.g. an `expectedBase` mismatch */
  warning: string | null;
}

interface BasePathOptions {
  base?: string;
  basePathIncluded?: boolean;
  secondBasePath?: string;
}

export interface ToLocalhostOptions extends BasePathOptions {
  /** Source URL, e.g. https://abc.com/motor/quotes?enquire=13 */
  url: string;
  /** Localhost port (required) */
  port: number | string;
}

export interface ToRemoteOptions extends BasePathOptions {
  /** Source URL, e.g. http://localhost:5173/motor/quotes?enquire=13 */
  url: string;
  /** Target domain, no protocol, e.g. "abc.com" */
  domain: string;
  /** Defaults to "https" */
  protocol?: 'http' | 'https';
}

/* ----------------------------- helpers ---------------------------------- */

const sanitizeSegment = (segment: string = ''): string =>
  String(segment)
    .trim()
    .replace(/^\/+|\/+$/g, '');

const isValidPort = (port: number | string): boolean => {
  const n = Number(port);
  return Number.isInteger(n) && n > 0 && n <= 65535;
};

const splitPath = (pathname: string = ''): string[] =>
  pathname.split('/').filter(Boolean);

/** Turns URLSearchParams into a plain object, preserving repeated keys as arrays */
const parseQueryParams = (searchParams: URLSearchParams): QueryParams => {
  const result: QueryParams = {};
  for (const key of searchParams.keys()) {
    if (key in result) continue; // already collected via getAll
    const values = searchParams.getAll(key);
    result[key] = values.length > 1 ? values : values[0];
  }
  return result;
};

/** Accepts URLs that are missing a protocol (e.g. "abc.com/path") or protocol-relative ("//abc.com/path") */
const ensureProtocol = (
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

const sanitizeDomain = (domain: string = ''): string =>
  String(domain)
    .trim()
    .replace(/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//, '') // strip any accidental protocol
    .replace(/\/+$/, ''); // strip trailing slash

interface ParsedSource {
  parsed: URL;
  originalBasePath: string;
  remainingSegments: string[];
}

const parseSourceUrl = (
  rawUrl: string,
  fallbackProtocol: 'http' | 'https',
): ParsedSource => {
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

interface ResolveBasePathArgs {
  originalBasePath: string;
  basePathIncluded: boolean;
  secondBasePath?: string;
  expectedBase?: string;
}

interface ResolvedBasePath {
  basePath: string;
  warning: string | null;
}

/**
 * Decides the final base path to use, given the basePathIncluded flag.
 * Never throws for a mismatched `expectedBase` — that's surfaced as a
 * non-fatal warning since the actual URL is the source of truth.
 */
const resolveBasePath = ({
  originalBasePath,
  basePathIncluded,
  secondBasePath,
  expectedBase,
}: ResolveBasePathArgs): ResolvedBasePath => {
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

const buildPathname = (
  basePath: string,
  remainingSegments: string[],
): string => {
  const segments = [basePath, ...remainingSegments].filter(Boolean);
  return segments.length ? `/${segments.join('/')}` : '/';
};

/* --------------------------- core converters ----------------------------- */

/** https://domain.com/base/rest?q=1  ->  http://localhost:PORT/base/rest?q=1 */
function convertToLocalhost({
  url,
  port,
  base,
  basePathIncluded = true,
  secondBasePath,
}: ToLocalhostOptions): ConversionResult {
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

/** http://localhost:PORT/base/rest?q=1  ->  https://domain.com/base/rest?q=1 */
function convertToRemote({
  url,
  domain,
  protocol = 'https',
  base,
  basePathIncluded = true,
  secondBasePath,
}: ToRemoteOptions): ConversionResult {
  const cleanDomain = sanitizeDomain(domain);
  if (!cleanDomain) {
    throw new UrlConversionError(
      'domain is required, e.g. "abc.com" (no protocol).',
      'MISSING_DOMAIN',
    );
  }
  if (!/^https?$/.test(protocol)) {
    throw new UrlConversionError(
      `Invalid protocol: "${protocol}". Use "http" or "https".`,
      'INVALID_PROTOCOL',
    );
  }

  const { parsed, originalBasePath, remainingSegments } = parseSourceUrl(
    url,
    'http',
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
    hash: parsed.hash || '',
    warning,
  };
}

/* --------------------------------- hook ---------------------------------- */

export interface UseUrlEnvironmentConverter {
  toLocalhost: (options: ToLocalhostOptions) => ConversionResult | null;
  toRemote: (options: ToRemoteOptions) => ConversionResult | null;
  result: ConversionResult | null;
  error: UrlConversionError | Error | null;
  reset: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUrlEnvironmentConverter(): UseUrlEnvironmentConverter {
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<UrlConversionError | Error | null>(null);

  const run = useCallback(
    <T,>(
      fn: (opts: T) => ConversionResult,
      options: T,
    ): ConversionResult | null => {
      try {
        const data = fn(options);
        setResult(data);
        setError(null);
        return data;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setResult(null);
        return null;
      }
    },
    [],
  );

  const toLocalhost = useCallback(
    (options: ToLocalhostOptions) => run(convertToLocalhost, options),
    [run],
  );
  const toRemote = useCallback(
    (options: ToRemoteOptions) => run(convertToRemote, options),
    [run],
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { toLocalhost, toRemote, result, error, reset };
}

/* ------------------------------ demo (UI) -------------------------------- */
/* Quick interactive demo. Remove this section if you only need the hook. */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-600">
      <span className="font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  'rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400';

type DemoMode = 'toLocalhost' | 'toRemote';

function Page() {
  const { toLocalhost, toRemote, result, error } = useUrlEnvironmentConverter();
  const [mode, setMode] = useState<DemoMode>('toLocalhost');

  const [url, setUrl] = useState(
    'https://abc.com/motor/quotes?enquire=13&token=sses',
  );
  const [base, setBase] = useState('motor');
  const [port, setPort] = useState('5173');
  const [domain, setDomain] = useState('abc.com');
  const [basePathIncluded, setBasePathIncluded] = useState(true);
  const [secondBasePath, setSecondBasePath] = useState('flw');

  const handleConvert = () => {
    if (mode === 'toLocalhost') {
      toLocalhost({ url, port, base, basePathIncluded, secondBasePath });
    } else {
      toRemote({ url, domain, base, basePathIncluded, secondBasePath });
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('toLocalhost')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
            mode === 'toLocalhost'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          https → localhost
        </button>
        <button
          type="button"
          onClick={() => setMode('toRemote')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
            mode === 'toRemote'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          localhost → https
        </button>
      </div>

      <Field
        label={
          mode === 'toLocalhost'
            ? 'Source URL (https)'
            : 'Source URL (localhost)'
        }
      >
        <input
          className={inputClass}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Base (expected, optional)">
          <input
            className={inputClass}
            value={base}
            onChange={(e) => setBase(e.target.value)}
          />
        </Field>

        {mode === 'toLocalhost' ? (
          <Field label="Port (required)">
            <input
              className={inputClass}
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
          </Field>
        ) : (
          <Field label="Domain (required, no protocol)">
            <input
              className={inputClass}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </Field>
        )}
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={basePathIncluded}
            onChange={(e) => setBasePathIncluded(e.target.checked)}
          />
          Base path included
        </label>
        {!basePathIncluded && (
          <input
            className={`${inputClass} flex-1`}
            placeholder="2nd base path"
            value={secondBasePath}
            onChange={(e) => setSecondBasePath(e.target.value)}
          />
        )}
      </div>

      <button
        type="button"
        onClick={handleConvert}
        className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
      >
        Convert
      </button>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error.message}
        </p>
      )}

      {result && (
        <div className="space-y-2 rounded-md bg-slate-50 p-3 text-sm">
          <div>
            <span className="font-medium text-slate-700">Output URL: </span>
            <span className="break-all text-slate-900">{result.url}</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">Base path: </span>
            {result.basePath || '(none)'}
          </div>
          <div>
            <span className="font-medium text-slate-700">Path params: </span>
            {JSON.stringify(result.pathParams)}
          </div>
          <div>
            <span className="font-medium text-slate-700">Query params: </span>
            {JSON.stringify(result.queryParams)}
          </div>
          {result.warning && (
            <div className="text-amber-700">{result.warning}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Page;
