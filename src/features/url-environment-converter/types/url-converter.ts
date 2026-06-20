export type ConversionMode = "toLocalhost" | "toRemote";

export interface ConversionResult {
  url: string;
  basePath: string;
  pathParams: Record<string, string>;
  queryParams: Record<string, string>;
  warning?: string;
}

export interface IConversionError {
  message: string;
}

export interface IToLocalhostInput {
  url: string;
  port: string;
  base: string;
  basePathIncluded: boolean;
  secondBasePath: string;
}

export interface IToRemoteInput {
  url: string;
  domain: string;
  base: string;
  basePathIncluded: boolean;
  secondBasePath: string;
}

export interface IConverterFormValues {
  mode: ConversionMode;
  url: string;
  base: string;
  port: string;
  domain: string;
  basePathIncluded: boolean;
  secondBasePath: string;
}

export type TProtocol = "http" | "https";
