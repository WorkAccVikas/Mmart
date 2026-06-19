import type { TQueryParams } from '../types/conversion.types';

/** Turns URLSearchParams into a plain object, preserving repeated keys as arrays */
export const parseQueryParams = (
  searchParams: URLSearchParams,
): TQueryParams => {
  const result: TQueryParams = {};
  for (const key of searchParams.keys()) {
    if (key in result) continue; // already collected via getAll
    const values = searchParams.getAll(key);
    result[key] = values.length > 1 ? values : values[0];
  }
  return result;
};
