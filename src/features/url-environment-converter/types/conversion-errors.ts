import type { CONVERSION_ERROR_CODES } from '../constants/error-codes';

export type TConversionErrorCode =
  (typeof CONVERSION_ERROR_CODES)[keyof typeof CONVERSION_ERROR_CODES];

export class UrlConversionError extends Error {
  code: TConversionErrorCode;

  constructor(message: string, code: TConversionErrorCode) {
    super(message);
    this.name = 'UrlConversionError';
    this.code = code;
  }
}
