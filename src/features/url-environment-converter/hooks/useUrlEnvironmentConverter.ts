import { useCallback, useState } from 'react';
import type { UrlConversionError } from '../types/conversion-errors';
import type {
  IConversionResult,
  IToLocalhostOptions,
  IToRemoteOptions,
} from '../types/conversion.types';
import { convertToLocalhost } from '../services/convert-to-localhost';
import { convertToRemote } from '../services/convert-to-remote';

export interface IUseUrlEnvironmentConverter {
  toLocalhost: (options: IToLocalhostOptions) => IConversionResult | null;
  toRemote: (options: IToRemoteOptions) => IConversionResult | null;
  result: IConversionResult | null;
  error: UrlConversionError | Error | null;
  reset: () => void;
}

export function useUrlEnvironmentConverter(): IUseUrlEnvironmentConverter {
  const [result, setResult] = useState<IConversionResult | null>(null);
  const [error, setError] = useState<UrlConversionError | Error | null>(null);

  const run = useCallback(
    <T>(
      fn: (opts: T) => IConversionResult,
      options: T,
    ): IConversionResult | null => {
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
    (options: IToLocalhostOptions) => run(convertToLocalhost, options),
    [run],
  );
  const toRemote = useCallback(
    (options: IToRemoteOptions) => run(convertToRemote, options),
    [run],
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { toLocalhost, toRemote, result, error, reset };
}
