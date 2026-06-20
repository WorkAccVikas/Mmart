import { useEffect, useState } from "react";
import type {
  ConversionMode,
  IConverterFormValues,
} from "../types/url-converter";

const DEFAULT_URL_BY_MODE: Record<ConversionMode, string> = {
  toLocalhost: "https://abc.com/motor/quotes?enquire=13&token=sses",
  toRemote: "http://localhost:5173/motor/quotes?enquire=13&token=sses",
};

export const DEFAULT_CONVERTER_FORM_VALUES = {
  mode: "toLocalhost",
  url: DEFAULT_URL_BY_MODE.toLocalhost,
  base: "motor",
  port: "5173",
  domain: "abc.com",
  basePathIncluded: true,
  secondBasePath: "flw",
} as const satisfies IConverterFormValues;

export const EMPTY_CONVERTER_FORM_VALUES = {
  mode: "toLocalhost",
  url: "",
  base: "",
  port: "",
  domain: "",
  basePathIncluded: true,
  secondBasePath: "",
} as const satisfies IConverterFormValues;

const isDev = !import.meta.env.DEV;

const CONVERTER_FORM_VALUES = isDev
  ? DEFAULT_CONVERTER_FORM_VALUES
  : EMPTY_CONVERTER_FORM_VALUES;

/**
 * Owns the form's local UI state (mode + every field). Resets the URL
 * to a sensible sample whenever the direction changes. Deliberately knows
 * nothing about the conversion logic itself — that stays in
 * useUrlEnvironmentConverter.
 */
export function useConverterFormState() {
  const [mode, setMode] = useState<ConversionMode>(CONVERTER_FORM_VALUES.mode);
  const [url, setUrl] = useState(CONVERTER_FORM_VALUES.url);
  const [base, setBase] = useState(CONVERTER_FORM_VALUES.base);
  const [port, setPort] = useState(CONVERTER_FORM_VALUES.port);
  const [domain, setDomain] = useState(CONVERTER_FORM_VALUES.domain);
  const [basePathIncluded, setBasePathIncluded] = useState(
    CONVERTER_FORM_VALUES.basePathIncluded,
  );
  const [secondBasePath, setSecondBasePath] = useState(
    CONVERTER_FORM_VALUES.secondBasePath,
  );

  useEffect(() => {
    setUrl(CONVERTER_FORM_VALUES.url);
  }, [mode]);

  return {
    mode,
    setMode,
    url,
    setUrl,
    base,
    setBase,
    port,
    setPort,
    domain,
    setDomain,
    basePathIncluded,
    setBasePathIncluded,
    secondBasePath,
    setSecondBasePath,
  };
}
