import { useEffect, useState } from 'react';
import type {
  ConversionMode,
  IConverterFormValues,
} from '../types/url-converter';
import { useSyncedRef } from '@/features/shared/hooks/useSyncedRef/useSyncedRef';

export const DEFAULT_URL_BY_MODE: Record<ConversionMode, string> = {
  toLocalhost: 'https://abc.com/motor/quotes?enquire=13&token=sses',
  toRemote: 'http://localhost:5173/motor/quotes?enquire=13&token=sses',
};

export const DEFAULT_CONVERTER_FORM_VALUES = {
  mode: 'toLocalhost',
  url: DEFAULT_URL_BY_MODE.toLocalhost,
  base: 'motor',
  port: '5173',
  domain: 'abc.com',
  basePathIncluded: true,
  secondBasePath: 'flw',
} as const satisfies IConverterFormValues;

export const EMPTY_CONVERTER_FORM_VALUES = {
  mode: 'toLocalhost',
  url: '',
  base: '',
  port: '',
  domain: '',
  basePathIncluded: true,
  secondBasePath: '',
} as const satisfies IConverterFormValues;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const isDev = import.meta.env.DEV;

// const CONVERTER_FORM_VALUES = isDev
//   ? DEFAULT_CONVERTER_FORM_VALUES
//   : EMPTY_CONVERTER_FORM_VALUES;

const CONVERTER_FORM_VALUES = EMPTY_CONVERTER_FORM_VALUES;

/**
 * Owns the form's local UI state (mode + every field). Resets the URL
 * to a sensible sample whenever the direction changes. Deliberately knows
 * nothing about the conversion logic itself — that stays in
 * useUrlEnvironmentConverter.
 */
export function useConverterFormState(onModeChange: () => void) {
  const onModeChangeRef = useSyncedRef(onModeChange);

  const [mode, setMode] = useState<ConversionMode>(CONVERTER_FORM_VALUES.mode);
  const [url, setUrl] = useState<string>(CONVERTER_FORM_VALUES.url);
  const [base, setBase] = useState<string>(CONVERTER_FORM_VALUES.base);
  const [port, setPort] = useState<string>(CONVERTER_FORM_VALUES.port);
  const [domain, setDomain] = useState<string>(CONVERTER_FORM_VALUES.domain);
  const [basePathIncluded, setBasePathIncluded] = useState<boolean>(
    CONVERTER_FORM_VALUES.basePathIncluded,
  );
  const [secondBasePath, setSecondBasePath] = useState<string>(
    CONVERTER_FORM_VALUES.secondBasePath,
  );

  useEffect(() => {
    setUrl(CONVERTER_FORM_VALUES.url);
    setBase(CONVERTER_FORM_VALUES.base);
    setPort(CONVERTER_FORM_VALUES.port);
    setDomain(CONVERTER_FORM_VALUES.domain);
    setBasePathIncluded(CONVERTER_FORM_VALUES.basePathIncluded);
    setSecondBasePath(CONVERTER_FORM_VALUES.secondBasePath);

    onModeChangeRef.current();
  }, [mode, onModeChangeRef]);

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
