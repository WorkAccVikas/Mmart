import type { TProtocol } from "./url-converter";

export type TQueryParams = Record<string, string | string[]>;

export interface IConversionResult {
  /** Fully rebuilt URL string */
  url: string;
  protocol: "http" | "https";
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
  queryParams: TQueryParams;
  hash: string;
  /** Non-fatal notice, e.g. an `expectedBase` mismatch */
  warning: string | null;
}

interface IBasePathOptions {
  base?: string;
  basePathIncluded?: boolean;
  secondBasePath?: string;
}

export interface IToLocalhostOptions extends IBasePathOptions {
  /** Source URL, e.g. https://abc.com/motor/quotes?enquire=13 */
  url: string;
  /** Localhost port (required) */
  port: number | string;
}

export interface IToRemoteOptions extends IBasePathOptions {
  /** Source URL, e.g. http://localhost:5173/motor/quotes?enquire=13 */
  url: string;
  /** Target domain, no protocol, e.g. "abc.com" */
  domain: string;
  /** Defaults to "https" */
  protocol?: TProtocol;
}

export interface IParsedSource {
  parsed: URL;
  originalBasePath: string;
  remainingSegments: string[];
}

export interface IResolveBasePathArgs {
  originalBasePath: string;
  basePathIncluded: boolean;
  secondBasePath?: string;
  expectedBase?: string;
}

export interface IResolvedBasePath {
  basePath: string;
  warning: string | null;
}
